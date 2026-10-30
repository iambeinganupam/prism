# PRISM — AI-Powered Integrated Institution Complaint Monitoring & Status Dashboard

> **AICTE (All India Council for Technical Education)**  
> **Autonomous Grievance Co-Reference Platform** | **Independent Personal Platform Launch** | **Architected & Developed Independently**

---

## 1. Project Overview & Philosophy

**PRISM** shifts government complaint handling from isolated tracking to **institution-centric intelligence**. Rather than treating grievances in silos across disparate AICTE bureaus—**PGRC (Public Grievance Redressal Cell)**, **Regulation Bureau (RB)**, **Academic Bureau (ACA)**, **Approval Bureau (APP)**, and **Regional Offices (RO)**—PRISM unifies every case, inquiry, and audit into a single institutional profile.

### Core Capabilities:
- **Unified Institutional Memory:** Aggregates multi-bureau cases under one AICTE Permanent ID (e.g. `1-1234567890` for *ABC Institute of Technology*).
- **AI Overlap Detection Engine:** Uses multi-vector semantic and metadata similarity (AICTE ID, fuzzy name match, location, semantic grievance narrative, issue classification, and temporal windows) to identify cross-bureau conflicts with confidence tiers (High ≥80%, Medium 50–79%, Low <50%).
- **Interactive Relationship Graph:** Dynamic visual network rendering the institution as a central node connected to active cases across bureaus.
- **Human-in-the-Loop Coordination:** Officials confirm or reject AI-flagged overlaps with an immutable audit trail while strictly preserving statutory independence of each bureau.
- **Citizen Transparency Without Exposure:** Mobile-first public tracking (`/track`) showing milestones without exposing sensitive internal officer identities.

---

## 2. Tech Stack

- **Framework:** Next.js (App Router) + React 19 + TypeScript (Strict)
- **Styling:** Vanilla Tailwind CSS with custom government design tokens (AICTE Navy `#1B3A6B`, Saffron `#F28C28`, India Green `#1E8E4E`, Dark Navy-Ink `#0A1020`, Glassmorphism)
- **Charts & Visualizations:** Recharts (responsive donuts, stacked bars, velocity area charts, sparklines)
- **Icons & Motion:** `lucide-react`, CSS keyframe micro-animations
- **State Management:** `zustand` (persisted role switcher across demo personas)
- **Theme:** `next-themes` (Light/Dark mode with tricolour hairline)
- **Typography:** Display serif numerals (`Fraunces`), clean UI typography (`Inter`), monospace IDs (`JetBrains Mono`)
- **API & Mock Layer:** Strongly typed API client stubs (`/lib/api/index.ts`) simulating 300–700ms realistic backend latency.

---

## 3. Application Routes & Screen Map

| Route | Screen Name | Description & Key Components |
|---|---|---|
| `/dashboard` | **Master Dashboard** | 4 Reconciled KPIs (**1,248 Total = 426 Pending + 672 Disposed + 150 Overdue**), Bureau-wise distribution donut, velocity area chart, workload tracking by officer, SLA timeline, urgent case queue. |
| `/overlaps` | **Overlapping Cases (Hero Feature)** | Interactive institutional relationship convergence graph, 88% confidence gauge, 6-factor similarity breakdown, side-by-side comparison drawer with allegation highlighting, human confirmation workflow. |
| `/cases` | **Complaints Directory** | Table & Card Grid toggle, status tabs (All, Pending, Under Process, Disposed, Overdue), bureau & category filters, multi-select bulk link/export. |
| `/cases/[id]` | **Case Details & Dossier** | Stage-based progress stepper, expected disposal countdown ring, AI seriousness meter (0–100), AI executive summary, evidence verification status. |
| `/cases/[id]` (Tab: History) | **Case History & Timeline** | Vertical chronological timeline with actor stamps, lock icon ("Immutable audit trail"), next action pulsing node, PDF export. |
| `/cases/[id]` (Tab: Documents) | **Evidence Management** | Drag-and-drop upload zone, document categorization (Notice, Reply, Affidavit, Fee Receipt), verification tags. |
| `/cases/new` | **New Grievance Intake** | 5-step guided intake with **live AI duplicate check** before submission. |
| `/institutions` | **Institution Registry** | Master searchable directory of all technical institutes with AICTE Permanent IDs, intake capacity, and risk indexes. |
| `/institutions/[id]` | **Institution Profile** | Unified cross-bureau timeline across PGRC, RB, and Academic, mini donut, and linked cases cluster. |
| `/track` | **Public Citizen View** | Clean mobile-first tracking by Case ID or Mobile number without internal sensitive data. |
| `/notifications` | **Notifications Center** | Categorized alerts (Overdue, Deadlines, Bureau Transfers, Overlaps Identified) with deep links. |
| `/reports` | **Analytical Intelligence** | Multi-dimensional query builder, stacked bar charts, top institution risk leaderboard, PDF/Excel/CSV exports. |
| `/users` | **Dealing Desk Management** | Bureau staffing directory, workload capacity meters, and officer invitation modal. |
| `/settings` | **System Preferences** | Security overview (AES-256, Keycloak SSO), notification channels, cryptographic audit ledger. |
| `/login` | **Welcome & Portal Access** | Split hero layout with live mini overlap animation demo and 3 entry cards (Official, Institution, Track). |

---

## 4. Swapping Mock API for a Real FastAPI Backend

The frontend was designed with complete API isolation. All mock data and simulated latencies reside in `lib/mock/data.ts` and `lib/api/index.ts`.

To connect to a live FastAPI service:

1. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   ```

2. Replace the fetch implementation in `lib/api/index.ts`:
   ```typescript
   const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

   export const prismApi = {
     async getCases(params?: CaseFilterParams): Promise<Case[]> {
       const searchParams = new URLSearchParams(params as any);
       const res = await fetch(`${API_BASE}/cases?${searchParams.toString()}`);
       if (!res.ok) throw new Error("Failed to fetch cases");
       return res.json();
     },

     async getCaseById(caseId: string): Promise<Case | null> {
       const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}`);
       if (!res.ok) return null;
       return res.json();
     },

     async checkDuplicateIntake(data: DuplicateCheckPayload) {
       const res = await fetch(`${API_BASE}/ai/check-duplicates`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data),
       });
       return res.json();
     },
     // ...remaining methods map 1-to-1 with REST endpoints
   };
   ```

---

## 5. Getting Started & Running Locally

### Prerequisites
- Node.js 18.x or 20.x+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/prism.git
cd prism

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build Validation
```bash
# Run strict TypeScript check and compile production bundle
npm run build

# Start production server
npm run start
```

---

## 6. Assumptions & Design Notes

1. **AI Match Scoring:** Simulated via a deterministic 6-factor weighting model (`Institution ID: 35%`, `Name Match: 20%`, `Location: 15%`, `Semantic Content: 15%`, `Issue Category: 10%`, `Time Window: 5%`) grounded in realistic case studies from the problem statement.
2. **Role Personas:** The demo role switcher (bottom of sidebar or in `/login`) allows toggling between `AICTE_OFFICIAL`, `BUREAU_OFFICER`, `INSTITUTION`, and `PUBLIC` to inspect role-tailored view permissions.
3. **Data Integrity:** All sample cases (`PGRC/2025/1023`, `RB/2025/4487`, `ACA/2025/7765`) accurately depict the product flow and reference actual clauses from the AICTE Approval Process Handbook (APH Clause 6.4).
