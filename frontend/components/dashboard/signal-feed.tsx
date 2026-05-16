"use client";

import { motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
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
      className="group border border-[#101b15] bg-gradient-to-b from-[#090d0a] to-[#050706] p-4 transition hover:border-[#2f4a39]"
    >
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="text-signal-green">{sourceCode(signal.source)} / {sourceLabel(signal.source)}</Badge>
          <Badge>{signal.source_type ?? "source item"}</Badge>
          <span className="font-mono text-[0.68rem] text-signal-dim">{formatUtc(signal.published_at)}</span>
        </div>
        <a href={signal.url} target="_blank" className="font-mono text-[0.68rem] text-signal-green transition hover:text-signal-text">
          <ExternalLink className="inline h-3 w-3" /> source
        </a>
      </div>

      <h3 className="mt-4 text-[1rem] font-semibold leading-snug text-signal-text">{signal.title}</h3>
      <p className="mt-3 line-clamp-3 text-[0.82rem] leading-relaxed text-[#aeb8b1]">{signal.summary || "No summary emitted by source."}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.length ? tags.map((topic) => <Badge key={topic}>{topic}</Badge>) : <Badge>untagged</Badge>}
      </div>

      <details className="mt-3 border-t border-[#101b15] pt-3 font-mono text-[0.66rem] text-signal-dim">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-signal-muted">
          <ChevronDown className="h-3 w-3" />
          evidence / provenance
        </summary>
        <div className="mt-2 grid gap-1 break-words">
          <span>fingerprint={signal.fingerprint}</span>
          <span>source={signal.source}</span>
          <span>type={signal.source_type ?? "source-item"}</span>
          {signal.source_count ? <span>source_count={signal.source_count}</span> : null}
          {signal.derived_reason ? <span>derived_reason={signal.derived_reason}</span> : null}
          <span>authors={(signal.authors ?? []).slice(0, 4).join(", ") || "unknown"}</span>
          {signal.fetched_at ? <span>fetched_at={signal.fetched_at}</span> : null}
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
