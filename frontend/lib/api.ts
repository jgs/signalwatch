import type { CollectorState, OperationalTelemetry, OperationalTimeline, RealtimeEvent } from "@/lib/types";

export const API_BASE =
  normalizeHttpUrl(
    process.env.NEXT_PUBLIC_API_URL ??
      process.env.NEXT_PUBLIC_SIGNALWATCH_API ??
      "https://signalwatch-production-4416.up.railway.app"
  );

export const WS_EVENTS_URL = normalizeWebsocketUrl(process.env.NEXT_PUBLIC_WS_URL);

export async function fetchTelemetry(): Promise<OperationalTelemetry> {
  return fetchJson(`${API_BASE}/api/telemetry`);
}

export async function fetchOperationalEvents(limit = 80): Promise<RealtimeEvent[]> {
  return fetchJson(`${API_BASE}/api/signals?limit=${limit}`);
}

export async function fetchCollectors(): Promise<CollectorState[]> {
  return fetchJson(`${API_BASE}/api/collectors`);
}

export async function fetchTimeline(): Promise<OperationalTimeline> {
  return fetchJson(`${API_BASE}/api/timeline`);
}

function normalizeHttpUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function normalizeWebsocketUrl(url?: string) {
  const base = (url?.trim() || API_BASE.replace(/^https/, "wss").replace(/^http/, "ws")).replace(/\/+$/, "");
  return base.endsWith("/ws/events") ? base : `${base}/ws/events`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`signalwatch fetch failed: ${response.status}`);
  return response.json();
}

export function sourceLabel(source: string) {
  return (
    {
      arxiv: "arXiv",
      alignment_forum: "Alignment",
      lesswrong_ai: "LessWrong",
      openai_blog: "OpenAI",
      anthropic_blog: "Anthropic",
      deepmind_updates: "DeepMind",
      github_trending_ai: "GitHub",
      huggingface_trending_models: "HuggingFace",
      openai_policy_watcher: "OpenAI Policy",
      anthropic_policy_watcher: "Anthropic Policy",
      arxiv_capability_stream: "arXiv Capabilities",
      github_agentic_runtime_index: "GitHub Runtime",
      huggingface_model_velocity: "HF Velocity",
      alignment_forum_discourse: "Alignment Forum",
      lesswrong_alignment_discourse: "LessWrong"
    }[source] ?? source.replaceAll("_", " ")
  );
}

export function sourceCode(source: string) {
  return (
    {
      arxiv: "AX",
      alignment_forum: "AF",
      lesswrong_ai: "LW",
      openai_blog: "OA",
      anthropic_blog: "AN",
      deepmind_updates: "DM",
      github_trending_ai: "GH",
      huggingface_trending_models: "HF",
      openai_policy_watcher: "OP",
      anthropic_policy_watcher: "AP",
      arxiv_capability_stream: "AX",
      github_agentic_runtime_index: "GH",
      huggingface_model_velocity: "HF",
      alignment_forum_discourse: "AF",
      lesswrong_alignment_discourse: "LW"
    }[source] ?? "SW"
  );
}
