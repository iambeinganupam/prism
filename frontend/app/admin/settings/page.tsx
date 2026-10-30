"use client";

import React, { useState, useEffect } from "react";
import { prismApi } from "@/lib/api";
import { AdminSettings, BureauCode } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import { getPermissions } from "@/lib/permissions";
import { toast } from "sonner";
import { 
  Settings, 
  Sliders, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  Clock, 
  GitMerge, 
  Building2, 
  ShieldAlert, 
  Info,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { role } = useAuthStore();
  const permissions = getPermissions(role);
  const isAuditor = role === "AUDITOR";

  const [settings, setSettings] = useState<AdminSettings>({
    overlapThreshold: 75,
    slaDaysDefault: 30,
    slaDaysCritical: 15,
    autoFlagOverdue: true,
    notifyOnOverlap: true,
    activeBureaus: ["PGRC", "RB", "ACA", "APP", "RO"],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const s = await prismApi.getAdminSettings();
        setSettings(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuditor) {
      toast.error("Read-only Auditor role is not authorized to modify system configurations");
      return;
    }

    setSaving(true);
    try {
      await prismApi.updateAdminSettings(settings);
      toast.success("System configurations updated and applied to active session.");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    if (isAuditor) {
      toast.error("Unauthorized");
      return;
    }
    if (!confirm("Are you sure you want to reset all demo complaints, assignments, and alerts back to the original seed state?")) {
      return;
    }

    setResetting(true);
    try {
      await prismApi.resetDemoData();
      const refreshedSettings = await prismApi.getAdminSettings();
      setSettings(refreshedSettings);
      toast.success("Demo dataset successfully restored to original baseline!");
    } catch {
      toast.error("Reset failed");
    } finally {
      setResetting(false);
    }
  };

  const toggleBureau = (bureau: BureauCode) => {
    if (isAuditor) return;
    setSettings((prev) => {
      const exists = prev.activeBureaus.includes(bureau);
      const activeBureaus = exists
        ? prev.activeBureaus.filter((b) => b !== bureau)
        : [...prev.activeBureaus, bureau];
      return { ...prev, activeBureaus };
    });
  };

  const bureaus: { code: BureauCode; name: string; desc: string }[] = [
    { code: "PGRC", name: "Public Grievance Redressal Cell", desc: "Excess fees, certificate withholding, and student complaints" },
    { code: "RB", name: "Regulation Bureau", desc: "Non-compliance, unauthorized courses, and show-cause inquiries" },
    { code: "ACA", name: "Academic Bureau", desc: "Curriculum violations, academic calendar breaches, and teacher cadres" },
    { code: "APP", name: "Approval Bureau", desc: "Intake capacity, mandatory land norms, and EoA approvals" },
    { code: "RO", name: "Regional Offices", desc: "Ground inspections, local hearings, and physical infrastructure audits" },
  ];

  const workflowStages = [
    { stage: "Received", time: "Day 0", desc: "Intake catalogued via portal and indexed for duplicate detection" },
    { stage: "Screening", time: "Days 1–3", desc: "Dealing officer reviews prima-facie grounds and completeness" },
    { stage: "Under Process", time: "Days 4–15", desc: "Notice issued to institution with mandated 14-day reply window" },
    { stage: "Action Required", time: "Days 16–25", desc: "Deficiencies established; rectification order or penalty drafted" },
    { stage: "Resolved", time: "Target: ≤ 30d", desc: "Compliance verified, refund confirmed, and case marked disposed" },
    { stage: "Closed", time: "Archived", desc: "Formal appellate disposal order logged in immutable audit trail" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="pb-4 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-ink tracking-tight">
              System Settings &amp; Configuration
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-surface-alt border border-line text-ink">
              Central Engine
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Configure AI overlap sensitivity thresholds, statutory SLA response windows, and active bureau integrations.
          </p>
        </div>

        {/* Auditor warning or Reset button */}
        {isAuditor ? (
          <div className="p-2 px-3 bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold flex items-center gap-1.5 shrink-0">
            <Lock className="h-3.5 w-3.5" />
            <span>Read-Only Auditor View</span>
          </div>
        ) : (
          <button
            onClick={handleResetData}
            disabled={resetting}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-alt hover:bg-surface border border-line text-xs font-bold text-ink transition-colors shrink-0"
            title="Reset all dynamic cases, assignments, and alerts to seed state"
          >
            <RotateCcw className={cn("h-3.5 w-3.5 text-coral", resetting && "animate-spin")} />
            <span>{resetting ? "Resetting..." : "Reset All Demo Data"}</span>
          </button>
        )}
      </div>

      {/* Simulation Disclaimer Notice */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs flex items-start gap-3">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Frontend Simulation Notice</span>
          <span>
            These settings tune client-side heuristic engines and in-memory mock latency. They demonstrate how administrative toggles will configure the future FastAPI backend.
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* SECTION 1: AI OVERLAP ENGINE SETTINGS */}
        <div className="bg-surface border border-line p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <GitMerge className="h-4 w-4 text-coral" />
              <h3 className="font-display font-bold text-base text-ink">
                AI Overlap Detection Engine
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-coral">
              Threshold: {settings.overlapThreshold}%
            </span>
          </div>

          <p className="text-ink-muted leading-relaxed font-sans">
            Controls minimum composite similarity confidence required for the system to automatically flag an overlap between independent complaints.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-ink">Overlap Flagging Sensitivity:</span>
              <span className="font-mono text-ink">{settings.overlapThreshold}% Confidence</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              disabled={isAuditor}
              value={settings.overlapThreshold}
              onChange={(e) =>
                setSettings({ ...settings, overlapThreshold: parseInt(e.target.value) })
              }
              className="w-full accent-coral h-2 bg-surface-alt cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-faint font-mono">
              <span>50% (Permissive / Higher Recall)</span>
              <span>75% (Recommended Default)</span>
              <span>95% (Strict / High Precision)</span>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-ink">
              <input
                type="checkbox"
                disabled={isAuditor}
                checked={settings.notifyOnOverlap}
                onChange={(e) => setSettings({ ...settings, notifyOnOverlap: e.target.checked })}
                className="accent-coral h-4 w-4"
              />
              <span>Generate instant alert notification whenever a High-Confidence overlap (≥80%) is flagged</span>
            </label>
          </div>
        </div>

        {/* SECTION 2: SLA & STATUTORY DEADLINE CONFIGURATION */}
        <div className="bg-surface border border-line p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h3 className="font-display font-bold text-base text-ink">
                Statutory SLA Deadlines &amp; Escalations
              </h3>
            </div>
            <span className="text-[10px] font-mono text-ink-muted">AICTE Regulation Handbooks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-ink block mb-1">
                Standard Redressal SLA Window (Days):
              </label>
              <input
                type="number"
                min="10"
                max="90"
                disabled={isAuditor}
                value={settings.slaDaysDefault}
                onChange={(e) => setSettings({ ...settings, slaDaysDefault: parseInt(e.target.value) || 30 })}
                className="w-full p-2.5 bg-surface-alt border border-line text-ink font-mono font-bold focus:border-coral outline-none"
              />
              <span className="text-[10px] text-ink-muted mt-1 block">
                Standard disposal target across PGRC and Academic Cells.
              </span>
            </div>

            <div>
              <label className="font-bold text-ink block mb-1">
                Critical Severity Fast-Track SLA (Days):
              </label>
              <input
                type="number"
                min="5"
                max="30"
                disabled={isAuditor}
                value={settings.slaDaysCritical}
                onChange={(e) => setSettings({ ...settings, slaDaysCritical: parseInt(e.target.value) || 15 })}
                className="w-full p-2.5 bg-surface-alt border border-line text-ink font-mono font-bold focus:border-coral outline-none"
              />
              <span className="text-[10px] text-ink-muted mt-1 block">
                Applied to ragging, student harassment, and unapproved excess fee cases.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-ink">
              <input
                type="checkbox"
                disabled={isAuditor}
                checked={settings.autoFlagOverdue}
                onChange={(e) => setSettings({ ...settings, autoFlagOverdue: e.target.checked })}
                className="accent-coral h-4 w-4"
              />
              <span>Automatically flag cases as OVERDUE and raise an alert when SLA expires without disposal</span>
            </label>
          </div>
        </div>

        {/* SECTION 3: OPERATIONAL BUREAUS */}
        <div className="bg-surface border border-line p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-600" />
              <h3 className="font-display font-bold text-base text-ink">
                Integrated AICTE Bureaus
              </h3>
            </div>
            <span className="text-[10px] font-mono text-ink-muted">Active: {settings.activeBureaus.length} Cells</span>
          </div>

          <p className="text-ink-muted leading-relaxed font-sans">
            Enable or mute bureau ingestion feeds. Deactivated bureaus are omitted from automated cross-referencing.
          </p>

          <div className="space-y-2.5">
            {bureaus.map((b) => {
              const isEnabled = settings.activeBureaus.includes(b.code);
              return (
                <div
                  key={b.code}
                  className="p-3 bg-surface-alt border border-line flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-coral text-xs">{b.code}</span>
                      <span className="font-bold text-ink">{b.name}</span>
                    </div>
                    <span className="text-[11px] text-ink-muted block mt-0.5">{b.desc}</span>
                  </div>

                  <button
                    type="button"
                    disabled={isAuditor}
                    onClick={() => toggleBureau(b.code)}
                    className={cn(
                      "px-3 py-1 font-mono font-bold text-xs border transition-colors shrink-0",
                      isEnabled
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-surface text-ink-muted border-line"
                    )}
                  >
                    {isEnabled ? "ACTIVE" : "PAUSED"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: WORKFLOW STAGE OVERVIEW */}
        <div className="bg-surface border border-line p-6 space-y-4 shadow-sm">
          <div className="pb-3 border-b border-line">
            <h3 className="font-display font-bold text-base text-ink">
              Standard Redressal Workflow Lifecycle
            </h3>
            <p className="text-[11px] text-ink-muted">
              Pre-configured governance steps enforced on complaint records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {workflowStages.map((ws, i) => (
              <div key={ws.stage} className="p-3 bg-surface-alt border border-line space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink text-xs">{i + 1}. {ws.stage}</span>
                  <span className="text-[10px] font-mono text-coral font-bold">{ws.time}</span>
                </div>
                <p className="text-[11px] text-ink-muted leading-snug">{ws.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        {!isAuditor && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-coral hover:bg-coral-hover text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving Changes..." : "Save System Preferences"}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
