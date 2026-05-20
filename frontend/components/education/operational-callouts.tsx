import { Ban, Database, Eye, ShieldAlert } from "lucide-react";

const callouts = [
  {
    icon: Database,
    label: "real source",
    detail: "Claims need source records or ingestion events.",
  },
  {
    icon: Eye,
    label: "model output only",
    detail: "Confidence and detections come from inference.",
  },
  {
    icon: ShieldAlert,
    label: "unavailable is valid",
    detail: "Missing data stays visible instead of guessed.",
  },
  {
    icon: Ban,
    label: "no prefilled claims",
    detail: "Protocols do not ship with conclusions.",
  },
];

export function OperationalCallouts({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-2 ${compact ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-4"}`}>
      {callouts.map(({ icon: Icon, label, detail }) => (
        <div key={label} className="border border-signal-line/70 bg-signal-panel/66 p-3">
          <div className="flex items-center gap-2 font-mono text-[0.58rem] uppercase text-signal-green/78">
            <Icon className="h-3.5 w-3.5" />
            {label}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-signal-muted">{detail}</p>
        </div>
      ))}
    </div>
  );
}
