"use client";

const signals = [
  ["Where data comes from", "papers, releases, policy pages, and real model outputs"],
  ["What is measured", "confidence, timing, detection drops, and source timestamps"],
  ["What happens when data is missing", "the interface shows unavailable instead of guessing"],
  ["Why this matters", "safer systems need visible failures and traceable evidence"],
];

export function OrientationStrip() {
  return (
    <div className="grid max-w-5xl gap-2 md:grid-cols-4">
      {signals.map(([label, detail]) => (
        <div key={label} className="border border-signal-line/65 bg-signal-panel/58 p-3">
          <div className="font-mono text-[0.58rem] uppercase text-signal-green/75">{label}</div>
          <div className="mt-2 text-xs leading-relaxed text-signal-muted">{detail}</div>
        </div>
      ))}
    </div>
  );
}
