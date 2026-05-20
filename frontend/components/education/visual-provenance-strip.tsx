import { FileSearch, Image as ImageIcon, ShieldCheck } from "lucide-react";

const provenanceItems = [
  {
    icon: ImageIcon,
    label: "visual role",
    value: "operational context",
  },
  {
    icon: FileSearch,
    label: "source status",
    value: "externally attributed",
  },
  {
    icon: ShieldCheck,
    label: "evidence boundary",
    value: "not inference output",
  },
];

export function VisualProvenanceStrip({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-2 ${compact ? "md:grid-cols-3" : "sm:grid-cols-3"}`}>
      {provenanceItems.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex min-w-0 items-center gap-2 border border-signal-line/70 bg-signal-panel/64 px-3 py-2">
          <Icon className="h-3.5 w-3.5 shrink-0 text-signal-green/70" />
          <div className="min-w-0">
            <div className="font-mono text-[0.52rem] uppercase text-signal-dim">{label}</div>
            <div className="truncate font-mono text-[0.58rem] uppercase text-signal-muted">{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
