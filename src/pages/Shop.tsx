import { type ReactNode, useState } from "react";
import { Seo } from "@/components/Seo";
import { TextLink, Container, DisclosurePanel, Section } from "@/components/ui";
import { IconExternal, IconArrow } from "@/components/icons";
import { Shelf, ShelfComing } from "@/components/shop/Shelf";
import { fileFormat, formatLabel, formatPrice, useProducts } from "@/components/shop/catalogue";
import { COPY } from "@/components/shop/copy";
import { useSetting, useBlock } from "@/lib/content";
import { BOOKS_STATEMENT, BOOKS_CREDIT } from "@/lib/books";
import type { Product, AppSetting } from "@/lib/types";
import { SITE, APP_LAUNCHED } from "@/lib/site";
import "@/components/shop/catalogue.css";

/* ============================================================================
   The shop, rebuilt as a catalogue on 2026-10-28
   (docs/SUBPAGE-PLANS-2026-10-28.md, "## shop").

   WHAT WAS WRONG. The page opened on the home hero's frame (an ink panel, a
   pink claim, two pills), then spent 900 pixels drawing a crossed-out
   checkout, listed three kinds of thing that were not on sale, repeated the
   purchase terms on the bench and closed on a navy band. Four and a half
   thousand pixels selling the absence of a product while eighteen real
   covers sat in the client's Drive.

   WHAT IT IS NOW. A shelf. The title is a shelf label ("Episode packs", a
   noun), the status line under it counts what the database holds, and the
   first thing on the page at both widths is the covers themselves: one pack
   per episode, every cover the same size at the true A4 landscape proportion
   of the file the buyer prints, standing on the one dark band the page has.
   Under the shelf, where a catalogue prints its illustrator, the one
   descriptive sentence and the credit. Under that, the purchase terms as a
   footnote strip, with the five code-checkable refusals behind a disclosure.
   Then one line and two links, then the footer.

   NOTHING HERE STATES A PRICE OR A COUNT. The shelf reads `products` as it
   always did: titles, slugs, prices and running order come from the admin.
   The book counts come from src/lib/books.ts, which /app prints identically.
   The only static artwork is the cover and sample pages rendered from the
   Drive (components/shop/samples.ts), used when a row has no uploaded
   thumbnail; a row that names no episode gets none of it.

   THE WORDS ARE EDITABLE. Every heading, lead and closing line comes through
   useBlock with components/shop/copy.ts as the default, so an empty
   content_blocks table renders this page exactly as written.
   ========================================================================== */

/* Each line is checkable against the code, which is the only reason it is on
   the page. `where` names the file that makes it true. Unchanged since
   2026-10-06; now behind the footnote's disclosure rather than a band. */
const REFUSALS: { body: string; where: string; title: string }[] = [
  {
    title: "No account",
    body: "There is nothing to sign up to and no password to forget. Nothing on this site has a login except the admin panel the team writes from.",
    where: "no auth on the public site",
  },
  {
    title: "No email gate",
    body: "Stripe asks for an address so it can send you its own receipt. We never ask for one, and your file does not wait behind it. We do keep the address Stripe collected, because your link lasts a day and it is the only way to find your order if you lose it.",
    where: "api/stripe-webhook.ts stores it on the order",
  },
  {
    title: "No mailing list",
    body: "Buying something here never adds you to one. There is no list to be added to, so there is nothing to unsubscribe from later.",
    where: "nothing in api/ reads that address",
  },
  {
    title: "One payment",
    body: "Each file is bought once and kept. Nothing renews, nothing is a trial, and there is no subscription to remember to cancel.",
    where: "Stripe mode: payment",
  },
  {
    title: "One thing to watch",
    body: "Your download link works for 24 hours and up to five downloads. That is the only thing we ask you to pay attention to: save the file when it arrives.",
    where: "api/download.ts",
  },
];

const APP_DEFAULT: AppSetting = { launched: APP_LAUNCHED, target_window: null, app_store_url: null, play_store_url: null };

/** The show's title in running text is set as a citation, never as an
 *  emphasis. The editable sentence stays one plain string; this finds the
 *  title in it and wraps that part. */
function withCite(text: string): ReactNode {
  const title = `${SITE.showName}®`;
  const i = text.indexOf(title);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <cite className="italic">{title}</cite>
      {text.slice(i + title.length)}
    </>
  );
}

/** "{n} packs · {price} each · zip of PDFs", every figure from the rows. When
 *  the rows carry different prices the segment reads "from" the lowest. */
function statusLine(rows: Product[]): string {
  const n = rows.length;
  const prices = rows.map((p) => p.price_cents);
  const min = Math.min(...prices);
  const same = prices.every((c) => c === min);
  const currency = rows[0].currency;
  const price = same ? `${formatPrice(min, currency)} each` : `from ${formatPrice(min, currency)}`;
  const formats = new Set(rows.map((p) => fileFormat(p.file_path)));
  const format = formats.size === 1 ? formatLabel([...formats][0]) : null;
  return [`${n} ${n === 1 ? "pack" : "packs"}`, price, format].filter(Boolean).join(" · ");
}

