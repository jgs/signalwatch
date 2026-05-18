"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, Database, Radio } from "lucide-react";
import { fetchTimeline } from "@/lib/api";
import type { OperationalTimeline } from "@/lib/types";

const driftLabels: Record<string, string> = {
  capability_acceleration: "capability acceleration",
  alignment_intensity: "alignment intensity",
  governance_pressure: "governance pressure",
  multimodal_saturation: "multimodal saturation",
  agentic_momentum: "agentic momentum",
};

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<OperationalTimeline | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTimeline().then((data) => {
      if (!cancelled) setTimeline(data);
    }).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030403] text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_12%,rgba(71,108,81,0.10),transparent_30rem)]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <nav className="flex items-center justify-between border-b border-[#101b15] pb-4 font-mono text-[0.68rem] uppercase text-signal-dim">
          <Link href="/" className="text-signal-green/80 transition hover:text-signal-green">SIGNALWATCH</Link>
          <div className="flex items-center gap-4">
            <Link href="/console" className="transition hover:text-signal-text">console</Link>
            <Link href="/systems" className="transition hover:text-signal-text">systems</Link>
            <span>timeline</span>
          </div>
        </nav>

        <header className="grid gap-10 py-16 lg:grid-cols-[1.1fr_.9fr]">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">operational timeline</div>
            <h1 className="mt-9 max-w-3xl text-4xl font-semibold leading-tight text-[#eef4ef] md:text-6xl">
              Ecosystem memory,
              <br />
              signal epochs,
              <br />
              <span className="text-[#aeb8b1]">and daily intelligence briefings.</span>
            </h1>
          </motion.div>
          <BriefingPanel timeline={timeline} />
        </header>

        <section className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <DriftPanel timeline={timeline} />
          <EpochPanel timeline={timeline} />
        </section>
      </section>
    </main>
  );
}

function BriefingPanel({ timeline }: { timeline: OperationalTimeline | null }) {
  return (
    <div className="console-panel p-5">
      <SectionLabel icon={Radio} label="daily intelligence brief" meta={timeline?.date ?? "awaiting memory"} />
      <div className="mt-5 font-mono text-[0.72rem] uppercase text-signal-green/80">{timeline?.briefing.title ?? "Operational Summary"}</div>
      <div className="mt-5 space-y-3 text-sm leading-relaxed text-signal-muted">
        {(timeline?.briefing.lines ?? ["Awaiting sufficient real ecosystem activity to form a daily briefing."]).map((line) => (
          <p key={line} className="border-l border-[#24392c] bg-[#050806]/62 px-3 py-2">{line}</p>
        ))}
      </div>
    </div>
  );
}

function DriftPanel({ timeline }: { timeline: OperationalTimeline | null }) {
  const drift = timeline?.drift ?? {};
  return (
    <div className="console-panel p-5">
      <SectionLabel icon={Activity} label="ecosystem drift" meta="temporal pressure" />
      <div className="mt-5 space-y-4">
        {Object.entries(driftLabels).map(([key, label]) => {
          const value = Number(drift[key as keyof typeof drift] ?? 0);
          return <DriftRow key={key} label={label} value={value} />;
        })}
      </div>
    </div>
  );
}

function EpochPanel({ timeline }: { timeline: OperationalTimeline | null }) {
  const epochs = timeline?.epochs ?? [];
  return (
    <div className="console-panel p-5">
      <SectionLabel icon={Clock} label="signal epochs" meta={`${epochs.length} windows`} />
      <div className="mt-5 space-y-3">
        {epochs.length === 0 ? (
          <div className="font-mono text-[0.72rem] text-signal-muted">historical memory awaiting topic stabilization</div>
        ) : (
          epochs.map((epoch, index) => (
            <motion.div
              key={`${epoch.kind}-${epoch.topic}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.045 }}
              className="border border-[#101b15] bg-[#050806]/72 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">{epoch.kind}</div>
                  <h2 className="mt-2 font-mono text-sm uppercase text-signal-text">{epoch.topic}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-signal-muted">{epoch.summary}</p>
                </div>
                <div className="text-right font-mono text-[0.64rem] uppercase text-signal-dim">
                  <div>{epoch.maturity}</div>
                  <div>{epoch.observation_count} obs</div>
                </div>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <TraceBar label="pressure" value={epoch.pressure} />
                <TraceBar label="stability" value={epoch.stability} />
                <TraceBar label="confidence" value={epoch.confidence} />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function DriftRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="font-mono text-[0.68rem] uppercase text-signal-dim">
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="text-signal-muted">{value.toFixed(2)}</span>
      </div>
      <div className="mt-2 h-1.5 border border-[#122219] bg-[#07100b]">
        <motion.div
          className="h-full bg-signal-olive"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(3, Math.min(100, value * 100))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function TraceBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="font-mono text-[0.62rem] uppercase text-signal-dim">
      <div className="flex justify-between gap-2">
        <span>{label}</span>
        <span>{Math.round(value * 100)}</span>
      </div>
      <div className="mt-1 h-1 border border-[#122219] bg-[#07100b]">
        <div className="h-full bg-signal-green/70" style={{ width: `${Math.max(3, Math.min(100, value * 100))}%` }} />
      </div>
    </div>
  );
}

function SectionLabel({ icon: Icon, label, meta }: { icon: typeof Database; label: string; meta: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#101b15] pb-3">
      <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className="font-mono text-[0.62rem] uppercase text-signal-dim">{meta}</span>
    </div>
  );
}
