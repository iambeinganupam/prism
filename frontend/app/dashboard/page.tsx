"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { prismApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { DashboardMetrics, Case, BureauCode } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BureauChip } from "@/components/ui/BureauChip";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { toast } from "sonner";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid
} from "recharts";
import { 
  Folders, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  GitMerge, 
  PlusCircle, 
  Calendar, 
  Users,
  Timer,
  RefreshCw,
  Download,
  ArrowRight,
  ArrowLeft,
  Home,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  ShieldCheck,
  ChevronRight,
  Radio,
  Building2,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters state
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [bureauFilter, setBureauFilter] = useState<string>("ALL");
  const [todayStr, setTodayStr] = useState("Tuesday, 28 October 2026");

  const loadDashboardData = async () => {
    try {
      const [m, c] = await Promise.all([
        prismApi.getDashboardMetrics(),
        prismApi.getCases({
          bureau: bureauFilter !== "ALL" ? bureauFilter : undefined,
        }),
      ]);
      setMetrics(m);
      setCases(c);
    } catch (err) {
      console.error("Dashboard fetch error", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    setTodayStr(format(new Date(), "EEEE, dd MMMM yyyy"));
  }, [bureauFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    toast.info("Refreshing operational intelligence...");
    loadDashboardData();
  };

  const handleExportSummary = () => {
    if (!metrics) return;
    const summaryData = [
      { Metric: "Total Complaints Catalogued", Value: metrics.totalCases },
      { Metric: "Open Backlog", Value: 576 },
      { Metric: "Under Review / Process", Value: metrics.underReviewCases || 186 },
      { Metric: "Overdue Complaints (SLA Breached)", Value: metrics.overdueCases },
      { Metric: "Potential Overlaps Flagged", Value: metrics.potentialOverlapsCount || 18 },
      { Metric: "Resolved & Disposed", Value: metrics.disposedCases },
    ];
    prismApi.exportToCsv(summaryData, `PRISM_Operations_Summary_${format(new Date(), "yyyy-MM-dd")}`);
    toast.success("Dashboard operational ledger exported to CSV");
  };

  if (loading || !metrics) {
    return (
      <div className="space-y-8 pb-16 min-h-screen bg-[#080B14] p-4 sm:p-8">
        <div className="h-16 w-1/3 bg-white/[0.04] rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-white/[0.03] border border-white/[0.06] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Filtered operational lists
  const overdueCases = cases.filter((c) => c.status === "OVERDUE" || c.daysRemaining < 0).slice(0, 5);
  const recentCases = cases.slice(0, 6);
  const pendingOverlapCases = cases.filter((c) => c.hasOverlap).slice(0, 4);

  // Bureau Colors for Charts
  const bureauColors: Record<string, string> = {
    PGRC: "#3B82F6",
    RB: "#EF4444",
    ACA: "#8B5CF6",
    APP: "#F59E0B",
    RO: "#10B981",
    OTH: "#64748B",
  };

  const bureauChartData = metrics.bureauDistribution.map((item) => ({
    ...item,
    chartColor: bureauColors[item.bureau] || "#3B82F6",
  }));

  const stageBreakdown = [
    { stage: "Received", count: 186, fill: "#3B82F6" },
    { stage: "Screening", count: 140, fill: "#06B6D4" },
    { stage: "In Review", count: 215, fill: "#F59E0B" },
    { stage: "Action Req", count: 125, fill: "#EF4444" },
    { stage: "Resolved", count: 420, fill: "#10B981" },
    { stage: "Closed", count: 162, fill: "#64748B" },
  ];

  const priorityBreakdown = [
    { name: "Critical", count: 168, fill: "#EF4444" },
    { name: "High", count: 412, fill: "#F97316" },
    { name: "Medium", count: 520, fill: "#3B82F6" },
    { name: "Low", count: 148, fill: "#64748B" },
  ];

  return (
    <div className="space-y-8 pb-20 relative bg-[#080B14] text-white min-h-screen">
      {/* Background Refractive Glows */}
      <div className="absolute top-10 right-10 w-[500px] h-[350px] bg-coral/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-10 w-[450px] h-[350px] bg-[#5FE0D0]/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* 1. TOP UTILITY BREADCRUMB & RETURN ACTION STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        <button
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-coral/50 text-white/80 hover:text-white font-mono text-[11px] font-bold transition-all group shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-coral" />
          <span>Previous Screen</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-coral/50 text-white/70 hover:text-coral font-mono text-[11px] font-bold transition-all group shadow-sm"
        >
          <Home className="h-3.5 w-3.5 text-coral" />
          <span>Exit Console to Public Portal</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 2. COMMAND HEADER: TITLE, TELEMETRY & FILTER CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Operations Center
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>SYS.NOMINAL</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-white/60 font-sans max-w-2xl leading-relaxed">
            Integrated institution complaint monitoring, autonomous cross-bureau co-reference, and real-time SLA metrics across AICTE.
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs w-full lg:w-auto">
          {/* Live Date Chip */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white/70 font-mono text-[11px]">
            <Calendar className="h-3.5 w-3.5 text-coral" />
            <span className="font-bold text-white/90">{todayStr}</span>
          </div>

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#0E1322] border border-white/10 text-xs font-sans text-white focus:border-coral outline-none cursor-pointer transition-colors"
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 6 Months">Last 6 Months (FY 2025-26)</option>
            <option value="All Time">All Time</option>
          </select>

          {/* Bureau Filter Selector */}
          <select
            value={bureauFilter}
            onChange={(e) => setBureauFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#0E1322] border border-white/10 text-xs font-sans text-white focus:border-coral outline-none cursor-pointer transition-colors"
          >
            <option value="ALL">All Bureaus (Consolidated)</option>
            <option value="PGRC">Public Grievance Redressal (PGRC)</option>
            <option value="RB">Regulation Bureau (RB)</option>
            <option value="ACA">Academic Bureau (ACA)</option>
            <option value="APP">Approval Bureau (APP)</option>
            <option value="RO">Regional Offices (RO)</option>
          </select>

          {/* Button Cluster */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white transition-all shadow-sm"
              title="Refresh operational metrics"
              aria-label="Refresh operational metrics"
            >
              <RefreshCw className={cn("h-4 w-4 text-white/70", refreshing && "animate-spin text-coral")} />
            </button>

            <button
              onClick={handleExportSummary}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-white transition-all shadow-sm"
              title="Export operational summary to CSV"
            >
              <Download className="h-3.5 w-3.5 text-coral" />
              <span>Export</span>
            </button>

            <Link
              href="/complaints/new"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-coral hover:bg-coral-hover text-white text-xs font-bold transition-all shadow-md shadow-coral/30 hover:shadow-coral/50"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Intake</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. AI CO-REFERENCE SPOTLIGHT COMMAND BAR */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl bg-gradient-to-r from-coral/15 via-[#0E1322] to-[#5FE0D0]/10 border border-coral/30 p-5 sm:p-6 shadow-2xl overflow-hidden backdrop-blur-xl group"
      >
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-coral/30 via-transparent to-[#5FE0D0]/20 opacity-40 blur-xs pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-coral/20 border border-coral/40 text-coral flex items-center justify-center shrink-0 shadow-lg shadow-coral/20">
              <GitMerge className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-display font-black text-lg text-white">
                  Multi-Bureau Co-Reference Engine
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-coral text-white uppercase tracking-wider animate-pulse">
                  {metrics.potentialOverlapsCount || 18} Active Pairs
                </span>
                <span className="text-[11px] font-mono text-white/50 hidden sm:inline">
                  · High Confidence (≥80%)
                </span>
              </div>
              <p className="text-xs text-white/70 font-sans max-w-2xl leading-relaxed">
                Autonomous vector correlation flagged concurrent grievances across PGRC and Regulation for identical institutions, preventing duplicate hearings and conflicting statutory notices.
              </p>
            </div>
          </div>

          <Link
            href="/overlaps"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-coral hover:bg-coral-hover text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-coral/30 hover:shadow-coral/50 shrink-0 self-start md:self-auto group/btn"
          >
            <Sparkles className="h-4 w-4" />
            <span>Launch Overlap Studio</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </motion.div>

      {/* 4. SIX RECONCILED OPERATIONAL BENTO KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* KPI 1: Total Catalogued */}
        <div
          onClick={() => router.push("/complaints?status=ALL")}
          className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-blue-500/50 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />
          
          <div className="flex items-center justify-between text-xs text-white/60 mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[11px]">Total Catalogued</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <Folders className="h-4 w-4" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-display text-white tabular-nums">
              {metrics.totalCases.toLocaleString()}
            </div>
            <p className="text-[11px] text-white/50 font-sans">Active AICTE institutional repository</p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06] text-xs">
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +12.4% MoM
            </span>
            <span className="text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* KPI 2: Active Backlog */}
        <div
          onClick={() => router.push("/complaints?status=PENDING")}
          className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-amber-500/50 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
          
          <div className="flex items-center justify-between text-xs text-white/60 mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[11px]">Active Queue Backlog</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-display text-amber-400 tabular-nums">
              576
            </div>
            <p className="text-[11px] text-white/50 font-sans">426 Pending triage + 150 Overdue</p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06] text-xs">
            <span className="text-amber-400 font-mono font-bold">In-Triage Pipeline</span>
            <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>Filter Open</span>
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* KPI 3: Under Review */}
        <div
          onClick={() => router.push("/complaints?status=UNDER_PROCESS")}
          className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-purple-500/50 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />
          
          <div className="flex items-center justify-between text-xs text-white/60 mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[11px]">Under Review &amp; Notice</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <Timer className="h-4 w-4" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-display text-white tabular-nums">
              {metrics.underReviewCases || 186}
            </div>
            <p className="text-[11px] text-white/50 font-sans">Notice issued; awaiting institute response</p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06] text-xs">
            <span className="text-purple-400 font-mono font-bold">Active Hearings</span>
            <span className="text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>View Queue</span>
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* KPI 4: Overdue Cases (SLA Breached) */}
        <div
          onClick={() => router.push("/complaints?status=OVERDUE")}
          className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-red-500/30 hover:border-red-500 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/20 transition-all" />
          
          <div className="flex items-center justify-between text-xs text-white/60 mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[11px] text-red-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              SLA Breached (Overdue)
            </span>
            <div className="p-2 rounded-xl bg-red-500/15 text-red-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-display text-red-400 tabular-nums">
              {metrics.overdueCases}
            </div>
            <p className="text-[11px] text-red-300/60 font-sans">Statutory 30-day timeline exceeded</p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06] text-xs">
            <span className="text-red-400 font-mono font-bold">Urgent Escalation</span>
            <span className="text-red-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>Escalate</span>
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* KPI 5: Potential Overlaps */}
        <div
          onClick={() => router.push("/overlaps")}
          className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-coral/30 hover:border-coral cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-coral/10 rounded-full blur-2xl pointer-events-none group-hover:bg-coral/20 transition-all" />
          
          <div className="flex items-center justify-between text-xs text-white/60 mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[11px] text-coral">
              Cross-Bureau Overlaps
            </span>
            <div className="p-2 rounded-xl bg-coral/15 text-coral group-hover:scale-110 transition-transform">
              <GitMerge className="h-4 w-4" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-display text-coral tabular-nums">
              {metrics.potentialOverlapsCount || 18}
            </div>
            <p className="text-[11px] text-white/50 font-sans">Multi-vector AI similarity pairs</p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06] text-xs">
            <span className="text-coral font-mono font-bold">≥80% High Match</span>
            <span className="text-coral font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>Review Pairs</span>
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* KPI 6: Resolved & Disposed */}
        <div
          onClick={() => router.push("/complaints?status=DISPOSED")}
          className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-emerald-500/50 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
          
          <div className="flex items-center justify-between text-xs text-white/60 mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[11px] text-emerald-400">
              Resolved &amp; Closed
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-display text-emerald-400 tabular-nums">
              {metrics.disposedCases}
            </div>
            <p className="text-[11px] text-white/50 font-sans">Complete statutory disposal ratio: 53.8%</p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06] text-xs">
            <span className="text-emerald-400 font-mono font-bold">53.8% Disposal</span>
            <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>Inspect</span>
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

      </div>

      {/* 5. VISUAL INTELLIGENCE CHARTS (2X2 GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Donut Distribution (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-coral block">
                  Jurisdiction Distribution
                </span>
                <h3 className="font-display font-bold text-base text-white">
                  Complaints by Bureau / Cell
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-white/80">
                1,248 Total
              </span>
            </div>

            <div className="h-64 w-full relative flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip
                    formatter={(val: any, name: any) => [`${val} cases`, name]}
                    contentStyle={{ 
                      backgroundColor: "#080B14", 
                      color: "#fff", 
                      fontSize: 12, 
                      borderRadius: 12, 
                      borderColor: "rgba(255,255,255,0.15)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                    }}
                  />
                  <Pie
                    data={bureauChartData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={96}
                    paddingAngle={3}
                  >
                    {bureauChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.chartColor} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-display font-black text-3xl text-white leading-none">1,248</span>
                <span className="text-[10px] uppercase font-mono font-bold text-white/50 mt-1">Dockets</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/[0.08]">
            {bureauChartData.map((item) => (
              <div
                key={item.bureau}
                onClick={() => router.push(`/complaints?bureau=${item.bureau}`)}
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/20 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.chartColor }} />
                  <span className="font-bold text-white text-xs truncate">{item.bureau}</span>
                </div>
                <span className="font-mono text-white/60 text-xs font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Intake Velocity Stream (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-coral block">
                  Historical Intake Velocity
                </span>
                <h3 className="font-display font-bold text-base text-white">
                  Monthly Volume Stream (Ingested vs Disposed)
                </h3>
              </div>
              
              <div className="flex items-center gap-3 text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="h-2 w-2 bg-blue-500 rounded-full" /> Ingested
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full" /> Disposed
                </span>
              </div>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashRec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="dashDisp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.6)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.6)" }} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: "#080B14", 
                      color: "#fff", 
                      fontSize: 12, 
                      borderRadius: 12, 
                      borderColor: "rgba(255,255,255,0.15)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                    }} 
                  />
                  <Area type="monotone" dataKey="received" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#dashRec)" name="Ingested" />
                  <Area type="monotone" dataKey="disposed" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#dashDisp)" name="Disposed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] text-xs text-white/60 flex items-center justify-between font-mono">
            <span>Average Redressal Velocity: <strong className="text-white">18.4 Days</strong></span>
            <span className="text-emerald-400 font-bold">53.8% Overall Resolution Rate</span>
          </div>
        </div>

        {/* Chart 3: Workflow Pipeline Stages (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 shadow-xl">
          <div className="pb-4 border-b border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-coral block">
                Active Funnel
              </span>
              <h3 className="font-display font-bold text-base text-white">
                Complaints by Workflow Stage
              </h3>
            </div>
            <span className="text-[10px] font-mono text-white/50">Statutory Pipeline</span>
          </div>

          <div className="h-60 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageBreakdown} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.6)" }} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.6)" }} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: "#080B14", 
                    color: "#fff", 
                    fontSize: 12, 
                    borderRadius: 12, 
                    borderColor: "rgba(255,255,255,0.15)"
                  }} 
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stageBreakdown.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Priority & Urgency Tiers (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 shadow-xl">
          <div className="pb-4 border-b border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-coral block">
                Urgency Tiers
              </span>
              <h3 className="font-display font-bold text-base text-white">
                Complaint Priority Distribution
              </h3>
            </div>
            <span className="text-[10px] font-mono text-white/50">Statutory Impact</span>
          </div>

          <div className="h-60 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityBreakdown} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.6)" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.8)" }} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: "#080B14", 
                    color: "#fff", 
                    fontSize: 12, 
                    borderRadius: 12, 
                    borderColor: "rgba(255,255,255,0.15)"
                  }} 
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {priorityBreakdown.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 6. OPERATIONAL LEDGER & ACTION PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Panel 1: SLA Overdue Cases (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-white/[0.03] border border-red-500/25 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-white">
                SLA Breached Cases (Immediate Action)
              </h3>
            </div>
            <Link href="/complaints?status=OVERDUE" className="text-xs text-coral font-bold hover:underline flex items-center gap-1">
              <span>View All ({metrics.overdueCases})</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {overdueCases.map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(`/complaints/${encodeURIComponent(c.id)}`)}
                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-red-500/50 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-400">{c.id}</span>
                    <BureauChip bureau={c.bureau} />
                  </div>
                  <span className="font-bold text-white block truncate">{c.title}</span>
                  <span className="text-[11px] text-white/50 block truncate">{c.institutionName}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 font-mono font-bold text-[10px]">
                    {Math.abs(c.daysRemaining)}d OVERDUE
                  </span>
                  <span className="text-[10px] text-white/50 block mt-1 font-mono">
                    Officer: {c.assignedOfficer.name.split(" ")[1] || c.assignedOfficer.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Pending Overlap Reviews (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-white/[0.03] border border-coral/25 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-coral/20 text-coral">
                <GitMerge className="h-4 w-4" />
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-white">
                Pending Multi-Bureau Overlap Reviews
              </h3>
            </div>
            <Link href="/overlaps" className="text-xs text-coral font-bold hover:underline flex items-center gap-1">
              <span>Studio</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingOverlapCases.map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(`/overlaps`)}
                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-coral/50 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-coral">{c.id}</span>
                    <BureauChip bureau={c.bureau} />
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-coral/15 border border-coral/30 text-coral font-mono font-bold">
                      Flagged
                    </span>
                  </div>
                  <span className="font-bold text-white block truncate">{c.title}</span>
                  <span className="text-[11px] text-white/50 block truncate">{c.institutionName}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-coral font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Review Pair</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Recently Ingested Stream (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h3 className="font-display font-bold text-sm sm:text-base text-white">
                Live Ingestion Ledger
              </h3>
            </div>
            <Link href="/complaints" className="text-xs text-coral font-bold hover:underline flex items-center gap-1">
              <span>Full Register</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {recentCases.map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(`/complaints/${encodeURIComponent(c.id)}`)}
                className="py-3 flex items-center justify-between text-xs hover:bg-white/[0.04] px-2.5 -mx-2.5 rounded-xl cursor-pointer transition-colors"
              >
                <div className="space-y-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-xs">{c.id}</span>
                    <BureauChip bureau={c.bureau} />
                    <StatusBadge status={c.status} />
                  </div>
                  <span className="font-bold text-white block truncate">{c.title}</span>
                  <span className="text-[11px] text-white/50 truncate block">{c.institutionName}</span>
                </div>

                <div className="text-right shrink-0 font-mono text-[11px] text-white/50">
                  {format(new Date(c.dateOfReceipt), "dd MMM yyyy")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 4: Bureau Workload & Capacity (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  Staffing &amp; Bureau Capacity
                </h3>
              </div>
              <Link href="/tasks" className="text-xs text-coral font-bold hover:underline flex items-center gap-1">
                <span>Task Roster</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3.5 mt-4">
              {metrics.bureauDistribution.map((b) => (
                <div key={b.bureau} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{b.name} ({b.bureau})</span>
                    <span className="font-mono text-white/60 font-bold">{b.count} Cases ({b.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, b.percentage * 2.2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-white/70 flex items-center justify-between mt-6 font-mono">
            <span>Dealing Staff: <strong className="text-white">8 Active Officers</strong></span>
            <span className="font-bold text-emerald-400">78% Load Capacity</span>
          </div>
        </div>

      </div>
    </div>
  );
}
