# SamadhanSetu — Final Master Implementation Plan (v3)

## System Overview & Primary Objective

Transform the existing React 19 UI (42 views with UX4G Indian government design system) into a **fully functioning, end-to-end Civic Innovation Platform** with a serverless backend, PostgreSQL + pgvector database, **provider-agnostic open-source AI engine**, local embeddings, hybrid similarity clustering, admin validation, and a complete student innovation lifecycle — all operating under a **strict ₹0 budget**.

![Target Architecture Reference](C:/Users/laksh/.gemini/antigravity-cli/brain/91a68e3f-556d-47b7-9937-cba75f73537f/.user_uploaded/uploaded_media_1788354010134.png)

---

## Final Agreed Architectural Blueprint (From Grilling Decisions)

| Component | Final Choice | Rationale / Key Feature |
| :--- | :--- | :--- |
| **Backend Architecture** | **Vercel Serverless Functions** (`api/*`) | Single-repo, 0s cold start, auto-deploys with frontend on Vercel Hobby plan. |
| **Database & Vector Store** | **Supabase Free Tier (PostgreSQL + pgvector)** | 500MB DB, 1GB Storage, 50k MAU Auth, 384-dim cosine vector similarity search. |
| **Primary LLM Engine** | **Groq API (`llama-3.3-70b-versatile`)** | Open-source Meta Llama model, ~200ms latency, 1,000 RPD, native JSON mode. |
| **Fallback LLM Engine** | **Google Gemini 2.0 Flash** | Permanent free tier (1,500 RPD), automatic fallback if Groq quota limits hit. |
| **Local Embedding Engine** | **Transformers.js (`all-MiniLM-L6-v2`)** | 384-dim ONNX model running in-process in Node.js. **Zero external API dependencies**. |
| **Speech-to-Text & Audio** | **Web Speech API + MediaRecorder Audio Blob** | Browser-native live Hindi/English transcription + raw `.webm` audio stored in Supabase. |
| **Photo Evidence** | **Supabase Storage (Visual Evidence Cards)** | Photos uploaded directly to Storage bucket; displayed on Admin cards for human audit. |
| **Location Input** | **Dual GPS + Searchable District Dropdown** | Browser `navigator.geolocation` + curated Jharkhand district selector chips. |
| **Citizen Auth UX** | **OTP-Style UI backed by Supabase Auth** | 2-step identifier/code experience without SMS costs. |
| **Role Management** | **Separate Accounts per Actor (Citizen, Admin, Student)** | Stored in `users.role` table with strict Supabase Row Level Security (RLS). |
| **Clustering Execution** | **Hybrid Instant Embedding + Admin Trigger** | Instant vectorization on submission; "⚡ Run Clustering Engine" button on Admin dashboard. |
| **Student Innovation Scope** | **Complete Multi-Stage Enterprise Loop** | Challenges → Proposals → Rubric Evaluation → Team Formation → Milestones → Impact Showcase. |
| **Frontend State & Data** | **Redux Async Thunks + `src/services/` Layer** | Preserves 100% of existing UX4G UI components, selectors, and styling tokens. |
| **Real-time Sync** | **Supabase Realtime WebSockets** | Live 7-stage status updates on `TrackProblemsView` and instant notification toasts. |
| **Demo & Reset Controls** | **In-App Admin Seeder + CLI `scripts/seed.js`** | 1-click baseline seed (15 signals, 3 clusters, 1 challenge) & instant demo reset. |

---

## 1. TARGET SYSTEM ARCHITECTURE & DATA FLOW

