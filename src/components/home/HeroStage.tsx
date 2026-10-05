import { useCallback, useEffect, useRef } from "react";
import { HeroMark3D } from "@/components/home/HeroMark3D";
import { HeroMark } from "@/components/home/HeroMark";
import { Button } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
import { SITE } from "@/lib/site";

/* ============================================================================
   The hero, as a photographed set, and the first scroll as a camera move.

   The mark is four felted objects hanging on strings. On every other page of
   this site it behaves like an image. Here it hangs in a room: a paper sweep
   behind it, a lamp up and to the left, a floor under it, the garden's leaves
   between the lamp and the paper and between the camera and the objects.

   THE SEQUENCE. The frame a reader lands on is the logo alone: large, hung
   from the top of the frame, the subject of the screen, with lit floor
   beneath it and a scroll cue. Nothing else. The first scroll holds the page
   and dollies the camera in: the objects come toward the lens and turn on
   their strings, the camera tilts down to follow the floor, and in the floor
   it uncovers stand the headline, the lead and the two buttons, which rise
   into the frame from below as part of the same move. Once they are placed
   they do not move again. Then the hold releases and the page carries on.

   WHAT MAKES IT A ROOM RATHER THAN A BACKDROP. Four things, each a separate
   layer of the markup below:

   1. Tonal range. The sweep runs from a lit pool of paper to a corner three
      stops deeper than anything else on the page. A single band of cream is
      a web page background; a lamp with a falloff is a set.
   2. A floor. The sweep curves into a floor at about the objects' feet, the
      objects throw a flattened shadow across it, and the headline stands on
      it and throws its own. Nothing here floats.
   3. A foreground. Blurred leaves cross the near corners of the frame, nearer
      the camera than the objects, and they pan the furthest when the camera
      moves. Every photograph of a set has something in front of the subject.
   4. Three rates. The sweep pans a little and grows a little, the objects
      more, the leaves most. One rate is a slide; three rates are depth.

   The garden is in the set as light and as foliage: leaf shadow dappling the
   paper (a gobo, light through foliage), and the real leaves in the near
   corners. Not as a photograph behind the sweep, which would put a second
   picture behind the first.

   WHY IT IS DONE IN JS AND NOT IN CSS. Scroll-driven animation timelines are
   not available everywhere this has to run, Lenis owns the scroll position
   anyway, and the whole thing is four numbers written to custom properties
   once a frame: --p, the raw timeline; --turn, the eased move; --dolly, the
   mark's size as a fraction of full; --rise, how far the figure sits below
   its final place at rest; and --words-off, how far below theirs the words
   do. The transforms are pure CSS, so if JS never runs the markup's resting
   values are what render.

   THE WEBGL PATH. On a wide screen with WebGL and no reduced-motion
   preference, HeroMark3D fades a canvas in over the layered mark in which the
   same four objects are relief surfaces under a real lamp, so the turn
   relights them (see hero3d/). The canvas sits BESIDE the CSS dolly, not
   inside it: the CSS path scales flat images, which is fine for flat images,
   but a scaled canvas is resampled pixels and the wool goes soft. The canvas
   keeps one size and the scene moves its camera. It takes the eased pose
   through `subscribe` and reports `onLive`, and the `.is-3d` class hands the
   rotation over to the canvas. The set, the shadows, the leaves and the words
   do not care which path is drawing the objects.
   ========================================================================== */

/** Length of the hold, in viewport heights, on top of the sticky screen. */
const TRAVEL = 0.9;
/** The mark's size at rest as a fraction of its full size. The camera starts
    this much further back, and comes in to 1. Mirrored by REST in the CSS
    fallback's --dolly default. */
const REST_SCALE = 0.7;

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
/** Smootherstep: zero velocity at both ends, so the camera neither jumps off
    the mark nor stops dead at the end of the hold. */
