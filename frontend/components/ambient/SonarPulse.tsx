"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SonarPulseProps {
  isSonarActive?: boolean;
  sonarProgress?: number; // 0 to 1
  isReducedMotion?: boolean;
}

export const SonarPulse: React.FC<SonarPulseProps> = ({
  isSonarActive = false,
  sonarProgress = 0,
  isReducedMotion = false,
}) => {
  if (isReducedMotion || !isSonarActive) return null;

  // 3 concentric rings staggered by 0.35s (represented by offset progresses)
  const rings = [0, 0.25, 0.5];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
      {rings.map((offset, idx) => {
        const ringProg = Math.max(0, Math.min(1, (sonarProgress - offset) / 0.7));
        if (ringProg <= 0 || ringProg >= 1) return null;

        const scale = 1 + ringProg * 3.2; // scale 1 -> 4.2
        const opacity = (1 - ringProg) * 0.75; // opacity 0.75 -> 0

        return (
          <span
            key={idx}
            className="absolute rounded-full border border-[#3DD68C]"
            style={{
              width: "14px",
              height: "14px",
              transform: `scale(${scale})`,
              opacity: opacity,
              borderWidth: "1.5px",
            }}
          />
        );
      })}
    </div>
  );
};
