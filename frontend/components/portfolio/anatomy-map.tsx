"use client";

import { MuscleMap, type Highlight } from "js-rich-body-highlighter/react";
import type { BodyView, MuscleGroup, MuscleRole } from "@/lib/movement-study";

export default function AnatomyMap({ view, muscles, selected, onSelect }: {
  view: BodyView;
  muscles: MuscleRole[];
  selected: MuscleGroup | null;
  onSelect: (group: MuscleGroup) => void;
}) {
  // Opacity is a fixed presentation choice, never a muscle-activation value.
  const highlights: Highlight[] = muscles
    .filter(muscle => !muscle.frontOnly || view === "front")
    .map(muscle => ({
      group: muscle.group,
      intensity: 70,
      color: selected === muscle.group ? "#e4c78c" : muscle.role === "Movement" ? "#99c6a5" : "#91b5c9",
    }));

  return (
    <MuscleMap
      gender="male"
      view={view}
      theme="dark"
      bodySrc={{ front: "/portfolio/anatomy/male-front-dark.webp", back: "/portfolio/anatomy/male-back-dark.webp" }}
      width="100%"
      highlights={highlights}
      blendMode="screen"
      hoverHighlight={false}
      onMuscleClick={muscle => {
        const match = muscles.find(item => item.group === muscle.group && (!item.frontOnly || view === "front"));
        if (match) onSelect(match.group);
      }}
    />
  );
}