```mermaid
graph TB
    subgraph "Frontend — Vercel SPA (React 19 + UX4G)"
        A[Citizen Voice/Text Submission] --> B[Web Speech API<br/>+ MediaRecorder Audio]
        A --> C[Photo Upload & GPS Selector]
        D[Admin & Mentor Workspaces] --> E[Supabase Realtime WebSockets]
        F[Student Innovation Explorer] --> G[Proposal Submission & Team Builder]
    end

    subgraph "Backend — Vercel Serverless Functions (/api/*)"
        H["/api/submissions (Create & Evidence Upload)"]
        I["/api/ai/understand (Issue Structuring)"]
        J["/api/ai/embed (Transformers.js 384-dim)"]
        K["/api/clusters/run (Similarity & Centroid Grouping)"]
        L["/api/challenges (Validation & Publishing)"]
        M["/api/proposals (Rubric Review & Milestones)"]
    end

    subgraph "AI Provider Abstraction Layer"
        N{{AIProvider Interface}}
        N --> O["GroqProvider (Llama 3.3 70B) [Primary]"]
        N --> P["GeminiProvider (Flash) [Fallback]"]
        N --> Q["OllamaProvider [Local Offline Dev]"]
    end

    subgraph "Local Embedding Runtime"
        R["@huggingface/transformers<br/>all-MiniLM-L6-v2 (384-dim ONNX)<br/>Zero API Calls"]
    end

    subgraph "Supabase Cloud Platform (₹0 Free Tier)"
        S[(PostgreSQL Database<br/>with pgvector extension)]
        T[Supabase Storage<br/>(Evidence Photos & Voice Audio Blobs)]
        U[Supabase Auth<br/>(JWT Sessions & RLS Policies)]
        V[Realtime Broadcast Engine<br/>(Problem Lifecycle WebSockets)]
    end

    B --> H
    C --> H
    H --> S
    H --> T
    H --> I
    I --> N
    H --> J
    J --> R
    R --> S
    D --> K
    K --> S
    D --> L
    L --> S
    G --> M
    M --> S
    S --> V
    V --> E

    style N fill:#FFF3E0,stroke:#E65100
    style O fill:#E3F2FD,stroke:#1565C0
    style R fill:#FCE4EC,stroke:#C2185B
    style S fill:#E8F5E9,stroke:#2E7D32
```

---

## 2. DATABASE SCHEMA (PostgreSQL + pgvector)

