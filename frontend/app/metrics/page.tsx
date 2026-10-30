"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { 
  BarChart3, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  GitMerge, 
  Download, 
  Building2, 
  ArrowRight, 
  ShieldCheck,
  TrendingUp,
  Server
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PrismLogo } from "@/components/ui/PrismLogo";

export default function MetricsPage() {
  const bureauData = [
    { name: "PGRC (Student Welfare)", count: 542, fill: "#3B82F6" },
    { name: "RB (Regulation)", count: 318, fill: "#EF4444" },
    { name: "ACA (Academic)", count: 215, fill: "#A855F7" },
    { name: "APP (Approvals)", count: 128, fill: "#F59E0B" },
    { name: "RO (Regional Field)", count: 45, fill: "#14B8A6" },
  ];

  const stageData = [
    { stage: "Received", count: 186, fill: "#3B82F6" },
    { stage: "Screening", count: 140, fill: "#14B8A6" },
    { stage: "Under Review", count: 215, fill: "#F59E0B" },
    { stage: "Action Required", count: 125, fill: "#EF4444" },
    { stage: "Resolved", count: 420, fill: "#10B981" },
    { stage: "Closed", count: 162, fill: "#64748B" },
  ];

  const leaderboard = [
    { name: "ABC Institute of Technology", aicteId: "1-1234567890", instId: "inst-1", cases: 9, open: 3, risk: 84, overlap: true },
    { name: "Chennai Technical Academy", aicteId: "1-7719284901", instId: "inst-7", cases: 8, open: 3, risk: 79, overlap: true },
    { name: "XYZ College of Engineering", aicteId: "1-2948571029", instId: "inst-2", cases: 7, open: 2, risk: 78, overlap: true },
    { name: "Bhopal Central Institute", aicteId: "1-1029384756", instId: "inst-10", cases: 6, open: 2, risk: 73, overlap: true },
    { name: "LMN Institute of Management", aicteId: "1-3829104820", instId: "inst-3", cases: 5, open: 2, risk: 71, overlap: true },
  ];

  const handleExport = () => {
    toast.success("National metrics summary exported successfully.");
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-white flex flex-col selection:bg-coral selection:text-white">
      <PublicHeader />

      {/* 1. HERO (MONOLITHIC OBSIDIAN CANVAS) */}
      <section className="relative overflow-hidden bg-[#080B14] text-white py-16 sm:py-24 px-4 sm:px-8">
        {/* Dynamic Refractive Glow Orbs matching Home Page */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-coral/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#5FE0D0]/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/15 text-[11px] font-mono uppercase tracking-wider text-white">
                <Activity className="h-3.5 w-3.5 text-coral" />
                <span className="font-bold text-coral">NATIONAL LEDGER RECONCILIATION</span>
                <span className="text-white/40">|</span>
                <span>Real-Time Ingestion Sync</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white leading-[1.08]">
                National Metrics: <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral via-[#FF6F59] to-[#F28C28]">Real-Time Operational Indicators.</span>
              </h1>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
                Consolidated cross-bureau data stream delivering unified intelligence on institutional complaint volume, resolution velocity, overdue escalations, and AI co-reference accuracy across technical institutions.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                <Link
                  href="/dashboard"
                  className="btn-coral px-6 h-11 font-bold shadow-lg"
                >
                  <span>Launch Master Dashboard</span>
                  <span className="btn-arrow">▸</span>
                </Link>
                <Link
                  href="/analytics"
                  className="px-5 h-11 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold flex items-center gap-2 transition-colors"
                >
                  <BarChart3 className="h-4 w-4 text-coral" />
                  <span>Full Analytics Intelligence Suite</span>
                </Link>
              </div>
            </div>

            {/* Crystalline Prism Emblem Card */}
            <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-white/[0.03] border border-white/15 backdrop-blur-xl shrink-0 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <PrismLogo size={120} variant="icon" animated />
              <div className="mt-4 text-center">
                <span className="text-[10px] font-mono font-bold tracking-widest text-coral uppercase block">
                  NATIONAL RECONCILIATION
                </span>
                <span className="text-xs text-white/80 font-bold block mt-0.5">
                  Real-Time SLA Engine
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 PRIMARY HEADLINE KPIS (MONOLITHIC OBSIDIAN TILES) */}
      <section className="bg-[#080B14] py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "Total Consolidated Dockets", value: "1,248", sub: "Aggregated Across 5 Bureaus", color: "text-white" },
            { label: "Active Inquiries In-Progress", value: "426", sub: "Adjudication Countdown Active", color: "text-blue-400" },
            { label: "Disposed Grievances", value: "672", sub: "54% Cumulative Resolution Rate", color: "text-emerald-400" },
            { label: "Overdue / SLA Breached", value: "150", sub: "Immediate Apex Escalation", color: "text-red-400" },
          ].map((kpi, idx) => (
            <div key={idx} className="p-4 sm:p-6 bg-white/[0.03] border border-white/10 space-y-2 relative shadow-md backdrop-blur-md">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block font-bold">
                {kpi.label}
              </span>
              <div className={cn("text-3xl sm:text-4xl font-display font-black", kpi.color)}>
                {kpi.value}
              </div>
              <p className="text-[11px] text-white/60 font-sans">
                {kpi.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CHARTS ROW (MONOLITHIC OBSIDIAN SURFACES) */}
      <section className="bg-[#080B14] py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Bureau Distribution Chart */}
        <div className="lg:col-span-6 bg-white/[0.03] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
          <div className="space-y-1">
            <h3 className="font-display font-black text-xl text-white">
              Bureau Caseload Distribution
            </h3>
            <p className="text-xs text-white/60">
              Live breakdown of active inquiries across AICTE regulatory divisions.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bureauData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {bureauData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: "#0C0F1D", borderColor: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {bureauData.map((b) => (
              <div key={b.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: b.fill }} />
                <span className="text-white/60 truncate">{b.name}:</span>
                <span className="font-bold text-white">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Funnel Bar Chart */}
        <div className="lg:col-span-6 bg-white/[0.03] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
          <div className="space-y-1">
            <h3 className="font-display font-black text-xl text-white">
              Statutory Stage Distribution
            </h3>
            <p className="text-xs text-white/60">
              Volume of complaints residing in each procedural adjudication stage.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#9AA0B5" }} stroke="rgba(255,255,255,0.2)" />
                <YAxis tick={{ fontSize: 10, fill: "#9AA0B5" }} stroke="rgba(255,255,255,0.2)" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: "#0C0F1D", borderColor: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {stageData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-white/60">Average Disposal Velocity:</span>
            <span className="font-bold text-emerald-400 font-sans">4.8 Days per Stage</span>
          </div>
        </div>

      </section>

      {/* 4. INSTITUTION CONCENTRATION LEADERBOARD (MONOLITHIC OBSIDIAN TABLE) */}
      <section className="bg-[#080B14] py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-black text-2xl text-white">
              Top Institution Grievance Concentration
            </h3>
            <p className="text-xs text-white/60 mt-1">
              Colleges with highest multi-bureau caseload density and active overlap flags.
            </p>
          </div>
          <Link
            href="/institutions"
            className="text-xs font-bold text-coral hover:underline flex items-center gap-1"
          >
            <span>View all 15 technical institutions in registry</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="bg-white/[0.03] border border-white/10 overflow-x-auto shadow-xl backdrop-blur-md">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-white/5 text-white/80 uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="p-3.5">Rank</th>
                <th className="p-3.5">Technical Institute Name</th>
                <th className="p-3.5 font-mono">AICTE Permanent ID</th>
                <th className="p-3.5">Total Cases</th>
                <th className="p-3.5">Active Inquiries</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Overlap Status</th>
                <th className="p-3.5 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.map((inst, idx) => (
                <tr key={inst.aicteId} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-coral">#{idx + 1}</td>
                  <td className="p-3.5 font-bold text-white">{inst.name}</td>
                  <td className="p-3.5 font-mono text-white/50">{inst.aicteId}</td>
                  <td className="p-3.5 font-bold text-white font-mono">{inst.cases} Cases</td>
                  <td className="p-3.5 font-mono text-red-400 font-bold">{inst.open} Open</td>
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-xs text-white">{inst.risk}/100</span>
                  </td>
                  <td className="p-3.5">
                    {inst.overlap ? (
                      <span className="px-2 py-0.5 bg-coral text-white font-mono font-bold text-[10px]">
                        Flagged Overlap
                      </span>
                    ) : (
                      <span className="text-white/40 text-[11px]">Independent</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      href={`/institutions/${inst.instId}`}
                      className="text-coral hover:underline font-bold"
                    >
                      Inspect Profile →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
