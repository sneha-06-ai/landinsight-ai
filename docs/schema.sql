-- PostgreSQL 16+; enable PostGIS and pgvector on the target database first.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE platform_role AS ENUM ('super_admin', 'government_official', 'researcher', 'academic_institution', 'public_user');
CREATE TYPE resource_type AS ENUM ('research_paper', 'government_report', 'policy_document', 'legal_document', 'case_study', 'survey_report', 'dataset');
CREATE TYPE resource_visibility AS ENUM ('public', 'workspace', 'restricted');
CREATE TYPE job_status AS ENUM ('queued', 'running', 'succeeded', 'failed', 'cancelled');

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organization_type text NOT NULL,
  external_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  oidc_subject text NOT NULL UNIQUE,
  email text NOT NULL,
  display_name text NOT NULL,
  role platform_role NOT NULL DEFAULT 'public_user',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  name text NOT NULL,
  description text,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE TABLE workspace_memberships (
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_role text NOT NULL CHECK (member_role IN ('owner', 'editor', 'viewer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  workspace_id uuid REFERENCES workspaces(id),
  resource_type resource_type NOT NULL,
  visibility resource_visibility NOT NULL DEFAULT 'public',
  title text NOT NULL,
  abstract text,
  authors jsonb NOT NULL DEFAULT '[]'::jsonb,
  publisher text,
  publication_date date,
  language_code text NOT NULL DEFAULT 'en',
  source_url text,
  license_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  tags text[] NOT NULL DEFAULT '{}',
  administrative_area_id uuid,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((visibility = 'public' AND workspace_id IS NULL) OR visibility <> 'public')
);

CREATE TABLE resource_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  version_number integer NOT NULL CHECK (version_number > 0),
  object_key text NOT NULL,
  media_type text NOT NULL,
  byte_size bigint NOT NULL CHECK (byte_size >= 0),
  sha256 text NOT NULL,
  extracted_text_key text,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (resource_id, version_number),
  UNIQUE (object_key)
);

CREATE TABLE resource_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_version_id uuid NOT NULL REFERENCES resource_versions(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL CHECK (chunk_index >= 0),
  content text NOT NULL,
  embedding vector(1536),
  token_count integer,
  page_number integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (resource_version_id, chunk_index)
);

CREATE TABLE administrative_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_code text NOT NULL UNIQUE,
  name text NOT NULL,
  level text NOT NULL CHECK (level IN ('country', 'state', 'district', 'subdistrict')),
  parent_id uuid REFERENCES administrative_areas(id),
  boundary geometry(MultiPolygon, 4326),
  properties jsonb NOT NULL DEFAULT '{}'::jsonb,
  valid_from date,
  valid_to date,
  CHECK (valid_to IS NULL OR valid_from IS NULL OR valid_to >= valid_from)
);
ALTER TABLE resources ADD CONSTRAINT resources_area_fk FOREIGN KEY (administrative_area_id) REFERENCES administrative_areas(id);

CREATE TABLE data_layers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_key text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  source_name text NOT NULL,
  source_date date,
  license_id text,
  visibility resource_visibility NOT NULL DEFAULT 'public',
  tile_service_key text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE layer_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id uuid NOT NULL REFERENCES data_layers(id) ON DELETE CASCADE,
  administrative_area_id uuid NOT NULL REFERENCES administrative_areas(id),
  observed_on date NOT NULL,
  metric_key text NOT NULL,
  value double precision NOT NULL,
  unit text,
  confidence double precision CHECK (confidence IS NULL OR confidence BETWEEN 0 AND 1),
  source_version text,
  UNIQUE (layer_id, administrative_area_id, observed_on, metric_key)
);

CREATE TABLE simulation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  workspace_id uuid REFERENCES workspaces(id),
  created_by uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  project_type text NOT NULL,
  administrative_area_id uuid NOT NULL REFERENCES administrative_areas(id),
  inputs jsonb NOT NULL,
  model_name text NOT NULL,
  model_version text NOT NULL,
  data_snapshot jsonb NOT NULL,
  status job_status NOT NULL DEFAULT 'queued',
  outputs jsonb,
  confidence jsonb,
  limitations text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id bigserial PRIMARY KEY,
  actor_id uuid REFERENCES users(id),
  organization_id uuid REFERENCES organizations(id),
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  request_id text,
  ip_hash text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX users_org_role_idx ON users (organization_id, role) WHERE is_active;
CREATE INDEX resources_type_date_idx ON resources (resource_type, publication_date DESC);
CREATE INDEX resources_visibility_org_idx ON resources (visibility, organization_id, workspace_id);
CREATE INDEX resources_tags_idx ON resources USING gin (tags);
CREATE INDEX resources_search_idx ON resources USING gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(abstract, '')));
CREATE INDEX resource_chunks_embedding_idx ON resource_chunks USING hnsw (embedding vector_cosine_ops) WHERE embedding IS NOT NULL;
CREATE INDEX administrative_areas_boundary_idx ON administrative_areas USING gist (boundary);
CREATE INDEX areas_parent_level_idx ON administrative_areas (parent_id, level);
CREATE INDEX observations_area_metric_date_idx ON layer_observations (administrative_area_id, metric_key, observed_on DESC);
CREATE INDEX simulation_runs_org_date_idx ON simulation_runs (organization_id, created_at DESC);
CREATE INDEX audit_events_org_date_idx ON audit_events (organization_id, occurred_at DESC);