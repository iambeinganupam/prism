"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { prismApi } from "@/lib/api";
import { Institution, Case } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BureauChip } from "@/components/ui/BureauChip";
import { CaseIdTag } from "@/components/ui/CaseIdTag";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { getPermissions } from "@/lib/permissions";
import { 
  Building2, 
  MapPin, 
  Mail, 
  User, 
  GitMerge, 
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  Edit3,
  ExternalLink,
  Download,
  UploadCloud,
  FileCheck2,
  Scale
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

interface InstitutionDetailClientProps {
  institutionId: string;
}

type TabType = "overview" | "complaints" | "regulatory" | "overlaps" | "documents" | "history";

export function InstitutionDetailClient({ institutionId }: InstitutionDetailClientProps) {
  const router = useRouter();
  const { role: currentRole } = useAuthStore();
  const permissions = getPermissions(currentRole);

  const [institution, setInstitution] = useState<Institution | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    principalName: string;
    contactEmail: string;
    approvalStatus: "Approved" | "Under Scrutiny" | "Show Cause Issued" | "Deficiency Notice";
  }>({
    principalName: "",
    contactEmail: "",
    approvalStatus: "Approved",
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [inst, cList] = await Promise.all([
          prismApi.getInstitutionById(institutionId),
          prismApi.getInstitutionCases(institutionId),
        ]);
        setInstitution(inst);
        setCases(cList);
        if (inst) {
          setEditForm({
            principalName: inst.principalName,
            contactEmail: inst.contactEmail,
            approvalStatus: inst.approvalStatus as any,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [institutionId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-56 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-7 h-80" />
          <Skeleton className="lg:col-span-5 h-80" />
        </div>
      </div>
    );
  }

  if (!institution) {
    return (
      <EmptyState
        title="Institution Not Found"
        description={`We could not locate an institution profile for ID "${institutionId}".`}
        actionText="Back to Registry"
        onAction={() => router.push("/institutions")}
      />
    );
  }

  // Summary counts
  const totalComplaints = cases.length;
  const openComplaints = cases.filter(
    (c) => c.status !== "DISPOSED"
  ).length;
  const overdueComplaints = cases.filter(
    (c) => c.status === "ESCALATED" || c.priority === "CRITICAL"
  ).length;
  const resolvedComplaints = cases.filter((c) => c.status === "DISPOSED").length;

  // Bureau breakdown
  const bureauCounts: Record<string, number> = {};
  cases.forEach((c) => {
    bureauCounts[c.bureau] = (bureauCounts[c.bureau] || 0) + 1;
  });

  const donutData = Object.entries(bureauCounts).map(([bureau, count]) => ({
    name: bureau,
    value: count,
  }));

  const COLORS = ["#17365D", "#2563EB", "#0F766E", "#D97706", "#DC2626", "#64748B"];

  // Activity stream
  const unifiedTimelineEvents = [
    {
      timestamp: "2025-11-10T13:00:00Z",
      bureau: "PGRC",
      action: "Clarification received regarding student certificate detention",
      actor: "Registrar, " + institution.name,
      caseId: cases[0]?.id || "PGRC/2025/1023",
      type: "CLARIFICATION",
    },
    {
      timestamp: "2025-11-06T16:10:00Z",
      bureau: "PGRC ↔ RB",
      action: "Co-referenced to Regulation Bureau (RB) due to systemic fee code violation",
      actor: "Shri R. Kumar (PGRC)",
      caseId: cases[0]?.id || "PGRC/2025/1023",
      type: "CROSS_REFERENCE",
      highlight: true,
    },
    {
      timestamp: "2025-10-24T14:15:00Z",
      bureau: "RB",
      action: "Regulatory compliance audit initiated for unapproved cess & phantom faculty",
      actor: "Dr. Sunita Sharma (Director RB)",
      caseId: cases[1]?.id || "RB/2025/4487",
      type: "AUDIT",
    },
    {
      timestamp: "2025-10-15T09:00:00Z",
      bureau: "ACA",
      action: "Notice issued regarding surplus 60-seat expansion in AI & Data Science",
      actor: "Prof. Arvind Narang (Academic)",
      caseId: cases[2]?.id || "ACA/2025/7765",
      type: "NOTICE",
    },
    {
      timestamp: "2025-08-14T11:00:00Z",
      bureau: "AICTE Central",
      action: "Annual physical verification & infrastructure scrutiny completed",
      actor: "Northern Regional Inspection Committee",
      caseId: "ANNUAL-AUDIT-2025",
      type: "INSPECTION",
    },
  ];

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setInstitution({
      ...institution,
      principalName: editForm.principalName,
      contactEmail: editForm.contactEmail,
      approvalStatus: editForm.approvalStatus,
    });
    setEditModalOpen(false);
    toast.success("Institution profile updated (Demo mode session)");
  };

  return (
    <div className="space-y-8 pb-16 relative">
      {/* 1. MASTER INSTITUTION HEADER CARD */}
      <div className="bg-surface border border-line p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-3 py-1 bg-surface-alt border border-line text-ink">
                AICTE Permanent ID: {institution.aicteId}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-surface-alt text-ink-muted border border-line">
                {institution.type}
              </span>
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-wider px-3 py-1 inline-flex items-center gap-1.5",
                  institution.approvalStatus === "Approved"
                    ? "bg-[#1E8E4E] text-white"
                    : "bg-[#B0121B] text-white"
                )}
              >
                {institution.approvalStatus}
              </span>

              {/* Attention Indicator */}
              {overdueComplaints > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  Attention Required ({overdueComplaints} Critical / Overdue)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Compliance Normal
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-ink tracking-tight">
              {institution.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted pt-1 font-sans">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <MapPin className="h-3.5 w-3.5 text-coral shrink-0" />
                {institution.address}, {institution.city}, {institution.state}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-ink-muted shrink-0" />
                Principal: {institution.principalName}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-ink-muted shrink-0" />
                {institution.contactEmail}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            {permissions.canEditComplaint && (
              <button
                onClick={() => setEditModalOpen(true)}
                className="btn-outline h-9 px-4 text-xs font-bold inline-flex items-center gap-2 self-start sm:self-end"
              >
                <Edit3 className="h-3.5 w-3.5 text-coral" />
                <span>Edit Profile</span>
              </button>
            )}

            <div className="p-4 bg-navy-block text-white text-center sm:text-right min-w-[200px]">
              <span className="text-[10px] uppercase font-bold text-coral tracking-widest block">
                COMPOSITE RISK RATING
              </span>
              <div className="mt-1 flex items-baseline justify-center sm:justify-end gap-1">
                <span className={cn(
                  "text-4xl font-display font-black tabular-nums",
                  institution.riskScore >= 75 ? "text-coral" : "text-[#1E8E4E]"
                )}>
                  {institution.riskScore}
                </span>
                <span className="text-xs text-white/60 font-mono">/ 100</span>
              </div>
              <span className="text-[10px] text-white/70 block mt-1 uppercase font-bold">
                {institution.riskScore >= 75 ? "Elevated Inquiry Burden" : "Standard Monitoring"}
              </span>
            </div>
          </div>
        </div>

        {/* 2. FOUR SUMMARY KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-line">
          <div className="p-4 bg-surface-alt border border-line">
            <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted block">
              Total Complaints
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black font-display text-ink tabular-nums">
                {totalComplaints}
              </span>
              <FileText className="h-4 w-4 text-ink-muted" />
            </div>
            <span className="text-[11px] text-ink-muted mt-1 block">Recorded across all Bureaus</span>
          </div>

          <div className="p-4 bg-surface-alt border border-line">
            <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted block">
              Open Complaints
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black font-display text-amber-600 dark:text-amber-400 tabular-nums">
                {openComplaints}
              </span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <span className="text-[11px] text-ink-muted mt-1 block">Currently under screening/review</span>
          </div>

          <div className="p-4 bg-surface-alt border border-line">
            <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted block">
              Overdue / Critical
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black font-display text-red-600 dark:text-red-400 tabular-nums">
                {overdueComplaints}
              </span>
              <ShieldAlert className="h-4 w-4 text-red-500" />
            </div>
            <span className="text-[11px] text-ink-muted mt-1 block">Exceeding SLA timeline target</span>
          </div>

          <div className="p-4 bg-surface-alt border border-line">
            <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted block">
              Resolved / Disposed
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400 tabular-nums">
                {resolvedComplaints}
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-[11px] text-ink-muted mt-1 block">Compliances verified & closed</span>
          </div>
        </div>
      </div>

      {/* 3. SIX NAVIGATION TABS */}
      <div className="border-b border-line flex items-center gap-1 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        {[
          { id: "overview", label: "Overview" },
          { id: "complaints", label: `All Complaints (${cases.length})` },
          { id: "regulatory", label: "Regulatory Actions" },
          { id: "overlaps", label: "Potential Overlaps" },
          { id: "documents", label: "Documents & Evidence" },
          { id: "history", label: "Activity History" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "px-5 py-3.5 border-b-2 transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "border-coral text-coral bg-surface font-black"
                : "border-transparent text-ink-muted hover:text-ink hover:border-line"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Bureau Breakdown & Academic Capacity (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="editorial-tile bg-surface p-6 space-y-4">
                <div className="pb-3 border-b border-line flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                      Academic Sanctions & Capacity
                    </span>
                    <h3 className="font-display font-black text-lg text-ink">
                      Accreditation & Infrastructure Baseline
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-coral bg-coral/10 px-2.5 py-1">
                    Est. {institution.establishedYear}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-surface-alt border border-line">
                    <span className="text-[10px] uppercase font-bold text-ink-muted block">Intake Capacity</span>
                    <span className="text-lg font-black font-display text-ink block mt-0.5">
                      {institution.intakeCapacity} Seats
                    </span>
                  </div>
                  <div className="p-3 bg-surface-alt border border-line">
                    <span className="text-[10px] uppercase font-bold text-ink-muted block">Approved Courses</span>
                    <span className="text-lg font-black font-display text-ink block mt-0.5">
                      {institution.activeCourses} Programs
                    </span>
                  </div>
                  <div className="p-3 bg-surface-alt border border-line">
                    <span className="text-[10px] uppercase font-bold text-ink-muted block">Region</span>
                    <span className="text-lg font-black font-display text-ink block mt-0.5">
                      {institution.region || "North"}
                    </span>
                  </div>
                  <div className="p-3 bg-surface-alt border border-line">
                    <span className="text-[10px] uppercase font-bold text-ink-muted block">Last Inspection</span>
                    <span className="text-sm font-bold font-mono text-ink block mt-1">
                      {institution.lastInspectionDate}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-ink-muted leading-relaxed font-sans pt-2">
                  Complaints filed against this institution are automatically matched against approved intake ceilings,
                  fee regulatory committee ceilings, and faculty rosters stored in the AICTE national registry.
                </p>
              </div>

              {/* Recent Complaints Snippet */}
              <div className="editorial-tile bg-surface p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-line">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                      Recent Grievances
                    </span>
                    <h3 className="font-display font-black text-lg text-ink">
                      Active Inquiries Under Scrutiny
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("complaints")}
                    className="btn-tertiary text-xs font-bold"
                  >
                    View All ({cases.length}) ▸
                  </button>
                </div>

                <div className="space-y-3">
                  {cases.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => router.push(`/complaints/${encodeURIComponent(c.id)}`)}
                      className="p-4 bg-surface-alt border border-line hover:border-coral transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CaseIdTag id={c.id} />
                          <BureauChip bureau={c.bureau} />
                          <span className="text-[11px] font-mono text-ink-muted font-bold">
                            {format(new Date(c.dateOfReceipt), "dd MMM yyyy")}
                          </span>
                        </div>
                        <h4 className="font-bold text-ink text-sm hover:text-coral transition-colors">
                          {c.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={c.status} size="sm" />
                        <span className="btn-tertiary text-xs font-bold">Inspect ▸</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Bureau Donut Distribution (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="editorial-tile bg-surface p-6 space-y-4">
                <div className="pb-3 border-b border-line">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                    Jurisdiction Division
                  </span>
                  <h3 className="font-display font-black text-lg text-ink">
                    Complaints by Bureau
                  </h3>
                </div>

                <div className="h-52 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#17365D",
                          border: "none",
                          color: "#FFFFFF",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      />
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {donutData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-display font-black text-3xl text-ink tabular-nums">
                      {cases.length}
                    </span>
                    <span className="text-[10px] text-ink-muted uppercase font-bold tracking-wider">
                      Cases
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-line">
                  {donutData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 p-2 bg-surface-alt border border-line">
                      <span
                        className="w-2.5 h-2.5 shrink-0"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="font-bold text-ink truncate">{d.name}</span>
                      <span className="font-mono text-ink-muted ml-auto font-bold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Bureau Overlap Callout */}
              <div className="p-5 bg-navy-block text-white border-l-4 border-coral space-y-3 text-xs">
                <div className="flex items-center gap-2 text-coral font-bold uppercase tracking-widest text-[10px]">
                  <GitMerge className="h-4 w-4" />
                  <span>AI Co-Reference Alert</span>
                </div>
                <h4 className="font-display font-black text-base text-white">
                  Multi-Bureau Activity Detected
                </h4>
                <p className="text-white/80 leading-relaxed">
                  Both PGRC and Regulation Bureau are actively examining fee structures and faculty rosters for {institution.name}. Inter-bureau coordination prevents conflicting notices.
                </p>
                <button
                  onClick={() => setActiveTab("overlaps")}
                  className="btn-coral text-xs h-9 px-4 font-bold inline-flex items-center gap-2 mt-2"
                >
                  <span>Review Cross-Bureau Overlaps</span>
                  <span className="font-mono">▸</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL COMPLAINTS TABLE */}
      {activeTab === "complaints" && (
        <div className="editorial-tile overflow-hidden p-0 bg-surface animate-in fade-in duration-200">
          <div className="p-6 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                Complaint Registry
              </span>
              <h3 className="font-display font-black text-xl text-ink">
                All Grievances Against {institution.name}
              </h3>
            </div>
            <Link
              href={`/complaints/new?institutionId=${institution.id}`}
              className="btn-coral text-xs font-bold self-start sm:self-auto"
            >
              + Register New Complaint
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="editorial-table w-full text-left text-xs border-collapse">
              <thead className="bg-navy-block text-white text-[10px] font-bold tracking-widest uppercase">
                <tr>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Subject / Title</th>
                  <th className="py-3 px-4">Bureau</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Stage / Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Dealing Officer</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-sans">
                {cases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/complaints/${encodeURIComponent(c.id)}`)}
                    className="hover:bg-[#F7F7F7] dark:hover:bg-surface-alt/70 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <CaseIdTag id={c.id} />
                    </td>
                    <td className="py-3 px-4 max-w-xs font-bold text-ink">
                      <div className="truncate">{c.title}</div>
                      <div className="text-[10px] text-ink-muted font-normal font-mono">
                        Rcvd: {format(new Date(c.dateOfReceipt), "dd MMM yyyy")}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <BureauChip bureau={c.bureau} />
                    </td>
                    <td className="py-3 px-4 text-ink-muted">{c.category}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                        c.priority === "CRITICAL" ? "bg-red-500/15 text-red-700" :
                        c.priority === "HIGH" ? "bg-amber-500/15 text-amber-700" :
                        "bg-slate-200 text-slate-800"
                      )}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-ink font-medium">
                      {c.assignedOfficer.name}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="btn-tertiary text-xs font-bold">Inspect ▸</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REGULATORY ACTIONS */}
      {activeTab === "regulatory" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="editorial-tile bg-surface p-6 space-y-4">
            <div className="pb-3 border-b border-line flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                  Enforcement & Compliance
                </span>
                <h3 className="font-display font-black text-xl text-ink">
                  AICTE Bureau Regulatory Orders &amp; Show-Cause Directives
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-surface-alt border border-line text-ink">
                3 Active Directives
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: "ORD-2025-RB-091",
                  title: "Show-Cause Notice: Non-compliance with Fee Regulatory Committee Ceiling",
                  bureau: "Regulation Bureau (RB)",
                  issueDate: "28 Oct 2025",
                  responseDue: "12 Nov 2025",
                  status: "Pending Response",
                  signatory: "Director, Regulation Bureau",
                  caseRef: cases[1]?.id || "RB/2025/4487",
                },
                {
                  id: "ORD-2025-PGRC-114",
                  title: "Directive on Unconditional Return of Original Degree Certificates",
                  bureau: "Public Grievance Redressal Cell (PGRC)",
                  issueDate: "05 Nov 2025",
                  responseDue: "10 Nov 2025",
                  status: "Interim Compliance Received",
                  signatory: "Member Secretary, AICTE",
                  caseRef: cases[0]?.id || "PGRC/2025/1023",
                },
                {
                  id: "ORD-2025-ACA-043",
                  title: "Seat Freeze Order: Excess Intake in Computer Science & Allied Streams",
                  bureau: "Academic Bureau (ACA)",
                  issueDate: "18 Oct 2025",
                  responseDue: "02 Nov 2025",
                  status: "Hearing Scheduled",
                  signatory: "Regional Officer, North",
                  caseRef: cases[2]?.id || "ACA/2025/7765",
                },
              ].map((act) => (
                <div key={act.id} className="p-5 bg-surface-alt border border-line space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-coral" />
                      <span className="font-mono text-xs font-black text-ink">{act.id}</span>
                      <span className="text-xs font-bold text-ink-muted">({act.bureau})</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20 self-start sm:self-auto">
                      {act.status}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-ink">{act.title}</h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1 text-ink-muted">
                    <div>Issued: <span className="text-ink font-bold">{act.issueDate}</span></div>
                    <div>SLA Due: <span className="text-coral font-bold">{act.responseDue}</span></div>
                    <div>Authority: <span className="text-ink">{act.signatory}</span></div>
                    <div>
                      Case:{" "}
                      <Link
                        href={`/complaints/${encodeURIComponent(act.caseRef)}`}
                        className="text-coral font-bold underline"
                      >
                        {act.caseRef}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: POTENTIAL OVERLAPS */}
      {activeTab === "overlaps" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="editorial-tile bg-surface p-6 space-y-4">
            <div className="pb-3 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                  Cross-Bureau AI Correlation
                </span>
                <h3 className="font-display font-black text-xl text-ink">
                  Potential Overlapping Complaints for {institution.name}
                </h3>
                <p className="text-xs text-ink-muted mt-1">
                  AI-assisted semantic matches identified across PGRC, Regulation Bureau, and Regional Cells.
                </p>
              </div>
              <Link href="/overlaps" className="btn-coral text-xs font-bold self-start sm:self-auto">
                Open Full Overlap Review Studio ▸
              </Link>
            </div>

            <div className="space-y-4">
              {[
                {
                  sourceId: "PGRC/2025/1023",
                  targetId: "RB/2025/4487",
                  sourceBureau: "PGRC",
                  targetBureau: "RB",
                  sourceTitle: "Arbitrary fee demand and certificate withholding",
                  targetTitle: "Audit on unauthorized fee structures and faculty deficit",
                  score: 88,
                  reasons: ["Same Institution", "Shared keywords: unapproved fee, development cess", "Concurrent timeline (Fall 2025)"],
                  status: "Pending Human Verification",
                },
                {
                  sourceId: "PGRC/2025/1023",
                  targetId: "ACA/2025/7765",
                  sourceBureau: "PGRC",
                  targetBureau: "ACA",
                  sourceTitle: "Arbitrary fee demand and certificate withholding",
                  targetTitle: "Unauthorized expansion of intake and unaccredited shift",
                  score: 82,
                  reasons: ["Same Institution", "Unsanctioned student admissions", "Overlapping academic year"],
                  status: "Pending Human Verification",
                },
              ].map((ov, idx) => (
                <div key={idx} className="p-5 bg-surface-alt border border-line space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CaseIdTag id={ov.sourceId} />
                      <span className="text-ink-muted font-bold text-xs">↔</span>
                      <CaseIdTag id={ov.targetId} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-coral bg-coral/10 px-2.5 py-1 border border-coral/30">
                        {ov.score}% Match Confidence
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-amber-500/15 text-amber-800">
                        {ov.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-surface border border-line space-y-1">
                      <span className="text-[10px] font-bold uppercase text-ink-muted block">
                        Source ({ov.sourceBureau})
                      </span>
                      <Link
                        href={`/complaints/${encodeURIComponent(ov.sourceId)}`}
                        className="font-bold text-ink hover:text-coral transition-colors"
                      >
                        {ov.sourceTitle}
                      </Link>
                    </div>
                    <div className="p-3 bg-surface border border-line space-y-1">
                      <span className="text-[10px] font-bold uppercase text-ink-muted block">
                        Candidate ({ov.targetBureau})
                      </span>
                      <Link
                        href={`/complaints/${encodeURIComponent(ov.targetId)}`}
                        className="font-bold text-ink hover:text-coral transition-colors"
                      >
                        {ov.targetTitle}
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-ink-muted text-[11px]">Match Factors:</span>
                    {ov.reasons.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 bg-surface border border-line text-ink font-mono text-[11px]">
                        ✓ {r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DOCUMENTS & EVIDENCE */}
      {activeTab === "documents" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="editorial-tile bg-surface p-6 space-y-4">
            <div className="pb-3 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                  Repository
                </span>
                <h3 className="font-display font-black text-xl text-ink">
                  Institutional Evidence &amp; Compliance Submissions
                </h3>
              </div>
              <button
                onClick={() => toast.info("Simulated file upload: Demo repository records are immutable.")}
                className="btn-outline h-9 px-4 text-xs font-bold inline-flex items-center gap-2 self-start sm:self-auto"
              >
                <UploadCloud className="h-3.5 w-3.5 text-coral" />
                <span>Upload Compliance Evidence</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "AICTE_Approval_Letter_2025_2026.pdf",
                  size: "2.4 MB",
                  date: "14 May 2025",
                  type: "Official Approval Order",
                  submittedBy: "Approval Bureau (AICTE)",
                },
                {
                  name: "Affiliation_Inspection_Report_Annexure_B.pdf",
                  size: "5.1 MB",
                  date: "14 Aug 2025",
                  type: "Physical Verification Report",
                  submittedBy: "Regional Expert Committee",
                },
                {
                  name: "Fee_Structure_Notification_AY_2025.pdf",
                  size: "1.2 MB",
                  date: "02 Oct 2025",
                  type: "Statutory Filing",
                  submittedBy: "Registrar, " + institution.name,
                },
                {
                  name: "Faculty_Roster_Biometric_Audit_Summary.xlsx",
                  size: "820 KB",
                  date: "24 Oct 2025",
                  type: "Regulation Bureau Audit Evidence",
                  submittedBy: "Dr. Sunita Sharma (RB)",
                },
              ].map((doc, idx) => (
                <div key={idx} className="p-4 bg-surface-alt border border-line flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="h-4 w-4 text-coral shrink-0" />
                      <span className="font-bold text-ink truncate max-w-xs">{doc.name}</span>
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      {doc.type} · {doc.size}
                    </div>
                    <div className="text-[10px] font-mono text-ink-muted">
                      Filing Date: {doc.date} | Uploaded by: {doc.submittedBy}
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success(`Simulated download of ${doc.name}`)}
                    className="p-2 border border-line bg-surface hover:border-coral text-ink-muted hover:text-coral transition-colors shrink-0"
                    title="Download document"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ACTIVITY HISTORY */}
      {activeTab === "history" && (
        <div className="editorial-tile bg-surface p-6 sm:p-8 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                Audit Stream
              </span>
              <h3 className="font-display font-black text-xl text-ink">
                Chronological Institutional Activity &amp; Audit Trail
              </h3>
            </div>
            <span className="text-[10px] font-mono text-white font-bold uppercase tracking-wider px-2.5 py-1 bg-coral">
              Tamper-evident Logs
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[3px] before:bg-line">
            {unifiedTimelineEvents.map((evt, i) => (
              <div key={i} className="relative group text-xs space-y-1">
                <div
                  className={cn(
                    "absolute -left-6 top-1.5 h-3.5 w-3.5 transition-all",
                    evt.highlight
                      ? "bg-coral ring-4 ring-coral/20 animate-pulse"
                      : "bg-navy-block"
                  )}
                />

                <div
                  className={cn(
                    "p-4 border text-xs transition-colors font-sans",
                    evt.highlight
                      ? "bg-surface border-coral border-l-4"
                      : "bg-surface-alt border-line hover:border-coral"
                  )}
                >
                  <div className="flex items-center justify-between text-[11px] text-ink-muted mb-1">
                    <span className="font-bold text-ink">
                      [{evt.bureau}] {evt.actor}
                    </span>
                    <span className="font-mono text-ink-muted">
                      {format(new Date(evt.timestamp), "dd MMM yyyy, HH:mm")}
                    </span>
                  </div>
                  <p className="text-ink leading-snug font-medium">
                    {evt.action}
                  </p>
                  {evt.caseId && (
                    <Link
                      href={`/complaints/${encodeURIComponent(evt.caseId)}`}
                      className="btn-tertiary text-[11px] font-bold inline-flex items-center gap-1 mt-2"
                    >
                      <span>View Case Record ({evt.caseId}) ▸</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-block/80 animate-in fade-in">
          <div className="w-full max-w-lg bg-surface border border-line border-t-4 border-t-coral shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="pb-3 border-b border-line">
              <h3 className="font-display font-black text-xl text-ink">
                Edit Institution Registry Record
              </h3>
              <p className="text-xs text-ink-muted mt-1">
                Demo simulation mode. Updates are stored in active session memory.
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Head of Institution / Principal Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.principalName}
                  onChange={(e) => setEditForm({ ...editForm, principalName: e.target.value })}
                  className="w-full p-2.5 bg-surface-alt border border-line text-ink text-xs focus:outline-none focus:border-coral"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Official Nodal Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editForm.contactEmail}
                  onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })}
                  className="w-full p-2.5 bg-surface-alt border border-line text-ink text-xs focus:outline-none focus:border-coral"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  AICTE Approval Status
                </label>
                <select
                  value={editForm.approvalStatus}
                  onChange={(e) => setEditForm({ ...editForm, approvalStatus: e.target.value as any })}
                  className="w-full p-2.5 bg-surface-alt border border-line text-ink text-xs focus:outline-none focus:border-coral"
                >
                  <option value="Approved">Approved</option>
                  <option value="Under Scrutiny">Under Scrutiny</option>
                  <option value="Show Cause Issued">Show Cause Issued</option>
                  <option value="Deficiency Notice">Deficiency Notice</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="btn-outline text-xs h-10 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-coral text-xs h-10 px-5 font-bold"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
