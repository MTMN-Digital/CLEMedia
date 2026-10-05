import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Group,
  HemisphereLight,
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
   SET A: a working studio.

   The room is the room the thing was shot in. A cyclorama cove sweeping from
   floor to wall with no visible seam, a lighting rig overhead with its lamps
   and a flag, a C-stand to one side, cable on the floor, and one hard key
   throwing the mark's own shadow across the sweep.

   WHY THIS ONE. The company's whole argument is that people make the work.
   The most direct way to say that before a word is read is to show the room
   they make it in, with the kit in shot rather than hidden: a rig, a stand, a
   flag and a cable are the opposite of a stock gradient.

   WHAT DOES THE WORK. Four depths, which is what a push-in needs:
     the rig and its lamps sit ABOVE and NEAR, so they sweep up and out
     the flag and the stand sit to the SIDES and near, so they sweep outward
     the mark sits at the origin and grows
     the cove sits BEHIND and opens up as the camera comes in
   Nothing here animates. The camera is the only thing that moves, which is
   the point: a set that also moves stops being a place and becomes an effect.

   Everything is geometry. No photograph, no generated image.
   ========================================================================== */

/** Half the width of the cove, so it runs well past the frame at every depth. */
const COVE_HALF_WIDTH = 9;
/** Radius of the curve where floor becomes wall. A real cove is generous; a
    tight one reads as a folded sheet of paper. */
const COVE_RADIUS = 1.5;
/** How far the floor runs toward the camera, and how high the wall runs. */
const COVE_FLOOR_FRONT = 7;
const COVE_WALL_TOP = 7;

/**
 * The cove, as one surface: floor, quarter-circle, wall. Built by hand
 * because the profile is the whole point, and a bent plane with its normals
 * recomputed is a dozen lines against pulling in an extrusion helper.
 */
function coveGeometry(segments = 96): BufferGeometry {
  /* The profile in the ZY plane, from the front of the floor, around the
     curve, up the wall. Walking it by arc length keeps the quads even. */
  const curveStartZ = BACK_Z + COVE_RADIUS;
  const curveTopY = FLOOR_Y + COVE_RADIUS;
  const floorRun = COVE_FLOOR_FRONT - curveStartZ;
  const arcRun = (Math.PI / 2) * COVE_RADIUS;
  const wallRun = COVE_WALL_TOP - curveTopY;
  const total = floorRun + arcRun + wallRun;

  const profile: { y: number; z: number; ny: number; nz: number }[] = [];
  for (let i = 0; i <= segments; i++) {
    const s = (i / segments) * total;
    if (s <= floorRun) {
      profile.push({ y: FLOOR_Y, z: COVE_FLOOR_FRONT - s, ny: 1, nz: 0 });
    } else if (s <= floorRun + arcRun) {
      const a = (s - floorRun) / COVE_RADIUS; // 0 at the floor, PI/2 at the wall
      profile.push({
        y: curveTopY - Math.cos(a) * COVE_RADIUS,
        z: curveStartZ - Math.sin(a) * COVE_RADIUS,
        ny: Math.cos(a),
        nz: Math.sin(a),
      });
    } else {
      profile.push({ y: curveTopY + (s - floorRun - arcRun), z: BACK_Z, ny: 0, nz: 1 });
    }
  }

  const cols = 2;
  const positions = new Float32Array((segments + 1) * cols * 3);
  const normals = new Float32Array((segments + 1) * cols * 3);
  const uvs = new Float32Array((segments + 1) * cols * 2);
  const indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const p = profile[i];
    for (let j = 0; j < cols; j++) {
      const k = (i * cols + j) * 3;
      positions[k] = (j === 0 ? -1 : 1) * COVE_HALF_WIDTH;
      positions[k + 1] = p.y;
      positions[k + 2] = p.z;
      normals[k] = 0;
      normals[k + 1] = p.ny;
      normals[k + 2] = p.nz;
      const u = (i * cols + j) * 2;
      uvs[u] = j;
      uvs[u + 1] = i / segments;
    }
    if (i < segments) {
      const a = i * cols;
      /* Wound so the face normal comes out of the room: the first version
         had it the other way, the cove answered only the hemisphere fill and
         the whole set rendered as a vertical gradient. */
      indices.push(a, a + 1, a + cols, a + 1, a + cols + 1, a + cols);
    }
  }

  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(positions, 3));
  g.setAttribute("normal", new BufferAttribute(normals, 3));
  g.setAttribute("uv", new BufferAttribute(uvs, 2));
  g.setIndex(indices);
  return g;
}

