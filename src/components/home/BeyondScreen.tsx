import { Settle } from "@/components/Settle";
import { TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { DrawnRule, DrawnBox } from "@/components/draw/kit";
import { useList, useBlock } from "@/lib/content";
import { COPY } from "@/components/home/copy";
import { BEYOND_CARDS, BEYOND_LINKS } from "@/components/home/lists";

/* ============================================================================
   Beyond the screen: the half of "Watch, Play, Learn" the home page never
   said out loud.

   WHY IT EXISTS. From the client's creative director's revision of the home
   page, 2026-10-13. The company's whole model is that the episode is the
   beginning of the thing rather than the whole of it, the pull quote at the
   top of this page says exactly that, and then the page went on to describe
   the episodes and nothing else. This is the Play and the Learn.

   TWO CARDS, AND THEY ARE EARNED. This site does not put a row of identical
   tiles under a heading, and almost nothing else on it is a card. These two
   are, because they are genuinely two destinations for two different readers
   and they carry a link each: a parent and a teacher want different things
   and the page should not make either of them read the other's paragraph.

   EACH CARD LINKS SOMEWHERE REAL. The deck has one link, "explore the
   learning resources", pointing at a page this site does not have. The home
   card goes to PupsPlayer and the classroom card to the shop, which is the
   page that exists for printable material and says so in its own words. The
   shop has no products in it yet; that is listed in CONTENT-NEEDED.md and is
   not fixed by hiding the route.

   `[Aistear / EYFS]` IS THE DECK'S OWN BRACKET and it stays one. Which
   early-learning framework the classroom material is actually written against
   is a question for Conor, not something to pick by guessing which side of
   the Irish Sea a school is on.
   ========================================================================== */

/* A bracketed word in a card is the client's own open question (which
   early-learning framework), shown dotted so nobody mistakes it for fact. */
function withBrackets(text: string) {
  return text.split(/(\[[^\]]+\])/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="underline decoration-dotted underline-offset-4" aria-label="framework not yet confirmed">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function BeyondScreen({ headingId }: { headingId: string }) {
  const heading = useBlock("home", "beyond.heading", COPY["beyond.heading"]);
  const lead = useBlock("home", "beyond.lead", COPY["beyond.lead"]);
  const cards = useList("home", "beyond.cards", BEYOND_CARDS);
  return (
    <>
      {/* THE SENTENCE RUNS THE FULL MEASURE, 2026-10-27. It was a grey 21px
          paragraph capped at 56ch, which is the same object six other sections
          on this page were opening with. Nothing is cut: it is set at the
          display face, in ink, across the whole container, so it reads as a
          second line of the heading rather than as a block of explanation
          parked under it. The drawn rule between them is the kit's, so the
          separation is a mark rather than a margin. */}
      <Settle>
        <h2 id={headingId} className="t-display max-w-[11ch]">
          {heading}
        </h2>
        <DrawnRule v={2} className="mt-8 max-w-[18rem]" />
        <p className="mt-7 font-display text-[clamp(1.25rem,0.95rem+1.1vw,1.875rem)] leading-[1.26] tracking-[-0.005em]">
          {lead}
        </p>
      </Settle>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20 lg:gap-8">
        {/* DRAWN, NOT CARD STOCK, since 2026-10-27. The edge is a path in the
            same hand as every other mark on the site rather than a radius and
            a shadow. See components/draw/kit.tsx. */}
        {cards.map((c, i) => (
          <Settle key={i} className="relative p-8 pt-9 sm:p-10 sm:pt-11">
            <DrawnBox v={i % 2} />
            <span className="card-tab" aria-hidden="true">{c.tab}</span>
            <h3 className="t-h3">{c.title}</h3>
            <p className="t-body mt-4 max-w-[42ch]">{withBrackets(c.body)}</p>
            <p className="mt-7">
              <TextLink to={BEYOND_LINKS[i % BEYOND_LINKS.length]}>
                {c.link}<IconArrow size={15} />
              </TextLink>
            </p>
          </Settle>
        ))}
      </div>
    </>
  );
}
