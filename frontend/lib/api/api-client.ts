/**
 * PRISM AICTE Platform — FastAPI Integration Client
 * 
 * This module defines the proposed typed integration contracts and fetch wrapper
 * for connecting to a live Python FastAPI backend.
 * 
 * To switch the application from the in-memory mock service layer to live FastAPI:
 * 1. Set NEXT_PUBLIC_API_BASE_URL in .env.local (e.g. http://localhost:8000/api/v1)
 * 2. Set NEXT_PUBLIC_USE_MOCK_API=false in .env.local
 */

import { Case, Institution, DashboardMetrics, OverlapSuggestion, SystemAlert, Officer } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("prism_auth_token") : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: any = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    throw new ApiError(
      errorData?.detail || `API request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json() as Promise<T>;
}

export const fastApiClient = {
  // 1. Dashboard
  getDashboardSummary: () => request<DashboardMetrics>("/dashboard/summary"),
  getDashboardTrends: () => request<{ month: string; received: number; disposed: number; pending: number }[]>("/dashboard/trends"),

  // 2. Institutions
  getInstitutions: (params?: { query?: string; type?: string; state?: string }) => {
    const qs = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
    return request<Institution[]>(`/institutions${qs}`);
  },
  getInstitutionById: (id: string) => request<Institution>(`/institutions/${encodeURIComponent(id)}`),

  // 3. Complaints
  getComplaints: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<Case[]>(`/complaints${qs}`);
  },
  createComplaint: (data: Partial<Case>) => 
    request<Case>("/complaints", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getComplaintById: (id: string) => 
    request<Case>(`/complaints/${encodeURIComponent(id)}`),
  updateComplaint: (id: string, data: Partial<Case>) => 
    request<Case>(`/complaints/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  assignComplaint: (id: string, officerId: string, reason: string) => 
    request<Case>(`/complaints/${encodeURIComponent(id)}/assign`, {
      method: "POST",
      body: JSON.stringify({ officerId, reason }),
    }),
  transitionWorkflowStage: (id: string, stage: string, note: string) => 
    request<Case>(`/complaints/${encodeURIComponent(id)}/transitions`, {
      method: "POST",
      body: JSON.stringify({ stage, note }),
    }),
  getComplaintHistory: (id: string) => 
    request<any[]>(`/complaints/${encodeURIComponent(id)}/history`),

  // 4. AI Overlaps
  getOverlaps: () => request<any[]>("/overlaps"),
  reviewOverlap: (id: string, decision: "CONFIRMED" | "REJECTED" | "DEFERRED", remarks?: string) => 
    request<{ success: boolean }>(`/overlaps/${encodeURIComponent(id)}/review`, {
      method: "POST",
      body: JSON.stringify({ decision, remarks }),
    }),

  // 5. Alerts & Analytics
  getAlerts: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<SystemAlert[]>(`/alerts${qs}`);
  },
  getAnalyticsSummary: () => request<any>("/analytics/summary"),
  getCurrentUser: () => request<Officer>("/users/me"),
};
