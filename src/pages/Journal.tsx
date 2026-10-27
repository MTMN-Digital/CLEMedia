import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Settle } from "@/components/Settle";
import { Button, Section, TextLink, Container } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { Contents, type ContentsRow } from "@/components/journal/Contents";
import { Correction } from "@/components/journal/Correction";
import { formatDate, useJournal, resolveStrands } from "@/components/journal/data";
import { useBlock, emphasis } from "@/lib/content";

/* The journal front page's editable copy, keyed by block key
   (src/lib/blocks.ts). The default, not a copy: each string is the page's
   own wording, character for character, rendered through
   useBlock("journal", key, COPY[key]) so an empty content_blocks table shows
   the page exactly as written here. The aside counts posts and the four
   standing rules are commitments in the client's name, so neither is here. */
export const COPY: Record<string, string> = {
  "hero.eyebrow": "The journal of CLÉ Family Media",
  "hero.eyebrow_sub": "Four strands. One piece a week, once we start.",
  "hero.title": "Notes from the *studio*",
  "why.heading":
    "A company that asks parents, educators and broadcasters to trust it should be willing to show its working.",
  "strands.heading": "The research, how it is made, parents helping parents, and building CLÉ.",
  "rules.heading": "Four standing rules, written down before there is anything to apply them to.",
};

/* ============================================================================
   The journal index.

   There are no posts, so the page is honestly empty and says so, in the order
   a reader needs it: what the journal is and who writes it (the opening and
   the first section), a status line that states where things stand, the four
   strands as the main content, then the standing rules on the one deep band.

   THE DRAWN FRONT PAGE IS GONE. It was a picture of content that does not
   exist, set at 26rem with 9px labels. Its real information (the masthead name
   and the four strand names) is set at reading size instead. Nothing here
   looks like an article: no titles, authors, dates or excerpts are invented.

   THE MASTHEAD BAND IS GONE TOO, 2026-10-27. A box of rules on a pale band,
   with the name in a light weight, had character and read as timid next to
   the home hero. The same words now sit in the corners of the hero's own
   frame (see components/PageHero.tsx): the journal's name and cadence top
   left, its status top right, the title bottom left in the hero face. The
   "Where it stands" card that floated beside the opening prose is a small
   right aligned status line, which is what a status is.

   HEADINGS ARE THE CLAIMS. "Why a children's media company keeps a journal"
   was a filing label over the sentence that actually mattered; the sentence
   is the heading now. The strands are a ruled index on the bench rather than
   four matched cards on a desk, because four cards saying "in preparation"
   is the same stutter four times.

   IT IS STILL THE LIVE INDEX. Publish a piece and the status, the published
   list and the index counts fill in from the CMS.
   ========================================================================== */

