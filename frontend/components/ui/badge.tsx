import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-[#132018] bg-[#07100b]/72 px-1.5 py-0.5 font-mono text-[0.58rem] uppercase text-signal-dim",
        className
      )}
      {...props}
    />
  );
}
