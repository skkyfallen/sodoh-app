-- ============================================================
-- Sodoh Nigeria — CMS Database Schema
-- ============================================================
-- Run this file against a blank Supabase project to bootstrap
-- every table, function, trigger, and RLS policy required by
-- the application.
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────
-- 1. SITE CONTENT  (CMS-editable free-form content)
-- ──────────────────────────────────────────────────
-- One row per section per page.  The `content` column
-- stores a JSON blob so the admin dashboard can push
-- structured data (title, subtitle, badge, etc.) while
-- the front-end parses it cheaply.

create table if not exists public.site_content (
  id          uuid primary key default gen_random_uuid(),
  page        text not null,                       -- e.g. 'home', 'products', 'contact'
  section     text not null,                       -- e.g. 'hero', 'announcement', 'cta'
  content     jsonb not null default '{}'::jsonb,   -- structured section data
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null,

  constraint uq_site_content_page_section unique (page, section)
);

comment on table  public.site_content            is 'CMS-managed page sections.';
comment on column public.site_content.content     is 'JSON blob holding all editable fields for the section.';

-- ──────────────────────────────────────────────────
-- 2. PRODUCTS
-- ──────────────────────────────────────────────────

create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  region        text,
  description   text,
  image_url     text,
  image_alt     text,
  icon          text,             -- react-icons name, e.g. 'MdEco'
  display_order int not null default 0,
  is_active     boolean not null default true,
  public_reviewed boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.products is 'Agricultural products shown on the Products page.';

-- ──────────────────────────────────────────────────
-- 3. STATS
-- ──────────────────────────────────────────────────

create table if not exists public.stats (
  id            uuid primary key default gen_random_uuid(),
  value         text not null,        -- e.g. '500+'
  label         text not null,        -- e.g. 'Farms Partnered'
  sub           text,                 -- subtext for the StatsStack
  display_order int not null default 0,
  public_reviewed boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.stats is 'Stat counters shown in heroes and the Stats section.';

-- ──────────────────────────────────────────────────
-- 4. PILLARS  (Quality Guarantee section)
-- ──────────────────────────────────────────────────

create table if not exists public.pillars (
  id            uuid primary key default gen_random_uuid(),
  step          text not null,        -- '01', '02', '03'
  title         text not null,
  tag           text,
  description   text,
  icon          text,                 -- react-icons name
  display_order int not null default 0,
  public_reviewed boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.pillars is 'Quality Guarantee ladder items.';

-- ──────────────────────────────────────────────────
-- 5. FAQ
-- ──────────────────────────────────────────────────

create table if not exists public.faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text not null,
  display_order int not null default 0,
  is_active     boolean not null default true,
  public_reviewed boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.faqs is 'Frequently-asked questions shown on the Contact page.';

-- ──────────────────────────────────────────────────
-- 6. TESTIMONIALS
-- ──────────────────────────────────────────────────

create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  quote         text not null,
  author_name   text not null,
  author_role   text,
  author_image  text,
  is_active     boolean not null default true,
  public_reviewed boolean not null default false,
  display_order int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.testimonials is 'Customer testimonials shown on the homepage.';

-- ──────────────────────────────────────────────────
-- 7. CONTACT SUBMISSIONS
-- ──────────────────────────────────────────────────

create type public.submission_status as enum ('new', 'read', 'archived');

create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  status      submission_status not null default 'new',
  created_at  timestamptz not null default now()
);

comment on table public.contact_submissions is 'Messages submitted through the public contact form.';

-- ──────────────────────────────────────────────────
-- 8. PRODUCT REQUESTS
-- ──────────────────────────────────────────────────

create table if not exists public.product_requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_title text not null,
  quantity_kg numeric(10,2) not null check (quantity_kg > 0),
  name text not null,
  email text not null,
  phone text,
  message text,
  status public.submission_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_product_requests_created_at
  on public.product_requests (created_at desc);
create index if not exists idx_product_requests_status
  on public.product_requests (status);

-- ──────────────────────────────────────────────────
-- 9. AUTOMATIC updated_at TRIGGER
-- ──────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply the trigger to every table that has updated_at
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'site_content', 'products', 'stats', 'pillars', 'faqs', 'testimonials'
  ]) loop
    execute format(
      'create trigger trg_%I_updated_at
         before update on public.%I
         for each row execute function public.set_updated_at();',
      t, t
    );
  end loop;
end;
$$;

create or replace function public.set_product_requests_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists product_requests_set_updated_at on public.product_requests;
create trigger product_requests_set_updated_at
  before update on public.product_requests
  for each row execute function public.set_product_requests_updated_at();

-- ──────────────────────────────────────────────────
-- 10. ROW-LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────────
-- Public reads on content tables.
-- Writes restricted to authenticated users (admins).

