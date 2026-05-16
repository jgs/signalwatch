"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { Camera, ImageIcon } from "lucide-react";
import { appendDetectionFrame, analyzeTemporalDetections, type DetectionFrame } from "@/components/labs/inference/temporal-analysis";
import { DegradationControls, type DegradationState } from "@/components/labs/degradation/degradation-controls";
import { useCocoSsd, type Detection } from "@/components/labs/inference/use-coco-ssd";
import { ConfidenceRail } from "@/components/labs/telemetry/confidence-rail";
import { TemporalTrace } from "@/components/labs/telemetry/temporal-trace";
import { WebcamStatus, type WebcamState } from "@/components/labs/webcam/webcam-status";

const MAX_FRAME_WIDTH = 960;
const REALTIME_INFERENCE_INTERVAL = 820;

const initialDegradation: DegradationState = {
  blur: 0,
  brightness: 100,
  occlusion: 12,
  noise: 8,
  crop: 0,
  motionBlur: 0,
};

export function RealDetectionLab({ cvMessage }: { cvMessage?: string }) {
  const { state, error, detect } = useCocoSsd();
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baselineCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastInferenceRef = useRef(0);
  const inFlightRef = useRef(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "webcam">("upload");
  const [webcamState, setWebcamState] = useState<WebcamState>("idle");
  const [webcamMessage, setWebcamMessage] = useState<string | undefined>();
  const [degradation, setDegradation] = useState<DegradationState>(initialDegradation);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [baselineDetections, setBaselineDetections] = useState<Detection[]>([]);
  const [frames, setFrames] = useState<DetectionFrame[]>([]);
  const [running, setRunning] = useState(false);

  const inputIntegrity = useMemo(() => {
    const score =
      100 -
      degradation.blur * 7 -
      Math.max(0, 100 - degradation.brightness) * 0.55 -
      degradation.occlusion * 0.7 -
      degradation.noise * 0.45 -
      degradation.crop * 0.42 -
      degradation.motionBlur * 6;
    return Math.max(3, Math.min(100, score));
  }, [degradation]);

  const confidence = detections.length ? detections.reduce((total, detection) => total + detection.score, 0) / detections.length : 0;
  const stability = baselineDetections.length ? Math.min(1, detections.length / baselineDetections.length) : 0;
  const temporalMetrics = useMemo(() => analyzeTemporalDetections(frames), [frames]);

  const renderFrame = useCallback((mode: "baseline" | "degraded") => {
    const image = imageRef.current;
    const video = videoRef.current;
    const source = mode === "baseline" || !video || video.readyState < 2 ? image : video;
    const canvas = mode === "baseline" ? baselineCanvasRef.current : canvasRef.current;
    if (!source || !canvas) return null;
    if (source instanceof HTMLImageElement && !source.complete) return null;

    const naturalWidth = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth || source.width;
    const naturalHeight = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight || source.height;
    if (!naturalWidth || !naturalHeight) return null;
    const scale = Math.min(1, MAX_FRAME_WIDTH / Math.max(1, naturalWidth));
    const width = Math.max(1, Math.round(naturalWidth * scale));
    const height = Math.max(1, Math.round(naturalHeight * scale));
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return null;

    context.clearRect(0, 0, width, height);
    const isDegraded = mode === "degraded";
    context.filter = isDegraded
      ? `blur(${degradation.blur + degradation.motionBlur * 0.45}px) brightness(${degradation.brightness}%) contrast(${100 - degradation.noise * 0.2}%)`
      : "none";
    const cropScale = isDegraded ? 1 + degradation.crop / 100 : 1;
    const drawWidth = width * cropScale;
    const drawHeight = height * cropScale;
    context.drawImage(source, (width - drawWidth) / 2 + (isDegraded ? degradation.motionBlur : 0), (height - drawHeight) / 2, drawWidth, drawHeight);
    context.filter = "none";
    if (isDegraded) {
      context.fillStyle = "rgba(3,4,3,.82)";
      context.fillRect(width * (1 - degradation.occlusion / 100), 0, width * (degradation.occlusion / 100), height * (degradation.occlusion / 65));
    }

    if (isDegraded && degradation.noise > 0) {
      const imageData = context.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 16) {
        const noise = (Math.random() - 0.5) * degradation.noise;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
      context.putImageData(imageData, 0, 0);
    }

    return canvas;
  }, [degradation]);

  const runInference = useCallback(async () => {
    if (state !== "ready") return;
    const canvas = renderFrame("degraded");
    if (!canvas) return;
    setRunning(true);
    try {
      const next = await detect(canvas);
      setDetections(next);
      setFrames((current) => appendDetectionFrame(current, next));
      if (!baselineDetections.length) {
        const baselineCanvas = renderFrame("baseline");
        const baseline = baselineCanvas ? await detect(baselineCanvas) : [];
        setBaselineDetections(baseline);
      }
    } finally {
      setRunning(false);
    }
  }, [baselineDetections.length, detect, renderFrame, state]);

  useEffect(() => {
    if (mode !== "upload") return;
    const timer = window.setTimeout(() => {
      void runInference();
    }, 260);
    return () => window.clearTimeout(timer);
  }, [mode, runInference]);

  useEffect(() => {
    if (mode !== "webcam" || webcamState !== "active" || state !== "ready") return;

    const tick = (timestamp: number) => {
      if (timestamp - lastInferenceRef.current > REALTIME_INFERENCE_INTERVAL && !inFlightRef.current) {
        lastInferenceRef.current = timestamp;
        inFlightRef.current = true;
        void runInference().finally(() => {
          inFlightRef.current = false;
        });
      }
      animationRef.current = window.requestAnimationFrame(tick);
    };

    animationRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [mode, runInference, state, webcamState]);

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    stopWebcam();
  }, [imageUrl]);

  function onImageUpload(file?: File) {
    if (!file) return;
    stopWebcam();
    setMode("upload");
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setBaselineDetections([]);
    setDetections([]);
    setFrames([]);
    setImageUrl(URL.createObjectURL(file));
  }

  async function startWebcam() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setWebcamState("unsupported");
      setWebcamMessage("This browser does not expose camera access to the page.");
      return;
    }
    try {
      setMode("webcam");
      setBaselineDetections([]);
      setDetections([]);
      setFrames([]);
      setWebcamState("requesting");
      setWebcamMessage(undefined);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 960 }, height: { ideal: 540 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setWebcamState("active");
    } catch (requestError) {
      setWebcamState("blocked");
      setWebcamMessage(requestError instanceof Error ? requestError.message : "Camera permission was not granted.");
    }
  }

  function stopWebcam() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setWebcamState("idle");
  }

  function switchToUpload() {
    stopWebcam();
    setMode("upload");
    setDetections([]);
    setFrames([]);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr_.9fr]">
        <div className="relative min-h-72 overflow-hidden border border-[#101b15] bg-[#07100b]">
          <img ref={imageRef} src={imageUrl ?? ""} alt="" className="hidden" onLoad={() => void runInference()} />
          <video ref={videoRef} className="hidden" muted playsInline />
          <canvas ref={canvasRef} className="h-full min-h-72 w-full object-contain" />
          <canvas ref={baselineCanvasRef} className="hidden" />
          {!imageUrl && mode === "upload" ? (
            <div className="absolute inset-0 flex items-center justify-center px-8 text-center font-mono text-[0.72rem] uppercase text-signal-dim">
              upload image or enable webcam to run real browser-side detection
            </div>
          ) : null}
          {mode === "webcam" && webcamState !== "active" ? (
            <div className="absolute inset-0 flex items-center justify-center px-8 text-center font-mono text-[0.72rem] uppercase text-signal-dim">
              webcam waiting / no inference frames emitted
            </div>
          ) : null}
          <DetectionOverlay detections={detections} canvasRef={canvasRef} />
          <div className="absolute bottom-3 left-3 border border-[#1a2b21] bg-[#030403]/80 px-2 py-1 font-mono text-[0.6rem] uppercase text-signal-dim">
            {state === "ready" ? (running ? "inference running" : mode === "webcam" ? "realtime route active" : "model ready") : state}
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={switchToUpload}
              className={`border px-3 py-2 font-mono text-[0.62rem] uppercase transition ${mode === "upload" ? "border-[#3e654c] bg-signal-green/10 text-signal-green" : "border-[#101b15] bg-[#050806]/70 text-signal-dim hover:border-[#2f4a39]"}`}
            >
              <ImageIcon className="mr-1 inline h-3 w-3" />
              upload
            </button>
            <button
              type="button"
              onClick={() => void startWebcam()}
              className={`border px-3 py-2 font-mono text-[0.62rem] uppercase transition ${mode === "webcam" ? "border-[#3e654c] bg-signal-green/10 text-signal-green" : "border-[#101b15] bg-[#050806]/70 text-signal-dim hover:border-[#2f4a39]"}`}
            >
              <Camera className="mr-1 inline h-3 w-3" />
              webcam
            </button>
          </div>
          <label className="block border border-[#101b15] bg-[#050806]/70 p-4 font-mono text-[0.68rem] uppercase text-signal-dim transition hover:border-[#2f4a39]">
            <input className="sr-only" type="file" accept="image/*" onChange={(event) => onImageUpload(event.target.files?.[0])} />
            upload image / real COCO-SSD inference
          </label>
          <WebcamStatus state={webcamState} message={webcamMessage} />
          <ConfidenceRail label="input condition control" value={inputIntegrity / 100} />
          <ConfidenceRail label="mean detection confidence" value={confidence} unavailable={!detections.length} />
          <ConfidenceRail label={mode === "webcam" ? "frame continuity" : "tracking persistence"} value={mode === "webcam" ? temporalMetrics.find((metric) => metric.label === "TRACKING.PERSISTENCE")?.value ?? 0 : stability} unavailable={mode === "webcam" ? temporalMetrics.find((metric) => metric.label === "TRACKING.PERSISTENCE")?.value === null : !baselineDetections.length} />
          <div className="border border-[#101b15] bg-[#050806]/70 p-3 font-mono text-[0.62rem] uppercase text-signal-dim">
            detections {detections.length} / frames {frames.length}
          </div>
          <button
            type="button"
            onClick={() => void runInference()}
            disabled={state !== "ready" || (mode === "upload" && !imageUrl) || running}
            className="w-full border border-[#203528] bg-[#07100b] px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-[#3e654c] disabled:cursor-not-allowed disabled:text-signal-dim"
          >
            run inference frame
          </button>
        </div>
      </div>
      <DegradationControls value={degradation} onChange={setDegradation} />
      <TemporalTrace frames={frames} metrics={temporalMetrics} />
      <DetectionReadout detections={detections} baselineDetections={baselineDetections} />
      <div className="border-l border-[#24392c] bg-[#050806]/62 px-3 py-2 text-sm leading-relaxed text-signal-muted">
        {error
          ? `Model load failed: ${error}`
          : state === "ready"
            ? "COCO-SSD is running locally in the browser. No backend GPU is used."
            : cvMessage ?? "Model inference remains unavailable until the browser model finishes loading."}{" "}
        Confidence values shown here come only from real model outputs.
      </div>
    </div>
  );
}

