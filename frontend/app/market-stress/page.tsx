"use client";

import Link from "next/link";
import {
  Activity,
  Banknote,
  Database,
  FileSearch,
  Gauge,
  Landmark,
  Scale,
  ServerCog,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { OperationalNav } from "@/components/layout/operational-nav";
import { SystemStatusBar } from "@/components/layout/system-status-bar";

const stressSignals = [
  {
    icon: ServerCog,
    title: "infrastructure intensity",
    plain: "How much money and energy is being spent to build the AI stack.",
    state: "watch",
    body: "Heavy spending is not automatically bad, but it becomes fragile if new data centers, chips, and power contracts are built faster than real demand appears.",
    evidence: ["hyperscaler capex", "data-center capacity", "accelerator supply", "power constraints"],
  },
  {
    icon: Banknote,
    title: "revenue conversion",
    plain: "Whether AI usage turns into durable revenue and margin.",
    state: "unresolved",
    body: "The important question is simple: are customers paying enough, for long enough, to cover the cost of running the systems?",
    evidence: ["reported AI revenue", "gross margin", "renewals", "inference unit cost"],
  },
  {
    icon: Scale,
    title: "valuation pressure",
    plain: "Whether market prices assume success before it is proven.",
    state: "external",
    body: "A company can be useful and still be overpriced. This page keeps financial excitement separate from evidence that AI is working in production.",
    evidence: ["multiples", "credit spreads", "funding rounds", "cash-flow visibility"],
  },
  {
    icon: Gauge,
    title: "deployment reality",
    plain: "Whether AI is actually helping real workflows, not just demos.",
    state: "source-bound",
    body: "Durability improves when AI moves from pilot projects into repeatable work with measured productivity, reliability, safety, and cost outcomes.",
    evidence: ["production use", "audit trails", "error rates", "measured productivity"],
  },
];

const sourceFrames = [
  {
    label: "IMF",
    title: "boom or bubble framing",
    date: "2026",
    checked: "2026-05-20",
    sourceType: "macro analysis",
    confidence: "external framing",
    href: "https://www.imf.org/en/publications/fandd/issues/2026/03/point-of-view-ai-can-lift-global-growth-marcello-estevao",
    detail: "Frames the macro question as whether current AI investment becomes a lasting productivity boom or a short-lived investment bubble.",
  },
  {
    label: "IEA",
    title: "hyperscaler capex context",
    date: "2026",
    checked: "2026-05-20",
    sourceType: "infrastructure data",
    confidence: "source disclosed",
    href: "https://www.iea.org/data-and-statistics/charts/capital-expenditures-by-hyperscalers",
    detail: "Tracks hyperscaler capital expenditure as part of the wider energy and data-center infrastructure context around AI.",
  },
  {
    label: "S&P Global",
    title: "inference economics",
    date: "2026",
    checked: "2026-05-20",
    sourceType: "market analysis",
    confidence: "external analysis",
    href: "https://www.spglobal.com/market-intelligence/en/news-insights/research/2026/03/hyperscaler-earnings-quarterly-what-price-inference",
    detail: "Highlights that inference can become a large revenue source while still carrying significant infrastructure and operating costs.",
  },
  {
    label: "Allianz Research",
    title: "AI bubble pressure monitor",
    date: "2026",
    checked: "2026-05-20",
    sourceType: "risk analysis",
    confidence: "external analysis",
    href: "https://www.allianz.com/en/economic_research/insights/publications/specials_fmo/260325_ai-capex-cycle.html",
    detail: "Uses a market-risk lens for capex, sentiment, revenue trajectory, cash-flow visibility, and balance-sheet sensitivity.",
  },
];

const boundaries = [
  ["can show", "which public signals would support or weaken the idea that AI is financially overheated"],
  ["can show", "where spending, real customer value, and production adoption do not line up"],
  ["cannot claim", "that the entire AI industry is or is not a bubble without source-backed data and a defined method"],
  ["cannot infer", "private margins, real chip utilization, customer churn, or long-term cash flow without disclosures"],
];

const decisionMatrix = [
  {
    title: "bubble pressure rises",
    simple: "Money is being spent faster than proof of durable value appears.",
    conditions: ["spending grows faster than revenue evidence", "running costs remain unclear", "pilots do not become audited production workflows"],
  },
  {
    title: "durability improves",
    simple: "The technology keeps being useful after the hype cools down.",
    conditions: ["AI workloads show repeatable productivity gains", "running costs become transparent", "infrastructure use is backed by disclosed demand"],
  },
  {
    title: "mixed regime",
    simple: "Some AI infrastructure is real, while some business models may still break.",
    conditions: ["core infrastructure remains useful", "some vendors fail to turn usage into profit", "financial losses coexist with real adoption"],
  },
];

const plainTerms = [
  ["capex", "Money spent on long-lived assets such as data centers, chips, servers, and power infrastructure."],
  ["inference", "The cost of running an AI model after it has been trained, such as answering prompts or analyzing images."],
  ["margin", "The money left after paying the cost of delivering the product or service."],
  ["utilization", "How much of the expensive AI infrastructure is actually being used by paying demand."],
];

const bubbleVsInfrastructure = [
  ["bubble signal", "Prices, promises, and infrastructure spending run ahead of proven customer value."],
  ["infrastructure signal", "Even if some companies are overpriced, the underlying systems keep solving real problems."],
  ["unknown", "Private margins, customer retention, real productivity gains, and future demand are often not visible."],
];

export default function MarketStressPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030403] text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_12%,rgba(71,108,81,0.12),transparent_30rem)]" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(137,227,173,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(137,227,173,.14)_1px,transparent_1px)] [background-size:42px_42px]" />

      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <OperationalNav active="market-stress" />

        <header className="grid gap-8 py-12 md:py-16 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">market stress</div>
            <h1 className="mt-9 max-w-4xl text-4xl font-semibold leading-tight text-[#eef4ef] md:text-6xl">
              AI bubble risk,
              <br />
              <span className="text-[#aeb8b1]">without theatrical certainty.</span>
            </h1>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-signal-muted">
              This surface treats the AI bubble debate as an evidence problem. It separates financial overheating, infrastructure durability, real deployment value, and unknowns that should remain unknown until source-backed data exists.
            </p>
            <div className="mt-6 grid max-w-3xl gap-3 md:grid-cols-3">
              {bubbleVsInfrastructure.map(([label, text]) => (
                <div key={label} className="border-l border-[#24392c] bg-[#050806]/62 px-3 py-3">
                  <div className="font-mono text-[0.58rem] uppercase text-signal-green/70">{label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-signal-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <MarketStressGauge />
        </header>

        <section className="mb-5 console-panel p-5">
          <SectionLabel icon={FileSearch} label="plain-language lens" meta="for non-specialist readers" />
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {plainTerms.map(([term, definition]) => (
              <div key={term} className="border border-[#101b15] bg-[#050806]/66 p-4">
                <div className="font-mono text-[0.6rem] uppercase text-signal-green/70">{term}</div>
                <p className="mt-2 text-sm leading-relaxed text-signal-muted">{definition}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5 console-panel overflow-hidden p-5">
          <SectionLabel icon={ServerCog} label="visual infrastructure context" meta="generated visual / not telemetry" />
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-signal-muted">
            The AI bubble debate is not only software. It touches buildings, chips, electricity, cooling, financing, and ordinary workflows. This image is visual context only: it does not report SIGNALWATCH telemetry, market data, utilization, or model performance.
          </p>
          <div className="mt-5 overflow-hidden border border-[#101b15] bg-[#050806]/70">
            <img
              src="/visual-context/ai-infrastructure-context.png"
              alt="Operational AI infrastructure context showing a data center, server racks, power equipment, and workplace monitors."
              className="aspect-[16/7] w-full object-cover opacity-90 grayscale-[12%]"
              loading="lazy"
            />
          </div>
          <div className="mt-3 grid gap-2 font-mono text-[0.56rem] uppercase text-signal-dim sm:grid-cols-4">
            <span className="border-b border-[#101b15] pb-1">context / data center</span>
            <span className="border-b border-[#101b15] pb-1">context / compute rack</span>
            <span className="border-b border-[#101b15] pb-1">context / power grid</span>
            <span className="border-b border-[#101b15] pb-1">context / workflow</span>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stressSignals.map((signal) => (
            <SignalCard key={signal.title} {...signal} />
          ))}
        </section>

        <section className="mt-5 console-panel p-5">
          <SectionLabel icon={FileSearch} label="reference frame" meta="external sources / not live telemetry" />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {sourceFrames.map((source) => (
              <a key={source.title} href={source.href} target="_blank" rel="noreferrer" className="block border border-[#101b15] bg-[#050806]/70 p-4 transition hover:border-[#2f4a39]">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-[0.62rem] uppercase text-signal-green/75">{source.label} / {source.date}</div>
                  <span className="font-mono text-[0.56rem] uppercase text-signal-dim">inspect source</span>
                </div>
                <h2 className="mt-3 text-base font-semibold text-signal-text">{source.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-signal-muted">{source.detail}</p>
                <div className="mt-4 grid gap-2 font-mono text-[0.55rem] uppercase text-signal-dim sm:grid-cols-3">
                  <span className="border-b border-[#101b15] pb-1">last checked / {source.checked}</span>
                  <span className="border-b border-[#101b15] pb-1">source type / {source.sourceType}</span>
                  <span className="border-b border-[#101b15] pb-1">status / {source.confidence}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <div className="console-panel p-5">
            <SectionLabel icon={ShieldCheck} label="claim boundary" meta="no fabricated conclusion" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {boundaries.map(([label, text]) => (
                <div key={`${label}-${text}`} className="border-l border-[#24392c] bg-[#050806]/62 px-3 py-3">
                  <div className="font-mono text-[0.58rem] uppercase text-signal-green/70">{label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-signal-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="console-panel p-5">
            <SectionLabel icon={Landmark} label="interpretation matrix" meta="scenario discipline" />
            <div className="mt-5 space-y-3">
              {decisionMatrix.map((scenario) => (
                <div key={scenario.title} className="border border-[#101b15] bg-[#050806]/68 p-4">
                  <div className="font-mono text-[0.62rem] uppercase text-signal-green/75">{scenario.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-signal-muted">{scenario.simple}</p>
                  <div className="mt-3 grid gap-1 text-sm leading-relaxed text-signal-muted md:grid-cols-3">
                    {scenario.conditions.map((condition) => (
                      <div key={condition} className="border-b border-[#101b15] pb-1">{condition}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 console-panel p-5">
          <SectionLabel icon={Database} label="ingestion requirements" meta="before this becomes telemetry" />
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Requirement title="source registry" text="Every market signal needs a publisher, timestamp, URL, and transformation note." />
            <Requirement title="metric provenance" text="Capex, revenue, margin, utilization, and energy data must remain attached to their original disclosures." />
            <Requirement title="confidence labels" text="Unknown, contested, estimated, disclosed, and computed values should be visually distinct." />
            <Requirement title="time windows" text="Trend claims require explicit comparison windows and must not imply live monitoring without ingestion." />
          </div>
          <div className="mt-5 border-t border-[#101b15] pt-4">
            <Link href="/methodology" className="inline-flex border border-[#203528] bg-[#07100b] px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-[#3e654c]">
              review methodology boundary
            </Link>
          </div>
        </section>

        <SystemStatusBar />
      </section>
    </main>
  );
}

function MarketStressGauge() {
  const ticks = ["capex", "revenue", "margin", "adoption", "power", "credit"];

  return (
    <div className="console-panel relative min-h-[340px] overflow-hidden p-5">
      <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_center,rgba(137,227,173,.52)_1px,transparent_1px)] [background-size:24px_24px]" />
      <SectionLabel icon={Activity} label="bubble-risk lens" meta="diagnostic map" />
      <div className="relative mt-8 flex min-h-[230px] items-center justify-center">
        <div className="absolute h-48 w-48 rounded-full border border-[#203528]" />
        <div className="absolute h-32 w-32 rounded-full border border-[#152219]" />
        <div className="absolute h-3 w-3 rounded-full bg-signal-green/80 shadow-[0_0_24px_rgba(137,227,173,0.35)]" />
        {ticks.map((tick, index) => {
          const angle = (index / ticks.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * 112;
          const y = Math.sin(angle) * 112;

          return (
            <div
              key={tick}
              className="absolute border border-[#101b15] bg-[#050806]/80 px-2 py-1 font-mono text-[0.56rem] uppercase text-signal-dim"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              {tick}
            </div>
          );
        })}
      </div>
      <p className="relative mt-3 border-t border-[#101b15] pt-4 text-sm leading-relaxed text-signal-muted">
        This page does not score the industry. It defines what evidence would be needed before SIGNALWATCH could responsibly classify market stress.
      </p>
    </div>
  );
}

function SignalCard({
  icon: Icon,
  title,
  plain,
  state,
  body,
  evidence,
}: {
  icon: LucideIcon;
  title: string;
  plain: string;
  state: string;
  body: string;
  evidence: string[];
}) {
  return (
    <article className="border border-[#101b15] bg-[#050806]/72 p-5 transition hover:border-[#24392c]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase text-signal-green/80">
          <Icon className="h-3.5 w-3.5" />
          {title}
        </div>
        <span className="border border-[#1a2b21] px-2 py-1 font-mono text-[0.54rem] uppercase text-signal-olive">{state}</span>
      </div>
      <p className="mt-3 border-l border-[#24392c] bg-[#050806]/62 px-3 py-2 text-sm leading-relaxed text-signal-muted">{plain}</p>
      <p className="mt-4 text-sm leading-relaxed text-signal-muted">{body}</p>
      <div className="mt-4 space-y-1 font-mono text-[0.56rem] uppercase text-signal-dim">
        {evidence.map((item) => (
          <div key={item}>evidence / {item}</div>
        ))}
      </div>
    </article>
  );
}

function Requirement({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-[#101b15] bg-[#050806]/66 p-4">
      <div className="font-mono text-[0.6rem] uppercase text-signal-green/70">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-signal-muted">{text}</p>
    </div>
  );
}

function SectionLabel({ icon: Icon, label, meta }: { icon: LucideIcon; label: string; meta: string }) {
  return (
    <div className="flex flex-col justify-between gap-3 border-b border-[#101b15] pb-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className="font-mono text-[0.6rem] uppercase text-signal-dim">{meta}</span>
    </div>
  );
}
