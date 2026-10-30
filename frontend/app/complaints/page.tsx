"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { prismApi } from "@/lib/api";
import { Case, PriorityLevel, BureauCode } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BureauChip } from "@/components/ui/BureauChip";
import { CaseIdTag } from "@/components/ui/CaseIdTag";
import { SeverityMeter } from "@/components/ui/SeverityMeter";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { getPermissions } from "@/lib/permissions";
import { toast } from "sonner";
import { 
  Search, 
  LayoutGrid, 
  Table as TableIcon, 
  ArrowUpDown, 
  GitMerge, 
  Plus, 
  Download, 
  Link2, 
  CheckSquare, 
  Square, 
  X,
  Sparkles,
  Filter,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Clock,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ComplaintsListPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-16 w-full" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      }
    >
      <ComplaintsListContent />
    </Suspense>
  );
}

function ComplaintsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role, user } = useAuthStore();
  const permissions = getPermissions(role);

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const initialStatus = searchParams.get("status") || "ALL";
  const initialBureau = searchParams.get("bureau") || "ALL";
  const initialPriority = searchParams.get("priority") || "ALL";

  const [activeTab, setActiveTab] = useState<string>(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBureau, setSelectedBureau] = useState<string>(initialBureau);
  const [selectedPriority, setSelectedPriority] = useState<string>(initialPriority);
  const [overlapOnly, setOverlapOnly] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Selection & bulk actions
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [caseToReassign, setCaseToReassign] = useState<Case | null>(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState("off-1");
  const [reassignReason, setReassignReason] = useState("");
  const [officers, setOfficers] = useState<any[]>([]);

  // Sorting
  const [sortField, setSortField] = useState<"dateOfReceipt" | "daysRemaining" | "seriousnessScore">("dateOfReceipt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [complaintsData, officersData] = await Promise.all([
          prismApi.getCases({
            status: activeTab !== "ALL" ? activeTab : undefined,
            bureau: selectedBureau !== "ALL" ? selectedBureau : undefined,
            priority: selectedPriority !== "ALL" ? selectedPriority : undefined,
            hasOverlap: overlapOnly ? true : undefined,
            query: searchQuery || undefined,
          }),
          prismApi.getOfficers(),
        ]);
        setCases(complaintsData);
        setOfficers(officersData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activeTab, selectedBureau, selectedPriority, overlapOnly, searchQuery]);

  // Tab definitions
  const tabs = [
    { key: "ALL", label: "All Complaints" },
    { key: "PENDING", label: "Pending" },
    { key: "UNDER_PROCESS", label: "Under Review / Process" },
    { key: "DISPOSED", label: "Disposed / Closed" },
    { key: "OVERDUE", label: "Overdue Cases" },
    { key: "ESCALATED", label: "Escalated" },
  ];

  // Sorting logic
  const sortedCases = [...cases].sort((a, b) => {
    let comparison = 0;
    if (sortField === "dateOfReceipt") {
      comparison = new Date(a.dateOfReceipt).getTime() - new Date(b.dateOfReceipt).getTime();
    } else if (sortField === "daysRemaining") {
      comparison = a.daysRemaining - b.daysRemaining;
    } else if (sortField === "seriousnessScore") {
      comparison = a.seriousnessScore - b.seriousnessScore;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedCases.length / pageSize);
  const paginatedCases = sortedCases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSelectAll = () => {
    if (selectedCaseIds.length === paginatedCases.length) {
      setSelectedCaseIds([]);
    } else {
      setSelectedCaseIds(paginatedCases.map((c) => c.id));
    }
  };

  const toggleSelectCase = (id: string) => {
    setSelectedCaseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkLink = async () => {
    if (selectedCaseIds.length < 2) {
      toast.warning("Select at least 2 cases to cross-reference");
      return;
    }
    await prismApi.linkSelectedCases(selectedCaseIds);
    toast.success(`Successfully linked ${selectedCaseIds.length} related cases across bureaus`);
    setSelectedCaseIds([]);
    const updated = await prismApi.getCases();
    setCases(updated);
  };

  const handleExportCSV = () => {
    const dataToExport = sortedCases.map((c) => ({
      "Case ID": c.id,
      "Institution Name": c.institutionName,
      "AICTE ID": c.aicteId,
      "Bureau": c.bureau,
      "Category": c.category,
      "Title": c.title,
      "Status": c.status,
      "Stage": c.currentStage,
      "Priority": c.priority || "MEDIUM",
      "Assigned Officer": c.assignedOfficer.name,
      "Date of Receipt": c.dateOfReceipt,
      "Due Date": c.dueDate,
      "Days Remaining": c.daysRemaining,
      "Seriousness Score": c.seriousnessScore,
      "Has Overlap": c.hasOverlap ? "Yes" : "No",
    }));
    prismApi.exportToCsv(dataToExport, `PRISM_Complaints_Export_${format(new Date(), "yyyy-MM-dd")}`);
    toast.success(`Exported ${dataToExport.length} complaint records to CSV`);
  };

  const handleReassignSubmit = async () => {
    if (!caseToReassign) return;
    try {
      await prismApi.reassignCase(caseToReassign.id, selectedOfficerId, reassignReason, user.name);
      toast.success(`Reassigned ${caseToReassign.id} successfully`);
      setReassignModalOpen(false);
      setCaseToReassign(null);
      setReassignReason("");
      const updated = await prismApi.getCases();
      setCases(updated);
    } catch {
      toast.error("Reassignment failed");
    }
  };

  const resetFilters = () => {
    setActiveTab("ALL");
    setSearchQuery("");
    setSelectedBureau("ALL");
    setSelectedPriority("ALL");
    setOverlapOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-ink tracking-tight">
              Complaint Register
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-surface-alt border border-line text-ink">
              {cases.length} Records
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Centralized register tracking institution-level grievances across AICTE Regulation, PGRC, Academic, and Approval Bureaus.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-ink hover:bg-surface-alt border border-line transition-colors"
            title="Export filtered records to CSV"
          >
            <Download className="h-3.5 w-3.5 text-ink-muted" />
            <span>Export CSV</span>
          </button>

          {permissions.canCreateComplaint && (
            <Link
              href="/complaints/new"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-coral hover:bg-coral-hover text-white transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Register Grievance</span>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
              className={cn(
                "px-4 py-3 text-xs uppercase font-bold tracking-wider transition-colors relative whitespace-nowrap",
                activeTab === tab.key
                  ? "text-coral font-black"
                  : "text-ink-muted hover:text-ink hover:bg-surface-alt"
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-coral" />
              )}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-surface-alt border border-line shrink-0">
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "p-1.5 transition-colors",
              viewMode === "table" ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink"
            )}
            title="Table View"
          >
            <TableIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-1.5 transition-colors",
              viewMode === "grid" ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink"
            )}
            title="Card Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="p-4 bg-surface border border-line space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Field */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Case ID, Institution, keywords, or AICTE ID..."
              className="w-full pl-10 pr-4 py-2 bg-surface-alt border border-line text-xs font-sans text-ink placeholder:text-ink-faint focus:outline-none focus:border-coral"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Bureau Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedBureau}
              onChange={(e) => {
                setSelectedBureau(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-surface-alt border border-line text-xs text-ink focus:outline-none focus:border-coral"
            >
              <option value="ALL">All Bureaus</option>
              <option value="PGRC">PGRC (Grievances)</option>
              <option value="RB">Regulation Bureau (RB)</option>
              <option value="ACA">Academic Bureau (ACA)</option>
              <option value="APP">Approval Bureau (APP)</option>
              <option value="RO">Regional Offices (RO)</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedPriority}
              onChange={(e) => {
                setSelectedPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-surface-alt border border-line text-xs text-ink focus:outline-none focus:border-coral"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="flex-1 px-3 py-2 bg-surface-alt border border-line text-xs text-ink focus:outline-none focus:border-coral"
            >
              <option value="dateOfReceipt">Sort: Date Received</option>
              <option value="daysRemaining">Sort: SLA Days Remaining</option>
              <option value="seriousnessScore">Sort: Seriousness Score</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 border border-line bg-surface-alt hover:bg-surface text-ink transition-colors"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Second Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line/60 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-ink">
              <input
                type="checkbox"
                checked={overlapOnly}
                onChange={(e) => {
                  setOverlapOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="accent-coral h-4 w-4"
              />
              <span className="flex items-center gap-1.5">
                <GitMerge className="h-3.5 w-3.5 text-coral" />
                AI Overlap Flagged Cases Only
              </span>
            </label>

            {(selectedBureau !== "ALL" || selectedPriority !== "ALL" || overlapOnly || searchQuery || activeTab !== "ALL") && (
              <button
                onClick={resetFilters}
                className="text-coral hover:underline font-bold text-xs flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Bulk Action Controls */}
          {selectedCaseIds.length > 0 && (
            <div className="flex items-center gap-2 bg-coral/10 border border-coral px-3 py-1.5 text-xs text-coral font-bold animate-in fade-in">
              <span>{selectedCaseIds.length} Cases Selected</span>
              <button
                onClick={handleBulkLink}
                className="px-2.5 py-1 bg-coral text-white hover:bg-coral-hover text-[11px] font-bold flex items-center gap-1"
              >
                <Link2 className="h-3 w-3" />
                Cross-Link Records
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : paginatedCases.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No complaint cases match your criteria"
          description="Try adjusting your Bureau, status tabs, or search keywords to view registered grievances."
          actionLabel="Reset All Filters"
          onAction={resetFilters}
        />
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-surface border border-line overflow-x-auto shadow-sm">
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead className="bg-[#14182B] text-white uppercase text-[10px] tracking-wider border-b border-[#262C46]">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedCaseIds.length === paginatedCases.length && paginatedCases.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-coral"
                  />
                </th>
                <th className="p-3 font-mono font-bold">Case ID</th>
                <th className="p-3">Complaint Subject</th>
                <th className="p-3">Institution</th>
                <th className="p-3">Bureau / Cell</th>
                <th className="p-3">Stage / Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Assigned Officer</th>
                <th className="p-3">SLA / Due Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {paginatedCases.map((c) => {
                const isSelected = selectedCaseIds.includes(c.id);
                const isOverdue = c.status === "OVERDUE" || c.daysRemaining < 0;

                return (
                  <tr
                    key={c.id}
                    className={cn(
                      "hover:bg-surface-alt transition-colors group",
                      isSelected && "bg-coral/5",
                      isOverdue && "border-l-4 border-l-red-500"
                    )}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectCase(c.id)}
                        className="accent-coral"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold">
                      <Link
                        href={`/complaints/${encodeURIComponent(c.id)}`}
                        className="text-coral hover:underline flex items-center gap-1.5"
                      >
                        {c.id}
                        {c.hasOverlap && (
                          <span title="AI Overlap Flagged">
                            <GitMerge className="h-3 w-3 text-coral" />
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="p-3 max-w-xs">
                      <Link
                        href={`/complaints/${encodeURIComponent(c.id)}`}
                        className="font-bold text-ink hover:text-coral transition-colors line-clamp-1 block"
                      >
                        {c.title}
                      </Link>
                      <span className="text-[11px] text-ink-muted line-clamp-1">
                        {c.category} · {c.description.slice(0, 70)}...
                      </span>
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/institutions/${c.institutionId}`}
                        className="font-bold text-ink hover:underline block truncate max-w-[180px]"
                      >
                        {c.institutionName}
                      </Link>
                      <span className="text-[10px] text-ink-faint font-mono">
                        {c.aicteId}
                      </span>
                    </td>
                    <td className="p-3">
                      <BureauChip bureau={c.bureau} />
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <StatusBadge status={c.status} />
                        <span className="block text-[10px] font-mono text-ink-muted">
                          Stage: {c.currentStage}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold uppercase font-mono tracking-wider border",
                          c.priority === "CRITICAL"
                            ? "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400"
                            : c.priority === "HIGH"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400"
                            : c.priority === "LOW"
                            ? "bg-slate-500/10 text-slate-600 border-slate-500/30 dark:text-slate-400"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400"
                        )}
                      >
                        {c.priority || "MEDIUM"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold block text-ink">
                        {c.assignedOfficer.name}
                      </span>
                      <span className="text-[10px] text-ink-muted">
                        {c.assignedOfficer.role.slice(0, 24)}
                      </span>
                    </td>
                    <td className="p-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock className={cn("h-3 w-3", isOverdue ? "text-red-500" : "text-ink-muted")} />
                        <span className={cn("font-bold text-[11px]", isOverdue ? "text-red-600 dark:text-red-400" : "text-ink")}>
                          {c.daysRemaining < 0
                            ? `${Math.abs(c.daysRemaining)}d OVERDUE`
                            : `${c.daysRemaining}d remaining`}
                        </span>
                      </div>
                      <span className="text-[10px] text-ink-muted block mt-0.5">
                        Due: {format(new Date(c.dueDate), "dd MMM yyyy")}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/complaints/${encodeURIComponent(c.id)}`}
                          className="p-1.5 border border-line hover:border-coral hover:text-coral transition-colors"
                          title="View Case Dossier"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        {permissions.canReassignComplaint && (
                          <button
                            onClick={() => {
                              setCaseToReassign(c);
                              setReassignModalOpen(true);
                            }}
                            className="p-1.5 border border-line hover:border-ink hover:text-ink transition-colors"
                            title="Reassign Dealing Officer"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCases.map((c) => (
            <div
              key={c.id}
              className="bg-surface border border-line p-4 flex flex-col justify-between hover:border-ink transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-line">
                  <CaseIdTag caseId={c.id} hasOverlap={c.hasOverlap} />
                  <BureauChip bureau={c.bureau} />
                </div>

                <Link
                  href={`/complaints/${encodeURIComponent(c.id)}`}
                  className="font-bold text-sm text-ink hover:text-coral transition-colors line-clamp-2 mb-1"
                >
                  {c.title}
                </Link>

                <p className="text-xs text-ink-muted line-clamp-2 mb-3">
                  {c.description}
                </p>

                <div className="p-2.5 bg-surface-alt border border-line text-xs space-y-1 mb-3">
                  <div className="font-bold text-ink truncate">{c.institutionName}</div>
                  <div className="text-[10px] font-mono text-ink-muted">AICTE: {c.aicteId}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
                  <StatusBadge status={c.status} />
                  <span className="font-mono text-[11px] font-bold text-ink">
                    {c.daysRemaining < 0 ? `${Math.abs(c.daysRemaining)}d Overdue` : `${c.daysRemaining}d left`}
                  </span>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-xs text-ink-muted">
                  <span>Assigned: <strong className="text-ink">{c.assignedOfficer.name}</strong></span>
                  <Link
                    href={`/complaints/${encodeURIComponent(c.id)}`}
                    className="font-bold text-coral hover:underline"
                  >
                    View Dossier →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 bg-surface border border-line flex items-center justify-between text-xs">
          <span className="text-ink-muted">
            Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({sortedCases.length} total)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-line disabled:opacity-40 hover:bg-surface-alt transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "px-3 py-1 font-mono font-bold text-xs border transition-colors",
                  currentPage === i + 1
                    ? "bg-coral text-white border-coral"
                    : "border-line hover:bg-surface-alt text-ink"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-line disabled:opacity-40 hover:bg-surface-alt transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Reassignment Modal */}
      {reassignModalOpen && caseToReassign && (
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
                <span className="font-mono text-coral font-bold block">{caseToReassign.id}</span>
                <span className="font-bold text-ink">{caseToReassign.title}</span>
                <span className="text-ink-muted block mt-1">
                  Current Officer: <strong>{caseToReassign.assignedOfficer.name}</strong> ({caseToReassign.assignedOfficer.role})
                </span>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">
                  Select New Dealing Officer:
                </label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-line text-xs font-sans text-ink focus:border-coral outline-none"
                >
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.bureau}) — Active: {off.activeCases} cases ({off.workloadPercentage}% load)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">
                  Reason for Reassignment / Delegation Note:
                </label>
                <textarea
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Workload rebalancing, subject matter expertise, regional transfer..."
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
