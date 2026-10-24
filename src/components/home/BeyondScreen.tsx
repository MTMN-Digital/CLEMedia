import { Settle } from "@/components/Settle";
import { TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";

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

export function BeyondScreen({ headingId }: { headingId: string }) {
  return (
    <>
      <Settle className="grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div>
          <h2 id={headingId} className="t-display max-w-[11ch]">
            An online and offline balance.
          </h2>
        </div>
        <p className="t-lead lg:pb-1">
          The real value is not in watching. It is in the play, talk and learning that happen
          afterwards, and every episode comes with materials to support it.
        </p>
      </Settle>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20 lg:gap-8">
        <Settle className="card-stock p-8 pt-9 sm:p-10 sm:pt-11">
          <span className="card-tab" aria-hidden="true">AT HOME</span>
          <h3 className="t-h3">For parents and children</h3>
          <p className="t-body mt-4 max-w-[42ch]">
            Digital learning games and downloadable play packs that turn each episode into an
            activity to do together.
          </p>
          <p className="mt-7">
            <TextLink to="/app">
              Inside PupsPlayer<IconArrow size={15} />
            </TextLink>
          </p>
        </Settle>

        <Settle className="card-stock p-8 pt-9 sm:p-10 sm:pt-11">
          <span className="card-tab" aria-hidden="true">IN THE CLASSROOM</span>
          <h3 className="t-h3">For educators and children</h3>
          <p className="t-body mt-4 max-w-[42ch]">
            Lesson-ready games and printable activities designed by educators, linked to{" "}
            <span className="text-muted" aria-label="framework not yet confirmed">
              [Aistear / EYFS]
            </span>{" "}
            early-learning goals.
          </p>
          <p className="mt-7">
            <TextLink to="/shop">
              Printable material<IconArrow size={15} />
            </TextLink>
          </p>
        </Settle>
      </div>
    </>
  );
}
