"use client";

import { useMemo, useState } from "react";
import { ActivityStream } from "@/components/dashboard/activity-stream";
import { SignalCharts } from "@/components/dashboard/charts";
import { CollectorHealth } from "@/components/dashboard/collector-health";
import { IntelligenceSummaries } from "@/components/dashboard/intelligence-summaries";
import { MetricRail } from "@/components/dashboard/metric-rail";
import { OperationalSidebar } from "@/components/dashboard/operational-sidebar";
import { RelationshipGraph } from "@/components/dashboard/relationship-graph";
import { SignalFeed } from "@/components/dashboard/signal-feed";
import { Topbar } from "@/components/dashboard/topbar";
import { TrendClusters } from "@/components/dashboard/trend-clusters";
import { useSignalwatch } from "@/hooks/use-signalwatch";
import { timeOnly } from "@/lib/utils";

export default function DashboardPage() {
  const {
    signals,
    events,
    connected,
    connectionState,
    pulseKey,
    sourceCounts,
    topicCounts,
    alertCandidates,
    maxImportance,
    signalsPerMinute,
    trendVelocity,
    websocketClients,
    collectorHealth,
    clusters,
    graph,
    activeAlerts,
    semanticClusterCount,
    retryCount,
    collectorUptime,
    sourceReliability,
    normalizationPressure,
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
          alertCandidates={alertCandidates}
          maxImportance={maxImportance}
          signalsPerMinute={signalsPerMinute}
          trendVelocity={trendVelocity}
          websocketClients={websocketClients}
          semanticClusterCount={semanticClusterCount}
          activeAlerts={activeAlerts}
          retryCount={retryCount}
          collectorUptime={collectorUptime}
          sourceReliability={sourceReliability}
          normalizationPressure={normalizationPressure}
          collectorLatency={collectorLatency}
        />
        <div className="grid gap-5 xl:grid-cols-[1.75fr_1fr]">
          <SignalFeed signals={filtered} />
          <div className="space-y-4">
            <ActivityStream events={events} />
            <CollectorHealth health={collectorHealth} />
            <TrendClusters clusters={clusters} />
            <IntelligenceSummaries clusters={clusters} events={events} />
            <RelationshipGraph graph={graph} />
            <SignalCharts signals={filtered} sourceCounts={sourceCounts} topicCounts={topicCounts} events={events} />
          </div>
        </div>
      </div>
    </main>
  );
}
