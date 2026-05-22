import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, BookOpen, Eye, FileSearch, Gauge, RadioTower, ShieldCheck, type LucideIcon } from "lucide-react";
import { RealWorldImageBand } from "@/components/education/real-world-image-band";
import { OperationalBoundaryPanel } from "@/components/education/operational-boundary-panel";
import { OperationalCallouts } from "@/components/education/operational-callouts";
import { EvidenceBoundaryGuide } from "@/components/education/evidence-boundary-guide";
import { NextStepRail } from "@/components/education/next-step-rail";
import { OperationalNav } from "@/components/layout/operational-nav";
import { SystemStatusBar } from "@/components/layout/system-status-bar";

export const metadata: Metadata = {
  title: "Start Here",
  description: "A simple entry point for understanding SIGNALWATCH, its evidence boundaries, and the recommended path through the platform.",
};

const route = [
  {
    href: "/learn/glossary",
    label: "1. Learn the terms",
    text: "Start with plain definitions for LLMs, confidence, telemetry, provenance, robustness, and evaluation.",
    icon: BookOpen,
  },
  {
    href: "/learn/llm-training",
    label: "2. Understand training",
    text: "See how language models move from raw data to deployment monitoring.",
    icon: ShieldCheck,
  },
  {
    href: "/evaluations",
    label: "3. Understand testing",
    text: "Learn why AI systems are tested for failures, not only high scores.",
    icon: Gauge,
  },
  {
    href: "/labs/perception",
    label: "4. Try perception",
    text: "Upload an image or use a webcam to see real model outputs under degradation.",
    icon: Eye,
  },
  {
    href: "/case-studies",
    label: "5. Run protocols",
    text: "Use repeatable case-study protocols and export evidence packets.",
    icon: FileSearch,
  },
];

const intents = [
  {
    href: "/console",
    label: "Monitor live AI signals",
    text: "Open source-backed updates, collector health, and runtime state.",
    action: "open console",
    icon: Activity,
  },
  {
    href: "/evidence",
    label: "Inspect provenance",
    text: "Review source claims, runtime frames, telemetry snapshots, and unavailable states.",
    action: "open ledger",
    icon: FileSearch,
  },
  {
    href: "/labs/perception",
    label: "Test perception robustness",
    text: "Upload an image, apply degradation, run real browser-side detection, and export a packet.",
    action: "run lab",
    icon: Eye,
  },
  {
    href: "/safety",
    label: "Review safety context",
    text: "Read risks, alignment concepts, and policy references with sources attached.",
    action: "review safety",
    icon: ShieldCheck,
  },
  {
    href: "/learn/glossary",
    label: "Understand AI basics",
    text: "Start with definitions before entering the operational surfaces.",
    action: "learn terms",
    icon: BookOpen,
  },
  {
    href: "/systems",
    label: "Check system boundaries",
    text: "See what the runtime observes, what it derives, and what stays unavailable.",
    action: "open systems",
    icon: RadioTower,
  },
];

const rules = [
  "SIGNALWATCH does not invent detections, confidence, incidents, or source claims.",
  "If a model emits no output, the interface shows that absence directly.",
  "Source-backed AI updates keep links, timestamps, and provenance attached.",
  "Educational pages explain concepts; they do not claim to reveal a private lab recipe.",
];

const nextSteps = [
  {
    href: "/about",
    label: "What SIGNALWATCH is",
    text: "Read the short trust boundary before entering technical surfaces.",
    icon: ShieldCheck,
  },
  {
    href: "/learn/glossary",
    label: "Learn the words",
    text: "Plain definitions for confidence, telemetry, provenance, and robustness.",
    icon: BookOpen,
  },
  {
    href: "/labs/perception",
    label: "See a real model fail",
    text: "Use image degradation to inspect browser-side model outputs.",
    icon: Eye,
  },
];

export default function StartPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(155,216,179,0.10),transparent_30rem)]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <OperationalNav active="start" />

        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-signal-green/80">start here</div>
          <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-tight text-signal-text md:text-5xl">
            What do you want to inspect?
            <br />
            <span className="text-signal-muted">Choose the surface that matches the job.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-sm leading-relaxed text-signal-muted">
            SIGNALWATCH is easier to use when you enter with intent: monitor live signals, inspect evidence, test perception, or learn the ideas first. Nothing here asks you to trust a black box without a trace.
          </p>
          <div className="mt-6">
            <OperationalCallouts compact />
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {intents.map((intent) => (
            <IntentCard key={intent.href} {...intent} />
          ))}
        </section>

        <div className="mt-5">
          <EvidenceBoundaryGuide compact />
        </div>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_.75fr]">
          <div className="console-panel p-5">
            <div className="border-b border-signal-line/60 pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">guided route for first-time users</div>
            <div className="mt-5 space-y-3">
              {route.map((item) => (
                <Link key={item.href} href={item.href} className="group grid gap-3 border border-signal-line/70 bg-signal-panel2/52 p-4 transition hover:border-signal-green/45 md:grid-cols-[2rem_1fr_auto] md:items-center">
                  <item.icon className="h-5 w-5 text-signal-green/75" />
                  <div>
                    <div className="font-mono text-[0.66rem] uppercase text-signal-green/80">{item.label}</div>
                    <p className="mt-2 text-sm leading-relaxed text-signal-muted">{item.text}</p>
                  </div>
                  <ArrowRight className="hidden h-4 w-4 text-signal-dim transition group-hover:text-signal-green md:block" />
                </Link>
              ))}
            </div>
          </div>

          <div className="console-panel p-5">
            <div className="border-b border-signal-line/60 pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">what to trust</div>
            <div className="mt-5 space-y-3">
              {rules.map((rule) => (
                <div key={rule} className="border-l border-signal-line bg-signal-panel2/52 px-3 py-2 text-sm leading-relaxed text-signal-muted">
                  {rule}
                </div>
              ))}
            </div>
            <Link href="/evidence" className="mt-5 inline-flex border border-signal-line bg-signal-panel2/60 px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-signal-green/50">
              inspect evidence ledger
            </Link>
          </div>
        </section>

        <div className="mt-5">
          <OperationalBoundaryPanel title="start-page evidence boundary" />
        </div>

        <div className="mt-5">
          <NextStepRail title="if you are new to AI safety" steps={nextSteps} />
        </div>

        <div className="mt-5">
          <RealWorldImageBand compact ids={["control-room", "cctv-camera", "low-light-hallway"]} />
        </div>
        <SystemStatusBar />
      </section>
    </main>
  );
}

function IntentCard({
  href,
  label,
  text,
  action,
  icon: Icon,
}: {
  href: string;
  label: string;
  text: string;
  action: string;
  icon: LucideIcon;
}) {
  return (
    <Link href={href} className="group block border border-signal-line bg-signal-panel/78 p-5 transition hover:border-signal-green/45 hover:bg-signal-panel2/70">
      <div className="flex items-start justify-between gap-4">
        <Icon className="h-5 w-5 text-signal-green/75" />
        <span className="font-mono text-[0.58rem] uppercase text-signal-dim transition group-hover:text-signal-green/80">{action}</span>
      </div>
      <h2 className="mt-6 text-lg font-semibold leading-snug text-signal-text">{label}</h2>
      <p className="mt-3 text-sm leading-relaxed text-signal-muted">{text}</p>
      <div className="mt-5 inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase text-signal-green/75">
        continue
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
