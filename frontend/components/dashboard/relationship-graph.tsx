"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Panel, PanelHeader } from "@/components/ui/panel";
import type { GraphNode, RelationshipGraph as RelationshipGraphType } from "@/lib/types";

export function RelationshipGraph({ graph }: { graph: RelationshipGraphType }) {
  const [hovered, setHovered] = useState<GraphNode | null>(null);
  const nodes = graph.nodes.slice(0, 22);
  const edges = graph.edges.slice(0, 34);
  const positioned = nodes.map((node, index) => {
    const radius = node.type === "cluster" ? 74 : node.type === "signal" ? 118 : 96;
    const angle = (index / Math.max(1, nodes.length)) * Math.PI * 2;
    return {
      ...node,
      x: 170 + Math.cos(angle) * radius + (node.type === "cluster" ? 0 : Math.sin(index) * 14),
      y: 120 + Math.sin(angle) * radius + (node.type === "signal" ? Math.cos(index) * 10 : 0),
    };
  });
  const byId = new Map(positioned.map((node) => [node.id, node]));

  return (
    <Panel>
      <PanelHeader title="signal relationship graph" meta={`${graph.nodes.length} nodes / ${graph.edges.length} links`} />
      <svg viewBox="0 0 340 240" className="h-[260px] w-full overflow-visible">
        <rect width="340" height="240" fill="#050706" stroke="#101b15" />
        <defs>
          <filter id="nodeSoftGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
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
              stroke={active ? "#89e3ad" : "#1f3a2b"}
              strokeOpacity={active ? 0.72 : 0.46}
              strokeWidth={Math.min(2, Math.max(0.5, edge.weight / 6))}
              initial={{ pathLength: 0.2, opacity: 0.2 }}
              animate={{ pathLength: [0.35, 1, 0.72], opacity: active ? 0.72 : 0.46 }}
              transition={{ duration: 5 + (index % 4), repeat: Infinity, repeatType: "mirror" }}
            />
          );
        })}
        {positioned.map((node) => (
          <g key={node.id} onMouseEnter={() => setHovered(node)} onMouseLeave={() => setHovered(null)} className="cursor-crosshair">
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius(node.type)}
              fill={nodeFill(node.type)}
              stroke={hovered?.id === node.id ? "#89e3ad" : "#2f4a39"}
              strokeWidth="1"
              opacity="0.95"
              filter={hovered?.id === node.id ? "url(#nodeSoftGlow)" : undefined}
            />
            {node.type === "cluster" ? <circle cx={node.x} cy={node.y} r={nodeRadius(node.type) + 5} fill="none" stroke="#89e3ad" strokeOpacity="0.13" /> : null}
          </g>
        ))}
        {positioned.filter((node) => node.type === "cluster").slice(0, 3).map((node) => (
          <text key={`${node.id}-label`} x={node.x + 9} y={node.y - 8} fill="#7f8b83" fontSize="9" fontFamily="Consolas, monospace">
            {node.label.slice(0, 22)}
          </text>
        ))}
        {hovered ? (
          <g>
            <rect x="12" y="204" width="212" height="24" fill="#07100b" stroke="#1a2b21" />
            <text x="20" y="219" fill="#aeb8b1" fontSize="9" fontFamily="Consolas, monospace">
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
