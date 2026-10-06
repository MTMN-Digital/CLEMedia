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
  StaticDrawUsage,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  SpotLight,
  TubeGeometry,
  Vector3,
  type Material,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
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
/* The board is a rostrum about a third of a mark width thick, and its top is
   set by one requirement: the frame has three bands and the words get the
   bottom one to themselves. The mark hangs in the sweep, a shallow strip of
   garden sits under it, and the lit studio floor in front of the cut edge is
   clean ground the headline can stand on. Measured at the end of the move,
   this puts the cut edge at about 560 of 900 and leaves the words 340 pixels
   of floor. Lower than this and the hedge climbs into the headline, which is
   how the first three builds of this set read: unreadable. */
const GROUND_Y = -0.63;
/** Where the painted ply rostrum stops and the cut foam starts. The two bands
    on the cut face are what say "built" rather than "modelled", so the pale
    one is kept thin and the dark one deep: the first split them evenly and
    deeply inset the ply, and the whole edge then sat in its own shadow at
    roughly the tone of the floor behind it, which lost the edge entirely. */
const FOAM_Y = -0.69;

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

  /* The ground under the planting is darker than the planting standing on it,
     so a thin patch of grass reads as earth in shadow rather than as a flat
     green panel with weeds on it. */
  const mossBase = new Color(0x33492a).lerp(sage, 0.08);
  const grassDeep = new Color(0x3a5028);
  /* The bluebell colour that used to live here is gone with the sticks it
     tinted. The flowers are a scan of celandine now, so their colour comes
     from the photograph rather than from the palette. */

  /* One Radiance probe lights everything. It is what gives the steel a real
     highlight shape instead of the single point specular a lone SpotLight
     puts on every rounded surface, and what puts light into the shaded side
     of the plants. The key below still exists, because the probe cannot cast
     the mark's shadow onto the set. CC0, see public/hero3d/ASSET-LICENCES.md. */
  await ctx.loadEnvironment("/hero3d/hdri/brown_photostudio_02_1k.hdr", 0.38);

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
  /* Real birch ply, scanned, rather than a brown rectangle. The cut face of
     the board is the line the whole set is built around and the surface the
     headline lands on, so it is the one place a flat colour showed most. The
     tint keeps it at the pale end: the headline measured 3.4:1 against the
     mid brown this started as, which fails AA for body text. */
  /* PAINTED ply, not bare. The scan's own diffuse is a mid brown varnished
     sheet, and the cut face is the band the headline stands on: tinted light
     it still landed around a dark brown once the room's exposure came down,
     and the headline disappeared into it twice. So the grain comes from the
     scan's normal and roughness maps, which is where grain actually lives,
     and the colour is paint. A rostrum on a stage is painted anyway. */
  const plyMaps = await ctx.loadMaterial("plywood", { repeat: 2.5 });
  const ply = mat(
    new MeshStandardMaterial({
      color: new Color(0xeee4d2),
      normalMap: plyMaps.normalMap,
      roughnessMap: plyMaps.roughnessMap,
      roughness: 0.92,
      metalness: 0,
    }),
  );
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
     Real scanned plants, instanced, instead of the triangle blades and the
     clustered spheres this had. That swap is the single biggest change in
     this set and the reason the rest of it had to be rebuilt around it: a
     scanned grass clump has a bent spine, translucent tips and litter at its
     base, and no amount of tuning makes a flat quad do any of that. The three
     models are CC0 from Poly Haven, listed in public/hero3d/ASSET-LICENCES.md,
     and shrunk for the web by scripts/optimise-hero-assets.py.

     Clumped, not scattered: an even field is a lawn, and a lawn is the one
     thing an Irish hedgerow floor is not. Clump centres come from the seeded
     stream, so the layout is a decision rather than an accident.

     The planted region is the part of the board the lens actually sees. The
     board runs off both edges, but at the end of the move the frame is only
     about 2.2 units wide at the board's depth, so planting past that is paid
     for and never shown. */
  const PLANT_X0 = -2.1;
  const PLANT_X1 = 2.1;
  const PLANT_Z0 = BOARD_Z0 + 0.06;
  const PLANT_Z1 = BOARD_Z1 - 0.02;

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

  const [grassSrc, fernSrc, flowerSrc] = await Promise.all([
    ctx.loadModel("/hero3d/model/grass_medium_01/grass_medium_01_1k.gltf"),
    ctx.loadModel("/hero3d/model/fern_02/fern_02_1k.gltf"),
    ctx.loadModel("/hero3d/model/celandine_01/celandine_01_1k.gltf"),
  ]);

  /**
   * Flattens a loaded model into one instanced mesh, scaled so it stands a
   * given height in this scene's units.
   *
   * Each of these models is several meshes sharing one material, so they
   * merge cleanly. Two things are forced on the way through. The material is
   * switched from blended to alpha tested, because a few hundred instances of
   * blended foliage cannot be depth sorted against each other and the result
   * is leaves winking through one another as the camera moves. And the
   * geometry is recentred on its own footprint, so an instance's position is
   * where the plant stands rather than wherever the scan's origin happened to
   * be.
   */
  function plantFrom(src: Group, count: number, height: number): InstancedMesh {
    const geoms: BufferGeometry[] = [];
    let material: MeshStandardMaterial | null = null;
    src.updateMatrixWorld(true);
    src.traverse((o) => {
      const m = o as Mesh;
      if (!m.isMesh) return;
      const g = m.geometry.clone().applyMatrix4(m.matrixWorld);
      g.deleteAttribute("uv1");
      geoms.push(g);
      if (!material) material = (m.material as MeshStandardMaterial).clone();
    });
    const merged = mergeGeometries(geoms, false);
    for (const g of geoms) g.dispose();
    merged.computeBoundingBox();
    const bb = merged.boundingBox!;
    const s = height / Math.max(bb.max.y - bb.min.y, 1e-4);
    merged.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
    merged.scale(s, s, s);
    keep(merged);

    const mtl = material as unknown as MeshStandardMaterial;
    mtl.transparent = false;
    mtl.alphaTest = 0.45;
    mtl.side = DoubleSide;
    mtl.depthWrite = true;
    mat(mtl);

    const inst = new InstancedMesh(merged, mtl, count);
    inst.castShadow = true;
    inst.receiveShadow = true;
    inst.instanceMatrix.setUsage(StaticDrawUsage);
    return inst;
  }

  /** Puts one instance down, standing on the ground at x, z. */
  function place(inst: InstancedMesh, i: number, x: number, z: number, scale: number, yaw: number, lean = 0) {
    dummy.position.set(x, groundHeight(x, z), z);
    dummy.rotation.set(lean * (r() - 0.5), yaw, lean * (r() - 0.5));
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
  }

  /* Clump centres, shared by the grass and the flowers so they grow together
     the way they do in a hedge bottom rather than in two separate layers. */
  const clumps: { x: number; z: number; rad: number }[] = [];
  for (let i = 0; i < 44; i++) {
    clumps.push({
      x: PLANT_X0 + r() * (PLANT_X1 - PLANT_X0),
      z: PLANT_Z0 + r() * (PLANT_Z1 - PLANT_Z0),
      rad: 0.09 + r() * 0.2,
    });
  }

  /** A point in a clump that is not on the path, or null after ten tries. */
  function inClump(pad: number): { x: number; z: number } | null {
    for (let t = 0; t < 10; t++) {
      const c = clumps[Math.floor(r() * clumps.length)];
      const a = r() * Math.PI * 2;
      const d = Math.pow(r(), 0.6) * c.rad;
      const x = Math.min(PLANT_X1, Math.max(PLANT_X0, c.x + Math.cos(a) * d));
      const z = Math.min(PLANT_Z1, Math.max(PLANT_Z0, c.z + Math.sin(a) * d));
      if (!onPath(x, z, pad)) return { x, z };
    }
    return null;
  }

  /* Grass. The ground cover, so it is the one with real density. Instances
     that fail the path test are parked at scale zero rather than skipped: an
     unwritten instance matrix is the identity, which would stand a clump at
     the world origin, in the middle of the mark. */
  const GRASS_N = 620;
  const grass = plantFrom(grassSrc, GRASS_N, 0.055);
  for (let i = 0; i < GRASS_N; i++) {
    const p = inClump(0.03);
    if (!p) {
      dummy.position.set(0, -99, 0);
      dummy.scale.setScalar(0);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      grass.setMatrixAt(i, dummy.matrix);
      continue;
    }
    place(grass, i, p.x, p.z, 0.55 + Math.pow(r(), 1.6) * 1.1, r() * Math.PI * 2, 0.12);
  }
  ctx.back.add(grass);

  /* Ferns, sparse, where a hedge bottom is damp. Big enough to read as an
     individual plant rather than as more ground cover. */
  const FERN_N = 54;
  const ferns = plantFrom(fernSrc, FERN_N, 0.085);
  for (let i = 0; i < FERN_N; i++) {
    const p = inClump(0.06) ?? { x: PLANT_X0 + r() * (PLANT_X1 - PLANT_X0), z: PLANT_Z0 + r() * 0.3 };
    place(ferns, i, p.x, p.z, 0.7 + r() * 0.8, r() * Math.PI * 2, 0.1);
  }
  ctx.back.add(ferns);

  /* Celandine, which is a real Irish woodland floor flower and the only
     yellow in the garden. It replaces the blue sticks that stood in for
     bluebells: a stick is a stick, and these are a scan of the actual plant.
     Kept to the lit half of the board, because a flower the key never reaches
     is a dark speck. */
  const FLOWER_N = 96;
  const flowers = plantFrom(flowerSrc, FLOWER_N, 0.062);
  for (let i = 0; i < FLOWER_N; i++) {
    const p = inClump(0.05) ?? { x: PLANT_X0 + r() * 1.6, z: PLANT_Z0 + r() * 0.8 };
    place(flowers, i, p.x, p.z, 0.6 + r() * 0.7, r() * Math.PI * 2, 0.14);
  }
  ctx.back.add(flowers);

  /* ---- The hedgerow at the back of the board ----------------------------
     A bank along the back edge, built from the same grass and fern scans at
     a much larger scale rather than from its own geometry. Two reasons. It
     costs no extra download, and a hedge made of the same plants as the
     ground in front of it is what a hedge actually is, where the first build
     used clustered spheres and read as a row of broccoli.

     This is where the two tonal worlds meet most sharply, so the line it
     draws does more for the idea than any other single piece: green and
     alive below it, warm paper above it. */
  const HEDGE_N = 150;
  /* Grass, not fern. A fern at this size reads as tropical foliage, which is
     the one thing an Irish hedge bottom is not, and at 0.46 of a mark width
     each frond was the size of the lion. */
  const hedge = plantFrom(grassSrc, HEDGE_N, 0.2);
  const HEDGE_X0 = -2.6;
  const HEDGE_X1 = 2.6;
  for (let i = 0; i < HEDGE_N; i++) {
    const x = HEDGE_X0 + r() * (HEDGE_X1 - HEDGE_X0);
    const z = BOARD_Z0 + 0.02 + (i % 3) * 0.075 + (r() - 0.5) * 0.06;
    /* The crown is not level. Two slow waves along its length, so the
       silhouette against the paper has a shape rather than a straight top. */
    const wave = 0.78 + 0.26 * Math.sin(x * 1.15 + 0.6) + 0.13 * Math.sin(x * 2.9 - 1.4);
    place(hedge, i, x, z, Math.max(0.3, wave) * (0.8 + r() * 0.5), r() * Math.PI * 2, 0.16);
  }
  ctx.back.add(hedge);

  /* A second rank of tall grass through the hedge, which breaks the fern
     frond silhouette up so the bank does not read as one repeated plant. */
  const HEDGE_GRASS_N = 190;
  const hedgeGrass = plantFrom(fernSrc, HEDGE_GRASS_N, 0.13);
  for (let i = 0; i < HEDGE_GRASS_N; i++) {
    const x = HEDGE_X0 + r() * (HEDGE_X1 - HEDGE_X0);
    const z = BOARD_Z0 + 0.01 + (i % 4) * 0.06 + (r() - 0.5) * 0.05;
    place(hedgeGrass, i, x, z, 0.6 + r() * 0.9, r() * Math.PI * 2, 0.18);
  }
  ctx.back.add(hedgeGrass);


  /* ---- The kit ----------------------------------------------------------
     Painted steel, not silhouette: half metal and medium rough, so the key
     puts one bright edge down every bar. Set A learned this the expensive way,
     with near black props that read as cardboard cut outs on paper. */
  /* Painted steel, scanned. The rig, the stands and the hardware are the
     parts the light probe does the most for: a real roughness map breaks the
     highlight up along a bar instead of running one clean specular line down
     it, which is what says metal rather than plastic. */
  const steel = await ctx.loadMaterial("metal_plate", { repeat: 1.4 });
  /* A metal's colour tints its REFLECTION, it is not an albedo, so the dark
     brown this started with multiplied the studio probe down to nothing and
     the rig came out as black cut-outs for the second time in this set's
     life. Near white, and the scanned maps carry the colour and the wear. */
  /* Cool, so it reads as steel against a warm room. Tinted warm it came out
     looking like varnished timber, which is the one material already on the
     board underneath it. */
  steel.color = new Color(0x9fa5a8);
  steel.metalness = 0.72;
  steel.envMapIntensity = 1.15;
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
  /* Down from 245. That figure was set when this light was doing everything:
     key, fill and bounce. The probe does the fill now, so the spot is back to
     what a key actually is, the one source that models the subject and throws
     its shadow. Left at the old value the sweep went to paper white and the
     garden lost every shadow inside it. */
  const key = new SpotLight(0xfff0d6, 34, 26, 0.58, 0.5, 2);
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
  /* Almost nothing now. The probe carries the sky and bounce; this is only
     here to stop the undersides of the planting going fully black. */
  ctx.lights.add(new HemisphereLight(0xf6ead3, 0x4e3626, 0.12));
  /* One weak cool wash from the right, the daylight any set gets off its own
     white walls. It is what stops the green reading as olive. */
  const wash = new DirectionalLight(0xc9d8de, 0.1);
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
