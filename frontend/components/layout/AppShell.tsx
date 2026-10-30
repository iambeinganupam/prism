"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { SecurityFooterStrip } from "@/components/ui/SecurityFooterStrip";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080B14]" />}>
      <AppShellContent>{children}</AppShellContent>
    </Suspense>
  );
};

function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarCollapsed } = useAppStore();

  const isStandalonePage = 
    pathname === "/" || 
    pathname === "/track" ||
    pathname === "/login" || 
    pathname === "/signin" || 
    pathname === "/signup" || 
    pathname === "/register" ||
    pathname === "/bureaus" ||
    pathname === "/technology" ||
    pathname === "/overlap-engine" ||
    pathname === "/compliance" ||
    pathname === "/metrics";

  if (isStandalonePage) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#080B14] text-white relative overflow-x-hidden selection:bg-coral selection:text-white">
        {/* Global Ambient Glow Orbs matching Home Page */}
        <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-coral/15 rounded-full blur-[160px] pointer-events-none z-0" />
        <div className="fixed -bottom-40 -left-40 w-[600px] h-[600px] bg-[#5FE0D0]/10 rounded-full blur-[160px] pointer-events-none z-0" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[180px] pointer-events-none z-0" />

        <CommandPalette />
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          {children}
        </div>
        {(pathname === "/login" || pathname === "/signin" || pathname === "/signup" || pathname === "/register") && (
          <SecurityFooterStrip />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14] text-white selection:bg-coral selection:text-white relative overflow-x-hidden">
      {/* Global Ambient Glow Orbs matching Home Page */}
      <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-coral/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 -left-40 w-[600px] h-[600px] bg-[#5FE0D0]/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[180px] pointer-events-none z-0" />

      <CommandPalette />

      {/* Desktop & Mobile Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-w-0 pb-16 lg:pb-0 relative z-10",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-68"
        )}
      >
        <TopBar />

        {/* Tiny Vertical Rotated Brand Stamp on desktop */}
        <div className="hidden 2xl:block fixed left-[calc(17rem+1rem)] top-1/2 -translate-y-1/2 vertical-stamp pointer-events-none z-10 opacity-40">
          PRISM · AICTE · 2026
        </div>

        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto relative z-10">
          {children}
        </main>

        <SecurityFooterStrip className="mt-auto hidden sm:block relative z-10" />
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
}
