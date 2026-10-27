import { useEffect, useState } from "react";
import { ASSETS, type AssetKey } from "@/lib/brand";
import { splitParagraphs } from "@/lib/content";
import { ADVISORS, TEAM, type Member } from "./people";

/* ============================================================================
   The team as the public site should render it.

   SAME RULE AS useBlock in src/lib/content.ts. The bundled TEAM and ADVISORS
   render first, with no request and no loading state, so the page is complete
   before supabase-js has even been fetched. Visible rows from `people` replace
   them once they arrive. An empty table, a failed request or no Supabase at
   all keeps the bundled lists, so the site can never show nobody because the
   database was down or had not been filled in yet.

   WHY THE WHOLE LIST IS REPLACED, not merged by name. Once Conor has imported
   the team into the panel the rows are his to edit, hide, reorder and add
   to, and a merge would resurrect anyone he had removed. The import copies
   every bundled person over in one click, so there is no state in which the
   table is half the team.

   The Supabase client is imported dynamically for the reason data.ts in the
   journal gives: a static import here would put it in front of every visitor.
   ========================================================================== */

interface Lists {
  advisors: Member[];
  team: Member[];
}

const BUNDLED: Lists = { team: TEAM, advisors: ADVISORS };

/** Named rather than `*`, so a column added for the admin never lands in the
 *  public bundle by accident. */
const COLS = "name,role,bio,photo,photo_alt,type,sort_order,phases,asset_key";

interface Row {
  sort_order: number;
  name: string;
  role: string;
  asset_key: string | null;
  phases: number[] | null;
  photo: string | null;
  photo_alt: string | null;
  type: "advisor" | "team";
  bio: string | null;
}

function toMember(r: Row): Member {
  /* The bundled portrait is only trusted when it is a key brand.ts knows,
     so a mistyped asset_key can never crash Figure. */
  const asset = r.asset_key && r.asset_key in ASSETS ? (r.asset_key as AssetKey) : undefined;
  return {
    name: r.name,
    role: r.role,
    asset,
    bio: splitParagraphs(r.bio ?? ""),
    phases: (r.phases ?? []).map(Number).filter((n) => n >= 1 && n <= 5),
    photo: r.photo ? { url: r.photo, alt: r.photo_alt ?? "" } : null,
  };
}

let cache: Lists | null = null;
let inflight: Promise<Lists> | null = null;
/* Bumped by invalidateTeam, so a load already under way when a save lands
   cannot write the old lists back into the cache. */
let generation = 0;

async function load(): Promise<Lists> {
  if (cache) return cache;
  if (inflight) return inflight;
  const gen = generation;
  const pending = (inflight = (async (): Promise<Lists> => {
    try {
      const { supabase } = await import("@/lib/supabase");
      if (!supabase) return BUNDLED;
      /* RLS already hides rows with visible = false; the filter here is belt
         and braces, not the boundary. */
      const { data, error } = await supabase
        .from("people")
        .select(COLS)
        .eq("visible", true)
        .order("sort_order")
        .order("name");
      if (error || !data || data.length === 0) return BUNDLED;
      const rows = data as Row[];
      return {
        team: rows.filter((r) => r.type === "team").map(toMember),
        advisors: rows.filter((r) => r.type === "advisor").map(toMember),
      };
    } catch {
      return BUNDLED;
    }
  })());
  const result = await pending;
  if (gen === generation) {
    cache = result;
    inflight = null;
  }
  return result;
}

/** Forget the cached team so the next mount refetches. The admin panel calls
 *  this after every save, so "View site" in the same tab shows the change. */
export function invalidateTeam() {
  cache = null;
  inflight = null;
  generation += 1;
}

/** Every consumer calls `const { team, advisors } = useTeam();` inside its
 *  component. The signature is frozen by the admin contract. */
export function useTeam(): { advisors: Member[]; team: Member[] } {
  const [lists, setLists] = useState<Lists>(() => cache ?? BUNDLED);

  useEffect(() => {
    let live = true;
    load().then((l) => {
      if (live) setLists(l);
    });
    return () => {
      live = false;
    };
  }, []);

  return lists;
}
