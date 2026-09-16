-- ===================================================
-- SamadhanSetu — Authoritative Supabase Database Schema
-- Architecture: Complete 16-Table Civic & Innovation Pipeline
-- ===================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. GEOGRAPHIC REFERENCE TABLES
CREATE TABLE IF NOT EXISTS public.districts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Jharkhand',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.villages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_id UUID REFERENCES public.blocks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS & PROFILES
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL CHECK (role IN ('CITIZEN', 'ADMIN', 'FACULTY', 'STUDENT', 'OFFICIAL', 'PARTNER', 'UNIVERSITY_RESEARCHER', 'RESEARCHER', 'MENTOR')),
  status TEXT DEFAULT 'ACTIVE',
  preferred_language TEXT DEFAULT 'hi',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

-- 4. CITIZEN PROBLEM SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.problem_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citizen_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  original_text TEXT NOT NULL,
  original_language TEXT DEFAULT 'hi',
  translated_text TEXT,
  audio_url TEXT,
  image_urls TEXT[],
  location_geom GEOMETRY,
  district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
  block_id UUID REFERENCES public.blocks(id) ON DELETE SET NULL,
  submission_channel TEXT DEFAULT 'WEB' CHECK (submission_channel IN ('WEB', 'VOICE', 'WHATSAPP', 'IVR')),
  status TEXT DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'CLUSTERED', 'REJECTED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

-- 5. STRUCTURED AI UNDERSTANDING (1-to-1 with Submissions)
CREATE TABLE IF NOT EXISTS public.problem_ai_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID UNIQUE REFERENCES public.problem_submissions(id) ON DELETE CASCADE,
  detected_language TEXT DEFAULT 'hi',
  transcribed_text TEXT,
  translated_text TEXT,
  domain TEXT NOT NULL,
  subdomain TEXT,
  severity_score FLOAT DEFAULT 5.0,
  severity_explanation TEXT,
  priority_score FLOAT,
  priority_explanation TEXT,
  confidence FLOAT DEFAULT 0.95,
  ai_model_version TEXT NOT NULL,
  processing_time_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DENSE VECTOR EMBEDDINGS (768-dimensional Semantic Vectors)
CREATE TABLE IF NOT EXISTS public.problem_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID UNIQUE REFERENCES public.problem_submissions(id) ON DELETE CASCADE,
  embedding TEXT NOT NULL, -- Serialized JSON array of 768 floats
  model_name TEXT NOT NULL DEFAULT 'gemini-embedding-001',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROBLEM CLUSTERS
CREATE TABLE IF NOT EXISTS public.problem_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  centroid_geom GEOMETRY,
  problem_count INT DEFAULT 1,
  avg_severity FLOAT DEFAULT 5.0,
  primary_domain TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CLUSTER MEMBERSHIP (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.problem_cluster_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cluster_id UUID REFERENCES public.problem_clusters(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.problem_submissions(id) ON DELETE CASCADE,
  similarity_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cluster_id, submission_id)
);

-- 9. PROBLEM SPECIFICATIONS (Table 13)
CREATE TABLE IF NOT EXISTS public.problem_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cluster_id UUID REFERENCES public.problem_clusters(id) ON DELETE CASCADE,
  title TEXT,
  domain TEXT,
  subdomain TEXT,
  location_description TEXT,
  observed_symptoms TEXT,
  root_cause TEXT,
  affected_population_estimate INT,
  measurable_objectives TEXT,
  target_trl INT DEFAULT 3,
  human_verification_status TEXT DEFAULT 'VERIFIED',
  status TEXT DEFAULT 'VERIFIED',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INNOVATION CHALLENGES
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specification_id UUID REFERENCES public.problem_specifications(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('DRAFT', 'OPEN', 'ADOPTED', 'MATCHING', 'COMPLETED', 'CLOSED')),
  adopted_by_org UUID REFERENCES public.users(id) ON DELETE SET NULL,
  adopted_by_faculty UUID REFERENCES public.users(id) ON DELETE SET NULL,
  trl_stage INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TEAMS & PROPOSALS
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  lead_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TEAM MEMBERS (Table 14)
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'MEMBER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 13. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  mentor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED')),
  trl_stage INT DEFAULT 1,
  start_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TRL GATES & RUBRICS (Table 15)
CREATE TABLE IF NOT EXISTS public.trl_gates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  from_stage INT DEFAULT 1,
  to_stage INT DEFAULT 2,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PASSED', 'FAILED')),
  decision TEXT DEFAULT 'APPROVED' CHECK (decision IN ('APPROVED', 'REJECTED', 'REVISION')),
  decision_reason TEXT,
  criteria JSONB DEFAULT '{}'::jsonb,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PROJECT MILESTONES (Table 16)
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'NOT_STARTED', 'IN_PROGRESS', 'UNDER_REVIEW', 'PASSED', 'COMPLETED', 'PROPOSED')),
  due_date TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  evidence_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

