"use client";

import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { sourceLabel } from "@/lib/api";
import type { RealtimeEvent, Signal } from "@/lib/types";

export function SignalCharts({
  signals,
  sourceCounts,
  topicCounts,
  events
}: {
  signals: Signal[];
  sourceCounts: Record<string, number>;
  topicCounts: Record<string, number>;
  events: RealtimeEvent[];
}) {
  const flow = Array.from({ length: 26 }, (_, index) => ({
    slot: index,
    value: Math.max(1, Math.round(signals.length / 18 + Math.sin(index / 2) * 4 + (index % 5))),
    throughput: Math.max(1, Math.round(signals.length / 24 + Math.cos(index / 2.4) * 3 + (index % 3)))
  }));
  const acceleration = Array.from({ length: 18 }, (_, index) => ({
    slot: index,
    value: Math.max(0, Math.round(events.filter((event) => event.type === "trend.detected").length + Math.sin(index / 1.7) * 2 + index / 5))
  }));
  const sources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([source, value]) => ({ source: sourceLabel(source), value }));
  const topics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([topic, value]) => ({ topic, value }));

  return (
    <div className="space-y-4">
      <Panel>
        <PanelHeader title="signal throughput" meta="rolling activity" />
        <div className="h-[132px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={flow}>
              <defs>
                <linearGradient id="signalFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#89e3ad" stopOpacity={0.38} />
                  <stop offset="95%" stopColor="#89e3ad" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="slot" hide />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "#070a08", border: "1px solid #1a2b21", color: "#d8ded9" }} />
              <Area type="monotone" dataKey="value" stroke="#89e3ad" strokeWidth={2} fill="url(#signalFlow)" isAnimationActive />
              <Area type="monotone" dataKey="throughput" stroke="#9aa56f" strokeWidth={1.4} fill="transparent" isAnimationActive />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 7 }).map((_, index) => (
            <span key={index} className="h-2 border border-signal-line bg-signal-green/30 animate-breathe" style={{ animationDelay: `${index * 0.24}s` }} />
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="trend acceleration" meta="velocity estimate" />
        <div className="h-[112px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={acceleration}>
              <XAxis dataKey="slot" hide />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "#070a08", border: "1px solid #1a2b21", color: "#d8ded9" }} />
              <Line type="monotone" dataKey="value" stroke="#b6a16d" strokeWidth={2} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <SmallBarChart title="source pressure" meta="collector distribution" data={sources} dataKey="source" />
      <SmallBarChart title="topic volatility" meta="classifier density" data={topics} dataKey="topic" />
    </div>
  );
}

function SmallBarChart({ title, meta, data, dataKey }: { title: string; meta: string; data: Record<string, string | number>[]; dataKey: string }) {
  return (
    <Panel>
      <PanelHeader title={title} meta={meta} />
      <div className="h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey={dataKey} width={88} tick={{ fill: "#7f8b83", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#070a08", border: "1px solid #1a2b21", color: "#d8ded9" }} />
            <Bar dataKey="value" fill="#9aa56f" radius={[0, 2, 2, 0]} isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
