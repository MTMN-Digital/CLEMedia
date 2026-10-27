import { Fragment, type ReactNode, createElement, useEffect, useState } from "react";
import type { BlockValue, SettingsMap } from "@/lib/types";

/**
 * The CMS read layer.
 *
 * Every editable string on the site goes through here. The rule that makes it
 * worth having: a page NEVER blocks on the network for its own copy. The copy
 * written into the page source is the default and ships in the bundle, so the
 * page renders complete with no JavaScript, no Supabase and no request. If a
 * `content_blocks` row exists for that key, it replaces the default once it
 * arrives.
 *
 * That ordering is what lets Conor edit any paragraph without the site
 * depending on the database being up, and it is why there is no loading state
 * and no skeleton anywhere in this file.
 *
 *   const heading = useBlock("home", "hero.title", "Children's media made …");
 *
 * One fetch per page, cached for the session. Not per block: eight blocks on a
 * page must not be eight round trips.
 *
 * WHY THE SUPABASE CLIENT IS IMPORTED DYNAMICALLY. Nothing on the public site
 * imports supabase-js statically (see components/journal/data.ts): the home
 * page is the eager chunk, and a static import here would put the whole client
 * in front of every visitor. The dynamic import keeps it in its own chunk,
 * fetched after the page has already rendered its defaults.
 *
 * PUBLIC PAGES IMPORT FROM HERE, NEVER FROM @/lib/admin. That module imports
 * the client statically and belongs to the admin chunk.
 */

type Blocks = Record<string, BlockValue>;

const cache = new Map<string, Blocks>();
const inflight = new Map<string, Promise<Blocks>>();

async function client() {
  const { supabase } = await import("@/lib/supabase");
  return supabase;
}

function normalise(v: unknown): BlockValue {
  if (typeof v === "string") return { text: v };
  if (v && typeof v === "object") return v as BlockValue;
  return {};
}

async function loadPage(page: string): Promise<Blocks> {
  const hit = cache.get(page);
  if (hit) return hit;

  const running = inflight.get(page);
  if (running) return running;

  const p = (async (): Promise<Blocks> => {
    try {
      const sb = await client();
      if (!sb) return {};
      const { data, error } = await sb
        .from("content_blocks")
        .select("section_key, value")
        .eq("page", page);

      // A CMS failure must never blank the page: the defaults are already
      // rendered, so the correct response to an error is to keep them.
      if (error || !data) return {};

      const out: Blocks = {};
      for (const row of data as { value: unknown; section_key: string }[]) {
        out[row.section_key] = normalise(row.value);
      }
      return out;
    } catch {
      return {};
    }
  })();

  inflight.set(page, p);
  const result = await p;
  cache.set(page, result);
  inflight.delete(page);
  return result;
}

/** Forget cached blocks so the next mount refetches. The admin calls this
 *  after a save, so "View the page" in the same tab shows the new wording. */
export function invalidateBlocks(page?: string) {
  if (page) cache.delete(page);
  else cache.clear();
}

function usePageValues(page: string): Blocks {
  const [blocks, setBlocks] = useState<Blocks>(() => cache.get(page) ?? {});

  useEffect(() => {
    let live = true;
    loadPage(page).then((b) => {
      if (live) setBlocks(b);
    });
    return () => {
      live = false;
    };
  }, [page]);

  return blocks;
}

/** Loads a page's text blocks once. Kept for callers that resolve several keys
 *  with `block()`; new code uses `useBlock`. */
export function usePageBlocks(page: string): Record<string, string> {
  const values = usePageValues(page);
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) if (v.text) out[k] = v.text;
  return out;
}

/**
 * Resolve one block against the loaded set.
 *
 * `fallback` is the real shipping copy, not a placeholder. Anything written
 * here is what an investor reads if the database is empty, which on this build
 * is the normal case.
 */
export function block(blocks: Record<string, string>, key: string, fallback: string): string {
  return blocks[key] ?? fallback;
}

