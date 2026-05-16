"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const bootLines = [
  "establishing telemetry stream",
  "syncing railway backend",
  "websocket route active",
  "opening signal console",
  "entering operational surface"
];

export function ConsoleEntry() {
  const router = useRouter();
  const [booting, setBooting] = useState(false);

  useEffect(() => {
    if (!booting) return;
    const timer = window.setTimeout(() => router.push("/console"), 1180);
    return () => window.clearTimeout(timer);
  }, [booting, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setBooting(true)}
        disabled={booting}
        aria-label="Enter SIGNALWATCH operational console"
        className="group inline-flex items-center gap-4 border border-[#2f4a39] bg-[#07100b]/76 px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-signal-green transition hover:border-signal-green/70 hover:bg-[#09140d] focus:outline-none focus:ring-1 focus:ring-signal-green/50 disabled:cursor-wait disabled:opacity-80"
      >
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-signal-green/80 transition group-hover:shadow-[0_0_14px_rgba(137,227,173,.42)]"
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        Enter Console
      </button>

      <AnimatePresence>
        {booting ? (
          <motion.div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#030403]/96 px-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <motion.div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(137,227,173,.28) 1px, transparent 1px), linear-gradient(90deg, rgba(137,227,173,.22) 1px, transparent 1px)",
                backgroundSize: "42px 42px"
              }}
              animate={{ opacity: [0.05, 0.11, 0.05] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-x-0 top-1/2 h-px bg-signal-green/20"
              animate={{ y: [-140, 140], opacity: [0, 0.38, 0] }}
              transition={{ duration: 1.05, ease: "easeInOut" }}
            />
            <div className="relative w-full max-w-xl border border-[#1a2b21] bg-[#050806]/82 p-5 shadow-console">
              <div className="flex items-center justify-between border-b border-[#101b15] pb-3 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-signal-dim">
                <span>JGSOPS / SIGNALWATCH</span>
                <span>boot sequence</span>
              </div>
              <div className="mt-5 space-y-2 font-mono text-[0.72rem] uppercase text-signal-muted">
                {bootLines.map((line, index) => (
                  <motion.div
                    key={line}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.16, duration: 0.24 }}
                  >
                    <span className="h-1 w-1 rounded-full bg-signal-green/70" />
                    <span>{line}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 h-px overflow-hidden bg-[#101b15]">
                <motion.div
                  className="h-full bg-signal-green/55"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.08, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
