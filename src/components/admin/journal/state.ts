import { formatDateTime, type PostRow } from "@/lib/admin";
import type { PillTone } from "@/components/admin/kit";

/* ============================================================================
   How a post's state is read in the editor.

   THE DATABASE NEVER HOLDS status 'scheduled'. The public policy shows a post
   when its status is 'published' AND its published_at has passed, and nothing
   on this site runs on a timer. So a scheduled piece is stored as 'published'
   with a date still to come, and the database makes it live by itself at that
   moment. A row written as 'scheduled' would never appear; a stray one from
   before this rule reads as a draft here, which is how the site treats it.
   ========================================================================== */

export type PostState = "scheduled" | "published" | "draft";

export function postState(p: Pick<PostRow, "published_at" | "status">, now = Date.now()): PostState {
  if (p.status !== "published") return "draft";
  if (p.published_at && new Date(p.published_at).getTime() > now) return "scheduled";
  return "published";
}

/** "Draft", "Scheduled for 3 Nov 2026, 09:00" or "Published". */
export function stateLabel(p: Pick<PostRow, "published_at" | "status">, now = Date.now()): string {
  const s = postState(p, now);
  if (s === "scheduled") return `Scheduled for ${formatDateTime(p.published_at)}`;
  return s === "published" ? "Published" : "Draft";
}

export const STATE_TONE: Record<PostState, PillTone> = { draft: "off", scheduled: "warn", published: "ok" };
