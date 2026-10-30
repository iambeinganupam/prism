"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { PrismLogo } from "@/components/ui/PrismLogo";
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  Globe, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  ShieldAlert,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_NOTIFICATIONS } from "@/lib/mock/data";

export const TopBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { 
    setMobileSidebarOpen, 
    setCommandPaletteOpen,
    language,
    setLanguage
  } = useAppStore();
  const { role } = useAuthStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // Build breadcrumbs dynamically from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, idx) => {
    const href = "/" + pathSegments.slice(0, idx + 1).join("/");
    let label = segment.replace(/-/g, " ");
    if (segment.includes("%2F") || segment.includes("/")) {
      label = decodeURIComponent(segment);
    } else {
      label = label.charAt(0).toUpperCase() + label.slice(1);
    }
    return { href, label };
  });

  return (
    <header className="sticky top-0 z-30 w-full bg-[#080B14]/90 backdrop-blur-xl text-white">
      <div className="h-16 px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger, Back button & breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Dedicated Back to Previous Page button */}
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 hover:border-coral text-white hover:text-coral transition-all text-xs font-bold group shrink-0 shadow-xs"
            title="Go back to previous page"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-coral" />
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider">Back</span>
          </button>

          {/* Quick Return to Public Portal */}
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-coral/40 text-white/70 hover:text-coral transition-all text-xs font-mono shrink-0 shadow-xs"
            title="Return to PRISM Public Portal Home"
          >
            <Globe className="h-3.5 w-3.5 text-coral" />
            <span className="text-[11px] uppercase tracking-wider font-bold">Portal</span>
          </Link>

          {/* Mobile brand mark */}
          <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
            <PrismLogo size="sm" variant="icon" />
            <span className="font-display font-black text-sm tracking-tight text-ink">
              PRISM<span className="text-coral">.</span>
            </span>
          </Link>

          {/* Breadcrumbs */}
          <nav className="hidden lg:flex items-center gap-2 text-xs text-ink-muted">
            <Link
              href="/dashboard"
              className="hover:text-coral font-bold uppercase tracking-wider text-[11px] transition-colors flex items-center gap-1.5"
            >
              <PrismLogo size="xs" variant="icon" />
              <span>PRISM</span>
            </Link>
            {breadcrumbItems.map((item, idx) => (
              <React.Fragment key={item.href}>
                <ChevronRight className="h-3 w-3 text-ink-faint" />
                {idx === breadcrumbItems.length - 1 ? (
                  <span className="font-bold text-ink uppercase tracking-wider text-[11px] truncate max-w-[120px] sm:max-w-[160px] xl:max-w-[220px]">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-coral transition-colors uppercase tracking-wider text-[11px]"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center: Global Search Bar as an Elevated Cybernetic Input */}
        <div className="hidden sm:flex flex-1 max-w-md mx-2 sm:mx-3">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-coral/50 text-white/70 hover:text-white text-xs transition-all group shadow-xs backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-coral" />
              </span>
              <Search className="h-4 w-4 text-white/40 group-hover:text-coral transition-colors" />
              <span className="truncate">
                {language === "EN" ? "Search institution, Case ID, or keywords…" : "संस्थान, केस आईडी या कीवर्ड खोजें..."}
              </span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 border border-white/15 text-white/80 group-hover:border-coral/40 group-hover:text-coral transition-colors">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons: Mobile Search Trigger, Language, Theme, Notifications, Role */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mobile Search Button Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="sm:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-coral transition-colors"
            title="Search (⌘K)"
            aria-label="Search"
          >
            <Search className="h-4 w-4 text-coral" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "EN" ? "HI" : "EN")}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs font-bold text-ink hover:bg-surface-alt border border-line transition-colors rounded-lg"
            title="Toggle Language"
          >
            <Globe className="h-3.5 w-3.5 text-coral" />
            <span className="text-[10px] font-mono">{language}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 sm:p-2 text-ink-muted hover:text-ink hover:bg-surface-alt border border-line transition-colors rounded-lg"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-coral" />
            ) : (
              <Moon className="h-4 w-4 text-ink" />
            )}
          </button>

          {/* Notifications Bell with Popover */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className={cn(
                "p-2 text-ink-muted hover:text-ink hover:bg-surface-alt border border-line transition-colors relative",
                notifOpen && "bg-surface-alt border-coral"
              )}
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-coral ring-2 ring-surface" />
              )}
            </button>

            {/* Notifications Popover Dropdown (Square-cornered, 4px coral top edge) */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-line border-t-4 border-t-coral shadow-2xl z-50 animate-in fade-in">
                <div className="px-5 py-3.5 border-b border-line flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-ink">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 bg-coral text-white font-mono font-bold">
                        {unreadCount} NEW
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-coral hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-line">
                  {notifications.map((n) => {
                    const isOverlap = n.type === "OVERLAP_IDENTIFIED";
                    const isOverdue = n.type === "OVERDUE";

                    return (
                      <Link
                        key={n.id}
                        href={n.actionUrl || "/notifications"}
                        onClick={() => {
                          setNotifications(
                            notifications.map((item) =>
                              item.id === n.id ? { ...item, read: true } : item
                            )
                          );
                          setNotifOpen(false);
                        }}
                        className={cn(
                          "p-4 hover:bg-surface-alt cursor-pointer transition-colors flex gap-3 text-xs",
                          !n.read && "bg-coral/5"
                        )}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isOverlap ? (
                            <div className="h-7 w-7 bg-navy-block text-white flex items-center justify-center">
                              <ShieldAlert className="h-3.5 w-3.5 text-coral" />
                            </div>
                          ) : isOverdue ? (
                            <div className="h-7 w-7 bg-[#B0121B] text-white flex items-center justify-center">
                              <AlertCircle className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <div className="h-7 w-7 bg-[#2F6FED] text-white flex items-center justify-center">
                              <Clock className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-ink truncate">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-ink-faint shrink-0 ml-2 font-mono">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-ink-muted leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="p-3 text-center border-t border-line bg-surface">
                  <Link
                    href="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-bold text-coral hover:underline"
                  >
                    View all notifications & reminders ▸
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Persona Chip */}
          <div className="hidden md:flex items-center pl-3 border-l border-line">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-navy-block text-white">
              {role.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
