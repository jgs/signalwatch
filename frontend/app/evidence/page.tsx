"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  Archive,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  FileSearch,
  RadioTower,
  ShieldCheck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { OperationalNav } from "@/components/layout/operational-nav";
import { SystemStatusBar } from "@/components/layout/system-status-bar";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { sourceLabel } from "@/lib/api";
import type { CollectorHealth, OperationalTelemetry, RealtimeEvent, Signal } from "@/lib/types";
import { cn, formatUtc, severityClass } from "@/lib/utils";
import { useSignalwatch } from "@/hooks/use-signalwatch";

type LedgerKind = "source" | "collector" | "runtime" | "telemetry";

type LedgerEntry = {
  id: string;
  kind: LedgerKind;
  title: string;
  timestamp: string;
  source: string;
  status: string;
  detail: string;
  provenance: string[];
  href?: string;
  severity?: Signal["severity"];
};

const filters: Array<{ key: "all" | LedgerKind; label: string }> = [
  { key: "all", label: "all evidence" },
  { key: "source", label: "source claims" },
  { key: "collector", label: "collectors" },
  { key: "runtime", label: "runtime" },
  { key: "telemetry", label: "telemetry" },
];

export default function EvidenceLedgerPage() {
  const { events, signals, collectorHealth, telemetry, connectionState, connected } = useSignalwatch();
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");

  const entries = useMemo(
    () => buildLedgerEntries(signals, events, collectorHealth, telemetry),
    [signals, events, collectorHealth, telemetry]
  );
  const visibleEntries = filter === "all" ? entries : entries.filter((entry) => entry.kind === filter);
  const counts = useMemo(() => countKinds(entries), [entries]);
  const lastEntry = entries[0]?.timestamp;

  return (
    <main className="relative min-h-screen overflow-hidden bg-signal-black text-signal-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(137,227,173,0.08),transparent_32rem)]" />
      <div className="absolute inset-0 opacity-[0.028] [background-image:linear-gradient(rgba(155,216,179,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(155,216,179,.16)_1px,transparent_1px)] [background-size:44px_44px]" />
      <section className="relative mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <OperationalNav active="evidence" />

        <header className="grid gap-8 py-10 md:py-14 xl:grid-cols-[1fr_24rem] xl:items-end">
          <div>
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-signal-green/80">evidence ledger</div>
            <h1 className="mt-7 max-w-5xl text-4xl font-semibold leading-tight md:text-5xl">
              One place to inspect what SIGNALWATCH actually knows.
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-signal-muted">
              This ledger combines source-backed signals, runtime frames, collector health, and telemetry snapshots without turning system state into claims. Empty data is kept visible.
            </p>
          </div>
          <Panel className="p-4">
            <PanelHeader title="ledger boundary" meta={connected ? "live websocket" : connectionState} />
            <div className="space-y-3 text-sm leading-relaxed text-signal-muted">
              <BoundaryRow icon={ShieldCheck} label="claims" text="Only source items with URLs appear as source claims." />
              <BoundaryRow icon={RadioTower} label="runtime" text="Heartbeats, reconnects, and telemetry remain operational state." />
              <BoundaryRow icon={TriangleAlert} label="missing" text="Unavailable data is shown as unavailable, not estimated." />
            </div>
          </Panel>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <LedgerStat icon={Archive} label="ledger rows" value={entries.length} />
          <LedgerStat icon={FileSearch} label="source claims" value={counts.source} />
          <LedgerStat icon={RadioTower} label="runtime frames" value={counts.runtime + counts.telemetry} />
          <LedgerStat icon={Clock3} label="last evidence" value={lastEntry ? formatUtc(lastEntry) : "unavailable"} compact />
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-4">
          <KindHelp label="source" text="A claim or update with a source URL attached." />
          <KindHelp label="collector" text="A watcher reporting whether a source route is healthy." />
          <KindHelp label="runtime" text="The app's own connection or event stream state." />
          <KindHelp label="telemetry" text="Operational measurements about SIGNALWATCH itself." />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[18rem_1fr]">
          <Panel className="h-fit p-4">
            <PanelHeader title="ledger filters" meta="real entries" />
            <div className="grid gap-2">
              {filters.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={cn(
                    "flex items-center justify-between border px-3 py-2 text-left font-mono text-[0.64rem] uppercase transition",
                    filter === item.key
                      ? "border-signal-green/60 bg-signal-panel2 text-signal-green"
                      : "border-signal-line bg-signal-panel/70 text-signal-dim hover:border-signal-line/90 hover:text-signal-muted"
                  )}
                >
                  <span>{item.label}</span>
                  <span>{item.key === "all" ? entries.length : counts[item.key]}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 border-l border-signal-line bg-signal-panel/60 px-3 py-2 text-[0.76rem] leading-relaxed text-signal-muted">
              The ledger is derived from the current API and websocket state. It does not persist a separate audit log yet.
            </div>
          </Panel>

          <Panel className="p-4">
            <PanelHeader title="evidence entries" meta={`${visibleEntries.length} visible`} />
            <div className="space-y-3">
              {visibleEntries.length ? (
                visibleEntries.map((entry) => <LedgerRow key={entry.id} entry={entry} />)
              ) : (
                <UnavailableLedgerState filter={filter} />
              )}
            </div>
          </Panel>
        </section>

        <div className="mt-5">
          <SystemStatusBar />
        </div>
      </section>
    </main>
  );
}

function KindHelp({ label, text }: { label: string; text: string }) {
  return (
    <div className="border border-signal-line bg-signal-panel/70 p-3">
      <div className="font-mono text-[0.58rem] uppercase text-signal-green/75">{label}</div>
      <p className="mt-2 text-xs leading-relaxed text-signal-muted">{text}</p>
    </div>
  );
}

function BoundaryRow({ icon: Icon, label, text }: { icon: LucideIcon; label: string; text: string }) {
  return (
    <div className="grid grid-cols-[1rem_4.5rem_1fr] gap-3 border-l border-signal-line bg-signal-panel/60 px-3 py-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 text-signal-green/75" />
      <span className="font-mono text-[0.6rem] uppercase text-signal-dim">{label}</span>
      <span>{text}</span>
    </div>
  );
}

function LedgerStat({
  icon: Icon,
  label,
  value,
  compact,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  compact?: boolean;
}) {
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[0.62rem] uppercase text-signal-dim">{label}</div>
        <Icon className="h-4 w-4 text-signal-green/70" />
      </div>
      <div className={cn("mt-4 font-mono text-signal-text", compact ? "text-[0.88rem]" : "text-2xl")}>{value}</div>
    </Panel>
  );
}

