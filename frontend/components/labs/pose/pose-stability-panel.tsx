"use client";

import { motion } from "framer-motion";
import { OperationalNote } from "@/components/labs/overlays/operational-note";
import { ConfidenceRail } from "@/components/labs/telemetry/confidence-rail";

const rails = ["head", "shoulder", "hip", "knee", "ankle"];

export function PoseStabilityPanel() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr_.9fr]">
        <div className="relative h-72 overflow-hidden border border-signal-line bg-signal-panel">
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(137,227,173,.28)_1px,transparent_1px),linear-gradient(90deg,rgba(137,227,173,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute inset-x-8 top-1/2 h-px bg-signal-green/18" />
          <div className="absolute left-1/2 top-8 h-[72%] w-px bg-signal-green/12" />
          {rails.map((rail, index) => (
            <motion.div
              key={rail}
              className="absolute left-1/2 h-1.5 w-1.5 border border-signal-green/40 bg-signal-black"
              style={{ top: `${18 + index * 14}%`, marginLeft: `${index % 2 === 0 ? -32 : 24}px` }}
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 2.6 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <div className="absolute bottom-3 left-3 border border-signal-line bg-signal-black/80 px-2 py-1 font-mono text-[0.6rem] uppercase text-signal-dim">
            pose model disconnected / no keypoints emitted
          </div>
        </div>
        <div className="space-y-4">
          <ConfidenceRail label="joint confidence" value={0} unavailable />
          <ConfidenceRail label="temporal jitter" value={0} unavailable />
          <ConfidenceRail label="keypoint persistence" value={0} unavailable />
          <div className="border border-signal-line bg-signal-panel/70 p-3 font-mono text-[0.62rem] uppercase text-signal-dim">
            architecture ready / waiting for browser pose backend
          </div>
        </div>
      </div>
      <OperationalNote
        label="pose safety context"
        text="Pose stability monitoring is prepared for future MediaPipe or TensorFlow pose estimation. Until a real model is connected, this panel does not display skeletons, confidence, or joint telemetry."
      />
    </div>
  );
}
