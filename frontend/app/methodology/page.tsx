"use client";

import Link from "next/link";
import { CircuitBoard, Database, FlaskConical, Radio, ShieldCheck, Waves, type LucideIcon } from "lucide-react";

const layers = [
  {
    icon: Database,
    title: "real ecosystem data",
    meta: "source-derived",
    body: "Research papers, release movement, policy updates, safety posts, and alignment discourse are collected through explicit ingestion pipelines and normalized before becoming operational signals.",
    examples: ["arXiv", "Anthropic / OpenAI releases", "Alignment Forum / LessWrong", "source-backed safety registry"],
  },
  {
    icon: CircuitBoard,
    title: "derived intelligence",
    meta: "computed from sources",
    body: "High-level signals are generated from aggregated source activity, tag frequency, temporal pressure, persistence, confidence, and provenance. They are not invented headlines.",
    examples: ["semantic clusters", "trend acceleration", "signal confidence", "source traceability"],
  },
  {
    icon: Radio,
    title: "operational telemetry",
    meta: "runtime surface",
    body: "Infrastructure telemetry describes the system's operational state. Latency, collector health, reconnects, heartbeats, and pressure rhythms may be simulated when they represent runtime behavior rather than factual ecosystem claims.",
    examples: ["collector latency", "websocket heartbeat", "retry counters", "system pressure"],
  },
  {
    icon: FlaskConical,
    title: "conceptual demos",
    meta: "labeled education",
    body: "Alignment and oversight demos are clearly marked as conceptual. They explain mechanisms such as proxy objectives or oversight gaps without making claims about specific deployed systems.",
    examples: ["alignment sandbox", "oversight gap", "reward hacking toy model"],
  },
  {
    icon: Waves,
    title: "browser-side perception",
    meta: "real model outputs",
    body: "Computer vision confidence, detection boxes, temporal consistency, replay, evidence packets, and persistence telemetry come from browser-side COCO-SSD outputs. Missing detections remain missing.",
    examples: ["webcam inference", "upload inference", "evidence packet", "confidence history"],
  },
  {
    icon: ShieldCheck,
    title: "case-study records",
    meta: "reproducible protocols",
    body: "Robustness case studies define setup, degradation, observation, operational implication, and evidence requirements. They do not ship with prefilled conclusions.",
    examples: ["low-light protocol", "occlusion protocol", "compression protocol", "motion protocol"],
  },
  {
    icon: ShieldCheck,
    title: "claim boundary",
    meta: "credibility rule",
    body: "SIGNALWATCH separates real data, derived signals, conceptual explanation, and infrastructure telemetry so the interface can stay alive without fabricating intelligence.",
    examples: ["source registry", "provenance panels", "real-only labels", "unavailable states"],
  },
];

export default function MethodologyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030403] text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_12%,rgba(71,108,81,0.11),transparent_30rem)]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(137,227,173,.28)_1px,transparent_1px),linear-gradient(90deg,rgba(137,227,173,.18)_1px,transparent_1px)] [background-size:36px_36px]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <Nav />
        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">methodology</div>
          <h1 className="mt-9 max-w-4xl text-4xl font-semibold leading-tight text-[#eef4ef] md:text-6xl">
            What SIGNALWATCH treats as real,
            <br />
            <span className="text-[#aeb8b1]">derived, simulated, or conceptual.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-signal-muted">
            The system is designed to feel alive without fabricating intelligence. This page defines the boundaries between source-backed ecosystem data, derived operational signals, runtime telemetry, and educational simulations.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {layers.map((layer) => (
            <MethodCard key={layer.title} {...layer} />
          ))}
        </section>

        <section className="mt-5 console-panel p-5">
          <div className="flex flex-col justify-between gap-3 border-b border-[#101b15] pb-3 md:flex-row md:items-center">
            <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">operational rule</div>
            <div className="font-mono text-[0.6rem] uppercase text-signal-dim">real data stays traceable / missing data stays visible</div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Boundary title="Ecosystem claims" text="Must be source-backed or derived from source-backed activity." />
            <Boundary title="Model confidence" text="Must come from actual browser-side inference outputs." />
            <Boundary title="Case studies" text="Must be reproducible from protocols and evidence packets, not prewritten analytics." />
            <Boundary title="Simulations" text="Must be labeled as infrastructure telemetry or conceptual education." />
          </div>
        </section>
      </section>
    </main>
  );
}

function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-[#101b15] pb-4 font-mono text-[0.68rem] uppercase text-signal-dim">
      <Link href="/" className="text-signal-green/80 transition hover:text-signal-green">JGSOPS</Link>
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Link href="/console" className="transition hover:text-signal-text">console</Link>
        <Link href="/safety" className="transition hover:text-signal-text">safety</Link>
        <Link href="/evaluations" className="transition hover:text-signal-text">evaluations</Link>
        <Link href="/labs/perception" className="transition hover:text-signal-text">perception</Link>
        <Link href="/case-studies" className="transition hover:text-signal-text">case studies</Link>
        <Link href="/methodology" className="text-signal-green/80 transition hover:text-signal-green">methodology</Link>
      </div>
    </nav>
  );
}

function MethodCard({
  icon: Icon,
  title,
  meta,
  body,
  examples,
}: {
  icon: LucideIcon;
  title: string;
  meta: string;
  body: string;
  examples: string[];
}) {
  return (
    <article className="border border-[#101b15] bg-[#050806]/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
          <Icon className="h-3.5 w-3.5" />
          {title}
        </div>
        <span className="font-mono text-[0.58rem] uppercase text-signal-dim">{meta}</span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-signal-muted">{body}</p>
      <div className="mt-4 space-y-1 font-mono text-[0.58rem] uppercase text-signal-dim">
        {examples.map((example) => (
          <div key={example}>trace / {example}</div>
        ))}
      </div>
    </article>
  );
}

function Boundary({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-l border-[#24392c] bg-[#050806]/62 px-3 py-2">
      <div className="font-mono text-[0.6rem] uppercase text-signal-green/70">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-signal-muted">{text}</p>
    </div>
  );
}
