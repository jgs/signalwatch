"use client";

import { Activity, Factory, HeartPulse, Radar, Route, ScanLine, ShieldAlert } from "lucide-react";

const contexts = [
  {
    icon: Route,
    label: "autonomous vehicles",
    text: "Perception must remain stable across lighting, motion, partial visibility, and sensor noise before downstream planning can be trusted.",
  },
  {
    icon: Activity,
    label: "robotics",
    text: "Manipulation and navigation depend on object continuity. Detection collapse can change how a robot estimates reachable space.",
  },
  {
    icon: Factory,
    label: "industrial automation",
    text: "Factory vision systems need robustness under vibration, compression, glare, and occlusion from moving equipment.",
  },
  {
    icon: Radar,
    label: "surveillance systems",
    text: "Uncertainty should be surfaced clearly; degraded inputs can reduce reliability even when a model appears confident in clean conditions.",
  },
  {
    icon: HeartPulse,
    label: "medical imaging",
    text: "Safety-critical imaging requires explicit evaluation under acquisition artifacts, missing context, and distribution shift.",
  },
  {
    icon: ScanLine,
    label: "biomechanical analysis",
    text: "Pose and movement systems need temporal stability; jitter or missing keypoints can distort downstream movement signals.",
  },
  {
    icon: ShieldAlert,
    label: "pose tracking systems",
    text: "Occlusion, clothing, camera angle, and low light can reduce joint persistence. Confidence should be measured, not assumed.",
  },
];

export function SafetyCriticalContext() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {contexts.map(({ icon: Icon, label, text }) => (
        <div key={label} className="border border-signal-line bg-signal-panel/70 p-4">
          <div className="flex items-center gap-2 font-mono text-[0.64rem] uppercase text-signal-green/75">
            <Icon className="h-3.5 w-3.5" />
            {label}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-signal-muted">{text}</p>
        </div>
      ))}
    </section>
  );
}