```sql
-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. USERS & PROFILES TABLE
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('citizen', 'admin', 'student', 'partner')),
  district TEXT DEFAULT 'Gumla',
  state TEXT DEFAULT 'Jharkhand',
  institution TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLUSTERS (Emerging Problem Clusters)
CREATE TABLE public.clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref_id TEXT UNIQUE NOT NULL, -- e.g. PATTERN-001
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  primary_domain TEXT NOT NULL,
  related_domains TEXT[] DEFAULT '{}',
  locations TEXT[] DEFAULT '{}',
  affected_groups TEXT[] DEFAULT '{}',
  signal_count INT DEFAULT 1,
  avg_similarity FLOAT DEFAULT 1.0,
  emergence_score FLOAT DEFAULT 0.25,
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'similar_detected', 'emerging', 'validated', 'challenge_created')),
  centroid vector(384),
  first_signal_at TIMESTAMPTZ DEFAULT NOW(),
  last_signal_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBMISSIONS (Citizen Civic Signals)
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ref_id TEXT UNIQUE NOT NULL, -- e.g. SS-2026-00401
  method TEXT NOT NULL CHECK (method IN ('voice', 'text', 'photo')),
  raw_text TEXT NOT NULL,
  transcription TEXT,
  voice_audio_url TEXT, -- URL to Supabase Storage .webm audio
  language TEXT DEFAULT 'en',
  ai_summary TEXT,
  primary_domain TEXT NOT NULL,
  related_domains TEXT[] DEFAULT '{}',
  affected_groups TEXT[] DEFAULT '{}',
  possible_impacts TEXT[] DEFAULT '{}',
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  entities JSONB DEFAULT '{}'::jsonb,
  ai_provider TEXT DEFAULT 'groq',
  ai_model TEXT DEFAULT 'llama-3.3-70b-versatile',
  location_label TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT DEFAULT 'Jharkhand',
  latitude FLOAT,
  longitude FLOAT,
  embedding vector(384),
  cluster_id UUID REFERENCES public.clusters(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'understood', 'confirmed', 'clustered', 'challenge_created', 'in_progress', 'resolved')),
  citizen_confirmed BOOLEAN DEFAULT FALSE,
  citizen_corrections JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EVIDENCE ATTACHMENTS
CREATE TABLE public.evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'audio', 'document')),
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INNOVATION CHALLENGES
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref_id TEXT UNIQUE NOT NULL, -- e.g. CH-2026-001
  cluster_id UUID REFERENCES public.clusters(id) ON DELETE SET NULL,
  validated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  who_affected TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  primary_domain TEXT NOT NULL,
  related_domains TEXT[] DEFAULT '{}',
  focus_areas TEXT[] DEFAULT '{}',
  locations TEXT[] DEFAULT '{}',
  signal_count INT DEFAULT 1,
  assigned_institution TEXT DEFAULT 'Ranchi University',
  assigned_mentor_name TEXT,
  assigned_mentor_dept TEXT,
  validator_notes TEXT,
  difficulty TEXT DEFAULT 'Intermediate',
  status TEXT DEFAULT 'Open' CHECK (status IN ('Draft', 'Open', 'Active', 'Under_Review', 'Completed')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDENT PROPOSALS
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref_id TEXT UNIQUE NOT NULL, -- e.g. PROP-2026-012
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  lead_student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  solution_summary TEXT NOT NULL,
  technical_approach TEXT NOT NULL,
  team_members JSONB DEFAULT '[]'::jsonb,
  institution TEXT NOT NULL,
  budget_estimate TEXT,
  timeline_weeks INT DEFAULT 8,
  score_feasibility INT DEFAULT 0,
  score_impact INT DEFAULT 0,
  score_innovation INT DEFAULT 0,
  score_team INT DEFAULT 0,
  total_score INT DEFAULT 0,
  evaluator_feedback TEXT,
  status TEXT DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under_Evaluation', 'Accepted', 'Declined', 'Revisions_Requested')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ACTIVE INNOVATION PROJECTS & MILESTONES
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref_id TEXT UNIQUE NOT NULL, -- e.g. PRJ-2026-004
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  assigned_mentor_id UUID REFERENCES public.users(id),
  stage TEXT DEFAULT 'Phase 1: Research & Prototyping' CHECK (stage IN ('Phase 1: Research & Prototyping', 'Phase 2: Hardware/App Build', 'Phase 3: Field Testing', 'Phase 4: Community Deployment', 'Completed')),
  milestones JSONB DEFAULT '[
    {"id": 1, "title": "Field Needs Verification", "status": "Completed", "due_date": "Week 2"},
    {"id": 2, "title": "MVP Prototype Assembly", "status": "In_Progress", "due_date": "Week 4"},
    {"id": 3, "title": "Pilot Testing in Gumla", "status": "Pending", "due_date": "Week 6"},
    {"id": 4, "title": "Authority Handover & Final Demo", "status": "Pending", "due_date": "Week 8"}
  ]'::jsonb,
  progress_percent INT DEFAULT 25,
  impact_summary TEXT,
  certificate_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cosine Distance Vector Search Function
CREATE OR REPLACE FUNCTION match_submissions(
  query_embedding vector(384),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  ref_id TEXT,
  raw_text TEXT,
  ai_summary TEXT,
  primary_domain TEXT,
  district TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.ref_id,
    s.raw_text,
    s.ai_summary,
    s.primary_domain,
    s.district,
    1 - (s.embedding <=> query_embedding) AS similarity
  FROM public.submissions s
  WHERE s.embedding IS NOT NULL
    AND 1 - (s.embedding <=> query_embedding) > match_threshold
  ORDER BY s.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 3. PROVIDER-AGNOSTIC AI LAYER SPECIFICATION

### Provider Abstraction Class Hierarchy (`api/lib/ai/`)

```
api/lib/ai/
├── provider.js          # Base Abstract Class AIProvider
├── groq-provider.js     # Primary: Groq LPU (Llama 3.3 70B & 3.1 8B)
├── gemini-provider.js   # Fallback: Google GenAI (Gemini 2.0 Flash)
├── ollama-provider.js   # Local Offline: Ollama (localhost:11434)
├── embedder.js          # Local ONNX Pipeline: @huggingface/transformers
├── prompts.js           # Standardized Civic Domain Extraction Prompts
└── index.js             # Factory getAIProvider() with dynamic failover
```

### Factory & Failover Implementation (`api/lib/ai/index.js`)

```javascript
import { GroqProvider } from './groq-provider.js';
import { GeminiProvider } from './gemini-provider.js';
import { OllamaProvider } from './ollama-provider.js';

export function getAIProvider() {
  const providerKey = (process.env.AI_LLM_PROVIDER || 'groq').toLowerCase();
  
  if (providerKey === 'groq' && process.env.GROQ_API_KEY) {
    return new GroqProvider();
  }
  if (providerKey === 'gemini' && process.env.GEMINI_API_KEY) {
    return new GeminiProvider();
  }
  if (providerKey === 'ollama') {
    return new OllamaProvider();
  }
  
  // Intelligent Fallback
  if (process.env.GROQ_API_KEY) return new GroqProvider();
  if (process.env.GEMINI_API_KEY) return new GeminiProvider();
  return new OllamaProvider();
}

