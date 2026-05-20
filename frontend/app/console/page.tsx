"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ActivityStream } from "@/components/dashboard/activity-stream";
import { CollectorHealth } from "@/components/dashboard/collector-health";
import { MetricRail } from "@/components/dashboard/metric-rail";
import { OperationalSidebar } from "@/components/dashboard/operational-sidebar";
import { SignalFeed } from "@/components/dashboard/signal-feed";
import { Topbar } from "@/components/dashboard/topbar";
import { SourceRegistryVisual } from "@/components/education/source-registry-visual";
import { UnavailableStatesGallery } from "@/components/education/unavailable-states-gallery";
import { OperationalSection } from "@/components/layout/operational-section";
import { SystemStatusBar } from "@/components/layout/system-status-bar";
import { useSignalwatch } from "@/hooks/use-signalwatch";
import { timeOnly } from "@/lib/utils";
import { ArrowRight, Database, FileSearch, RadioTower, ShieldCheck, TriangleAlert, type LucideIcon } from "lucide-react";
import type { CollectorHealth as CollectorHealthType, Signal } from "@/lib/types";

export default function ConsolePage() {
  const {
    signals,
    events,
    connected,
    connectionState,
    pulseKey,
    sourceCounts,
    topicCounts,
    alertCandidates,
    signalsPerMinute,
    websocketClients,
    collectorHealth,
    collectorUptime,
    collectorLatency
  } = useSignalwatch();
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSource, setSelectedSource] = useState("");

  const filtered = useMemo(
    () =>
      signals.filter((signal) => {
        const topicMatch = selectedTopic ? signal.topics?.includes(selectedTopic) : true;
        const sourceMatch = selectedSource ? signal.source === selectedSource : true;
        return topicMatch && sourceMatch;
      }),
    [signals, selectedTopic, selectedSource]
  );

  const lastUpdate = filtered[0]?.published_at ? timeOnly(filtered[0].published_at) : "cold start";

  return (
    <main className="min-h-screen lg:pl-[286px]">
      <OperationalSidebar
        sourceCounts={sourceCounts}
        topicCounts={topicCounts}
        selectedTopic={selectedTopic}
        selectedSource={selectedSource}
        onTopicChange={setSelectedTopic}
        onSourceChange={setSelectedSource}
        connected={connected}
        connectionState={connectionState}
        signalCount={signals.length}
        alertCandidates={alertCandidates}
      />

      <div className="mx-auto max-w-[1500px] space-y-4 px-4 py-5 md:px-6 lg:py-6">
        <Topbar connected={connected} connectionState={connectionState} lastUpdate={lastUpdate} />
        <MetricRail
          pulseKey={pulseKey}
          signalCount={filtered.length}
          sourceCount={Object.keys(sourceCounts).length}
          signalsPerMinute={signalsPerMinute}
          websocketClients={websocketClients}
          collectorUptime={collectorUptime}
          collectorLatency={collectorLatency}
        />
        <InspectNowPanel
          latestSignal={filtered[0]}
          collectorHealth={collectorHealth}
          connectionState={connectionState}
          signalCount={signals.length}
          filteredCount={filtered.length}
        />
        <div className="grid gap-5 xl:grid-cols-[1.9fr_.8fr]">
          <SignalFeed signals={filtered} />
          <div className="space-y-4">
            <ActivityStream events={events} />
            <CollectorHealth health={collectorHealth} />
          </div>
        </div>
        <OperationalSection title="console evidence boundary" meta="runtime telemetry / source-derived signals" icon={ShieldCheck}>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="border-l border-signal-line bg-signal-panel/66 px-3 py-2 text-sm leading-relaxed text-signal-muted">
              Collector health, websocket state, latency, reconnects, and pulse behavior describe SIGNALWATCH runtime state.
            </div>
            <div className="border-l border-signal-line bg-signal-panel/66 px-3 py-2 text-sm leading-relaxed text-signal-muted">
              Signal feed entries require source URLs, source titles, timestamps, or ingestion payloads before they appear.
            </div>
            <div className="border-l border-signal-line bg-signal-panel/66 px-3 py-2 text-sm leading-relaxed text-signal-muted">
              Empty feeds, offline collectors, and missing telemetry are treated as valid visible states, not gaps to fill.
            </div>
          </div>
        </OperationalSection>
        <SourceRegistryVisual health={collectorHealth} />
        <UnavailableStatesGallery title="console unavailable states" />
        <SystemStatusBar />
      </div>
    </main>
  );
}

