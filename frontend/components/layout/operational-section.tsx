import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type OperationalSectionProps = {
  title: string;
  meta: string;
  icon?: LucideIcon;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function OperationalSection({ title, meta, icon: Icon, description, children, className = "" }: OperationalSectionProps) {
  return (
    <section className={`console-panel p-4 sm:p-5 ${className}`}>
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            {title}
          </div>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-signal-muted">{description}</p> : null}
        </div>
        <div className="shrink-0 font-mono text-[0.58rem] uppercase text-signal-dim">{meta}</div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
