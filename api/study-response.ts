import { adminClient, json } from "./_lib/admin";

/**
 * Receives one educator questionnaire from the cross-border case study.
 *
 * NOTHING CALLS THIS YET. The form on /case-study is gated by STUDY_OPEN in
 * src/components/casestudy/config.ts, which is false until the participant
 * information and the handling of responses are agreed, and the table this
 * writes to (migration 0007) is not applied until then either. If this route
 * is ever reached before the study opens it fails on the missing table
 * rather than storing anything.
 *
 * Validated server side against the same allowed values as the table's check
 * constraints. Client side checks are a courtesy, not a control, which is
 * also why STUDY_OPEN in the page's config is not the gate that matters: the
 * one that matters is the env var below.
 *
 * Deliberately not stored: IP address, user agent, any child's details.
 */

/* Bump when the approved wording changes, so old rows keep their meaning. */
const QUESTIONNAIRE_VERSION = "draft-1";

const ROUTES = ["ireland", "england"] as const;
const ROLES = ["childminder", "early_years_educator", "teacher", "other"] as const;
const SETTINGS = ["home", "centre", "school", "other"] as const;
const AGES = ["under_3", "3_to_4", "5_to_6", "mixed"] as const;
const SIZES = ["1_to_5", "6_to_12", "13_to_20", "over_20"] as const;
const OFFLINE = ["full", "part", "none"] as const;

/** A site-wide ceiling. There is no email to key a throttle on (it is
 *  optional) and an IP is not on the privacy notice's list, so the limit is
 *  on the table as a whole. A real cohort is far below it. */
const MAX_PER_MINUTE = 30;

function pick<T extends readonly string[]>(list: T, v: unknown): T[number] | null {
  return typeof v === "string" && (list as readonly string[]).includes(v) ? (v as T[number]) : null;
}

function rating(v: unknown): number | null {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

export async function POST(request: Request) {
  /* THE GATE THAT COUNTS. The flag on the page keeps the form shut in a
     browser, which is a courtesy to the reader and nothing more: a POST can
     be sent straight at this route. Until the participant information is
     published and the handling of responses is agreed, this site is not
     allowed to hold one, so refuse here as well. Set STUDY_OPEN=true in the
     Vercel environment on the day the study opens, and not before.

     Missing counts as closed, so a fresh environment is shut by default. */
  if (process.env.STUDY_OPEN !== "true") {
    return json({ error: "The study is not open yet." }, 403);
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  // Honeypot. A real person never fills a field they cannot see.
  if (typeof body.company_website === "string" && body.company_website.trim() !== "") {
    return json({ ok: true });
  }

  const route = pick(ROUTES, body.route);
  const role = pick(ROLES, body.role);
  const setting = pick(SETTINGS, body.setting);
  const age_band = pick(AGES, body.age_band);
  const group_size = pick(SIZES, body.group_size);
  const offline_activity = pick(OFFLINE, body.offline_activity);
  const r_attention = rating(body.r_attention);
  const r_language = rating(body.r_language);
  const r_framework = rating(body.r_framework);
  const r_again = rating(body.r_again);
  /* Only meaningful if the activity was used, so it is null for "none". */
  const r_offline = offline_activity === "none" ? null : rating(body.r_offline);

  if (
    !route || !role || !setting || !age_band || !group_size || !offline_activity ||
    !r_attention || !r_language || !r_framework || !r_again ||
    (offline_activity !== "none" && !r_offline)
  ) {
    return json({ error: "Please answer every required question." }, 400);
  }

  const noticed = String(body.noticed ?? "").trim().slice(0, 2000) || null;
  const change = String(body.change ?? "").trim().slice(0, 2000) || null;

  const contact = String(body.contact_email ?? "").trim().slice(0, 320);
  if (contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    return json({ error: "That email address does not look right." }, 400);
  }

  try {
    const supabase = adminClient();

    const since = new Date(Date.now() - 60_000).toISOString();
    const { count } = await supabase
      .from("study_responses")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since);
    if ((count ?? 0) >= MAX_PER_MINUTE) {
      return json({ error: "Lots of responses are arriving at once. Please try again in a minute." }, 429);
    }

    const { error } = await supabase.from("study_responses").insert({
      questionnaire_version: QUESTIONNAIRE_VERSION,
      route, role, setting, age_band, group_size, offline_activity,
      r_attention, r_language, r_framework, r_offline, r_again,
      noticed, change,
      contact_email: contact || null,
    });
    if (error) throw error;

    return json({ ok: true });
  } catch (err) {
    console.error("study-response failed", err);
    return json({ error: "Could not save your answers. Please try again." }, 500);
  }
}
