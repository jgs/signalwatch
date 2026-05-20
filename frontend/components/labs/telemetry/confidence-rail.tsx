"use client";

export function ConfidenceRail({ label, value, unavailable }: { label: string; value: number; unavailable?: boolean }) {
  const width = unavailable ? 0 : Math.max(3, Math.min(100, value * 100));
  return (
    <div className="font-mono text-[0.66rem] uppercase text-signal-dim">
      <div className="flex justify-between gap-3">
        <span>{label}</span>
        <span>{unavailable ? "unavailable" : Math.round(value * 100)}</span>
      </div>
      <div className="mt-2 h-1.5 border border-signal-line bg-signal-panel2">
        <div className="h-full bg-signal-olive transition-[width] duration-500" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