create schema if not exists private;
create table if not exists private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
revoke all on schema private from public, anon, authenticated;
revoke all on private.admin_users from public, anon, authenticated;
insert into private.admin_users (user_id)
values ('c1e93976-aba6-4c80-8ab8-52e55e251961')
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from private.admin_users a
      where a.user_id = auth.uid()
    )
$$;
revoke all on function public.is_admin() from public;
revoke execute on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- Enable RLS
alter table public.site_content         enable row level security;
alter table public.products             enable row level security;
alter table public.stats                enable row level security;
alter table public.pillars              enable row level security;
alter table public.faqs                 enable row level security;
alter table public.testimonials         enable row level security;
alter table public.contact_submissions  enable row level security;
alter table public.product_requests     enable row level security;

-- === site_content ===
create policy "Public can read reviewed site_content"
  on public.site_content for select to anon, authenticated
  using ((content->>'public_reviewed') = 'true');
create policy "Admins can read site_content drafts"
  on public.site_content for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert site_content"
  on public.site_content for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update site_content"
  on public.site_content for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete site_content"
  on public.site_content for delete to authenticated
  using ((select public.is_admin()));

-- === products ===
create policy "Public can read reviewed products"
  on public.products for select to anon, authenticated
  using (public_reviewed = true and is_active = true);
create policy "Admins can read products drafts"
  on public.products for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert products"
  on public.products for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update products"
  on public.products for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete products"
  on public.products for delete to authenticated
  using ((select public.is_admin()));

-- === stats ===
create policy "Public can read reviewed stats"
  on public.stats for select to anon, authenticated
  using (public_reviewed = true);
create policy "Admins can read stats drafts"
  on public.stats for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert stats"
  on public.stats for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update stats"
  on public.stats for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete stats"
  on public.stats for delete to authenticated
  using ((select public.is_admin()));

-- === pillars ===
create policy "Public can read reviewed pillars"
  on public.pillars for select to anon, authenticated
  using (public_reviewed = true);
create policy "Admins can read pillars drafts"
  on public.pillars for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert pillars"
  on public.pillars for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update pillars"
  on public.pillars for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete pillars"
  on public.pillars for delete to authenticated
  using ((select public.is_admin()));

-- === faqs ===
create policy "Public can read reviewed faqs"
  on public.faqs for select to anon, authenticated
  using (public_reviewed = true and is_active = true);
create policy "Admins can read faqs drafts"
  on public.faqs for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert faqs"
  on public.faqs for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update faqs"
  on public.faqs for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete faqs"
  on public.faqs for delete to authenticated
  using ((select public.is_admin()));

-- === testimonials ===
create policy "Public can read reviewed testimonials"
  on public.testimonials for select to anon, authenticated
  using (public_reviewed = true and is_active = true);
create policy "Admins can read testimonials drafts"
  on public.testimonials for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert testimonials"
  on public.testimonials for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update testimonials"
  on public.testimonials for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete testimonials"
  on public.testimonials for delete to authenticated
  using ((select public.is_admin()));

-- === contact_submissions ===
create policy "Anyone can submit contact form"
  on public.contact_submissions for insert with check (true);
create policy "Admins can read contact_submissions"
  on public.contact_submissions for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can update contact_submissions"
  on public.contact_submissions for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete contact_submissions"
  on public.contact_submissions for delete to authenticated
  using ((select public.is_admin()));

-- === product_requests ===
create policy "Anyone can submit product requests"
  on public.product_requests for insert to anon, authenticated
  with check (true);
create policy "Authenticated users can read product requests"
  on public.product_requests for select to authenticated
  using ((select public.is_admin()));
create policy "Authenticated users can update product requests"
  on public.product_requests for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Authenticated users can delete product requests"
  on public.product_requests for delete to authenticated
  using ((select public.is_admin()));

-- ──────────────────────────────────────────────────
-- 11. INDEXES
-- ──────────────────────────────────────────────────

create index if not exists idx_site_content_page       on public.site_content (page);
create index if not exists idx_products_display_order  on public.products (display_order);
create index if not exists idx_products_is_active      on public.products (is_active) where is_active;
create index if not exists idx_stats_display_order     on public.stats (display_order);
create index if not exists idx_pillars_display_order   on public.pillars (display_order);
create index if not exists idx_faqs_display_order      on public.faqs (display_order);
create index if not exists idx_faqs_is_active          on public.faqs (is_active) where is_active;
create index if not exists idx_testimonials_order      on public.testimonials (display_order);
create index if not exists idx_contact_status          on public.contact_submissions (status);
create index if not exists idx_contact_created         on public.contact_submissions (created_at desc);
