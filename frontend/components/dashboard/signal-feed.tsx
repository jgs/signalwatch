"use client";

import { motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { sourceCode, sourceLabel } from "@/lib/api";
import type { Signal } from "@/lib/types";
import { cn, formatUtc, severityClass, severityFromScore } from "@/lib/utils";

export function SignalFeed({ signals }: { signals: Signal[] }) {
  return (
    <Panel>
      <PanelHeader title="signal feed" meta={`${signals.length} normalized artifacts`} />
      <div className="space-y-3">
        {signals.slice(0, 48).map((signal, index) => (
          <SignalCard key={signal.fingerprint} signal={signal} index={index} />
        ))}
      </div>
    </Panel>
  );
}

function SignalCard({ signal, index }: { signal: Signal; index: number }) {
  const severity = signal.severity ?? severityFromScore(signal.importance);
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.015, 0.18) }}
      className={cn(
        "group border bg-gradient-to-b from-[#090d0a] to-[#050706] p-4 transition hover:border-[#2f4a39] hover:shadow-glow",
        severityClass(severity)
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge className="text-signal-green">{sourceCode(signal.source)} / {sourceLabel(signal.source)}</Badge>
          <span className="font-mono text-[0.68rem] text-signal-dim">{formatUtc(signal.published_at)}</span>
        </div>
        <div className="font-mono text-[0.72rem]">{severity} {signal.importance.toFixed(2)}</div>
      </div>

      <h3 className="mt-4 text-[1rem] font-semibold leading-snug text-signal-text">{signal.title}</h3>
      {signal.briefing ? (
        <div className="mt-3 border-l border-[#203428] bg-[#07100b]/70 px-3 py-2 font-mono text-[0.72rem] leading-relaxed text-signal-olive">
          {signal.briefing}
        </div>
      ) : null}
      <p className="mt-3 line-clamp-4 text-[0.8rem] leading-relaxed text-[#aeb8b1]">{signal.summary || "No summary emitted by source."}</p>

      <details className="mt-3 border-t border-[#101b15] pt-3 font-mono text-[0.66rem] text-signal-dim">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-signal-muted">
          <ChevronDown className="h-3 w-3" />
          signal details
        </summary>
        <div className="mt-2 grid gap-1">
          <span>fingerprint={signal.fingerprint}</span>
          <span>source={signal.source}</span>
          <span>severity={severity}</span>
          <span>authors={(signal.authors ?? []).slice(0, 4).join(", ") || "unknown"}</span>
        </div>
      </details>

      <div className="mt-3 flex items-center justify-between gap-4 border-t border-[#101b15] pt-3">
        <div className="flex flex-wrap gap-1.5">
          {(signal.topics ?? []).slice(0, 6).map((topic) => (
            <Badge key={topic}>{topic}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-24 border border-[#122219] bg-[#07100b]">
            <div className="h-full bg-signal-green" style={{ width: `${Math.round(signal.importance * 100)}%` }} />
          </div>
          <a href={signal.url} target="_blank" className="font-mono text-[0.68rem] text-signal-green">
            <ExternalLink className="inline h-3 w-3" /> open
          </a>
        </div>
      </div>
    </motion.article>
  );
}
