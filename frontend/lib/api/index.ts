import { 
  Case, 
  Institution, 
  DashboardMetrics, 
  OverlapSuggestion, 
  AppNotification, 
  CaseStatus, 
  CaseStage,
  CaseDocument,
  Officer,
  SystemAlert,
  AdminSettings,
  PriorityLevel
} from "@/types";
import { 
  getAllMockCases, 
  MOCK_INSTITUTIONS, 
  MOCK_OFFICERS, 
  MOCK_DASHBOARD_METRICS, 
  MOCK_NOTIFICATIONS,
  MOCK_ALERTS,
  MOCK_ADMIN_SETTINGS
} from "@/lib/mock/data";

// Helper for realistic simulated latency
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory working copies for user interactions during demo session
let dynamicCases: Case[] = getAllMockCases();
let dynamicInstitutions: Institution[] = [...MOCK_INSTITUTIONS];
let dynamicNotifications: AppNotification[] = [...MOCK_NOTIFICATIONS];
let dynamicAlerts: SystemAlert[] = [...MOCK_ALERTS];
let dynamicOfficers: Officer[] = [...MOCK_OFFICERS];
let dynamicSettings: AdminSettings = { ...MOCK_ADMIN_SETTINGS };

export const prismApi = {
  // DASHBOARD
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    await delay(250);
    const total = dynamicCases.length;
    const pending = dynamicCases.filter((c) => c.status === "PENDING" || c.status === "UNDER_PROCESS").length;
    const disposed = dynamicCases.filter((c) => c.status === "DISPOSED").length;
    const overdue = dynamicCases.filter((c) => c.status === "OVERDUE").length;
    const underReview = dynamicCases.filter((c) => c.status === "UNDER_PROCESS" || c.currentStage === "IN_REVIEW").length;
    const overlaps = dynamicCases.filter((c) => c.hasOverlap).length;

    return {
      ...MOCK_DASHBOARD_METRICS,
      totalCases: 1248, // keeping reconciled headline metric
      pendingCases: pending > 0 ? pending : MOCK_DASHBOARD_METRICS.pendingCases,
      disposedCases: disposed > 0 ? disposed : MOCK_DASHBOARD_METRICS.disposedCases,
      overdueCases: overdue > 0 ? overdue : MOCK_DASHBOARD_METRICS.overdueCases,
      underReviewCases: underReview,
      potentialOverlapsCount: overlaps,
    };
  },

  // CASES / COMPLAINTS
  async getCases(params?: {
    status?: string;
    bureau?: string;
    category?: string;
    priority?: string;
    query?: string;
    institutionId?: string;
    hasOverlap?: boolean;
    assignedOfficerId?: string;
    minSeriousness?: number;
    stage?: string;
  }): Promise<Case[]> {
    await delay(300);
    let results = [...dynamicCases];

    if (params?.status && params.status !== "ALL") {
      results = results.filter((c) => c.status === params.status);
    }
    if (params?.bureau && params.bureau !== "ALL") {
      results = results.filter((c) => c.bureau === params.bureau);
    }
    if (params?.priority && params.priority !== "ALL") {
      results = results.filter((c) => c.priority === params.priority);
    }
    if (params?.category && params.category !== "ALL") {
      results = results.filter((c) => c.category === params.category);
    }
    if (params?.institutionId) {
      results = results.filter((c) => c.institutionId === params.institutionId);
    }
    if (params?.hasOverlap !== undefined) {
      results = results.filter((c) => c.hasOverlap === params.hasOverlap);
    }
    if (params?.assignedOfficerId) {
      results = results.filter((c) => c.assignedOfficer.id === params.assignedOfficerId);
    }
    if (params?.stage && params.stage !== "ALL") {
      results = results.filter((c) => c.currentStage === params.stage);
    }
    if (params?.minSeriousness) {
      results = results.filter((c) => c.seriousnessScore >= params.minSeriousness!);
    }
    if (params?.query) {
      const q = params.query.toLowerCase().trim();
      results = results.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.institutionName.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.aicteId.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    return results;
  },

  async getCaseById(caseId: string): Promise<Case | null> {
    await delay(200);
    const decodedId = decodeURIComponent(caseId);
    const found = dynamicCases.find(
      (c) => c.id.toLowerCase() === decodedId.toLowerCase() || c.id === caseId
    );
    return found ? { ...found } : null;
  },

  async updateCaseStatus(caseId: string, status: CaseStatus, remark?: string, actorName = "Dealing Officer"): Promise<Case> {
    await delay(350);
    const decodedId = decodeURIComponent(caseId);
    const idx = dynamicCases.findIndex((c) => c.id === decodedId || c.id === caseId);
    if (idx === -1) throw new Error("Case not found");

    const updatedCase = { ...dynamicCases[idx], status };
    if (remark) {
      const newEvent = {
        id: `tl-${Date.now()}`,
        caseId: updatedCase.id,
        timestamp: new Date().toISOString(),
        actor: { name: actorName, role: "Dealing Officer", bureau: updatedCase.bureau },
        action: `Status updated to ${status}`,
        description: remark,
        type: "STATUS_CHANGE" as const,
      };
      updatedCase.timeline = [...(updatedCase.timeline || []), newEvent];
    }
    dynamicCases[idx] = updatedCase;
    return updatedCase;
  },

  async transitionCaseStage(caseId: string, newStage: CaseStage, note: string, actorName = "Dealing Officer"): Promise<Case> {
    await delay(350);
    const decodedId = decodeURIComponent(caseId);
    const idx = dynamicCases.findIndex((c) => c.id === decodedId || c.id === caseId);
    if (idx === -1) throw new Error("Case not found");

    const prevStage = dynamicCases[idx].currentStage;
    let newStatus = dynamicCases[idx].status;

    if (newStage === "RESOLVED" || newStage === "DISPOSED" || newStage === "CLOSED") {
      newStatus = "DISPOSED";
    } else if (newStage === "UNDER_PROCESS" || newStage === "IN_REVIEW") {
      newStatus = "UNDER_PROCESS";
    }

    const updatedCase: Case = {
      ...dynamicCases[idx],
      currentStage: newStage,
      status: newStatus,
      timeline: [
        ...(dynamicCases[idx].timeline || []),
        {
          id: `tl-${Date.now()}`,
          caseId: dynamicCases[idx].id,
          timestamp: new Date().toISOString(),
          actor: { name: actorName, role: "Official", bureau: dynamicCases[idx].bureau },
          action: `Stage transitioned: ${prevStage} → ${newStage}`,
          description: note || `Case progressed along official redressal lifecycle to ${newStage}.`,
          type: "STAGE_CHANGE",
        },
      ],
    };

    dynamicCases[idx] = updatedCase;
    return updatedCase;
  },

  async reassignCase(caseId: string, newOfficerId: string, reason: string, actorName = "Central Administrator"): Promise<Case> {
    await delay(400);
    const decodedId = decodeURIComponent(caseId);
    const idx = dynamicCases.findIndex((c) => c.id === decodedId || c.id === caseId);
    if (idx === -1) throw new Error("Case not found");

    const officer = dynamicOfficers.find((o) => o.id === newOfficerId) || dynamicOfficers[0];
    const prevOfficer = dynamicCases[idx].assignedOfficer.name;

    // Adjust officer workloads
    const oldOfficer = dynamicOfficers.find((o) => o.name === prevOfficer);
    if (oldOfficer && oldOfficer.activeCases > 0) {
      oldOfficer.activeCases -= 1;
    }
    officer.activeCases += 1;

    const updatedCase: Case = {
      ...dynamicCases[idx],
      assignedOfficer: {
        id: officer.id,
        name: officer.name,
        role: officer.designation,
        bureau: officer.bureau,
        avatar: officer.avatar,
        email: officer.email,
      },
      timeline: [
        ...(dynamicCases[idx].timeline || []),
        {
          id: `tl-${Date.now()}`,
          caseId: dynamicCases[idx].id,
          timestamp: new Date().toISOString(),
          actor: { name: actorName, role: "Central Administrator" },
          action: `Reassigned from ${prevOfficer} to ${officer.name}`,
          description: reason || "Workload rebalancing and specialized domain reassignment.",
          type: "ASSIGNMENT",
        },
      ],
    };

    dynamicCases[idx] = updatedCase;
    return updatedCase;
  },

  async escalateCase(caseId: string, reason: string, actorName = "Dealing Officer"): Promise<Case> {
    await delay(400);
    const decodedId = decodeURIComponent(caseId);
    const idx = dynamicCases.findIndex((c) => c.id === decodedId || c.id === caseId);
    if (idx === -1) throw new Error("Case not found");

    const updatedCase: Case = {
      ...dynamicCases[idx],
      status: "ESCALATED",
      priority: "CRITICAL",
      timeline: [
        ...(dynamicCases[idx].timeline || []),
        {
          id: `tl-${Date.now()}`,
          caseId: dynamicCases[idx].id,
          timestamp: new Date().toISOString(),
          actor: { name: actorName, role: "Dealing Officer", bureau: dynamicCases[idx].bureau },
          action: "Case escalated to Member Secretary / Appellate Authority",
          description: reason || "Escalated due to repeated institutional non-compliance and urgency.",
          type: "ESCALATION",
          highlighted: true,
        },
      ],
    };

    dynamicCases[idx] = updatedCase;

    // Create an alert for this escalation
    dynamicAlerts.unshift({
      id: `alert-${Date.now()}`,
      severity: "CRITICAL",
      category: "ESCALATION",
      title: `Case ${updatedCase.id} Escalated`,
      description: `Case escalated by ${actorName}: ${reason}`,
      caseId: updatedCase.id,
      institutionId: updatedCase.institutionId,
      institutionName: updatedCase.institutionName,
      bureau: updatedCase.bureau,
      responsibleOfficer: updatedCase.assignedOfficer.name,
      createdAt: new Date().toISOString(),
      status: "ACTIVE",
    });

    return updatedCase;
  },

  async addCaseRemark(caseId: string, remarkText: string, actorName = "Shri R. Kumar"): Promise<Case> {
    await delay(250);
    const decodedId = decodeURIComponent(caseId);
    const idx = dynamicCases.findIndex((c) => c.id === decodedId || c.id === caseId);
    if (idx === -1) throw new Error("Case not found");

    const newEvent = {
      id: `tl-${Date.now()}`,
      caseId: dynamicCases[idx].id,
      timestamp: new Date().toISOString(),
      actor: { name: actorName, role: "Official", bureau: dynamicCases[idx].bureau },
      action: "Internal Case Remark",
      description: remarkText,
      type: "REMARK" as const,
    };

    dynamicCases[idx] = {
      ...dynamicCases[idx],
      timeline: [...(dynamicCases[idx].timeline || []), newEvent],
    };
    return dynamicCases[idx];
  },

  async uploadEvidence(
    caseId: string,
    fileData: { name: string; size: string; category: any; remarks?: string }
  ): Promise<CaseDocument> {
    await delay(450);
    const decodedId = decodeURIComponent(caseId);
    const newDoc: CaseDocument = {
      id: `doc-${Date.now()}`,
      caseId: decodedId,
      name: fileData.name,
      size: fileData.size,
      type: "application/pdf",
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Dealing Officer",
      category: fileData.category,
      verified: true,
      remarks: fileData.remarks,
    };

    const idx = dynamicCases.findIndex((c) => c.id === decodedId || c.id === caseId);
    if (idx !== -1) {
      dynamicCases[idx].documents = [...(dynamicCases[idx].documents || []), newDoc];
      dynamicCases[idx].timeline = [
        ...(dynamicCases[idx].timeline || []),
        {
          id: `tl-${Date.now()}`,
          caseId: decodedId,
          timestamp: new Date().toISOString(),
          actor: { name: "Dealing Officer", role: "Verification Cell" },
          action: "Document catalogued (Simulated)",
          description: `Uploaded ${fileData.name} (${fileData.category})`,
          type: "DOCUMENT_UPLOAD" as const,
          document: { name: fileData.name, size: fileData.size, type: "PDF" },
        },
      ];
    }

    return newDoc;
  },

  // INSTITUTIONS
  async getInstitutions(query?: string, filters?: { type?: string; state?: string; hasComplaints?: boolean }): Promise<Institution[]> {
    await delay(250);
    let list = [...dynamicInstitutions];
    if (filters?.type && filters.type !== "ALL") {
      list = list.filter((i) => i.type === filters.type);
    }
    if (filters?.state && filters.state !== "ALL") {
      list = list.filter((i) => i.state === filters.state);
    }
    if (filters?.hasComplaints) {
      list = list.filter((i) => i.totalCases > 0);
    }
    if (!query) return list;
    const q = query.toLowerCase().trim();
    return list.filter(
      (inst) =>
        inst.name.toLowerCase().includes(q) ||
        inst.aicteId.toLowerCase().includes(q) ||
        inst.city.toLowerCase().includes(q) ||
        inst.state.toLowerCase().includes(q)
    );
  },

  async getInstitutionById(id: string): Promise<Institution | null> {
    await delay(200);
    const found = dynamicInstitutions.find((i) => i.id === id || i.aicteId === id);
    return found ? { ...found } : null;
  },

  async getInstitutionCases(institutionId: string): Promise<Case[]> {
    await delay(250);
    return dynamicCases.filter(
      (c) => c.institutionId === institutionId || c.aicteId === institutionId
    );
  },

  // OVERLAPS
  async getAllOverlapPairs(): Promise<{
    institution: Institution;
    suggestions: {
      sourceCase: Case;
      suggestion: OverlapSuggestion;
    }[];
  }[]> {
    await delay(300);
    const map = new Map<string, {
      institution: Institution;
      suggestions: { sourceCase: Case; suggestion: OverlapSuggestion }[];
    }>();

    for (const c of dynamicCases) {
      if (c.overlapSuggestions && c.overlapSuggestions.length > 0) {
        const inst = dynamicInstitutions.find((i) => i.id === c.institutionId);
        if (inst) {
          if (!map.has(inst.id)) {
            map.set(inst.id, { institution: inst, suggestions: [] });
          }
          for (const s of c.overlapSuggestions) {
            map.get(inst.id)!.suggestions.push({
              sourceCase: c,
              suggestion: s,
            });
          }
        }
      }
    }

    return Array.from(map.values());
  },

  async confirmOverlap(suggestionId: string, remarks?: string, reviewerName = "Shri R. Kumar"): Promise<boolean> {
    await delay(350);
    for (const c of dynamicCases) {
      const match = c.overlapSuggestions?.find((s) => s.id === suggestionId);
      if (match) {
        match.status = "CONFIRMED";
        match.remarks = remarks || "Confirmed by AICTE official - Cross-bureau coordination linked";
        match.confirmedAt = new Date().toISOString();
        match.confirmedBy = reviewerName;

        // Mutual link creation (NEVER merges records)
        if (!c.linkedCaseIds.includes(match.targetCaseId)) {
          c.linkedCaseIds.push(match.targetCaseId);
        }
        const target = dynamicCases.find((t) => t.id === match.targetCaseId);
        if (target && !target.linkedCaseIds.includes(c.id)) {
          target.linkedCaseIds.push(c.id);
        }

        // Add audit timeline event
        c.timeline = [
          ...(c.timeline || []),
          {
            id: `tl-${Date.now()}`,
            caseId: c.id,
            timestamp: new Date().toISOString(),
            actor: { name: reviewerName, role: "Central Official" },
            action: `Overlap confirmed with ${match.targetCaseId}`,
            description: `AI overlap suggestion confirmed. Cross-referenced with independent case file ${match.targetCaseId}. Records remain separate.`,
            type: "STATUS_CHANGE",
          },
        ];

        return true;
      }
    }
    return false;
  },

  async rejectOverlap(suggestionId: string, remarks?: string, reviewerName = "Shri R. Kumar"): Promise<boolean> {
    await delay(300);
    for (const c of dynamicCases) {
      const match = c.overlapSuggestions?.find((s) => s.id === suggestionId);
      if (match) {
        match.status = "REJECTED";
        match.remarks = remarks || "Rejected by reviewer - independent distinct grievance";

        c.timeline = [
          ...(c.timeline || []),
          {
            id: `tl-${Date.now()}`,
            caseId: c.id,
            timestamp: new Date().toISOString(),
            actor: { name: reviewerName, role: "Central Official" },
            action: `Overlap dismissed with ${match.targetCaseId}`,
            description: `Reviewer confirmed grievances are distinct and unrelated.`,
            type: "STATUS_CHANGE",
          },
        ];

        return true;
      }
    }
    return false;
  },

  async deferOverlap(suggestionId: string, remarks?: string): Promise<boolean> {
    await delay(250);
    for (const c of dynamicCases) {
      const match = c.overlapSuggestions?.find((s) => s.id === suggestionId);
      if (match) {
        match.status = "DEFERRED";
        match.remarks = remarks || "Review deferred pending additional institutional evidence";
        return true;
      }
    }
    return false;
  },

  async linkSelectedCases(caseIds: string[]): Promise<boolean> {
    await delay(350);
    for (const id of caseIds) {
      const c = dynamicCases.find((item) => item.id === id);
      if (c) {
        c.hasOverlap = true;
        for (const otherId of caseIds) {
          if (otherId !== id && !c.linkedCaseIds.includes(otherId)) {
            c.linkedCaseIds.push(otherId);
          }
        }
      }
    }
    return true;
  },

  // NOTIFICATIONS
  async getNotifications(): Promise<AppNotification[]> {
    await delay(150);
    return dynamicNotifications;
  },

  async markNotificationRead(id: string): Promise<void> {
    await delay(100);
    dynamicNotifications = dynamicNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
  },

  async markAllNotificationsRead(): Promise<void> {
    await delay(150);
    dynamicNotifications = dynamicNotifications.map((n) => ({ ...n, read: true }));
  },

  // ALERTS & ESCALATIONS
  async getAlerts(filters?: { severity?: string; category?: string; status?: string; bureau?: string }): Promise<SystemAlert[]> {
    await delay(250);
    let list = [...dynamicAlerts];
    if (filters?.severity && filters.severity !== "ALL") {
      list = list.filter((a) => a.severity === filters.severity);
    }
    if (filters?.category && filters.category !== "ALL") {
      list = list.filter((a) => a.category === filters.category);
    }
    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((a) => a.status === filters.status);
    }
    if (filters?.bureau && filters.bureau !== "ALL") {
      list = list.filter((a) => a.bureau === filters.bureau);
    }
    return list;
  },

  async acknowledgeAlert(alertId: string, actorName = "Dealing Officer"): Promise<boolean> {
    await delay(200);
    const alert = dynamicAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = "ACKNOWLEDGED";
      alert.acknowledgedBy = actorName;
      alert.acknowledgedAt = new Date().toISOString();
      return true;
    }
    return false;
  },

  async resolveAlert(alertId: string): Promise<boolean> {
    await delay(200);
    const alert = dynamicAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = "RESOLVED";
      return true;
    }
    return false;
  },

  // TASKS & WORKLOAD
  async getTasks(filter?: "ASSIGNED_TO_ME" | "UNASSIGNED" | "PENDING" | "OVERDUE" | "DEADLINE_APPROACHING", officerName = "Shri R. Kumar"): Promise<Case[]> {
    await delay(300);
    let list = [...dynamicCases];

    switch (filter) {
      case "ASSIGNED_TO_ME":
        return list.filter((c) => c.assignedOfficer.name.includes(officerName.split(" ")[1] || "Kumar"));
      case "UNASSIGNED":
        return list.filter((c) => !c.assignedOfficer || c.assignedOfficer.name === "Unassigned");
      case "PENDING":
        return list.filter((c) => c.status === "PENDING" || c.status === "UNDER_PROCESS");
      case "OVERDUE":
        return list.filter((c) => c.status === "OVERDUE" || c.daysRemaining < 0);
      case "DEADLINE_APPROACHING":
        return list.filter((c) => c.daysRemaining >= 0 && c.daysRemaining <= 5 && c.status !== "DISPOSED");
      default:
        return list.slice(0, 15);
    }
  },

  async getWorkloadSummary(): Promise<Officer[]> {
    await delay(200);
    return dynamicOfficers;
  },

  // OFFICERS
  async getOfficers(): Promise<Officer[]> {
    await delay(150);
    return dynamicOfficers;
  },

  async createOfficer(officerData: Partial<Officer>): Promise<Officer> {
    await delay(300);
    const newOfficer: Officer = {
      id: `off-${Date.now()}`,
      name: officerData.name || "New Officer",
      designation: officerData.designation || "Assistant Director",
      bureau: officerData.bureau || "PGRC",
      email: officerData.email || "officer@aicte-india.org",
      phone: officerData.phone || "+91 11 2958 0000",
      activeCases: 0,
      disposedThisMonth: 0,
      workloadPercentage: 15,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    };
    dynamicOfficers.push(newOfficer);
    return newOfficer;
  },

  // ADMIN SETTINGS
  async getAdminSettings(): Promise<AdminSettings> {
    await delay(150);
    return { ...dynamicSettings };
  },

  async updateAdminSettings(newSettings: Partial<AdminSettings>): Promise<AdminSettings> {
    await delay(300);
    dynamicSettings = { ...dynamicSettings, ...newSettings };
    return { ...dynamicSettings };
  },

  // RESET DEMO STATE
  async resetDemoData(): Promise<void> {
    await delay(400);
    dynamicCases = getAllMockCases();
    dynamicInstitutions = [...MOCK_INSTITUTIONS];
    dynamicNotifications = [...MOCK_NOTIFICATIONS];
    dynamicAlerts = [...MOCK_ALERTS];
    dynamicOfficers = [...MOCK_OFFICERS];
    dynamicSettings = { ...MOCK_ADMIN_SETTINGS };
  },

  // PUBLIC TRACK
  async trackComplaint(query: string): Promise<Case | null> {
    await delay(400);
    const q = query.trim().toLowerCase();
    const found = dynamicCases.find(
      (c) =>
        c.id.toLowerCase() === q ||
        c.aicteId.toLowerCase() === q ||
        c.complainantContact?.includes(q)
    );
    if (!found) return null;
    return {
      ...found,
      assignedOfficer: {
        id: "hidden",
        name: "Designated Dealing Officer",
        role: "AICTE Dealing Wing",
        bureau: found.bureau,
        email: "grievance@aicte-india.org",
      },
    };
  },

  // AI DUPLICATE CHECK FOR NEW INTAKE
  async checkDuplicateIntake(data: {
    institutionId: string;
    title: string;
    description: string;
  }): Promise<{
    hasOverlap: boolean;
    confidence: number;
    matches: Array<{
      caseId: string;
      title: string;
      bureau: string;
      confidence: number;
      similarityReason: string;
    }>;
  }> {
    await delay(400);
    const instCases = dynamicCases.filter((c) => c.institutionId === data.institutionId);
    if (instCases.length === 0) {
      return { hasOverlap: false, confidence: 15, matches: [] };
    }

    const matches = instCases.map((c) => {
      let score = 55;
      const t = data.title.toLowerCase();
      const ct = c.title.toLowerCase();
      if (t.includes("fee") && ct.includes("fee")) score += 28;
      if (t.includes("faculty") && ct.includes("faculty")) score += 30;
      if (t.includes("intake") || t.includes("approval")) score += 22;
      score = Math.min(score, 94);

      return {
        caseId: c.id,
        title: c.title,
        bureau: c.bureau,
        confidence: score,
        similarityReason: `Same technical institution (${c.institutionName}) with overlapping semantic topics under Bureau ${c.bureau}.`,
      };
    });

    const highest = Math.max(...matches.map((m) => m.confidence), 0);
    return {
      hasOverlap: highest >= (dynamicSettings.overlapThreshold || 75),
      confidence: highest,
      matches: matches.filter((m) => m.confidence >= 50),
    };
  },

  async createComplaint(newCaseData: Partial<Case>): Promise<Case> {
    await delay(500);
    const inst = dynamicInstitutions.find((i) => i.id === newCaseData.institutionId) || dynamicInstitutions[0];
    const generatedNum = Math.floor(1000 + Math.random() * 9000);
    const bureau = newCaseData.bureau || "PGRC";
    const newCaseId = `${bureau}/2025/${generatedNum}`;

    const newCase: Case = {
      id: newCaseId,
      institutionId: inst.id,
      institutionName: inst.name,
      aicteId: inst.aicteId,
      bureau,
      bureauName: 
        bureau === "PGRC" ? "Public Grievance Redressal Cell" :
        bureau === "RB" ? "Regulation Bureau" :
        bureau === "ACA" ? "Academic Bureau" :
        bureau === "APP" ? "Approval Bureau" :
        bureau === "RO" ? "Regional Offices" : "Others Cell",
      category: newCaseData.category || "Student Grievance",
      title: newCaseData.title || "Untitled Grievance",
      description: newCaseData.description || "",
      status: "UNDER_PROCESS",
      priority: (newCaseData.priority || "HIGH") as PriorityLevel,
      dateOfReceipt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      daysRemaining: 15,
      assignedOfficer: {
        id: "off-1",
        name: "Shri R. Kumar",
        role: "Dealing Officer",
        bureau: "PGRC",
        email: "r.kumar@aicte-india.org",
      },
      seriousnessScore: 65,
      evidenceVerified: "unverified",
      aiSummary: "Newly submitted complaint. AI pipeline initiated duplicate check and preliminary entity extraction.",
      extractedEntities: {
        institutions: [inst.name],
        locations: [inst.city],
        issueKeywords: [newCaseData.category || "General"],
      },
      hasOverlap: false,
      linkedCaseIds: [],
      overlapSuggestions: [],
      currentStage: "RECEIVED",
      complainantType: newCaseData.complainantType || "Student",
      timeline: [
        {
          id: `tl-${Date.now()}`,
          caseId: newCaseId,
          timestamp: new Date().toISOString(),
          actor: { name: "Central Intake Portal", role: "Automated Registration" },
          action: "Complaint registered online (Demo Mode)",
          description: "Grievance received and catalogued under AICTE PRISM System.",
          type: "STATUS_CHANGE",
        },
      ],
    };

    dynamicCases.unshift(newCase);
    return newCase;
  },

  // EXPORT CSV
  exportToCsv(data: Record<string, any>[], filename: string) {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h] ?? "";
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
