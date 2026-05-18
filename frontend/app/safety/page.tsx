"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Database, Shield, Wrench } from "lucide-react";
import { fetchAlignmentConcepts, fetchJobDisplacement, fetchRiskFrameworks, fetchSafetySources } from "@/lib/api";
import { RealWorldImageBand } from "@/components/education/real-world-image-band";
import { SafetyBridge } from "@/components/safety/safety-bridge";
import type { AlignmentConcept, JobExposureInsight, RiskCategory, SafetySource } from "@/lib/types";

export default function SafetyPage() {
  const [sources, setSources] = useState<SafetySource[]>([]);
  const [alignment, setAlignment] = useState<AlignmentConcept[]>([]);
  const [risks, setRisks] = useState<RiskCategory[]>([]);
  const [jobs, setJobs] = useState<JobExposureInsight[]>([]);
  const sourceIndex = useMemo(() => new Map(sources.map((source) => [source.id, source])), [sources]);

  useEffect(() => {
    Promise.allSettled([fetchSafetySources(), fetchAlignmentConcepts(), fetchRiskFrameworks(), fetchJobDisplacement()]).then((results) => {
      const [sourceResult, alignmentResult, riskResult, jobResult] = results;
      if (sourceResult.status === "fulfilled") setSources(sourceResult.value);
      if (alignmentResult.status === "fulfilled") setAlignment(alignmentResult.value);
      if (riskResult.status === "fulfilled") setRisks(riskResult.value);
      if (jobResult.status === "fulfilled") setJobs(jobResult.value);
    });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_14%,rgba(155,216,179,0.09),transparent_30rem)]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <Nav />
        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-signal-green/80">AI safety</div>
          <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-tight text-signal-text md:text-5xl">
            Understand AI safety risks
            <br />
            <span className="text-signal-muted">with sources attached.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-signal-muted">
            This page explains alignment, governance, frontier risk, and job transition pressure in plain language. Claims are tied to source registry entries or clearly marked as conceptual examples.
          </p>
          <Link
            href="/learn/glossary"
            className="mt-5 inline-flex border border-signal-line bg-signal-panel2/60 px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-signal-green/50"
          >
            glossary for terms
          </Link>
        </header>

        <SafetyBridge />

        <div className="mb-5">
          <RealWorldImageBand
            compact
            ids={["control-room", "thermal-camera", "camera-cluster"]}
            title="safety monitoring context"
            description="These photos ground the safety page in real operational settings: human review rooms, specialized sensors, and camera coverage. They are visual references only, not claims about a deployed SIGNALWATCH run."
          />
        </div>

        <section className="mb-5 grid gap-3 md:grid-cols-3">
          <WhyPanel text="Autonomous systems become difficult to supervise when capability growth exceeds evaluation and interpretability progress." source="OpenAI / Anthropic frameworks" />
          <WhyPanel text="AI may automate tasks before entire occupations, increasing transition pressure in some sectors." source="OECD / Stanford AI Index" />
          <WhyPanel text="Vision systems can fail under degraded environmental conditions despite strong benchmark performance." source="conceptual perception safety" />
        </section>

        <section className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <Panel title="alignment" icon={Shield} meta={`${alignment.length} concepts`}>
            <div className="space-y-3">
              {alignment.map((concept) => (
                <Block key={concept.id} title={concept.title}>
                  <p>{concept.plain_language}</p>
                  <p className="mt-2 font-mono text-[0.68rem] uppercase text-signal-dim">{concept.operational_view}</p>
                  <Evidence evidence={concept.evidence} sources={sourceIndex} />
                </Block>
              ))}
            </div>
          </Panel>

          <Panel title="frontier risk frameworks" icon={Database} meta={`${risks.length} categories`}>
            <div className="grid gap-3 md:grid-cols-2">
              {risks.map((risk, index) => (
                <motion.div
                  key={risk.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="border border-[#101b15] bg-[#050806]/70 p-4"
                >
                  <div className="font-mono text-[0.72rem] uppercase text-signal-green/80">{risk.name}</div>
                  <p className="mt-3 text-sm leading-relaxed text-signal-muted">{risk.summary}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#aeb8b1]">{risk.why_it_matters}</p>
                  <div className="mt-4 space-y-1 font-mono text-[0.62rem] uppercase text-signal-dim">
                    {risk.mitigations.map((mitigation) => <div key={mitigation}>mitigation / {mitigation}</div>)}
                  </div>
                  <Evidence evidence={risk.evidence} sources={sourceIndex} />
                </motion.div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <Panel title="job displacement" icon={Wrench} meta="source-backed">
            <div className="space-y-3">
              {jobs.map((item) => (
                <Block key={item.id} title={item.area} meta={item.pressure}>
                  <p>{item.explanation}</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <List title="benefits" items={item.benefits} />
                    <List title="transition risks" items={item.transition_risks} />
                  </div>
                  <Evidence evidence={item.evidence} sources={sourceIndex} />
                </Block>
              ))}
            </div>
          </Panel>

          <Panel title="unaligned AI risk" icon={Shield} meta="conceptual examples">
            <div className="space-y-3 text-sm leading-relaxed text-signal-muted">
              <p>AI systems can become dangerous when the measured objective differs from what humans actually intended.</p>
              <p>Conceptual failure modes include specification gaming, reward hacking, deceptive behavior risk, autonomous tool use, evaluation gaps, and distribution shift.</p>
              <p className="border-l border-[#24392c] bg-[#050806]/62 px-3 py-2 font-mono text-[0.68rem] uppercase text-signal-dim">
                These examples are educational abstractions, not claims about a specific deployed system.
              </p>
            </div>
          </Panel>
        </section>

        <section className="mt-5 console-panel p-5">
          <SectionTitle title="source registry" meta={`${sources.length} evidence objects`} />
          <SourceGraph sources={sources} />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {sources.map((source) => (
              <a key={source.id} href={source.url} target="_blank" className="border border-[#101b15] bg-[#050806]/70 p-4 transition hover:border-[#2f4a39]">
                <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">{source.publisher} / {source.reliability}</div>
                <div className="mt-3 text-sm font-semibold text-signal-text">{source.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-signal-muted">{source.summary}</p>
              </a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-[#101b15] pb-4 font-mono text-[0.68rem] uppercase text-signal-dim">
      <Link href="/" className="text-signal-green/80 transition hover:text-signal-green">SIGNALWATCH</Link>
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Link href="/console" className="transition hover:text-signal-text">console</Link>
        <Link href="/evaluations" className="transition hover:text-signal-text">evaluations</Link>
        <Link href="/labs" className="transition hover:text-signal-text">labs</Link>
        <Link href="/labs/perception" className="transition hover:text-signal-text">perception</Link>
        <Link href="/methodology" className="transition hover:text-signal-text">methodology</Link>
        <Link href="/learn/glossary" className="transition hover:text-signal-text">glossary</Link>
        <Link href="/timeline" className="transition hover:text-signal-text">timeline</Link>
      </div>
    </nav>
  );
}

function Panel({ title, icon: Icon, meta, children }: { title: string; icon: typeof Shield; meta: string; children: React.ReactNode }) {
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

function Block({ title, meta, children }: { title: string; meta?: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#101b15] bg-[#050806]/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-mono text-[0.74rem] uppercase text-signal-green/80">{title}</h2>
        {meta ? <span className="font-mono text-[0.62rem] uppercase text-signal-dim">{meta}</span> : null}
      </div>
      <div className="mt-3 text-sm leading-relaxed text-signal-muted">{children}</div>
    </div>
  );
}

function Evidence({ evidence, sources }: { evidence: Array<{ source_id: string; note: string }>; sources: Map<string, SafetySource> }) {
  return (
    <div className="mt-4 space-y-1 font-mono text-[0.62rem] uppercase text-signal-dim">
      {evidence.map((item) => {
        const source = sources.get(item.source_id);
        return (
          <details key={`${item.source_id}-${item.note}`} className="border-l border-[#1a2b21] pl-2">
            <summary className="cursor-pointer list-none text-signal-dim">source / {source?.publisher ?? item.source_id} / {source?.reliability ?? "registry"}</summary>
            <div className="mt-1 text-signal-muted">{item.note}</div>
            {source ? <a href={source.url} target="_blank" className="mt-1 block text-signal-olive">{source.title}</a> : null}
          </details>
        );
      })}
    </div>
  );
}

function WhyPanel({ text, source }: { text: string; source: string }) {
  return (
    <div className="console-panel p-4">
      <div className="font-mono text-[0.62rem] uppercase text-signal-green/80">why this matters</div>
      <p className="mt-3 text-sm leading-relaxed text-signal-muted">{text}</p>
      <div className="mt-4 font-mono text-[0.6rem] uppercase text-signal-dim">trace / {source}</div>
    </div>
  );
}

function SourceGraph({ sources }: { sources: SafetySource[] }) {
  if (!sources.length) return null;
  return (
    <div className="mt-5 h-40 overflow-hidden border border-[#101b15] bg-[#050806]/70">
      <svg viewBox="0 0 720 160" className="h-full w-full">
        <path d="M60 80H660" stroke="#1f3a2b" strokeWidth="1" strokeDasharray="4 10" />
        {sources.map((source, index) => {
          const x = 90 + index * 170;
          const y = index % 2 ? 98 : 62;
          return (
            <g key={source.id}>
              <line x1="360" y1="80" x2={x} y2={y} stroke="#203428" strokeWidth="1" />
              <circle cx={x} cy={y} r="6" fill="#89e3ad" opacity="0.72" />
              <text x={x + 12} y={y + 4} fill="#7f8b83" fontSize="10" fontFamily="Consolas, monospace">{source.publisher}</text>
            </g>
          );
        })}
        <circle cx="360" cy="80" r="8" fill="#9aa56f" opacity="0.78" />
        <text x="374" y="84" fill="#aeb8b1" fontSize="10" fontFamily="Consolas, monospace">SAFETY REGISTRY</text>
      </svg>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-mono text-[0.62rem] uppercase text-signal-dim">{title}</div>
      <div className="mt-2 space-y-1">
        {items.map((item) => <div key={item}>- {item}</div>)}
      </div>
    </div>
  );
}

function SectionTitle({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#101b15] pb-3">
      <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">{title}</div>
      <span className="font-mono text-[0.62rem] uppercase text-signal-dim">{meta}</span>
    </div>
  );
}
