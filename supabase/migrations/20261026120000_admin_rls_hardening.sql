begin;

create schema if not exists private;

create table private.admin_users (
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

-- Product requests are private to admins; public submissions remain enabled.
drop policy if exists "Authenticated users can read product requests" on public.product_requests;
drop policy if exists "Authenticated users can update product requests" on public.product_requests;
drop policy if exists "Authenticated users can delete product requests" on public.product_requests;

create policy "Authenticated users can read product requests"
  on public.product_requests
  for select
  to authenticated
  using ((select public.is_admin()));

create policy "Authenticated users can update product requests"
  on public.product_requests
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Authenticated users can delete product requests"
  on public.product_requests
  for delete
  to authenticated
  using ((select public.is_admin()));

-- Recreate all existing admin CRUD policies with an explicit authenticated role
-- and an admin check for both the old and new row on updates.
drop policy if exists "Admins can insert site_content" on public.site_content;
drop policy if exists "Admins can update site_content" on public.site_content;
drop policy if exists "Admins can delete site_content" on public.site_content;
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;
drop policy if exists "Admins can insert stats" on public.stats;
drop policy if exists "Admins can update stats" on public.stats;
drop policy if exists "Admins can delete stats" on public.stats;
drop policy if exists "Admins can insert pillars" on public.pillars;
drop policy if exists "Admins can update pillars" on public.pillars;
drop policy if exists "Admins can delete pillars" on public.pillars;
drop policy if exists "Admins can insert faqs" on public.faqs;
drop policy if exists "Admins can update faqs" on public.faqs;
drop policy if exists "Admins can delete faqs" on public.faqs;
drop policy if exists "Admins can insert testimonials" on public.testimonials;
drop policy if exists "Admins can update testimonials" on public.testimonials;
drop policy if exists "Admins can delete testimonials" on public.testimonials;
drop policy if exists "Admins can read contact_submissions" on public.contact_submissions;
drop policy if exists "Admins can update contact_submissions" on public.contact_submissions;
drop policy if exists "Admins can delete contact_submissions" on public.contact_submissions;

create policy "Admins can insert site_content"
  on public.site_content for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update site_content"
  on public.site_content for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete site_content"
  on public.site_content for delete to authenticated
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

create policy "Admins can insert stats"
  on public.stats for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update stats"
  on public.stats for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete stats"
  on public.stats for delete to authenticated
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

create policy "Admins can insert faqs"
  on public.faqs for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update faqs"
  on public.faqs for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete faqs"
  on public.faqs for delete to authenticated
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

create policy "Admins can read contact_submissions"
  on public.contact_submissions for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can update contact_submissions"
  on public.contact_submissions for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete contact_submissions"
  on public.contact_submissions for delete to authenticated
  using ((select public.is_admin()));

-- Public content reads are limited to rows that have passed review and are
-- active where the table has an is_active flag. Admin reads remain separate.
drop policy if exists "Anyone can read site_content" on public.site_content;
drop policy if exists "Anyone can read products" on public.products;
drop policy if exists "Anyone can read stats" on public.stats;
drop policy if exists "Anyone can read pillars" on public.pillars;
drop policy if exists "Anyone can read faqs" on public.faqs;
drop policy if exists "Anyone can read testimonials" on public.testimonials;

create policy "Public can read reviewed site_content"
  on public.site_content for select to anon, authenticated
  using ((content->>'public_reviewed') = 'true');
create policy "Admins can read site_content drafts"
  on public.site_content for select to authenticated
  using ((select public.is_admin()));

create policy "Public can read reviewed products"
  on public.products for select to anon, authenticated
  using (public_reviewed = true and is_active = true);
create policy "Admins can read products drafts"
  on public.products for select to authenticated
  using ((select public.is_admin()));

create policy "Public can read reviewed stats"
  on public.stats for select to anon, authenticated
  using (public_reviewed = true);
create policy "Admins can read stats drafts"
  on public.stats for select to authenticated
  using ((select public.is_admin()));

create policy "Public can read reviewed pillars"
  on public.pillars for select to anon, authenticated
  using (public_reviewed = true);
create policy "Admins can read pillars drafts"
  on public.pillars for select to authenticated
  using ((select public.is_admin()));

create policy "Public can read reviewed faqs"
  on public.faqs for select to anon, authenticated
  using (public_reviewed = true and is_active = true);
create policy "Admins can read faqs drafts"
  on public.faqs for select to authenticated
  using ((select public.is_admin()));

create policy "Public can read reviewed testimonials"
  on public.testimonials for select to anon, authenticated
  using (public_reviewed = true and is_active = true);
create policy "Admins can read testimonials drafts"
  on public.testimonials for select to authenticated
  using ((select public.is_admin()));

commit;