function LedgerRow({ entry }: { entry: LedgerEntry }) {
  const Icon = kindIcon(entry.kind);

  return (
    <article className={cn("border bg-signal-panel/82 p-4", severityClass(entry.severity))}>
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="text-signal-green">
            <Icon className="mr-1 inline h-3 w-3" />
            {entry.kind}
          </Badge>
          <span className="font-mono text-[0.58rem] uppercase text-signal-dim">{entry.source}</span>
          <span className="font-mono text-[0.58rem] uppercase text-signal-dim">{entry.status}</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[0.58rem] uppercase text-signal-dim">
          <span>{formatUtc(entry.timestamp)}</span>
          {entry.href ? (
            <a href={entry.href} target="_blank" className="text-signal-green/75 transition hover:text-signal-text">
              <ExternalLink className="inline h-3 w-3" /> source
            </a>
          ) : null}
        </div>
      </div>
      <h2 className="mt-3 text-base font-semibold leading-snug text-[#e2e9e4]">{entry.title}</h2>
      <p className="mt-2 max-w-4xl text-sm leading-relaxed text-signal-muted">{entry.detail}</p>
      <details className="mt-3 border-t border-signal-line pt-3 font-mono text-[0.6rem] text-signal-dim">
        <summary className="cursor-pointer list-none uppercase transition hover:text-signal-muted">show provenance</summary>
        <div className="mt-2 grid gap-1.5 border-l border-signal-line pl-3">
          {entry.provenance.map((line) => (
            <span key={line} className="break-words">{line}</span>
          ))}
        </div>
      </details>
    </article>
  );
}

function UnavailableLedgerState({ filter }: { filter: (typeof filters)[number]["key"] }) {
  return (
    <div className="border border-signal-line bg-signal-panel/70 p-5">
      <div className="font-mono text-[0.68rem] uppercase text-signal-green/75">no ledger entries available</div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-signal-muted">
        No {filter === "all" ? "evidence" : filter} rows are present in the current runtime snapshot. SIGNALWATCH leaves this state empty instead of fabricating telemetry.
      </p>
    </div>
  );
}

