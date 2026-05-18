import { Database, FileText, Github, MessageSquareText, Newspaper, ShieldCheck, type LucideIcon } from "lucide-react";
import { sourceLabel } from "@/lib/api";
import type { CollectorHealth } from "@/lib/types";

const sourceRegistry: Array<{
  icon: LucideIcon;
  source: string;
  type: string;
  provenance: string;
}> = [
  { icon: FileText, source: "arxiv", type: "research", provenance: "paper metadata / source URL" },
  { icon: Newspaper, source: "openai_blog", type: "release stream", provenance: "publisher page / timestamp" },
  { icon: Newspaper, source: "anthropic_blog", type: "release stream", provenance: "publisher page / timestamp" },
  { icon: ShieldCheck, source: "openai_policy_watcher", type: "policy", provenance: "official framework source" },
  { icon: Github, source: "github_trending_ai", type: "repository", provenance: "repo URL / trend route" },
  { icon: MessageSquareText, source: "alignment_forum_discourse", type: "discourse", provenance: "forum post / fetch record" },
];

export function SourceRegistryVisual({ health = [] }: { health?: CollectorHealth[] }) {
  const healthBySource = new Map(health.map((entry) => [entry.source, entry]));

  return (
    <section className="console-panel p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
          <Database className="h-3.5 w-3.5" />
          source registry visual
        </div>
        <div className="font-mono text-[0.58rem] uppercase text-signal-dim">collector type / provenance / runtime state</div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sourceRegistry.map(({ icon: Icon, source, type, provenance }) => {
          const healthEntry = healthBySource.get(source);
          const state = healthEntry?.state ?? "UNOBSERVED";
          return (
            <article key={source} className="border border-[#101b15] bg-[#050806]/66 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase text-signal-green/78">
                  <Icon className="h-3.5 w-3.5" />
                  {sourceLabel(source)}
                </div>
                <div className="border border-signal-line/70 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase text-signal-dim">{state}</div>
              </div>
              <div className="mt-4 grid gap-2 font-mono text-[0.56rem] uppercase text-signal-dim">
                <div className="border-b border-[#101b15] pb-1">type / {type}</div>
                <div className="border-b border-[#101b15] pb-1">provenance / {provenance}</div>
                <div className="border-b border-[#101b15] pb-1">
                  runtime / {healthEntry ? `${Math.round(healthEntry.latency_ms)}ms / ${healthEntry.item_count} artifacts` : "awaiting collector frame"}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
