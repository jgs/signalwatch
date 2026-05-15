"use client";

import { motion } from "framer-motion";

export function Topbar({ connected, lastUpdate }: { connected: boolean; lastUpdate: string }) {
  return (
    <header className="console-panel flex items-center justify-between gap-6 px-5 py-5">
      <div>
        <div className="font-mono text-[0.72rem] uppercase text-signal-green">AI observability / research intelligence</div>
        <h1 className="mt-6 text-[1.55rem] font-semibold text-signal-text">ecosystem signal console</h1>
        <p className="mt-7 text-sm text-signal-muted">papers, releases, alignment discourse, model movement, and infrastructure drift</p>
      </div>
      <div className="flex items-center gap-2 font-mono text-[0.72rem] text-signal-muted">
        <motion.span
          className="h-2 w-2 rounded-full bg-signal-green"
          animate={{ boxShadow: connected ? ["0 0 0 0 rgba(137,227,173,.42)", "0 0 0 8px rgba(137,227,173,0)", "0 0 0 0 rgba(137,227,173,0)"] : "none" }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <span>{connected ? "LIVE" : "SYNCING"}</span>
        <span>last update {lastUpdate}</span>
      </div>
    </header>
  );
}

