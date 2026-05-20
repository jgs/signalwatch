"use client";

import type { DegradationState } from "@/components/labs/degradation/degradation-controls";

export type DegradationPreset = {
  id: string;
  label: string;
  summary: string;
  value: DegradationState;
};

export const degradationPresets: DegradationPreset[] = [
  {
    id: "nominal",
    label: "nominal frame",
    summary: "minimal environmental stress",
    value: { blur: 0, brightness: 100, occlusion: 4, noise: 4, crop: 0, motionBlur: 0 },
  },
  {
    id: "low-light",
    label: "low-light route",
    summary: "reduced illumination and compression pressure",
    value: { blur: 1, brightness: 48, occlusion: 10, noise: 24, crop: 4, motionBlur: 1 },
  },
  {
    id: "partial-visibility",
    label: "partial visibility",
    summary: "occlusion and crop instability",
    value: { blur: 1, brightness: 92, occlusion: 42, noise: 12, crop: 26, motionBlur: 1 },
  },
  {
    id: "motion-instability",
    label: "motion instability",
    summary: "blurred moving input surface",
    value: { blur: 4, brightness: 92, occlusion: 12, noise: 16, crop: 10, motionBlur: 7 },
  },
  {
    id: "compressed-feed",
    label: "compressed feed",
    summary: "noise and contrast degradation",
    value: { blur: 2, brightness: 86, occlusion: 10, noise: 58, crop: 8, motionBlur: 2 },
  },
];

export function DegradationPresets({
  active,
  onSelect,
}: {
  active?: string;
  onSelect: (preset: DegradationPreset) => void;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-5">
      {degradationPresets.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset)}
          className={`border p-3 text-left transition ${active === preset.id ? "border-signal-green/60 bg-signal-green/10" : "border-signal-line bg-signal-panel/70 hover:border-signal-green/45"}`}
        >
          <div className="font-mono text-[0.6rem] uppercase text-signal-green/75">{preset.label}</div>
          <div className="mt-2 text-xs leading-relaxed text-signal-dim">{preset.summary}</div>
        </button>
      ))}
    </div>
  );
}
