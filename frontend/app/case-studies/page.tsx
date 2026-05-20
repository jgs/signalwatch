"use client";

import Link from "next/link";
import { Camera, FileSearch, Gauge, ListChecks, ShieldCheck, type LucideIcon } from "lucide-react";
import { EvidencePacketPreview } from "@/components/education/evidence-packet-preview";
import { OperationalBoundaryPanel } from "@/components/education/operational-boundary-panel";
import { RealWorldImageBand } from "@/components/education/real-world-image-band";
import { UnavailableStatesGallery } from "@/components/education/unavailable-states-gallery";
import { OperationalNav } from "@/components/layout/operational-nav";
import { OperationalSection } from "@/components/layout/operational-section";
import { SystemStatusBar } from "@/components/layout/system-status-bar";
import { PERCEPTION_DATASET_SEQUENCES } from "@/lib/perception-datasets";

const cases = [
  {
    id: "low-light-detection-reliability",
    scenario: "Low-light reliability window",
    setup: ["input: webcam or calibration sample", "preset: low-light route", "model: browser-side COCO-SSD", "cadence: browser-throttled inference"],
    observation: ["mean confidence only when detections exist", "empty inference frames", "confidence variance across adjacent frames"],
    record: ["observation window", "cadence jitter", "FRAME.INTEGRITY", "exported frame timestamps"],
    boundary: "The run can show detector output instability for this input and browser session. It cannot generalize to all detectors or deployments.",
    evidence: ["temporal trace", "evidence JSON", "detection history"],
  },
  {
    id: "partial-visibility-persistence",
    scenario: "Partial-visibility continuity",
    setup: ["input: uploaded scene or webcam", "preset: partial visibility", "degradation: occlusion + crop instability", "model: browser-side COCO-SSD"],
    observation: ["lost classes between adjacent frames", "drop and recovery transitions", "baseline comparison when an upload is used"],
    record: ["TRACKING.PERSISTENCE", "continuity transitions", "drop events", "class continuity breaks"],
    boundary: "Continuity markers are class-level observations from model outputs. They do not establish object identity or tracking persistence beyond emitted detections.",
    evidence: ["continuity markers", "drop events", "baseline readout"],
  },
  {
    id: "compression-artifact-frame-integrity",
    scenario: "Compression frame integrity",
    setup: ["input: local image or webcam", "preset: compressed feed", "degradation: noise and contrast pressure", "model: browser-side COCO-SSD"],
    observation: ["empty-frame rate", "class instability", "confidence range for detected frames"],
    record: ["empty frames", "min confidence", "max confidence", "observed classes"],
    boundary: "The record exposes whether this run produced unusable inference frames. It does not infer why the detector failed beyond recorded degradation settings.",
    evidence: ["FRAME.INTEGRITY", "confidence range", "evidence packet"],
  },
  {
    id: "motion-instability-temporal-consistency",
    scenario: "Motion consistency trace",
    setup: ["input: webcam movement or sample", "preset: motion instability", "degradation: blur + motion offset", "model: browser-side COCO-SSD"],
    observation: ["adjacent-frame confidence deltas", "class continuity breaks", "replay index movement"],
    record: ["TEMPORAL.CONSISTENCY", "cadence seconds", "cadence jitter", "replay frame state"],
    boundary: "The trace documents emitted detection history. It does not synthesize video replay frames or estimate motion vectors.",
    evidence: ["temporal replay", "cadence readout", "class breaks"],
  },
];

const protocol = [
  "select input",
  "apply degradation preset",
  "run browser-side inference",
  "hold observation window",
  "inspect continuity markers",
  "export evidence JSON",
  "compare records without generalizing beyond the run",
];

const packetFields = [
  "schema",
  "generatedAt",
  "model",
  "inferenceBoundary",
  "observationWindow",
  "operationalObservations",
  "continuityTransitions",
  "frames",
];

const runSheet = [
  ["input selected", "requires webcam, upload, or imported calibration sample"],
  ["degradation configured", "preset and manual controls must be visible before inference"],
  ["model loaded", "browser-side model state must be available or explicitly unavailable"],
  ["observation window held", "frame history must exist before temporal claims"],
  ["packet exported", "evidence JSON is created only after real output history exists"],
];

const proofBoundary = [
  ["can show", "confidence instability, empty frames, dropped detections, and continuity breaks in this browser/model/input session"],
  ["can show", "how a selected degradation changes the emitted COCO-SSD output history"],
  ["cannot prove", "universal model failure across all detectors, datasets, environments, or deployments"],
  ["cannot prove", "overall safety of a deployed perception system without broader evaluation coverage"],
];