/** A lamp on the rig: a barrel, a cone and a yoke, dark and matte. */
function lamp(body: Material, lens: Material): Group {
  const g = new Group();
  const barrel = new Mesh(new CylinderGeometry(0.17, 0.2, 0.34, 18), body);
  barrel.castShadow = true;
  const hood = new Mesh(new ConeGeometry(0.26, 0.26, 18, 1, true), lens);
  hood.position.y = -0.28;
  hood.rotation.x = Math.PI;
  hood.castShadow = true;
  const stem = new Mesh(new CylinderGeometry(0.03, 0.03, 0.3, 8), body);
  stem.position.y = 0.3;
  g.add(barrel, hood, stem);
  /* Pointing down and a little forward, the way a lamp aimed at a subject
     on the floor of a cove actually hangs. */
  g.rotation.x = 0.22;
  return g;
}

export async function studioSet(ctx: SetContext): Promise<HeroSet> {
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const keep = <T extends BufferGeometry>(g: T) => (geometries.push(g), g);
  const mat = <T extends Material>(m: T) => (materials.push(m), m);

  const paper = new Color(ctx.token("--color-raised", "#fdf8ed"));

  /* ---- The sweep --------------------------------------------------------
     Warm paper, and the only large bright surface in the frame. Everything
     else in this set is dark and small, so this is what the picture is
     made of. */
  const cove = new Mesh(
    keep(coveGeometry()),
    mat(new MeshStandardMaterial({ color: paper, roughness: 0.96, metalness: 0 })),
  );
  cove.receiveShadow = true;
  ctx.back.add(cove);

  /* ---- The kit ----------------------------------------------------------
     Painted steel, not silhouette. The first build of this set made every
     piece near-black, and a frame of black cut-outs on paper reads as
     cardboard rather than as a room: the eye needs to see a rounded
     highlight run down a bar to believe it is a bar. Warm dark brown, half
     metal, medium rough, so the key puts one edge on everything. */
  const steel = mat(
    new MeshStandardMaterial({ color: new Color(0x3b322b), roughness: 0.45, metalness: 0.55 }),
  );
  const cloth = mat(
    new MeshStandardMaterial({ color: new Color(0x241e1a), roughness: 0.95, metalness: 0 }),
  );

  /* The bar the objects hang from, at exactly the height the artwork's own
     strings stop: they then stop AT something, and the mark reads as rigged
     rather than as a logo with decorative string on it. This one piece does
     more for the set than everything else in it. */
  const hangBar = new Mesh(keep(new CylinderGeometry(0.022, 0.022, 14, 12)), steel);
  hangBar.rotation.z = Math.PI / 2;
  hangBar.position.set(0, 0.502, 0.04);
  hangBar.castShadow = true;
  ctx.back.add(hangBar);

  const rig = new Group();

  /* Two more bars further back and higher, out of the way, so the rig has
     depth and the top of the frame is not one lonely line. */
  const barGeom = keep(new CylinderGeometry(0.018, 0.018, 14, 10));
  for (const [y, z] of [
    [0.98, -0.9],
    [1.24, -1.9],
  ] as const) {
    const bar = new Mesh(barGeom, steel);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, y, z);
    rig.add(bar);
  }

  /* Lamps, small and well back. A lamp near the lens is a black cone across
     the frame; a lamp at the back of the rig is a lamp. */
  for (const [x, y, z, sc] of [
    [-0.78, 0.86, -0.9, 0.42],
    [0.72, 0.86, -0.9, 0.42],
    [-0.12, 1.12, -1.9, 0.34],
  ] as const) {
    const l = lamp(steel, steel);
    l.position.set(x, y, z);
    l.scale.setScalar(sc);
    rig.add(l);
  }
  ctx.back.add(rig);

  /* ---- A flag, entering the left edge -----------------------------------
     Only its edge is ever in shot. It is the nearest thing in the set, so it
     is the first to leave, and a dark vertical sliding out of frame is the
     cheapest honest proof that the camera is moving and not the picture. */
  const flag = new Group();
  const panel = new Mesh(keep(new PlaneGeometry(0.62, 1.05)), cloth);
  panel.rotation.y = 0.55;
  const flagArm = new Mesh(keep(new CylinderGeometry(0.018, 0.018, 0.7, 8)), steel);
  flagArm.rotation.z = Math.PI / 2;
  flagArm.position.set(0.34, 0.5, 0.02);
  flag.add(panel, flagArm);
  flag.position.set(-1.12, 0.12, 1.25);
  ctx.front.add(flag);

  /* ---- A stand, entering the right edge ---------------------------------
     Behind the mark's plane, so it is in `back`: a near object that passes
     behind the subject cannot be in the pass that draws over it. */
  const stand = new Group();
  const column = new Mesh(keep(new CylinderGeometry(0.026, 0.034, 1.9, 12)), steel);
  column.position.y = -0.3;
  column.castShadow = true;
  const arm = new Mesh(keep(new CylinderGeometry(0.018, 0.018, 0.78, 10)), steel);
  arm.rotation.z = Math.PI / 2 - 0.22;
  arm.position.set(-0.3, 0.42, 0);
  arm.castShadow = true;
  const knuckle = new Mesh(keep(new CylinderGeometry(0.045, 0.045, 0.07, 10)), steel);
  knuckle.rotation.x = Math.PI / 2;
  knuckle.position.set(0, 0.42, 0);
  stand.add(column, arm, knuckle);
  stand.position.set(1.34, 0.1, -0.35);
  ctx.back.add(stand);

  /* ---- Cable on the floor, well behind the mark --------------------------
     The floor is only in frame from about a unit behind the subject, so this
     is where floor dressing can be seen at all. A bare sweep is a backdrop;
     one cable running across it is a room someone works in. */
  const cable = new Mesh(
    keep(
      new TubeGeometry(
        new CatmullRomCurve3([
          new Vector3(-3.4, FLOOR_Y + 0.016, -1.0),
          new Vector3(-1.5, FLOOR_Y + 0.016, -1.9),
          new Vector3(0.2, FLOOR_Y + 0.016, -1.3),
          new Vector3(1.8, FLOOR_Y + 0.016, -2.1),
          new Vector3(3.2, FLOOR_Y + 0.016, -1.5),
        ]),
        64,
        0.016,
        8,
        false,
      ),
    ),
    steel,
  );
  cable.castShadow = true;
  ctx.back.add(cable);

  /* ---- The light --------------------------------------------------------
     One key, up and to the left and in front, which is where the artwork's
     own lamp was: the mark is relit toward the light it already has, so the
     wool is shown as photographed and the room agrees with it. The hemisphere
     fill keeps the sweep off black at the bottom of the frame without
     flattening the pool the key makes. */
  const key = new SpotLight(0xfff1d8, 110, 24, 0.62, 0.7, 2);
  key.position.set(-3.4, 4.6, 5.2);
  const target = new Object3D();
  target.position.set(0.15, -0.45, -0.6);
  key.target = target;
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1.5;
  key.shadow.camera.far = 18;
  /* The mark is a cut-out standing nearly edge on to the shadow camera, so
     too small a bias stripes it and too large detaches its shadow. */
  key.shadow.bias = -0.0012;
  key.shadow.normalBias = 0.022;
  ctx.lights.add(key, target);

  ctx.lights.add(new HemisphereLight(0xf4e8d2, 0x53392a, 1.35));

  return {
    key: { dir: new Vector3(-0.55, 0.78, 1.0).normalize(), gain: 1 },
    dispose() {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
    },
  };
}
