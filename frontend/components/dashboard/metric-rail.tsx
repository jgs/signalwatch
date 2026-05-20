"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export function MetricRail({
  pulseKey,
  signalCount,
  sourceCount,
  signalsPerMinute,
  websocketClients,
  collectorUptime,
  collectorLatency
}: {
  pulseKey: number;
  signalCount: number;
  sourceCount: number;
  signalsPerMinute: number;
  websocketClients: number;
  collectorUptime: number;
  collectorLatency: number;
}) {
  const metrics = [
    metric("items shown", signalCount, "updates with sources", (value) => String(Math.round(value)).padStart(3, "0")),
    metric("source groups", sourceCount, "places being watched", (value) => String(Math.round(value)).padStart(2, "0")),
    metric("new item rate", signalsPerMinute, "items per minute", (value) => value.toFixed(1)),
    metric("response time", collectorLatency, "median collector delay", (value) => `${Math.round(value)}ms`),
    metric("source uptime", collectorUptime * 100, "collector availability", (value) => `${Math.round(value)}%`),
    metric("live viewers", websocketClients, "open websocket clients", (value) => String(Math.round(value)).padStart(2, "0"))
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {metrics.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{
            opacity: 1,
            y: 0,
            borderColor: pulseKey ? ["#d8e0d8", "#9ab39f", "#d8e0d8"] : "#d8e0d8",
            boxShadow: pulseKey ? ["0 18px 70px rgba(17,27,22,.08)", "0 0 28px rgba(79,126,92,.08)", "0 18px 70px rgba(17,27,22,.08)"] : "0 18px 70px rgba(17,27,22,.08)"
          }}
          transition={{ delay: index * 0.025, duration: 0.9 }}
          className="console-panel relative overflow-hidden p-3.5 transition hover:border-signal-green/45"
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-px bg-signal-green/25"
            animate={{ opacity: [0.12, 0.42, 0.12], x: ["-18%", "18%", "-18%"] }}
            transition={{ duration: 6 + (index % 4), repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="terminal-label">{item.label}</div>
          <AnimatedMetricValue value={item.value} format={item.format} />
          <div className="mt-3 text-[0.7rem] text-signal-dim">{item.foot}</div>
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

  return <motion.div className="mt-3 font-mono text-xl font-semibold tabular-nums text-signal-text">{display}</motion.div>;
}
