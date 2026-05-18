import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Eye, FileSearch, Gauge, ShieldCheck } from "lucide-react";
import { RealWorldImageBand } from "@/components/education/real-world-image-band";
import { OperationalBoundaryPanel } from "@/components/education/operational-boundary-panel";
import { OperationalCallouts } from "@/components/education/operational-callouts";
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

const rules = [
  "SIGNALWATCH does not invent detections, confidence, incidents, or source claims.",
  "If a model emits no output, the interface shows that absence directly.",
  "Source-backed AI updates keep links, timestamps, and provenance attached.",
  "Educational pages explain concepts; they do not claim to reveal a private lab recipe.",
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
            New to SIGNALWATCH?
            <br />
            <span className="text-signal-muted">Follow this path first.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-sm leading-relaxed text-signal-muted">
            SIGNALWATCH is an evidence-first interface for understanding AI safety signals, model behavior, perception failures, and operational monitoring. This page gives a simple route through the system.
          </p>
          <div className="mt-6">
            <OperationalCallouts compact />
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_.75fr]">
          <div className="console-panel p-5">
            <div className="border-b border-signal-line/60 pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">recommended path</div>
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
            <Link href="/console" className="mt-5 inline-flex border border-signal-line bg-signal-panel2/60 px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-signal-green/50">
              open live console
            </Link>
          </div>
        </section>

        <div className="mt-5">
          <OperationalBoundaryPanel title="start-page evidence boundary" />
        </div>

        <div className="mt-5">
          <RealWorldImageBand compact ids={["control-room", "cctv-camera", "low-light-hallway"]} />
        </div>
        <SystemStatusBar />
      </section>
    </main>
  );
}
