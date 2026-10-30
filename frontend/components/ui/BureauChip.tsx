"use client";

import React from "react";
import { BureauCode } from "@/types";
import { cn } from "@/lib/utils";
import { ShieldCheck, Scale, GraduationCap, FileCheck, Building2, Layers } from "lucide-react";

interface BureauChipProps {
  bureau: BureauCode;
  className?: string;
  showIcon?: boolean;
}

const BUREAU_CONFIG: Record<
  BureauCode,
  { short: string; label: string; icon: any; color: string; border: string; bg: string }
> = {
  PGRC: {
    short: "PGRC",
    label: "Public Grievance Redressal Cell",
    icon: ShieldCheck,
    color: "text-[#2F6FED] dark:text-[#4A88FF]",
    border: "border-[#2F6FED]/40",
    bg: "bg-[#2F6FED]/10",
  },
  RB: {
    short: "Regulation",
    label: "Regulation Bureau",
    icon: Scale,
    color: "text-ink dark:text-white",
    border: "border-line",
    bg: "bg-surface-alt",
  },
  ACA: {
    short: "Academic",
    label: "Academic Bureau",
    icon: GraduationCap,
    color: "text-[#6D4AC7] dark:text-[#8E6DED]",
    border: "border-[#6D4AC7]/40",
    bg: "bg-[#6D4AC7]/10",
  },
  APP: {
    short: "Approval",
    label: "Approval Bureau",
    icon: FileCheck,
    color: "text-[#E8A317] dark:text-[#F5B638]",
    border: "border-[#E8A317]/40",
    bg: "bg-[#E8A317]/10",
  },
  RO: {
    short: "Regional Office",
    label: "Regional Offices",
    icon: Building2,
    color: "text-[#1E8E4E] dark:text-[#27B062]",
    border: "border-[#1E8E4E]/40",
    bg: "bg-[#1E8E4E]/10",
  },
  OTH: {
    short: "Other Cell",
    label: "Other Cells",
    icon: Layers,
    color: "text-ink-muted",
    border: "border-line",
    bg: "bg-surface-alt",
  },
};

export const BureauChip: React.FC<BureauChipProps> = ({
  bureau,
  className,
  showIcon = true,
}) => {
  const config = BUREAU_CONFIG[bureau] || BUREAU_CONFIG.OTH;
  const Icon = config.icon;

  return (
    <span
      title={config.label}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider border",
        config.bg,
        config.color,
        config.border,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3 shrink-0 stroke-[2]" />}
      <span>{config.short}</span>
    </span>
  );
};
