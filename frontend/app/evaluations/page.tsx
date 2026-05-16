"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, AlertTriangle, Eye, Gauge, Network, ScanSearch, ShieldCheck, type LucideIcon } from "lucide-react";
import { fetchSafetySources } from "@/lib/api";
import type { SafetySource } from "@/lib/types";

const evaluationLayers = [
  {
    icon: Eye,
    title: "Perception robustness",
    body: "Vision systems can lose reliability when input quality changes: blur, low light, occlusion, compression, cropping, and motion can alter what the model reports.",
    evidence: ["Browser-side COCO-SSD lab", "real detection outputs only"],
  },
  {
    icon: Gauge,
    title: "Evaluation reliability",
    body: "Evaluation is not only a benchmark score. It includes coverage, deployment conditions, monitoring, failure visibility, and whether tests match real operating environments.",
    evidence: ["OpenAI Preparedness Framework", "NIST AI RMF"],
  },
  {
    icon: Network,
    title: "Distribution shift",
    body: "Models can behave differently when inputs, tasks, users, tools, or operating contexts change from the conditions used during development and evaluation.",
    evidence: ["NIST AI RMF", "frontier-risk frameworks"],
  },
  {
    icon: AlertTriangle,
    title: "Failure visibility",
    body: "A robust system should expose missed detections, unstable confidence, disappearing objects, source drift, and uncertainty instead of hiding failure states.",
    evidence: ["perception telemetry", "provenance surfaces"],
  },
  {
    icon: Activity,
    title: "Monitoring requirements",
    body: "Operational systems need instrumentation: source timestamps, collector health, confidence history, traceability, provenance, and observable degradation paths.",
    evidence: ["SIGNALWATCH console", "methodology boundary"],
  },
  {
    icon: ShieldCheck,
    title: "Frontier evaluation gaps",
    body: "More capable systems require evaluation of autonomy, cyber misuse, CBRN misuse, persuasion, loss-of-control risk, safeguards, and post-deployment monitoring.",
    evidence: ["OpenAI Preparedness", "Anthropic RSP"],
  },
];

const failureModes = [
  ["missed detection", "object is present, but the model emits no detection"],
  ["confidence instability", "confidence changes across adjacent degraded frames"],
  ["identity switching", "detected class changes as input conditions shift"],
  ["temporal inconsistency", "object continuity breaks across recent frames"],
  ["frame integrity loss", "recent inference frames produce no usable detections"],
];

