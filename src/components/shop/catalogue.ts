import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

/* ============================================================================
   The catalogue read layer.

   Two rules, both borrowed from src/lib/content.ts, which is the pattern the
   rest of the site's CMS reads follow.

   1. THE PAGE NEVER BLOCKS ON THIS. The shop and the product page render
      their own copy, their own empty state and their own terms with no
      network at all. A product list is the only thing that arrives late, and
      a failure to fetch leaves the page in its honest empty state rather than
      blanking it.

   2. SUPABASE IS IMPORTED DYNAMICALLY. App.tsx goes out of its way to keep
      the Supabase client out of the public bundle (the admin route is lazy
      for exactly that reason), and a static import here would have undone it
      for every page on the site, because these pages are not lazy. The import
      costs one extra request on two routes and saves it on the other twelve.

   Only `active` products are readable at all: the RLS policy on the table is
   `using (active = true)`, so an unpublished product cannot be fetched from a
   browser even by guessing its slug. Nothing here re-checks that, because a
   client-side check of a server-side rule is theatre.
   ========================================================================== */

/** The columns the public site reads. Matches `Product` in src/lib/types.ts. */
const COLUMNS = "id, title, slug, description, price_cents, currency, thumbnail, file_path, active";

/**
 * `empty` means the shop answered and has nothing. `failed` means it did not
 * answer. Collapsing the two told visitors "Nothing on sale yet" whenever
 * Supabase was slow or down, which is a shop telling its customers it has no
 * stock on the strength of a network error.
 */
type Query<T> =
  | { state: "loading" }
  | { state: "ready"; data: T }
  | { state: "empty" }
  | { state: "failed" };

/** EUR 3.50, in the reader's own locale, from integer cents. Never a float. */
export function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: (currency || "eur").toUpperCase(),
  }).format(cents / 100);
}

/** Paragraphs from a plain-text description. Blank lines separate them. */
export function paragraphs(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function useProducts(): Query<Product[]> {
  const [q, setQ] = useState<Query<Product[]>>({ state: "loading" });

  useEffect(() => {
    let live = true;
    (async () => {
      const { supabase } = await import("@/lib/supabase");
      if (!supabase) {
        if (live) setQ({ state: "empty" });
        return;
      }
      const { data, error } = await supabase
        .from("products")
        .select(COLUMNS)
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (!live) return;
      setQ(
        error ? { state: "failed" } : !data?.length ? { state: "empty" } : { state: "ready", data: data as Product[] },
      );
    })().catch(() => {
      if (live) setQ({ state: "failed" });
    });
    return () => {
      live = false;
    };
  }, []);

  return q;
}

export function useProduct(slug: string | undefined): Query<Product> {
  const [q, setQ] = useState<Query<Product>>({ state: "loading" });

  useEffect(() => {
    if (!slug) {
      setQ({ state: "empty" });
      return;
    }
    let live = true;
    setQ({ state: "loading" });
    (async () => {
      const { supabase } = await import("@/lib/supabase");
      if (!supabase) {
        if (live) setQ({ state: "empty" });
        return;
      }
      // maybeSingle, not single: a slug that matches nothing is a 404 page,
      // not an error to log.
      const { data, error } = await supabase
        .from("products")
        .select(COLUMNS)
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();
      if (!live) return;
      setQ(error ? { state: "failed" } : !data ? { state: "empty" } : { state: "ready", data: data as Product });
    })().catch(() => {
      if (live) setQ({ state: "failed" });
    });
    return () => {
      live = false;
    };
  }, [slug]);

  return q;
}
