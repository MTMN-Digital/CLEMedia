import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Button, Container, Kicker, Lead, Section, TextLink } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
import { SITE } from "@/lib/site";
import type { MediaItem } from "@/lib/types";

/* ============================================================================
   Press and appearances, rebuilt 2026-10-06.

   WHAT WAS WRONG. Three identical cards headed Interviews, Podcasts and
   Press, each describing a category that contains nothing, then a note box
   saying the first appearances are still to come. A page that tells a
   journalist what an interview is.

   WHAT A PRESS PAGE IS FOR. One reader: somebody writing about the company
   who needs to get the facts right and reach a person. So the page is built
   as the things that reader actually uses. An index, ruled like a listings
   column, holding every appearance in date order. A short statement of what
   the company is glad to talk about, each line pointing at the page that
   documents it, so a journalist can read the source before the call. And a
   notes-to-editors sheet carrying the spellings, the trade marks, the
   founder's title and where the episodes are, which is the one thing every
   press page should have and almost none do.

   THE EMPTY STATE IS THE PAGE. One real fact exists: a UK podcast appearance
   booked for December, with more to follow around the app launch. It is not
   padded out with logos of publications that have not written anything, with
   a "featured in" strip, or with invented quotes. The index carries the one
   booking and a visibly pending row, and the rest of the page is useful on
   its own.

   Entries come from `media_items`, which Conor fills from the admin panel.
   The moment a row exists it takes over from the standing rows below, so
   nothing here has to be edited by hand when the first piece runs.
   ========================================================================== */

/* What the company is glad to be asked about, each pointing at the page that
   already sets out its position, so nobody is quoted inventing one. */
const SUBJECTS: { topic: string; line: string; to: string; cta: string }[] = [
  {
    topic: "AI in children's production",
    line: "Where a tool is used, where a person decides, and the lines the company will not cross. The position is written down and the review stages are named.",
    to: "/ethical-ai",
    cta: "Read the position",
  },
  {
    topic: "Watch, Play, Learn",
    line: "Why an episode is the beginning of the thing rather than the whole of it, and what the education side of the company checks before a script exists.",
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
    topic: `${SITE.playerName}, in development`,
    line: "What the product is for, what it will and will not do, and why it is being described as in development rather than announced.",
    to: "/app",
    cta: "See the app",
  },
];

/* The standing rows, used until `media_items` has anything in it. The booking
   is the client's own fact and is stated exactly as given: a UK podcast, in
   December, with more expected around the app launch. No show name, no date,
   no host, because none has been supplied. */
const STANDING: { when: string; what: string; detail: string; pending?: boolean }[] = [
  {
    when: "December",
    what: "A UK podcast appearance",
    detail: "Booked. The show, the episode and the link go here once it goes out.",
  },
  {
    when: "To be confirmed",
    what: "More around the app launch",
    /* First use of the player's name on this page, so it carries the mark. */
    detail: `Further appearances are expected as ${SITE.playerName}™ launches.`,
    pending: true,
  },
];

/* Notes to editors. Every line is already true somewhere else on this site,
   which is the test for anything on this sheet. */
const NOTES: { k: string; v: string }[] = [
  { k: "Company", v: "CLÉ Family Media. Note the É." },
  { k: "Series", v: "The Pawsitive Pugs & Pals®, written with the ampersand and the registered mark." },
  { k: "Player", v: "PupsPlayer™, one word, capital P twice. In development, not released." },
  { k: "Founder", v: "Conor Sexton, Founder and CEO." },
  { k: "Characters", v: "Finn, the fawn pug. Fia, the black pug." },
  { k: "Episodes", v: "Series one, four episodes, free to watch. The show's own site carries them." },
  { k: "Imagery", v: "No AI-generated imagery is used on this site. Artwork and stills come through the press route." },
];