/**
 * One editable string. `fallback` is the page's own source copy, character
 * for character, so an empty `content_blocks` table renders the page exactly
 * as it was written. A row with empty or whitespace-only text is ignored, so
 * a blank save can never blank the site.
 */
export function useBlock(page: string, key: string, fallback: string): string {
  const v = usePageValues(page)[key];
  const text = v?.text;
  return text && text.trim() ? text : fallback;
}

export interface ImageOverride {
  url: string;
  alt: string;
}

/**
 * One editable image slot. Returns null until an admin has uploaded a
 * replacement, and the caller keeps rendering its bundled asset (pass the
 * result to `override` on Figure or PageHero). A row without both a url and
 * alt text is ignored: an image with no alt never reaches the site.
 */
export function useImageBlock(page: string, key: string): ImageOverride | null {
  const v = usePageValues(page)[key];
  if (!v?.url || !v.alt || !v.alt.trim()) return null;
  return { url: v.url, alt: v.alt };
}

/**
 * Renders `*words*` in a block as the accent clause.
 *
 * Headlines on this site set one clause in `<em>` (PageHero) or an Underline
 * (home). The editor writes that clause between single stars, and this turns
 * it back into the same element, so an override keeps the shape of the
 * original. It builds React elements, never HTML, so nothing typed into the
 * admin can inject markup. Unpaired stars print as typed.
 *
 *   emphasis(useBlock("story", "hero.title", "I did not set out to start a *media company.*"))
 *   emphasis(text, (s) => <Underline v={2}>{s}</Underline>)
 */
export function emphasis(text: string, wrap?: (clause: string, i: number) => ReactNode): ReactNode {
  const parts = text.split(/\*([^*]+)\*/g);
  if (parts.length === 1) return text;
  return createElement(
    Fragment,
    null,
    ...parts.map((part, i) =>
      i % 2 === 1
        ? wrap
          ? createElement(Fragment, { key: i }, wrap(part, i))
          : createElement("em", { key: i }, part)
        : part,
    ),
  );
}

/** A multi-paragraph block: paragraphs are separated by a blank line. The
 *  default for such a block is the source paragraphs joined with "\n\n". */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

/* ─── Settings ─────────────────────────────────────────────────────────────
   Same rule as blocks: the bundled default renders first, the `settings` row
   is shallow-merged over it once it arrives, and there is no loading state.
   One request for every key, cached for the session. */

let settingsCache: Record<string, unknown> | null = null;
let settingsInflight: Promise<Record<string, unknown>> | null = null;

async function loadSettings(): Promise<Record<string, unknown>> {
  if (settingsCache) return settingsCache;
  if (settingsInflight) return settingsInflight;
  settingsInflight = (async () => {
    try {
      const sb = await client();
      if (!sb) return {};
      const { data, error } = await sb.from("settings").select("key, value");
      if (error || !data) return {};
      const out: Record<string, unknown> = {};
      for (const row of data as { key: string; value: unknown }[]) out[row.key] = row.value;
      return out;
    } catch {
      return {};
    }
  })();
  const result = await settingsInflight;
  settingsCache = result;
  settingsInflight = null;
  return result;
}

export function invalidateSettings() {
  settingsCache = null;
}

/**
 * A site setting. `fallback` is today's compiled-in value and renders first;
 * the database row's fields override it field by field. A field stored as
 * null in the row does NOT override (so an unset store link stays at the
 * default rather than becoming null where the code expects a string).
 *
 *   const app = useSetting("app", { launched: APP_LAUNCHED });
 */
export function useSetting<K extends keyof SettingsMap>(key: K, fallback: SettingsMap[K]): SettingsMap[K] {
  const [row, setRow] = useState<unknown>(() => settingsCache?.[key]);

  useEffect(() => {
    let live = true;
    loadSettings().then((s) => {
      if (live) setRow(s[key]);
    });
    return () => {
      live = false;
    };
  }, [key]);

  if (!row || typeof row !== "object") return fallback;
  const merged: Record<string, unknown> = { ...fallback };
  for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
    if (v !== null && v !== undefined) merged[k] = v;
  }
  return merged as unknown as SettingsMap[K];
}
