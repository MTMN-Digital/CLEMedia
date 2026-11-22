import { useRef, useState } from "react";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { ProductionFlat } from "@/components/ethical-ai/ProductionFlat";
import { TheLineTable } from "@/components/ethical-ai/TheLineTable";
import { ToolsTable } from "@/components/ethical-ai/ToolsTable";
import { ForTheChild } from "@/components/ethical-ai/ForTheChild";
import { STATIONS } from "@/components/ethical-ai/stations";
import { APPROVED_BY, ADOPTED, REVISED } from "@/components/ethical-ai/document";
import { COPY } from "@/components/ethical-ai/copy";
import { QUESTION_ITEMS, PHASE_ITEMS, COMMITMENT_ITEMS, REFUSAL_ITEMS } from "@/components/ethical-ai/lists";
import {
  useActiveSection,
  DocSheet,
  DOC_GRID,
  DocContents,
  DocStatus,
  DocClause,
  DocFoot,
  DocSubClause,
  REVISED_LABEL,
  longDate,
  DocPublisher,
  DocumentsShelf,
} from "@/components/doc";
import { TextLink, Container, DisclosurePanel, Section } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { useList, useBlock } from "@/lib/content";
import "@/components/ethical-ai/pos.css";

/* ============================================================================
   Responsible AI: the company's position, published as a document.

   The most important trust page on the site, for investors and educators. A
   company that makes children's media with AI tools has to say exactly what
   the tools do, what people decide, and where the work can be stopped.

   REBUILT 2026-10-28 (docs/SUBPAGE-PLANS-2026-10-28.md, "## ethical-ai").
   The page used to open on a dark panel with the position line set large in
   the hero face, then said the same position six times under six claim
   headings across five bands. An investor wants a document with clauses, not
   a speech given six times. So it is a position statement now, on the same
   shell as /privacy, /terms and /cookies (components/doc): one sheet of
   card with a "Position statement" tab, a title block with the document's
   facts, a contents rail, six numbered clauses and an appendix, with the
   production line set into it as Figure 1 the way a figure sits in a
   research paper. The page is type, numbers and one drawing. No bands, no
   buttons, no boxes.

   THE FACTS ON THE TITLE BLOCK are only the ones the company has set.
   "Wording last revised" is the day the wording was last written (REVISED
   in components/ethical-ai/document.ts), labelled so it cannot read as
   adoption. "Adopted" and "Approved by" render only when the client supplies
   them (ADOPTED, APPROVED_BY are null until then); there is no version
   constant to print. "Applies to" names the episodes only, because the
   position text in stations.ts covers production of the episodes and
   nothing covers the activity books. The tools table has no "Where on the
   line" column until TOOL_PLACEMENT (stations.ts) holds the client's own
   sentence, and no phase number is attached to the tools anywhere on the
   page.

   THE SUB-CLAUSE NUMBERING IN CLAUSE 2. The company counts five phases and
   says production is not one of them (stations.ts: "Production is not one of
   the five"). The document keeps that count: the five phases are 2.1 to 2.5
   and carry the company's own phase number after the title; the tool station
   sits between 2.2 and 2.3 where Figure 1 puts it, marked "Tools" instead of
   a numeral, because a document that numbered it would be making it a sixth
   phase. 2.6 is the return and 2.7 is what the reviews are for.

   Every sentence here is the client's own position or already in the repo,
   except the connective sentences the plan drafts in quotes (the third
   paragraph of clause 1, the opening sentence of clause 2). Nothing is
   added: no incident, no number, no date. The real sent-back episode has
   not been supplied and is not invented here either (CONTENT-NEEDED.md).
   ========================================================================== */

/* The five phases and the tool station, in the order Figure 1 draws them.
   The numerals are the document's; the phase numbers after the titles are
   the company's own (stations.ts `index`). See the note at the top. */
