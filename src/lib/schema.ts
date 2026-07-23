/*
  SQL to run once in Supabase SQL Editor:

  create table applications (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    email       text not null,
    section     text not null,
    experience  text not null,
    hours       text not null,
    portfolio   text,
    motivation  text,
    status      text not null default 'pending',  -- pending | accepted | rejected
    contract_id text,
    created_at  timestamptz not null default now()
  );

  -- Allow anonymous inserts (public form), block reads/updates (admin only via service role)
  alter table applications enable row level security;
  create policy "public can insert" on applications for insert with check (true);
  create policy "service role only" on applications for select using (false);
  create policy "service role update" on applications for update using (false);
*/

// This file is documentation only — no runtime code.
export {};
