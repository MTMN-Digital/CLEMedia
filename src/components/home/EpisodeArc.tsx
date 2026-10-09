import { Settle } from "@/components/Settle";

/* ============================================================================
   One episode, three stages, drawn.

   WHAT THIS REPLACED, 2026-10-09. Three equal columns divided by hairlines,
   each headed by `01` `02` `03` set large in mono. That is two house tells in
   one block: the numbered mono eyebrow retired on 2026-09-03, and the row of
   three identical cards. The client named it unprompted. It was also the
   weakest possible rendering of the company's actual proposition, which is
   not a list of three features, it is one journey: the episode leaves the
   screen, becomes something the child does, and ends up on paper.

   SO IT IS ONE OBJECT, NOT THREE. A single stroke runs out of a lit screen,
   arcs up through the room, and lands on a printed sheet standing on a ledge.
   The three words sit at the three moments along it and the client's own
   three sentences hang off them as captions, at three different heights, so
   nothing reads as a grid. No copy was cut: every word of the original three
   paragraphs is still here.

   THE STROKE DRAWS ITSELF, ONCE, on entry, left to right, and then stops.
   `stroke-dasharray` on a `pathLength="1"` path, driven by a CSS keyframe
   with `forwards`, which matters for two reasons: the contrast sweep zeroes
   `animation-duration` and pins `animation-iteration-count`, so a `forwards`
   keyframe lands on its final frame for the capture, where a framer-motion
   tween would photograph mid-draw. And under `prefers-reduced-motion` the
   animation is dropped entirely and the drawing is simply complete.

   TWO COMPOSITIONS. The arc is horizontal where there is room for it and
   vertical below 900px, because a 1200-wide drawing at 390 is 110px tall and
   unreadable. Same three marks, same stroke, laid out for the space.
   ========================================================================== */

interface Moment {
  key: string;
  word: string;
  line: string;
}

const MOMENTS: Moment[] = [
  {
    key: "watch",
    word: "Watch",
    line: "An episode, together. Calm stories paced for how young children actually take things in, with nothing autoplaying into something nobody chose.",
  },
  {
    key: "play",
    word: "Play",
    line: "A pause for a movement or breathing prompt, so the episode becomes something a child does rather than only sees.",
  },
  {
    key: "learn",
    word: "Learn",
    line: "A printable or an educator-designed activity afterwards, moving the learning off the screen entirely.",
  },
];

/* The lit screen the episode plays on. Drawn, not photographed: there is no
   photography on this project and no generated imagery. */
function Screen({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g className="arc-screen">
      <rect x={x} y={y} width={w} height={h} rx="10" className="arc-fill" />
      <rect x={x} y={y} width={w} height={h} rx="10" className="arc-line" />
      {/* The picture inside it: the garden horizon the show is set in. */}
      <path
        d={`M${x + 12} ${y + h - 20} q ${w * 0.22} -${h * 0.34} ${w * 0.46} -${h * 0.1}
            q ${w * 0.2} ${h * 0.2} ${w * 0.42} -${h * 0.26}`}
        className="arc-line arc-thin"
      />
      <circle cx={x + w * 0.74} cy={y + h * 0.3} r="7" className="arc-sun" />
      {/* The stand, so the screen is an object in a room and not an icon. */}
      <path d={`M${x + w / 2} ${y + h} v 14 M${x + w / 2 - 22} ${y + h + 14} h 44`} className="arc-line" />
    </g>
  );
}

/* The moment the child gets up: the stroke's apex, marked rather than drawn
   as a figure. A drawn child on a site that refuses stock photography of
   children would be the same claim by another route. */
function Burst({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="arc-burst">
      <circle cx={cx} cy={cy} r="9" className="arc-dot" />
      <g className="arc-line arc-thin">
        <path d={`M${cx} ${cy - 20} v -9`} />
        <path d={`M${cx + 17} ${cy - 11} l 7 -6`} />
        <path d={`M${cx - 17} ${cy - 11} l -7 -6`} />
        <path d={`M${cx + 20} ${cy + 6} l 9 2`} />
        <path d={`M${cx - 20} ${cy + 6} l -9 2`} />
      </g>
    </g>
  );
}

/* Where it ends up: a printed sheet standing on a ledge, which is the same
   object the shop stands on its shelf and the kit stands everywhere else. */
function Sheet({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const rule = (i: number) => y + 22 + i * 15;
  return (
    <g className="arc-sheet">
      <rect x={x} y={y} width={w} height={h} rx="4" className="arc-fill" />
      <rect x={x} y={y} width={w} height={h} rx="4" className="arc-line" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${x + 14} ${rule(i)} h ${w - 28 - (i === 3 ? 26 : 0)}`} className="arc-line arc-thin" />
      ))}
      <rect x={x + 14} y={rule(4) + 2} width={w - 28} height={h - (rule(4) + 2 - y) - 14} rx="3" className="arc-line arc-thin" />
      <path d={`M${x - 10} ${y + h} h ${w + 20}`} className="arc-ledge" />
    </g>
  );
}

export function EpisodeArc() {
  return (
    <div className="arc">
      {/* WIDE: the journey runs left to right across the band. */}
      <svg className="arc-svg arc-wide" viewBox="0 0 1120 300" role="img"
        aria-label="One episode: it plays on a screen, the child gets up and plays, and it ends on a printed sheet.">
        <Screen x={30} y={74} w={230} h={150} />
        {/* The one continuous stroke. It leaves the screen, rises through the
            room, and comes down onto the sheet. pathLength 1 so the dash
            maths is width-independent. */}
        <path
          pathLength="1"
          className="arc-path"
          d="M270 150 C 400 150, 430 56, 560 56 C 690 56, 712 150, 840 150 C 880 150, 885 150, 900 150"
        />
        <Burst cx={560} cy={56} />
        <Sheet x={900} y={74} w={190} h={150} />
      </svg>

      {/* NARROW: the same three marks, stacked, with the stroke running down
          the left of them. */}
      <svg className="arc-svg arc-tall" viewBox="0 0 300 760" role="img"
        aria-label="One episode: it plays on a screen, the child gets up and plays, and it ends on a printed sheet.">
        <Screen x={78} y={16} w={160} h={104} />
        <path
          pathLength="1"
          className="arc-path"
          d="M158 140 C 158 226, 40 248, 40 330 C 40 412, 158 440, 158 530"
        />
        <Burst cx={40} cy={330} />
        <Sheet x={78} y={530} w={150} h={112} />
      </svg>

      <Settle as="ol" className="arc-words">
        {MOMENTS.map((m) => (
          <li key={m.key} className={`arc-word arc-word--${m.key}`}>
            <h3>{m.word}</h3>
            <p>{m.line}</p>
          </li>
        ))}
      </Settle>
    </div>
  );
}
