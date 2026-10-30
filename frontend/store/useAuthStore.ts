import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/types";

export interface UserProfile {
  name: string;
  email: string;
  designation: string;
  bureau?: string;
  institutionId?: string;
  institutionName?: string;
  avatar?: string;
  badge?: string;
}

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  AICTE_ADMIN: {
    name: "Shri R. Kumar",
    email: "r.kumar@aicte-india.org",
    designation: "Deputy Director & Central Administrator",
    bureau: "Central HQ",
    badge: "Admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  AICTE_OFFICIAL: {
    name: "Shri R. Kumar",
    email: "r.kumar@aicte-india.org",
    designation: "Deputy Director & Central Administrator",
    bureau: "Central HQ",
    badge: "Admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  BUREAU_OFFICER: {
    name: "Dr. Sunita Sharma",
    email: "s.sharma@aicte-india.org",
    designation: "Director (Regulation Bureau)",
    bureau: "RB",
    badge: "Officer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  },
  COORDINATOR: {
    name: "Prof. Arvind Narang",
    email: "a.narang@aicte-india.org",
    designation: "Senior Case Coordinator",
    bureau: "Coordination Wing",
    badge: "Coordinator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
  AUDITOR: {
    name: "Smt. Meenakshi Sundaram",
    email: "m.sundaram@aicte-audit.org",
    designation: "Independent Compliance Auditor",
    bureau: "Statutory Audit Cell",
    badge: "Auditor (Read-Only)",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
  },
  INSTITUTION: {
    name: "Dr. K. L. Aggarwal",
    email: "registrar@abcit.ac.in",
    designation: "Principal / Registrar",
    institutionId: "inst-1",
    institutionName: "ABC Institute of Technology",
    badge: "Institution",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  },
  PUBLIC: {
    name: "Aman Verma",
    email: "aman.verma@gmail.com",
    designation: "Citizen / Student Complainant",
    badge: "Public",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
  },
};

interface AuthState {
  role: UserRole;
  user: UserProfile;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  login: (role?: UserRole, customUser?: UserProfile) => void;
  signup: (user: UserProfile, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: "AICTE_ADMIN",
      user: DEMO_USERS.AICTE_ADMIN,
      isAuthenticated: true,
      setRole: (role: UserRole) => {
        set({
          role,
          user: DEMO_USERS[role] || DEMO_USERS.AICTE_ADMIN,
        });
      },
      login: (role: UserRole = "AICTE_ADMIN", customUser?: UserProfile) => {
        set({
          role,
          user: customUser || DEMO_USERS[role] || DEMO_USERS.AICTE_ADMIN,
          isAuthenticated: true,
        });
      },
      signup: (newUser: UserProfile, role: UserRole) => {
        set({
          role,
          user: newUser,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          role: "PUBLIC",
          user: DEMO_USERS.PUBLIC,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "prism_auth_storage_v2",
    }
  )
);
