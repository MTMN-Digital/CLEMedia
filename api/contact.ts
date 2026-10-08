import { adminClient, json } from "./_lib/admin";

const ROUTES = ["general", "partnership", "educator", "press", "notify"] as const;
type Route = (typeof ROUTES)[number];

/** How many submissions one address may make, and over what period. */
const MAX_PER_WINDOW = 5;
const WINDOW_MINUTES = 10;

/**
 * Receives a contact or notify-me submission, stores it and sends a
 * notification. Validated server side. Client-side validation is a courtesy
 * to the user, not a control.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  // Honeypot. A real person never fills a field they cannot see.
  if (typeof body.company_website === "string" && body.company_website.trim() !== "") {
    return json({ ok: true });
  }

  const route = String(body.route ?? "") as Route;
  if (!ROUTES.includes(route)) return json({ error: "Unknown enquiry type." }, 400);

  const email = String(body.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "A valid email address is required." }, 400);
  }

  const name = String(body.name ?? "").trim().slice(0, 200);
  const organisation = String(body.organisation ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);

  if (route !== "notify" && message.length < 2) {
    return json({ error: "A message is required." }, 400);
  }

  try {
    const supabase = adminClient();

    /* A throttle, keyed on the address the sender gave.
     *
     * This endpoint holds the service-role key and calls an email provider, so
     * an unthrottled POST loop is an unbounded write to `enquiries` and an
     * unbounded spend at Resend. It is keyed on email and not on IP because
     * the privacy notice lists exactly what an enquiry collects, and an IP is
     * not on that list; adding one is a change to client-facing legal copy,
     * not a thing to slip into a patch.
     *
     * ponytail: per-address only, so it stops a flood from one sender and not
     * a script rotating addresses. Network-level limiting belongs in front of
     * the function, and is logged for the deploy in QUESTIONS.md.
     */
    const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
    const { count } = await supabase
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", since);
    if ((count ?? 0) >= MAX_PER_WINDOW) {
      return json(
        { error: "That is a few messages in a short time. Give it a few minutes and try again." },
        429,
      );
    }

    const { error } = await supabase.from("enquiries").insert({
      route,
      name: name || null,
      email,
      organisation: organisation || null,
      message: message || null,
    });
    if (error) throw error;

    await notify({ route, name, email, organisation, message });
    return json({ ok: true });
  } catch (err) {
    console.error("contact failed", err);
    return json({ error: "Could not send your message. Please try again." }, 500);
  }
}

/** Best effort. A failed notification must not lose the enquiry, which is
 *  already safely stored by the time this runs. */
async function notify(e: { route: string; name: string; email: string; organisation: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_TO;
  /* The sender was hardcoded to `notifications@example.com`, a domain nobody
     controls and Resend will never have verified, so with credentials present
     every send was rejected and the rejection was thrown away: the API said
     `ok`, the enquiry sat in the table, and nobody was told it had arrived. */
  const from = process.env.ENQUIRY_NOTIFY_FROM;
  if (!key || !to || !from) {
    if (key && to && !from) console.error("ENQUIRY_NOTIFY_FROM is not configured, no notification sent");
    return;
  }

  const subject =
    e.route === "partnership"
      ? `Partnership enquiry from ${e.name || e.email}`
      : `${e.route} enquiry from ${e.name || e.email}`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: e.email,
        subject,
        text: [
          `Type: ${e.route}`,
          `Name: ${e.name || "Not given"}`,
          `Email: ${e.email}`,
          `Organisation: ${e.organisation || "Not given"}`,
          "",
          e.message || "(no message)",
        ].join("\n"),
      }),
    });
    /* A non-2xx is a silent failure unless it is read. The enquiry is already
       stored, so this does not fail the request, but it must be visible in the
       function logs rather than swallowed. */
    if (!r.ok) {
      console.error("Enquiry stored but Resend rejected the notification", r.status, await r.text().catch(() => ""));
    }
  } catch (err) {
    console.error("Enquiry stored but notification failed", err);
  }
}
