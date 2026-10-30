"use client";

import React from "react";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import { PrismLogo } from "@/components/ui/PrismLogo";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6 relative overflow-hidden bg-[#080B14] text-white">
      {/* Dynamic Refractive Glow Orbs matching Home Page */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-coral/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#5FE0D0]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[180px] pointer-events-none" />

      <span className="watermark-word -top-10 left-1/2 -translate-x-1/2 text-white/5" aria-hidden="true">
        404
      </span>

      <div className="relative z-10">
        <PrismLogo size="2xl" variant="icon" animated />
      </div>

      <div className="relative z-10 space-y-2">
        <div className="font-mono text-xs font-bold px-3 py-1 bg-white/5 border border-white/15 text-white/70 inline-block uppercase">
          HTTP 404 · UNRESOLVED REGISTRY ENTRY
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white mt-2">
          Record or Page <span className="text-coral italic font-black">Not Found.</span>
        </h1>

        <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed font-sans">
          The requested PRISM registry path does not exist or may have been relocated under a different bureau jurisdiction.
        </p>
      </div>

      <div className="relative z-10 pt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
        <Link
          href="/dashboard"
          className="btn-coral"
        >
          <Home className="h-4 w-4" />
          <span>Return to Dashboard</span>
          <span className="btn-arrow">▸</span>
        </Link>
        <Link
          href="/complaints"
          className="btn-navy"
        >
          <Search className="h-4 w-4 text-coral" />
          <span>Search All Complaints</span>
        </Link>
      </div>
    </div>
  );
}
