import { useState, type CSSProperties } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Lead, Section, TextLink, Container, Kicker, Button } from "@/components/ui";
import { IconDownload, IconArrow } from "@/components/icons";
import { Settle } from "@/components/Settle";
import { Docket } from "@/components/shop/Docket";
import { Cover, coverPicture } from "@/components/shop/Cover";
import { samplesFor, packFor } from "@/components/shop/samples";
import { fileFormat, formatPrice, useProduct, formatLabel, paragraphs } from "@/components/shop/catalogue";
import { COPY } from "@/components/shop/copy";
import { useBlock } from "@/lib/content";
import { BOOKS_CREDIT, fileLine } from "@/lib/books";
import "@/components/shop/buy.css";
import "@/components/shop/catalogue.css";

/* ============================================================================
   One product, rebuilt 2026-10-06, made a product sheet on 2026-10-28
   (docs/SUBPAGE-PLANS-2026-10-28.md, "## shop", 4.3).

   WHAT IT IS. The page a parent decides on. The real cover is the opening
   object, lying flat on a ledge at the left; beside it the title, the price,
   what is in the folder as a ruled list, the acknowledgement and one
   button. Under the decision, three real pages from the pack as the proof it
   exists. Then the purchase terms once, as the docket, with the sentence
   about free activities and the one about a download gone wrong.

   WHAT CAME OFF. The drawn blank sheet with its staple and punch holes
   (SheetBench): there is a real cover for every row. The claim heading over
   the docket. The hero frame on the not-found and failed states, which now
   open on a status, a plain h1 and the same two buttons.

   THE DATA SHAPE IS UNCHANGED. `products` carries title, slug, description,
   price_cents, currency, thumbnail, file_path and active, and that is what
   this page renders. Price comes from the row and is formatted from integer
   cents; the checkout call still sends nothing but the slug, because a
   browser must never be asked for a price. The "In the folder" lines come
   from src/lib/books.ts for a row that names its episode, which is the one
   table /app also prints; a row that names none renders the lines of its
   description's first paragraph, one per book, exactly as the admin wrote
   them.

   NOT FOUND is a real state, not an error: a product can be taken off sale at
   any time from the admin panel, and the link is already out in the world on
   somebody's receipt. So it apologises, says what probably happened, and
   gives the two routes that help.

   THE FORMAT IS READ, NOT ASSUMED. The docket names what the stored file is,
   a zip of PDFs or a single PDF, off its own extension.
   ========================================================================== */

/* True of every file in this shop. Stated as a docket so the promise and the
   receipt on /download are the same document. The format row is the one
   term that comes from the product. */
function terms(format: null | "zip" | "pdf") {
  return [
    { k: "Format", v: formatLabel(format) },
    { k: "Pay by card", v: "Stripe" },
    { k: "Delivery", v: "straight away" },
    { k: "Link valid for", v: "24 hours", strong: true },
    { k: "Downloads allowed", v: "5", strong: true },
    { k: "Account created", v: "none" },
    /* The consequence of "straight away", stated where the other terms are
       rather than left to the policy page, and again above the button as the
       acknowledgement. */
    { k: "Right to cancel", v: "ends on download", strong: true },
  ];
}

const COVER_SIZES = "(min-width: 1024px) 52vw, 100vw";
const PAGE_SIZES = "(min-width: 640px) 30vw, 78vw";

