import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Figure } from "@/components/Figure";
import { Container, Section, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { PHASES } from "@/components/team/people";
import "@/components/draw/draw.css";
import "./sections.css";

import { useId, type ReactNode } from "react";

/* ============================================================================
   The drawn kit, applied. Routed at /preview/sections; nothing links to it.

   WHERE THIS CAME FROM. The client picked the drawn card out of four element
   designs on 2026-10-27 and asked to build from it: "perhaps that could be
   the primary design element elsewhere. Like doing a filmstrip out of drawn
   lines perhaps".

   THE IDEA, STATED PROPERLY. The site already owns a drawing kit and has
   been using it for illustration: a child, a script, a garden, a fork in a
   road, sitting beside the content as pictures. The proposal is to promote it
   from illustration to STRUCTURE. Every box, every rule, every frame, every
   bracket on this site is currently a one pixel border or a border-radius.
   Drawn, they become the thing that makes the site look like nothing else,
   and they cost nothing in weight because they are paths, not images.

   THE ONE RULE THAT MAKES IT WORK. A drawn line used forty times from one
   path stops being a hand and becomes a pattern. So every primitive here
   carries variants and cycles them by position, and the two that genuinely
   should repeat, the sprocket holes on the strip, repeat on purpose: real
   perforations are punched identically.

   WHY `preserveAspectRatio="none"` AND `vector-effect`. One drawn box has to
   serve a card 300px wide and a strip 1300px wide. The path stretches to the
   element and the stroke does not, so the weight stays the same everywhere
   and the wobble stretches with the box, which is what a drawn line does when
   you draw a longer one.
   ========================================================================== */

/* ─── The primitives ────────────────────────────────────────────────────── */

/* Three boxes. Hand-placed wobble, not generated: a random walk reads as
   noise, and a drawn rectangle is four confident strokes that miss. */
const BOXES = [
  "M4 7 C60 4, 140 5, 196 6 C197 44, 196 80, 195 114 C132 116, 68 115, 5 113 C3 78, 4 42, 4 7Z",
  "M5 5 C62 7, 139 4, 195 7 C196 43, 195 79, 196 115 C130 113, 70 117, 4 114 C5 77, 3 41, 5 5Z",
  "M4 8 C58 5, 142 7, 196 5 C194 42, 197 81, 195 113 C134 117, 66 113, 5 115 C4 79, 5 43, 4 8Z",
];

function DrawnBox({ v = 0, className = "" }: { className?: string; v?: number }) {
  return (
    <svg
      className={`ink dk-box ${className}`}
      viewBox="0 0 200 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="ink-line ink-in" vectorEffect="non-scaling-stroke" d={BOXES[v % BOXES.length]} fill="none" />
    </svg>
  );
}

/* Three rules. These replace the site's `border-top: 1px solid var(--rule)`,
   which appears about two hundred times. */
const RULES = [
  "M2 3 C120 1.5, 240 4.2, 360 2.6 C440 1.8, 520 3.8, 598 2.4",
  "M2 2.6 C110 4, 230 1.8, 350 3.4 C450 4.4, 520 2, 598 3.2",
  "M2 3.4 C130 2, 250 4, 370 2.2 C460 1.4, 530 3.6, 598 2.8",
];

function DrawnRule({ v = 0, className = "" }: { className?: string; v?: number }) {
  return (
    <svg
      className={`ink dk-rule ${className}`}
      viewBox="0 0 600 6"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="ink-line ink-thin ink-in" vectorEffect="non-scaling-stroke" d={RULES[v % RULES.length]} fill="none" />
    </svg>
  );
}

/* A photo corner, the kind in an album. Four of them hold a picture without
   putting a box round it. */
function DrawnCorner({ at }: { at: "tr" | "tl" | "bl" | "br" }) {
  return (
    <svg className={`ink dk-corner dk-corner--${at}`} viewBox="0 0 26 26" aria-hidden="true" focusable="false">
      <path className="ink-line ink-in" d="M24 3.4 C17 2.4, 9.5 3.4, 4.4 3 C3.4 9.5, 4 16.5, 3.4 23.5" fill="none" />
    </svg>
  );
}

/* A bracket, for marking one row of a set without boxing it. */
function DrawnBracket() {
  return (
    <svg className="ink dk-bracket" viewBox="0 0 14 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path
        className="ink-line ink-in"
        vectorEffect="non-scaling-stroke"
        d="M11 2 C6 3, 3.4 2.6, 2.6 8 C2 30, 3.4 50, 2.6 70 C3 92, 5 96, 11 98"
        fill="none"
      />
    </svg>
  );
}

/* The perforations. A `<pattern>` tiles without stretching, which is what
   separates a row of punched holes from one hole scaled to the strip. They
   are the one thing here that repeats identically on purpose. */
function Perf() {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className="ink dks__perf" height="14" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`perf-${uid}`} patternUnits="userSpaceOnUse" width="27" height="14">
          <path
            className="ink-line ink-thin"
            d="M4 3.4 C9.5 2.8, 17 3.3, 22 3 C22.4 6, 22 9, 22.2 11 C17 11.7, 9 11, 4.5 11.2 C3.9 8.6, 4.3 6, 4 3.4Z"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill={`url(#perf-${uid})`} />
    </svg>
  );
}

