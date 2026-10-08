import { useEffect, useState } from "react";
import type { Category, Post } from "@/lib/types";

/* ============================================================================
   The journal's data layer.

   TWO RULES, both taken from src/lib/content.ts, which is the house pattern
   for everything editable on this site.

   1. A page NEVER blocks on the network for its own copy. The four strands
      below ship in the bundle and render with no JavaScript and no Supabase.
      Rows in `categories` replace them once they arrive, matched on slug. So
      the journal index is a complete, honest page before a single request
      finishes, and Conor renaming a strand in the admin panel still lands.

   2. Nothing here invents a post. There are no seeded posts and no seeded
      categories (supabase/migrations/0003_seed.sql says why: the four names
      are unconfirmed, QUESTIONS.md #8). An empty table therefore means an
      empty journal, and the pages say so in words rather than rendering a
      placeholder card that looks like a post.

   WHY THE SUPABASE CLIENT IS IMPORTED DYNAMICALLY. App.tsx lazy-loads the
   admin panel specifically so that "the public site should never have to
   download" supabase-js, and nothing else on the public site imports it. A
   static import here would have put the whole client in the entry chunk for
   every visitor, including people who never open the journal. The dynamic
   import keeps it in its own chunk, fetched only when a journal page mounts.
   ========================================================================== */

export interface Strand {
  slug: string;
  name: string;
  /** What the strand is for. One or two sentences, no promises of frequency. */
  blurb: string;
}

/* Working names, drafted from the company's own themes and listed in
   CONTENT-NEEDED.md as unconfirmed. Renaming one in the admin panel overrides
   the name here; the slug is what the two are matched on, so a renamed strand
   keeps its description until the client writes one. */
export const STRANDS: Strand[] = [
  {
    slug: "research",
    name: "The Research",
    blurb:
      "Early years practice, child development and the thinking behind Watch, Play, Learn. Where the evidence is strong, where it is thin, and what we do about the difference.",
  },
  {
    slug: "process",
    name: "How It's Made",
    blurb:
      "Inside production: writing, animation, sound, and exactly where the tools sit in a process a person is answerable for at every stage.",
  },
  {
    slug: "parents",
    name: "Parents Helping Parents",
    blurb:
      "Practical writing for the people doing the watching alongside. No screen time lectures, no judgement, and nothing we have not tried at home ourselves.",
  },
  {
    slug: "company",
    name: "Building CLÉ",
    blurb:
      "The business of making children's media in Ireland, told as it happens rather than tidied up afterwards.",
  },
];

/** The columns the public site reads, named rather than `*` so a column added
 *  later for the admin panel never silently lands in the browser bundle. */
const POST_COLS =
  "id,title,slug,category_id,excerpt,body,hero_image,hero_alt,status,published_at,author";
const CATEGORY_COLS = "id,name,slug,description,sort_order";

async function client() {
  const { supabase } = await import("@/lib/supabase");
  return supabase;
}

export interface JournalData {
  posts: Post[];
  categories: Category[];
  /**
   * `settled` is false until the posts query has actually answered.
   *
   * Without it an empty `posts` array means two different things, "there is
   * nothing published" and "we have not asked yet, or the ask failed", and the
   * page asserted the first in both cases. A live journal with a slow query
   * told its readers in display type that nothing was published.
   */
  settled: boolean;
}

/**
 * Every published post, newest first, plus the categories they belong to.
 *
 * RLS already restricts `posts` to published rows with a date in the past, so
 * the status filter here is belt and braces rather than the security boundary.
 * A failed request returns nothing and the page keeps its written copy: a CMS
 * being down must never blank a page on this site.
 */
