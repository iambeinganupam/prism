"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, GitMerge } from "lucide-react";

export interface CaseIdTagProps {
  id?: string;
  caseId?: string;
  hasOverlap?: boolean;
  className?: string;
  copyable?: boolean;
}

export const CaseIdTag: React.FC<CaseIdTagProps> = ({
  id,
  caseId,
  hasOverlap,
  className,
  copyable = true,
}) => {
  const [copied, setCopied] = useState(false);
  const displayId = id || caseId || "";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!copyable || !displayId) return;
    navigator.clipboard.writeText(displayId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <span
      onClick={copyable ? handleCopy : undefined}
      title={copyable ? `Click to copy ${displayId}` : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-alt text-ink font-mono text-[11px] font-bold border border-line select-all",
        hasOverlap && "border-coral/50 bg-coral/5 text-coral",
        copyable && "cursor-pointer hover:border-coral hover:text-coral transition-colors",
        className
      )}
    >
      {hasOverlap && <GitMerge className="h-3 w-3 text-coral shrink-0" />}
      <span className="tracking-tight">{displayId}</span>
      {copyable && (
        <span className="text-ink-muted">
          {copied ? (
            <Check className="h-3 w-3 text-[#1E8E4E]" />
          ) : (
            <Copy className="h-3 w-3 opacity-60" />
          )}
        </span>
      )}
    </span>
  );
};
