"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchCollectors, fetchOperationalEvents, fetchTelemetry, sourceLabel, WS_EVENTS_URL } from "@/lib/api";
import type {
  CollectorHealth,
  CollectorState,
  ConnectionState,
  OperationalTelemetry,
  RealtimeEvent,
  RelationshipGraph,
  Severity,
  Signal,
  TrendCluster
} from "@/lib/types";
import { severityFromScore } from "@/lib/utils";

const MAX_EVENTS = 120;
const MAX_SIGNALS = 90;

export function useSignalwatch() {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [telemetry, setTelemetry] = useState<OperationalTelemetry>({});
  const [collectors, setCollectors] = useState<CollectorHealth[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [pulseKey, setPulseKey] = useState(0);
  const reconnectAttempt = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const ingestEvent = useCallback((event: RealtimeEvent) => {
    const normalized = normalizeEvent(event);

    setEvents((current) => {
      const key = eventKey(normalized);
      const next = [normalized, ...current.filter((entry) => eventKey(entry) !== key)];
      return next.slice(0, MAX_EVENTS);
    });

    setPulseKey((key) => key + 1);

    const eventTelemetry = telemetryFromEvent(normalized);
    if (eventTelemetry) {
      setTelemetry((current) => ({ ...current, ...eventTelemetry }));
    }

    if (normalized.type === "collector.health") {
      setCollectors((current) => mergeCollector(eventToCollectorHealth(normalized), current));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([fetchTelemetry(), fetchOperationalEvents(), fetchCollectors()]).then((results) => {
      if (cancelled) return;

      const [telemetryResult, eventResult, collectorResult] = results;
      if (telemetryResult.status === "fulfilled") setTelemetry(telemetryResult.value);
      if (eventResult.status === "fulfilled") {
        setEvents(eventResult.value.map(normalizeEvent).slice(0, MAX_EVENTS));
      }
      if (collectorResult.status === "fulfilled") {
        setCollectors(collectorResult.value.map(collectorStateToHealth));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let closedByEffect = false;

    const connect = () => {
      setConnectionState(reconnectAttempt.current > 0 ? "reconnecting" : "connecting");
      const socket = new WebSocket(WS_EVENTS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttempt.current = 0;
        setConnectionState("live");
      };

      socket.onmessage = (message) => {
        const frame = JSON.parse(message.data) as RealtimeEvent | { type: "snapshot"; events: RealtimeEvent[] };
        if (frame.type === "snapshot" && "events" in frame) {
          setEvents((frame.events ?? []).map(normalizeEvent).reverse().slice(0, MAX_EVENTS));
          return;
        }
        ingestEvent(frame as RealtimeEvent);
      };

      socket.onerror = () => {
        socket.close();
      };

      socket.onclose = () => {
        if (closedByEffect) return;
        reconnectAttempt.current += 1;
        setConnectionState("reconnecting");
        const delay = Math.min(12000, 900 * 2 ** Math.min(reconnectAttempt.current, 4));
        reconnectTimer.current = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      closedByEffect = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      socketRef.current?.close();
      setConnectionState("offline");
    };
  }, [ingestEvent]);

  const signals = useMemo(() => eventsToSignals(events), [events]);
  const clusters = useMemo(() => eventsToClusters(events, telemetry), [events, telemetry]);
  const graph = useMemo(() => eventsToGraph(events, clusters), [events, clusters]);

  const derived = useMemo(() => {
    const sourceCounts = countBy(signals, (signal) => signal.source);
    const topicCounts = countTopics(signals);
    const alertCandidates = signals.filter((signal) => ["ELEVATED", "ALERT", "CRITICAL"].includes(signal.severity ?? severityFromScore(signal.importance))).length;
    const maxImportance = Math.max(0, ...signals.map((signal) => signal.importance));
    const activeAlerts = events.filter((event) => ["alignment.alert", "source.latency", "collector.health"].includes(event.type) && eventSeverity(event) !== "TRACE").length;
    const trendVelocity = events.filter((event) => event.type === "trend.spike").length;
    const signalsPerMinute = telemetry.signal_velocity ?? Math.max(0.1, Math.round((signals.length / 10) * 10) / 10);
    const retryCount = collectors.reduce((total, entry) => total + entry.retry_count, 0);
    const collectorUptime =
      telemetry.collector_uptime ??
      telemetry.collector_reliability ??
      (collectors.length ? collectors.filter((entry) => entry.state === "HEALTHY").length / collectors.length : 0);
    const sourceReliability =
      telemetry.source_reliability ??
      telemetry.collector_reliability ??
      (collectors.length ? 1 - collectors.reduce((total, entry) => total + entry.failure_rate, 0) / collectors.length : 0);
    const normalizationPressure = telemetry.normalization_pressure ?? telemetry.trend_pressure ?? Math.min(1, events.length / MAX_EVENTS);
    const collectorLatency = telemetry.collector_latency_p50 ?? telemetry.latency_p50_ms ?? median(collectors.map((entry) => entry.latency_ms));

    return {
      sourceCounts,
      topicCounts,
      alertCandidates,
      maxImportance,
      signalsPerMinute,
      trendVelocity,
      activeAlerts,
      semanticClusterCount: telemetry.semantic_cluster_count ?? clusters.length,
      retryCount,
      collectorUptime,
      sourceReliability,
      normalizationPressure,
      collectorLatency,
    };
  }, [signals, events, clusters.length, telemetry, collectors]);

  return {
    signals,
    events,
    connected: connectionState === "live",
    connectionState,
    pulseKey,
    websocketClients: telemetry.active_clients ?? 0,
    collectorHealth: collectors,
    clusters,
    graph,
    telemetry,
    ...derived
  };
}

function normalizeEvent(event: RealtimeEvent): RealtimeEvent {
  const severity = normalizeSeverity(event.severity ?? event.payload?.severity);
  return {
    ...event,
    severity,
    source: event.source ?? event.payload?.source,
    message: event.message ?? event.payload?.message,
    payload: {
      ...event.payload,
      severity,
      source: event.source ?? event.payload?.source,
      message: event.message ?? event.payload?.message,
    }
  };
}

function telemetryFromEvent(event: RealtimeEvent): OperationalTelemetry | null {
  if (event.type === "system.heartbeat" || event.type === "telemetry.update") {
    return event.payload as OperationalTelemetry;
  }
  const latency = numeric(event.payload.latency_ms);
  if (latency === undefined) return null;
  return {
    latency_p50_ms: latency,
    collector_latency_p50: latency,
    trend_pressure: numeric(event.payload.pressure),
    alignment_drift: numeric(event.payload.drift),
    semantic_cluster_count: numeric(event.payload.cluster_count),
    heartbeat: event.timestamp,
  };
}

function eventsToSignals(events: RealtimeEvent[]): Signal[] {
  return events
    .filter((event) => ["signal.event", "semantic.cluster", "trend.spike", "alignment.alert", "source.latency", "watcher.reconnect"].includes(event.type))
    .slice(0, MAX_SIGNALS)
    .map((event) => {
      const importance = importanceFromEvent(event);
      const source = event.payload.source ?? event.source ?? "signalwatch-runtime";
      return {
        fingerprint: event.id ?? eventKey(event),
        source,
        title: event.message ?? event.payload.message ?? event.type,
        url: "#",
        summary: summaryFor(event),
        authors: ["signalwatch runtime"],
        topics: topicsFor(event),
        importance,
        published_at: event.timestamp,
        severity: eventSeverity(event),
        briefing: `${sourceLabel(source)} :: ${event.type.replace(".", " / ")}`
      };
    });
}

function eventsToClusters(events: RealtimeEvent[], telemetry: OperationalTelemetry): TrendCluster[] {
  const clusterEvents = events.filter((event) => event.type === "semantic.cluster" || event.type === "trend.spike" || event.type === "alignment.alert");
  const clusters = clusterEvents.slice(0, 6).map((event, index) => ({
    name: clusterName(event, index),
    score: importanceFromEvent(event),
    confidence: numeric(event.payload.confidence) ?? 0.82,
    velocity: numeric(event.payload.pressure) ?? telemetry.trend_pressure ?? 0.4,
    pressure: Math.round((numeric(event.payload.pressure) ?? 0.4) * 100),
    acceleration: numeric(event.payload.pressure) ?? 0.2,
    source_pressure: numeric(event.payload.pressure) ?? 0.4,
    semantic_drift: numeric(event.payload.drift) ?? telemetry.alignment_drift ?? 0.2,
    source_overlap: numeric(event.payload.source_overlap) ?? 2,
    sources: [event.payload.source ?? event.source ?? "signalwatch-runtime"],
    topics: topicsFor(event),
    keywords: topicsFor(event).slice(0, 4),
    summary: event.message ?? event.payload.message ?? "Semantic correlation group updated by realtime telemetry."
  }));

  if (clusters.length) return clusters;
  return [
    {
      name: "operational telemetry",
      score: telemetry.trend_pressure ?? 0.42,
      confidence: telemetry.collector_reliability ?? 0.9,
      velocity: telemetry.signal_velocity ?? 0.5,
      pressure: Math.round((telemetry.trend_pressure ?? 0.42) * 100),
      sources: ["signalwatch-runtime"],
      topics: ["telemetry", "collectors"],
      keywords: ["heartbeat", "latency"],
      summary: "Awaiting semantic cluster frames from the live operations stream."
    }
  ];
}

function eventsToGraph(events: RealtimeEvent[], clusters: TrendCluster[]): RelationshipGraph {
  const sourceNodes = Array.from(new Set(events.map((event) => event.payload.source ?? event.source).filter(Boolean))).slice(0, 10);
  return {
    nodes: [
      ...clusters.slice(0, 5).map((cluster) => ({ id: cluster.name, label: cluster.name, type: "cluster" as const, weight: cluster.score })),
      ...sourceNodes.map((source) => ({ id: String(source), label: sourceLabel(String(source)), type: "source" as const, weight: 0.55 }))
    ],
    edges: clusters.flatMap((cluster) =>
      cluster.sources.slice(0, 3).map((source) => ({ source: cluster.name, target: source, weight: cluster.confidence }))
    )
  };
}

function collectorStateToHealth(collector: CollectorState): CollectorHealth {
  return {
    source: collector.name,
    state: collector.status === "online" ? "HEALTHY" : collector.status === "reconnecting" ? "DELAYED" : collector.status === "degraded" ? "DEGRADED" : "OFFLINE",
    latency_ms: collector.latency_ms,
    item_count: collector.indexed,
    retry_count: collector.reconnects,
    failure_rate: Math.max(0, 1 - collector.reliability),
    message: `collector ${collector.status}`
  };
}

function eventToCollectorHealth(event: RealtimeEvent): CollectorHealth {
  const status = String(event.payload.status ?? "degraded") as CollectorState["status"];
  return collectorStateToHealth({
    name: event.payload.name ? String(event.payload.name) : event.payload.source ? String(event.payload.source) : event.source ?? "collector",
    status,
    latency_ms: numeric(event.payload.latency_ms) ?? 0,
    reliability: numeric(event.payload.reliability) ?? 0.96,
    last_event_at: event.timestamp,
    reconnects: numeric(event.payload.reconnects) ?? 0,
    indexed: numeric(event.payload.indexed) ?? 0,
  });
}

function mergeCollector(incoming: CollectorHealth, current: CollectorHealth[]) {
  const rest = current.filter((entry) => entry.source !== incoming.source);
  return [incoming, ...rest].sort((a, b) => a.source.localeCompare(b.source));
}

function normalizeSeverity(severity: unknown): Severity {
  const value = String(severity ?? "trace").toUpperCase();
  if (value === "CRITICAL" || value === "ALERT" || value === "ELEVATED" || value === "WATCH") return value;
  return "TRACE";
}

function eventSeverity(event: RealtimeEvent): Severity {
  return normalizeSeverity(event.severity ?? event.payload.severity);
}

function importanceFromEvent(event: RealtimeEvent) {
  const pressure = numeric(event.payload.pressure);
  const drift = numeric(event.payload.drift);
  const confidence = numeric(event.payload.confidence);
  if (pressure !== undefined || drift !== undefined || confidence !== undefined) {
    return Math.min(0.99, Math.max(0.2, Math.max(pressure ?? 0, drift ?? 0, confidence ?? 0)));
  }
  return { CRITICAL: 0.95, ALERT: 0.88, ELEVATED: 0.8, WATCH: 0.73, TRACE: 0.46 }[eventSeverity(event)];
}

function topicsFor(event: RealtimeEvent) {
  if (event.type === "alignment.alert") return ["alignment", "drift", "discourse"];
  if (event.type === "semantic.cluster") return ["semantic-cluster", "correlation"];
  if (event.type === "trend.spike") return ["trend", "capability"];
  if (event.type === "source.latency") return ["latency", "telemetry"];
  if (event.type === "watcher.reconnect") return ["collector", "reconnect"];
  return ["signal", "telemetry"];
}

function summaryFor(event: RealtimeEvent) {
  const latency = numeric(event.payload.latency_ms);
  const drift = numeric(event.payload.drift);
  const pressure = numeric(event.payload.pressure);
  const parts = [
    latency !== undefined ? `source latency ${Math.round(latency)}ms` : null,
    pressure !== undefined ? `pressure ${pressure.toFixed(2)}` : null,
    drift !== undefined ? `alignment drift ${drift.toFixed(2)}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" / ") : "Operational event routed through the realtime backend.";
}

function clusterName(event: RealtimeEvent, index: number) {
  if (event.type === "alignment.alert") return "alignment drift";
  if (event.type === "trend.spike") return "capability velocity";
  if (event.type === "semantic.cluster") return `semantic cluster ${index + 1}`;
  return event.type;
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

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function numeric(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function eventKey(event: RealtimeEvent) {
  return event.id ?? `${event.type}:${event.timestamp}:${event.message ?? event.payload.message ?? ""}`;
}
