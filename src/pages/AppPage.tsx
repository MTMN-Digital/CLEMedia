import { Link } from "react-router-dom";
import { NotifyForm } from "@/components/NotifyForm";
import { Seo } from "@/components/Seo";
import { FactRows } from "@/components/FactRows";
import { PupsMark } from "@/components/app/PupsMark";
import { EpisodeSlates } from "@/components/app/EpisodeSlates";
import { LearnMaterial, PAGE_CAPTIONS, COVERS_CAPTION } from "@/components/app/LearnMaterial";
import { citeShow } from "@/components/app/cite";
import { PupsPlayerWalkthrough, STAGES } from "@/components/app/PupsPlayerWalkthrough";
import { useEpisodes } from "@/lib/useEpisodes";
import { AWAY_LABEL } from "@/lib/books";
import { Button, Section, TextLink, Container } from "@/components/ui";
import { IconExternal, IconBell, IconArrow } from "@/components/icons";
import type { AppSetting } from "@/lib/types";
import { SITE, APP_LAUNCHED } from "@/lib/site";
import { useList, useSetting, useImageBlock, useBlock } from "@/lib/content";
import { type AppFeature, WATCH_ITEMS, PLAY_ITEMS, WALLS, GAMES, LEARN_ITEMS } from "@/components/app/items";
import "@/components/app/sheet.css";

/* ============================================================================
   PupsPlayer, as a product sheet.

   The page is laid out the way a maker publishes a specification for a thing
   that is not shipping yet. The object comes first (the drawn device, which
   admits it is drawn), then the facts about it as plain ruled rows, then the
   contents by stage with the real Learn material shown at page size, then a
   "will not" list, then the notify slot, then one line and the two outward
   links. Nothing is a ground: no frame, no scrim, no band. The only pictures
   are content with captions: six felted slates, three book covers, four A4
   pages. The headline is the product's name, not a claim.

   Rebuilt 2026-10-28 against docs/SUBPAGE-PLANS-2026-10-28.md, "## app".
   The previous page opened on a scrimmed show frame with a display claim,
   stood the device on a wall band, and borrowed the team page's slip bench
   and the reviewer portraits; all of that is gone. Nothing is claimed that
   the previous page did not claim: no launch date, no store links, no price,
   no device requirements, no numbers beyond the one shared book statement.
   ========================================================================== */

/* The words Conor can change from the admin panel, keyed as the registry in
   src/lib/blocks.ts names them. Each entry is the page's own wording today;
   the page renders it unless a saved block replaces it, so an empty table
   shows exactly this. */
export const COPY: Record<string, string> = {
  "device.name": "Pawsitive Pugs & Pals",
  "device.lead":
    "The app for The Pawsitive Pugs & Pals: the episodes, the songs, puzzles and games built from each one, and the printable and offline activities underneath.",
  "status.holds": "Series one of The Pawsitive Pugs & Pals. Four episodes released, two in production.",
  "status.for": "Children aged two to six, with an adult beside them.",
  "contents.heading": "What is in it",
  "watch.footnote": "Four episodes, on the show's YouTube channel now. Nine to eleven minutes each.",
  "play.subhead": "Planned for the first release",
  "learn.away_caption": `${AWAY_LABEL}, page one: the key vocabulary for The Feather.`,
  "learn.note":
    "Made for each episode alongside the series. Which of the books ship inside the app, and which are sold on their own in the shop, will be marked here once it is confirmed.",
  "walls.heading": "What it will not do",
  "walls.lead": "A young child can find their way around it, and cannot accidentally find their way out of it.",
  "check.line":
    "Every activity in the app maps back to the early years objective behind its episode, and it is read by the same people who read the scripts before Paula gives it her final word.",
  "next.heading": "Hear when it lands",
  "next.lead": "One email when it is available. No list, no marketing, and we do not share it with anyone.",
  "next.note":
    "In development and not yet available. Everything on this page is the first release as it is planned, not as it has been tested, and we will say which is which once testing is done.",
  "close.line": "The printable books are sold on their own in the shop, and the episodes are on the show site.",
  "device.credit": "Drawn from the plan, not a screenshot.",
  "status.label_status": "Status",
  "status.label_holds": "Holds",
  "status.label_for": "For",
  "status.label_stores": "Stores",
  "status.stores_empty": "Not yet listed. Links will appear here once they are confirmed.",
  "status.label_until": "Until then",
  "until.lead": "The four released episodes are on YouTube,",
  "until.link": "listed below",
  "until.notify": "Hear when it lands",
  "check.link": "The full review sequence",
  "close.shop": "The shop",
  "close.show": "The show's own site",
  "watch.title": STAGES[0].title,
  "watch.line": STAGES[0].line,
  "play.title": STAGES[1].title,
  "play.line": STAGES[1].line,
  "learn.title": STAGES[2].title,
  "learn.line": STAGES[2].line,
  "learn.covers_caption": COVERS_CAPTION,
};

