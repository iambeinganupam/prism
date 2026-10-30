"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  GitMerge, 
  Users, 
  Building2, 
  Filter,
  Info,
  Calendar
} from "lucide-react";
import { prismApi } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const router = useRouter();

  // Filters
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [selectedBureau, setSelectedBureau] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");

  // Synthetic Reconciled Chart Data
  const monthlyVolumeData = [
    { month: "May 2025", received: 84, disposed: 62, overdue: 8 },
    { month: "Jun 2025", received: 96, disposed: 78, overdue: 12 },
    { month: "Jul 2025", received: 112, disposed: 89, overdue: 16 },
    { month: "Aug 2025", received: 138, disposed: 105, overdue: 22 },
    { month: "Sep 2025", received: 152, disposed: 124, overdue: 25 },
    { month: "Oct 2025", received: 165, disposed: 118, overdue: 32 },
    { month: "Nov 2025", received: 142, disposed: 96, overdue: 35 },
  ];

  const bureauDistributionData = [
    { name: "PGRC", pending: 180, disposed: 254, overdue: 40, total: 474 },
    { name: "Regulation (RB)", pending: 135, disposed: 185, overdue: 29, total: 349 },
    { name: "Academic (ACA)", pending: 62, disposed: 105, overdue: 20, total: 187 },
    { name: "Approvals (APP)", pending: 45, disposed: 68, overdue: 12, total: 125 },
    { name: "Regional (RO)", pending: 30, disposed: 38, overdue: 7, total: 75 },
    { name: "Others Cell", pending: 14, disposed: 22, overdue: 2, total: 38 },
  ];

  const workflowStageData = [
    { stage: "Received", count: 186, color: "#2563EB" },
    { stage: "Screening", count: 140, color: "#0F766E" },
    { stage: "Under Review", count: 215, color: "#D97706" },
    { stage: "Action Required", count: 125, color: "#DC2626" },
    { stage: "Resolved", count: 420, color: "#16A34A" },
    { stage: "Closed (Archived)", count: 162, color: "#64748B" },
  ];

  const priorityData = [
    { name: "Critical", value: 168, color: "#DC2626" },
    { name: "High", value: 412, color: "#D97706" },
    { name: "Medium", value: 520, color: "#2563EB" },
    { name: "Low", value: 148, color: "#64748B" },
  ];

  const overlapOutcomesData = [
    { name: "Confirmed Related", count: 14, color: "#16A34A" },
    { name: "Dismissed (Independent)", count: 9, color: "#DC2626" },
    { name: "Deferred (Pending Proof)", count: 5, color: "#D97706" },
    { name: "Awaiting Review", count: 8, color: "#2563EB" },
  ];

  const officerWorkloadData = [
    { name: "Shri R. Kumar", bureau: "PGRC", active: 28, capacity: 35, pct: 80 },
    { name: "Dr. Sunita Sharma", bureau: "RB", active: 34, capacity: 35, pct: 97 },
    { name: "Prof. Arvind Narang", bureau: "ACA", active: 21, capacity: 30, pct: 70 },
    { name: "Ms. Priyanka Sen", bureau: "APP", active: 19, capacity: 30, pct: 63 },
    { name: "Shri Vikram Deshmukh", bureau: "RO", active: 26, capacity: 35, pct: 74 },
  ];

  const topInstitutionsLeaderboard = [
    { name: "ABC Institute of Technology", aicteId: "1-1234567890", instId: "inst-1", cases: 9, open: 3, risk: 84, overlap: true },
    { name: "Chennai Technical Academy", aicteId: "1-7719284901", instId: "inst-7", cases: 8, open: 3, risk: 79, overlap: true },
    { name: "XYZ College of Engineering", aicteId: "1-2948571029", instId: "inst-2", cases: 7, open: 2, risk: 78, overlap: true },
    { name: "Bhopal Central Institute", aicteId: "1-1029384756", instId: "inst-10", cases: 6, open: 2, risk: 73, overlap: true },
    { name: "LMN Institute of Management", aicteId: "1-3829104820", instId: "inst-3", cases: 5, open: 2, risk: 71, overlap: true },
  ];

  const handleExportCSV = () => {
    const rows = topInstitutionsLeaderboard.map((inst) => ({
      "Institution Name": inst.name,
      "AICTE ID": inst.aicteId,
      "Total Cases": inst.cases,
      "Open Cases": inst.open,
      "Risk Score": inst.risk,
      "Cross-Bureau Overlap": inst.overlap ? "Yes" : "No",
    }));
    prismApi.exportToCsv(rows, `PRISM_Analytics_Summary_${format(new Date(), "yyyy-MM-dd")}`);
    toast.success("Analytics summary exported to CSV successfully.");
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-ink tracking-tight">
              Analytical Intelligence &amp; Reports
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-surface-alt border border-line text-ink">
              1,248 Total Matters
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Statistical distribution, bureau resolution velocity, multi-agency overlaps, and institution risk concentration.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-ink hover:bg-surface-alt border border-line transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-ink-muted" />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="p-4 bg-surface border border-line grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="font-bold text-ink-muted block mb-1">Time Horizon:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full p-2 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
          >
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Last 6 Months">Last 6 Months (FY 2025-26)</option>
            <option value="Last 1 Year">Last 1 Year</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-ink-muted block mb-1">Bureau Focus:</label>
          <select
            value={selectedBureau}
            onChange={(e) => setSelectedBureau(e.target.value)}
            className="w-full p-2 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
          >
            <option value="ALL">All Bureaus (Consolidated)</option>
            <option value="PGRC">Public Grievance Redressal Cell</option>
            <option value="RB">Regulation Bureau</option>
            <option value="ACA">Academic Bureau</option>
            <option value="APP">Approval Bureau</option>
            <option value="RO">Regional Offices</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-ink-muted block mb-1">Priority Classification:</label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full p-2 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium / General</option>
          </select>
        </div>
      </div>

      {/* 4 Top KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface border border-line space-y-1">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span>Average Disposal Velocity</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-mono text-ink">18.4 Days</div>
          <span className="text-[11px] text-emerald-600 font-bold">↓ 4.2 days vs manual siloed workflow</span>
        </div>

        <div className="p-4 bg-surface border border-line space-y-1">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span>Overdue Breach Ratio</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-black font-mono text-ink">12.0%</div>
          <span className="text-[11px] text-ink-muted">150 cases currently past statutory SLA</span>
        </div>

        <div className="p-4 bg-surface border border-line space-y-1">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span>AI Overlap Detection Rate</span>
            <GitMerge className="h-4 w-4 text-coral" />
          </div>
          <div className="text-2xl font-black font-mono text-ink">88.2%</div>
          <span className="text-[11px] text-emerald-600 font-bold">Official confirmation rate on suggested links</span>
        </div>

        <div className="p-4 bg-surface border border-line space-y-1">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span>Disposal Completion Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-ink">53.8%</div>
          <span className="text-[11px] text-ink-muted">672 matters formally disposed</span>
        </div>
      </div>

      {/* Grid of Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: VOLUME OVER TIME (Area Chart - 8 cols) */}
        <div className="lg:col-span-8 bg-surface border border-line p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <h3 className="font-display font-bold text-sm text-ink">
                Complaint Ingestion vs. Disposal Velocity
              </h3>
              <p className="text-[11px] text-ink-muted">
                Monthly intake trend, disposal completions, and overdue trajectory.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-surface-alt border border-line text-ink">
              Reconciled Data
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDisposed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#14182B", color: "#fff", fontSize: 11, border: "none" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="received" stroke="#2563EB" fillOpacity={1} fill="url(#colorReceived)" name="Received Inquiries" />
                <Area type="monotone" dataKey="disposed" stroke="#16A34A" fillOpacity={1} fill="url(#colorDisposed)" name="Disposed / Closed" />
                <Area type="monotone" dataKey="overdue" stroke="#DC2626" fillOpacity={0} strokeWidth={2} strokeDasharray="4 4" name="SLA Overdue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: PRIORITY DISTRIBUTION (Donut Chart - 4 cols) */}
        <div className="lg:col-span-4 bg-surface border border-line p-5 space-y-4 shadow-sm">
          <div className="pb-3 border-b border-line">
            <h3 className="font-display font-bold text-sm text-ink">
              Priority Tier Distribution
            </h3>
            <p className="text-[11px] text-ink-muted">
              Classification by gravity and statutory risk.
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#14182B", color: "#fff", fontSize: 11, border: "none" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {priorityData.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-ink-muted text-[11px]">{p.name}: <strong className="text-ink font-mono">{p.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 3: BUREAU-WISE WORKLOAD (Stacked Bar Chart - 8 cols) */}
        <div className="lg:col-span-8 bg-surface border border-line p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <h3 className="font-display font-bold text-sm text-ink">
                Bureau Caseload &amp; Disposal Breakdown
              </h3>
              <p className="text-[11px] text-ink-muted">
                Status reconciliation across AICTE operational bureaus.
              </p>
            </div>
            <span className="text-xs text-coral font-bold hover:underline cursor-pointer" onClick={() => router.push("/complaints")}>
              Inspect in Register →
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bureauDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#14182B", color: "#fff", fontSize: 11, border: "none" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="disposed" stackId="a" fill="#16A34A" name="Disposed" />
                <Bar dataKey="pending" stackId="a" fill="#2563EB" name="Pending" />
                <Bar dataKey="overdue" stackId="a" fill="#DC2626" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: OVERLAP REVIEW OUTCOMES (4 cols) */}
        <div className="lg:col-span-4 bg-surface border border-line p-5 space-y-4 shadow-sm">
          <div className="pb-3 border-b border-line">
            <h3 className="font-display font-bold text-sm text-ink">
              AI Overlap Review Outcomes
            </h3>
            <p className="text-[11px] text-ink-muted">
              Human-in-the-loop decisions on multi-vector suggestions.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {overlapOutcomesData.map((item) => (
              <div key={item.name} className="p-2.5 bg-surface-alt border border-line space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink">{item.name}</span>
                  <span className="font-mono font-bold text-ink">{item.count} Pairs</span>
                </div>
                <div className="h-1.5 w-full bg-surface overflow-hidden">
                  <div
                    className="h-full"
                    style={{ width: `${(item.count / 36) * 100}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-ink-faint leading-relaxed font-sans pt-1">
            Confirmed overlaps preserve statutory independence and never merge independent records.
          </p>
        </div>

        {/* TABLE: INSTITUTION CONCENTRATION LEADERBOARD (12 cols) */}
        <div className="lg:col-span-12 bg-surface border border-line p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <h3 className="font-display font-bold text-base text-ink">
                Institution Complaint Concentration &amp; Risk Leaderboard
              </h3>
              <p className="text-xs text-ink-muted">
                Colleges with highest multi-bureau grievance volumes and active inquiry density.
              </p>
            </div>
            <Link
              href="/institutions"
              className="text-xs font-bold text-coral hover:underline"
            >
              View Full Institution Registry →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#14182B] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Technical Institution</th>
                  <th className="p-3 font-mono">AICTE Permanent ID</th>
                  <th className="p-3">Total Grievances</th>
                  <th className="p-3">Active Inquiries</th>
                  <th className="p-3">Risk Index</th>
                  <th className="p-3">Cross-Bureau Overlap</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {topInstitutionsLeaderboard.map((inst, idx) => (
                  <tr key={inst.aicteId} className="hover:bg-surface-alt transition-colors">
                    <td className="p-3 font-mono font-bold text-coral">#{idx + 1}</td>
                    <td className="p-3 font-bold text-ink">{inst.name}</td>
                    <td className="p-3 font-mono text-ink-muted">{inst.aicteId}</td>
                    <td className="p-3 font-bold text-ink font-mono">{inst.cases} Cases</td>
                    <td className="p-3 font-mono text-red-600 font-bold">{inst.open} Open</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs">{inst.risk}/100</span>
                        <div className="w-16 h-1.5 bg-surface-alt overflow-hidden border border-line">
                          <div
                            className={cn(
                              "h-full",
                              inst.risk >= 80 ? "bg-red-500" : inst.risk >= 65 ? "bg-amber-500" : "bg-emerald-600"
                            )}
                            style={{ width: `${inst.risk}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {inst.overlap ? (
                        <span className="px-2 py-0.5 bg-coral text-white font-mono font-bold text-[10px]">
                          Flagged (PGRC + RB)
                        </span>
                      ) : (
                        <span className="text-ink-muted text-[11px]">None</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
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
        </div>
      </div>
    </div>
  );
}
