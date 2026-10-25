-- Keep proof and operational claims out of public pages until a staff member
-- has checked the copy against current, real company evidence.
alter table public.stats
  add column if not exists public_reviewed boolean not null default false;

alter table public.pillars
  add column if not exists public_reviewed boolean not null default false;

alter table public.testimonials
  add column if not exists public_reviewed boolean not null default false;

alter table public.products
  add column if not exists public_reviewed boolean not null default false;

alter table public.faqs
  add column if not exists public_reviewed boolean not null default false;
