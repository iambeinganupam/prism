"use client";

import React from "react";
import { CaseStage } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  currentStage: CaseStage;
  className?: string;
}

const STAGES: { key: CaseStage; label: string; description: string }[] = [
  {
    key: "RECEIVED",
    label: "Received",
    description: "Registered by Bureau",
  },
  {
    key: "SCREENING",
    label: "Screening",
    description: "Jurisdiction check",
  },
  {
    key: "UNDER_PROCESS",
    label: "Under Review",
    description: "Inquiry initiated",
  },
  {
    key: "ACTION_REQUIRED",
    label: "Action Required",
    description: "Show cause / reply",
  },
  {
    key: "RESOLVED",
    label: "Resolved",
    description: "Compliance verified",
  },
  {
    key: "CLOSED",
    label: "Closed",
    description: "Formal closure",
  },
];

const STAGE_ORDER: Record<CaseStage, number> = {
  RECEIVED: 0,
  SCREENING: 1,
  UNDER_PROCESS: 2,
  IN_REVIEW: 2,
  ACTION_REQUIRED: 3,
  RESOLVED: 4,
  CLOSED: 5,
  DISPOSED: 5,
};

export const Stepper: React.FC<StepperProps> = ({ currentStage, className }) => {
  const currentIndex = STAGE_ORDER[currentStage] ?? 0;

  return (
    <div className={cn("w-full py-4 overflow-x-auto pb-3", className)}>
      <div className="relative flex items-center justify-between min-w-[480px] sm:min-w-0 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Track line */}
        <div className="absolute top-5 left-10 right-10 h-[3px] bg-line -z-0" />

        {/* Active progress track line */}
        <div
          className="absolute top-5 left-10 h-[3px] bg-navy-block transition-all duration-500 ease-out -z-0"
          style={{
            width: `${Math.min(100, Math.max(0, (currentIndex / (STAGES.length - 1)) * 88))}%`,
          }}
        />

        {STAGES.map((st, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={st.key} className="flex flex-col items-center relative z-10">
              {/* Node indicator */}
              <div className="h-10 flex items-center justify-center">
                {isCompleted ? (
                  <div className="h-5 w-5 bg-navy-block text-white flex items-center justify-center font-mono font-black text-[10px]">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="h-5 w-5 bg-coral text-white flex items-center justify-center font-mono font-black text-[10px] ring-4 ring-coral/30 animate-pulse">
                    0{idx + 1}
                  </div>
                ) : (
                  <div className="h-5 w-5 bg-surface border-2 border-line text-ink-muted flex items-center justify-center font-mono font-black text-[10px]">
                    0{idx + 1}
                  </div>
                )}
              </div>

              <div className="mt-2 text-center">
                <span
                  className={cn(
                    "block text-[11px] uppercase tracking-wider font-bold",
                    isCurrent
                      ? "text-coral font-black"
                      : isCompleted
                      ? "text-ink font-bold"
                      : "text-ink-muted"
                  )}
                >
                  {st.label}
                </span>
                <span className="hidden md:block text-[10px] text-ink-muted max-w-[100px] leading-tight mt-0.5">
                  {st.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
