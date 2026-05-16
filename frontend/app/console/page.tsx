"use client";

import { useMemo, useState } from "react";
import { ActivityStream } from "@/components/dashboard/activity-stream";
import { CollectorHealth } from "@/components/dashboard/collector-health";
import { MetricRail } from "@/components/dashboard/metric-rail";
import { OperationalSidebar } from "@/components/dashboard/operational-sidebar";
import { SignalFeed } from "@/components/dashboard/signal-feed";
import { Topbar } from "@/components/dashboard/topbar";
import { useSignalwatch } from "@/hooks/use-signalwatch";
import { timeOnly } from "@/lib/utils";

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
        <div className="grid gap-5 xl:grid-cols-[1.9fr_.8fr]">
          <SignalFeed signals={filtered} />
          <div className="space-y-4">
            <ActivityStream events={events} />
            <CollectorHealth health={collectorHealth} />
          </div>
        </div>
      </div>
    </main>
  );
}
