import { AlertTriangle, CameraOff, DatabaseZap, FileX2, TimerReset, WifiOff, type LucideIcon } from "lucide-react";

const unavailableStates: Array<{
  icon: LucideIcon;
  label: string;
  surface: string;
  detail: string;
}> = [
  {
    icon: CameraOff,
    label: "model unavailable",
    surface: "perception lab",
    detail: "If browser-side inference cannot load, detections remain unavailable instead of simulated.",
  },
  {
    icon: AlertTriangle,
    label: "no detections emitted",
    surface: "model output",
    detail: "Empty frames are recorded as empty frames; no bounding boxes or confidence values are fabricated.",
  },
  {
    icon: WifiOff,
    label: "collector offline",
    surface: "source ingestion",
    detail: "Source health reports offline or delayed states directly through collector telemetry.",
  },
  {
    icon: TimerReset,
    label: "insufficient window",
    surface: "evaluation",
    detail: "Temporal claims wait until a real observation window has enough frames or source events.",
  },
  {
    icon: FileX2,
    label: "packet not exported",
    surface: "evidence packet",
    detail: "The interface can show the export schema without pretending an evidence packet exists.",
  },
  {
    icon: DatabaseZap,
    label: "source missing",
    surface: "provenance",
    detail: "A claim without a usable source trace should stay unresolved, not become narrative filler.",
  },
];

export function UnavailableStatesGallery({ title = "unavailable states gallery" }: { title?: string }) {
  return (
    <section className="console-panel p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
        <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">{title}</div>
        <div className="font-mono text-[0.58rem] uppercase text-signal-dim">absence is observable / absence is not guessed</div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {unavailableStates.map(({ icon: Icon, label, surface, detail }) => (
          <article key={label} className="border border-[#101b15] bg-[#050806]/66 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase text-signal-green/78">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
              <div className="border border-signal-line/70 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase text-signal-dim">{surface}</div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-signal-muted">{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
