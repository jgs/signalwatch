"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Panel, PanelHeader } from "@/components/ui/panel";
import type { RealtimeEvent } from "@/lib/types";
import { cn, severityClass, timeOnly } from "@/lib/utils";

export function ActivityStream({ events }: { events: RealtimeEvent[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0;
  }, [events.length]);

  return (
    <Panel className="overflow-hidden">
      <PanelHeader title="realtime event stream" meta={`${events.length} websocket frames`} />
      <div ref={viewportRef} className="event-stream-mask max-h-[430px] space-y-1 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {events.slice(0, 28).map((event, index) => (
          <motion.div
            key={`${event.timestamp}-${index}`}
            layout
            initial={{ opacity: 0, y: -5, filter: "blur(3px)" }}
            animate={{ opacity: Math.max(0.34, 1 - index * 0.032), y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.24 }}
            className={cn(
              "grid grid-cols-[5.9rem_3.4rem_1fr] gap-2 border-l bg-[#050806]/70 py-1.5 pl-2.5 pr-2 font-mono text-[0.66rem] text-signal-muted",
              severityClass(event.payload.severity)
            )}
          >
            <span className="whitespace-nowrap text-signal-green">[{timeOnly(event.timestamp).replace(" UTC", "")}]</span>
            <span className="truncate uppercase text-signal-dim">{event.payload.severity ?? "TRACE"}</span>
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 border border-signal-line px-1 text-[0.58rem] uppercase text-signal-dim">{event.payload.category ?? event.type}</span>
                <span className="truncate text-signal-olive">{event.payload.source ?? "signalwatch"}</span>
              </div>
              <div className="mt-0.5 truncate text-signal-muted">{messageFor(event)}</div>
            </div>
          </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Panel>
  );
}

function messageFor(event: RealtimeEvent) {
  if (event.payload.message) return event.payload.message;
  if (event.type === "trend.detected" || event.type === "trend.acceleration.detected") {
    return `trend acceleration detected :: ${String(event.payload.keyword ?? "cross-source momentum")}`;
  }
  if (event.type === "collection.completed") return "collector mesh synced :: websocket broadcast emitted";
  if (event.type === "websocket.activity") return "websocket throughput frame acknowledged";
  if (event.type === "scoring.completed") return "importance score recomputed for active signal";
  return "signal normalized and routed";
}
