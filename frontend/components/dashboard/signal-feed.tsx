"use client";

import { motion } from "framer-motion";
import { ChevronDown, ExternalLink, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { sourceCode, sourceLabel } from "@/lib/api";
import type { Signal } from "@/lib/types";
import { formatUtc } from "@/lib/utils";

export function SignalFeed({ signals }: { signals: Signal[] }) {
  return (
    <Panel>
      <PanelHeader title="real source feed" meta={`${signals.length} source items`} />
      <div className="space-y-3">
        {!signals.length ? (
          <div className="border border-[#101b15] bg-[#050806]/70 p-5">
            <div className="font-mono text-[0.68rem] uppercase text-signal-green/75">awaiting real source items</div>
            <p className="mt-3 text-sm leading-relaxed text-signal-muted">
              The console only shows source-backed ecosystem content here. Heartbeats, collector updates, and infrastructure frames remain in background telemetry.
            </p>
          </div>
        ) : null}
        {signals.slice(0, 48).map((signal, index) => (
          <SignalCard key={signal.fingerprint} signal={signal} index={index} />
        ))}
      </div>
    </Panel>
  );
}

function SignalCard({ signal, index }: { signal: Signal; index: number }) {
  const tags = (signal.topics ?? []).slice(0, 3);
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.015, 0.18) }}
      className="group border border-[#101b15] bg-gradient-to-b from-[#080c09] to-[#050706] px-4 py-3.5 transition hover:border-[#24392c]"
    >
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="text-signal-green">{sourceCode(signal.source)} / {sourceLabel(signal.source)}</Badge>
          <span className="font-mono text-[0.58rem] uppercase text-signal-dim">{signal.source_type ?? "source item"}</span>
          <span className="font-mono text-[0.58rem] text-signal-dim">{formatUtc(signal.published_at)}</span>
        </div>
        <a href={signal.url} target="_blank" className="font-mono text-[0.58rem] uppercase text-signal-green/75 transition hover:text-signal-text">
          <ExternalLink className="inline h-3 w-3" /> source
        </a>
      </div>

      <h3 className="mt-3 text-[0.96rem] font-semibold leading-snug text-[#e2e9e4]">{signal.title}</h3>
      <p className="mt-2 line-clamp-3 max-w-3xl text-[0.8rem] leading-relaxed text-[#aeb8b1]">{signal.summary || "No summary emitted by source."}</p>
      <WhyItMatters topics={signal.topics ?? []} sourceType={signal.source_type} />
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {tags.length ? tags.map((topic) => <Badge key={topic}>{topic}</Badge>) : <Badge>untagged</Badge>}
      </div>

      <details className="mt-3 border-t border-[#101b15] pt-2.5 font-mono text-[0.6rem] text-signal-dim">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-signal-dim transition hover:text-signal-muted">
          <ChevronDown className="h-3 w-3" />
          evidence / provenance
        </summary>
        <div className="mt-2 grid gap-1.5 break-words border-l border-[#18271d] pl-3">
          <span>source={signal.source} / type={signal.source_type ?? "source-item"}</span>
          <span>published={formatUtc(signal.published_at)}{signal.fetched_at ? ` / fetched=${formatUtc(signal.fetched_at)}` : ""}</span>
          {signal.source_count ? <span>source_count={signal.source_count}</span> : null}
          {signal.derived_reason ? <span>derived_reason={signal.derived_reason}</span> : null}
          <span>authors={(signal.authors ?? []).slice(0, 4).join(", ") || "unknown"}</span>
          {(signal.evidence_links ?? []).slice(0, 3).map((link) => (
            <a key={`${link.source}-${link.url}`} href={link.url} target="_blank" className="text-signal-olive">
              evidence={link.source ?? signal.source} :: {link.title ?? link.url}
            </a>
          ))}
          {signal.memory ? (
            <>
              <span>maturity={signal.memory.maturity}</span>
              <span>observations={signal.memory.observation_count}</span>
              <span>half_life={signal.memory.half_life_minutes}m</span>
            </>
          ) : null}
          {signal.provenance?.source_counts ? (
            <span>provenance={Object.entries(signal.provenance.source_counts).map(([source, count]) => `${source}:${count}`).join(" / ")}</span>
          ) : null}
          {(signal.provenance?.traces ?? []).slice(0, 4).map((trace) => (
            <span key={trace.id ?? trace.title}>trace={trace.source} :: {trace.type} :: {trace.title ?? trace.id}</span>
          ))}
        </div>
      </details>
    </motion.article>
  );
}

function WhyItMatters({ topics, sourceType }: { topics: string[]; sourceType?: string }) {
  const text = whyText(topics, sourceType);
  if (!text) return null;
  return (
    <div className="mt-2 flex max-w-3xl items-start gap-2 border-l border-[#1d2f24] bg-[#050806]/44 px-2.5 py-1.5 text-[0.72rem] leading-relaxed text-signal-dim">
      <Info className="mt-0.5 h-3 w-3 shrink-0 text-signal-olive/70" />
      <span>{text}</span>
    </div>
  );
}

function whyText(topics: string[], sourceType?: string) {
  const set = new Set(topics);
  if (sourceType === "policy" || set.has("policy") || set.has("governance")) return "Relevant to deployment safeguards, evaluation practice, or governance monitoring.";
  if (set.has("alignment") || set.has("safety")) return "Relevant to AI safety monitoring and evaluation of frontier-system behavior.";
  if (set.has("agents") || set.has("reasoning")) return "Relevant to agentic systems, long-horizon behavior, or capability evaluation.";
  if (set.has("multimodal") || set.has("vision")) return "Relevant to perception systems and model behavior across input modalities.";
  if (set.has("jobs") || set.has("labor")) return "Relevant to task exposure, transition pressure, or public impact monitoring.";
  return null;
}
