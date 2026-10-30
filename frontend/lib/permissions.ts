import { UserRole } from "@/types";

export interface RolePermissions {
  canCreateComplaint: boolean;
  canEditComplaint: boolean;
  canReassignComplaint: boolean;
  canTransitionWorkflow: boolean;
  canReviewOverlaps: boolean;
  canManageUsers: boolean;
  canModifySettings: boolean;
  canEscalateCase: boolean;
  canResolveCase: boolean;
  canExportData: boolean;
  canAcknowledgeAlerts: boolean;
  canUploadEvidence: boolean;
  viewAllBureaus: boolean;
  roleLabel: string;
  roleDescription: string;
}

export function getPermissions(role: UserRole): RolePermissions {
  switch (role) {
    case "AICTE_ADMIN":
    case "AICTE_OFFICIAL":
      return {
        canCreateComplaint: true,
        canEditComplaint: true,
        canReassignComplaint: true,
        canTransitionWorkflow: true,
        canReviewOverlaps: true,
        canManageUsers: true,
        canModifySettings: true,
        canEscalateCase: true,
        canResolveCase: true,
        canExportData: true,
        canAcknowledgeAlerts: true,
        canUploadEvidence: true,
        viewAllBureaus: true,
        roleLabel: "AICTE Administrator",
        roleDescription: "Full administrative, cross-bureau overview, case escalation & system configuration",
      };

    case "BUREAU_OFFICER":
      return {
        canCreateComplaint: true,
        canEditComplaint: true,
        canReassignComplaint: false,
        canTransitionWorkflow: true,
        canReviewOverlaps: true,
        canManageUsers: false,
        canModifySettings: false,
        canEscalateCase: true,
        canResolveCase: true,
        canExportData: true,
        canAcknowledgeAlerts: true,
        canUploadEvidence: true,
        viewAllBureaus: false,
        roleLabel: "Bureau Dealing Officer",
        roleDescription: "Bureau-focused complaint handling, evidence verification, and stage updates",
      };

    case "COORDINATOR":
      return {
        canCreateComplaint: true,
        canEditComplaint: true,
        canReassignComplaint: true,
        canTransitionWorkflow: true,
        canReviewOverlaps: true,
        canManageUsers: false,
        canModifySettings: false,
        canEscalateCase: true,
        canResolveCase: true,
        canExportData: true,
        canAcknowledgeAlerts: true,
        canUploadEvidence: true,
        viewAllBureaus: true,
        roleLabel: "Case Coordinator",
        roleDescription: "Cross-bureau task assignment, SLA tracking, and multi-agency alignment",
      };

    case "AUDITOR":
      return {
        canCreateComplaint: false,
        canEditComplaint: false,
        canReassignComplaint: false,
        canTransitionWorkflow: false,
        canReviewOverlaps: false,
        canManageUsers: false,
        canModifySettings: false,
        canEscalateCase: false,
        canResolveCase: false,
        canExportData: true,
        canAcknowledgeAlerts: false,
        canUploadEvidence: false,
        viewAllBureaus: true,
        roleLabel: "Read-only Auditor",
        roleDescription: "Read-only inspection of records, audit logs, and compliance analytics",
      };

    case "INSTITUTION":
      return {
        canCreateComplaint: false,
        canEditComplaint: false,
        canReassignComplaint: false,
        canTransitionWorkflow: false,
        canReviewOverlaps: false,
        canManageUsers: false,
        canModifySettings: false,
        canEscalateCase: false,
        canResolveCase: false,
        canExportData: true,
        canAcknowledgeAlerts: false,
        canUploadEvidence: true,
        viewAllBureaus: false,
        roleLabel: "Institution Portal",
        roleDescription: "Compliance responses, show-cause submissions & notice tracking",
      };

    case "PUBLIC":
    default:
      return {
        canCreateComplaint: true,
        canEditComplaint: false,
        canReassignComplaint: false,
        canTransitionWorkflow: false,
        canReviewOverlaps: false,
        canManageUsers: false,
        canModifySettings: false,
        canEscalateCase: false,
        canResolveCase: false,
        canExportData: false,
        canAcknowledgeAlerts: false,
        canUploadEvidence: true,
        viewAllBureaus: false,
        roleLabel: "Citizen / Complainant",
        roleDescription: "Submit grievances and track public status without sensitive internal logs",
      };
  }
}
