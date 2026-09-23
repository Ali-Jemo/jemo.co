-- Row Level Security hardening for every table the application touches.
--
-- The Next.js server ALWAYS accesses these tables with the service-role key
-- (src/lib/supabase.ts, src/lib/content/server.ts), which bypasses RLS. The
-- browser client (src/lib/supabase-client.ts) only ever calls supabase.auth.*
-- and never queries table data. Therefore a deny-all-by-default policy set
-- costs the application nothing while guaranteeing that even a leaked anon
-- key cannot read applicant PII or tamper with site content through
-- PostgREST.
--
-- `applications` holds names, emails, experience text, portfolio URLs, and
-- contract IDs — full applicant PII. `page_views` and `templates` are
-- server-written operational data. None of them has any legitimate anon or
-- authenticated row-level access, so the correct policy is: RLS enabled, no
-- permissive policies created. (An explicit "deny all" policy is unnecessary:
-- with RLS enabled and zero policies, every anon/authenticated query returns
-- an empty set — the same pattern already used in supabase/api_keys.sql.)
--
-- Run this in the Supabase SQL editor: this project has no migration runner.
-- Statements are idempotent, so re-running is safe.

alter table public.applications enable row level security;
alter table public.page_views     enable row level security;
alter table public.templates      enable row level security;

-- Force RLS even for table owners (defense against accidental owner-role use
-- in app code; service_role intentionally bypasses this via BYPASSRLS).
alter table public.applications force row level security;
alter table public.page_views     force row level security;
alter table public.templates      force row level security;

-- Revoke direct grants from the anon and authenticated roles so the table
-- is not even visible to them through the auto-generated PostgREST schema.
revoke all on public.applications from anon, authenticated;
revoke all on public.page_views     from anon, authenticated;
revoke all on public.templates      from anon, authenticated;

-- Verification query (run manually after applying):
--   select relname, relrowsecurity, relforcerowsecurity
--   from pg_class
--   where relname in ('applications', 'page_views', 'templates', 'api_keys');
-- Expect relrowsecurity = true and relforcerowsecurity = true for all four.