function ease(p: number) {
  const t = clamp01(p);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/* The leaves. Real silhouettes from the garden the show is set in, each drawn
   with its petiole at the origin and its tip at x = 100 so it can be hung off
   a twig by rotation alone. One generic leaf at many angles reads as a
   pattern; these read as a plant, sharp or through the blur, because what
   survives a blur is the outline: a lobe, a notch, a cordate base, a frond's
   comb of pinnae. The thin slit along each midrib is wound the opposite way
   so it cuts a hairline out of the fill where the leaf is seen sharp enough. */
const OAK = "M0 0Q0-1 3-1Q5-2 6-5Q7-8 10-9Q12-10 14-7Q16-5 18-6Q20-7 22-13Q23-20 28-22Q32-24 36-21Q40-18 42-13Q44-9 46-17Q47-26 53-28Q58-30 63-26Q68-23 70-17Q72-11 74-18Q75-26 80-26Q85-27 89-22Q93-18 95-13Q97-8 99-5Q100-2 100 0Q100 2 100 5Q99 7 98 12Q96 16 92 20Q88 24 83 24Q78 23 77 17Q75 10 73 15Q71 21 66 24Q61 27 56 25Q50 23 49 16Q47 8 45 12Q43 16 39 19Q35 22 31 20Q26 18 25 12Q23 6 21 5Q19 5 17 7Q15 9 13 8Q10 7 8 4Q5 2 3 1Q0 1 0 0ZM7 0L86 0L9-2Z";
const BEECH = "M0 0Q0-1 5-1Q10-1 10-1Q10 0 15-6Q19-11 24-14Q28-16 33-18Q37-21 42-21Q46-21 51-20Q55-20 60-20Q64-20 69-17Q73-14 78-13Q82-11 87-9Q91-6 96-3Q100 0 100 0Q100 0 96 3Q91 6 87 9Q82 12 78 14Q73 15 69 18Q64 21 60 21Q55 22 51 22Q46 23 42 23Q37 23 33 20Q28 17 24 15Q19 12 15 6Q10 0 10 1Q10 1 5 1Q0 1 0 0ZM12 0L84 0L14-2Z";
const HAZEL = "M0-1L9-1L3-12L7-21L20-28L25-32L30-35L33-40L35-37L38-39L39-38L43-41L44-37L48-38L49-36L52-37L53-34L57-33L58-31L62-32L63-27L67-26L68-23L71-24L72-19L76-18L77-15L81-14L82-10L100 0L82 10L81 15L77 16L76 19L72 20L71 25L68 25L67 28L63 29L62 33L58 33L57 35L53 36L52 40L49 38L48 40L44 39L43 43L39 40L38 42L35 39L33 42L30 38L25 34L20 29L7 20L3 12L9 1L0 1ZM11 0L80 0L13-2Z";
const BIRCH = "M0-1L22-1L21-6L32-23L36-24L40-27L41-25L45-28L46-24L49-25L51-22L54-25L55-21L59-21L60-18L64-20L65-16L68-16L70-13L73-15L75-11L78-11L79-8L83-9L84-5L100 0L84 5L83 10L79 8L78 11L75 11L73 16L70 14L68 17L65 17L64 21L60 19L59 22L55 22L54 26L51 24L49 26L46 25L45 29L41 26L40 28L36 26L32 24L21 7L22 1L0 1ZM24 0L84 0L26-2Z";
const WILLOW = "M0 0Q0-1 3-1Q5-1 5-1Q5 0 10-2Q15-4 20-5Q25-6 30-7Q35-8 40-8Q45-8 50-8Q55-8 59-7Q64-7 69-6Q74-5 79-4Q84-3 92-1Q100 0 100 0Q100 0 92 1Q84 3 79 4Q74 5 69 6Q64 7 59 8Q55 9 50 9Q45 9 40 9Q35 8 30 8Q25 7 20 5Q15 4 10 2Q5 0 5 1Q5 1 3 1Q0 1 0 0ZM7 0L88 0L9-1Z";
const IVY = "M0-1L34-2L36-6L26-14L27-24L34-32L46-22L50-20L62-36L68-40L73-36L72-18L76-14L92-6L96-3L100 0L96 3L92 6L76 13L72 17L73 34L68 38L62 34L50 19L46 21L34 30L27 23L26 13L36 6L34 2L0 2ZM36 0L90 0L38-2Z";
const FERN = "M0-1L100 0L100 1L0 2ZM5-1L4-5L9-6L8-10L12-12L12-15L15-18L16-21L18-23L19-24L19-23L19-19L16-17L16-13L14-11L15-7L11-5L13-1L9 1ZM9-1L13 1L11 5L15 7L14 11L16 13L16 17L19 19L19 23L19 24L18 23L16 21L15 18L12 15L12 12L8 10L9 6L4 5L5 1ZM16-1L15-5L20-6L20-10L24-12L24-15L27-17L28-21L31-23L32-24L31-23L31-19L28-17L28-13L25-11L26-7L23-5L24 0L20 1ZM20-1L24 0L23 5L26 7L25 11L28 13L28 17L31 19L31 23L32 24L31 23L28 21L27 17L24 15L24 12L20 10L20 6L15 5L16 1ZM27-1L27-5L31-6L31-10L35-11L36-15L39-16L40-20L43-22L44-23L43-21L42-18L40-16L40-12L37-10L37-6L34-5L35 0L31 1ZM31-1L35 0L34 5L37 6L37 10L40 12L40 16L42 18L43 21L44 23L43 22L40 20L39 16L36 15L35 11L31 10L31 6L27 5L27 1ZM38-1L38-6L44-7L44-12L49-14L50-17L54-20L55-21L54-20L53-15L50-13L50-8L46-6L46 0L42 1ZM42-1L46 0L46 6L50 8L50 13L53 15L54 20L55 21L54 20L50 17L49 14L44 12L44 7L38 6L38 1ZM49-1L49-6L54-7L55-11L60-12L61-15L64-17L66-18L65-17L64-13L61-11L60-7L57-5L57 0L53 1ZM53-1L57 0L57 5L60 7L61 11L64 13L65 17L66 18L64 17L61 15L60 12L55 11L54 7L49 6L49 1ZM60-1L60-6L65-6L66-9L70-10L71-13L74-15L76-15L75-14L74-11L71-9L71-5L67-4L68 1L64 1ZM64-1L68-1L67 4L71 5L71 9L74 11L75 14L76 15L74 15L71 13L70 10L66 9L65 6L60 6L60 1ZM72-1L72-6L78-6L80-10L84-12L85-12L84-11L83-7L79-5L79 1L74 1ZM74-1L79-1L79 5L83 7L84 11L85 12L84 12L80 10L78 6L72 6L72 1ZM83-1L83-6L88-5L89-8L93-9L94-9L93-8L92-5L89-3L90 1L85 1ZM85-1L90-1L89 3L92 5L93 8L94 9L93 9L89 8L88 5L83 6L83 1ZM94-2L94-5L98-4L98-6L102-6L103-7L102-6L102-2L99-2L100 2L96 2ZM96-2L100-2L99 2L102 2L102 6L103 7L102 6L98 6L98 4L94 5L94 2Z";
const ROWAN = "M0-1L78-1L78 1L0 1ZM12 0L13-5L14-9L15-10L16-14L18-15L19-18L21-19L23-22L25-22L27-25L29-26L31-29L33-29L33-27L31-24L31-22L29-19L29-17L27-15L27-13L24-10L24-9L21-6L20-5L17-3L12 0ZM12 0L17 3L20 5L21 6L24 9L24 10L27 13L27 15L29 17L29 19L31 22L31 24L33 27L33 29L31 29L29 26L27 25L25 22L23 22L21 19L19 18L18 15L16 14L15 10L14 9L13 5L12 0ZM25 0L27-5L28-9L29-9L30-13L32-14L33-17L35-17L37-20L39-20L41-23L43-23L45-26L47-26L47-24L45-22L45-20L43-17L43-15L40-13L40-11L37-9L37-7L34-5L33-4L30-2L25 0ZM25 0L29 2L33 4L34 5L37 7L37 9L40 11L40 13L43 15L43 17L45 20L45 22L47 24L47 26L45 26L43 23L41 23L39 20L37 20L35 17L33 17L32 14L30 13L29 10L27 9L26 5L25 0ZM37 0L40-5L41-8L42-9L44-12L45-12L47-15L49-15L51-18L53-18L55-20L57-21L60-23L61-23L61-21L59-19L59-17L56-15L56-13L54-11L53-9L50-7L50-6L47-4L46-3L42-2L38 0ZM38 0L42 2L46 3L46 4L50 6L50 7L53 9L53 11L56 13L56 15L59 17L59 19L61 21L61 23L60 23L57 21L55 21L53 18L51 18L49 16L47 15L45 12L44 12L42 9L41 8L40 5L38 0ZM50 0L53-4L54-7L56-8L57-11L59-11L61-14L63-14L65-16L67-16L69-18L71-18L73-20L75-20L75-18L72-16L72-14L70-12L69-11L67-9L66-7L63-6L63-4L59-3L59-2L55-1L50 0ZM50 0L55 1L58 2L59 4L62 5L63 6L66 7L66 9L69 11L69 12L72 14L72 16L75 18L75 20L73 20L71 18L69 18L66 16L65 16L62 14L61 14L59 11L57 11L56 8L54 8L53 4L50 0ZM63 0L66-4L68-7L69-7L71-10L72-10L74-12L76-12L78-14L80-14L82-16L84-15L87-17L88-17L88-15L85-14L85-12L83-10L82-9L79-7L79-6L76-4L75-3L72-2L71-1L68-1L63 0ZM63 0L68 1L71 1L72 3L75 3L76 5L79 6L79 7L82 9L82 10L85 12L85 14L88 15L88 17L87 17L84 15L82 16L80 14L78 14L76 12L74 12L72 10L71 10L69 7L67 7L66 4L63 0ZM64 0L69-2L73-4L74-3L78-4L79-4L83-5L85-4L88-4L90-3L93-3L95-1L98-1L100 0L98 1L95 1L93 3L90 3L88 4L85 4L83 5L79 4L78 5L74 3L73 4L69 2L64 0Z";
/* Thin, tapered and very slightly bowed: a ruler-straight stick with leaves
   on it reads as a diagram. It is scaled by the sprig's length, so the bow
   stays in proportion and the leaves below are placed along the same curve. */
const TWIG = "M0-1.4Q50-7 100-1L100 0Q50-5 0 1.4Z";

/** One placed shape: [x, y, rotation, scale, path, squash]. `path` defaults to
    beech; `squash` scales the blade's width only, so a leaf can be seen face
    on (1) or turned nearly edge on (0.6), which a flat spray never is. */
type Place = [number, number, number, number, string?, number?];

/** A spray of leaves. `places` is in a box 1000 wide and `depth` tall, fitted
    inside the layer it sits in (so on a phone the leaves scale down with the
    frame rather than covering it) and pinned to `edge`. */
function Leaves({
  className,
  places,
  edge,
  depth,
}: {
  className: string;
  places: Place[];
  edge: "top" | "bottom";
  depth: number;
}) {
  return (
    <svg
      className={className}
      viewBox={`0 0 1000 ${depth}`}
      preserveAspectRatio={edge === "top" ? "xMidYMin meet" : "xMidYMax meet"}
      aria-hidden="true"
    >
      {places.map(([x, y, r, s, d = BEECH, q = 1], i) => (
        <path key={i} d={d} transform={`translate(${x} ${y}) rotate(${r}) scale(${s} ${s * q})`} />
      ))}
    </svg>
  );
}

/** A sprig: a twig from (x, y) heading `a` degrees for `len` units, with
    `n` leaves alternating either side of it, each a little smaller and turned
    a little differently than the last, and one leaf at the tip. Leaves grow
    in clusters off stems and overlap; this is the cheapest way to say so. */
function sprig(d: string, x: number, y: number, a: number, len: number, n: number, s: number): Place[] {
  const rad = (a * Math.PI) / 180;
  const r1 = (v: number) => Math.round(v * 10) / 10;
  const out: Place[] = [[x, y, a, len / 100, TWIG]];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    /* Not evenly spaced: each leaf sits a little before or after its slot. */
    const u = 0.1 + 0.9 * t + (((i * 5) % 3) - 1) * (0.12 / n);
    const along = len * u;
    /* The twig's centreline bows to about -3 units at its middle (in its own
       100-unit frame); the leaf sits on the bow, not on the chord. */
    const bow = (len / 100) * -12 * u * (1 - u);
    const spread = i === n ? 0 : (i % 2 ? -1 : 1) * (52 - 14 * t) + ((i * 7) % 5 - 2) * 5;
    out.push([
      r1(x + Math.cos(rad) * along - Math.sin(rad) * bow),
      r1(y + Math.sin(rad) * along + Math.cos(rad) * bow),
      a + spread,
      r1(s * (1 - 0.3 * t)),
      d,
      0.62 + (0.38 * ((i * 3) % 4)) / 3,
    ]);
  }
  return out;
}

