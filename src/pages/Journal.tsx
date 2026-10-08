import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { Button, Container, Section, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { Contents, type ContentsRow } from "@/components/journal/Contents";
import { FrontPage } from "@/components/journal/FrontPage";
import { formatDate, resolveStrands, useJournal } from "@/components/journal/data";

/* ============================================================================
   The journal index.

   WHAT THIS PAGE HAS TO DO. There are no posts. There will not be any for a
   while. The previous version answered that with an eyebrow, a two line
   heading, four filter pills and four identical rounded cards that each said
   "First post arriving shortly", which is the single most recognisable
   AI generated layout there is and, worse, made an empty journal look like a
   broken one.

   So this is not a blog index with nothing in it. It is a publication's own
   front matter: a masthead, a plain statement of what the journal is for, the
   front page standing on the bench with its lead slot honestly empty, and the
   four strands set as a contents page. A reader who lands here learns what we
   are going to write about and why, and is told in words that nothing is
   published yet. Nothing is faked: no dates, no authors, no reading times, no
   sample headlines.

   IT IS ALSO THE LIVE INDEX. Publish a piece and the masthead rail, the front
   page's lead slot, the contents counts and the published list all fill in
   from the CMS. The written copy is the state the page is in today, not a
   placeholder for a build that comes later.

   THE FILTER PILLS ARE GONE. Filtering four strands that contain nothing is
   four controls that do nothing, and when pieces do exist the strand is on
   every row of the list. They come back the day there is enough here to need
   them, which is not a decision to take before the first ten pieces.
   ========================================================================== */

export default function Journal() {
  const { posts, categories } = useJournal();

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
      <Section className="wall" labelledBy="journal-h">
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
            <div className="mt-6 border-t border-rule pt-3">
              <ul className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-body">
                <li>Four strands</li>
                <li>One piece a week, once we start</li>
                <li>Free to read</li>
              </ul>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ WHY IT EXISTS, beside the object. The prose keeps a reading
          measure and the front page takes the half of the frame that used to
          be empty paper. ═══ */}
      <Section className="!pb-16 sm:!pb-20">
        {/* The narrow measure of the three. The masthead above and the contents
            below both run at the 1560 cap; this one does not, because a block
            of prose beside one object does not need the width and taking it
            left a lane of empty paper between the two. */}
        <Container>
          {/* The right column is sized to the object, not to a fraction of the
              page. At `0.98fr` the sheet sat right aligned inside a column half
              again its own width and opened a hole of empty paper between the
              prose and the render, which is the fault this page is being
              rebuilt to fix. */}
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14">
            <Settle className="lg:pt-2">
              <h2 className="t-h2 max-w-[18ch]">Why a children's media company keeps a journal</h2>
              <div className="mt-7 max-w-[58ch] space-y-5 text-[17px] leading-[1.72] text-body">
                <p>
                  A company that asks parents, educators and broadcasters to trust it should be
                  willing to show its working. That is the whole of the reason this exists.
                </p>
                <p>
                  It is not a content strategy and it is not written for a search engine. Four
                  strands: the research the model rests on, how an episode of{" "}
                  <em>The Pawsitive Pugs &amp; Pals</em>&reg; is actually made, what we have
                  learned as parents, and what building a children's media company in Ireland is
                  really like.
                </p>
                <p className="text-ink">
                  Nothing is published yet. The first piece is being written. When it goes up it
                  appears here, newest first, and the contents below fill in from the top. We
                  would rather start late than start with filler.
                </p>
              </div>
              <div className="mt-8">
                <TextLink to="/ethical-ai">
                  How the work is made and reviewed
                  <IconArrow size={15} />
                </TextLink>
              </div>
            </Settle>

            <Wipe>
              <FrontPage
                latest={latest}
                latestStrand={latest ? strandName(latest.category_id) : null}
                className="mx-auto w-full max-w-[26rem] lg:mr-0"
              />
            </Wipe>
          </div>
        </Container>
      </Section>

      {/* ═══ PUBLISHED. Renders only when there is something to put in it, so
          the page never carries an empty list under a heading. Rows, not
          cards: a date, a strand, a headline and a standfirst is what a
          contents listing is, and it stays readable at four or forty. ═══ */}
      {posts.length > 0 && (
        <Section className="!pt-0" labelledBy="published-h">
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

      {/* ═══ THE CONTENTS. On card stock with its own tab, the way a running
          order is pinned up in a production office: the same object the home
          page uses for the six review stages, so the two pages read as one
          site. ═══ */}
      <Section className="!pt-0" labelledBy="strands-h">
        <Container width="wide">
          <div className="card-stock card-still px-5 pb-6 pt-9 sm:px-10 sm:pt-10 lg:px-14">
            <span className="card-tab" aria-hidden="true">
              CONTENTS
            </span>
            <div className="max-w-[46ch]">
              <h2 id="strands-h" className="t-h2">
                The four strands
              </h2>
              <p className="t-body mt-4 text-body">
                What each one is for, and what is in it. The right hand column is the honest
                answer to the second half of that.
              </p>
            </div>
            <Contents rows={rows} />
            <p className="mt-6 font-mono text-[11.5px] uppercase tracking-[0.14em] text-muted">
              Working names, set from the admin panel
            </p>
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
