"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: any;
  actionText?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No active records found.",
  description = "No items match your active filters or query. Try adjusting your parameters.",
  actionText,
  actionLabel,
  onAction,
  className,
}) => {
  const effectiveActionText = actionText || actionLabel;

  return (
    <div
      className={cn(
        "editorial-tile flex flex-col items-center justify-center p-10 sm:p-16 text-center border border-line bg-surface relative overflow-hidden",
        className
      )}
    >
      {/* Geometric SVG Accent: Coral Circle + Navy Bar */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-coral" />
        </div>
        <div className="w-20 h-2 bg-navy-block absolute -bottom-1 left-1/2 -translate-x-1/2" />
      </div>

      {/* Large Serif Sentence with one coral word */}
      <h3 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight">
        No active records <span className="text-coral italic font-black">located.</span>
      </h3>

      <p className="mt-2 text-xs sm:text-sm text-ink-muted max-w-md leading-relaxed">
        {description}
      </p>

      {effectiveActionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 btn-coral"
        >
          <span>{effectiveActionText}</span>
          <span className="btn-arrow font-mono">▸</span>
        </button>
      )}
    </div>
  );
};
