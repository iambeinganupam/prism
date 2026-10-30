"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { RotatingPrism } from "@/components/ambient/RotatingPrism";
import { 
  Search, 
  ArrowRight, 
  GitMerge, 
  Building2, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Lock, 
  ChevronRight, 
  ExternalLink,
  Shield,
  Zap,
  Cpu,
  FileCheck,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [trackQuery, setTrackQuery] = useState("");

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      router.push(`/track?id=${encodeURIComponent(trackQuery.trim())}`);
    } else {
      router.push("/track");
    }
  };

  const sampleCases = [
    { id: "PGRC/2025/1023", label: "PGRC (Fee Issue)" },
    { id: "RB/2025/4487", label: "RB (Faculty Ratio)" },
    { id: "ACA/2025/7765", label: "ACA (Curriculum)" },
    { id: "APP/2025/9012", label: "APP (EoA Status)" },
  ];

  return (
    <div className="min-h-screen bg-[#080B14] text-white flex flex-col selection:bg-coral selection:text-white overflow-x-hidden">
      <PublicHeader />

      {/* 1. ULTRA-MODERN HERO SECTION (MONOLITHIC OBSIDIAN CANVAS) */}
      <section className="relative overflow-hidden bg-[#080B14] text-white pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Dynamic Refractive Glow Orbs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-coral/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#5FE0D0]/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-7"
            >
              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-black tracking-tight leading-[1.08] text-white">
                Institution-Centric Complaint <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral via-[#FF6F59] to-[#F28C28]">Intelligence.</span>
              </h1>

              {/* Lead Text */}
              <p className="text-xs sm:text-base text-white/70 leading-relaxed font-sans max-w-2xl">
                Unifying grievance handling across AICTE bureaus—<strong className="text-white">PGRC, Regulation, Academic, and Approvals</strong>. PRISM bridges isolated desks into an institutional memory to eliminate duplicate inquiries and conflicting notices.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="btn-coral text-xs sm:text-sm px-5 sm:px-7 h-11 sm:h-12 shadow-xl shadow-coral/30 font-bold w-full sm:w-auto text-center justify-center"
                >
                  <span>Launch Operations Console</span>
                  <span className="btn-arrow text-base">▸</span>
                </Link>

                <Link
                  href="/track"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 h-11 sm:h-12 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all backdrop-blur-md w-full sm:w-auto"
                >
                  <Search className="h-4 w-4 text-coral" />
                  <span>Public Citizen Tracking</span>
                </Link>

                <Link
                  href="/technology"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 h-11 sm:h-12 bg-transparent hover:bg-white/5 text-white/70 hover:text-white font-mono text-xs transition-colors w-full sm:w-auto"
                >
                  <Cpu className="h-4 w-4 text-[#5FE0D0]" />
                  <span>Explore AI Engine</span>
                </Link>
              </div>

              {/* Floating Stat Indicators */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 text-xs font-mono text-white/70">
                <div>
                  <span className="block text-xl font-display font-black text-white">1,248</span>
                  <span className="text-[10px] text-white/50 uppercase">Consolidated Dockets</span>
                </div>
                <div>
                  <span className="block text-xl font-display font-black text-coral">88%</span>
                  <span className="text-[10px] text-white/50 uppercase">Overlap Accuracy</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="block text-xl font-display font-black text-emerald-400">Zero</span>
                  <span className="text-[10px] text-white/50 uppercase">Duplicate Notices</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual: 3D Optical Prism with Glassmorphic Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-5 flex justify-center relative w-full"
            >
              <div className="relative w-full max-w-md bg-white/[0.03] border border-white/15 p-5 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
                
                {/* Tech Watermarks */}
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pb-4">
                  <span>SYS.REFRACTOR // MULTI-VECTOR</span>
                  <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CO-REFERENCE LIVE
                  </span>
                </div>

                {/* 3D Crystalline Prism Logo Core */}
                <div className="py-8 flex justify-center">
                  <RotatingPrism />
                </div>

                {/* Live Overlap Highlight Pill */}
                <div className="p-4 bg-white/5 border border-coral/40 space-y-2 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-coral font-bold uppercase flex items-center gap-1">
                      <GitMerge className="h-3.5 w-3.5" />
                      Cross-Bureau Co-Reference
                    </span>
                    <span className="text-emerald-400 font-bold">88% Match</span>
                  </div>
                  <div className="text-xs text-white font-bold truncate">
                    ABC Institute of Technology (1-1234567890)
                  </div>
                  <div className="text-[11px] text-white/60 font-sans flex items-center justify-between">
                    <span>PGRC/2025/1023 ↔ RB/2025/4487</span>
                    <Link href="/overlaps" className="text-coral hover:underline font-bold text-[10px] font-mono">
                      Review Link →
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. INSTANT DOCKET RADAR (MONOLITHIC OBSIDIAN CONTINUATION) */}
      <section className="bg-[#080B14] py-10 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-coral" />
              <h2 className="font-display font-black text-lg text-white">
                Instant Grievance Inquirer
              </h2>
            </div>
            <span className="text-xs font-mono text-white/50">
              Live status lookup without officer authentication
            </span>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="flex-1 relative flex items-center bg-white/[0.04] border border-white/15 focus-within:border-coral transition-colors">
              <Search className="h-5 w-5 text-white/40 ml-3 shrink-0" />
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="Enter Case Registration ID (e.g. PGRC/2025/1023) or Mobile Number..."
                className="w-full bg-transparent px-3 py-3 text-sm font-mono font-bold text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="btn-coral px-8 py-3 h-auto font-bold uppercase tracking-wider text-xs shadow-md"
            >
              <span>Inspect Status</span>
              <span className="btn-arrow">▸</span>
            </button>
          </form>

          {/* Quick Click Sample Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-white/50 pt-1">
            <span className="text-[11px] font-mono">Try sample cases:</span>
            {sampleCases.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setTrackQuery(sample.id);
                  router.push(`/track?id=${encodeURIComponent(sample.id)}`);
                }}
                className="font-mono text-[10px] px-2 py-0.5 bg-white/5 hover:bg-coral hover:text-white border border-white/10 transition-colors text-white/80"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID (MONOLITHIC OBSIDIAN WITH GLASSMORPHIC PANELS) */}
      <section className="bg-[#080B14] py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-coral uppercase tracking-widest">
            Modular Intelligence Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
            Designed for National Regulatory Scale
          </h2>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
            Explore dedicated modules addressing cross-bureau coordination, statutory mandates, reconciled metrics, and compliance safeguards.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: AI Overlap Engine (Wide) */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-7 p-5 sm:p-8 bg-white/[0.03] border border-white/10 hover:border-coral/50 space-y-6 relative overflow-hidden shadow-xl flex flex-col justify-between group backdrop-blur-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 font-mono font-bold text-[10px] bg-coral/10 text-coral border border-coral/30 uppercase">
                  Multi-Vector Radar
                </span>
                <Cpu className="h-6 w-6 text-coral" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                Deterministic 6-Factor AI Overlap Detection
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                Linear combination of AICTE Permanent IDs (35%), fuzzy institutional phonetics (20%), geographic co-location (15%), semantic narrative embeddings (15%), violation taxonomy (10%), and temporal proximity (5%).
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono font-bold text-emerald-400">
                88% Verified Confidence Tier
              </span>
              <Link
                href="/technology"
                className="btn-coral text-xs py-2 px-4 font-bold flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <span>Read Technology Whitepaper</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Bento Card 2: 5 Bureaus (Medium) */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-5 p-5 sm:p-8 bg-white/[0.03] border border-white/10 hover:border-blue-500/50 space-y-6 relative overflow-hidden shadow-xl flex flex-col justify-between group backdrop-blur-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 font-mono font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase">
                  Statutory Purview
                </span>
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                5 AICTE Bureaus Integrated
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                Preserves independent statutory hearing jurisdictions across PGRC, Regulation, Academic, Approvals, and 8 Regional Offices.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono font-bold text-white/50">
                1,248 Dockets Synchronized
              </span>
              <Link
                href="/bureaus"
                className="text-xs font-bold text-coral hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Explore Bureau Matrix</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Bento Card 3: Real-Time Metrics (Medium) */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-5 p-5 sm:p-8 bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 space-y-6 relative overflow-hidden shadow-xl flex flex-col justify-between group backdrop-blur-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 font-mono font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                  Live Indicators
                </span>
                <BarChart3 className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                Reconciled National Ledger
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                Continuous reconciliation of complaint velocity (4.8 days average), SLA countdowns, and institution risk concentration indices.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono font-bold text-white/50">
                54% Redressal Rate
              </span>
              <Link
                href="/metrics"
                className="text-xs font-bold text-coral hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Inspect National Metrics</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Bento Card 4: Security & Compliance (Wide) */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-7 p-5 sm:p-8 bg-white/[0.03] border border-white/10 hover:border-purple-500/50 space-y-6 relative overflow-hidden shadow-xl flex flex-col justify-between group backdrop-blur-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 font-mono font-bold text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase">
                  Statutory Safeguards
                </span>
                <ShieldCheck className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                DPDP Act 2023 &amp; Cryptographic Ledger
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                Full complainant anonymization protecting whistleblowers from college retaliation, paired with SHA-256 immutable audit logging and granular Role-Based Access Control.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono font-bold text-emerald-400">
                100% Audit Immutability
              </span>
              <Link
                href="/compliance"
                className="btn-coral text-xs py-2 px-4 font-bold flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <span>Review Compliance Protocols</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. PROCEDURAL PIPELINE (MONOLITHIC OBSIDIAN TILES) */}
      <section className="bg-[#080B14] py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-coral uppercase tracking-widest">
              End-to-End Workflow
            </span>
            <h2 className="text-3xl font-display font-black text-white">
              The PRISM Redressal Pipeline
            </h2>
            <p className="text-xs text-white/60">
              How a single grievance transforms into institutional memory across AICTE.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Grievance Intake",
                desc: "Lodged via public citizen portal or institution filing with AICTE Permanent ID resolution.",
                icon: FileCheck,
              },
              {
                step: "02",
                title: "Semantic Vectorization",
                desc: "Narrative embeddings and handbook taxonomy mapping executed with zero personal exposure.",
                icon: Cpu,
              },
              {
                step: "03",
                title: "Co-Reference Radar",
                desc: "6-factor algorithm detects parallel inquiries across Regulation Bureau and PGRC.",
                icon: GitMerge,
              },
              {
                step: "04",
                title: "Unified Adjudication",
                desc: "Dealing officers coordinate evidence while preserving statutory independence.",
                icon: ShieldCheck,
              },
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-6 bg-white/[0.03] border border-white/10 space-y-3 relative shadow-md backdrop-blur-md">
                  <span className="font-mono text-2xl font-black text-coral/40 block">
                    {p.step}
                  </span>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-coral" />
                    <h4 className="font-display font-bold text-base text-white">
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-sans">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION STRIP (MONOLITHIC OBSIDIAN WITH GLASSMORPHIC CARD) */}
      <section className="bg-[#080B14] py-20 px-4 sm:px-8 relative overflow-hidden">
        {/* Subtle ambient light aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-coral/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto p-10 sm:p-14 bg-white/[0.03] border border-white/15 backdrop-blur-xl text-center space-y-6 relative z-10 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white">
            Ready to experience the PRISM platform?
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            Explore live AI duplicate resolution, cross-bureau institutional dossiers, and public citizen tracking.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <Link
              href="/dashboard"
              className="btn-coral px-8 py-3.5 font-bold text-xs uppercase tracking-wider shadow-xl"
            >
              Access Operations Console ▸
            </Link>
            <Link
              href="/track"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/25 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg backdrop-blur-md"
            >
              Public Citizen Track
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
