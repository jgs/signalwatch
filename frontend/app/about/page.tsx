import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Database, Eye, FileSearch, RadioTower, ShieldCheck, type LucideIcon } from "lucide-react";
import { OperationalNav } from "@/components/layout/operational-nav";
import { SystemStatusBar } from "@/components/layout/system-status-bar";
import { EvidenceBoundaryGuide } from "@/components/education/evidence-boundary-guide";
import { NextStepRail } from "@/components/education/next-step-rail";

export const metadata: Metadata = {
  title: "About",
  description: "What SIGNALWATCH is, what it is not, and how its evidence boundaries work.",
};

const surfaces = [
  {
    icon: Activity,
    title: "Live console",
    href: "/console",
    body: "A realtime operational surface for source-backed AI updates and runtime state.",
  },
  {
    icon: FileSearch,
    title: "Evidence ledger",
    href: "/evidence",
    body: "A ledger of source claims, telemetry frames, collector state, and unavailable data.",
  },
  {
    icon: Eye,
    title: "Perception lab",
    href: "/labs/perception",
    body: "Browser-side COCO-SSD inference under real input degradation.",
  },
  {
    icon: ShieldCheck,
    title: "Safety context",
    href: "/safety",
    body: "Source-backed safety concepts, frameworks, and public references.",
  },
];

const boundaries = [
  ["Source claims", "Must include real source data, links, timestamps, or provenance."],
  ["Runtime telemetry", "Describes SIGNALWATCH infrastructure state, not facts about the AI ecosystem."],
  ["Model outputs", "Come from real browser-side inference. Missing outputs remain missing."],
  ["Conceptual demos", "Are labeled education surfaces, not operational measurements."],
];

const notThis = [
  "A synthetic intelligence simulator.",
  "A startup-style analytics dashboard with decorative metrics.",
  "A claim that a model, company, or deployment is safe.",
  "A source of fabricated incidents, confidence values, or telemetry.",
];

const nextSteps = [
  {
    href: "/start",
    label: "Choose your route",
    text: "Start from the surface that matches your intent.",
    icon: RadioTower,
  },
  {
    href: "/evidence",
    label: "Inspect provenance",
    text: "See claims, runtime state, and unavailable data separated.",
    icon: FileSearch,
  },
  {
    href: "/evaluations",
    label: "Understand evaluation",
    text: "Learn why robustness means looking for failure states.",
    icon: Eye,
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_10%,rgba(137,227,173,0.09),transparent_32rem)]" />
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(155,216,179,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(155,216,179,.16)_1px,transparent_1px)] [background-size:42px_42px]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <OperationalNav active="about" />

        <header className="grid gap-8 py-12 md:py-16 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-signal-green/80">about / trust boundary</div>
            <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              SIGNALWATCH is an evidence-aware observability surface.
            </h1>
            <p className="mt-7 max-w-3xl text-sm leading-relaxed text-signal-muted">
              It helps readers inspect AI safety signals, source movement, perception robustness, and runtime state without filling gaps with invented telemetry.
            </p>
          </div>
          <div className="console-panel p-5">
            <div className="flex items-center gap-2 border-b border-signal-line pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">
              <RadioTower className="h-3.5 w-3.5" />
              public route
            </div>
            <div className="mt-4 grid gap-2 font-mono text-[0.62rem] uppercase">
              <Link href="/start" className="border border-signal-line bg-signal-panel2/60 px-3 py-2 text-signal-green/80 transition hover:border-signal-green/50">1 / start</Link>
              <Link href="/console" className="border border-signal-line bg-signal-panel2/60 px-3 py-2 text-signal-muted transition hover:border-signal-green/50 hover:text-signal-text">2 / console</Link>
              <Link href="/evidence" className="border border-signal-line bg-signal-panel2/60 px-3 py-2 text-signal-muted transition hover:border-signal-green/50 hover:text-signal-text">3 / evidence</Link>
              <Link href="/labs/perception" className="border border-signal-line bg-signal-panel2/60 px-3 py-2 text-signal-muted transition hover:border-signal-green/50 hover:text-signal-text">4 / perception lab</Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {surfaces.map((surface) => (
            <SurfaceCard key={surface.href} {...surface} />
          ))}
        </section>

        <div className="mt-5">
          <EvidenceBoundaryGuide compact title="the four labels that make the site readable" />
        </div>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_.9fr]">
          <div className="console-panel p-5">
            <div className="border-b border-signal-line pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">what this is</div>
            <p className="mt-5 text-sm leading-relaxed text-signal-muted">
              SIGNALWATCH is a public, operational interface for inspecting evidence around AI systems. It combines source monitoring, runtime telemetry, safety references, and browser-side robustness tests while keeping each data type labeled.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-signal-muted">
              The goal is not to dramatize AI. The goal is to make evidence easier to read: what was observed, where it came from, when it appeared, and what remains unknown.
            </p>
          </div>

          <div className="console-panel p-5">
            <div className="border-b border-signal-line pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">what this is not</div>
            <div className="mt-5 space-y-3">
              {notThis.map((item) => (
                <div key={item} className="border-l border-signal-line bg-signal-panel2/52 px-3 py-2 text-sm leading-relaxed text-signal-muted">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 console-panel p-5">
          <div className="flex flex-col justify-between gap-3 border-b border-signal-line pb-3 md:flex-row md:items-center">
            <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">trust boundary</div>
            <div className="font-mono text-[0.6rem] uppercase text-signal-dim">source-backed / model-reported / unavailable stays visible</div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {boundaries.map(([title, text]) => (
              <div key={title} className="border-l border-signal-green/40 bg-signal-panel/62 px-3 py-3">
                <div className="font-mono text-[0.6rem] uppercase text-signal-green/70">{title}</div>
                <p className="mt-2 text-sm leading-relaxed text-signal-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5">
          <NextStepRail steps={nextSteps} />
        </div>

        <SystemStatusBar />
      </section>
    </main>
  );
}

function SurfaceCard({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block border border-signal-line bg-signal-panel/72 p-5 transition hover:border-signal-green/45 hover:bg-signal-panel2/60">
      <Icon className="h-5 w-5 text-signal-green/75" />
      <h2 className="mt-5 text-lg font-semibold leading-snug text-signal-text">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-signal-muted">{body}</p>
      <div className="mt-5 font-mono text-[0.58rem] uppercase text-signal-green/75">open surface</div>
    </Link>
  );
}
