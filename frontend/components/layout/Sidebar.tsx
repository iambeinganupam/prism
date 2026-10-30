"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { getPermissions } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { PrismLogo } from "@/components/ui/PrismLogo";
import { 
  LayoutDashboard, 
  Building2, 
  Folders, 
  GitMerge, 
  BarChart3, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  CheckSquare,
  AlertTriangle,
  Globe,
  X
} from "lucide-react";
import { UserRole } from "@/types";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, user, setRole } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useAppStore();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const permissions = getPermissions(role);

  const navItems = [
    {
      name: "Exit to Public Portal",
      href: "/",
      icon: Globe,
      badge: "← Exit",
      badgeColor: "bg-coral/20 text-coral border border-coral/40 font-mono text-[9px] font-bold",
      visible: true,
    },
    {
      name: "Overview Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      visible: true,
    },
    {
      name: "Institution Registry",
      href: "/institutions",
      icon: Building2,
      visible: role !== "PUBLIC",
    },
    {
      name: "Complaint Register",
      href: "/complaints",
      icon: Folders,
      visible: role !== "PUBLIC",
    },
    {
      name: "AI Overlap Review",
      href: "/overlaps",
      icon: GitMerge,
      badge: "2",
      badgeColor: "bg-coral text-white font-mono font-bold",
      visible: permissions.canReviewOverlaps,
    },
    {
      name: "Tasks & Workload",
      href: "/tasks",
      icon: CheckSquare,
      visible: role !== "PUBLIC" && role !== "AUDITOR",
    },
    {
      name: "Alerts & Escalations",
      href: "/alerts",
      icon: AlertTriangle,
      badge: "4",
      badgeColor: "bg-amber-500 text-white font-mono font-bold",
      visible: role !== "PUBLIC",
    },
    {
      name: "Analytics & Reports",
      href: "/analytics",
      icon: BarChart3,
      visible: role !== "PUBLIC",
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
      visible: permissions.canManageUsers,
    },
    {
      name: "System Settings",
      href: "/admin/settings",
      icon: Settings,
      visible: permissions.canModifySettings || role === "AICTE_ADMIN" || role === "AICTE_OFFICIAL",
    },
    {
      name: "Public Grievance Track",
      href: "/track",
      icon: ExternalLink,
      visible: role === "PUBLIC" || role === "AICTE_ADMIN" || role === "AICTE_OFFICIAL",
    },
  ];

  const visibleNav = navItems.filter((item) => item.visible);

  const roleOptions: { role: UserRole; label: string; desc: string; badge: string }[] = [
    { 
      role: "AICTE_ADMIN", 
      label: "AICTE Administrator", 
      desc: "Full administrative & cross-bureau overview, case escalation & system configuration",
      badge: "Admin" 
    },
    { 
      role: "BUREAU_OFFICER", 
      label: "Bureau Dealing Officer", 
      desc: "PGRC / Regulation Bureau handling, evidence verification & stage updates",
      badge: "Officer" 
    },
    { 
      role: "COORDINATOR", 
      label: "Case Coordinator", 
      desc: "Cross-bureau task assignment, SLA monitoring & multi-agency alignment",
      badge: "Coordinator" 
    },
    { 
      role: "AUDITOR", 
      label: "Read-only Auditor", 
      desc: "Read-only inspection of records, audit logs & compliance reports",
      badge: "Auditor" 
    },
    { 
      role: "INSTITUTION", 
      label: "Institution Portal", 
      desc: "College compliance & notice responses",
      badge: "College" 
    },
    { 
      role: "PUBLIC", 
      label: "Public / Citizen Track", 
      desc: "Student & citizen grievance tracking",
      badge: "Citizen" 
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-[#0C0F1D]/80 z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar: Solid Ink-Navy Column */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between bg-[#080B14]/95 backdrop-blur-xl text-white transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-68",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top Header */}
        <div className="overflow-y-auto overflow-x-hidden">
          <div className="h-20 px-5 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 overflow-hidden group py-1"
            >
              {sidebarCollapsed ? (
                <PrismLogo
                  size="lg"
                  variant="icon"
                  animated
                  imgClassName="p-0.5"
                />
              ) : (
                <PrismLogo
                  size="lg"
                  variant="full"
                  subtitle="Institution Intelligence"
                  animated
                />
              )}
            </Link>

            {/* Collapse toggle button on desktop */}
            <button
              onClick={toggleSidebar}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:flex h-7 w-7 items-center justify-center text-[#9AA0B5] hover:text-white hover:bg-white/10 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>

            {/* Close button on mobile */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              title="Close sidebar"
              className="lg:hidden h-8 w-8 rounded-lg flex items-center justify-center text-[#9AA0B5] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close mobile sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* AI Banner Callout */}
          {!sidebarCollapsed && (
            <div className="mx-4 mt-3 p-3 bg-[#1C2138] border-l-2 border-coral">
              <div className="flex items-center gap-2 font-bold text-xs text-white">
                <Sparkles className="h-3.5 w-3.5 text-coral" />
                <span className="uppercase tracking-widest text-[10px]">Cross-Bureau Intelligence</span>
              </div>
              <p className="mt-1 text-[11px] text-[#9AA0B5] leading-relaxed">
                Aggregating grievances across AICTE bureaus into a <strong className="text-white">single institutional profile</strong>.
              </p>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-2 space-y-1 mt-2">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 text-xs transition-all group relative font-medium",
                    isActive
                      ? "bg-[#1D233D] text-white font-bold"
                      : "text-[#9AA0B5] hover:bg-white/5 hover:text-white"
                  )}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  {/* Active accent bar */}
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-coral" />
                  )}

                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 stroke-[1.75] transition-transform group-hover:scale-105",
                      isActive ? "text-coral" : "text-[#9AA0B5] group-hover:text-white"
                    )}
                  />

                  {!sidebarCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}

                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={cn(
                        "ml-auto text-[10px] px-2 py-0.5",
                        item.badgeColor
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Card & Role Switcher */}
        <div className="p-3 relative">
          {/* Interactive Role Switcher Dropdown */}
          {roleMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 p-3 bg-[#1C2138] border border-[#262C46] shadow-2xl z-50 animate-in fade-in max-h-96 overflow-y-auto">
              <div className="px-2 py-1 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#9AA0B5] flex items-center justify-between">
                <span>Switch Demo Persona</span>
                <span className="text-[9px] text-coral font-mono">DEMO MODE</span>
              </div>
              <div className="space-y-1.5 mt-2">
                {roleOptions.map((opt) => (
                  <button
                    key={opt.role}
                    onClick={() => {
                      setRole(opt.role);
                      setRoleMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left p-2.5 text-xs transition-colors flex flex-col border",
                      (role === opt.role || (role === "AICTE_OFFICIAL" && opt.role === "AICTE_ADMIN"))
                        ? "bg-coral/20 border-coral text-white font-bold"
                        : "border-transparent hover:bg-white/10 text-[#9AA0B5] hover:text-white"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{opt.label}</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 bg-white/10 text-white/80">
                        {opt.badge}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-75 mt-0.5 leading-snug">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                <Link
                  href="/login"
                  onClick={() => setRoleMenuOpen(false)}
                  className="text-coral hover:underline font-bold"
                >
                  Switch / Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setRoleMenuOpen(false)}
                  className="text-white/70 hover:text-white hover:underline"
                >
                  New Account +
                </Link>
              </div>
            </div>
          )}

          {/* User Card Trigger */}
          <div
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className={cn(
              "p-2.5 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-white/10",
              roleMenuOpen && "bg-white/10 border-white/20"
            )}
            title="Click to switch demo persona"
          >
            <div className="relative">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                alt={user.name}
                className="h-9 w-9 object-cover border border-white/20"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-[#1E8E4E] ring-2 ring-[#14182B]" />
            </div>

            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    {user.name}
                  </span>
                </div>
                <span className="text-[11px] text-[#9AA0B5] truncate">
                  {user.designation}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-coral font-bold mt-0.5 flex items-center gap-1">
                  Persona: {role.replace("_", " ")} ▾
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
