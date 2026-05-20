"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelHeader } from "@/components/ui/panel";
import type { TrendCluster } from "@/lib/types";

export function TrendClusters({ clusters }: { clusters: TrendCluster[] }) {
  return (
    <Panel>
      <PanelHeader title="advanced trend detection" meta={`${clusters.length} active clusters`} />
      <div className="space-y-3">
        {clusters.length === 0 ? (
          <div className="font-mono text-[0.72rem] text-signal-muted">semantic engine awaiting trend pressure</div>
        ) : (
          clusters.slice(0, 6).map((cluster, index) => (
            <motion.div
              key={cluster.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
              className="border border-signal-line bg-signal-panel p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[0.75rem] uppercase text-signal-green">{cluster.name}</div>
                  <p className="mt-2 text-[0.74rem] leading-relaxed text-signal-muted">{cluster.summary}</p>
                </div>
                <div className="text-right font-mono text-[0.68rem] text-signal-olive">
                  <div>v={cluster.velocity.toFixed(1)}</div>
                  <div>a={(cluster.acceleration ?? 0).toFixed(1)}</div>
                  <div>c={Math.round(cluster.confidence * 100)}%</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[0.62rem] uppercase text-signal-dim">
                <span>src {cluster.source_overlap ?? cluster.sources.length}</span>
                <span>drift {Math.round((cluster.semantic_drift ?? 0) * 100)}%</span>
                <span>pressure {cluster.pressure}</span>
              </div>
              {cluster.memory ? (
                <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[0.6rem] uppercase text-signal-dim">
                  <MemoryTrace label="stability" value={cluster.memory.stability} />
                  <MemoryTrace label="confidence" value={cluster.memory.confidence} />
                  <span className="text-signal-olive">{cluster.memory.maturity}</span>
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {cluster.keywords.slice(0, 5).map((keyword) => (
                  <Badge key={keyword}>{keyword}</Badge>
                ))}
              </div>
              <div className="mt-3 h-1.5 border border-signal-line bg-signal-panel2">
                <div className="h-full bg-signal-olive" style={{ width: `${Math.min(100, cluster.pressure * 7)}%` }} />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Panel>
  );
}

function MemoryTrace({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between gap-2">
        <span>{label}</span>
        <span>{Math.round(value * 100)}</span>
      </div>
      <div className="mt-1 h-1 border border-signal-line bg-signal-panel2">
        <div className="h-full bg-signal-green/70" style={{ width: `${Math.max(4, Math.min(100, value * 100))}%` }} />
      </div>
    </div>
  );
}
