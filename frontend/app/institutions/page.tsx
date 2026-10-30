"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { prismApi } from "@/lib/api";
import { Institution } from "@/types";
import { 
  Building2, 
  MapPin, 
  Search, 
  GitMerge, 
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function InstitutionsRegistryPage() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [overlapOnly, setOverlapOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInstitutions() {
      setLoading(true);
      try {
        const data = await prismApi.getInstitutions(searchQuery);
        setInstitutions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInstitutions();
  }, [searchQuery]);

  const filtered = institutions.filter((inst) => {
    if (selectedRegion !== "ALL" && inst.region !== selectedRegion) return false;
    if (selectedType !== "ALL" && inst.type !== selectedType) return false;
    if (overlapOnly && !inst.hasOverlap) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16 relative">
      {/* Editorial Header with cropped watermark word */}
      <div className="relative pb-6 overflow-hidden">
        <span className="watermark-word -top-10 -left-6" aria-hidden="true">
          DIRECTORY
        </span>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-coral" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-ink-muted">
                INSTITUTIONAL GOVERNANCE · AICTE
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-ink">
              Institution <span className="text-coral italic font-black">Directory.</span>
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted max-w-xl font-sans leading-relaxed">
              Unified master registry of all AICTE-approved engineering, technology, and management institutions across India.
            </p>
          </div>
          <div className="font-mono text-xs font-bold px-4 py-2 bg-navy-block text-white self-start sm:self-auto tabular-nums">
            {filtered.length} INSTITUTIONS CATALOGUED
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="editorial-tile bg-surface p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted stroke-[2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Institution Name, AICTE Permanent ID (e.g. 1-1234567890), or City..."
            className="editorial-input w-full pl-11"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="h-11 px-3.5 border border-line bg-surface text-ink text-xs font-bold uppercase tracking-wider focus:border-coral w-full sm:w-auto"
          >
            <option value="ALL">All Regions</option>
            <option value="Northern">Northern Region</option>
            <option value="Western">Western Region</option>
            <option value="Southern">Southern Region</option>
            <option value="Eastern">Eastern Region</option>
            <option value="North-Western">North-Western Region</option>
            <option value="Central">Central Region</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-11 px-3.5 border border-line bg-surface text-ink text-xs font-bold uppercase tracking-wider focus:border-coral w-full sm:w-auto"
          >
            <option value="ALL">All Ownership Types</option>
            <option value="Private">Private</option>
            <option value="Government">Government</option>
            <option value="Government Aided">Government Aided</option>
          </select>

          <button
            onClick={() => setOverlapOnly(!overlapOnly)}
            className={cn(
              "h-11 px-4 font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all text-xs w-full sm:w-auto",
              overlapOnly
                ? "bg-navy-block text-white border-navy-block"
                : "bg-surface border-line text-ink-muted hover:border-coral"
            )}
          >
            <GitMerge className="h-3.5 w-3.5 text-coral stroke-[2]" />
            <span>Overlap Active</span>
          </button>
        </div>
      </div>

      {/* Grid of Institutions (Numbered / Editorial Tiles) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inst, idx) => {
          const isHighRisk = inst.riskScore >= 75;

          return (
            <div
              key={inst.id}
              onClick={() => router.push(`/institutions/${inst.id}`)}
              className="editorial-tile bg-surface p-6 flex flex-col justify-between group cursor-pointer hover:-translate-y-1 hover:border-coral transition-all duration-200 relative"
            >
              <div>
                {/* Top Badges & Index */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-line">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-surface-alt border border-line text-ink">
                    {inst.aicteId}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                        inst.approvalStatus === "Approved"
                          ? "bg-[#1E8E4E] text-white"
                          : "bg-[#B0121B] text-white"
                      )}
                    >
                      {inst.approvalStatus}
                    </span>
                    <span className="font-mono text-xs font-bold text-ink-muted">
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Name & Region */}
                <h3 className="font-display font-bold text-base text-ink mt-3 group-hover:text-coral transition-colors line-clamp-1 leading-snug">
                  {inst.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-1 font-sans">
                  <MapPin className="h-3.5 w-3.5 text-coral shrink-0" />
                  <span className="truncate">{inst.city}, {inst.state} ({inst.region} Region)</span>
                </div>

                {/* Overlap Alert Tag */}
                {inst.hasOverlap && (
                  <div className="mt-3.5 px-3 py-1 bg-coral text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <GitMerge className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
                    <span className="truncate">Multi-Bureau Overlap Flagged</span>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-line text-center text-xs">
                  <div className="p-2.5 bg-surface-alt text-center border border-line">
                    <span className="text-[9px] text-ink-muted uppercase font-bold tracking-wider block">Total Cases</span>
                    <span className="font-display font-black text-xl text-ink font-mono tabular-nums mt-0.5 block">
                      {inst.totalCases}
                    </span>
                  </div>
                  <div className="p-2.5 bg-surface-alt text-center border border-line">
                    <span className="text-[9px] text-ink-muted uppercase font-bold tracking-wider block">Open Files</span>
                    <span className="font-display font-black text-xl text-[#E8A317] font-mono tabular-nums mt-0.5 block">
                      {inst.openCases}
                    </span>
                  </div>
                  <div className="p-2.5 bg-surface-alt text-center border border-line">
                    <span className="text-[9px] text-ink-muted uppercase font-bold tracking-wider block">Risk Score</span>
                    <span className={cn(
                      "font-display font-black text-xl font-mono tabular-nums mt-0.5 block",
                      isHighRisk ? "text-[#B0121B]" : "text-[#1E8E4E]"
                    )}>
                      {inst.riskScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-5 pt-3.5 border-t border-line flex items-center justify-between text-xs font-sans">
                <span className="text-[11px] font-bold text-ink-muted uppercase">
                  {inst.type} · Est. {inst.establishedYear}
                </span>
                <span className="btn-tertiary text-xs font-bold group-hover:text-coral">
                  Unified Profile ▸
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