function useMediaItems(): MediaItem[] | null {
  const [items, setItems] = useState<MediaItem[] | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      // Dynamic, like the shop's catalogue: the Supabase client stays out of
      // the bundle every other page downloads.
      const { supabase } = await import("@/lib/supabase");
      if (!supabase) return;
      const { data } = await supabase
        .from("media_items")
        .select("id, title, outlet, published_on, description, thumbnail, link, embed_url, sort_order")
        .order("sort_order", { ascending: true })
        .order("published_on", { ascending: false });
      if (live && data?.length) setItems(data as MediaItem[]);
    })().catch(() => {
      /* A press index that fails to load shows the standing rows. */
    });
    return () => {
      live = false;
    };
  }, []);

  return items;
}

function monthYear(iso: string | null): string {
  if (!iso) return "Undated";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Undated";
  return new Intl.DateTimeFormat("en-IE", { month: "long", year: "numeric" }).format(d);
}

export default function Media() {
  const items = useMediaItems();

  return (
    <>
      <Seo
        title="Press and appearances"
        description="Press coverage, interviews and podcast appearances featuring CLÉ Family Media, plus notes to editors and the press contact route."
        path="/media"
      />

      {/* ═══ OPENING. The heading on the left, the one real fact on the right,
          set as the next entry in the index rather than buried in a note box
          at the bottom of the page. ═══ */}
      <Section className="!pb-10 sm:!pb-14">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-20">
            <div>
              <Kicker>Press</Kicker>
              <h1 className="t-display mt-6 max-w-[12ch]">Press and appearances</h1>
              <Lead className="mt-7 max-w-[46ch]">
                Interviews, podcast appearances and coverage of the company and the series.
                Everything links straight out to the original. There is not much of it yet, and
                this page would rather be short than padded.
              </Lead>
            </div>

            <div className="border-t border-rule pt-6 lg:pb-2">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">Next</p>
              <p className="mt-4 text-[22px] leading-[1.3] text-ink sm:text-[25px]">
                A UK podcast appearance is booked for December, with more to follow around the app
                launch.
              </p>
              <p className="mt-4 max-w-[40ch] text-[15px] leading-[1.65] text-body">
                It appears in the index below, with the show and the link, on the day it goes out.
              </p>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ THE INDEX. A listings column: date on the left, the entry beside
          it, the link out on the right. It is the same shape whether it holds
          one standing row or forty real ones. ═══ */}
      <Section labelledBy="index-h" className="!pt-4">
        <Container width="wide">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2 id="index-h" className="t-h2">The index</h2>
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
              {items ? `${items.length} ${items.length === 1 ? "entry" : "entries"}` : "Nothing published yet"}
            </p>
          </div>

          <ol className="mt-9 border-t border-rule">
            {items
              ? items.map((m) => (
                  <li key={m.id} className="border-b border-rule">
                    <div className="grid grid-cols-1 gap-x-10 gap-y-2 py-7 md:grid-cols-[12rem_minmax(0,1fr)_auto]">
                      <p className="tnum font-mono text-[13px] leading-[1.6] text-muted">
                        {monthYear(m.published_on)}
                        {m.outlet && <span className="block normal-case tracking-normal text-body">{m.outlet}</span>}
                      </p>
                      <div>
                        <h3 className="t-h3">{m.title}</h3>
                        {m.description && (
                          <p className="mt-2 max-w-[56ch] text-[15.5px] leading-[1.65] text-body">
                            {m.description}
                          </p>
                        )}
                      </div>
                      {m.link && (
                        <p className="md:pt-1">
                          <TextLink href={m.link}>
                            Open
                            <IconExternal size={14} />
                          </TextLink>
                        </p>
                      )}
                    </div>
                  </li>
                ))
              : STANDING.map((s) => (
                  <li
                    key={s.what}
                    className={s.pending ? "border-b border-dashed border-rule" : "border-b border-rule"}
                  >
                    <div className="grid grid-cols-1 gap-x-10 gap-y-2 py-7 md:grid-cols-[12rem_minmax(0,1fr)_auto]">
                      <p className="tnum font-mono text-[13px] uppercase tracking-[0.08em] text-muted">
                        {s.when}
                      </p>
                      <div>
                        <h3 className={`t-h3 ${s.pending ? "text-muted" : ""}`}>{s.what}</h3>
                        <p className="mt-2 max-w-[56ch] text-[15.5px] leading-[1.65] text-body">{s.detail}</p>
                      </div>
                      <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted md:pt-2 md:text-right">
                        {s.pending ? "Expected" : "Booked"}
                      </p>
                    </div>
                  </li>
                ))}
          </ol>

          {!items && (
            <p className="mt-7 max-w-[62ch] text-[15.5px] leading-[1.7] text-body">
              No coverage has run yet, so there is none on this page. There is no logo strip of
              publications that have not written about us, and no quote nobody said.
            </p>
          )}
        </Container>
      </Section>

      {/* ═══ WHAT WE ARE GLAD TO BE ASKED. Rows, each pointing at the page
          that already sets out the position, so a journalist can read the
          source first. ═══ */}
      <Section labelledBy="subjects-h" className="well">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20 xl:gap-28">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id="subjects-h" className="t-h1 max-w-[13ch]">What we are glad to be asked about</h2>
              <p className="t-lead mt-7 max-w-[38ch] text-ink">
                Four subjects the company has a worked position on, and the page that sets each one
                out in full.
              </p>
              <p className="mt-8 max-w-[40ch] border-t border-rule pt-7 text-[16px] leading-[1.7] text-body">
                Everything the company says publicly is on one of these pages, which is also where
                a quote should be checked against. If what you need is not on one of them, ask.
              </p>
            </div>

            <ul className="border-t border-rule">
              {SUBJECTS.map((s) => (
                <li key={s.topic} className="border-b border-rule py-7">
                  <h3 className="t-h3">{s.topic}</h3>
                  <p className="mt-2.5 max-w-[56ch] text-[16px] leading-[1.68] text-body">{s.line}</p>
                  <p className="mt-4">
                    <TextLink to={s.to}>
                      {s.cta}
                      <IconArrow size={15} />
                    </TextLink>
                  </p>
                </li>
              ))}
            </ul>
          </Settle>
        </Container>
      </Section>

      {/* ═══ NOTES TO EDITORS. The sheet. Set in mono on a raised surface at a
          narrow measure, because it is a document, not a section: the thing a
          journalist copies names and marks out of ten minutes before filing.
          It breaks the page's measure deliberately, the way /story's pull
          quote does, by being narrower than everything around it. ═══ */}
      <Section labelledBy="notes-h" className="!pb-16">
        <Container width="text">
          <Settle>
            {/* card-still: the house card surface, with the hover lift turned
                off. A document does not rise when a cursor crosses it. */}
            <div className="card card-still rounded-[var(--radius-lg)] px-6 py-9 sm:px-10 sm:py-12">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule pb-5">
                <h2 id="notes-h" className="font-mono text-[13px] uppercase tracking-[0.16em] text-ink">
                  Notes to editors
                </h2>
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
                  CLÉ Family Media
                </p>
              </div>

              <dl className="mt-7">
                {NOTES.map((n) => (
                  <div
                    key={n.k}
                    className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule-soft py-4 sm:grid-cols-[8rem_minmax(0,1fr)]"
                  >
                    <dt className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">{n.k}</dt>
                    <dd className="text-[16px] leading-[1.6] text-ink">{n.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-7 text-[16px] leading-[1.7] text-body">
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

              <p className="mt-9 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">Ends</p>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ THE DEEP BAND. One line, one action. ═══ */}
      <Section deep labelledBy="press-h">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h2 id="press-h" className="t-h2 max-w-[18ch]">Writing about children's media?</h2>
              <p className="t-lead mt-6 max-w-[48ch] opacity-85">
                We would rather answer a question directly than be quoted from a web page. Tell us
                what you are working on and who you need.
              </p>
            </div>
            <div>
              <Button to="/contact">
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