export default function ShopProduct() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const q = useProduct(slug);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* Article 16(m) of the Consumer Rights Directive. Digital content delivered
     immediately loses the right of withdrawal only where the buyer gave prior
     express consent and acknowledged losing it, and the seller is the one who
     has to be able to show it was given. The API refuses to open a session
     without this flag, so the box is the gate rather than a formality. */
  const [ack, setAck] = useState(false);
  const c = {
    samplesHeading: useBlock("shop", "product.samples.heading", COPY["product.samples.heading"]),
    samplesCredit: useBlock("shop", "product.samples.credit", COPY["product.samples.credit"]),
    shelfLink: useBlock("shop", "product.shelf.link", COPY["product.shelf.link"]),
    freeLine: useBlock("shop", "product.free.line", COPY["product.free.line"]),
    docketFoot: useBlock("shop", "product.docket.foot", COPY["product.docket.foot"]),
    wrongLine: useBlock("shop", "product.wrong.line", COPY["product.wrong.line"]),
  };

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
     Deliberately quiet: one line, no skeleton, no spinner. */
  if (q.state === "loading") {
    return (
      <>
        <Seo title="Loading" description="Loading this pack." path={`/shop/${slug ?? ""}`} noIndex />
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
            nothing about whether this file exists. */}
        <Section labelledBy="product-h" pad={["normal", "open"]}>
          <Container width="wide">
            <Kicker className="eyebrow-sm">Could not load</Kicker>
            <h1 id="product-h" className="t-h1 mt-6 max-w-[16ch]">We could not load this one</h1>
            <Lead className="mt-7 max-w-[46ch]">
              Something went wrong at our end, not yours. Reload the page, and if it keeps
              happening tell us and we will look at it.
            </Lead>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button onClick={() => window.location.reload()}>Try again</Button>
              <Button to="/shop" variant="quiet">
                Back to the shop
              </Button>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  /* ── Not found, or taken off sale ──────────────────────────────────────── */
  if (q.state === "empty") {
    return (
      <>
        <Seo title="Not found" description="This pack could not be found." path={`/shop/${slug ?? ""}`} noIndex />
        <Section labelledBy="product-h" pad={["normal", "open"]}>
          <Container width="wide">
            <Kicker className="eyebrow-sm">Not on sale</Kicker>
            <h1 id="product-h" className="t-h1 mt-6 max-w-[16ch]">That one is not on the shelf</h1>
            <Lead className="mt-7 max-w-[46ch]">
              Either the link is wrong, or the file has been taken off sale. Nothing was charged,
              and if you already bought it your download link still works for its full 24 hours.
            </Lead>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button to="/shop">
                See what is on sale
                <IconArrow size={16} />
              </Button>
              <Button to="/contact" variant="quiet">
                Get in touch
              </Button>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  const p = q.data;
  const body = paragraphs(p.description);
  const format = fileFormat(p.file_path);
  const pack = packFor(p);
  const cover = coverPicture(p);
  const samples = pack ? samplesFor(pack) : null;

  /* What is in the folder: the pack's own file table when the row names its
     episode; otherwise the description's first paragraph when it is written
     as one line per book. The description's remaining paragraphs run as
     prose; when there are none and the pack is known, the folder sentence
     the plan drafts for the admin stands in. */
  const firstLines = (body[0] ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const firstIsList = firstLines.length >= 2;
  const folder = pack ? pack.files.map(fileLine) : firstIsList ? firstLines : null;
  const prose = firstIsList ? body.slice(1) : body;
  const fallbackProse =
    pack && prose.length === 0
      ? `${pack.pdfs === 4 ? "Four" : "Three"} A4 PDFs in one folder, for Episode ${pack.episode}, ${pack.title}. Print as many copies as you need at home or in a classroom.`
      : null;

  return (
    <>
      <Seo
        title={p.title}
        description={
          prose[0] ??
          fallbackProse ??
          `${p.title}, a printable pack from The Pawsitive Pugs and Pals. Download it straight away, no account needed.`
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

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
            {/* ─── The cover, the opening object. Flat on a ledge, sticky on
                desktop so it stays beside the decision. One child, so Settle
                moves it as one unit. ─── */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Settle>
                <figure className="m-0">
                  <div className="rounded-[2px] bg-paper-3 px-5 pt-5 pb-7 sm:px-8 sm:pt-8 sm:pb-10">
                    <Cover product={p} sizes={COVER_SIZES} priority />
                  </div>
                  <figcaption className="mt-3 font-mono text-[13px] leading-[1.6] text-body sm:text-right">
                    {cover ? `Cover of the activity book. ${BOOKS_CREDIT}` : "No artwork has been uploaded for this file yet."}
                  </figcaption>
                </figure>
              </Settle>
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

              {folder && (
                <div className="mt-8 max-w-[54ch]">
                  <p className="font-mono text-[14px] uppercase tracking-[0.12em] text-body">In the folder</p>
                  <ul className="mt-3 border-t-[1.5px] border-rule">
                    {folder.map((line) => (
                      <li key={line} className="border-b-[1.5px] border-rule py-3 text-[17px] leading-[1.5] text-ink">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(prose.length > 0 || fallbackProse) && (
                <div className="mt-6 max-w-[54ch] space-y-5 t-prose text-body">
                  {prose.length > 0 ? prose.map((para) => <p key={para.slice(0, 40)}>{para}</p>) : <p>{fallbackProse}</p>}
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

                <Button
                  onClick={() => void buy()}
                  disabled={busy || !ack}
                  size="large"
                  className="mt-6 w-full justify-center sm:w-auto"
                >
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

      {/* ═══ THREE PAGES FROM THE PACK. The proof the thing is real: the first
          activity page, the first colouring page and page two of the booklet,
          at the files' own proportions, each captioned. A scroll-snap row on
          a phone, which the reader moves; nothing advances on its own. ═══ */}
      {samples && (
        <Section labelledBy="samples-h" pad="normal">
          <Container width="wide">
            <h2 id="samples-h" className="t-h2 max-w-[24ch]">{c.samplesHeading}</h2>
            <p className="mt-4 font-mono text-[13px] uppercase tracking-[0.12em] text-body sm:hidden">
              3 pages, swipe
            </p>
            <Settle as="ul" className="cat-samples mt-8 sm:mt-10">
              {samples.map((s, i) => (
                <li key={s.caption} style={{ "--i": i } as CSSProperties}>
                  <figure className="m-0">
                    <span className="cat-page">
                      <picture>
                        <source type="image/webp" srcSet={`${s.webp} ${s.width}w, ${s.webp2x} ${s.width * 2}w`} sizes={PAGE_SIZES} />
                        <img
                          src={s.jpg}
                          srcSet={`${s.jpg} ${s.width}w, ${s.jpg2x} ${s.width * 2}w`}
                          sizes={PAGE_SIZES}
                          width={s.width}
                          height={s.height}
                          alt={s.alt}
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    </span>
                    <figcaption className="mt-3 font-mono text-[13px] leading-[1.6] text-body">{s.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </Settle>
            <p className="mt-7 font-mono text-[13px] leading-[1.6] text-body">{c.samplesCredit}</p>
          </Container>
        </Section>
      )}

      {/* ═══ THE TERMS, ONCE. The docket is the receipt the buyer meets again
          on /download, with the figures filled in. A plain block: the plan
          names two entrances on this page, the cover and the sample pages,
          and nothing else moves. ═══ */}
      <Section labelledBy="terms-h" pad="tight" className="wall">
        <Container>
          <div className="mx-auto grid max-w-[62ch] gap-10 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-20">
            <div>
              <p id="terms-h" className="t-body max-w-[44ch] text-body">{c.freeLine}</p>
              <p className="mt-5">
                <TextLink to="/shop">
                  {c.shelfLink}
                  <IconArrow size={15} />
                </TextLink>
              </p>
            </div>
            <Docket
              label="What a purchase is"
              rows={terms(format)}
              foot={
                <>
                  {c.docketFoot} {c.wrongLine}{" "}
                  <TextLink to="/contact" className="text-[15px]">
                    Get in touch
                    <IconArrow size={14} />
                  </TextLink>
                </>
              }
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
