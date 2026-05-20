"use client";

import { motion } from "framer-motion";
import { VisualProvenanceStrip } from "@/components/education/visual-provenance-strip";
import { REAL_WORLD_IMAGES } from "@/lib/real-world-images";

const heroImage = REAL_WORLD_IMAGES.find((image) => image.id === "cctv-camera") ?? REAL_WORLD_IMAGES[0];

const traceRows = [
  ["source", "Wikimedia Commons photo"],
  ["role", "visual context only"],
  ["model output", "not present"],
  ["claim boundary", "no detection inferred"],
];

export function LandingVisualField() {
  return (
    <motion.div
      className="relative min-h-[24rem] overflow-hidden border-y border-signal-line/70 md:min-h-[34rem]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.26, duration: 0.7 }}
    >
      <img
        src={heroImage.imageUrl}
        alt="Source-attributed monitoring camera used as operational visual context."
        className="absolute inset-0 h-full w-full object-cover opacity-[0.42] grayscale-[22%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,11,9,0.96)_0%,rgba(8,11,9,0.78)_42%,rgba(8,11,9,0.42)_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(155,216,179,.26)_1px,transparent_1px),linear-gradient(90deg,rgba(155,216,179,.18)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="relative flex min-h-[24rem] flex-col justify-between gap-10 p-5 md:min-h-[34rem] md:p-7">
        <div className="max-w-xl">
          <div className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-signal-green/80">visual operating boundary</div>
          <h2 className="mt-5 max-w-lg text-2xl font-semibold leading-tight text-signal-text md:text-4xl">
            Real-world conditions are visible.{" "}
            <span className="block text-signal-muted">Claims still require evidence.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-signal-muted">
            The image is a source-attributed scene for atmosphere and context. SIGNALWATCH does not infer detections, confidence, or incidents from it.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div className="space-y-2">
            {traceRows.map(([label, value], index) => (
              <motion.div
                key={label}
                className="grid gap-1 border-l border-signal-line/80 bg-signal-panel/70 px-3 py-2 font-mono text-[0.58rem] uppercase sm:grid-cols-[7.5rem_1fr] sm:gap-3"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.46 + index * 0.07, duration: 0.28 }}
              >
                <span className="text-signal-green/68">{label}</span>
                <span className="text-signal-muted">{value}</span>
              </motion.div>
            ))}
          </div>
          <VisualProvenanceStrip compact />
        </div>
      </div>
    </motion.div>
  );
}
