import type { ReactNode, CSSProperties } from "react";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { useRoomEntry, Stage } from "@/components/render";
import { Container, Section, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { PHASES } from "@/components/team/people";
import "@/components/draw/draw.css";
import "./sections.css";

/* ============================================================================
   Treatments of one section, for a direction call. Not a page of the site: it
   is routed at /preview/sections and nothing links to it.

   WHY IT EXISTS. Every section on this site is a heading, a lead under it, a
   paragraph under that, and then the thing the section is about. The client's
   verdict on 2026-10-27 was "why do we have a heading, a subheading, the text
   block etc", and then, of the first attempt at an answer: "did you not think
   that we could just use the client's words within the cards, and leave the
   heading outside of it".

   That is the right instruction and the first attempt missed it. It moved the
   heading INTO the object and left the lead with nowhere to go. The prose is
   what belongs in the object: the lead above this board is a summary of five
   sentences the client has already written, one per phase, sitting unused in
   people.ts because the board prints only the short `who` line.

   THE TEST BED is the home page's review board, the worst case on the site: a
   heading, a lead, the board, the board's own printed rail, and a closing
   note, so the section states its subject five times.
   ========================================================================== */

const POSE = [
  { tilt: 5.6, turn: -1.8, roll: 0.22, depth: 0.5 },
  { tilt: 7.1, turn: 0.4, roll: -0.3, depth: 0.6 },
  { tilt: 4.9, turn: 2.1, roll: 0.15, depth: 0.44 },
  { tilt: 6.8, turn: -2.3, roll: -0.2, depth: 0.58 },
  { tilt: 5.2, turn: -0.3, roll: 0.34, depth: 0.46 },
];
const LIGHT_BY_COLUMN = [-33, -25, -19];

const LEAD =
  "Alan writes the scripts and animates the episodes. Paula, Lydia, Kirstie, Conor and David read each draft and give him their feedback, and he writes the next one from it.";

/* ─── The shelf of slips. `words` prints the client's own sentence on each
   slip instead of leaving it on a paragraph above the board. ────────────── */
function Board({ rail, words }: { words?: boolean; rail?: boolean }) {
  const { ref, armed, lit } = useRoomEntry();
  return (
    <div
      ref={ref}
      className={`rk-studio rk-board mt-10 lg:mt-12 ${armed ? "is-armed" : ""} ${lit ? "is-in" : ""}`}
    >
      <span className="rk-rake" aria-hidden="true" />
      {rail && (
        <div className="rk-head" aria-hidden="true">
          <span>How an episode is made</span>
          <span className="rk-head-rule" />
          <span className="rk-head-meta">Every episode, every draft</span>
        </div>
      )}
      <ol className="rk-bench">
        {PHASES.map((s, i) => {
          const pose = POSE[i % POSE.length];
          return (
            <li key={s.n} className="rk-item" style={{ "--i": i } as CSSProperties}>
              <div className="rk-plate">
                <Stage
                  seated
                  light={LIGHT_BY_COLUMN[i % 3]}
                  tilt={pose.tilt}
                  turn={pose.turn}
                  roll={pose.roll}
                  depth={pose.depth}
                  radius="var(--radius-md)"
                >
                  <article className="rk-slip">
                    <p className="rk-slip__no tnum">
                      <span className="sr-only">Phase </span>
                      {s.n}
                    </p>
                    <h3 className="rk-slip__title">{s.phase}</h3>
                    {words ? (
                      <p className="slip-words">{s.what}</p>
                    ) : (
                      <p className="rk-slip__who">
                        <span className="rk-slip__name">{s.who}</span>
                      </p>
                    )}
                    {s.rounds && <p className="rk-slip__rounds">{s.rounds}</p>}
                  </article>
                </Stage>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* The return mark: a loop drawn in the margin beside the two phases the
   client's account says repeat, so the one genuinely unusual thing about this
   process is drawn rather than written out a second time. */
function Loop() {
  return (
    <svg className="ink ink--fine cs__loop" viewBox="0 0 34 34" aria-hidden="true" focusable="false">
      <path
        className="ink-line ink-draw ink-accent"
        pathLength="1"
        d="M28 17a11 11 0 1 1-4.8-9.1"
        fill="none"
      />
      <path className="ink-line ink-draw ink-accent" pathLength="1" d="M24.2 2.4l-1.4 5.8 5.7 1" fill="none" />
    </svg>
  );
}

/* ─── The call sheet. One object with five ruled rows, which is what a
   production's own paperwork looks like, instead of five standing cards. ── */
function CallSheetPlate() {
  const { ref, armed, lit } = useRoomEntry();
  return (
    <div
      ref={ref}
      className={`rk-studio mt-10 lg:mt-12 ${armed ? "is-armed" : ""} ${lit ? "is-in" : ""}`}
    >
      <span className="rk-rake" aria-hidden="true" />
      <Stage
        seated
        ground="ledge"
        tilt={3.2}
        turn={-0.6}
        roll={-0.25}
        depth={0.5}
        light={-30}
        radius="var(--radius-md)"
      >
        <ol className="cs">
          {PHASES.map((s) => (
            <li className="cs__row" key={s.n}>
              <div className="cs__gutter">
                <p className="cs__no tnum">
                  <span className="sr-only">Phase </span>
                  {s.n}
                </p>
                {s.rounds && <Loop />}
              </div>
              <div className="cs__body">
                <h3 className="cs__title">{s.phase}</h3>
                <p className="cs__what">{s.what}</p>
                {s.rounds && <p className="cs__rounds">{s.rounds}</p>}
              </div>
              {/* The right column is what a call sheet actually carries: who
                  is on this phase. It also spends the width of the sheet, so
                  the paper is a document rather than a wide box with a
                  paragraph down one side of it. */}
              <p className="cs__who">{s.who}</p>
            </li>
          ))}
        </ol>
      </Stage>
    </div>
  );
}

function More() {
  return (
    <div className="mt-10">
      <TextLink to="/team">
        Who each of them is, and the advisory board
        <IconArrow size={15} />
      </TextLink>
    </div>
  );
}

function Frame({ tag, what, children }: { what: string; tag: string; children: ReactNode }) {
  return (
    <>
      <div className="pv-frame">
        <p className="pv-tag">{tag}</p>
        <p className="pv-what">{what}</p>
      </div>
      {children}
    </>
  );
}

export default function PreviewSections() {
  return (
    <>
      <Seo title="Section treatments" description="Treatments of one section." path="/preview/sections" noIndex />

      {/* ─── 0. AS BUILT ─────────────────────────────────────────────────── */}
      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Frame
            tag="Now"
            what="Heading, lead, board, the board's own printed rail, closing note. Five statements of the subject, and the cards print a four word label where the client has written a whole sentence about each phase."
          >
            <Settle>
              <h2 className="t-h2 max-w-[18ch]">Five people read every draft</h2>
              <p className="t-lead mt-5 max-w-[58ch] text-body">{LEAD}</p>
            </Settle>
            <Board rail />
            <Settle className="mt-10">
              <p className="t-body max-w-[56ch] text-body">
                A script usually goes round three or four times before it is locked, and the
                finished episode goes round again until everyone is happy with it.
              </p>
              <More />
            </Settle>
          </Frame>
        </Container>
      </Section>

      {/* ─── D. THE WORDS GO IN THE CARDS ────────────────────────────────── */}
      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Frame
            tag="D. The words go in the cards"
            what="Your note, applied as it stands. The heading stays outside and above. The lead is deleted, because the five sentences it was summarising are the client's own and go one per card. The printed rail and the closing note go with it."
          >
            <Settle>
              <h2 className="t-h2">Five people read every draft</h2>
            </Settle>
            <Board words />
            <Settle>
              <More />
            </Settle>
          </Frame>
        </Container>
      </Section>

      {/* ─── E. ONE SHEET, FIVE ROWS ─────────────────────────────────────── */}
      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Frame
            tag="E. The call sheet"
            what="The same words, and the set piece rebuilt. Five rounded cards in a grid is a shape this site has already killed twice on other pages. A production's own paperwork is one sheet of ruled rows, so this is one object: the numeral in the margin, the sentence at a measure it can be read at, and the two phases that repeat marked with a drawn return loop instead of a second line of type."
          >
            <Settle>
              <h2 className="t-h2">Five people read every draft</h2>
            </Settle>
            <CallSheetPlate />
            <Settle>
              <More />
            </Settle>
          </Frame>
        </Container>
      </Section>
    </>
  );
}
