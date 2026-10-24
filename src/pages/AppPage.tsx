import { NotifyForm } from "@/components/NotifyForm";
import { Seo } from "@/components/Seo";
import { ShowFrame } from "@/components/ShowFrame";
import { StageBoard, type BoardSlip } from "@/components/app/StageBoard";
import { ReviewerRoom } from "@/components/app/ReviewerRoom";
import { NoWayOut } from "@/components/app/NoWayOut";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import {
  type Stage,
  STAGES,
  PupsPlayerWalkthrough,
} from "@/components/app/PupsPlayerWalkthrough";
import { EPISODES, RELEASED } from "@/lib/episodes";
import { TextLink, Button, Section, Container, Lead } from "@/components/ui";
import { IconExternal, IconBell, IconArrow } from "@/components/icons";
import type { AssetKey } from "@/lib/brand";
import { APP_LAUNCHED } from "@/lib/site";

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

   SHAPE, reset 2026-10-08 to the Story pattern. The device is a centrepiece
   with air around it rather than the thing the page is built out of: the
   headline shares the top with the ledger of what already exists, the device
   stands alone on a wall band with open padding, a garden frame takes the
   page edge to edge, and then Watch, Play and Learn carry the rest as three
   rows, each with the stage in the left column and its planned features on
   the right. The five-stage board stands on one StageBoard and the page closes
   on the one deep band.

   Nothing is claimed that the page did not already claim. No launch date, no
   store links, no price, no device requirements, no numbers. Where a fact is
   missing the page says so rather than filling the gap.
   ========================================================================== */

/** Store links stay null until the client supplies them, and a null link
 *  renders nothing: no badge placeholders. The launch flag is APP_LAUNCHED in
 *  src/lib/site.ts. */
