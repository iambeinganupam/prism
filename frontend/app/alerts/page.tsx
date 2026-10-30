"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { prismApi } from "@/lib/api";
import { SystemAlert, AlertSeverity, AlertCategory } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { BureauChip } from "@/components/ui/BureauChip";
import { useAuthStore } from "@/store/useAuthStore";
import { getPermissions } from "@/lib/permissions";
import { toast } from "sonner";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  GitMerge, 
  Users, 
  Filter, 
  Check, 
  ArrowRight,
  Info,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AlertsPage() {
  const { role, user } = useAuthStore();
  const permissions = getPermissions(role);

  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedBureau, setSelectedBureau] = useState<string>("ALL");

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await prismApi.getAlerts({
        severity: selectedSeverity !== "ALL" ? selectedSeverity : undefined,
        category: selectedCategory !== "ALL" ? selectedCategory : undefined,
        status: selectedStatus !== "ALL" ? selectedStatus : undefined,
        bureau: selectedBureau !== "ALL" ? selectedBureau : undefined,
      });
      setAlerts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [selectedSeverity, selectedCategory, selectedStatus, selectedBureau]);

  const handleAcknowledge = async (alertId: string) => {
    try {
      await prismApi.acknowledgeAlert(alertId, user.name);
      toast.success("Alert acknowledged and recorded");
      loadAlerts();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await prismApi.resolveAlert(alertId);
      toast.success("Alert marked as resolved");
      loadAlerts();
    } catch {
      toast.error("Action failed");
    }
  };

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400";
      case "HIGH":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400";
      case "MEDIUM":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/30 dark:text-slate-400";
    }
  };

  const getCategoryIcon = (cat: AlertCategory) => {
    switch (cat) {
      case "OVERDUE":
        return AlertTriangle;
      case "DEADLINE_APPROACHING":
        return Clock;
      case "OVERLAP_PENDING":
        return GitMerge;
      case "UNASSIGNED":
        return Users;
      case "ESCALATION":
        return ShieldAlert;
      default:
        return Info;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-ink tracking-tight">
              Alerts &amp; Escalations Center
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-surface-alt border border-line text-ink">
              {alerts.length} System Alerts
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Automated monitoring triggers for overdue show-cause windows, cross-bureau overlaps, and unassigned grievances.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 p-2 px-3 bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>Configurable demo SLA deadlines (Simulation Mode).</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-surface border border-line grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="font-bold text-ink-muted block mb-1">Alert Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="OVERDUE">Overdue Cases</option>
            <option value="DEADLINE_APPROACHING">Approaching Deadlines</option>
            <option value="OVERLAP_PENDING">Pending Overlap Reviews</option>
            <option value="UNASSIGNED">Unassigned Complaints</option>
            <option value="NO_RECENT_ACTIVITY">No Recent Activity (Stagnant)</option>
            <option value="ESCALATION">Escalations Requiring Action</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-ink-muted block mb-1">Severity Tier:</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full p-2 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-ink-muted block mb-1">Bureau / Cell:</label>
          <select
            value={selectedBureau}
            onChange={(e) => setSelectedBureau(e.target.value)}
            className="w-full p-2 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
          >
            <option value="ALL">All Bureaus</option>
            <option value="PGRC">PGRC</option>
            <option value="RB">Regulation Bureau</option>
            <option value="ACA">Academic Bureau</option>
            <option value="APP">Approval Bureau</option>
            <option value="RO">Regional Offices</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-ink-muted block mb-1">Resolution State:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
          >
            <option value="ALL">All States</option>
            <option value="ACTIVE">Active Trigger</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alert Cards List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No alerts match the selected criteria"
          description="All triggered notifications have been resolved or filtered out."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedSeverity("ALL");
            setSelectedCategory("ALL");
            setSelectedStatus("ALL");
            setSelectedBureau("ALL");
          }}
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = getCategoryIcon(alert.category);
            const isCritical = alert.severity === "CRITICAL";

            return (
              <div
                key={alert.id}
                className={cn(
                  "p-5 bg-surface border border-line hover:border-ink transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs shadow-sm",
                  isCritical && "border-l-4 border-l-red-500",
                  alert.status === "RESOLVED" && "opacity-60 bg-surface-alt/40"
                )}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={cn(
                      "p-2.5 border shrink-0",
                      isCritical ? "bg-red-500/10 border-red-500/30 text-red-600" : "bg-surface-alt border-line text-coral"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("px-2 py-0.5 text-[10px] font-mono font-bold uppercase border", getSeverityBadge(alert.severity))}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                        Category: {alert.category.replace(/_/g, " ")}
                      </span>
                      {alert.bureau && <BureauChip bureau={alert.bureau} />}
                      <span
                        className={cn(
                          "text-[10px] font-mono px-2 py-0.5 border font-bold",
                          alert.status === "ACTIVE"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                            : alert.status === "ACKNOWLEDGED"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        )}
                      >
                        {alert.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-ink">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-ink-muted leading-relaxed font-sans">
                      {alert.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-muted pt-1">
                      {alert.caseId && (
                        <span>Case ID: <Link href={`/complaints/${encodeURIComponent(alert.caseId)}`} className="text-coral font-mono font-bold hover:underline">{alert.caseId}</Link></span>
                      )}
                      {alert.institutionName && (
                        <span>Institution: <strong className="text-ink">{alert.institutionName}</strong></span>
                      )}
                      {alert.responsibleOfficer && (
                        <span>Officer: <strong className="text-ink">{alert.responsibleOfficer}</strong></span>
                      )}
                      <span>Triggered: <strong className="text-ink font-mono">{format(new Date(alert.createdAt), "dd MMM yyyy, HH:mm")}</strong></span>
                    </div>

                    {alert.acknowledgedBy && (
                      <div className="text-[10px] text-ink-faint font-mono italic">
                        Acknowledged by {alert.acknowledgedBy} at {alert.acknowledgedAt ? format(new Date(alert.acknowledgedAt), "dd MMM, HH:mm") : "earlier"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                  {permissions.canAcknowledgeAlerts && alert.status === "ACTIVE" && (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3 py-1.5 bg-surface-alt hover:bg-surface border border-line text-ink font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5 text-blue-600" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  {permissions.canAcknowledgeAlerts && alert.status !== "RESOLVED" && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Resolve Alert</span>
                    </button>
                  )}

                  {alert.caseId && (
                    <Link
                      href={`/complaints/${encodeURIComponent(alert.caseId)}`}
                      className="text-xs font-bold text-coral hover:underline flex items-center gap-1"
                    >
                      <span>Open Dossier</span>
                      <span>→</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
