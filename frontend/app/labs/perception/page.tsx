"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Camera, CircuitBoard, ScanEye, ShieldCheck, type LucideIcon } from "lucide-react";
import { fetchCvStatus } from "@/lib/api";
import { OperationalNote } from "@/components/labs/overlays/operational-note";
import { RealDetectionLab } from "@/components/labs/perception/real-detection-lab";
import { RealOnlyBoundary } from "@/components/labs/perception/real-only-boundary";
import { PoseStabilityPanel } from "@/components/labs/pose/pose-stability-panel";
import { SafetyCriticalContext } from "@/components/labs/robustness/safety-critical-context";

export default function SafetyCriticalPerceptionPage() {
  const [cvStatus, setCvStatus] = useState<{ status: string; message: string } | null>(null);

  useEffect(() => {
    fetchCvStatus().then(setCvStatus).catch(() => setCvStatus(null));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030403] text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_10%,rgba(71,108,81,0.12),transparent_30rem)]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(137,227,173,.28)_1px,transparent_1px),linear-gradient(90deg,rgba(137,227,173,.18)_1px,transparent_1px)] [background-size:36px_36px]" />
      <section className="relative mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <Nav />
        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-signal-green/80">safety-critical perception</div>
          <h1 className="mt-9 max-w-5xl text-4xl font-semibold leading-tight text-[#eef4ef] md:text-6xl">
            Operational robustness layer
            <br />
            <span className="text-[#aeb8b1]">for AI vision systems under uncertainty.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-signal-muted">
            Perception systems operating in real environments face uncertainty, degradation, occlusion, instability, and environmental variability that may not appear in benchmark conditions.
          </p>
          <div className="mt-8">
            <RealOnlyBoundary />
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
          <Panel title="realtime perception robustness lab" icon={Camera} meta={cvStatus?.status ?? "browser inference"}>
            <RealDetectionLab cvMessage={cvStatus?.message} />
          </Panel>
          <div className="space-y-5">
            <Panel title="operational frame" icon={ShieldCheck} meta="source bounded">
              <div className="space-y-3">
                <OperationalNote
                  label="purpose"
                  text="This layer is designed to inspect how model outputs move as input conditions degrade. It is not a demonstration of model superiority."
                />
                <OperationalNote
                  label="data boundary"
                  text="Detections, confidence, persistence, and replay telemetry are computed from browser-side COCO-SSD outputs. Missing outputs remain missing."
                />
                <OperationalNote
                  label="deployment surface"
                  text="Inference runs locally in the browser. SIGNALWATCH does not require backend GPU infrastructure for this lab."
                />
              </div>
            </Panel>
            <Panel title="pose robustness direction" icon={ScanEye} meta="future model slot">
              <PoseStabilityPanel />
            </Panel>
          </div>
        </section>

        <section className="mt-5 console-panel p-5">
          <div className="flex items-center gap-2 border-b border-[#101b15] pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">
            <CircuitBoard className="h-3.5 w-3.5" />
            safety-critical context
          </div>
          <div className="mt-5">
            <SafetyCriticalContext />
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
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Link href="/console" className="transition hover:text-signal-text">console</Link>
        <Link href="/safety" className="transition hover:text-signal-text">safety</Link>
        <Link href="/labs" className="transition hover:text-signal-text">labs</Link>
        <Link href="/labs/perception" className="text-signal-green/80 transition hover:text-signal-green">perception</Link>
        <Link href="/methodology" className="transition hover:text-signal-text">methodology</Link>
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
