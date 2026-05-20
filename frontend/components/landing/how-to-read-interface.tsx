import { Database, EyeOff, FileSearch, Image as ImageIcon } from "lucide-react";

const readingRules = [
  {
    icon: ImageIcon,
    title: "Visual context is not telemetry",
    text: "Photos and generated images help explain the setting. They do not count as detections, metrics, or operational claims.",
  },
  {
    icon: FileSearch,
    title: "Evidence needs a source",
    text: "Claims should point back to a source, a timestamp, a model output, or an explicit methodology boundary.",
  },
  {
    icon: EyeOff,
    title: "Missing data stays visible",
    text: "If the system lacks data or a model is unavailable, the interface should say that instead of filling the gap.",
  },
  {
    icon: Database,
    title: "Start with the surface map",
    text: "Use the map below to choose whether you want sources, safety, evaluation, perception labs, or market context.",
  },
];

export function HowToReadInterface() {
  return (
    <section className="console-panel p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
        <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">how to read this interface</div>
        <div className="font-mono text-[0.58rem] uppercase text-signal-dim">plain guide / navigation first</div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {readingRules.map(({ icon: Icon, title, text }) => (
          <div key={title} className="border border-[#101b15] bg-[#050806]/66 p-4">
            <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase text-signal-green/75">
              <Icon className="h-3.5 w-3.5" />
              {title}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-signal-muted">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
