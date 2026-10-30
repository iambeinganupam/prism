"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { prismApi } from "@/lib/api";
import { Case } from "@/types";
import { Stepper } from "@/components/ui/Stepper";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BureauChip } from "@/components/ui/BureauChip";
import { CaseIdTag } from "@/components/ui/CaseIdTag";
import { PrismLogo } from "@/components/ui/PrismLogo";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { 
  Search, 
  Building2, 
  BellRing, 
  AlertCircle,
  FilePlus,
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Home,
  RotateCcw
} from "lucide-react";
import { format } from "date-fns";

export default function PublicTrackPage() {
  return (
    <div className="min-h-screen bg-[#080B14] text-white flex flex-col selection:bg-coral selection:text-white relative overflow-hidden">
      {/* Dynamic Refractive Glow Orbs matching Home Page */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-coral/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#5FE0D0]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[180px] pointer-events-none" />

      <PublicHeader />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 relative z-10">
        <Suspense fallback={<div className="max-w-4xl mx-auto py-16 text-center text-xs font-mono text-white/50">Loading Grievance Tracker...</div>}>
          <PublicTrackContent />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}

function PublicTrackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || searchParams.get("q") || "PGRC/2025/1023";

  const [query, setQuery] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [trackedCase, setTrackedCase] = useState<Case | null>(null);
  const [searched, setSearched] = useState(false);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const performSearch = async (caseId: string) => {
    if (!caseId.trim()) return;
    setLoading(true);
    try {
      const res = await prismApi.trackComplaint(caseId.trim());
      setTrackedCase(res);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setTrackedCase(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      performSearch(initialId);
    }
  }, [initialId]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const sampleCases = [
    { id: "PGRC/2025/1023", label: "PGRC (Fee Issue)" },
    { id: "RB/2025/4487", label: "RB (Faculty Norms)" },
    { id: "ACA/2025/7765", label: "ACA (Curriculum)" },
    { id: "APP/2025/9012", label: "APP (EoA Status)" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* 1. DEDICATED BACK & PORTAL EXIT NAVIGATION BAR (MONOLITHIC OBSIDIAN) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-coral text-white hover:text-coral font-bold text-xs uppercase tracking-wider transition-colors shadow-xs group"
          title="Return to the previous screen"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-coral" />
          <span>← Back to Previous Page</span>
        </button>

        <div className="flex items-center gap-2.5 text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-mono text-[11px] transition-colors"
          >
            <Home className="h-3.5 w-3.5 text-coral" />
            <span className="uppercase tracking-wider">Portal Home</span>
          </Link>
          <span className="text-white/20">|</span>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-coral/15 hover:bg-coral hover:text-white border border-coral/30 text-coral font-mono text-[11px] font-bold transition-colors"
          >
            <span className="uppercase tracking-wider">Console</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Editorial Header */}
      <div className="relative text-center space-y-3 pb-2 overflow-hidden">
        <span className="watermark-word -top-12 left-1/2 -translate-x-1/2 opacity-20" aria-hidden="true">
          TRACK
        </span>

        <div className="relative z-10 flex flex-col items-center justify-center gap-2 mb-2">
          <PrismLogo size="xl" variant="icon" animated />
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 bg-coral" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-white/60 font-mono">
              PUBLIC CITIZEN PORTAL · AICTE
            </span>
            <span className="h-1.5 w-1.5 bg-coral" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white">
          Track Grievance <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral via-[#FF6F59] to-[#F28C28]">Status.</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto leading-relaxed font-sans">
          Enter your unique Case Registration ID or registered mobile number to inspect real-time statutory progress and disposal milestones.
        </p>
      </div>

      {/* 3. Single Wide Rectangular Input with Coral Search Button */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <form 
          onSubmit={handleTrackSubmit} 
          className="bg-white/[0.03] p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-2xl border border-white/15 focus-within:border-coral transition-colors backdrop-blur-md"
        >
          <div className="pl-4 text-white/40 hidden sm:block">
            <Search className="h-5 w-5 stroke-[2.5]" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. PGRC/2025/1023 or 9811243210"
            className="w-full bg-transparent px-4 sm:px-2 py-3 text-sm sm:text-base font-mono font-bold text-white placeholder:text-white/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-coral h-12 px-6 text-xs uppercase tracking-wider font-bold shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Searching...</span>
            ) : (
              <>
                <span>Check Status</span>
                <span className="btn-arrow">▸</span>
              </>
            )}
          </button>
        </form>

        {/* Sample Reference Quick Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-white/60 font-sans">
          <span className="text-[11px] font-mono">Sample Cases:</span>
          {sampleCases.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setQuery(s.id);
                performSearch(s.id);
              }}
              className="text-coral hover:underline font-mono font-bold transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 border border-white/10 text-[11px]"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. USER-FRIENDLY INSTRUCTIONS GUIDE (MONOLITHIC OBSIDIAN TILES) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2 text-xs">
        <div className="p-4 bg-white/[0.03] border border-white/10 space-y-1.5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-coral font-bold font-mono text-[11px] uppercase">
            <span className="h-5 w-5 rounded-full bg-coral/10 flex items-center justify-center text-coral">1</span>
            <span>Enter Identifier</span>
          </div>
          <p className="text-white/60 text-[11px] leading-relaxed">
            Provide the Case ID received in your acknowledgment SMS/email or registered contact number.
          </p>
        </div>

        <div className="p-4 bg-white/[0.03] border border-white/10 space-y-1.5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-coral font-bold font-mono text-[11px] uppercase">
            <span className="h-5 w-5 rounded-full bg-coral/10 flex items-center justify-center text-coral">2</span>
            <span>Live SLA Tracking</span>
          </div>
          <p className="text-white/60 text-[11px] leading-relaxed">
            View which AICTE bureau is actively handling the grievance and inspect the expected disposal date.
          </p>
        </div>

        <div className="p-4 bg-white/[0.03] border border-white/10 space-y-1.5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-coral font-bold font-mono text-[11px] uppercase">
            <span className="h-5 w-5 rounded-full bg-coral/10 flex items-center justify-center text-coral">3</span>
            <span>Milestone Alerts</span>
          </div>
          <p className="text-white/60 text-[11px] leading-relaxed">
            Receive automated SMS and email notifications at every statutory milestone without exposing officer identities.
          </p>
        </div>
      </div>

      {/* 5. Results View (MONOLITHIC OBSIDIAN CARD) */}
      {searched && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {trackedCase ? (
            <div className="bg-white/[0.03] p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 relative overflow-hidden border border-white/15 shadow-2xl backdrop-blur-xl">
              
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CaseIdTag id={trackedCase.id} />
                    <BureauChip bureau={trackedCase.bureau} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white mt-2">
                    {trackedCase.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-white/70 font-sans">
                    <Building2 className="h-4 w-4 text-coral shrink-0" />
                    <span>Against: <strong className="text-white">{trackedCase.institutionName}</strong></span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0 space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest block mb-1">
                      Current Stage
                    </span>
                    <StatusBadge status={trackedCase.status} size="md" />
                  </div>
                  <button
                    onClick={handleGoBack}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-coral hover:underline"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to previous</span>
                  </button>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2">
                <Stepper currentStage={trackedCase.currentStage} />
              </div>

              {/* Status Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 bg-white/5 border border-white/10 space-y-1">
                  <span className="text-white/50 block text-[10px] uppercase font-bold tracking-wider">Date of Registration</span>
                  <span className="font-bold text-white block text-sm">
                    {format(new Date(trackedCase.dateOfReceipt), "dd MMMM yyyy, hh:mm a")}
                  </span>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 space-y-1">
                  <span className="text-white/50 block text-[10px] uppercase font-bold tracking-wider">Expected Disposal Date</span>
                  <span className="font-bold text-white block font-mono text-sm">
                    {format(new Date(trackedCase.dueDate), "dd MMMM yyyy")}
                  </span>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 space-y-1">
                  <span className="text-white/50 block text-[10px] uppercase font-bold tracking-wider">Handling Department</span>
                  <span className="font-bold text-white block text-sm">
                    {trackedCase.bureauName}
                  </span>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 space-y-1">
                  <span className="text-white/50 block text-[10px] uppercase font-bold tracking-wider">Next Scheduled Action</span>
                  <span className="font-bold text-[#E8A317] block text-sm">
                    Joint physical verification and fee audit report
                  </span>
                </div>
              </div>

              {/* Reassuring Notice */}
              <div className="p-4 bg-white/5 border-l-4 border-l-coral border border-white/10 flex items-center gap-3 text-xs text-white/70 font-sans">
                <BellRing className="h-5 w-5 text-coral shrink-0" />
                <p>
                  <strong className="text-white">Automated Dispatch Notice:</strong> You will be notified via SMS and email as soon as the dealing cell records a statutory update or completes this inquiry.
                </p>
              </div>

              {/* Cross-Link Actions */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGoBack}
                    className="font-bold text-coral hover:underline flex items-center gap-1 font-mono"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to Previous Page</span>
                  </button>
                  <span className="text-white/20">•</span>
                  <Link
                    href={`/complaints/${encodeURIComponent(trackedCase.id)}`}
                    className="font-bold text-white/70 hover:text-coral transition-colors flex items-center gap-1 font-mono"
                  >
                    <span>View Official Case Dossier</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/complaints/new"
                    className="text-white/70 hover:text-white font-bold flex items-center gap-1"
                  >
                    <FilePlus className="h-3.5 w-3.5 text-coral" />
                    <span>Lodge Another Grievance</span>
                  </Link>
                  <span className="text-white/20">•</span>
                  <Link
                    href="/"
                    className="text-white/70 hover:text-white font-bold flex items-center gap-1"
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span>Portal Home</span>
                  </Link>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white/[0.03] p-10 text-center space-y-4 border border-white/15 backdrop-blur-md">
              <AlertCircle className="h-8 w-8 text-coral mx-auto" />
              <h3 className="font-display font-black text-xl text-white">
                No Record Found for &quot;{query}&quot;
              </h3>
              <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed font-sans">
                Please verify that the Case Registration ID is typed accurately (e.g., <code className="font-mono text-coral font-bold">PGRC/2025/1023</code>) or search using your registered 10-digit mobile number.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="px-4 py-2 border border-white/20 hover:border-coral text-xs font-bold uppercase tracking-wider text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Previous Page</span>
                </button>
                <Link
                  href="/complaints/new"
                  className="btn-coral text-xs"
                >
                  <FilePlus className="h-4 w-4" />
                  <span>Register as New Grievance</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Bottom Helpful Navigation Strip */}
      <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>DPDP Act 2023 Compliant Citizen Redressal Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="hover:text-coral transition-colors font-bold flex items-center gap-1 text-coral"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Previous Page</span>
          </button>
          <span className="text-white/20">•</span>
          <Link href="/login" className="hover:text-coral transition-colors font-bold">
            Officer Login
          </Link>
          <span className="text-white/20">•</span>
          <Link href="/dashboard" className="hover:text-coral transition-colors font-bold">
            Console Dashboard
          </Link>
          <span className="text-white/20">•</span>
          <Link href="/complaints/new" className="hover:text-coral transition-colors font-bold text-coral">
            Register Grievance ▸
          </Link>
        </div>
      </div>
    </div>
  );
}
