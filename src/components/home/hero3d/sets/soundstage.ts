import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  SpotLight,
  TubeGeometry,
  Vector3,
  type Material,
} from "three";
import { BACK_Z, FLOOR_Y, type HeroSet, type SetContext } from "./types";

/* ============================================================================
   SET C: the garden miniature, standing on the studio sweep.

   The show's world built as a tabletop set, on a board that visibly ENDS,
   sitting on a warm cyclorama floor, with a rig over it and a stand and a flag
   at the edge of the lens. The mark hangs over the miniature on its strings.

   WHY THIS ONE. The other two directions each tell half the truth. A studio
   says people made something and never says what; a garden says what was made
   and hides that anyone made it. The cut edge of the board says both in one
   picture, which is the company's entire argument, before a word is read.

   THE EDGE IS THE SUBJECT. Everything here is placed so the reader can find
   the line where moss stops and paper floor starts. The board's front left
   corner sits at x -0.35, z +0.42, which lands just left of the mark and low
   in the frame, and the key comes from front left so the cut face is LIT
   rather than a black band. The first layout had the garden on the left with
   its right edge showing, and the edge faced away from the lens and could not
   be seen at all: a cut face is only readable from the side the camera is on.

   FOUR DEPTHS, which is what a push-in needs and the only thing that makes it
   read as travel rather than as a picture being enlarged:
     z +1.2 to +1.4  stand column and flag, dark, nearest, both leave frame
     z 0             the mark, growing
     z +0.42 to -1.9 the board, its cut edge, the planting, the model trees
     z -0.85 to -3.2 rig bars and lamps, then the sweep, opening up
   Nothing here animates. The camera is the only thing that moves.

   TWO TONAL WORLDS, which is the gag and is easy to lose. Inside the board:
   green, cool, dense, several stops down. Outside it: warm paper, bare floor,
   dark steel. They are lit by one key so they agree, but they never share a
   tone.

   BUDGET. The planting is four InstancedMesh draws, so the cost that matters
   on a phone is four calls, not the instance count. The triangles are spent on
   grass on purpose: thin grass reads as plastic, and a miniature that reads as
   plastic defeats the point of building a miniature.

   Everything is geometry. No photograph, no generated image.
   ========================================================================== */

/* ---- The sweep ----------------------------------------------------------- */
const COVE_HALF_WIDTH = 9;
/** A generous cove radius; a tight one reads as a folded sheet of paper. */
const COVE_RADIUS = 1.25;
const COVE_FLOOR_FRONT = 7;
const COVE_WALL_TOP = 7;
/** Where floor becomes curve. The board stops just short of this. */
const COVE_CURVE_Z = BACK_Z + COVE_RADIUS;

/* ---- The board ----------------------------------------------------------
   Its left face is the one the camera can see, so that is the edge that is
   dressed and lit. It runs off the right of frame and off the back of the
   floor, because a set that ends on all four sides is a diorama in a box, and
   this one is meant to read as a build that continues past the shot. */
/* The board runs off BOTH sides of the frame. It used to start just left of
   centre and run right, which left the whole left of the picture as bare
   paper and put the garden in one corner: the set read as a prop placed in a
   room rather than as the thing being shot. Spanning the frame makes its
   front cut edge a single horizontal line across the lower third, and that
   line is the subject. Green and alive above it, warm studio floor below it,
   and the words stand on the floor. */
const BOARD_X0 = -3.6;
const BOARD_X1 = 3.6;
const BOARD_Z0 = COVE_CURVE_Z + 0.05;
const BOARD_Z1 = -0.4;
/* The board sits behind the mark's plane and low. The camera drops half a
   mark width across the move, which raises everything below its axis in the
   frame, and at the first placement (front edge at z 0.42, surface at -0.66)
   the board's cut face finished across the middle of the frame and swallowed
   the lead paragraph and one of the buttons. Behind and lower, its face lands
   under the headline and the words sit on lit floor. */
/** Top of the scenic foam, where the planting stands. */
const GROUND_Y = -0.67;
/** Where the painted ply rostrum stops and the cut foam starts. The two bands
    on the cut face are what say "built" rather than "modelled", so the pale
    one is kept thin and the dark one deep: the first split them evenly and
    deeply inset the ply, and the whole edge then sat in its own shadow at
    roughly the tone of the floor behind it, which lost the edge entirely. */
const FOAM_Y = -0.73;

const BOARD_CX = (BOARD_X0 + BOARD_X1) / 2;
const BOARD_CZ = (BOARD_Z0 + BOARD_Z1) / 2;
const BOARD_W = BOARD_X1 - BOARD_X0;
const BOARD_D = BOARD_Z1 - BOARD_Z0;

/** Low mounds in the ground, as x, z, radius, height. Kept clear of the strip
    the mark's shadow falls across, around x 0.5, z -0.75, so the shadow lands
    on something flat enough to be read as a shadow. */
const MOUNDS: readonly (readonly [number, number, number, number])[] = [
  [-1.25, -1.5, 0.62, 0.1],
  [1.45, -1.0, 0.55, 0.08],
  [0.15, -1.75, 0.42, 0.055],
];

/* ---- The path -----------------------------------------------------------
   A centre line through the garden, in x and z. It earns its place three times
   over: it is the only pale note inside the green, it is what the mark's
   shadow lands on, and a garden with a path in it is a garden somebody walks
   in. The key throws the mark's shadow to about x 0.55, z -0.78, and the first
   build put nothing there: a shadow on dark moss cannot be read at all, so the
   strongest cue that the object is really hanging there was being thrown away
   on a surface that could not receive it. */
const PATH: readonly (readonly [number, number])[] = [
  [-2.3, -0.32],
  [-1.0, -0.52],
  [0.55, -0.78],
  [1.6, -1.12],
  [2.9, -1.5],
];
const PATH_HALF = 0.062;
const PATH_CURVE = new CatmullRomCurve3(PATH.map(([x, z]) => new Vector3(x, 0, z)));
/** Sampled once, and used both to build the ribbon and to keep the planting
    off it. Two separate definitions of where the path is would drift. */
