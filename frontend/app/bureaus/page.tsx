"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { 
  Building2, 
  Scale, 
  GraduationCap, 
  FileCheck, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Folders, 
  CheckCircle2, 
  AlertTriangle,
  GitMerge,
  ExternalLink,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PrismLogo } from "@/components/ui/PrismLogo";

export default function BureausPage() {
  const [selectedBureau, setSelectedBureau] = useState<"PGRC" | "RB" | "ACA" | "APP" | "RO">("PGRC");

  const bureauList = [
    {
      code: "PGRC" as const,
      name: "Public Grievance Redressal Cell",
      subtitle: "Student, Parent & Faculty Grievance Adjudication",
      badge: "Citizen Facing",
      color: "border-blue-500/40 text-blue-400 bg-blue-500/10",
      head: "Director & Appellate Officer (PGRC)",
      sla: "18 Days",
      activeCount: 542,
      statute: "AICTE Grievance Redressal Regulations (Gazette No. F.No.1-101/PGRC/AICTE/2019)",
      mandate: "Handles all grievances submitted by students, parents, faculty, and administrative staff regarding fee overcharging, capitation fees, degree or certificate retention, refusal to refund admission fees on withdrawal, and harassment.",
      powers: [
        "Direct restitution of retained certificates within 7 days",
        "Mandatory fee refunds with bank interest calculations",
        "Referral to Ombudsman for state-level appellate hearings",
        "Recommendation for progressive intake reduction on non-compliance"
      ],
      sampleCases: ["PGRC/2025/1023", "PGRC/2025/1109", "PGRC/2025/1241"],
    },
    {
      code: "RB" as const,
      name: "Regulation Bureau",
      subtitle: "Institutional Standards & Handbook Compliance",
      badge: "Regulatory Authority",
      color: "border-red-500/40 text-red-400 bg-red-500/10",
      head: "Director & Legal Adviser (Regulation)",
      sla: "21 Days",
      activeCount: 318,
      statute: "AICTE Approval Process Handbook (APH) Chapter VI (Norms & Violations)",
      mandate: "Enforces technical education regulations, teacher-student cadre ratios (1:15 for UG, 1:12 for PG), campus land title verification, barrier-free accessibility for disabled persons, and building safety certifications.",
      powers: [
        "Issuance of statutory showcause notices under APH Clause 6.4",
        "Constitution of Expert Visiting Committees (EVC) for surprise audits",
        "Freezing of intake capacity across all engineering departments",
        "Recommending withdrawal of technical institute approval"
      ],
      sampleCases: ["RB/2025/4487", "RB/2025/4492", "RB/2025/4501"],
    },
    {
      code: "ACA" as const,
      name: "Academic Bureau",
      subtitle: "Curriculum Standards & Faculty Qualifications",
      badge: "Curricular Oversight",
      color: "border-purple-500/40 text-purple-400 bg-purple-500/10",
      head: "Adviser (Academic & Curriculum)",
      sla: "15 Days",
      activeCount: 215,
      statute: "AICTE Model Curriculum & Qualifications Guidelines",
      mandate: "Ensures compliance with AICTE model curriculum, NEP 2020 integration, mandatory faculty development programs (NITTT), research ethics, and unapproved courses run under deceptive naming conventions.",
      powers: [
        "Direct curriculum correction orders to affiliated universities",
        "Faculty credential validation through AICTE portal cross-checks",
        "Nullification of unauthorized diplomas or non-compliant certificates"
      ],
      sampleCases: ["ACA/2025/7765", "ACA/2025/7810"],
    },
    {
      code: "APP" as const,
      name: "Approval Bureau",
      subtitle: "Extension of Approval (EoA) & Technical Licensure",
      badge: "Licensure Authority",
      color: "border-amber-500/40 text-amber-400 bg-amber-500/10",
      head: "Member Secretary & Approval Chairman",
      sla: "30 Days",
      activeCount: 128,
      statute: "AICTE Approval Regulations & Annual Approval Cycles",
      mandate: "Grants, extends, puts on 'No Admission' status, or withdraws approvals for engineering, management, pharmacy, MCA, and architecture institutions across India.",
      powers: [
        "Withholding Extension of Approval (EoA) pending grievance resolution",
        "Placing colleges in punitive 'No Admission' categories",
        "Encashment of performance bank guarantees on non-compliance"
      ],
      sampleCases: ["APP/2025/9012", "APP/2025/9044"],
    },
    {
      code: "RO" as const,
      name: "Regional Offices (8 Zones)",
      subtitle: "Field Inspections, Surprise Audits & Local Liaison",
      badge: "Field Inspection",
      color: "border-teal-500/40 text-teal-400 bg-teal-500/10",
      head: "Regional Officers (NW, N, C, W, SW, S, E, SC)",
      sla: "10 Days",
      activeCount: 45,
      statute: "Regional Jurisdiction Guidelines across 8 AICTE Zones",
      mandate: "Conducts physical site verification, ground inspections, lab infrastructure measurements, and serves as direct liaison with state higher education secretariats.",
      powers: [
        "Unannounced spot verification of laboratory equipment and fire NOCs",
        "Local police coordination for unapproved fraudulent institutes",
        "On-ground witness testimony recordings"
      ],
      sampleCases: ["RO-NW/2025/331", "RO-W/2025/112"],
    },
  ];

  const activeBureau = bureauList.find((b) => b.code === selectedBureau) || bureauList[0];

  return (
    <div className="min-h-screen bg-[#080B14] text-white flex flex-col selection:bg-coral selection:text-white">
      <PublicHeader />

      {/* 1. HERO (MONOLITHIC OBSIDIAN CANVAS) */}
      <section className="relative overflow-hidden bg-[#080B14] text-white py-16 sm:py-24 px-4 sm:px-8">
        {/* Dynamic Refractive Glow Orbs matching Home Page */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-coral/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#5FE0D0]/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/15 text-[11px] font-mono uppercase tracking-wider text-white">
                <Building2 className="h-3.5 w-3.5 text-coral" />
                <span className="font-bold text-coral">STATUTORY JURISDICTIONS</span>
                <span className="text-white/40">|</span>
                <span>AICTE Act 1987 &amp; Regulations</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white leading-[1.08]">
                5 AICTE Bureaus: <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral via-[#FF6F59] to-[#F28C28]">Preserving Autonomy, Sharing Intelligence.</span>
              </h1>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
                Grievances and audits in technical education involve diverse legal mandates. PRISM bridges PGRC, Regulation Bureau, Academic Bureau, Approvals, and Regional Offices into a synchronized network without eroding their statutory powers.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                <Link
                  href="/complaints"
                  className="btn-coral px-6 h-11 font-bold shadow-lg"
                >
                  <span>Explore Complaints Directory</span>
                  <span className="btn-arrow">▸</span>
                </Link>
                <Link
                  href="/institutions"
                  className="px-5 h-11 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold flex items-center gap-2 transition-colors"
                >
                  <Folders className="h-4 w-4 text-coral" />
                  <span>Inspect Institution Registry</span>
                </Link>
              </div>
            </div>

            {/* Crystalline Prism Emblem Card */}
            <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-white/[0.03] border border-white/15 backdrop-blur-xl shrink-0 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <PrismLogo size={120} variant="icon" animated />
              <div className="mt-4 text-center">
                <span className="text-[10px] font-mono font-bold tracking-widest text-coral uppercase block">
                  AICTE CO-ORDINATION
                </span>
                <span className="text-xs text-white/80 font-bold block mt-0.5">
                  5 Bureau Federation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BUREAU SELECTOR TABS & DOSSIER (MONOLITHIC OBSIDIAN) */}
      <section className="bg-[#080B14] py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-coral uppercase tracking-widest">
            Interactive Bureau Directory
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            Jurisdictional Breakdown &amp; Powers
          </h2>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
            Select a bureau to review its statutory purview, standard turnaround times (SLAs), and active case references.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {bureauList.map((b) => (
            <button
              key={b.code}
              onClick={() => setSelectedBureau(b.code)}
              className={cn(
                "px-3.5 sm:px-5 py-2 sm:py-3 border font-mono text-[11px] sm:text-xs font-bold uppercase transition-all flex items-center gap-1.5 sm:gap-2",
                selectedBureau === b.code
                  ? "bg-coral text-white border-coral shadow-md"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border-white/10"
              )}
            >
              <span>{b.code}</span>
              <span className="opacity-70 text-[10px] hidden sm:inline">({b.activeCount})</span>
            </button>
          ))}
        </div>

        {/* Active Bureau Detailed Card */}
        <div className="bg-white/[0.03] border border-white/15 p-5 sm:p-8 md:p-12 shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className={cn("px-3 py-1 font-mono font-bold text-xs uppercase border", activeBureau.color)}>
                  {activeBureau.code} CELL
                </span>
                <span className="text-xs font-mono font-bold text-white/50 uppercase">
                  {activeBureau.badge}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                {activeBureau.name}
              </h3>
              <p className="text-xs sm:text-sm text-coral font-bold font-mono">
                {activeBureau.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-4 w-full sm:w-auto shrink-0">
              <div className="p-3 sm:p-4 bg-white/5 border border-white/10 text-center w-full sm:min-w-[120px]">
                <span className="text-[10px] font-mono uppercase text-white/50 block font-bold">Standard SLA</span>
                <span className="text-xl font-display font-black text-white">{activeBureau.sla}</span>
              </div>
              <div className="p-3 sm:p-4 bg-white/5 border border-white/10 text-center w-full sm:min-w-[120px]">
                <span className="text-[10px] font-mono uppercase text-white/50 block font-bold">Active Dockets</span>
                <span className="text-xl font-display font-black text-coral">{activeBureau.activeCount}</span>
              </div>
            </div>
          </div>

          {/* Mandate & Statutory Authority */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-white/50 block mb-1">
                  Statutory Foundation
                </span>
                <p className="font-mono text-xs font-bold text-white p-3 bg-white/5 border border-white/10">
                  {activeBureau.statute}
                </p>
              </div>

              <div>
                <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-white/50 block mb-1">
                  Jurisdictional Mandate
                </span>
                <p className="text-white/70 leading-relaxed text-xs font-sans">
                  {activeBureau.mandate}
                </p>
              </div>

              <div>
                <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-white/50 block mb-2">
                  Statutory Regulatory Powers
                </span>
                <div className="space-y-2">
                  {activeBureau.powers.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-white/5 border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-white font-medium">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              {/* Dealing Head */}
              <div className="p-5 bg-white/5 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-white/50">Adjudicating Authority</span>
                <div className="text-sm font-bold text-white">{activeBureau.head}</div>
                <div className="text-[11px] text-white/60">AICTE Central Headquarters, Nelson Mandela Marg, New Delhi</div>
              </div>

              {/* Sample Dockets */}
              <div className="p-5 bg-white/5 border border-white/10 space-y-3">
                <span className="text-[10px] font-mono uppercase font-bold text-white/50 block">
                  Active Sample Inquiries
                </span>
                <div className="space-y-2">
                  {activeBureau.sampleCases.map((cId) => (
                    <Link
                      key={cId}
                      href={`/complaints/${encodeURIComponent(cId)}`}
                      className="p-3 bg-white/5 border border-white/10 hover:border-coral flex items-center justify-between text-xs font-mono transition-colors text-white block"
                    >
                      <span className="font-bold text-coral">{cId}</span>
                      <span className="text-[11px] text-white/60 flex items-center gap-1">
                        <span>Inspect Dossier</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={`/complaints?bureau=${activeBureau.code}`}
                className="btn-coral w-full text-xs text-center justify-center font-bold"
              >
                <span>Filter Register by {activeBureau.code} Cases</span>
                <span className="btn-arrow">▸</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY PRISM CO-REFERENCE MATTERS (MONOLITHIC OBSIDIAN CANVAS) */}
      <section className="bg-[#080B14] py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4 p-8 bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <GitMerge className="h-10 w-10 text-coral mx-auto" />
          <h3 className="font-display font-black text-2xl text-white">
            How PRISM Prevents Contradictory Notice Issuance
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
            In traditional governance, PGRC might investigate a student fee dispute while Regulation Bureau investigates faculty shortages at the exact same institution. PRISM synchronizes both dockets under the college&apos;s AICTE Permanent ID, ensuring both officers have real-time visibility without stepping on statutory jurisdictions.
          </p>
          <div className="pt-2">
            <Link
              href="/overlaps"
              className="btn-coral text-xs font-bold inline-flex items-center gap-2"
            >
              <span>Open Overlap Review Engine</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
