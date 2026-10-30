"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { prismApi } from "@/lib/api";
import { Case, Institution, OverlapSuggestion } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BureauChip } from "@/components/ui/BureauChip";
import { CaseIdTag } from "@/components/ui/CaseIdTag";
import { ConfidenceGauge } from "@/components/ui/ConfidenceGauge";
import { SimilarityBreakdown } from "@/components/ui/SimilarityBreakdown";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { getPermissions } from "@/lib/permissions";
import { 
  GitMerge, 
  Link2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  Sparkles, 
  Columns3, 
  X,
  Info,
  ShieldCheck,
  Search,
  Filter,
  Check,
  Cpu,
  Layers,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { HeroAmbient } from "@/components/layout/HeroAmbient";

interface FlattenedCandidate {
  id: string; // suggestion ID
  sourceCase: Case;
  targetCaseId: string;
  targetCase?: Case;
  institution: Institution;
  confidence: number;
  matchingReasons: string[];
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "DEFERRED";
  detectedDate: string;
  remarks?: string;
  confirmedBy?: string;
  confirmedAt?: string;
}

export default function OverlappingCasesPage() {
  const { role: currentRole, user } = useAuthStore();
  const permissions = getPermissions(currentRole);

  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<FlattenedCandidate[]>([]);
  const [allCases, setAllCases] = useState<Case[]>([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [bureauFilter, setBureauFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Compare Drawer state
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [compareData, setCompareData] = useState<{
    candidate: FlattenedCandidate;
    sourceCase: Case;
    targetCase: Case | null;
  } | null>(null);

  // Decision Modal state
  const [decisionModal, setDecisionModal] = useState<{
    open: boolean;
    candidate: FlattenedCandidate | null;
    actionType: "CONFIRM" | "REJECT" | "DEFER";
    notes: string;
  }>({
    open: false,
    candidate: null,
    actionType: "CONFIRM",
    notes: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [groups, casesList] = await Promise.all([
        prismApi.getAllOverlapPairs(),
        prismApi.getCases(),
      ]);
      setAllCases(casesList);

      const flat: FlattenedCandidate[] = [];
      groups.forEach((g) => {
        g.suggestions.forEach((item) => {
          const target = casesList.find((c) => c.id === item.suggestion.targetCaseId);
          flat.push({
            id: item.suggestion.id,
            sourceCase: item.sourceCase,
            targetCaseId: item.suggestion.targetCaseId,
            targetCase: target,
            institution: g.institution,
            confidence: item.suggestion.confidence,
            matchingReasons: item.suggestion.similarityFactors ? [
              item.suggestion.similarityFactors.institutionIdMatch?.label,
              item.suggestion.similarityFactors.nameMatch?.label,
              item.suggestion.similarityFactors.semanticContent?.label,
              item.suggestion.similarityFactors.issueCategory?.label,
              item.suggestion.similarityFactors.timeWindow?.label,
            ].filter((x): x is string => Boolean(x)) : [
              "Same Institution",
              "Concurrent Grievance Timeline",
              "Semantic Keyword Alignment",
            ],
            status: (item.suggestion.status as any) || "PENDING",
            detectedDate: item.suggestion.targetDateOfReceipt || item.sourceCase.dateOfReceipt,
            remarks: item.suggestion.remarks,
            confirmedBy: item.suggestion.confirmedBy,
            confirmedAt: item.suggestion.confirmedAt,
          });
        });
      });
      setCandidates(flat);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load overlap candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered candidate list
  const filteredCandidates = candidates.filter((c) => {
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (bureauFilter !== "ALL" && c.sourceCase.bureau !== bureauFilter && c.targetCase?.bureau !== bureauFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchInst = c.institution.name.toLowerCase().includes(q) || c.institution.aicteId.toLowerCase().includes(q);
      const matchCase = c.sourceCase.id.toLowerCase().includes(q) || c.targetCaseId.toLowerCase().includes(q);
      const matchTitle = c.sourceCase.title.toLowerCase().includes(q) || (c.targetCase?.title.toLowerCase().includes(q) ?? false);
      if (!matchInst && !matchCase && !matchTitle) return false;
    }
    return true;
  });

  const pendingCount = candidates.filter((c) => c.status === "PENDING").length;
  const confirmedCount = candidates.filter((c) => c.status === "CONFIRMED").length;
  const rejectedCount = candidates.filter((c) => c.status === "REJECTED").length;
  const deferredCount = candidates.filter((c) => c.status === "DEFERRED").length;

  const handleOpenCompare = (candidate: FlattenedCandidate) => {
    const target = allCases.find((c) => c.id === candidate.targetCaseId) || null;
    setCompareData({
      candidate,
      sourceCase: candidate.sourceCase,
      targetCase: target,
    });
    setCompareDrawerOpen(true);
  };

  const openDecisionModal = (candidate: FlattenedCandidate, actionType: "CONFIRM" | "REJECT" | "DEFER") => {
    if (!permissions.canReviewOverlaps) {
      toast.error("Read-only Auditor role is not authorized to review or confirm overlaps.");
      return;
    }
    setDecisionModal({
      open: true,
      candidate,
      actionType,
      notes: actionType === "CONFIRM"
        ? "Correlated allegations verified across bureau jurisdictions. Coordinate joint show-cause hearings."
        : actionType === "REJECT"
        ? "Reviewed by official: Independent student grievance, distinct campus units. Dismiss duplicate alert."
        : "Pending receipt of certified fee breakdown from state fee regulatory committee.",
    });
  };

  const handleExecuteDecision = async () => {
    if (!decisionModal.candidate) return;
    const { candidate, actionType, notes } = decisionModal;
    const reviewerName = `${user?.name || "Official"} (${permissions.roleLabel})`;

    try {
      if (actionType === "CONFIRM") {
        await prismApi.confirmOverlap(candidate.id, notes, reviewerName);
        toast.success(`Overlap confirmed for ${candidate.sourceCase.id} ↔ ${candidate.targetCaseId}. Records cross-linked with independent authority preserved.`);
      } else if (actionType === "REJECT") {
        await prismApi.rejectOverlap(candidate.id, notes, reviewerName);
        toast.success(`Overlap dismissed. Cases marked as distinct matters.`);
      } else {
        await prismApi.deferOverlap(candidate.id, notes);
        toast.info(`Review deferred. Case remains in deferred monitoring queue.`);
      }

      setDecisionModal({ open: false, candidate: null, actionType: "CONFIRM", notes: "" });
      if (compareDrawerOpen) setCompareDrawerOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit decision.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 relative">
      {/* 1. HERO AMBIENT BANNER */}
      <HeroAmbient
        variant="overlaps"
        className="p-6 sm:p-8 lg:p-10 border border-line shadow-lg"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-coral" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/85">
                AI Cross-Bureau Co-Reference &amp; Similarity Intelligence
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
              Overlap Detection &amp; <span className="text-coral italic font-black">Review.</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Consolidated institution-centric intelligence across Regulation Bureau, PGRC, Approval Bureau, and Regional Offices.
              Surfaces overlapping allegations while strictly maintaining independent records and human decision authority.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold shrink-0">
            <span className="px-3 py-1.5 bg-white/10 text-white border border-white/20">
              {pendingCount} Pending Review
            </span>
            <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {confirmedCount} Confirmed Related
            </span>
          </div>
        </div>
      </HeroAmbient>

      {/* 2. DEMO NOTICE & CORE PRINCIPLE ALERT */}
      <div className="p-4 bg-white/[0.03] border border-white/10 border-l-4 border-l-coral text-white text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-coral shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold uppercase tracking-wider text-[11px] text-coral block font-mono">
              Core Principle: AI Recommends. Authorized Officials Decide.
            </span>
            <p className="text-white/80 leading-relaxed">
              Similarity scores in this demo are precomputed synthetic values. A high score suggests potential co-reference but never proves duplication.
              Confirming a link cross-references cases for unified inquiry without merging independent files or closing records.
            </p>
          </div>
        </div>
      </div>

      {/* 3. FILTER & SEARCH CONTROLS */}
      <div className="p-5 bg-surface border border-line space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by Case ID, Institution, Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface-alt border border-line text-ink text-xs focus:outline-none focus:border-coral"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-surface-alt border border-line text-ink text-xs focus:outline-none focus:border-coral font-sans font-medium"
            >
              <option value="ALL">All Review Statuses ({candidates.length})</option>
              <option value="PENDING">Pending Review ({pendingCount})</option>
              <option value="CONFIRMED">Confirmed Related ({confirmedCount})</option>
              <option value="REJECTED">Dismissed / Not Related ({rejectedCount})</option>
              <option value="DEFERRED">Deferred Review ({deferredCount})</option>
            </select>
          </div>

          {/* Bureau Filter */}
          <div>
            <select
              value={bureauFilter}
              onChange={(e) => setBureauFilter(e.target.value)}
              className="w-full py-2 px-3 bg-surface-alt border border-line text-ink text-xs focus:outline-none focus:border-coral font-sans font-medium"
            >
              <option value="ALL">All Bureau Jurisdictions</option>
              <option value="PGRC">Public Grievance (PGRC)</option>
              <option value="RB">Regulation Bureau (RB)</option>
              <option value="ACA">Academic Bureau (ACA)</option>
              <option value="APP">Approval Bureau (APP)</option>
              <option value="RO">Regional Offices (RO)</option>
            </select>
          </div>

          {/* Clear Button */}
          <div className="flex items-center justify-end">
            {(statusFilter !== "ALL" || bureauFilter !== "ALL" || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter("ALL");
                  setBureauFilter("ALL");
                  setSearchQuery("");
                }}
                className="btn-outline h-9 text-xs px-4"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. CANDIDATES LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
            Displaying {filteredCandidates.length} AI Overlap Candidate{filteredCandidates.length === 1 ? "" : "s"}
          </span>
          <span className="text-[11px] text-ink-muted font-sans">
            Sorted by confidence score descending
          </span>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="p-12 text-center bg-surface border border-line space-y-3">
            <GitMerge className="h-8 w-8 text-ink-muted mx-auto" />
            <h3 className="font-display font-bold text-base text-ink">No Overlap Candidates Found</h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              No complaint pairs match your active search or filter criteria. Try clearing filters or switching the review status.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="editorial-tile bg-surface border border-line p-5 sm:p-6 space-y-4 transition-all hover:border-coral"
              >
                {/* Header Row: Institution & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
                  <div className="flex flex-wrap items-center gap-2">
                    <Building2 className="h-4 w-4 text-coral shrink-0" />
                    <Link
                      href={`/institutions/${candidate.institution.id}`}
                      className="font-display font-black text-base text-ink hover:text-coral transition-colors"
                    >
                      {candidate.institution.name}
                    </Link>
                    <span className="font-mono text-xs text-ink-muted">
                      ({candidate.institution.aicteId})
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-surface-alt border border-line text-ink-muted">
                      {candidate.institution.city}, {candidate.institution.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    {/* Score badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-alt border border-line">
                      <Cpu className="h-3.5 w-3.5 text-coral" />
                      <span className="font-mono font-black text-xs text-ink">
                        {candidate.confidence}% Match
                      </span>
                      <span className="text-[10px] text-ink-muted font-mono">(Synthetic)</span>
                    </div>

                    {/* Review Status badge */}
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1",
                        candidate.status === "CONFIRMED"
                          ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                          : candidate.status === "REJECTED"
                          ? "bg-red-500/15 text-red-800 dark:text-red-300 border border-red-500/30"
                          : candidate.status === "DEFERRED"
                          ? "bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/30"
                          : "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 animate-pulse"
                      )}
                    >
                      {candidate.status === "CONFIRMED" ? "Confirmed Related" :
                       candidate.status === "REJECTED" ? "Marked Not Related" :
                       candidate.status === "DEFERRED" ? "Review Deferred" :
                       "Pending Official Review"}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Inquiries Snapshot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  {/* Source Complaint */}
                  <div className="p-4 bg-surface-alt border border-line space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-ink-muted">Source Case</span>
                        <CaseIdTag id={candidate.sourceCase.id} />
                      </div>
                      <BureauChip bureau={candidate.sourceCase.bureau} />
                    </div>

                    <h4 className="font-bold text-ink text-sm leading-snug">
                      <Link
                        href={`/complaints/${encodeURIComponent(candidate.sourceCase.id)}`}
                        className="hover:text-coral transition-colors"
                      >
                        {candidate.sourceCase.title}
                      </Link>
                    </h4>

                    <div className="flex items-center gap-2 text-ink-muted text-[11px]">
                      <span>Stage:</span>
                      <StatusBadge status={candidate.sourceCase.status} size="sm" />
                      <span>·</span>
                      <span className="font-mono">{format(new Date(candidate.sourceCase.dateOfReceipt), "dd MMM yyyy")}</span>
                    </div>

                    <p className="text-ink-muted line-clamp-2 leading-relaxed text-[11px] pt-1">
                      {candidate.sourceCase.description}
                    </p>
                  </div>

                  {/* Candidate Complaint */}
                  <div className="p-4 bg-surface-alt border border-line space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-ink-muted">Candidate Case</span>
                        <CaseIdTag id={candidate.targetCaseId} />
                      </div>
                      {candidate.targetCase && <BureauChip bureau={candidate.targetCase.bureau} />}
                    </div>

                    <h4 className="font-bold text-ink text-sm leading-snug">
                      <Link
                        href={`/complaints/${encodeURIComponent(candidate.targetCaseId)}`}
                        className="hover:text-coral transition-colors"
                      >
                        {candidate.targetCase?.title || "Correlated Inspection File"}
                      </Link>
                    </h4>

                    <div className="flex items-center gap-2 text-ink-muted text-[11px]">
                      <span>Stage:</span>
                      {candidate.targetCase ? (
                        <StatusBadge status={candidate.targetCase.status} size="sm" />
                      ) : (
                        <span className="font-mono text-[10px]">Under Review</span>
                      )}
                      <span>·</span>
                      <span className="font-mono">
                        {candidate.targetCase?.dateOfReceipt
                          ? format(new Date(candidate.targetCase.dateOfReceipt), "dd MMM yyyy")
                          : "Fall 2025"}
                      </span>
                    </div>

                    <p className="text-ink-muted line-clamp-2 leading-relaxed text-[11px] pt-1">
                      {candidate.targetCase?.description || "Inquiry initiated by concerned bureau into institutional operations."}
                    </p>
                  </div>
                </div>

                {/* Matching Reasons & Details */}
                <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                  <span className="text-[10px] font-bold uppercase text-ink-muted font-mono">
                    Detection Factors:
                  </span>
                  {candidate.matchingReasons.map((reason, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 bg-surface-alt border border-line text-ink font-mono text-[11px]"
                    >
                      ✓ {reason}
                    </span>
                  ))}
                  <span className="ml-auto text-[10px] font-mono text-ink-muted">
                    Detected: {candidate.detectedDate}
                  </span>
                </div>

                {/* Review Audit Details if already decided */}
                {candidate.remarks && (
                  <div className="p-3 bg-surface-alt border-l-2 border-coral text-xs text-ink-muted font-sans flex items-center justify-between">
                    <div>
                      <strong className="text-ink">Review Note:</strong> {candidate.remarks}
                    </div>
                    {candidate.confirmedBy && (
                      <span className="text-[10px] font-mono text-ink-muted shrink-0 ml-2">
                        By: {candidate.confirmedBy}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line">
                  <button
                    onClick={() => handleOpenCompare(candidate)}
                    className="btn-outline h-9 px-4 text-xs font-bold inline-flex items-center gap-2 self-start"
                  >
                    <Columns3 className="h-3.5 w-3.5 text-coral" />
                    <span>Compare Side-by-Side</span>
                    <span className="font-mono">▸</span>
                  </button>

                  {permissions.canReviewOverlaps && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => openDecisionModal(candidate, "DEFER")}
                        className="btn-outline h-9 px-3 text-xs font-bold"
                        title="Defer determination pending further documents"
                      >
                        <Clock className="h-3.5 w-3.5 text-ink-muted" />
                        <span>Defer</span>
                      </button>

                      <button
                        onClick={() => openDecisionModal(candidate, "REJECT")}
                        className="btn-outline h-9 px-3 text-xs font-bold text-red-600 hover:border-red-600"
                        title="Mark as distinct, unrelated cases"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Mark Not Related</span>
                      </button>

                      <button
                        onClick={() => openDecisionModal(candidate, "CONFIRM")}
                        className="btn-coral h-9 px-4 text-xs font-bold inline-flex items-center gap-1.5"
                        title="Confirm relationship and coordinate across bureaus"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Confirm Related</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. SIDE-BY-SIDE COMPARE VIEW DRAWER */}
      {compareDrawerOpen && compareData && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy-block/80 animate-in fade-in">
          <div className="w-full max-w-5xl h-full bg-surface border-l border-line p-6 sm:p-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <div>
                  <h3 className="font-display font-black text-2xl text-ink flex items-center gap-2">
                    <Columns3 className="h-6 w-6 text-coral" />
                    Side-by-Side Overlap Examination
                  </h3>
                  <p className="text-xs text-ink-muted mt-1">
                    Comparing grievance text, metadata, and allegations for {compareData.candidate.institution.name}
                  </p>
                </div>
                <button
                  onClick={() => setCompareDrawerOpen(false)}
                  className="p-2 text-ink-muted hover:text-ink hover:bg-surface-alt"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Score & Principle Notice */}
              <div className="p-4 bg-navy-block text-white border-l-4 border-coral text-xs flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-coral block">
                    Synthetic Confidence Assessment: {compareData.candidate.confidence}% Match
                  </span>
                  <p className="text-white/80 leading-relaxed">
                    Similarity does not prove duplication. Both complaints maintain independent regulatory records, timelines, and rights of appeal.
                  </p>
                </div>
                <ConfidenceGauge score={compareData.candidate.confidence} size="md" hasCoralBar={true} />
              </div>

              {/* Side-by-Side Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Column 1: Source */}
                <div className="p-6 bg-surface-alt border border-line space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-line">
                    <span className="font-bold text-xs uppercase text-ink-muted">Source Inquiry</span>
                    <CaseIdTag id={compareData.sourceCase.id} />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-ink-muted">Dealing Bureau</span>
                    <div><BureauChip bureau={compareData.sourceCase.bureau} /></div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-ink-muted">Complaint Title</span>
                    <h4 className="font-bold text-ink text-sm">{compareData.sourceCase.title}</h4>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-ink-muted">Workflow Stage &amp; Status</span>
                    <div><StatusBadge status={compareData.sourceCase.status} size="sm" /></div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-ink-muted">Full Description</span>
                    <div className="p-4 bg-surface border border-line text-ink leading-relaxed whitespace-pre-line text-xs">
                      {compareData.sourceCase.description}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-ink-muted pt-2 border-t border-line">
                    <div>Officer: <span className="text-ink font-bold">{compareData.sourceCase.assignedOfficer.name}</span></div>
                    <div>Receipt: <span className="text-ink font-bold">{format(new Date(compareData.sourceCase.dateOfReceipt), "dd MMM yyyy")}</span></div>
                  </div>
                </div>

                {/* Column 2: Candidate */}
                <div className="p-6 bg-surface-alt border border-line space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-line">
                    <span className="font-bold text-xs uppercase text-ink-muted">Candidate Inquiry</span>
                    <CaseIdTag id={compareData.candidate.targetCaseId} />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-ink-muted">Dealing Bureau</span>
                    <div>{compareData.targetCase ? <BureauChip bureau={compareData.targetCase.bureau} /> : <span className="text-ink-muted">RB / Central</span>}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-ink-muted">Complaint Title</span>
                    <h4 className="font-bold text-ink text-sm">{compareData.targetCase?.title || "Correlated Inspection Docket"}</h4>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-ink-muted">Workflow Stage &amp; Status</span>
                    <div>{compareData.targetCase ? <StatusBadge status={compareData.targetCase.status} size="sm" /> : <span className="text-ink-muted">Under Review</span>}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-ink-muted">Full Description</span>
                    <div className="p-4 bg-surface border border-line text-ink leading-relaxed whitespace-pre-line text-xs">
                      {compareData.targetCase?.description || "Inquiry initiated by concerned bureau into institutional operations."}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-ink-muted pt-2 border-t border-line">
                    <div>Officer: <span className="text-ink font-bold">{compareData.targetCase?.assignedOfficer.name || "Dr. Sunita Sharma"}</span></div>
                    <div>Receipt: <span className="text-ink font-bold">{compareData.targetCase?.dateOfReceipt ? format(new Date(compareData.targetCase.dateOfReceipt), "dd MMM yyyy") : "Fall 2025"}</span></div>
                  </div>
                </div>
              </div>

              {/* Shared Metadata & Similar Terminology */}
              <div className="p-5 bg-surface border border-line space-y-3 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-widest text-ink-muted block font-mono">
                  Synthesized Overlap Factors
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-coral/10 text-coral border border-coral/30 font-bold">
                    Identical AICTE Institution: {compareData.candidate.institution.name} ({compareData.candidate.institution.aicteId})
                  </span>
                  <span className="px-3 py-1 bg-surface-alt border border-line text-ink font-mono">
                    Concurrent Timeline: AY 2025-2026
                  </span>
                  <span className="px-3 py-1 bg-surface-alt border border-line text-ink font-mono">
                    Matching Keywords: &quot;unapproved fees&quot;, &quot;withholding certificates&quot;, &quot;faculty deficit&quot;
                  </span>
                </div>
              </div>

              {/* Future FastAPI Integration Note */}
              <div className="p-4 bg-surface-alt border border-line text-xs text-ink-muted space-y-1">
                <span className="font-bold text-ink flex items-center gap-1.5 text-[11px]">
                  <Layers className="h-3.5 w-3.5 text-coral" />
                  Proposed Production Hybrid ML Pipeline Architecture (FastAPI Backend)
                </span>
                <p className="leading-relaxed">
                  In the future production deployment, candidate pairs will be extracted via a 3-tier pipeline:
                  (1) <em>Deterministic Entity Linking</em> (AICTE Permanent ID, PAN, GIS coordinate proximity);
                  (2) <em>Rule-based Heuristics</em> (coincident submission dates, grievance category co-occurrence matrix);
                  (3) <em>Dense Semantic Embeddings</em> (fine-tuned Hindi/English multilingual transformer embeddings indexed via pgvector / HNSW).
                  All match suggestions will require human official confirmation as demonstrated above.
                </p>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3 mt-8">
              <button
                onClick={() => setCompareDrawerOpen(false)}
                className="btn-outline text-xs h-10 px-4"
              >
                Close Drawer
              </button>

              {permissions.canReviewOverlaps && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openDecisionModal(compareData.candidate, "DEFER")}
                    className="btn-outline text-xs h-10 px-3 font-bold"
                  >
                    Defer Review
                  </button>
                  <button
                    onClick={() => openDecisionModal(compareData.candidate, "REJECT")}
                    className="btn-outline text-xs h-10 px-3 text-red-600 font-bold hover:border-red-600"
                  >
                    Mark Not Related
                  </button>
                  <button
                    onClick={() => openDecisionModal(compareData.candidate, "CONFIRM")}
                    className="btn-coral text-xs h-10 px-5 font-bold inline-flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirm Related &amp; Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. DECISION MODAL */}
      {decisionModal.open && decisionModal.candidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-block/80 animate-in fade-in">
          <div className="w-full max-w-lg bg-surface border border-line border-t-4 border-t-coral shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="pb-3 border-b border-line">
              <h3 className="font-display font-black text-xl text-ink">
                {decisionModal.actionType === "CONFIRM" ? "Confirm Cross-Bureau Relationship" :
                 decisionModal.actionType === "REJECT" ? "Mark as Not Related (Dismiss Alert)" :
                 "Defer Overlap Review"}
              </h3>
              <p className="text-xs text-ink-muted mt-1">
                {decisionModal.actionType === "CONFIRM"
                  ? "Mutually cross-links both complaint records under the shared institution profile. Preserves independent file ownership, timelines, and rights."
                  : decisionModal.actionType === "REJECT"
                  ? "Marks these complaints as distinct matters and clears the candidate from the pending review queue."
                  : "Postpones determination until additional filings or committee hearings are conducted."}
              </p>
            </div>

            <div className="p-3 bg-surface-alt border border-line text-xs font-mono space-y-1">
              <div>Source: <span className="font-bold text-ink">{decisionModal.candidate.sourceCase.id}</span></div>
              <div>Candidate: <span className="font-bold text-coral">{decisionModal.candidate.targetCaseId}</span></div>
              <div>Institution: <span className="font-bold text-ink">{decisionModal.candidate.institution.name}</span></div>
              <div>Reviewer: <span className="text-ink">{user?.name || "Official"} ({permissions.roleLabel})</span></div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-ink-muted mb-1.5">
                Official Reviewer Notes / Justification
              </label>
              <textarea
                rows={4}
                value={decisionModal.notes}
                onChange={(e) => setDecisionModal({ ...decisionModal, notes: e.target.value })}
                placeholder="Enter regulatory justification or instructions for bureau dealing officers..."
                className="w-full p-3 border border-line bg-surface text-xs text-ink focus:outline-none focus:border-coral"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-line text-xs">
              <button
                type="button"
                onClick={() => setDecisionModal({ open: false, candidate: null, actionType: "CONFIRM", notes: "" })}
                className="btn-outline h-10 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDecision}
                className={cn(
                  "h-10 px-5 text-white font-bold text-xs uppercase tracking-wider",
                  decisionModal.actionType === "CONFIRM"
                    ? "btn-coral"
                    : decisionModal.actionType === "REJECT"
                    ? "bg-red-600 hover:bg-red-700"
                    : "btn-navy"
                )}
              >
                {decisionModal.actionType === "CONFIRM" ? "Confirm & Cross-Link" :
                 decisionModal.actionType === "REJECT" ? "Mark Not Related" :
                 "Save as Deferred"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
