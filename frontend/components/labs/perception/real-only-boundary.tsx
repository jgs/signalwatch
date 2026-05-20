"use client";

const boundaries = [
  ["model outputs", "detections and confidence are reported only when COCO-SSD emits them"],
  ["telemetry", "stability, variance, persistence, and replay are computed from detection history"],
  ["input controls", "degradation presets alter pixels before inference; they are not model confidence"],
];

export function RealOnlyBoundary() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {boundaries.map(([label, text]) => (
        <div key={label} className="border border-signal-line bg-signal-panel/70 p-3">
          <div className="font-mono text-[0.6rem] uppercase text-signal-green/75">{label}</div>
          <div className="mt-2 text-xs leading-relaxed text-signal-dim">{text}</div>
        </div>
      ))}
    </div>
  );
}
