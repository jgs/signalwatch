"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ConsoleEntry } from "@/components/landing/console-entry";
import { OrientationStrip } from "@/components/landing/orientation-strip";

const words = ["Real sources.", "Clear evidence.", "Model behavior.", "Failure visibility."];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(155,216,179,0.10),transparent_32rem)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-signal-green/18" />
      <motion.div
        className="absolute left-1/2 top-[20%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-signal-line/45"
        animate={{ opacity: [0.16, 0.28, 0.16], scale: [0.99, 1.01, 0.99] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-signal-green/80">SIGNALWATCH</div>
          <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-tight text-signal-text md:text-6xl">
            Understand what AI systems are doing
            <br />
            <span className="text-signal-muted">with evidence, not guesswork.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-signal-muted">
            SIGNALWATCH watches real AI sources and real browser-side vision model outputs. It shows where information came from, when the system is uncertain, and when a model fails to detect something.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid max-w-3xl gap-3 text-sm text-signal-muted md:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {words.map((word) => (
            <motion.div
              key={word}
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
              className="border-l border-signal-line bg-signal-panel/58 px-4 py-3 font-mono text-[0.72rem] uppercase"
            >
              {word}
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }} className="mt-8">
          <OrientationStrip />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.7 }} className="mt-16">
          <ConsoleEntry />
        </motion.div>

        <div className="absolute bottom-8 left-6 right-6 flex flex-wrap items-center justify-between gap-3 border-t border-signal-line/55 pt-4 font-mono text-[0.64rem] uppercase text-signal-dim md:left-6 md:right-6">
          <Link href="/safety" className="transition hover:text-signal-muted">AI safety</Link>
          <Link href="/evaluations" className="transition hover:text-signal-muted">evaluations</Link>
          <Link href="/labs/perception" className="transition hover:text-signal-muted">perception lab</Link>
          <Link href="/case-studies" className="transition hover:text-signal-muted">case studies</Link>
          <Link href="/methodology" className="transition hover:text-signal-muted">methodology</Link>
          <Link href="/timeline" className="transition hover:text-signal-muted">timeline</Link>
          <Link href="/systems" className="hidden transition hover:text-signal-muted sm:inline">systems node</Link>
        </div>
      </section>
    </main>
  );
}