/* The foliage between the lamp and the paper: its shadow falls across the top
   of the sweep, soft, as dappled light does. Branches reach in from above the
   frame on both sides and thin out toward the middle, where the pool the
   objects hang in stays clean. Oak, hazel, beech, birch and willow sprigs
   with ivy on the wall below them: an Irish garden, nothing tropical. Small
   leaves and many of them, because a dapple is made of the gaps. */
const GOBO: Place[] = [
  /* The box is fitted by height, so on a wide screen it shows from about
     x = -430 to x = 1430: the outermost sprigs start there, so the dapple
     reaches the frame edge instead of stopping short of it. */
  ...sprig(OAK, -430, 60, 20, 380, 7, 0.85),
  ...sprig(BEECH, -300, -50, 52, 380, 7, 0.8),
  ...sprig(HAZEL, -60, -60, 80, 300, 5, 0.8),
  ...sprig(OAK, 120, -40, 62, 320, 6, 0.85),
  ...sprig(BIRCH, 300, -30, 78, 220, 5, 0.65),
  ...sprig(IVY, -120, 330, -12, 300, 4, 0.75),
  [240, 280, 40, 0.7, OAK, 0.8], [40, 400, -10, 0.6, HAZEL], [330, 300, 130, 0.55, BEECH, 0.7],
  ...sprig(BIRCH, 540, -70, 96, 180, 4, 0.55),
  ...sprig(BEECH, 1430, 50, 162, 380, 7, 0.85),
  ...sprig(OAK, 1320, -50, 124, 380, 7, 0.8),
  ...sprig(HAZEL, 1070, -60, 98, 300, 5, 0.8),
  ...sprig(BEECH, 880, -40, 116, 320, 6, 0.85),
  ...sprig(WILLOW, 720, -30, 84, 240, 6, 0.75),
  ...sprig(IVY, 1130, 330, 194, 300, 4, 0.75),
  [780, 300, 60, 0.65, BIRCH], [960, 370, -30, 0.6, OAK, 0.75], [680, 120, 20, 0.5, BEECH, 0.8],
];
/* The foliage between the camera and the objects: nearest the lens, out of
   focus, and anchored to the edge of frame rather than scattered, because a
   foreground is a branch the camera is looking past. In a box 1000 by 420
   across the bottom of the frame; the centre stays clear so nothing ever
   crosses the headline, the lead or the buttons. On a wide screen the box
   shows well beyond x = 0 and x = 1000, which is where the branches start. */
