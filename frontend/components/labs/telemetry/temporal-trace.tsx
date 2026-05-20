"use client";

import { motion } from "framer-motion";
import type { DetectionFrame, TemporalMetric } from "@/components/labs/inference/temporal-analysis";
import { buildClassPersistenceWindows, buildContinuityTransitions, meanConfidence, observationCadence } from "@/components/labs/inference/temporal-analysis";
import { ConfidenceRail } from "@/components/labs/telemetry/confidence-rail";

export function TemporalTrace({ frames, metrics }: { frames: DetectionFrame[]; metrics: TemporalMetric[] }) {
  const points = frames.map((frame) => meanConfidence(frame.detections));
  const hasTrace = points.some((point) => point !== null);
  const cadence = observationCadence(frames);
  const recentFrames = frames.slice(-28);
  const transitions = buildContinuityTransitions(frames);
  const recentTransitions = transitions.slice(-5).reverse();
  const persistenceWindows = buildClassPersistenceWindows(frames).slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="border border-signal-line bg-signal-panel/70 p-3">
        <div className="mb-3 flex items-center justify-between font-mono text-[0.62rem] uppercase text-signal-dim">
          <span>temporal confidence trace</span>
          <span>{frames.length} frames{cadence ? ` / ${cadence.cadenceSeconds.toFixed(1)}s cadence` : ""}</span>
        </div>
        <div className="flex h-16 items-end gap-1 border border-signal-line bg-signal-black p-2">
          {recentFrames.map((frame, index) => {
            const point = meanConfidence(frame.detections);
            const previous = recentFrames[index - 1];
            const dropped = Boolean(previous?.detections.length && !frame.detections.length);
            return (
              <motion.div
                key={`${frame.timestamp}-${point ?? "empty"}`}
                title={dropped ? "continuity break: previous frame had detections; current frame has none" : undefined}
                className={point === null ? (dropped ? "w-full bg-[#5f4931]" : "w-full bg-[#132019]") : "w-full bg-signal-green/55"}
                initial={{ opacity: 0.3 }}
                animate={{ height: point === null ? "8%" : `${Math.max(8, point * 100)}%`, opacity: dropped ? 0.55 : point === null ? 0.18 : 0.78 }}
                transition={{ duration: 0.35 }}
              />
            );
          })}
          {!hasTrace ? <div className="font-mono text-[0.6rem] uppercase text-signal-dim">waiting for model outputs</div> : null}
        </div>
        <div className="mt-2 font-mono text-[0.56rem] uppercase text-signal-dim">
          observation window / confidence bars from model outputs / muted break markers indicate dropped detections
        </div>
        <div className="mt-3 grid gap-2 font-mono text-[0.58rem] uppercase text-signal-dim sm:grid-cols-4">
          <TraceReadout label="window" value={cadence ? `${cadence.durationSeconds.toFixed(1)}s` : "pending"} />
          <TraceReadout label="cadence" value={cadence ? `${cadence.cadenceSeconds.toFixed(1)}s` : "pending"} />
          <TraceReadout label="jitter" value={cadence?.cadenceJitterSeconds === null || !cadence ? "pending" : `${cadence.cadenceJitterSeconds.toFixed(2)}s`} />
          <TraceReadout label="transitions" value={String(transitions.length)} />
        </div>
      </div>
      <div className="border border-signal-line bg-signal-panel/60 p-3">
        <div className="mb-3 font-mono text-[0.62rem] uppercase text-signal-green/70">continuity markers</div>
        <div className="grid gap-2 md:grid-cols-2">
          {recentTransitions.length ? (
            recentTransitions.map((transition) => (
              <div key={`${transition.timestamp}-${transition.index}`} className="border-l border-signal-green/40 bg-signal-black/45 px-3 py-2">
                <div className="font-mono text-[0.56rem] uppercase text-signal-green/65">
                  frame {transition.index + 1} / {transition.kind.replace("-", " ")}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-signal-muted">
                  {transition.previousCount} to {transition.currentCount} detections
                  {transition.lostClasses.length ? ` / lost ${transition.lostClasses.join(" / ")}` : ""}
                  {transition.gainedClasses.length ? ` / gained ${transition.gainedClasses.join(" / ")}` : ""}
                </p>
              </div>
            ))
          ) : (
            <div className="font-mono text-[0.6rem] uppercase text-signal-dim">no continuity transition recorded in the current window</div>
          )}
        </div>
      </div>
      <div className="border border-signal-line bg-signal-panel/60 p-3">
        <div className="mb-3 font-mono text-[0.62rem] uppercase text-signal-green/70">class persistence windows</div>
        <div className="grid gap-2 md:grid-cols-2">
          {persistenceWindows.length ? (
            persistenceWindows.map((window) => (
              <div key={`${window.className}-${window.firstFrameIndex}-${window.lastFrameIndex}`} className="border-l border-signal-green/40 bg-signal-black/45 px-3 py-2">
                <div className="font-mono text-[0.56rem] uppercase text-signal-green/65">{window.className}</div>
                <p className="mt-1 text-xs leading-relaxed text-signal-muted">
                  frames {window.firstFrameIndex + 1}-{window.lastFrameIndex + 1} / {window.frameCount} observed / confidence {window.meanConfidence === null ? "unavailable" : Math.round(window.meanConfidence * 100)}
                </p>
              </div>
            ))
          ) : (
            <div className="font-mono text-[0.6rem] uppercase text-signal-dim">no emitted class has persisted across this window</div>
          )}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} title={metric.detail} className="border border-signal-line bg-signal-panel/52 p-3">
            <ConfidenceRail label={metric.label} value={metric.value ?? 0} unavailable={metric.value === null} />
            <div className="mt-2 font-mono text-[0.56rem] uppercase text-signal-dim">{metric.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TraceReadout({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-signal-line pb-1">
      <span>{label}</span>
      <span className="text-signal-muted">{value}</span>
    </div>
  );
}
