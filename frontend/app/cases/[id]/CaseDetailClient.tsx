"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { prismApi } from "@/lib/api";
import { Case, CaseStatus } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BureauChip } from "@/components/ui/BureauChip";
import { CaseIdTag } from "@/components/ui/CaseIdTag";
import { Stepper } from "@/components/ui/Stepper";
import { SeverityMeter } from "@/components/ui/SeverityMeter";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
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
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface CaseDetailClientProps {
  caseId: string;
}

export function CaseDetailClient({ caseId }: CaseDetailClientProps) {
  const router = useRouter();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "documents" | "related">("overview");

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [disposeModalOpen, setDisposeModalOpen] = useState(false);

  // Form states for modals
  const [remarkText, setRemarkText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docCategory, setDocCategory] = useState<any>("Supporting Document");
  const [uploadRemarks, setUploadRemarks] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timeline filter
  const [timelineFilter, setTimelineFilter] = useState<string>("ALL");

  useEffect(() => {
    async function fetchCase() {
      setLoading(true);
      try {
        const data = await prismApi.getCaseById(caseId);
        setCaseData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [caseId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkText.trim() || !caseData) return;
    const updated = await prismApi.addCaseRemark(caseData.id, remarkText);
    setCaseData(updated);
    setRemarkText("");
    setRemarkModalOpen(false);
    showToast("Remark recorded in immutable audit trail.");
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !caseData) return;

    setIsUploading(true);
    setUploadProgress(30);

    setTimeout(async () => {
      setUploadProgress(75);
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
        showToast("Document verified and added to case evidence.");
      }, 400);
    }, 500);
  };

  const handleStatusChange = async (newStatus: CaseStatus, remark: string) => {
    if (!caseData) return;
    const updated = await prismApi.updateCaseStatus(caseData.id, newStatus, remark);
    setCaseData(updated);
    setTransferModalOpen(false);
    setDisposeModalOpen(false);
    showToast(`Case status updated to ${newStatus}.`);
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
        description={`We could not locate a case with identifier "${decodeURIComponent(caseId)}". It may have been archived or entered under a different Bureau code.`}
        actionText="Back to Cases Registry"
        onAction={() => router.push("/cases")}
      />
    );
  }

  const filteredTimeline = (caseData.timeline || []).filter((event) => {
    if (timelineFilter === "ALL") return true;
    return event.type === timelineFilter;
  });

  return (
    <div className="space-y-8 pb-32 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 right-8 z-50 p-4 px-6 bg-navy-block text-white border-l-4 border-coral shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-4">
          <Sparkles className="h-4 w-4 text-coral" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/60 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 1. CASE HEADER WITH WATERMARK */}
      <div className="relative pb-6 border-b border-line overflow-hidden">
        <span className="watermark-word -top-10 -left-6" aria-hidden="true">
          DOSSIER
        </span>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CaseIdTag id={caseData.id} />
              <BureauChip bureau={caseData.bureau} />
              <StatusBadge status={caseData.status} size="md" />
              <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-surface-alt text-ink-muted border border-line">
                {caseData.category}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-ink pt-1">
              Case Inquiry. <span className="text-coral italic font-black">Official dossier.</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted pt-1 font-sans">
              <span className="flex items-center gap-1.5 font-bold text-ink">
                <Building2 className="h-4 w-4 text-coral shrink-0" />
                <Link
                  href={`/institutions/${caseData.institutionId}`}
                  className="hover:text-coral underline underline-offset-4"
                >
                  {caseData.institutionName}
                </Link>
              </span>
              <span>·</span>
              <span className="font-mono text-xs font-bold text-ink-muted">AICTE ID: {caseData.aicteId}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-coral" />
                {caseData.extractedEntities.locations.join(", ") || "Campus"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <Link
              href={`/institutions/${caseData.institutionId}`}
              className="btn-navy"
            >
              <span>Institution Profile</span>
              <span className="btn-arrow">▸</span>
            </Link>
          </div>
        </div>

        {/* Stage Progress Stepper */}
        <div className="pt-6 mt-6 border-t border-line">
          <Stepper currentStage={caseData.currentStage} />
        </div>
      </div>

      {/* 2. OVERLAP CALLOUT IF FLAGGED */}
      {caseData.hasOverlap && (
        <div className="editorial-tile bg-navy-block text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden border-l-4 border-l-coral">
          {/* Subtle geometric circle accent */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-coral/10 pointer-events-none" aria-hidden="true" />

          <div className="flex items-start gap-4 z-10">
            <div className="h-10 w-10 bg-coral text-white flex items-center justify-center shrink-0">
              <GitMerge className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-bold text-base text-white block">
                Cross-Bureau Overlap Flagged — Inter-Bureau Co-referencing Active
              </span>
              <p className="text-xs text-white/80 mt-1 font-sans max-w-2xl leading-relaxed">
                AI cross-matching identified <strong className="text-white underline">{caseData.linkedCaseIds.length || 2} related cases</strong> for {caseData.institutionName} handled in parallel by other AICTE bureaus.
              </p>
            </div>
          </div>

          <Link
            href="/overlaps"
            className="btn-coral shrink-0 z-10"
          >
            <span>Review Overlaps Graph</span>
            <span className="btn-arrow">▸</span>
          </Link>
        </div>
      )}

      {/* 3. TABS NAVIGATION WITH 3PX CORAL UNDERLINE */}
      <div className="flex items-center gap-2 border-b border-line text-xs font-bold uppercase tracking-wider overflow-x-auto">
        {(["overview", "history", "documents", "related"] as const).map((tab) => {
          const isActive = activeTab === tab;
          const labels = {
            overview: "Case Overview",
            history: `Audit Trail & History (${caseData.timeline?.length || 0})`,
            documents: `Evidence Documents (${caseData.documents?.length || 0})`,
            related: `Linked Overlaps (${caseData.linkedCaseIds.length || 0})`,
          };

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "py-3.5 px-4 transition-all relative whitespace-nowrap",
                isActive
                  ? "text-ink"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <span>{labels[tab]}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-coral" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB A: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Disposal Countdown, Bureau Desk, Seriousness Meter */}
          <div className="lg:col-span-5 space-y-6">
            {/* Disposal Days Remaining Card */}
            <div className="editorial-tile bg-surface p-6 relative overflow-hidden flex items-center justify-between">
              <span className="tile-index-tag">01</span>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-ink-muted block">
                  TARGET DISPOSAL WINDOW
                </span>
                <div className="mt-2 relative inline-block">
                  <div className="coral-band-behind w-16" />
                  <span className="font-display font-black text-6xl text-ink tabular-nums relative z-10">
                    {caseData.daysRemaining > 0 ? caseData.daysRemaining : 0}
                  </span>
                </div>
                <span className="text-xs font-bold text-ink-muted block mt-1">
                  Days Remaining · SLA Target
                </span>
                <span className="text-[11px] text-ink-muted block mt-1 font-mono">
                  Expected by: {format(new Date(caseData.dueDate), "dd MMM yyyy")}
                </span>
              </div>

              {/* Status pill or icon */}
              <div className="h-14 w-14 bg-navy-block text-white flex items-center justify-center font-mono text-sm font-bold">
                {caseData.daysRemaining > 0 ? `${caseData.daysRemaining}D` : "0D"}
              </div>
            </div>

            {/* Officer & Bureau Desk Card */}
            <div className="editorial-tile bg-surface p-6 space-y-4 relative">
              <span className="tile-index-tag">02</span>
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-ink-muted">
                ADMINISTRATIVE OWNERSHIP
              </h3>

              <div className="space-y-3.5 text-xs font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-line">
                  <span className="text-ink-muted">Handling Bureau</span>
                  <span className="font-bold text-ink">
                    {caseData.bureauName} ({caseData.bureau})
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-line">
                  <span className="text-ink-muted">Dealing Officer</span>
                  <div className="flex items-center gap-2">
                    <img
                      src={caseData.assignedOfficer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                      alt={caseData.assignedOfficer.name}
                      className="h-6 w-6 object-cover border border-line"
                    />
                    <span className="font-bold text-ink">
                      {caseData.assignedOfficer.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-line">
                  <span className="text-ink-muted">Date of Receipt</span>
                  <span className="font-mono font-bold text-ink">
                    {format(new Date(caseData.dateOfReceipt), "dd MMM yyyy, hh:mm a")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Evidence Status</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 border",
                      caseData.evidenceVerified === "verified"
                        ? "bg-[#1E8E4E] text-white border-[#1E8E4E]"
                        : "bg-[#E8A317] text-white border-[#E8A317]"
                    )}
                  >
                    {caseData.evidenceVerified} by Officer
                  </span>
                </div>
              </div>
            </div>

            {/* AI Seriousness Meter */}
            <div className="editorial-tile bg-surface p-6 relative">
              <span className="tile-index-tag">03</span>
              <SeverityMeter score={caseData.seriousnessScore} />
            </div>
          </div>

          {/* Right Column (7 cols): Full Description, AI Summary, Extracted Entities */}
          <div className="lg:col-span-7 space-y-6 font-sans">
            {/* Full Complaint Statement */}
            <div className="editorial-tile bg-surface p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-ink-muted">
                  REGISTERED GRIEVANCE STATEMENT
                </h3>
                <span className="text-[11px] text-ink-muted">
                  Filed by: <strong className="text-ink uppercase">{caseData.complainantType}</strong>
                </span>
              </div>

              <h2 className="font-display font-bold text-xl sm:text-2xl text-ink leading-snug">
                {caseData.title}
              </h2>

              <p className="text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-line bg-surface-alt p-5 border border-line">
                {caseData.description}
              </p>
            </div>

            {/* AI-Generated Executive Summary Box (Solid Navy Tile) */}
            <div className="editorial-tile bg-navy-block text-white p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-[10px] font-bold tracking-widest uppercase text-coral flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI EXECUTIVE SYNTHESIS
                </span>
                <span className="text-[9px] font-mono text-white/60 uppercase">
                  Multi-vector NLP Model
                </span>
              </div>

              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
                {caseData.aiSummary}
              </p>
            </div>

            {/* Extracted Entities Chips */}
            <div className="editorial-tile bg-surface p-6 space-y-4">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-ink-muted">
                EXTRACTED ENTITIES &amp; REGULATORY KEYWORDS
              </h3>

              <div className="space-y-4 text-xs">
                {caseData.extractedEntities.monetaryClaims && (
                  <div>
                    <span className="text-[11px] text-ink-muted block mb-1 uppercase font-bold">
                      Monetary Claim / Levy:
                    </span>
                    <span className="px-3 py-1 bg-surface-alt text-ink font-mono font-bold border border-line inline-block">
                      {caseData.extractedEntities.monetaryClaims}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-[11px] text-ink-muted block mb-2 uppercase font-bold">
                    Legal &amp; Compliance Key Phrases:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {caseData.extractedEntities.issueKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-surface text-ink text-xs font-bold border border-line hover:border-coral transition-colors"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: AUDIT TRAIL / TIMELINE */}
      {activeTab === "history" && (
        <div className="editorial-tile bg-surface p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-navy-block text-coral">
                <Lock className="h-4 w-4 stroke-[2]" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-ink flex items-center gap-2">
                  Immutable Audit Trail
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1E8E4E] text-white">
                    Cryptographically Logged
                  </span>
                </h3>
                <p className="text-xs text-ink-muted font-sans mt-0.5">
                  Chronological record of statutory notices, transfers, hearings, and compliance findings
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timelineFilter}
                onChange={(e) => setTimelineFilter(e.target.value)}
                className="h-10 px-3 border border-line bg-surface text-xs font-semibold text-ink focus:border-coral"
              >
                <option value="ALL">All Events</option>
                <option value="NOTICE_ISSUED">Notices Issued</option>
                <option value="TRANSFER">Bureau Transfers</option>
                <option value="CLARIFICATION">Institution Clarifications</option>
                <option value="REMARK">Official Remarks</option>
              </select>

              <button
                onClick={() => showToast("Exporting immutable timeline audit trail as signed PDF...")}
                className="btn-navy h-10 px-4 text-xs"
              >
                <Download className="h-3.5 w-3.5 text-coral" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Vertical Timeline Nodes with 3px line and square nodes */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-[3px] before:bg-line">
            {filteredTimeline.map((item, idx) => {
              const isNextAction = item.type === "NEXT_ACTION";
              const isTransfer = item.type === "TRANSFER";

              return (
                <div key={item.id} className="relative group">
                  {/* Square node */}
                  <div
                    className={cn(
                      "absolute -left-6 sm:-left-8 top-1.5 h-3.5 w-3.5 transition-all",
                      isNextAction
                        ? "bg-coral ring-4 ring-coral/20 animate-pulse"
                        : isTransfer
                        ? "bg-[#6D4AC7]"
                        : "bg-navy-block"
                    )}
                  />

                  {/* Timeline Entry Tile */}
                  <div
                    className={cn(
                      "p-5 border transition-all text-xs space-y-2 font-sans",
                      isTransfer
                        ? "bg-surface-alt border-[#6D4AC7]/40"
                        : isNextAction
                        ? "bg-surface border-coral border-l-4"
                        : "bg-surface border-line hover:border-coral"
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-ink-muted">
                      <span className="font-bold text-ink">
                        {item.actor.name} ({item.actor.role})
                      </span>
                      <span className="font-mono text-ink-muted">
                        {format(new Date(item.timestamp), "dd MMM yyyy, hh:mm a")}
                      </span>
                    </div>

                    <h4 className="font-bold text-ink text-sm">
                      {item.action}
                    </h4>

                    <p className="text-ink-muted leading-relaxed">
                      {item.description}
                    </p>

                    {item.document && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-surface-alt text-ink text-[11px] font-semibold border border-line">
                        <FileText className="h-3.5 w-3.5 text-coral" />
                        <span>{item.document.name}</span>
                        <span className="text-ink-muted font-mono">({item.document.size})</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB C: DOCUMENTS & EVIDENCE */}
      {activeTab === "documents" && (
        <div className="space-y-6 font-sans">
          <div className="editorial-tile bg-surface p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <h3 className="font-display font-black text-xl text-ink">
                  Case Documents &amp; Verified Evidence
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Legal notices, institution counter-replies, and compliance affidavits
                </p>
              </div>

              <button
                onClick={() => setUploadModalOpen(true)}
                className="btn-coral h-10 text-xs"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload New Evidence</span>
                <span className="btn-arrow">▸</span>
              </button>
            </div>

            {/* Document Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {(caseData.documents || []).map((doc) => (
                <div
                  key={doc.id}
                  className="editorial-tile bg-surface p-5 border border-line hover:border-coral transition-colors flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-3 bg-navy-block text-white shrink-0">
                      <FileText className="h-4 w-4 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-ink block truncate text-sm">
                        {doc.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-ink-muted">
                        <span className="font-mono font-bold">{doc.size}</span>
                        <span>·</span>
                        <span>{doc.category}</span>
                      </div>
                      {doc.remarks && (
                        <p className="mt-1 text-[11px] text-ink-muted italic">
                          &quot;{doc.remarks}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {doc.verified ? (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-[#1E8E4E] text-white">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-[#E8A317] text-white">
                        Pending
                      </span>
                    )}
                    <button
                      onClick={() => showToast(`Downloading ${doc.name}...`)}
                      className="btn-tertiary text-xs mt-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB D: RELATED / OVERLAPS */}
      {activeTab === "related" && (
        <div className="editorial-tile bg-surface p-6 sm:p-8 space-y-4 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
            <div>
              <h3 className="font-display font-black text-xl text-ink">
                Connected Cases Across AICTE Bureaus
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                AI cross-referenced cases sharing the same institution identifier ({caseData.aicteId})
              </p>
            </div>
            <Link
              href="/overlaps"
              className="btn-tertiary text-xs font-bold"
            >
              Open Full Relationship Graph ▸
            </Link>
          </div>

          <div className="space-y-3 mt-3">
            {caseData.overlapSuggestions.map((sug) => (
              <div
                key={sug.id}
                className="editorial-tile bg-surface p-5 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <CaseIdTag id={sug.targetCaseId} />
                    <BureauChip bureau={sug.targetBureau} />
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-coral text-white">
                      {sug.confidence}% Match
                    </span>
                  </div>
                  <h4 className="font-bold text-ink mt-2 text-sm">
                    {sug.targetCaseTitle}
                  </h4>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    Category: {sug.targetCategory} · Status: {sug.targetStatus}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Link
                    href={`/cases/${encodeURIComponent(sug.targetCaseId)}`}
                    className="btn-navy h-9 px-4 text-xs"
                  >
                    Compare Case
                  </Link>
                  <Link
                    href="/overlaps"
                    className="btn-coral h-9 px-4 text-xs"
                  >
                    Review Decision
                    <span className="btn-arrow">▸</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-surface border-t-2 border-line py-3.5 px-6 sm:px-10 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-ink uppercase tracking-wider hidden sm:inline font-sans text-xs">
              Actions for {caseData.id}:
            </span>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="btn-coral h-10 px-5 text-xs"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Evidence</span>
              <span className="btn-arrow">▸</span>
            </button>
            <button
              onClick={() => setRemarkModalOpen(true)}
              className="btn-navy h-10 px-5 text-xs"
            >
              <MessageSquare className="h-3.5 w-3.5 text-coral" />
              <span>Add Remark</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setTransferModalOpen(true)}
              className="btn-navy h-10 px-5 text-xs text-[#6D4AC7] border border-[#6D4AC7]"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Transfer to RB / Cell</span>
            </button>
            <button
              onClick={() => setDisposeModalOpen(true)}
              className="h-10 px-6 bg-[#1E8E4E] hover:bg-[#16703D] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Mark Disposed</span>
            </button>
          </div>
        </div>
      </div>

      {/* UPLOAD EVIDENCE MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-block/80 animate-in fade-in">
          <div className="w-full max-w-lg bg-surface border-t-4 border-t-coral border-x border-b border-line shadow-2xl p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-display font-black text-xl text-ink">
                Upload Case Evidence / <span className="text-coral italic">Document.</span>
              </h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-ink-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-sans">
              <div
                className="p-6 border-2 border-dashed border-line hover:border-coral bg-surface-alt text-center space-y-2 cursor-pointer transition-colors"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <div className="h-10 w-10 mx-auto bg-navy-block text-coral flex items-center justify-center">
                  <FilePlus className="h-5 w-5 stroke-[2]" />
                </div>
                <div>
                  <span className="font-bold text-ink block">
                    {selectedFile ? selectedFile.name : "Tap to select document from device"}
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    PDF, JPG, PNG — Up to 10 MB per file
                  </span>
                </div>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Document Classification
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full h-11 px-3 border border-line bg-surface text-ink font-semibold focus:border-coral"
                >
                  <option value="Supporting Document">Supporting Document</option>
                  <option value="Notice">Official Show Cause Notice</option>
                  <option value="Reply">Institution Counter Reply</option>
                  <option value="Report">Inspection Verification Report</option>
                  <option value="Affidavit">Signed Student Affidavit</option>
                  <option value="Fee Receipt">Fee Receipt / Financial Ledger</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Verification Remarks &amp; Context
                </label>
                <textarea
                  rows={3}
                  value={uploadRemarks}
                  onChange={(e) => setUploadRemarks(e.target.value)}
                  placeholder="Enter context, certifying authority, or paragraph references..."
                  className="editorial-input w-full p-3 h-auto"
                />
              </div>

              {isUploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-ink-muted font-bold font-mono">
                    <span>Uploading and hashing document...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-alt overflow-hidden">
                    <div className="h-full bg-coral transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="btn-navy h-10 px-5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="btn-coral h-10 px-5 text-xs disabled:opacity-50"
                >
                  <span>Confirm Upload</span>
                  <span className="btn-arrow">▸</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REMARK MODAL */}
      {remarkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-block/80 animate-in fade-in">
          <div className="w-full max-w-md bg-surface border-t-4 border-t-coral border-x border-b border-line shadow-2xl p-8 space-y-4">
            <h3 className="font-display font-black text-xl text-ink">
              Record Official Case <span className="text-coral italic">Remark.</span>
            </h3>
            <p className="text-xs text-ink-muted font-sans">
              This remark will be stamped into the immutable audit trail along with your credentials.
            </p>
            <form onSubmit={handleAddRemark} className="space-y-3.5 font-sans">
              <textarea
                rows={4}
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter formal procedural note or order details..."
                className="editorial-input w-full p-3 h-auto"
                required
              />
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRemarkModalOpen(false)}
                  className="btn-navy h-10 px-5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-coral h-10 px-5 text-xs"
                >
                  <span>Save Remark</span>
                  <span className="btn-arrow">▸</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSFER MODAL */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-block/80 animate-in fade-in">
          <div className="w-full max-w-md bg-surface border-t-4 border-t-coral border-x border-b border-line shadow-2xl p-8 space-y-4">
            <h3 className="font-display font-black text-xl text-ink">
              Inter-Bureau Case <span className="text-coral italic">Transfer.</span>
            </h3>
            <p className="text-xs text-ink-muted font-sans">
              Reassign jurisdiction of this grievance across AICTE operational divisions.
            </p>
            <div className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Destination Bureau
                </label>
                <select className="w-full h-11 px-3 border border-line bg-surface text-ink font-semibold focus:border-coral">
                  <option>Regulation Bureau (RB) — Statutory Norms</option>
                  <option>Approval Bureau (APP) — Affiliation Check</option>
                  <option>Academic Bureau (ACA) — Curriculum &amp; Faculty</option>
                  <option>Northern Regional Office (NRO Kanpur)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Transfer Justification
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify administrative rationale for transfer..."
                  className="editorial-input w-full p-3 h-auto"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferModalOpen(false)}
                  className="btn-navy h-10 px-5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("UNDER_PROCESS", "Transferred to Regulation Bureau for norms verification.")}
                  className="btn-coral h-10 px-5 text-xs"
                >
                  <span>Authorize Transfer</span>
                  <span className="btn-arrow">▸</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISPOSE MODAL */}
      {disposeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-block/80 animate-in fade-in">
          <div className="w-full max-w-md bg-surface border-t-4 border-t-[#1E8E4E] border-x border-b border-line shadow-2xl p-8 space-y-4">
            <h3 className="font-display font-black text-xl text-ink">
              Formal Case <span className="text-[#1E8E4E] italic">Disposal.</span>
            </h3>
            <p className="text-xs text-ink-muted font-sans">
              Certify closure of this grievance following satisfactory redressal or institutional penalty enforcement.
            </p>
            <div className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Disposal Order Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. AICTE/PGRC/DISP/2026/089"
                  className="editorial-input w-full"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Final Resolution Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="State final finding, refund issued, or inspection confirmation..."
                  className="editorial-input w-full p-3 h-auto"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDisposeModalOpen(false)}
                  className="btn-navy h-10 px-5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("DISPOSED", "Case resolved and closed under approval of Member Secretary.")}
                  className="h-10 px-6 bg-[#1E8E4E] hover:bg-[#16703D] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Execute Disposal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
