"use client";

export function OperationalNote({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-l border-[#24392c] bg-[#050806]/62 px-3 py-2">
      <div className="font-mono text-[0.6rem] uppercase text-signal-green/70">{label}</div>
      <p className="mt-1 text-sm leading-relaxed text-signal-muted">{text}</p>
    </div>
  );
}
