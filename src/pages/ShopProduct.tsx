import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Button, Container, Kicker, Lead, Section, TextLink } from "@/components/ui";
import { IconArrow, IconDownload } from "@/components/icons";
import { Docket } from "@/components/shop/Docket";
import { SheetBench } from "@/components/shop/PrintedSheet";
import { formatPrice, paragraphs, useProduct } from "@/components/shop/catalogue";

/* ============================================================================
   One product, rebuilt 2026-10-06.

   WHAT WAS HERE. Twenty-six lines that said "We couldn't find that" and
   nothing else. The route existed, the shop linked to it, and the template
   every product would render through had never been written.

   WHAT IT IS NOW. The page a parent decides on: the artwork large and lit as
   a printed sheet rather than floated as a thumbnail, the title, the price,
   what is in the pack in the client's own words, and one button. Under the
   button, before the purchase rather than after it, the terms that matter:
   the link lives for 24 hours and five downloads, and there is no account to
   come back to, so the file has to be saved. A buyer who reads that first
   never meets it as a surprise on /download.

   THE DATA SHAPE IS UNCHANGED. `products` carries title, slug, description,
   price_cents, currency, thumbnail, file_path and active, and that is what
   this page renders. Page count and age suitability have no column, so they
   are not invented here and not faked into the spec: they are listed in
   CONTENT-NEEDED.md, and until the schema carries them the client's own
   description is where they belong. Price comes from the row and is formatted
   from integer cents; the checkout call still sends nothing but the slug,
   because a browser must never be asked for a price.

   NOT FOUND is a real state, not an error: a product can be taken off sale at
   any time from the admin panel, and the link is already out in the world on
   somebody's receipt. So it apologises, says what probably happened, and
   gives the two routes that help.
   ========================================================================== */

/* True of every file in this shop, before any product exists. Stated as a
   docket so the promise and the receipt on /download are the same document. */
const TERMS = [
  { k: "Format", v: "PDF" },
  { k: "Delivery", v: "straight away" },
  { k: "Link valid for", v: "24 hours", strong: true },
  { k: "Downloads allowed", v: "5", strong: true },
  { k: "Account created", v: "none" },
];

