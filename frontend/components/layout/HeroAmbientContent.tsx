"use client";

import React, { useRef } from "react";
import { useHeroTimeline } from "@/components/ambient/useHeroTimeline";
import { StarField } from "@/components/ambient/StarField";
import { WaveDuneSweep } from "@/components/ambient/WaveDuneSweep";
import { Constellation } from "@/components/ambient/Constellation";
import { SkylineSilhouette } from "@/components/ambient/SkylineSilhouette";
import { RotatingPrism } from "@/components/ambient/RotatingPrism";
import { ShineSweep } from "@/components/ambient/ShineSweep";
import { SonarPulse } from "@/components/ambient/SonarPulse";
import { CircuitTraces } from "@/components/ambient/CircuitTraces";
import { cn } from "@/lib/utils";

export interface HeroAmbientProps {
  variant?: "login" | "dashboard" | "overlaps";
  className?: string;
  showHeroCard?: boolean; // Defaults to true on 'login', false on 'dashboard'/'overlaps'
  children?: React.ReactNode;
}

export const HeroAmbientContent: React.FC<HeroAmbientProps> = ({
  variant = "login",
  className,
  showHeroCard = variant === "login",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeline = useHeroTimeline(containerRef);

  // Intensity levels per variant specification:
  // login = 1.0 (full intensity), dashboard = 0.4 (40% intensity), overlaps = 0.75 (constellation + pulse focus)
  const intensity = variant === "dashboard" ? 0.4 : variant === "overlaps" ? 0.75 : 1.0;

  // Status pill text
  const statusPillText =
    variant === "login"
      ? "AI Overlap Engine Active"
      : variant === "dashboard"
      ? "Institution Registry Synced"
      : timeline.constellationProgress > 0.65
      ? "Potential Overlap Found"
      : "Neural Co-Reference Active";

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden select-none",
        variant === "login" && "w-full h-full min-h-[560px] hero-dusk-gradient",
        variant === "dashboard" && "w-full hero-dusk-gradient",
        variant === "overlaps" && "w-full hero-dusk-gradient",
        className
      )}
      style={{
        backgroundColor: "#080B14",
      }}
    >
      {/* 1. DUSK SKY GRADIENT BACKDROP */}
      <div
        className="absolute inset-0 pointer-events-none hero-dusk-gradient"
        style={{
          opacity: intensity,
        }}
        aria-hidden="true"
      />

      {/* 2. STAR FIELD & 4-POINT SPARKLES */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <StarField intensity={intensity} isReducedMotion={timeline.isReducedMotion} />
      </div>

      {/* 3. WAVE / DUNE SWEEP LAYER & SHOOTING STREAKS */}
      {variant !== "overlaps" && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <WaveDuneSweep
            isWaveActive={timeline.isWaveActive}
            waveIntensity={timeline.waveIntensity}
            isReducedMotion={timeline.isReducedMotion}
          />
        </div>
      )}

      {/* 4. CONSTELLATION LAYER (CASES LINKING & OVERLAP CONVERGENCE) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Constellation
          variant={variant}
          isConstellationActive={timeline.isConstellationActive}
          constellationProgress={timeline.constellationProgress}
          constellationOpacity={timeline.constellationOpacity}
          isReducedMotion={timeline.isReducedMotion}
        />
      </div>

      {/* 5. SKYLINE SILHOUETTE (ACADEMIC CAMPUSES & INSTITUTION TOWERS) */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none" aria-hidden="true">
        <SkylineSilhouette isReducedMotion={timeline.isReducedMotion} />
      </div>

      {/* 6. CIRCUIT TRACES (CYAN RIGHT-ANGLE BENDS & PULSE DOTS) */}
      {variant !== "dashboard" && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <CircuitTraces
            isTracesActive={timeline.isTracesActive}
            tracesProgress={timeline.tracesProgress}
            isReducedMotion={timeline.isReducedMotion}
          />
        </div>
      )}

      {/* 7. FLOATING NAV PILL AT THE TOP (LOGIN VARIANT) */}
      {variant === "login" && (
        <div 
          className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-700"
          aria-hidden="true"
        >
          <div className="px-4 py-1.5 rounded-full bg-[#F3EDE3] text-[#14182B] text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 border border-white/60">
            <span className="h-2 w-2 rounded-full bg-coral animate-pulse" />
            <span>AICTE PRISM · PERSONAL LAUNCH</span>
          </div>
        </div>
      )}

      {/* 8. HERO OBJECT CARD WITH ROTATING 3D PRISM (LOGIN VARIANT) */}
      {showHeroCard && (
        <div 
          className="absolute inset-0 flex items-center justify-center p-6 z-20 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className={cn(
              "relative rounded-[28px] border border-white/15 p-6 sm:p-8 flex flex-col items-center justify-center shadow-2xl overflow-hidden",
              "bg-[rgba(20,14,12,0.85)] backdrop-blur-xs w-64 h-72 sm:w-76 sm:h-84"
            )}
            style={{
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(160, 4, 0, 0.25)",
            }}
          >
            {/* Specular Highlight Glass Shine Across Card */}
            <ShineSweep
              isShineActive={timeline.isShineActive}
              shineProgress={timeline.shineProgress}
              isReducedMotion={timeline.isReducedMotion}
            />

            {/* Rotating 3D Optical Prism with Coral Red #A00400 ray */}
            <RotatingPrism isReducedMotion={timeline.isReducedMotion} />

            {/* Status Pill on Bottom Right of Card (Source of Sonar Pulse) */}
            <div className="absolute bottom-4 right-4 z-30 pointer-events-auto">
              <div className="relative px-3 py-1.5 rounded-full bg-white text-[#14182B] text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-2 border border-white/80">
                {/* Green Dot with Sonar Pulse */}
                <div className="relative flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-[#3DD68C] z-10" />
                  <SonarPulse
                    isSonarActive={timeline.isSonarActive}
                    sonarProgress={timeline.sonarProgress}
                    isReducedMotion={timeline.isReducedMotion}
                  />
                </div>
                <span className="text-[10px] whitespace-nowrap">{statusPillText}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD / OVERLAPS STATUS PILL ANCHOR */}
      {variant !== "login" && (
        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
          <div className="relative px-3 py-1 rounded-full bg-[#14182B]/85 text-white text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-2 border border-white/20">
            <div className="relative flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-[#3DD68C] z-10" />
              <SonarPulse
                isSonarActive={timeline.isSonarActive}
                sonarProgress={timeline.sonarProgress}
                isReducedMotion={timeline.isReducedMotion}
              />
            </div>
            <span className="whitespace-nowrap">{statusPillText}</span>
          </div>
        </div>
      )}

      {/* Render child content cleanly over ambient backdrop */}
      {children && (
        <div className="relative z-20 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
};
