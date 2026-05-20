"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Camera, CircuitBoard, ScanEye, ShieldCheck, type LucideIcon } from "lucide-react";
import { fetchCvStatus } from "@/lib/api";
import { EvidencePacketPreview } from "@/components/education/evidence-packet-preview";
import { OperationalCallouts } from "@/components/education/operational-callouts";
import { RealWorldImageBand } from "@/components/education/real-world-image-band";
import { UnavailableStatesGallery } from "@/components/education/unavailable-states-gallery";
import { OperationalNav } from "@/components/layout/operational-nav";
import { SystemStatusBar } from "@/components/layout/system-status-bar";
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
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_10%,rgba(155,216,179,0.10),transparent_30rem)]" />
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(155,216,179,.24)_1px,transparent_1px),linear-gradient(90deg,rgba(155,216,179,.16)_1px,transparent_1px)] [background-size:40px_40px]" />
      <section className="relative mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <OperationalNav active="perception" />
        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-signal-green/80">perception lab</div>
          <h1 className="mt-8 max-w-5xl text-4xl font-semibold leading-tight text-signal-text md:text-5xl">
            See when a vision model stops seeing clearly
            <br />
            <span className="text-signal-muted">under blur, low light, motion, and occlusion.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-sm leading-relaxed text-signal-muted">
            Upload an image or use a webcam. SIGNALWATCH runs COCO-SSD in the browser and records only what the model actually reports: detections, confidence, timing, and failures.
          </p>
          <div className="mt-8">
            <RealOnlyBoundary />
          </div>
          <div className="mt-4">
            <OperationalCallouts compact />
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
          <Panel title="live perception test" icon={Camera} meta={cvStatus?.status ?? "browser inference"}>
            <RealDetectionLab cvMessage={cvStatus?.message} />
          </Panel>
          <div className="space-y-5">
            <Panel title="plain boundary" icon={ShieldCheck} meta="real outputs only">
              <div className="space-y-3">
                <OperationalNote
                  label="purpose"
                  text="This lab shows how detections change when the input gets harder to read. It is not a ranking of models."
                />
                <OperationalNote
                  label="data boundary"
                  text="Detections, confidence, persistence, and replay traces come from browser-side COCO-SSD outputs. Missing outputs stay visible."
                />
                <OperationalNote
                  label="deployment surface"
                  text="Inference runs locally in the browser. The backend does not generate or simulate detections."
                />
              </div>
              <Link
                href="/case-studies"
                className="mt-5 inline-flex border border-signal-line bg-signal-panel2 px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-signal-green/60"
              >
                case studies
              </Link>
            </Panel>
            <Panel title="future pose tests" icon={ScanEye} meta="not simulated">
              <PoseStabilityPanel />
            </Panel>
          </div>
        </section>

        <section className="mt-5 console-panel p-5">
          <div className="flex items-center gap-2 border-b border-signal-line pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">
            <CircuitBoard className="h-3.5 w-3.5" />
            safety-critical context
          </div>
          <div className="mt-5">
            <SafetyCriticalContext />
          </div>
        </section>

        <div className="mt-5">
          <EvidencePacketPreview title="perception evidence packet shape" />
        </div>

        <div className="mt-5">
          <UnavailableStatesGallery title="perception unavailable states" />
        </div>

        <div className="mt-5">
          <RealWorldImageBand
            ids={["low-light-hallway", "motion-blur", "cctv-camera", "thermal-camera"]}
            title="perception operating conditions"
            description="These source-attributed photos show visual conditions the lab is built to reason about. They do not contain detection boxes, confidence values, or precomputed outcomes; those are produced only when the browser model runs."
          />
        </div>
        <SystemStatusBar />
      </section>
    </main>
  );
}

function Panel({ title, icon: Icon, meta, children }: { title: string; icon: LucideIcon; meta: string; children: ReactNode }) {
  return (
    <section className="console-panel p-5">
      <div className="flex items-center justify-between border-b border-signal-line pb-3">
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80"><Icon className="h-3.5 w-3.5" />{title}</div>
        <span className="font-mono text-[0.62rem] uppercase text-signal-dim">{meta}</span>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
