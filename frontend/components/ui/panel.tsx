import * as React from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <section className={cn("console-panel p-4", className)} {...props} />;
}

export function PanelHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="text-[0.95rem] font-semibold text-signal-text">{title}</h2>
      {meta ? <span className="font-mono text-[0.68rem] text-signal-muted">{meta}</span> : null}
    </div>
  );
}

