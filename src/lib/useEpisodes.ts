import { useEffect, useState } from "react";
import { ASSETS, type AssetKey } from "@/lib/brand";
import { type Episode, EPISODES } from "@/lib/episodes";

/* ============================================================================
   The episode list as the public site renders it. Same rule as useTeam: the
   bundled EPISODES render first with no request, and visible rows from the
   `episodes` table (0010) replace them once they arrive. An empty table, a
   failed request or no Supabase keeps the bundled list, so the strip is never
   empty because the database was down.

   A released episode is one with a YouTube link. A row's uploaded thumbnail
   replaces its slate; a row with neither a known slate nor a thumbnail is
   skipped rather than rendered as a placeholder on the home page.
   ========================================================================== */

const COLS = "number,title,thumbnail,thumbnail_alt,asset_key,youtube_url,runtime,synopsis";

interface Row {
  synopsis: string | null;
  title: string;
  thumbnail_alt: string | null;
  thumbnail: string | null;
  youtube_url: string | null;
  asset_key: string | null;
  runtime: string | null;
  number: number;
}

/* Every slate is the same shape, so a new episode borrows the first one's
   frame and shows its own thumbnail inside it. */
const FRAME: AssetKey = "slate.ep1";

function toEpisode(r: Row): Episode | null {
  const known = r.asset_key && r.asset_key in ASSETS ? (r.asset_key as AssetKey) : null;
  if (!known && !r.thumbnail) return null;
  return {
    n: String(r.number).padStart(3, "0"),
    title: r.title,
    asset: known ?? FRAME,
    released: !!r.youtube_url,
    href: r.youtube_url ?? undefined,
    runtime: r.runtime ?? undefined,
    line: r.synopsis ?? undefined,
    photo: r.thumbnail ? { url: r.thumbnail, alt: r.thumbnail_alt || `Episode ${r.number}, ${r.title}` } : null,
  };
}

let cache: Episode[] | null = null;
let inflight: Promise<Episode[]> | null = null;
let generation = 0;

async function load(): Promise<Episode[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  const gen = generation;
  const pending = (inflight = (async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      if (!supabase) return EPISODES;
      const { data, error } = await supabase
        .from("episodes")
        .select(COLS)
        .eq("visible", true)
        .order("sort_order")
        .order("number");
      if (error || !data) return EPISODES;
      const list = (data as Row[]).map(toEpisode).filter((e): e is Episode => e !== null);
      return list.length ? list : EPISODES;
    } catch {
      return EPISODES;
    }
  })());
  const result = await pending;
  if (gen === generation) {
    cache = result;
    inflight = null;
  }
  return result;
}

/** The admin calls this after a save, so "View site" shows the change. */
export function invalidateEpisodes() {
  cache = null;
  inflight = null;
  generation += 1;
}

export function useEpisodes(): Episode[] {
  const [list, setList] = useState<Episode[]>(() => cache ?? EPISODES);
  useEffect(() => {
    let live = true;
    load().then((l) => live && setList(l));
    return () => {
      live = false;
    };
  }, []);
  return list;
}