const PATH_SAMPLES = ((steps: number) => {
  const out: { x: number; z: number; hw: number }[] = [];
  const p = new Vector3();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    PATH_CURVE.getPoint(t, p);
    /* Widest under the mark, so the shadow has somewhere to land, and pinched
       at both ends where it leaves the frame. */
    out.push({ x: p.x, z: p.z, hw: PATH_HALF * (0.55 + 0.7 * Math.sin(Math.PI * t)) });
  }
  return out;
})(48);

function onPath(x: number, z: number, pad: number): boolean {
  for (const s of PATH_SAMPLES) {
    if (Math.hypot(x - s.x, z - s.z) < s.hw + pad) return true;
  }
  return false;
}

/** Mulberry32. Seeded so the planting is a decision that can be returned to,
    not a different garden on every reload. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Height of the scenic ground at a point, used BOTH to build the surface and
    to stand every plant on it. One function or the grass floats. */
function groundHeight(x: number, z: number): number {
  const u = Math.min(1, Math.abs((x - BOARD_CX) / (BOARD_W / 2)));
  const v = Math.min(1, Math.abs((z - BOARD_CZ) / (BOARD_D / 2)));
  /* Falls to zero at the rim so the surface meets the cut face with no gap. */
  const fade = (1 - Math.pow(u, 6)) * (1 - Math.pow(v, 6));
  const n =
    Math.sin(x * 2.3 + 1.7) * Math.cos(z * 3.1 - 0.4) + 0.6 * Math.sin(x * 5.1 - z * 4.2 + 2.2);
  let h = 0.05 * (0.5 + 0.3 * n);
  for (const [mx, mz, mr, mh] of MOUNDS) {
    const d = Math.hypot(x - mx, z - mz) / mr;
    if (d < 1) h += mh * Math.pow(Math.cos((d * Math.PI) / 2), 2);
  }
  return GROUND_Y + h * fade;
}

/**
 * The cove, as one surface: floor, quarter circle, wall. Built by hand because
 * the profile is the whole point and a bent plane with recomputed normals is
 * cheaper than pulling in an extrusion helper.
 */
function coveGeometry(segments = 72): BufferGeometry {
  const curveTopY = FLOOR_Y + COVE_RADIUS;
  const floorRun = COVE_FLOOR_FRONT - COVE_CURVE_Z;
  const arcRun = (Math.PI / 2) * COVE_RADIUS;
  const wallRun = COVE_WALL_TOP - curveTopY;
  const total = floorRun + arcRun + wallRun;

  const profile: { y: number; z: number; ny: number; nz: number }[] = [];
  for (let i = 0; i <= segments; i++) {
    const s = (i / segments) * total;
    if (s <= floorRun) {
      profile.push({ y: FLOOR_Y, z: COVE_FLOOR_FRONT - s, ny: 1, nz: 0 });
    } else if (s <= floorRun + arcRun) {
      const a = (s - floorRun) / COVE_RADIUS;
      profile.push({
        y: curveTopY - Math.cos(a) * COVE_RADIUS,
        z: COVE_CURVE_Z - Math.sin(a) * COVE_RADIUS,
        ny: Math.cos(a),
        nz: Math.sin(a),
      });
    } else {
      profile.push({ y: curveTopY + (s - floorRun - arcRun), z: BACK_Z, ny: 0, nz: 1 });
    }
  }

  const positions = new Float32Array((segments + 1) * 2 * 3);
  const normals = new Float32Array((segments + 1) * 2 * 3);
  const indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const p = profile[i];
    for (let j = 0; j < 2; j++) {
      const k = (i * 2 + j) * 3;
      positions[k] = (j === 0 ? -1 : 1) * COVE_HALF_WIDTH;
      positions[k + 1] = p.y;
      positions[k + 2] = p.z;
      normals[k + 1] = p.ny;
      normals[k + 2] = p.nz;
    }
    if (i < segments) {
      const a = i * 2;
      /* Wound so the face normal comes out of the room. Wound the other way
         the cove answers only the fill and the set renders as a gradient. */
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(positions, 3));
  g.setAttribute("normal", new BufferAttribute(normals, 3));
  g.setIndex(indices);
  return g;
}

/** The scenic ground: a subdivided plane pushed up by groundHeight. */
function groundGeometry(): BufferGeometry {
  const g = new PlaneGeometry(BOARD_W, BOARD_D, 26, 13);
  const pos = g.attributes.position as BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    /* Still in plane space here: local x is world x, local y is world -z, and
       the displacement goes along local z, which rotateX turns into height. */
    const x = pos.getX(i) + BOARD_CX;
    const z = BOARD_CZ - pos.getY(i);
    pos.setZ(i, groundHeight(x, z) - GROUND_Y);
  }
  g.rotateX(-Math.PI / 2);
  g.translate(BOARD_CX, GROUND_Y, BOARD_CZ);
  g.computeVertexNormals();
  return g;
}

/** The path, as a ribbon of pale grit laid on the ground surface. */
function pathGeometry(): BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const tan = new Vector3();
  for (let i = 0; i < PATH_SAMPLES.length; i++) {
    const s = PATH_SAMPLES[i];
    PATH_CURVE.getTangent(i / (PATH_SAMPLES.length - 1), tan);
    /* Normal in the ground plane, which for a curve with no rise is just the
       tangent turned a quarter turn. */
    const nx = -tan.z;
    const nz = tan.x;
    const len = Math.hypot(nx, nz) || 1;
    const y = groundHeight(s.x, s.z) + 0.007;
    positions.push(s.x + (nx / len) * s.hw, y, s.z + (nz / len) * s.hw);
    positions.push(s.x - (nx / len) * s.hw, y, s.z - (nz / len) * s.hw);
    if (i < PATH_SAMPLES.length - 1) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

/** One grass blade, three triangles, standing in +Y over a unit height and
    curving a little toward +Z so a field of them catches the key unevenly. */
function bladeGeometry(): BufferGeometry {
  const w = 0.0085;
  const positions = new Float32Array([
    -w, 0, 0,
    w, 0, 0,
    -w * 0.5, 0.62, 0.06,
    w * 0.5, 0.62, 0.06,
    0, 1, 0.19,
  ]);
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(positions, 3));
  g.setIndex([0, 1, 3, 0, 3, 2, 2, 3, 4]);
  g.computeVertexNormals();
  return g;
}

