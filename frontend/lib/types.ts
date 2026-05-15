export type Severity = "TRACE" | "WATCH" | "ELEVATED" | "ALERT" | "CRITICAL";
export type ConnectionState = "connecting" | "live" | "reconnecting" | "offline";
export type EventKind =
  | "signal.event"
  | "telemetry.update"
  | "collector.health"
  | "source.latency"
  | "semantic.cluster"
  | "watcher.reconnect"
  | "trend.spike"
  | "alignment.alert"
  | "system.heartbeat";

export type Signal = {
  fingerprint: string;
  source: string;
  title: string;
  url: string;
  summary: string;
  authors: string[];
  topics: string[];
  importance: number;
  published_at: string;
  severity?: Severity;
  briefing?: string;
};

export type RealtimeEvent = {
  id?: string;
  type: string;
  severity?: Severity;
  source?: string;
  message?: string;
  timestamp: string;
  payload: {
    category?: string;
    severity?: Severity;
    source?: string;
    message?: string;
    keyword?: string;
    websocket_clients?: number;
    signals?: Signal[];
    signal?: Signal;
    health?: CollectorHealth;
    cluster?: TrendCluster;
    graph?: RelationshipGraph;
    telemetry?: OperationalTelemetry;
    result?: {
      collected?: number;
      deduped?: number;
      inserted?: number;
      alerts_sent?: number;
    };
    [key: string]: unknown;
  };
};

export type CollectorHealth = {
  source: string;
  state: "HEALTHY" | "DEGRADED" | "DELAYED" | "OFFLINE";
  latency_ms: number;
  item_count: number;
  retry_count: number;
  failure_rate: number;
  message: string;
};

export type CollectorState = {
  name: string;
  status: "online" | "degraded" | "reconnecting" | "offline";
  latency_ms: number;
  reliability: number;
  last_event_at: string;
  reconnects: number;
  indexed: number;
};

export type TrendCluster = {
  name: string;
  score: number;
  confidence: number;
  velocity: number;
  acceleration?: number;
  pressure: number;
  source_pressure?: number;
  semantic_drift?: number;
  source_overlap?: number;
  sources: string[];
  topics: string[];
  keywords: string[];
  summary: string;
};

export type GraphNode = {
  id: string;
  label: string;
  type: "cluster" | "source" | "topic" | "signal" | "paper" | "lab" | "model" | "benchmark" | "discussion";
  weight: number;
};

export type GraphEdge = {
  source: string;
  target: string;
  weight: number;
};

export type RelationshipGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type OperationalTelemetry = {
  status?: "operational" | "degraded";
  uptime_seconds?: number;
  active_clients?: number;
  events_emitted?: number;
  collector_uptime?: number;
  collector_latency_p50?: number;
  latency_p50_ms?: number;
  latency_p95_ms?: number;
  source_reliability?: number;
  collector_reliability?: number;
  signal_velocity?: number;
  normalization_pressure?: number;
  semantic_cluster_count?: number;
  active_trend_count?: number;
  trend_pressure?: number;
  alignment_drift?: number;
  heartbeat?: string;
  retry_count?: number;
  collected?: number;
  deduped?: number;
  inserted?: number;
};
