import { NotifyForm } from "@/components/NotifyForm";
import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { StageBoard, type BoardSlip } from "@/components/app/StageBoard";
import { ReviewerRoom } from "@/components/app/ReviewerRoom";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import {
  type Stage,
  STAGES,
  PupsPlayerWalkthrough,
} from "@/components/app/PupsPlayerWalkthrough";
import { EPISODES, RELEASED } from "@/lib/episodes";
import { Button, Section, TextLink, Container } from "@/components/ui";
import { IconExternal, IconBell, IconArrow } from "@/components/icons";
import type { AssetKey } from "@/lib/brand";
import type { AppSetting } from "@/lib/types";
import { APP_LAUNCHED } from "@/lib/site";
import { useBlock, emphasis, useImageBlock, useSetting } from "@/lib/content";

/* ============================================================================
   PupsPlayer, before it exists.

   The job of this page is to make an unreleased product feel real and
   considered to somebody deciding whether to back it or carry it, without a
   screenshot, because there is none. The earlier page tried to do that with
   six icon cards and three grey placeholder frames where the product should
   have been, which is a worse argument than no picture at all.

   So the product is drawn. `PupsPlayerWalkthrough` is the app's interface in
   HTML and CSS inside a tablet frame, carrying the four real episode plates and
   their real runtimes, and a reader can step it through Watch, Play and Learn.

   SHAPE, carried to the home hero's language on 2026-10-27. The page opens
   the way the home page opens: the hen and the two pugs in the hero frame,
   which is what the player holds, with the copy in the corners and the
   headline at hero scale. That frame was two screens down until today, after
   the walkthrough, which put the biggest real thing on the page behind a
   drawing of a thing that does not exist yet. The lead that stood under the
   old headline became a ruled set of its own three facts beside the ledger
   of what already exists; the device stands alone on a wall band; the five
   stage board, the one display claim about the walls of the thing, and the
   reviewers follow; the page closes on the one deep band. The line drawing
   that illustrated the display claim (a child in a room, a queue, a price tag,
   a hoarding) is gone: the client reads that sketch register as weak, and
   the facts it drew now stand beside the sentence as a list.

   Nothing is claimed that the page did not already claim. No launch date, no
   store links, no price, no device requirements, no numbers. Where a fact is
   missing the page says so rather than filling the gap.
   ========================================================================== */

/* The words Conor can change from the admin panel, keyed as the registry in
   src/lib/blocks.ts names them. Each entry is the page's own wording today;
   the page renders it unless a saved block replaces it, so an empty table
   shows exactly this. The clause between stars is the one the headline sets
   in the accent colour. */
export const COPY: Record<string, string> = {
  "hero.aside": "Ad-free. No purchases inside a game.",
  "hero.title": "Watch, play and learn *in one place*",
  "walk.heading": "Nothing plays until someone picks it.",
  "stages.heading": "Each episode has activities built from what just happened in it.",
  "check.heading": "Checked by the people who check the episodes",
  "next.heading": "Where it stands",
};

/** The launch flag and the store links. APP_LAUNCHED in src/lib/site.ts is
 *  the value the page is built with and renders first; the `app` settings
 *  row, which the admin panel writes, takes over once it arrives. Store links
 *  stay null until the client supplies them there, and a null link renders
 *  nothing: no badge placeholders. The target window is held in the same row
 *  but is NOT rendered here, on purpose: see the Status row below. */
const APP_DEFAULT: AppSetting = { launched: APP_LAUNCHED, target_window: null, app_store_url: null, play_store_url: null };

function storeLinks(app: AppSetting): { href: string | null; label: string }[] {
  return [
    { label: "App Store", href: app.app_store_url || null },
    { label: "Google Play", href: app.play_store_url || null },
  ];
}

/* The six live in lib/episodes.ts. This page uses both slices of them:
   `RELEASED` for the ledger below, which is headed "Released so far" and
   must stay exactly that, and the whole list for the walkthrough, which is
   the app's own episode picker and shows what series one will hold. */

