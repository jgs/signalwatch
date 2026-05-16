"use client";

import { buildEvidencePacket, buildOperationalObservations, observationCadence, type DetectionFrame } from "@/components/labs/inference/temporal-analysis";
import type { DegradationState } from "@/components/labs/degradation/degradation-controls";

export function EvidencePacketPanel({
  frames,
  preset,
  mode,
  degradation,
}: {
  frames: DetectionFrame[];
  preset: string;
  mode: string;
  degradation: DegradationState;
}) {
  const packet = buildEvidencePacket(frames);
  const notes = buildOperationalObservations(frames);
  const cadence = observationCadence(frames);
  const confidence = packet.meanConfidence === null ? "unavailable" : `${Math.round(packet.meanConfidence * 100)}%`;

  function exportEvidence() {
    const generatedAt = new Date().toISOString();
    const payload = {
      schema: "signalwatch.perception.evidence.v1",
      generatedAt,
      model: "browser-side COCO-SSD",
      inferenceBoundary: "local browser inference; no backend GPU; no synthesized detections",
      mode,
      preset,
      degradation,
      packet,
      observationWindow: cadence
        ? {
            durationSeconds: Number(cadence.durationSeconds.toFixed(3)),
            cadenceSeconds: Number(cadence.cadenceSeconds.toFixed(3)),
          }
        : null,
      operationalObservations: notes,
      frames: frames.map((frame) => ({
        timestamp: new Date(frame.timestamp).toISOString(),
        detections: frame.detections.map((detection) => ({
          class: detection.class,
          score: Number(detection.score.toFixed(6)),
          bbox: detection.bbox.map((value) => Number(value.toFixed(3))),
        })),
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `signalwatch-evidence-${generatedAt.replace(/[:.]/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <details className="border border-[#101b15] bg-[#050806]/70 p-3" open={frames.length > 0}>
      <summary className="cursor-pointer list-none font-mono text-[0.62rem] uppercase text-signal-green/75">
        operational evidence packet
      </summary>
      <button
        type="button"
        onClick={exportEvidence}
        disabled={!frames.length}
        className="mt-3 border border-[#203528] bg-[#07100b] px-2 py-1 font-mono text-[0.58rem] uppercase text-signal-green/75 transition hover:border-[#3e654c] disabled:cursor-not-allowed disabled:border-[#101b15] disabled:text-signal-dim"
      >
        export json
      </button>
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
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {notes.map((note) => (
          <div key={`${note.label}-${note.text}`} className="border-l border-[#18271d] bg-[#030403]/48 px-3 py-2">
            <div className="font-mono text-[0.56rem] uppercase text-signal-green/65">{note.label}</div>
            <p className="mt-1 text-xs leading-relaxed text-signal-muted">{note.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 font-mono text-[0.56rem] uppercase text-signal-dim">
        export boundary / model outputs, timestamps, degradation settings, derived notes, and evidence packet only
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