export default function ShopProduct() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const q = useProduct(slug);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stripe's cancel_url sends a buyer back here with this flag. Saying so
  // plainly is the difference between a cancelled checkout and a site that
  // looks like it lost the payment.
  const cancelled = params.get("checkout") === "cancelled";

  async function buy() {
    if (!slug) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.url) {
        setError(d.error ?? "Could not start the checkout. Please try again.");
        setBusy(false);
        return;
      }
      window.location.href = d.url;
    } catch {
      setError("Could not reach the checkout. Check your connection and try again.");
      setBusy(false);
    }
  }

  /* ── Loading ───────────────────────────────────────────────────────────
     Deliberately quiet: one line, no skeleton, no spinner. The page below it
     is one request away and a flashing grey wireframe is worse than a pause. */
  if (q.state === "loading") {
    return (
      <>
        <Seo title="Loading" description="Loading this printable." path={`/shop/${slug ?? ""}`} noIndex />
        <Section>
          <Container width="wide">
            <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted">
              Fetching this file
            </p>
          </Container>
        </Section>
      </>
    );
  }

  /* ── Not found, or taken off sale ──────────────────────────────────────── */
  if (q.state === "empty") {
    return (
      <>
        <Seo
          title="Not found"
          description="This printable could not be found."
          path={`/shop/${slug ?? ""}`}
          noIndex
        />
        <Section>
          <Container width="wide">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center lg:gap-20">
              <div>
                <Kicker>Shop</Kicker>
                <h1 className="t-display mt-6 max-w-[14ch]">That one is not on the shelf</h1>
                <Lead className="mt-7 max-w-[46ch]">
                  Either the link is wrong, or the file has been taken off sale. Nothing was
                  charged, and if you already bought it your download link still works for its
                  full 24 hours.
                </Lead>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button to="/shop">
                    See what is on sale
                    <IconArrow size={16} />
                  </Button>
                  <Button to="/contact" variant="quiet">
                    Get in touch
                  </Button>
                </div>
              </div>
              <SheetBench annotate={false} caption="Nothing printed on this one." />
            </div>
          </Container>
        </Section>
      </>
    );
  }

  const p = q.data;
  const body = paragraphs(p.description);

  return (
    <>
      <Seo
        title={p.title}
        description={
          body[0] ??
          `${p.title}, a printable from The Pawsitive Pugs and Pals. Download it straight away, no account needed.`
        }
        path={`/shop/${p.slug}`}
      />

      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          {/* A plain Link rather than TextLink: the breadcrumb is mono and
              muted, and overriding four of TextLink's own classes to get
              there is how a component ends up meaning nothing. */}
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
            <Link to="/shop" className="link-draw text-muted">
              Shop
            </Link>
            <span className="px-2" aria-hidden="true">
              /
            </span>
            <span className="text-ink">{p.title}</span>
          </p>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-20 xl:gap-28">
            {/* ─── The artwork, printed. A thumbnail floated on a page is a
                file; the same image on a lit sheet is the thing arriving in
                the post. Sticky on desktop so it stays beside the terms. ─── */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SheetBench annotate={false}>
                {p.thumbnail ? (
                  <img
                    src={p.thumbnail}
                    alt={`The cover of ${p.title}`}
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                ) : undefined}
              </SheetBench>
              {!p.thumbnail && (
                <p className="mt-4 text-center font-mono text-[12px] text-muted">
                  No artwork has been uploaded for this file yet.
                </p>
              )}

              {/* The cross-links live under the artwork rather than at the
                  foot of the right-hand column: the sticky image column is
                  the shorter of the two, and a page that ends in half a
                  screen of empty paper reads as unfinished. */}
              <div className="mx-auto mt-12 max-w-[42ch] border-t border-rule pt-7">
                <p className="text-[15px] leading-[1.7] text-body">
                  Printables are drawn from <em>The Pawsitive Pugs &amp; Pals&reg;</em>. Free
                  activities live on the show's own site, and the interactive ones are part of
                  PupsPlayer&trade;.
                </p>
                <p className="mt-4">
                  <TextLink to="/shop">
                    Everything else on the shelf
                    <IconArrow size={15} />
                  </TextLink>
                </p>
              </div>
            </div>

            {/* ─── The decision. ─── */}
            <div>
              {cancelled && (
                <p className="mb-8 border-l-[3px] border-red bg-raised px-5 py-4 text-[15.5px] leading-[1.6] text-ink">
                  Checkout was cancelled and nothing was charged. The file is still here whenever
                  you want it.
                </p>
              )}

              <h1 className="t-h1 max-w-[18ch]">{p.title}</h1>

              <p className="tnum mt-6 font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] leading-none text-ink">
                {formatPrice(p.price_cents, p.currency)}
              </p>

              {body.length > 0 && (
                <div className="mt-7 max-w-[54ch] space-y-5 text-[17px] leading-[1.72] text-body">
                  {body.map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                </div>
              )}

              <div className="mt-9">
                <Button onClick={() => void buy()} disabled={busy} size="large">
                  {busy ? "Opening Stripe…" : `Buy for ${formatPrice(p.price_cents, p.currency)}`}
                  <IconDownload size={17} />
                </Button>
                <p className="mt-4 max-w-[44ch] text-[14.5px] leading-[1.6] text-body">
                  Card payment is handled by Stripe. You are not asked to make an account, and
                  buying never puts you on a mailing list.
                </p>
                {error && (
                  <p role="alert" className="mt-4 max-w-[44ch] text-[15px] font-semibold text-red-deep">
                    {error}
                  </p>
                )}
              </div>

              <Docket
                className="mt-11 max-w-[26rem]"
                label="What you get"
                rows={TERMS}
                foot={
                  <>
                    Save the file as soon as it downloads. There is no account here, so there is
                    nowhere to come back to it, and the link stops working after a day.
                  </>
                }
              />

            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
