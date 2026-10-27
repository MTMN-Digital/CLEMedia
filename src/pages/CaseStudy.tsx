import { useState } from "react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Settle } from "@/components/Settle";
import { Button, Section, TextLink, Container } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { Docket } from "@/components/shop/Docket";
import { EPISODES } from "@/lib/episodes";
import { STUDY_OPEN } from "@/components/casestudy/config";
import { RoutePicker, type RouteId } from "@/components/casestudy/RoutePicker";
import { TwoRoutes } from "@/components/casestudy/TwoRoutes";
import { Questionnaire } from "@/components/casestudy/Questionnaire";

/* ============================================================================
   The cross-border case study.

   WHAT THE CLIENT ASKED FOR, from their brief: a dedicated section and a
   participant journey, "rather than only an announcement or a future-results
   page". So the page is a path in order: what the study is, who it is for,
   what an educator is asked to do, pick Ireland or England, watch episode 3,
   use the materials, answer the questionnaire. Findings and the Banteer
   workshop are kept apart from it, and the page closes on what happens to
   the answers.

   WHAT IS NOT HERE, ON PURPOSE. The games, the colouring materials, Paula's
   offline activity, the participant information, the approved questions, the
   date the study opens, how many schools or families are taking part and any
   finding have all not been supplied. Each is a marked row saying what is
   coming, the same way /shop shows an empty shelf. Nothing on the page is
   invented to fill one.

   THE GATE. The questionnaire renders but cannot send anything while
   STUDY_OPEN is false (casestudy/config.ts), because the brief requires the
   participant information and the handling of responses to be agreed before
   it opens.

   IN THE HERO'S LANGUAGE, 2026-10-27. The page opens on the title slate of
   episode 003, the episode the study uses, in the home hero's frame. It was
   the most repetitive page on the site: seven sections, six of them a filing
   label over a lead over a second grey paragraph at the same left edge. Each
   section now opens in its own shape, the heading is the sentence the lead
   used to hide, and the episode and the materials are one ruled sheet rather
   than a card and a box. Episodes are still not embedded anywhere on this
   site: the episode row links out to the show's YouTube channel exactly as
   the home filmstrip's slate does.
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

/* The two things kept apart from the study. Both are owed; both are stated
   as owed, in one ruled sheet rather than two matched cards. */
const APART = [
  {
    title: "Banteer workshop feedback",
    coming: "The workshop in Banteer is complete and is not part of this study. Its feedback is kept apart from the study and will be added here once the feedback letter is supplied.",
  },
  {
    title: "Reviewed study findings",
    coming: "There are no findings yet. They will be added here once the study has run and the responses have been reviewed.",
  },
];

/* The status label inside a sheet row. A label inside an object, which is
   where the site's mono labels still live. */
function Owed() {
  return (
    <p className="mt-2 font-mono text-[13px] uppercase tracking-[0.16em] text-body">Not supplied yet</p>
  );
}

