import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS entirely, so it exists only in
 * serverless functions and must never be imported from anything under src/.
 */
export function adminClient() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service credentials are not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not configured`);
  return v;
}

/** JSON response helper for the Web-standard handler signature. */
export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Best-effort email to CLÉ through Resend, from ENQUIRY_NOTIFY_FROM (an
 * address on a domain verified in Resend). Never throws: whatever triggered
 * it is already stored, so a failed send is logged and the caller carries on.
 */
export async function sendNotice(m: { subject: string; to: string | undefined; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_NOTIFY_FROM;
  if (!key || !m.to || !from) {
    if (key && m.to && !from) console.error("ENQUIRY_NOTIFY_FROM is not configured, no notification sent");
    return;
  }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [m.to], reply_to: m.replyTo, subject: m.subject, text: m.text }),
    });
    if (!r.ok) console.error("Resend rejected the notification", r.status, await r.text().catch(() => ""));
  } catch (err) {
    console.error("Notification failed", err);
  }
}
