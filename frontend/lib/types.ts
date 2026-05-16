export type Severity = "TRACE" | "WATCH" | "ELEVATED" | "ALERT" | "CRITICAL";
export type ConnectionState = "connecting" | "live" | "reconnecting" | "offline";
export type EventKind =
  | "signal.event"
  | "model.release"
  | "policy.update"
  | "safety.research"
  | "capability.signal"
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
  source_title?: string;
  source_type?: string;
  source_url?: string;
  fetched_at?: string;
  evidence_links?: Array<{ title?: string; url?: string; source?: string }>;
  derived_reason?: string;
  source_count?: number;
  title: string;
  url: string;
  summary: string;
  authors: string[];
  topics: string[];
  importance: number;
  published_at: string;
  severity?: Severity;
  briefing?: string;
  memory?: SignalMemory;
  provenance?: SignalProvenance;
};

export type SignalMemory = {
  topic: string;
  pressure_accumulation: number;
  acceleration: number;
  stability: number;
  confidence: number;
  maturity: string;
  half_life_minutes: number;
  observation_count: number;
  source_counts: Record<string, number>;
  derived_from: string[];
};

export type SignalProvenance = {
  source_counts?: Record<string, number>;
  traces?: Array<{
    id?: string;
    source?: string;
    type?: string;
    title?: string;
    url?: string;
  }>;
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
  memory?: SignalMemory;
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
  ecosystem_drift?: {
    capability_acceleration?: number;
    alignment_intensity?: number;
    governance_pressure?: number;
    multimodal_saturation?: number;
    agentic_momentum?: number;
  };
  heartbeat?: string;
  retry_count?: number;
  collected?: number;
  deduped?: number;
  inserted?: number;
};

export type OperationalTimeline = {
  date: string;
  generated_at: string;
  briefing: {
    title: string;
    lines: string[];
  };
  drift: NonNullable<OperationalTelemetry["ecosystem_drift"]>;
  epochs: Array<{
    kind: string;
    topic: string;
    summary: string;
    pressure: number;
    confidence: number;
    stability: number;
    acceleration: number;
    maturity: string;
    observation_count: number;
    source_counts: Record<string, number>;
  }>;
};

export type EvidenceLink = {
  source_id: string;
  note: string;
};

export type SafetySource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  category: string;
  reliability: "official" | "academic" | "institutional";
  accessed: string;
  summary: string;
};

export type RiskCategory = {
  id: string;
  name: string;
  summary: string;
  why_it_matters: string;
  mitigations: string[];
  evidence: EvidenceLink[];
};

export type JobExposureInsight = {
  id: string;
  area: string;
  pressure: "task exposure" | "transition pressure" | "augmentation potential" | "policy dependency";
  explanation: string;
  benefits: string[];
  transition_risks: string[];
  evidence: EvidenceLink[];
};

export type AlignmentConcept = {
  id: string;
  title: string;
  plain_language: string;
  operational_view: string;
  examples: string[];
  evidence: EvidenceLink[];
};

export type DemoDescriptor = {
  id: string;
  title: string;
  status: "available" | "architecture-ready" | "conceptual";
  category: string;
  summary: string;
  constraints: string[];
  evidence: EvidenceLink[];
};
