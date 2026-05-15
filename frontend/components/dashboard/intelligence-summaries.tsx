"use client";

import { motion } from "framer-motion";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { sourceLabel } from "@/lib/api";
import type { RealtimeEvent, TrendCluster } from "@/lib/types";

export function IntelligenceSummaries({ clusters, events }: { clusters: TrendCluster[]; events: RealtimeEvent[] }) {
  const summaries = buildSummaries(clusters, events);

  return (
    <Panel>
      <PanelHeader title="cross-source intelligence" meta={`${summaries.length} annotations`} />
      <div className="space-y-2">
        {summaries.map((summary, index) => (
          <motion.div
            key={`${summary.title}-${index}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="border-l border-[#2f4a39] bg-[#050806] px-3 py-2"
          >
            <div className="font-mono text-[0.66rem] uppercase text-signal-olive">{summary.title}</div>
            <div className="mt-1 text-[0.74rem] leading-relaxed text-signal-muted">{summary.body}</div>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

function buildSummaries(clusters: TrendCluster[], events: RealtimeEvent[]) {
  const clusterSummaries = clusters.slice(0, 4).map((cluster) => ({
    title: `${cluster.name} / confidence ${Math.round(cluster.confidence * 100)}%`,
    body: cluster.summary,
  }));

  const recentSources = Array.from(
    new Set(events.map((event) => String(event.payload.source ?? "")).filter((source) => source && source !== "websocket" && source !== "semantic engine"))
  ).slice(0, 4);

  const sourceText = recentSources.map(sourceLabel).join(", ") || "monitored sources";
  const fallback = [
    {
      title: "collector mesh / source overlap",
      body: `Cross-platform signal pressure tracked across ${sourceText}; maintain watch on correlation drift.`,
    },
    {
      title: "normalization route / operational state",
      body: "Realtime normalization, scoring, and websocket activity remain active across the operational bus.",
    },
  ];

  return [...clusterSummaries, ...fallback].slice(0, 5);
}