export default function Shop() {
  const { launched } = useSetting("app", APP_DEFAULT);
  const products = useProducts();
  const [open, setOpen] = useState(false);
  const c = {
    label: useBlock("shop", "shelf.label", COPY["shelf.label"]),
    title: useBlock("shop", "shelf.title", COPY["shelf.title"]),
    creditLead: useBlock("shop", "credit.lead", COPY["credit.lead"]),
    termsLine: useBlock("shop", "terms.line", COPY["terms.line"]),
    termsToggle: useBlock("shop", "terms.toggle", COPY["terms.toggle"]),
    emptyLine: useBlock("shop", "empty.line", COPY["empty.line"]),
    failedLead: useBlock("shop", "failed.lead", COPY["failed.lead"]),
    failedLine: useBlock("shop", "failed.line", COPY["failed.line"]),
    closeLine: useBlock("shop", "close.line", COPY["close.line"]),
    closeShow: useBlock("shop", "close.show", COPY["close.show"]),
  };

  /* The status row says only what the catalogue has established: a count and
     a price once it has answered, "loading" before, and after a failure that
     it failed, nothing about what is on sale. */
  const status =
    products.state === "ready"
      ? statusLine(products.data)
      : products.state === "loading"
        ? "Loading the shelf"
        : products.state === "failed"
          ? "Could not load the shelf"
          : null;

  const shelved = true;

  return (
    <>
      <Seo
        title="Shop"
        description="Episode packs from The Pawsitive Pugs and Pals: an activity book, a colouring book and activities away from the screen for each episode, as PDFs to print at home or in a classroom. No account, no email gate, no mailing list."
        path="/shop"
      />

      {/* ═══ THE OPENING. Three short lines on paper: the label, the shelf's
          name, the catalogue's status. In view at load, so it does not
          animate; the shelf below it is the page's one entrance. ═══ */}
      <Section as="div" pad={["tight", "close"]}>
        <Container width="wide">
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-body sm:text-[14px]">{c.label}</p>
          <h1 id="shop-h" className="t-h1 mt-6 max-w-[18ch]">{c.title}</h1>
          {status && (
            <p className="tnum mt-3.5 font-mono text-[14px] leading-[1.6] text-body" role="status">
              {status}
            </p>
          )}
          {products.state === "empty" && <p className="t-lead mt-6 max-w-[40ch] text-ink">{c.emptyLine}</p>}
          {products.state === "failed" && (
            <>
              <p className="t-lead mt-6 max-w-[40ch] text-ink">{c.failedLead}</p>
              <p className="t-body mt-4 max-w-[46ch] text-body">{c.failedLine}</p>
            </>
          )}
        </Container>
      </Section>

      {/* ═══ THE SHELF. The page. One bench band, used once, so the covers
          (cream and tan) read as printed things on a surface. Six empty
          slots while the catalogue answers; nothing at all when it has
          nothing or failed. ═══ */}
      {shelved && (
        <Section className="bench" pad="normal" labelledBy="shop-h">
          <Container width="wide">
            {products.state === "ready" ? <Shelf products={products.data} /> : products.state === "loading" ? <ShelfComing pending /> : <ShelfComing />}
          </Container>
        </Section>
      )}

      {shelved && (
        <>
          {/* ═══ THE CREDIT LINE. Where a catalogue prints its illustrator:
              one descriptive sentence, the shared book facts, the credit. ═══ */}
          <Section as="div" pad={["normal", "tight"]}>
            <Container width="wide">
              <p className="t-lead max-w-[58ch] text-ink">
                {withCite(c.creditLead)} {BOOKS_STATEMENT} {BOOKS_CREDIT}
              </p>
            </Container>
          </Section>

          {/* ═══ THE FOOTNOTE STRIP. Every fact the old refusals ledger and
              the old docket carried, in the space of a footnote; the five
              rows themselves behind a disclosure, word for word. ═══ */}
          <Section as="div" pad={["tight", "normal"]}>
            <Container width="wide">
              <div className="border-y-[1.5px] border-rule py-7">
                <p className="t-body max-w-[72ch] text-ink">{c.termsLine}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setOpen((o) => !o)}
                  aria-expanded={open}
                  aria-controls="shop-refusals"
                  className="link-draw inline-flex min-h-[44px] items-center gap-2 text-left text-[15px] font-semibold text-red-deep"
                >
                  {c.termsToggle}
                  <span
                    aria-hidden="true"
                    className={`transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
                  >
                    <IconArrow size={15} />
                  </span>
                </button>
                <DisclosurePanel id="shop-refusals" open={open}>
                  <dl className="mt-5 max-w-[52rem] border-t-[1.5px] border-rule">
                    {REFUSALS.map((r) => (
                      <div
                        key={r.title}
                        className="grid grid-cols-1 gap-x-10 gap-y-2 border-b-[1.5px] border-rule py-6 sm:grid-cols-[11rem_minmax(0,1fr)]"
                      >
                        <dt className="text-[17px] font-semibold leading-snug text-ink">{r.title}</dt>
                        <dd>
                          <p className="t-body max-w-[54ch] text-body">{r.body}</p>
                          {/* The file that keeps the promise, as a credit: mono, in
                              its own case, because a file path uppercased is a file
                              path that does not exist. Left aligned on a phone, where
                              a right-aligned mono line orphans. */}
                          <p className="mt-3 max-w-[44ch] font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body sm:ml-auto sm:text-right">
                            {r.where}
                          </p>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </DisclosurePanel>
              </div>
            </Container>
          </Section>
        </>
      )}

      {/* ═══ THE CLOSING. One line, two links, then the footer. The two links
          the old opening carried as pills live here, because a buyer's first
          action on this page is a cover, not a link away. ═══ */}
      <Section as="div" pad={["tight", "open"]}>
        <Container width="wide">
          <div className="hairline pt-8">
            <p className="t-lead max-w-[56ch] text-ink">{c.closeLine}</p>
            <p className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
              <TextLink href={SITE.showUrl}>
                {c.closeShow}
                <IconExternal size={14} />
              </TextLink>
              <TextLink to="/app">
                {launched ? `${SITE.playerName}, available now` : SITE.playerName}
                <IconArrow size={15} />
              </TextLink>
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
