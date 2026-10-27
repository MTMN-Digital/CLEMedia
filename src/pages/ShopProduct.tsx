import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { TextLink, Button, Section, Container, Lead } from "@/components/ui";
import { IconDownload, IconArrow } from "@/components/icons";
import { Settle } from "@/components/Settle";
import { Docket } from "@/components/shop/Docket";
import { SheetBench } from "@/components/shop/PrintedSheet";
import { paragraphs, formatPrice, useProduct } from "@/components/shop/catalogue";
import "@/components/shop/buy.css";

/* ============================================================================
   One product, rebuilt 2026-10-06, carried to the hero's language 2026-10-27.

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

   THE FOUND STATE KEEPS ITS OWN OPENING. It is a buy layout, picture left
   and decision right, and that is the one shape on the site that a hero
   frame would push below the fold. What changed on 2026-10-27 is inside it:
   the acknowledgement is a field with a 2px edge and a 44px hit area, the
   "no artwork" line is a credit under the picture, and the terms section
   opens on the docket's own claim instead of a filing label.

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
   gives the two routes that help. It and the load failure open in the hero's
   frame, on the plain ink panel, because a page with no product has nothing
   else to open on, and the drawn blank sheet that used to stand beside the
   apology was a drawing of nothing.
   ========================================================================== */

/* True of every file in this shop, before any product exists. Stated as a
   docket so the promise and the receipt on /download are the same document. */
const TERMS = [
  { k: "Format", v: "PDF" },
  { k: "Delivery", v: "straight away" },
  { k: "Link valid for", v: "24 hours", strong: true },
  { k: "Downloads allowed", v: "5", strong: true },
  { k: "Account created", v: "none" },
  /* The consequence of "straight away", stated where the other terms are
     rather than left to the policy page. Added 2026-10-13 with the
     acknowledgement above the button. */
  { k: "Right to cancel", v: "ends on download", strong: true },
];

