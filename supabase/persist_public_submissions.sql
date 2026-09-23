-- Run this in the Supabase SQL editor: this project has no migration runner.
-- Persists public submissions the API already accepts and emails but never stores.
-- IF NOT EXISTS: safe if tables were created manually.

create extension if not exists citext;

create table if not exists public.newsletter_subscribers (
  id bigserial primary key,
  email citext not null unique,
  format text not null default 'html',
  topics jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id bigserial primary key,
  type text not null check (type in ('support','compute')),
  name text not null,
  email citext not null,
  organization text,
  institution text,
  resource text,
  amount_or_funding text,
  message text not null,
  proposal text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.initiative_interest (
  id bigserial primary key,
  initiative_slug text not null,
  name text not null,
  email citext not null,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists initiative_interest_created_at_idx on public.initiative_interest (created_at desc);
