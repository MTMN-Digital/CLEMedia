import { useState } from "react";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Container, Section, Lead, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { Docket } from "@/components/shop/Docket";
import { EpisodeSlate } from "@/components/home/EpisodeSlate";
import { EPISODES } from "@/lib/episodes";
import { STUDY_OPEN } from "@/components/casestudy/config";
import { Slot } from "@/components/casestudy/Slot";
import { RoutePicker, type RouteId } from "@/components/casestudy/RoutePicker";
import { TwoRoutes } from "@/components/casestudy/TwoRoutes";
import { Questionnaire } from "@/components/casestudy/Questionnaire";

/* ============================================================================
   The cross-border case study.

   WHAT THE CLIENT ASKED FOR, from their brief: a dedicated section and a
   participant journey, "rather than only an announcement or a future-results
   page". So the page is a path in order: what the study is, who it is for,
   what an educator is asked to do, pick Ireland or England, watch episode 3,
   use the materials, answer the questionnaire, and what happens to the
   answers. Findings and the Banteer workshop come last and apart.

   WHAT IS NOT HERE, ON PURPOSE. The games, the colouring materials, Paula's
   offline activity, the participant information, the approved questions, the
   date the study opens, how many schools or families are taking part and any
   finding have all not been supplied. Each is a marked slot saying what is
   coming (see casestudy/Slot.tsx), the same way /shop shows an empty shelf.
   Nothing on the page is invented to fill one.

   THE GATE. The questionnaire renders but cannot send anything while
   STUDY_OPEN is false (casestudy/config.ts), because the brief requires the
   participant information and the handling of responses to be agreed before
   it opens.

   EPISODE 003 follows the site's existing episode pattern: the EpisodeSlate
   from the home filmstrip, linking out to the show's YouTube channel. Episodes
   are not embedded anywhere on this site and are not here.
   ========================================================================== */

const MATERIALS = [
  {
    title: "Selected games",
    coming: "The games chosen for the study, with instructions on how to play them with a group, will be added here.",
  },
  {
    title: "Colouring materials",
    coming: "Printable colouring pages from the episode, with a note on how to use them, will be added here.",
  },
  {
    title: "Paula's offline activity",
    coming: "The activity, designed by Paula Walshe PhD to follow the episode away from a screen, will be added here with step by step instructions.",
  },
];

const EPISODE = EPISODES.find((e) => e.n === "003")!;

/* What an educator is asked to do, in order. Said once, here, and the
   headings further down the page follow the same order. No time estimate:
   none has been given, and it is listed as owed. */
const STEPS: { title: string; body: string }[] = [
  { title: "Choose a route", body: "Ireland or England, so the notes you use cite the framework you work to." },
  { title: "Watch episode 003 with your group", body: "Chicken Vision, from the series, free to watch." },
  { title: "Use the materials", body: "A game, colouring pages and Paula's offline activity, with instructions for each." },
  { title: "Answer the questionnaire", body: "A short set of questions about what you saw and how the materials worked." },
];

