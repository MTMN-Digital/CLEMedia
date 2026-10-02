-- =============================================================================
-- DEMO ROWS. NOT A MIGRATION. NEVER RUN THIS AGAINST PRODUCTION.
--
-- It lives in supabase/seed/ rather than supabase/migrations/ precisely so the
-- CLI never applies it on deploy. It exists for one reason: the Journal and
-- Shop pages read from these tables, both are empty, and an empty page cannot
-- be designed or judged. Every row below is INVENTED by MTMN for layout work.
--
-- Three protections, because fake content on this particular site is a real
-- risk. The whole argument of clefamilymedia.com is that this company is
-- honest about what it makes and who checked it.
--   1. Every title, slug and file path is prefixed DEMO so a row cannot be
--      mistaken for client copy in an admin list.
--   2. Products are inserted with active = false, so no demo product can be
--      bought, and no Stripe session can be created from one.
--   3. The teardown at the bottom removes everything this file inserts.
--
-- Apply to a LOCAL or BRANCH database only:
--   psql "$LOCAL_DATABASE_URL" -f supabase/seed/demo.sql
-- Remove again:
--   psql "$LOCAL_DATABASE_URL" -f supabase/seed/demo.sql -v teardown=1
-- =============================================================================

begin;

-- Categories. Named generically on purpose: the real four are unconfirmed
-- (QUESTIONS.md #8) and inventing the client's taxonomy is worse than using
-- obviously placeholder names.
insert into public.categories (name, slug) values
  ('DEMO Behind the episode', 'demo-behind-the-episode'),
  ('DEMO For parents',        'demo-for-parents'),
  ('DEMO Research notes',     'demo-research-notes')
on conflict (slug) do nothing;

insert into public.posts (title, slug, category_id, excerpt, body, status, published_at, author)
select
  v.title, v.slug, c.id, v.excerpt, v.body, 'published', v.published_at, v.author
from (values
  (
    'DEMO How an episode gets its learning goal',
    'demo-how-an-episode-gets-its-learning-goal',
    'demo-behind-the-episode',
    'Placeholder excerpt at roughly the length a real one will run, so the card grid can be judged on something other than a single short line.',
    E'Placeholder body copy for layout only.\n\nThis paragraph exists so the post template can be designed against a realistic block of running text rather than a single sentence. It is deliberately dull, and it says nothing about CLÉ Family Media that anyone should read.\n\nA second paragraph follows, because the spacing between paragraphs is half of what a reading page is.',
    now() - interval '6 days',
    'DEMO author'
  ),
  (
    'DEMO What we mean by low stimulation',
    'demo-what-we-mean-by-low-stimulation',
    'demo-for-parents',
    'A shorter placeholder excerpt, so the grid has two different lengths in it and does not look artificially even.',
    E'Placeholder body copy for layout only.\n\nSecond demo post. Same purpose as the first.',
    now() - interval '13 days',
    'DEMO author'
  ),
  (
    'DEMO Notes from the early years review',
    'demo-notes-from-the-early-years-review',
    'demo-research-notes',
    'A third placeholder excerpt, longer again, to show how the card behaves when the summary runs to three lines instead of two on a desktop width.',
    E'Placeholder body copy for layout only.\n\nThird demo post.',
    now() - interval '27 days',
    'DEMO author'
  )
) as v(title, slug, cat_slug, excerpt, body, published_at, author)
join public.categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

-- Products. active = false on every row: the shop lists active products, and a
-- demo row must never be purchasable. Prices are in integer cents and sit in
-- the EUR 3 to 4 band the brief describes, so the layout sees realistic
-- numbers, but they are not the client's prices.
insert into public.products (title, slug, description, price_cents, currency, file_path, active) values
  ('DEMO Garden activity pack',   'demo-garden-activity-pack',   'Placeholder description for layout only.', 350, 'eur', 'demo/not-a-real-file.pdf', false),
  ('DEMO Feather colouring set',  'demo-feather-colouring-set',  'Placeholder description for layout only.', 300, 'eur', 'demo/not-a-real-file.pdf', false),
  ('DEMO Watch, play, learn card','demo-watch-play-learn-card',  'Placeholder description for layout only.', 400, 'eur', 'demo/not-a-real-file.pdf', false)
on conflict (slug) do nothing;

commit;

-- =============================================================================
-- TEARDOWN. Run the file with -v teardown=1, or paste this block.
--
--   delete from public.products where slug like 'demo-%';
--   delete from public.posts    where slug like 'demo-%';
--   delete from public.categories where slug like 'demo-%';
-- =============================================================================