function buildLedgerEntries(
  signals: Signal[],
  events: RealtimeEvent[],
  collectors: CollectorHealth[],
  telemetry: OperationalTelemetry
): LedgerEntry[] {
  const signalEntries = signals.map((signal): LedgerEntry => ({
    id: `signal:${signal.fingerprint}`,
    kind: "source",
    title: signal.title,
    timestamp: signal.published_at,
    source: sourceLabel(signal.source),
    status: signal.severity ?? "TRACE",
    detail: signal.summary || "Source item indexed without a summary.",
    href: signal.url,
    severity: signal.severity,
    provenance: [
      `source=${signal.source}`,
      `source_type=${signal.source_type ?? "source-item"}`,
      `published=${formatUtc(signal.published_at)}`,
      signal.fetched_at ? `fetched=${formatUtc(signal.fetched_at)}` : "fetched=unavailable",
      `authors=${signal.authors?.slice(0, 4).join(", ") || "unknown"}`,
      `topics=${signal.topics?.join(" / ") || "untagged"}`,
      signal.source_count ? `source_count=${signal.source_count}` : "source_count=single-or-unreported",
    ],
  }));

  const collectorEntries = collectors.map((collector): LedgerEntry => ({
    id: `collector:${collector.source}`,
    kind: "collector",
    title: `${sourceLabel(collector.source)} collector ${collector.state.toLowerCase()}`,
    timestamp: telemetry.heartbeat ?? new Date(0).toISOString(),
    source: sourceLabel(collector.source),
    status: collector.state,
    detail: collector.message,
    provenance: [
      `latency_ms=${Math.round(collector.latency_ms)}`,
      `item_count=${collector.item_count}`,
      `retry_count=${collector.retry_count}`,
      `failure_rate=${Math.round(collector.failure_rate * 100)}%`,
    ],
  }));

  const eventEntries = events
    .filter((event) => !eventPayloadHasSourceUrl(event))
    .slice(0, 80)
    .map((event): LedgerEntry => ({
      id: `event:${event.id ?? event.type}:${event.timestamp}:${event.message ?? ""}`,
      kind: event.type === "telemetry.update" || event.type === "system.heartbeat" ? "telemetry" : event.type === "collector.health" ? "collector" : "runtime",
      title: event.message ?? event.payload.message ?? event.type,
      timestamp: event.timestamp,
      source: sourceLabel(String(event.source ?? event.payload.source ?? "signalwatch-runtime")),
      status: event.severity ?? event.payload.severity ?? "TRACE",
      detail: runtimeDetail(event),
      severity: event.severity,
      provenance: [
        `event_type=${event.type}`,
        `timestamp=${formatUtc(event.timestamp)}`,
        `source=${String(event.source ?? event.payload.source ?? "signalwatch-runtime")}`,
        ...payloadLines(event.payload).slice(0, 8),
      ],
    }));

  const telemetryEntry = telemetry && Object.keys(telemetry).length ? [telemetryToLedgerEntry(telemetry)] : [];

  return [...signalEntries, ...collectorEntries, ...telemetryEntry, ...eventEntries]
    .filter((entry) => Number.isFinite(Date.parse(entry.timestamp)))
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}

function telemetryToLedgerEntry(telemetry: OperationalTelemetry): LedgerEntry {
  const heartbeat = telemetry.heartbeat ?? new Date(0).toISOString();
  return {
    id: `telemetry:snapshot:${heartbeat}`,
    kind: "telemetry",
    title: "current telemetry snapshot",
    timestamp: heartbeat,
    source: "signalwatch runtime",
    status: telemetry.status ?? "operational-state",
    detail: "Latest telemetry values reported by the backend runtime.",
    provenance: payloadLines(telemetry as Record<string, unknown>).slice(0, 12),
  };
}

function eventPayloadHasSourceUrl(event: RealtimeEvent) {
  return Boolean((event.payload.source_url || event.payload.url) && (event.payload.title || event.payload.source_title));
}

function runtimeDetail(event: RealtimeEvent) {
  if (typeof event.payload.summary === "string") return event.payload.summary;
  if (typeof event.payload.message === "string") return event.payload.message;
  if (event.type === "system.heartbeat") return "Runtime heartbeat emitted by SIGNALWATCH backend.";
  if (event.type === "telemetry.update") return "Telemetry update emitted by SIGNALWATCH backend.";
  return "Operational event emitted by SIGNALWATCH runtime.";
}

function payloadLines(payload: Record<string, unknown>) {
  return Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && typeof value !== "object")
    .map(([key, value]) => `${key}=${String(value)}`);
}

function countKinds(entries: LedgerEntry[]) {
  return entries.reduce<Record<LedgerKind, number>>(
    (counts, entry) => {
      counts[entry.kind] += 1;
      return counts;
    },
    { source: 0, collector: 0, runtime: 0, telemetry: 0 }
  );
}

function kindIcon(kind: LedgerKind) {
  if (kind === "source") return FileSearch;
  if (kind === "collector") return Database;
  if (kind === "telemetry") return Activity;
  return CheckCircle2;
}
