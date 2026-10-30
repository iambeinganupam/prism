export type UserRole = 
  | "AICTE_ADMIN"
  | "AICTE_OFFICIAL" 
  | "BUREAU_OFFICER" 
  | "COORDINATOR"
  | "AUDITOR"
  | "INSTITUTION" 
  | "PUBLIC";

export type BureauCode = 
  | "PGRC"     // Public Grievance Redressal Cell
  | "RB"       // Regulation Bureau
  | "ACA"      // Academic Bureau
  | "APP"      // Approval Bureau
  | "RO"       // Regional Offices
  | "OTH";     // Others

export type CaseStatus = 
  | "UNDER_PROCESS"
  | "PENDING"
  | "ACTION_INITIATED"
  | "ACTION_REQUIRED"
  | "DISPOSED"
  | "OVERDUE"
  | "ESCALATED"
  | "TRANSFERRED";

export type CaseStage = 
  | "RECEIVED"
  | "SCREENING"
  | "UNDER_PROCESS"
  | "IN_REVIEW"
  | "ACTION_REQUIRED"
  | "RESOLVED"
  | "DISPOSED"
  | "CLOSED";

export type WorkflowStage = 
  | "Received"
  | "Screening"
  | "Under Review"
  | "Action Required"
  | "Resolved"
  | "Closed";

export type PriorityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type EvidenceStatus = "verified" | "partial" | "unverified";

export type ConfidenceTier = "HIGH" | "MEDIUM" | "LOW";

export interface Officer {
  id: string;
  name: string;
  designation: string;
  bureau: BureauCode;
  email: string;
  phone: string;
  activeCases: number;
  disposedThisMonth: number;
  workloadPercentage: number;
  avatar: string;
}

export interface Institution {
  id: string;
  aicteId: string;
  name: string;
  shortName: string;
  address: string;
  city: string;
  state: string;
  region: "Northern" | "Western" | "Southern" | "Eastern" | "North-Western" | "Central" | "South-Western";
  type: "Private" | "Government" | "Government Aided" | "Deemed University";
  establishedYear: number;
  approvalStatus: "Approved" | "Under Scrutiny" | "Show Cause Issued" | "Deficiency Notice";
  intakeCapacity: number;
  activeCourses: number;
  totalCases: number;
  openCases: number;
  hasOverlap: boolean;
  riskScore: number; // 0 - 100
  lastInspectionDate: string;
  contactEmail: string;
  contactPhone: string;
  principalName: string;
}

export interface SimilarityFactorItem {
  score: number; // 0 - 100
  label: string;
  detail: string;
  weight: number; // e.g. 0.25
}

export interface OverlapSimilarityFactors {
  institutionIdMatch: SimilarityFactorItem;
  nameMatch: SimilarityFactorItem;
  locationMatch: SimilarityFactorItem;
  semanticContent: SimilarityFactorItem;
  issueCategory: SimilarityFactorItem;
  timeWindow: SimilarityFactorItem;
}

export interface OverlapSuggestion {
  id: string;
  targetCaseId: string;
  targetCaseTitle?: string;
  targetBureau: BureauCode;
  targetCategory: string;
  targetStatus: CaseStatus;
  targetDateOfReceipt: string;
  confidence: number; // 0 - 100
  confidenceTier: ConfidenceTier;
  similarityFactors: OverlapSimilarityFactors;
  status: "SUGGESTED" | "CONFIRMED" | "REJECTED" | "DEFERRED";
  remarks?: string;
  confirmedBy?: string;
  confirmedAt?: string;
}

export interface CaseDocument {
  id: string;
  caseId: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  category: "Supporting Document" | "Notice" | "Reply" | "Report" | "Affidavit" | "Fee Receipt";
  verified: boolean;
  remarks?: string;
  url?: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  timestamp: string;
  actor: {
    name: string;
    role: string;
    bureau?: BureauCode;
  };
  action: string;
  description: string;
  type: 
    | "STATUS_CHANGE" 
    | "ASSIGNMENT" 
    | "NOTICE_ISSUED" 
    | "TRANSFER" 
    | "CLARIFICATION" 
    | "DOCUMENT_UPLOAD" 
    | "REMARK" 
    | "NEXT_ACTION"
    | "ESCALATION"
    | "STAGE_CHANGE";
  highlighted?: boolean;
  document?: {
    name: string;
    size: string;
    type: string;
  };
  isPending?: boolean;
}

export interface Case {
  id: string; // e.g. PGRC/2025/1023
  institutionId: string;
  institutionName: string;
  aicteId: string;
  bureau: BureauCode;
  bureauName: string;
  category: string;
  subCategory?: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority?: PriorityLevel;
  dateOfReceipt: string;
  dueDate: string;
  daysRemaining: number;
  assignedOfficer: {
    id: string;
    name: string;
    role: string;
    bureau: BureauCode;
    avatar?: string;
    email: string;
  };
  seriousnessScore: number; // 0 - 100
  evidenceVerified: EvidenceStatus;
  aiSummary: string;
  extractedEntities: {
    institutions: string[];
    locations: string[];
    issueKeywords: string[];
    monetaryClaims?: string;
  };
  hasOverlap: boolean;
  linkedCaseIds: string[];
  overlapSuggestions: OverlapSuggestion[];
  currentStage: CaseStage;
  complainantType: "Student" | "Faculty" | "Parent" | "Anonymous" | "Regulatory Authority";
  complainantName?: string;
  complainantContact?: string;
  documents?: CaseDocument[];
  timeline?: TimelineEvent[];
}

export type NotificationType = 
  | "OVERDUE" 
  | "DEADLINE" 
  | "ACTION_REQUIRED" 
  | "STATUS_UPDATED" 
  | "OVERLAP_IDENTIFIED";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  caseId?: string;
  institutionId?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type AlertCategory = 
  | "OVERDUE" 
  | "DEADLINE_APPROACHING" 
  | "UNASSIGNED" 
  | "OVERLAP_PENDING" 
  | "NO_RECENT_ACTIVITY" 
  | "ESCALATION";

export interface SystemAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  caseId?: string;
  institutionId?: string;
  institutionName?: string;
  responsibleOfficer?: string;
  bureau?: BureauCode;
  createdAt: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface DashboardMetrics {
  totalCases: number;      // 1,248
  pendingCases: number;    // 426
  disposedCases: number;   // 672
  overdueCases: number;    // 150
  underReviewCases?: number; // e.g. 180
  potentialOverlapsCount?: number; // e.g. 14
  bureauDistribution: {
    bureau: BureauCode;
    name: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  monthlyTrends: {
    month: string;
    received: number;
    disposed: number;
    pending: number;
  }[];
  workloadByOfficer: {
    officerId: string;
    name: string;
    bureau: BureauCode;
    casesCount: number;
    capacity: number;
  }[];
  upcomingDeadlines: {
    caseId: string;
    institution: string;
    dueDate: string;
    daysLeft: number;
    bureau: BureauCode;
    priority: "CRITICAL" | "HIGH" | "MEDIUM";
  }[];
}

export interface AdminSettings {
  overlapThreshold: number; // 0 - 100, e.g. 75
  slaDaysDefault: number;   // default 30 days
  slaDaysCritical: number;  // 15 days
  autoFlagOverdue: boolean;
  notifyOnOverlap: boolean;
  activeBureaus: BureauCode[];
}
