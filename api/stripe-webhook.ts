import { randomBytes } from "node:crypto";
import Stripe from "stripe";
import { adminClient, requireEnv, json } from "./_lib/admin";

/**
 * Stripe signs the exact bytes it sent, so the body must reach constructEvent
 * untouched. The Web-standard handler signature is used deliberately:
 * `request.text()` gives the raw payload. The Next.js
 * `config = { api: { bodyParser: false } }` export does nothing in a plain
 * Vercel function, so the body arrives pre-parsed and every signature check
 * fails.
 */

const TOKEN_HOURS = 24;
const MAX_DOWNLOADS = 5;

export async function POST(request: Request) {
  const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  const signature = request.headers.get("stripe-signature");
  let event: Stripe.Event;

  // Verify before trusting anything in the payload. An unverified request is
  // just a stranger claiming a payment happened.
  try {
    event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature ?? "",
      requireEnv("STRIPE_WEBHOOK_SECRET")
    );
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  /* Two events can mean "this is paid, fulfil it".
   *
   * `checkout.session.completed` fires when the session finishes, and for a
   * card that is the end of it. A delayed method settles later and announces
   * itself with `async_payment_succeeded`, with `completed` having arrived
   * earlier carrying `payment_status: "unpaid"`. Handling only the first meant
   * such a payment was taken and no order, token or file ever followed.
   *
   * Checkout is not pinned to immediate methods anywhere in this codebase, and
   * which methods are live is a Stripe Dashboard setting this repository
   * cannot see, so the safe assumption is that one can arrive. Both events
   * land in the same idempotent path below, which is keyed on the session id,
   * so a session that produces both is still fulfilled exactly once. */
  const FULFIL = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];
  if (!FULFIL.includes(event.type)) {
    return json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return json({ received: true, ignored: "unpaid" });
  }

  try {
    const supabase = adminClient();

    // Idempotency. Stripe retries deliveries, and a retry must not mint a
    // second download token for one payment. stripe_session_id is unique, so
    // this is enforced at the database level too.
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (existing) return json({ received: true, duplicate: true });

    const productId = session.metadata?.product_id;
    if (!productId) {
      console.error("checkout.session.completed with no product_id", session.id);
      return json({ received: true, ignored: "no product_id" });
    }

    const { error } = await supabase.from("orders").insert({
      stripe_session_id: session.id,
      product_id: productId,
      download_token: randomBytes(32).toString("base64url"),
      expires_at: new Date(Date.now() + TOKEN_HOURS * 3_600_000).toISOString(),
      max_downloads: MAX_DOWNLOADS,
      amount_cents: session.amount_total,
      currency: session.currency,
    });

    // A unique violation means a concurrent delivery won the race. Still fine.
    if (error && error.code !== "23505") throw error;

    return json({ received: true });
  } catch (err) {
    // A non-2xx tells Stripe to retry, which is what we want for a transient
    // fault. The customer has paid and must end up with a token.
    console.error("Webhook processing failed", err);
    return json({ error: "Processing failed" }, 500);
  }
}
