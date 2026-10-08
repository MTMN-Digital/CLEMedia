import { type ReactNode } from "react";
import { NotifyForm } from "@/components/NotifyForm";
import { Seo } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import {
  PupsPlayerWalkthrough,
  STAGES,
  type AppEpisode,
  type Stage,
} from "@/components/app/PupsPlayerWalkthrough";
import { Button, Container, Kicker, Lead, Section, TextLink } from "@/components/ui";
import { IconArrow, IconBell, IconExternal } from "@/components/icons";
import type { AssetKey } from "@/lib/brand";

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
   the right. Surfaces alternate paper, wall, paper, wall, and the page closes
   on the one deep band.

   Nothing is claimed that the page did not already claim. No launch date, no
   store links, no price, no device requirements, no numbers. Where a fact is
   missing the page says so rather than filling the gap.
   ========================================================================== */

/** Flipped at launch. Store links stay null until the client supplies them, and
 *  a null link renders nothing: no badge placeholders. */
const APP_LAUNCHED = false;
const STORE_LINKS: { label: string; href: string | null }[] = [
  { label: "App Store", href: null },
  { label: "Google Play", href: null },
];

/* Episode numbers, titles and runtimes are the real ones, read off the felted
   title slates and the YouTube metadata. Same source as the home page. */
const EPISODES: AppEpisode[] = [
  { n: "001", title: "The Feather", runtime: "9:16", asset: "slate.ep1", href: "https://www.youtube.com/watch?v=duMH0f12JM0" },
  { n: "002", title: "The Strawberry", runtime: "11:10", asset: "slate.ep2", href: "https://www.youtube.com/watch?v=ZzhkZJgQEK0" },
  { n: "003", title: "Chicken Vision", runtime: "10:41", asset: "slate.ep3", href: "https://www.youtube.com/watch?v=CpgIzsn500Q" },
  { n: "004", title: "The Cuckoo's Incredible Journey", runtime: "9:58", asset: "slate.ep4", href: "https://www.youtube.com/watch?v=yHYYBpMfE6M" },
];

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
    body: "Clear settings, no surprise purchases inside the app, and no advertising to children anywhere in it.",
  },
  grounded: {
    title: "Grounded in the learning",
    body: "Every activity maps back to the early years objective behind its episode, reviewed by the same people who review the episodes.",
  },
};
const STAGE_ITEMS: Record<Stage, string[]> = {
  watch: ["adFree", "hands", "control"],
  play: ["follows"],
  learn: ["printables", "grounded"],
};
const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<Stage, (typeof STAGES)[number]>;

/* The people who check what goes into the app, as the client supplied them.
   The same three review stages the episodes pass: educational review, and
   parent and early years review. */
const REVIEWERS: { name: string; role: string; line: string; asset: AssetKey }[] = [
  { name: "Paula Walshe PhD", role: "Education Director", asset: "person.paula", line: "Reviews the learning intent of each episode and the offline activities that follow it, against early years practice." },
  { name: "Lydia Harding", role: "Executive Producer", asset: "person.lydia", line: "Reads script and production from a parent's point of view, and from a child's." },
  { name: "Kirstie", role: "Child Development Consultant", asset: "person.kirstie", line: "Thirty years in childcare and early education. Checks that what is made is age-appropriate." },
];


/* The Story page's margin grid: heading column left, body right, a hairline
   down the inside edge of the body. Stacked and capped under 1024px. */
function Spread({ margin, children }: { margin: ReactNode; children: ReactNode }) {
  return (
    <Settle className="mx-auto grid max-w-[62ch] gap-8 lg:max-w-none lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[16rem_minmax(0,1fr)]">
      <div className="lg:sticky lg:top-28 lg:self-start">{margin}</div>
      <div className="lg:border-l lg:border-[var(--color-rule-soft)] lg:pl-12">
        <div className="max-w-[56ch]">{children}</div>
      </div>
    </Settle>
  );
}

function StageRow({ stage, surface }: { stage: Stage; surface?: "wall" }) {
  const s = STAGE_BY_ID[stage];
  return (
    <Section labelledBy={`${stage}-h`} pad="tight" className={surface === "wall" ? "wall" : ""}>
      <Container>
        <Spread
          margin={
            <>
              <h2 id={`${stage}-h`} className="t-h2">{s.title}</h2>
              <p className="eyebrow eyebrow-sm mt-3">Planned, not yet available</p>
              <p className="t-sm mt-4 max-w-[30ch] text-body">{s.line}</p>
            </>
          }
        >
          <ul>
            {STAGE_ITEMS[stage].map((k) => (
              <li key={k} className="hairline py-6 first:border-t-0 first:pt-0">
                <h3 className="t-h3">{ITEMS[k].title}</h3>
                <p className="t-body mt-2.5 text-body">{ITEMS[k].body}</p>
              </li>
            ))}
          </ul>
        </Spread>
      </Container>
    </Section>
  );
}

