"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PrismLogo } from "@/components/ui/PrismLogo";
import { 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Clock, 
  Cpu, 
  Building2, 
  BarChart3, 
  Lock, 
  FileCheck, 
  ArrowUp, 
  Sparkles,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Layers,
  Radio
} from "lucide-react";
import { format } from "date-fns";

export const PublicFooter: React.FC = () => {
  const router = useRouter();
  const [footerSearch, setFooterSearch] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(format(now, "hh:mm:ss a 'IST' · dd MMM yyyy"));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFooterTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (footerSearch.trim()) {
      router.push(`/track?id=${encodeURIComponent(footerSearch.trim())}`);
    } else {
      router.push("/track");
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#080B14] text-white/80 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-20 right-10 w-[500px] h-[350px] bg-coral/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[300px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* 2. TOP INTERACTIVE SECTION: TELEMETRY & INSTANT DOCKET SEARCH CAPSULE */}
      <div className="bg-[#080B14] px-4 sm:px-8 py-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Quick Docket Inquirer input */}
          <div className="max-w-xl w-full space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-coral animate-ping" />
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-white">
                Instant Grievance Inquirer
              </span>
              <span className="text-[10px] text-white/40 font-mono">· Zero Login Required</span>
            </div>
            
            <form onSubmit={handleFooterTrack} className="flex items-stretch gap-2">
              <div className="relative flex-1 flex items-center bg-white/5 border border-white/15 focus-within:border-coral transition-colors">
                <Search className="h-4 w-4 text-white/40 ml-3 shrink-0" />
                <input
                  type="text"
                  value={footerSearch}
                  onChange={(e) => setFooterSearch(e.target.value)}
                  placeholder="Enter Case Registration ID (e.g. PGRC/2025/1023)..."
                  className="w-full bg-transparent px-3 py-2.5 text-xs font-mono font-bold text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="btn-coral px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0"
              >
                <span>Inspect</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </form>
          </div>

          {/* Council Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 bg-white/5 border border-white/10">
              <div className="text-lg font-display font-black text-white">1,248</div>
              <div className="text-[10px] font-mono text-white/50 uppercase">Dockets Synced</div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10">
              <div className="text-lg font-display font-black text-coral">88%</div>
              <div className="text-[10px] font-mono text-white/50 uppercase">Overlap Accuracy</div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10">
              <div className="text-lg font-display font-black text-emerald-400">24ms</div>
              <div className="text-[10px] font-mono text-white/50 uppercase">Co-Reference Speed</div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10">
              <div className="text-lg font-display font-black text-cyan-400">100%</div>
              <div className="text-[10px] font-mono text-white/50 uppercase">DPDP Encrypted</div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. STRUCTURED 4-COLUMN FOOTER DIRECTORY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Col 1: Brand & Statutory Authority (Wide) */}
        <div className="lg:col-span-4 space-y-5">
          <Link href="/" className="flex items-center gap-3 group">
            <PrismLogo size="lg" variant="icon" animated />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl text-white group-hover:text-coral transition-colors tracking-tight">
                  PRISM<span className="text-coral">.</span>
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-coral text-white uppercase tracking-wider">
                  AICTE
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-white/50">
                Integrated Institution Intelligence
              </span>
            </div>
          </Link>

          <p className="text-xs text-white/60 leading-relaxed font-sans max-w-sm">
            AI-Powered Centralized Grievance Intelligence Dashboard for the <strong className="text-white">All India Council for Technical Education (AICTE)</strong>, unifying disparate grievance streams into an immutable institutional memory.
          </p>

          <div className="p-3.5 bg-white/5 border border-white/10 space-y-2 text-[11px] font-mono text-white/60">
            <div className="text-white font-bold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-coral" />
              <span>Independent Platform Launch</span>
            </div>
            <div className="text-white/80">
              Personal Innovation Project · AICTE Intelligence
            </div>
            <div className="text-[10px] text-white/40">
              Autonomous Grievance Co-Reference System
            </div>
          </div>

          <div className="text-xs text-white/50 space-y-1.5 font-sans">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-coral shrink-0" />
              <span>Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-coral shrink-0" />
              <span>complaint-monitoring@aicte-india.org</span>
            </div>
          </div>
        </div>

        {/* Col 2: Architecture & Intelligence */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white">
            <Cpu className="h-4 w-4 text-coral" />
            <span>Architecture &amp; Engine</span>
          </div>

          <ul className="space-y-2.5 text-xs text-white/60">
            <li>
              <Link href="/technology" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                <span>AI Overlap Engine (6-Factor)</span>
              </Link>
            </li>
            <li>
              <Link href="/bureaus" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                <span>5-Bureau Statutory Architecture</span>
              </Link>
            </li>
            <li>
              <Link href="/metrics" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                <span>National Reconciled Ledger</span>
              </Link>
            </li>
            <li>
              <Link href="/compliance" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                <span>DPDP Act 2023 &amp; IT Act 2000</span>
              </Link>
            </li>
            <li>
              <Link href="/overlaps" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                <span>Live Co-Reference Radar</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Public Portals & Citizen Services */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white">
            <Building2 className="h-4 w-4 text-emerald-400" />
            <span>Portals &amp; Citizens</span>
          </div>

          <ul className="space-y-2.5 text-xs text-white/60">
            <li>
              <Link href="/track" className="text-coral hover:text-coral-hover font-bold flex items-center gap-1.5 group">
                <span className="h-1.5 w-1.5 rounded-full bg-coral animate-ping" />
                <span>Track Grievance (Citizen Portal)</span>
              </Link>
            </li>
            <li>
              <Link href="/complaints/new" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                <span>Lodge New Grievance</span>
              </Link>
            </li>
            <li>
              <Link href="/institutions" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                <span>Institution Compliance Registry</span>
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                <span>Officer Authentication (Sign In)</span>
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                <span>Register Authorized Account</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Statutory Legal & Platform Governance */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Governance</span>
          </div>

          <p className="text-xs text-white/60 leading-relaxed font-sans">
            Strictly conforms with AICTE Approval Process Handbook (APH) Clause 6.4 and Gazette No. F.No.1-101/PGRC/2019.
          </p>

          <div className="pt-1">
            <Link
              href="/dashboard"
              className="btn-coral text-xs py-2 px-3.5 font-bold w-full justify-center flex items-center gap-1.5 shadow-sm"
            >
              <span>Operations Console</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="pt-2 text-[10px] font-mono text-white/40">
            Designed &amp; Developed as an <strong>Independent Personal Launch</strong>.
          </div>
        </div>

      </div>

      {/* 4. BOTTOM BAR WITH TRICOLOUR, CLOCK & SCROLL TO TOP */}
      <div className="bg-[#080B14] px-4 sm:px-8 py-5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          
          {/* Left: Indian Tricolour Badge & Copyright */}
          <div className="flex items-center gap-3">
            <div className="inline-flex h-3 w-4.5 border border-white/20 overflow-hidden shrink-0 shadow-xs">
              <div className="w-full h-1/3 bg-[#FF9933]" />
              <div className="w-full h-1/3 bg-white flex items-center justify-center">
                <div className="h-0.5 w-0.5 rounded-full bg-[#000080]" />
              </div>
              <div className="w-full h-1/3 bg-[#138808]" />
            </div>
            <span className="text-[11px] font-sans">
              © 2026 AICTE PRISM · All India Council for Technical Education. All rights reserved.
            </span>
          </div>

          {/* Center / Right: Live Clock & Scroll to Top */}
          <div className="flex items-center gap-4">
            {currentTime && (
              <div className="hidden md:flex items-center gap-1.5 font-mono text-[10px] text-white/40">
                <Clock className="h-3 w-3 text-coral" />
                <span>{currentTime}</span>
              </div>
            )}

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-coral hover:text-white border border-white/15 text-white/70 text-xs font-mono uppercase tracking-wider transition-all group"
              title="Smooth Scroll to Top"
            >
              <span>Top</span>
              <ArrowUp className="h-3 w-3 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