/** The launch flag and the store links. APP_LAUNCHED in src/lib/site.ts is
 *  the value the page is built with and renders first; the `app` settings
 *  row, which the admin panel writes, takes over once it arrives. Store links
 *  stay null until the client supplies them there, and a null link renders
 *  nothing: no badge placeholders. The target window is held in the same row
 *  but is NOT rendered here, on purpose: the client's review document of 22
 *  October gives a working launch target and says in the same sentence not
 *  to publish an exact date until it is confirmed. QUESTIONS.md asks whether
 *  the month may go up; the STATUS row is the line it goes into. */
const APP_DEFAULT: AppSetting = { launched: APP_LAUNCHED, target_window: null, app_store_url: null, play_store_url: null };

function storeLinks(app: AppSetting): { href: string | null; label: string }[] {
  return [
    { label: "App Store", href: app.app_store_url || null },
    { label: "Google Play", href: app.play_store_url || null },
  ];
}

/* An on-page anchor in the TextLink's clothes. TextLink's `href` opens a new
   tab and its `to` goes through the router, and neither is right for a link
   that only goes down this page. */
function AnchorLink({ href, children }: { children: string; href: string }) {
  return (
    <a href={href} className="link-draw inline-flex items-center gap-1.5 font-semibold text-red-deep">
      {children}
    </a>
  );
}

