"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { getAllMockCases, MOCK_INSTITUTIONS } from "@/lib/mock/data";
import { Search, Building2, Folder, ExternalLink, X } from "lucide-react";
import { PrismLogo } from "@/components/ui/PrismLogo";
import { cn } from "@/lib/utils";

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const cases = getAllMockCases();
  const institutions = MOCK_INSTITUTIONS;

  // Keyboard shortcut listener for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape" && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredInstitutions = institutions
    .filter(
      (inst) =>
        inst.name.toLowerCase().includes(q) ||
        inst.aicteId.toLowerCase().includes(q) ||
        inst.city.toLowerCase().includes(q)
    )
    .slice(0, 4);

  const filteredCases = cases
    .filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.institutionName.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    )
    .slice(0, 5);

  const quickPages = [
    { name: "Public Portal Home", href: "/", icon: ExternalLink },
    { name: "Live Overview Dashboard", href: "/dashboard", icon: ExternalLink },
    { name: "Complaints & Grievance Register", href: "/complaints", icon: ExternalLink },
    { name: "AI Overlap Review (Cross-Bureau)", href: "/overlaps", icon: ExternalLink },
    { name: "Tasks & Officer Workload", href: "/tasks", icon: ExternalLink },
    { name: "Alerts & Escalations Center", href: "/alerts", icon: ExternalLink },
    { name: "Centralized Institution Registry", href: "/institutions", icon: ExternalLink },
    { name: "Register New Grievance Intake", href: "/complaints/new", icon: ExternalLink },
    { name: "Analytics & Intelligence Reports", href: "/analytics", icon: ExternalLink },
    { name: "Public Citizen Tracking Portal", href: "/track", icon: ExternalLink },
    { name: "System Notifications Center", href: "/notifications", icon: ExternalLink },
    { name: "Admin User Management", href: "/admin/users", icon: ExternalLink },
    { name: "System Settings & Thresholds", href: "/admin/settings", icon: ExternalLink },
    { name: "Sign In / Officer Login", href: "/login", icon: ExternalLink },
    { name: "Sign Up / Register Portal", href: "/signup", icon: ExternalLink },
  ].filter((p) => p.name.toLowerCase().includes(q));

  const handleSelect = (href: string) => {
    setCommandPaletteOpen(false);
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-navy-block/80 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-surface border border-line border-t-4 border-t-coral shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-line bg-surface">
          <Search className="h-5 w-5 text-coral shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Case ID, institution, AICTE ID, or view..."
            className="w-full bg-transparent text-sm font-sans text-ink placeholder:text-ink-faint focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="text-ink-faint hover:text-ink p-1"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 border border-line text-ink-muted">
              ESC
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Quick Views */}
          {quickPages.length > 0 && (
            <div>
              <div className="px-2 text-[10px] uppercase font-bold tracking-widest text-ink-muted mb-2">
                Views & Actions
              </div>
              <div className="space-y-1">
                {quickPages.map((page) => (
                  <button
                    key={page.href}
                    onClick={() => handleSelect(page.href)}
                    className="w-full flex items-center justify-between p-2.5 text-xs text-ink hover:bg-surface-alt hover:text-coral transition-colors text-left"
                  >
                    <span className="font-bold">{page.name}</span>
                    <span className="text-coral font-mono">▸</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Institutions Section */}
          {filteredInstitutions.length > 0 && (
            <div>
              <div className="px-2 text-[10px] uppercase font-bold tracking-widest text-ink-muted mb-2">
                Institutions
              </div>
              <div className="space-y-1">
                {filteredInstitutions.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => handleSelect(`/institutions/${inst.id}`)}
                    className="w-full flex items-center justify-between p-2.5 text-xs text-ink hover:bg-surface-alt transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Building2 className="h-4 w-4 text-coral shrink-0" />
                      <div className="truncate">
                        <span className="font-bold block truncate">{inst.name}</span>
                        <span className="text-[10px] text-ink-faint font-mono">
                          {inst.aicteId} · {inst.city}, {inst.state}
                        </span>
                      </div>
                    </div>
                    <span className="text-coral font-mono text-xs">▸</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cases Section */}
          {filteredCases.length > 0 && (
            <div>
              <div className="px-2 text-[10px] uppercase font-bold tracking-widest text-ink-muted mb-2">
                Cases & Inquiries
              </div>
              <div className="space-y-1">
                {filteredCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(`/complaints/${encodeURIComponent(c.id)}`)}
                    className="w-full flex items-center justify-between p-2.5 text-xs text-ink hover:bg-surface-alt transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Folder className="h-4 w-4 text-ink-muted shrink-0" />
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-coral text-[11px]">{c.id}</span>
                          <span className="text-ink truncate font-medium">{c.title}</span>
                        </div>
                        <span className="text-[10px] text-ink-faint block truncate">
                          {c.institutionName} · {c.bureau}
                        </span>
                      </div>
                    </div>
                    <span className="text-coral font-mono text-xs">▸</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredInstitutions.length === 0 && filteredCases.length === 0 && quickPages.length === 0 && (
            <div className="py-8 text-center text-xs text-ink-muted">
              No matching institution or case record for &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-line bg-surface-alt flex items-center justify-between text-[11px] text-ink-muted font-mono">
          <span>Navigate with ↑ ↓ and Enter</span>
          <div className="flex items-center gap-1.5">
            <PrismLogo size="xs" variant="icon" />
            <span className="text-coral font-bold">PRISM AICTE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