/* Two sprays at two distances. One set of leaves at one blur is a flat shape
   stuck to the lens; a near spray and a slightly further one, blurred
   differently, is a plant the camera is looking past. Big simple outlines
   (oak, hazel, ivy) go nearest, where the blur would dissolve anything finer;
   the fern and the rowan sit one step back, where their combs survive it. */
const NEAR_CLOSE: Place[] = [
  /* Left: an oak branch in from the edge and a hazel leaf rising out of the
     corner. Right: a beech branch in from the edge, an oak leaf rising. */
  ...sprig(OAK, -420, 330, -8, 400, 5, 2.4),
  [-60, 450, -70, 2.6, HAZEL],
  ...sprig(BEECH, 1400, 300, 188, 400, 5, 2.3),
  [1100, 470, -112, 2.8, OAK, 0.85],
];
const NEAR_MID: Place[] = [
  /* Left: a fern frond out of the corner behind a beech sprig. Right: a rowan
     leaf out of the corner behind ivy trailing in from the edge. */
  [-50, 450, -66, 2.4, FERN],
  ...sprig(BEECH, -200, 250, 14, 260, 6, 1.4),
  [40, 380, -30, 1.1, HAZEL, 0.8], [120, 415, -80, 0.9, BIRCH],
  [1060, 450, -116, 2.4, ROWAN],
  ...sprig(IVY, 1200, 240, 170, 250, 5, 1.3),
  [960, 380, 210, 1.1, HAZEL, 0.85], [880, 415, 250, 0.9, BIRCH],
];

