"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Boxes, Cpu, Database, Radio, Route } from "lucide-react";

const systems = [
  ["SIGNALWATCH", "operational", "AI ecosystem observability", "websocket telemetry / semantic drift / collector health"],
  ["LiftVision / Barpath AI", "active research", "computer vision biomechanics", "bar path tracking / movement analysis / form telemetry"],
  ["Hytale Username Radar", "watch node", "availability monitoring", "namespace observation / alert routing / lightweight polling"],
];

const stack = [
  ["Frontend", "Next.js / TypeScript / TailwindCSS / Framer Motion"],
  ["Backend", "FastAPI / WebSockets / asyncio / PostgreSQL"],
  ["Infrastructure", "Railway / Vercel / Docker"],
];

const philosophy = [
  "quiet systems over interface noise",
  "observability-first engineering",
  "evaluation visibility before claims",
  "traceability before abstraction",
  "alignment-aware systems thinking",
];

const principles = [
  ["instrumentation", "Systems should expose state, uncertainty, provenance, and failure modes instead of hiding them behind interface polish."],
  ["robustness", "Perception and intelligence systems need evaluation under degraded, shifted, and operationally messy conditions."],
  ["evidence", "Claims should remain traceable to source activity, framework references, browser-side model outputs, or clearly labeled conceptual models."],
];

export default function SystemsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030403] text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(71,108,81,0.10),transparent_28rem)]" />
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(137,227,173,.28)_1px,transparent_1px),linear-gradient(90deg,rgba(137,227,173,.18)_1px,transparent_1px)] [background-size:44px_44px]" />

      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <nav className="flex items-center justify-between border-b border-[#101b15] pb-4 font-mono text-[0.68rem] uppercase text-signal-dim">
          <Link href="/" className="text-signal-green/80 transition hover:text-signal-green">JGSOPS</Link>
          <div className="flex items-center gap-4">
            <Link href="/console" className="transition hover:text-signal-text">console</Link>
            <Link href="/evaluations" className="transition hover:text-signal-text">evaluations</Link>
            <Link href="/case-studies" className="transition hover:text-signal-text">case studies</Link>
            <span>systems node</span>
          </div>
        </nav>

        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid min-h-[58vh] content-center gap-12 py-16 md:grid-cols-[1.2fr_.8fr]"
        >
          <div>
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">JGSOPS</div>
            <h1 className="mt-9 max-w-3xl text-4xl font-semibold leading-tight text-[#eef4ef] md:text-6xl">
              Systems engineering,
              <br />
              observability infrastructure,
              <br />
              <span className="text-[#aeb8b1]">and realtime intelligence systems.</span>
            </h1>
            <div className="mt-10 grid max-w-2xl gap-2 font-mono text-[0.72rem] uppercase text-signal-muted sm:grid-cols-2">
              {["AI observability", "operational telemetry", "evaluation records", "computer vision", "systems engineering", "robustness protocols"].map((item) => (
                <span key={item} className="border-l border-[#24392c] bg-[#050806]/54 px-3 py-2">{item}</span>
              ))}
            </div>
          </div>
          <OperatorPanel />
        </motion.header>

        <section className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
          <div className="console-panel p-5">
            <SectionLabel icon={Boxes} label="current systems" meta="registry" />
            <div className="mt-5 space-y-3">
              {systems.map(([name, status, surface, signal], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="group grid gap-4 border border-[#101b15] bg-[#050806]/72 p-4 transition hover:border-[#2f4a39] md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <motion.span
                        className="h-2 w-2 rounded-full bg-signal-green/70"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2.8 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <h2 className="font-mono text-sm uppercase text-signal-text">{name}</h2>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-signal-muted">{surface}</p>
                    <p className="mt-2 font-mono text-[0.68rem] uppercase text-signal-dim">{signal}</p>
                  </div>
                  <div className="self-start border border-[#1a2b21] px-2 py-1 font-mono text-[0.62rem] uppercase text-signal-olive">{status}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="console-panel p-5">
              <SectionLabel icon={Activity} label="operational status" meta="live surface" />
              <div className="mt-5 space-y-3">
                <Readout label="active systems" value="003" live />
                <Readout label="telemetry" value="online" live />
                <Readout label="websocket" value="routed" live />
                <Readout label="collectors" value="active" live />
                <Readout label="ecosystem monitor" value="observing" live />
              </div>
            </div>

            <div className="console-panel p-5">
              <SectionLabel icon={Route} label="design philosophy" meta="operating mode" />
              <div className="mt-5 space-y-2">
                {philosophy.map((item) => (
                  <div key={item} className="border-l border-[#24392c] bg-[#050806]/60 px-3 py-2 font-mono text-[0.7rem] uppercase text-signal-muted">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 console-panel p-5">
          <SectionLabel icon={Database} label="technical substrate" meta="infrastructure registry" />
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {stack.map(([group, values], index) => (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="border border-[#101b15] bg-[#050806]/70 p-4"
              >
                <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">{group}</div>
                <div className="mt-5 text-sm leading-relaxed text-signal-muted">{values}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-5 console-panel p-5">
          <SectionLabel icon={Route} label="observability principles" meta="operating philosophy" />
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {principles.map(([title, text]) => (
              <div key={title} className="border border-[#101b15] bg-[#050806]/70 p-4">
                <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">{title}</div>
                <p className="mt-3 text-sm leading-relaxed text-signal-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="py-10 font-mono text-[0.68rem] uppercase text-signal-dim">
          Monitoring intelligent infrastructure.
        </footer>
      </section>
    </main>
  );
}

function OperatorPanel() {
  return (
    <div className="console-panel relative min-h-[320px] overflow-hidden p-5">
      <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_center,rgba(137,227,173,.55)_1px,transparent_1px)] [background-size:26px_26px]" />
      <SectionLabel icon={Cpu} label="operator node" meta="systems entity" />
      <svg viewBox="0 0 320 210" className="relative mt-7 h-[210px] w-full">
        <path d="M58 110H262M160 34V178M94 64L226 156M226 64L94 156" stroke="#1f3a2b" strokeWidth="1" strokeDasharray="3 8" />
        <Node x={160} y={110} r={9} label="JGSOPS" />
        <Node x={82} y={72} r={5} label="vision" />
        <Node x={238} y={76} r={5} label="telemetry" />
        <Node x={232} y={154} r={5} label="signals" />
        <Node x={88} y={154} r={5} label="systems" />
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

function SectionLabel({ icon: Icon, label, meta }: { icon: typeof Radio; label: string; meta: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#101b15] pb-3">
      <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className="font-mono text-[0.62rem] uppercase text-signal-dim">{meta}</span>
    </div>
  );
}

function Readout({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-[#101b15] pb-2 font-mono text-[0.72rem]">
      <span className="text-signal-muted">{label}</span>
      <span className="flex items-center gap-2 text-signal-text">
        {live ? <motion.span className="h-1.5 w-1.5 rounded-full bg-signal-green" animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 2.6, repeat: Infinity }} /> : null}
        {value}
      </span>
    </div>
  );
}
