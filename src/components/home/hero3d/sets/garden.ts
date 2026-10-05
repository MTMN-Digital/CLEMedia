import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  SpotLight,
  TubeGeometry,
  Vector3,
  type Material,
} from "three";
import { BACK_Z, FLOOR_Y, type HeroSet, type SetContext } from "./types";

/* ============================================================================
   SET B: the show's garden, built as a physical miniature.

   Not a photograph of a garden and not a render pretending to be one: a
   tabletop set, the way a stop-motion garden is actually built and lit. A
   small island of moss and grass on a tray, bluebells in drifts through it, a
   fallen oak leaf, dew. The island ENDS: it narrows into the distance, its
   cut edge shows dark against the light behind it, and the cottage beyond is
   a thumbnail. That ending is the whole miniature cue. A ground plane running
   to a horizon is a landscape; a ground plane you can see the end of is a
   thing someone built on a bench.

   The mark hangs on its strings from an oak branch over the garden, which is
   what the strings stop at, so the object reads as rigged above a set rather
   than as a logo with decorative string on it.

   FOUR DEPTHS, which is what the push-in needs:
     z = +1.2 to +1.8   grass, a fern and one bluebell stem AT the lens, dark,
                        clipped by the frame edges at rest and swept out of
                        them early in the move. This is the piece the previous
                        five heroes did not have, and without it a push-in is
                        indistinguishable from a picture being enlarged.
     z = -0.25          the branch the mark hangs from, at the top of frame
     z = -0.5 to -4.4   the island: moss, grass, bluebells, leaves, dew, and
                        the mark's own shadow raking back across it
     z = -7.9 to -10    the far bank, the hedge trees, the cottage, and the
                        lit backing card the whole picture reads against

   SOFTNESS WITHOUT A BLUR. There is no depth of field pass in this renderer,
   so distance is carried the way a model-maker carries it: the far pieces are
   pale and low contrast, the near pieces are dark and large, and the density
   of the grass does the rest. Faking a blur with stacked transparency was
   tried in an early pass and it read as a sorting bug, which is exactly what
   it was.

   NOTHING HERE ANIMATES. No update(). The camera is the only thing moving.

   TRIANGLES. Grass, bluebell bells, stems and dew are InstancedMesh, four
   draw calls for about twenty five thousand triangles of planting. That is
   above the few thousand a set of hard props would cost and it is the one
   place it is worth it: a field of small things is what makes a surface read
   as moss rather than as green paint, and instancing keeps it to four
   uploads. Everything else in the set is under a thousand triangles.
   ========================================================================== */

/** Where the island's crest cuts the light behind it. Just past the depth the
    contract calls the back wall, so the garden occupies the whole room. */
const CREST_Z = BACK_Z - 1.25;
/** The far bank the cottage stands on, and the lit card behind everything. */
const BANK_Z = BACK_Z - 4.7;
const CARD_Z = BACK_Z - 6.8;
/** How far the island's cut edge falls. Deep enough that the apron below it
    is under the bottom of frame at every depth, so what you see of the edge
    is a dark line and not a cliff. */
const EDGE_DROP = 1.9;

const TAU = Math.PI * 2;

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
function smooth01(n: number) {
  const t = clamp01(n);
  return t * t * (3 - 2 * t);
}

/** Seeded, so the planting is a layout that was decided once rather than a
    different garden on every page load. Changing the seed re-dresses the set;
    it is not meant to be changed casually. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Value noise on a small wrapped lattice. Used for the mounding of the moss
    and for the ragged edges, so neither is a straight line or a sine wave. */
function makeNoise(rand: () => number): (x: number, z: number) => number {
  const n = 32;
  const g = new Float32Array(n * n);
  for (let i = 0; i < g.length; i++) g[i] = rand();
  const at = (i: number, j: number) => g[(((i % n) + n) % n) * n + (((j % n) + n) % n)];
  return (x, z) => {
    const fx = Math.floor(x);
    const fz = Math.floor(z);
    const sx = smooth01(x - fx);
    const sz = smooth01(z - fz);
    const a = at(fx, fz) + (at(fx + 1, fz) - at(fx, fz)) * sx;
    const b = at(fx, fz + 1) + (at(fx + 1, fz + 1) - at(fx, fz + 1)) * sx;
    return a + (b - a) * sz;
  };
}

/** Half the island's width at a given depth. It tapers back, which is what
    lets the light wrap around it from about a unit behind the mark: at the
    mark's own depth the edge is outside the frame, further back it is not. */
function islandHalf(z: number, noise: (x: number, z: number) => number) {
  const taper = clamp01((-1.4 - z) / (CREST_Z + 1.4));
  return 3.45 - 1.2 * taper + (noise(z * 1.9 + 11.3, 4.7) - 0.5) * 0.26;
}

/** The ground, as height plus how far over the cut edge the sample is. The
    edge amount is used again for colour: a cut edge is bare soil, not moss. */
function bedPoint(x: number, z: number, noise: (x: number, z: number) => number) {
  let y = FLOOR_Y;
  /* Broad mounding first, then a finer lumpiness over it. One octave alone
     either rolled like a dune or fizzed like noise. */
  y += (noise(x * 0.52 + 3.1, z * 0.52 - 1.7) - 0.5) * 0.19;
  y += (noise(x * 1.9 - 5.2, z * 1.9 + 2.4) - 0.5) * 0.06;
  /* The rise into the crest, so the island has a back to it and the shadow
     side of the mounds all face the camera. */
  /* The rise into the crest. Raising it lifts the crest line in the frame,
     which gives more ground and narrows the gap of light behind it: at the
     first setting that gap was a third of the frame and read as water. */
  y += 0.26 * smooth01((-2.3 - z) / 1.9);

  const half = islandHalf(z, noise);
  let edge = clamp01((Math.abs(x) - half) / 0.24);
  if (z < CREST_Z) edge = Math.max(edge, clamp01((CREST_Z - z) / 0.3));
  if (z > 1.35) edge = Math.max(edge, clamp01((z - 1.35) / 0.3));
  y -= edge * EDGE_DROP;
  return { y, edge };
}

/* ---------------------------------------------------------------------------
   A tiny non-indexed mesh builder. Every small prop here is a handful of
   triangles with a colour per vertex, and writing them through one builder is
   shorter than a BoxGeometry plus a material per tone.
--------------------------------------------------------------------------- */
type V3 = [number, number, number];

