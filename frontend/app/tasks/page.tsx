"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { prismApi } from "@/lib/api";
import { Case, Officer } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BureauChip } from "@/components/ui/BureauChip";
import { CaseIdTag } from "@/components/ui/CaseIdTag";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { getPermissions } from "@/lib/permissions";
import { toast } from "sonner";
import { 
  CheckSquare, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  Users, 
  ArrowRight, 
  X,
  Sparkles,
  Search,
  Filter,
  ShieldAlert,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type TaskFilterTab = "ASSIGNED_TO_ME" | "UNASSIGNED" | "PENDING" | "OVERDUE" | "DEADLINE_APPROACHING";

export default function TasksPage() {
  const { role, user } = useAuthStore();
  const permissions = getPermissions(role);

  const [activeTab, setActiveTab] = useState<TaskFilterTab>("ASSIGNED_TO_ME");
  const [tasks, setTasks] = useState<Case[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);

  // Reassignment Modal State
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [targetOfficerId, setTargetOfficerId] = useState("");
  const [reassignReason, setReassignReason] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [tList, oList] = await Promise.all([
        prismApi.getTasks(activeTab, user.name),
        prismApi.getWorkloadSummary(),
      ]);
      setTasks(tList);
      setOfficers(oList);
      if (oList.length > 0) {
        setTargetOfficerId(oList[0].id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks and workload");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleReassignSubmit = async () => {
    if (!selectedCase || !targetOfficerId) return;
    try {
      const targetOff = officers.find((o) => o.id === targetOfficerId);
      await prismApi.reassignCase(selectedCase.id, targetOfficerId, reassignReason, user.name);
      toast.success(`Complaint ${selectedCase.id} successfully assigned to ${targetOff?.name}`);
      setReassignModalOpen(false);
      setSelectedCase(null);
      setReassignReason("");
      loadData();
    } catch {
      toast.error("Reassignment failed");
    }
  };

  const tabs: { key: TaskFilterTab; label: string; icon: any; count?: number }[] = [
    { key: "ASSIGNED_TO_ME", label: "Assigned to Me", icon: UserCheck },
    { key: "UNASSIGNED", label: "Unassigned Inquiries", icon: Users },
    { key: "PENDING", label: "Pending Stage Actions", icon: CheckSquare },
    { key: "OVERDUE", label: "Overdue Actions", icon: AlertTriangle },
    { key: "DEADLINE_APPROACHING", label: "Approaching Deadlines (≤ 5d)", icon: Clock },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-ink tracking-tight">
              Tasks &amp; Dealing Workload
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-surface-alt border border-line text-ink">
              {tasks.length} Assigned Tasks
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Active assignment queue, SLA countdowns, and cross-bureau capacity rebalancing.
          </p>
        </div>

        {/* Info banner */}
        <div className="inline-flex items-center gap-2 p-2 px-3 bg-surface-alt border border-line text-xs text-ink-muted">
          <Info className="h-3.5 w-3.5 text-coral" />
          <span>Rules-based workload recommendations active (lower load prioritization).</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Task Queue & Filters (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tabs Row */}
          <div className="flex items-center border-b border-line gap-1 overflow-x-auto bg-surface p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors relative",
                    isActive
                      ? "text-coral bg-surface-alt border-b-2 border-coral"
                      : "text-ink-muted hover:text-ink hover:bg-surface-alt/60"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Task List */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks in this queue"
              description="You have completed all pending matters in this category. Check other filter tabs or the master register."
              actionLabel="View All Complaints"
              onAction={() => setActiveTab("PENDING")}
            />
          ) : (
            <div className="space-y-3">
              {tasks.map((c) => {
                const isOverdue = c.status === "OVERDUE" || c.daysRemaining < 0;

                return (
                  <div
                    key={c.id}
                    className={cn(
                      "p-4 bg-surface border border-line hover:border-ink transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-sm",
                      isOverdue && "border-l-4 border-l-red-500"
                    )}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CaseIdTag caseId={c.id} hasOverlap={c.hasOverlap} />
                        <BureauChip bureau={c.bureau} />
                        <StatusBadge status={c.status} />
                      </div>

                      <Link
                        href={`/complaints/${encodeURIComponent(c.id)}`}
                        className="font-bold text-sm text-ink hover:text-coral transition-colors line-clamp-1 block"
                      >
                        {c.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-ink-muted">
                        <span>Institution: <strong className="text-ink">{c.institutionName}</strong></span>
                        <span>•</span>
                        <span>Assigned to: <strong className="text-ink">{c.assignedOfficer.name}</strong></span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock className={cn("h-3.5 w-3.5", isOverdue ? "text-red-500" : "text-ink-muted")} />
                        <span className={cn("font-bold text-xs", isOverdue ? "text-red-600 dark:text-red-400" : "text-ink")}>
                          {c.daysRemaining < 0 ? `${Math.abs(c.daysRemaining)}d OVERDUE` : `${c.daysRemaining}d remaining`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {permissions.canReassignComplaint && (
                          <button
                            onClick={() => {
                              setSelectedCase(c);
                              setReassignModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-surface-alt hover:bg-surface border border-line text-ink font-bold text-[11px] flex items-center gap-1 transition-colors"
                            title="Reassign Officer"
                          >
                            <UserCheck className="h-3 w-3" />
                            <span>Reassign</span>
                          </button>
                        )}

                        <Link
                          href={`/complaints/${encodeURIComponent(c.id)}`}
                          className="px-2.5 py-1 bg-coral hover:bg-coral-hover text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <span>Handle</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Workload Panel & Recommendations (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface border border-line p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-coral" />
                <h3 className="font-display font-bold text-sm text-ink">
                  Officer Dealing Workload
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-ink-muted">
                {officers.length} Officers
              </span>
            </div>

            <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
              Balanced allocation meters based on active active caseload across Bureaus.
            </p>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {officers.map((off, idx) => {
                const isOptimal = idx === 0 || off.workloadPercentage <= 65;

                return (
                  <div key={off.id} className="p-3 bg-surface-alt border border-line space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={off.avatar}
                          alt={off.name}
                          className="h-7 w-7 object-cover border border-line shrink-0"
                        />
                        <div>
                          <span className="font-bold text-ink block">{off.name}</span>
                          <span className="text-[10px] text-ink-muted">{off.bureau} · {off.designation}</span>
                        </div>
                      </div>
                      <BureauChip bureau={off.bureau} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-ink-muted">Active Cases: <strong>{off.activeCases}</strong></span>
                        <span className="font-mono font-bold text-ink">{off.workloadPercentage}% Load</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface overflow-hidden border border-line">
                        <div
                          className={cn(
                            "h-full transition-all duration-300",
                            off.workloadPercentage >= 85 ? "bg-red-500" : off.workloadPercentage >= 70 ? "bg-amber-500" : "bg-emerald-600"
                          )}
                          style={{ width: `${off.workloadPercentage}%` }}
                        />
                      </div>
                    </div>

                    {isOptimal && (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                        <Sparkles className="h-3 w-3" />
                        <span>Recommended for new {off.bureau} assignments</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reassign Modal */}
      {reassignModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in">
          <div className="w-full max-w-lg bg-surface border border-line border-t-4 border-t-coral p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-display font-bold text-lg text-ink">
                Reassign Case Officer
              </h3>
              <button
                onClick={() => setReassignModalOpen(false)}
                className="text-ink-faint hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 space-y-4 text-xs">
              <div className="p-3 bg-surface-alt border border-line">
                <span className="font-mono text-coral font-bold block">{selectedCase.id}</span>
                <span className="font-bold text-ink">{selectedCase.title}</span>
                <span className="text-ink-muted block mt-1">
                  Current Officer: <strong>{selectedCase.assignedOfficer.name}</strong>
                </span>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">
                  Select New Dealing Officer:
                </label>
                <select
                  value={targetOfficerId}
                  onChange={(e) => setTargetOfficerId(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-line text-xs font-sans text-ink focus:border-coral outline-none"
                >
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.bureau}) — Active: {off.activeCases} ({off.workloadPercentage}% capacity)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">
                  Reassignment Reason / Transfer Note:
                </label>
                <textarea
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Workload balancing, specialized subject matter expertise..."
                  className="w-full p-2.5 bg-surface border border-line text-xs font-sans text-ink focus:border-coral outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
              <button
                onClick={() => setReassignModalOpen(false)}
                className="px-4 py-2 border border-line hover:bg-surface-alt font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleReassignSubmit}
                className="px-4 py-2 bg-coral hover:bg-coral-hover text-white font-bold text-xs"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
