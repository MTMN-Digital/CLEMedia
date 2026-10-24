import { Link } from "react-router-dom";
import { Settle } from "@/components/Settle";
import { IconArrow } from "@/components/icons";

/* ============================================================================
   Get in touch, split by who is asking.

   WHY IT CHANGED. From the client's creative director's revision of the home
   page, 2026-10-13. The band this replaces was one heading, one paragraph and
   one button addressed to nobody in particular, on a site whose brief puts
   investors and partners at the top of the audience list and broadcasters
   second. Naming the three readers is worth more than a general invitation,
   because the one that matters most now arrives knowing exactly which of the
   three he is.

   NOTHING WAS CUT. The paragraph that used to carry this band is the lead
   above the three columns, word for word.

   THREE LINKS TO ONE PAGE, DELIBERATELY. All three go to /contact, which has
   one form and five named people behind it. Anchors into a page that has no
   sections to anchor to would be three links that all scroll to the top and
   look broken; the word in the column is the wayfinding, and the form asks
   who you are.

   ON PAPER. The deck puts it on tan and so does this. The site spends its one
   deep band on the close, which is now the sign-up directly above the footer.

   ── NOT THREE EQUAL COLUMNS ANY MORE, 2026-10-24 ──────────────────────────
   It was three columns of a third each, every one carrying a heading, a
   sentence and the words "Get in touch" under an arrow. Three matched cards
   with three identical calls to action is the single most recognisable shape
   in generated web design, and the home page was already solving four other
   sections as an evenly divided grid, so the whole page read as one layout
   applied five times.

   WHAT REPLACED IT IS A DECISION, which is the only thing that ever fixes a
   default. These three readers are not equal: the brief puts investors and
   distribution partners at the top of the audience list and press at the
   bottom. So broadcasters take the wide column at heading size and the other
   two stack beside them, and the page says who it most wants to hear from
   instead of pretending it does not mind.

   THE WHOLE ROW IS THE LINK, so the words "Get in touch" are not printed
   three times under three arrows. Same pattern as the routes on the 404 page,
   which this site already had and should have been reusing. ========== */

const ROUTES = [
  {
    who: "Broadcasters and platforms",
    line: "If you are interested in licensing, broadcasting or streaming the series.",
  },
  {
    who: "Schools and early-years settings",
    line: "If you would like to use our episodes and learning resources with your children.",
  },
  {
    who: "Press",
    line: "If you are writing about children's media, screen time or AI in production.",
  },
];

export function GetInTouch({ headingId }: { headingId: string }) {
  return (
    <>
      <Settle className="grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div>
          <h2 id={headingId} className="t-display max-w-[12ch]">
            Contact CLÉ Family Media.
          </h2>
        </div>
        <p className="t-lead lg:pb-1">
          We are open to conversations with studios, distribution partners, educators and press. If
          you are assessing the company, we would rather answer your questions directly.
        </p>
      </Settle>

      <Settle className="hairline mt-14 grid gap-x-16 gap-y-10 pt-10 lg:mt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* The one the brief puts first, at the size that says so. */}
        <Link to="/contact" className="group block">
          {/* The arrow is INLINE, after the last word. Laid out as a flex
              sibling it sat at the right edge of a 13ch block, which on a two
              line heading left it stranded in the middle of the band with
              nothing either side of it. */}
          <span className="t-h2 block max-w-[14ch] font-display">
            {ROUTES[0].who}
            <span className="ml-3 inline-block translate-y-[0.1em] text-muted transition-colors group-hover:text-red-deep">
              <IconArrow size={20} />
            </span>
          </span>
          <span className="t-lead mt-5 block max-w-[38ch] text-body">{ROUTES[0].line}</span>
        </Link>

        <ul className="grid content-start gap-7">
          {ROUTES.slice(1).map((r) => (
            <li key={r.who} className="hairline pt-7 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-7">
              <Link to="/contact" className="group block">
                <span className="flex items-start justify-between gap-5">
                  <span className="t-h3 max-w-[18ch]">{r.who}</span>
                  <span className="mt-1 shrink-0 text-muted transition-colors group-hover:text-red-deep">
                    <IconArrow size={16} />
                  </span>
                </span>
                <span className="t-body mt-3 block max-w-[34ch]">{r.line}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Settle>

    </>
  );
}
