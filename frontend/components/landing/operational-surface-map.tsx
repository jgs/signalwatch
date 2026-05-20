"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Database, Eye, FileSearch, Scale, ShieldCheck, type LucideIcon } from "lucide-react";

const surfaces: Array<{
  icon: LucideIcon;
  label: string;
  detail: string;
  href: string;
  state: string;
}> = [
  {
    icon: Activity,
    label: "1 / live console",
    detail: "what sources are updating and whether the system is healthy",
    href: "/console",
    state: "live view",
  },
  {
    icon: Eye,
    label: "2 / perception lab",
    detail: "COCO-SSD outputs, empty frames, confidence history",
    href: "/labs/perception",
    state: "browser model",
  },
  {
    icon: FileSearch,
    label: "3 / case studies",
    detail: "repeatable tests for blur, darkness, crops, and missed detections",
    href: "/case-studies",
    state: "protocol",
  },
  {
    icon: ShieldCheck,
    label: "4 / safety registry",
    detail: "safety and governance references with source links",
    href: "/safety",
    state: "sources",
  },
  {
    icon: Scale,
    label: "5 / market stress",
    detail: "AI bubble debate explained through source-bound signals",
    href: "/market-stress",
    state: "external context",
  },
  {
    icon: Database,
    label: "6 / methodology",
    detail: "what is real, derived, conceptual, or unavailable",
    href: "/methodology",
    state: "boundary",
  },
];

export function OperationalSurfaceMap() {
  return (
    <section className="console-panel p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
        <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">choose where to go</div>
        <div className="font-mono text-[0.58rem] uppercase text-signal-dim">recommended reading path</div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {surfaces.map(({ icon: Icon, label, detail, href, state }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04, duration: 0.24 }}
          >
            <Link href={href} className="block h-full border border-signal-line bg-signal-panel/66 p-3 transition hover:border-signal-green/45">
              <div className="flex items-center justify-between gap-2">
                <Icon className="h-3.5 w-3.5 text-signal-green/72" />
                <span className="border border-signal-line/70 px-1.5 py-0.5 font-mono text-[0.48rem] uppercase text-signal-dim">{state}</span>
              </div>
              <div className="mt-4 font-mono text-[0.62rem] uppercase text-signal-green/80">{label}</div>
              <p className="mt-2 text-xs leading-relaxed text-signal-muted">{detail}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
