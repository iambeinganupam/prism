"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Shield, 
  Building2, 
  Search, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  RefreshCw,
  GitMerge,
  ShieldCheck,
  CheckCircle2,
  Info,
  UserCheck
} from "lucide-react";
import { HeroAmbient } from "@/components/layout/HeroAmbient";
import { PrismLogo } from "@/components/ui/PrismLogo";

export default function LoginPage() {
  const router = useRouter();
  const { setRole, login } = useAuthStore();

  const [username, setUsername] = useState("r.kumar@aicte-india.org");
  const [password, setPassword] = useState("Demopassword@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("7X9B");
  const [errorShake, setErrorShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const demoRolesList: { role: UserRole; title: string; subtitle: string; icon: any; color: string }[] = [
    {
      role: "AICTE_ADMIN",
      title: "AICTE Administrator",
      subtitle: "Full central overview, escalations & settings",
      icon: Shield,
      color: "border-coral text-coral",
    },
    {
      role: "BUREAU_OFFICER",
      title: "Bureau Officer",
      subtitle: "PGRC / Regulation Bureau dealing & stage transitions",
      icon: UserCheck,
      color: "border-blue-500 text-blue-600",
    },
    {
      role: "COORDINATOR",
      title: "Case Coordinator",
      subtitle: "Task assignment & cross-bureau coordination",
      icon: GitMerge,
      color: "border-amber-500 text-amber-600",
    },
    {
      role: "AUDITOR",
      title: "Read-only Auditor",
      subtitle: "Read-only inspection of records & audit trails",
      icon: ShieldCheck,
      color: "border-emerald-500 text-emerald-600",
    },
  ];

  const handleInstantDemoLogin = (roleToSet: UserRole) => {
    setLoading(true);
    setRole(roleToSet);
    login(roleToSet);
    toast.success(`Signed in as ${roleToSet.replace("_", " ")}`);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 350);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorShake(true);
      toast.error("Please provide both username and password");
      setTimeout(() => setErrorShake(false), 600);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRole("AICTE_ADMIN");
      login("AICTE_ADMIN");
      toast.success("Authentication successful");
      router.push("/dashboard");
    }, 450);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 relative overflow-hidden bg-[#080B14] text-white">
      {/* Dynamic Refractive Glow Orbs matching Home Page */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-coral/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#5FE0D0]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Container Card */}
      <div className="w-full max-w-5xl bg-white/[0.03] border border-white/15 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[640px] relative z-10 backdrop-blur-xl">
        
        {/* LEFT COLUMN: Visual Brand & Context */}
        <div className="lg:col-span-5 relative overflow-hidden flex flex-col bg-white/[0.02] text-white p-5 sm:p-8 lg:p-10 justify-between">
          <div>
            <div className="flex items-center gap-3.5 mb-6">
              <PrismLogo
                size="xl"
                variant="icon"
                animated
                className="shrink-0"
              />
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                  PRISM<span className="text-coral">.</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-white/10 text-white/90">
                    AICTE
                  </span>
                </h1>
                <p className="text-[10px] text-white/70 font-mono uppercase tracking-wider mt-1">
                  Personal Launch · Autonomous Institution Intelligence
                </p>
              </div>
            </div>

            <div className="space-y-4 my-8">
              <span className="text-[10px] uppercase font-bold tracking-widest text-coral block font-mono">
                Institutional Intelligence Platform
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-black leading-tight text-white">
                Integrated Dashboard for Monitoring &amp; Tracking Grievance Cases Across AICTE Bureaus
              </h2>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                Unifying Public Grievance Redressal Cell (PGRC), Regulation Bureau (RB), Academic Bureau (ACA), and Approvals under a single AICTE institutional profile.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-coral shrink-0" />
              <span>Multi-vector semantic similarity engine with confidence scoring.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Strict human-in-the-loop verification; statutory independence preserved.</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication & Demo Role Selectors (Monolithic Obsidian) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white/[0.02] text-white">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-black text-white">
                  Sign In to PRISM Portal
                </h2>
                <p className="text-xs text-white/60 mt-1">
                  Select a pre-configured persona for instant demo access or enter credentials.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-white/50 hidden sm:inline">New user?</span>
                <Link
                  href="/signup"
                  className="font-bold text-coral hover:underline flex items-center gap-0.5"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* DEMO ROLE SELECTOR CARDS */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/70">
                <span>Select Demo Access Persona</span>
                <span className="text-[10px] font-mono text-coral font-bold">1-Click Login</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {demoRolesList.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      disabled={loading}
                      onClick={() => handleInstantDemoLogin(item.role)}
                      className="p-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-coral transition-all text-left flex items-start gap-2.5 group"
                    >
                      <div className={cn("p-1.5 border shrink-0 bg-white/5 border-white/10", item.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-white group-hover:text-coral transition-colors block truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-white/60 block line-clamp-1">
                          {item.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative my-6 text-center">
              <span className="px-3 bg-[#080B14] text-[10px] uppercase font-bold tracking-wider text-white/40">
                Or Sign In With Account
              </span>
            </div>

            {/* Credential Form */}
            <form
              onSubmit={handleFormLogin}
              className={cn("space-y-3.5 text-xs", errorShake && "animate-shake")}
            >
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-white/70 mb-1">
                  Official Email / Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="r.kumar@aicte-india.org"
                    className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:border-coral outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-white/70 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2.5 bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:border-coral outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-coral hover:bg-coral-hover text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>{loading ? "Authenticating Demo Session..." : "Sign In with Credentials"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Additional helper links */}
            <div className="mt-4 pt-3 flex items-center justify-between text-xs text-white/60">
              <span>Don&apos;t have an account yet?</span>
              <Link href="/signup" className="font-bold text-coral hover:underline flex items-center gap-1">
                <span>Create an Account (Sign Up)</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Footer notice */}
          <div className="mt-6 pt-3 text-center text-[10px] text-white/50 font-mono">
            DEMO PERSONAS ACTIVE · SECURE ROLE-BASED ACCESS CONTROL ENABLED
          </div>
        </div>
      </div>
    </div>
  );
}
