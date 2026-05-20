"use client";

import Link from "next/link";
import { CircuitBoard, Database, FlaskConical, Radio, ShieldCheck, Waves, type LucideIcon } from "lucide-react";
import { RealWorldImageBand } from "@/components/education/real-world-image-band";
import { VisualEvidenceLegend } from "@/components/education/visual-evidence-legend";
import { UnavailableStatesGallery } from "@/components/education/unavailable-states-gallery";
import { OperationalNav } from "@/components/layout/operational-nav";
import { SystemStatusBar } from "@/components/layout/system-status-bar";

const layers = [
  {
    icon: Database,
    title: "real AI source data",
    meta: "from sources",
    body: "Research papers, product releases, policy updates, safety posts, and forum discussions are collected with links and timestamps before they appear in the interface.",
    examples: ["arXiv", "Anthropic / OpenAI releases", "Alignment Forum / LessWrong", "safety registry with sources"],
  },
  {
    icon: CircuitBoard,
    title: "summaries from real sources",
    meta: "computed from sources",
    body: "Higher-level context is built from source activity, repeated topics, overlapping sources, time windows, and source links. It is not invented headline generation.",
    examples: ["source overlap", "tag frequency", "observation windows", "source traceability"],
  },
  {
    icon: Radio,
    title: "system health readings",
    meta: "runtime state",
    body: "System health readings describe whether SIGNALWATCH itself is connected and responding. Latency, collector health, reconnects, and heartbeats describe the app, not facts about the AI industry.",
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
    body: "Computer vision confidence, detection boxes, frame history, replay, and missing detections come from browser-side COCO-SSD outputs. Missing detections remain missing.",
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
    body: "SIGNALWATCH separates real data, derived context, conceptual explanation, and infrastructure telemetry so the interface can stay alive without fabricating intelligence.",
    examples: ["source registry", "source labels", "evidence trail", "unavailable states"],
  },
];

export default function MethodologyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_12%,rgba(71,108,81,0.11),transparent_30rem)]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(137,227,173,.28)_1px,transparent_1px),linear-gradient(90deg,rgba(137,227,173,.18)_1px,transparent_1px)] [background-size:36px_36px]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <OperationalNav active="methodology" />
        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">methodology</div>
          <h1 className="mt-9 max-w-4xl text-4xl font-semibold leading-tight text-signal-text md:text-6xl">
            What SIGNALWATCH treats as real,
            <br />
            <span className="text-signal-muted">derived, simulated, or conceptual.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-signal-muted">
            The system is designed to feel useful without pretending to know more than it does. This page explains the difference between real source data, summaries built from sources, app health readings, and educational examples.
          </p>
          <Link
            href="/learn/glossary"
            className="mt-5 inline-flex border border-signal-line bg-signal-panel2/60 px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-signal-green/50"
          >
            plain glossary
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {layers.map((layer) => (
            <MethodCard key={layer.title} {...layer} />
          ))}
        </section>

        <div className="mt-5">
          <VisualEvidenceLegend title="methodology visual legend" />
        </div>

        <div className="mt-5">
          <RealWorldImageBand
            title="method boundary image gallery"
            description="The methodology separates visual context from evidence. These images make the boundary concrete: a scene can explain why an evaluation matters, but detections, confidence, continuity, and operational claims still have to come from actual source data or model outputs."
          />
        </div>

        <section className="mt-5 console-panel p-5">
          <div className="flex flex-col justify-between gap-3 border-b border-signal-line pb-3 md:flex-row md:items-center">
            <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">operational rule</div>
            <div className="font-mono text-[0.6rem] uppercase text-signal-dim">real data stays traceable / missing data stays visible</div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Boundary title="Claims about AI" text="Must come from a real source or from activity collected from real sources." />
            <Boundary title="Model confidence" text="Must come from actual browser-side inference outputs." />
            <Boundary title="Case studies" text="Must be reproducible from protocols and evidence packets, not prewritten analytics." />
            <Boundary title="Observation windows" text="Must describe timestamped collection, source overlap, recurrence, or model-output history." />
          </div>
        </section>

        <div className="mt-5">
          <UnavailableStatesGallery title="methodology unavailable states" />
        </div>

        <section className="mt-5 grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
          <div className="console-panel overflow-hidden p-3">
            <img
              src="/education/evidence-loop.svg"
              alt="Evidence loop diagram showing real-world input, model behavior, observed facts, and monitoring action."
              className="w-full"
            />
          </div>
          <div className="console-panel p-5">
            <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">plain-language guide</div>
            <h2 className="mt-4 text-2xl font-semibold text-signal-text">How LLM training fits this system</h2>
            <p className="mt-4 text-sm leading-relaxed text-signal-muted">
              SIGNALWATCH monitors what happens after models are trained: real sources, outputs, failures, and source trails. The LLM guide explains the training path in simple terms.
            </p>
            <Link
              href="/learn/llm-training"
              className="mt-5 inline-flex border border-signal-line bg-signal-panel2 px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-signal-green/60"
            >
              open LLM guide
            </Link>
          </div>
        </section>
        <SystemStatusBar />
      </section>
    </main>
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
    <article className="border border-signal-line bg-signal-panel/70 p-5">
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
    <div className="border-l border-signal-green/40 bg-signal-panel/62 px-3 py-2">
      <div className="font-mono text-[0.6rem] uppercase text-signal-green/70">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-signal-muted">{text}</p>
    </div>
  );
}
