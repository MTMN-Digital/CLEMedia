import Stripe from "stripe";
import { adminClient, requireEnv, json } from "./_lib/admin";

/**
 * Creates a Stripe Checkout session for one product.
 *
 * The client sends a slug and nothing else. Price, currency and title are read
 * from the database. A browser can send any number it likes, so it is never
 * asked for one.
 */
export async function POST(request: Request) {
  try {
    const { slug } = (await request.json().catch(() => ({}))) as { slug?: string };
    if (!slug || typeof slug !== "string") {
      return json({ error: "A product slug is required." }, 400);
    }

    const supabase = adminClient();
    const { data: product, error } = await supabase
      .from("products")
      .select("id, title, description, price_cents, currency, thumbnail, active")
      .eq("slug", slug)
      .single();

    /* A query that errored has established nothing about whether the product
       exists. Collapsing the two answered a Supabase outage with "Product not
       found", which sends a buyer away from a file that is on sale and gives
       the page no reason to offer a retry. */
    if (error) {
      console.error("product lookup failed", error);
      return json({ error: "Could not reach the shop just now. Please try again." }, 503);
    }
    if (!product) return json({ error: "Product not found." }, 404);
    if (!product.active) return json({ error: "This product is not on sale." }, 409);

    const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
    /* `?? origin` only catches an UNSET variable. Set but blank passed through,
       and Stripe was handed relative success and cancel URLs, which it
       rejects, so checkout failed for every buyer with no clue why. */
    const site = process.env.VITE_SITE_URL?.trim() || new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.price_cents,
            product_data: {
              name: product.title,
              ...(product.description ? { description: product.description } : {}),
              ...(product.thumbnail ? { images: [product.thumbnail] } : {}),
            },
          },
        },
      ],
      // Stripe collects an email for its own receipt. We do not require an
      // account, do not gate the download on it, and never add anyone to a
      // mailing list from a purchase.
      metadata: { product_id: product.id, slug },
      success_url: `${site}/download/pending?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/shop/${slug}?checkout=cancelled`,
    });

    return json({ url: session.url });
  } catch (err) {
    console.error("create-checkout-session failed", err);
    return json({ error: "Could not start checkout. Please try again." }, 500);
  }
}