export default function CaseStudy() {
  const [route, setRoute] = useState<RouteId>("ireland");

  return (
    <>
      <Seo
        title="Cross-border case study"
        description="A case study for educators in Ireland and England using an episode of The Pawsitive Pugs & Pals® and its offline activity. Introduction, routes for Aistear and EYFS, materials and questionnaire. Not yet open."
        path="/case-study"
      />

      {/* ═══ 1. THE OPENING, on the episode's own slate. The study uses
          episode 003, so its title slate is the picture, and the status the
          docket leads with is the one line in the top right corner. The
          "Pick your route" action is the first thing an educator does, so it
          is the primary button; the privacy policy, which the old close
          carried as a text link, is the quiet one. ═══ */}
      <PageHero
        id="cs-h"
        asset="slate.ep3"
        position="center 42%"
        credit={<>Episode 003, Chicken Vision. The title slate, a frame from the series.</>}
        eyebrow={<>Case study<span>Ireland and England</span></>}
        aside={<>{STUDY_OPEN ? "Open." : "Not yet open."}</>}
        title={<>A case study across <em>two curricula</em></>}
        actions={
          <>
            {/* An in-page anchor, not a route: `Button href` opens a new tab,
                which is right for YouTube and wrong for the section under
                this one. */}
            <a href="#route-h" className="btn btn-primary">
              Pick your route
              <IconArrow size={16} />
            </a>
            <Button to="/privacy" variant="quiet">Privacy policy</Button>
          </>
        }
      />

      {/* ═══ 2. WHAT YOU ARE ASKED TO DO, beside where the study stands. The
          docket is the first thing that is known, so it is the first object
          on the paper, at the right. The four steps are the section's object,
          at display scale, as four ruled rows. ═══ */}
      <Section labelledBy="ask-h" pad={["normal", "tight"]}>
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
            <div>
              {/* The four steps, as the heading: "Who it is for, and what you
                  are asked to do" was the label, and this is what it labelled. */}
              <h2 id="ask-h" className="t-h2 max-w-[22ch]">
                Choose a route, watch one episode, use the materials, answer the questionnaire.
              </h2>
              <p className="t-body mt-7 max-w-[54ch] text-body">
                CLÉ Family Media is running a case study with early years educators in Ireland and
                in England. Educators use one episode of <em>The Pawsitive Pugs &amp; Pals</em>&reg;,
                and a set of activities made to go with it, with a group of children, and then tell
                us what they saw.
              </p>
            </div>

            <div>
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
              <p className="ml-auto mt-5 max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body">
                This page is where the study lives: how it works, the materials, and the
                questionnaire. It has not opened yet, and nothing below has been published as a
                result.
              </p>
            </div>
          </Settle>

          {/* THE STEPS AT DISPLAY SCALE. Numbers in the display face at the
              h2 size, in ink rather than red (four red figures down a page is
              a red heading by another route), the step beside each. One sheet
              of rules, no card. The line saying who it is for sits above the
              list it introduces, and the age-range note under that, verbatim. */}
          <Settle className="mt-16 lg:mt-20">
            <p className="t-h3 max-w-[30ch]">Educators working with young children in Ireland or England.</p>
            <p className="t-sm mt-3 max-w-[60ch] leading-[1.7] text-body">
              The age range and the kinds of setting we are looking for are being confirmed with
              the education adviser, and will be stated here before the study opens, along with
              how long it takes.
            </p>
            <ol className="mt-8 border-t-[1.5px] border-rule">
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className="grid grid-cols-[4.25rem_minmax(0,1fr)] items-baseline gap-x-5 gap-y-2 border-b-[1.5px] border-rule py-6 sm:gap-x-8 lg:grid-cols-[6rem_minmax(0,20rem)_minmax(0,1fr)] lg:gap-x-12 lg:py-8"
                >
                  <span aria-hidden="true" className="t-h2 tnum font-display leading-none text-ink">
                    {i + 1}
                  </span>
                  <h3 className="t-h3">{s.title}</h3>
                  <p className="t-body col-start-2 max-w-[50ch] text-body lg:col-start-3">{s.body}</p>
                </li>
              ))}
            </ol>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 3. PICK YOUR ROUTE. Two curricula, so two framework panels. The
          one drawing on the page is the fork, because it explains the thing
          the reader has to hold in their head. ═══ */}
      <Section labelledBy="route-h" className="well">
        <Container width="wide">
          <Settle>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
              {/* The fact is the heading: "Pick your route" was the label on
                  the button, and the button is still here. */}
              <h2 id="route-h" className="t-h1 max-w-[16ch]">
                Ireland follows Aistear, England follows the EYFS.
              </h2>
              {/* The structure the heading asserts: one episode in, the notes
                  fork, the same questionnaire out.

                  It pairs with the HEADING, not with the picker: `RoutePicker`
                  renders the chosen framework's whole panel under its two
                  buttons, so a row holding the picker is as tall as that panel
                  and a drawing centred in it lands beside the wrong thing. */}
              <TwoRoutes />
            </div>
            <div className="mt-12 lg:mt-16">
              <p className="t-body mb-6 max-w-[48ch] text-ink">
                The supporting notes differ, so choose the one you work to.
              </p>
              <RoutePicker route={route} onChange={setRoute} />
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 4. WATCH IT, THEN USE THE MATERIALS. One ruled sheet: the episode
          row first, then the three materials, each stated as owed. ═══ */}
      <Section labelledBy="mat-h">
        <Container width="wide">
          {/* ONE SHEET, NOT A CARD AND A BOX, 2026-10-27. The episode had a
              section of its own with the slate at 34rem beside a lead, and the
              materials had another with a dashed box of three rows. The slate
              is now the page's opening picture, so showing it again at size
              would put one frame on the page twice; the episode is the first
              row of the same sheet the materials are on, with its number, its
              runtime and the same YouTube link the home filmstrip's slate
              carries. The heading is the instruction, over the sheet, with
              no lead under it: the sheet is its own explanation. */}
          <Settle>
            <h2 id="mat-h" className="t-h2 max-w-[20ch]">Watch it, then use the materials</h2>
            <ul className="mt-12 border-t-[1.5px] border-rule lg:mt-16">
              <li className="grid gap-x-12 gap-y-4 border-b-[1.5px] border-rule py-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:py-10">
                <div>
                  <h3 className="t-h3">{EPISODE.title}</h3>
                  <p className="tnum mt-2 font-mono text-[13px] uppercase tracking-[0.16em] text-body">
                    Episode {EPISODE.n}, {EPISODE.runtime}
                  </p>
                </div>
                <div>
                  <p className="t-body max-w-[54ch] text-ink">
                    Watch episode 003, <em>{EPISODE.title}</em>, with your group. It runs for{" "}
                    {EPISODE.runtime} and is free to watch on the show's YouTube channel.
                  </p>
                  {EPISODE.line && <p className="t-body mt-3 max-w-[54ch] text-body">{EPISODE.line}</p>}
                  <p className="t-body mt-3 max-w-[54ch] text-body">
                    Watch it through with the children before you use any of the materials below.
                  </p>
                  {EPISODE.href && (
                    <div className="mt-5">
                      <TextLink href={EPISODE.href}>
                        Watch on YouTube<IconArrow size={15} />
                      </TextLink>
                    </div>
                  )}
                </div>
              </li>
              {MATERIALS.map((m, i) => (
                <li
                  key={m.title}
                  className="grid gap-x-12 gap-y-4 border-b-[1.5px] border-rule py-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:py-10"
                >
                  <div>
                    <h3 className="t-h3">{m.title}</h3>
                    <Owed />
                  </div>
                  <div>
                    {i === 0 && (
                      <p className="t-body mb-3 max-w-[54ch] text-ink">
                        After the episode, use the materials with the same group. Each will have
                        written instructions and a download button.
                      </p>
                    )}
                    <p className="t-body max-w-[54ch] text-body">{m.coming}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 5. THE QUESTIONNAIRE. Gated by STUDY_OPEN. ═══ */}
      <Section labelledBy="q-h" className="well">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-20 xl:gap-28">
            <div className="lg:sticky lg:top-28 lg:self-start">
              {/* The notice's own fact is the heading. What the form asks is
                  the small line above the form, where it is talking. */}
              <h2 id="q-h" className="t-h2 max-w-[19ch]">
                The questionnaire opens when the participant information is published.
              </h2>
              <p className="t-body mt-7 max-w-[38ch] text-ink">
                Complete it after you have used the episode and the activity with your group.
              </p>
            </div>
            <div>
              <p className="t-sm mb-6 max-w-[52ch] leading-[1.7] text-body">
                It asks about what you saw and how the materials worked. It does not ask for the
                name of any child.
              </p>
              <Questionnaire route={route} />
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 6. FINDINGS, AND BANTEER. Kept apart from the study on purpose:
          the workshop is done and is not part of it. One ruled sheet on a
          narrower measure, not two matched cards. ═══ */}
      <Section labelledBy="out-h">
        <Container width="default">
          <Settle>
            <h2 id="out-h" className="t-h2 max-w-[20ch]">
              The Banteer workshop has taken place. The study has not started.
            </h2>
            <p className="t-body mt-6 max-w-[52ch] text-body">These are two separate things.</p>
            <ul className="mt-10 border-t-[1.5px] border-rule">
              {APART.map((a) => (
                <li
                  key={a.title}
                  className="grid gap-x-12 gap-y-3 border-b-[1.5px] border-rule py-7 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]"
                >
                  <div>
                    <h3 className="t-h3">{a.title}</h3>
                    <Owed />
                  </div>
                  <p className="t-body max-w-[52ch] text-body">{a.coming}</p>
                </li>
              ))}
            </ul>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 7. WHAT HAPPENS TO YOUR ANSWERS. The one deep band, and the
          close. Only what is true of the form is stated as fact; the rest is
          stated as owed. Privacy wording, reproduced as it was. ═══ */}
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

            <dl className="border-t-[1.5px] border-edge-dark">
              {[
                { k: "What the form asks", v: "Your role and setting, the age and number of the children, how you rated the episode and the activity, and two open questions. The email address is optional." },
                { k: "What it does not ask", v: "The name of any child, or anything that identifies one. The form does not ask for it and tells you not to include it." },
                { k: "Who reads the answers", v: "To be confirmed in the participant information." },
                { k: "How long they are kept", v: "To be confirmed in the participant information." },
                { k: "Having yours removed", v: "To be confirmed in the participant information." },
              ].map((r) => (
                <div key={r.k} className="grid grid-cols-1 gap-x-8 gap-y-1 border-b-[1.5px] border-edge-dark py-5 sm:grid-cols-[11rem_minmax(0,1fr)]">
                  <dt className="text-[17px] font-semibold">{r.k}</dt>
                  <dd className="t-body max-w-[48ch]">{r.v}</dd>
                </div>
              ))}
            </dl>
          </Settle>
        </Container>
      </Section>
    </>
  );
}
