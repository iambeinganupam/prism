"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface SeverityMeterProps {
  score: number; // 0 - 100
  showLabel?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export const SeverityMeter: React.FC<SeverityMeterProps> = ({
  score,
  showLabel = true,
  className,
  size = "md",
}) => {
  let color = "bg-[#1E8E4E]";
  let label = "Low Risk";
  let textColor = "text-[#1E8E4E]";
  let badgeBg = "bg-[#1E8E4E] text-white";

  if (score >= 80) {
    color = "bg-[#B0121B]";
    label = "Critical Priority !";
    textColor = "text-[#B0121B]";
    badgeBg = "bg-[#B0121B] text-white";
  } else if (score >= 60) {
    color = "bg-[#E8A317]";
    label = "High Seriousness";
    textColor = "text-[#E8A317]";
    badgeBg = "bg-[#E8A317] text-white";
  } else if (score >= 40) {
    color = "bg-[#2F6FED]";
    label = "Moderate";
    textColor = "text-[#2F6FED]";
    badgeBg = "bg-[#2F6FED] text-white";
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[10px] uppercase font-bold tracking-widest text-ink-muted">
          AI Seriousness Index
        </span>
        <span className={cn("font-mono font-black text-xs", textColor)}>{score}/100</span>
      </div>

      <div className={cn("w-full bg-surface-alt border border-line overflow-hidden", size === "sm" ? "h-2" : "h-2.5")}>
        <div
          className={cn("h-full transition-all duration-500", color)}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>

      {showLabel && (
        <div className="flex items-center justify-between mt-0.5">
          <span className={cn("inline-flex items-center text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider", badgeBg)}>
            {score >= 80 && <AlertTriangle className="h-3 w-3 mr-1 stroke-[2.5]" />}
            {label}
          </span>
          <span className="text-[10px] font-mono text-ink-muted">NLP assessed</span>
        </div>
      )}
    </div>
  );
};
