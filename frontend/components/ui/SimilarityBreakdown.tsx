"use client";

import React from "react";
import { OverlapSimilarityFactors } from "@/types";
import { cn } from "@/lib/utils";
import { Building, FileText, MapPin, Brain, Tag, Clock } from "lucide-react";

interface SimilarityBreakdownProps {
  factors: OverlapSimilarityFactors;
  className?: string;
}

export const SimilarityBreakdown: React.FC<SimilarityBreakdownProps> = ({
  factors,
  className,
}) => {
  const items = [
    {
      key: "institutionIdMatch",
      data: factors.institutionIdMatch,
      icon: Building,
      color: "bg-coral",
    },
    {
      key: "nameMatch",
      data: factors.nameMatch,
      icon: FileText,
      color: "bg-navy-block",
    },
    {
      key: "locationMatch",
      data: factors.locationMatch,
      icon: MapPin,
      color: "bg-[#1E8E4E]",
    },
    {
      key: "semanticContent",
      data: factors.semanticContent,
      icon: Brain,
      color: "bg-[#E8A317]",
    },
    {
      key: "issueCategory",
      data: factors.issueCategory,
      icon: Tag,
      color: "bg-[#6D4AC7]",
    },
    {
      key: "timeWindow",
      data: factors.timeWindow,
      icon: Clock,
      color: "bg-[#2F6FED]",
    },
  ];

  return (
    <div className={cn("editorial-tile bg-surface p-5 border border-line space-y-4", className)}>
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-coral shrink-0" />
          <h4 className="font-display font-black text-xs uppercase tracking-wider text-ink">
            AI Similarity Vector Breakdown
          </h4>
        </div>
        <span className="text-[10px] font-mono text-ink-muted">6-VECTOR CORRELATION</span>
      </div>

      <div className="space-y-3 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          const pct = Math.round(item.data.score * 100);

          return (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-ink-muted shrink-0" />
                  <span className="font-bold text-ink text-[11px] uppercase tracking-wider">
                    {item.data.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-[10px] text-ink-muted">W: {item.data.weight}x</span>
                  <span className="font-bold text-ink">{pct}%</span>
                </div>
              </div>

              {/* Flat bar with sharp corners */}
              <div className="w-full h-2 bg-surface-alt border border-line overflow-hidden">
                <div
                  className={cn("h-full transition-all duration-500", item.color)}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {item.data.detail && (
                <p className="text-[10px] text-ink-muted pl-5 font-mono">
                  ↳ {item.data.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
