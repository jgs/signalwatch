export type Severity = "TRACE" | "WATCH" | "ALERT" | "CRITICAL";

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
  type: string;
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
  collector_uptime?: number;
  collector_latency_p50?: number;
  source_reliability?: number;
  signal_velocity?: number;
  normalization_pressure?: number;
  semantic_cluster_count?: number;
  active_trend_count?: number;
  retry_count?: number;
  collected?: number;
  deduped?: number;
  inserted?: number;
};
