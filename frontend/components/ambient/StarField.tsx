"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  phase: number;
}

interface Sparkle {
  x: number; // percentage
  y: number; // percentage
  size: number;
  delay: number;
}

interface StarFieldProps {
  intensity?: number; // 0.0 to 1.0 (default 1.0, dashboard uses 0.4)
  isReducedMotion?: boolean;
}

export const StarField: React.FC<StarFieldProps> = ({
  intensity = 1.0,
  isReducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 6-8 Four-point sparkles scattered across the sky
  const sparkles: Sparkle[] = [
    { x: 14, y: 22, size: 14, delay: 0 },
    { x: 82, y: 18, size: 18, delay: 1.2 },
    { x: 42, y: 35, size: 12, delay: 2.1 },
    { x: 68, y: 55, size: 16, delay: 0.8 },
    { x: 26, y: 68, size: 13, delay: 2.8 },
    { x: 88, y: 76, size: 15, delay: 1.7 },
    { x: 55, y: 15, size: 11, delay: 3.2 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let lastRenderTime = 0;
    const fpsLimit = 30;
    const interval = 1000 / fpsLimit;

    // Detect mobile
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const starCount = isMobile ? Math.floor(50 * intensity) : Math.floor(120 * intensity);

    const stars: Star[] = [];

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Re-initialize stars within rect
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          size: Math.random() < 0.25 ? 2.0 : Math.random() < 0.6 ? 1.5 : 1.0,
          baseOpacity: 0.2 + Math.random() * 0.45,
          twinkleSpeed: 0.0015 + Math.random() * 0.003, // 2-5s oscillation
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = (currentTime: number) => {
      animId = requestAnimationFrame(render);

      const delta = currentTime - lastRenderTime;
      if (delta < interval) return;
      lastRenderTime = currentTime - (delta % interval);

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        let currentOpacity = star.baseOpacity;

        if (!isReducedMotion) {
          // Oscillate opacity: baseOpacity +/- 0.35, clamped between 0.15 and 0.85
          const sineVal = Math.sin(currentTime * star.twinkleSpeed + star.phase);
          currentOpacity = Math.max(
            0.15,
            Math.min(0.85, star.baseOpacity + sineVal * 0.25)
          );
        }

        ctx.fillStyle = `rgba(245, 242, 235, ${(currentOpacity * intensity).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isReducedMotion) {
        cancelAnimationFrame(animId);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [intensity, isReducedMotion]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      {/* Canvas for the 120 twinkling dots */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* 4-Point Sparkle Elements (Soft lilac/pink #E6B8E0 at ~50%) */}
      {sparkles.map((sp, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            transform: "translate(-50%, -50%)",
            opacity: intensity,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            style={{
              animation: isReducedMotion
                ? "none"
                : `sparkleGlow ${3.2 + (i % 3) * 0.6}s ease-in-out infinite`,
              animationDelay: `${sp.delay}s`,
            }}
          >
            {/* 4-Point diamond sparkle star */}
            <path
              d="M12 0 Q12 12 0 12 Q12 12 12 24 Q12 12 24 12 Q12 12 12 0 Z"
              fill="#E6B8E0"
              fillOpacity={0.55}
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
