"use client";

import React from "react";
import { SkylineSilhouette } from "@/components/ambient/SkylineSilhouette";
import { cn } from "@/lib/utils";
import { HeroAmbientProps } from "./HeroAmbientContent";

export const HeroAmbientFallback: React.FC<HeroAmbientProps> = ({
  variant = "login",
  className,
  children,
}) => {
  const intensity = variant === "dashboard" ? 0.4 : variant === "overlaps" ? 0.75 : 1.0;

  return (
    <div
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

      {/* 2. STATIC SKYLINE SILHOUETTE FALLBACK */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none" aria-hidden="true">
        <SkylineSilhouette isReducedMotion={true} />
      </div>

      {/* Child Content */}
      {children && (
        <div className="relative z-20 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
};
