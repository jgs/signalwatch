"use client";

import type { ComponentType, ReactNode } from "react";
import { Activity, Database, Radio, Route, ShieldCheck } from "lucide-react";
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
  const topics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const activeSources = Array.from(new Set([...sources, ...Object.keys(sourceCounts)]));

  return (
    <aside className="border-b border-signal-line bg-[#050806]/95 px-4 py-5 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-[286px] lg:border-b-0 lg:border-r">
      <div className="border-b border-signal-line pb-4">
        <div className="text-lg font-semibold text-signal-text">signalwatch</div>
        <div className="mt-1 font-mono text-[0.68rem] uppercase text-signal-muted">AI ecosystem ops / local node</div>
      </div>

      <SidebarSection icon={Radio} title="sources">
        <div className="space-y-1">
          {activeSources.map((source) => {
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
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full bg-signal-amber",
                      count > 0 && "bg-signal-green shadow-[0_0_10px_rgba(137,227,173,0.45)]"
                    )}
                  />
                  <span className="truncate">{sourceLabel(source)}</span>
                </span>
                <span className="text-signal-text">{String(count).padStart(3, "0")}</span>
              </button>
            );
          })}
        </div>
      </SidebarSection>

      <SidebarSection icon={Activity} title="topics">
        <div className="flex flex-wrap gap-1.5">
          <TopicPill active={!selectedTopic} onClick={() => onTopicChange("")}>all</TopicPill>
          {topics.map(([topic, count]) => (
            <TopicPill key={topic} active={selectedTopic === topic} onClick={() => onTopicChange(topic)}>
              {topic}:{count}
            </TopicPill>
          ))}
        </div>
      </SidebarSection>

      <SidebarSection icon={Route} title="signal routing">
        <Readout label="normalized" value={String(signalCount).padStart(3, "0")} />
        <Readout label="candidate alerts" value={String(alertCandidates).padStart(2, "0")} />
        <Readout label="discord sink" value="standby" />
      </SidebarSection>

      <SidebarSection icon={ShieldCheck} title="active watchers">
        <Readout label="websocket" value={connectionState} live={connected} />
        <Readout label="watch score" value="0.72" />
        <Readout label="collector mesh" value="telemetry" />
      </SidebarSection>

      <SidebarSection icon={Database} title="system status">
        <Readout label="storage" value="postgres ready" />
        <Readout label="scheduler" value="apscheduler" />
        <Readout label="api surface" value="fastapi" />
      </SidebarSection>

      <div className="mt-4 font-mono text-[0.64rem] text-[#223429]">--- operational bus ----------------</div>
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
    <section className="mt-4 border-t border-[#101b15] pt-3">
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
        {live ? <motion.span className="h-1.5 w-1.5 rounded-full bg-signal-green" animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 2.4, repeat: Infinity }} /> : null}
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
        "border border-signal-line bg-[#050806] px-1.5 py-1 font-mono text-[0.64rem] text-signal-muted transition hover:border-[#2f4a39] hover:text-signal-text",
        active && "border-[#2f4a39] text-signal-green"
      )}
    >
      {children}
    </button>
  );
}
