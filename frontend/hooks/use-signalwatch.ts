"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchOperationalState, fetchSignals, sourceLabel, WS_BASE } from "@/lib/api";
import type { CollectorHealth, OperationalTelemetry, RealtimeEvent, RelationshipGraph, Signal, TrendCluster } from "@/lib/types";
import { severityFromScore } from "@/lib/utils";

export function useSignalwatch() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [websocketClients, setWebsocketClients] = useState(0);
  const [collectorHealth, setCollectorHealth] = useState<CollectorHealth[]>([]);
  const [clusters, setClusters] = useState<TrendCluster[]>([]);
  const [graph, setGraph] = useState<RelationshipGraph>({ nodes: [], edges: [] });
  const [telemetry, setTelemetry] = useState<OperationalTelemetry>({});

  useEffect(() => {
    fetchSignals().then(setSignals).catch(() => setSignals([]));
    fetchOperationalState()
      .then((state) => {
        setCollectorHealth(state.health ?? []);
        setClusters(state.clusters ?? []);
        setGraph(state.graph ?? { nodes: [], edges: [] });
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${WS_BASE}/ws`);
    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onmessage = (message) => {
      const event = JSON.parse(message.data) as RealtimeEvent | { type: "snapshot"; events: RealtimeEvent[] };
      if (event.type === "snapshot" && "events" in event) {
        setEvents([...(event.events ?? [])].reverse());
        return;
      }
      const realtime = event as RealtimeEvent;
      setEvents((current) => [realtime, ...current].slice(0, 80));
      if (realtime.payload.telemetry) {
        setTelemetry((current) => ({ ...current, ...(realtime.payload.telemetry as OperationalTelemetry) }));
      }
      if (realtime.type === "collection.completed") {
        const incoming = realtime.payload.signals ?? [];
        setSignals((current) => mergeSignals(incoming, current).slice(0, 180));
      }
      if (realtime.type === "signal.scored" && realtime.payload.signal) {
        setSignals((current) => mergeSignals([realtime.payload.signal as Signal], current).slice(0, 180));
      }
      if ((realtime.type === "collector.synced" || realtime.type === "collector.degraded") && realtime.payload.health) {
        setCollectorHealth((current) => mergeHealth(realtime.payload.health as CollectorHealth, current));
      }
      if (realtime.type === "semantic.cluster.generated" && realtime.payload.cluster) {
        setClusters((current) => mergeClusters(realtime.payload.cluster as TrendCluster, current));
      }
      if (realtime.type === "relationship.graph.updated" && realtime.payload.graph) {
        setGraph(realtime.payload.graph as RelationshipGraph);
      }
      if (typeof realtime.payload.websocket_clients === "number") {
        setWebsocketClients(realtime.payload.websocket_clients);
      }
    };
    return () => socket.close();
  }, []);

  const derived = useMemo(() => {
    const sourceCounts = countBy(signals, (signal) => signal.source);
    const topicCounts = countTopics(signals);
    const alertCandidates = signals.filter((signal) => ["ALERT", "CRITICAL"].includes(signal.severity ?? severityFromScore(signal.importance))).length;
    const maxImportance = Math.max(0, ...signals.map((signal) => signal.importance));
    const highActivity = events.filter((event) => event.type === "signal.scored" || event.type === "collection.completed").length;
    const trendVelocity = events.filter((event) => event.type === "trend.detected" || event.type === "trend.acceleration.detected").length;
    const signalsPerMinute = Math.max(0.1, Math.round((signals.length / 12 + highActivity) * 10) / 10);
    const activeAlerts = signals.filter((signal) => ["ALERT", "CRITICAL"].includes(signal.severity ?? severityFromScore(signal.importance))).length;
    const semanticClusterCount = clusters.length;
    const retryCount = telemetry.retry_count ?? collectorHealth.reduce((total, entry) => total + entry.retry_count, 0);
    const collectorUptime =
      telemetry.collector_uptime ??
      (collectorHealth.length ? collectorHealth.filter((entry) => entry.state === "HEALTHY").length / collectorHealth.length : 0);
    const sourceReliability =
      telemetry.source_reliability ??
      (collectorHealth.length ? 1 - collectorHealth.reduce((total, entry) => total + entry.failure_rate, 0) / collectorHealth.length : 0);
    const normalizationPressure = telemetry.normalization_pressure ?? Math.min(1, signals.length / 180);
    const collectorLatency = telemetry.collector_latency_p50 ?? median(collectorHealth.map((entry) => entry.latency_ms));
    return {
      sourceCounts,
      topicCounts,
      alertCandidates,
      maxImportance,
      signalsPerMinute,
      trendVelocity,
      activeAlerts,
      semanticClusterCount,
      retryCount,
      collectorUptime,
      sourceReliability,
      normalizationPressure,
      collectorLatency,
    };
  }, [signals, events, clusters.length, telemetry, collectorHealth]);

  const activity = useMemo(() => {
    if (events.length) return events;
    return signals.slice(0, 10).map((signal) => ({
      type: "signal.normalized",
      timestamp: signal.published_at,
      payload: {
        source: sourceLabel(signal.source),
        title: signal.title,
        score: signal.importance,
        topics: signal.topics,
        severity: signal.severity ?? severityFromScore(signal.importance),
        message: signal.briefing ?? `${sourceLabel(signal.source)} collector normalized a ${signal.topics?.[0] ?? "general"} signal.`
      }
    }));
  }, [events, signals]);

  return { signals, events: activity, connected, websocketClients, collectorHealth, clusters, graph, telemetry, ...derived };
}

function mergeSignals(incoming: Signal[], current: Signal[]) {
  const seen = new Set<string>();
  return [...incoming, ...current].filter((signal) => {
    if (seen.has(signal.fingerprint)) return false;
    seen.add(signal.fingerprint);
    return true;
  });
}

function countBy<T>(items: T[], fn: (item: T) => string) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = fn(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function countTopics(items: Signal[]) {
  return items.reduce<Record<string, number>>((acc, signal) => {
    for (const topic of signal.topics ?? []) {
      acc[topic] = (acc[topic] ?? 0) + 1;
    }
    return acc;
  }, {});
}

function mergeHealth(incoming: CollectorHealth, current: CollectorHealth[]) {
  const rest = current.filter((entry) => entry.source !== incoming.source);
  return [incoming, ...rest].sort((a, b) => a.source.localeCompare(b.source));
}

function mergeClusters(incoming: TrendCluster, current: TrendCluster[]) {
  const rest = current.filter((entry) => entry.name !== incoming.name);
  return [incoming, ...rest].sort((a, b) => b.score - a.score).slice(0, 10);
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}