/* The six commitments, carried over from the previous page word for word in
   substance. They were the page's own claims about the plan and they stay its
   only claims: nothing has been added. Grouped by where each one lands, on
   the screen or off it, because that split is the model. */
/* STAGE_ROWS regroup the six commitments by the stage of Watch, Play, Learn
   each one belongs to. Nothing is reworded except one sentence, which has moved
   out of "Built for small hands" and into the pull statement under the Watch
   row (it still appears once, word for word). The stage lines come from the
   walkthrough, so the page and the device always say the same thing. */
const ITEMS: Record<string, { title: string; body: string }> = {
  adFree: {
    title: "Every episode, ad free",
    body: "The full run of The Pawsitive Pugs & Pals in one place, with nothing competing for a child's attention around it. No autoplay into something nobody chose.",
  },
  follows: {
    title: "Play that follows the story",
    body: "Each episode has activities built from what just happened in it, so the play reinforces the idea rather than sitting beside it as a separate game.",
  },
  /* ADDED 2026-10-24 from the client's review document, which lists what the
     planned first release actually holds. Until then this page described Play
     as a movement or breathing prompt and nothing else, which the document
     says does not reflect the full offer. */
  games: {
    title: "Games, songs and a drawing canvas",
    body: "Songs, puzzles, tasks, matching, recall and jigsaw games, colouring sheets and a blank canvas to draw on. The interactive games are being built for families at home and for classroom boards.",
  },
  mindful: {
    title: "A mindfulness guide, and the offline activities",
    body: "Paula's offline activities and a mindfulness guide, so the time after an episode has somewhere to go that is not another screen.",
  },
  hands: {
    title: "Built for small hands",
    body: "Large targets, simple navigation and no dark patterns.",
  },
  printables: {
    title: "Printables for the table",
    body: "Colouring, puzzles and activity sheets to print and take away from the screen, because not all of this should happen on one.",
  },
  control: {
    title: "Parents stay in control",
    body: "Clear settings, no advertising to children anywhere in it, no purchases inside a game, and nothing recommending the next thing to watch.",
  },
  grounded: {
    title: "Grounded in the learning",
    body: "Every activity maps back to the early years objective behind its episode, reviewed by the same people who review the episodes.",
  },
};
const STAGE_ITEMS: Record<Stage, string[]> = {
  watch: ["adFree", "hands", "control"],
  play: ["follows", "games"],
  learn: ["printables", "mindful", "grounded"],
};
const SLIPS: BoardSlip[] = STAGES.map((s, i) => ({
  n: String(i + 1),
  title: s.title,
  line: s.line,
  items: STAGE_ITEMS[s.id].map((k) => ITEMS[k]),
}));

/* The walls of the thing, as a list. These four rows are the facts the cut
   drawing (components/app/NoWayOut.tsx, removed 2026-10-27) put in ink: a
   queue of episodes that would autoplay, a price tag, an advertising
   hoarding, and the grown-ups gate the walkthrough's top bar carries. Each
   row is the page's own claim in its own words, from the commitments above
   and the Watch line, and nothing is added to them. */
const WALLS: { label: string; line: string }[] = [
  { label: "Autoplay", line: "Nothing autoplays after an episode. The next one is chosen, by the child or the adult beside them." },
  { label: "Purchases", line: "No purchases inside a game." },
  { label: "Advertising", line: "No advertising to children anywhere in it, and nothing recommending the next thing to watch." },
  { label: "Grown-ups", line: "Clear settings for parents, behind the Grown-ups button in the player." },
];

/* The people who check what goes into the app, as the client supplied them.
   The same three review stages the episodes pass: educational review, and
   parent and early years review. */
const REVIEWERS: { name: string; role: string; line: string; asset: AssetKey }[] = [
  /* Titles corrected 2026-10-24 from the client's review document. Kirstie's
     is the plain "Adviser" the document itself uses, because it describes her
     contribution and then asks for the displayed title to be agreed. */
  { name: "Paula Walshe PhD", role: "Chief Education Advisor", asset: "person.paula", line: "Brings the educational expertise, and gives feedback on every draft script and on the activities that follow an episode." },
  { name: "Lydia Sexton", role: "Company Secretary", asset: "person.lydia", line: "Reads every draft from a parent's point of view, and from a child's." },
  { name: "Kirstie Harding", role: "Adviser", asset: "person.kirstie", line: "Thirty years in childcare and early education. Checks that what is made is age-appropriate." },
];


