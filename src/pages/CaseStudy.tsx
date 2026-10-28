import { useState } from "react";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Figure } from "@/components/Figure";
import { Container, Section, Kicker, TextLink } from "@/components/ui";
import { IconExternal, IconArrow } from "@/components/icons";
import { FactRows } from "@/components/FactRows";
import { ClosingLine } from "@/components/ClosingLine";
import { EPISODES } from "@/lib/episodes";
import { STUDY_OPEN } from "@/components/casestudy/config";
import { type RouteId, RouteChips, RoutePanel } from "@/components/casestudy/RoutePicker";
import { TwoRoutes } from "@/components/casestudy/TwoRoutes";
import { SheetRow } from "@/components/casestudy/SheetRow";
import { Questionnaire } from "@/components/casestudy/Questionnaire";
import { useBlock } from "@/lib/content";
import { COPY } from "@/components/casestudy/copy";

/* ============================================================================
   The cross-border case study: a protocol sheet.

   WHAT THE CLIENT ASKED FOR, from their brief: a dedicated section and a
   participant journey, "rather than only an announcement or a future-results
   page". So the page is the study's one-page registration: a name, the
   structure drawn, the facts beside it, then who it is for, the procedure in
   four steps, what will be published, the questionnaire's status, and what
   happens to the answers. One surface, paper, end to end.

   REBUILT 2026-10-28 (docs/SUBPAGE-PLANS-2026-10-28.md, "## case-study").
   The page used to open on the episode's title slate scrimmed under a
   two-line claim, then run six bands and 2,500px of a draft questionnaire
   that could not be sent. It now opens on the route drawing with the two
   chips driving it (the one interactive object on the site that is not a
   form), the status facts beside it as plain ruled rows, and every section
   after that is one row of the sheet with a mono label in the margin. No
   numerals in the margin, no dotted leaders, no cards, no bands.

   WHAT IS NOT HERE, ON PURPOSE. The games, the colouring materials, Paula's
   offline activity, the participant information, the approved questions,
   the date the study opens, how many schools or families are taking part,
   who an educator contacts before it opens, and any finding have all not
   been supplied. Each is a row that says so in words. Nothing on the page is
   invented to fill one.

   THE GATE. The questionnaire mounts only when STUDY_OPEN is true
   (casestudy/config.ts); see the comment at the mount.
   ========================================================================== */

const EPISODE = EPISODES.find((e) => e.n === "003")!;

/* What an educator is asked to do, in order. Said once, here. No time
   estimate: none has been given, and it is listed as owed. The titles are
   editable (step.N.title in copy.ts); the bodies stay here. */
const STEP_BODIES: string[] = [
  "Ireland or England, so the notes you use cite the framework you work to.",
  "Chicken Vision, from the series, free to watch.",
  "A game, colouring pages and Paula's offline activity, with instructions for each.",
  "A short set of questions about what you saw and how the materials worked.",
];

/* What will be published here, for the study. Every value is the page's own
   wording for that item, trimmed to one row. Each is owed, and says so. */
const FOR_STUDY = [
  { label: "Aistear supporting notes", value: "With Paula for final approval; a download and a short note on how to use them alongside the episode" },
  { label: "EYFS supporting notes", value: "With Paula for final approval; the same" },
  { label: "Selected games", value: "Not supplied yet; instructions on how to play them with a group" },
  { label: "Colouring materials", value: "Not supplied yet; printable pages from the episode, with a note on how to use them" },
  { label: "Paula's offline activity", value: "Not supplied yet; designed by Paula Walshe PhD to follow the episode away from a screen, with step by step instructions" },
  { label: "Participant information", value: "Being agreed; published here before the study opens" },
  { label: "The questionnaire", value: "A draft is with the education adviser; published here when the study opens" },
  { label: "Reviewed study findings", value: "None yet; added once the study has run and the responses have been reviewed" },
];

/* Kept apart from the study. The workshop is done and is not part of it. */
const APART = [
  { label: "Banteer workshop feedback", value: "The workshop in Banteer is complete and is not part of this study; its feedback will be added here once the feedback letter is supplied" },
];

