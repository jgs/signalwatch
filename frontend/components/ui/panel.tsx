import * as React from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <section className={cn("console-panel p-3.5 md:p-4", className)} {...props} />;
}

export function PanelHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="font-mono text-[0.68rem] uppercase text-signal-green/80">{title}</h2>
      {meta ? <span className="font-mono text-[0.58rem] uppercase text-signal-dim">{meta}</span> : null}
    </div>
  );
}
