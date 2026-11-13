-- Episodes: the series list on the home page, /app and the PupsPlayer
-- walkthrough, editable from the admin (David, 2026-11-13). Until now it lived
-- in src/lib/episodes.ts, so a new episode meant a code change.
--
-- An episode with a youtube_url is released and links out; without one it
-- shows "Coming soon". The six existing episodes are seeded with their
-- bundled slate (asset_key), so nothing on the site changes when this lands.
-- A thumbnail uploaded in the admin replaces the slate.

create table if not exists public.episodes (
  id            uuid primary key default gen_random_uuid(),
  number        int  not null check (number > 0),
  title         text not null,
  thumbnail     text,
  thumbnail_alt text,
  asset_key     text,
  youtube_url   text constraint episodes_youtube_http check (youtube_url is null or youtube_url ~* '^https?://[^\s/$.?#][^\s]*$'),
  runtime       text,
  synopsis      text,
  visible       boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.episodes enable row level security;

create policy "public read visible" on public.episodes for select using (visible = true);
create policy "admin all" on public.episodes for all using (public.is_admin()) with check (public.is_admin());

insert into public.episodes (number, title, asset_key, youtube_url, runtime, synopsis, sort_order)
select * from (values
  (1, 'The Feather',    'slate.ep1', 'https://www.youtube.com/watch?v=duMH0f12JM0', '9:16',
      'A drifting feather leads Finn and Fia on a garden adventure where slowing down helps them discover the hidden beauty of the tiny world around them.', 1),
  (2, 'The Strawberry', 'slate.ep2', 'https://www.youtube.com/watch?v=ZzhkZJgQEK0', '11:10',
      'After a rainy night in the garden, Finn and Fia help a tiny field mouse reach a strawberry just out of reach.', 2),
  (3, 'Chicken Vision', 'slate.ep3', 'https://www.youtube.com/watch?v=CpgIzsn500Q', '10:41',
      'Finn and Fia meet a hen who sees the garden differently, and discover the world can look magical in many different ways.', 3),
  (4, 'The Cuckoo',     'slate.ep4', 'https://www.youtube.com/watch?v=yHYYBpMfE6M', '9:58',
      'Finn and Fia go on a new adventure and meet a cuckoo who has travelled a very long way to get back to the garden.', 4),
  (5, 'Colour Quest',   'slate.ep5', null, null, null, 5),
  (6, 'Fluffy Clouds',  'slate.ep6', null, null, null, 6)
) as v(number, title, asset_key, youtube_url, runtime, synopsis, sort_order)
where not exists (select 1 from public.episodes);
