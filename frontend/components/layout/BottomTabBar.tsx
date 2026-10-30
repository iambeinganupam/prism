"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { LayoutDashboard, Folders, Search, BarChart3, GitMerge, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomTabBar: React.FC = () => {
  const pathname = usePathname();
  const { setCommandPaletteOpen } = useAppStore();

  const tabs = [
    { name: "Portal", href: "/", icon: Globe },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Complaints", href: "/complaints", icon: Folders },
    { name: "Overlaps", href: "/overlaps", icon: GitMerge, badge: "2" },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080B14]/92 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1 py-1 px-2.5 text-[9px] uppercase font-bold tracking-wider transition-all relative select-none",
              isActive
                ? "text-coral font-black"
                : "text-ink-muted hover:text-ink"
            )}
          >
            {isActive && (
              <motion.span 
                layoutId="bottomTabIndicator"
                className="absolute -top-1.5 left-2 right-2 h-[2.5px] bg-coral shadow-xs" 
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <div className="relative">
              <Icon className={cn(
                "h-4.5 w-4.5 transition-transform",
                isActive ? "scale-110 stroke-[2.2]" : "stroke-[1.75]"
              )} />
              {tab.badge && (
                <span className="absolute -top-1 -right-2.5 h-3.5 min-w-3.5 px-1 bg-coral text-white text-[8px] font-mono font-bold flex items-center justify-center rounded-xs shadow-xs">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="truncate">{tab.name}</span>
          </Link>
        );
      })}

      {/* Quick Search Trigger */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-2.5 text-[9px] uppercase font-bold tracking-wider text-ink-muted hover:text-coral transition-colors"
      >
        <Search className="h-4.5 w-4.5 stroke-[1.75]" />
        <span>Search</span>
      </button>
    </div>
  );
};
