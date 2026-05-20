import { Camera, GitBranch, ScanSearch, ServerCog, type LucideIcon } from "lucide-react";

const legendItems: Array<{
  icon: LucideIcon;
  label: string;
  meaning: string;
  boundary: string;
}> = [
  {
    icon: Camera,
    label: "source photo",
    meaning: "A real attributed image used to show operating conditions.",
    boundary: "context only",
  },
  {
    icon: ServerCog,
    label: "generated context",
    meaning: "A project image created to explain infrastructure or system concepts.",
    boundary: "not telemetry",
  },
  {
    icon: GitBranch,
    label: "diagram",
    meaning: "A conceptual map that explains relationships or method boundaries.",
    boundary: "not measurement",
  },
  {
    icon: ScanSearch,
    label: "model output",
    meaning: "Detections, confidence, empty frames, or traces emitted by a real model run.",
    boundary: "evidence only when run",
  },
];

type VisualEvidenceLegendProps = {
  compact?: boolean;
  title?: string;
};

export function VisualEvidenceLegend({
  compact = false,
  title = "how to read visuals",
}: VisualEvidenceLegendProps) {
  return (
    <section className="console-panel p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
        <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">{title}</div>
        <div className="font-mono text-[0.58rem] uppercase text-signal-dim">context stays separate from evidence</div>
      </div>
      <div className={`mt-5 grid gap-3 ${compact ? "md:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-4"}`}>
        {legendItems.map(({ icon: Icon, label, meaning, boundary }) => (
          <div key={label} className="border border-[#101b15] bg-[#050806]/66 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase text-signal-green/75">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
              <span className="border border-signal-line/70 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase text-signal-dim">{boundary}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-signal-muted">{meaning}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
