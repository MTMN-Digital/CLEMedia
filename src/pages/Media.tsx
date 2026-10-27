import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { PageHero } from "@/components/PageHero";
import { StudioWall } from "@/components/render";
import { Button, Section, TextLink, Container } from "@/components/ui";
import { IconExternal, IconArrow } from "@/components/icons";
import { SITE, APP_LAUNCHED } from "@/lib/site";
import { useBlock, emphasis, useImageBlock, useSetting } from "@/lib/content";
import type { AppSetting, MediaItem } from "@/lib/types";

/* ============================================================================
   Press and appearances, rebuilt 2026-10-06, carried to the hero 2026-10-27.

   WHAT A PRESS PAGE IS FOR. One reader: somebody writing about the company
   who needs to get the facts right and reach a person. So the page is built
   as the things that reader actually uses. An index, ruled like a listings
   column, holding every appearance, newest first. A short statement of what
   the company is glad to talk about, each line pointing at the page that
   documents it, so a journalist can read the source before the call. And a
   notes-to-editors sheet carrying the spellings, the trade marks, the
   founder's title and where the episodes are, which is the one thing every
   press page should have and almost none do.

   THE NEWS IS THE HEADLINE, 2026-10-27. One real fact exists: a UK podcast
   appearance booked for December, with more to follow around the app launch.
   It used to sit in a ruled "Next" block under a heading that read "Press
   and appearances", which is a filing label, and the client named that shape
   as the site's problem. The fact now opens the page, at hero scale, over the
   meadow frame. Once `media_items` has rows the headline steps back to the
   plain description of what the index holds, so the hero never carries a
   booking the index has already outgrown.

   WHAT WENT. The grove band that stated, at display size, what the page
   would not do, and the six empty logo slots drawn under it. The client
   called that register horrible on 2026-10-27: a heading says what IS. The
   one fact the band carried, that coverage is listed as it runs, is what the
   index already says in its empty state. The bench the band spent is now
   under the notes to editors, which is the page's most useful object.

   SHAPE. The hero frame, then the title slates on the wall, the index and
   the subjects on paper, the press sheet on the bench, one deep band. Each
   section opens in its own text shape: a claim over the object, a heading in
   a left track beside the rows, a claim over a ruled set, a heading beside
   the sheet.

   Entries come from `media_items`, which Conor fills from the admin panel.
   The moment a row exists it takes over from the standing rows below, so
   nothing here has to be edited by hand when the first piece runs.
   ========================================================================== */

/* The words Conor can change from the admin panel, keyed as the registry in
   src/lib/blocks.ts names them. Each entry is the page's own wording today;
   the page renders it unless a saved block replaces it, so an empty table
   shows exactly this. The clause between stars is the one the headline sets
   in the accent colour. */
export const COPY: Record<string, string> = {
  "hero.eyebrow": "Press and appearances",
  "hero.eyebrow_sub": "For anyone writing about the company or the series",
  "hero.aside": "Everything links straight out to the original.",
  "hero.title_booked": "A UK podcast appearance is booked for *December.*",
  "hero.title_listing": "Interviews, podcast appearances and coverage of the *company and the series.*",
  "stills.heading": "Every title is made in wool and photographed, not set in a typeface.",
  "index.heading": "Appearances, as they are booked.",
  "subjects.heading": "Four subjects the company has a worked position on.",
  "notes.heading": "Spellings, names and facts, checked before you file.",
  "press.heading": "Writing about children's media?",
  "press.lead":
    "We would rather answer a question directly than be quoted from a web page. Tell us what you are working on and who you need.",
};

/* The player's state. APP_LAUNCHED in src/lib/site.ts is the value the page
   is built with; the `app` settings row, which the admin panel writes, takes
   over once it arrives. Both /app and this page read the same row, so every
   line that describes PupsPlayer's state changes together. */
const APP_DEFAULT: AppSetting = { launched: APP_LAUNCHED, target_window: null, app_store_url: null, play_store_url: null };

/* What the company is glad to be asked about, each pointing at the page that
   already sets out its position, so nobody is quoted inventing one. Built
   from the launch flag, so the fourth subject describes the player as it is. */
