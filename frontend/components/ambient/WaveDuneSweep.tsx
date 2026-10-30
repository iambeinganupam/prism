"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface WaveDuneSweepProps {
  isWaveActive?: boolean;
  waveIntensity?: number; // 0 to 1
  isReducedMotion?: boolean;
}

export const WaveDuneSweep: React.FC<WaveDuneSweepProps> = ({
  isWaveActive = false,
  waveIntensity = 0,
  isReducedMotion = false,
}) => {
  // Base opacity: 0.35, during active sweep brightens up to 0.55
  const waveOpacity = 0.35 + waveIntensity * 0.2;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      {/* Wave Dune SVG with 40px blur */}
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 right-0 w-[120%] h-[75%] transition-transform duration-1000 ease-out"
        style={{
          filter: "blur(40px)",
          transform: isReducedMotion
            ? "none"
            : `translateX(${isWaveActive ? "4%" : "-4%"}) translateY(5%)`,
          opacity: waveOpacity,
        }}
      >
        <defs>
          <linearGradient id="duneOrangeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4622D" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#A00400" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#120B08" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="duneOrangeGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8833A" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#C4622D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#120B08" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Wave 1: Organic Dune Sweep */}
        <path
          d="M0,320 Q280,180 580,260 T1200,220 L1200,600 L0,600 Z"
          fill="url(#duneOrangeGrad1)"
        />

        {/* Wave 2: Complementary Swell */}
        <path
          d="M0,380 Q350,260 720,340 T1200,300 L1200,600 L0,600 Z"
          fill="url(#duneOrangeGrad2)"
        />
      </svg>

      {/* 4-5 Thin Diagonal Shooting Streak Lines (10-15% opacity) */}
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          <linearGradient id="streakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#E8833A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#A00400" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[
          { x1: 80, y1: 120, x2: 280, y2: 240, delay: "0s" },
          { x1: 340, y1: 60, x2: 560, y2: 190, delay: "0.8s" },
          { x1: 620, y1: 180, x2: 860, y2: 320, delay: "1.4s" },
          { x1: 200, y1: 280, x2: 440, y2: 420, delay: "2.1s" },
          { x1: 750, y1: 80, x2: 950, y2: 200, delay: "1.0s" },
        ].map((str, idx) => (
          <line
            key={idx}
            x1={str.x1}
            y1={str.y1}
            x2={str.x2}
            y2={str.y2}
            stroke="url(#streakGrad)"
            strokeWidth="1.25"
            strokeDasharray="180"
            className={cn(
              !isReducedMotion && isWaveActive && "animate-[streakSlide_2.2s_ease-out_infinite]"
            )}
            style={{
              opacity: isWaveActive ? 0.35 : 0.12,
              transition: "opacity 0.6s ease",
            }}
          />
        ))}
      </svg>
    </div>
  );
};
