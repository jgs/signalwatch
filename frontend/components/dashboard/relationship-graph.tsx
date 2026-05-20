"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Panel, PanelHeader } from "@/components/ui/panel";
import type { GraphNode, RelationshipGraph as RelationshipGraphType } from "@/lib/types";

export function RelationshipGraph({ graph }: { graph: RelationshipGraphType }) {
  const [hovered, setHovered] = useState<GraphNode | null>(null);
  const nodes = graph.nodes.slice(0, 26);
  const edges = graph.edges.slice(0, 42);
  const positioned = nodes.map((node, index) => {
    const radius = node.type === "cluster" ? 58 : node.type === "signal" ? 126 : 98;
    const angle = (index / Math.max(1, nodes.length)) * Math.PI * 2;
    return {
      ...node,
      x: 170 + Math.cos(angle) * radius + (node.type === "cluster" ? Math.sin(index * 1.7) * 12 : Math.sin(index) * 16),
      y: 126 + Math.sin(angle) * radius + (node.type === "source" ? Math.cos(index * 0.8) * 12 : 0),
      driftX: Math.sin(index * 1.9) * 3.2,
      driftY: Math.cos(index * 1.4) * 2.8,
    };
  });
  const byId = new Map(positioned.map((node) => [node.id, node]));

  return (
    <Panel>
      <PanelHeader title="topic map" meta={`${graph.nodes.length} items / ${graph.edges.length} links`} />
      <svg viewBox="0 0 340 252" className="h-[276px] w-full overflow-visible">
        <rect width="340" height="252" fill="#ffffff" stroke="#d8e0d8" />
        <defs>
          <radialGradient id="topologyWell" cx="50%" cy="48%" r="64%">
            <stop offset="0%" stopColor="#e8f0e7" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="340" height="252" fill="url(#topologyWell)" />
        <path d="M32 126 H308 M170 24 V226" stroke="#d8e0d8" strokeWidth="0.6" strokeDasharray="2 8" opacity="0.9" />
        {edges.map((edge, index) => {
          const source = byId.get(edge.source);
          const target = byId.get(edge.target);
          if (!source || !target) return null;
          const active = hovered ? hovered.id === source.id || hovered.id === target.id : false;
          return (
            <motion.line
              key={`${edge.source}-${edge.target}-${index}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={active ? "#3f6f4d" : "#9ab39f"}
              strokeOpacity={active ? 0.62 : 0.28}
              strokeWidth={active ? 0.9 : 0.55}
              initial={{ pathLength: 0.08, opacity: 0.12 }}
              animate={{ pathLength: [0.35, 0.92, 0.58], opacity: active ? 0.62 : [0.2, 0.36, 0.2] }}
              transition={{ duration: 7 + (index % 5), repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
          );
        })}
        {positioned.map((node) => (
          <motion.g
            key={node.id}
            onMouseEnter={() => setHovered(node)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-crosshair"
            animate={{ x: [0, node.driftX, 0], y: [0, node.driftY, 0] }}
            transition={{ duration: 8 + (node.id.length % 5), repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius(node.type)}
              fill={nodeFill(node.type)}
              stroke={hovered?.id === node.id ? "#3f6f4d" : "#9ab39f"}
              strokeWidth="1"
              opacity="0.92"
              animate={{ opacity: hovered?.id === node.id ? 1 : [0.72, 0.96, 0.72] }}
              transition={{ duration: node.type === "cluster" ? 3.8 : 5.8, repeat: Infinity, ease: "easeInOut" }}
            />
            {node.type === "cluster" ? <circle cx={node.x} cy={node.y} r={nodeRadius(node.type) + 6} fill="none" stroke="#3f6f4d" strokeOpacity="0.22" strokeDasharray="2 4" /> : null}
          </motion.g>
        ))}
        {positioned.filter((node) => node.type === "cluster").slice(0, 3).map((node) => (
          <text key={`${node.id}-label`} x={node.x + 9} y={node.y - 8} fill="#526057" fontSize="9" fontFamily="Consolas, monospace">
            {node.label.slice(0, 22)}
          </text>
        ))}
        {hovered ? (
          <g>
            <rect x="12" y="216" width="226" height="24" fill="#f6f8f4" stroke="#d8e0d8" />
            <text x="20" y="231" fill="#526057" fontSize="9" fontFamily="Consolas, monospace">
              {hovered.type.toUpperCase()} :: {hovered.label.slice(0, 32)}
            </text>
          </g>
        ) : null}
      </svg>
    </Panel>
  );
}

function nodeRadius(type: string) {
  if (type === "cluster") return 6;
  if (type === "signal" || type === "paper" || type === "discussion") return 3.5;
  if (type === "lab" || type === "model" || type === "benchmark") return 4;
  return 4.5;
}

function nodeFill(type: string) {
  if (type === "cluster") return "#89e3ad";
  if (type === "source") return "#9aa56f";
  if (type === "lab") return "#b6a16d";
  if (type === "model") return "#8aa598";
  if (type === "benchmark") return "#a6b078";
  if (type === "paper") return "#6f8077";
  if (type === "discussion") return "#7f8b83";
  if (type === "topic") return "#536059";
  return "#b6a16d";
}
