import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Button, Container, Section, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { Contents, type ContentsRow } from "@/components/journal/Contents";
import { formatDate, resolveStrands, useJournal } from "@/components/journal/data";

/* ============================================================================
   The journal index.

   There are no posts, so the page is honestly empty and says so, in the order
   a reader needs it: what the journal is and who writes it (masthead and
   opening), a slip of card that states where things stand, the four strands as
   the main content, then the standing rules on the one deep band.

   THE DRAWN FRONT PAGE IS GONE. It was a picture of content that does not
   exist, set at 26rem with 9px labels. Its real information (the masthead name
   and the four strand names) is now set at reading size, and the "lead slot is
   empty" statement is a card in plain type. Nothing here looks like an article:
   no titles, authors, dates or excerpts are invented.

   IT IS STILL THE LIVE INDEX. Publish a piece and the masthead rail, the
   contents counts and the published list fill in from the CMS.
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

  return (
    <>
      <Seo
        title="Journal"
        description="Writing from CLÉ Family Media on children's media, early years education, responsible use of AI in production, and building a family media company in Ireland."
        path="/journal"
      />

      {/* ═══ THE MASTHEAD. Edge to edge on a wall a stop deeper than the
          paper, and set at the width of the page rather than in a column half
          the frame wide, because a masthead that does not span the sheet is
          not a masthead. The one use of the hero face on this page. ═══ */}
      <Section className="wall" labelledBy="journal-h" pad="tight">
        <Container width="wide">
          <Settle>
            {/* Stacked below sm. Side by side, the two halves of the rail each
                wrapped to two lines on a 390 screen and the right one lost its
                alignment with the rule under it. */}
            <div className="flex flex-col gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-body sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:text-[11px]">
              <span>The journal of CL&Eacute; Family Media</span>
              <span className="tnum shrink-0 sm:text-right">
                {posts.length > 0
                  ? `${posts.length} ${posts.length === 1 ? "piece" : "pieces"} published`
                  : "Issue one, in preparation"}
              </span>
            </div>
            <div className="mt-3 border-t-2 border-[var(--color-ink)]" />
            {/* Sized to span the sheet. At 7.4vw the words stopped two thirds
                of the way across a 1440 frame and the masthead read as a
                heading that happened to be large, which is not the same
                object. */}
            <h1
              id="journal-h"
              className="mt-6 font-hero text-[clamp(2.75rem,0.4rem+9.1vw,9rem)] font-normal leading-[0.92] tracking-[-0.025em] text-ink"
            >
              Notes from the studio
            </h1>
            <div className="mt-8 grid gap-6 border-t border-rule pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
              <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-body">
                Four strands. One piece a week, once we start. Free to read.
              </p>
              <p className="t-lead max-w-[44ch] text-ink">
                A journal written by the people who make <em>The Pawsitive Pugs &amp; Pals</em>&reg;,
                about the research behind it, how an episode is made, and what building a
                children's media company in Ireland is really like.
              </p>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ WHY IT EXISTS, on paper, in the narrow measure. Prose left, one
          slip of card right that states where things stand in type you can
          read. ═══ */}
      <Section labelledBy="why-h" pad="tight">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
            <Settle>
              <h2 id="why-h" className="t-h2 max-w-[18ch]">Why a children's media company keeps a journal</h2>
              <div className="mt-7 max-w-[58ch] space-y-5 t-prose text-body">
                <p>
                  A company that asks parents, educators and broadcasters to trust it should be
                  willing to show its working. That is the whole of the reason this exists.
                </p>
                <p>
                  It is not a content strategy and it is not written for a search engine. We would
                  rather start late than start with filler.
                </p>
              </div>
              <div className="mt-8">
                <TextLink to="/ethical-ai">
                  How the work is made and reviewed
                  <IconArrow size={15} />
                </TextLink>
              </div>
            </Settle>

            <Settle className="self-start">
              <div className="card-stock card-still relative px-6 pb-7 pt-9 sm:px-8">
                <span className="card-tab uppercase">Where it stands</span>
                {/* Three states, not two. While the query is in flight, or if
                    it failed, the card says what it is doing instead of
                    announcing an emptiness it has not established. */}
                <p className="font-display text-[1.5rem] leading-[1.15] text-ink">
                  {!settled
                    ? "Loading the journal."
                    : latest
                      ? `${posts.length} ${posts.length === 1 ? "piece" : "pieces"} published.`
                      : "Nothing is published yet."}
                </p>
                <p className="t-body mt-3 text-body">
                  {!settled
                    ? "One moment. The index below fills in as soon as it answers."
                    : latest
                      ? "Newest first, with the strands below filling in from the top."
                      : "The first piece is being written. When it goes up it appears here, newest first, and the strands below fill in from the top."}
                </p>
              </div>
            </Settle>
          </div>
        </Container>
      </Section>

      {/* ═══ PUBLISHED. Renders only when there is something to put in it, so
          the page never carries an empty list under a heading. Rows, not
          cards: a date, a strand, a headline and a standfirst is what a
          contents listing is, and it stays readable at four or forty. ═══ */}
      {posts.length > 0 && (
        <Section pad={["none", "normal"]} labelledBy="published-h">
          <Container width="wide">
            <h2 id="published-h" className="t-h2">
              Published
            </h2>
            <Settle as="ol" className="mt-8 border-t border-rule">
              {posts.map((p) => (
                <li key={p.id} className="border-b border-rule">
                  <Link
                    to={`/journal/${p.slug}`}
                    className="group grid grid-cols-1 gap-x-10 gap-y-2 py-7 sm:py-8 lg:grid-cols-[10rem_minmax(0,1fr)_2rem]"
                  >
                    <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
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
          wall, at the full width: each one named large with what it is for. ═══ */}
      <Section className="wall" labelledBy="strands-h">
        <Container width="wide">
          <div className="max-w-[46ch]">
            <h2 id="strands-h" className="t-h2">
              The four strands
            </h2>
            <p className="t-body mt-4 text-body">
              What each one is for. The status beside it is the honest answer to what is in it.
            </p>
          </div>
          <div className="mt-10 sm:mt-14">
            <Contents rows={rows} />
          </div>
        </Container>
      </Section>

      {/* ═══ HOW IT WORKS, on the one deep band. The journal's own standing
          rules, as rows on a navy ground. Four commitments rather than four
          features, and every one of them is something a reader can hold us
          to. ═══ */}
      <Section deep labelledBy="rules-h">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div>
              <h2 id="rules-h" className="t-h2 max-w-[14ch]">
                How this journal works
              </h2>
              <p className="t-lead mt-6 max-w-[40ch] opacity-85">
                Four standing rules, written down before there is anything to apply them to, which
                is the only time it is worth writing them down.
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
            </div>

            <ul className="border-t border-white/20">
              {RULES.map((r) => (
                <li
                  key={r.title}
                  className="grid gap-x-10 gap-y-2 border-b border-white/20 py-6 sm:py-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
                >
                  <h3 className="text-[17px] font-semibold">{r.title}</h3>
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
const RULES: { title: string; line: string }[] = [
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
