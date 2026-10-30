"use client";

import React from "react";

interface CircuitTracesProps {
  isTracesActive?: boolean;
  tracesProgress?: number; // 0 to 1
  isReducedMotion?: boolean;
}

export const CircuitTraces: React.FC<CircuitTracesProps> = ({
  isTracesActive = false,
  tracesProgress = 0,
  isReducedMotion = false,
}) => {
  if (isReducedMotion || !isTracesActive) return null;

  // Paths with horizontal lines and 90-degree right angle bends
  const paths = [
    {
      d: "M 400 120 L 260 120 L 260 180 L 120 180",
      totalLen: 380,
    },
    {
      d: "M 420 200 L 320 200 L 320 240 L 160 240",
      totalLen: 340,
    },
    {
      d: "M 390 290 L 230 290 L 230 230 L 140 230",
      totalLen: 310,
    },
  ];

  // Draw progress: 0 to 1
  const drawOffset = Math.max(0, 1 - tracesProgress * 1.4);
  const opacity = Math.min(1, Math.max(0, (1 - tracesProgress) * 2.5));

  return (
    <div
      className="absolute top-0 right-0 bottom-0 w-80 pointer-events-none select-none z-10 transition-opacity duration-300"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 420 360" className="w-full h-full overflow-visible">
        <defs>
          <filter id="traceGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#5FE0D0" floodOpacity="0.9" />
          </filter>
        </defs>

        {paths.map((p, idx) => {
          // Pulse dot travels along path
          const dotProg = Math.max(0, Math.min(1, tracesProgress * 1.5 - idx * 0.15));

          return (
            <g key={idx}>
              {/* Circuit Path Line */}
              <path
                d={p.d}
                fill="none"
                stroke="#5FE0D0"
                strokeWidth="1.5"
                strokeDasharray={p.totalLen}
                strokeDashoffset={p.totalLen * drawOffset}
                opacity={0.7}
                filter="url(#traceGlow)"
              />

              {/* Travelling Pulse Dot */}
              {dotProg > 0 && dotProg < 1 && (
                <circle
                  r="3.5"
                  fill="#FFFFFF"
                  filter="url(#traceGlow)"
                  opacity={0.95}
                >
                  <animateMotion
                    path={p.d}
                    dur="1.8s"
                    begin={`${idx * 0.25}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
