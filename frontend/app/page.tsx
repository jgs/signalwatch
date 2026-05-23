"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  Camera,
  Database,
  FileSearch,
  Gauge,
  GraduationCap,
  Network,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { RealWorldImageBand } from "@/components/education/real-world-image-band";
import { RealDegradationExamples } from "@/components/education/real-degradation-examples";
import { VisualEvidenceLegend } from "@/components/education/visual-evidence-legend";
import { HowToReadInterface } from "@/components/landing/how-to-read-interface";
import { OperationalSurfaceMap } from "@/components/landing/operational-surface-map";
import { SystemStatusBar } from "@/components/layout/system-status-bar";

const aiPrimer = [
  {
    icon: Brain,
    title: "AI is a system that learns patterns",
    text: "Modern AI systems are trained on large amounts of data so they can predict, classify, generate, or decide. They are powerful, but they do not automatically understand the world like a person.",
  },
  {
    icon: Network,
    title: "Outputs are behavior, not truth",
    text: "An answer, detection, score, or summary is something the system produced under specific conditions. SIGNALWATCH treats that behavior as evidence to inspect, not as a final authority.",
  },
  {
    icon: Gauge,
    title: "Reliability depends on context",
    text: "Lighting, data quality, prompts, model changes, infrastructure costs, and deployment conditions can all change whether an AI system is useful or risky.",
  },
];

const audiencePaths = [
  {
    icon: GraduationCap,
    label: "New to AI",
    title: "Start with the plain guide",
    text: "Learn the basic terms, what AI can and cannot prove, and how to read the evidence labels.",
    href: "/learn/glossary",
  },
  {
    icon: ShieldCheck,
    label: "Safety and governance",
    title: "Inspect risk with sources",
    text: "See safety risks, policy references, and job transition pressure with links back to the original sources.",
    href: "/safety",
  },
  {
    icon: ScanSearch,
    label: "Builders and evaluators",
    title: "Run perception checks",
    text: "Upload images or use a webcam to see how blur, darkness, crops, and motion change real model outputs.",
    href: "/labs/perception",
  },
  {
    icon: Activity,
    label: "Market watchers",
    title: "Track the AI bubble debate",
    text: "Separate hype, infrastructure spending, revenue conversion, and deployment reality without fabricated scores.",
    href: "/market-stress",
  },
];

const trustRules = [
  ["No fake readings", "Metrics, confidence, detections, and incidents must come from real data or real model outputs."],
  ["Visible uncertainty", "Unavailable models, missing sources, and unknown values stay visible instead of being filled in."],
  ["Source-first explanations", "Every serious claim should point to a source, a run, a timestamp, or a methodology boundary."],
  ["Readable by design", "Technical surfaces should remain useful to experts while still explaining the meaning for everyone else."],
];

