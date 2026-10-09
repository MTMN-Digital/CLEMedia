import type { Member, Stage } from "./people";
import "@/components/draw/draw.css";

/* ============================================================================
   Where one person stands on the six.

   The roster is seven biographies of three or four paragraphs each, which is
   the largest block of unbroken prose left on the site. This goes in its
   margin, beside the name, and answers in one look the question an investor
   actually has about a named individual: what is this one accountable for.

   DELIBERATELY PLAIN. The client's note was to keep it "fairly simple,
   intuitive, and not too large", and he is right: it repeats seven times down
   one page, so anything with personality becomes wallpaper by the third. Six
   nodes on a track, filled where this person stands, hollow where they do
   not. No labels, no key, no legend. The numbers under the filled ones are
   the only text, and they are there because "which three" is the whole
   content.

   IT CANNOT DISAGREE WITH THE BOARD. Every value is read from `people.ts`:
   `named` holds the stages the company's own account names this person at,
   and `team` marks whether they share the two stages that account gives to
   the team as a whole. The last component on this site that kept its own copy
   of the six stages had them wrong and contradicted the company about its own
   process; it was deleted on 2026-10-03. There is one source and this reads
   it.

   THE ADVISER GETS NOTHING. `outside` renders no track at all rather than a
   track with six hollow nodes: six empty circles beside a person reads as
   missing data, when the fact is that advisory input sits outside the
   sequence entirely. The roster already says that in words.
   ========================================================================== */

export function StandsAt({
  member,
  stages,
  outside = false,
}: {
  member: Member;
  stages: Stage[];
  outside?: boolean;
}) {
  if (outside) return null;

  const at = stages.map((s) => {
    const n = Number(s.n);
    return {
      n: s.n,
      /* Named at this stage, or it is one of the two the whole team takes. */
      on: member.named.includes(n) || (member.team && Boolean(s.shared)),
    };
  });
  if (!at.some((s) => s.on)) return null;

  const W = 150;
  const Y = 11;
  const x = (i: number) => 9 + ((W - 18) * i) / (at.length - 1);

  return (
    <svg
      className="ink standsat"
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
