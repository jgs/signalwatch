import type { CollectorHealth, RelationshipGraph, Signal, TrendCluster } from "@/lib/types";

export const API_BASE = process.env.NEXT_PUBLIC_SIGNALWATCH_API ?? "http://127.0.0.1:8000";
export const WS_BASE = API_BASE.replace(/^http/, "ws");

export async function fetchSignals(limit = 160): Promise<Signal[]> {
  const response = await fetch(`${API_BASE}/signals?limit=${limit}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`signal fetch failed: ${response.status}`);
  }
  return response.json();
}

export async function fetchOperationalState(): Promise<{
  health: CollectorHealth[];
  clusters: TrendCluster[];
  graph: RelationshipGraph;
}> {
  const [health, clusters, graph] = await Promise.all([
    fetch(`${API_BASE}/collector-health`, { cache: "no-store" }).then((response) => response.json()),
    fetch(`${API_BASE}/clusters`, { cache: "no-store" }).then((response) => response.json()),
    fetch(`${API_BASE}/graph`, { cache: "no-store" }).then((response) => response.json())
  ]);
  return { health, clusters, graph };
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
      huggingface_trending_models: "HuggingFace"
    }[source] ?? source
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
      huggingface_trending_models: "HF"
    }[source] ?? "SW"
  );
}
