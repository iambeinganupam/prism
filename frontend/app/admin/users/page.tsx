"use client";

import React, { useState, useEffect } from "react";
import { prismApi } from "@/lib/api";
import { Officer, UserRole } from "@/types";
import { BureauChip } from "@/components/ui/BureauChip";
import { useAuthStore, DEMO_USERS } from "@/store/useAuthStore";
import { getPermissions } from "@/lib/permissions";
import { toast } from "sonner";
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Check, 
  X, 
  ArrowRight,
  Filter,
  UserCheck,
  ShieldAlert,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  designation: string;
  role: UserRole;
  roleLabel: string;
  bureau: any;
  status: "ACTIVE" | "INACTIVE";
  activeCases: number;
  avatar: string;
}

export default function AdminUsersPage() {
  const { role: currentRole, setRole, user: currentUser } = useAuthStore();
  const permissions = getPermissions(currentRole);

  const [usersList, setUsersList] = useState<ManagedUser[]>([
    {
      id: "u-1",
      name: "Shri R. Kumar",
      email: "r.kumar@aicte-india.org",
      designation: "Deputy Director & Central Administrator",
      role: "AICTE_ADMIN",
      roleLabel: "AICTE Administrator",
      bureau: "Central HQ",
      status: "ACTIVE",
      activeCases: 28,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "u-2",
      name: "Dr. Sunita Sharma",
      email: "s.sharma@aicte-india.org",
      designation: "Director (Regulation Bureau)",
      role: "BUREAU_OFFICER",
      roleLabel: "Bureau Dealing Officer",
      bureau: "RB",
      status: "ACTIVE",
      activeCases: 34,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "u-3",
      name: "Prof. Arvind Narang",
      email: "a.narang@aicte-india.org",
      designation: "Senior Case Coordinator",
      role: "COORDINATOR",
      roleLabel: "Case Coordinator",
      bureau: "Coordination Wing",
      status: "ACTIVE",
      activeCases: 21,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "u-4",
      name: "Smt. Meenakshi Sundaram",
      email: "m.sundaram@aicte-audit.org",
      designation: "Independent Compliance Auditor",
      role: "AUDITOR",
      roleLabel: "Read-only Auditor",
      bureau: "Statutory Audit Cell",
      status: "ACTIVE",
      activeCases: 0,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "u-5",
      name: "Ms. Priyanka Sen",
      email: "p.sen@aicte-india.org",
      designation: "Assistant Director (Approvals)",
      role: "BUREAU_OFFICER",
      roleLabel: "Bureau Dealing Officer",
      bureau: "APP",
      status: "ACTIVE",
      activeCases: 19,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "u-6",
      name: "Shri Vikram Deshmukh",
      email: "ro.western@aicte-india.org",
      designation: "Regional Officer (Western Region)",
      role: "BUREAU_OFFICER",
      roleLabel: "Bureau Dealing Officer",
      bureau: "RO",
      status: "ACTIVE",
      activeCases: 26,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "u-7",
      name: "Dr. K. L. Aggarwal",
      email: "registrar@abcit.ac.in",
      designation: "Principal / Registrar",
      role: "INSTITUTION",
      roleLabel: "Institution Portal",
      bureau: "inst-1",
      status: "ACTIVE",
      activeCases: 9,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [bureauFilter, setBureauFilter] = useState("ALL");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // New officer form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("BUREAU_OFFICER");
  const [newBureau, setNewBureau] = useState("PGRC");

  const toggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          toast.info(`${u.name} status updated to ${next}`);
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const handleSwitchDemoRole = (userRole: UserRole, userName: string) => {
    setRole(userRole);
    toast.success(`Switched active demo session to ${userName} (${userRole})`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser: ManagedUser = {
      id: `u-${Date.now()}`,
      name: newName,
      email: newEmail,
      designation: "Assigned Official",
      role: newRole,
      roleLabel: newRole.replace("_", " "),
      bureau: newBureau,
      status: "ACTIVE",
      activeCases: 0,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    };

    setUsersList([newUser, ...usersList]);
    setInviteModalOpen(false);
    setNewName("");
    setNewEmail("");
    toast.success(`User ${newName} provisioned and credentials sent to ${newEmail}`);
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.designation.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesBureau = bureauFilter === "ALL" || u.bureau === bureauFilter;
    return matchesSearch && matchesRole && matchesBureau;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-ink tracking-tight">
              User &amp; Officer Management
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-surface-alt border border-line text-ink">
              {usersList.length} Accounts
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Maintain bureau staffing, dealing permissions, and switch between test personas in Demo Mode.
          </p>
        </div>

        {permissions.canManageUsers && (
          <button
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-coral hover:bg-coral-hover text-white text-xs font-bold transition-colors shadow-sm shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Provision New Officer</span>
          </button>
        )}
      </div>

      {/* Demo notice */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0" />
          <span>Demo Authentication Mode: You can switch active role personas at any time using the "Switch Session" button.</span>
        </div>
        <span className="font-mono text-[10px] font-bold">Active: {currentRole}</span>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-surface border border-line grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or designation..."
            className="w-full pl-9 pr-3 py-2 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full p-2 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="AICTE_ADMIN">AICTE Administrator</option>
            <option value="BUREAU_OFFICER">Bureau Dealing Officer</option>
            <option value="COORDINATOR">Case Coordinator</option>
            <option value="AUDITOR">Read-only Auditor</option>
            <option value="INSTITUTION">Institution Portal</option>
          </select>
        </div>

        <div>
          <select
            value={bureauFilter}
            onChange={(e) => setBureauFilter(e.target.value)}
            className="w-full p-2 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
          >
            <option value="ALL">All Bureaus</option>
            <option value="Central HQ">Central HQ</option>
            <option value="PGRC">PGRC</option>
            <option value="RB">Regulation Bureau (RB)</option>
            <option value="ACA">Academic Bureau (ACA)</option>
            <option value="APP">Approval Bureau (APP)</option>
            <option value="RO">Regional Offices (RO)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface border border-line overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#14182B] text-white uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3">User Profile</th>
              <th className="p-3">Role Label</th>
              <th className="p-3">Bureau / Cell</th>
              <th className="p-3">Status</th>
              <th className="p-3">Active Caseload</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filteredUsers.map((u) => {
              const isCurrentSession = currentRole === u.role;

              return (
                <tr key={u.id} className="hover:bg-surface-alt transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="h-9 w-9 object-cover border border-line shrink-0"
                      />
                      <div>
                        <span className="font-bold text-ink block">{u.name}</span>
                        <span className="text-[11px] text-ink-muted">{u.email}</span>
                        <span className="text-[10px] text-ink-faint block">{u.designation}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-ink block">{u.roleLabel}</span>
                    <span className="text-[10px] font-mono text-ink-muted">{u.role}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 bg-surface-alt border border-line">
                      {u.bureau}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-mono font-bold uppercase border transition-colors",
                        u.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                          : "bg-slate-500/10 text-slate-500 border-slate-500/30"
                      )}
                      title="Click to toggle active state"
                    >
                      {u.status}
                    </button>
                  </td>
                  <td className="p-3 font-mono font-bold">
                    {u.activeCases} Matters
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSwitchDemoRole(u.role, u.name)}
                        className={cn(
                          "px-2.5 py-1 text-xs font-bold border transition-colors flex items-center gap-1",
                          isCurrentSession
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-surface-alt hover:bg-surface border-line text-coral"
                        )}
                      >
                        {isCurrentSession ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <span>Switch Session</span>
                            <span>→</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Provision Officer Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in">
          <div className="w-full max-w-md bg-surface border border-line border-t-4 border-t-coral p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-display font-bold text-lg text-ink">
                Provision New Officer Account
              </h3>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="text-ink-faint hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="my-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">Full Officer Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Verma"
                  className="w-full p-2.5 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Official Email *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="r.verma@aicte-india.org"
                  className="w-full p-2.5 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Assigned Demo Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
                >
                  <option value="BUREAU_OFFICER">Bureau Dealing Officer</option>
                  <option value="COORDINATOR">Case Coordinator</option>
                  <option value="AUDITOR">Read-only Auditor</option>
                  <option value="AICTE_ADMIN">AICTE Administrator</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Operational Bureau</label>
                <select
                  value={newBureau}
                  onChange={(e) => setNewBureau(e.target.value)}
                  className="w-full p-2.5 bg-surface-alt border border-line text-ink focus:border-coral outline-none"
                >
                  <option value="PGRC">Public Grievance Redressal Cell (PGRC)</option>
                  <option value="RB">Regulation Bureau (RB)</option>
                  <option value="ACA">Academic Bureau (ACA)</option>
                  <option value="APP">Approval Bureau (APP)</option>
                  <option value="RO">Regional Office (RO)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-3 py-1.5 border border-line hover:bg-surface-alt font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-coral text-white font-bold hover:bg-coral-hover"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