export default function Journal() {
  const { posts, categories, settled } = useJournal();

  const strands = resolveStrands(categories);
  const rows: ContentsRow[] = strands.map((s) => ({
    slug: s.slug,
    name: s.name,
    blurb: s.blurb,
    count: s.id ? posts.filter((p) => p.category_id === s.id).length : 0,
  }));

  const latest = posts[0] ?? null;
  const strandName = (categoryId: string | null) =>
    strands.find((s) => s.id && s.id === categoryId)?.name ?? null;
  const published = `${posts.length} ${posts.length === 1 ? "piece" : "pieces"} published`;

  /* EDITABLE FROM THE ADMIN, 2026-10-27: the page's own wording (COPY above)
     until a content_blocks row replaces it. The headline's accent word is
     written between *stars*. */
  const heroEyebrow = useBlock("journal", "hero.eyebrow", COPY["hero.eyebrow"]);
  const heroEyebrowSub = useBlock("journal", "hero.eyebrow_sub", COPY["hero.eyebrow_sub"]);
  const heroTitle = useBlock("journal", "hero.title", COPY["hero.title"]);
  const whyHeading = useBlock("journal", "why.heading", COPY["why.heading"]);
  const strandsHeading = useBlock("journal", "strands.heading", COPY["strands.heading"]);
  const rulesHeading = useBlock("journal", "rules.heading", COPY["rules.heading"]);

  return (
    <>
      <Seo
        title="Journal"
        description="Writing from CLÉ Family Media on children's media, early years education, responsible use of AI in production, and building a family media company in Ireland."
        path="/journal"
      />

      {/* ═══ THE OPENING, in the hero's frame. The plain wall panel: there is
          no picture for a journal that has not published anything, and a
          frame from the series above "Notes from the studio" would promise a
          piece about the series. Status top right reads from the CMS once
          there is something to count. ═══ */}
      <PageHero
        id="journal-h"
        tone="wall"
        size="short"
        eyebrow={
          <>
            {heroEyebrow}
            <span>{heroEyebrowSub}</span>
          </>
        }
        aside={posts.length > 0 ? <>{published}. Free to read.</> : <>Issue one, in preparation. Free to read.</>}
        title={emphasis(heroTitle)}
      />

      {/* ═══ WHY IT EXISTS. The margin carries who writes it, the column
          carries the one sentence that is the reason, then the rest of the
          paragraph and the way to the page that shows the working. The same
          margin-and-column the post template reads in, so the index and a
          piece are visibly one publication. ═══ */}
      <Section labelledBy="why-h" pad="normal">
        <Container width="wide">
          <Settle className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-x-24">
            <p className="t-lead max-w-[36ch] text-body lg:pt-3">
              A journal written by the people who make <em>The Pawsitive Pugs &amp; Pals</em>&reg;,
              about the research behind it, how an episode is made, and what building a
              children's media company in Ireland is really like.
            </p>
            <div>
              <h2 id="why-h" className="t-h1 max-w-[22ch]">
                {whyHeading}
              </h2>
              <p className="t-prose mt-8 max-w-[52ch] text-body">
                That is the whole of the reason this exists. It is not a content strategy and it
                is not written for a search engine. We would rather start late than start with
                filler.
              </p>
              <div className="mt-7">
                <TextLink to="/ethical-ai">
                  How the work is made and reviewed
                  <IconArrow size={15} />
                </TextLink>
              </div>
            </div>
          </Settle>

          {/* Where it stands, as a status line. Three states, not two: while
              the query is in flight, or if it failed, the line says what it is
              doing instead of announcing an emptiness it has not established. */}
          <p
            className="ml-auto mt-10 max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body lg:mt-12"
            aria-live="polite"
          >
            {!settled
              ? "Where it stands. Loading the journal. One moment: the index below fills in as soon as it answers."
              : latest
                ? `Where it stands. ${published}. Newest first, with the strands below filling in from the top.`
                : "Where it stands. Nothing is published yet. The first piece is being written. When it goes up it appears here, newest first, and the strands below fill in from the top."}
          </p>
        </Container>
      </Section>

      {/* ═══ PUBLISHED. Renders only when there is something to put in it, so
          the page never carries an empty list under a heading. Rows, not
          cards: a date, a strand, a headline and a standfirst is what a
          contents listing is, and it stays readable at four or forty. The
          heading is the count, which is the one fact this section has. ═══ */}
      {posts.length > 0 && (
        <Section pad={["none", "normal"]} labelledBy="published-h">
          <Container width="wide">
            <h2 id="published-h" className="t-h2 max-w-[20ch]">
              {published}, newest first.
            </h2>
            <Settle as="ol" className="mt-10 border-t-[1.5px] border-rule">
              {posts.map((p) => (
                <li key={p.id} className="border-b-[1.5px] border-rule">
                  <Link
                    to={`/journal/${p.slug}`}
                    className="group grid grid-cols-1 gap-x-10 gap-y-2 py-7 sm:py-8 lg:grid-cols-[10rem_minmax(0,1fr)_2rem]"
                  >
                    <span className="font-mono text-[14.5px] uppercase tracking-[0.14em] text-muted">
                      <span className="tnum block">{formatDate(p.published_at) ?? ""}</span>
                      <span className="mt-1 block text-red-deep">
                        {strandName(p.category_id) ?? ""}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[clamp(1.25rem,1.1rem+0.8vw,1.75rem)] leading-[1.14] text-ink">
                        {p.title}
                      </span>
                      {p.excerpt && (
                        <span className="t-body mt-2.5 block max-w-[62ch] text-body">
                          {p.excerpt}
                        </span>
                      )}
                    </span>
                    <span className="hidden self-center text-muted transition-colors group-hover:text-red-deep lg:block">
                      <IconArrow size={18} />
                    </span>
                  </Link>
                </li>
              ))}
            </Settle>
          </Container>
        </Section>
      )}

      {/* ═══ THE FOUR STRANDS. The main content of an empty journal, on the
          bench, at the full width: the four named in the heading, then one
          ruled index with each name large, what it is for, and the honest
          answer to what is in it. See components/journal/Contents.tsx. ═══ */}
      <Section className="bench" pad="open" labelledBy="strands-h">
        <Container width="wide">
          <h2 id="strands-h" className="t-h2 max-w-[24ch]">
            {strandsHeading}
          </h2>
          <div className="mt-12 sm:mt-16">
            <Contents rows={rows} />
          </div>
        </Container>
      </Section>

      {/* ═══ HOW IT WORKS, on the one deep band. The journal's own standing
          rules, as rows on a navy ground. Four commitments rather than four
          features, and every one of them is something a reader can hold us
          to. The heading is the rules' own first line; the rows are the
          object it introduces. ═══ */}
      <Section deep labelledBy="rules-h">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div>
              <h2 id="rules-h" className="t-h2 max-w-[18ch]">
                {rulesHeading}
              </h2>
              <p className="t-body mt-6 max-w-[40ch] opacity-85">
                That is the only time it is worth writing them down.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button to="/contact">
                  Tell us what to write about
                  <IconArrow size={16} />
                </Button>
                <Button to="/story" variant="quiet">
                  The founder's story
                </Button>
              </div>

              {/* The one drawn object on the page, and the one rule of the
                  four that is a shape rather than a sentence. Almost every
                  publisher swaps the wrong line out and leaves no sign;
                  drawing the difference is the argument.
                  See components/journal/Correction.tsx. */}
              <div className="mt-12">
                <Correction />
              </div>
            </div>

            <ul className="border-t-[1.5px] border-edge-dark">
              {RULES.map((r) => (
                <li
                  key={r.title}
                  className="grid gap-x-10 gap-y-3 border-b-[1.5px] border-edge-dark py-7 sm:py-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
                >
                  <h3 className="t-h3 max-w-[14ch]">{r.title}</h3>
                  <p className="t-body max-w-[46ch] opacity-85">{r.line}</p>
                </li>
              ))}
            </ul>
          </Settle>
        </Container>
      </Section>
    </>
  );
}

/* The standing rules. Each one is a commitment in the client's name, so each
   one is listed in CONTENT-NEEDED.md for Conor to confirm or strike. The first
   is the only one already stated elsewhere on the site: the home page and the
   Responsible AI page both say nothing is generated and published
   automatically, and this applies the same rule to the writing. */
const RULES: { line: string; title: string }[] = [
  {
    title: "Written by people here",
    line: "Every piece carries the name of whoever wrote it. Nothing on this journal is generated and published automatically, which is the same rule the episodes are made under.",
  },
  {
    title: "Corrections stay on the page",
    line: "If we get something wrong, the correction goes on the piece itself and says what changed. Nothing is quietly edited away.",
  },
  {
    title: "Nothing here is sponsored",
    line: "No piece is paid for, and there is no advertising anywhere on this site.",
  },
  {
    title: "Ask for a subject",
    line: "If something would be useful to you and it is not on the list, send it to us and it goes on the list.",
  },
];
