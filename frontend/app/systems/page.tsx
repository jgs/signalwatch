"use client";

import { motion } from "framer-motion";
import { Activity, Boxes, Database, GitBranch, Radio, ShieldCheck, type LucideIcon } from "lucide-react";
import { OperationalBoundaryPanel } from "@/components/education/operational-boundary-panel";
import { OperationalCallouts } from "@/components/education/operational-callouts";
import { OperationalNav } from "@/components/layout/operational-nav";
import { SystemStatusBar } from "@/components/layout/system-status-bar";

const registry = [
  {
    icon: Radio,
    label: "runtime telemetry",
    state: "instrumented",
    detail: "Websocket state, collector health, reconnect behavior, and runtime status are surfaced as operational state, not ecosystem facts.",
    traces: ["heartbeat", "collector status", "retry counters"],
  },
  {
    icon: Database,
    label: "source ingestion",
    state: "provenance-aware",
    detail: "Research, policy, release, forum, and repository sources are normalized with timestamps and source references attached.",
    traces: ["source url", "published timestamp", "collector route"],
  },
  {
    icon: Activity,
    label: "perception outputs",
    state: "browser-derived",
    detail: "Detections, confidence, empty frames, and continuity markers come from browser-side model output history.",
    traces: ["COCO-SSD", "frame timestamps", "class continuity"],
  },
  {
    icon: ShieldCheck,
    label: "claim boundary",
    state: "enforced",
    detail: "The system separates source-backed facts, derived context, conceptual demos, and unavailable states.",
    traces: ["no fabricated detections", "no prefilled metrics", "unavailable states"],
  },
];

const stack = [
  ["frontend", "Next.js / TypeScript / Tailwind / Framer Motion"],
  ["backend", "FastAPI / WebSockets / provenance-aware storage"],
  ["runtime", "Docker-ready services / Railway deployment path"],
  ["evaluation", "browser-side model runs / evidence packet export shape"],
];

const principles = [
  ["traceability", "Operational surfaces should show where information came from and what transformation touched it."],
  ["observability", "Runtime behavior, collector state, source activity, and model-output gaps stay visible."],
  ["robustness", "Perception workflows are evaluated under degraded conditions without synthesizing outcomes."],
  ["restraint", "The interface stays calm and instrumented so evidence is easier to inspect."],
];

export default function SystemsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(71,108,81,0.10),transparent_28rem)]" />
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(137,227,173,.28)_1px,transparent_1px),linear-gradient(90deg,rgba(137,227,173,.18)_1px,transparent_1px)] [background-size:44px_44px]" />

      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <OperationalNav active="systems" />

        <header className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1.08fr_.92fr]">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">systems registry</div>
            <h1 className="mt-9 max-w-4xl text-4xl font-semibold leading-tight text-signal-text md:text-6xl">
              Infrastructure surfaces
              <br />
              for evidence-aware
              <br />
              <span className="text-signal-muted">AI observability.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-signal-muted">
              This registry describes SIGNALWATCH architecture boundaries: what is ingested, what is observed at runtime, what is derived, and what must remain unavailable until real data exists.
            </p>
          </motion.div>
          <SystemMap />
        </header>

        <OperationalCallouts compact />

        <section className="mt-5 grid gap-4 md:grid-cols-2">
          {registry.map((item, index) => (
            <RegistryCard key={item.label} {...item} index={index} />
          ))}
        </section>

        <section className="mt-5 console-panel p-5">
          <SectionLabel icon={Boxes} label="technical substrate" meta="implementation registry" />
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {stack.map(([group, values]) => (
              <div key={group} className="border border-signal-line bg-signal-panel/70 p-4">
                <div className="font-mono text-[0.66rem] uppercase text-signal-green/80">{group}</div>
                <p className="mt-4 text-sm leading-relaxed text-signal-muted">{values}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5">
          <OperationalBoundaryPanel title="systems evidence boundary" />
        </div>

        <section className="mt-5 console-panel p-5">
          <SectionLabel icon={GitBranch} label="operating principles" meta="design constraints" />
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {principles.map(([title, text]) => (
              <div key={title} className="border-l border-signal-green/40 bg-signal-panel/62 px-3 py-3">
                <div className="font-mono text-[0.6rem] uppercase text-signal-green/70">{title}</div>
                <p className="mt-2 text-sm leading-relaxed text-signal-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>
        <SystemStatusBar />
      </section>
    </main>
  );
}

function RegistryCard({
  icon: Icon,
  label,
  state,
  detail,
  traces,
  index,
}: {
  icon: LucideIcon;
  label: string;
  state: string;
  detail: string;
  traces: string[];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-signal-line bg-signal-panel/72 p-5 transition hover:border-signal-green/45"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
        <div className="border border-signal-line px-2 py-1 font-mono text-[0.56rem] uppercase text-signal-olive">{state}</div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-signal-muted">{detail}</p>
      <div className="mt-4 grid gap-1 font-mono text-[0.56rem] uppercase text-signal-dim sm:grid-cols-3">
        {traces.map((trace) => (
          <div key={trace} className="border-b border-signal-line pb-1">trace / {trace}</div>
        ))}
      </div>
    </motion.article>
  );
}

function SystemMap() {
  return (
    <div className="console-panel relative min-h-[320px] overflow-hidden p-5">
      <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_center,rgba(137,227,173,.55)_1px,transparent_1px)] [background-size:26px_26px]" />
      <SectionLabel icon={Database} label="system topology" meta="conceptual map" />
      <svg viewBox="0 0 320 210" className="relative mt-7 h-[210px] w-full">
        <path d="M58 110H262M160 34V178M94 64L226 156M226 64L94 156" stroke="#1f3a2b" strokeWidth="1" strokeDasharray="3 8" />
        <Node x={160} y={110} r={9} label="runtime" />
        <Node x={82} y={72} r={5} label="sources" />
        <Node x={238} y={76} r={5} label="model output" />
        <Node x={232} y={154} r={5} label="evidence" />
        <Node x={88} y={154} r={5} label="boundary" />
      </svg>
    </div>
  );
}

function Node({ x, y, r, label }: { x: number; y: number; r: number; label: string }) {
  return (
    <g>
      <motion.circle cx={x} cy={y} r={r} fill="#89e3ad" opacity="0.72" animate={{ opacity: [0.45, 0.9, 0.45] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      <text x={x + 12} y={y + 4} fill="#7f8b83" fontSize="9" fontFamily="Consolas, monospace">{label}</text>
    </g>
  );
}

function SectionLabel({ icon: Icon, label, meta }: { icon: LucideIcon; label: string; meta: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-signal-line pb-3">
      <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className="font-mono text-[0.62rem] uppercase text-signal-dim">{meta}</span>
    </div>
  );
}
