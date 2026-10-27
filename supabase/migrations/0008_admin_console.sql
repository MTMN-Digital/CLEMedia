-- What the admin console needs that the schema did not yet hold.
--
-- Nothing here loosens a public policy. Every new policy is admin only, and
-- the one new function checks is_admin() itself before it touches a row.

-- ── products ───────────────────────────────────────────────────────────────
-- Running order on the shelf, alt text for the cover image, and an edit time.
alter table public.products
  add column if not exists sort_order    int not null default 0,
  add column if not exists thumbnail_alt text,
  add column if not exists updated_at    timestamptz not null default now();

-- ── media_items ────────────────────────────────────────────────────────────
-- What kind of appearance a row is, so the index can say "Podcast" rather
-- than leaving the reader to guess from the outlet's name.
alter table public.media_items
  add column if not exists kind          text not null default 'press',
  add column if not exists thumbnail_alt text;

alter table public.media_items drop constraint if exists media_items_kind_check;
alter table public.media_items
  add constraint media_items_kind_check
  check (kind in ('press', 'podcast', 'interview', 'video'));

-- ── people ─────────────────────────────────────────────────────────────────
-- The team page shows which of the five production phases each person is in,
-- and carries alt text for every portrait. `asset_key` lets a row imported
-- from the bundled team keep the bundled portrait until a new one is uploaded.
alter table public.people
  add column if not exists phases    smallint[] not null default '{}',
  add column if not exists photo_alt text,
  add column if not exists asset_key text;

-- The five rows 0003 seeded from the brand kit credits are out of date: the
-- names and roles were corrected on 2026-10-01 and 2026-10-24 and none of them
-- ever had a bio or a photo. Once the site reads `people`, these rows would
-- replace the real team on /team. Only the untouched seed rows go: anything an
-- admin has given a bio or a photo stays.
delete from public.people
where unconfirmed = true
  and bio is null
  and photo is null
  and (name, role) in (
    ('Conor Sexton',    'Founder · Director of Business Strategy'),
    ('Lydia Harding',   'Co-Producer'),
    ('Al Compton',      'Creative Director · Written & Directed By'),
    ('Paula Walshe',    'Educational Content Advisor'),
    ('Kirstie Harding', 'Early Learning Advisor')
  );

-- ── storage: what each bucket will accept ─────────────────────────────────
-- Enforced by Storage itself, so a crafted request cannot put a script or an
-- SVG into the public bucket or a 2GB file into the private one. The admin UI
-- checks the same rules first, for a friendlier message.
update storage.buckets
set file_size_limit    = 10485760, -- 10 MB
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
where id = 'public-media';

update storage.buckets
set file_size_limit    = 52428800, -- 50 MB, the hosted plan's ceiling
    allowed_mime_types = array['application/zip', 'application/pdf']
where id = 'product-files';

-- An admin may see the private files, so the shop panel can replace or remove
-- one. Still no policy at all for anyone else: the bucket stays unreadable to
-- the public and to any signed-in account that is not on the allowlist.
drop policy if exists "admin read products" on storage.objects;
create policy "admin read products" on storage.objects for select
  using (bucket_id = 'product-files' and public.is_admin());

-- ── orders: a fresh download link for a lost order ─────────────────────────
-- `orders` has no update policy for anyone, and should not get one: the
-- amount, the product and the consent time are a record. This function is the
-- one narrow change an admin may make, which is to give a buyer who lost or
-- used up their link another 24 hours and five downloads on the same token.
create or replace function public.admin_reissue_download(p_order uuid)
returns table (
  download_token text,
  expires_at     timestamptz,
  download_count int,
  max_downloads  int
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  return query
  update public.orders o
  set expires_at = now() + interval '24 hours',
      download_count = 0
  where o.id = p_order
  returning o.download_token, o.expires_at, o.download_count, o.max_downloads;
end;
$$;

revoke all on function public.admin_reissue_download(uuid) from public, anon;
grant execute on function public.admin_reissue_download(uuid) to authenticated;

-- ── settings: the keys the console edits ───────────────────────────────────
-- `app` and `links` exist from 0003. Store links and social accounts start
-- empty: an empty value renders nothing on the site.
insert into public.settings (key, value) values
  ('app',   '{"launched": false, "target_window": "Mid-October 2026"}'::jsonb),
  ('links', '{"show_site": "https://www.pawsitivepugs.com", "social": {}}'::jsonb)
on conflict (key) do nothing;

update public.settings
set value = '{"app_store_url": null, "play_store_url": null}'::jsonb || value
where key = 'app';
