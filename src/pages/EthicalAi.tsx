import { useRef, useState } from "react";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { ProductionFlat } from "@/components/ethical-ai/ProductionFlat";
import { TheLineTable } from "@/components/ethical-ai/TheLineTable";
import { ToolsTable } from "@/components/ethical-ai/ToolsTable";
import { ForTheChild } from "@/components/ethical-ai/ForTheChild";
import { STATIONS, DO_NOT } from "@/components/ethical-ai/stations";
import { APPROVED_BY, ADOPTED, REVISED } from "@/components/ethical-ai/document";
import { COPY } from "@/components/ethical-ai/copy";
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
import { useBlock } from "@/lib/content";
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

const LINES = [
  {
    title: "Human creativity comes first",
    body: "Characters, stories, educational objectives, scripts and creative direction all begin with people. Tools can help bring those ideas to screen. They do not decide what a story should teach, how a character should behave, or what is appropriate for the children watching.",
  },
  {
    title: "Human oversight at every stage",
    body: "Using AI does not remove responsibility. Our team reviews, directs and refines the work throughout production. Outputs are not automatically generated and published.",
  },
  {
    title: "Protecting original IP",
    body: "The Pawsitive Pugs & Pals®, its characters and its world are original intellectual property. We do not intentionally use AI to reproduce the identifiable style, characters or IP of other creators or children's brands. The aim is to build our own world rather than imitate somebody else's.",
  },
  {
    title: "Children's interests come before technology",
    body: "The fact that technology can do something does not mean we should. Decisions are guided by the child's experience first: calm, age-appropriate content that moves a child beyond passive viewing into play, conversation and offline learning.",
  },
  {
    title: "Education requires human judgement",
    body: "Educational content deserves more than an automated check. Decisions about learning objectives, activities, language and child development stay with qualified people.",
  },
  {
    title: "Transparency matters",
    body: "We will not pretend AI is absent from our process. Equally, calling our programmes simply AI-generated misrepresents the human development, direction and review involved. We prefer the clearer description at the top of this page.",
  },
];

const QUESTIONS = [
  {
    q: "Which tools are used?",
    a: "Runway, for elements of visual production and animation, and ElevenLabs, for elements of audio and voice production. Both sit inside a human-led workflow rather than operating as autonomous content creators. As the technology changes we will keep reviewing the platforms we use, their commercial terms, and how they align with our standards on intellectual property, consent and responsible production.",
  },
  {
    q: "Who writes and approves the stories?",
    a: "Conor and Alan set the concept and the story. Alan writes the script and directs production. The finished episode is reviewed by the team before release, and any of them can ask for changes.",
  },
  {
    q: "How are educational decisions made?",
    a: "Paula Walshe PhD reviews the learning intent of each episode and the activities that follow it. Lydia and Kirstie bring parent and early years perspectives to script and production review. Those judgements are made by people, and we do not automate them.",
  },
  {
    q: "What happens when a review identifies a problem?",
    a: "The work is revised and re-reviewed, and the team watches and revises again until everyone is happy with the episode and signs it off for release. Getting an episode right matters more to us than getting it out on the original date.",
  },
];

/* The five phases and the tool station, in the order Figure 1 draws them.
   The numerals are the document's; the phase numbers after the titles are
   the company's own (stations.ts `index`). See the note at the top. */
const SUB_CLAUSES = (() => {
  let n = 0;
  return STATIONS.map((s) => {
    if (s.kind === "tool") return { ...s, n: "Tools", suffix: "" };
    n += 1;
    return { ...s, n: `2.${n}`, suffix: s.index ? ` (phase ${s.index})` : "" };
  });
})();

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
  first,
  caption,
  captionFirst = false,
  className = "",
}: {
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
          <span className="mr-2 font-mono text-[14px] uppercase tracking-[0.14em] text-red-deep">Figure 1</span>
          {first} {caption}
        </figcaption>
        <ul
          className="flex shrink-0 flex-wrap gap-x-6 gap-y-2.5 font-mono text-[14px] uppercase tracking-[0.14em] text-body"
          aria-label="Key to Figure 1"
        >
          <li className="flex items-center gap-2.5">
            <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full border-[1.5px] border-rule bg-raised" />
            Person decides
          </li>
          <li className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 rounded-[3px] border-[1.5px] border-rule bg-[color-mix(in_srgb,var(--color-sage)_46%,var(--color-raised))]"
            />
            Tool assists
          </li>
          <li className="flex items-center gap-2.5">
            <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full bg-raised ring-2 ring-red/70" />
            Everyone signs off
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
            <DocSheet tabs={[{ label: "Position statement", current: true }]} width="wide">
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
                      { label: "Applies to", value: applies },
                      { label: "Tools named", value: toolsNamed },
                      { label: "Adopted", value: ADOPTED },
                      { label: "Approved by", value: APPROVED_BY },
                    ]}
                  />
                </div>

                {/* ── Figure 1, across the full sheet at `lg`: the shape of
                    the argument in one look, before any clause, on card so
                    the graphite and the red return read at full contrast.
                    Under `lg` it mounts inside clause 2 instead, where the
                    text introduces it and the caption leads. ── */}
                <FigureOne
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
                      <FigureOne first={figureFirst} caption={figureCaption} captionFirst className="!mt-6 lg:hidden" />
                      <div className="!mt-8 space-y-7">
                        {SUB_CLAUSES.map((s) => (
                          <DocSubClause
                            key={s.title}
                            n={s.n}
                            title={`${s.title}${s.suffix}`}
                            className={s.kind === "gate" ? "pos-hold" : ""}
                          >
                            <p className="!mt-1 text-[15px] font-semibold leading-[1.5] text-ink">{s.who}</p>
                            <p>{s.body}</p>
                          </DocSubClause>
                        ))}

                        <DocSubClause n="2.6" title="The return">
                          <div className="flex gap-4">
                            <span aria-hidden="true" className="mt-3 h-0 w-8 shrink-0 border-t-2 border-dashed border-red" />
                            <p>{returnBody}</p>
                          </div>
                        </DocSubClause>

                        <DocSubClause n="2.7" title="What the reviews are for">
                          <ForTheChild />
                          <p className="!mt-5">
                            {reviewsLine}{" "}
                            <TextLink to="/team">
                              The team<IconArrow size={15} />
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
                        {DO_NOT.map((d, i) => (
                          <li key={d}>
                            <span className="pos-n" aria-hidden="true">
                              4.{i + 1}
                            </span>
                            <p className="t-body text-body">{d}</p>
                          </li>
                        ))}
                      </ol>
                    </DocClause>

                    {/* 5 Six commitments. One column; a document reads down. */}
                    <DocClause id="commitments" n="5" title={h5}>
                      <div className="!mt-7 space-y-7">
                        {LINES.map((l, i) => (
                          <DocSubClause key={l.title} n={`5.${i + 1}`} title={l.title}>
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
                        {QUESTIONS.map((f, i) => (
                          <Question
                            key={f.q}
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
