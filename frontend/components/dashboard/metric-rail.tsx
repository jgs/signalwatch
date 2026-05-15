"use client";

import { motion } from "framer-motion";

export function MetricRail({
  signalCount,
  sourceCount,
  alertCandidates,
  maxImportance,
  signalsPerMinute,
  trendVelocity,
  websocketClients,
  semanticClusterCount,
  activeAlerts,
  retryCount,
  collectorUptime,
  sourceReliability,
  normalizationPressure,
  collectorLatency
}: {
  signalCount: number;
  sourceCount: number;
  alertCandidates: number;
  maxImportance: number;
  signalsPerMinute: number;
  trendVelocity: number;
  websocketClients: number;
  semanticClusterCount: number;
  activeAlerts: number;
  retryCount: number;
  collectorUptime: number;
  sourceReliability: number;
  normalizationPressure: number;
  collectorLatency: number;
}) {
  const metrics = [
    ["live signals", String(signalCount).padStart(3, "0"), "filtered operational feed"],
    ["monitoring sources", String(sourceCount).padStart(2, "0"), "8 collectors configured"],
    ["active alerts", String(activeAlerts || alertCandidates).padStart(2, "0"), "alert / critical routes"],
    ["max importance", maxImportance.toFixed(2), "source weighted score"],
    ["signals/minute", signalsPerMinute.toFixed(1), "normalization throughput"],
    ["trend velocity", String(trendVelocity).padStart(2, "0"), "ws trend events"],
    ["semantic clusters", String(semanticClusterCount).padStart(2, "0"), "active correlation groups"],
    ["ws clients", String(websocketClients).padStart(2, "0"), "active realtime viewers"],
    ["collector latency", `${Math.round(collectorLatency)}ms`, "health telemetry p50"],
    ["collector uptime", `${Math.round(collectorUptime * 100)}%`, "rolling source availability"],
    ["source reliability", `${Math.round(sourceReliability * 100)}%`, "failure adjusted confidence"],
    ["retry count", String(retryCount).padStart(2, "0"), "collector recovery attempts"],
    ["norm pressure", normalizationPressure.toFixed(2), "schema routing saturation"]
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {metrics.map(([label, value, foot], index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="console-panel p-4 transition hover:border-[#2f4a39]"
        >
          <div className="terminal-label">{label}</div>
          <div className="mt-4 font-mono text-2xl font-semibold text-signal-text">{value}</div>
          <div className="mt-4 text-xs text-signal-dim">{foot}</div>
        </motion.div>
      ))}
    </div>
  );
}
