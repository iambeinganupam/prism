"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, FileKey2, CheckCircle, Server } from "lucide-react";
import { PrismLogo } from "@/components/ui/PrismLogo";
import { cn } from "@/lib/utils";

interface SecurityFooterStripProps {
  className?: string;
}

export const SecurityFooterStrip: React.FC<SecurityFooterStripProps> = ({ className }) => {
  const items = [
    { label: "AES-256 Data Encryption", icon: Lock },
    { label: "Role-Based Access (RBAC)", icon: ShieldCheck },
    { label: "Immutable Audit Trail", icon: FileKey2 },
    { label: "DPDP Act 2023 Compliant", icon: CheckCircle },
    { label: "High-Availability Architecture", icon: Server },
  ];

  return (
    <footer
      className={cn(
        "w-full py-4 px-6 bg-[#080B14]/90 backdrop-blur-xl text-white",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <PrismLogo size="xs" variant="icon" />
          <span className="font-display font-black text-sm tracking-tight text-white">
            PRISM<span className="text-coral">.</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">
            AICTE Integrated Intelligence
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-5 sm:gap-7">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <Icon className="h-3.5 w-3.5 text-coral" />
                <span className="text-[11px] font-mono">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