/**
 * Resilient Issue Understanding with Instant Fallback
 */
export async function understandCivicIssue(text, location) {
  const primary = getAIProvider();
  try {
    const result = await primary.understand(text, location);
    return { ...result, provider: primary.name, model: primary.model };
  } catch (err) {
    console.warn(`[AI Warning] ${primary.name} failed (${err.message}). Switching to fallback provider.`);
    const fallback = primary.name === 'groq' ? new GeminiProvider() : new GroqProvider();
    const result = await fallback.understand(text, location);
    return { ...result, provider: fallback.name, model: fallback.model };
  }
}
```

---

## 4. HYBRID CLUSTERING & EMERGENCE ALGORITHM

### Emergence Scoring Formula (Section 8)

```javascript
export function calculateEmergenceScore(cluster) {
  // 1. Volume Factor (max out at 8 signals)
  const reportFactor = Math.min(cluster.signalCount / 8, 1.0);

  // 2. Semantic Cohesion (average cosine similarity between signals)
  const similarityFactor = cluster.avgSimilarity || 0.85;

  // 3. Geographic Concentration (High concentration in few districts = high urgency)
  const uniqueDistricts = new Set(cluster.locations || []).size;
  const geoConcentrationFactor = 1 - (uniqueDistricts / Math.max(cluster.signalCount, 1)) * 0.5;

  // 4. Trend Velocity (signals received within the last 7 days)
  const recentSignals = cluster.signalsLast7Days || cluster.signalCount;
  const trendFactor = Math.min(recentSignals / 5, 1.0);

  // 5. Severity Weighting
  const severityMap = { critical: 1.0, high: 0.8, medium: 0.5, low: 0.2 };
  const severityFactor = severityMap[cluster.dominantSeverity] || 0.6;

  // Weighted Combined Emergence Score
  const score = (
    0.25 * reportFactor +
    0.20 * similarityFactor +
    0.15 * geoConcentrationFactor +
    0.20 * trendFactor +
    0.20 * severityFactor
  );

  return parseFloat(score.toFixed(2));
}
```

---

## 5. COMPLETE 11-PHASE IMPLEMENTATION PLAN

### Phase 0: Foundations, DB Schema & Serverless API Setup
- **Objective:** Provision Supabase database with pgvector, configure serverless API routing, set up `.env.local` and base API clients.
- **Tasks:**
  - Create Supabase schema with tables (`users`, `submissions`, `evidence`, `clusters`, `challenges`, `proposals`, `projects`) and vector matching function.
  - Setup `api/health.js` serverless endpoint to verify Vercel execution.
  - Create `src/lib/supabase.js` and `src/lib/api.js` client wrappers.
  - Install dependencies: `@supabase/supabase-js`, `groq-sdk`, `@google/genai`, `@huggingface/transformers`.
- **Verification:** `curl http://localhost:5173/api/health` returns `200 OK`; Supabase dashboard shows 7 tables with RLS active.

---

### Phase 1: Authentication & Role-Based Gateways
- **Objective:** Replace client-side mock auth with Supabase Auth, OTP-skinned citizen login, and role-based route guards.
- **Tasks:**
  - Build `src/lib/auth.jsx` with `AuthProvider` context and `ProtectedRoute`.
  - Wire `CitizenSignInView.jsx` to 2-step OTP-style sign-in.
  - Wire `AuthView.jsx` for email/password signup and login.
  - Wire `Header.jsx` to display real authenticated user session, notifications, and sign-out.
- **Verification:** Create `citizen@demo.com`, `admin@demo.com`, and `student@demo.com`. Login/logout seamlessly; routes protect unauthorized personas.

---

### Phase 2: Citizen Submission & Evidence Pipeline (Text + Photo + GPS)
- **Objective:** Save real citizen complaints with photos and coordinates to Supabase.
- **Tasks:**
  - Build `api/submissions/index.js` (POST create submission, GET citizen submissions).
  - Build `api/submissions/evidence.js` (multipart upload to Supabase Storage bucket `evidence-media`).
  - Wire `TextReportView.jsx`, `CitizenEvidenceView.jsx`, `CitizenLocationView.jsx`, `CitizenFinalReviewView.jsx`.
  - Display dynamic `SS-2026-XXXXX` Reference ID on `CitizenSubmittedView.jsx`.
