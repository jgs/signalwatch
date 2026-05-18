import { Activity, Database, FileJson, ShieldCheck, type LucideIcon } from "lucide-react";
import { OperationalCallouts } from "@/components/education/operational-callouts";
import { OperationalSection } from "@/components/layout/operational-section";

const boundaryRows: Array<{
  icon: LucideIcon;
  label: string;
  value: string;
  state: string;
}> = [
  {
    icon: Database,
    label: "source data",
    value: "papers, releases, policy pages, ingested records",
    state: "traceable",
  },
  {
    icon: Activity,
    label: "model behavior",
    value: "browser-side detections, confidence, timing, empty frames",
    state: "observed",
  },
  {
    icon: FileJson,
    label: "evidence packet",
    value: "timestamps, frame history, continuity markers, exported JSON",
    state: "recorded",
  },
  {
    icon: ShieldCheck,
    label: "claim boundary",
    value: "missing data stays unavailable; outcomes are not prewritten",
    state: "enforced",
  },
];

export function OperationalBoundaryPanel({ title = "operational evidence boundary" }: { title?: string }) {
  return (
    <OperationalSection title={title} meta="real inputs / real outputs / explicit unavailable states" icon={ShieldCheck}>
      <div className="grid gap-3 md:grid-cols-2">
        {boundaryRows.map(({ icon: Icon, label, value, state }) => (
          <div key={label} className="grid grid-cols-[auto_1fr] items-start gap-3 border border-[#101b15] bg-[#050806]/66 p-3 sm:grid-cols-[auto_1fr_auto]">
            <Icon className="mt-0.5 h-3.5 w-3.5 text-signal-green/72" />
            <div className="min-w-0">
              <div className="font-mono text-[0.58rem] uppercase text-signal-green/75">{label}</div>
              <p className="mt-2 text-sm leading-relaxed text-signal-muted">{value}</p>
            </div>
            <div className="col-start-2 w-fit border border-signal-line/70 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase text-signal-dim sm:col-start-auto">{state}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <OperationalCallouts compact />
      </div>
    </OperationalSection>
  );
}
