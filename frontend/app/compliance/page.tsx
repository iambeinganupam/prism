"use client";

import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { 
  ShieldCheck, 
  Lock, 
  FileKey2, 
  Award, 
  Server, 
  CheckCircle2, 
  Users, 
  ArrowRight, 
  Scale, 
  FileCheck,
  KeyRound,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PrismLogo } from "@/components/ui/PrismLogo";

export default function CompliancePage() {
  const rbacRoles = [
    {
      role: "AICTE Administrator",
      scope: "National Council Wide",
      read: "All Bureaus & Inquiries",
      write: "System Thresholds & Bureau Transfers",
      overlap: "Full Override & Link Confirmation",
      users: "Full User Provisioning",
    },
    {
      role: "Bureau Dealing Officer",
      scope: "Assigned Bureau Only (PGRC / RB)",
      read: "Bureau Inquiries & Shared Overlaps",
      write: "Stage Updates & Evidentiary Filings",
      overlap: "Review & Propose Links",
      users: "No Access",
    },
    {
      role: "Case Coordinator",
      scope: "Cross-Bureau Liaison",
      read: "All Active Multi-Bureau Pairs",
      write: "Task Assignments & SLA Escalations",
      overlap: "Coordinate Hearing Calendars",
      users: "No Access",
    },
    {
      role: "Statutory Auditor",
      scope: "Council Compliance Audit",
      read: "All Inquiries & Timelines",
      write: "Read-Only (No Mutation Rights)",
      overlap: "Read-Only Inspection",
      users: "Read-Only Inspection",
    },
    {
      role: "Technical Institution",
      scope: "Single College AICTE ID",
      read: "Notices Addressed to Institution",
      write: "Compliance Uploads & Affidavits",
      overlap: "No Access to Internal Overlaps",
      users: "No Access",
    },
    {
      role: "Public Complainant",
      scope: "Own Case Registration ID",
      read: "Public Stage & Milestone View",
      write: "Initial Grievance Submission",
      overlap: "No Exposure",
      users: "No Access",
    },
  ];

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
                <ShieldCheck className="h-3.5 w-3.5 text-coral" />
                <span className="font-bold text-coral">SECURITY &amp; STATUTORY COMPLIANCE</span>
                <span className="text-white/40">|</span>
                <span>Government Enterprise Grade</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white leading-[1.08]">
                Statutory Integrity: <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral via-[#FF6F59] to-[#F28C28]">DPDP Act 2023 &amp; Cryptographic Audit.</span>
              </h1>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
                Built from the ground up to satisfy the strictest government data protection standards, procedural natural justice requirements under the AICTE Approval Process Handbook, and immutable cryptographic record-keeping.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                <Link
                  href="/admin/settings"
                  className="btn-coral px-6 h-11 font-bold shadow-lg"
                >
                  <span>Inspect Security Settings</span>
                  <span className="btn-arrow">▸</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="px-5 h-11 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold flex items-center gap-2 transition-colors"
                >
                  <Users className="h-4 w-4 text-coral" />
                  <span>RBAC User Staffing Desk</span>
                </Link>
              </div>
            </div>

            {/* Crystalline Prism Emblem Card */}
            <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-white/[0.03] border border-white/15 backdrop-blur-xl shrink-0 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <PrismLogo size={120} variant="icon" animated />
              <div className="mt-4 text-center">
                <span className="text-[10px] font-mono font-bold tracking-widest text-coral uppercase block">
                  STATUTORY SAFEGUARD
                </span>
                <span className="text-xs text-white/80 font-bold block mt-0.5">
                  DPDP &amp; IT Act Audit
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 CORE COMPLIANCE PILLARS (MONOLITHIC OBSIDIAN TILES) */}
      <section className="bg-[#080B14] py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-coral uppercase tracking-widest">
            Regulatory Conformance
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            The 4 Regulatory Safeguards
          </h2>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
            How PRISM ensures constitutional fairness, whistleblower protection, and non-repudiation of administrative actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Card 1: DPDP Act 2023 */}
          <div className="p-5 sm:p-8 bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 space-y-4 transition-all shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/30 uppercase">
                Data Protection
              </span>
              <Award className="h-6 w-6 text-coral" />
            </div>
            <h3 className="font-display font-black text-xl text-white">
              Digital Personal Data Protection Act 2023
            </h3>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              All citizen, student, and faculty contact details are masked from the respondent institution during preliminary inquiry stages to prevent retaliation, harassment, or coerced withdrawal of complaints.
            </p>
            <ul className="space-y-2 text-xs text-white/60 font-sans pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zero disclosure of complainant phone or residential address to colleges.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Consent-driven evidence forwarding between regulatory bodies.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: IT Act 2000 */}
          <div className="p-5 sm:p-8 bg-white/[0.03] border border-white/10 hover:border-blue-500/50 space-y-4 transition-all shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 border border-blue-500/30 uppercase">
                Legal Admissibility
              </span>
              <Scale className="h-6 w-6 text-coral" />
            </div>
            <h3 className="font-display font-black text-xl text-white">
              Information Technology Act 2000 (Sec. 43A &amp; 72A)
            </h3>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              All statutory showcause notices, inspection reports, and institutional replies are digitally generated with cryptographic checksums, satisfying judicial admissibility standards before High Courts and appellate tribunals.
            </p>
            <ul className="space-y-2 text-xs text-white/60 font-sans pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Non-repudiation of dispatch timestamps across government bureaus.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Audit logging of every PDF and document download with officer IP.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Immutable Audit Ledger */}
          <div className="p-5 sm:p-8 bg-white/[0.03] border border-white/10 hover:border-purple-500/50 space-y-4 transition-all shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 border border-purple-500/30 uppercase">
                Tamper Resistance
              </span>
              <FileKey2 className="h-6 w-6 text-coral" />
            </div>
            <h3 className="font-display font-black text-xl text-white">
              SHA-256 Immutable Audit Ledger
            </h3>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              Every transition in complaint status (from &quot;Received&quot; to &quot;Under Process&quot; or &quot;Disposed&quot;) is appended to an append-only audit trail stamped with the officer&apos;s unique identifier, timestamp, and previous block hash.
            </p>
            <ul className="space-y-2 text-xs text-white/60 font-sans pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Prevents retroactive modification of hearing minutes or inquiry dates.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Read-only Auditor accounts can inspect the ledger at any time.</span>
              </li>
            </ul>
          </div>

          {/* Card 4: APH Clause 6.4 */}
          <div className="p-5 sm:p-8 bg-white/[0.03] border border-white/10 hover:border-amber-500/50 space-y-4 transition-all shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 border border-amber-500/30 uppercase">
                Natural Justice
              </span>
              <FileCheck className="h-6 w-6 text-coral" />
            </div>
            <h3 className="font-display font-black text-xl text-white">
              AICTE Approval Process Handbook (Clause 6.4)
            </h3>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              Ensures that no punitive action—such as intake capacity reduction, admission freezes, or EoA withdrawal—is enacted without providing the institution a statutory 15-day notice and hearing opportunity before the Standing Hearing Committee (SHC).
            </p>
            <ul className="space-y-2 text-xs text-white/60 font-sans pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Automated countdown rings prevent premature punitive penal orders.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Synchronized notices prevent duplicate penalties for linked allegations.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. RBAC MATRIX TABLE (MONOLITHIC OBSIDIAN CANVAS) */}
      <section className="bg-[#080B14] py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-coral uppercase tracking-widest">
              Access Governance
            </span>
            <h2 className="text-3xl font-display font-black text-white">
              Role-Based Access Control (RBAC) Matrix
            </h2>
            <p className="text-xs text-white/60">
              Granular separation of duties across 6 regulatory personas.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 overflow-x-auto shadow-2xl backdrop-blur-md">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-white/5 text-white/80 uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="p-3.5">User Persona</th>
                  <th className="p-3.5">Jurisdiction Scope</th>
                  <th className="p-3.5">Read Permissions</th>
                  <th className="p-3.5">Write / Mutation</th>
                  <th className="p-3.5">AI Overlap Action</th>
                  <th className="p-3.5">User Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rbacRoles.map((r) => (
                  <tr key={r.role} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-bold text-white">{r.role}</td>
                    <td className="p-3.5 font-mono text-coral font-bold">{r.scope}</td>
                    <td className="p-3.5 text-white/70">{r.read}</td>
                    <td className="p-3.5 text-white/70">{r.write}</td>
                    <td className="p-3.5 text-white/70">{r.overlap}</td>
                    <td className="p-3.5 text-white/70">{r.users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
