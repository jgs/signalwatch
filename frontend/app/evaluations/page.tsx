"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, AlertTriangle, Eye, Gauge, Network, ScanSearch, ShieldCheck, type LucideIcon } from "lucide-react";
import { fetchSafetySources } from "@/lib/api";
import { EvidencePacketPreview } from "@/components/education/evidence-packet-preview";
import { OperationalBoundaryPanel } from "@/components/education/operational-boundary-panel";
import { RealWorldImageBand } from "@/components/education/real-world-image-band";
import { SourceRegistryVisual } from "@/components/education/source-registry-visual";
import { UnavailableStatesGallery } from "@/components/education/unavailable-states-gallery";
import { OperationalNav } from "@/components/layout/operational-nav";
import { SystemStatusBar } from "@/components/layout/system-status-bar";
import { PERCEPTION_DATASET_SEQUENCES, perceptionDatasetSummary } from "@/lib/perception-datasets";
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
  const datasetSummary = useMemo(() => perceptionDatasetSummary(), []);

  useEffect(() => {
    fetchSafetySources().then(setSources).catch(() => setSources([]));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(155,216,179,0.09),transparent_30rem)]" />
      <div className="absolute inset-0 opacity-[0.032] [background-image:linear-gradient(rgba(155,216,179,.24)_1px,transparent_1px),linear-gradient(90deg,rgba(155,216,179,.16)_1px,transparent_1px)] [background-size:40px_40px]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <OperationalNav active="evaluations" />
        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-signal-green/80">evaluation</div>
          <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-tight text-signal-text md:text-5xl">
            Testing AI systems means looking for failures
            <br />
            <span className="text-signal-muted">before they matter in the real world.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-sm leading-relaxed text-signal-muted">
            This page explains what SIGNALWATCH checks: degraded inputs, missed detections, unstable confidence, source provenance, and whether results are traceable to real evidence.
          </p>
          <Link
            href="/learn/glossary"
            className="mt-5 inline-flex border border-signal-line bg-signal-panel2/60 px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-signal-green/50"
          >
            explain the terms
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {evaluationLayers.map((layer) => (
            <LayerCard key={layer.title} {...layer} />
          ))}
        </section>

        <div className="mt-5">
          <OperationalBoundaryPanel title="evaluation evidence boundary" />
        </div>

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

        <div className="mt-5">
          <EvidencePacketPreview title="evaluation evidence packet shape" />
        </div>

        <div className="mt-5">
          <UnavailableStatesGallery title="evaluation unavailable states" />
        </div>

        <div className="mt-5">
          <RealWorldImageBand
            title="evaluation visual context"
            description="These photos show ordinary conditions that can make evaluation harder: low light, camera placement, motion blur, monitoring rooms, sensor boundaries, and coverage limits. They are source-attributed context images, not precomputed detections or benchmark results."
          />
        </div>

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

        <div className="mt-5">
          <SourceRegistryVisual />
        </div>

        <section className="mt-5 console-panel p-5">
          <div className="flex flex-col justify-between gap-3 border-b border-[#101b15] pb-3 md:flex-row md:items-center">
            <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">perception dataset registry</div>
            <div className="font-mono text-[0.6rem] uppercase text-signal-dim">
              {datasetSummary.total} protocols / {datasetSummary.assetBacked} asset-backed
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-signal-muted">
            The current registry defines real capture/import protocols for robustness sequences. It does not ship fabricated detections, expected confidence values, or precomputed continuity claims.
          </p>
          <div className="mt-5 grid gap-2 font-mono text-[0.58rem] uppercase text-signal-dim md:grid-cols-5">
            {PERCEPTION_DATASET_SEQUENCES.map((sequence) => (
              <div key={sequence.id} className="border-l border-[#24392c] bg-[#050806]/62 px-3 py-2">
                <div className="text-signal-green/70">{sequence.scenarioType}</div>
                <div className="mt-1">{sequence.assetStatus.replace("-", " ")}</div>
              </div>
            ))}
          </div>
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
        <SystemStatusBar />
      </section>
    </main>
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
