-- ============================================================
-- TverCV - Simplified PostgreSQL Schema
-- (no AI optimization, no file uploads)
-- Fixed version with ordering, indexes, slug, and constraints
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Auto-update trigger (used by resumes)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

-- ============================================================
-- users
-- ============================================================
CREATE TABLE users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,                          -- nullable for future OAuth
    role VARCHAR(50)
    CHECK (role IN ('user', 'admin'))
    DEFAULT 'user'
    created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- resumes
-- ============================================================
CREATE TABLE resumes (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(255) DEFAULT 'Untitled Resume',
    is_public           BOOLEAN      DEFAULT FALSE,
    public_slug         VARCHAR(100) UNIQUE,     -- for /resume/:slug share links
    template            VARCHAR(100) DEFAULT 'classic',
    accent_color        VARCHAR(20)  DEFAULT '#3B82F6',
    professional_summary TEXT        DEFAULT '',
    created_at          TIMESTAMPTZ  DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  DEFAULT NOW()
);
CREATE INDEX idx_resumes_user_id    ON resumes(user_id);
CREATE INDEX idx_resumes_public_slug ON resumes(public_slug);

CREATE TRIGGER trg_resumes_updated_at
    BEFORE UPDATE ON resumes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- personal_info  (one-to-one with resumes)
-- ============================================================
CREATE TABLE personal_info (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id   UUID         NOT NULL UNIQUE REFERENCES resumes(id) ON DELETE CASCADE,
    full_name   VARCHAR(255),
    profession  VARCHAR(255),
    email       VARCHAR(255),
    phone       VARCHAR(50),
    location    VARCHAR(255),
    linkedin    VARCHAR(255),
    website     VARCHAR(255),
    image_url   TEXT
);

-- ============================================================
-- experience
-- ============================================================
CREATE TABLE experience (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id   UUID        NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    position    INT         NOT NULL DEFAULT 0,  -- drag-and-drop order
    company     VARCHAR(255),
    job_title   VARCHAR(255),
    start_date  VARCHAR(50),
    end_date    VARCHAR(50),
    is_current  BOOLEAN     DEFAULT FALSE,
    description TEXT
);
CREATE INDEX idx_experience_resume ON experience(resume_id);

-- ============================================================
-- education
-- ============================================================
CREATE TABLE education (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id       UUID        NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    position        INT         NOT NULL DEFAULT 0,
    institution     VARCHAR(255),
    degree          VARCHAR(255),
    field           VARCHAR(255),
    graduation_date VARCHAR(50),
    gpa             VARCHAR(20)
);
CREATE INDEX idx_education_resume ON education(resume_id);

-- ============================================================
-- projects
-- ============================================================
CREATE TABLE projects (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id   UUID        NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    position    INT         NOT NULL DEFAULT 0,
    name        VARCHAR(255),
    type        VARCHAR(100),
    description TEXT
);
CREATE INDEX idx_projects_resume ON projects(resume_id);

-- ============================================================
-- skills
-- ============================================================
CREATE TABLE skills (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id   UUID        NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    skill_name  VARCHAR(100),
    proficiency VARCHAR(50) DEFAULT 'intermediate'
);