/* The label column of a contents row: the stage, its line, and its items. */
function StageLabel({ stage, items }: { items: AppFeature[]; stage: (typeof STAGES)[number] }) {
  return (
    <div>
      <h3 className="t-h3 font-bold text-ink">{stage.title}</h3>
      <p className="t-body mt-3 max-w-[40ch] text-ink">{stage.line}</p>
      <ul className="mt-6 max-w-[44ch]">
        {items.map((it, i) => (
          <li key={i} className="t-body mt-4 text-body first:mt-0">
            <span className="font-semibold text-ink">
              <span>{it.title}</span>.
            </span>{" "}
            <span>{it.body}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* `grid-cols-1` and not a bare `grid`: a bare grid's implicit auto column
   grows to its widest child's max-content, and the Learn row's cover
   scroller is 800px of max-content on a 350px phone. minmax(0, 1fr) holds. */
const ROW = "grid grid-cols-1 gap-10 border-t-[1.5px] border-rule py-12 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,1fr)] lg:gap-16 lg:py-16";
const LABEL = "font-mono text-[14px] uppercase leading-[1.7] tracking-[0.16em] text-body";

export default function AppPage() {
  const episodes = useEpisodes();
  const app = useSetting("app", APP_DEFAULT);
  const launched = app.launched;
  const liveLinks = storeLinks(app).filter((l): l is { href: string; label: string } => Boolean(l.href));

  const name = useBlock("app", "device.name", COPY["device.name"]);
  const lead = useBlock("app", "device.lead", COPY["device.lead"]);
  const capture = useImageBlock("app", "device.capture");
  const holds = useBlock("app", "status.holds", COPY["status.holds"]);
  const forWhom = useBlock("app", "status.for", COPY["status.for"]);
  const contentsHeading = useBlock("app", "contents.heading", COPY["contents.heading"]);
  const watchFootnote = useBlock("app", "watch.footnote", COPY["watch.footnote"]);
  const playSubhead = useBlock("app", "play.subhead", COPY["play.subhead"]);
  const awayCaption = useBlock("app", "learn.away_caption", COPY["learn.away_caption"]);
  const learnNote = useBlock("app", "learn.note", COPY["learn.note"]);
  const wallsHeading = useBlock("app", "walls.heading", COPY["walls.heading"]);
  const wallsLead = useBlock("app", "walls.lead", COPY["walls.lead"]);
  const checkLine = useBlock("app", "check.line", COPY["check.line"]);
  const nextHeading = useBlock("app", "next.heading", COPY["next.heading"]);
  const nextLead = useBlock("app", "next.lead", COPY["next.lead"]);
  const nextNote = useBlock("app", "next.note", COPY["next.note"]);
  const closeLine = useBlock("app", "close.line", COPY["close.line"]);

  const labelStatus = useBlock("app", "status.label_status", COPY["status.label_status"]);
  const labelHolds = useBlock("app", "status.label_holds", COPY["status.label_holds"]);
  const labelFor = useBlock("app", "status.label_for", COPY["status.label_for"]);
  const labelStores = useBlock("app", "status.label_stores", COPY["status.label_stores"]);
  const storesEmpty = useBlock("app", "status.stores_empty", COPY["status.stores_empty"]);
  const labelUntil = useBlock("app", "status.label_until", COPY["status.label_until"]);
  const untilLead = useBlock("app", "until.lead", COPY["until.lead"]);
  const untilLink = useBlock("app", "until.link", COPY["until.link"]);
  const untilNotify = useBlock("app", "until.notify", COPY["until.notify"]);
  const credit = useBlock("app", "device.credit", COPY["device.credit"]);
  const checkLink = useBlock("app", "check.link", COPY["check.link"]);
  const closeShop = useBlock("app", "close.shop", COPY["close.shop"]);
  const closeShow = useBlock("app", "close.show", COPY["close.show"]);
  const watchItems = useList("app", "watch.items", WATCH_ITEMS);
  const playItems = useList("app", "play.items", PLAY_ITEMS);
  const learnItems = useList("app", "learn.items", LEARN_ITEMS);
  const games = useList("app", "play.games", GAMES);
  const walls = useList("app", "walls.items", WALLS);

  const watchTitle = useBlock("app", "watch.title", COPY["watch.title"]);
  const watchLine = useBlock("app", "watch.line", COPY["watch.line"]);
  const playTitle = useBlock("app", "play.title", COPY["play.title"]);
  const playLine = useBlock("app", "play.line", COPY["play.line"]);
  const learnTitle = useBlock("app", "learn.title", COPY["learn.title"]);
  const learnLine = useBlock("app", "learn.line", COPY["learn.line"]);
  const coversCaption = useBlock("app", "learn.covers_caption", COPY["learn.covers_caption"]);
  const captions = useList("app", "learn.captions", PAGE_CAPTIONS);
  const stages: typeof STAGES = [
    { ...STAGES[0], title: watchTitle, line: watchLine },
    { ...STAGES[1], title: playTitle, line: playLine },
    { ...STAGES[2], title: learnTitle, line: learnLine },
  ];
  const [watch, play, learn] = stages;

  return (
    <>
      <Seo
        title={launched ? "The Pawsitive Pugs & Pals app" : "The Pawsitive Pugs & Pals app, coming soon"}
        description="The Pawsitive Pugs & Pals® app from CLÉ Family Media holds the Watch, Play, Learn model in one place: ad-free episodes of The Pawsitive Pugs & Pals, the songs, puzzles and games built from each one, and the printable and offline activities underneath. In development."
        path="/app"
      />

      {/* ═══ 1. THE OPENING: the device and the sheet's title block. The mark,
          the name, the descriptor and the three stage tabs in the left column,
          vertically centred on the drawn device at the right; on a phone the
          title block, then the device, then the tabs. Under all of it the
          status rows, plain ruled, no leaders. No image behind anything, no
          band, no button pair: the two actions the old hero carried are the
          links in the UNTIL THEN row. ═══ */}
      <div className="pt-10 sm:pt-14">
        <Container width="wide">
          <PupsPlayerWalkthrough
            episodes={episodes}
            capture={capture}
            stages={stages}
            lead={
              <div>
                <PupsMark className="h-11 w-11 text-navy lg:h-14 lg:w-14" />
                <h1 className="t-h1 mt-5 text-ink">
                  {name}
                  <sup className="relative top-[-0.1em] ml-[0.08em] text-[0.4em] font-sans font-semibold tracking-normal">&trade;</sup>
                </h1>
                <p className="t-lead mt-6 max-w-[40ch] text-ink">{citeShow(lead, true)}</p>
              </div>
            }
            credit={
              capture ? null : (
                <p className="mt-6 text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body">
                  {credit}
                </p>
              )
            }
            after={
              <FactRows
                rows={[
                  { label: labelStatus, value: launched ? "Available now" : "In development" },
                  { label: labelHolds, value: citeShow(holds) },
                  { label: labelFor, value: forWhom },
                  {
                    label: labelStores,
                    value:
                      liveLinks.length > 0 ? (
                        <span className="flex flex-wrap gap-3">
                          {liveLinks.map((l) => (
                            <Button key={l.label} href={l.href}>
                              {l.label}
                              <IconExternal size={15} />
                            </Button>
                          ))}
                        </span>
                      ) : (
                        storesEmpty
                      ),
                  },
                  {
                    label: labelUntil,
                    value: (
                      <>
                        <span>{untilLead}</span>{" "}
                        <AnchorLink href="#released">{untilLink}</AnchorLink>
                        {!launched && (
                          <>
                            {" "}&middot; <AnchorLink href="#notify">{untilNotify}</AnchorLink>
                          </>
                        )}
                      </>
                    ),
                  },
                ]}
              />
            }
          />
        </Container>
      </div>

      {/* ═══ 2. WHAT IS IN IT. The contents list by stage, three rows of one
          table, each opened by a rule: the stage and its commitments in the
          label column, the real material beside it. Watch holds the six
          slates; Play holds the games list as a spec, because the games are
          software that does not exist yet and the page shows nothing it
          cannot show; Learn holds the real books and pages, the page's
          signature. ═══ */}
      <Section labelledBy="contents-h" pad={["normal", "none"]}>
        <Container width="wide">
          <h2 id="contents-h" className="t-h2 max-w-[16ch]">{contentsHeading}</h2>

          <div className="mt-10 border-b-[1.5px] border-rule sm:mt-12">
            <div className={ROW}>
              <StageLabel stage={watch} items={watchItems} />
              <div>
                <EpisodeSlates episodes={episodes} id="released" />
                <p className="t-sm mt-7 text-body">{watchFootnote}</p>
              </div>
            </div>

            <div className={ROW}>
              <StageLabel stage={play} items={playItems} />
              <div>
                <p className="t-sm text-body">{playSubhead}</p>
                <ul className="mt-3 grid border-b-[1.5px] border-rule sm:grid-cols-2 sm:gap-x-16">
                  {games.map((g, i) => (
                    <li key={i} className="border-t-[1.5px] border-rule py-3 font-mono text-[14px] uppercase leading-[1.7] tracking-[0.14em] text-ink">
                      {g.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={ROW}>
              <StageLabel stage={learn} items={learnItems} />
              <LearnMaterial awayCaption={awayCaption} note={learnNote} coversCaption={coversCaption} captions={captions} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 3. WHAT IT WILL NOT DO. The four refusals as the specification
          they are: the page's best sentence as the lead, then a ruled list in
          two columns of two, the labels in the same mono and the same 9rem
          column as the status rows, so the sheet's two tables look like one
          document's two tables. ═══ */}
      <Section labelledBy="walls-h" pad="normal">
        <Container width="wide">
          <h2 id="walls-h" className="t-h2 max-w-[16ch]">{wallsHeading}</h2>
          <p className="t-lead mt-6 max-w-[40ch] text-ink">{wallsLead}</p>
          <dl className="mt-10 grid border-b-[1.5px] border-rule lg:grid-cols-2 lg:gap-x-16">
            {walls.map((w, i) => (
              <div key={i} className="grid gap-x-6 gap-y-1 border-t-[1.5px] border-rule py-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
                <dt className={LABEL}>{w.label}</dt>
                <dd className="t-body text-ink">{w.line}</dd>
              </div>
            ))}
          </dl>

          {/* ═══ 4. WHO CHECKS IT, in one sentence. Not a section: the faces
              are on /team, /story and /contact, and this page points at the
              review sequence rather than drawing it a fourth time. ═══ */}
          <p className="t-body mt-12 max-w-[60ch] text-body">{checkLine}</p>
          <p className="mt-4">
            <TextLink to="/ethical-ai">
              {checkLink}
              <IconArrow size={15} />
            </TextLink>
          </p>
        </Container>
      </Section>

      {/* ═══ 5. HEAR WHEN IT LANDS. The notify slot and the plain status
          note, on paper. ═══ */}
      <Section labelledBy="next-h" pad={["none", "normal"]}>
        <Container width="wide">
          <div id="notify" className="sheet-notify grid gap-12 border-t-[1.5px] border-rule pt-12 scroll-mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20 lg:pt-16">
            <div>
              <h2 id="next-h" className="t-h2 max-w-[16ch]">{nextHeading}</h2>
              <p className="t-body mt-4 max-w-[44ch] text-ink">{nextLead}</p>
              <NotifyForm
                cta="Notify me"
                icon={<IconBell size={16} />}
                done="Thanks. We will email you once, when it is live, and not for anything else."
              />
            </div>
            {!launched && <p className="t-body max-w-[44ch] text-body lg:pt-3">{nextNote}</p>}
          </div>

          {/* ═══ 6. CLOSING. One line and the page's two outward links; the
              footer is the closing. ═══ */}
          <div className="mt-16 border-t-[1.5px] border-rule pt-8 lg:mt-20">
            <p className="t-lead max-w-[56ch] text-ink">{closeLine}</p>
            <p className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
              <Link to="/shop" className="link-draw inline-flex items-center gap-1.5 text-[15px] font-semibold text-red-deep">
                {closeShop}
                <IconArrow size={15} />
              </Link>
              <TextLink href={SITE.showUrl}>
                {closeShow}
                <IconExternal size={14} />
              </TextLink>
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