/** A fern frond: wider than a blade, arching, notched by the taper alone. */
function frondGeometry(): BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const w = 0.055 * (1 - t) * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 1.25)));
    const y = t;
    const z = 0.22 * t * t;
    positions.push(-w, y, z, w, y, z);
    if (i < steps) {
      const a = i * 2;
      indices.push(a, a + 1, a + 3, a, a + 3, a + 2);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

/** A model tree for the back of the board: a trunk and a canopy of small
    overlapping clumps, which is what scenic foliage on a tabletop set actually
    is. The first version used four clumps at a fifth of the tree's height each
    and the trees came out as faceted lollipops, big enough that the eye read
    polygons rather than leaves. Many small clumps at a higher subdivision read
    as mass; a few big ones never do. */
function modelTree(
  trunkMat: Material,
  leafMat: Material,
  h: number,
  r: () => number,
  keep: <T extends BufferGeometry>(g: T) => T,
): Group {
  const g = new Group();
  const trunk = new Mesh(keep(new CylinderGeometry(0.016 * h, 0.042 * h, h * 0.58, 6)), trunkMat);
  trunk.position.y = h * 0.29;
  trunk.castShadow = true;
  g.add(trunk);

  const clumps = 7;
  for (let i = 0; i < clumps; i++) {
    const rad = h * (0.12 + r() * 0.07);
    const clump = new Mesh(keep(new IcosahedronGeometry(rad, 1)), leafMat);
    const a = (i / clumps) * Math.PI * 2 + r() * 0.8;
    const t = i / (clumps - 1);
    const spread = h * 0.21 * (1 - t * 0.55);
    clump.position.set(
      Math.cos(a) * spread * (0.5 + r() * 0.8),
      h * (0.52 + t * 0.42 + r() * 0.05),
      Math.sin(a) * spread * (0.5 + r() * 0.8),
    );
    clump.rotation.set(r() * 3, r() * 3, r() * 3);
    clump.scale.set(1, 0.74, 1);
    clump.castShadow = true;
    g.add(clump);
  }
  return g;
}

/** A lamp on the rig: barrel, hood, stem. Dark, matte, small. */
function lamp(body: Material, keep: <T extends BufferGeometry>(g: T) => T): Group {
  const g = new Group();
  const barrel = new Mesh(keep(new CylinderGeometry(0.17, 0.2, 0.34, 14)), body);
  const hood = new Mesh(keep(new ConeGeometry(0.26, 0.26, 14, 1, true)), body);
  hood.position.y = -0.28;
  hood.rotation.x = Math.PI;
  const stem = new Mesh(keep(new CylinderGeometry(0.03, 0.03, 0.3, 6)), body);
  stem.position.y = 0.3;
  g.add(barrel, hood, stem);
  /* Hanging nose down and a little forward, the way a lamp aimed at a board
     on the floor of a cove actually hangs. */
  g.rotation.x = 0.26;
  return g;
}

export async function soundstageSet(ctx: SetContext): Promise<HeroSet> {
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const keep = <T extends BufferGeometry>(g: T) => (geometries.push(g), g);
  const mat = <T extends Material>(m: T) => (materials.push(m), m);
  const dummy = new Object3D();
  const r = rng(0x19de0a05);

  /* ---- Palette ----------------------------------------------------------
     The paper, the ink and the deep red come off the page so the room cannot
     drift away from the rest of the site. The greens do not: there is no green
     in the page palette, and a garden tinted out of warm clay comes out olive
     and dead. They are mixed toward the page's sage instead, which keeps them
     in the same family of light. */
  const paper = new Color(ctx.token("--color-raised", "#fdf8ed"));
  const sunken = new Color(ctx.token("--color-sunken", "#d8c4a2"));
  const ink = new Color(ctx.token("--color-ink", "#1a1614"));
  const sage = new Color(ctx.token("--color-sage", "#94b7a4"));
  const navy = new Color(ctx.token("--color-navy", "#1f325b"));

  /* The ground under the planting is darker than the planting standing on it,
     so a thin patch of grass reads as earth in shadow rather than as a flat
     green panel with weeds on it. */
  const mossBase = new Color(0x33492a).lerp(sage, 0.08);
  const grassLit = new Color(0x6d8c42).lerp(sage, 0.1);
  const grassDeep = new Color(0x3a5028);
  /* Bluebells, mixed up out of the page's navy rather than picked as a violet.
     A saturated violet in this frame would be the only cold accent on the
     page and would read as decoration. */
  const bluebell = new Color().copy(navy).lerp(new Color(0x5468c6), 0.68);

  /* ---- The sweep --------------------------------------------------------
     Warm paper, the one large bright surface, and the thing the picture is
     made of. Everything else in this set is either small and dark or green. */
  const cove = new Mesh(
    keep(coveGeometry()),
    mat(new MeshStandardMaterial({ color: paper, roughness: 0.96, metalness: 0 })),
  );
  cove.receiveShadow = true;
  ctx.back.add(cove);

  /* ---- The board the garden is built on ---------------------------------
     Three strata on the cut face, bottom to top: painted ply inset in shadow,
     a pale band of cut foam that overhangs it, then the planting. The first
     version was one box and read as a green rug on the floor, because a single
     flat edge is the one thing a real build never has. */
  /* Painted ply, lifted off near black. At the end of the move its front face
     is a band across the whole bottom of the frame, and at the first value it
     read as a black bar rather than as the side of a rostrum. */
  /* Bare birch ply, not stained timber. Two reasons, and the first is the one
   that forced it: the headline lands on this face at the end of the move, and
   at the mid brown it started on, the ink measured 3.4:1 against it, which
   fails AA for body text. Measured off the rendered pixels at the end of the
   move, not off the token: the first lift to 0xc0a888 put the headline at
   8.8:1 but left the lead paragraph at 4.45:1, which is still under the 4.5
   an AA body text needs, so it went lighter again. The second is that it
   is simply what a rostrum on a stage is made of, and the brighter band also
   sharpens the step from green to studio that the whole set is built around. */
  const ply = mat(new MeshStandardMaterial({ color: new Color(0xd6c0a2), roughness: 0.78, metalness: 0.04 }));
  const foam = mat(
    new MeshStandardMaterial({
      color: new Color().copy(sunken).lerp(paper, 0.68),
      roughness: 1,
      metalness: 0,
    }),
  );

  const plyInset = 0.022;
  const rostrum = new Mesh(
    keep(new BoxGeometry(BOARD_W - plyInset * 2, FOAM_Y - FLOOR_Y, BOARD_D - plyInset * 2)),
    ply,
  );
  rostrum.position.set(BOARD_CX, (FLOOR_Y + FOAM_Y) / 2, BOARD_CZ);
  rostrum.castShadow = true;
  ctx.back.add(rostrum);

  const foamBlock = new Mesh(keep(new BoxGeometry(BOARD_W, GROUND_Y - FOAM_Y, BOARD_D)), foam);
  foamBlock.position.set(BOARD_CX, (FOAM_Y + GROUND_Y) / 2, BOARD_CZ);
  foamBlock.castShadow = true;
  foamBlock.receiveShadow = true;
  ctx.back.add(foamBlock);

  /* A pencil line of ply capping the cut foam, the batten a set carpenter
     screws on to stop the foam crumbling. It is one more horizontal on the
     edge, which is the cheapest way to make the edge readable at small size. */
  const batten = new Mesh(keep(new BoxGeometry(0.016, 0.03, BOARD_D)), ply);
  batten.position.set(BOARD_X0 + 0.008, GROUND_Y - 0.012, BOARD_CZ);
  ctx.back.add(batten);
  const battenFront = new Mesh(keep(new BoxGeometry(BOARD_W, 0.03, 0.016)), ply);
  battenFront.position.set(BOARD_CX, GROUND_Y - 0.012, BOARD_Z1 - 0.008);
  ctx.back.add(battenFront);

  const ground = new Mesh(
    keep(groundGeometry()),
    mat(new MeshStandardMaterial({ color: mossBase, roughness: 0.95, metalness: 0 })),
  );
  ground.receiveShadow = true;
  ctx.back.add(ground);

  /* ---- The planting -----------------------------------------------------
     Clumped, not scattered: an even field of grass is a lawn, and a lawn is
     the one thing an Irish hedgerow floor is not. Clump centres are drawn from
     the seeded stream, so this layout is a decision rather than an accident.
     The planted region is the part of the board the lens actually sees. The
     board runs off both edges, but at the end of the move the frame is only
     about 2.2 units wide at the board's depth, so planting past that is paid
     for and never shown. */
  const PLANT_X0 = -2.1;
  const PLANT_X1 = 2.1;
  const PLANT_Z0 = BOARD_Z0 + 0.06;
  const PLANT_Z1 = BOARD_Z1 - 0.02;

  const clumpCount = 46;
  const clumps: { x: number; z: number; rad: number }[] = [];
  for (let i = 0; i < clumpCount; i++) {
    clumps.push({
      /* Even across the planted region now that it is centred on the frame.
         The old weighting pushed clumps left because the board sat to the
         right of centre; it does not any more. */
      x: PLANT_X0 + r() * (PLANT_X1 - PLANT_X0),
      z: PLANT_Z0 + r() * (PLANT_Z1 - PLANT_Z0),
      rad: 0.09 + r() * 0.2,
    });
  }
  /* The path, laid before the planting so the planting can be kept off it. */
  const path = new Mesh(
    keep(pathGeometry()),
    mat(
      new MeshStandardMaterial({
        color: new Color().copy(sunken).lerp(paper, 0.18),
        roughness: 1,
        metalness: 0,
      }),
    ),
  );
  path.receiveShadow = true;
  ctx.back.add(path);

  /* Placements are worked out first and the meshes sized to what survived,
     because an instance that fails the path test cannot simply be skipped: an
     unwritten instance matrix is the identity, which parks a blade at the
     world origin, in the middle of the mark. */
  const GRASS_TRIES = 8600;
  const blades: { x: number; z: number; h: number; w: number; yaw: number; lean: number; tone: number }[] = [];
  for (let i = 0; i < GRASS_TRIES; i++) {
    let x: number;
    let z: number;
    let lean = 0.1;
    let edge = false;
    if (i % 11 === 0) {
      edge = true;
      /* A handful of blades sit ON the cut edges and lean out over them, so the
         edge breaks into grass instead of ending as a clean machined line. */
      /* All of them on the front edge now. The board runs off both sides, so
         the front cut is the only edge the lens ever sees, and a few blades
         leaning out over it are what stop it reading as a machined line.
         Set back a little rather than hanging over: blades that overhung it
         curtained the cut face, and that face is the subject of the set. */
      x = PLANT_X0 + r() * (PLANT_X1 - PLANT_X0);
      z = BOARD_Z1 + 0.004;
      lean = 0.5;
    } else {
      const c = clumps[(i * 7) % clumpCount];
      const a = r() * Math.PI * 2;
      const d = Math.pow(r(), 0.6) * c.rad;
      x = Math.min(PLANT_X1, Math.max(PLANT_X0, c.x + Math.cos(a) * d));
      z = Math.min(PLANT_Z1, Math.max(PLANT_Z0, c.z + Math.sin(a) * d));
    }
    /* Half the height of the first build. A blade at 0.08 of a mark width is
       nearly forty pixels on a laptop, which is a reed, not grass, and it was
       the single loudest reason the first frame read as a 3D render. */
    /* The blades on the cut edges run longer and lie over, the way grass that
       has nothing to hold it up does. It also softens the straight line the
       board makes along the bottom of the frame at the end of the move. */
    const h = (0.019 + r() * 0.026) * (edge ? 1.55 : 1);
    const w = 0.75 + r() * 0.5;
    const yaw = r() * Math.PI * 2;
    const tone = Math.pow(r(), 0.7);
    const bend = (r() - 0.5) * lean;
    if (onPath(x, z, 0.01)) continue;
    blades.push({ x, z, h, w, yaw, lean: bend, tone });
  }

  const grass = new InstancedMesh(
    keep(bladeGeometry()),
    mat(
      new MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.82,
        metalness: 0,
        side: DoubleSide,
      }),
    ),
    blades.length,
  );
  grass.receiveShadow = true;
  const bladeColor = new Color();
  for (let i = 0; i < blades.length; i++) {
    const b = blades[i];
    dummy.position.set(b.x, groundHeight(b.x, b.z) - 0.004, b.z);
    dummy.rotation.set(b.lean, b.yaw, b.lean * 0.7);
    dummy.scale.set(b.w, b.h, 1);
    dummy.updateMatrix();
    grass.setMatrixAt(i, dummy.matrix);
    /* Tip to root tonal spread. A single green over two thousand blades reads
       as one carpet of plastic however good the lighting is. */
    bladeColor.copy(grassDeep).lerp(grassLit, b.tone);
    grass.setColorAt(i, bladeColor);
  }
  ctx.back.add(grass);

  /* Moss: flattened lumps, denser than the grass and a stop darker, because
     moss in shot is a texture and not a plant. Small enough that the facets
     of a twenty triangle lump are below the size the eye reads as a polygon. */
  const mossPlaces: { x: number; z: number }[] = [];
  for (let i = 0; i < 900; i++) {
    const c = clumps[(i * 5) % clumpCount];
    const a = r() * Math.PI * 2;
    const d = Math.pow(r(), 0.5) * (c.rad + 0.12);
    const x = Math.min(PLANT_X1, Math.max(BOARD_X0 + 0.01, c.x + Math.cos(a) * d));
    const z = Math.min(PLANT_Z1, Math.max(PLANT_Z0, c.z + Math.sin(a) * d));
    if (onPath(x, z, 0)) continue;
    mossPlaces.push({ x, z });
  }
  const moss = new InstancedMesh(
    keep(new IcosahedronGeometry(0.03, 0)),
    mat(new MeshStandardMaterial({ color: 0xffffff, roughness: 0.98, metalness: 0 })),
    mossPlaces.length,
  );
  moss.receiveShadow = true;
  const mossColor = new Color();
  for (let i = 0; i < mossPlaces.length; i++) {
    const m = mossPlaces[i];
    dummy.position.set(m.x, groundHeight(m.x, m.z) - 0.009, m.z);
    dummy.rotation.set(r() * 3, r() * 3, r() * 3);
    dummy.scale.set(0.6 + r() * 0.9, 0.3 + r() * 0.25, 0.6 + r() * 0.9);
    dummy.updateMatrix();
    moss.setMatrixAt(i, dummy.matrix);
    mossColor.copy(mossBase).lerp(i % 3 === 0 ? grassLit : grassDeep, r() * 0.55);
    moss.setColorAt(i, mossColor);
  }
  ctx.back.add(moss);

  /* Ferns, in the damp side of the board under the trees. */
  const FERN_PLANTS = 14;
  const FRONDS = 5;
  const fern = new InstancedMesh(
    keep(frondGeometry()),
    mat(
      new MeshStandardMaterial({
        color: new Color(0x4d6b38),
        roughness: 0.86,
        metalness: 0,
        side: DoubleSide,
      }),
    ),
    FERN_PLANTS * FRONDS,
  );
  fern.receiveShadow = true;
  for (let p = 0; p < FERN_PLANTS; p++) {
    let x = 0.1 + r() * 2.4;
    let z = PLANT_Z0 + r() * (PLANT_Z1 - PLANT_Z0) * 0.7;
    if (onPath(x, z, 0.03)) {
      /* Pushed off the path rather than dropped, so the count stays fixed and
         the instanced mesh has no identity matrices left in it. */
      x += 0.16;
      z -= 0.12;
    }
    const y = groundHeight(x, z) - 0.005;
    const scale = 0.055 + r() * 0.05;
    const twist = r() * Math.PI * 2;
    for (let f = 0; f < FRONDS; f++) {
      const a = twist + (f / FRONDS) * Math.PI * 2;
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, a, 0);
      dummy.rotateX(0.62 + r() * 0.3);
      dummy.scale.setScalar(scale * (0.7 + r() * 0.5));
      dummy.updateMatrix();
      fern.setMatrixAt(p * FRONDS + f, dummy.matrix);
    }
  }
  ctx.back.add(fern);

  /* Bluebells: drifts, nodding one way, the only cool note inside the board.
     Stem and bells are two instanced meshes rather than one merged spike,
     because merging needs the example BufferGeometryUtils and two draw calls
     is cheaper than another dependency. */
  const DRIFTS: readonly (readonly [number, number, number])[] = [
    [0.42, -0.22, 0.34],
    [1.55, -0.62, 0.42],
    [2.25, -1.5, 0.38],
    [0.72, -1.15, 0.3],
  ];
  const SPIKES = 64;
  const BELLS_PER = 6;
  const stemMat = mat(
    new MeshStandardMaterial({ color: new Color(0x4a6636), roughness: 0.85, metalness: 0 }),
  );
  const stems = new InstancedMesh(keep(new CylinderGeometry(0.003, 0.0045, 1, 3)), stemMat, SPIKES);
  const bells = new InstancedMesh(
    keep(new ConeGeometry(0.0105, 0.024, 6, 1, true)),
    mat(
      new MeshStandardMaterial({
        color: bluebell,
        roughness: 0.6,
        metalness: 0,
        side: DoubleSide,
      }),
    ),
    SPIKES * BELLS_PER,
  );
  for (let i = 0; i < SPIKES; i++) {
    const d = DRIFTS[i % DRIFTS.length];
    const a = r() * Math.PI * 2;
    const dist = Math.pow(r(), 0.6) * d[2];
    let x = Math.min(PLANT_X1, Math.max(BOARD_X0 + 0.04, d[0] + Math.cos(a) * dist));
    let z = Math.min(PLANT_Z1, Math.max(PLANT_Z0, d[1] + Math.sin(a) * dist));
    if (onPath(x, z, 0.02)) {
      x += 0.1;
      z -= 0.09;
    }
    const y = groundHeight(x, z);
    const h = 0.062 + r() * 0.04;
    const tiltX = (r() - 0.5) * 0.3;
    const tiltZ = (r() - 0.5) * 0.3;
    dummy.position.set(x, y + h / 2, z);
    dummy.rotation.set(tiltX, 0, tiltZ);
    dummy.scale.set(1, h, 1);
    dummy.updateMatrix();
    stems.setMatrixAt(i, dummy.matrix);

    const nod = r() * Math.PI * 2;
    for (let b = 0; b < BELLS_PER; b++) {
      /* Packed along the top third rather than spread up the stem. Spread out,
         the spike reads as a bare stick with spines on it, which is what the
         first build looked like at this size: a dead thistle, not a bluebell. */
      const t = 0.62 + b * 0.068;
      const bx = x + tiltZ * h * t + Math.cos(nod) * 0.013;
      const bz = z - tiltX * h * t + Math.sin(nod) * 0.013;
      dummy.position.set(bx, y + h * t, bz);
      /* Bells hang mouth down and nod to one side, which is the whole
         silhouette of a bluebell: upright cones read as crocuses. */
      dummy.rotation.set(Math.PI - 0.3 * Math.sin(nod), nod, 0.3 * Math.cos(nod));
      dummy.scale.setScalar(0.78 + r() * 0.35);
      dummy.updateMatrix();
      bells.setMatrixAt(i * BELLS_PER + b, dummy.matrix);
    }
  }
  ctx.back.add(stems, bells);

  /* ---- The hedgerow at the back of the board ----------------------------
     A bank of foliage along the back edge with two small trees standing out of
     it. This is where the two tonal worlds meet most sharply, so the line it
     draws does more for the idea than any other single piece: green and alive
     below it, warm paper above it.

     It replaced four free standing trees. Separate trees at that size read as
     lollipops on sticks and left the back edge of the board showing between
     them; a hedge is also simply what the back of an Irish garden is. */
  const trunkMat = mat(
    new MeshStandardMaterial({ color: new Color(0x4a3a2c), roughness: 0.9, metalness: 0 }),
  );
  const oakMat = mat(
    new MeshStandardMaterial({ color: new Color(0x2f4a2a), roughness: 0.92, metalness: 0 }),
  );
  const hazelMat = mat(
    new MeshStandardMaterial({ color: new Color(0x44632f), roughness: 0.92, metalness: 0 }),
  );

  /* Many small leaves rather than a few big ones. The first build used 110
     instances at a radius of about 0.15 of a mark width, and at the size the
     lens sees the back of the board that is a row of broccoli florets: the eye
     counts the lumps. Roughly a thousand instances a third of the size read as
     a mass of foliage with light falling through it, which is what a hedge is,
     and it costs about seventy thousand triangles. */
  const HEDGE_COUNT = 980;
  const hedge = new InstancedMesh(
    keep(new IcosahedronGeometry(0.042, 1)),
    mat(new MeshStandardMaterial({ color: 0xffffff, roughness: 0.93, metalness: 0 })),
    HEDGE_COUNT,
  );
  hedge.castShadow = true;
  const hedgeColor = new Color();
  const oakTone = new Color(0x31492c);
  const hazelTone = new Color(0x55713c);
  const HEDGE_X0 = -2.5;
  const HEDGE_X1 = 2.5;
  for (let i = 0; i < HEDGE_COUNT; i++) {
    const t = r();
    const x = HEDGE_X0 + t * (HEDGE_X1 - HEDGE_X0);
    /* Three staggered ranks, so the bank has a front, a middle and a back and
       the key falls off through it instead of lying flat on one wall. */
    const rank = i % 3;
    const z = BOARD_Z0 + 0.02 + rank * 0.085 + (r() - 0.5) * 0.07;
    /* The crown is not level: a hedge grown in is higher in the middle of each
       stretch and thins at the ends. Two slow waves along its length, so the
       silhouette against the paper has a shape rather than a straight top. */
    const wave =
      0.62 +
      0.3 * Math.sin(x * 1.15 + 0.6) +
      0.16 * Math.sin(x * 2.9 - 1.4);
    const top = Math.max(0.2, wave) * (rank === 2 ? 1.22 : rank === 1 ? 1.05 : 0.9);
    /* Instances are packed up the face of the bank, denser low down, so the
       foliage has a body instead of being a single shell of leaves. */
    const up = Math.pow(r(), 0.7) * top;
    const jitter = 0.055;
    dummy.position.set(
      x + (r() - 0.5) * jitter,
      groundHeight(x, z) + up * 0.42,
      z + (r() - 0.5) * jitter,
    );
    dummy.rotation.set(r() * 3, r() * 3, r() * 3);
    const sc = 0.72 + r() * 0.7;
    dummy.scale.set(sc * 1.12, sc * 0.92, sc);
    dummy.updateMatrix();
    hedge.setMatrixAt(i, dummy.matrix);
    /* Lighter toward the top of the bank, because that is the part the key
       actually reaches. A hedge of one flat green is a cut-out of a hedge. */
    hedgeColor.copy(oakTone).lerp(hazelTone, Math.pow(r(), 1.3) * 0.55 + (up / top) * 0.45);
    hedge.setColorAt(i, hedgeColor);
  }
  ctx.back.add(hedge);

  for (const [x, z, h, leaf] of [
    [0.95, -1.74, 0.46, hazelMat],
    [2.05, -1.8, 0.56, oakMat],
  ] as const) {
    const tree = modelTree(trunkMat, leaf, h, r, keep);
    tree.position.set(x, groundHeight(x, z) - 0.01, z);
    tree.rotation.y = r() * Math.PI * 2;
    ctx.back.add(tree);
  }

  /* ---- The kit ----------------------------------------------------------
     Painted steel, not silhouette: half metal and medium rough, so the key
     puts one bright edge down every bar. Set A learned this the expensive way,
     with near black props that read as cardboard cut outs on paper. */
  const steel = mat(
    new MeshStandardMaterial({ color: new Color(0x3b322b), roughness: 0.42, metalness: 0.58 }),
  );
  const cloth = mat(
    new MeshStandardMaterial({
      color: new Color().copy(ink).lerp(new Color(0x4a3e34), 0.72),
      roughness: 0.92,
      metalness: 0,
      side: DoubleSide,
    }),
  );

  /* The bar the mark hangs from, at exactly the height its own strings stop.
     They then stop AT something, and the mark reads as rigged over the
     miniature rather than as a logo with decorative string on it. */
  const hangBar = new Mesh(keep(new CylinderGeometry(0.022, 0.022, 14, 12)), steel);
  hangBar.rotation.z = Math.PI / 2;
  hangBar.position.set(0, 0.502, 0.05);
  hangBar.castShadow = true;
  ctx.back.add(hangBar);

  /* One more bar, higher and further back, so the top of the frame has depth
     rather than one lonely line, and so it leaves the top of frame as the
     camera drops. There were two, and three horizontals across the top read as
     a suspended ceiling: a rig is legible from one bar and its lamps. */
  /* Turned in plan rather than square to the lens, so one end of it is nearer
     than the other and it crosses the top of the frame as a diagonal. Square,
     it was a second horizontal exactly parallel to the hang bar, and two
     parallel lines across the top of a frame read as a suspended ceiling: the
     one thing a lighting grid is not. */
  const RIG_TILT = 0.18;
  const rigBar = new Mesh(keep(new CylinderGeometry(0.018, 0.018, 14, 10)), steel);
  rigBar.rotation.set(0, RIG_TILT, Math.PI / 2);
  rigBar.position.set(0, 0.98, -0.95);
  ctx.back.add(rigBar);

  /* Lamps well back on the rig, aimed down at the board. A lamp near the lens
     is a black cone across the frame; a lamp at the back of the rig is a lamp.
     At the end of the move these have left the top of the frame, which is half
     of what makes the push in read. */
  for (const [x, s] of [
    [-0.74, 0.38],
    [0.86, 0.38],
  ] as const) {
    const l = lamp(steel, keep);
    /* Hung ON the bar, which means following it back as it turns away. */
    l.position.set(x, 0.86, -0.95 - x * Math.tan(RIG_TILT));
    l.scale.setScalar(s);
    ctx.back.add(l);
  }

  /* ---- A stand on the bare floor, left of the board ---------------------
     Its base is on the paper, which is the piece that proves the garden is
     standing on a floor rather than being a floor. Its shadow rakes right
     across the bare wedge toward the cut edge, which is the tonal step that
     keeps that corner of the frame from going flat. It is in `back` because it
     sits behind the mark's plane. */
  const stand = new Group();
  const column = new Mesh(keep(new CylinderGeometry(0.028, 0.036, 2.1, 12)), steel);
  column.position.y = -0.1;
  column.castShadow = true;
  const knuckle = new Mesh(keep(new CylinderGeometry(0.05, 0.05, 0.075, 10)), steel);
  knuckle.rotation.x = Math.PI / 2;
  knuckle.position.y = 0.46;
  const arm = new Mesh(keep(new CylinderGeometry(0.018, 0.018, 0.72, 8)), steel);
  arm.rotation.z = Math.PI / 2 - 0.3;
  arm.position.set(0.32, 0.56, 0);
  arm.castShadow = true;
  /* A head on the end of the arm, pointed at the board. Without it the arm is
     a bar at an angle and the eye files the whole stand as scaffolding; with
     it the stand is a lamp aimed at the miniature, which is the sentence the
     set is trying to say. */
  const head = lamp(steel, keep);
  head.position.set(0.66, 0.5, 0.02);
  head.scale.setScalar(0.3);
  head.rotation.z = -0.5;
  stand.add(column, knuckle, arm, head);
  for (let i = 0; i < 3; i++) {
    const leg = new Mesh(keep(new CylinderGeometry(0.016, 0.016, 0.42, 6)), steel);
    const a = (i / 3) * Math.PI * 2 + 0.4;
    leg.position.set(Math.cos(a) * 0.14, FLOOR_Y + 0.07, Math.sin(a) * 0.14);
    leg.rotation.set(Math.cos(a) * 0.9, 0, -Math.sin(a) * 0.9);
    leg.castShadow = true;
    stand.add(leg);
  }
  /* On the bare floor in front of the cut edge. It used to stand at z -0.55,
     which the widened board now covers: the stand would have been buried in
     the moss. Its base on the paper is the piece that proves the garden is
     standing on a floor rather than being one. */
  stand.position.set(-1.02, 0, 0.3);
  ctx.back.add(stand);

  /* A sandbag at its foot and a cable running off left. Floor dressing is only
     visible from about a unit behind the mark, so this is the only place it can
     go, and a bare sweep with nothing on it is a backdrop and not a room. */
  const sandbag = new Mesh(keep(new IcosahedronGeometry(0.17, 1)), cloth);
  /* Back and smaller. At z 0.52 it was the nearest thing in the frame by the
     end of the move and read as a black boulder in the bottom corner. */
  sandbag.position.set(-1.38, FLOOR_Y + 0.05, 0.02);
  sandbag.scale.set(0.72, 0.36, 0.56);
  sandbag.rotation.y = 0.5;
  sandbag.castShadow = true;
  ctx.back.add(sandbag);

  /* Offcuts of the scenic build, lying on the bare floor beside the board:
     a slab of the same foam with a skin of the same moss on it, and a smaller
     one next to it. This is the sentence the whole set exists to say, in two
     objects: the garden is a material, and someone cut it to size this morning.
     They also hold the eye at the cut edge, which is where the picture wants
     the reader looking. */
  const offcutFoam = keep(new BoxGeometry(0.3, 0.055, 0.22));
  const offcutSkin = keep(new BoxGeometry(0.3, 0.012, 0.22));
  const skinMat = mat(
    new MeshStandardMaterial({ color: new Color().copy(mossBase).lerp(grassDeep, 0.3), roughness: 0.96 }),
  );
  for (const [x, z, s, rot] of [
    [-0.66, -1.3, 1.15, 0.42],
    [-1.25, -1.05, 0.8, -0.9],
  ] as const) {
    const slab = new Group();
    const body = new Mesh(offcutFoam, foam);
    body.position.y = 0.0275;
    body.castShadow = true;
    const skin = new Mesh(offcutSkin, skinMat);
    skin.position.y = 0.061;
    slab.add(body, skin);
    slab.position.set(x, FLOOR_Y, z);
    slab.rotation.y = rot;
    slab.scale.setScalar(s);
    ctx.back.add(slab);
  }

  /* Two marks taped on the floor. They are four flat strips and they cost
     nothing, and a cross of tape on a pale floor is the fastest thing there is
     to read as a working stage: it says somebody stood here yesterday and will
     stand here again. */
  const tapeMat = mat(new MeshStandardMaterial({ color: new Color(0x2f2722), roughness: 0.9 }));
  const tapeLong = keep(new BoxGeometry(0.17, 0.004, 0.016));
  const tapeShort = keep(new BoxGeometry(0.016, 0.004, 0.12));
  for (const [x, z, rot, cross] of [
    [-0.95, -1.62, 0.25, true],
    [-1.95, -1.1, -0.4, false],
  ] as const) {
    const markGroup = new Group();
    markGroup.add(new Mesh(tapeLong, tapeMat));
    if (cross) markGroup.add(new Mesh(tapeShort, tapeMat));
    markGroup.position.set(x, FLOOR_Y + 0.003, z);
    markGroup.rotation.y = rot;
    ctx.back.add(markGroup);
  }

  const cable = new Mesh(
    keep(
      new TubeGeometry(
        new CatmullRomCurve3([
          new Vector3(-3.0, FLOOR_Y + 0.015, 0.95),
          new Vector3(-1.5, FLOOR_Y + 0.015, 0.2),
          new Vector3(-0.1, FLOOR_Y + 0.015, 0.78),
          new Vector3(1.5, FLOOR_Y + 0.015, 0.16),
          new Vector3(3.0, FLOOR_Y + 0.015, 0.85),
        ]),
        44,
        0.011,
        6,
        false,
      ),
    ),
    steel,
  );
  cable.castShadow = true;
  ctx.back.add(cable);

  /* ---- Nearest the lens, and the reason the move reads -------------------
     A stand column entering the left edge and a flag in the top right, both at
     z above 1.2 so they never pass behind the mark and both outside the frame
     by the end of the move: the column slides out to the left as the frame
     narrows, the flag rises out of the top as the camera drops. Five earlier
     heroes had nothing here, and every one of them read as a logo being
     enlarged rather than a camera travelling. */
  /* A bare column, nothing else. It had a knuckle and an arm on it, and at
     rest those sat exactly where the hang bar crosses the frame: three heavy
     dark pieces meeting in the top left corner, which reads as scaffolding
     and pulls the eye off the mark. A single vertical does the whole job a
     foreground object has, which is to cross the lens and leave early. */
  const nearStand = new Group();
  const nearColumn = new Mesh(keep(new CylinderGeometry(0.042, 0.052, 2.6, 14)), steel);
  nearStand.add(nearColumn);
  nearStand.position.set(-1.12, -0.25, 1.22);
  ctx.front.add(nearStand);

  /* There was a flag here, a cutter on a frame just outside the top right.
     It is gone. At this lens its panel was cropped by the frame edge into a
     dark quadrilateral with no readable shape, which the eye files as a
     rendering fault rather than as a piece of kit, and the near stand on the
     left already does the one job a foreground object has to do: cross the
     lens and leave early. Two near objects at opposite corners also closed the
     frame in on the mark like a vignette. One is the composition. */

  /* ---- The light --------------------------------------------------------
     One key, up and to the left and in front, which is where the artwork's own
     lamp was, so the wool is shown as photographed and the room agrees with
     it. It is also the only angle that lights the cut face of the board rather
     than turning it into a black band, and it throws the mark's shadow back
     onto the moss at about x 0.5, z -0.75, which is the cue that the object is
     really hanging there. */
  const key = new SpotLight(0xfff0d6, 245, 26, 0.58, 0.5, 2);
  key.position.set(-3.4, 4.6, 5.2);
  const target = new Object3D();
  target.position.set(0.35, -0.6, -0.55);
  key.target = target;
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1.5;
  key.shadow.camera.far = 18;
  /* The mark is a cut out standing nearly edge on to the shadow camera, so too
     small a bias stripes it and too large detaches its shadow. */
  key.shadow.bias = -0.0012;
  key.shadow.normalBias = 0.022;
  ctx.lights.add(key, target);

  /* Fill. Warm from above and bounced clay from below, kept low so the right
     of the garden and the far corner of the cove genuinely fall away: a single
     even level across the frame is a web page background, not a set. */
  ctx.lights.add(new HemisphereLight(0xf6ead3, 0x4e3626, 0.46));
  /* One weak cool wash from the right, the daylight any set gets off its own
     white walls. It is what stops the green reading as olive. */
  const wash = new DirectionalLight(0xc9d8de, 0.26);
  wash.position.set(4.2, 2.4, 1.6);
  ctx.lights.add(wash);

  return {
    key: { dir: new Vector3(-0.55, 0.78, 1.0).normalize(), gain: 1 },
    dispose() {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
    },
  };
}
