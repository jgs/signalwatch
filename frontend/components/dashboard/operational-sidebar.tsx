"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { Activity, Radio, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { sourceLabel } from "@/lib/api";
import type { ConnectionState } from "@/lib/types";
import { cn } from "@/lib/utils";

const sources = [
  "arxiv",
  "alignment_forum",
  "lesswrong_ai",
  "openai_blog",
  "anthropic_blog",
  "deepmind_updates",
  "github_trending_ai",
  "huggingface_trending_models"
];

type SidebarProps = {
  sourceCounts: Record<string, number>;
  topicCounts: Record<string, number>;
  selectedTopic: string;
  selectedSource: string;
  onTopicChange: (topic: string) => void;
  onSourceChange: (source: string) => void;
  connected: boolean;
  connectionState: ConnectionState;
  signalCount: number;
  alertCandidates: number;
};

export function OperationalSidebar({
  sourceCounts,
  topicCounts,
  selectedTopic,
  selectedSource,
  onTopicChange,
  onSourceChange,
  connected,
  connectionState,
  signalCount,
  alertCandidates
}: SidebarProps) {
  const topics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const activeSources = Array.from(new Set([...sources, ...Object.keys(sourceCounts)]));
  const primarySources = activeSources.slice(0, 6);

  return (
    <aside className="border-b border-signal-line bg-signal-panel/95 px-4 py-5 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-[286px] lg:border-b-0 lg:border-r">
      <div className="border-b border-signal-line pb-4">
        <div className="text-lg font-semibold text-signal-text">SIGNALWATCH</div>
        <div className="mt-1 text-sm leading-relaxed text-signal-muted">A live view of AI safety, releases, policy, and robustness signals with sources attached.</div>
        <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[0.62rem] uppercase">
          <Link href="/start" className="border border-signal-line px-2 py-1 text-signal-muted transition hover:border-signal-green/45 hover:text-signal-text">start</Link>
          <Link href="/console" className="border border-signal-line px-2 py-1 text-signal-green/80 transition hover:border-signal-green/45">console</Link>
          <Link href="/evidence" className="border border-signal-line px-2 py-1 text-signal-muted transition hover:border-signal-green/45 hover:text-signal-text">ledger</Link>
          <Link href="/timeline" className="border border-signal-line px-2 py-1 text-signal-muted transition hover:border-signal-green/45 hover:text-signal-text">timeline</Link>
          <Link href="/labs/perception" className="border border-signal-line px-2 py-1 text-signal-muted transition hover:border-signal-green/45 hover:text-signal-text">vision</Link>
          <Link href="/safety" className="border border-signal-line px-2 py-1 text-signal-muted transition hover:border-signal-green/45 hover:text-signal-text">safety</Link>
          <Link href="/evaluations" className="border border-signal-line px-2 py-1 text-signal-muted transition hover:border-signal-green/45 hover:text-signal-text">tests</Link>
          <Link href="/labs" className="border border-signal-line px-2 py-1 text-signal-muted transition hover:border-signal-green/45 hover:text-signal-text">labs</Link>
          <Link href="/learn/llm-training" className="border border-signal-line px-2 py-1 text-signal-muted transition hover:border-signal-green/45 hover:text-signal-text">learn</Link>
          <Link href="/learn/glossary" className="border border-signal-line px-2 py-1 text-signal-muted transition hover:border-signal-green/45 hover:text-signal-text">glossary</Link>
          <Link href="/methodology" className="border border-signal-line px-2 py-1 text-signal-muted transition hover:border-signal-green/45 hover:text-signal-text">method</Link>
          <Link href="/systems" className="border border-signal-line px-2 py-1 text-signal-muted transition hover:border-signal-green/45 hover:text-signal-text">systems</Link>
        </div>
      </div>

      <SidebarSection icon={Radio} title="sources">
        <div className="space-y-1">
          {primarySources.map((source) => {
            const count = sourceCounts[source] ?? 0;
            const active = selectedSource === source;
            return (
              <button
                key={source}
                onClick={() => onSourceChange(active ? "" : source)}
                className={cn(
                  "group flex w-full items-center justify-between py-1.5 text-left font-mono text-[0.72rem] text-signal-muted transition",
                  active && "text-signal-green"
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <motion.span
                    className={cn("relative h-2 w-2 rounded-full border border-signal-line bg-signal-panel2", count > 0 && "border-signal-green/50 bg-signal-green/80")}
                    animate={count > 0 ? { opacity: [0.48, 1, 0.48], scale: [0.92, 1, 0.92] } : { opacity: 0.42, scale: 0.86 }}
                    transition={{ duration: 2.8 + (source.length % 4) * 0.35, repeat: count > 0 ? Infinity : 0, ease: "easeInOut" }}
                  />
                  <span className="truncate">{sourceLabel(source)}</span>
                </span>
                <span className="text-signal-text">{String(count).padStart(3, "0")}</span>
              </button>
            );
          })}
        </div>
        <details className="mt-3 border-t border-signal-line pt-3 font-mono text-[0.64rem] text-signal-dim">
          <summary className="cursor-pointer list-none text-signal-muted">more sources / {activeSources.length} monitored</summary>
          <div className="mt-2 space-y-1">
            {activeSources.slice(6).map((source) => (
              <button
                key={source}
                onClick={() => onSourceChange(selectedSource === source ? "" : source)}
                className="flex w-full items-center justify-between py-1 text-left transition hover:text-signal-text"
              >
                <span>{sourceLabel(source)}</span>
                <span>{sourceCounts[source] ?? 0}</span>
              </button>
            ))}
          </div>
        </details>
      </SidebarSection>

      <SidebarSection icon={Activity} title="filter by topic">
        <details className="font-mono text-[0.64rem] text-signal-dim">
          <summary className="cursor-pointer list-none text-signal-muted">filter topics / {topics.length || 0}</summary>
          <div className="mt-2 flex flex-wrap gap-1.5 opacity-80">
            <TopicPill active={!selectedTopic} onClick={() => onTopicChange("")}>all</TopicPill>
            {topics.map(([topic, count]) => (
              <TopicPill key={topic} active={selectedTopic === topic} onClick={() => onTopicChange(topic)}>
                {topic}:{count}
              </TopicPill>
            ))}
          </div>
        </details>
      </SidebarSection>

      <SidebarSection icon={ShieldCheck} title="system status">
        <Readout label="connection" value={connectionState} live={connected} />
        <Readout label="items" value={String(signalCount).padStart(3, "0")} />
        <Readout label="watch list" value={String(alertCandidates).padStart(2, "0")} />
        <Readout label="evidence mode" value="source-first" />
      </SidebarSection>

      <div className="mt-4 border-l border-signal-line/70 px-3 py-2 text-xs leading-relaxed text-signal-dim">
        No item is invented. If sources are unavailable, SIGNALWATCH shows the gap.
      </div>
    </aside>
  );
}

function SidebarSection({
  title,
  icon: Icon,
  children
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <section className="mt-4 border-t border-signal-line pt-3">
      <div className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-dim">
        <Icon className="h-3.5 w-3.5 text-signal-olive" />
        {title}
      </div>
      {children}
    </section>
  );
}

function Readout({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 font-mono text-[0.72rem]">
      <span className="text-signal-muted">{label}</span>
      <span className="flex items-center gap-1.5 text-signal-text">
        {live ? <motion.span className="h-1.5 w-1.5 rounded-full bg-signal-green" animate={{ opacity: [0.28, 0.78, 0.28] }} transition={{ duration: 4.2, repeat: Infinity }} /> : null}
        {value}
      </span>
    </div>
  );
}

function TopicPill({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border border-signal-line bg-signal-panel px-1.5 py-1 font-mono text-[0.6rem] text-signal-dim transition hover:border-signal-green/45 hover:text-signal-text",
        active && "border-signal-green/45 text-signal-green"
      )}
    >
      {children}
    </button>
  );
}
