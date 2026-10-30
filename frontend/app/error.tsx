"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("PRISM Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6 relative overflow-hidden">
      <span className="watermark-word -top-10 left-1/2 -translate-x-1/2" aria-hidden="true">
        ERROR
      </span>

      <div className="relative z-10 h-16 w-16 bg-[#B0121B] text-white flex items-center justify-center">
        <AlertTriangle className="h-8 w-8 stroke-[2.5]" />
      </div>

      <div className="relative z-10 space-y-2">
        <div className="font-mono text-xs font-bold px-3 py-1 bg-[#B0121B] text-white inline-block uppercase tracking-wider">
          SYSTEM PROCESSING EXCEPTION !
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-ink mt-2">
          Processing Error. <span className="text-[#B0121B] italic font-black">Exception caught.</span>
        </h1>

        <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed font-sans">
          An unexpected error occurred while compiling this complaint view. Our diagnostics engine has captured the traceback.
        </p>
      </div>

      <div className="relative z-10 pt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
        <button
          onClick={() => reset()}
          className="btn-coral"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
          <span className="btn-arrow">▸</span>
        </button>
        <Link
          href="/dashboard"
          className="btn-navy"
        >
          <Home className="h-4 w-4 text-coral" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
