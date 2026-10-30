"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  delta?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  icon?: any;
  index?: number | string;
  themeColor?: "coral" | "navy" | "white" | "grey";
  hasCoralBar?: boolean;
  onClick?: () => void;
  className?: string;
  sparklineData?: number[];
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  delta,
  icon: Icon,
  index = 1,
  themeColor = "white",
  hasCoralBar = false,
  onClick,
  className,
  sparklineData = [35, 42, 50, 48, 62, 58, 70, 75, 82],
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Smooth count-up animation on mount or value change
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const width = 80;
  const height = 24;
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  // Color-Block Theme Styles
  const getThemeClasses = () => {
    switch (themeColor) {
      case "coral":
        return "bg-coral text-white border-none shadow-[4px_4px_0px_var(--navy-block)]";
      case "navy":
        return "bg-navy-block text-white border border-line/20 shadow-[4px_4px_0px_var(--coral)]";
      case "grey":
        return "bg-surface-alt text-ink border border-line hover:shadow-[4px_4px_0px_var(--coral)]";
      case "white":
      default:
        return "bg-surface text-ink border border-line hover:shadow-[4px_4px_0px_var(--coral)]";
    }
  };

  const isDarkTile = themeColor === "coral" || themeColor === "navy";

  return (
    <div
      onClick={onClick}
      className={cn(
        "editorial-tile p-6 lg:p-7 cursor-pointer group relative flex flex-col justify-between transition-all duration-150",
        getThemeClasses(),
        className
      )}
    >
      {/* Top Header: Label & Index Number */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <span className={cn(
            "text-[11px] font-bold uppercase tracking-wider block",
            isDarkTile ? "text-white/80" : "text-ink-muted"
          )}>
            {label}
          </span>
        </div>

        {/* Small Index Tag in Top-Right */}
        <span className={cn(
          "tile-index-tag text-xs font-mono font-black",
          isDarkTile ? "text-white/60" : "text-ink-muted"
        )}>
          0{index}
        </span>
      </div>

      {/* Main KPI Numeral */}
      <div className="my-6 relative">
        {hasCoralBar && (
          <div className="absolute left-0 right-10 top-1/2 -translate-y-1/2 h-7 bg-coral z-0 pointer-events-none" />
        )}
        <div className="relative z-10 flex items-baseline">
          <span className={cn(
            "font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tighter tabular-nums",
            themeColor === "coral" ? "text-white" : isDarkTile ? "text-white" : "text-ink"
          )}>
            {displayValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bottom Footer: Delta, Sparkline & Arrow ▸ */}
      <div className={cn(
        "pt-4 border-t flex items-center justify-between text-xs",
        isDarkTile ? "border-white/20" : "border-line"
      )}>
        {delta ? (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-mono font-bold",
                themeColor === "coral" 
                  ? "bg-white text-coral font-black"
                  : delta.isPositive
                    ? "bg-[#1E8E4E] text-white"
                    : "bg-[#B0121B] text-white"
              )}
            >
              {delta.isPositive ? (
                <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="h-3 w-3 stroke-[2.5]" />
              )}
              {delta.value}
            </span>
            <span className={cn(
              "text-[10px] uppercase tracking-wider",
              isDarkTile ? "text-white/70" : "text-ink-muted"
            )}>
              {delta.label}
            </span>
          </div>
        ) : (
          <span className={cn("text-[11px]", isDarkTile ? "text-white/60" : "text-ink-faint")}>
            Active records
          </span>
        )}

        <div className="flex items-center gap-3">
          {/* Sparkline */}
          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
            <svg width={width} height={height} className="overflow-visible">
              <polyline
                fill="none"
                stroke={themeColor === "coral" ? "#FFFFFF" : "var(--coral)"}
                strokeWidth="2"
                points={points}
              />
            </svg>
          </div>

          {/* Small ▸ arrow that nudges on hover */}
          <span className={cn(
            "font-mono font-bold text-sm transition-transform group-hover:translate-x-1",
            themeColor === "coral" ? "text-white" : "text-coral"
          )}>
            ▸
          </span>
        </div>
      </div>
    </div>
  );
};