function builder() {
  const pos: number[] = [];
  const col: number[] = [];
  const push = (v: V3, c: Color) => {
    pos.push(v[0], v[1], v[2]);
    col.push(c.r, c.g, c.b);
  };
  return {
    tri(a: V3, b: V3, c: V3, ca: Color, cb: Color, cc: Color) {
      push(a, ca);
      push(b, cb);
      push(c, cc);
    },
    /** a-b-c-d wound round the face; the first two take c0, the last two c1. */
    quad(a: V3, b: V3, c: V3, d: V3, c0: Color, c1: Color) {
      this.tri(a, b, c, c0, c0, c1);
      this.tri(a, c, d, c0, c1, c1);
    },
    geometry() {
      const g = new BufferGeometry();
      g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
      g.setAttribute("color", new BufferAttribute(new Float32Array(col), 3));
      g.computeVertexNormals();
      return g;
    },
  };
}

/**
 * One blade of grass: a tapered strip, bent in local +Z, one unit tall so an
 * instance's uniform scale is its height. `slim` is the near-lens version,
 * narrower in proportion and bent harder, because a blade a unit from the
 * lens is read by its curve and a blade in the bed is read by its mass.
 */
function bladeGeometry(base: Color, tip: Color, slim: boolean) {
  const b = builder();
  const segs = 3;
  const bend = slim ? 0.46 : 0.3;
  /* Width as a fraction of the blade's own height, because the instances are
     scaled uniformly. The field blades are stubbier than real grass on
     purpose: at a sixtieth of a frame height a true blade is half a pixel
     wide and the bed turns to fizz. */
  const wide = slim ? 0.03 : 0.085;
  let prev: { l: V3; r: V3; c: Color } | null = null;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const w = wide * Math.pow(1 - t, 0.65);
    const z = bend * t * t;
    const c = base.clone().lerp(tip, t);
    const node = { l: [-w, t, z] as V3, r: [w, t, z] as V3, c };
    if (prev) {
      if (i === segs) b.tri(prev.l, prev.r, [0, t, z], prev.c, prev.c, c);
      else b.quad(prev.l, prev.r, node.r, node.l, prev.c, c);
    }
    prev = node;
  }
  return b.geometry();
}

/**
 * One bluebell flower, hanging from its own origin: a six sided bell with the
 * petal tips reflexed by alternating the radius of the mouth ring. Built at
 * world size, because the flowers on a short stem and a tall one are the same
 * flower and scaling them with the stem made the small drifts read as moss.
 */
function bellGeometry(top: Color, mouth: Color) {
  const b = builder();
  const sides = 6;
  const neck = 0.0022;
  const len = 0.019;
  for (let i = 0; i < sides; i++) {
    const a0 = (i / sides) * TAU;
    const a1 = ((i + 1) / sides) * TAU;
    const r0 = i % 2 === 0 ? 0.009 : 0.0062;
    const r1 = i % 2 === 0 ? 0.0062 : 0.009;
    /* The reflexed tips flick up as well as out, which is the whole
       silhouette of a bluebell at six pixels across. */
    const y0 = i % 2 === 0 ? -len + 0.004 : -len;
    const y1 = i % 2 === 0 ? -len : -len + 0.004;
    b.quad(
      [Math.cos(a0) * neck, 0, Math.sin(a0) * neck],
      [Math.cos(a1) * neck, 0, Math.sin(a1) * neck],
      [Math.cos(a1) * r1, y1, Math.sin(a1) * r1],
      [Math.cos(a0) * r0, y0, Math.sin(a0) * r0],
      top,
      mouth,
    );
  }
  return b.geometry();
}

/** The arch of a bluebell stem in local space, one unit tall, nodding over to
    one side the way a stem carrying six flowers does. */
function stemCurve() {
  return new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(0.015, 0.33, 0.01),
    new Vector3(0.05, 0.63, 0.03),
    new Vector3(0.14, 0.85, 0.07),
    new Vector3(0.3, 0.94, 0.11),
  ]);
}

/** A fallen leaf: an oak lobe, cupped so it catches the key along one side
    instead of lying flat like a decal. */
function leafGeometry(mid: Color, rim: Color) {
  const b = builder();
  const lobes = 7;
  const centre: V3 = [0, 0.012, 0];
  let prev: V3 | null = null;
  for (let i = 0; i <= lobes * 2; i++) {
    const t = i / (lobes * 2);
    const a = -Math.PI * 0.5 + t * Math.PI;
    /* Lobes down each side of a long leaf: radius swings in and out while
       the overall shape stays an ellipse twice as long as it is wide. */
    const r = 0.5 + 0.11 * Math.sin(t * lobes * TAU);
    const p: V3 = [Math.sin(a) * r * 0.46, 0.012 - Math.abs(Math.sin(a)) * 0.03, Math.cos(a) * r];
    if (prev) b.tri(centre, prev, p, mid, rim, rim);
    prev = p;
  }
  return b.geometry();
}

/** A fern frond: a rib with pinnae alternating down it, shortening to the
    tip. Three dozen triangles and the most recognisably Irish shape here. */
function frondGeometry(base: Color, tip: Color) {
  const b = builder();
  const segs = 11;
  const pt = (t: number): V3 => [0, t * 0.92, 0.3 * t * t];
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs;
    const t1 = (i + 1) / segs;
    const a = pt(t0);
    const c = pt(t1);
    const w0 = 0.011 * (1 - t0 * 0.7);
    const w1 = 0.011 * (1 - t1 * 0.7);
    const ca = base.clone().lerp(tip, t0);
    const cb = base.clone().lerp(tip, t1);
    b.quad(
      [a[0] - w0, a[1], a[2]],
      [a[0] + w0, a[1], a[2]],
      [c[0] + w1, c[1], c[2]],
      [c[0] - w1, c[1], c[2]],
      ca,
      cb,
    );
    /* Pinnae both sides at every node, pointing out and only slightly up.
       The first version tilted them up by a third of their length and the
       frond read as a fir cone: a fern is almost flat across. */
    const len = 0.17 * Math.sin(Math.PI * (0.12 + t0 * 0.82));
    for (const side of [1, -1]) {
      b.tri(
        side > 0 ? [a[0], a[1], a[2]] : [c[0], c[1], c[2]],
        side > 0 ? [c[0], c[1], c[2]] : [a[0], a[1], a[2]],
        [side * len, a[1] + len * 0.12, a[2] + 0.012],
        ca,
        cb,
        cb,
      );
    }
  }
  return b.geometry();
}

