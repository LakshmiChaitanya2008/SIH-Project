-- ===================================================
-- SamadhanSetu — Authoritative Supabase Database Schema
-- Architecture: Normalized Civic Problem Pipeline (Alembic Baseline)
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
  role TEXT NOT NULL CHECK (role IN ('CITIZEN', 'ADMIN', 'FACULTY', 'STUDENT', 'OFFICIAL', 'PARTNER')),
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
  embedding TEXT NOT NULL, -- Serialized JSON array of 768 floats (or native vector(768))
  model_name TEXT NOT NULL DEFAULT 'gemini-embedding-001',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROBLEM CLUSTERS (Phase 6 Clustering)
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cluster_id, submission_id)
);

-- 9. INNOVATION CHALLENGES (Phase 7 Validation & Publishing)
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specification_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('DRAFT', 'OPEN', 'ADOPTED', 'COMPLETED')),
  adopted_by_org UUID,
  adopted_by_faculty UUID,
  trl_stage INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PROJECTS & TEAMS (Phase 8 Innovation Tracking)
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  lead_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  mentor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETED', 'PAUSED')),
  trl_stage INT DEFAULT 1,
  start_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
