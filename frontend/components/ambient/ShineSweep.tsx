"use client";

import React from "react";

interface ShineSweepProps {
  isShineActive?: boolean;
  shineProgress?: number; // 0 to 1
  isReducedMotion?: boolean;
}

export const ShineSweep: React.FC<ShineSweepProps> = ({
  isShineActive = false,
  shineProgress = 0,
  isReducedMotion = false,
}) => {
  if (isReducedMotion || !isShineActive) return null;

  // Translate from -120% to +240% across card width
  const translateX = -120 + shineProgress * 360;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-20"
      aria-hidden="true"
    >
      <div
        className="absolute top-0 bottom-0 w-[45%]"
        style={{
          transform: `translateX(${translateX}%) skewX(-20deg)`,
          background:
            "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
          filter: "drop-shadow(0 0 12px rgba(255,255,255,0.4))",
        }}
      />
    </div>
  );
};
