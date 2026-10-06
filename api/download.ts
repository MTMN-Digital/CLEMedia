import { adminClient, json } from "./_lib/admin";

const SIGNED_URL_SECONDS = 120;

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
       answer and the page retries. A token with no order IS missing. */
    if (!order && session) return json({ error: "pending" }, 202);
    if (!order) return json({ error: "not_found" }, 404);
    if (new Date(order.expires_at) < new Date()) return json({ error: "expired" }, 410);
    if (order.download_count >= order.max_downloads) return json({ error: "exhausted" }, 429);

    const { data: product } = await supabase
      .from("products")
      .select("title, file_path")
      .eq("id", order.product_id)
      .single();

    if (!product) return json({ error: "not_found" }, 404);

    const { data: signed, error: signErr } = await supabase.storage
      .from("product-files")
      .createSignedUrl(product.file_path, SIGNED_URL_SECONDS, { download: true });

    if (signErr || !signed) throw signErr ?? new Error("Could not sign URL");

    // Counted only once the URL has actually been issued.
    await supabase
      .from("orders")
      .update({ download_count: order.download_count + 1 })
      .eq("id", order.id);

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