/**
 * The bed. One indexed grid with the height and the colour of the moss baked
 * into it: the mounds light, the hollows dark, the cut edge bare soil. The
 * colour is where most of the tonal range in the frame comes from, because a
 * single flat green under one lamp is a web page background.
 */
function bedGeometry(
  noise: (x: number, z: number) => number,
  moss: Color,
  lit: Color,
  hollow: Color,
  soil: Color,
) {
  const nx = 52;
  const nz = 34;
  const x0 = -3.95;
  const x1 = 3.95;
  const z0 = 1.7;
  const z1 = CREST_Z - 0.8;
  const pos = new Float32Array((nx + 1) * (nz + 1) * 3);
  const col = new Float32Array((nx + 1) * (nz + 1) * 3);
  const idx: number[] = [];
  const c = new Color();
  for (let j = 0; j <= nz; j++) {
    const z = z0 + ((z1 - z0) * j) / nz;
    for (let i = 0; i <= nx; i++) {
      const x = x0 + ((x1 - x0) * i) / nx;
      const p = bedPoint(x, z, noise);
      const k = (j * (nx + 1) + i) * 3;
      pos[k] = x;
      pos[k + 1] = p.y;
      pos[k + 2] = z;
      /* Height into tone, so the mounding is legible even where the key does
         not reach. Scaled against the mounding range, not absolute y, or the
         crest washed out and the front half went black. */
      const lift = clamp01((p.y - FLOOR_Y + 0.11) / 0.26);
      c.copy(hollow).lerp(moss, 0.25 + 0.75 * lift);
      /* A finer mottle on top of the mounding. The bed carries most of the
         ground cover in this set, because there are nowhere near enough
         blades to hide it, so it has to read as moss at rest rather than as
         a smooth surface waiting for grass. */
      const fleck = noise(x * 3.3 + 17.1, z * 3.3 - 9.4);
      c.lerp(fleck > 0.5 ? lit : hollow, Math.abs(fleck - 0.5) * 0.5);
      /* The crowns of the mounds carry the palest moss, which is what gives
         the bed three tones rather than two and keeps the crest from reading
         as a cut-out against the light. */
      if (lift > 0.68) c.lerp(lit, (lift - 0.68) / 0.32 * 0.5);
      if (p.edge > 0) c.lerp(soil, Math.min(1, p.edge * 1.6));
      col[k] = c.r;
      col[k + 1] = c.g;
      col[k + 2] = c.b;
      if (i < nx && j < nz) {
        const a = j * (nx + 1) + i;
        const b = a + 1;
        const d = a + nx + 1;
        const e = d + 1;
        idx.push(a, d, b, b, d, e);
      }
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("color", new BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/**
 * The backing card: a shallow arc of board, far behind everything, with the
 * light on it baked into its vertices and no lighting of its own. A real
 * miniature is shot against a card lit separately from the set, and a card
 * lit by the set's own key would fall off to nothing at this distance. The
 * bright band sits just above the island's crest, which is where the morning
 * is coming from, and both corners run several stops down from it.
 */
function cardGeometry(bright: Color, mid: Color, high: Color, corner: Color) {
  const cols = 30;
  const rows = 12;
  const spread = 0.64;
  const radius = 11;
  const yLow = -4.6;
  const yHigh = 4.8;
  const pos = new Float32Array((cols + 1) * (rows + 1) * 3);
  const col = new Float32Array((cols + 1) * (rows + 1) * 3);
  const idx: number[] = [];
  const c = new Color();
  for (let j = 0; j <= rows; j++) {
    const y = yLow + ((yHigh - yLow) * j) / rows;
    for (let i = 0; i <= cols; i++) {
      const a = -spread + (spread * 2 * i) / cols;
      const k = (j * (cols + 1) + i) * 3;
      pos[k] = Math.sin(a) * radius;
      pos[k + 1] = y;
      pos[k + 2] = CARD_Z + radius - Math.cos(a) * radius;
      /* Up from the bright band to the deeper tone at the top of frame, and
         inward from the ends, so the picture has a lit middle and two dark
         corners rather than one band of colour. */
      const up = smooth01((y + 0.55) / 4.2);
      const side = smooth01((Math.abs(a) - 0.18) / 0.4);
      c.copy(bright).lerp(mid, smooth01(up * 1.8)).lerp(high, up * 0.85).lerp(corner, side * 0.8);
      col[k] = c.r;
      col[k + 1] = c.g;
      col[k + 2] = c.b;
      if (i < cols && j < rows) {
        const p = j * (cols + 1) + i;
        idx.push(p, p + 1, p + cols + 1, p + 1, p + cols + 2, p + cols + 1);
      }
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("color", new BufferAttribute(col, 3));
  g.setIndex(idx);
  return g;
}

/** The top edge of the far hedge, with three field trees standing out of it
    so the line is a field edge and not a fold of paper. */
function hedgeLine(x: number, noise: (x: number, z: number) => number) {
  let y = -0.72 + (noise(x * 0.9 + 21.5, 9.3) - 0.5) * 0.08;
  for (const [cx, h, w] of [
    [-2.4, 0.26, 0.6],
    [0.9, 0.17, 0.42],
    [3.6, 0.3, 0.65],
  ] as const) {
    y += h * Math.exp(-((x - cx) * (x - cx)) / (w * w));
  }
  return y;
}

/**
 * The far hedge: a band, not a wall. Its bottom edge fades into the exact
 * tone of the lit card behind it, so the land it stands on is lost in the
 * light and there is a bright gap between it and the island's crest. That gap
 * is what makes the distance fall away instead of stacking up, and it is also
 * the only honest way to get early mist out of a renderer with no fog in it.
 * Drawn unlit for the same reason the card is: it is a painted backing piece,
 * and a lamp strong enough to reach it would wash the garden out.
 */
function bankGeometry(noise: (x: number, z: number) => number, top: Color, low: Color, fade: Color) {
  const b = builder();
  const cols = 48;
  const x0 = -8;
  const x1 = 8;
  /* The fade finishes above the island's crest line and the band carries on
     down behind it. The first version stopped the band where the fade ended
     and the hard bottom edge read as the far shore of a lake. */
  const levels = [
    { dy: 0, abs: 0, c: top },
    { dy: -0.12, abs: 0, c: low },
    { dy: 0, abs: -0.92, c: low.clone().lerp(fade, 0.55) },
    { dy: 0, abs: -1.24, c: fade },
    { dy: 0, abs: -1.9, c: fade },
  ];
  const yAt = (x: number, i: number) =>
    levels[i].abs !== 0 ? levels[i].abs : hedgeLine(x, noise) + levels[i].dy;
  for (let i = 0; i < cols; i++) {
    const xa = x0 + ((x1 - x0) * i) / cols;
    const xb = x0 + ((x1 - x0) * (i + 1)) / cols;
    for (let j = 0; j < levels.length - 1; j++) {
      b.quad(
        [xa, yAt(xa, j + 1), BANK_Z],
        [xb, yAt(xb, j + 1), BANK_Z],
        [xb, yAt(xb, j), BANK_Z],
        [xa, yAt(xa, j), BANK_Z],
        levels[j + 1].c,
        levels[j].c,
      );
    }
  }
  return b.geometry();
}

/**
 * The cottage. A thumbnail: gable, pitched roof, chimney, three apertures.
 * The apertures are the only reason it reads as a building rather than a
 * white box, because a window is a human-sized hole and the eye scales the
 * whole thing off it.
 */
function cottageGeometry(wall: Color, roof: Color, hole: Color) {
  const b = builder();
  const w = 0.3;
  const d = 0.22;
  const base = -1.3;
  const eave = base + 0.33;
  const ridge = eave + 0.19;
  const face = (x0: number, x1: number, y0: number, y1: number, z: number, c0: Color, c1: Color) =>
    b.quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z], c0, c1);
  face(-w, w, base, eave, d, wall, wall);
  face(-w, w, base, eave, -d, roof, roof);
  b.quad([w, base, d], [w, base, -d], [w, eave, -d], [w, eave, d], wall, wall);
  b.quad([-w, base, -d], [-w, base, d], [-w, eave, d], [-w, eave, -d], roof, roof);
  /* The gable triangles and the two roof planes. */
  b.tri([-w, eave, d], [w, eave, d], [0, ridge, d], wall, wall, wall);
  b.tri([w, eave, -d], [-w, eave, -d], [0, ridge, -d], roof, roof, roof);
  const over = 0.04;
  b.quad(
    [-w - over, eave, d + over],
    [0, ridge + 0.01, d + over],
    [0, ridge + 0.01, -d - over],
    [-w - over, eave, -d - over],
    roof,
    roof,
  );
  b.quad(
    [0, ridge + 0.01, d + over],
    [w + over, eave, d + over],
    [w + over, eave, -d - over],
    [0, ridge + 0.01, -d - over],
    roof,
    roof,
  );
  /* The chimney starts at the roof's own surface at that x, not at the ridge
     height. Starting it at the ridge left a small dark square floating in the
     sky beside the house, which is what it looked like. */
  const cx0 = w - 0.14;
  const cx1 = w - 0.05;
  const foot = eave + (1 - cx1 / w) * (ridge - eave);
  const ch = 0.1;
  b.quad([cx0, foot, 0.03], [cx1, foot, 0.03], [cx1, ridge + ch, 0.03], [cx0, ridge + ch, 0.03], roof, roof);
  b.quad([cx0, foot, -0.03], [cx0, foot, 0.03], [cx0, ridge + ch, 0.03], [cx0, ridge + ch, -0.03], roof, roof);
  for (const [x, y, ww, hh] of [
    [-0.16, base + 0.09, 0.05, 0.08],
    [0.12, base + 0.09, 0.05, 0.08],
    [-0.02, base, 0.045, 0.14],
  ] as const) {
    face(x - ww, x + ww, y, y + hh, d + 0.004, hole, hole);
  }
  return b.geometry();
}

export async function gardenSet(ctx: SetContext): Promise<HeroSet> {
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const keep = <T extends BufferGeometry>(g: T) => (geometries.push(g), g);
  const mat = <T extends Material>(m: T) => (materials.push(m), m);

  const rand = mulberry32(20261005);
  const noise = makeNoise(mulberry32(84216));

  /* ---- Palette, mixed out of the page's own tokens --------------------- */
  const tok = (name: string, fallback: string) => new Color(ctx.token(name, fallback));
  const mix = (a: Color, b: Color, t: number) => a.clone().lerp(b, t);

  const raised = tok("--color-raised", "#fdf8ed");
  const paper = tok("--color-paper-3", "#e0cfb0");
  const sunken = tok("--color-sunken", "#d8c4a2");
  const body = tok("--color-body", "#4a352a");
  const ink = tok("--color-ink", "#1a1614");
  const sage = tok("--color-sage", "#94b7a4");
  const navy = tok("--color-navy", "#1f325b");
  const redDeep = tok("--color-red-deep", "#8e2428");

  /* Moss runs from the token sage toward the warm dark of the page's body
     text. Mixing it toward grey instead gave a dead eucalyptus green that
     fought the paper everything else in the set is made of. */
  const mossLit = mix(sage, raised, 0.42);
  const moss = mix(sage, body, 0.12);
  const mossHollow = mix(sage, body, 0.52);
  const soil = mix(body, ink, 0.45);
  const grassTip = mix(sage, paper, 0.2);

  /* A bluebell is violet in the hand and a dusty blue at ten pixels in the
     morning. Taken off the navy token and opened up with paper rather than
     pure white, which went chalky. */
  const bellTop = mix(navy, body, 0.22);
  const bellMouth = mix(navy, raised, 0.34);

  /* ---- The backing card ------------------------------------------------
     Drawn with no lighting at all. See cardGeometry: the light on a backing
     card is a separate lamp in a real miniature shoot, and modelling that
     lamp here would cost a second shadow map for a surface with no form. */
  const card = new Mesh(
    keep(
      cardGeometry(
        mix(raised, paper, 0.12),
        mix(sunken, body, 0.12),
        mix(sunken, body, 0.46),
        mix(sunken, body, 0.62),
      ),
    ),
    mat(new MeshBasicMaterial({ vertexColors: true })),
  );
  ctx.back.add(card);

  /* ---- The far field --------------------------------------------------- */
  const bank = new Mesh(
    keep(
      bankGeometry(
        noise,
        mix(sage, paper, 0.5),
        mix(sage, body, 0.34),
        /* Fading into a pale field, not into the cream of the card. Fading
           to the card tone made the gap between the hedge and the crest read
           as water: a flat bright strip with land on both sides of it is a
           lake, whatever you meant by it. */
        mix(sage, raised, 0.74),
      ),
    ),
    mat(new MeshBasicMaterial({ vertexColors: true })),
  );
  ctx.back.add(bank);

  /* Oaks and hazels behind the bank, pale and clustered in threes so each is
     a mass of foliage and not one faceted ball. Low contrast is what puts
     them at a distance: there is no blur to do it with. */
  const dummy = new Object3D();
  const treeMat = mat(
    new MeshStandardMaterial({ color: mix(sage, paper, 0.5), roughness: 1, metalness: 0, flatShading: true }),
  );
  const canopyGeom = keep(new IcosahedronGeometry(1, 1));
  /* Standing on the hedge band, with their feet inside the part of it that
     fades into the light, so no tree has a visible base. */
  const treePlaces: [number, number, number, number][] = [
    [-3.6, -0.44, -0.9, 0.52],
    [-3.15, -0.3, -0.6, 0.38],
    [-2.8, -0.52, -1.2, 0.44],
    [-2.45, -0.4, -0.75, 0.3],
    [0.75, -0.56, -1.0, 0.3],
    [1.05, -0.48, -0.7, 0.24],
    [3.9, -0.38, -0.95, 0.46],
    [4.35, -0.52, -0.6, 0.34],
    [4.65, -0.32, -1.25, 0.4],
    [-0.9, -0.61, -0.8, 0.22],
    [2.08, -0.62, 0.42, 0.26],
    [3.22, -0.66, 0.3, 0.22],
  ];
  const trees = new InstancedMesh(canopyGeom, treeMat, treePlaces.length);
  trees.frustumCulled = false;
  const tint = new Color();
  treePlaces.forEach(([x, y, dz, s], i) => {
    dummy.position.set(x, y, BANK_Z + dz);
    dummy.rotation.set(i * 1.1, i * 0.7, i * 0.4);
    /* Squashed, because a sphere of foliage is a ball and a tree is wider
       than it is tall by the time it is this far off. */
    dummy.scale.set(s * 1.25, s * 0.85, s);
    dummy.updateMatrix();
    trees.setMatrixAt(i, dummy.matrix);
    const v = (i % 3) / 3;
    tint.setRGB(0.92 + v * 0.12, 0.95 + v * 0.1, 0.9 + v * 0.12);
    trees.setColorAt(i, tint);
  });
  trees.instanceMatrix.needsUpdate = true;
  if (trees.instanceColor) trees.instanceColor.needsUpdate = true;
  ctx.back.add(trees);

  const cottage = new Mesh(
    keep(cottageGeometry(mix(raised, paper, 0.3), mix(body, sunken, 0.3), mix(body, sunken, 0.1))),
    mat(new MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 })),
  );
  /* Lifted so its base sits inside the hedge band's fade: a cottage with its
     footings showing on a strip of card is a model of a cottage. */
  /* Standing in the part of the band that is already most of the way faded,
     with two trees at its foot. A cottage with a clean bottom edge on a strip
     of card is a model of a cottage; one with a tree in front of it is a
     cottage. */
  cottage.position.set(2.6, 0.44, BANK_Z + 0.45);
  ctx.back.add(cottage);

  /* ---- The island ------------------------------------------------------
     The one bright surface, and the thing the mark's shadow lands on. */
  const bed = new Mesh(
    keep(bedGeometry(noise, moss, mossLit, mossHollow, soil)),
    mat(new MeshStandardMaterial({ vertexColors: true, roughness: 0.98, metalness: 0 })),
  );
  bed.receiveShadow = true;
  ctx.back.add(bed);

  /* ---- Grass -----------------------------------------------------------
     Short and dense. The first pass ran the blades three times this height
     and the island read as a reed marsh with a logo over it: at that size
     each blade is its own object and the bed never becomes a surface. */
  const foliage = mat(
    new MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0 }),
  );
  const bladeGeom = keep(bladeGeometry(moss, grassTip, false));
  const GRASS = 3200;
  const grass = new InstancedMesh(bladeGeom, foliage, GRASS);
  grass.receiveShadow = true;
  grass.frustumCulled = false;
  const tips: { x: number; y: number; z: number }[] = [];
  /* In tussocks, not evenly. Three thousand blades spread over the whole
     island is about four per cent coverage and reads as spikes stuck in bare
     ground; the same three thousand in a hundred clumps is dense where it is
     and leaves open moss between, which is both what a woodland floor looks
     like and the only way to get a carpet out of an instance count a phone
     will take. */
  let blades = 0;
  let clumpX = 0;
  let clumpZ = 0;
  let clumpLeft = 0;
  let clumpScale = 1;
  for (let guard = 0; blades < GRASS && guard < GRASS * 8; guard++) {
    if (clumpLeft <= 0) {
      clumpZ = 0.9 - rand() * (0.9 - CREST_Z);
      /* Clumps go into the wedge the lens actually sees rather than over the
         whole island, which spent half the instances out of frame. */
      const reach = Math.min(islandHalf(clumpZ, noise) - 0.14, 0.52 * (3.3 - clumpZ));
      clumpX = (rand() * 2 - 1) * reach;
      clumpLeft = 14 + Math.floor(rand() * 26);
      clumpScale = 0.7 + rand() * 0.6;
    }
    clumpLeft--;
    const a = rand() * TAU;
    const r = Math.sqrt(rand());
    const x = clumpX + Math.cos(a) * r * 0.11;
    const z = clumpZ + Math.sin(a) * r * 0.085;
    const g = bedPoint(x, z, noise);
    /* Taller toward the back, which is how a bed of grass under a hedge
       actually grows and also keeps the crest line soft rather than cut, and
       taller at the middle of a clump, which is what makes it a clump. */
    const back = clamp01((-z - 0.5) / 3.4);
    const s = (0.042 + (1 - r) * 0.05 + back * 0.03) * clumpScale;
    dummy.position.set(x, g.y - 0.012, z);
    dummy.rotation.set((rand() - 0.5) * 0.35, rand() * TAU, (rand() - 0.5) * 0.35);
    dummy.scale.set(s * (0.75 + rand() * 0.5), s, s);
    dummy.updateMatrix();
    grass.setMatrixAt(blades, dummy.matrix);
    /* Per instance tint on top of the blade's own base to tip colour, so no
       two blades are the same green. Without this the field read as one
       extruded surface however dense it got. */
    const warm = rand();
    tint.setRGB(0.82 + warm * 0.4, 0.88 + warm * 0.28, 0.8 + warm * 0.3);
    grass.setColorAt(blades, tint);
    if (rand() < 0.07) tips.push({ x, y: g.y + s * 0.9, z });
    blades++;
  }
  grass.count = blades;
  grass.instanceMatrix.needsUpdate = true;
  if (grass.instanceColor) grass.instanceColor.needsUpdate = true;
  ctx.back.add(grass);

  /* ---- Bluebells, in drifts -------------------------------------------
     Scattered around a handful of centres rather than evenly: bluebells come
     up in drifts, and an even scatter looked like a lawn with confetti on it. */
  const stemGeom = keep(new TubeGeometry(stemCurve(), 7, 0.038, 3, false));
  const stemMat = mat(new MeshStandardMaterial({ color: mix(sage, body, 0.74), roughness: 0.9 }));
  const bellGeom = keep(bellGeometry(bellTop, bellMouth));
  const bellMat = mat(new MeshStandardMaterial({ vertexColors: true, roughness: 0.68 }));

  const drifts: [number, number, number][] = [
    [-1.45, -1.7, 0.95],
    [1.3, -2.3, 1.05],
    [-0.35, -3.3, 0.9],
    [2.0, -1.1, 0.6],
    [-2.5, -2.9, 0.7],
  ];
  const STEMS = 210;
  const BELLS = STEMS * 7;
  const stems = new InstancedMesh(stemGeom, stemMat, STEMS);
  const bells = new InstancedMesh(bellGeom, bellMat, BELLS);
  stems.frustumCulled = false;
  bells.frustumCulled = false;
  stems.receiveShadow = true;
  bells.receiveShadow = true;
  const curve = stemCurve();
  const local = new Vector3();
  let stemN = 0;
  let bellN = 0;
  for (let guard = 0; stemN < STEMS && guard < STEMS * 10; guard++) {
    const d = drifts[Math.floor(rand() * drifts.length)];
    const a = rand() * TAU;
    const r = Math.sqrt(rand()) * d[2];
    const x = d[0] + Math.cos(a) * r;
    const z = d[1] + Math.sin(a) * r * 0.75;
    if (z > 0.4 || z < CREST_Z - 0.1) continue;
    if (Math.abs(x) > islandHalf(z, noise) - 0.18) continue;
    const g = bedPoint(x, z, noise);
    /* A bluebell stands about a third as tall as the mark is wide here, so a
       drift is a haze of colour in the grass rather than a row of objects. */
    const h = 0.12 + rand() * 0.08;
    const spin = rand() * TAU;
    dummy.position.set(x, g.y - 0.01, z);
    dummy.rotation.set((rand() - 0.5) * 0.1, spin, (rand() - 0.5) * 0.1);
    dummy.scale.setScalar(h);
    dummy.updateMatrix();
    stems.setMatrixAt(stemN, dummy.matrix);
    const stemMatrix = dummy.matrix.clone();

    /* The flowers hang off the nodding half of the arch. Positions come from
       the same curve the tube was built on, pushed through the stem's own
       matrix, so a bell is never off its stem. */
    const count = 5 + Math.floor(rand() * 3);
    for (let i = 0; i < count && bellN < BELLS; i++) {
      const t = 0.42 + (i / count) * 0.56;
      local.copy(curve.getPoint(t)).applyMatrix4(stemMatrix);
      dummy.position.copy(local);
      dummy.rotation.set((rand() - 0.5) * 0.5, spin + (rand() - 0.5) * 0.8, (rand() - 0.5) * 0.5);
      dummy.scale.setScalar(0.85 + rand() * 0.3);
      dummy.updateMatrix();
      bells.setMatrixAt(bellN, dummy.matrix);
      const v = rand();
      tint.setRGB(0.85 + v * 0.32, 0.86 + v * 0.3, 0.9 + v * 0.22);
      bells.setColorAt(bellN, tint);
      bellN++;
    }
    stemN++;
  }
  stems.count = stemN;
  bells.count = bellN;
  stems.instanceMatrix.needsUpdate = true;
  bells.instanceMatrix.needsUpdate = true;
  if (bells.instanceColor) bells.instanceColor.needsUpdate = true;
  ctx.back.add(stems, bells);

  /* ---- Fallen leaves --------------------------------------------------
     Three oak leaves, warm against all that green, and the clearest scale
     cue on the island: the eye knows how big an oak leaf is. */
  const leafGeom = keep(leafGeometry(mix(redDeep, body, 0.42), mix(redDeep, paper, 0.42)));
  const leafMat = mat(new MeshStandardMaterial({ vertexColors: true, roughness: 0.62 }));
  const leaves = new InstancedMesh(leafGeom, leafMat, 4);
  leaves.frustumCulled = false;
  leaves.receiveShadow = true;
  leaves.castShadow = true;
  const leafPlaces: [number, number, number, number][] = [
    [-0.95, -1.15, 0.13, 0.7],
    [0.82, -1.85, 0.11, -1.9],
    [-1.9, -2.45, 0.1, 2.6],
    [1.55, -0.72, 0.09, 0.3],
  ];
  leafPlaces.forEach(([x, z, s, rot], i) => {
    const g = bedPoint(x, z, noise);
    dummy.position.set(x, g.y + 0.008, z);
    dummy.rotation.set(0.1, rot, 0.08);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    leaves.setMatrixAt(i, dummy.matrix);
  });
  leaves.instanceMatrix.needsUpdate = true;
  ctx.back.add(leaves);

  /* ---- Dew ------------------------------------------------------------
     Sitting on grass tips recorded during the scatter. Smooth and bright, so
     the key puts a pinpoint on each one. This is the cheapest thing in the
     set and it is what makes the frame read as photographed: a surface with
     specular points on it cannot be a flat fill. */
  const dewGeom = keep(bellGeometry(raised, raised));
  const dewMat = mat(
    new MeshStandardMaterial({ color: mix(raised, sage, 0.18), roughness: 0.12, metalness: 0 }),
  );
  const dewCount = Math.min(tips.length, 110);
  const dew = new InstancedMesh(dewGeom, dewMat, dewCount);
  dew.frustumCulled = false;
  for (let i = 0; i < dewCount; i++) {
    const t = tips[i];
    dummy.position.set(t.x, t.y, t.z);
    dummy.rotation.set(Math.PI, rand() * TAU, 0);
    dummy.scale.setScalar(0.28 + rand() * 0.2);
    dummy.updateMatrix();
    dew.setMatrixAt(i, dummy.matrix);
  }
  dew.instanceMatrix.needsUpdate = true;
  ctx.back.add(dew);

  /* ---- Ferns ----------------------------------------------------------
     Two in the bed, standing taller than the grass, so the planting has
     something with a shape and not only mass. */
  const frondGeom = keep(frondGeometry(mix(sage, body, 0.6), mix(sage, paper, 0.3)));
  const ferns = new InstancedMesh(frondGeom, foliage, 5);
  ferns.frustumCulled = false;
  ferns.receiveShadow = true;
  ferns.castShadow = true;
  const fernPlaces: [number, number, number, number][] = [
    [-2.25, -1.55, 0.2, 1.1],
    [-2.05, -1.75, 0.16, 2.4],
    [2.45, -2.1, 0.19, -1.3],
    [2.2, -2.35, 0.14, 0.4],
    [0.2, -3.6, 0.17, 2.9],
  ];
  fernPlaces.forEach(([x, z, s, rot], i) => {
    const g = bedPoint(x, z, noise);
    dummy.position.set(x, g.y, z);
    dummy.rotation.set(0.12, rot, 0);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    ferns.setMatrixAt(i, dummy.matrix);
  });
  ferns.instanceMatrix.needsUpdate = true;
  ctx.back.add(ferns);

  /* ---- The branch the mark hangs from ---------------------------------
     At exactly the height the artwork's own strings stop, a little behind the
     mark's plane. One piece of geometry, and it does more for the picture
     than anything else in the set: the strings then stop AT something, and
     the top of frame has a dark natural edge over the light. It is also the
     second thing to leave: the camera drops as it comes in, so the branch
     rises out of the top of the frame across the move. */
  const bark = mat(
    new MeshStandardMaterial({ color: mix(body, ink, 0.55), roughness: 0.85, metalness: 0 }),
  );
  const branch = new Mesh(
    keep(
      new TubeGeometry(
        new CatmullRomCurve3([
          new Vector3(-3.6, 0.63, -0.5),
          new Vector3(-1.8, 0.545, -0.32),
          new Vector3(-0.4, 0.512, -0.26),
          new Vector3(1.1, 0.527, -0.3),
          new Vector3(2.6, 0.585, -0.44),
          new Vector3(3.9, 0.69, -0.62),
        ]),
        28,
        0.026,
        6,
        false,
      ),
    ),
    bark,
  );
  branch.castShadow = true;
  ctx.back.add(branch);

  /* A twig off the branch with three leaves on it, high and to the left,
     holding that corner of the frame down a couple of stops. */
  const twig = new Mesh(
    keep(
      new TubeGeometry(
        new CatmullRomCurve3([
          new Vector3(-1.45, 0.56, -0.33),
          new Vector3(-1.3, 0.72, -0.4),
          new Vector3(-1.05, 0.84, -0.52),
        ]),
        8,
        0.012,
        4,
        false,
      ),
    ),
    bark,
  );
  ctx.back.add(twig);
  const hangGeom = keep(leafGeometry(mix(moss, ink, 0.55), mix(moss, body, 0.4)));
  const hangLeaves = new InstancedMesh(hangGeom, leafMat, 3);
  hangLeaves.frustumCulled = false;
  const hangPlaces: [number, number, number, number, number][] = [
    [-1.32, 0.7, -0.38, 0.22, 1.2],
    [-1.12, 0.8, -0.48, 0.19, -0.6],
    [-1.5, 0.62, -0.3, 0.16, 2.5],
  ];
  hangPlaces.forEach(([x, y, z, s, rot], i) => {
    dummy.position.set(x, y, z);
    dummy.rotation.set(1.35, rot, 0.4);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    hangLeaves.setMatrixAt(i, dummy.matrix);
    /* Dark. They hang between the lens and a lit card, so they are in
       silhouette; at full value they read as pale blobs stuck on the sky,
       which is what the first pass of them did. */
    tint.setRGB(0.3, 0.34, 0.3);
    hangLeaves.setColorAt(i, tint);
  });
  hangLeaves.instanceMatrix.needsUpdate = true;
  if (hangLeaves.instanceColor) hangLeaves.instanceColor.needsUpdate = true;
  ctx.back.add(hangLeaves);

  /* ---- At the lens ----------------------------------------------------
     The planting continues past the camera, and this is the clump it passes
     through. Everything here is between z = 1.1 and z = 1.8, which at rest
     is a frame barely two mark widths across: each piece is clipped by an
     edge where it stands, and the frame narrows faster than the pieces do, so
     they slide out sideways and upward through the first half of the move.
     That sweep is the entire reason the push-in reads as travel. The nearest
     pieces are also between the key and the garden, so they lay streaks of
     shadow across the bright moss: that is why they cast.

     Dark, but not black. They sit in the penumbra of the key, so they keep a
     lit edge; a silhouette here read as a cut-out stuck to the glass. There
     is no blur to soften them with, so they are kept large and plain and the
     tone does the work. */
  const nearBlade = keep(bladeGeometry(mix(moss, ink, 0.6), mix(moss, body, 0.25), true));
  const nearClump = new InstancedMesh(nearBlade, foliage, 16);
  nearClump.frustumCulled = false;
  /* Casts nothing, and this is not an oversight. Sitting a unit from the lens
     and two from the lamp, these blades threw a shadow the size of the whole
     island and the lit pool went out: the thing that was supposed to lay a
     streak across the moss instead put the moss several stops down. */
  nearClump.castShadow = false;
  const nearPlaces: [number, number, number, number][] = [
    [-0.72, 1.42, 1.5, 0.3],
    [-0.66, 1.58, 1.35, -0.5],
    [-0.58, 1.3, 1.65, 1.1],
    [-0.52, 1.66, 1.2, 2.1],
    [-0.46, 1.48, 1.45, -1.4],
    [-0.4, 1.72, 1.15, 0.7],
    [-0.34, 1.36, 1.3, 2.7],
    [-0.26, 1.6, 1.0, -2.2],
    [-0.19, 1.45, 1.1, 1.6],
    [0.86, 1.2, 1.3, -0.4],
    [0.78, 1.34, 1.15, 0.9],
    [0.72, 1.16, 1.45, 2.2],
    [0.64, 1.3, 1.0, -1.7],
    [0.56, 1.44, 0.9, 1.3],
    [0.48, 1.22, 1.05, 2.9],
    [-0.9, 1.54, 1.25, -0.9],
  ];
  nearPlaces.forEach(([x, z, h, rot], i) => {
    dummy.position.set(x, FLOOR_Y + 0.02, z);
    dummy.rotation.set((rand() - 0.5) * 0.2, rot, x < 0 ? 0.26 : -0.3);
    dummy.scale.set(h * 0.9, h, h);
    dummy.updateMatrix();
    nearClump.setMatrixAt(i, dummy.matrix);
    const v = rand();
    tint.setRGB(0.6 + v * 0.3, 0.66 + v * 0.26, 0.6 + v * 0.26);
    nearClump.setColorAt(i, tint);
  });
  nearClump.instanceMatrix.needsUpdate = true;
  if (nearClump.instanceColor) nearClump.instanceColor.needsUpdate = true;
  ctx.front.add(nearClump);

  /* A frond and one bluebell at the lens on the left, so what crosses is
     recognisably the same planting and not an abstract dark shape. */
  const nearFrond = new InstancedMesh(frondGeom, foliage, 2);
  nearFrond.frustumCulled = false;
  nearFrond.castShadow = false;
  [
    [-0.64, 1.62, 1.15, 1.0],
    [0.68, 1.26, 0.95, -1.2],
  ].forEach(([x, z, s, rot], i) => {
    dummy.position.set(x, FLOOR_Y + 0.02, z);
    dummy.rotation.set(0.1, rot, x < 0 ? 0.34 : -0.36);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    nearFrond.setMatrixAt(i, dummy.matrix);
    tint.setRGB(0.5, 0.56, 0.5);
    nearFrond.setColorAt(i, tint);
  });
  nearFrond.instanceMatrix.needsUpdate = true;
  if (nearFrond.instanceColor) nearFrond.instanceColor.needsUpdate = true;
  ctx.front.add(nearFrond);

  /* Its own stem geometry, thin. The bed's stems are deliberately fattened
     so they survive at four pixels; the same proportion a unit from the lens
     is a drainpipe. */
  const nearStemGeom = keep(new TubeGeometry(stemCurve(), 9, 0.011, 4, false));
  const nearStems = new InstancedMesh(nearStemGeom, stemMat, 2);
  const nearBells = new InstancedMesh(bellGeom, bellMat, 14);
  nearStems.frustumCulled = false;
  nearBells.frustumCulled = false;
  let nb = 0;
  [
    [-0.5, 1.52, 0.95, 1.9],
    [0.7, 1.26, 0.8, -1.5],
  ].forEach(([x, z, h, spin], i) => {
    dummy.position.set(x, FLOOR_Y, z);
    dummy.rotation.set(0, spin, x < 0 ? 0.2 : -0.22);
    dummy.scale.setScalar(h);
    dummy.updateMatrix();
    nearStems.setMatrixAt(i, dummy.matrix);
    const m = dummy.matrix.clone();
    for (let k = 0; k < 6 && nb < 14; k++) {
      const t = 0.44 + (k / 6) * 0.54;
      local.copy(curve.getPoint(t)).applyMatrix4(m);
      dummy.position.copy(local);
      dummy.rotation.set((rand() - 0.5) * 0.4, spin, (rand() - 0.5) * 0.4);
      dummy.scale.setScalar(2.1 + rand() * 0.5);
      dummy.updateMatrix();
      nearBells.setMatrixAt(nb, dummy.matrix);
      tint.setRGB(0.55, 0.58, 0.66);
      nearBells.setColorAt(nb, tint);
      nb++;
    }
  });
  nearBells.count = nb;
  nearStems.instanceMatrix.needsUpdate = true;
  nearBells.instanceMatrix.needsUpdate = true;
  if (nearBells.instanceColor) nearBells.instanceColor.needsUpdate = true;
  ctx.front.add(nearStems, nearBells);

  /* ---- The light ------------------------------------------------------
     One key, low and from the left and slightly in front, which is early
     morning raking across a bed: the mounds throw their own shadows, the dew
     lights up, and the mark's shadow goes long and lands on the moss a unit
     behind it, which is in frame. A high lamp was tried first and the bed
     went flat, because a flat bed is what a lamp over a bed produces.

     The cone is deliberately too small for the island, so the corners of the
     frame fall several stops down and the picture has a lit middle. */
  /* The penumbra is the number that matters and it is not the obvious one:
     three.js ramps from the cone edge to angle*(1-penumbra), so at 0.7 the
     fully lit core was nine degrees wide and the whole island sat in the
     ramp, several stops down, with no pool anywhere in the frame. */
  const key = new SpotLight(0xffe7c2, 185, 22, 0.62, 0.45, 2);
  key.position.set(-2.1, 1.7, 2.3);
  const target = new Object3D();
  target.position.set(0.35, FLOOR_Y, -1.05);
  key.target = target;
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.6;
  key.shadow.camera.far = 16;
  /* The mark is a cut-out nearly edge on to this shadow camera and the grass
     is thousands of thin blades: too small a bias stripes both, too large
     detaches the mark's shadow from the moss. */
  key.shadow.bias = -0.0009;
  key.shadow.normalBias = 0.018;
  ctx.lights.add(key, target);

  /* Sky and bounce. The sky tone is the page's paper and the ground tone is
     the moss itself, so the shadow side of everything green stays green
     rather than going grey. */
  /* Low on purpose. At anything near full strength this one light reaches
     every upward facing normal on the island equally and the bed goes flat,
     which is what a single band of colour in a frame actually is. */
  ctx.lights.add(new HemisphereLight(0xf2e3c4, 0x4a5c3e, 0.45));

  /* The far field is outside the key's throw and would otherwise be lit by
     the hemisphere alone, which gives a distance with no direction in it.
     This is the morning on the hedge and the cottage, and it casts nothing. */
  const far = new DirectionalLight(0xffeccd, 0.55);
  far.position.set(-4, 2.4, 1.5);
  ctx.lights.add(far);

  return {
    /* The mark is relit toward the key, which is lower and more to the side
       than the lamp the artwork was photographed under. A small gain, because
       this room is brighter at the mark's own depth than the studio is. */
    key: { dir: new Vector3(-2.25, 1.85, 2.2).normalize(), gain: 1.06 },
    dispose() {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
    },
  };
}