/* What happens to the answers. Only what is true of the form is stated as
   fact; the rest is stated as owed. Privacy wording, reproduced as it was. */
const ANSWERS = [
  { k: "What the form asks", v: "Your role and setting, the age and number of the children, how you rated the episode and the activity, and two open questions. The email address is optional." },
  { k: "What it does not ask", v: "The name of any child, or anything that identifies one. The form does not ask for it and tells you not to include it." },
  { k: "Who reads the answers", v: "To be confirmed in the participant information." },
  { k: "How long they are kept", v: "To be confirmed in the participant information." },
  { k: "Having yours removed", v: "To be confirmed in the participant information." },
];

export default function CaseStudy() {
  /* The route lives here so the drawing, the chips, the framework panel and
     (when the study opens) the questionnaire all read one choice. */
  const [route, setRoute] = useState<RouteId>("ireland");

  /* EDITABLE FROM THE ADMIN. Every string below is the page's own wording
     (components/casestudy/copy.ts) until a content_blocks row replaces it.
     The status rows follow STUDY_OPEN and the episode table and stay here:
     they state what is and is not supplied, which is a fact. */
  const title = useBlock("case-study", "hero.title", COPY["hero.title"]);
  const lead = useBlock("case-study", "hero.lead", COPY["hero.lead"]);
  const statusFoot = useBlock("case-study", "status.foot", COPY["status.foot"]);
  /* The margin labels, one per row of the sheet, in page order. */
  const routeLabel = useBlock("case-study", "route.label", COPY["route.label"]);
  const whoLabel = useBlock("case-study", "who.label", COPY["who.label"]);
  const stepsLabel = useBlock("case-study", "steps.label", COPY["steps.label"]);
  const pubLabel = useBlock("case-study", "pub.label", COPY["pub.label"]);
  const pubStudy = useBlock("case-study", "pub.study", COPY["pub.study"]);
  const qLabel = useBlock("case-study", "q.label", COPY["q.label"]);
  /* The four step titles. Four hooks, always called, in order. */
  const step1 = useBlock("case-study", "step.1.title", COPY["step.1.title"]);
  const step2 = useBlock("case-study", "step.2.title", COPY["step.2.title"]);
  const step3 = useBlock("case-study", "step.3.title", COPY["step.3.title"]);
  const step4 = useBlock("case-study", "step.4.title", COPY["step.4.title"]);
  const stepTitles = [step1, step2, step3, step4];
  const routeLine = useBlock("case-study", "route.heading", COPY["route.heading"]);
  const askHeading = useBlock("case-study", "ask.heading", COPY["ask.heading"]);
  const askBody = useBlock("case-study", "ask.body", COPY["ask.body"]);
  const stepsWatch = useBlock("case-study", "steps.watch", COPY["steps.watch"]);
  const outHeading = useBlock("case-study", "out.heading", COPY["out.heading"]);
  const qBody = useBlock("case-study", "q.body", COPY["q.body"]);
  const dataHeading = useBlock("case-study", "data.heading", COPY["data.heading"]);
  const dataLead = useBlock("case-study", "data.lead", COPY["data.lead"]);
  const closeLine = useBlock("case-study", "close.line", COPY["close.line"]);
  const closeLink = useBlock("case-study", "close.link", COPY["close.link"]);

  const status = STUDY_OPEN ? "Open" : "Not yet open";

  return (
    <>
      <Seo
        title="Cross-border case study"
        description="The cross-border case study for early years educators in Ireland and England: one episode of The Pawsitive Pugs & Pals®, two curriculum routes, the materials and the questionnaire. Not yet open."
        path="/case-study"
      />

      <Section as="div" pad={["none", "normal"]} className="pt-12 sm:pt-14 lg:pt-16">
        <Container width="wide">
          <article className="proto">
            {/* ═══ THE OPENING. One mono line with the status at its right
                end, the study's name, the subtitle, then the object: the
                route drawing with its chips, and the facts beside it as a
                plain ruled list, the way a figure has a key. ═══ */}
            <Settle className="proto-head">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <p className="font-mono text-[14px] uppercase leading-[1.7] tracking-[0.16em] text-body">Study protocol</p>
                {/* The only Kicker on the page, and it is a status. */}
                <Kicker>{status}</Kicker>
              </div>
              <h1 className="t-h1 mt-6 max-w-[16ch]">{title}</h1>
              <p className="t-lead mt-6 max-w-[58ch] text-body">{lead}</p>
            </Settle>

            <div className="hairline mt-10 grid gap-y-10 pt-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-x-16">
              {/* The drawing and its control. At `sm` and up the drawing
                  draws itself and the chips sit under its first node; on a
                  phone the chips come first and the drawing's list form
                  follows them, so the choice is inside the first screen. */}
              <div className="flex flex-col gap-8 sm:gap-4">
                <div className="order-2 sm:order-1">
                  <TwoRoutes route={route} />
                </div>
                <RouteChips route={route} onChange={setRoute} className="order-1 sm:order-2" />
              </div>

              {/* The facts. Seven rows, no heading, no leaders. They settle
                  as the drawing's last node lands: `--i` is pre-set so the
                  Settle's stagger (60ms a step) begins at about 1.6s. */}
              <Settle className="proto-facts">
                <div style={{ "--i": "27" } as React.CSSProperties}>
                  <FactRows
                    rows={[
                      { label: "Status", value: <strong className="font-semibold">{status}</strong> },
                      { label: "Opens", value: "Date to be confirmed" },
                      { label: "Routes", value: "Ireland (Aistear) and England (EYFS)" },
                      { label: "Episode", value: `${EPISODE.n}, ${EPISODE.title}, ${EPISODE.runtime}` },
                      { label: "Materials", value: "Notes with the adviser; games and colouring not yet supplied" },
                      { label: "Questionnaire", value: "Draft, awaiting approval" },
                      { label: "Results", value: "None yet" },
                    ]}
                  />
                </div>
                <p className="t-body mt-5 max-w-[44ch] text-body" style={{ "--i": "28" } as React.CSSProperties}>
                  {statusFoot}
                </p>
              </Settle>
            </div>

            {/* ═══ THE ROUTE YOU CHOSE. The sentence, then the chosen
                framework's panel, driven by the chips in the opening. ═══ */}
            <SheetRow id="route-h" label={routeLabel}>
              <Settle>
                <p className="t-body max-w-[62ch] text-ink">{routeLine}</p>
                <div className="mt-9">
                  <RoutePanel route={route} />
                </div>
              </Settle>
            </SheetRow>

            {/* ═══ WHO IT IS FOR. A description of a group, and what is still
                being confirmed. Nothing here says how to take part: the
                client has not named the contact, so the page does not. ═══ */}
            <SheetRow id="who-h" label={whoLabel}>
              <Settle>
                <h3 className="t-h3 max-w-[30ch]">{askHeading}</h3>
                <p className="t-body mt-4 max-w-[60ch] text-body">{askBody}</p>
              </Settle>
            </SheetRow>

            {/* ═══ THE FOUR STEPS. The procedure, numbered inside the content
                because it is a procedure, not a document margin. Step 2
                carries the page's one image: the episode's slate as a
                captioned thumbnail, with the same YouTube link the home
                filmstrip's slate carries. ═══ */}
            <SheetRow id="steps-h" label={stepsLabel}>
              <Settle as="ol" className="border-t-[1.5px] border-rule">
                {STEP_BODIES.map((body, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[4.25rem_minmax(0,1fr)] items-baseline gap-x-5 gap-y-2 border-b-[1.5px] border-rule py-6 sm:gap-x-8 lg:grid-cols-[6rem_minmax(0,20rem)_minmax(0,1fr)] lg:gap-x-12 lg:py-7"
                  >
                    <span aria-hidden="true" className="t-h2 tnum font-display leading-none text-ink">
                      {i + 1}
                    </span>
                    <h3 className="t-h3">{stepTitles[i]}</h3>
                    <div className="col-start-2 lg:col-start-3">
                      <p className="t-body max-w-[50ch] text-body">{body}</p>
                      {i === 1 && (
                        <>
                          {EPISODE.line && <p className="t-body mt-3 max-w-[54ch] text-body">{EPISODE.line}</p>}
                          <p className="t-body mt-3 max-w-[54ch] text-body">{stepsWatch}</p>
                          {/* The slate, 220px at `lg`, 180px at `sm`, the full
                              measure on a phone, with its provenance caption
                              and the link beside it. */}
                          <figure className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">
                            <Figure
                              asset={EPISODE.asset}
                              sizes="(min-width: 1024px) 220px, (min-width: 640px) 180px, 100vw"
                              rounded="rounded-[var(--radius-md)]"
                            />
                            <figcaption className="self-end">
                              <p className="font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body">
                                Episode 003 title slate. A frame from the series.
                              </p>
                              <p className="tnum mt-2 font-mono text-[13px] uppercase leading-[1.6] tracking-[0.16em] text-body">
                                Episode {EPISODE.n}, {EPISODE.runtime}
                              </p>
                              {EPISODE.href && (
                                <p className="mt-3">
                                  <TextLink href={EPISODE.href}>
                                    Watch on YouTube<IconExternal size={14} />
                                  </TextLink>
                                </p>
                              )}
                            </figcaption>
                          </figure>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </Settle>
            </SheetRow>

            {/* ═══ WHAT WILL BE PUBLISHED HERE. Two groups of plain ruled
                rows: for the study, and the one thing kept apart from it.
                Every row is something owed, and says so in words. ═══ */}
            <SheetRow id="pub-h" label={pubLabel}>
              <Settle>
                <div>
                  <p className="field-label">{pubStudy}</p>
                  <FactRows rows={FOR_STUDY} labelWidth="12rem" />
                </div>
                <div className="mt-10">
                  <p className="field-label">{outHeading}</p>
                  <FactRows rows={APART} labelWidth="12rem" />
                </div>
              </Settle>
            </SheetRow>

            {/* ═══ THE QUESTIONNAIRE. Its status, and the form only when the
                study is open. ═══ */}
            <SheetRow id="q-h" label={qLabel}>
              <Settle>
                <p className="t-body max-w-[60ch] text-ink">{qBody}</p>
                <FactRows className="mt-6 max-w-[56rem]" rows={[{ label: "Status", value: "Draft, awaiting the education adviser" }]} />
              </Settle>
              {/* MOUNTED ONLY WHEN STUDY_OPEN. questions.ts is a draft nobody
                  has approved (its first line says so), and an unapproved
                  research instrument on a public page of a company that sells
                  "research underpinning the model" is a liability to Paula and
                  to the company. The gate in Questionnaire.tsx, config.ts and
                  api/study-response.ts is untouched; the day the flag flips,
                  the form appears here with the chosen route and the status
                  rows above read "Open". The form's own "not opened" notice
                  stays for the window between the flag and the API. */}
              {STUDY_OPEN && (
                <div className="mt-10">
                  <Questionnaire route={route} />
                </div>
              )}
            </SheetRow>

            {/* ═══ YOUR ANSWERS. Privacy wording, reproduced as it was, on
                paper. ═══ */}
            <SheetRow id="data-h" label={dataHeading}>
              <Settle>
                <p className="t-body max-w-[60ch] text-ink">{dataLead}</p>
                <dl className="mt-8 max-w-[56rem] border-t-[1.5px] border-rule">
                  {ANSWERS.map((r) => (
                    <div key={r.k} className="grid grid-cols-1 gap-x-8 gap-y-1 border-b-[1.5px] border-rule py-5 sm:grid-cols-[12rem_minmax(0,1fr)]">
                      <dt className="text-[17px] font-semibold text-ink">{r.k}</dt>
                      <dd className="t-body max-w-[48ch] text-body">{r.v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6">
                  <TextLink to="/privacy">
                    Privacy policy<IconArrow size={15} />
                  </TextLink>
                </p>
              </Settle>
            </SheetRow>

            {/* ═══ THE CLOSE. One line and one link, then the footer. ═══ */}
            <Settle className="hairline pt-10 sm:pt-12 lg:pt-14">
              <ClosingLine link={{ to: "/ethical-ai", label: closeLink }}>{closeLine}</ClosingLine>
            </Settle>
          </article>
        </Container>
      </Section>
    </>
  );
}