function subjectsFor(launched: boolean): { topic: string; to: string; line: string; cta: string }[] {
  return [
    {
      topic: "AI in children's production",
      line: "Where a tool is used, where a person decides, and the lines the company will not cross. The position is written down and the review stages are named.",
      to: "/ethical-ai",
      cta: "Read the position",
    },
    {
      topic: "Watch, Play, Learn",
      line: "Why an episode is written to start something rather than to fill the time, and what the education side of the company checks before a script exists.",
      to: "/story",
      cta: "Read the story",
    },
    {
      topic: "Building a family media company in Ireland",
      line: "A small studio, a founder who came to it from thirteen years in food retail, and the economics of making children's content slowly.",
      to: "/story",
      cta: "Read the story",
    },
    {
      topic: `${SITE.playerName}™, ${launched ? "released" : "in development"}`,
      line: launched
        ? "What the product is for, what it does and does not do, and how it has been built for children and their parents."
        : "What the product is for, what it will and will not do, and why it is being described as in development rather than announced.",
      to: "/app",
      cta: "See the app",
    },
  ];
}

/* The standing rows, used until `media_items` has anything in it. The booking
   is the client's own fact and is stated exactly as given: a UK podcast, in
   December, with more expected around the app launch. No show name, no date,
   no host, because none has been supplied. The second half of that fact,
   "more to follow around the app launch", lives here rather than in the
   headline, which stops at the booking so it sets in two lines. */
function standingFor(launched: boolean): { detail: string; pending?: boolean; what: string; when: string }[] {
  return [
    {
      when: "December",
      what: "A UK podcast appearance",
      detail: "Booked. The show, the episode and the link go here once it goes out.",
    },
    {
      when: "To be confirmed",
      what: "More around the app launch",
      /* Carries the mark wherever it is the first use on screen. */
      detail: launched
        ? `Further appearances are expected as ${SITE.playerName}™ reaches more families.`
        : `Further appearances are expected as ${SITE.playerName}™ launches.`,
      pending: true,
    },
  ];
}

/* Notes to editors. Every line is already true somewhere else on this site,
   which is the test for anything on this sheet. */
function notesFor(launched: boolean): { k: string; v: string }[] {
  return [
    { k: "Company", v: "CLÉ Family Media. Note the É." },
    { k: "Series", v: "The Pawsitive Pugs & Pals®, written with the ampersand and the registered mark." },
    { k: "Player", v: `PupsPlayer™, one word, capital P twice. ${launched ? "Released." : "In development, not released."}` },
    { k: "Founder", v: "Conor Sexton, Founder and CEO." },
    { k: "Characters", v: "Finn, the fawn pug. Fia, the black pug." },
    { k: "Episodes", v: "Series one. Four out now, free to watch. The show's own site carries them." },
    /* The imagery row is DELIBERATELY ABSENT. It read "No AI-generated imagery
       is used on this site", which this site's own asset manifest contradicts:
       `src/lib/brand.ts` records that the stage 1 audit found the brand kit
       almost entirely AI-generated, and names the live hero as generated. A
       press sheet on a company whose argument is disclosed AI use cannot carry
       a line its own repository calls false. Replacement wording is Conor's to
       give, and is logged in CONTENT-NEEDED.md. */
    { k: "Imagery", v: "Artwork and stills come through the press route." },
  ];
}

type Load = "empty" | "failed" | "ready" | "loading";

/**
 * The press index and an explicit load state. The standing rows are a written
 * fallback and are correct in every state; any COUNT or "nothing yet" claim
 * waits for a confirmed answer.
 */
function useMediaItems(): { load: Load; items: MediaItem[] | null } {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [load, setLoad] = useState<Load>("loading");

  useEffect(() => {
    let live = true;
    (async () => {
      // Dynamic, like the shop's catalogue: the Supabase client stays out of
      // the bundle every other page downloads.
      const { supabase } = await import("@/lib/supabase");
      if (!supabase) return live && setLoad("failed");
      const { data, error } = await supabase
        .from("media_items")
        .select("id, title, outlet, published_on, description, thumbnail, link, embed_url, sort_order")
        .order("published_on", { ascending: false, nullsFirst: false })
        .order("sort_order", { ascending: true });
      if (!live) return;
      if (error) return setLoad("failed");
      if (data?.length) {
        setItems(data as MediaItem[]);
        setLoad("ready");
      } else {
        setLoad("empty");
      }
    })().catch(() => {
      if (live) setLoad("failed");
    });
    return () => {
      live = false;
    };
  }, []);

  return { items, load };
}

