"use client";

import { motion } from "framer-motion";
import { ConsoleEntry } from "@/components/landing/console-entry";

const words = ["Research.", "Alignment.", "Operational telemetry.", "Ecosystem drift."];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030403] text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(72,104,78,0.16),transparent_34rem)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-signal-green/20" />
      <motion.div
        className="absolute left-1/2 top-[18%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-[#16251c]"
        animate={{ opacity: [0.22, 0.38, 0.22], scale: [0.98, 1.01, 0.98] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-[28%] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full border border-[#203428]"
        animate={{ opacity: [0.18, 0.3, 0.18], scale: [1.02, 0.99, 1.02] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">JGSOPS</div>
          <h1 className="mt-10 max-w-4xl text-4xl font-semibold leading-tight text-[#eef4ef] md:text-6xl">
            Realtime observability systems
            <br />
            <span className="text-[#aeb8b1]">for monitoring intelligent infrastructure.</span>
          </h1>
        </motion.div>

        <motion.div
          className="mt-14 grid max-w-2xl gap-3 font-mono text-sm uppercase tracking-normal text-signal-muted md:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {words.map((word) => (
            <motion.div
              key={word}
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
              className="border-l border-[#24392c] bg-[#050806]/52 px-4 py-3"
            >
              {word}
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.7 }} className="mt-16">
          <ConsoleEntry />
        </motion.div>

        <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between border-t border-[#101b15] pt-4 font-mono text-[0.64rem] uppercase text-signal-dim md:left-6 md:right-6">
          <span>Railway telemetry bus</span>
          <span>Vercel console surface</span>
          <span className="hidden sm:inline">jgsops.dev</span>
        </div>
      </section>
    </main>
  );
}
