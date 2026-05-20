"use client";

const points = [
  ["alignment", "whether systems pursue what humans intended, not only what was measured"],
  ["governance", "how frontier capability is evaluated, constrained, and deployed"],
  ["labor transition", "how task automation changes work before entire occupations disappear"],
  ["perception safety", "how vision systems behave when real-world inputs degrade"],
];

export function SafetyBridge() {
  return (
    <section className="mb-5 console-panel p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line pb-3 md:flex-row md:items-center">
        <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">public safety interface</div>
        <div className="font-mono text-[0.6rem] uppercase text-signal-dim">source-backed / conceptual labels / no fabricated incidents</div>
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-signal-muted">
        SIGNALWATCH translates AI safety concepts into operational surfaces: what is being monitored, where evidence comes from, and why uncertainty matters before systems are deployed in the world.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {points.map(([label, text]) => (
          <div key={label} className="border border-signal-line bg-signal-panel/70 p-3">
            <div className="font-mono text-[0.62rem] uppercase text-signal-green/75">{label}</div>
            <div className="mt-2 text-xs leading-relaxed text-signal-dim">{text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
