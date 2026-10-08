import Stripe from "stripe";
import { adminClient, json, requireEnv } from "./_lib/admin";

/* The link is handed over as soon as the page loads, and the allowance is
   spent at that moment, so this has to outlive a person who opens the page and
   comes back to it. At 120 seconds a two-minute pause left them holding a dead
   URL and one fewer download, with no way to tell the difference between the
   two. Fifteen minutes is still short enough that a shared link is worthless. */
const SIGNED_URL_SECONDS = 900;

/**
 * Did Stripe actually take money for this session?
 *
 * A network or credential failure answers `true`: the alternative is telling a
 * buyer whose webhook is merely slow that their purchase does not exist, and
 * they still reach no file either way, because the order row is what issues it.
 */
async function sessionIsPaid(id: string): Promise<boolean> {
  try {
    const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
    const s = await stripe.checkout.sessions.retrieve(id);
    return s.payment_status === "paid" || s.payment_status === "no_payment_required";
  } catch (err) {
    const code = (err as { type?: string }).type;
    // A malformed or unknown id is a definite no; anything else is unknown.
    if (code === "StripeInvalidRequestError") return false;
    console.error("stripe session lookup failed", err);
    return true;
  }
}

/**
 * Exchanges a download token for a short-lived signed URL.
 *
 * Runs server side because product-files has no public read policy and the
 * anon key cannot reach it. The browser never receives a durable file URL.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const token = params.get("token");
  /* Stripe sends the buyer back to /download/pending?session_id=..., and until
     now nothing could turn that session id into a download token: this
     endpoint read tokens only, so somebody who had just paid had no route to
     their file at all. The session id is as unguessable as the token and is
     only ever handed to the browser that completed the payment, so it is
     accepted as a second way in rather than inventing a third identifier. */
  const session = params.get("session_id");
  if (!token && !session) return json({ error: "not_found" }, 400);

  try {
    const supabase = adminClient();

    const lookup = supabase
      .from("orders")
      .select("id, product_id, expires_at, download_count, max_downloads");
    const { data: order } = await (token
      ? lookup.eq("download_token", token)
      : lookup.eq("stripe_session_id", session)
    ).maybeSingle();

    /* A session with no order yet is not a missing order: the webhook that
       writes it is asynchronous and the buyer's redirect regularly beats it.
       Saying "not found" there would tell somebody who has just been charged
       that their purchase does not exist, so the pending case is its own
       answer and the page retries. A token with no order IS missing.

       STRIPE IS ASKED FIRST. Without this, any string at all in `session_id`
       produced the same 202, and the page went on to tell whoever typed it
       "Thank you. Your payment went through." A session id nobody paid for is
       not pending, it is not found. */
    if (!order && session) {
      const paid = await sessionIsPaid(session);
      return paid
        ? json({ error: "pending" }, 202)
        : json({ error: "not_found" }, 404);
    }
    if (!order) return json({ error: "not_found" }, 404);
    if (new Date(order.expires_at) < new Date()) return json({ error: "expired" }, 410);
    if (order.download_count >= order.max_downloads) return json({ error: "exhausted" }, 429);

    const { data: product, error: productErr } = await supabase
      .from("products")
      .select("title, file_path")
      .eq("id", order.product_id)
      .single();

    /* A failed lookup is not a missing product. Ignoring the error told
       somebody who had paid that their file does not exist, on the strength of
       a database that did not answer, and the page offers no retry for that. */
    if (productErr) throw productErr;
    if (!product) return json({ error: "not_found" }, 404);

    const { data: signed, error: signErr } = await supabase.storage
      .from("product-files")
      .createSignedUrl(product.file_path, SIGNED_URL_SECONDS, { download: true });

    if (signErr || !signed) throw signErr ?? new Error("Could not sign URL");

    /* Counted only once the URL has actually been issued, and counted with the
       value we read as a condition.
       
       A plain `update(count + 1)` loses a concurrent request: two tabs on the
       last allowance both read 4, both pass the check above, both sign a URL,
       and both write 5, so the cap of five delivers six files. Matching on the
       count we read means the second write finds no row, and that request is
       the one that gets turned away. */
    const { data: counted } = await supabase
      .from("orders")
      .update({ download_count: order.download_count + 1 })
      .eq("id", order.id)
      .eq("download_count", order.download_count)
      .select("id");

    if (!counted?.length) return json({ error: "exhausted" }, 429);

    return json({
      url: signed.signedUrl,
      title: product.title,
      downloadsUsed: order.download_count + 1,
      downloadsAllowed: order.max_downloads,
      expiresAt: order.expires_at,
    });
  } catch (err) {
    console.error("download failed", err);
    return json({ error: "server_error" }, 500);
  }
}
