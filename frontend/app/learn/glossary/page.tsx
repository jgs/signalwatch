import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Search, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Glossary",
  description: "Plain-language definitions for common AI safety, evaluation, telemetry, and robustness terms used in SIGNALWATCH.",
};

const groups = [
  {
    title: "Model basics",
    terms: [
      ["LLM", "Large language model. A model trained to read and generate text by learning patterns across many examples.", "A chat assistant that answers a question is usually powered by an LLM."],
      ["Token", "A small piece of text the model processes. It can be a word, part of a word, punctuation, or a code fragment.", "The word 'monitoring' may be split into several tokens."],
      ["Pretraining", "The first large training stage where a model learns broad patterns by predicting text.", "This is where a model learns language structure and many general facts."],
      ["Fine-tuning", "Additional training that changes how the model behaves for a narrower purpose or style.", "A model can be tuned to follow instructions more clearly."],
      ["RLHF", "Reinforcement learning from human feedback. A method where human preferences help steer model responses.", "People compare answers, and that preference signal can shape future behavior."],
    ],
  },
  {
    title: "Evaluation and safety",
    terms: [
      ["Benchmark", "A test set used to compare model performance on specific tasks.", "A math benchmark checks math ability, not overall safety."],
      ["Evaluation", "A structured test of how a system behaves under known conditions.", "SIGNALWATCH treats evaluation as evidence, not just a score."],
      ["Red teaming", "Deliberately trying to make a system fail so weaknesses can be found before deployment.", "A team may test whether a model can be pushed into unsafe instructions."],
      ["Hallucination", "When a model produces information that sounds plausible but is not grounded in truth.", "A model inventing a fake citation is hallucinating."],
      ["Distribution shift", "When real-world inputs differ from the conditions used during training or testing.", "A camera model trained in daylight may fail in low light."],
    ],
  },
  {
    title: "Perception and robustness",
    terms: [
      ["Detection", "A model output saying it found an object or pattern in an input.", "COCO-SSD may report 'person' or 'car' with a bounding box."],
      ["Confidence", "The model's reported score for an output. It is not a guarantee that the output is correct.", "A 70% confidence detection can still be wrong."],
      ["Robustness", "How well a system continues working when conditions get harder or change.", "Blur, compression, motion, and occlusion test robustness."],
      ["Temporal consistency", "Whether outputs stay stable across time instead of changing unexpectedly frame to frame.", "A detected object disappearing and reappearing can show instability."],
      ["Frame integrity", "Whether recent inference frames produced usable detections or became empty.", "A sequence with many empty frames has weak frame integrity."],
    ],
  },
  {
    title: "Evidence and operations",
    terms: [
      ["Provenance", "The trace of where information came from and how it reached the interface.", "A source link, fetch time, and source name are provenance."],
      ["Telemetry", "Operational signals about system behavior, such as latency, connection status, or collector health.", "Telemetry can show whether a source collector is delayed."],
      ["Evidence packet", "A structured export containing timestamps, outputs, settings, and derived observations from a run.", "The perception lab exports evidence packets after real inference."],
      ["Observation window", "The time span or frame span used to compute a measurement.", "Twelve inference frames over ten seconds form an observation window."],
      ["Unavailable state", "A visible state showing that data or model output is missing instead of filling the gap with guesses.", "If the model emits no detection, SIGNALWATCH says so."],
    ],
  },
];

export default function GlossaryPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(155,216,179,0.10),transparent_30rem)]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <Nav />

        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-signal-green/80">learn</div>
          <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-tight text-signal-text md:text-5xl">
            AI glossary
            <br />
            <span className="text-signal-muted">plain definitions for technical words.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-sm leading-relaxed text-signal-muted">
            SIGNALWATCH uses terms from AI safety, evaluation, perception, and observability. This glossary explains them without assuming a machine learning background.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <IntroCard icon={BookOpen} title="Simple first" text="Each definition starts with the practical meaning, not formal math." />
          <IntroCard icon={Search} title="Evidence-focused" text="Terms are explained in the way they appear inside SIGNALWATCH." />
          <IntroCard icon={ShieldCheck} title="No hype" text="The glossary avoids magical claims and keeps uncertainty visible." />
        </section>

        <section className="mt-5 space-y-5">
          {groups.map((group) => (
            <section key={group.title} className="console-panel p-5">
              <div className="border-b border-signal-line/60 pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">{group.title}</div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {group.terms.map(([term, definition, example]) => (
                  <article key={term} className="border border-signal-line/70 bg-signal-panel2/52 p-4">
                    <h2 className="font-mono text-[0.72rem] uppercase text-signal-green/80">{term}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-signal-muted">{definition}</p>
                    <p className="mt-3 border-l border-signal-line px-3 py-2 text-xs leading-relaxed text-signal-dim">
                      Example: {example}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section className="mt-5 console-panel p-5">
          <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">where to go next</div>
          <div className="mt-5 flex flex-wrap gap-2 font-mono text-[0.62rem] uppercase">
            <Link href="/learn/llm-training" className="border border-signal-line bg-signal-panel2/60 px-3 py-2 text-signal-green/80 transition hover:border-signal-green/50">LLM guide</Link>
            <Link href="/evaluations" className="border border-signal-line bg-signal-panel2/60 px-3 py-2 text-signal-muted transition hover:border-signal-green/50 hover:text-signal-text">evaluations</Link>
            <Link href="/labs/perception" className="border border-signal-line bg-signal-panel2/60 px-3 py-2 text-signal-muted transition hover:border-signal-green/50 hover:text-signal-text">perception lab</Link>
            <Link href="/methodology" className="border border-signal-line bg-signal-panel2/60 px-3 py-2 text-signal-muted transition hover:border-signal-green/50 hover:text-signal-text">methodology</Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-signal-line/60 pb-4 font-mono text-[0.68rem] uppercase text-signal-dim">
      <Link href="/" className="text-signal-green/80 transition hover:text-signal-green">SIGNALWATCH</Link>
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Link href="/console" className="transition hover:text-signal-text">console</Link>
        <Link href="/safety" className="transition hover:text-signal-text">safety</Link>
        <Link href="/evaluations" className="transition hover:text-signal-text">evaluations</Link>
        <Link href="/learn/llm-training" className="transition hover:text-signal-text">LLM guide</Link>
        <Link href="/learn/glossary" className="text-signal-green/80 transition hover:text-signal-green">glossary</Link>
      </div>
    </nav>
  );
}

function IntroCard({ icon: Icon, title, text }: { icon: typeof BookOpen; title: string; text: string }) {
  return (
    <div className="console-panel p-4">
      <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase text-signal-green/80">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-signal-muted">{text}</p>
    </div>
  );
}
