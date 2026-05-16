"use client";

import { buildEvidencePacket, type DetectionFrame } from "@/components/labs/inference/temporal-analysis";

export function EvidencePacketPanel({ frames, preset, mode }: { frames: DetectionFrame[]; preset: string; mode: string }) {
  const packet = buildEvidencePacket(frames);
  const confidence = packet.meanConfidence === null ? "unavailable" : `${Math.round(packet.meanConfidence * 100)}%`;

  return (
    <details className="border border-[#101b15] bg-[#050806]/70 p-3" open={frames.length > 0}>
      <summary className="cursor-pointer list-none font-mono text-[0.62rem] uppercase text-signal-green/75">
        operational evidence packet
      </summary>
      <div className="mt-3 grid gap-2 font-mono text-[0.58rem] uppercase text-signal-dim sm:grid-cols-2 lg:grid-cols-4">
        <Readout label="mode" value={mode} />
        <Readout label="preset" value={preset} />
        <Readout label="frames" value={String(packet.frameCount)} />
        <Readout label="with detections" value={String(packet.framesWithDetections)} />
        <Readout label="empty frames" value={String(packet.emptyFrames)} />
        <Readout label="mean confidence" value={confidence} />
        <Readout label="drop events" value={String(packet.detectionDropEvents)} />
        <Readout label="continuity breaks" value={String(packet.classContinuityBreaks)} />
      </div>
      <div className="mt-3 border-l border-[#24392c] px-3 py-2 text-sm leading-relaxed text-signal-muted">
        {packet.observedClasses.length
          ? `Observed classes: ${packet.observedClasses.join(" / ")}. Values are derived from real model outputs in this session.`
          : "No model detections have been emitted yet. The packet remains empty instead of synthesizing evidence."}
      </div>
    </details>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#101b15] pb-1">
      <span>{label}</span>
      <span className="text-signal-muted">{value}</span>
    </div>
  );
}
