"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type HeroLoopPhase = "calm" | "constellation" | "wave_sweep" | "sonar_pulse" | "settle";

export interface HeroTimelineState {
  time: number; // 0.0 to 10.0
  progress: number; // 0 to 1
  phase: HeroLoopPhase;
  isConstellationActive: boolean;
  constellationProgress: number; // 0 to 1
  constellationOpacity: number; // 0 to 1
  isWaveActive: boolean;
  waveIntensity: number; // 0 to 1
  isShineActive: boolean;
  shineProgress: number; // 0 to 1
  isSonarActive: boolean;
  sonarProgress: number; // 0 to 1
  isTracesActive: boolean;
  tracesProgress: number; // 0 to 1
  isReducedMotion: boolean;
  isPaused: boolean;
}

export function useHeroTimeline(containerRef?: React.RefObject<HTMLElement | null>) {
  const [time, setTime] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const isVisibleRef = useRef<boolean>(true);
  const lastTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const reqIdRef = useRef<number | null>(null);

  // Check prefers-reduced-motion and ?motion=off
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // Check dev-only override ?motion=off
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("motion") === "off" || urlParams.get("motion") === "false") {
      setIsReducedMotion(true);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // IntersectionObserver to pause when off-screen
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          setIsPaused(true);
        } else {
          setIsPaused(document.hidden);
        }
      },
      { threshold: 0.05 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [containerRef]);

  // Document visibility change listener
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else if (isVisibleRef.current) {
        setIsPaused(false);
        lastTimeRef.current = performance.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Master 10-second loop
  useEffect(() => {
    if (isReducedMotion) {
      setTime(1.0); // static initial state
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      if (isPaused || !isVisibleRef.current) {
        lastTimeRef.current = now;
        reqIdRef.current = requestAnimationFrame(loop);
        return;
      }

      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Cap delta at 0.1s to prevent huge jumps after brief tab switch
      const safeDelta = Math.min(delta, 0.1);
      accumulatedTimeRef.current = (accumulatedTimeRef.current + safeDelta) % 10.0;

      setTime(accumulatedTimeRef.current);
      reqIdRef.current = requestAnimationFrame(loop);
    };

    reqIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, [isReducedMotion, isPaused]);

  // Derived state calculations
  const progress = time / 10.0;

  // Phase
  let phase: HeroLoopPhase = "calm";
  if (time >= 2.0 && time < 5.0) {
    phase = "constellation";
  } else if (time >= 4.8 && time < 7.0) {
    phase = "wave_sweep";
  } else if (time >= 6.5 && time < 9.0) {
    phase = "sonar_pulse";
  } else if (time >= 9.0) {
    phase = "settle";
  }

  // Constellation: 2.0s -> 5.0s, fade out begins at 4.4s, ends at 5.0s
  const isConstellationActive = time >= 1.9 && time <= 5.1;
  let constellationProgress = 0;
  let constellationOpacity = 0;
  if (time >= 2.0 && time < 4.4) {
    constellationProgress = Math.min(1, (time - 2.0) / 2.0); // lines draw in 2.0s
    constellationOpacity = Math.min(1, (time - 2.0) / 0.4);
  } else if (time >= 4.4 && time <= 5.0) {
    constellationProgress = 1;
    constellationOpacity = Math.max(0, 1 - (time - 4.4) / 0.6);
  }

  // Wave Sweep: 4.8s -> 7.0s
  const isWaveActive = time >= 4.5 && time <= 7.2;
  let waveIntensity = 0;
  if (time >= 4.8 && time <= 5.8) {
    waveIntensity = (time - 4.8) / 1.0;
  } else if (time > 5.8 && time <= 7.0) {
    waveIntensity = Math.max(0, 1 - (time - 5.8) / 1.2);
  }

  // Glass Shine Sweep across hero card: 4.8s -> 6.8s (1.4s sweep)
  const isShineActive = time >= 4.8 && time <= 6.8;
  const shineProgress = isShineActive ? (time - 4.8) / 1.6 : 0;

  // Sonar Pulse from green pill dot: 6.5s -> 9.0s
  const isSonarActive = time >= 6.4 && time <= 9.2;
  const sonarProgress = isSonarActive ? (time - 6.5) / 2.5 : 0;

  // Circuit Traces: 6.5s -> 9.2s
  const isTracesActive = time >= 6.5 && time <= 9.2;
  const tracesProgress = isTracesActive ? (time - 6.5) / 2.3 : 0;

  return {
    time,
    progress,
    phase,
    isConstellationActive,
    constellationProgress,
    constellationOpacity,
    isWaveActive,
    waveIntensity,
    isShineActive,
    shineProgress,
    isSonarActive,
    sonarProgress,
    isTracesActive,
    tracesProgress,
    isReducedMotion,
    isPaused,
  };
}