- **Verification:** Submit a text report with an uploaded photo and GPS location; verify row in `submissions` and file in Supabase Storage.

---

### Phase 3: Browser Voice STT & Audio Blob Capture
- **Objective:** Integrate browser Web Speech API for Hindi/English speech-to-text and record raw voice `.webm` files.
- **Tasks:**
  - Wire `VoiceReportView.jsx` with `webkitSpeechRecognition` (supporting `hi-IN`, `en-IN`, `te-IN`).
  - Add `MediaRecorder` stream recording to produce audio Blobs.
  - Upload audio file to Supabase Storage and link in `submissions.voice_audio_url`.
- **Verification:** Tap mic, speak Hindi in Chrome/Edge, see live transcript, submit, and verify audio file is playable from Supabase Storage.

---

### Phase 4: Provider-Agnostic AI Pipeline & Local Embeddings
- **Objective:** Extract structured civic issues using Groq (Llama 3.3) / Gemini, and generate 384-dim embeddings locally via Transformers.js.
- **Tasks:**
  - Build `api/lib/ai/` provider abstraction (`groq-provider.js`, `gemini-provider.js`, `embedder.js`).
  - Build `api/ai/understand.js` and `api/ai/embed.js`.
  - Automatically chain: Citizen Submission → Issue Structuring → Embedding Vector → Database Update.
  - Wire `CitizenAIUnderstandingView.jsx` to show structured domain, affected groups, severity, and impacts.
- **Verification:** Submit "Hand pump water is yellow and children are ill" → verify domain="Water Quality & Sanitation", severity="high", embedding column filled with 384 numbers, `ai_provider` = "groq".

---

### Phase 5: Citizen AI Confirmation, Tracking & Realtime Updates
- **Objective:** Citizen confirms AI interpretation, views personal history, and receives live status updates.
- **Tasks:**
  - Build `api/submissions/confirm.js` (PATCH to save citizen corrections).
  - Connect `CitizenAIConfirmationView.jsx`, `CitizenWelcomeView.jsx`, `MyProblemsView.jsx`, `MyReportsView.jsx`.
  - Wire `TrackProblemsView.jsx` to Supabase Realtime channels to advance the 7-stage lifecycle bar automatically when status changes.
- **Verification:** Change severity on confirmation screen, confirm, and verify database reflects citizen corrections.

---

### Phase 6: Vector Similarity Engine, Clustering & Emergence Scoring
- **Objective:** Connect submissions with cosine similarity (>0.75), form clusters, calculate emergence scores, and display patterns.
- **Tasks:**
  - Build `api/submissions/similar.js` (calls `match_submissions` SQL function).
  - Build `api/clusters/run.js` (grouping unassigned signals into shared clusters, calculating centroids & emergence scores).
  - Build `api/clusters/index.js` and `api/clusters/[id].js`.
  - Wire `CommunityPatternsView.jsx` and `CommunityPatternDetailView.jsx`.
- **Verification:** Submit 3 water quality signals across Gumla/Latehar; click "Run Pattern Detection" → verify single cluster generated with Emergence Score > 0.5.

---

### Phase 7: Admin Validation Queue & Challenge Formation
- **Objective:** Allow university administrators to review emerging patterns, listen to citizen audio notes, validate issues, and publish challenges.
- **Tasks:**
  - Build `api/clusters/validate.js` (records validation decision and validator notes).
  - Build `api/challenges/index.js` (POST create challenge, GET published challenges).
  - Build `api/admin/dashboard.js` (aggregates pulse metrics).
  - Wire `MentorDashboardView.jsx`, `ValidationQueueView.jsx`, `PatternValidationView.jsx`, `ChallengeFormationView.jsx`, `ChallengePublishedView.jsx`.
  - Embed audio player in `PatternValidationView` to play citizen `.webm` voice notes.
- **Verification:** Log in as admin, inspect cluster, validate it, assign faculty mentor, and publish challenge `CH-2026-001`.

---

### Phase 8: Student Innovation Explorer & Proposal Submission
- **Objective:** Students discover validated civic challenges and submit structured innovation proposals.
- **Tasks:**
  - Build `api/proposals/index.js` (POST proposal, GET student/challenge proposals).
  - Rebuild `StudentExplorerView.jsx` and `PublishedChallengesView.jsx` with real search/domain filtering.
  - Build `StudentProposalFormView.jsx` (form for team members, tech stack, approach, budget).
  - Wire `StudentProposalsView.jsx` to list pending student submissions.