export default function ShopProduct() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const q = useProduct(slug);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* Article 16(m) of the Consumer Rights Directive. Digital content delivered
     immediately loses the right of withdrawal only where the buyer gave prior
     express consent and acknowledged losing it, and the seller is the one who
     has to be able to show it was given. The terms already said the right ends
     on download, which is the correct rule and not the required step: nobody
     consents by reading a policy. The API refuses to open a session without
     this flag, so the box is the gate rather than a formality beside one. */
  const [ack, setAck] = useState(false);

  // Stripe's cancel_url sends a buyer back here with this flag. Saying so
  // plainly is the difference between a cancelled checkout and a site that
  // looks like it lost the payment.
  const cancelled = params.get("checkout") === "cancelled";

  async function buy() {
    if (!slug || !ack) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, withdrawalAck: true }),
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
     is one request away and a flashing grey wireframe is worse than a pause,
     and so is a hero frame that appears for half a second and is replaced. */
  if (q.state === "loading") {
    return (
      <>
        <Seo title="Loading" description="Loading this printable." path={`/shop/${slug ?? ""}`} noIndex />
        <Section>
          <Container width="wide">
            <p className="font-mono text-[14px] uppercase tracking-[0.14em] text-muted">
              Fetching this file
            </p>
          </Container>
        </Section>
      </>
    );
  }

  /* ── The shop did not answer ───────────────────────────────────────────── */
  if (q.state === "failed") {
    return (
      <>
        <Seo
          title="Could not load this file"
          description="This page could not be loaded."
          path={`/shop/${slug ?? ""}`}
          noIndex
        />
        {/* NOT "not on the shelf". A request that failed has established
            nothing about whether this file exists, and telling somebody
            their link is wrong when the database simply did not answer
            sends them away from a product that is on sale. */}
        <PageHero
          id="product-h"
          size="short"
          tone="ink"
          eyebrow={
            <>
              Shop<span>Could not load</span>
            </>
          }
          aside={<>Something went wrong at our end, not yours.</>}
          title={
            <>
              We could not <em>load this one</em>
            </>
          }
          actions={
            <>
              <Button onClick={() => window.location.reload()}>Try again</Button>
              <Button to="/shop" variant="quiet">
                Back to the shop
              </Button>
            </>
          }
        />
        <Section pad={["tight", "open"]}>
          <Container width="wide">
            <Lead className="max-w-[46ch]">
              Reload the page, and if it keeps happening tell us and we will look at it.
            </Lead>
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
        <PageHero
          id="product-h"
          size="short"
          tone="ink"
          eyebrow={
            <>
              Shop<span>Not on sale</span>
            </>
          }
          aside={<>Nothing was charged.</>}
          title={
            <>
              That one is not <em>on the shelf</em>
            </>
          }
          actions={
            <>
              <Button to="/shop">
                See what is on sale
                <IconArrow size={16} />
              </Button>
              <Button to="/contact" variant="quiet">
                Get in touch
              </Button>
            </>
          }
        />
        <Section pad={["tight", "open"]}>
          <Container width="wide">
            <Lead className="max-w-[46ch]">
              Either the link is wrong, or the file has been taken off sale. Nothing was charged,
              and if you already bought it your download link still works for its full 24 hours.
            </Lead>
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

      <Section labelledBy="product-h" pad={["normal", "tight"]}>
        <Container width="wide">
          <p className="flex flex-wrap items-center gap-x-2 font-mono text-[14.5px] uppercase tracking-[0.14em] text-muted">
            <TextLink to="/shop">Shop</TextLink>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{p.title}</span>
          </p>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-20 xl:gap-28">
            {/* ─── The artwork, printed. A thumbnail floated on a page is a
                file; the same image on a lit sheet is the thing arriving in
                the post. Sticky on desktop so it stays beside the terms. ─── */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SheetBench
                annotate={false}
                /* No artwork is a fact about the file, so it is written as a
                   credit: small, mono, right aligned under the picture. */
                caption={!p.thumbnail ? "No artwork has been uploaded for this file yet." : undefined}
              >
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
            </div>

            {/* ─── The decision. ─── */}
            <div>
              {cancelled && (
                <p className="mb-8 border-[1.5px] border-rule bg-raised px-5 py-4 text-[15.5px] leading-[1.6] text-ink">
                  Checkout was cancelled and nothing was charged. The file is still here whenever
                  you want it.
                </p>
              )}

              <h1 id="product-h" className="t-h1 max-w-[18ch]">{p.title}</h1>

              <p className="tnum mt-6 font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] leading-none text-ink">
                {formatPrice(p.price_cents, p.currency)}
              </p>

              {body.length > 0 && (
                <div className="mt-7 max-w-[54ch] space-y-5 t-prose text-body">
                  {body.map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                </div>
              )}

              <div className="mt-9">
                {/* Above the button, because it is the thing that unlocks it
                    and because the order the page is read in should be the
                    order the buyer acts in. A field, not a sentence with a
                    tick beside it: see components/shop/buy.css. */}
                <label className="tickbox buy-ack max-w-[46ch]">
                  <input
                    type="checkbox"
                    checked={ack}
                    onChange={(e) => {
                      setAck(e.target.checked);
                      if (e.target.checked) setError(null);
                    }}
                  />
                  <span className="text-[15px] leading-[1.55] text-body">
                    I understand the download starts straight away, and that once it does I lose
                    the right to cancel.
                  </span>
                </label>

                <Button onClick={() => void buy()} disabled={busy || !ack} size="large" className="mt-6">
                  {busy ? "Opening Stripe…" : `Buy for ${formatPrice(p.price_cents, p.currency)}`}
                  <IconDownload size={17} />
                </Button>
                <p className="mt-4 max-w-[44ch] text-[14.5px] leading-[1.6] text-body">
                  {!ack && "Tick the box above to continue. "}
                  Card payment is handled by Stripe. You are not asked to make an account, and
                  buying never puts you on a mailing list.
                </p>
                {error && (
                  <p role="alert" className="mt-4 max-w-[44ch] text-[15px] font-semibold text-red-deep">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* The terms, on the wall as a receipt, the same room /shop puts them
          in. The heading is the docket's first two rows in a sentence. */}
      <Section labelledBy="terms-h" pad="tight" className="wall">
        <Container>
          <Settle className="mx-auto grid max-w-[62ch] gap-10 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-20">
            <div>
              <h2 id="terms-h" className="t-h2 max-w-[14ch]">A PDF, delivered straight away.</h2>
              <p className="t-body mt-6 max-w-[44ch] text-body">
                Printables are drawn from <em>The Pawsitive Pugs &amp; Pals&reg;</em>. Free
                activities live on the show's own site, and the interactive ones are part of
                PupsPlayer&trade;.
              </p>
              <p className="mt-5">
                <TextLink to="/shop">
                  Everything else on the shelf
                  <IconArrow size={15} />
                </TextLink>
              </p>
            </div>
            <Docket
              label="What a purchase is"
              rows={TERMS}
              foot={
                <>
                  Save the file as soon as it downloads. There is no account here, so there is
                  nowhere to come back to it, and the link stops working after a day.
                </>
              }
            />
          </Settle>
        </Container>
      </Section>
    </>
  );
}