export function HeroStage() {
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLDivElement>(null);

  /* The eased pose, for the WebGL mark. One listener, no state: the values
     change every scrolled frame and must never re-render the hero. */
  const poseListener = useRef<((turn: number, dolly: number) => void) | null>(null);
  const pose = useRef({ p: 0, turn: 0, dolly: REST_SCALE, active: false });
  const subscribe = useCallback((fn: (turn: number, dolly: number) => void) => {
    poseListener.current = fn;
    fn(pose.current.turn, pose.current.dolly);
    return () => {
      if (poseListener.current === fn) poseListener.current = null;
    };
  }, []);
  const onLive = useCallback((live: boolean) => {
    stage.current?.classList.toggle("is-3d", live);
  }, []);

  /* Keyboard: the buttons are below the frame until the move has run, and
     the frame clips rather than scrolls (overflow: clip), so focus landing
     on one would land on something unseen. Finishing the move is the right
     answer: it is what the reader would have done. Native scrollTo, which
     Lenis yields to. */
  const onWordsFocus = useCallback(() => {
    const host = section.current;
    if (!host || !pose.current.active || pose.current.p >= 1) return;
    const top = host.getBoundingClientRect().top + window.scrollY + host.offsetHeight - window.innerHeight;
    window.scrollTo({ top, behavior: "auto" });
  }, []);

  useEffect(() => {
    const host = section.current;
    const el = stage.current;
    const fig = figure.current;
    if (!host || !el || !fig) return;

    /* The header is sticky but still takes its height out of the flow, so
       the stage is one viewport less the header and sticks just under it.
       Measured rather than hard coded: the header grows when the nav wraps.
       Measured under reduced motion too: the still frame is still one
       screen tall. */
    const header = document.querySelector("header");
    let headerH = 0;
    const setHeaderHeight = () => {
      headerH = header?.offsetHeight ?? 0;
      el.style.setProperty("--header-h", `${headerH}px`);
    };
    setHeaderHeight();
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    pose.current.active = true;

    /* The figure's layout box is the END of the move: the mark at full size
       in the row above the words, overflowing the top of the frame by
       however much the screen is short. At rest it is scaled about its
       centre to REST_SCALE and dropped by --rise, chosen so the scaled box's
       top edge sits exactly on the top of the frame: the strings run off the
       top at rest as they do at the end, and nothing ever shows where a
       string stops. offsetTop is the layout position, transforms ignored,
       relative to .hero-inner, which is the frame. */
    const measure = () => {
      const rise = -fig.offsetTop - ((1 - REST_SCALE) * fig.offsetHeight) / 2;
      el.style.setProperty("--rise", `${rise.toFixed(1)}px`);
      /* The words wait just below the bottom edge of the frame at rest, so
         their travel is the distance from their final place to that edge,
         wherever the layout has put them: right under the figure on a tall
         screen, at the bottom of the frame on a short one. */
      const w = words.current;
      if (w) el.style.setProperty("--words-off", `${(el.clientHeight - w.offsetTop + 16).toFixed(1)}px`);
    };

    let frame = 0;
    const apply = () => {
      frame = 0;
      const r = host.getBoundingClientRect();
      /* The pinned range runs from the stage sticking under the header, which
         is where the page loads, to the point where the sticky child stops
         sticking, which is the section's height minus one screen. */
      const span = Math.max(1, host.offsetHeight - window.innerHeight + headerH);
      const p = clamp01((headerH - r.top) / span);
      const turn = ease(p);
      const dolly = REST_SCALE + (1 - REST_SCALE) * turn;

      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--turn", turn.toFixed(4));
      el.style.setProperty("--dolly", dolly.toFixed(4));

      pose.current.p = p;
      pose.current.turn = turn;
      pose.current.dolly = dolly;
      poseListener.current?.(turn, dolly);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onResize = () => {
      setHeaderHeight();
      measure();
      onScroll();
    };

    measure();
    apply();
    /* The words' height moves when the fonts land, and the figure's place
       moves with it; the figure's own size moves with the frame. */
    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    ro.observe(fig);
    if (words.current) ro.observe(words.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={section} className="hero-pin" style={{ height: `calc(100vh + ${TRAVEL * 100}vh)` }}>
      <div ref={stage} className="hero-stage">
        {/* The set. Furthest from the camera, so it pans the least. */}
        <div aria-hidden="true" className="hero-set">
          <span className="hero-set-wall" />
          <Leaves className="hero-set-gobo" places={GOBO} edge="top" depth={600} />
          <span className="hero-set-floor" />
          <span className="hero-set-beam" />
          <span className="hero-set-haze" />
        </div>

        <div className="hero-inner">
          {/* The objects and what they throw, as one figure. The figure
              itself only ever translates (the pan, and the rise). Inside it,
              .hero-dolly is the CSS scale of the flat things: the two
              shadows (the mark's own alpha flattened to black, one down the
              wall behind, one laid flat across the floor beneath) and the
              layered CSS mark. The canvas is the figure's other child, never
              scaled; see HeroMark3D. */}
          <div ref={figure} className="hero-figure">
            <div className="hero-dolly">
              <div aria-hidden="true" className="hero-shadow hero-shadow-wall">
                <HeroMark shadow />
              </div>
              <div aria-hidden="true" className="hero-shadow hero-shadow-floor">
                <HeroMark shadow />
              </div>
              <div className="hero-object">
                <div className="hero-mark">
                  {/* The CSS mark, and the only thing here a screen reader
                      meets. */}
                  <HeroMark />
                  {/* The light moving across the face as it turns, for the
                      CSS path only; the canvas lights the wool itself. */}
                  <span aria-hidden="true" className="hero-sheen" />
                </div>
              </div>
            </div>
            <HeroMark3D subscribe={subscribe} onLive={onLive} />
          </div>

          {/* The words stand on the floor in front of the objects, under the
              same lamp, so the headline throws a shadow the same way the
              objects do. They are in the tree and readable from the first
              frame; on screen they rise into the frame from below the floor
              as the camera tilts down, and once placed they do not move: they
              are the one thing on the screen the reader is reading. */}
          <div ref={words} className="hero-words" onFocus={onWordsFocus}>
            <h1 className="hero-head">
              <span aria-hidden="true" className="hero-head-shadow">
                Watch. Play. Learn.
              </span>
              <span className="hero-head-face">
                Watch. <span className="hero-head-2">Play.</span> Learn.
              </span>
            </h1>
            <p className="t-lead hero-lead mx-auto mt-6 max-w-[46ch]">
              Calm stories for young children, and the activities that take them off the screen
              afterwards.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button to="/ethical-ai">
                How we make it
                <IconArrow size={16} />
              </Button>
              <Button href={SITE.showUrl} variant="quiet">
                Visit the show
                <IconExternal size={15} />
              </Button>
            </div>
          </div>
        </div>

        {/* Nearest the camera, out of focus, and it pans the most. */}
        <div aria-hidden="true" className="hero-near">
          <Leaves className="hero-near-leaves hero-near-mid" places={NEAR_MID} edge="bottom" depth={420} />
          <Leaves className="hero-near-leaves hero-near-close" places={NEAR_CLOSE} edge="bottom" depth={420} />
        </div>

        <span aria-hidden="true" className="hero-cue">
          <span className="hero-cue-rule" />
          Scroll
        </span>
      </div>
    </div>
  );
}
