"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export function MetricRail({
  pulseKey,
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
  pulseKey: number;
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
    metric("live signals", signalCount, "filtered operational feed", (value) => String(Math.round(value)).padStart(3, "0")),
    metric("monitoring sources", sourceCount, "collector mesh sources", (value) => String(Math.round(value)).padStart(2, "0")),
    metric("active alerts", activeAlerts || alertCandidates, "elevated / alert routes", (value) => String(Math.round(value)).padStart(2, "0")),
    metric("max importance", maxImportance, "source weighted score", (value) => value.toFixed(2)),
    metric("signals/minute", signalsPerMinute, "normalization throughput", (value) => value.toFixed(1)),
    metric("trend velocity", trendVelocity, "ws trend events", (value) => String(Math.round(value)).padStart(2, "0")),
    metric("semantic clusters", semanticClusterCount, "active correlation groups", (value) => String(Math.round(value)).padStart(2, "0")),
    metric("ws clients", websocketClients, "active realtime viewers", (value) => String(Math.round(value)).padStart(2, "0")),
    metric("collector latency", collectorLatency, "health telemetry p50", (value) => `${Math.round(value)}ms`),
    metric("collector uptime", collectorUptime * 100, "rolling source availability", (value) => `${Math.round(value)}%`),
    metric("source reliability", sourceReliability * 100, "failure adjusted confidence", (value) => `${Math.round(value)}%`),
    metric("retry count", retryCount, "collector recovery attempts", (value) => String(Math.round(value)).padStart(2, "0")),
    metric("norm pressure", normalizationPressure, "schema routing saturation", (value) => value.toFixed(2))
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {metrics.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{
            opacity: 1,
            y: 0,
            borderColor: pulseKey ? ["#1a2b21", "#2f4a39", "#1a2b21"] : "#1a2b21",
            boxShadow: pulseKey ? ["0 24px 90px rgba(0,0,0,.28)", "0 0 28px rgba(137,227,173,.055)", "0 24px 90px rgba(0,0,0,.28)"] : "0 24px 90px rgba(0,0,0,.28)"
          }}
          transition={{ delay: index * 0.025, duration: 0.9 }}
          className="console-panel relative overflow-hidden p-4 transition hover:border-[#2f4a39]"
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-px bg-signal-green/25"
            animate={{ opacity: [0.12, 0.42, 0.12], x: ["-18%", "18%", "-18%"] }}
            transition={{ duration: 6 + (index % 4), repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="terminal-label">{item.label}</div>
          <AnimatedMetricValue value={item.value} format={item.format} />
          <div className="mt-4 text-xs text-signal-dim">{item.foot}</div>
        </motion.div>
      ))}
    </div>
  );
}

function metric(label: string, value: number, foot: string, format: (value: number) => string) {
  return { label, value, foot, format };
}

function AnimatedMetricValue({ value, format }: { value: number; format: (value: number) => string }) {
  const motionValue = useMotionValue(value);
  const display = useTransform(motionValue, (latest) => format(latest));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [motionValue, value]);

  return <motion.div className="mt-4 font-mono text-2xl font-semibold tabular-nums text-signal-text">{display}</motion.div>;
}
