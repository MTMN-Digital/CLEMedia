import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Button, Container, Kicker, Lead, Section, TextLink } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
import { Docket } from "@/components/shop/Docket";
import { Shelf } from "@/components/shop/Shelf";
import { EmptyShelf } from "@/components/shop/EmptyShelf";
import { NotAsked } from "@/components/shop/NotAsked";
import { SheetBench } from "@/components/shop/PrintedSheet";
import { useProducts } from "@/components/shop/catalogue";
import { APP_LAUNCHED, SITE } from "@/lib/site";

/* ============================================================================
   The shop, rebuilt 2026-10-06.

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

   THE OBJECT. The shop sells paper, so the page opens on paper: a drawn
   stack of sheets standing on a lit bench, stapled, punched and trimmed, with
   its parts named in the margin. See src/components/shop/PrintedSheet.tsx for
   why it is drawn and not photographed.

   NO PRODUCTS EXIST YET. Nothing here invents one: no title, no price, no
   count, no "from EUR 3". The shelf is visibly empty and says so, and the
   terms of a purchase are stated as a docket because those are true before
   the first file is uploaded. The moment a product is published in the admin
   panel it appears in the index, and the empty state disappears on its own.
   ========================================================================== */

/* Each line is checkable against the code, which is the only reason it is on
   the page. `where` names the file that makes it true. */
