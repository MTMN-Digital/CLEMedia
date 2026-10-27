import type { ReactNode, CSSProperties } from "react";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { useRoomEntry, Stage } from "@/components/render";
import { Container, Section, Lead, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { PHASES } from "@/components/team/people";
import "./sections.css";

/* ============================================================================
   Four treatments of one section, for a direction call. Not a page of the
   site: it is routed at /preview/sections and nothing links to it.

   WHY IT EXISTS. Every section on this site is built the same way: a heading,
   a lead under it, a paragraph under that, then the thing the section is
   actually about. The client's verdict on 2026-10-27 was "why do we have a
   heading, a subheading, the text block etc", which is the right question.
   Three layers of type announce a section three times before it starts.

   THE TEST BED is the home page's review board, because it is the worst case:
   a heading, a lead, the board, the board's OWN printed header, and a closing
   note, so the section states its subject five times. The copy in each
   treatment is the live copy, re-cut, never rewritten.
   ========================================================================== */

const POSE = [
  { tilt: 5.6, turn: -1.8, roll: 0.22, depth: 0.5 },
  { tilt: 7.1, turn: 0.4, roll: -0.3, depth: 0.6 },
  { tilt: 4.9, turn: 2.1, roll: 0.15, depth: 0.44 },
  { tilt: 6.8, turn: -2.3, roll: -0.2, depth: 0.58 },
  { tilt: 5.2, turn: -0.3, roll: 0.34, depth: 0.46 },
  { tilt: 6.2, turn: 1.1, roll: -0.18, depth: 0.52 },
];
const LIGHT_BY_COLUMN = [-33, -25, -19];

const LEAD =
  "Alan writes the scripts and animates the episodes. Paula, Lydia, Kirstie, Conor and David read each draft and give him their feedback, and he writes the next one from it.";

/* The shelf of five slips, with or without the printed rail above it and with
   or without a sixth card carrying the section's statement. */
function Board({ rail, say }: { rail?: boolean; say?: ReactNode }) {
  const { ref, armed, lit } = useRoomEntry();
  const offset = say ? 1 : 0;
  return (
    <div
      ref={ref}
      className={`rk-studio rk-board mt-10 lg:mt-14 ${armed ? "is-armed" : ""} ${lit ? "is-in" : ""}`}
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
        {say && (
          <li className="rk-item" style={{ "--i": 0 } as CSSProperties}>
            <div className="rk-plate">
              <Stage
                seated
                light={LIGHT_BY_COLUMN[0]}
                tilt={POSE[5].tilt}
                turn={POSE[5].turn}
                roll={POSE[5].roll}
                depth={POSE[5].depth}
                radius="var(--radius-md)"
              >
                <div className="rk-slip rk-slip--say">{say}</div>
              </Stage>
            </div>
          </li>
        )}
        {PHASES.map((s, i) => {
          const pose = POSE[i % POSE.length];
          return (
            <li key={s.n} className="rk-item" style={{ "--i": i + offset } as CSSProperties}>
              <div className="rk-plate">
                <Stage
                  seated
                  light={LIGHT_BY_COLUMN[(i + offset) % 3]}
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
                    <p className="rk-slip__who">
                      <span className="rk-slip__name">{s.who}</span>
                    </p>
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
      <Seo title="Section treatments" description="Four treatments of one section." path="/preview/sections" noIndex />

      {/* ─── 0. AS BUILT ─────────────────────────────────────────────────── */}
      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Frame
            tag="Now"
            what="Heading, lead, object, the object's own printed header, then a closing note. The section names its subject five times before the reader reaches anything they did not already know."
          >
            <Settle>
              <h2 className="t-h2 max-w-[18ch]">Five people read every draft</h2>
              <Lead className="mt-5">{LEAD}</Lead>
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

      {/* ─── A. ONE STATEMENT ────────────────────────────────────────────── */}
      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Frame
            tag="A. One statement"
            what="One block of display type and nothing else. The names move into the statement rather than sitting under it in a second face, and the closing note goes because slips 02 and 05 already print the rounds. Three layers of type become one."
          >
            <Settle>
              <h2 className="say">Five people read every draft. Paula, Lydia, Kirstie, Conor and David.</h2>
            </Settle>
            <Board />
            <Settle>
              <More />
            </Settle>
          </Frame>
        </Container>
      </Section>

      {/* ─── B. THE RUN-IN ───────────────────────────────────────────────── */}
      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Frame
            tag="B. The run-in"
            what="One block of text instead of three. The statement opens the paragraph in the display face and the prose carries straight on from it, the way a printed lede does. Keeps every word of the lead."
          >
            <Settle>
              {/* h2 and p both go inline, so this is one block of text to read
                  and still a real heading to a screen reader. */}
              <div className="runin">
                <h2 className="runin__say">Five people read every draft.</h2>
                <p className="runin__rest">{LEAD}</p>
              </div>
            </Settle>
            <Board />
            <Settle>
              <More />
            </Settle>
          </Frame>
        </Container>
      </Section>

      {/* ─── C. THE STATEMENT STANDS IN THE ROOM ─────────────────────────── */}
      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Frame
            tag="C. In the room"
            what="No opener at all. The statement is a sixth card on the same shelf, on the same paper, leaning at its own angle under the same lamp, so the reader meets the sentence inside the object rather than above it."
          >
            <Board
              say={
                <>
                  <h2 className="say-line">Five people read every draft.</h2>
                  <p className="say-who">Paula, Lydia, Kirstie, Conor and David. Alan writes.</p>
                </>
              }
            />
            <Settle>
              <More />
            </Settle>
          </Frame>
        </Container>
      </Section>
    </>
  );
}
