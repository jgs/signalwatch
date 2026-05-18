const items = [
  "evidence-first",
  "no fabricated telemetry",
  "local perception inference",
  "source-backed registry",
  "unavailable states visible",
];

export function SystemStatusBar() {
  return (
    <footer className="mt-8 border-t border-signal-line/60 py-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.58rem] uppercase text-signal-dim">
        {items.map((item) => (
          <span key={item} className="border-l border-signal-line/70 pl-2">{item}</span>
        ))}
      </div>
    </footer>
  );
}
