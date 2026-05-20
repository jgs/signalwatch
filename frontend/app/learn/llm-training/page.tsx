import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckCircle2, Database, Eye, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";
import { OperationalNav } from "@/components/layout/operational-nav";

export const metadata: Metadata = {
  title: "How LLM Training Works",
  description: "A clear, visual explanation of how large language models are trained, evaluated, aligned, deployed, and monitored.",
};

const stages = [
  {
    icon: Database,
    title: "1. Collect and filter data",
    body: "Training starts with large collections of text and code. Teams remove low-quality, unsafe, duplicated, or unusable material where possible.",
    note: "The quality of the data strongly affects the model's behavior.",
  },
  {
    icon: Wrench,
    title: "2. Tokenize the text",
    body: "Text is split into small units called tokens. The model does not directly see words as humans do; it learns patterns across token sequences.",
    note: "Tokens make text computable.",
  },
  {
    icon: BookOpen,
    title: "3. Pretrain the model",
    body: "During pretraining, the model repeatedly tries to predict the next token. Over time, it learns grammar, facts, style, code patterns, and reasoning-like behavior.",
    note: "This is where most raw capability appears.",
  },
  {
    icon: CheckCircle2,
    title: "4. Evaluate during training",
    body: "Teams test whether the model is improving, memorizing too much, failing safety checks, or becoming unreliable on important tasks.",
    note: "Evaluation starts before deployment.",
  },
  {
    icon: ShieldCheck,
    title: "5. Tune for helpful behavior",
    body: "After pretraining, models are usually tuned with examples, instructions, feedback, or preference data so they respond in more useful and safer ways.",
    note: "This step changes behavior, not just knowledge.",
  },
  {
    icon: Eye,
    title: "6. Monitor after release",
    body: "Deployment is not the end. Real users, real prompts, real images, and real environments reveal failures that training did not fully cover.",
    note: "This is where observability becomes essential.",
  },
];

const limits = [
  "This page is a simplified educational explanation, not a private recipe from any specific AI lab.",
  "Different labs use different datasets, safety methods, preference systems, evaluations, and deployment rules.",
  "Training a capable model does not prove it is safe. Behavior still needs monitoring, evidence, and failure visibility.",
  "SIGNALWATCH focuses on what can be inspected: sources, timestamps, model outputs, evidence packets, and unavailable states.",
];

export default function LlmTrainingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_12%,rgba(155,216,179,0.10),transparent_30rem)]" />
      <section className="relative mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <OperationalNav active="llm-training" />

        <header className="py-12 md:py-16">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-signal-green/80">learn</div>
          <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-tight text-signal-text md:text-5xl">
            How a language model is trained
            <br />
            <span className="text-signal-muted">from raw text to monitored deployment.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-sm leading-relaxed text-signal-muted">
            A large language model, or LLM, is trained by learning patterns from text and then being evaluated, tuned, stress-tested, and monitored. This page explains the process in plain language.
          </p>
          <Link
            href="/learn/glossary"
            className="mt-5 inline-flex border border-signal-line bg-signal-panel2/60 px-3 py-2 font-mono text-[0.62rem] uppercase text-signal-green/80 transition hover:border-signal-green/50"
          >
            open glossary
          </Link>
        </header>

        <section className="console-panel overflow-x-auto p-3">
          <img
            src="/education/llm-training-flow.svg"
            alt="Diagram showing the simplified LLM training path from data collection to deployment monitoring."
            className="min-w-[760px] w-full"
          />
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stages.map((stage) => (
            <StageCard key={stage.title} {...stage} />
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <div className="console-panel overflow-x-auto p-3">
            <img
              src="/education/evidence-loop.svg"
              alt="Diagram showing the evidence loop from real-world input to model behavior, observed facts, action, and monitoring."
              className="min-w-[620px] w-full"
            />
          </div>

          <section className="console-panel p-5">
            <div className="flex items-center gap-2 border-b border-signal-line/60 pb-3 font-mono text-[0.68rem] uppercase text-signal-green/80">
              <ShieldCheck className="h-3.5 w-3.5" />
              why SIGNALWATCH cares
            </div>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-signal-muted">
              <p>
                Training creates a model, but real-world use reveals how it behaves under pressure: unclear prompts, degraded images, missing context, biased data, tool errors, or unfamiliar situations.
              </p>
              <p>
                SIGNALWATCH is built around that gap. It does not claim a model is safe because it passed a benchmark. It records evidence, timestamps, source links, confidence movement, and missing outputs.
              </p>
              <p className="border-l border-signal-line bg-signal-panel2/52 px-3 py-2 font-mono text-[0.64rem] uppercase text-signal-dim">
                core idea / after training, behavior still needs observation
              </p>
            </div>
          </section>
        </section>

        <section className="mt-5 console-panel p-5">
          <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
            <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">important boundaries</div>
            <div className="font-mono text-[0.6rem] uppercase text-signal-dim">education / not private lab documentation</div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {limits.map((limit) => (
              <div key={limit} className="border-l border-signal-line bg-signal-panel2/52 px-3 py-2 text-sm leading-relaxed text-signal-muted">
                {limit}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function StageCard({
  icon: Icon,
  title,
  body,
  note,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  note: string;
}) {
  return (
    <article className="border border-signal-line/70 bg-signal-panel/80 p-5">
      <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-signal-muted">{body}</p>
      <div className="mt-4 border-l border-signal-line bg-signal-panel2/52 px-3 py-2 font-mono text-[0.58rem] uppercase text-signal-dim">
        {note}
      </div>
    </article>
  );
}
