-- API keys for the public research API (/api/research, /api/research/[slug],
-- /api/content/schema).
--
-- Only a SHA-256 hash of each token is stored. The plaintext is shown exactly
-- once, at creation, and can never be read back — so a database dump yields no
-- usable credentials. Revoking sets `revoked_at` rather than deleting the row,
-- which keeps an audit trail of which keys existed and when they were killed.
--
-- Run this in the Supabase SQL editor: this project has no migration runner.
-- `npm run cf-typegen` / wrangler are unrelated; the table is created by hand.

create table if not exists public.api_keys (
  id           uuid        primary key default gen_random_uuid(),
  -- Clerk user id of the owner. Keys are always scoped to it.
  user_id      text        not null,
  name         text        not null default 'Default',
  token_hash   text        not null unique,
  -- Non-secret display fragments so the dashboard can identify a key.
  prefix       text        not null,
  last4        text        not null,
  -- Denormalized author identity, captured at creation so publishing does not
  -- need an extra Clerk lookup on every request.
  user_name    text        not null default 'باحث معتمد',
  user_handle  text        not null default '@researcher',
  role         text        not null default 'باحث مستقل مسجل',
  created_at   timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at   timestamptz
);

create index if not exists api_keys_user_id_idx on public.api_keys (user_id);
create index if not exists api_keys_token_hash_idx on public.api_keys (token_hash);

-- Reached only through the service-role key inside server route handlers.
-- RLS with zero policies denies every anon/authenticated client outright.
alter table public.api_keys enable row level security;