const STORE_LINKS: { href: string | null; label: string }[] = [
  { label: "App Store", href: null },
  { label: "Google Play", href: null },
];

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
  const liveLinks = STORE_LINKS.filter((l): l is { href: string; label: string } => Boolean(l.href));

  return (
    <>
      <Seo
        title={APP_LAUNCHED ? "PupsPlayer app" : "PupsPlayer app, in development"}
        description="PupsPlayer™ from CLÉ Family Media holds the Watch, Play, Learn model in one place: ad-free episodes of The Pawsitive Pugs & Pals, the songs, puzzles and games built from each one, and the printable and offline activities underneath. In development."
        path="/app"
      />

      {/* ═══ 1. WHAT IT IS, beside what already exists. The headline takes the
          measure and the ledger of released episodes takes the margin, so the
          first screen of a page about an unreleased product carries the four
          things that are real today rather than a headline and air. ═══ */}
      <Section labelledBy="app-h" pad={["normal", "tight"]}>
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-16">
            <div>
              <h1 id="app-h" className="t-display max-w-[14ch]">Watch, play and learn in one place</h1>
              <Lead className="mt-6 max-w-[54ch]">
                PupsPlayer™ will hold the whole Watch, Play, Learn model: ad-free episodes of{" "}
                <em>The Pawsitive Pugs &amp; Pals</em>®, the songs, puzzles and games built from each
                one, and the printable and offline activities underneath. There are no purchases
                inside a game and nothing recommending the next thing to watch.
                {APP_LAUNCHED
                  ? ""
                  : " It is in development and not yet available. Everything on this page is the first release as it is planned, not as it has been tested, and we will say which is which once testing is done."}
              </Lead>
              {APP_LAUNCHED && liveLinks.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {liveLinks.map((l) => (
                    <Button key={l.label} href={l.href}>{l.label}<IconExternal size={15} /></Button>
                  ))}
                </div>
              ) : (
                <div className="mt-8">
                  {/* A plain anchor, not TextLink: TextLink opens an href in a
                      new tab, and this one only goes down the page. */}
                  <a
                    href="#notify"
                    className="link-draw inline-flex items-center gap-1.5 text-[15px] font-semibold text-red-deep"
                  >
                    Hear when it lands<IconArrow size={15} />
                  </a>
                </div>
              )}
            </div>

            {/* The ledger of what exists. It used to sit halfway down the page
                under the heading of a section about things that do not exist
                yet, which is exactly the wrong place for the only hard facts
                on the page. */}
            <div className="card rounded-[var(--radius-lg)] px-5 py-1 sm:px-6 lg:mb-1.5">
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
                      <span className="tnum font-mono text-[12px] tracking-[0.14em] text-red-deep">{ep.n}</span>
                      <span className="t-sm font-semibold text-ink group-hover:text-red-deep">{ep.title}</span>
                      <span className="tnum ml-auto shrink-0 font-mono text-[12px] text-muted">{ep.runtime}</span>
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

      {/* ═══ 2. THE PRODUCT, in a room of its own. A wall band a stop deeper
          than the ground, with the drawn device standing on it as a lit
          object and the three stages of the model driving it. This is the one
          thing on the page worth looking at before reading anything, so it
          gets the one change of ground. ═══ */}
      <Section labelledBy="walk-h" pad="open" className="wall">
        <Container width="wide">
          <Settle className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            {/* Not "Watch, play and learn": that is the h1 a screen above,
                and two headings a page apart saying the same four words is
                how a page stops looking authored. This one names what the
                device actually does, which is walk the model in order. */}
            <h2 id="walk-h" className="t-h2 max-w-[16ch]">Watch, then play, then learn</h2>
            {/* The standing label on the whole band. It was under the device,
                where a reader met it only after taking the picture for a
                screenshot, which is the misreading it exists to prevent. */}
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-body sm:pb-2">
              Drawn from the plan, not a screenshot
            </p>
          </Settle>

          <Wipe className="mt-14 sm:mt-20">
            <PupsPlayerWalkthrough episodes={EPISODES} />
          </Wipe>
        </Container>
      </Section>

      {/* ═══ IMAGE MOMENT. The page leaves the drawn interface and shows
          something that exists. It ran edge to edge until 2026-10-13, where
          the band kept 58 percent of the frame at 1440; see ShowFrame.tsx.
          Captioned as what it is, a frame from the show. ═══ */}
      <ShowFrame
        asset="home.characters"
        caption={
          <>
            Finn, Fia and the hen. A frame from The Pawsitive Pugs &amp; Pals&reg;, which is what
            the player holds.
          </>
        }
      />

      {/* ═══ 3. THE THREE STAGES, one row each. Watch, Play, Learn is the spine
          of the company, so it is the spine of the page: the stage in the
          left column, the planned features that belong to it on the right.
          One StageBoard. ═══ */}
      <Section labelledBy="stages-h" pad={["tight", "none"]}>
        <Container width="wide">
          <h2 id="stages-h" className="t-h2 mb-10 max-w-[18ch]">{APP_LAUNCHED ? "What each stage holds" : "What each stage will hold"}</h2>
          <StageBoard slips={SLIPS} />
        </Container>
      </Section>

      {/* A plain statement at display size between two rules, the same
          sentence the plan already makes about small hands, pulled out of the
          list above so it can be read from across a room. */}
      <Section pad="normal" as="div">
        <Container width="wide">
          <Wipe>
            <p className="t-h1 max-w-[26ch] border-y border-rule py-10 font-display text-ink sm:py-14">
              A young child can find their way around it, and cannot accidentally find their way out of it.
            </p>
          </Wipe>

          {/* The sentence above, drawn. Everything inside connects to
              everything inside; the three ways a children's app usually leaks
              a child out of it stop at the wall. All three are the page's own
              claims from the feature list. See components/app/NoWayOut.tsx. */}
          <Settle className="mt-12 lg:mt-16">
            <NoWayOut />
          </Settle>
        </Container>
      </Section>

      {/* ═══ 4. WHO CHECKS IT. A credits block: three faces at a size you can
          read, over the three lines of what each of them actually does. It
          used to be a card in a narrow measure with the portraits at 64px,
          which made the one section on the page that carries named human
          accountability the quietest thing on it. ═══ */}
      <Section labelledBy="check-h" pad={["none", "normal"]}>
        <Container width="default">
          <Settle className="max-w-[58ch]">
            <h2 id="check-h" className="t-h2 max-w-[20ch]">
              Checked by the people who check the episodes
            </h2>
            <p className="t-body mt-4 text-body">
              Every activity in the app maps back to the early years objective behind its episode,
              and it is read by the same people who read the scripts before Paula gives it her
              final word.
            </p>
          </Settle>

          <div className="mt-10">
            <ReviewerRoom people={REVIEWERS} />
          </div>

          {/* No credits list under the room. The room's mounts already carry
              the name, the role and the line; the list repeated all three a
              few hundred pixels lower, so the page named the same three
              people twice on one screen. */}

          <div className="mt-9">
            <TextLink to="/ethical-ai">The full review sequence<IconArrow size={15} /></TextLink>
          </div>
        </Container>
      </Section>

      {/* ═══ 5. WHERE IT STANDS, and how to hear. The one deep band. The
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
              <h2 id="next-h" className="t-h2 max-w-[16ch]">Where it stands</h2>
              <dl className="mt-8 max-w-[52ch]">
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t border-white/15 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em]">Status</dt>
                  {/* NO DATE, and not because none exists. The client's review
                      document of 22 October gives a working launch target and
                      says in the same sentence not to publish an exact date
                      until it is confirmed. A target that slips is a broken
                      promise on the one page a parent checks, so this row says
                      what is true today and QUESTIONS.md asks whether the
                      month may go up. */}
                  <dd className="t-body">{APP_LAUNCHED ? "Available now" : "In development"}</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t border-white/15 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em]">Stores</dt>
                  <dd className="t-body">
                    {liveLinks.length > 0
                      ? liveLinks.map((l) => l.label).join(" and ")
                      : "Not yet listed. Links will appear here once they are confirmed."}
                  </dd>
                </div>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t border-white/15 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em]">Until then</dt>
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
