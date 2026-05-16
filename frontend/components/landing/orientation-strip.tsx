"use client";

const signals = [
  ["REAL DATA INGESTION", "ecosystem signals are source-derived"],
  ["BROWSER-SIDE CV", "model confidence comes from local COCO-SSD outputs"],
  ["NO FABRICATED SIGNALS", "missing outputs remain missing"],
  ["SAFETY-CRITICAL PERCEPTION", "robustness under uncertainty"],
];

export function OrientationStrip() {
  return (
    <div className="grid max-w-4xl gap-2 md:grid-cols-4">
      {signals.map(([label, detail]) => (
        <div key={label} className="border border-[#101b15] bg-[#050806]/58 p-3">
          <div className="font-mono text-[0.58rem] uppercase text-signal-green/75">{label}</div>
          <div className="mt-2 text-xs leading-relaxed text-signal-dim">{detail}</div>
        </div>
      ))}
    </div>
  );
}
