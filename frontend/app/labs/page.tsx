"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Camera, FlaskConical, LineChart, SlidersHorizontal } from "lucide-react";
import { fetchCvStatus, fetchLabDemos } from "@/lib/api";
import type { DemoDescriptor } from "@/lib/types";

export default function LabsPage() {
  const [demos, setDemos] = useState<DemoDescriptor[]>([]);
  const [cvStatus, setCvStatus] = useState<{ status: string; message: string } | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [occlusion, setOcclusion] = useState(12);
  const [noise, setNoise] = useState(8);
  const [crop, setCrop] = useState(0);
  const [motionBlur, setMotionBlur] = useState(0);
  const [proxy, setProxy] = useState(54);
  const [oversight, setOversight] = useState(55);
  const [capability, setCapability] = useState(58);
  const [evaluation, setEvaluation] = useState(48);
  const [interpretability, setInterpretability] = useState(42);
  const [governance, setGovernance] = useState(46);

  const inputIntegrity = useMemo(() => {
    const degradation = blur * 7 + Math.max(0, 100 - brightness) * 0.55 + occlusion * 0.7 + noise * 0.45 + crop * 0.42 + motionBlur * 6;
    return Math.max(3, Math.min(100, 100 - degradation));
  }, [blur, brightness, occlusion, noise, crop, motionBlur]);
  const rewardGap = useMemo(() => Math.max(0, proxy - oversight), [proxy, oversight]);
  const oversightGap = useMemo(() => Math.max(0, capability - Math.round((evaluation + interpretability + governance) / 3)), [capability, evaluation, interpretability, governance]);

  useEffect(() => {
    Promise.allSettled([fetchLabDemos(), fetchCvStatus()]).then(([demoResult, statusResult]) => {
      if (demoResult.status === "fulfilled") setDemos(demoResult.value);
      if (statusResult.status === "fulfilled") setCvStatus(statusResult.value);
    });
  }, []);

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  function onImageUpload(file?: File) {
    if (!file) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030403] text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_12%,rgba(71,108,81,0.10),transparent_30rem)]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <Nav />
        <header className="py-16">
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

        <section className="grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
          <Panel title="computer vision confidence" icon={Camera} meta={cvStatus?.status ?? "checking"}>
            <p className="text-sm leading-relaxed text-signal-muted">{cvStatus?.message ?? "Model not running in this environment."}</p>
            <label className="mt-4 block border border-[#101b15] bg-[#050806]/70 p-4 font-mono text-[0.68rem] uppercase text-signal-dim transition hover:border-[#2f4a39]">
              <input className="sr-only" type="file" accept="image/*" onChange={(event) => onImageUpload(event.target.files?.[0])} />
              upload image / local preview only / no detections fabricated
            </label>
            <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-[0.66rem] uppercase text-signal-dim">
              <TraceBar label="input integrity" value={inputIntegrity / 100} />
              <TraceBar label="model confidence" value={0} disabled />
            </div>
          </Panel>

          <Panel title="perception under degradation" icon={SlidersHorizontal} meta="browser transform">
            <div className="grid gap-4 md:grid-cols-[1fr_.9fr]">
              <div className="relative h-64 overflow-hidden border border-[#101b15] bg-[#07100b]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Uploaded local perception test"
                    className="h-full w-full object-cover"
                    style={{
                      filter: `blur(${blur + motionBlur * 0.45}px) brightness(${brightness}%) contrast(${100 - noise * 0.2}%)`,
                      transform: `scale(${1 + crop / 100}) translateX(${motionBlur}px)`,
                    }}
                  />
                ) : (
                  <div
                    className="absolute inset-8 border border-signal-green/30 bg-[linear-gradient(135deg,rgba(137,227,173,.18),rgba(154,165,111,.08))]"
                    style={{ filter: `blur(${blur}px) brightness(${brightness}%)`, transform: `scale(${1 + crop / 100})` }}
                  />
                )}
                <div className="absolute inset-0 mix-blend-screen opacity-30" style={{ backgroundImage: `radial-gradient(circle, rgba(216,222,217,.35) 1px, transparent 1px)`, backgroundSize: `${Math.max(3, 18 - noise)}px ${Math.max(3, 18 - noise)}px`, opacity: noise / 100 }} />
                <div className="absolute right-0 top-0 bg-[#030403]/82" style={{ width: `${occlusion}%`, height: `${occlusion * 1.6}%` }} />
                <div className="absolute bottom-3 left-3 border border-[#1a2b21] bg-[#030403]/80 px-2 py-1 font-mono text-[0.6rem] uppercase text-signal-dim">
                  input integrity {Math.round(inputIntegrity)}
                </div>
              </div>
              <div className="space-y-4">
                <Control label="blur" value={blur} setValue={setBlur} max={8} />
                <Control label="low light" value={brightness} setValue={setBrightness} min={35} max={120} />
                <Control label="occlusion" value={occlusion} setValue={setOcclusion} max={52} />
                <Control label="compression/noise" value={noise} setValue={setNoise} max={80} />
                <Control label="crop instability" value={crop} setValue={setCrop} max={38} />
                <Control label="motion blur" value={motionBlur} setValue={setMotionBlur} max={8} />
              </div>
            </div>
            <Why text="Perception systems can degrade under environmental uncertainty even when benchmark performance appears strong. This demo transforms input conditions only; it does not claim model detections." />
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
            <Why text="Systems optimize what is measured, not necessarily what humans intended. This is a conceptual toy model, not real-world runtime data." />
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
            <Why text="Autonomous systems become harder to supervise when capability growth exceeds evaluation, interpretability, and governance readiness. This panel is educational and parameter-driven." />
          </Panel>
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
      <Link href="/" className="text-signal-green/80 transition hover:text-signal-green">JGSOPS</Link>
      <div className="flex items-center gap-4">
        <Link href="/console" className="transition hover:text-signal-text">console</Link>
        <Link href="/safety" className="transition hover:text-signal-text">safety</Link>
        <Link href="/timeline" className="transition hover:text-signal-text">timeline</Link>
      </div>
    </nav>
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

function TraceBar({ label, value, disabled }: { label: string; value: number; disabled?: boolean }) {
  return (
    <div>
      <div className="flex justify-between">
        <span>{label}</span>
        <span>{disabled ? "unavailable" : Math.round(value * 100)}</span>
      </div>
      <div className="mt-2 h-1.5 border border-[#122219] bg-[#07100b]">
        <div className="h-full bg-signal-olive" style={{ width: disabled ? "0%" : `${Math.max(3, value * 100)}%` }} />
      </div>
    </div>
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

function Why({ text }: { text: string }) {
  return <p className="mt-4 border-l border-[#24392c] bg-[#050806]/62 px-3 py-2 text-sm leading-relaxed text-signal-muted">{text}</p>;
}
