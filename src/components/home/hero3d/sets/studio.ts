import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  PointLight,
  SphereGeometry,
  SpotLight,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  type Material,
} from "three";
import { BACK_Z, FLOOR_Y, type HeroSet, type SetContext } from "./types";

/* ============================================================================
   SET A: a working studio.

   The room the thing was shot in. A cyclorama cove sweeping from floor to wall
   with no visible seam, a lighting rig overhead with its lamps, a flag and a
   C-stand near the lens, a lamp on a stand at the back with its legs on the
   floor, an apple box and cable, and one hard key throwing the mark's own
   shadow down onto the floor behind it.

   WHY THIS ONE. The company's whole argument is that people make the work. The
   most direct way to say that before a word is read is to show the room they
   make it in, with the kit in shot rather than hidden: a rig, a stand, a flag
   and a cable are the opposite of a stock gradient.

   THE PICTURE, which is the part the first build got wrong. The first build lit
   the cove evenly with a wide spot and a hemisphere at 1.35, and a cyclorama
   lit evenly is a beige wash: a web page background, not a set. The light here
   is one hard key, off frame to the upper left, with a cone tight enough that
   its EDGE lands inside the picture. Its axis hits the floor a unit behind the
   mark, so the bright surface is the floor, the wall above falls off two or
   three stops into the top corners, and the kit sits in that falloff as dark
   shapes with one lit edge each. The fill is a sixteenth of what it was, which
   is what lets any of that survive.

   FOUR DEPTHS, which is what a push-in needs:
     z about +1.0 to +1.3   the flag, the C-stand column and a grid bar, which
                            sweep out of frame in the first third of the move
     z 0                    the mark, which grows
     z -0.9 to -2.2         the rig and its lamps overhead, the stand on the
                            floor at the right, the apple box and the cable
     z -3.2                 the sweep, which opens up as the camera comes in
   Nothing here animates. The camera is the only thing that moves, which is the
   point: a set that also moves stops being a place and becomes an effect.

   Everything is geometry and light. No photograph, no texture, no generated
   image of any kind.
   ========================================================================== */

/** Half the width of the cove, so it runs well past the frame at every depth.
    At the wall the frame is only about 3.2 units either side of centre. */
const COVE_HALF_WIDTH = 9;
/** Radius of the curve where floor becomes wall. 1.5 put the transition a
    third of the way UP the frame, so the bottom third of the picture was all
    floor and the wall was a thin strip: the set had no wall to fall off into.
    At 0.9 the transition crosses just under the mark, which is where a cove
    sits when you shoot a subject standing in one. */
const COVE_RADIUS = 0.9;
/** How far the floor runs toward the camera, and how high the wall runs. The
    floor is below the frame in front of about z = -0.65, so its front edge is
    about shadow catching rather than about anything visible. */
const COVE_FLOOR_FRONT = 5;
const COVE_WALL_TOP = 7;

/**
 * The cove, as one surface: floor, quarter-circle, wall. Built by hand because
 * the profile is the whole point, and a bent plane with its normals recomputed
 * is a dozen lines against pulling in an extrusion helper.
 */
