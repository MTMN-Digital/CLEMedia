import type { Phase, Member } from "./people";
import "@/components/draw/draw.css";

/* ============================================================================
   Where one person comes into the five phases.

   The roster is eight biographies of two to four paragraphs each, which is
   the largest block of unbroken prose left on the site. This goes in its
   margin, beside the name, and answers in one look the question an investor
   actually has about a named individual: what is this one accountable for.

   DELIBERATELY PLAIN. The client's note was to keep it "fairly simple,
   intuitive, and not too large", and he is right: it repeats the whole way
   down the page, so anything with personality becomes wallpaper by the third.
   A node per phase on a track, filled where this person comes into it,
   hollow where they do not. No labels, no key, no legend.

   IT CANNOT DISAGREE WITH THE BOARD. Every value is read from `people.ts`:
   `phases` holds the phases the company's own account places this person in.
   The last component on this site that kept its own copy of the sequence had
   it wrong and contradicted the company about its own process; it was deleted
   on 2026-10-03. There is one source and this reads it.

   NOBODY IN ANY PHASE GETS NO TRACK AT ALL, rather than a row of hollow
   nodes: empty circles beside a person read as missing data, when the fact is
   that the work sits outside the script and episode reviews entirely. The
   roster says so in words.
   ========================================================================== */

export function StandsAt({ member, phases }: { phases: Phase[]; member: Member }) {
  const at = phases.map((s) => ({ n: s.n, on: member.phases.includes(Number(s.n)) }));
  if (!at.some((s) => s.on)) return null;

  const W = 150;
  const Y = 11;
  const x = (i: number) => 9 + ((W - 18) * i) / (at.length - 1);

  return (
    <svg
      /* EXACT, no wobble. The hand's displacement filter moves a point by up
         to 2.6 user units, and this drawing is 22 units tall, so the same
         amount that bends a 300-unit sheet tears a 5-unit node open. Shot at
         4x on 2026-10-11: one circle came out with a crescent bitten out of
         it and the rule between two nodes broke in half. Under about 40 units
         tall a drawing takes the opt-out. */
      className="ink ink--exact standsat"
      viewBox={`0 0 ${W} 22`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        pathLength="1"
        d={`M${x(0)} ${Y} H ${x(at.length - 1)}`}
        className="ink-line ink-thin ink-draw"
        style={{ "--d": "0.1s", "--dur": "0.7s" } as React.CSSProperties}
      />
      {at.map((s, i) => (
        <g key={s.n} className="ink-in" style={{ "--d": `${0.45 + i * 0.07}s` } as React.CSSProperties}>
          <circle cx={x(i)} cy={Y} r="5" className="ink-fill" />
          <circle cx={x(i)} cy={Y} r="5" className="ink-line ink-thin" />
          {s.on && <circle cx={x(i)} cy={Y} r="3.2" className="ink-accent-fill" />}
        </g>
      ))}
    </svg>
  );
}
