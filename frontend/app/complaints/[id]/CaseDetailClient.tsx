"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { prismApi } from "@/lib/api";
import { Case, CaseStatus, CaseStage, PriorityLevel, Officer } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BureauChip } from "@/components/ui/BureauChip";
import { CaseIdTag } from "@/components/ui/CaseIdTag";
import { Stepper } from "@/components/ui/Stepper";
import { SeverityMeter } from "@/components/ui/SeverityMeter";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { getPermissions } from "@/lib/permissions";
import { toast } from "sonner";
import { 
  Building2, 
  MapPin, 
  FileText, 
  Upload, 
  MessageSquare, 
  ArrowRightLeft, 
  CheckCircle, 
  GitMerge, 
  Lock, 
  Sparkles, 
  Download, 
  X,
  FilePlus,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Clock,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface CaseDetailClientProps {
  caseId: string;
}

export function CaseDetailClient({ caseId }: CaseDetailClientProps) {
  const router = useRouter();
  const { role, user } = useAuthStore();
  const permissions = getPermissions(role);

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "documents" | "related">("overview");

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);

  // Form states
  const [remarkText, setRemarkText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docCategory, setDocCategory] = useState<any>("Supporting Document");
  const [uploadRemarks, setUploadRemarks] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Reassignment & Stage states
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState("");
  const [reassignReason, setReassignReason] = useState("");
  const [selectedNewStage, setSelectedNewStage] = useState<CaseStage>("IN_REVIEW");
  const [stageTransitionNote, setStageTransitionNote] = useState("");
  const [escalateReason, setEscalateReason] = useState("");
  const [resolveRemarks, setResolveRemarks] = useState("");

  // Timeline filter
  const [timelineFilter, setTimelineFilter] = useState<string>("ALL");

  useEffect(() => {
    async function fetchCase() {
      setLoading(true);
      try {
        const [cData, offs] = await Promise.all([
          prismApi.getCaseById(caseId),
          prismApi.getOfficers(),
        ]);
        setCaseData(cData);
        setOfficers(offs);
        if (offs.length > 0) {
          setSelectedOfficerId(offs[0].id);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load complaint dossier");
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [caseId]);

  const handleAddRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkText.trim() || !caseData) return;
    const updated = await prismApi.addCaseRemark(caseData.id, remarkText, user.name);
    setCaseData(updated);
    setRemarkText("");
    setRemarkModalOpen(false);
    toast.success("Remark recorded in immutable audit ledger.");
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !caseData) return;

    setIsUploading(true);
    setUploadProgress(40);

    setTimeout(async () => {
      setUploadProgress(80);
      await prismApi.uploadEvidence(caseData.id, {
        name: selectedFile.name,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        category: docCategory,
        remarks: uploadRemarks,
      });

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadModalOpen(false);
        setSelectedFile(null);
        setUploadRemarks("");
        prismApi.getCaseById(caseData.id).then((refreshed) => setCaseData(refreshed));
        toast.success("Document verified and added to case evidence.");
      }, 300);
    }, 400);
  };

  const handleReassign = async () => {
    if (!caseData || !selectedOfficerId) return;
    try {
      const updated = await prismApi.reassignCase(caseData.id, selectedOfficerId, reassignReason, user.name);
      setCaseData(updated);
      setReassignModalOpen(false);
      setReassignReason("");
      toast.success(`Complaint successfully reassigned to ${updated.assignedOfficer.name}`);
    } catch {
      toast.error("Reassignment failed");
    }
  };

  const handleStageTransition = async () => {
    if (!caseData) return;
    try {
      const updated = await prismApi.transitionCaseStage(caseData.id, selectedNewStage, stageTransitionNote, user.name);
      setCaseData(updated);
      setStageModalOpen(false);
      setStageTransitionNote("");
      toast.success(`Case progressed to ${selectedNewStage}`);
    } catch {
      toast.error("Stage transition failed");
    }
  };

  const handleEscalate = async () => {
    if (!caseData) return;
    try {
      const updated = await prismApi.escalateCase(caseData.id, escalateReason, user.name);
      setCaseData(updated);
      setEscalateModalOpen(false);
      setEscalateReason("");
      toast.error(`Case escalated to AICTE Member Secretary / Appellate Wing`);
    } catch {
      toast.error("Escalation failed");
    }
  };

  const handleResolve = async () => {
    if (!caseData) return;
    try {
      const updated = await prismApi.updateCaseStatus(caseData.id, "DISPOSED", resolveRemarks || "Grievance resolved and disposed in accordance with AICTE Redressal Norms.", user.name);
      setCaseData(updated);
      setResolveModalOpen(false);
      setResolveRemarks("");
      toast.success(`Case marked as DISPOSED.`);
    } catch {
      toast.error("Case resolution failed");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-2/5" />
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <EmptyState
        title="Complaint Record Not Found"
        description={`We could not locate a case with identifier "${decodeURIComponent(caseId)}". It may have been entered under a different Bureau code.`}
        actionLabel="Back to Complaints Register"
        onAction={() => router.push("/complaints")}
      />
    );
  }

  const isOverdue = caseData.status === "OVERDUE" || caseData.daysRemaining < 0;

  // Filtered timeline events
  const timelineEvents = (caseData.timeline || []).filter((e) => {
    if (timelineFilter === "ALL") return true;
    return e.type === timelineFilter;
  });

  // Calculate suggested officer by lowest workload
  const suggestedOfficers = [...officers]
    .filter((o) => o.bureau === caseData.bureau)
    .sort((a, b) => a.activeCases - b.activeCases);

  return (
    <div className="space-y-6 pb-20">
      {/* Breadcrumb row & Back */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <Link
          href="/complaints"
          className="text-coral hover:underline font-bold flex items-center gap-1"
        >
          ← Back to Complaints Register
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/track?id=${encodeURIComponent(caseData.id)}`}
            className="text-ink-muted hover:text-coral font-bold flex items-center gap-1 transition-colors"
            title="Inspect how citizens view this case"
          >
            <span>Public Citizen View</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
          <span className="text-line">|</span>
          <span className="font-mono text-[11px] text-ink-muted">
            Permanent AICTE Registry ID: <strong>{caseData.aicteId}</strong>
          </span>
        </div>
      </div>

      {/* Case Header Dossier Tile */}
      <div className="bg-surface border border-line p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <CaseIdTag caseId={caseData.id} hasOverlap={caseData.hasOverlap} />
              <BureauChip bureau={caseData.bureau} />
              <StatusBadge status={caseData.status} />
              <span
                className={cn(
                  "px-2 py-0.5 text-[10px] font-bold uppercase font-mono tracking-wider border",
                  caseData.priority === "CRITICAL"
                    ? "bg-red-500/10 text-red-600 border-red-500/30"
                    : caseData.priority === "HIGH"
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                    : "bg-blue-500/10 text-blue-600 border-blue-500/30"
                )}
              >
                {caseData.priority || "MEDIUM"}
              </span>
            </div>

            <h1 className="font-display text-xl sm:text-2xl font-black text-ink tracking-tight">
              {caseData.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-coral" />
                <Link
                  href={`/institutions/${caseData.institutionId}`}
                  className="font-bold text-ink hover:text-coral hover:underline"
                >
                  {caseData.institutionName}
                </Link>
              </span>
              <span>•</span>
              <span>Category: <strong className="text-ink">{caseData.category}</strong></span>
              <span>•</span>
              <span>Received: <strong className="text-ink">{format(new Date(caseData.dateOfReceipt), "dd MMM yyyy")}</strong></span>
            </div>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {permissions.canEditComplaint && (
              <button
                onClick={() => setRemarkModalOpen(true)}
                className="px-3 py-2 bg-surface-alt hover:bg-surface border border-line text-ink font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Add official internal note"
              >
                <MessageSquare className="h-3.5 w-3.5 text-ink-muted" />
                <span>Add Note</span>
              </button>
            )}

            {permissions.canReassignComplaint && (
              <button
                onClick={() => setReassignModalOpen(true)}
                className="px-3 py-2 bg-surface-alt hover:bg-surface border border-line text-ink font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Reassign case officer"
              >
                <UserCheck className="h-3.5 w-3.5 text-ink-muted" />
                <span>Reassign</span>
              </button>
            )}

            {permissions.canTransitionWorkflow && (
              <button
                onClick={() => setStageModalOpen(true)}
                className="px-3 py-2 bg-surface-alt hover:bg-surface border border-line text-ink font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Advance workflow lifecycle stage"
              >
                <ArrowRight className="h-3.5 w-3.5 text-ink-muted" />
                <span>Advance Stage</span>
              </button>
            )}

            {permissions.canEscalateCase && caseData.status !== "ESCALATED" && (
              <button
                onClick={() => setEscalateModalOpen(true)}
                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Escalate case"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                <span>Escalate</span>
              </button>
            )}

            {permissions.canResolveCase && caseData.status !== "DISPOSED" && (
              <button
                onClick={() => setResolveModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Resolve Case</span>
              </button>
            )}
          </div>
        </div>

        {/* Workflow Progress Stepper */}
        <div className="pt-4 border-t border-line">
          <Stepper currentStage={caseData.currentStage} />
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center border-b border-line gap-2 overflow-x-auto">
        {[
          { key: "overview", label: "Complaint Overview" },
          { key: "history", label: `Audit Trail & History (${timelineEvents.length})` },
          { key: "documents", label: `Evidence & Records (${caseData.documents?.length || 0})` },
          { key: "related", label: `Cross-Bureau Overlaps (${caseData.linkedCaseIds?.length || 0})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={cn(
              "px-4 py-3 text-xs uppercase font-bold tracking-wider transition-colors relative whitespace-nowrap",
              activeTab === t.key
                ? "text-coral font-black"
                : "text-ink-muted hover:text-ink hover:bg-surface-alt"
            )}
          >
            {t.label}
            {activeTab === t.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-coral" />
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Narrative & AI Intelligence */}
          <div className="lg:col-span-8 space-y-6">
            {/* Grievance Narrative */}
            <div className="bg-surface border border-line p-6 space-y-3">
              <h3 className="font-display font-bold text-base text-ink">
                Factual Allegations &amp; Complaint Narrative
              </h3>
              <p className="text-xs text-ink leading-relaxed whitespace-pre-line font-sans">
                {caseData.description}
              </p>

              {caseData.extractedEntities.monetaryClaims && (
                <div className="p-3 bg-amber-500/10 border-l-4 border-l-amber-500 border border-amber-500/20 text-xs">
                  <span className="font-bold text-amber-700 dark:text-amber-400 block">
                    Alleged Financial Claims / Non-Stipulated Demands:
                  </span>
                  <span className="text-ink font-mono text-[11px]">
                    {caseData.extractedEntities.monetaryClaims}
                  </span>
                </div>
              )}
            </div>

            {/* AI Executive Summary & Entities */}
            <div className="bg-surface border border-line p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-coral" />
                  <h3 className="font-display font-bold text-sm text-ink">
                    AI Summary &amp; Entity Extraction
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-coral/10 text-coral font-bold">
                  Multi-Vector Analyzed
                </span>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed font-sans">
                {caseData.aiSummary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-surface-alt border border-line text-xs">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block mb-1">
                    Extracted Institutions / Affiliates
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {caseData.extractedEntities.institutions.map((inst, i) => (
                      <span key={i} className="px-2 py-0.5 bg-surface border border-line text-ink text-[11px] font-bold">
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-surface-alt border border-line text-xs">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block mb-1">
                    Regulatory Issue Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {caseData.extractedEntities.issueKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-surface border border-line text-coral text-[11px] font-mono font-bold">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata Dossier & Assigned Officer */}
          <div className="lg:col-span-4 space-y-6">
            {/* SLA & Seriousness */}
            <div className="bg-surface border border-line p-5 space-y-4">
              <h4 className="font-display font-bold text-sm text-ink pb-2 border-b border-line">
                Case Seriousness &amp; Disposal SLA
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-muted">AI Seriousness Index:</span>
                  <span className="font-mono font-bold text-ink">{caseData.seriousnessScore}/100</span>
                </div>
                <SeverityMeter score={caseData.seriousnessScore} />

                <div className="p-3 bg-surface-alt border border-line space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-muted">Statutory SLA Target:</span>
                    <span className="font-mono font-bold text-ink">
                      {format(new Date(caseData.dueDate), "dd MMM yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-muted">Timeline Status:</span>
                    <span className={cn("font-bold font-mono", isOverdue ? "text-red-600 dark:text-red-400" : "text-emerald-600")}>
                      {caseData.daysRemaining < 0 ? `${Math.abs(caseData.daysRemaining)}d OVERDUE` : `${caseData.daysRemaining} days left`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Officer Card */}
            <div className="bg-surface border border-line p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <h4 className="font-display font-bold text-sm text-ink">
                  Assigned Dealing Officer
                </h4>
                <BureauChip bureau={caseData.assignedOfficer.bureau} />
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={caseData.assignedOfficer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                  alt={caseData.assignedOfficer.name}
                  className="h-10 w-10 object-cover border border-line"
                />
                <div>
                  <span className="font-bold text-ink block text-xs">
                    {caseData.assignedOfficer.name}
                  </span>
                  <span className="text-[11px] text-ink-muted block">
                    {caseData.assignedOfficer.role}
                  </span>
                  <span className="text-[10px] text-ink-faint font-mono">
                    {caseData.assignedOfficer.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Complainant Confidential Info */}
            <div className="bg-surface border border-line p-5 space-y-2 text-xs">
              <h4 className="font-display font-bold text-sm text-ink pb-2 border-b border-line">
                Complainant Record
              </h4>
              <div className="space-y-1">
                <div>Type: <strong className="text-ink">{caseData.complainantType}</strong></div>
                <div>Name: <strong className="text-ink">{caseData.complainantName || "Protected Identity"}</strong></div>
                <div>Contact: <strong className="text-ink font-mono">{caseData.complainantContact || "Restricted"}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL & HISTORY */}
      {activeTab === "history" && (
        <div className="bg-surface border border-line p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                <h3 className="font-display font-bold text-base text-ink">
                  Cryptographically Stamped Action History
                </h3>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                Every stage progression, reassignment, remark, and statutory notice creates an immutable audit event.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-ink-muted">Filter:</span>
              <select
                value={timelineFilter}
                onChange={(e) => setTimelineFilter(e.target.value)}
                className="p-1.5 bg-surface-alt border border-line text-ink text-xs focus:outline-none"
              >
                <option value="ALL">All Events ({caseData.timeline?.length || 0})</option>
                <option value="STATUS_CHANGE">Status &amp; Stage Changes</option>
                <option value="ASSIGNMENT">Assignments</option>
                <option value="DOCUMENT_UPLOAD">Documents</option>
                <option value="REMARK">Official Remarks</option>
                <option value="ESCALATION">Escalations</option>
              </select>
            </div>
          </div>

          {/* Timeline Nodes */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
            {timelineEvents.map((event, idx) => (
              <div key={event.id || idx} className="relative group text-xs">
                {/* Node icon dot */}
                <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-surface border-2 border-coral group-hover:scale-125 transition-transform" />

                <div className="p-4 bg-surface-alt border border-line space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-ink text-xs">{event.action}</span>
                    <span className="font-mono text-[10px] text-ink-muted">
                      {format(new Date(event.timestamp), "dd MMM yyyy, HH:mm")}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {event.description}
                  </p>
                  <div className="pt-1 text-[10px] text-ink-faint flex items-center gap-2">
                    <span>Officer: <strong className="text-ink">{event.actor.name}</strong></span>
                    <span>•</span>
                    <span>Role: {event.actor.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE & DOCUMENTS */}
      {activeTab === "documents" && (
        <div className="bg-surface border border-line p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <div>
              <h3 className="font-display font-bold text-base text-ink">
                Verified Evidentiary Records
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Notices, replies, affidavits, fee deposit receipts, and inspection reports catalogued under this case.
              </p>
            </div>

            {permissions.canUploadEvidence && (
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-3 py-2 bg-coral hover:bg-coral-hover text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Document (Simulated)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(caseData.documents || []).map((doc) => (
              <div key={doc.id} className="p-4 bg-surface-alt border border-line flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-coral shrink-0" />
                    <span className="font-bold text-ink line-clamp-1">{doc.name}</span>
                  </div>
                  <span className="text-[11px] text-ink-muted block">
                    Category: {doc.category} · Size: {doc.size}
                  </span>
                  <span className="text-[10px] font-mono text-ink-faint block">
                    Uploaded: {format(new Date(doc.uploadedAt), "dd MMM yyyy")} by {doc.uploadedBy}
                  </span>
                  {doc.remarks && (
                    <span className="text-[11px] text-ink italic block mt-1">"{doc.remarks}"</span>
                  )}
                </div>

                <button
                  onClick={() => toast.info(`Viewing simulated document: ${doc.name}`)}
                  className="p-1.5 border border-line hover:bg-surface text-coral font-bold shrink-0"
                  title="Download / View"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RELATED OVERLAPS */}
      {activeTab === "related" && (
        <div className="bg-surface border border-line p-6 space-y-6">
          <div className="pb-4 border-b border-line flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-ink">
                AI Cross-Bureau Related Inquiries
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Coordinated case matters across AICTE cells referencing the same institutional profile.
              </p>
            </div>
            <Link
              href="/overlaps"
              className="text-xs font-bold text-coral hover:underline flex items-center gap-1"
            >
              Open AI Overlap Studio →
            </Link>
          </div>

          {caseData.overlapSuggestions && caseData.overlapSuggestions.length > 0 ? (
            <div className="space-y-3">
              {caseData.overlapSuggestions.map((sug) => (
                <div key={sug.id} className="p-4 bg-surface-alt border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-coral font-bold">{sug.targetCaseId}</span>
                      <BureauChip bureau={sug.targetBureau} />
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-coral text-white font-mono">
                        {sug.confidence}% Match ({sug.confidenceTier})
                      </span>
                    </div>
                    <span className="font-bold text-ink block">{sug.targetCaseTitle || "Target Bureau Inquiry"}</span>
                    <span className="text-[11px] text-ink-muted block">
                      Target Status: {sug.targetStatus} · Review State: <strong>{sug.status}</strong>
                    </span>
                  </div>

                  <Link
                    href={`/complaints/${encodeURIComponent(sug.targetCaseId)}`}
                    className="px-3 py-1.5 border border-line hover:border-coral hover:text-coral font-bold text-xs shrink-0 self-start sm:self-auto"
                  >
                    Inspect Target Case →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-ink-muted">
              No overlapping complaints currently flagged for this case.
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD REMARK */}
      {remarkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in">
          <div className="w-full max-w-md bg-surface border border-line border-t-4 border-t-coral p-6 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-ink mb-1">
              Add Official Remark
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Notes are permanently timestamped into the case audit trail.
            </p>
            <form onSubmit={handleAddRemark} className="space-y-4 text-xs">
              <textarea
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                rows={4}
                placeholder="Enter formal observations, communication summary, or instruction..."
                className="w-full p-2.5 bg-surface-alt border border-line text-ink focus:border-coral outline-none resize-none font-sans"
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRemarkModalOpen(false)}
                  className="px-3 py-1.5 border border-line hover:bg-surface-alt font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-coral text-white font-bold hover:bg-coral-hover"
                >
                  Save Remark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REASSIGN */}
      {reassignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in">
          <div className="w-full max-w-lg bg-surface border border-line border-t-4 border-t-coral p-6 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-ink mb-1">
              Reassign Dealing Officer
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Transfer case handling responsibility to another officer. Workload meters update automatically.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">
                  Suggested Officers in {caseData.bureau} (Lowest Workload):
                </label>
                <div className="space-y-2 mb-3">
                  {suggestedOfficers.slice(0, 3).map((o) => (
                    <div
                      key={o.id}
                      onClick={() => setSelectedOfficerId(o.id)}
                      className={cn(
                        "p-2.5 border cursor-pointer flex items-center justify-between transition-colors",
                        selectedOfficerId === o.id
                          ? "bg-coral/10 border-coral font-bold"
                          : "border-line bg-surface-alt hover:bg-surface"
                      )}
                    >
                      <div>
                        <span className="font-bold text-ink block">{o.name}</span>
                        <span className="text-[10px] text-ink-muted">{o.designation}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-surface border border-line">
                        {o.activeCases} Active ({o.workloadPercentage}% load)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">
                  Or Select Any Officer:
                </label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-line text-xs font-sans text-ink focus:border-coral outline-none"
                >
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.bureau}) — Active: {off.activeCases} cases
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">
                  Reassignment Reason:
                </label>
                <textarea
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Workload balancing, specialized subject matter expertise..."
                  className="w-full p-2.5 bg-surface border border-line text-xs font-sans text-ink focus:border-coral outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-line">
                <button
                  onClick={() => setReassignModalOpen(false)}
                  className="px-3 py-1.5 border border-line hover:bg-surface-alt font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReassign}
                  className="px-4 py-1.5 bg-coral text-white font-bold hover:bg-coral-hover"
                >
                  Confirm Reassignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: STAGE ADVANCEMENT */}
      {stageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in">
          <div className="w-full max-w-md bg-surface border border-line border-t-4 border-t-coral p-6 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-ink mb-1">
              Advance Workflow Stage
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Progress the case along the statutory redressal lifecycle.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">
                  Current Stage: <strong className="text-coral">{caseData.currentStage}</strong>
                </label>
                <label className="font-bold text-ink block mt-2 mb-1">
                  Select New Stage:
                </label>
                <select
                  value={selectedNewStage}
                  onChange={(e) => setSelectedNewStage(e.target.value as CaseStage)}
                  className="w-full p-2.5 bg-surface border border-line text-xs font-sans text-ink focus:border-coral outline-none"
                >
                  <option value="SCREENING">Screening &amp; Preliminary Review</option>
                  <option value="UNDER_PROCESS">Under Process / Notice Issued</option>
                  <option value="IN_REVIEW">Institutional Hearing / In Review</option>
                  <option value="ACTION_REQUIRED">Action Required / Rectification Order</option>
                  <option value="RESOLVED">Resolved &amp; Compliance Verified</option>
                  <option value="CLOSED">Closed (Archived)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">
                  Stage Transition Note:
                </label>
                <textarea
                  value={stageTransitionNote}
                  onChange={(e) => setStageTransitionNote(e.target.value)}
                  rows={3}
                  placeholder="Summarize reasons or meeting minutes for this stage progression..."
                  className="w-full p-2.5 bg-surface border border-line text-xs font-sans text-ink focus:border-coral outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-line">
                <button
                  onClick={() => setStageModalOpen(false)}
                  className="px-3 py-1.5 border border-line hover:bg-surface-alt font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStageTransition}
                  className="px-4 py-1.5 bg-coral text-white font-bold hover:bg-coral-hover"
                >
                  Advance Stage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ESCALATE */}
      {escalateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in">
          <div className="w-full max-w-md bg-surface border border-line border-t-4 border-t-red-600 p-6 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-red-600 mb-1 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Confirm Case Escalation
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Escalation flags this case directly to the AICTE Member Secretary and Central Grievance Appellate Committee.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">
                  Grounds for Escalation *
                </label>
                <textarea
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  rows={3}
                  placeholder="Detail repeated institutional refusal to comply, expired show-cause windows, or emergency student welfare concerns..."
                  className="w-full p-2.5 bg-surface border border-line text-xs font-sans text-ink focus:border-red-600 outline-none resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-line">
                <button
                  onClick={() => setEscalateModalOpen(false)}
                  className="px-3 py-1.5 border border-line hover:bg-surface-alt font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEscalate}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Confirm Escalation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: RESOLVE */}
      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in">
          <div className="w-full max-w-md bg-surface border border-line border-t-4 border-t-emerald-600 p-6 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-emerald-600 mb-1 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Formally Dispose &amp; Close Case
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Confirm that institutional compliance has been verified or redressal order has been completed.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">
                  Disposal Findings &amp; Resolution Remarks:
                </label>
                <textarea
                  value={resolveRemarks}
                  onChange={(e) => setResolveRemarks(e.target.value)}
                  rows={3}
                  placeholder="State final orders, refund proofs verified, certificates returned, or compliance undertaken..."
                  className="w-full p-2.5 bg-surface border border-line text-xs font-sans text-ink focus:border-emerald-600 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-line">
                <button
                  onClick={() => setResolveModalOpen(false)}
                  className="px-3 py-1.5 border border-line hover:bg-surface-alt font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolve}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm Disposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: EVIDENCE UPLOAD */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in">
          <div className="w-full max-w-md bg-surface border border-line border-t-4 border-t-coral p-6 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-ink mb-1">
              Upload Case Evidence
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Simulated document ingestion with mock cryptographic verification.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">Select File (PDF / DOCX / JPG):</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full p-2 bg-surface-alt border border-line text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Document Category:</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-line text-xs text-ink focus:border-coral outline-none"
                >
                  <option value="Supporting Document">Supporting Document</option>
                  <option value="Notice">Official Show-Cause Notice</option>
                  <option value="Reply">Institutional Reply / Affidavit</option>
                  <option value="Report">Inquiry / Fact-Finding Report</option>
                  <option value="Fee Receipt">Fee Deposit / Refund Receipt</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Verification Remarks:</label>
                <input
                  type="text"
                  value={uploadRemarks}
                  onChange={(e) => setUploadRemarks(e.target.value)}
                  placeholder="e.g. Scanned bank transfer proof attested by registrar"
                  className="w-full p-2.5 bg-surface border border-line text-xs text-ink focus:border-coral outline-none"
                />
              </div>

              {isUploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-ink-muted">
                    <span>Simulating verification &amp; indexing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-alt overflow-hidden">
                    <div className="h-full bg-coral transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-3 py-1.5 border border-line hover:bg-surface-alt font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-1.5 bg-coral text-white font-bold hover:bg-coral-hover"
                >
                  {isUploading ? "Uploading..." : "Upload & Catalogue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