export default function CaseStudy() {
  const [route, setRoute] = useState<RouteId>("ireland");

  return (
    <>
      <Seo
        title="Cross-border case study"
        description="A case study for educators in Ireland and England using an episode of The Pawsitive Pugs & Pals® and its offline activity. Introduction, routes for Aistear and EYFS, materials and questionnaire. Not yet open."
        path="/case-study"
      />

      {/* ═══ 1. WHAT THE STUDY IS, beside where it stands. The status docket
          is the first thing that is known, so it sits in the first screen. ═══ */}
      <Section labelledBy="cs-h" pad={["normal", "tight"]}>
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-20">
            <div>
              <h1 id="cs-h" className="t-display max-w-[14ch]">A case study across two curricula</h1>
              <Lead className="mt-7 max-w-[54ch]">
                CLÉ Family Media is running a case study with early years educators in Ireland and in
                England. Educators use one episode of <em>The Pawsitive Pugs &amp; Pals</em>&reg;, and
                a set of activities made to go with it, with a group of children, and then tell us
                what they saw.
              </Lead>
              <p className="t-body mt-5 max-w-[54ch] text-body">
                This page is where the study lives: how it works, the materials, and the
                questionnaire. It has not opened yet, and nothing below has been published as a
                result.
              </p>
            </div>

            <Docket
              label="Where the study stands"
              rows={[
                { k: "Status", v: STUDY_OPEN ? "Open" : "Not yet open", strong: true },
                { k: "Opens", v: "date to be confirmed" },
                { k: "Routes", v: "Ireland, England" },
                { k: "Episode", v: `${EPISODE.n}, ${EPISODE.title}` },
                { k: "Results", v: "none yet" },
              ]}
              foot={
                <>
                  The participant information is being agreed first, and the questionnaire opens
                  after it is published here.
                </>
              }
            />
          </Settle>
        </Container>
      </Section>

      {/* ═══ 2. WHO IT IS FOR AND WHAT YOU DO. A ledger of hairline rows, the
          Shop's idiom, on the well. ═══ */}
      <Section labelledBy="ask-h" className="well">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-20 xl:gap-28">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id="ask-h" className="t-h1 max-w-[12ch]">Who it is for, and what you are asked to do</h2>
              <p className="t-lead mt-7 max-w-[38ch] text-ink">
                Educators working with young children in Ireland or England.
              </p>
              <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.7] text-body">
                The age range and the kinds of setting we are looking for are being confirmed
                with the education adviser, and will be stated here before the study opens, along
                with how long it takes.
              </p>
            </div>

            <ol className="border-t border-rule">
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-rule py-7 sm:grid-cols-[11rem_minmax(0,1fr)]"
                >
                  <h3 className="text-[17px] font-semibold leading-snug text-ink">
                    <span className="tnum mr-2 font-mono text-[14px] text-red-deep">{i + 1}</span>
                    {s.title}
                  </h3>
                  <p className="max-w-[50ch] text-[16px] leading-[1.68] text-body">{s.body}</p>
                </li>
              ))}
            </ol>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 3. PICK YOUR ROUTE. Two curricula, so two framework panels. ═══ */}
      <Section labelledBy="route-h">
        <Container width="wide">
          <Settle>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
              <div>
                <h2 id="route-h" className="t-h1 max-w-[16ch]">Pick your route</h2>
                <p className="t-lead mt-6 max-w-[42ch] text-ink">
                  Ireland follows Aistear and England follows the EYFS. The supporting notes differ,
                  so choose the one you work to.
                </p>
              </div>
              {/* The structure the paragraph beside it asserts: one episode in,
                  the notes fork, the same questionnaire out. It also fills the
                  two thirds of this band that were empty.

                  It pairs with the HEADING, not with the picker: `RoutePicker`
                  renders the chosen framework's whole panel under its two
                  buttons, so a row holding the picker is as tall as that panel
                  and a drawing centred in it lands beside the wrong thing. */}
              <TwoRoutes />
            </div>
            <div className="mt-12">
              <RoutePicker route={route} onChange={setRoute} />
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 4. THE EPISODE. Same slate, same link-out as the home page. ═══ */}
      <Section labelledBy="ep-h" className="well">
        <Container width="wide">
          <Settle className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div>
              <h2 id="ep-h" className="t-h1 max-w-[12ch]">Start with the episode</h2>
              <p className="t-lead mt-6 max-w-[40ch] text-ink">
                Watch episode 003, <em>{EPISODE.title}</em>, with your group. It runs for{" "}
                {EPISODE.runtime} and is free to watch on the show's YouTube channel.
              </p>
              <p className="t-body mt-5 max-w-[46ch] text-body">
                Watch it through with the children before you use any of the materials below.
              </p>
            </div>
            <div className="max-w-[34rem]">
              <EpisodeSlate ep={EPISODE} />
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 5. THE MATERIALS. Three marked slots: none has been supplied. ═══ */}
      <Section labelledBy="mat-h">
        <Container width="wide">
          {/* ONE SHEET, NOT THREE CARDS, 2026-10-26. Three dashed boxes of the
              same size in a row, each with a label, a heading and a line of
              text, is the matched card grid the brief rules out, and it was
              saying "not supplied yet" three times in a row across the page.
              It is one marked sheet with three rows now: the same words, one
              statement that none of it has arrived, and the heading moves into
              the margin beside it so the band is not a heading over a strip of
              boxes. */}
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 xl:gap-20">
            <div>
              <h2 id="mat-h" className="t-h1 max-w-[14ch]">Games, colouring and an offline activity</h2>
              <p className="t-lead mt-6 max-w-[38ch] text-ink">
                After the episode, use the materials with the same group. Each will have written
                instructions and a download button.
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-dashed border-rule px-5 py-2 sm:px-7">
              <p className="pt-5 font-mono text-[12px] uppercase tracking-[0.16em] text-body">
                None of the three has been supplied yet
              </p>
              <ul className="mt-1">
                {MATERIALS.map((m) => (
                  <li key={m.title} className="border-t border-rule-soft py-5 first:border-t-0 first:pt-4">
                    <h3 className="t-h3">{m.title}</h3>
                    <p className="t-body mt-1.5 max-w-[54ch] text-body">{m.coming}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 6. THE QUESTIONNAIRE. Gated by STUDY_OPEN. ═══ */}
      <Section labelledBy="q-h" className="well">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-20 xl:gap-28">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id="q-h" className="t-h1 max-w-[12ch]">The educator questionnaire</h2>
              <p className="t-lead mt-7 max-w-[38ch] text-ink">
                Complete it after you have used the episode and the activity with your group.
              </p>
              <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.7] text-body">
                It asks about what you saw and how the materials worked. It does not ask for the
                name of any child.
              </p>
            </div>
            <div>
              <Questionnaire route={route} />
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 7. WHAT HAPPENS TO YOUR ANSWERS. The one deep band. Only what is
          true of the form is stated as fact; the rest is stated as owed. ═══ */}
      <Section deep labelledBy="data-h">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div>
              <h2 id="data-h" className="t-h2 max-w-[16ch]">What happens to your answers</h2>
              <p className="t-lead mt-6 max-w-[40ch]">
                The study will not open until the participant information is agreed and published
                on this page.
              </p>
              <div className="mt-9">
                <TextLink to="/privacy">
                  Privacy policy<IconArrow size={15} />
                </TextLink>
              </div>
            </div>

            <dl className="border-t border-edge-dark">
              {[
                { k: "What the form asks", v: "Your role and setting, the age and number of the children, how you rated the episode and the activity, and two open questions. The email address is optional." },
                { k: "What it does not ask", v: "The name of any child, or anything that identifies one. The form does not ask for it and tells you not to include it." },
                { k: "Who reads the answers", v: "To be confirmed in the participant information." },
                { k: "How long they are kept", v: "To be confirmed in the participant information." },
                { k: "Having yours removed", v: "To be confirmed in the participant information." },
              ].map((r) => (
                <div key={r.k} className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-edge-dark py-5 sm:grid-cols-[11rem_minmax(0,1fr)]">
                  <dt className="text-[17px] font-semibold">{r.k}</dt>
                  <dd className="t-body max-w-[48ch]">{r.v}</dd>
                </div>
              ))}
            </dl>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 8. FINDINGS, AND BANTEER. Kept apart from the study on purpose:
          the workshop is done and is not part of it. ═══ */}
      <Section labelledBy="out-h">
        <Container width="wide">
          <Settle>
            <h2 id="out-h" className="t-h1 max-w-[18ch]">Findings, and the Banteer workshop</h2>
            <p className="t-lead mt-6 max-w-[52ch] text-ink">
              These are two separate things. The workshop has taken place. The study has not
              started.
            </p>
          </Settle>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Slot
              title="Banteer workshop feedback"
              coming="The workshop in Banteer is complete and is not part of this study. Its feedback is kept apart from the study and will be added here once the feedback letter is supplied."
            />
            <Slot
              title="Reviewed study findings"
              coming="There are no findings yet. They will be added here once the study has run and the responses have been reviewed."
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