export default function AppPage() {
  const app = useSetting("app", APP_DEFAULT);
  const launched = app.launched;
  const liveLinks = storeLinks(app).filter((l): l is { href: string; label: string } => Boolean(l.href));

  const heroAside = useBlock("app", "hero.aside", COPY["hero.aside"]);
  const heroTitle = useBlock("app", "hero.title", COPY["hero.title"]);
  const heroImage = useImageBlock("app", "hero.image");
  const walkHeading = useBlock("app", "walk.heading", COPY["walk.heading"]);
  const stagesHeading = useBlock("app", "stages.heading", COPY["stages.heading"]);
  const checkHeading = useBlock("app", "check.heading", COPY["check.heading"]);
  const nextHeading = useBlock("app", "next.heading", COPY["next.heading"]);

  return (
    <>
      <Seo
        title={launched ? "PupsPlayer app" : "PupsPlayer app, in development"}
        description="PupsPlayer™ from CLÉ Family Media holds the Watch, Play, Learn model in one place: ad-free episodes of The Pawsitive Pugs & Pals, the songs, puzzles and games built from each one, and the printable and offline activities underneath. In development."
        path="/app"
      />

      {/* ═══ 1. THE OPENING, in the hero's frame. The hen and the two pugs,
          which is what the player holds, with the product's name and state
          top left, the two promises a parent asks about first top right, and
          the headline bottom left. The credit is the same wording the frame
          carried when it hung mid-page. Before launch the two actions are
          the notify form down the page and the four episodes that already
          exist, both on this page; after launch, the store links. Plain
          anchors for the two on-page ones, not Button: Button's href opens a
          new tab, and these only go down the page. ═══ */}
      <PageHero
        id="app-h"
        asset="home.characters"
        override={heroImage}
        position="center 45%"
        credit={
          <>
            Finn, Fia and the hen. A frame from The Pawsitive Pugs &amp; Pals&reg;, which is what
            the player holds.
          </>
        }
        eyebrow={<>PupsPlayer&trade;<span>{launched ? "Available now" : "In development"}</span></>}
        aside={<>{heroAside}</>}
        title={emphasis(heroTitle)}
        actions={
          launched && liveLinks.length > 0 ? (
            <>
              {liveLinks.map((l) => (
                <Button key={l.label} href={l.href}>{l.label}<IconExternal size={15} /></Button>
              ))}
            </>
          ) : (
            <>
              <a href="#notify" className="btn btn-primary">
                Hear when it lands<IconArrow size={16} />
              </a>
              <a href="#released" className="btn btn-quiet">The four released episodes</a>
            </>
          )
        }
        size="tall"
      />

      {/* ═══ 2. WHAT IT IS, beside what already exists. The old lead, set as
          the three facts it was: the model, the two things it never does,
          and where the plan stands. Each on its own rule, so they read as
          three commitments rather than a paragraph of grey. The ledger of
          released episodes takes the margin, so the first screen under the
          hero carries the four things that are real today. No heading: the
          hero's is the heading, and this band is its first paragraph. Open
          at the top: the hero has just ended on ink, and the first rule
          needs a breath of paper before it. ═══ */}
      <Section as="div" pad={["open", "tight"]}>
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-16">
            <ul className="max-w-[58ch]">
              <li className="t-lead border-t-[1.5px] border-rule py-6 text-ink">
                The whole Watch, Play, Learn model in one place: ad-free episodes of{" "}
                <em>The Pawsitive Pugs &amp; Pals</em>&reg;, the songs, puzzles and games built from
                each one, and the printable and offline activities underneath.
              </li>
              <li className="t-lead border-t-[1.5px] border-rule py-6 text-ink">
                No purchases inside a game and nothing recommending the next thing to watch.
              </li>
              {!launched && (
                /* The status line, kept word for word. It is the one row set
                   in the body colour: a note on the plan, not a promise. */
                <li className="t-body border-y-[1.5px] border-rule py-6 text-body">
                  In development and not yet available. Everything on this page is the first
                  release as it is planned, not as it has been tested, and we will say which is
                  which once testing is done.
                </li>
              )}
              {launched && <li className="border-t-[1.5px] border-rule" aria-hidden="true" />}
            </ul>

            {/* The ledger of what exists. It used to sit halfway down the page
                under the heading of a section about things that do not exist
                yet, which is exactly the wrong place for the only hard facts
                on the page. The hero's quiet button lands here. */}
            <div id="released" className="card scroll-mt-24 rounded-[var(--radius-lg)] px-5 py-1 sm:px-6">
              <p className="eyebrow eyebrow-sm  pt-5">Released so far</p>
              <ul className="mt-2">
                {RELEASED.map((ep) => (
                  <li key={ep.n} className="hairline">
                    <a
                      href={ep.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline gap-3.5 py-3.5"
                    >
                      <span className="tnum font-mono text-[14.5px] tracking-[0.14em] text-red-deep">{ep.n}</span>
                      <span className="t-sm font-semibold text-ink group-hover:text-red-deep">{ep.title}</span>
                      <span className="tnum ml-auto shrink-0 font-mono text-[14.5px] text-muted">{ep.runtime}</span>
                      <span className="shrink-0 text-muted" aria-hidden="true"><IconExternal size={13} /></span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="t-sm hairline py-4 text-body">
                Four episodes, on the show's YouTube channel now. Nine to eleven minutes each.
              </p>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 3. THE PRODUCT, in a room of its own. A wall band a stop deeper
          than the ground, with the drawn device standing on it as a lit
          object and the three stages of the model driving it. This is the one
          thing on the page worth looking at before reading anything, so it
          gets the one change of ground. ═══ */}
      <Section labelledBy="walk-h" pad={["normal", "open"]} className="wall">
        <Container width="wide">
          <Wipe>
            {/* The device's own first screen says this, and it is the one
                sentence about the product that the hero has not already said.
                "Watch, then play, then learn" stood here until 2026-10-27 and
                only repeated the headline a screen above. */}
            <h2 id="walk-h" className="t-h2 max-w-[16ch]">{walkHeading}</h2>
          </Wipe>

          <Wipe className="mt-12 sm:mt-16">
            <PupsPlayerWalkthrough episodes={EPISODES} />
          </Wipe>

          {/* The standing note on the render, as a credit: the same small
              right aligned mono line every rendered picture on the site
              carries, under the device where the eye leaves it. */}
          <p className="ml-auto mt-6 max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body">
            Drawn from the plan, not a screenshot.
          </p>
        </Container>
      </Section>

      {/* ═══ 4. THE THREE STAGES, one slip each. Watch, Play, Learn is the
          spine of the company, so it is the spine of the page. The heading is
          the Play slip's own claim, which is the sentence that makes this a
          model rather than a library with games beside it. No lead under it:
          the board is the detail. ═══ */}
      <Section labelledBy="stages-h" pad={["normal", "none"]}>
        <Container width="wide">
          <Wipe>
            <h2 id="stages-h" className="t-h2 max-w-[22ch]">
              {stagesHeading}
            </h2>
          </Wipe>
          <div className="mt-10 sm:mt-12">
            <StageBoard slips={SLIPS} />
          </div>
        </Container>
      </Section>

      {/* ═══ 5. THE WALLS. The page's best sentence at display size between
          two rules, with the four facts behind it on their own rules beside
          it. This is where the drawing stood: a child in a room with a queue,
          a price tag and a hoarding outside the wall. The sentence did not
          need it, and the list says in words what the ink said. ═══ */}
      <Section labelledBy="walls-h" pad="normal">
        <Container width="wide">
          <Wipe>
            <div className="border-y-[1.5px] border-rule py-10 sm:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-16">
              <h2 id="walls-h" className="t-display max-w-[18ch] font-display text-ink">
                A young child can find their way around it, and cannot accidentally find their way
                out of it.
              </h2>
              <dl className="mt-10 lg:mt-0">
                {WALLS.map((w) => (
                  <div key={w.label} className="border-t-[1.5px] border-rule-soft py-4 first:border-t-0 first:pt-0">
                    {/* The label inside the list, mono, as every docket label
                        on the site is set. */}
                    <dt className="font-mono text-[13px] uppercase leading-[1.6] tracking-[0.16em] text-body">
                      {w.label}
                    </dt>
                    <dd className="t-body mt-1 text-ink">{w.line}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Wipe>
        </Container>
      </Section>

      {/* ═══ 6. WHO CHECKS IT. The heading in the left track, the one line
          of how beside it, and the three people under both as a credits row
          at a size you can read. It is the site's third list of these
          faces, so it is the plainest: no stage, no lamp, a rule and a
          print each. ═══ */}
      <Section labelledBy="check-h" pad={["tight", "normal"]}>
        <Container width="wide">
          <Settle className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,38ch)] lg:items-end lg:gap-16">
            <h2 id="check-h" className="t-h2 max-w-[18ch]">
              {checkHeading}
            </h2>
            <p className="t-sm max-w-[44ch] leading-[1.6] text-body lg:pb-2">
              Every activity in the app maps back to the early years objective behind its episode,
              and it is read by the same people who read the scripts before Paula gives it her
              final word.
            </p>
          </Settle>

          <div className="mt-10 sm:mt-12">
            <ReviewerRoom people={REVIEWERS} />
          </div>

          {/* No credits list under the row. Each credit already carries the
              name, the role and the line; a list repeating all three a few
              hundred pixels lower named the same three people twice on one
              screen. */}

          <div className="mt-10">
            <TextLink to="/ethical-ai">The full review sequence<IconArrow size={15} /></TextLink>
          </div>
        </Container>
      </Section>

      {/* ═══ 7. WHERE IT STANDS, and how to hear. The one deep band. The
          ledger says plainly what is and is not known, which on a pre-launch
          page is the honest version of a launch date. ═══ */}
      {/* The site footer is navy too, so this band and the footer meet with no
          edge between them. Its bottom padding is cut back accordingly: at the
          full section rhythm the two together read as 900px of unbroken navy. */}
      <div id="notify" className="scroll-mt-24">
      <Section deep labelledBy="next-h" pad={["normal", "tight"]}>
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
            <div>
              <h2 id="next-h" className="t-h2 max-w-[16ch]">{nextHeading}</h2>
              <dl className="mt-8 max-w-[52ch]">
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t-[1.5px] border-edge-dark py-4">
                  <dt className="font-mono text-[14px] uppercase tracking-[0.16em]">Status</dt>
                  {/* NO DATE, and not because none exists. The client's review
                      document of 22 October gives a working launch target and
                      says in the same sentence not to publish an exact date
                      until it is confirmed. A target that slips is a broken
                      promise on the one page a parent checks, so this row says
                      what is true today and QUESTIONS.md asks whether the
                      month may go up. */}
                  <dd className="t-body">{launched ? "Available now" : "In development"}</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t-[1.5px] border-edge-dark py-4">
                  <dt className="font-mono text-[14px] uppercase tracking-[0.16em]">Stores</dt>
                  <dd className="t-body">
                    {liveLinks.length > 0
                      ? liveLinks.map((l) => l.label).join(" and ")
                      : "Not yet listed. Links will appear here once they are confirmed."}
                  </dd>
                </div>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t-[1.5px] border-edge-dark py-4">
                  <dt className="font-mono text-[14px] uppercase tracking-[0.16em]">Until then</dt>
                  <dd className="t-body">The four released episodes are on YouTube, linked above.</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="t-h3">Hear when it lands</h3>
              <p className="t-body mt-3 max-w-[40ch]">
                One email when it is available. No list, no marketing, and we do not share it with
                anyone.
              </p>
              <NotifyForm cta="Notify me" icon={<IconBell size={16} />} done="Thanks. We will email you once, when it is live, and not for anything else." />
            </div>
          </Settle>
        </Container>
      </Section>
      </div>
    </>
  );
}