export default function EvaluationsPage() {
  const [sources, setSources] = useState<SafetySource[]>([]);
  const sourceMap = useMemo(() => new Map(sources.map((source) => [source.id, source])), [sources]);

  useEffect(() => {
    fetchSafetySources().then(setSources).catch(() => setSources([]));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030403] text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(71,108,81,0.11),transparent_30rem)]" />
      <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(137,227,173,.28)_1px,transparent_1px),linear-gradient(90deg,rgba(137,227,173,.18)_1px,transparent_1px)] [background-size:38px_38px]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <Nav />
        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">evaluation and robustness</div>
          <h1 className="mt-9 max-w-4xl text-4xl font-semibold leading-tight text-[#eef4ef] md:text-6xl">
            Operational visibility
            <br />
            <span className="text-[#aeb8b1]">into evaluation reliability and model failure modes.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-signal-muted">
            Evaluation matters because AI systems can appear reliable in controlled settings while failing under distribution shift, degraded inputs, limited oversight, or deployment conditions that were not covered by tests.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {evaluationLayers.map((layer) => (
            <LayerCard key={layer.title} {...layer} />
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <Panel title="perception robustness interface" icon={ScanSearch} meta="real outputs only">
            <p className="text-sm leading-relaxed text-signal-muted">
              The perception lab applies degradation to webcam or uploaded frames before browser-side COCO-SSD inference. Detection boxes, confidence traces, persistence, replay, and frame integrity are computed only from model outputs.
            </p>
            <div className="mt-4 grid gap-2 font-mono text-[0.62rem] uppercase text-signal-dim sm:grid-cols-2">
              {["blur", "low light", "occlusion", "compression", "crop instability", "motion blur"].map((item) => (
                <div key={item} className="border-l border-[#24392c] bg-[#050806]/62 px-3 py-2">{item}</div>
              ))}
            </div>
            <Link href="/labs/perception" className="mt-5 inline-flex border border-[#203528] bg-[#07100b] px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-[#3e654c]">
              open perception lab
            </Link>
          </Panel>

          <Panel title="failure visibility" icon={AlertTriangle} meta="observable failure states">
            <div className="space-y-3">
              {failureModes.map(([label, text]) => (
                <div key={label} className="border border-[#101b15] bg-[#050806]/70 p-3">
                  <div className="font-mono text-[0.62rem] uppercase text-signal-green/75">{label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-signal-muted">{text}</p>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-5 console-panel p-5">
          <div className="flex flex-col justify-between gap-3 border-b border-[#101b15] pb-3 md:flex-row md:items-center">
            <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">operational case studies</div>
            <div className="font-mono text-[0.6rem] uppercase text-signal-dim">reproducible protocols / evidence generated locally</div>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-signal-muted">
            SIGNALWATCH case studies are short engineering records for running degradation protocols, collecting model-output evidence, and documenting observed failure states without prefilled conclusions.
          </p>
          <Link href="/case-studies" className="mt-5 inline-flex border border-[#203528] bg-[#07100b] px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-[#3e654c]">
            open case studies
          </Link>
        </section>

        <section className="mt-5 console-panel p-5">
          <div className="flex flex-col justify-between gap-3 border-b border-[#101b15] pb-3 md:flex-row md:items-center">
            <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">evaluation source registry</div>
            <div className="font-mono text-[0.6rem] uppercase text-signal-dim">framework-backed / no fabricated policy claims</div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {["openai-preparedness", "anthropic-rsp-v3", "nist-ai-rmf", "oecd-ai-work", "stanford-ai-index-2025"].map((id) => {
              const source = sourceMap.get(id);
              return (
                <a key={id} href={source?.url ?? "#"} target="_blank" className="border border-[#101b15] bg-[#050806]/70 p-4 transition hover:border-[#2f4a39]">
                  <div className="font-mono text-[0.62rem] uppercase text-signal-green/75">{source?.publisher ?? id} / {source?.reliability ?? "registry"}</div>
                  <div className="mt-3 text-sm font-semibold text-signal-text">{source?.title ?? id}</div>
                  <p className="mt-2 text-sm leading-relaxed text-signal-muted">{source?.summary ?? "Source registry item loading."}</p>
                </a>
              );
            })}
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
        <Link href="/evaluations" className="text-signal-green/80 transition hover:text-signal-green">evaluations</Link>
        <Link href="/case-studies" className="transition hover:text-signal-text">case studies</Link>
        <Link href="/labs/perception" className="transition hover:text-signal-text">perception</Link>
        <Link href="/methodology" className="transition hover:text-signal-text">methodology</Link>
      </div>
    </nav>
  );
}

function LayerCard({ icon: Icon, title, body, evidence }: { icon: LucideIcon; title: string; body: string; evidence: string[] }) {
  return (
    <article className="border border-[#101b15] bg-[#050806]/70 p-5 transition hover:border-[#24392c]">
      <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-signal-muted">{body}</p>
      <div className="mt-4 space-y-1 font-mono text-[0.58rem] uppercase text-signal-dim">
        {evidence.map((item) => <div key={item}>evidence / {item}</div>)}
      </div>
    </article>
  );
}

function Panel({ title, icon: Icon, meta, children }: { title: string; icon: LucideIcon; meta: string; children: ReactNode }) {
  return (
    <section className="console-panel p-5">
      <div className="flex items-center justify-between border-b border-[#101b15] pb-3">
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80"><Icon className="h-3.5 w-3.5" />{title}</div>
        <span className="font-mono text-[0.62rem] uppercase text-signal-dim">{meta}</span>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
