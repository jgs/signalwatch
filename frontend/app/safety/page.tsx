"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Database, Shield, Wrench } from "lucide-react";
import { fetchAlignmentConcepts, fetchJobDisplacement, fetchRiskFrameworks, fetchSafetySources } from "@/lib/api";
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
    <main className="relative min-h-screen overflow-hidden bg-[#030403] text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_14%,rgba(71,108,81,0.10),transparent_30rem)]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <Nav />
        <header className="py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">safety intelligence layer</div>
          <h1 className="mt-9 max-w-4xl text-4xl font-semibold leading-tight text-[#eef4ef] md:text-6xl">
            Alignment, governance,
            <br />
            frontier risk,
            <br />
            <span className="text-[#aeb8b1]">and societal transition signals.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-signal-muted">
            Source-backed explanations for public understanding. Claims are tied to registry entries or labeled as conceptual examples.
          </p>
        </header>

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
      <Link href="/" className="text-signal-green/80 transition hover:text-signal-green">JGSOPS</Link>
      <div className="flex items-center gap-4">
        <Link href="/console" className="transition hover:text-signal-text">console</Link>
        <Link href="/labs" className="transition hover:text-signal-text">labs</Link>
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
        return <div key={`${item.source_id}-${item.note}`}>source / {source?.publisher ?? item.source_id} / {item.note}</div>;
      })}
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
