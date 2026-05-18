"use client";

import { buildClassPersistenceWindows, buildContinuityTransitions, buildEvidencePacket, buildOperationalObservations, observationCadence, type DetectionFrame } from "@/components/labs/inference/temporal-analysis";
import type { DegradationState } from "@/components/labs/degradation/degradation-controls";
import type { PerceptionDatasetSequence } from "@/lib/perception-datasets";

export function EvidencePacketPanel({
  frames,
  preset,
  mode,
  degradation,
  sequence,
}: {
  frames: DetectionFrame[];
  preset: string;
  mode: string;
  degradation: DegradationState;
  sequence?: PerceptionDatasetSequence | null;
}) {
  const packet = buildEvidencePacket(frames);
  const notes = buildOperationalObservations(frames);
  const cadence = observationCadence(frames);
  const transitions = buildContinuityTransitions(frames);
  const persistenceWindows = buildClassPersistenceWindows(frames);
  const confidence = packet.meanConfidence === null ? "unavailable" : `${Math.round(packet.meanConfidence * 100)}%`;

  function exportEvidence() {
    const generatedAt = new Date().toISOString();
    const payload = {
      schema: "signalwatch.perception.evidence.v2",
      generatedAt,
      model: "browser-side COCO-SSD",
      inferenceBoundary: "local browser inference; no backend GPU; no synthesized detections",
      mode,
      preset,
      degradation,
      datasetSequence: sequence
        ? {
            id: sequence.id,
            title: sequence.title,
            scenarioType: sequence.scenarioType,
            assetStatus: sequence.assetStatus,
            datasetPath: sequence.datasetPath,
            frameUris: sequence.frameUris,
            degradationPresetId: sequence.degradationPresetId,
            degradationMatchesSelectedPreset: preset === sequence.degradationPresetId,
            lighting: sequence.lighting,
            temporalProperties: sequence.temporalProperties,
            inspectionTargets: sequence.inspectionTargets,
            operationalRelevance: sequence.operationalRelevance,
            safetyCriticalRelevance: sequence.safetyCriticalRelevance,
            reproducibilityLevel: sequence.reproducibilityLevel,
            reproducibilityNotes: sequence.reproducibilityNotes,
            evidenceRequirements: sequence.evidenceRequirements,
          }
        : null,
      packet,
      observationWindow: cadence
        ? {
            startedAt: new Date(cadence.startedAt).toISOString(),
            endedAt: new Date(cadence.endedAt).toISOString(),
            durationSeconds: Number(cadence.durationSeconds.toFixed(3)),
            cadenceSeconds: Number(cadence.cadenceSeconds.toFixed(3)),
            cadenceJitterSeconds: cadence.cadenceJitterSeconds === null ? null : Number(cadence.cadenceJitterSeconds.toFixed(3)),
          }
        : null,
      operationalObservations: notes,
      continuityTransitions: transitions.map((transition) => ({
        timestamp: new Date(transition.timestamp).toISOString(),
        index: transition.index,
        kind: transition.kind,
        previousCount: transition.previousCount,
        currentCount: transition.currentCount,
        lostClasses: transition.lostClasses,
        gainedClasses: transition.gainedClasses,
      })),
      classPersistenceWindows: persistenceWindows.map((window) => ({
        className: window.className,
        firstFrameIndex: window.firstFrameIndex,
        lastFrameIndex: window.lastFrameIndex,
        frameCount: window.frameCount,
        startedAt: new Date(window.startedAt).toISOString(),
        endedAt: new Date(window.endedAt).toISOString(),
        meanConfidence: window.meanConfidence === null ? null : Number(window.meanConfidence.toFixed(6)),
      })),
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
        <Readout label="sequence" value={sequence?.id ?? "none"} />
        <Readout label="asset status" value={sequence?.assetStatus.replace("-", " ") ?? "ad hoc"} />
        <Readout label="mode" value={mode} />
        <Readout label="preset" value={preset} />
        <Readout label="frames" value={String(packet.frameCount)} />
        <Readout label="with detections" value={String(packet.framesWithDetections)} />
        <Readout label="empty frames" value={String(packet.emptyFrames)} />
        <Readout label="mean confidence" value={confidence} />
        <Readout label="drop events" value={String(packet.detectionDropEvents)} />
        <Readout label="continuity breaks" value={String(packet.classContinuityBreaks)} />
        <Readout label="persistence windows" value={String(persistenceWindows.length)} />
        <Readout label="window" value={cadence ? `${cadence.durationSeconds.toFixed(1)}s` : "pending"} />
        <Readout label="cadence jitter" value={cadence?.cadenceJitterSeconds === null || !cadence ? "pending" : `${cadence.cadenceJitterSeconds.toFixed(2)}s`} />
      </div>
      <div className="mt-3 border-l border-[#24392c] px-3 py-2 text-sm leading-relaxed text-signal-muted">
        {sequence
          ? `${sequence.title}: ${sequence.reproducibilityLevel} / ${sequence.assetStatus.replace("-", " ")}. ${sequence.reproducibilityNotes[0]}`
          : "No dataset sequence is selected. The export will record this as an ad hoc browser inference run."}
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
      <div className="mt-3 border border-[#101b15] bg-[#030403]/35 p-3">
        <div className="font-mono text-[0.56rem] uppercase text-signal-green/65">continuity transitions</div>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {transitions.slice(-4).reverse().map((transition) => (
            <div key={`${transition.timestamp}-${transition.index}`} className="font-mono text-[0.56rem] uppercase text-signal-dim">
              frame {transition.index + 1} / {transition.kind.replace("-", " ")} / {transition.previousCount} to {transition.currentCount}
            </div>
          ))}
          {!transitions.length ? (
            <div className="font-mono text-[0.56rem] uppercase text-signal-dim">no transition recorded</div>
          ) : null}
        </div>
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
