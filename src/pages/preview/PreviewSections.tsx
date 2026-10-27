import type { ReactNode } from "react";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Container, Section, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { PHASES } from "@/components/team/people";
import "@/components/draw/draw.css";
import "./sections.css";

/* ============================================================================
   Element designs for one section, for a direction call. Not a page of the
   site: it is routed at /preview/sections and nothing links to it.

   WHERE THIS GOT TO. The client's verdict on 2026-10-27 settled the structure:
   the heading stays outside and above, and the client's own sentence for each
   phase goes inside the object, which deletes the lead paragraph we had
   written to summarise those same five sentences. That is fixed now and every
   treatment below keeps it.

   WHAT IS STILL OPEN is the design of the object itself: "the overall design
   of the feature needs a lot of work, the design direction isn't up to
   scratch". The thing being judged is a cream rounded rectangle with a drop
   shadow standing on a brown shelf, five times. So these are four different
   answers to what a phase should look like, all carrying identical content.

   THE CLIENT IS A FILM COMPANY and owns a drawing kit. Two of the four use
   that; the other two are the restrained end of the range.
   ========================================================================== */

/* The return mark, for the two phases the client's account says repeat. */
function Loop({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`ink ink--fine ${className}`}
      viewBox="0 0 34 34"
      aria-hidden="true"
      focusable="false"
    >
      <path className="ink-line ink-draw ink-accent" pathLength="1" d="M28 17a11 11 0 1 1-4.8-9.1" fill="none" />
      <path className="ink-line ink-draw ink-accent" pathLength="1" d="M24.2 2.4l-1.4 5.8 5.7 1" fill="none" />
    </svg>
  );
}

/* ─── 1. THE INDEX CARD. Squared corners, a tab carrying the numeral, one
   red rule across the head the way a real filing card is printed, and the
   card laid on the page's own paper rather than standing in a lit room. ── */
function IndexCards() {
  return (
    <Settle as="ol" className="ix">
      {PHASES.map((s, i) => (
        <li key={s.n} className={`ix__card ${i % 2 ? "ix__card--b" : "ix__card--a"}`}>
          <span className="ix__tab tnum" aria-hidden="true">{s.n}</span>
          <h3 className="ix__title">
            <span className="sr-only">Phase {s.n}. </span>
            {s.phase}
          </h3>
          <p className="ix__what">{s.what}</p>
          {s.rounds && (
            <p className="ix__rounds">
              <Loop className="ix__loop" />
              {s.rounds}
            </p>
          )}
        </li>
      ))}
    </Settle>
  );
}

/* ─── 2. THE FILMSTRIP. One object, not five: a strip of perforated stock
   with a frame per phase. The company makes film, and nothing else on the
   site says so in its furniture. ───────────────────────────────────────── */
function FilmStrip() {
  return (
    <Settle className="fs">
      <span className="fs__perf fs__perf--top" aria-hidden="true" />
      <ol className="fs__frames">
        {PHASES.map((s) => (
          <li key={s.n} className="fs__frame">
            <p className="fs__no tnum" aria-hidden="true">{s.n}</p>
            <h3 className="fs__title">
              <span className="sr-only">Phase {s.n}. </span>
              {s.phase}
            </h3>
            <p className="fs__what">{s.what}</p>
            {s.rounds && (
              <p className="fs__rounds">
                <Loop className="fs__loop" />
                {s.rounds}
              </p>
            )}
          </li>
        ))}
      </ol>
      <span className="fs__perf fs__perf--bottom" aria-hidden="true" />
    </Settle>
  );
}

/* ─── 3. THE DRAWN CARD. The box is drawn by the same hand as every other
   mark on this site instead of being a border radius. ──────────────────── */