function coveGeometry(segments = 112): BufferGeometry {
  /* The profile in the ZY plane, from the front of the floor, around the
     curve, up the wall. Walking it by arc length keeps the quads even, which
     matters here because the shading across the curve is the only thing that
     tells a reader the floor and the wall are one surface. */
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
      /* Wound so the face normal comes out of the room: the first version had
         it the other way, the cove answered only the hemisphere fill and the
         whole set rendered as a vertical gradient. */
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

/** The shared geometry and materials every piece of kit is cut from, built
    once so four lamps and three legs are not four and three allocations. */
interface Kit {
  shell: Material;
  trim: Material;
  near: Material;
  glass: Material;
  cloth: Material;
  wood: Material;
  barrel: CylinderGeometry;
  ring: CylinderGeometry;
  lens: CircleGeometry;
  door: BoxGeometry;
  yoke: TorusGeometry;
  tube: CylinderGeometry;
  knuckle: CylinderGeometry;
  pad: CylinderGeometry;
}

/**
 * A lamp: barrel, lens, two barn doors, a yoke, and a stem up to whatever it
 * hangs off. The first build drew these as a cone and a cylinder in flat black
 * and they read as crude arrowheads, because what says "lamp" is not the
 * silhouette, it is the ring of the barn doors, the yoke round the barrel and a
 * lens you can see. The lens of the one lamp that is switched on is the only
 * emissive surface in the set.
 *
 * The root sits at the mount point. The yoke yaws with the barrel and the stem
 * does not, so a lamp aimed sideways still hangs on a vertical stem.
 */
function lamp(
  kit: Kit,
  stem: number,
  lit: boolean,
  /* A hanging lamp throws a lamp-shaped shadow onto the cove behind it, which
     is a second object in the picture that nobody put there. Only the lamp
     standing on the floor casts, because its shadow and its legs are what say
     the floor is a floor. */
  casts: boolean,
): { root: Group; aim(dir: Vector3): void } {
  const root = new Group();
  const dropY = -stem - 0.26;

  if (stem > 0.02) {
    const pole = new Mesh(kit.tube, kit.shell);
    pole.scale.y = stem;
    pole.position.y = -stem / 2;
    pole.castShadow = casts;
    const clampBlock = new Mesh(kit.knuckle, kit.trim);
    clampBlock.rotation.z = Math.PI / 2;
    clampBlock.position.y = -0.02;
    root.add(pole, clampBlock);
  }

  /* Yaw only: the yoke turns with the lamp, it does not pitch with it. */
  const mount = new Group();
  mount.position.y = dropY;
  const yoke = new Mesh(kit.yoke, kit.shell);
  yoke.castShadow = casts;
  mount.add(yoke);

  const head = new Group();
  const barrel = new Mesh(kit.barrel, kit.shell);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = 0.02;
  barrel.castShadow = casts;
  const ring = new Mesh(kit.ring, kit.trim);
  ring.rotation.x = Math.PI / 2;
  ring.position.z = -0.17;
  const lens = new Mesh(kit.lens, lit ? kit.glass : kit.trim);
  lens.rotation.y = Math.PI;
  lens.position.z = -0.145;
  const back = new Mesh(kit.knuckle, kit.trim);
  back.rotation.x = Math.PI / 2;
  back.position.z = 0.17;
  head.add(barrel, ring, lens, back);

  /* Two doors, top and bottom, flared off the ring. Four would be truer to a
     real head and would also close the ring into a box from most angles. */
  for (const s of [1, -1]) {
    const door = new Mesh(kit.door, kit.shell);
    door.position.set(0, s * 0.263, -0.243);
    door.rotation.x = -s * 0.55;
    door.castShadow = casts;
    head.add(door);
  }

  mount.add(head);
  root.add(mount);

  return {
    root,
    aim(dir) {
      const d = dir.clone().normalize();
      /* The yaw goes on the mount and the pitch on the head, so the yoke
         follows the pan and stays upright through the tilt. */
      mount.rotation.y = Math.atan2(-d.x, -d.z);
      head.rotation.order = "YXZ";
      head.rotation.x = Math.asin(d.y);
    },
  };
}

export async function studioSet(ctx: SetContext): Promise<HeroSet> {
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const keep = <T extends BufferGeometry>(g: T) => (geometries.push(g), g);
  const mat = <T extends Material>(m: T) => (materials.push(m), m);

  const paper = new Color(ctx.token("--color-raised", "#fdf8ed"));

  /* ---- The sweep --------------------------------------------------------
     Warm paper, and the only large bright surface in the frame. Everything
     else in this set is dark and small, so this is what the picture is made
     of. Matte: a cyclorama is emulsion paint, and any sheen on it reads as
     lino and kills the no-seam illusion the curve is there to produce. */
  const cove = new Mesh(
    keep(coveGeometry()),
    mat(new MeshStandardMaterial({ color: paper, roughness: 0.94, metalness: 0 })),
  );
  cove.receiveShadow = true;
  ctx.back.add(cove);

  /* ---- What the kit is made of ------------------------------------------
     Painted steel, not silhouette. The first build made every piece
     near-black, and a frame of black cut-outs on paper reads as cardboard
     rather than as a room: the eye needs to see a rounded highlight run down
     a bar to believe it is a bar. Warm dark brown, half metal, medium rough,
     so the key and the edge light put one lit side on everything. */
  const kit: Kit = {
    shell: mat(
      new MeshStandardMaterial({
        /* Literal, not mixed off the palette. The first pass built this as the
           ink token lerped toward the brand red and scaled up, and every pipe
           in the frame came out oxblood: a studio of maroon scaffolding. Kit
           is grey, warm only because the lamp on it is. */
        color: new Color(0x2a241f),
        /* Matte, and barely metal. At roughness 0.38 and metalness 0.55 the
           bars nearest the key threw a mirror highlight down their whole
           length and the top of the frame went to polished brass. Real grip
           kit is powder coat: a broad dim lobe, no mirror. */
        roughness: 0.62,
        metalness: 0.25,
      }),
    ),
    /* Rings, knuckles and cold lenses: brighter and shinier than the bodies,
       because on real kit those parts are bare or chromed and they are what
       catches the key. */
    trim: mat(
      new MeshStandardMaterial({
        color: new Color(0x5d554b),
        roughness: 0.44,
        metalness: 0.55,
      }),
    ),
    /* Everything within a unit and a half of the lens. The key is a low lamp
       almost beside the camera, so the near kit stands in the hot part of its
       beam: in painted steel at 0.25 metal it came out as a lit pole and a
       blown chrome knuckle at the edge of the frame, the brightest thing in
       the picture. Near kit is matte black duvetyne-adjacent paint, which is
       what a C-stand actually is, and it stays a shape. */
    near: mat(
      new MeshStandardMaterial({ color: new Color(0x1c1816), roughness: 0.78, metalness: 0.12 }),
    ),
    /* The one lamp that is switched on. Emissive rather than a light: a second
       shadow-casting source would double the shadow pass on a phone, and the
       spill it needs is cheaper as one small point light. */
    glass: mat(
      new MeshStandardMaterial({
        color: new Color(0xc9a471),
        emissive: new Color(0xffd79a),
        /* 1.15 blew the lens to a white disc brighter than the mark and the
           eye went straight to it. A practical in a photograph is warm and
           only just above the paper around it. */
        emissiveIntensity: 0.34,
        roughness: 0.3,
        metalness: 0,
      }),
    ),
    /* Flags and sandbags are duvetyne and canvas: they are in the frame to
       absorb, so they sit below everything else in the picture. */
    cloth: mat(
      new MeshStandardMaterial({ color: new Color(0x1d1815), roughness: 0.98, metalness: 0 }),
    ),
    wood: mat(
      new MeshStandardMaterial({ color: new Color(0x4c3826), roughness: 0.82, metalness: 0.04 }),
    ),
    barrel: keep(new CylinderGeometry(0.15, 0.17, 0.3, 16)),
    ring: keep(new CylinderGeometry(0.195, 0.21, 0.08, 16, 1, true)),
    lens: keep(new CircleGeometry(0.188, 16)),
    door: keep(new BoxGeometry(0.33, 0.18, 0.012)),
    yoke: keep(new TorusGeometry(0.245, 0.016, 5, 16, Math.PI)),
    tube: keep(new CylinderGeometry(0.019, 0.019, 1, 10)),
    knuckle: keep(new CylinderGeometry(0.05, 0.05, 0.07, 10)),
    pad: keep(new CylinderGeometry(0.035, 0.03, 0.022, 8)),
  };

  /* ---- The bar the mark hangs from --------------------------------------
     At exactly the height the artwork's own strings stop, so they stop AT
     something and the mark reads as rigged rather than as a logo with
     decorative string painted on it. This one piece does more for the set
     than everything else in it. */
  const hangBar = new Mesh(keep(new CylinderGeometry(0.019, 0.019, 13, 12)), kit.shell);
  hangBar.rotation.z = Math.PI / 2;
  /* Measured against a render, not assumed: the painted strings end at y just
     over 0.5, which is the top of the mark's plane, so the bar sits there.
     Thin, because this line crosses the whole picture and has to read as
     rigging rather than as a rule drawn across the frame. A pass at 0.019
     radius and one at 0.024 are visibly different on this: the thicker one
     reads as a handrail. */
  hangBar.position.set(0, 0.504, 0.05);
  /* Deliberately not a caster. A bar is infinite across the frame, so its
     shadow is a hard horizontal line the full width of the cove, and three
     bars gave the first render three of them: the sweep read as a barn wall
     with purlins. The only cast shadows in this set are things with an
     outline worth seeing. */
  ctx.back.add(hangBar);

  /* ---- The thing that casts the mark's shadow ---------------------------
     An invisible copy of the mark, one plane, carrying the uncut artwork as
     its alpha. It writes no colour and no depth. Its only job is to be in the
     shadow map.

     WHY IT HAS TO EXIST. The mark's own meshes are flagged castShadow and
     carry a customDepthMaterial, and they still throw nothing, for two
     separate reasons inside three's shadow pass. First, every frame it does
     `result.side = shadowSide[material.side]`, which maps FrontSide to
     BackSide; the mark's layers are single-sided planes facing the camera and
     the key is on that same side, so all their faces are culled out of the
     shadow map. Second, the same function then does `result.map = material.map`
     and `result.alphaTest = material.alphaTest`, read off the mark's
     ShaderMaterial, which has neither, so even when a layer does land in the
     map it lands as a solid rectangle rather than as cut-out letters. Those
     two together are, almost certainly, the "vague blobby shadows that do not
     resemble the letters" in the rejection note.

     Both are in mark.ts, which this shard does not own, so this is the fix
     that stays inside the set: a caster that is DoubleSide (which maps to
     DoubleSide, so it survives the flip) and carries a real map and a real
     alphaTest (so the cut-out is respected). It uses the client's own uncut
     mark file, the same one the CSS hero already uses for its shadow. */
  const silhouette = await ctx.loadTexture("/brand/cle-mark.webp");
  const caster = new Mesh(
    keep(new PlaneGeometry(1, 1)),
    mat(
      new MeshBasicMaterial({
        map: silhouette,
        alphaTest: 0.5,
        side: DoubleSide,
        colorWrite: false,
        depthWrite: false,
      }),
    ),
  );
  caster.position.z = 0.08;
  caster.castShadow = true;
  ctx.back.add(caster);

  /* ---- The rig overhead --------------------------------------------------
     One bar across and one running away from the lens. The second is doing
     the real work: a pipe going away converges toward the vanishing point, so
     the top left corner has a line in it that is unambiguously a line in
     perspective, which no amount of shading on the cove can buy. Both leave
     the top of the frame as the camera comes in and drops. */
  const crossBar = new Mesh(keep(new CylinderGeometry(0.021, 0.021, 13, 10)), kit.shell);
  crossBar.rotation.z = Math.PI / 2;
  crossBar.position.set(0, 1.12, -1.25);
  ctx.back.add(crossBar);

  const runBar = new Mesh(keep(new CylinderGeometry(0.019, 0.019, 2.6, 10)), kit.shell);
  runBar.rotation.x = Math.PI / 2;
  runBar.position.set(-1.5, 1.2, -1.5);
  ctx.back.add(runBar);

  /* Two lamps, out at the sides where kit belongs, both switched off and
     aimed at the mark: the key is off frame to the left, which is ordinary in
     a studio and is what lets the lamps in shot be dark shapes rather than
     three competing highlights. The first render had three at 0.7 scale in
     the middle of the picture and they fought the mark. */
  for (const [x, drop, sc] of [
    [-1.32, 0.2, 0.5],
    [1.18, 0.3, 0.46],
  ] as const) {
    const l = lamp(kit, drop, false, false);
    l.root.position.set(x, 1.12, -1.25);
    l.root.scale.setScalar(sc);
    l.aim(new Vector3(-x, -1.5, 1.25));
    ctx.back.add(l.root);
  }

  /* ---- The lamp on a stand, at the back right ----------------------------
     This is the piece that makes the floor a floor. A stand with its three
     legs standing on the sweep, with the legs' own shadows running off them,
     is worth more than any amount of shading on the cove: the first build had
     nothing touching the floor behind the mark, so the bottom of the frame
     was just lighter paper. It sits at x 2.0, z -2.35, which is 74% of the way
     to the edge of the frame at that depth: out at the side where kit lives,
     and far enough into the key's falloff that it stays a dark shape. */
  const stand = new Group();
  const standTop = 0.6;
  const column = new Mesh(keep(new CylinderGeometry(0.023, 0.034, standTop - FLOOR_Y, 12)), kit.shell);
  column.position.y = (standTop + FLOOR_Y) / 2;
  column.castShadow = true;
  const collar = new Mesh(kit.knuckle, kit.trim);
  collar.position.y = -0.06;
  stand.add(column, collar);

  const legLen = 0.78;
  const legTilt = 0.6;
  for (let i = 0; i < 3; i++) {
    const legGroup = new Group();
    legGroup.rotation.y = (i / 3) * Math.PI * 2 + 0.6;
    const leg = new Mesh(kit.tube, kit.shell);
    leg.scale.y = legLen;
    leg.rotation.z = -legTilt;
    const axis = new Vector3(Math.sin(legTilt), Math.cos(legTilt), 0);
    const hub = new Vector3(0, FLOOR_Y + 0.62, 0);
    leg.position.copy(hub).addScaledVector(axis, -legLen / 2);
    leg.castShadow = true;
    const foot = new Mesh(kit.pad, kit.trim);
    foot.position.copy(hub).addScaledVector(axis, -legLen).setY(FLOOR_Y + 0.012);
    foot.castShadow = true;
    legGroup.add(leg, foot);
    stand.add(legGroup);
  }

  const headLamp = lamp(kit, 0.01, true, true);
  headLamp.root.position.y = standTop;
  /* A real head is about a quarter of the mark's width. At 0.9 it was a third
     and the glowing lens became the brightest thing in the frame. */
  headLamp.root.scale.setScalar(0.56);
  stand.add(headLamp.root);
  stand.position.set(2.0, 0, -2.35);
  ctx.back.add(stand);
  /* Aimed across the sweep at the mark, which is what puts its lens toward
     the camera and lets the one practical in shot read as switched on. */
  headLamp.aim(new Vector3(-2.0, -0.75, 2.2));

  /* Two sandbags over a leg. Studio kit is half ballast, and a soft heavy
     shape on the floor beside three thin steel ones is the cheapest way to
     say the floor carries weight. */
  const bagGeom = keep(new SphereGeometry(0.17, 10, 6));
  for (const [x, z, rot] of [
    [1.72, -2.18, 0.5],
    [1.87, -2.26, -0.3],
  ] as const) {
    const bag = new Mesh(bagGeom, kit.cloth);
    bag.scale.set(1, 0.44, 0.72);
    bag.position.set(x, FLOOR_Y + 0.072, z);
    bag.rotation.y = rot;
    bag.castShadow = true;
    ctx.back.add(bag);
  }

  /* ---- An apple box, left and back, in the falloff ----------------------
     Something has to be IN the dark part of the room or the dark part is just
     an empty corner. A box on its side at the edge of the pool reads as a
     place where someone put a box down. */
  const box = new Mesh(keep(new BoxGeometry(0.54, 0.28, 0.37)), kit.wood);
  box.position.set(-1.42, FLOOR_Y + 0.14, -1.72);
  box.rotation.y = 0.34;
  box.castShadow = true;
  box.receiveShadow = true;
  ctx.back.add(box);

  /* ---- Cable on the floor, well behind the mark --------------------------
     The floor only enters the frame from about two thirds of a unit behind the
     subject, so this is where floor dressing can be seen at all. A bare sweep
     is a backdrop; one cable running across it, out from under the stand, is a
     room someone works in. */
  const cable = new Mesh(
    keep(
      new TubeGeometry(
        new CatmullRomCurve3([
          new Vector3(-3.2, FLOOR_Y + 0.018, -1.2),
          new Vector3(-1.1, FLOOR_Y + 0.018, -1.68),
          new Vector3(0.35, FLOOR_Y + 0.018, -1.28),
          new Vector3(1.6, FLOOR_Y + 0.018, -1.9),
          new Vector3(2.0, FLOOR_Y + 0.018, -2.32),
        ]),
        48,
        0.019,
        6,
        false,
      ),
    ),
    kit.shell,
  );
  cable.castShadow = true;
  ctx.back.add(cable);

  /* ---- Near the lens ----------------------------------------------------
     The three pieces that make the push-in read as a push-in. All of them are
     between the camera and the mark for the whole move, so they belong in
     `front`, and all of them are gone from the frame by about two thirds of
     the way through: at z = +1.15 the visible half width shrinks from 1.00 to
     0.61 across the move, so anything standing out past 0.6 leaves.

     There is no depth of field in this scene, so a near object is as sharp as
     a far one and therefore as loud. The only defence is to keep the near
     pieces narrow, very dark and against the edges. The first build ignored
     that: a 0.62 wide flag panel at x = -1.12 was a slab over the whole left
     edge, and a hanging cable at radius 0.016 drew a hose right across the
     picture.

     Left edge, front to back: the C-stand column, then the flag behind it.
     Two dark verticals at different depths separating at different rates is
     the cheapest honest proof that the camera is moving and not the picture. */
  const flag = new Group();
  const panel = new Mesh(keep(new BoxGeometry(0.6, 1.15, 0.014)), kit.cloth);
  const flagFrame = new Mesh(kit.tube, kit.near);
  flagFrame.scale.y = 1.2;
  flagFrame.position.x = 0.308;
  flag.add(panel, flagFrame);
  /* Centre is off frame; about a sixth of a unit of its inside edge is in
     shot at rest, which is a dark margin rather than a panel. */
  flag.position.set(-1.2, 0.2, 0.95);
  flag.rotation.y = 0.34;
  ctx.front.add(flag);

  const cStand = new Group();
  const riser = new Mesh(kit.tube, kit.near);
  riser.scale.y = 2.8;
  const knuckle = new Mesh(kit.knuckle, kit.near);
  knuckle.rotation.x = Math.PI / 2;
  knuckle.position.y = 0.3;
  /* The arm points LEFT, off the edge of the frame. The first build pointed
     one in and it cut a diagonal right across the picture, which is the single
     thing a C-stand arm must never do in a frame it is only dressing. */
  const stub = new Mesh(kit.tube, kit.near);
  stub.scale.y = 0.46;
  stub.rotation.z = Math.PI / 2 - 0.12;
  stub.position.set(-0.24, 0.33, 0.01);
  cStand.add(riser, knuckle, stub);
  cStand.position.set(-0.7, 0.04, 1.15);
  ctx.front.add(cStand);

  /* A grid bar across the top of the resting frame, nearer than the rig, so
     the two cross the frame at different rates as the camera comes in. It is
     out of the top of the frame by about halfway. */
  const nearBar = new Mesh(keep(new CylinderGeometry(0.025, 0.025, 9, 12)), kit.near);
  nearBar.rotation.z = Math.PI / 2;
  nearBar.rotation.y = 0.05;
  nearBar.position.set(0, 0.62, 1.0);
  ctx.front.add(nearBar);

  /* ---- The light --------------------------------------------------------
     One hard key, off frame up and to the left and in front, which is where
     the artwork's own lamp was: the mark is relit toward the light it already
     has, so the wool is shown close to as photographed and the room agrees
     with it.

     ELEVATION IS THE WHOLE ARGUMENT, and it is set by where the shadow has to
     land. The camera's axis is horizontal and its eye is only a unit above the
     floor, so the floor is seen at a grazing angle and anything lying on it is
     crushed into the bottom of the frame. The first build put the lamp at 40
     degrees and the second at 47, and both threw the mark's shadow into a band
     two percent of the frame tall that nobody could see: the mark read as
     pasted on. At 21 degrees the same shadow is flung back and to the right
     across a sixth of the frame and climbs the start of the cove's curve,
     which is the one cue that says the object is really hanging in the room.

     The price of a low lamp is that the floor is lit at a grazing angle too,
     so the intensity has to be high to keep the floor bright: 500 reads as a
     lot, but the lamp is 8.5 units out and this is inverse square. The cone is
     tight, 0.26 rad, so the pool is a patch behind and right of the mark and
     the wall above it falls away rather than being washed. The angle is also
     what decides how high the wall is lit: the cone's upper edge leaves this
     lamp at about 6 degrees below level and meets the wall around y = 1.2, so
     the gradient on the wall runs out a little above the mark's head. Widening
     it to 0.30 puts that line at y = 1.6 and the whole cove is washed again,
     which was the first build's failure. */
  const key = new SpotLight(0xfff0d4, 250, 26, 0.26, 0.55, 2);
  key.position.set(-2.81, 2.22, 5.06);
  const target = new Object3D();
  /* Aimed almost straight down the room rather than across it. At x 0.8 the
     axis struck the cove a unit and a half right of the mark and the brightest
     part of the picture was a patch of empty paper beside the subject. */
  target.position.set(0.1, -0.85, -1.9);
  key.target = target;
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  /* The near kit is about 3.5 from the lamp, so near has to clear it. The
     tighter cone also buys about 350 shadow texels across the mark, which is
     the difference between letters on the floor and a blob. */
  key.shadow.camera.near = 2.5;
  key.shadow.camera.far = 16;
  /* The mark is a cut-out standing nearly edge on to the shadow camera, so too
     small a bias stripes it and too large detaches its shadow. */
  key.shadow.bias = -0.0009;
  key.shadow.normalBias = 0.02;
  ctx.lights.add(key, target);

  /* The cyc wash: a second lamp off frame to the left, wide, soft and weak,
     doing on this cove exactly what a background lamp does on a real one. It
     is here because the key alone, which has to be low to throw a shadow worth
     seeing, leaves the top half of the frame as one flat brown field that no
     amount of hemisphere fill makes interesting. The wash is what turns that
     field into a gradient falling off to the corners, and it is weak enough
     (an eighteenth of the key before distance) that the pool still reads as
     the lit part of the room. No shadow: one shadow map is the budget, and a
     background lamp in a studio is flagged off the subject anyway. */
  const wash = new SpotLight(0xffeccd, 22, 14, 0.62, 1, 2);
  wash.position.set(-2, 2.2, 1.6);
  const washTarget = new Object3D();
  washTarget.position.set(-0.2, 0.3, BACK_Z);
  wash.target = washTarget;
  ctx.lights.add(wash, washTarget);

  /* The practical on the stand, as spill only. Short range and quadratic, so
     it blooms on the sweep right behind that lamp and is gone a unit away: a
     second small centre of warmth in the dark half of the frame, which is what
     stops the falloff reading as a vignette. */
  const spill = new PointLight(0xffc98a, 0.8, 2.4, 2);
  spill.position.set(1.82, 0.5, -2.48);
  ctx.lights.add(spill);

  /* An edge from the right, no shadow, weak, and almost horizontal. This is
     what runs a highlight down the bars and the stand's legs. Without it the
     kit is in the key's falloff and goes to shape only, which is the cardboard
     failure again. Horizontal matters as much as weak: angled down, it lands
     on the cove as a flat lift everywhere and quietly undoes the falloff the
     key was shaped to produce. */
  const edge = new DirectionalLight(0xe8d6b4, 0.42);
  edge.position.set(4, 0.55, 0.3);
  ctx.lights.add(edge);

  /* The fill, and the one number most responsible for the first build being a
     beige wash: it was 1.35, which is most of a white sky, so the cove was
     evenly lit everywhere and the key had nothing to carve. At 0.14 it does
     only its real job, which is keeping the dark corners a warm brown instead
     of black. */
  ctx.lights.add(new HemisphereLight(0xf2e4c8, 0x3a2317, 0.14));

  return {
    /* Halfway between the room's key and the lamp the artwork was photographed
       under. Dead on the room's key swings the wool's shading up and away from
       how it was shot; dead on the artwork's own puts the mark's highlights on
       a different side from everything else in the frame. At ten degrees apart
       nobody reads the difference and both are satisfied. */
    key: { dir: new Vector3(-0.43, 0.665, 0.595).normalize(), gain: 1.02 },
    dispose() {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
    },
  };
}