export function useJournal(): JournalData {
  const [data, setData] = useState<JournalData>({ posts: [], categories: [], settled: false });

  useEffect(() => {
    let live = true;
    (async () => {
      const sb = await client();
      /* No Supabase configured is a settled answer: the review build genuinely
         has nothing published, and saying so is true there. */
      if (!sb) return live && setData((d) => ({ ...d, settled: true }));
      const [p, c] = await Promise.all([
        sb
          .from("posts")
          .select(POST_COLS)
          .eq("status", "published")
          .order("published_at", { ascending: false }),
        sb.from("categories").select(CATEGORY_COLS).order("sort_order"),
      ]);
      if (!live) return;
      setData({
        posts: (p.data as Post[] | null) ?? [],
        categories: (c.data as Category[] | null) ?? [],
        /* A query that errored has not settled anything. */
        settled: !p.error,
      });
    })().catch(() => {
      /* Handled by leaving the written copy in place, and by never claiming
         the journal is empty on the strength of a failed request. */
    });
    return () => {
      live = false;
    };
  }, []);

  return data;
}

export interface PostResult {
  /** `loading` only ever renders the page chrome, never a skeleton of a post. */
  state: "loading" | "found" | "missing";
  post: Post | null;
  category: Category | null;
  /** Other published pieces in the same strand, newest first. */
  siblings: Post[];
}

/**
 * One post by slug, with its strand and the rest of that strand.
 *
 * With no Supabase configured the answer is known immediately and there is no
 * loading state at all: the route resolves straight to `missing`, which is
 * what the review build does today.
 */
export function usePost(slug: string | undefined): PostResult {
  const [result, setResult] = useState<PostResult>({
    state: "loading",
    post: null,
    category: null,
    siblings: [],
  });

  useEffect(() => {
    let live = true;
    const miss = () =>
      live && setResult({ state: "missing", post: null, category: null, siblings: [] });

    (async () => {
      if (!slug) return miss();
      const sb = await client();
      if (!sb) return miss();

      const { data } = await sb
        .from("posts")
        .select(POST_COLS)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      const post = (data as Post | null) ?? null;
      if (!live) return;
      if (!post) return miss();

      /* The strand and the rest of it are a second round trip on purpose: the
         article is already renderable without either, so it is shown first and
         the margin fills in. */
      const [c, s] = await Promise.all([
        post.category_id
          ? sb.from("categories").select(CATEGORY_COLS).eq("id", post.category_id).maybeSingle()
          : Promise.resolve({ data: null }),
        post.category_id
          ? sb
              .from("posts")
              .select(POST_COLS)
              .eq("status", "published")
              .eq("category_id", post.category_id)
              .neq("id", post.id)
              .order("published_at", { ascending: false })
              .limit(4)
          : Promise.resolve({ data: null }),
      ]);
      if (!live) return;
      setResult({
        state: "found",
        post,
        category: (c.data as Category | null) ?? null,
        siblings: (s.data as Post[] | null) ?? [],
      });
    })().catch((err) => {
      /* Only a failure BEFORE the article was found can mean "missing". Once
         `setResult({ state: "found" })` has run, a throw from the strand or
         siblings queries must not replace a published article the reader is
         already looking at with a not-found page. The margin simply stays
         empty, which is what those queries are allowed to fail to. */
      if (!live) return;
      console.error("journal post load failed", err);
      setResult((r) => (r.state === "found" ? r : { state: "missing", post: null, category: null, siblings: [] }));
    });

    return () => {
      live = false;
    };
  }, [slug]);

  return result;
}

/* ─── Shaping helpers, shared by the index and the post page ─────────────── */

/** The strands as they should render: the written defaults, with any matching
 *  category row's name and description taking over, then any extra strand the
 *  client has added in the admin panel. */
export function resolveStrands(categories: Category[]): (Strand & { id: string | null })[] {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const written = STRANDS.map((s) => {
    const row = bySlug.get(s.slug);
    return {
      ...s,
      id: row?.id ?? null,
      name: row?.name ?? s.name,
      blurb: row?.description ?? s.blurb,
    };
  });
  const extra = categories
    .filter((c) => !STRANDS.some((s) => s.slug === c.slug))
    .map((c) => ({ slug: c.slug, name: c.name, blurb: c.description ?? "", id: c.id }));
  return [...written, ...extra];
}

/** Irish long form, which is how a date is read aloud here. Returns null for a
 *  post with no date rather than inventing one. */
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" });
}
