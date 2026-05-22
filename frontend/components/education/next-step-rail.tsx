import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export type NextStep = {
  href: string;
  label: string;
  text: string;
  icon: LucideIcon;
};

export function NextStepRail({
  title = "next useful step",
  steps,
}: {
  title?: string;
  steps: NextStep[];
}) {
  return (
    <section className="console-panel p-5">
      <div className="border-b border-signal-line/60 pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">{title}</div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {steps.map(({ href, label, text, icon: Icon }) => (
          <Link key={href} href={href} className="group border border-signal-line bg-signal-panel/70 p-4 transition hover:border-signal-green/45 hover:bg-signal-panel2/60">
            <div className="flex items-center justify-between gap-3">
              <Icon className="h-4 w-4 text-signal-green/75" />
              <ArrowRight className="h-3.5 w-3.5 text-signal-dim transition group-hover:translate-x-1 group-hover:text-signal-green" />
            </div>
            <h3 className="mt-4 text-sm font-semibold leading-snug text-signal-text">{label}</h3>
            <p className="mt-2 text-xs leading-relaxed text-signal-muted">{text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