const REFUSALS: { title: string; body: string; where: string }[] = [
  {
    title: "No account",
    body: "There is nothing to sign up to and no password to forget. Nothing on this site has a login except the admin panel the team writes from.",
    where: "no auth on the public site",
  },
  {
    title: "No email gate",
    body: "Stripe asks for an address so it can send you its own receipt. We never ask for one, and your file does not wait behind it.",
    where: "api/create-checkout-session.ts",
  },
  {
    title: "No mailing list",
    body: "Buying something here never adds you to one. There is no box to untick, because there is no list to be added to.",
    where: "api/stripe-webhook.ts writes the order and nothing else",
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

  return (
    <>
      <Seo
        title="Shop"
        description="Printable colouring books, puzzle packs and activity sheets from The Pawsitive Pugs and Pals. Buy a file, download it, keep it. No account, no email gate, no mailing list."
        path="/shop"
      />

      {/* ═══ THE OBJECT. The page opens on the thing being sold, lit and
          standing on a bench, with the prose beside it rather than above a
          row of cards. The right half of the frame is the point: the old page
          left it empty on every breakpoint over 1100px. ═══ */}
      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Settle className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-16 xl:gap-24">
            <div>
              <Kicker>Shop</Kicker>
              <h1 className="t-display mt-6 max-w-[13ch]">Things you print and put on the table.</h1>
              <Lead className="mt-7 max-w-[46ch]">
                Colouring books, puzzle packs and activity sheets from{" "}
                <em>The Pawsitive Pugs &amp; Pals&reg;</em>, for the kitchen table and for the
                classroom. You buy a file, you download it, and it is yours to print as often as
                you like.
              </Lead>
              <p className="mt-6 max-w-[46ch] t-prose text-body">
                What you do not do is make an account, hand over an email address to get a free
                sample, or end up on a list.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <TextLink href={SITE.showUrl}>
                  Free activities on the show's site
                  <IconExternal size={14} />
                </TextLink>
                <TextLink to="/app">
                  Interactive activities live in {SITE.playerName}&trade;
                  <IconArrow size={15} />
                </TextLink>
              </div>
            </div>

            <SheetBench
              caption={
                <>
                  Drawn, not photographed. What arrives is a PDF: one sheet, or a stapled set of
                  them.
                </>
              }
            />
          </Settle>
        </Container>
      </Section>

      {/* ═══ THE REFUSALS. The page's argument, as a ledger. Hairline rows,
          one mono annotation each naming where the promise is kept, which is
          the Contact page's receipt idea applied to a shop. ═══ */}
      <Section labelledBy="refuse-h" className="well">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-20 xl:gap-28">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id="refuse-h" className="t-h1 max-w-[12ch]">What this shop does not ask you for</h2>
              <p className="t-lead mt-7 max-w-[38ch] text-ink">
                A printable for a four year old usually costs an email address. This one costs
                whatever the file costs.
              </p>
              <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.7] text-body">
                Every line here is a thing the code does or does not do, not a policy we wrote
                down afterwards.
              </p>

              {/* What the five rows opposite add up to, drawn. The rows keep
                  every word and every file path. */}
              <div className="mt-10">
                <NotAsked />
              </div>
            </div>

            <dl className="border-t border-rule">
              {REFUSALS.map((r) => (
                <div
                  key={r.title}
                  className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-rule py-7 sm:grid-cols-[11rem_minmax(0,1fr)]"
                >
                  <dt className="text-[17px] font-semibold leading-snug text-ink">{r.title}</dt>
                  <dd>
                    <p className="max-w-[50ch] text-[16px] leading-[1.68] text-body">{r.body}</p>
                    {/* Body, not muted: muted is AA-large only on the well
                        fill and this line is 12px. Left in its own case: a
                        file path uppercased is a file path that does not
                        exist. */}
                    <p className="mt-2 font-mono text-[12px] leading-[1.5] text-body">{r.where}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </Settle>
        </Container>
      </Section>

      {/* ═══ THE SHELF. Paper again after the well above it. Empty today, and
          drawn empty on purpose: three blank sheets on a board, one per kind
          of thing being prepared, with no artwork, title or price because none
          exists. Once a product is published the list takes its place. ═══ */}
      <Section labelledBy="shelf-h" pad={["normal", "open"]}>
        <Container width="wide">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2 id="shelf-h" className="t-h1">On the shelf</h2>
            {/* Four states. "Nothing on sale yet" is a claim about stock and
                is only made once the catalogue has actually answered. */}
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
              {products.state === "ready"
                ? `${products.data.length} ${products.data.length === 1 ? "file" : "files"}`
                : products.state === "loading"
                  ? "Loading the shelf"
                  : products.state === "failed"
                    ? "Could not load the shelf"
                    : "Nothing on sale yet"}
            </p>
          </div>

          {products.state === "ready" ? (
            <div className="mt-10">
              <Shelf products={products.data} />
            </div>
          ) : (
            <Settle className="mt-10">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
                <p className="t-lead max-w-[40ch] text-ink">
                  {products.state === "failed"
                    ? "We could not load the shelf just now. That is a fault at our end, not a statement about what is on sale."
                    : products.state === "loading"
                      ? "Loading what is on the shelf."
                      : "The first files are being made. Nothing is on sale yet, and nothing is being held back behind a sign-up in the meantime."}
                </p>
                <p className="max-w-[46ch] text-[16px] leading-[1.7] text-body lg:pt-2">
                  {products.state === "failed"
                    ? "Reload the page, and if it keeps happening tell us and we will look at it."
                    : "Each one will appear here with its artwork, what is in it and what it costs, on its own page. These are the kinds of thing being prepared."}
                </p>
              </div>
              {/* The drawn shelf illustrates an empty shop. It is not shown
                  over a failure, where it would illustrate a claim we have not
                  established. */}
              {products.state === "empty" && (
                <div className="mt-14">
                  <EmptyShelf kinds={KINDS} />
                </div>
              )}
            </Settle>
          )}
        </Container>
      </Section>

      {/* ═══ THE TERMS. A different room: the wall, and the narrow column.
          The docket is a receipt, so it is set the width of one. ═══ */}
      <Section labelledBy="terms-h" className="wall">
        <Container>
          <Settle className="mx-auto grid max-w-[62ch] gap-10 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-20">
            <div>
              <h2 id="terms-h" className="t-h2 max-w-[14ch]">What a purchase is</h2>
              <p className="t-lead mt-6 max-w-[38ch] text-ink">
                These terms are true before the first file is uploaded, so they are stated before
                you have anything to buy.
              </p>
            </div>
            <Docket
              label="What a purchase is"
              rows={[
                { k: "Choose a file", v: "its own page" },
                { k: "Pay by card", v: "Stripe" },
                { k: "Download", v: "straight away" },
                { k: "Link valid for", v: "24 hours", strong: true },
                { k: "Downloads allowed", v: "5", strong: true },
                { k: "Account created", v: "none" },
              ]}
              foot={
                <>
                  Save the file when it arrives. We do not keep a copy for you to come back to,
                  because coming back would mean an account.
                </>
              }
            />
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

            <ul className="border-t border-white/20">
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
                  <li key={n.title} className="border-b border-white/20">
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
