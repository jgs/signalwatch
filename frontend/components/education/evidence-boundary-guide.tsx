import { Beaker, Database, FileSearch, Workflow, type LucideIcon } from "lucide-react";

const boundaryItems = [
  {
    icon: FileSearch,
    label: "Real",
    title: "Observed or sourced",
    text: "A source link, timestamp, runtime event, or model output exists. The interface can point back to where it came from.",
  },
  {
    icon: Workflow,
    label: "Derived",
    title: "Calculated from real inputs",
    text: "A summary, grouping, or trace built from source activity, telemetry, or model-output history. It should still show its inputs.",
  },
  {
    icon: Database,
    label: "Conceptual",
    title: "Explanation, not measurement",
    text: "A teaching example that explains a risk or system behavior without claiming it happened in a deployed system.",
  },
  {
    icon: Beaker,
    label: "Simulated",
    title: "Controlled demonstration",
    text: "A parameter-driven demo. Useful for learning, but not evidence about the outside world unless real inputs are attached.",
  },
];

export function EvidenceBoundaryGuide({
  compact = false,
  title = "how to read the evidence labels",
}: {
  compact?: boolean;
  title?: string;
}) {
  return (
    <section className="console-panel p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
        <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">{title}</div>
        <div className="font-mono text-[0.58rem] uppercase text-signal-dim">plain language / trust boundary</div>
      </div>
      <div className={`mt-5 grid gap-3 ${compact ? "md:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-4"}`}>
        {boundaryItems.map((item) => (
          <BoundaryCard key={item.label} {...item} compact={compact} />
        ))}
      </div>
    </section>
  );
}

function BoundaryCard({
  icon: Icon,
  label,
  title,
  text,
  compact,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  text: string;
  compact: boolean;
}) {
  return (
    <article className="border border-signal-line bg-signal-panel/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase text-signal-green/75">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
      </div>
      <h3 className="mt-3 text-sm font-semibold leading-snug text-signal-text">{title}</h3>
      <p className={`${compact ? "mt-2 text-xs" : "mt-3 text-sm"} leading-relaxed text-signal-muted`}>{text}</p>
    </article>
  );
}
