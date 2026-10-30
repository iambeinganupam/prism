"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ConfidenceTier } from "@/types";
import { ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ConfidenceGaugeProps {
  score: number; // 0 - 100
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  hasCoralBar?: boolean;
}

export function getConfidenceTier(score: number): {
  tier: ConfidenceTier;
  label: string;
  badgeClass: string;
  color: string;
  icon: any;
} {
  if (score >= 80) {
    return {
      tier: "HIGH",
      label: "Critical Match Confirmed",
      badgeClass: "bg-coral text-white font-bold border-none",
      color: "var(--coral)",
      icon: CheckCircle2,
    };
  }
  if (score >= 50) {
    return {
      tier: "MEDIUM",
      label: "Possible Overlap — Human Review",
      badgeClass: "bg-[#E8A317] text-white font-bold border-none",
      color: "#E8A317",
      icon: AlertTriangle,
    };
  }
  return {
    tier: "LOW",
    label: "No Overlap Detected",
    badgeClass: "bg-navy-block text-white font-bold border-none",
    color: "var(--navy-block)",
    icon: ShieldAlert,
  };
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  score,
  size = "md",
  showLabel = true,
  className,
  hasCoralBar = false,
}) => {
  const { label, badgeClass, color } = getConfidenceTier(score);

  // SVG parameters for thick flat arc
  const dimensions = {
    sm: { width: 90, stroke: 10, radius: 35, fontSize: "text-2xl font-black" },
    md: { width: 130, stroke: 14, radius: 50, fontSize: "text-4xl font-black" },
    lg: { width: 170, stroke: 18, radius: 66, fontSize: "text-5xl font-black" },
  };

  const dim = dimensions[size];
  const circumference = 2 * Math.PI * dim.radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative flex items-center justify-center" style={{ width: dim.width, height: dim.width }}>
        {/* Coral horizontal bar motif crossing behind the numeral */}
        {hasCoralBar && (
          <div className="absolute left-[-12px] right-[-12px] h-6 bg-coral z-0 pointer-events-none" />
        )}

        <svg
          className="transform -rotate-90 z-1"
          width={dim.width}
          height={dim.width}
        >
          {/* Background circle */}
          <circle
            cx={dim.width / 2}
            cy={dim.width / 2}
            r={dim.radius}
            stroke="var(--line)"
            strokeWidth={dim.stroke}
            fill="transparent"
          />
          {/* Thick progress arc (flat end) */}
          <circle
            cx={dim.width / 2}
            cy={dim.width / 2}
            r={dim.radius}
            stroke={color}
            strokeWidth={dim.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
            className="transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1)"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span className={cn(
            "font-display tracking-tighter tabular-nums leading-none",
            hasCoralBar ? "text-white" : "text-ink",
            dim.fontSize
          )}>
            {score}%
          </span>
          <span className={cn(
            "text-[9px] uppercase font-mono font-bold tracking-widest mt-1",
            hasCoralBar ? "text-white/80" : "text-ink-muted"
          )}>
            Confidence
          </span>
        </div>
      </div>

      {showLabel && (
        <span
          className={cn(
            "text-[10px] uppercase tracking-wider px-2.5 py-1 text-center font-bold",
            badgeClass
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
};
