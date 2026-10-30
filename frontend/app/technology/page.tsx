"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { 
  GitMerge, 
  Building2, 
  FileText, 
  Globe, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Sliders, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Zap,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PrismLogo } from "@/components/ui/PrismLogo";

export default function TechnologyPage() {
  // Interactive Simulator state
  const [sliderId, setSliderId] = useState(100);
  const [sliderName, setSliderName] = useState(90);
  const [sliderGeo, setSliderGeo] = useState(100);
  const [sliderSemantic, setSliderSemantic] = useState(70);
  const [sliderTaxonomy, setSliderTaxonomy] = useState(85);
  const [sliderTime, setSliderTime] = useState(60);

  // Compute weighted score:
  // ID: 35%, Name: 20%, Geo: 15%, Semantic: 15%, Taxonomy: 10%, Time: 5%
  const totalScore = Math.round(
    (sliderId * 0.35) +
    (sliderName * 0.20) +
    (sliderGeo * 0.15) +
    (sliderSemantic * 0.15) +
    (sliderTaxonomy * 0.10) +
    (sliderTime * 0.05)
  );

  const getConfidenceTier = (score: number) => {
    if (score >= 80) return { label: "High Confidence (Tier 1)", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/40", action: "Immediate Cross-Bureau Alert Dispatched" };
    if (score >= 50) return { label: "Medium Confidence (Tier 2)", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/40", action: "Flagged for Dealing Officer Inspection" };
    return { label: "Low Confidence (Tier 3)", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/40", action: "Autonomous Filing as Independent Docket" };
  };

  const tier = getConfidenceTier(totalScore);

  const resetSimulator = () => {
    setSliderId(100);
    setSliderName(90);
    setSliderGeo(100);
    setSliderSemantic(70);
    setSliderTaxonomy(85);
    setSliderTime(60);
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-white flex flex-col selection:bg-coral selection:text-white">
      <PublicHeader />

      {/* 1. HERO SECTION (MONOLITHIC OBSIDIAN) */}
      <section className="relative overflow-hidden bg-[#080B14] text-white py-16 sm:py-24 px-4 sm:px-8">
        {/* Dynamic Refractive Glow Orbs matching Home Page */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-coral/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#5FE0D0]/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/15 text-[11px] font-mono uppercase tracking-wider text-white">
                <Cpu className="h-3.5 w-3.5 text-coral" />
                <span className="font-bold text-coral">CORE AI ARCHITECTURE</span>
                <span className="text-white/40">|</span>
                <span>Deterministic Multi-Vector Co-Reference</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white leading-[1.08]">
                AI Overlap Engine: <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral via-[#FF6F59] to-[#F28C28]">Eliminating Bureau Blindspots.</span>
              </h1>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
                How PRISM links grievances across AICTE bureaus—PGRC, Regulation, Academic, and Approvals—using deterministic 6-factor mathematical weighting to eliminate duplicated inquiries and prevent contradictory showcause notices.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                <Link
                  href="/overlaps"
                  className="btn-coral px-6 h-11 font-bold shadow-lg"
                >
                  <span>Test Live Overlaps Console</span>
                  <span className="btn-arrow">▸</span>
                </Link>
                <a
                  href="#simulator"
                  className="px-5 h-11 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold flex items-center gap-2 transition-colors"
                >
                  <Sliders className="h-4 w-4 text-coral" />
                  <span>Interactive Weight Simulator</span>
                </a>
              </div>
            </div>

            {/* Crystalline Prism Emblem Card */}
            <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-white/[0.03] border border-white/15 backdrop-blur-xl shrink-0 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <PrismLogo size={120} variant="icon" animated />
              <div className="mt-4 text-center">
                <span className="text-[10px] font-mono font-bold tracking-widest text-coral uppercase block">
                  OPTICAL CORE
                </span>
                <span className="text-xs text-white/80 font-bold block mt-0.5">
                  Multi-Bureau Refractor
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 6 FACTORS BREAKDOWN (MONOLITHIC OBSIDIAN TILES) */}
      <section className="bg-[#080B14] py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-coral uppercase tracking-widest">
            Mathematical Formulation
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            The 6-Factor Deterministic Model
          </h2>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
            Rather than relying on non-deterministic generative models that can hallucinate, PRISM applies exact weighted linear combination of six statutory signals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              weight: "35%",
              title: "AICTE Permanent ID Match",
              desc: "Matches the canonical technical institute code (e.g. 1-1234567890) across bureaus with absolute mathematical certainty.",
              icon: Building2,
              detail: "Direct foreign key indexing into AICTE central database. If exact match = 100%, otherwise 0%.",
            },
            {
              weight: "20%",
              title: "Fuzzy Institution Name",
              desc: "Levenshtein distance and phonetic soundex matching for abbreviation variations and branch campuses.",
              icon: FileText,
              detail: "Normalizes terms like 'Inst. of Tech.' vs 'Institute of Technology & Engineering'.",
            },
            {
              weight: "15%",
              title: "Geographic Co-location",
              desc: "Calculates spatial radius using state, district, pin code, and registered land survey numbers.",
              icon: Globe,
              detail: "Distinguishes between identically named colleges situated in different municipal zones.",
            },
            {
              weight: "15%",
              title: "Semantic Narrative Embedding",
              desc: "Dense vector embeddings measuring cosine similarity of grievance text and specific allegations.",
              icon: GitMerge,
              detail: "Identifies whether separate complainants describe identical events (e.g. non-refund of caution deposit).",
            },
            {
              weight: "10%",
              title: "Violation Taxonomy & Clause",
              desc: "Classification against the AICTE Approval Process Handbook (APH) clause library.",
              icon: Layers,
              detail: "Maps allegations to Chapter VI of the APH (Essential Requirements & Penal Actions).",
            },
            {
              weight: "5%",
              title: "Temporal Proximity Window",
              desc: "Evaluates the lodging date delta across the ongoing academic and admissions session.",
              icon: Clock,
              detail: "Higher weight if complaints are lodged within the same semester or inspection cycle (±60 days).",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-7 bg-white/[0.03] border border-white/10 space-y-4 hover:border-coral/50 transition-all shadow-md backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-coral">
                    {item.weight}
                  </span>
                  <Icon className="h-5 w-5 text-white/50" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-3 text-[11px] font-mono text-white/50">
                  {item.detail}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE SIMULATOR (MONOLITHIC OBSIDIAN CANVAS) */}
      <section id="simulator" className="bg-[#080B14] py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-coral uppercase tracking-widest">
                Interactive Lab
              </span>
              <h2 className="text-3xl font-display font-black text-white mt-1">
                Live Weight Computation Simulator
              </h2>
              <p className="text-xs text-white/60 mt-1 max-w-xl">
                Adjust the statutory factors below to observe how PRISM computes the overall match probability and categorizes confidence tiers.
              </p>
            </div>

            <button
              onClick={resetSimulator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white/70 font-mono transition-colors self-start md:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Values</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Controls */}
            <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 bg-white/[0.03] border border-white/10 space-y-5 sm:space-y-6 backdrop-blur-md">
              <h3 className="font-display font-bold text-base text-white pb-3 flex items-center justify-between">
                <span>Signal Strength Configuration</span>
                <span className="text-xs font-mono text-white/50">Simulated Inputs</span>
              </h3>

              {[
                { label: "1. AICTE Permanent ID Match (35%)", val: sliderId, set: setSliderId },
                { label: "2. Fuzzy Institution Name Similarity (20%)", val: sliderName, set: setSliderName },
                { label: "3. Geographic Co-Location (15%)", val: sliderGeo, set: setSliderGeo },
                { label: "4. Semantic Narrative Embedding (15%)", val: sliderSemantic, set: setSliderSemantic },
                { label: "5. Violation Taxonomy Overlap (10%)", val: sliderTaxonomy, set: setSliderTaxonomy },
                { label: "6. Temporal Window Proximity (5%)", val: sliderTime, set: setSliderTime },
              ].map((s, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono gap-2">
                    <span className="text-white/80 truncate">{s.label}</span>
                    <span className="text-coral font-bold shrink-0">{s.val}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={s.val}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="w-full accent-coral bg-white/10 h-1.5 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Right Score Output */}
            <div className="lg:col-span-5 p-5 sm:p-8 bg-white/[0.03] border border-white/15 flex flex-col items-center justify-center text-center space-y-5 backdrop-blur-md">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                Calculated Similarity Index
              </span>

              <div className="text-6xl font-display font-black text-white">
                {totalScore}<span className="text-coral text-3xl">%</span>
              </div>

              <div className={cn("px-4 py-2 border text-xs font-mono font-bold uppercase", tier.bg, tier.color, tier.border)}>
                {tier.label}
              </div>

              <div className="p-3 bg-white/5 border border-white/10 text-xs text-white/70 w-full space-y-1">
                <span className="text-[10px] font-mono uppercase text-white/50 block font-bold">
                  System Automated Action
                </span>
                <p className="text-white font-medium text-[11px]">
                  {tier.action}
                </p>
              </div>

              <Link
                href="/overlaps"
                className="btn-coral w-full text-xs text-center justify-center font-bold"
              >
                Inspect Matching Dossiers ▸
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. STATUTORY INDEPENDENCE NOTICE (MONOLITHIC OBSIDIAN CANVAS) */}
      <section className="bg-[#080B14] py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full text-center space-y-6">
        <div className="h-12 w-12 bg-coral/10 text-coral flex items-center justify-center mx-auto border border-coral/30">
          <ShieldCheck className="h-6 w-6" />
        </div>

        <h3 className="font-display font-black text-2xl text-white">
          Strict Non-Destructive Statutory Co-Reference
        </h3>

        <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
          PRISM does <strong className="text-white">not</strong> merge, delete, or override independent bureau records. Each case retains its statutory dealing officer, hearing schedule, and procedural independence while sharing verified evidentiary discoveries across bureaus.
        </p>

        <div className="pt-2 flex justify-center gap-4 text-xs font-bold">
          <Link href="/bureaus" className="text-coral hover:underline flex items-center gap-1">
            <span>Explore 5-Bureau Statutory Mandates</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
