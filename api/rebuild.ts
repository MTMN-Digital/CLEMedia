import { requireEnv, adminClient, json } from "./_lib/admin.js";

/**
 * Starts a production rebuild after the admin saves page wording or settings,
 * so the prerendered HTML (scripts/prerender.mjs) carries the new text.
 *
 * The deploy hook URL is the only thing a stranger needs to start builds, so
 * it stays in VERCEL_DEPLOY_HOOK here and the caller must be a signed-in
 * admin: the same `admins` row that is_admin() checks in the database.
 */
export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Sign in first" }, 401);

  const sb = adminClient();
  const { data: user } = await sb.auth.getUser(token);
  if (!user.user) return json({ error: "Sign in first" }, 401);
  const { data: admin } = await sb.from("admins").select("user_id").eq("user_id", user.user.id).maybeSingle();
  if (!admin) return json({ error: "Not an admin" }, 403);

  const r = await fetch(requireEnv("VERCEL_DEPLOY_HOOK"), { method: "POST" });
  if (!r.ok) {
    console.error("deploy hook failed", r.status, await r.text());
    return json({ error: "Could not start the rebuild" }, 502);
  }
  return json({ ok: true }, 202);
}