function DrawnBox() {
  return (
    <svg
      className="ink dr__box"
      viewBox="0 0 200 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* `vector-effect` is what makes one drawn box serve five cards: the
          viewBox is stretched to the cell, and without it the vertical
          strokes come out twice the weight of the horizontal ones. It also
          rules out `ink-draw`, whose dash array is in user units and stops
          matching `pathLength` once the stroke leaves that coordinate
          system, so the box fades in rather than drawing itself. */}
      <path
        className="ink-line ink-in"
        vectorEffect="non-scaling-stroke"
        d="M4 7 C60 4, 140 5, 196 6 C197 44, 196 80, 195 114 C132 116, 68 115, 5 113 C3 78, 4 42, 4 7Z"
        fill="none"
      />
    </svg>
  );
}

function DrawnCards() {
  return (
    <Settle as="ol" className="dr">
      {PHASES.map((s) => (
        <li key={s.n} className="dr__card">
          <DrawnBox />
          <div className="dr__in">
            <p className="dr__no tnum" aria-hidden="true">{s.n}</p>
            <h3 className="dr__title">
              <span className="sr-only">Phase {s.n}. </span>
              {s.phase}
            </h3>
            <p className="dr__what">{s.what}</p>
            {s.rounds && (
              <p className="dr__rounds">
                <Loop className="dr__loop" />
                {s.rounds}
              </p>
            )}
          </div>
        </li>
      ))}
    </Settle>
  );
}

/* ─── 4. NO CARD. The five phases as a ruled run of type, with the numerals
   hanging in the margin. No box, no shadow, no ground. ─────────────────── */
function RuledRun() {
  return (
    <Settle as="ol" className="rr">
      {PHASES.map((s) => (
        <li key={s.n} className="rr__row">
          <div className="rr__gutter">
            <p className="rr__no tnum" aria-hidden="true">{s.n}</p>
            {s.rounds && <Loop className="rr__loop" />}
          </div>
          <h3 className="rr__title">
            <span className="sr-only">Phase {s.n}. </span>
            {s.phase}
          </h3>
          <p className="rr__what">{s.what}</p>
          <p className="rr__who">{s.who}</p>
          {s.rounds && <p className="rr__rounds">{s.rounds}</p>}
        </li>
      ))}
    </Settle>
  );
}

function Head() {
  return (
    <Settle>
      <h2 className="t-h2">Five people read every draft</h2>
    </Settle>
  );
}

function More() {
  return (
    <Settle className="mt-10">
      <TextLink to="/team">
        Who each of them is, and the advisory board
        <IconArrow size={15} />
      </TextLink>
    </Settle>
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
      <Seo title="Section treatments" description="Element designs for one section." path="/preview/sections" noIndex />

      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Frame
            tag="1. The index card"
            what="Squared corners, a tab carrying the numeral, one red rule across the head the way a filing card is printed, and the card laid on the page's own paper instead of standing in a lit brown room. The lightest change from what is there now, and it takes the murk out."
          >
            <Head />
            <IndexCards />
            <More />
          </Frame>
        </Container>
      </Section>

      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Frame
            tag="2. The filmstrip"
            what="One object instead of five. A strip of perforated stock with a frame per phase. The company makes film and nothing in the site's furniture says so anywhere; this is the one piece of vocabulary only this client can use."
          >
            <Head />
            <FilmStrip />
            <More />
          </Frame>
        </Container>
      </Section>

      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Frame
            tag="3. The drawn card"
            what="The same five cards, with the box drawn by the hand that draws everything else on this site rather than set as a border radius. Warm without being childish, and it makes the drawing kit part of the structure instead of decoration beside it."
          >
            <Head />
            <DrawnCards />
            <More />
          </Frame>
        </Container>
      </Section>

      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Frame
            tag="4. No card at all"
            what="A ruled run of type with the numerals hanging in the margin. No box, no shadow, no ground. The restrained end of the range, and the one that reads closest to an annual report."
          >
            <Head />
            <RuledRun />
            <More />
          </Frame>
        </Container>
      </Section>
    </>
  );
}