/* The return mark, for the two phases the client's account says repeat. */
function Loop({ className = "" }: { className?: string }) {
  return (
    <svg className={`ink ink--fine ${className}`} viewBox="0 0 34 34" aria-hidden="true" focusable="false">
      <path className="ink-line ink-draw ink-accent" pathLength="1" d="M28 17a11 11 0 1 1-4.8-9.1" fill="none" />
      <path className="ink-line ink-draw ink-accent" pathLength="1" d="M24.2 2.4l-1.4 5.8 5.7 1" fill="none" />
    </svg>
  );
}

/* ─── 1. The card, as picked ─────────────────────────────────────────────── */
function DrawnCards() {
  return (
    <Settle as="ol" className="dk-cards">
      {PHASES.map((s, i) => (
        <li key={s.n} className="dk-card">
          <DrawnBox v={i} />
          <div className="dk-card__in">
            <p className="dk-no tnum" aria-hidden="true">{s.n}</p>
            <h3 className="dk-title">
              <span className="sr-only">Phase {s.n}. </span>
              {s.phase}
            </h3>
            <p className="dk-what">{s.what}</p>
            {s.rounds && (
              <p className="dk-rounds">
                <Loop className="dk-loop" />
                {s.rounds}
              </p>
            )}
          </div>
        </li>
      ))}
    </Settle>
  );
}