const capabilityRows = [
  ["Source monitoring", "Research, safety, policy, releases, and AI news with links and timestamps attached."],
  ["Perception robustness", "Real browser-side model behavior under blur, low light, occlusion, compression, and motion."],
  ["Market stress analysis", "AI investment and bubble-risk context separated from operational evidence."],
  ["Evidence boundaries", "Clear distinction between source photo, generated context, diagram, and model output."],
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f4f7f2] text-[#111b16]">
      <Hero />

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <SectionHeader
          eyebrow="AI, plainly"
          title="A clear starting point for understanding artificial intelligence."
          text="SIGNALWATCH is built for people who want AI explained without hype, and for teams that need rigorous evidence once systems are deployed."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {aiPrimer.map((item) => (
            <InfoCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="bg-[#101711] py-12 text-signal-text md:py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <HowToReadInterface />
        </div>
      </section>

      <section className="border-y border-[#d8e0d8] bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Why this exists"
              title="AI is moving faster than ordinary people can inspect."
              text="Most tools either oversimplify the story or bury people in technical noise. SIGNALWATCH gives every reader a path: understand the idea, inspect the evidence, then decide what the claim can actually support."
            />
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {trustRules.map(([label, text]) => (
                <div key={label} className="border-l border-[#7d9a86] bg-[#f6f8f4] px-4 py-3">
                  <div className="font-mono text-[0.62rem] uppercase text-[#3f6f4d]">{label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-[#435148]">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <EvidencePreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12 md:px-8 md:pb-16">
        <div className="border border-[#d8e0d8] bg-white p-5 md:p-7">
          <div className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#3f6f4d]">The reason behind it</div>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-[#111b16] md:text-4xl">
            The promise of AI is real. So is the confusion around it.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#526057]">
            SIGNALWATCH is built around a simple belief: people should not need to be insiders to ask good questions about AI. A useful system should explain what it knows, show where that knowledge came from, and stay honest when it does not know enough.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <SectionHeader
          eyebrow="Choose your path"
          title="One product, multiple levels of depth."
          text="You can read SIGNALWATCH as an accessible AI guide, a safety reference, an evaluation workbench, or an operational monitoring surface."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {audiencePaths.map((path) => (
            <PathCard key={path.title} {...path} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12 md:px-8 md:pb-16">
        <RealDegradationExamples />
      </section>

      <section className="bg-[#101711] py-12 text-signal-text md:py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <OperationalSurfaceMap />
          <div className="mt-5">
            <VisualEvidenceLegend compact title="visual evidence legend" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <SectionHeader
          eyebrow="What you can inspect"
          title="From AI basics to operational evidence."
          text="The site is designed to stay approachable at the top and increasingly precise as you move deeper."
        />
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {capabilityRows.map(([label, text]) => (
            <div key={label} className="flex gap-4 border border-[#d8e0d8] bg-white p-4">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#4f7e5c]" />
              <div>
                <div className="font-mono text-[0.64rem] uppercase text-[#3f6f4d]">{label}</div>
                <p className="mt-2 text-sm leading-relaxed text-[#435148]">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12 md:px-8 md:pb-16">
        <RealWorldImageBand
          compact
          title="real-world AI context"
          description="These images connect the ideas above to ordinary operating conditions: cameras, low light, movement, monitoring rooms, and sensor boundaries. They are visual context only, not evidence of a SIGNALWATCH run."
        />
      </section>

      <footer className="border-t border-[#d8e0d8] bg-white px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[#3f6f4d]">SIGNALWATCH</div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#526057]">
              Evidence-first AI observability for people who need clarity before certainty.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 font-mono text-[0.62rem] uppercase text-[#526057]">
            <Link href="/about" className="transition hover:text-[#111b16]">about</Link>
            <Link href="/methodology" className="transition hover:text-[#111b16]">methodology</Link>
            <Link href="/evidence" className="transition hover:text-[#111b16]">evidence</Link>
            <Link href="/evaluations" className="transition hover:text-[#111b16]">evaluations</Link>
            <Link href="/safety" className="transition hover:text-[#111b16]">safety</Link>
            <Link href="/console" className="transition hover:text-[#111b16]">console</Link>
            <Link href="/about" className="transition hover:text-[#111b16]">about me</Link>
          </div>
        </div>
      </footer>

      <div className="bg-[#101711]">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <SystemStatusBar />
        </div>
      </div>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-[#101711] text-white">
      <img
        src="/visual-context/ai-infrastructure-context.png"
        alt="AI infrastructure context showing data center, compute racks, power infrastructure, and an operational workspace."
        className="absolute inset-0 h-full w-full object-cover opacity-72"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,13,9,0.94)_0%,rgba(7,13,9,0.76)_46%,rgba(7,13,9,0.28)_100%)]" />
      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col px-5 py-6 md:px-8">
        <nav className="flex flex-col justify-between gap-4 border-b border-white/15 pb-4 font-mono text-[0.66rem] uppercase text-white/68 md:flex-row md:items-center">
          <Link href="/" className="tracking-[0.22em] text-[#b7e3c4]">SIGNALWATCH</Link>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/learn/glossary" className="transition hover:text-white">AI basics</Link>
            <Link href="/about" className="transition hover:text-white">about</Link>
            <Link href="/safety" className="transition hover:text-white">safety</Link>
            <Link href="/evaluations" className="transition hover:text-white">evaluations</Link>
            <Link href="/evidence" className="transition hover:text-white">evidence</Link>
            <Link href="/market-stress" className="transition hover:text-white">market stress</Link>
            <Link href="/console" className="transition hover:text-white">console</Link>
          </div>
        </nav>

        <div className="flex flex-1 flex-col justify-center py-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 border border-white/16 bg-white/8 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#b7e3c4]">
              <Sparkles className="h-3.5 w-3.5" />
              AI explained through evidence
            </div>
            <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal md:text-7xl">
              Understand AI without hype.
              <span className="block text-[#c6d0c8]">Inspect it without guesswork.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[#d7ded8] md:text-lg">
              SIGNALWATCH is a clean, evidence-first AI observability platform for curious readers, safety teams, builders, and decision-makers. It explains what AI is, where it fails, and what evidence is strong enough to trust.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/learn/glossary" className="inline-flex items-center gap-2 bg-[#e9f3e8] px-5 py-3 text-sm font-semibold text-[#102018] transition hover:bg-white">
                Start with AI basics
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/console" className="inline-flex items-center gap-2 border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/34 hover:bg-white/12">
                Open live console
                <Activity className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function EvidencePreview() {
  const rows = [
    ["visual", "context only", Camera],
    ["claim", "source required", FileSearch],
    ["model", "real output only", ScanSearch],
    ["system", "unavailable stays visible", Database],
  ] satisfies Array<[string, string, LucideIcon]>;

  return (
    <div className="border border-[#d8e0d8] bg-[#f6f8f4] p-5">
      <div className="border-b border-[#d8e0d8] pb-3 font-mono text-[0.66rem] uppercase text-[#3f6f4d]">how SIGNALWATCH reads claims</div>
      <div className="mt-5 space-y-3">
        {rows.map(([label, value, Icon]) => (
          <div key={label} className="grid grid-cols-[1.4rem_6.5rem_1fr] items-center gap-3 border border-[#dfe6de] bg-white px-3 py-3 font-mono text-[0.62rem] uppercase">
            <Icon className="h-4 w-4 text-[#4f7e5c]" />
            <span className="text-[#748176]">{label}</span>
            <span className="text-[#243329]">{value}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-relaxed text-[#526057]">
        The interface is designed so a reader can tell the difference between a helpful image, a claim with a source, a diagram, and real model behavior.
      </p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div>
      <div className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#3f6f4d]">{eyebrow}</div>
      <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-[#111b16] md:text-5xl">{title}</h2>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#526057]">{text}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <article className="border border-[#d8e0d8] bg-white p-5">
      <Icon className="h-5 w-5 text-[#4f7e5c]" />
      <h3 className="mt-5 text-xl font-semibold leading-tight text-[#111b16]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[#526057]">{text}</p>
    </article>
  );
}

function PathCard({ icon: Icon, label, title, text, href }: { icon: LucideIcon; label: string; title: string; text: string; href: string }) {
  return (
    <Link href={href} className="group block h-full border border-[#d8e0d8] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#9ab39f] hover:shadow-[0_18px_60px_rgba(17,27,22,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <Icon className="h-5 w-5 text-[#4f7e5c]" />
        <span className="font-mono text-[0.58rem] uppercase text-[#748176]">{label}</span>
      </div>
      <h3 className="mt-6 text-xl font-semibold leading-tight text-[#111b16]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[#526057]">{text}</p>
      <div className="mt-5 inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase text-[#3f6f4d]">
        Open path
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
