"use client";

import React from "react";
import { CaseStatus } from "@/types";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface StatusBadgeProps {
  status: CaseStatus;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  size = "md",
}) => {
  const isOverdueOrEscalated = status === "OVERDUE" || status === "ESCALATED";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1.5 font-bold",
    md: "px-2.5 py-1 text-xs gap-1.5 font-bold",
    lg: "px-3 py-1.5 text-xs gap-2 font-bold",
  };

  // Status mapping per Bold Editorial colour rules
  switch (status) {
    case "UNDER_PROCESS":
      return (
        <span
          className={cn(
            "inline-flex items-center bg-[#2F6FED]/12 text-[#2F6FED] border border-[#2F6FED]/30 uppercase tracking-wider text-[10px]",
            sizeStyles[size],
            className
          )}
        >
          <span className="h-1.5 w-1.5 bg-[#2F6FED] shrink-0" />
          <span>Under Process</span>
        </span>
      );

    case "PENDING":
      return (
        <span
          className={cn(
            "inline-flex items-center bg-[#E8A317]/12 text-[#E8A317] border border-[#E8A317]/30 uppercase tracking-wider text-[10px]",
            sizeStyles[size],
            className
          )}
        >
          <span className="h-1.5 w-1.5 bg-[#E8A317] shrink-0" />
          <span>Pending</span>
        </span>
      );

    case "ACTION_INITIATED":
    case "ACTION_REQUIRED":
      return (
        <span
          className={cn(
            "inline-flex items-center bg-transparent text-ink border border-ink dark:text-white dark:border-white/40 uppercase tracking-wider text-[10px]",
            sizeStyles[size],
            className
          )}
        >
          <span className="h-1.5 w-1.5 bg-coral shrink-0" />
          <span>{status === "ACTION_INITIATED" ? "Action Initiated" : "Action Required"}</span>
        </span>
      );

    case "DISPOSED":
      return (
        <span
          className={cn(
            "inline-flex items-center bg-[#1E8E4E]/12 text-[#1E8E4E] border border-[#1E8E4E]/30 uppercase tracking-wider text-[10px]",
            sizeStyles[size],
            className
          )}
        >
          <span className="h-1.5 w-1.5 bg-[#1E8E4E] shrink-0" />
          <span>Disposed</span>
        </span>
      );

    case "OVERDUE":
    case "ESCALATED":
      return (
        <span
          className={cn(
            "inline-flex items-center bg-[#B0121B] text-white border border-[#B0121B] uppercase tracking-wider text-[10px] shadow-2xs",
            sizeStyles[size],
            className
          )}
        >
          <AlertTriangle className="h-3 w-3 text-white shrink-0 stroke-[2.5]" />
          <span>{status === "ESCALATED" ? "Escalated !" : "Overdue !"}</span>
        </span>
      );

    case "TRANSFERRED":
      return (
        <span
          className={cn(
            "inline-flex items-center bg-[#6D4AC7]/12 text-[#6D4AC7] border border-[#6D4AC7]/30 uppercase tracking-wider text-[10px]",
            sizeStyles[size],
            className
          )}
        >
          <span className="h-1.5 w-1.5 bg-[#6D4AC7] shrink-0" />
          <span>Transferred</span>
        </span>
      );

    default:
      return (
        <span
          className={cn(
            "inline-flex items-center bg-surface-alt text-ink-muted border border-line uppercase tracking-wider text-[10px]",
            sizeStyles[size],
            className
          )}
        >
          <span className="h-1.5 w-1.5 bg-ink-muted shrink-0" />
          <span>{status}</span>
        </span>
      );
  }
};
