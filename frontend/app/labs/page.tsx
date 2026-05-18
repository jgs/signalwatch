"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Camera, FlaskConical, LineChart, Network, ScanEye, type LucideIcon } from "lucide-react";
import { fetchCvStatus, fetchLabDemos } from "@/lib/api";
import { OperationalNote } from "@/components/labs/overlays/operational-note";
import { RealDetectionLab } from "@/components/labs/perception/real-detection-lab";
import { PoseStabilityPanel } from "@/components/labs/pose/pose-stability-panel";
import type { DemoDescriptor } from "@/lib/types";

export default function LabsPage() {
  const [demos, setDemos] = useState<DemoDescriptor[]>([]);
  const [cvStatus, setCvStatus] = useState<{ status: string; message: string } | null>(null);
  const [proxy, setProxy] = useState(54);
  const [oversight, setOversight] = useState(55);
  const [capability, setCapability] = useState(58);
  const [evaluation, setEvaluation] = useState(48);
  const [interpretability, setInterpretability] = useState(42);
  const [governance, setGovernance] = useState(46);

  const rewardGap = useMemo(() => Math.max(0, proxy - oversight), [proxy, oversight]);
  const oversightGap = useMemo(() => Math.max(0, capability - Math.round((evaluation + interpretability + governance) / 3)), [capability, evaluation, interpretability, governance]);

  useEffect(() => {
    Promise.allSettled([fetchLabDemos(), fetchCvStatus()]).then(([demoResult, statusResult]) => {
      if (demoResult.status === "fulfilled") setDemos(demoResult.value);
      if (statusResult.status === "fulfilled") setCvStatus(statusResult.value);
    });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030403] text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_12%,rgba(71,108,81,0.10),transparent_30rem)]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <Nav />
        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">labs</div>
          <h1 className="mt-9 max-w-4xl text-4xl font-semibold leading-tight text-[#eef4ef] md:text-6xl">
            Perception systems,
            <br />
            confidence,
            <br />
            <span className="text-[#aeb8b1]">and alignment failure modes.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-signal-muted">
            Interactive safety modules. Browser transforms are real; conceptual demos are labeled; model outputs are never fabricated.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <Panel title="real perception under degradation" icon={Camera} meta={cvStatus?.status ?? "browser model"}>
            <RealDetectionLab cvMessage={cvStatus?.message} />
            <Link
              href="/labs/perception"
              className="mt-4 inline-flex border border-[#203528] bg-[#07100b] px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-[#3e654c]"
            >
              open safety-critical perception layer
            </Link>
          </Panel>

          <Panel title="pose stability monitoring" icon={ScanEye} meta="architecture ready">
            <PoseStabilityPanel />
          </Panel>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
          <Panel title="alignment failure sandbox" icon={FlaskConical} meta="conceptual simulation">
            <div className="grid gap-5 md:grid-cols-[.9fr_1.1fr]">
              <div className="relative h-64 overflow-hidden border border-[#101b15] bg-[#050806]">
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(137,227,173,.28)_1px,transparent_1px),linear-gradient(90deg,rgba(137,227,173,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
                <motion.div
                  className="absolute h-4 w-4 border border-signal-green bg-signal-green/40"
                  animate={{ x: `${Math.min(86, proxy)}%`, y: `${Math.max(8, 76 - oversight * 0.55)}%` }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                />
                <div className="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-2 font-mono text-[0.62rem] uppercase text-signal-dim">
                  <div className="border border-[#101b15] bg-[#030403]/80 p-2">intended / safe completion</div>
                  <div className="border border-[#101b15] bg-[#030403]/80 p-2">optimized / proxy shortcut</div>
                </div>
              </div>
              <div className="space-y-4">
                <Control label="proxy objective pressure" value={proxy} setValue={setProxy} />
                <Control label="oversight strength" value={oversight} setValue={setOversight} />
                <div className="border border-[#101b15] bg-[#050806]/70 p-4 font-mono text-[0.68rem] uppercase text-signal-dim">
                  reward hacking pressure / {rewardGap > 30 ? "elevated" : rewardGap > 10 ? "watch" : "contained"}
                </div>
              </div>
            </div>
            <OperationalNote label="conceptual safety model" text="Systems optimize what is measured, not necessarily what humans intended. This is a conceptual toy model, not real-world runtime data." />
          </Panel>

          <Panel title="oversight gap visualization" icon={LineChart} meta="conceptual controls">
            <div className="space-y-4">
              <Curve label="capability growth" value={capability} tone="green" />
              <Curve label="evaluation capability" value={evaluation} tone="olive" />
              <Curve label="interpretability progress" value={interpretability} tone="olive" />
              <Curve label="governance readiness" value={governance} tone="olive" />
              <div className="border border-[#101b15] bg-[#050806]/70 p-4 font-mono text-[0.68rem] uppercase text-signal-dim">
                oversight gap / {oversightGap > 30 ? "elevated" : oversightGap > 12 ? "watch" : "narrow"}
              </div>
              <Control label="capability" value={capability} setValue={setCapability} />
              <Control label="evaluation" value={evaluation} setValue={setEvaluation} />
              <Control label="interpretability" value={interpretability} setValue={setInterpretability} />
              <Control label="governance" value={governance} setValue={setGovernance} />
            </div>
            <OperationalNote label="why this matters" text="Autonomous systems become harder to supervise when capability growth exceeds evaluation, interpretability, and governance readiness. This panel is educational and parameter-driven." />
          </Panel>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          {[
            ["autonomous systems", "Small perception failures can propagate into larger system failures when agents act on degraded scene understanding."],
            ["robotics", "Manipulation, navigation, and human interaction require stable perception under occlusion, low light, and motion."],
            ["medical and industrial vision", "Safety-critical imaging systems need uncertainty reporting because input quality can shift outside training conditions."],
          ].map(([label, text]) => (
            <div key={label} className="console-panel p-5">
              <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
                <Network className="h-3.5 w-3.5" />
                {label}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-signal-muted">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-5 console-panel p-5">
          <div className="flex items-center justify-between border-b border-[#101b15] pb-3">
            <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">future modules registry</div>
            <span className="font-mono text-[0.62rem] uppercase text-signal-dim">{demos.length} modules</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {demos.map((demo) => (
              <div key={demo.id} className="border border-[#101b15] bg-[#050806]/70 p-4">
                <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">{demo.title}</div>
                <div className="mt-2 font-mono text-[0.62rem] uppercase text-signal-dim">{demo.status} / {demo.category}</div>
                <p className="mt-3 text-sm leading-relaxed text-signal-muted">{demo.summary}</p>
                <div className="mt-3 space-y-1 font-mono text-[0.6rem] uppercase text-signal-dim">
                  {demo.constraints.map((constraint) => <div key={constraint}>constraint / {constraint}</div>)}
                </div>
              </div>
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
        <Link href="/safety" className="transition hover:text-signal-text">safety</Link>
        <Link href="/labs" className="text-signal-green/80 transition hover:text-signal-green">labs</Link>
        <Link href="/labs/perception" className="transition hover:text-signal-text">perception</Link>
        <Link href="/timeline" className="transition hover:text-signal-text">timeline</Link>
      </div>
    </nav>
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

function Control({ label, value, setValue, min = 0, max = 100 }: { label: string; value: number; setValue: (value: number) => void; min?: number; max?: number }) {
  return (
    <label className="block font-mono text-[0.68rem] uppercase text-signal-dim">
      <div className="mb-2 flex justify-between">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input className="w-full accent-[#89e3ad]" type="range" min={min} max={max} value={value} onChange={(event) => setValue(Number(event.target.value))} />
    </label>
  );
}

function Curve({ label, value, tone }: { label: string; value: number; tone: "green" | "olive" }) {
  return (
    <div className="font-mono text-[0.68rem] uppercase text-signal-dim">
      <div className="flex justify-between"><span>{label}</span><span>{value}</span></div>
      <div className="mt-2 h-1.5 border border-[#122219] bg-[#07100b]">
        <motion.div className={tone === "green" ? "h-full bg-signal-green/70" : "h-full bg-signal-olive/70"} animate={{ width: `${value}%` }} transition={{ duration: 0.5 }} />
      </div>
    </div>
  );
}