function InspectNowPanel({
  latestSignal,
  collectorHealth,
  connectionState,
  signalCount,
  filteredCount,
}: {
  latestSignal?: Signal;
  collectorHealth: CollectorHealthType[];
  connectionState: string;
  signalCount: number;
  filteredCount: number;
}) {
  const degradedCollectors = collectorHealth.filter((entry) => entry.state !== "HEALTHY");
  const cards = [
    {
      icon: FileSearch,
      label: "latest verified item",
      title: latestSignal?.title ?? "No source-backed item visible",
      text: latestSignal
        ? `${latestSignal.source} / ${timeOnly(latestSignal.published_at)}`
        : filteredCount === 0 && signalCount > 0
          ? "Current filters hide all source-backed items."
          : "The source feed is empty. No item is filled in.",
      href: latestSignal?.url,
      action: latestSignal ? "open source" : "inspect ledger",
      internalHref: latestSignal ? undefined : "/evidence",
    },
    {
      icon: Database,
      label: "collectors needing attention",
      title: degradedCollectors.length ? `${degradedCollectors.length} collector state changes` : "No degraded collectors reported",
      text: degradedCollectors.length
        ? degradedCollectors.slice(0, 3).map((entry) => `${entry.source}:${entry.state}`).join(" / ")
        : collectorHealth.length
          ? "Collector health currently reports healthy."
          : "Collector telemetry has not arrived yet.",
      internalHref: "/evidence",
      action: "view collector rows",
    },
    {
      icon: TriangleAlert,
      label: "evidence gaps",
      title: signalCount ? "Source claims available" : "No source claims available",
      text: signalCount
        ? "Use provenance before treating a claim as operational evidence."
        : "Empty source state is preserved instead of generating placeholder claims.",
      internalHref: "/evidence",
      action: "inspect provenance",
    },
    {
      icon: RadioTower,
      label: "runtime state",
      title: connectionState,
      text: connectionState === "live" ? "Websocket stream is live." : "Runtime stream is not live; check ledger and collectors.",
      internalHref: "/systems",
      action: "view systems",
    },
  ];

  return (
    <section className="console-panel p-4">
      <div className="flex flex-col justify-between gap-2 border-b border-signal-line pb-3 md:flex-row md:items-center">
        <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">inspect now</div>
        <span className="font-mono text-[0.58rem] uppercase text-signal-dim">decision surface / no fabricated priority</span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <InspectCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  );
}

function InspectCard({
  icon: Icon,
  label,
  title,
  text,
  action,
  href,
  internalHref,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  text: string;
  action: string;
  href?: string;
  internalHref?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <Icon className="h-4 w-4 text-signal-green/75" />
        <span className="font-mono text-[0.56rem] uppercase text-signal-dim">{label}</span>
      </div>
      <h2 className="mt-4 line-clamp-2 text-sm font-semibold leading-snug text-signal-text">{title}</h2>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-signal-muted">{text}</p>
      <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.56rem] uppercase text-signal-green/75">
        {action}
        <ArrowRight className="h-3 w-3" />
      </div>
    </>
  );

  const className = "block h-full border border-signal-line bg-signal-panel/70 p-3 transition hover:border-signal-green/45 hover:bg-signal-panel2/60";
  if (href) return <a href={href} target="_blank" className={className}>{body}</a>;
  return <Link href={internalHref ?? "/evidence"} className={className}>{body}</Link>;
}