function subClauses(items: { body: string; title: string; who: string }[]) {
  let n = 0;
  return items.map((it, i) => {
    const st = STATIONS[i];
    if (st?.kind === "tool") return { ...it, kind: st.kind, n: "Tools", suffix: "" };
    n += 1;
    return { ...it, kind: st?.kind ?? "person", n: `2.${n}`, suffix: st?.index ? ` (phase ${st.index})` : "" };
  });
}

const CONTENTS_IDS = ["position", "made", "tools", "never", "commitments", "review"] as const;

/** One question in Appendix A. The panel is the shared `DisclosurePanel`;
 *  the button is here because it is a heading, and the open state belongs
 *  to the list so that opening one answer closes the last. */
function Question({ id, q, a, open, onToggle }: { open: boolean; onToggle: () => void; q: string; id: string; a: string }) {
  return (
    <li className="hairline">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex min-h-[44px] w-full items-start justify-between gap-6 py-4 text-left"
        >
          <span className="font-sans text-[1.25rem] font-bold leading-snug text-ink">{q}</span>
          <span
            aria-hidden="true"
            className={`mt-1 shrink-0 text-red-deep transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
          >
            <IconArrow size={18} />
          </span>
        </button>
      </h3>
      <DisclosurePanel id={id} open={open}>
        <p className="t-body max-w-[62ch] pb-6 text-body">{a}</p>
      </DisclosurePanel>
    </li>
  );
}

/** Figure 1 with its caption and key. Mounted twice, under the title block
 *  at `lg` and inside clause 2 below it; only one is displayed, so a screen
 *  reader meets the figure once. */
function FigureOne({
  labels,
  first,
  caption,
  captionFirst = false,
  className = "",
}: {
  labels: { signoff: string; figure: string; person: string; tool: string };
  first: string;
  caption: string;
  /** On a phone the drawing is 358px wide and reads as a scratch, so the
   *  caption leads and carries the argument in words (plan, section 6). */
  captionFirst?: boolean;
  className?: string;
}) {
  return (
    <figure className={`flex flex-col ${className}`}>
      <ProductionFlat className={captionFirst ? "order-2 mt-5" : ""} />
      <div className={`flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-10 ${captionFirst ? "order-1" : "mt-5"}`}>
        <figcaption className="max-w-[72ch] text-[15px] leading-[1.6] text-body">
          <span className="mr-2 font-mono text-[14px] uppercase tracking-[0.14em] text-red-deep">{labels.figure}</span>
          {first} {caption}
        </figcaption>
        <ul
          className="flex shrink-0 flex-wrap gap-x-6 gap-y-2.5 font-mono text-[14px] uppercase tracking-[0.14em] text-body"
          aria-label="Key to Figure 1"
        >
          <li className="flex items-center gap-2.5">
            <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full border-[1.5px] border-rule bg-raised" />
            {labels.person}
          </li>
          <li className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 rounded-[3px] border-[1.5px] border-rule bg-[color-mix(in_srgb,var(--color-sage)_46%,var(--color-raised))]"
            />
            {labels.tool}
          </li>
          <li className="flex items-center gap-2.5">
            <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full bg-raised ring-2 ring-red/70" />
            {labels.signoff}
          </li>
        </ul>
      </div>
    </figure>
  );
}

export default function EthicalAi() {
  const [open, setOpen] = useState<number | null>(0);
  const body = useRef<HTMLDivElement>(null);
  const active = useActiveSection(body);

  /* EDITABLE FROM THE ADMIN. Every string below is the page's own wording
     (components/ethical-ai/copy.ts) until a content_blocks row replaces it.
     Called unconditionally, the same number of times on every render. */
  const title = useBlock("ethical-ai", "title", COPY.title);
  const summary = useBlock("ethical-ai", "hero.title", COPY["hero.title"]);
  const applies = useBlock("ethical-ai", "applies.value", COPY["applies.value"]);
  const adopted = useBlock("ethical-ai", "doc.adopted", ADOPTED ?? "");
  const approvedBy = useBlock("ethical-ai", "doc.approved_by", APPROVED_BY ?? "");
  const toolsNamed = useBlock("ethical-ai", "hero.aside", COPY["hero.aside"]);
  const figureFirst = useBlock("ethical-ai", "line.heading", COPY["line.heading"]);
  const figureCaption = useBlock("ethical-ai", "figure.caption", COPY["figure.caption"]);
  const h1 = useBlock("ethical-ai", "clause.1.heading", COPY["clause.1.heading"]);
  const h2 = useBlock("ethical-ai", "clause.2.heading", COPY["clause.2.heading"]);
  const h3 = useBlock("ethical-ai", "clause.3.heading", COPY["clause.3.heading"]);
  const h4 = useBlock("ethical-ai", "clause.4.heading", COPY["clause.4.heading"]);
  const h5 = useBlock("ethical-ai", "clause.5.heading", COPY["clause.5.heading"]);
  const h6 = useBlock("ethical-ai", "clause.6.heading", COPY["clause.6.heading"]);
  const hA = useBlock("ethical-ai", "appendix.heading", COPY["appendix.heading"]);
  const positionFirst = useBlock("ethical-ai", "line.lead", COPY["line.lead"]);
  const positionSecond = useBlock("ethical-ai", "position.second", COPY["position.second"]);
  const positionThird = useBlock("ethical-ai", "position.third", COPY["position.third"]);
  const madeLead = useBlock("ethical-ai", "made.lead", COPY["made.lead"]);
  const returnBody = useBlock("ethical-ai", "return.body", COPY["return.body"]);
  const reviewsLine = useBlock("ethical-ai", "reviews.line", COPY["reviews.line"]);
  const toolsNote = useBlock("ethical-ai", "tools.note", COPY["tools.note"]);
  const commitHeading = useBlock("ethical-ai", "commit.heading", COPY["commit.heading"]);
  const commitLead = useBlock("ethical-ai", "commit.lead", COPY["commit.lead"]);
  const reviewBody = useBlock("ethical-ai", "review.body", COPY["review.body"]);
  const reviewLink = useBlock("ethical-ai", "review.link", COPY["review.link"]);

  const tabLabel = useBlock("ethical-ai", "tab.label", COPY["tab.label"]);
  const lApplies = useBlock("ethical-ai", "status.applies", COPY["status.applies"]);
  const lTools = useBlock("ethical-ai", "status.tools", COPY["status.tools"]);
  const lAdopted = useBlock("ethical-ai", "status.adopted", COPY["status.adopted"]);
  const lApproved = useBlock("ethical-ai", "status.approved", COPY["status.approved"]);
  const figureLabels = {
    figure: useBlock("ethical-ai", "figure.label", COPY["figure.label"]),
    person: useBlock("ethical-ai", "key.person", COPY["key.person"]),
    tool: useBlock("ethical-ai", "key.tool", COPY["key.tool"]),
    signoff: useBlock("ethical-ai", "key.signoff", COPY["key.signoff"]),
  };
  const returnTitle = useBlock("ethical-ai", "return.title", COPY["return.title"]);
  const reviewsTitle = useBlock("ethical-ai", "reviews.title", COPY["reviews.title"]);
  const teamLink = useBlock("ethical-ai", "team.link", COPY["team.link"]);
  const phases = subClauses(useList("ethical-ai", "phases.items", PHASE_ITEMS));
  const refusals = useList("ethical-ai", "refusals.items", REFUSAL_ITEMS);
  const commitments = useList("ethical-ai", "commitments.items", COMMITMENT_ITEMS);
  const questions = useList("ethical-ai", "questions.items", QUESTION_ITEMS);

  const headings = [h1, h2, h3, h4, h5, h6];
  const contents = [
    ...CONTENTS_IDS.map((id, i) => ({ id, n: String(i + 1), label: headings[i] })),
    { id: "appendix-a", n: "A", label: hA },
  ];
  const revised = longDate(REVISED);

  return (
    <>
      <Seo
        title="Responsible AI"
        description="How CLÉ Family Media uses Runway and ElevenLabs inside a human-led production process: five phases, the same five people reading every draft, and what the reviews are for."
        path="/ethical-ai"
      />

      {/* ═══ THE DOCUMENT. One sheet of card, end to end, on the paper
          ground. The "Position statement" tab is a label: this is not one of
          the three legal policies, and the shelf at the foot does the
          cross-referencing. 86rem, centred, the width Figure 1 was tuned
          for. ═══ */}
      <Section pad={["close", "normal"]}>
        <Container width="wide">
          <div className="pt-4 sm:pt-6">
            <DocSheet tabs={[{ label: tabLabel, current: true }]} width="wide">
              {/* The page's one entrance: the sheet's contents settle in
                  order, title block, then Figure 1, then the body. The
                  clauses below do not settle one by one. */}
              <Settle>
                {/* ── Title block: what the document is, when its wording
                    was last set, what it covers. The h1 is the document's
                    name, two words in the display face; the position line
                    is the summary under it, in ink at the reading lead, one
                    sentence with nothing coloured in it. ── */}
                <div className="grid gap-x-20 gap-y-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
                  <div>
                    <DocPublisher />
                    <h1 className="t-h1 mt-5 text-ink">{title}</h1>
                    <p className="t-lead mt-7 max-w-[56ch] text-ink">{summary}</p>
                  </div>
                  {/* The document's facts. Adopted and Approved by are
                      hidden rather than shown empty; there is no Version. */}
                  <DocStatus
                    rows={[
                      { label: REVISED_LABEL, value: revised },
                      { label: lApplies, value: applies },
                      { label: lTools, value: toolsNamed },
                      { label: lAdopted, value: adopted || null },
                      { label: lApproved, value: approvedBy || null },
                    ]}
                  />
                </div>

                {/* ── Figure 1, across the full sheet at `lg`: the shape of
                    the argument in one look, before any clause, on card so
                    the graphite and the red return read at full contrast.
                    Under `lg` it mounts inside clause 2 instead, where the
                    text introduces it and the caption leads. ── */}
                <FigureOne
                  labels={figureLabels}
                  first={figureFirst}
                  caption={figureCaption}
                  className="mt-10 hidden border-t-[1.5px] border-rule pt-8 lg:block"
                />

                {/* ── The body: contents rail, then the clauses. The rule
                    above it closes Figure 1 at `lg`; under `lg` the status
                    rows end on their own rule and the contents bar brings
                    its own, so a third would be a blank ruled row. ── */}
                <div className={`${DOC_GRID} mt-7 lg:mt-10 lg:border-t-[1.5px] lg:border-rule lg:pt-10`}>
                  <DocContents items={contents} active={active} summary="6 clauses, 1 appendix" id="pos-contents" />

                  <div ref={body} className="max-w-[68ch]">
                    {/* 1 Position. Three paragraphs: the company's line, the
                        two descriptions it refuses (once, at reading size),
                        and the contents sentence. */}
                    <DocClause id="position" n="1" title={h1} className="!pt-0">
                      <p>{positionFirst}</p>
                      <p>{positionSecond}</p>
                      <p>{positionThird}</p>
                    </DocClause>

                    {/* 2 How an episode is made. The opening sentence says
                        what Figure 1 draws and nothing more; the sub-clauses
                        carry the sequence in words, which is what a phone
                        reader gets instead of a 75px scratch. */}
                    <DocClause id="made" n="2" title={h2}>
                      <p>{madeLead}</p>
                      <FigureOne labels={figureLabels} first={figureFirst} caption={figureCaption} captionFirst className="!mt-6 lg:hidden" />
                      <div className="!mt-8 space-y-7">
                        {phases.map((s, i) => (
                          <DocSubClause
                            key={i}
                            n={s.n}
                            title={`${s.title}${s.suffix}`}
                            className={s.kind === "gate" ? "pos-hold" : ""}
                          >
                            <p className="!mt-1 text-[15px] font-semibold leading-[1.5] text-ink">{s.who}</p>
                            <p>{s.body}</p>
                          </DocSubClause>
                        ))}

                        <DocSubClause n="2.6" title={returnTitle}>
                          <div className="flex gap-4">
                            <span aria-hidden="true" className="mt-3 h-0 w-8 shrink-0 border-t-2 border-dashed border-red" />
                            <p>{returnBody}</p>
                          </div>
                        </DocSubClause>

                        <DocSubClause n="2.7" title={reviewsTitle}>
                          <ForTheChild />
                          <p className="!mt-5">
                            {reviewsLine}{" "}
                            <TextLink to="/team">
                              {teamLink}<IconArrow size={15} />
                            </TextLink>
                          </p>
                        </DocSubClause>
                      </div>
                    </DocClause>

                    {/* 3 The tools. The only table on the page; a fourth
                        column waits on the client (ToolsTable.tsx). The
                        imagery statement for this clause is NEEDED FROM
                        CLIENT and nothing renders for it meanwhile. */}
                    <DocClause id="tools" n="3" title={h3}>
                      <div className="!mt-6">
                        <ToolsTable />
                      </div>
                      <p className="!mt-6">{toolsNote}</p>
                    </DocClause>

                    {/* 4 What a tool is never used for. The boundary as a
                        two-row table, then the three refusals, numbered. */}
                    <DocClause id="never" n="4" title={h4}>
                      <div className="!mt-6">
                        <TheLineTable />
                      </div>
                      <ol className="pos-refusals !mt-8">
                        {refusals.map((d, i) => (
                          <li key={i}>
                            <span className="pos-n" aria-hidden="true">
                              4.{i + 1}
                            </span>
                            <p className="t-body text-body">{d.text}</p>
                          </li>
                        ))}
                      </ol>
                    </DocClause>

                    {/* 5 Six commitments. One column; a document reads down. */}
                    <DocClause id="commitments" n="5" title={h5}>
                      <div className="!mt-7 space-y-7">
                        {commitments.map((l, i) => (
                          <DocSubClause key={i} n={`5.${i + 1}`} title={l.title}>
                            <p>{l.body}</p>
                          </DocSubClause>
                        ))}
                      </div>
                    </DocClause>

                    {/* 6 Review of this position. Two paragraphs, the page's
                        one closing link, and the foot line. A document ends
                        in a sentence. */}
                    <DocClause id="review" n="6" title={h6}>
                      <p>
                        {commitHeading} {commitLead}
                      </p>
                      <p>{reviewBody}</p>
                      <p className="!mt-6">
                        <TextLink to="/contact">
                          {reviewLink}
                          <IconArrow size={15} />
                        </TextLink>
                      </p>
                      <DocFoot title={title} revised={revised} />
                    </DocClause>

                    {/* Appendix A. The four questions as the disclosure
                        list, first open, one at a time. */}
                    <DocClause id="appendix-a" n="A" title={hA} className="mt-12 border-t-[1.5px] border-rule">
                      <ul className="!mt-2 border-b-[1.5px] border-rule">
                        {questions.map((f, i) => (
                          <Question
                            key={i}
                            id={`pos-q-${i}`}
                            q={f.q}
                            a={f.a}
                            open={open === i}
                            onToggle={() => setOpen(open === i ? null : i)}
                          />
                        ))}
                      </ul>
                    </DocClause>
                  </div>
                </div>
              </Settle>
            </DocSheet>
          </div>
        </Container>
      </Section>

      {/* ═══ THE DOCUMENTS. The shelf the legal pages share, with this one
          marked as in hand. Then the footer. ═══ */}
      <DocumentsShelf current="ethical-ai" />
    </>
  );
}
