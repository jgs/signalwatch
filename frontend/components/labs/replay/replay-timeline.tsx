"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { DetectionFrame } from "@/components/labs/inference/temporal-analysis";
import { meanConfidence } from "@/components/labs/inference/temporal-analysis";

export function ReplayTimeline({ frames }: { frames: DetectionFrame[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = frames[index];
  const confidence = frame ? meanConfidence(frame.detections) : null;
  const classes = useMemo(() => frame?.detections.slice(0, 4).map((detection) => detection.class).join(" / "), [frame]);

  useEffect(() => {
    if (!playing || frames.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % frames.length);
    }, 520);
    return () => window.clearInterval(timer);
  }, [frames.length, playing]);

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(0, frames.length - 1)));
  }, [frames.length]);

  return (
    <div className="border border-signal-line bg-signal-panel/70 p-3">
      <div className="flex items-center justify-between gap-3 border-b border-signal-line pb-3">
        <div>
          <div className="font-mono text-[0.62rem] uppercase text-signal-green/75">temporal replay</div>
          <p className="mt-1 text-xs leading-relaxed text-signal-dim">replays detection history only; no video frames or confidence values are synthesized</p>
        </div>
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          disabled={frames.length < 2}
          className="border border-signal-line bg-signal-panel2 px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-signal-green/60 disabled:cursor-not-allowed disabled:text-signal-dim"
        >
          {playing ? <Pause className="mr-1 inline h-3 w-3" /> : <Play className="mr-1 inline h-3 w-3" />}
          {playing ? "pause" : "replay"}
        </button>
      </div>
      <div className="mt-3 flex h-12 items-end gap-1">
        {frames.slice(-32).map((item, frameIndex) => {
          const value = meanConfidence(item.detections);
          const active = frameIndex === index;
          return (
            <button
              key={`${item.timestamp}-${frameIndex}`}
              type="button"
              onClick={() => setIndex(frameIndex)}
              className={`w-full border-t transition ${active ? "border-signal-green bg-signal-green/35" : "border-[#1b2b22] bg-[#132019]"}`}
              style={{ height: `${value === null ? 12 : Math.max(12, value * 100)}%` }}
              aria-label={`Replay frame ${frameIndex + 1}`}
            />
          );
        })}
        {!frames.length ? <div className="font-mono text-[0.6rem] uppercase text-signal-dim">waiting for inference history</div> : null}
      </div>
      <div className="mt-3 grid gap-2 font-mono text-[0.6rem] uppercase text-signal-dim md:grid-cols-3">
        <div>frame / {frames.length ? index + 1 : "unavailable"}</div>
        <div>confidence / {confidence === null ? "unavailable" : Math.round(confidence * 100)}</div>
        <div>classes / {classes || "none reported"}</div>
      </div>
    </div>
  );
}
