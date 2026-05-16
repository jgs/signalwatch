"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Camera, FlaskConical, SlidersHorizontal } from "lucide-react";
import { fetchCvStatus, fetchLabDemos } from "@/lib/api";
import type { DemoDescriptor } from "@/lib/types";

export default function LabsPage() {
  const [demos, setDemos] = useState<DemoDescriptor[]>([]);
  const [cvStatus, setCvStatus] = useState<{ status: string; message: string } | null>(null);
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [occlusion, setOcclusion] = useState(12);
  const [proxy, setProxy] = useState(50);
  const [oversight, setOversight] = useState(55);
  const rewardGap = useMemo(() => Math.max(0, proxy - oversight), [proxy, oversight]);

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
        <nav className="flex items-center justify-between border-b border-[#101b15] pb-4 font-mono text-[0.68rem] uppercase text-signal-dim">
          <Link href="/" className="text-signal-green/80 transition hover:text-signal-green">JGSOPS</Link>
          <div className="flex items-center gap-4">
            <Link href="/console" className="transition hover:text-signal-text">console</Link>
            <Link href="/safety" className="transition hover:text-signal-text">safety</Link>
            <Link href="/timeline" className="transition hover:text-signal-text">timeline</Link>
          </div>
        </nav>

        <header className="py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">labs</div>
          <h1 className="mt-9 max-w-4xl text-4xl font-semibold leading-tight text-[#eef4ef] md:text-6xl">
            Perception systems,
            <br />
            confidence,
            <br />
            <span className="text-[#aeb8b1]">and alignment failure modes.</span>
          </h1>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Panel title="computer vision confidence" icon={Camera} meta={cvStatus?.status ?? "checking"}>
            <p className="text-sm leading-relaxed text-signal-muted">{cvStatus?.message ?? "Model not running in this environment."}</p>
            <div className="mt-4 border border-[#101b15] bg-[#050806]/70 p-4 font-mono text-[0.68rem] uppercase text-signal-dim">
              inference disabled / no detections fabricated / architecture ready for model plug-in
            </div>
          </Panel>

          <Panel title="perception failure modes" icon={SlidersHorizontal} meta="browser transform">
            <div className="grid gap-4 md:grid-cols-[1fr_.9fr]">
              <div className="relative h-56 overflow-hidden border border-[#101b15] bg-[#07100b]">
                <div
                  className="absolute inset-8 border border-signal-green/30 bg-[linear-gradient(135deg,rgba(137,227,173,.18),rgba(154,165,111,.08))]"
                  style={{ filter: `blur(${blur}px) brightness(${brightness}%)` }}
                />
                <div className="absolute bottom-10 left-12 h-14 w-36 border border-signal-olive/60" style={{ filter: `blur(${blur / 2}px) brightness(${brightness}%)` }} />
                <div className="absolute right-12 top-12 h-24 w-24 border border-signal-green/50" style={{ filter: `blur(${blur / 2}px) brightness(${brightness}%)` }} />
                <div className="absolute right-0 top-0 bg-[#030403]/82" style={{ width: `${occlusion}%`, height: `${occlusion * 1.6}%` }} />
              </div>
              <div className="space-y-4">
                <Control label="blur" value={blur} setValue={setBlur} max={8} />
                <Control label="low light" value={brightness} setValue={setBrightness} min={35} max={120} />
                <Control label="occlusion" value={occlusion} setValue={setOcclusion} max={52} />
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-signal-muted">Concept: perception systems are sensitive to input conditions. This panel transforms pixels only; it does not claim model predictions.</p>
          </Panel>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <Panel title="alignment toy example" icon={FlaskConical} meta="conceptual simulation">
            <div className="space-y-4">
              <Control label="proxy objective" value={proxy} setValue={setProxy} />
              <Control label="oversight strength" value={oversight} setValue={setOversight} />
              <div className="border border-[#101b15] bg-[#050806]/70 p-4 font-mono text-[0.68rem] uppercase text-signal-dim">
                reward hacking pressure / {rewardGap > 30 ? "elevated" : rewardGap > 10 ? "watch" : "contained"}
              </div>
              <p className="text-sm leading-relaxed text-signal-muted">Educational toy model only. It illustrates how optimizing a proxy can diverge from intended behavior when oversight is weak.</p>
            </div>
          </Panel>

          <Panel title="demo registry" icon={FlaskConical} meta={`${demos.length} modules`}>
            <div className="grid gap-3 md:grid-cols-2">
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
          </Panel>
        </section>
      </section>
    </main>
  );
}

function Panel({ title, icon: Icon, meta, children }: { title: string; icon: typeof Camera; meta: string; children: React.ReactNode }) {
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
