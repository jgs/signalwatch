"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HandDetector } from "@tensorflow-models/hand-pose-detection";
import type { InputFrame } from "@/lib/input-controls";
import { createVideoFrameScheduler } from "@/lib/video-frame-scheduler";

export type CameraPhase = "off" | "permission" | "loading" | "live" | "unavailable";
type CameraOptions = { compatible: boolean; deviceId: string };
type CameraDevice = { id: string; label: string };
type InputDiagnostics = { backend: string; model: string; size: string; inferenceMs: number | null; blank: boolean | null };

export function useCameraInput(onFrame: (frame: InputFrame | null) => void) {
  const video = useRef<HTMLVideoElement>(null);
  const landmarks = useRef<InputFrame | null>(null);
  const callback = useRef(onFrame);
  callback.current = onFrame;
  const generation = useRef(0);
  const stream = useRef<MediaStream | null>(null);
  const detector = useRef<HandDetector | null>(null);
  const pending = useRef<Promise<unknown> | null>(null);
  const scheduler = useRef<ReturnType<typeof createVideoFrameScheduler> | null>(null);
  const capture = useRef<HTMLCanvasElement | null>(null);
  const teardown = useRef<Promise<void>>(Promise.resolve());
  const preferences = useRef<CameraOptions>({ compatible: false, deviceId: "" });
  const [options, setOptions] = useState(preferences.current);
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [source, setSource] = useState("");
  const [diagnostics, setDiagnostics] = useState<InputDiagnostics>({ backend: "", model: "", size: "", inferenceMs: null, blank: null });
  const [phase, setPhase] = useState<CameraPhase>("off");
  const [message, setMessage] = useState("");
  const [frames, setFrames] = useState(0);
  const [handCount, setHandCount] = useState(0);

  const release = useCallback(() => {
    generation.current++;
    scheduler.current?.stop();
    scheduler.current = null;
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
    if (video.current) { video.current.pause(); video.current.srcObject = null; }
    const model = detector.current;
    detector.current = null;
    const inputCanvas = capture.current;
    capture.current = null;
    if (model || inputCanvas) {
      const inFlight = pending.current;
      teardown.current = teardown.current.catch(() => undefined).then(async () => {
        await inFlight?.catch(() => undefined);
        try { model?.dispose(); }
        finally { if (inputCanvas) { inputCanvas.width = 0; inputCanvas.height = 0; } }
      });
      void teardown.current.catch(() => undefined);
    }
    landmarks.current = null;
    callback.current(null);
  }, []);

  const stop = useCallback((reason = "Camera off") => {
    release(); setPhase("off"); setHandCount(0); setMessage(reason);
  }, [release]);

  const start = useCallback(async (changes: Partial<CameraOptions> = {}) => {
    const settings = { ...preferences.current, ...changes };
    preferences.current = settings;
    setOptions(settings);
    release();
    const id = generation.current;
    setFrames(0); setHandCount(0); setMessage(""); setSource("");
    setDiagnostics({ backend: "", model: "", size: "", inferenceMs: null, blank: null });
    if (document.hidden) {
      setPhase("off"); setMessage("Camera starts only while this tab is visible."); return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) {
      setPhase("unavailable"); setMessage("Camera requires HTTPS or localhost and a supported browser."); return;
    }
    setPhase("permission");
    try {
      await teardown.current;
      if (id !== generation.current) return;
      const input = await navigator.mediaDevices.getUserMedia({ audio: false, video: { ...(settings.deviceId ? { deviceId: { exact: settings.deviceId } } : { facingMode: "user" }), width: { ideal: 640 }, height: { ideal: 480 } } });
      if (id !== generation.current) { input.getTracks().forEach(track => track.stop()); return; }
      stream.current = input;
      setSource(input.getVideoTracks()[0]?.label || "Camera");
      const element = video.current;
      if (!element) { release(); return; }
      element.srcObject = input;
      input.getVideoTracks().forEach(track => track.addEventListener("ended", () => {
        if (id === generation.current) stop("Camera disconnected. Start again when available.");
      }, { once: true }));
      await element.play();
      if (id !== generation.current) return;
      setPhase("loading");
      // The live stream does not need the optional device list before loading the model.
      void navigator.mediaDevices.enumerateDevices?.().then(available => {
        if (id !== generation.current) return;
        setDevices(available.filter(device => device.kind === "videoinput").map((device, index) => ({ id: device.deviceId, label: device.label || `Camera ${index + 1}` })));
      }).catch(() => undefined);
      const tf = await import("@tensorflow/tfjs");
      if (id !== generation.current) return;
      let selectedBackend = settings.compatible ? "cpu" : "webgl";
      try {
        if (!await tf.setBackend(selectedBackend)) throw new Error("Backend unavailable");
      } catch {
        selectedBackend = "cpu";
        await tf.setBackend("cpu");
      }
      await tf.ready();
      if (id !== generation.current) return;
      const library = await import("@tensorflow-models/hand-pose-detection");
      if (id !== generation.current) return;
      const modelType = selectedBackend === "cpu" ? "lite" : "full";
      const model = await library.createDetector(library.SupportedModels.MediaPipeHands, { runtime: "tfjs", modelType, maxHands: 2 });
      if (id !== generation.current) { model.dispose(); return; }
      detector.current = model;
      const inputCanvas = document.createElement("canvas");
      capture.current = inputCanvas;
      const inputContext = inputCanvas.getContext("2d", { willReadFrequently: true });
      if (!inputContext) throw new Error("Camera frame capture unavailable");
      const backend = tf.getBackend();
      setDiagnostics({ backend, model: modelType, size: "", inferenceMs: null, blank: null });
      setPhase("live");
      let count = 0;
      let currentHandCount = 0;
      let lastDiagnostic = -Infinity;
      const loop = createVideoFrameScheduler(element, () => void estimate());
      scheduler.current = loop;
      const estimate = async () => {
        if (id !== generation.current) return;
        let result: ReturnType<HandDetector["estimateHands"]> | null = null;
        try {
          if (element.readyState >= 2) {
            const width = element.videoWidth, height = element.videoHeight;
            if (!width || !height) { loop.schedule(33); return; }
            if (inputCanvas.width !== width || inputCanvas.height !== height) { inputCanvas.width = width; inputCanvas.height = height; }
            inputContext.drawImage(element, 0, 0, width, height);
            const started = performance.now();
            result = model.estimateHands(inputCanvas, { flipHorizontal: false, staticImageMode: false });
            pending.current = result;
            const predictions = await result;
            if (id !== generation.current) return;
            count++;
            const arrived = performance.now();
            const frame = { hands: predictions.map(hand => hand.keypoints), width, height, at: arrived, inferenceMs: arrived - started };
            landmarks.current = frame;
            callback.current(frame);
            if (predictions.length !== currentHandCount) {
              currentHandCount = predictions.length;
              setHandCount(currentHandCount);
            }
            if (arrived - lastDiagnostic >= 1000) {
              lastDiagnostic = arrived;
              setFrames(count);
              const pixels = inputContext.getImageData(0, 0, width, height).data;
              let blank = true;
              for (let pixel = 0; pixel < pixels.length; pixel += 4) { if (pixels[pixel] || pixels[pixel + 1] || pixels[pixel + 2]) { blank = false; break; } }
              setDiagnostics({ backend, model: modelType, size: `${width} x ${height}`, inferenceMs: Math.round(arrived - started), blank });
            }
          }
          if (id === generation.current) loop.schedule(backend === "cpu" ? 75 : 0);
        } catch {
          if (id !== generation.current) return;
          release(); setPhase("unavailable"); setHandCount(0); setMessage("Hand inference stopped. No replacement outputs are generated.");
        } finally { if (pending.current === result) pending.current = null; }
      };
      loop.schedule();
    } catch (error) {
      if (id !== generation.current) return;
      release(); setPhase("unavailable"); setHandCount(0);
      const name = error instanceof DOMException ? error.name : "";
      setMessage(name === "NotAllowedError" ? "Camera permission was not granted. Mouse mode is fully available." : name === "NotFoundError" ? "No camera was found. Mouse mode is fully available." : name === "NotReadableError" ? "Camera is busy or unavailable. Close other camera apps and retry." : "Camera or hand model unavailable. Check your connection or use mouse mode.");
    }
  }, [release, stop]);

  useEffect(() => {
    const hidden = () => { if (document.hidden) stop("Camera stopped while the tab was hidden."); };
    const pagehide = () => stop("Camera stopped when leaving the experiment.");
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("pagehide", pagehide);
    return () => { document.removeEventListener("visibilitychange", hidden); window.removeEventListener("pagehide", pagehide); release(); };
  }, [release, stop]);

  return { video, landmarks, phase, message, frames, handCount, options, devices, source, diagnostics, start, stop };
}