function DetectionOverlay({ detections, canvasRef }: { detections: Detection[]; canvasRef: RefObject<HTMLCanvasElement | null> }) {
  const canvas = canvasRef.current;
  const width = canvas?.width ?? 1;
  const height = canvas?.height ?? 1;
  return (
    <div className="pointer-events-none absolute inset-0">
      {detections.slice(0, 12).map((detection, index) => {
        const [x, y, w, h] = detection.bbox;
        return (
          <motion.div
            key={`${detection.class}-${index}-${Math.round(x)}-${Math.round(y)}`}
            className="absolute border border-signal-green/70 bg-signal-green/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              left: `${(x / width) * 100}%`,
              top: `${(y / height) * 100}%`,
              width: `${(w / width) * 100}%`,
              height: `${(h / height) * 100}%`,
            }}
          >
            <span className="absolute -top-5 left-0 bg-[#030403]/90 px-1 font-mono text-[0.58rem] uppercase text-signal-green">
              {detection.class} {Math.round(detection.score * 100)}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function DetectionReadout({ detections, baselineDetections }: { detections: Detection[]; baselineDetections: Detection[] }) {
  const topDetections = detections.slice(0, 5);
  const baselineClasses = baselineDetections.slice(0, 5).map((detection) => detection.class).join(" / ");
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="border border-[#101b15] bg-[#050806]/70 p-3">
        <div className="font-mono text-[0.62rem] uppercase text-signal-green/75">real model readout</div>
        <div className="mt-3 space-y-2 font-mono text-[0.62rem] uppercase text-signal-dim">
          {topDetections.length ? (
            topDetections.map((detection, index) => (
              <div key={`${detection.class}-${index}`} className="flex justify-between gap-3">
                <span>{detection.class}</span>
                <span>{Math.round(detection.score * 100)}</span>
              </div>
            ))
          ) : (
            <div>no detection reported by model</div>
          )}
        </div>
      </div>
      <div className="border border-[#101b15] bg-[#050806]/70 p-3">
        <div className="font-mono text-[0.62rem] uppercase text-signal-green/75">robustness trace</div>
        <p className="mt-3 text-sm leading-relaxed text-signal-muted">
          Baseline detections are captured from the same uploaded image before degradation. The degraded frame is re-run after slider changes; instability is measured only from COCO-SSD outputs.
        </p>
        <div className="mt-3 font-mono text-[0.6rem] uppercase text-signal-dim">
          baseline / {baselineClasses || "unavailable"}
        </div>
      </div>
    </div>
  );
}
