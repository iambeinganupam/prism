"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ConstellationProps {
  variant?: "login" | "dashboard" | "overlaps";
  isConstellationActive?: boolean;
  constellationProgress?: number; // 0 to 1
  constellationOpacity?: number; // 0 to 1
  isReducedMotion?: boolean;
}

interface ConstellationNode {
  id: string;
  x: number;
  y: number;
  bureau: "PGRC" | "RB" | "ACA" | "APP";
  color: string;
  isCenter?: boolean;
  cluster: number;
}

interface ConstellationEdge {
  from: string;
  to: string;
}

export const Constellation: React.FC<ConstellationProps> = ({
  variant = "login",
  isConstellationActive = false,
  constellationProgress = 0,
  constellationOpacity = 0,
  isReducedMotion = false,
}) => {
  // Bureau Color Mapping
  const bureauColors = {
    PGRC: "#2F6FED",
    RB: "#A00400",
    ACA: "#6D4AC7",
    APP: "#E8A317",
  };

  // Base clusters of nodes (representing inter-bureau cases)
  const nodes: ConstellationNode[] = useMemo(() => {
    return [
      // Cluster 1 (Top Left - PGRC Grievance Cluster)
      { id: "c1_c", x: 18, y: 24, bureau: "PGRC", color: bureauColors.PGRC, isCenter: true, cluster: 1 },
      { id: "c1_1", x: 11, y: 16, bureau: "PGRC", color: bureauColors.PGRC, cluster: 1 },
      { id: "c1_2", x: 26, y: 19, bureau: "RB", color: bureauColors.RB, cluster: 1 },
      { id: "c1_3", x: 23, y: 32, bureau: "PGRC", color: bureauColors.PGRC, cluster: 1 },
      { id: "c1_4", x: 13, y: 30, bureau: "APP", color: bureauColors.APP, cluster: 1 },

      // Cluster 2 (Top Right - Regulation Cluster)
      { id: "c2_c", x: 78, y: 20, bureau: "RB", color: bureauColors.RB, isCenter: true, cluster: 2 },
      { id: "c2_1", x: 70, y: 14, bureau: "RB", color: bureauColors.RB, cluster: 2 },
      { id: "c2_2", x: 86, y: 16, bureau: "ACA", color: bureauColors.ACA, cluster: 2 },
      { id: "c2_3", x: 84, y: 28, bureau: "PGRC", color: bureauColors.PGRC, cluster: 2 },
      { id: "c2_4", x: 73, y: 26, bureau: "APP", color: bureauColors.APP, cluster: 2 },

      // Cluster 3 (Mid-Left - Academic Bureau Cluster)
      { id: "c3_c", x: 28, y: 56, bureau: "ACA", color: bureauColors.ACA, isCenter: true, cluster: 3 },
      { id: "c3_1", x: 22, y: 48, bureau: "ACA", color: bureauColors.ACA, cluster: 3 },
      { id: "c3_2", x: 36, y: 50, bureau: "RB", color: bureauColors.RB, cluster: 3 },
      { id: "c3_3", x: 33, y: 65, bureau: "PGRC", color: bureauColors.PGRC, cluster: 3 },
      { id: "c3_4", x: 20, y: 62, bureau: "APP", color: bureauColors.APP, cluster: 3 },

      // Cluster 4 (Mid-Right - Overlap Focal Cluster)
      { id: "c4_c", x: 72, y: 62, bureau: "APP", color: bureauColors.APP, isCenter: true, cluster: 4 },
      { id: "c4_1", x: 65, y: 55, bureau: "APP", color: bureauColors.APP, cluster: 4 },
      { id: "c4_2", x: 80, y: 57, bureau: "RB", color: bureauColors.RB, cluster: 4 },
      { id: "c4_3", x: 77, y: 72, bureau: "ACA", color: bureauColors.ACA, cluster: 4 },
      { id: "c4_4", x: 66, y: 70, bureau: "PGRC", color: bureauColors.PGRC, cluster: 4 },

      // Central Bridge Node (Key Institution Node on Overlaps variant)
      { id: "inst_hub", x: 50, y: 44, bureau: "RB", color: "#5FE0D0", isCenter: true, cluster: 0 },
    ];
  }, []);

  // Edges connecting nodes in each cluster and across clusters
  const edges: ConstellationEdge[] = useMemo(() => {
    return [
      // Cluster 1
      { from: "c1_c", to: "c1_1" },
      { from: "c1_c", to: "c1_2" },
      { from: "c1_c", to: "c1_3" },
      { from: "c1_c", to: "c1_4" },
      { from: "c1_1", to: "c1_2" },

      // Cluster 2
      { from: "c2_c", to: "c2_1" },
      { from: "c2_c", to: "c2_2" },
      { from: "c2_c", to: "c2_3" },
      { from: "c2_c", to: "c2_4" },

      // Cluster 3
      { from: "c3_c", to: "c3_1" },
      { from: "c3_c", to: "c3_2" },
      { from: "c3_c", to: "c3_3" },
      { from: "c3_c", to: "c3_4" },

      // Cluster 4
      { from: "c4_c", to: "c4_1" },
      { from: "c4_c", to: "c4_2" },
      { from: "c4_c", to: "c4_3" },
      { from: "c4_c", to: "c4_4" },

      // Inter-bureau Overlap Bridge Connections (Converging to hub)
      { from: "c1_c", to: "inst_hub" },
      { from: "c2_c", to: "inst_hub" },
      { from: "c3_c", to: "inst_hub" },
      { from: "c4_c", to: "inst_hub" },
    ];
  }, []);

  const nodeMap = useMemo(() => {
    const map = new Map<string, ConstellationNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Opacity & active state
  const effectiveOpacity = isReducedMotion
    ? 0.4
    : isConstellationActive
    ? constellationOpacity
    : 0;

  // On overlaps variant, nodes drift toward center as progress approaches 1
  const isOverlaps = variant === "overlaps";

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-10 transition-opacity duration-500"
      style={{ opacity: effectiveOpacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="cyanLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5FE0D0" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5FE0D0" stopOpacity="0.8" />
          </linearGradient>

          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="0.8" floodColor="#5FE0D0" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Constellation Link Lines with stroke-dashoffset */}
        {edges.map((edge, idx) => {
          const fromNode = nodeMap.get(edge.from);
          const toNode = nodeMap.get(edge.to);
          if (!fromNode || !toNode) return null;

          // Convergence offset for overlaps variant
          const driftFactor = isOverlaps && !isReducedMotion ? constellationProgress * 0.15 : 0;
          const fromX = fromNode.x + (50 - fromNode.x) * driftFactor;
          const fromY = fromNode.y + (44 - fromNode.y) * driftFactor;
          const toX = toNode.x + (50 - toNode.x) * driftFactor;
          const toY = toNode.y + (44 - toNode.y) * driftFactor;

          const isBridge = edge.to === "inst_hub" || edge.from === "inst_hub";
          // Bridge lines appear later in the progress
          const lineDashOffset = isReducedMotion
            ? 0
            : isBridge
            ? Math.max(0, 100 - (constellationProgress - 0.4) * 200)
            : Math.max(0, 100 - constellationProgress * 140);

          return (
            <line
              key={idx}
              x1={`${fromX}%`}
              y1={`${fromY}%`}
              x2={`${toX}%`}
              y2={`${toY}%`}
              stroke={isBridge ? "url(#cyanLineGrad)" : "rgba(95, 224, 208, 0.65)"}
              strokeWidth={isBridge ? "0.35" : "0.22"}
              strokeDasharray="100"
              strokeDashoffset={lineDashOffset}
              filter={isBridge ? "url(#cyanGlow)" : undefined}
            />
          );
        })}

        {/* Constellation Nodes */}
        {nodes.map((node) => {
          const driftFactor = isOverlaps && !isReducedMotion ? constellationProgress * 0.15 : 0;
          const posX = node.x + (50 - node.x) * driftFactor;
          const posY = node.y + (44 - node.y) * driftFactor;

          const nodeScale = isReducedMotion
            ? 1
            : constellationProgress < 0.2
            ? constellationProgress * 5
            : 1;

          const radius = node.isCenter ? (node.id === "inst_hub" ? 1.4 : 1.0) : 0.65;

          return (
            <g
              key={node.id}
              transform={`translate(${posX}, ${posY}) scale(${nodeScale}) translate(-${posX}, -${posY})`}
            >
              {/* Soft Outer Halo for Hub Node */}
              {node.id === "inst_hub" && (
                <circle
                  cx={`${posX}%`}
                  cy={`${posY}%`}
                  r={radius * 2.2}
                  fill="#5FE0D0"
                  fillOpacity={0.2}
                />
              )}

              {/* Node Core Circle */}
              <circle
                cx={`${posX}%`}
                cy={`${posY}%`}
                r={radius}
                fill={node.color}
                filter="url(#cyanGlow)"
              />

              {/* Center White Pin Dot */}
              <circle
                cx={`${posX}%`}
                cy={`${posY}%`}
                r={radius * 0.45}
                fill="#FFFFFF"
              />
            </g>
          );
        })}
      </svg>

      {/* Same Institution Tooltip Chip on Overlaps Variant */}
      {isOverlaps && constellationProgress > 0.6 && (
        <div
          className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-8 px-2.5 py-1 bg-navy-block/90 border border-coral text-white font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-coral animate-ping" />
          <span>Same Institution · Overlap Co-Referenced</span>
        </div>
      )}
    </div>
  );
};