function monthYear(iso: string | null): string {
  if (!iso) return "Undated";
  /* A date-only value is read as year and month directly, so no timezone can
     move it into the previous month. */
  const m = /^(\d{4})-(\d{2})/.exec(iso);
  if (m) {
    const month = Number(m[2]);
    if (month >= 1 && month <= 12) {
      return new Intl.DateTimeFormat("en-IE", { month: "long", year: "numeric", timeZone: "UTC" }).format(
        new Date(Date.UTC(Number(m[1]), month - 1, 1)),
      );
    }
    return "Undated";
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Undated";
  return new Intl.DateTimeFormat("en-IE", { month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

type Slip = { status: string; title: string; when: string; body: string; key: string };

/* The one line the right-aligned notes share: the credit under the bench and
   the line under the index. The same measure Home uses for its provenance
   note, in the body colour because both sit on paper. */
const NOTE = "ml-auto max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body";

export default function Media() {
  const { items, load } = useMediaItems();
  const { launched } = useSetting("app", APP_DEFAULT);
  const subjects = subjectsFor(launched);
  const notes = notesFor(launched);

  /* The editable words, read in one place so the hooks run in the same
     order on every render. Both headlines are read even though one shows,
     for the same reason. */
  const heroEyebrow = useBlock("media", "hero.eyebrow", COPY["hero.eyebrow"]);
  const heroEyebrowSub = useBlock("media", "hero.eyebrow_sub", COPY["hero.eyebrow_sub"]);
  const heroAside = useBlock("media", "hero.aside", COPY["hero.aside"]);
  const titleBooked = useBlock("media", "hero.title_booked", COPY["hero.title_booked"]);
  const titleListing = useBlock("media", "hero.title_listing", COPY["hero.title_listing"]);
  const heroImage = useImageBlock("media", "hero.image");
  const stillsHeading = useBlock("media", "stills.heading", COPY["stills.heading"]);
  const indexHeading = useBlock("media", "index.heading", COPY["index.heading"]);
  const subjectsHeading = useBlock("media", "subjects.heading", COPY["subjects.heading"]);
  const notesHeading = useBlock("media", "notes.heading", COPY["notes.heading"]);
  const pressHeading = useBlock("media", "press.heading", COPY["press.heading"]);
  const pressLead = useBlock("media", "press.lead", COPY["press.lead"]);

  const slips: Slip[] = items
    ? items.map((m) => ({
        key: String(m.id),
        when: m.outlet ? `${monthYear(m.published_on)}, ${m.outlet}` : monthYear(m.published_on),
        title: m.title,
        body: m.description ?? "",
        status: "Published",
      }))
    : standingFor(launched).map((s) => ({
        key: s.what,
        when: s.when,
        title: s.what,
        body: s.detail,
        status: s.pending ? "Expected" : "Booked",
      }));

  /* The status line under the index heading. It used to float at the far
     right of the heading row, where it read as a stray; it now sits where a
     reader looks after the heading. */
  const status =
    load === "ready" && items
      ? `${items.length} ${items.length === 1 ? "entry" : "entries"}`
      : load === "empty"
        ? "Nothing published yet"
        : load === "failed"
          ? "The index could not be loaded"
          : "Loading the index";

  return (
    <>
      <Seo
        title="Press and appearances"
        description="Press coverage, interviews and podcast appearances featuring CLÉ Family Media, plus notes to editors and the press contact route."
        path="/media"
      />

      {/* ═══ OPENING, in the hero's frame. The meadow is the first sight of
          Finn and Fia on the page and the frame a journalist is most likely
          to want; the headline is the page's one piece of news. The quiet
          action is a hand-written anchor rather than a Button, because
          Button's `href` opens a new tab and this stays on the page. ═══ */}
      <PageHero
        id="media-h"
        asset="show.meadow"
        override={heroImage}
        position="center 60%"
        credit={<>Finn and Fia. A frame from the series.</>}
        eyebrow={
          <>
            {heroEyebrow}<span>{heroEyebrowSub}</span>
          </>
        }
        aside={<>{heroAside}</>}
        title={items ? emphasis(titleListing) : emphasis(titleBooked)}
        actions={
          <>
            <Button to="/contact">
              Press enquiries
              <IconArrow size={16} />
            </Button>
            <a href="#stills-h" className="btn btn-quiet">
              The title slates
            </a>
          </>
        }
      />

      {/* ═══ THE STILLS, on the studio wall.

          A press page exists to hand somebody a picture, and this one had not
          a single object on it: a column of listings, a kit of text, and a
          statement. The title slates are the show's own artwork and the
          thing a journalist actually wants, so they stand here as what they
          are, boards under one lamp on the bench they were made on. The
          heading is the thing worth knowing about them, not a label for the
          band; the offer of print resolution is a note under the bench.

          `StudioWall` was built for this and mounted nowhere. It is kept off
          the home page on purpose, because the same plates cannot stand
          twice on one page and the filmstrip there already has them. ═══ */}
      <Section labelledBy="stills-h" pad="normal" className="wall">
        <Container width="wide">
          <Settle>
            <h2 id="stills-h" className="t-h2 max-w-[22ch] scroll-mt-28">
              {stillsHeading}
            </h2>
          </Settle>
          <div className="mt-10 lg:mt-14">
            <StudioWall label="Title slates" meta="Series one" />
          </div>
          <p className={`${NOTE} mt-6`}>Ask and we will send them at print resolution.</p>
        </Container>
      </Section>

      {/* ═══ THE INDEX, on paper.
          Rows, not a room: a coverage index is a list of two entries, and
          rows on paper say that honestly while giving the rooms either side
          of it their effect back. The heading stands in a left track with
          the load state under it, the rows beside it.
          The state logic is unchanged: ready, empty and failed stay
          distinguished, because "could not load" must never render as
          "nothing has run". ═══ */}
      <Section labelledBy="index-h" pad="normal">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-24">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id="index-h" className="t-h1 max-w-[16ch]">{indexHeading}</h2>
              <p className="mt-6 font-mono text-[13px] uppercase tracking-[0.14em] text-muted" role="status">
                {status}
              </p>
            </div>

            <div>
              <ul className="border-t-[1.5px] border-rule">
                {slips.map((sl) => (
                  <li
                    key={sl.key}
                    className="grid gap-x-8 gap-y-2 border-b-[1.5px] border-rule py-7 sm:grid-cols-[minmax(0,0.3fr)_minmax(0,1fr)_minmax(0,0.24fr)] sm:py-8"
                  >
                    <p className="eyebrow eyebrow-sm">{sl.when}</p>
                    <div>
                      <h3 className="text-[18px] font-semibold leading-[1.3] text-ink">{sl.title}</h3>
                      {sl.body && <p className="t-body mt-2 max-w-[58ch] text-body">{sl.body}</p>}
                    </div>
                    <p className="font-mono text-[14px] uppercase tracking-[0.14em] text-muted sm:justify-self-end">
                      {sl.status}
                    </p>
                  </li>
                ))}
              </ul>

              {/* The links sit under the index rather than inside a row, so a
                  row stays one scannable line per entry. */}
              {items && items.some((m) => m.link) && (
                <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                  {items.filter((m) => m.link).map((m) => (
                    <li key={m.id}>
                      <TextLink href={m.link as string}>
                        Open {m.title}
                        <IconExternal size={14} />
                      </TextLink>
                    </li>
                  ))}
                </ul>
              )}

              {load === "failed" && (
                <p className="mt-8 max-w-[56ch] text-[16px] leading-[1.7] text-body">
                  The index could not be loaded just now, so the standing entries above are what is
                  known. Please try again shortly, or ask through the press route.
                </p>
              )}
              {load === "empty" && (
                <p className="mt-8 max-w-[56ch] text-[16px] leading-[1.7] text-body">
                  No coverage has run yet, so there is none on this page. The first piece to run
                  takes the next place on the shelf, with its outlet, its date and a link to the
                  original.
                </p>
              )}
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ WHAT WE ARE GLAD TO BE ASKED. The claim over a ruled set, the
          rows the full width of the page: the topic in a left column and
          its line and link beside it. Each row points at the page that
          already sets out the position, so a journalist can read the source
          first. ═══ */}
      <Section labelledBy="subjects-h" pad={["tight", "normal"]}>
        <Container width="wide">
          <Settle>
            <h2 id="subjects-h" className="t-h2 max-w-[20ch]">
              {subjectsHeading}
            </h2>
            <p className="mt-6 max-w-[62ch] text-[16px] leading-[1.7] text-body">
              Everything the company says publicly is on one of these pages, which is also where a
              quote should be checked against. If what you need is not on one of them, ask.
            </p>
          </Settle>

          <Settle as="ul" className="mt-10 border-t-[1.5px] border-rule lg:mt-12">
            {subjects.map((s) => (
              <li
                key={s.topic}
                className="grid gap-x-10 gap-y-3 border-b-[1.5px] border-rule py-7 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:py-8"
              >
                <h3 className="t-h3 max-w-[16ch]">{s.topic}</h3>
                <div>
                  <p className="max-w-[56ch] text-[16px] leading-[1.68] text-body">{s.line}</p>
                  <p className="mt-4">
                    <TextLink to={s.to}>
                      {s.cta}
                      <IconArrow size={15} />
                    </TextLink>
                  </p>
                </div>
              </li>
            ))}
          </Settle>
        </Container>
      </Section>

      {/* ═══ NOTES TO EDITORS, on the bench. The sheet lies flat on the
          bench the slates were made on, lit from the same side, with the
          route to a person beside it. It is the thing a journalist copies
          names and marks out of ten minutes before filing, so it gets the
          page's one dark room, not a narrow strip at the bottom.

          The sheet is the render kit's paper (`rk-corr__sheet`) without the
          studio around it: the bench IS the room here. The sheet reads
          `--shade` and `--az` from its wrapper, so they are set on the
          wrapper, and everything on the card names its own colour because
          the bench sets cream on everything it does not. ═══ */}
      <Section labelledBy="notes-h" className="bench">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-24">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id="notes-h" className="t-h2 max-w-[16ch]">
                {notesHeading}
              </h2>
              {/* No `text-body`: `.bench` sets cream, and body is an ink
                  brown that disappears on it. */}
              <p className="mt-7 max-w-[44ch] text-[17px] leading-[1.65]">
                Interview requests, artwork and anything you need checked before you file go
                through the press route on the contact page. It reaches the team directly.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <TextLink to="/contact">
                  Press enquiries
                  <IconArrow size={15} />
                </TextLink>
                <TextLink href={SITE.showUrl}>
                  The show's own site
                  <IconExternal size={14} />
                </TextLink>
              </div>
            </div>

            {/* Flat, lit by the bench and not posed by it: this is the block
                a journalist selects and copies from. */}
            <div
              className="rk-corr__sheet self-start text-ink"
              style={{ "--shade": "var(--color-ink)", "--az": "-32deg" } as React.CSSProperties}
            >
              <div className="mb-7 flex items-baseline justify-between gap-6 font-mono text-[13px] uppercase tracking-[0.14em] text-muted">
                <span>Press sheet</span>
                <span>CLÉ Family Media</span>
              </div>
              <dl>
                {notes.map((n) => (
                  <div
                    key={n.k}
                    className="grid grid-cols-1 gap-x-8 gap-y-1 border-b-[1.5px] border-rule-soft py-4 first:pt-0 sm:grid-cols-[8rem_minmax(0,1fr)]"
                  >
                    <dt className="font-mono text-[14.5px] uppercase tracking-[0.1em] text-muted">{n.k}</dt>
                    <dd className="text-[16px] leading-[1.6] text-ink">{n.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-7 font-mono text-[14.5px] uppercase tracking-[0.2em] text-muted">Ends</p>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ THE DEEP BAND. One line, one action. ═══ */}
      <Section deep labelledBy="press-h">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h2 id="press-h" className="t-h2 max-w-[18ch]">{pressHeading}</h2>
              <p className="t-lead mt-6 max-w-[48ch]">{pressLead}</p>
            </div>
            <div>
              <Button to="/contact" variant="primary">
                Press enquiries
                <IconArrow size={16} />
              </Button>
            </div>
          </Settle>
        </Container>
      </Section>
    </>
  );
}