export default function AppPage() {
  const liveLinks = STORE_LINKS.filter((l): l is { label: string; href: string } => Boolean(l.href));

  return (
    <>
      <Seo
        title={APP_LAUNCHED ? "PupsPlayer app" : "PupsPlayer app, in development"}
        description="PupsPlayer™ from CLÉ Family Media holds the Watch, Play, Learn model in one place: ad-free episodes of The Pawsitive Pugs & Pals, the movement or breathing prompt that follows each one, and the printable activities underneath. In development."
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
              <Kicker>{APP_LAUNCHED ? "PupsPlayer™" : "PupsPlayer™ · In development"}</Kicker>
              <h1 id="app-h" className="t-display mt-6 max-w-[14ch]">Watch, play and learn in one place</h1>
              <Lead className="mt-6 max-w-[54ch]">
                PupsPlayer™ will hold the whole Watch, Play, Learn model: ad-free episodes of{" "}
                <em>The Pawsitive Pugs &amp; Pals</em>®, the movement or breathing prompt that follows
                each one, and the printable activities underneath.
                {APP_LAUNCHED
                  ? ""
                  : " It is in development and not yet available. Everything drawn below is the plan, not a screenshot."}
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
                {EPISODES.map((ep) => (
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

      {/* ═══ IMAGE MOMENT. The garden the series is set in, edge to edge, so
          the page leaves the drawn interface and shows something that exists.
          Captioned as what it is, a frame from the show. ═══ */}
      <Section pad="none" as="div">
        <Wipe>
          <figure>
            <div className="h-[clamp(260px,38vw,520px)] overflow-hidden">
              <Figure asset="home.characters" fill rounded="rounded-none" position="center 48%" sizes="100vw" />
            </div>
            <Container width="wide">
              <figcaption className="max-w-[58ch] pb-2 pt-4">
                <p className="font-mono text-[12px] leading-[1.65] tracking-[0.02em] text-muted">
                  Finn, Fia and the hen. A frame from The Pawsitive Pugs &amp; Pals&reg;, which is
                  what the player holds.
                </p>
              </figcaption>
            </Container>
          </figure>
        </Wipe>
      </Section>

      {/* ═══ 3. THE THREE STAGES, one row each. Watch, Play, Learn is the spine
          of the company, so it is the spine of the page: the stage in the
          left column, the planned features that belong to it on the right.
          Paper, wall, paper. ═══ */}
      <StageRow stage="watch" />

      {/* A plain statement at display size between two rules, the same
          sentence the plan already makes about small hands, pulled out of the
          list above so it can be read from across a room. */}
      <Section pad={["none", "tight"]} as="div">
        <Container width="wide">
          <Wipe>
            <p className="t-h1 max-w-[26ch] border-y border-rule py-10 font-display text-ink sm:py-14">
              A young child can find their way around it, and cannot accidentally find their way out of it.
            </p>
          </Wipe>
        </Container>
      </Section>

      <StageRow stage="play" surface="wall" />
      <StageRow stage="learn" />

      {/* ═══ 4. WHO CHECKS IT. A credits block: three faces at a size you can
          read, over the three lines of what each of them actually does. It
          used to be a card in a narrow measure with the portraits at 64px,
          which made the one section on the page that carries named human
          accountability the quietest thing on it. ═══ */}
      <Section labelledBy="check-h" className="wall">
        <Container width="default">
          <Settle className="grid gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-12">
            {/* Rounded squares, the same shape the same six faces take on
                /team, rather than the overlapping circles this was. A cream
                keyline on each rather than a ring in the ground colour: the
                ground is a gradient, so a ring matched to it at one scroll
                position shows as a halo at another. */}
            <div className="flex items-center gap-3">
              {REVIEWERS.map((p) => (
                <div
                  key={p.name}
                  className="w-[84px] shrink-0 overflow-hidden rounded-[var(--radius-md)] ring-[3px] ring-[var(--color-raised)] sm:w-[104px]"
                >
                  <Figure
                    asset={p.asset}
                    rounded="rounded-[var(--radius-md)]"
                    className="aspect-square"
                    sizes="104px"
                  />
                </div>
              ))}
            </div>
            <div>
              <h2 id="check-h" className="t-h2 max-w-[20ch]">
                Checked by the people who check the episodes
              </h2>
              <p className="t-body mt-4 max-w-[58ch] text-body">
                Every activity in the app maps back to the early years objective behind its episode
                and passes the same review the episode does: educational review, then parent and
                early years review. Nothing is generated and published automatically.
              </p>
            </div>
          </Settle>

          <Settle as="ul" className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-3">
            {REVIEWERS.map((p) => (
              <li key={p.name} className="hairline pt-5">
                <h3 className="t-h3">{p.name}</h3>
                <p className="eyebrow eyebrow-sm mt-1.5 ">{p.role}</p>
                <p className="t-sm mt-3 leading-relaxed text-body">{p.line}</p>
              </li>
            ))}
          </Settle>

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
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-70">Status</dt>
                  <dd className="t-body">{APP_LAUNCHED ? "Available now" : "In development"}</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t border-white/15 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-70">Stores</dt>
                  <dd className="t-body">
                    {liveLinks.length > 0
                      ? liveLinks.map((l) => l.label).join(" and ")
                      : "Not yet listed. Links will appear here once they are confirmed."}
                  </dd>
                </div>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t border-white/15 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-70">Until then</dt>
                  <dd className="t-body">The four released episodes are on YouTube, linked above.</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="t-h3">Hear when it lands</h3>
              <p className="t-body mt-3 max-w-[40ch] opacity-80">
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
