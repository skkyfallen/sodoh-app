begin;

-- These tables exist in production but are not used by application code.
do $$
begin
  if to_regclass('public.server_settings') is not null then
    execute 'alter table public.server_settings enable row level security';
    execute 'revoke all on table public.server_settings from public, anon, authenticated';
  end if;

  if to_regclass('public.user_playlists') is not null then
    execute 'alter table public.user_playlists enable row level security';
    execute 'revoke all on table public.user_playlists from public, anon, authenticated';
  end if;
end;
$$;

-- Keep the admin allow-list private even if grants are changed later.
alter table private.admin_users enable row level security;

-- These functions are only invoked by triggers, not directly by API roles.
do $$
begin
  if to_regprocedure('public.set_updated_at()') is not null then
    revoke execute on function public.set_updated_at() from public, anon, authenticated;
  end if;

  if to_regprocedure('public.set_product_requests_updated_at()') is not null then
    revoke execute on function public.set_product_requests_updated_at() from public, anon, authenticated;
  end if;
end;
$$;

-- The app uses getPublicUrl(), so keep this bucket public while restricting writes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  52428800,
  array['image/png', 'image/jpeg', 'image/webp', 'image/*']
)
on conflict (id) do update
set public = true,
    file_size_limit = 52428800,
    allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/*'];

-- Remove legacy policies that let any authenticated user write to the bucket.
-- Permissive policies are OR'd together, so they must be dropped, not just supplemented.
drop policy if exists "Admins upload product images" on storage.objects;
drop policy if exists "Admins update product images" on storage.objects;
drop policy if exists "Admins delete product images" on storage.objects;

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and (select public.is_admin()));

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()))
  with check (bucket_id = 'product-images' and (select public.is_admin()));

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));

commit;
