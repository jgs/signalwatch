"use client";

import { motion } from "framer-motion";
import type { DetectionFrame, TemporalMetric } from "@/components/labs/inference/temporal-analysis";
import { meanConfidence } from "@/components/labs/inference/temporal-analysis";
import { ConfidenceRail } from "@/components/labs/telemetry/confidence-rail";

export function TemporalTrace({ frames, metrics }: { frames: DetectionFrame[]; metrics: TemporalMetric[] }) {
  const points = frames.map((frame) => meanConfidence(frame.detections));
  const hasTrace = points.some((point) => point !== null);

  return (
    <div className="space-y-4">
      <div className="border border-[#101b15] bg-[#050806]/70 p-3">
        <div className="mb-3 flex items-center justify-between font-mono text-[0.62rem] uppercase text-signal-dim">
          <span>temporal confidence trace</span>
          <span>{frames.length} frames</span>
        </div>
        <div className="flex h-16 items-end gap-1 border border-[#122219] bg-[#030403] p-2">
          {points.slice(-28).map((point, index) => (
            <motion.div
              key={`${index}-${point ?? "empty"}`}
              className={point === null ? "w-full bg-[#132019]" : "w-full bg-signal-green/55"}
              initial={{ opacity: 0.3 }}
              animate={{ height: point === null ? "8%" : `${Math.max(8, point * 100)}%`, opacity: point === null ? 0.18 : 0.78 }}
              transition={{ duration: 0.35 }}
            />
          ))}
          {!hasTrace ? <div className="font-mono text-[0.6rem] uppercase text-signal-dim">waiting for model outputs</div> : null}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} title={metric.detail} className="border border-[#101b15] bg-[#050806]/52 p-3">
            <ConfidenceRail label={metric.label} value={metric.value ?? 0} unavailable={metric.value === null} />
            <div className="mt-2 font-mono text-[0.56rem] uppercase text-signal-dim">{metric.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
