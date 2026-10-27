import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { PageHero } from "@/components/PageHero";
import { Button, Container, Section } from "@/components/ui";
import { IconExternal, IconArrow } from "@/components/icons";
import { Docket } from "@/components/shop/Docket";
import { Shelf } from "@/components/shop/Shelf";
import { NotAsked } from "@/components/shop/NotAsked";
import { useProducts } from "@/components/shop/catalogue";
import { SITE, APP_LAUNCHED } from "@/lib/site";

/* ============================================================================
   The shop, rebuilt 2026-10-06, carried to the hero's language 2026-10-27.

   WHAT WAS WRONG. Eyebrow, two-line heading, one lead, three identical
   rounded cards with icon chips explaining that you pick a thing, pay for it
   and download it, a note box, footer. 1661 pixels of page, the right half of
   the frame empty, and not one sentence a reader would carry away. Every
   fact on it was true and none of it was worth a section.

   WHAT THIS PAGE ARGUES INSTEAD. The interesting thing about this shop is
   what it refuses to do. No account, no email gate, no signup, no mailing
   list, no subscription: Stripe takes a card and sends its own receipt, and
   the file is yours. That is a real position in a market where a children's
   printable usually costs an email address, and it is worth more than three
   cards describing a checkout.

   So the refusals are the page's second section, set as a ledger of hairline
   rows, and each one is true of the code in api/ rather than a nice thing to
   say. If the checkout ever starts collecting something, that ledger is the
   thing to change first.

   THE OPENING, 2026-10-27. The page used to open on a drawn stack of sheets
   standing on a lit bench, with the title beside it. The client's verdict
   on the site was that the home hero is by far the best thing on it, so
   every page now opens in that hero's frame: here the plain ink panel, with
   the title in the bottom corner and the two links that were under the lead
   as its actions. The drawing left the opening with it. The one drawn object
   the page keeps is the struck checkout (NotAsked), because it draws the
   argument rather than illustrating a sentence.

   HEADINGS ARE CLAIMS. "What this shop does not ask you for" was a negation
   over a grey lead, and "On the shelf" and "What a purchase is" were filing
   labels over one. Each section now opens on the sentence worth stopping
   for, taken from the copy that was already under it, and the rest of that
   copy moved to where it is actually talking: the line about the code sits
   over the ledger it describes, the line about the terms sits over the
   docket it introduces.

   NO PRODUCTS EXIST YET. Nothing here invents one: no title, no price, no
   count, no "from EUR 3". The shelf says so, lists the kinds of thing being
   prepared as a ruled set, and the terms of a purchase are stated as a
   docket because those are true before the first file is uploaded. The
   moment a product is published in the admin panel it appears in the index,
   and the empty state disappears on its own.
   ========================================================================== */

/* Each line is checkable against the code, which is the only reason it is on
   the page. `where` names the file that makes it true. */
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

/* The kinds of thing being made, in the client's own words. Deliberately not
   titles, prices or dates: those arrive with the first real product. */
const KINDS: { kind: string; line: string }[] = [
  { kind: "Colouring books", line: "Pages from the series to print, colour and put on the fridge." },
  { kind: "Puzzle packs", line: "Puzzles and quizzes built around what happens in an episode." },
  { kind: "Activity sheets", line: "Single sheets for one sitting, at home or in a classroom." },
];