/* ─── 2. The strip, drawn ────────────────────────────────────────────────── */
function DrawnStrip() {
  /* NO OUTER BOX. A drawn rectangle round the whole strip put two vertical
     strokes through the perforation rows, which reads as a mistake rather
     than as film: real stock has no ends, it runs off both edges. The two
     rows of holes are the edges. */
  return (
    <Settle className="dks">
      <Perf />
      <ol className="dks__frames">
        {PHASES.map((s, i) => (
          <li key={s.n} className="dks__frame">
            <DrawnBox v={i + 1} />
            <div className="dks__in">
              <p className="dks__no tnum" aria-hidden="true">{s.n}</p>
              <h3 className="dk-title">
                <span className="sr-only">Phase {s.n}. </span>
                {s.phase}
              </h3>
              <p className="dks__what">{s.what}</p>
              {s.rounds && (
                <p className="dks__rounds">
                  <Loop className="dks__loop" />
                  {s.rounds}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      <Perf />
    </Settle>
  );
}

/* ─── 3. The rule, as the site's hairline ────────────────────────────────── */
function DrawnRows() {
  return (
    <Settle as="ol" className="dkr">
      {PHASES.map((s, i) => (
        <li key={s.n} className="dkr__row">
          {i > 0 && <DrawnRule v={i} className="dkr__line" />}
          <div className="dkr__gutter">
            <p className="dk-no tnum" aria-hidden="true">{s.n}</p>
            {s.rounds && <Loop className="dkr__loop" />}
          </div>
          <h3 className="dk-title dkr__title">
            <span className="sr-only">Phase {s.n}. </span>
            {s.phase}
          </h3>
          <p className="dkr__what">{s.what}</p>
          <p className="dkr__who">{s.who}</p>
        </li>
      ))}
    </Settle>
  );
}

/* ─── 4. The photograph, held by corners ─────────────────────────────────── */
const DOGS = [
  { a: "dog.finn-1" as const, cap: "Finn, the fawn pug the character is named after." },
  { a: "dog.fia-1" as const, cap: "Fia, the black pug. A photograph, not a frame." },
];

function DrawnMounts() {
  return (
    <Settle as="ul" className="dkm">
      {DOGS.map((d) => (
        <li key={d.a} className="dkm__item">
          <figure className="dkm__fig">
            <div className="dkm__pic">
              <Figure asset={d.a} rounded="rounded-none" sizes="(min-width: 1024px) 420px, 88vw" />
              <DrawnCorner at="tl" />
              <DrawnCorner at="tr" />
              <DrawnCorner at="bl" />
              <DrawnCorner at="br" />
            </div>
            <figcaption className="dkm__cap">{d.cap}</figcaption>
          </figure>
        </li>
      ))}
    </Settle>
  );
}

/* ─── 5. The docket, drawn ───────────────────────────────────────────────── */
const DOCKET = [
  { k: "Choose a file", v: "its own page" },
  { k: "Pay by card", v: "Stripe" },
  { k: "Download", v: "straight away" },
  { k: "Link valid for", v: "24 hours" },
];

function DrawnDocket() {
  return (
    <Settle className="dkd">
      <DrawnBox v={2} className="dkd__edge" />
      <div className="dkd__in">
        <p className="dkd__label">What a purchase is</p>
        <dl className="dkd__rows">
          {DOCKET.map((r, i) => (
            <div key={r.k} className="dkd__row">
              {i > 0 && <DrawnRule v={i + 1} className="dkd__line" />}
              <dt>{r.k}</dt>
              <dd className="tnum">{r.v}</dd>
            </div>
          ))}
        </dl>
        <div className="dkd__mark">
          <DrawnBracket />
          <p className="dkd__note">
            No account, no email gate, and nobody is added to a mailing list by buying something.
          </p>
        </div>
      </div>
    </Settle>
  );
}

/* ─── The page ───────────────────────────────────────────────────────────── */

function Head({ children }: { children: ReactNode }) {
  return (
    <Settle>
      <h2 className="t-h2">{children}</h2>
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

function Plate({ tag, what, children }: { what: string; tag: string; children: ReactNode }) {
  return (
    <Section pad={["normal", "tight"]}>
      <Container width="wide">
        <div className="pv-frame">
          <p className="pv-tag">{tag}</p>
          <p className="pv-what">{what}</p>
        </div>
        {children}
      </Container>
    </Section>
  );
}

export default function PreviewSections() {
  return (
    <>
      <Seo title="The drawn kit" description="The drawing kit promoted from illustration to structure." path="/preview/sections" noIndex />

      <Plate
        tag="1. The card"
        what="The one you picked, with three box variants cycling so no two cards are the same stroke. Everything below is built from the same two primitives: a drawn box and a drawn rule."
      >
        <Head>Five people read every draft</Head>
        <DrawnCards />
        <More />
      </Plate>

      <Plate
        tag="2. The strip, drawn"
        what="The filmstrip with nothing solid in it: the stock is a drawn rectangle, each frame is a drawn rectangle inside it, and the perforations are one drawn square repeated, because real perforations are punched identically. The only black bar on the page is gone and the paper shows through."
      >
        <Head>Five people read every draft</Head>
        <DrawnStrip />
        <More />
      </Plate>

      <Plate
        tag="3. The rule"
        what="The site has roughly two hundred one pixel hairlines in it, between rows, under headings, round cards. This is the same set of phases with every rule drawn instead, cycling three strokes so a column of them does not read as a pattern. It is the cheapest change on this page and the one that would touch the most of the site."
      >
        <Head>Five people read every draft</Head>
        <DrawnRows />
        <More />
      </Plate>

      <Plate
        tag="4. The photograph"
        what="Corners rather than a box. The site has photographs of real dogs, real people and the real garden, and every one of them currently sits in a rounded rectangle. Four drawn corners hold a picture the way an album does, and say photograph rather than card."
      >
        <Head>Meet the real Finn and Fia</Head>
        <DrawnMounts />
      </Plate>

      <Plate
        tag="5. The docket"
        what="The shop's terms, with the panel drawn, the rules between the rows drawn, and a drawn bracket marking the line that matters instead of a coloured box round it. The bracket is the piece that generalises furthest: it marks one thing in a set without making it a card."
      >
        <Head>What a purchase is</Head>
        <DrawnDocket />
      </Plate>
    </>
  );
}
