"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, UserProfile } from "@/store/useAuthStore";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Building2, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  GraduationCap, 
  Scale, 
  Shield, 
  AlertCircle 
} from "lucide-react";
import { PrismLogo } from "@/components/ui/PrismLogo";

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuthStore();

  const [selectedRole, setSelectedRole] = useState<UserRole>("INSTITUTION");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Institution-specific fields
  const [aicteId, setAicteId] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [designation, setDesignation] = useState("Principal / Director");

  // Bureau-specific fields
  const [bureau, setBureau] = useState("PGRC");

  // Citizen-specific fields
  const [citizenType, setCitizenType] = useState("Student");

  // Captcha & Legal
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("K8N2");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (captchaInput.toUpperCase() !== captchaCode) {
      toast.error("Invalid security captcha code.");
      refreshCaptcha();
      return;
    }

    if (!termsAgreed) {
      toast.error("You must accept the statutory authenticity declaration.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let profile: UserProfile = {
        name: fullName.trim(),
        email: email.trim(),
        designation: designation,
        badge: selectedRole === "INSTITUTION" ? "Institution" : selectedRole === "BUREAU_OFFICER" ? "Officer" : "Registered",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      };

      if (selectedRole === "INSTITUTION") {
        profile.institutionId = aicteId.trim() || "1-9988776655";
        profile.institutionName = institutionName.trim() || "Registered Technical Institute";
        profile.designation = designation;
      } else if (selectedRole === "BUREAU_OFFICER") {
        profile.bureau = bureau;
        profile.designation = `${bureau} Dealing Officer`;
      } else if (selectedRole === "PUBLIC") {
        profile.designation = `${citizenType} Complainant`;
      }

      signup(profile, selectedRole);
      setLoading(false);
      toast.success("Account registered successfully! Welcome to PRISM.");
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-[#080B14] text-white">
      {/* Dynamic Refractive Glow Orbs matching Home Page */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-coral/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#5FE0D0]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Container Card */}
      <div className="w-full max-w-5xl bg-white/[0.03] border border-white/15 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[680px] relative z-10 backdrop-blur-xl">
        
        {/* LEFT COLUMN: Visual Brand & Context */}
        <div className="lg:col-span-4 relative overflow-hidden flex flex-col bg-white/[0.02] text-white p-5 sm:p-8 justify-between">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <PrismLogo
                size="lg"
                variant="icon"
                animated
                className="shrink-0"
              />
              <div>
                <h1 className="font-display text-2xl font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                  PRISM<span className="text-coral">.</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-white/10 text-white/90">
                    AICTE
                  </span>
                </h1>
                <p className="text-[10px] text-white/70 font-mono uppercase tracking-wider mt-1">
                  Personal Launch · Autonomous Institution Intelligence
                </p>
              </div>
            </Link>

            <div className="space-y-4 my-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-coral block font-mono">
                Statutory Registration Portal
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-black leading-tight text-white">
                Create Authorized PRISM Access
              </h2>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                Register as an institutional compliance desk, AICTE bureau dealing officer, or citizen complainant to access real-time dossiers.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>DPDP Act 2023 & IT Act 2000 Compliant.</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-coral shrink-0" />
              <span>Instant AICTE Permanent ID verification.</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sign Up Form (Monolithic Obsidian) */}
        <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between bg-white/[0.02] text-white">
          <div>
            {/* Top Bar Switcher */}
            <div className="flex items-center justify-between pb-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-black text-white">
                  Sign Up for PRISM
                </h2>
                <p className="text-xs text-white/60 mt-0.5">
                  Select your role and complete authorized registration.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-white/50 hidden sm:inline">Already registered?</span>
                <Link
                  href="/login"
                  className="font-bold text-coral hover:underline flex items-center gap-0.5"
                >
                  <span>Sign In</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* ROLE SELECTOR TILES */}
            <div className="mb-6">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70 mb-2">
                Select Your Regulatory Identity
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    role: "INSTITUTION" as UserRole,
                    title: "Institution",
                    desc: "College Compliance",
                    icon: Building2,
                  },
                  {
                    role: "BUREAU_OFFICER" as UserRole,
                    title: "Bureau Officer",
                    desc: "AICTE Adjudicator",
                    icon: Shield,
                  },
                  {
                    role: "PUBLIC" as UserRole,
                    title: "Citizen",
                    desc: "Student / Faculty",
                    icon: User,
                  },
                  {
                    role: "AUDITOR" as UserRole,
                    title: "Auditor",
                    desc: "Statutory Inspection",
                    icon: Scale,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setSelectedRole(item.role)}
                      className={cn(
                        "p-2.5 text-left border transition-all flex flex-col justify-between h-20",
                        isSelected
                          ? "border-coral bg-coral/10 text-white shadow-sm"
                          : "border-white/10 bg-white/[0.03] hover:border-white/30 text-white/60"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon className={cn("h-4 w-4", isSelected ? "text-coral" : "text-white/50")} />
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-coral" />}
                      </div>
                      <div>
                        <div className={cn("text-xs font-bold truncate", isSelected ? "text-white" : "text-white/70")}>
                          {item.title}
                        </div>
                        <div className="text-[9px] text-white/50 truncate">
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FORM FIELDS */}
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Ramesh Kumar"
                      className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:border-coral outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1">
                    Official Email ID *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        selectedRole === "BUREAU_OFFICER"
                          ? "officer@aicte-india.org"
                          : selectedRole === "INSTITUTION"
                          ? "principal@college.edu.in"
                          : "user@example.com"
                      }
                      className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:border-coral outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Mobile Number & Role-Specific Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1">
                    Registered Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:border-coral outline-none"
                    />
                  </div>
                </div>

                {/* INSTITUTION ROLE FIELDS */}
                {selectedRole === "INSTITUTION" && (
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1">
                      AICTE Permanent Institute ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={aicteId}
                      onChange={(e) => setAicteId(e.target.value)}
                      placeholder="e.g. 1-1234567890"
                      className="w-full px-3 py-2 bg-white/5 border border-white/15 text-white font-mono placeholder-white/30 text-xs focus:border-coral outline-none"
                    />
                  </div>
                )}

                {/* BUREAU ROLE FIELDS */}
                {selectedRole === "BUREAU_OFFICER" && (
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1">
                      Assigned AICTE Bureau *
                    </label>
                    <select
                      value={bureau}
                      onChange={(e) => setBureau(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F1422] border border-white/15 text-white text-xs focus:border-coral outline-none"
                    >
                      <option value="PGRC">Public Grievance Redressal Cell (PGRC)</option>
                      <option value="RB">Regulation Bureau (RB)</option>
                      <option value="ACA">Academic Bureau (ACA)</option>
                      <option value="APP">Approval Bureau (APP)</option>
                      <option value="RO">Regional Office (RO)</option>
                    </select>
                  </div>
                )}

                {/* CITIZEN ROLE FIELDS */}
                {selectedRole === "PUBLIC" && (
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1">
                      Complainant Category *
                    </label>
                    <select
                      value={citizenType}
                      onChange={(e) => setCitizenType(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F1422] border border-white/15 text-white text-xs focus:border-coral outline-none"
                    >
                      <option value="Student">Enrolled Student</option>
                      <option value="Faculty">Faculty Member / Teaching Staff</option>
                      <option value="Parent">Parent / Guardian</option>
                      <option value="Citizen">General Citizen / Whistleblower</option>
                    </select>
                  </div>
                )}

                {/* AUDITOR ROLE FIELDS */}
                {selectedRole === "AUDITOR" && (
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1">
                      Auditor Impanelment ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AUD-2026-901"
                      className="w-full px-3 py-2 bg-white/5 border border-white/15 text-white font-mono placeholder-white/30 text-xs focus:border-coral outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Extra Institution Field: College Name */}
              {selectedRole === "INSTITUTION" && (
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1">
                    Registered Institution / College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="e.g. ABC Institute of Technology & Engineering"
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:border-coral outline-none"
                  />
                </div>
              )}

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-8 pr-8 py-2 bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:border-coral outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:border-coral outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Captcha & Verification */}
              <div className="p-3 bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black tracking-widest px-3 py-1 bg-white/10 border border-white/15 text-white select-none">
                    {captchaCode}
                  </span>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 border border-white/15 transition-colors"
                    title="Refresh Captcha"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    required
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter security code"
                    className="w-full px-3 py-1.5 bg-white/5 border border-white/15 text-xs font-mono uppercase focus:border-coral outline-none text-white placeholder-white/30"
                  />
                </div>
              </div>

              {/* Statutory Declaration */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 accent-coral"
                />
                <span className="text-[11px] text-white/60 leading-tight">
                  I hereby declare under the Information Technology Act 2000 &amp; DPDP Act 2023 that all submitted credentials are true, accurate, and authorized for AICTE statutory communications.
                </span>
              </label>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-coral hover:bg-coral-hover text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>{loading ? "Registering & Provisioning Access..." : "Register & Enter PRISM Portal"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Footer Notice */}
          <div className="mt-6 pt-3 flex items-center justify-between text-[10px] text-white/50 font-mono">
            <span>INDEPENDENT PERSONAL LAUNCH · PRISM 2026</span>
            <Link href="/login" className="text-coral hover:underline font-bold">
              Return to Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

