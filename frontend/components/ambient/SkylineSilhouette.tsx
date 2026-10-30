"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SkylineSilhouetteProps {
  className?: string;
  isReducedMotion?: boolean;
}

export const SkylineSilhouette: React.FC<SkylineSilhouetteProps> = ({
  className,
  isReducedMotion = false,
}) => {
  // Pre-calculated deterministic buildings for institution skyline (heights 40-140px)
  const backRowBuildings = useMemo(
    () => [
      { w: 48, h: 110, hasWindow: true },
      { w: 32, h: 75, hasWindow: false },
      { w: 64, h: 135, hasWindow: true },
      { w: 40, h: 60, hasWindow: false },
      { w: 55, h: 95, hasWindow: true },
      { w: 35, h: 120, hasWindow: false },
      { w: 70, h: 80, hasWindow: true },
      { w: 45, h: 140, hasWindow: true },
      { w: 38, h: 70, hasWindow: false },
      { w: 58, h: 105, hasWindow: true },
      { w: 44, h: 65, hasWindow: false },
      { w: 60, h: 125, hasWindow: true },
      { w: 36, h: 85, hasWindow: false },
      { w: 52, h: 115, hasWindow: true },
      { w: 42, h: 90, hasWindow: false },
      { w: 68, h: 130, hasWindow: true },
    ],
    []
  );

  const frontRowBuildings = useMemo(
    () => [
      { w: 38, h: 70, hasTower: true },
      { w: 56, h: 45, hasTower: false },
      { w: 42, h: 90, hasTower: false },
      { w: 65, h: 60, hasTower: true },
      { w: 35, h: 80, hasTower: false },
      { w: 50, h: 50, hasTower: false },
      { w: 75, h: 100, hasTower: true },
      { w: 40, h: 65, hasTower: false },
      { w: 55, h: 85, hasTower: false },
      { w: 36, h: 40, hasTower: true },
      { w: 62, h: 95, hasTower: false },
      { w: 48, h: 55, hasTower: false },
      { w: 58, h: 75, hasTower: true },
      { w: 44, h: 60, hasTower: false },
      { w: 70, h: 85, hasTower: false },
    ],
    []
  );

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 h-36 overflow-hidden pointer-events-none select-none z-10",
        className
      )}
      aria-hidden="true"
    >
      {/* BACK ROW SILHOUETTE: #2B160D with subtle horizontal parallax drift */}
      <div
        className={cn(
          "absolute bottom-0 left-[-20px] right-[-20px] flex items-end justify-between opacity-85",
          !isReducedMotion && "animate-skyline-parallax"
        )}
      >
        {backRowBuildings.map((b, i) => (
          <div
            key={i}
            style={{
              width: `${b.w}px`,
              height: `${b.h}px`,
              backgroundColor: "#2B160D",
            }}
            className="shrink-0 relative border-t border-white/5"
          >
            {/* Subtle campus window rows */}
            {b.hasWindow && (
              <div className="absolute top-3 left-2 right-2 grid grid-cols-2 gap-1.5 opacity-30">
                <span className="h-1 bg-[#C4622D]" />
                <span className="h-1 bg-[#C4622D]" />
                <span className="h-1 bg-[#C4622D]" />
                <span className="h-1 bg-[#C4622D]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FRONT ROW SILHOUETTE: #1A0D08 static, solid institutional blocks */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between z-10">
        {frontRowBuildings.map((b, i) => (
          <div
            key={i}
            style={{
              width: `${b.w}px`,
              height: `${b.h}px`,
              backgroundColor: "#1A0D08",
            }}
            className="shrink-0 relative border-t border-white/10"
          >
            {/* Architectural spire or campus tower */}
            {b.hasTower && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-[#1A0D08]">
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#E8A317] opacity-60" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