export default function Shop() {
  const products = useProducts();

  /* Four states, and the heading carries the one the catalogue is in. A
     claim about stock ("the first files are being made") is only made once
     the catalogue has actually answered; before that the heading says it is
     loading, and after a failure it says that and nothing about what is on
     sale. */
  const shelf =
    products.state === "ready"
      ? {
          head: "Each file is on its own page.",
          status: `${products.data.length} ${products.data.length === 1 ? "file" : "files"}`,
        }
      : products.state === "loading"
        ? { head: "Loading what is on the shelf.", status: "Loading the shelf" }
        : products.state === "failed"
          ? { head: "We could not load the shelf just now.", status: "Could not load the shelf" }
          : { head: "The first files are being made.", status: "Nothing on sale yet" };

  return (
    <>
      <Seo
        title="Shop"
        description="Printable colouring books, puzzle packs and activity sheets from The Pawsitive Pugs and Pals. Buy a file, download it, keep it. No account, no email gate, no mailing list."
        path="/shop"
      />

      {/* ═══ THE OPENING. The hero's frame, on the plain ink panel: there is
          no photograph of a product that does not exist, and the drawing
          that used to stand here was a drawing. The title and the two links
          are the ones the old opening carried; the rest of its lead moved
          down to the shelf, where it is talking about the shelf. ═══ */}
      <PageHero
        id="shop-h"
        size="tall"
        tone="ink"
        eyebrow={
          <>
            Shop<span>Printable PDFs</span>
          </>
        }
        aside={<>Buy a file, download it, print it as often as you like.</>}
        title={
          <>
            Things you print and put <em>on the table.</em>
          </>
        }
        actions={
          <>
            <Button to="/app">
              Interactive activities in {SITE.playerName}&trade;
              <IconArrow size={16} />
            </Button>
            <Button href={SITE.showUrl} variant="quiet">
              Free activities on the show's site
              <IconExternal size={16} />
            </Button>
          </>
        }
      />

      {/* ═══ THE REFUSALS. The page's argument, as a ledger. The heading is
          what the checkout IS, not what it is not; the five rows keep every
          word and every file path, with the path set as a small mono line at
          the end of its row, the way the site writes a credit. ═══ */}
      <Section labelledBy="refuse-h" className="well">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-20 xl:gap-28">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id="refuse-h" className="t-h1 max-w-[12ch]">A card payment, and nothing else.</h2>
              <p className="t-lead mt-7 max-w-[38ch] text-ink">
                A printable for a four year old usually costs an email address. This one costs
                whatever the file costs.
              </p>
              <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.7] text-body">
                What you do not do is make an account, hand over an email address to get a free
                sample, or end up on a list.
              </p>

              {/* What the five rows opposite add up to, drawn. The page's one
                  drawn object. */}
              <div className="mt-10">
                <NotAsked />
              </div>
            </div>

            <div>
              <p className="mb-5 max-w-[46ch] t-sm leading-[1.6] text-body">
                Every line here is a thing the code does or does not do, not a policy we wrote
                down afterwards.
              </p>
              <dl className="border-t-[1.5px] border-rule">
                {REFUSALS.map((r) => (
                  <div
                    key={r.title}
                    className="grid grid-cols-1 gap-x-10 gap-y-2 border-b-[1.5px] border-rule py-7 sm:grid-cols-[11rem_minmax(0,1fr)]"
                  >
                    <dt className="text-[17px] font-semibold leading-snug text-ink">{r.title}</dt>
                    <dd>
                      <p className="max-w-[50ch] text-[16px] leading-[1.68] text-body">{r.body}</p>
                      {/* The file that keeps the promise, as a credit: small,
                          mono, right aligned, in its own case, because a file
                          path uppercased is a file path that does not exist.
                          Body, not muted: muted is AA-large only on the well
                          fill. */}
                      <p className="ml-auto mt-3 max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body">
                        {r.where}
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ THE SHELF. Paper again after the well above it. The heading is
          the state of the shelf in a sentence, the stock line sits under it
          as a small mono status, and what the shop sells runs in the right
          track beside it. Empty today, so the three kinds of thing being
          prepared stand as a ruled set, with no artwork, title or price
          because none exists. Once a product is published the lit shelf
          takes the set's place, with the database's own prices. ═══ */}
      <Section labelledBy="shelf-h" pad={["normal", "open"]}>
        <Container width="wide">
          <Settle className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <h2 id="shelf-h" className="t-h2 max-w-[14ch]">{shelf.head}</h2>
              <p className="mt-5 font-mono text-[14px] uppercase tracking-[0.12em] text-body">
                {shelf.status}
              </p>
            </div>
            <div className="lg:pt-2">
              {products.state === "failed" ? (
                <>
                  <p className="t-lead max-w-[40ch] text-ink">
                    That is a fault at our end, not a statement about what is on sale.
                  </p>
                  <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.7] text-body">
                    Reload the page, and if it keeps happening tell us and we will look at it.
                  </p>
                </>
              ) : (
                <>
                  <p className="t-lead max-w-[40ch] text-ink">
                    Colouring books, puzzle packs and activity sheets from{" "}
                    <em>The Pawsitive Pugs &amp; Pals&reg;</em>, for the kitchen table and for the
                    classroom.
                  </p>
                  {products.state === "empty" && (
                    <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.7] text-body">
                      Nothing is on sale yet, and nothing is being held back behind a sign-up in
                      the meantime. Each one will appear here with its artwork, what is in it and
                      what it costs, on its own page. These are the kinds of thing being prepared.
                    </p>
                  )}
                </>
              )}
            </div>
          </Settle>

          {products.state === "ready" ? (
            <div className="mt-12">
              <Shelf products={products.data} />
            </div>
          ) : (
            /* The ruled set describes an empty shop. It is not shown over a
               failure, where it would illustrate a claim we have not
               established, nor while the catalogue is still answering. */
            products.state === "empty" && (
              <Settle className="mt-14">
                <dl className="border-t-[1.5px] border-rule">
                  {KINDS.map((k) => (
                    <div
                      key={k.kind}
                      className="grid gap-x-10 gap-y-2 border-b-[1.5px] border-rule py-7 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] sm:py-8"
                    >
                      <dt className="t-h3 font-display text-ink">{k.kind}</dt>
                      <dd className="t-body max-w-[44ch] text-body">{k.line}</dd>
                    </div>
                  ))}
                </dl>
              </Settle>
            )
          )}
        </Container>
      </Section>

      {/* ═══ THE TERMS. A different room, and from 2026-10-13 a dark one.
          The docket is a receipt, so it is set the width of one.

          WHY THE BENCH. This band was the page's weakest: 633 pixels carrying
          a four word heading, two lines and a narrow card, on a ground barely
          distinguishable from the two paper bands above it. It is also the
          only page of the five long ones that never used the site's strongest
          surface. A cream receipt under a lamp is what a docket already
          pretends to be, so the room caught up with the object.

          The heading is the docket's own figure. The line that used to be a
          lead under a filing label now sits over the docket, where it is
          talking. ═══ */}
      <Section labelledBy="terms-h" className="bench">
        <Container>
          <Settle className="mx-auto grid max-w-[62ch] gap-10 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-20">
            <h2 id="terms-h" className="t-h2 max-w-[16ch]">
              The link works for 24 hours and five downloads.
            </h2>
            <div>
              {/* `.bench` sets cream on everything it contains, so this line
                  takes it rather than naming a colour of its own. */}
              <p className="mb-5 max-w-[44ch] t-sm leading-[1.6]">
                What arrives is a PDF: one sheet, or a stapled set of them. These terms are true
                before the first file is uploaded, so they are stated before you have anything to
                buy.
              </p>
              <Docket
                label="What a purchase is"
                rows={[
                  { k: "Choose a file", v: "its own page" },
                  { k: "Pay by card", v: "Stripe" },
                  { k: "Download", v: "straight away" },
                  { k: "Link valid for", v: "24 hours", strong: true },
                  { k: "Downloads allowed", v: "5", strong: true },
                  { k: "Account created", v: "none" },
                  /* The one box there is. Named here so the product page's
                     acknowledgement is not the first a buyer hears of it. */
                  { k: "Right to cancel", v: "ends on download", strong: true },
                ]}
                foot={
                  <>
                    Save the file when it arrives. We do not keep a copy for you to come back to,
                    because coming back would mean an account.
                  </>
                }
              />
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ THE HANDOFF. One deep band, rows not cards. The shop is the
          smallest part of what the company gives families, so the page ends
          by pointing at the parts that are free. ═══ */}
      <Section deep labelledBy="free-h">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div>
              <h2 id="free-h" className="t-h2 max-w-[14ch]">Most of it costs nothing</h2>
              <p className="t-lead mt-6 max-w-[40ch]">
                The episodes are free to watch and the show's own site carries family activities.
                The shop is for the things worth printing.
              </p>
              <div className="mt-9">
                <Button href={SITE.showUrl}>
                  Visit the show site
                  <IconExternal size={16} />
                </Button>
              </div>
            </div>

            <ul className="border-t-[1.5px] border-edge-dark">
              {[
                {
                  title: "Episodes and family activities",
                  line: "The series lives on its own site, with the free colouring and activity resources beside it.",
                  href: SITE.showUrl,
                },
                {
                  title: APP_LAUNCHED ? `${SITE.playerName}, available now` : `${SITE.playerName} is in development`,
                  line: "Watch, play and learn in one place, with the interactive activities that do not print.",
                  to: "/app",
                },
                {
                  title: "Something wrong with a download",
                  line: "Send us the receipt Stripe emailed you and we will put it right.",
                  to: "/contact",
                },
              ].map((n) => {
                const inner = (
                  <>
                    <span className="min-w-0">
                      <span className="block text-[17px] font-semibold">{n.title}</span>
                      <span className="t-body mt-1.5 block max-w-[46ch]">{n.line}</span>
                    </span>
                    <span className="mt-1 shrink-0">
                      {n.href ? <IconExternal size={16} /> : <IconArrow size={16} />}
                    </span>
                  </>
                );
                const cls = "group flex items-start justify-between gap-6 py-6 sm:py-7";
                return (
                  <li key={n.title} className="border-b-[1.5px] border-edge-dark">
                    {n.to ? (
                      <Link to={n.to} className={cls}>{inner}</Link>
                    ) : (
                      <a href={n.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </Settle>
        </Container>
      </Section>
    </>
  );
}
