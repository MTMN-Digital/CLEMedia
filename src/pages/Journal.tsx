import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Container, Section, TextLink } from "@/components/ui";
import { Watermark } from "@/components/draw/Mark";
import { IconArrow } from "@/components/icons";
import { Contents, type ContentsRow } from "@/components/journal/Contents";
import { formatDate, useJournal, resolveStrands } from "@/components/journal/data";
import { useBlock } from "@/lib/content";
import { SITE } from "@/lib/site";
import "@/components/journal/journal.css";

/* The journal front page's editable copy, keyed by block key
   (src/lib/blocks.ts). The default, not a copy: each string is the page's
   own wording, character for character, rendered through
   useBlock("journal", key, COPY[key]) so an empty content_blocks table shows
   the page exactly as written here. The four standing rules are commitments
   in the client's name and are here so Conor can confirm, reword or strike
   one from the admin panel. The status rows count posts and are not here. */
export const COPY: Record<string, string> = {
  "hero.title": "Notes from the studio",
  "hero.eyebrow": "The journal of CLÉ Family Media",
  "status.cadence": "One piece a week, once we start",
  "intro.lead":
    "Written by the people who make The Pawsitive Pugs & Pals®, about the research behind it, how an episode is made, and what building a children's media company in Ireland is really like.",
  "intro.line": "Four strands. Each one is listed below with the honest answer to what is in it.",
  "rules.title": "How this journal is run",
  "rules.why":
    "A company that asks parents, educators and broadcasters to trust it should be willing to show its working. That is the whole of the reason this exists. It is not a content strategy and it is not written for a search engine. We would rather start late than start with filler.",
  "rules.heading":
    "Four standing rules, written down before there is anything to apply them to. That is the only time it is worth writing them down.",
  "rules.1.title": "Written by people here",
  "rules.1.line":
    "Every piece carries the name of whoever wrote it. Nothing on this journal is generated and published automatically, which is the same rule the episodes are made under.",
  "rules.1.link": "How the work is made and reviewed",
  "rules.2.title": "Corrections stay on the page",
  "rules.2.line":
    "If we get something wrong, the correction goes on the piece itself and says what changed. Nothing is quietly edited away.",
  "rules.3.title": "Nothing here is sponsored",
  "rules.3.line": "No piece is paid for, and there is no advertising anywhere on this site.",
  "rules.4.title": "Ask for a subject",
  "rules.4.line":
    "If something would be useful to you and it is not on the list, send it to us and it goes on the list.",
  "rules.4.link": "Tell us what to write about",
};

