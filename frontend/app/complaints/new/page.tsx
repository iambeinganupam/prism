"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { prismApi } from "@/lib/api";
import { Institution, BureauCode, PriorityLevel } from "@/types";
import { toast } from "sonner";
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  ArrowLeft, 
  Check,
  ShieldAlert,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewComplaintPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loadingInsts, setLoadingInsts] = useState(true);

  // Form states
  const [complainantType, setComplainantType] = useState<any>("Student");
  const [complainantName, setComplainantName] = useState("");
  const [complainantContact, setComplainantContact] = useState("");
  const [complainantEmail, setComplainantEmail] = useState("");

  const [institutionSearch, setInstitutionSearch] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  const [bureau, setBureau] = useState<BureauCode>("PGRC");
  const [category, setCategory] = useState("Student Grievance");
  const [priority, setPriority] = useState<PriorityLevel>("HIGH");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  // Live AI duplicate / overlap check state
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState<{
    hasOverlap: boolean;
    confidence: number;
    matches: Array<{
      caseId: string;
      title: string;
      bureau: string;
      confidence: number;
      similarityReason: string;
    }>;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);

  useEffect(() => {
    async function loadInsts() {
      setLoadingInsts(true);
      try {
        const data = await prismApi.getInstitutions();
        setInstitutions(data);
        if (data.length > 0) {
          setSelectedInstitution(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInsts(false);
      }
    }
    loadInsts();
  }, []);

  const runAiDuplicateCheck = async () => {
    if (!selectedInstitution) return;
    setCheckingDuplicate(true);
    try {
      const res = await prismApi.checkDuplicateIntake({
        institutionId: selectedInstitution.id,
        title: title || "Grievance against fee collection and faculty",
        description: description || "Inquiry on compliance with norms",
      });
      setDuplicateResult(res);
      if (res.hasOverlap) {
        toast.warning(`AI Duplicate Check: High similarity (${res.confidence}%) detected with open matters`);
      } else {
        toast.info("AI Duplicate Check complete: No duplicate filings found");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingDuplicate(false);
    }
  };

  const handleStepNext = () => {
    if (currentStep === 1 && complainantType !== "Anonymous" && !complainantName.trim()) {
      toast.error("Please enter complainant name or select Anonymous");
      return;
    }
    if (currentStep === 2 && !selectedInstitution) {
      toast.error("Please select an institution");
      return;
    }
    if (currentStep === 3) {
      if (!title.trim() || !description.trim()) {
        toast.error("Please enter complaint title and description");
        return;
      }
      runAiDuplicateCheck();
    }
    setCurrentStep((s) => Math.min(5, s + 1));
  };

  const handleSubmit = async () => {
    if (!selectedInstitution) return;
    setSubmitting(true);
    try {
      const created = await prismApi.createComplaint({
        institutionId: selectedInstitution.id,
        institutionName: selectedInstitution.name,
        aicteId: selectedInstitution.aicteId,
        bureau,
        category,
        priority,
        title: title || "Student Grievance Statement",
        description: description || "Grievance catalogued under AICTE PRISM System.",
        complainantType,
        complainantName,
        complainantContact,
      });
      setSubmittedCaseId(created.id);
      toast.success(`Complaint ${created.id} successfully registered!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to register complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredInstitutions = institutions.filter(
    (i) =>
      i.name.toLowerCase().includes(institutionSearch.toLowerCase()) ||
      i.aicteId.includes(institutionSearch)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 relative">
      {/* Header */}
      <div className="text-center space-y-2 pt-2 pb-4">
        <div className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 bg-coral" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-ink-muted">
            AI-ASSISTED INTAKE · AICTE PRISM
          </span>
          <span className="h-1.5 w-1.5 bg-coral" />
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-black text-ink tracking-tight">
          Register New <span className="text-coral italic font-black">Grievance.</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto font-sans leading-relaxed">
          Intelligent institutional intake with live semantic duplicate matching and automatic bureau dispatch.
        </p>

        {/* Disclaimer Notice */}
        <div className="inline-flex items-center gap-2 p-2 px-3 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>Demo Intake Mode — Generated Case IDs &amp; simulated evidence are in-memory demo records.</span>
        </div>
      </div>

      {/* Stepper indicator */}
      <div className="bg-surface border border-line p-5 shadow-sm">
        <div className="flex items-center justify-between text-xs font-sans overflow-x-auto gap-2">
          {[
            { step: 1, label: "Complainant" },
            { step: 2, label: "Institution" },
            { step: 3, label: "Details" },
            { step: 4, label: "AI Duplicate Check" },
            { step: 5, label: "Review & Submit" },
          ].map((s) => (
            <div
              key={s.step}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap",
                currentStep >= s.step
                  ? "text-ink font-bold"
                  : "text-ink-muted opacity-60"
              )}
            >
              <span
                className={cn(
                  "h-7 w-7 flex items-center justify-center text-xs font-mono font-bold transition-all",
                  currentStep > s.step
                    ? "bg-[#14182B] text-white"
                    : currentStep === s.step
                    ? "bg-coral text-white ring-4 ring-coral/20"
                    : "bg-surface-alt border border-line text-ink-muted"
                )}
              >
                {currentStep > s.step ? "✓" : s.step}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      {submittedCaseId ? (
        /* SUCCESS VIEW */
        <div className="bg-surface border border-line border-t-4 border-t-emerald-600 p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="font-display font-black text-2xl text-ink">
            Complaint Registered Successfully
          </h2>
          <p className="text-xs text-ink-muted max-w-md mx-auto">
            Your complaint has been catalogued in the central register and indexed by AICTE AI overlap detection engine.
          </p>

          <div className="p-4 px-6 bg-surface-alt inline-block font-mono text-base font-bold text-ink border border-line">
            DEMO CASE ID: <span className="text-coral">{submittedCaseId}</span>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs">
            <button
              onClick={() => router.push(`/complaints/${encodeURIComponent(submittedCaseId)}`)}
              className="px-5 py-2.5 bg-coral hover:bg-coral-hover text-white font-bold transition-colors"
            >
              View Case Dossier →
            </button>
            <button
              onClick={() => router.push(`/track?id=${encodeURIComponent(submittedCaseId)}`)}
              className="px-5 py-2.5 bg-surface-alt hover:bg-surface border border-line text-coral font-bold transition-colors"
            >
              Track in Citizen Portal →
            </button>
            <button
              onClick={() => router.push("/complaints")}
              className="px-5 py-2.5 bg-surface-alt hover:bg-surface border border-line text-ink font-bold transition-colors"
            >
              Back to Complaints Register
            </button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <div className="bg-surface border border-line p-7 sm:p-10 space-y-6 font-sans shadow-sm">
          {/* STEP 1: COMPLAINANT */}
          {currentStep === 1 && (
            <div className="space-y-5 text-xs">
              <div className="pb-3 border-b border-line">
                <h3 className="font-display font-black text-xl text-ink">
                  Step 1: Complainant <span className="text-coral italic">Profile.</span>
                </h3>
                <p className="text-xs text-ink-muted mt-1">
                  Select your relationship with the institution and enter contact coordinates.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Complainant Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {["Student", "Faculty", "Parent", "Anonymous", "Regulatory Body"].map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setComplainantType(type)}
                        className={cn(
                          "py-3 px-3 border text-center transition-all font-bold text-xs uppercase tracking-wider",
                          complainantType === type
                            ? "bg-coral text-white border-coral font-black shadow-sm"
                            : "bg-surface-alt border-line text-ink hover:border-ink"
                        )}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              {complainantType !== "Anonymous" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={complainantName}
                      onChange={(e) => setComplainantName(e.target.value)}
                      placeholder="e.g. Aman Sharma"
                      className="w-full p-2.5 bg-surface-alt border border-line text-ink text-xs focus:border-coral outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={complainantContact}
                      onChange={(e) => setComplainantContact(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 bg-surface-alt border border-line text-ink text-xs focus:border-coral outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={complainantEmail}
                      onChange={(e) => setComplainantEmail(e.target.value)}
                      placeholder="aman.sharma@example.com"
                      className="w-full p-2.5 bg-surface-alt border border-line text-ink text-xs focus:border-coral outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: INSTITUTION */}
          {currentStep === 2 && (
            <div className="space-y-5 text-xs">
              <div className="pb-3 border-b border-line">
                <h3 className="font-display font-black text-xl text-ink">
                  Step 2: Select <span className="text-coral italic">Institution.</span>
                </h3>
                <p className="text-xs text-ink-muted mt-1">
                  Choose the technical institution against which the complaint is being lodged.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Search Institution by Name or AICTE Permanent ID
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
                  <input
                    type="text"
                    value={institutionSearch}
                    onChange={(e) => setInstitutionSearch(e.target.value)}
                    placeholder="Search name or ID (e.g. 1-1234567890)..."
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-alt border border-line text-ink text-xs focus:border-coral outline-none"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-line border border-line">
                {filteredInstitutions.slice(0, 10).map((inst) => (
                  <div
                    key={inst.id}
                    onClick={() => setSelectedInstitution(inst)}
                    className={cn(
                      "p-3 cursor-pointer flex items-center justify-between text-xs transition-colors",
                      selectedInstitution?.id === inst.id
                        ? "bg-coral/10 border-l-4 border-l-coral font-bold"
                        : "hover:bg-surface-alt"
                    )}
                  >
                    <div>
                      <span className="font-bold text-ink block">{inst.name}</span>
                      <span className="text-[10px] text-ink-muted font-mono">
                        AICTE ID: {inst.aicteId} · {inst.city}, {inst.state}
                      </span>
                    </div>
                    {selectedInstitution?.id === inst.id && (
                      <span className="text-coral font-bold">Selected ✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-5 text-xs">
              <div className="pb-3 border-b border-line">
                <h3 className="font-display font-black text-xl text-ink">
                  Step 3: Grievance <span className="text-coral italic">Details.</span>
                </h3>
                <p className="text-xs text-ink-muted mt-1">
                  Categorize the issue, specify urgency level, and provide a clear factual narrative.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                    Target Bureau / Cell *
                  </label>
                  <select
                    value={bureau}
                    onChange={(e) => setBureau(e.target.value as BureauCode)}
                    className="w-full p-2.5 bg-surface-alt border border-line text-xs font-sans text-ink focus:border-coral outline-none"
                  >
                    <option value="PGRC">Public Grievance Redressal Cell (PGRC)</option>
                    <option value="RB">Regulation Bureau (RB)</option>
                    <option value="ACA">Academic Bureau (ACA)</option>
                    <option value="APP">Approval Bureau (APP)</option>
                    <option value="RO">Regional Office (RO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                    Grievance Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-surface-alt border border-line text-xs font-sans text-ink focus:border-coral outline-none"
                  >
                    <option value="Student Grievance">Student Grievance (Excess Fees / Certificates)</option>
                    <option value="Regulatory Compliance">Regulatory Compliance / Deficiencies</option>
                    <option value="Faculty & Staff">Faculty Shortage / Non-Payment</option>
                    <option value="Approval & Intake">Approval &amp; Course Norms</option>
                    <option value="Infrastructure Deficit">Infrastructure &amp; Lab Deficit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full p-2.5 bg-surface-alt border border-line text-xs font-sans text-ink focus:border-coral outline-none"
                  >
                    <option value="CRITICAL">Critical (Breach / Harassment)</option>
                    <option value="HIGH">High (Excess Fee / Notice Overdue)</option>
                    <option value="MEDIUM">Medium (General Redressal)</option>
                    <option value="LOW">Low (Information Query)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Complaint Subject / Headline *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Unapproved development fee demand and withholding of original degree certificates"
                  className="w-full p-2.5 bg-surface-alt border border-line text-ink text-xs focus:border-coral outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Factual Description / Grievance Statement *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Provide detailed facts, clauses violated (e.g. APH Clause 6.4), monetary demands, and timeline of events..."
                  className="w-full p-2.5 bg-surface-alt border border-line text-ink text-xs focus:border-coral outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* STEP 4: AI OVERLAP CHECK */}
          {currentStep === 4 && (
            <div className="space-y-5 text-xs">
              <div className="pb-3 border-b border-line">
                <h3 className="font-display font-black text-xl text-ink">
                  Step 4: AI Cross-Bureau <span className="text-coral italic">Overlap Verification.</span>
                </h3>
                <p className="text-xs text-ink-muted mt-1">
                  Evaluating duplicate probability against historical cases and active inquiries under {selectedInstitution?.name}.
                </p>
              </div>

              {checkingDuplicate ? (
                <div className="p-8 text-center space-y-3 bg-surface-alt border border-line">
                  <div className="h-8 w-8 border-2 border-coral border-t-transparent animate-spin mx-auto" />
                  <span className="font-bold block text-ink">Scanning AICTE Knowledge Graph...</span>
                  <span className="text-[11px] text-ink-muted">Cross-referencing narrative vectors and past show-cause notices.</span>
                </div>
              ) : duplicateResult ? (
                <div className="space-y-4">
                  {duplicateResult.hasOverlap ? (
                    <div className="p-5 bg-amber-500/10 border-l-4 border-l-amber-500 border border-amber-500/30 text-ink space-y-3">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
                        <AlertTriangle className="h-5 w-5 shrink-0" />
                        <span className="text-sm">High Similarity Detected ({duplicateResult.confidence}%)</span>
                      </div>
                      <p className="text-xs text-ink-muted">
                        AI identified overlapping matters for {selectedInstitution?.name}. A separate grievance with similar subject matter already exists:
                      </p>

                      <div className="space-y-2 mt-2">
                        {duplicateResult.matches.map((m) => (
                          <div key={m.caseId} className="p-3 bg-surface border border-line flex items-center justify-between">
                            <div>
                              <span className="font-mono text-coral font-bold block">{m.caseId} ({m.bureau})</span>
                              <span className="font-bold text-ink">{m.title}</span>
                              <span className="text-[11px] text-ink-muted block mt-0.5">{m.similarityReason}</span>
                            </div>
                            <span className="px-2 py-0.5 bg-coral text-white font-mono font-bold text-[10px]">
                              {m.confidence}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-emerald-500/10 border-l-4 border-l-emerald-600 border border-emerald-500/30 text-ink flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold block text-sm">No duplicate filings detected</span>
                        <span className="text-xs text-ink-muted">Grievance appears distinct from existing open matters.</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {currentStep === 5 && (
            <div className="space-y-5 text-xs">
              <div className="pb-3 border-b border-line">
                <h3 className="font-display font-black text-xl text-ink">
                  Step 5: Review &amp; <span className="text-coral italic">Formal Submission.</span>
                </h3>
                <p className="text-xs text-ink-muted mt-1">
                  Verify the complaint details before cataloguing into the central AICTE PRISM registry.
                </p>
              </div>

              <div className="p-5 bg-surface-alt border border-line space-y-3 font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <span className="text-ink-muted uppercase font-bold text-[10px]">Complainant:</span>
                  <span className="font-bold text-ink">{complainantName || "Anonymous"} ({complainantType})</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <span className="text-ink-muted uppercase font-bold text-[10px]">Institution:</span>
                  <span className="font-bold text-ink">{selectedInstitution?.name} ({selectedInstitution?.aicteId})</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <span className="text-ink-muted uppercase font-bold text-[10px]">Target Bureau:</span>
                  <span className="font-bold text-ink">{bureau} Cell</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <span className="text-ink-muted uppercase font-bold text-[10px]">Priority:</span>
                  <span className="font-bold text-coral">{priority}</span>
                </div>
                <div>
                  <span className="text-ink-muted block mb-1 uppercase font-bold text-[10px]">Subject:</span>
                  <span className="font-bold text-ink block">{title || "Student Grievance"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-line">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-4 py-2 border border-line hover:bg-surface-alt text-ink font-bold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleStepNext}
                className="px-5 py-2.5 bg-coral hover:bg-coral-hover text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Continue</span>
                <span>▸</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-coral hover:bg-coral-hover text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>{submitting ? "Submitting..." : "Confirm & Register Grievance"}</span>
                <span>▸</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
