"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { PrismLogo } from "@/components/ui/PrismLogo";
import { 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight,
  Home,
  Cpu,
  Building2,
  BarChart3,
  ShieldCheck,
  Radio,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export const PublicHeader: React.FC = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { setCommandPaletteOpen } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { 
      name: "Home", 
      href: "/", 
      icon: Home,
      desc: "Platform Overview",
      accent: "group-hover:text-white"
    },
    { 
      name: "Technology", 
      href: "/technology", 
      icon: Cpu,
      desc: "AI Overlap Engine",
      accent: "group-hover:text-[#5FE0D0]"
    },
    { 
      name: "Bureaus", 
      href: "/bureaus", 
      icon: Building2,
      desc: "Autonomous Jurisdictions",
      accent: "group-hover:text-blue-400"
    },
    { 
      name: "Metrics", 
      href: "/metrics", 
      icon: BarChart3,
      desc: "Reconciled Data Ledger",
      accent: "group-hover:text-emerald-400"
    },
    { 
      name: "Compliance", 
      href: "/compliance", 
      icon: ShieldCheck,
      desc: "Statutory Protocols",
      accent: "group-hover:text-purple-400"
    },
    { 
      name: "Track", 
      href: "/track", 
      icon: Radio,
      desc: "Public Citizen Tracking",
      highlight: true,
      accent: "group-hover:text-coral"
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2 transition-all duration-300">
      {/* FLOATING CYBERNETIC GLASS NAV ISLAND */}
      <div
        className={cn(
          "max-w-7xl mx-auto rounded-2xl relative transition-all duration-300",
          scrolled
            ? "bg-[#080B14]/90 backdrop-blur-2xl border border-white/[0.12] shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(224,90,71,0.08)] py-2 px-3 sm:px-5"
            : "bg-[#080B14]/75 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-2.5 px-3 sm:px-6"
        )}
      >
        {/* Subtle Ambient Laser Edge Glow */}
        <div className="absolute -inset-px rounded-2xl pointer-events-none opacity-40 bg-gradient-to-r from-coral/25 via-[#5FE0D0]/15 to-purple-500/20 blur-xs -z-10" />

        <div className="flex items-center justify-between gap-2 md:gap-4 lg:gap-6">
          
          {/* 1. LEFT BRAND IDENTITY WITH LIVE TELEMETRY DOT */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative">
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                <PrismLogo size="md" variant="icon" animated />
              </div>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-coral/30 via-[#5FE0D0]/20 to-purple-500/20 blur-md opacity-25 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex items-center">
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-coral group-hover:to-[#5FE0D0] transition-all">
                PRISM<span className="text-coral">.</span>
              </span>
            </div>
          </Link>

          {/* 2. CENTER FLOATING SEGMENTED NAVIGATION DOCK */}
          <nav 
            className="hidden lg:flex items-center gap-0.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] shrink-0"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              const isHovered = hoveredIndex === idx;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  className={cn(
                    "relative px-2.5 xl:px-3.5 py-1.5 xl:py-2 text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 z-10 select-none group",
                    isActive
                      ? "text-coral font-black"
                      : link.highlight
                      ? "text-coral hover:text-coral-hover"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {/* Fluid Gliding Hover Capsule */}
                  {isHovered && (
                    <motion.div
                      layoutId="crazyNavHighlight"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/20 shadow-[0_0_16px_rgba(255,255,255,0.08),inset_0_1px_0_0_rgba(255,255,255,0.25)] -z-10"
                    />
                  )}

                  {/* Fluid Active Route Pill */}
                  {isActive && !isHovered && (
                    <motion.div
                      layoutId="crazyNavActive"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-coral/15 border border-coral/40 shadow-[0_0_16px_rgba(224,90,71,0.25),inset_0_1px_0_0_rgba(255,255,255,0.2)] -z-10"
                    />
                  )}

                  {/* Animated Icon with micro-bounce */}
                  <Icon className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110 shrink-0",
                    isActive ? "text-coral" : "text-white/50",
                    link.accent
                  )} />

                  <span className="transition-colors whitespace-nowrap">{link.name}</span>

                  {/* Live Radar Beacon for Citizen Track */}
                  {link.highlight && (
                    <span className="relative flex h-2 w-2 ml-0.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-coral" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. RIGHT CYBERNETIC CONTROL CLUSTER */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ rotate: 180, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 xl:p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white transition-colors shadow-xs shrink-0"
              aria-label="Toggle Theme"
              title={mounted && theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {!mounted || theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-300" />
              )}
            </motion.button>

            {/* Single-word Login */}
            <Link
              href="/login"
              className={cn(
                "px-2.5 xl:px-3 py-1.5 rounded-lg text-white font-bold text-[11px] xl:text-xs uppercase tracking-wider transition-all whitespace-nowrap",
                pathname === "/login" 
                  ? "text-coral bg-coral/10 border border-coral/30 shadow-[0_0_12px_rgba(224,90,71,0.25)]" 
                  : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              Login
            </Link>

            {/* UNIFIED REGISTER & CONSOLE BOX (SAME BOX · NO OVERLAPPING) */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/15 backdrop-blur-xl shadow-inner shrink-0 relative overflow-hidden group/box">
              {/* Subtle ambient border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-coral/10 to-transparent pointer-events-none opacity-0 group-hover/box:opacity-100 transition-opacity" />

              {/* Register Action inside Box */}
              <Link
                href="/signup"
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold text-[11px] xl:text-xs uppercase tracking-wider transition-all whitespace-nowrap z-10",
                  pathname === "/signup"
                    ? "bg-white/15 text-white shadow-xs"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                Register
              </Link>

              {/* Separation Divider */}
              <span className="w-px h-3.5 bg-white/15 mx-0.5 shrink-0 z-10" />

              {/* Console Action inside Box */}
              <Link
                href="/dashboard"
                className="relative p-[1px] rounded-lg overflow-hidden group/console z-10 shrink-0"
              >
                {/* 360-degree Rotating Conic Laser Beam strictly bounded */}
                <div className="absolute inset-[-100%] animate-laser-spin bg-[conic-gradient(from_0deg,transparent_0_340deg,#E05A47_360deg)] opacity-85 group-hover/console:opacity-100" />

                {/* Inner Pill */}
                <div className="relative px-3.5 py-1 rounded-[7px] bg-[#0E1322] group-hover/console:bg-coral transition-colors flex items-center gap-1.5 text-[11px] xl:text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap shadow-xs">
                  <Sparkles className="h-3.5 w-3.5 text-coral group-hover/console:text-white transition-colors" />
                  <span>Console</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover/console:translate-x-0.5" />
                </div>
              </Link>
            </div>

          </div>

          {/* 4. MOBILE MENU HAMBURGER & THEME TRIGGER */}
          <div className="lg:hidden flex items-center gap-1.5">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70"
              aria-label="Toggle Theme"
            >
              {!mounted || theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:text-coral transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 5. ANIMATED MOBILE COMMAND DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden mt-2 max-w-7xl mx-auto bg-[#080B14]/98 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[85vh]"
          >
            <div className="p-4 sm:p-6 space-y-4">
              
              {/* Search Bar in Mobile Menu */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCommandPaletteOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-mono"
              >
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-coral" />
                  <span>Search cases, bureaus, or institutions...</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white">⌘K</span>
              </button>

              {/* Single-Word Nav Links with Micro-Descriptions */}
              <nav className="divide-y divide-white/5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "py-3 flex items-center justify-between transition-colors group",
                        isActive ? "text-coral font-bold" : "text-white/80 hover:text-coral"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg border transition-colors",
                          isActive 
                            ? "bg-coral text-white border-coral shadow-[0_0_12px_rgba(224,90,71,0.4)]" 
                            : "bg-white/5 border-white/10 group-hover:border-coral text-coral"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs uppercase font-bold tracking-wider text-white">
                            {link.name}
                          </div>
                          <div className="text-[10px] text-white/50 font-normal font-sans">
                            {link.desc}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {link.highlight && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-coral text-white uppercase animate-pulse">
                            Live
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-coral group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Actions (Login, Register & Console) */}
              <div className="pt-3 space-y-2.5">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block py-2.5 px-3 rounded-xl border border-white/15 text-center font-bold text-xs uppercase tracking-wider text-white hover:border-coral transition-colors"
                >
                  Login
                </Link>

                {/* Unified Mobile Register & Console Box (Same Box · No Overlap) */}
                <div className="flex items-stretch p-1 rounded-xl bg-white/[0.04] border border-white/15 overflow-hidden">
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 px-3 rounded-lg text-center font-bold text-xs uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                  >
                    Register
                  </Link>

                  <span className="w-px bg-white/15 my-1 shrink-0" />

                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-coral hover:bg-coral-hover text-white text-center font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-coral/30"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                    <span>Console</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
