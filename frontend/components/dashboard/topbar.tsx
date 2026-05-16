"use client";

import { motion } from "framer-motion";
import type { ConnectionState } from "@/lib/types";

export function Topbar({ connected, connectionState, lastUpdate }: { connected: boolean; connectionState: ConnectionState; lastUpdate: string }) {
  return (
    <header className="console-panel flex flex-col justify-between gap-6 px-5 py-5 md:flex-row md:items-center">
      <div>
        <div className="font-mono text-[0.72rem] uppercase text-signal-green">real AI ecosystem observability</div>
        <h1 className="mt-5 text-[1.55rem] font-semibold text-signal-text">source feed console</h1>
        <p className="mt-4 text-sm text-signal-muted">papers, releases, policy updates, safety posts, source timestamps, and provenance</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 font-mono text-[0.72rem] text-signal-muted">
        <motion.span
          className="h-2 w-2 rounded-full bg-signal-green"
          animate={{ boxShadow: connected ? ["0 0 0 0 rgba(137,227,173,.42)", "0 0 0 8px rgba(137,227,173,0)", "0 0 0 0 rgba(137,227,173,0)"] : "none" }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <span>{connectionLabel(connectionState)}</span>
        <span>last update {lastUpdate}</span>
      </div>
    </header>
  );
}

function connectionLabel(state: ConnectionState) {
  if (state === "live") return "LIVE";
  if (state === "reconnecting") return "RECONNECTING";
  if (state === "offline") return "OFFLINE";
  return "SYNCING";
}
