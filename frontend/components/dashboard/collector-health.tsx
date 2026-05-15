"use client";

import { motion } from "framer-motion";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { sourceLabel } from "@/lib/api";
import type { CollectorHealth as CollectorHealthType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CollectorHealth({ health }: { health: CollectorHealthType[] }) {
  return (
    <Panel>
      <PanelHeader title="collector health" meta="source telemetry" />
      <div className="space-y-2">
        {health.length === 0 ? (
          <div className="font-mono text-[0.72rem] text-signal-muted">collector mesh awaiting first telemetry frame</div>
        ) : (
          health.map((entry, index) => (
            <motion.div
              key={entry.source}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.025 }}
              className="border border-[#101b15] bg-[#050806] px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3 font-mono text-[0.7rem]">
                <span className="flex items-center gap-2 text-signal-muted">
                  <motion.span
                    className={cn("h-1.5 w-1.5 rounded-full", stateColor(entry.state))}
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: entry.state === "HEALTHY" ? 2.6 : 1.4, repeat: Infinity, delay: index * 0.12 }}
                  />
                  {sourceLabel(entry.source)}
                </span>
                <span className={cn("uppercase", stateText(entry.state))}>{entry.state}</span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2 font-mono text-[0.64rem] text-signal-dim">
                <span>{Math.round(entry.latency_ms)}ms</span>
                <span>{entry.item_count} artifacts</span>
                <span>{entry.retry_count} retry</span>
                <span>{Math.round(entry.failure_rate * 100)}% fail</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Panel>
  );
}

function stateColor(state: CollectorHealthType["state"]) {
  if (state === "HEALTHY") return "bg-signal-green shadow-[0_0_10px_rgba(137,227,173,.45)]";
  if (state === "DELAYED") return "bg-signal-amber";
  if (state === "DEGRADED") return "bg-signal-olive";
  return "bg-signal-danger";
}

function stateText(state: CollectorHealthType["state"]) {
  if (state === "HEALTHY") return "text-signal-green";
  if (state === "OFFLINE") return "text-signal-danger";
  if (state === "DELAYED") return "text-signal-amber";
  return "text-signal-olive";
}
