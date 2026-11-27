import { adminClient, json } from "./_lib/admin.js";

/**
 * Who can sign in to the admin, managed from the admin itself.
 *
 *   GET                      everyone with access, and whether they have signed in yet
 *   POST   { email }         invite someone new, or send an existing person a fresh link
 *   DELETE ?id=<user id>     remove a person's access and their sign-in
 *
 * Only a signed-in admin (a row in `admins`, the same check as is_admin())
 * may call it. Membership is still granted only with the service role, here,
 * so a stolen browser session cannot add an admin by writing to the table.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function caller(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { error: json({ error: "Sign in first" }, 401) };
  const sb = adminClient();
  const { data: user } = await sb.auth.getUser(token);
  if (!user.user) return { error: json({ error: "Sign in first" }, 401) };
  const { data: admin } = await sb.from("admins").select("user_id").eq("user_id", user.user.id).maybeSingle();
  if (!admin) return { error: json({ error: "Not an admin" }, 403) };
  return { sb, me: user.user.id };
}

// ponytail: one page of 1000 users; this project has a handful.
async function allUsers(sb: ReturnType<typeof adminClient>) {
  const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return data.users;
}

export async function GET(request: Request) {
  const c = await caller(request);
  if (c.error) return c.error;
  const [{ data: rows, error }, users] = await Promise.all([c.sb.from("admins").select("user_id, email, added_at"), allUsers(c.sb)]);
  if (error) return json({ error: error.message }, 500);
  const people = (rows ?? []).map((r) => {
    const u = users.find((x) => x.id === r.user_id);
    return {
      id: r.user_id,
      email: u?.email ?? r.email,
      addedAt: r.added_at,
      lastSignIn: u?.last_sign_in_at ?? null,
      active: Boolean(u?.email_confirmed_at),
      you: r.user_id === c.me,
    };
  });
  return json({ people });
}

export async function POST(request: Request) {
  const c = await caller(request);
  if (c.error) return c.error;
  const body = (await request.json().catch(() => ({}))) as { email?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email)) return json({ error: "Enter a full email address." }, 400);

  const redirectTo = `${new URL(request.url).origin}/admin`;
  const existing = (await allUsers(c.sb)).find((u) => u.email?.toLowerCase() === email);

  /* Accepted an invite before: send a link to choose a new password. */
  if (existing?.email_confirmed_at) {
    await c.sb.from("admins").upsert({ user_id: existing.id, email, note: "Added from the admin" });
    const { error } = await c.sb.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return json({ error: error.message }, 502);
    return json({ sent: "password" });
  }

  /* New, or invited but never accepted: Supabase re-sends the invite to the
     same account with a fresh link (the old link stops working). Nothing is
     deleted, so a failed send never loses the account. */
  const { data, error } = await c.sb.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (error || !data.user) {
    const busy = /rate|limit|security purposes/i.test(error?.message ?? "");
    return json({ error: busy ? "Too many emails sent in the last hour. Try again later." : (error?.message ?? "The invite could not be sent.") }, 502);
  }
  const { error: rowError } = await c.sb.from("admins").upsert({ user_id: data.user.id, email, note: "Invited from the admin" });
  if (rowError) return json({ error: rowError.message }, 500);
  return json({ sent: "invite" });
}

export async function DELETE(request: Request) {
  const c = await caller(request);
  if (c.error) return c.error;
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) return json({ error: "Choose who to remove." }, 400);
  if (id === c.me) return json({ error: "You can't remove your own access. Ask another admin." }, 400);
  /* Deleting the sign-in cascades to the admins row. */
  const { error } = await c.sb.auth.admin.deleteUser(id);
  if (error) return json({ error: error.message }, 502);
  return json({ ok: true });
}