export default function CaseStudiesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_12%,rgba(155,216,179,0.09),transparent_30rem)]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <OperationalNav active="case-studies" />
        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-signal-green/80">case studies</div>
          <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-tight text-signal-text md:text-5xl">
            Simple, repeatable tests
            <br />
            <span className="text-signal-muted">for checking vision model failures.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-sm leading-relaxed text-signal-muted">
            Each protocol says what to test, what to record, and what the result can and cannot prove. Evidence comes from running the perception lab, not from prefilled analytics.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-2">
          {cases.map((item) => (
            <CaseCard key={item.id} {...item} />
          ))}
        </section>

        <div className="mt-5">
          <OperationalSection title="case-study run sheet" meta="checklist structure / no prefilled run result" icon={ListChecks}>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            {runSheet.map(([label, detail], index) => (
              <div key={label} className="border border-signal-line bg-signal-panel/66 p-3">
                <div className="font-mono text-[0.56rem] uppercase text-signal-green/70">{String(index + 1).padStart(2, "0")} / {label}</div>
                <p className="mt-2 text-xs leading-relaxed text-signal-muted">{detail}</p>
              </div>
            ))}
            </div>
          </OperationalSection>
        </div>

        <div className="mt-5">
          <OperationalBoundaryPanel title="case-study evidence boundary" />
        </div>

        <div className="mt-5">
          <RealWorldImageBand compact />
        </div>

        <section className="mt-5 console-panel p-5">
          <div className="flex flex-col justify-between gap-3 border-b border-signal-line pb-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
              <FileSearch className="h-3.5 w-3.5" />
              dataset sequence registry
            </div>
            <div className="font-mono text-[0.6rem] uppercase text-signal-dim">protocols only until real frames are imported</div>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {PERCEPTION_DATASET_SEQUENCES.map((sequence) => (
              <div key={sequence.id} className="border border-signal-line bg-signal-panel/62 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <div className="font-mono text-[0.62rem] uppercase text-signal-green/75">{sequence.scenarioType} / {sequence.assetStatus.replace("-", " ")}</div>
                  <div className="font-mono text-[0.56rem] uppercase text-signal-dim">{sequence.temporalProperties.minimumFrames} frame minimum</div>
                </div>
                <div className="mt-3 text-sm font-semibold text-signal-text">{sequence.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-signal-muted">{sequence.operationalRelevance}</p>
                <div className="mt-3 grid gap-1 font-mono text-[0.56rem] uppercase text-signal-dim sm:grid-cols-2">
                  {sequence.evidenceRequirements.slice(0, 4).map((item) => (
                    <div key={item} className="border-b border-signal-line pb-1">{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <div className="console-panel p-5">
            <div className="flex items-center gap-2 border-b border-signal-line pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">
              <ListChecks className="h-3.5 w-3.5" />
              evidence protocol
            </div>
            <div className="mt-5 space-y-2">
              {protocol.map((step, index) => (
                <div key={step} className="grid grid-cols-[2.2rem_1fr] gap-3 border-l border-signal-line bg-signal-panel/62 px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-muted">
                  <span className="text-signal-green/70">{String(index + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="console-panel p-5">
            <div className="flex items-center gap-2 border-b border-signal-line pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">
              <ShieldCheck className="h-3.5 w-3.5" />
              proof boundary
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {proofBoundary.map(([label, text]) => (
                <div key={`${label}-${text}`} className="border border-signal-line bg-signal-panel/62 p-3">
                  <div className="font-mono text-[0.58rem] uppercase text-signal-green/70">{label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-signal-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-5">
          <EvidencePacketPreview title="case-study export shape" />
        </div>

        <div className="mt-5">
          <UnavailableStatesGallery title="case-study unavailable states" />
        </div>

        <section className="mt-5 console-panel p-5">
          <div className="flex items-center gap-2 border-b border-signal-line pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            reproducibility boundary
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-signal-muted">
            Case-study evidence should be captured from the operational evidence packet: frame count, empty frames, confidence history, detection drop events, class continuity breaks, and exported JSON records. If the model emits no detections, the record should state that plainly.
          </p>
          <div className="mt-5 grid gap-2 font-mono text-[0.6rem] uppercase text-signal-dim sm:grid-cols-2 lg:grid-cols-4">
            {packetFields.map((field) => (
              <div key={field} className="border-b border-signal-line pb-1">{field}</div>
            ))}
          </div>
        </section>
        <SystemStatusBar />
      </section>
    </main>
  );
}

function CaseCard({
  scenario,
  setup,
  observation,
  record,
  boundary,
  evidence,
}: {
  scenario: string;
  setup: string[];
  observation: string[];
  record: string[];
  boundary: string;
  evidence: string[];
}) {
  return (
    <article className="border border-signal-line bg-signal-panel/70 p-5 transition hover:border-signal-green/40">
      <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
        <FileSearch className="h-3.5 w-3.5" />
        {scenario}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Block icon={Camera} title="setup" items={setup} />
        <Block icon={Gauge} title="observation" items={observation} />
      </div>
      <div className="mt-4">
        <Block icon={ListChecks} title="required record" items={record} />
      </div>
      <div className="mt-4 border-l border-signal-green/40 bg-signal-panel/62 px-3 py-2">
        <div className="font-mono text-[0.6rem] uppercase text-signal-green/70">proof boundary</div>
        <p className="mt-1 text-sm leading-relaxed text-signal-muted">{boundary}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[0.58rem] uppercase text-signal-dim">
        {evidence.map((item) => (
          <span key={item} className="border border-signal-line bg-signal-panel2/70 px-1.5 py-1">{item}</span>
        ))}
      </div>
      <Link href="/labs/perception" className="mt-5 inline-flex border border-signal-line bg-signal-panel2 px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-signal-green/60">
        run protocol
      </Link>
    </article>
  );
}

function Block({ icon: Icon, title, items }: { icon: LucideIcon; title: string; items: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase text-signal-green/70">
        <Icon className="h-3 w-3" />
        {title}
      </div>
      <div className="mt-2 space-y-1 text-sm leading-relaxed text-signal-muted">
        {items.map((item) => <div key={item}>{item}</div>)}
      </div>
    </div>
  );
}
