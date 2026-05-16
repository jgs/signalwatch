"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Panel, PanelHeader } from "@/components/ui/panel";
import type { RealtimeEvent } from "@/lib/types";
import { cn, severityClass, timeOnly } from "@/lib/utils";

export function ActivityStream({ events }: { events: RealtimeEvent[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const telemetryEvents = events.filter((event) =>
    ["system.heartbeat", "telemetry.update", "collector.health", "source.latency", "watcher.reconnect"].includes(event.type)
  );

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [events.length]);

  return (
    <Panel className="overflow-hidden opacity-85">
      <details open>
        <summary className="cursor-pointer list-none">
          <PanelHeader title="background telemetry" meta={`${telemetryEvents.length} quiet frames`} />
        </summary>
      <div ref={viewportRef} className="event-stream-mask max-h-[260px] space-y-1 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {telemetryEvents.slice(0, 18).map((event, index) => (
          <motion.div
            key={event.id ?? `${event.timestamp}-${event.type}-${index}`}
            layout
            initial={{ opacity: 0, y: -4, filter: "blur(2px)" }}
            animate={{
              opacity: Math.max(0.28, 1 - index * 0.028),
              y: 0,
              filter: "blur(0px)",
              backgroundColor: index === 0 ? ["rgba(7,16,11,.88)", "rgba(5,8,6,.72)"] : "rgba(5,8,6,.72)"
            }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className={cn(
              "relative grid grid-cols-[5.9rem_4.2rem_1fr] gap-2 border-l py-1.5 pl-2.5 pr-2 font-mono text-[0.62rem] text-signal-dim",
              severityClass(event.payload.severity),
              event.type === "system.heartbeat" && "opacity-75"
            )}
          >
            {index < 6 ? <span className="absolute left-0 top-0 h-full w-px bg-signal-green/20" /> : null}
            <motion.span
              className="whitespace-nowrap text-signal-green/90"
              animate={event.type === "system.heartbeat" ? { opacity: [0.52, 0.95, 0.52] } : { opacity: index < 2 ? [0.78, 1, 0.78] : 0.78 }}
              transition={{ duration: event.type === "system.heartbeat" ? 2.8 : 3.6, repeat: Infinity }}
            >
              [{timeOnly(event.timestamp).replace(" UTC", "")}]
            </motion.span>
            <span className={cn("truncate uppercase", severityText(event.payload.severity))}>{event.payload.severity ?? "TRACE"}</span>
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 border border-signal-line px-1 text-[0.58rem] uppercase text-signal-dim">{event.payload.category ?? event.type}</span>
                <span className="truncate text-signal-olive">{event.payload.source ?? "signalwatch"}</span>
              </div>
              <div className="mt-0.5 truncate text-signal-dim">{messageFor(event)}</div>
            </div>
          </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </details>
    </Panel>
  );
}

function severityText(severity: RealtimeEvent["payload"]["severity"]) {
  if (severity === "CRITICAL") return "text-signal-danger";
  if (severity === "ALERT") return "text-signal-amber";
  if (severity === "ELEVATED") return "text-signal-olive";
  if (severity === "WATCH") return "text-signal-green";
  return "text-signal-dim";
}

function messageFor(event: RealtimeEvent) {
  if (event.payload.message) return event.payload.message;
  if (event.type === "system.heartbeat") return "runtime heartbeat";
  if (event.type === "collector.health") return "collector health changed";
  if (event.type === "source.latency") return "source latency update";
  if (event.type === "watcher.reconnect") return "collector reconnect update";
  return "telemetry frame";
}