/* ============================================================================
   The journal index: a contents page.

   REBUILT 2026-10-28 (docs/SUBPAGE-PLANS-2026-10-28.md, "## journal"). The
   front matter of a periodical, on bare paper end to end:

   1. The masthead. The journal's name in .t-h1, the mono publisher line,
      and four status rows with dotted leaders running from the label to the
      honest answer (First piece, Cadence, Cost, Pieces published). Beside
      them, the lead and one line introducing the list.
   2. The contents. The four strands, each a name, a leader and its status,
      with what it is for underneath. The first row is inside the first
      screen at 1440 and at 390: a list opens on the list.
   3. Published pieces, newest first, which render ABOVE the contents the day
      there is one, headed by a single mono line rather than a count the
      masthead already carries.
   4. The colophon. The reason the journal exists as a paragraph (it was a
      heading, and it is a paragraph), then the four standing rules as a
      plain ruled dl with the two links inside the rules they belong to.

   The page ends on the colophon and the footer closes it. No panel, no
   bench, no navy band, no drawing, no buttons. The sign-up form the plan
   describes ships only once Conor confirms he will send the one email it
   promises (CONTENT-NEEDED), so rule 4's contact link is the page's action.

   Nothing here invents a post, a date, an author or an issue.
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

  const strandName = (categoryId: string | null) =>
    strands.find((s) => s.id && s.id === categoryId)?.name ?? null;

  /* EDITABLE FROM THE ADMIN: the page's own wording (COPY above) until a
     content_blocks row replaces it. Every hook runs on every render. */
  const heroTitle = useBlock("journal", "hero.title", COPY["hero.title"]);
  const heroEyebrow = useBlock("journal", "hero.eyebrow", COPY["hero.eyebrow"]);
  const cadence = useBlock("journal", "status.cadence", COPY["status.cadence"]);
  const introLead = useBlock("journal", "intro.lead", COPY["intro.lead"]);
  const introLine = useBlock("journal", "intro.line", COPY["intro.line"]);
  const rulesTitle = useBlock("journal", "rules.title", COPY["rules.title"]);
  const rulesWhy = useBlock("journal", "rules.why", COPY["rules.why"]);
  const rulesHeading = useBlock("journal", "rules.heading", COPY["rules.heading"]);
  const rules = [
    {
      title: useBlock("journal", "rules.1.title", COPY["rules.1.title"]),
      line: useBlock("journal", "rules.1.line", COPY["rules.1.line"]),
      link: { to: "/ethical-ai", label: useBlock("journal", "rules.1.link", COPY["rules.1.link"]) },
    },
    {
      title: useBlock("journal", "rules.2.title", COPY["rules.2.title"]),
      line: useBlock("journal", "rules.2.line", COPY["rules.2.line"]),
      link: null,
    },
    {
      title: useBlock("journal", "rules.3.title", COPY["rules.3.title"]),
      line: useBlock("journal", "rules.3.line", COPY["rules.3.line"]),
      link: null,
    },
    {
      title: useBlock("journal", "rules.4.title", COPY["rules.4.title"]),
      line: useBlock("journal", "rules.4.line", COPY["rules.4.line"]),
      link: { to: "/contact", label: useBlock("journal", "rules.4.link", COPY["rules.4.link"]) },
    },
  ];

  /* The count has three states, so the page never asserts an emptiness it
     has not established: "Loading" until the query answers, then "None yet"
     or the number. */
  const published = !settled ? "Loading" : posts.length === 0 ? "None yet" : String(posts.length);

  /* The status rows. "First piece" drops once a piece is on the page. */
  const status: { label: string; value: ReactNode; live?: boolean }[] = [
    ...(posts.length === 0 ? [{ label: "First piece", value: "In preparation" }] : []),
    { label: "Cadence", value: cadence },
    { label: "Cost", value: "Free to read" },
    { label: "Pieces published", value: published, live: true },
  ];

  return (
    <>
      <Seo
        title="Journal"
        description="Writing from CLÉ Family Media on children's media, early years education, responsible use of AI in production, and building a family media company in Ireland."
        path="/journal"
      />

      {/* ═══ THE MASTHEAD. Name, publisher line and status rows on the left,
          the lead and the one line that introduces the list on the right.
          One Settle over the three blocks; the leaders draw as their rows
          land (.leader in index.css, delayed by each row's --i). ═══ */}
      <Section pad="none" as="div" className="mk-host pt-8 lg:pt-14">
        <Watermark shape="sun" at="right" />
        <Container width="wide">
          <Settle className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-x-24 lg:gap-y-9">
            <div className="lg:col-start-1 lg:row-start-1">
              <h1 className="t-h1 max-w-[12ch]">{heroTitle}</h1>
              <p className="mt-5 font-mono text-[14px] uppercase tracking-[0.14em] text-body">
                {heroEyebrow}
              </p>
            </div>

            <dl className="jr-status lg:col-start-1 lg:row-start-2 lg:mt-1">
              {status.map((row, i) => (
                <div key={row.label} className="jr-status-row" style={{ "--i": i } as CSSProperties}>
                  <dt className="font-mono text-[14px] uppercase tracking-[0.14em] text-muted">
                    {row.label}
                  </dt>
                  <span className="leader" aria-hidden="true" />
                  <dd className="t-body tnum text-ink" aria-live={row.live ? "polite" : undefined}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-3">
              <p className="t-lead max-w-[36ch] text-body">{citeShow(introLead)}</p>
              <p className="t-body mt-7 max-w-[44ch] text-body">{introLine}</p>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ PUBLISHED. Renders only when there is something to put in it,
          and then ABOVE the contents: the pieces are the page, the strands
          become its index. Rows, not cards. The heading is one mono line;
          the count is already in the masthead. ═══ */}
      {posts.length > 0 && (
        <Section pad={["none", "none"]} className="mt-12 lg:mt-18" labelledBy="published-h">
          <Container width="wide">
            <h2 id="published-h" className="eyebrow eyebrow-sm">
              Newest first
            </h2>
            <Settle as="ol" className="mt-6 border-t-[1.5px] border-rule">
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

      {/* ═══ THE CONTENTS. The four strands as rows with leaders, the main
          content of a journal with nothing published yet. The list's own top
          rule is the rule under the masthead. See components/journal/Contents.tsx. ═══ */}
      <Section pad="none" as="div" className="mt-10 lg:mt-18">
        <Container width="wide">
          <Contents rows={rows} />
        </Container>
      </Section>

      {/* ═══ THE COLOPHON. The reason the journal exists, as a paragraph, and
          the four standing rules a reader can hold the company to, as plain
          ruled rows: no leaders here, no ground, no buttons, no drawing. The
          last thing on the page before the footer. ═══ */}
      <Section pad={["none", "normal"]} labelledBy="rules-h" className="mt-16 lg:mt-24">
        <Container width="wide">
          <Settle className="hairline grid gap-x-16 gap-y-10 pt-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-x-20 lg:pt-12">
            <div>
              <h2 id="rules-h" className="t-h3 text-ink">
                {rulesTitle}
              </h2>
              <p className="t-body mt-5 max-w-[40ch] text-body">{rulesWhy}</p>
              <p className="t-body mt-5 max-w-[40ch] text-muted">{rulesHeading}</p>
            </div>

            <dl>
              {rules.map((r) => (
                <div
                  key={r.title}
                  className="grid gap-x-10 gap-y-2 border-b-[1.5px] border-rule py-5 first:border-t-[1.5px] lg:first:border-t-0 lg:grid-cols-[14rem_minmax(0,1fr)]"
                >
                  <dt className="t-body max-w-[16ch] font-semibold text-ink">{r.title}</dt>
                  <dd className="t-body max-w-[48ch] text-body">
                    {r.line}
                    {r.link && (
                      <span className="mt-3 block">
                        <TextLink to={r.link.to} className={TAP}>
                          {r.link.label}
                          <IconArrow size={15} />
                        </TextLink>
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Settle>
        </Container>
      </Section>
    </>
  );
}

/* A 44px tap box on a text link, without moving the line it sits on. */
const TAP = "py-2.5 -my-2.5";

/* The show's title in running text is set as <cite>, never as stress. The lead is
   an editable string, so the title is found in it and wrapped here; if Conor
   rewrites the lead without the title, the text renders plain. */
function citeShow(text: string): ReactNode {
  const parts = text.split(SITE.showName);
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <cite>{SITE.showName}</cite>}
      {part}
    </Fragment>
  ));
}