- **Verification:** Log in as student, explore challenges, submit proposal for water purification kit, verify proposal stored in Supabase.

---

### Phase 9: Evaluation Rubric, Team Formation, Milestones & Solutions
- **Objective:** Complete the innovation loop: Admin grades proposals with 50-point rubric, forms teams, tracks project milestones, and displays completed solutions.
- **Tasks:**
  - Build `api/proposals/review.js` (PATCH to evaluate 4 scorecard criteria: Feasibility, Impact, Innovation, Team).
  - Build `api/projects/index.js` and `api/projects/[id].js`.
  - Wire `ProposalDetailView.jsx`, `TeamFormationView.jsx`, `ProjectDetailView.jsx`, `MilestoneDetailView.jsx`, `ProjectsView.jsx`, and `CompletedSolutionView.jsx`.
- **Verification:** Admin approves proposal → project created with 4 milestone stages → complete milestone → view impact showcase.

---

### Phase 10: In-App Demo Controls, Baseline Seed Data & Final Polish
- **Objective:** One-click seeding and reset tools for live hackathon presentation.
- **Tasks:**
  - Build `api/admin/seed.js` and `api/admin/reset.js` endpoints.
  - Build CLI script `scripts/seed.js` for command-line database resets.
  - Add "⚡ Seed Demo Baseline" and "🗑️ Reset Test Data" action buttons to `MentorDashboardView.jsx`.
  - Pre-seed 15 realistic Jharkhand complaints across 3 domains (Water Quality in Gumla, Agriculture in Ranchi, Infrastructure in West Singhbhum).
  - Polish loading spinners, empty states, and toast notifications across all 42 views.
- **Verification:** Execute 1-click reset followed by 1-click seed; confirm entire platform populates with realistic data.

---

## 6. SIH LIVE PRESENTATION DEMO SCRIPT (8-Minute Journey)

1. **Act 1 (0:00 - 2:30) — The Citizen Voice:**
   - Sign in as Ramesh Sharma (Citizen, Gumla).
   - Tap voice record, speak Hindi: *"Hamare gaon ka hand pump ka paani peela ho gaya hai, bachche beemar ho rahe hain."*
   - Show live Hindi speech transcript on screen + snap photo of water sample + auto GPS lock.
   - Submit → Reference ID `SS-2026-00401` created.
2. **Act 2 (2:30 - 4:00) — Open-Source AI Structuring & Vector Embedding:**
   - AI Understanding screen immediately reveals: Domain: **Water Quality & Sanitation**, Severity: **High**, Impact: **Public Health**.
   - Show live provider provenance: *"Processed via Meta Llama 3.3 70B on Groq + 384-dim local sentence-transformer"*.
   - Citizen confirms → Signal registered.
3. **Act 3 (4:00 - 6:00) — Cluster Emergence & Authority Validation:**
   - Switch to Admin account (Ranchi University).
   - Click "⚡ Run Clustering Engine" → Watch 5 similar water reports cluster together into **PATTERN-001** (Emergence Score: **0.78 - Critical**).
   - Admin plays the citizen's actual voice recording, reviews photo evidence, and validates the problem cluster.
   - Formulate and publish Innovation Challenge: **"CH-2026-001: Low-Cost Rural Fluoride & Water Testing Nodes"**.
4. **Act 4 (6:00 - 8:00) — Student Innovation & Community Impact:**
   - Switch to Student account. Browse Student Explorer → Open challenge.
   - Submit proposal: *"IoT Solar-Powered Water Turbidity & Contamination Sensor"*.
   - Switch back to University Mentor → Evaluate proposal with 50-point rubric → Accept → Launch Project Workspace with 4 milestone roadmaps.
   - Conclude: *"From one villager's voice note to an active university engineering project — in real time, with ₹0 cloud spend."*

---

## 7. EXECUTION READINESS CHECKLIST

Before beginning Phase 0 implementation, confirm you have access to:
- [ ] Free **Supabase** account ([supabase.com](https://supabase.com)) — project URL & anon key.
- [ ] Free **Groq** API Key ([console.groq.com](https://console.groq.com)).
- [ ] Free **Google AI Studio** Gemini API Key ([aistudio.google.com](https://aistudio.google.com)) for fallback.
- [ ] Free **Vercel** account for one-click deployment.

All architecture decisions are locked and verified. We are ready to proceed with Phase 0 whenever you are ready!
