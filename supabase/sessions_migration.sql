-- ============================================================
-- Visitor Sessions & Cookie Consent Migration
-- Run this in Supabase SQL Editor
-- ============================================================

create table if not exists visitor_sessions (
  id uuid primary key default uuid_generate_v4(),

  -- Fingerprint (canvas + webgl + device composite)
  fingerprint text,

  -- IP & Location (via ipapi.co)
  ip_address text,
  country     text,
  country_code text,
  region      text,
  city        text,
  latitude    numeric(10,6),
  longitude   numeric(10,6),
  isp         text,
  org         text,

  -- Device & Browser
  user_agent      text,
  browser         text,
  browser_version text,
  os              text,
  os_version      text,
  device_type     text check (device_type in ('mobile','tablet','desktop','unknown')),
  screen_resolution text,
  viewport        text,
  color_depth     integer,
  touch_support   boolean,

  -- Browser capabilities
  language             text,
  timezone             text,
  cookies_enabled      boolean,
  do_not_track         boolean,
  hardware_concurrency integer,
  device_memory        numeric,
  connection_type      text,

  -- Session / Traffic source
  referrer      text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_term      text,
  utm_content   text,
  landing_page  text,

  -- Consent (LGPD)
  consent_analytics  boolean default false,
  consent_marketing  boolean default false,
  consent_timestamp  timestamptz,

  created_at timestamptz default now()
);

-- Link leads to sessions
alter table leads
  add column if not exists session_id uuid references visitor_sessions(id) on delete set null;

-- RLS
alter table visitor_sessions enable row level security;

create policy "sessions_public_insert" on visitor_sessions
  for insert with check (true);

create policy "sessions_admin_read" on visitor_sessions
  for select using (auth.role() = 'authenticated');

-- Indexes
create index if not exists idx_sessions_fingerprint on visitor_sessions(fingerprint);
create index if not exists idx_sessions_city        on visitor_sessions(city);
create index if not exists idx_leads_session        on leads(session_id);
