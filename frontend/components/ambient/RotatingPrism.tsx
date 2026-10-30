"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RotatingPrismProps {
  className?: string;
  isReducedMotion?: boolean;
}

export const RotatingPrism: React.FC<RotatingPrismProps> = ({
  className,
  isReducedMotion = false,
}) => {
  return (
    <div
      className={cn(
        "relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center select-none pointer-events-none",
        !isReducedMotion && "animate-prism-float",
        className
      )}
      style={{ perspective: "1000px" }}
      aria-hidden="true"
    >
      {/* Background Soft Glow Aura */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-coral/20 via-[#5FE0D0]/15 to-transparent blur-2xl" />

      {/* SVG Spectrum Light Refraction Rays */}
      <svg
        viewBox="0 0 320 320"
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
      >
        <defs>
          {/* Incident Beam Gradient */}
          <linearGradient id="incidentBeam" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Spectrum Gradients */}
          <linearGradient id="rayCoral" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#A00400" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#A00400" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="rayAmber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#E8A317" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E8A317" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="rayGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#1E8E4E" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1E8E4E" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="rayCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#5FE0D0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5FE0D0" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="rayBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#2F6FED" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2F6FED" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="rayViolet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#8E6DED" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8E6DED" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Incoming Incident White Light Beam */}
        <line
          x1="-40"
          y1="160"
          x2="135"
          y2="160"
          stroke="url(#incidentBeam)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Refracted Spectrum Rays Fanning Out to the Right */}
        <line x1="185" y1="150" x2="340" y2="90" stroke="url(#rayCoral)" strokeWidth="3" />
        <line x1="185" y1="155" x2="345" y2="118" stroke="url(#rayAmber)" strokeWidth="2.5" />
        <line x1="185" y1="160" x2="350" y2="148" stroke="url(#rayGreen)" strokeWidth="2.5" />
        <line x1="185" y1="165" x2="350" y2="178" stroke="url(#rayCyan)" strokeWidth="3" />
        <line x1="185" y1="170" x2="345" y2="208" stroke="url(#rayBlue)" strokeWidth="2.5" />
        <line x1="185" y1="175" x2="340" y2="238" stroke="url(#rayViolet)" strokeWidth="3" />
      </svg>

      {/* 3D Rotating Prism Body with Official Logo */}
      <div
        className={cn(
          "relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center filter drop-shadow-[0_0_30px_rgba(95,224,208,0.45)] select-none",
          !isReducedMotion && "animate-prism-rotate"
        )}
      >
        <Image
          src="/logo.png"
          alt="PRISM Optical Core"
          width={200}
          height={157}
          priority
          style={{ width: "auto", height: "auto" }}
          className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_20px_rgba(242,140,40,0.35)]"
        />
      </div>

      {/* Floating Monogram / Label */}
      <div className="absolute -bottom-2 px-3 py-0.5 bg-[#14182B]/90 border border-white/20 text-[9px] font-mono font-bold tracking-widest uppercase text-white shadow-md">
        PRISM · CORE
      </div>
    </div>
  );
};
