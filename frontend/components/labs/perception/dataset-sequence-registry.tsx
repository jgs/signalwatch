"use client";

import { Database, ShieldCheck } from "lucide-react";
import { PERCEPTION_DATASET_SEQUENCES, perceptionDatasetSummary, type PerceptionDatasetSequence } from "@/lib/perception-datasets";

export function DatasetSequenceRegistry({
  activeId,
  onSelect,
}: {
  activeId?: string | null;
  onSelect: (sequence: PerceptionDatasetSequence) => void;
}) {
  const summary = perceptionDatasetSummary();

  return (
    <section className="border border-[#101b15] bg-[#050806]/70 p-3">
      <div className="flex flex-col justify-between gap-2 border-b border-[#101b15] pb-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase text-signal-green/75">
          <Database className="h-3.5 w-3.5" />
          robustness sequence registry
        </div>
        <div className="font-mono text-[0.56rem] uppercase text-signal-dim">
          {summary.total} protocols / {summary.assetBacked} asset-backed / {summary.captureRequired} capture-required
        </div>
      </div>
      <div className="mt-3 grid gap-2 lg:grid-cols-5">
        {PERCEPTION_DATASET_SEQUENCES.map((sequence) => (
          <button
            key={sequence.id}
            type="button"
            onClick={() => onSelect(sequence)}
            className={`border p-3 text-left transition ${activeId === sequence.id ? "border-[#3e654c] bg-signal-green/10" : "border-[#101b15] bg-[#030403]/35 hover:border-[#2f4a39]"}`}
          >
            <div className="font-mono text-[0.56rem] uppercase text-signal-green/70">{sequence.scenarioType}</div>
            <div className="mt-2 text-xs font-semibold leading-snug text-signal-text">{sequence.title}</div>
            <div className="mt-2 font-mono text-[0.54rem] uppercase text-signal-dim">{sequence.assetStatus.replace("-", " ")}</div>
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2 border-l border-[#24392c] bg-[#030403]/35 px-3 py-2 text-xs leading-relaxed text-signal-muted">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-green/65" />
        <span>
          Registry entries are capture protocols until real frames are imported. Selecting one applies reproducible degradation metadata; detections and confidence remain model-output only.
        </span>
      </div>
    </section>
  );
}
