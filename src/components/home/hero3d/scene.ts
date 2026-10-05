/* ============================================================================
   The WebGL hero scene.

   This module is the only place three.js is imported, and HeroMark3D pulls it
   in with a dynamic import, so three lands in its own chunk and never in the
   main bundle. Everything here is plain three.js: a renderer on the canvas
   HeroMark3D owns, one camera, four relief-mapped planes in a group, and a
   lamp that swings as the group turns.

   RENDER ORDER. The four objects are drawn back to front, each into a freshly
   cleared depth buffer. That keeps the depth order of the layered CSS hero
   exactly (the word in front of the lion, the lion in front of the elephant,
   the elephant in front of the caterpillar) while letting the relief inside
   each layer be as deep as it likes: a raised part of the caterpillar can
   never poke through the elephant hanging in front of it.

   SCALE AND CAMERA. One unit is the width of the mark's square. The camera
   is a perspective camera on a long lens (about 17 degrees across), and the
   scroll DOLLIES it: it starts further back, with the mark at REST of its
   full size, and drives in until the mark fills the figure's box. That is a
   real move of the camera along its axis, not a scale of the canvas: the
   canvas keeps its one size and its one drawing buffer, the mark is drawn
   larger because the camera is nearer, and the wool stays sharp because
   nothing is resampling finished pixels. Being a perspective camera, the
   dolly also does what a dolly does and a zoom does not: the word in front
   grows a little faster than the caterpillar behind it, so the objects pull
   apart as the camera comes in. The lens is long enough that at rest, with
   the camera at its furthest, the relief standing off each plane shifts by
   under one percent of the mark's width, so the canvas is still the logo
   the CSS layers under it show when it fades in over them.
   ========================================================================== */

import {
  Color,
  GLSL3,
  Group,
  LinearFilter,
  LinearMipmapLinearFilter,
  Matrix3,
  Mesh,
  NoColorSpace,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";
import { HERO_FRAGMENT, HERO_VERTEX } from "./shaders";
import { buildLayerFields, type LayerFields } from "./fields";

export interface HeroScene {
  /** `turn` is 0 at rest, 1 at full turn; `dolly` is the mark's size as a
      fraction of its full size, REST at rest and 1 at the end of the move.
      Both eased already by HeroStage. */
  setPose(turn: number, dolly: number): void;
  dispose(): void;
}

export interface HeroSceneOptions {
  /** The browser took the context away. The caller falls back to CSS. */
  onLost: () => void;
}

/* ---- The object ---------------------------------------------------------- */

/** The same four layers, depths and order as HeroMark, back to front. Depth
    is in px of the CSS perspective space, over the 400px cap of the mark. */
const LAYERS = [
  { name: "mark-c", z: 0, relief: 1 },
  { name: "mark-e", z: 10, relief: 1 },
  { name: "mark-l", z: 26, relief: 1 },
  /* The lettering is flatter felt than the animals, and its strokes are
     narrow enough that the full relief folds their right sides at 20 degrees. */
  { name: "mark-word", z: 48, relief: 0.6 },
] as const;

/** The mark's box is 591 by 592. */
const ASPECT = 592 / 591;
/** The CSS depths are in px over the 400px cap of the mark; they are opened
    up by this much so the objects visibly pass each other. */
const DEPTH_SCALE = 1.6 / 400;
/** Where the camera ends, in mark widths: the near end of the dolly, with
    the plane at Z_REF filling the figure's box. At rest it sits at
    CAMERA_END / REST_SCALE, further back by exactly the factor the mark is
    smaller. 4.5 widths with the 15% bleed is a 17 degree lens: long enough
    that the relief barely shifts with distance and the objects land within
    a percent of where the CSS layers put them when the canvas fades in,
    short enough that the dolly still pulls the word in front away from the
    caterpillar behind as it comes in. */
const CAMERA_END = 4.5;
/** The depth that fills the box exactly, in mark widths: a little in front
    of the back plane, between the caterpillar and the lion. Put the back
    plane here instead and the word, nearest the lens, overhangs the box by
    3% at the end of the move and crowds the headline under it; put the word
    there and the back layers shrink inside the CSS ones at the crossfade.
    The middle splits the error to about one percent each way. */
const Z_REF = 0.06;
/** The canvas bleeds 15% past the mark's box on every side (see index.css). */
const BLEED = 0.15;
/** Width of the colour maps in texels. The drawing buffer is capped so the
    mark is never drawn at much more than this many device pixels across:
    past it there is no more wool to show, only more fragments to shade. */
const TEXTURE_WIDTH = 1182;
/** Full turn, in radians: 20 degrees, right edge going away from the reader
    (a positive rotation about Y, the same sign as CSS rotateY). Mirrors the
    angle in .hero-mark's transform in index.css. */
const TURN_Y = (20 * Math.PI) / 180;
/** CSS rotateZ(-1.6deg) is anticlockwise on screen; three.js, with Y up,
    gets there with a positive angle. */
const TURN_Z = (1.6 * Math.PI) / 180;

/** How far the top of the wool stands off its layer, in mark widths. This
    is the ceiling, found by looking: at 0.2 the plateau slid 16px sideways
    across a 60px caterpillar segment at full turn and the shoulders smeared
    into streaks; at 0.1 the shoulders stretch about 1.5x, which still reads
    as a rounded limb. */
const RELIEF = 0.1;
/** The maps are a plateau between about 0.55 and 0.68 with a rounded
    shoulder down to 0.3 at the edge; this band is what becomes the relief. */
const HEIGHT_LOW = 0.45;
const HEIGHT_HIGH = 0.75;
/** Nothing in the maps is higher than this; the shadow walk stops here. */
const HEIGHT_MAX = 0.78;
/** Segments a side. One geometry is shared by the four layers; 360 squared
    is 130k vertices, about three texels a quad, fine enough that the walls
    at a silhouette do not facet. */
const SEGMENTS = 360;

/* ---- The lamp ------------------------------------------------------------ */

/** Up and to the left, a little in front, matching .hero-key. */
const LIGHT_REST = new Vector3(-0.55, 0.78, 1.0).normalize();
/** Where it has swung to at full turn: further left and lower, raking across
    the wool so the fibres and the hollows show. The object's face turns away
    from it as the right edge recedes, so in the object's own frame this ends
    up about 63 degrees off the normal, against 44 at rest. */
const LIGHT_TURN = new Vector3(-0.7, 0.6, 0.85).normalize();
/** The lamp brightens as the object turns into the key (the CSS key does the
    same), so the lit slopes catch and the whole object does not just dim. */
const KEY_GAIN_AT_TURN = 1.25;

/* ---- Helpers ------------------------------------------------------------- */

/** A design token as a linear-light colour with luminance one. The absolute
    level cancels in the shader's ratio; only the hue of light and shade
    matter, and they come from the page's own palette. */
function tintFromToken(name: string, fallback: Color): Vector3 {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const c = new Color();
  if (raw) {
    try {
      c.setStyle(raw);
    } catch {
      c.copy(fallback);
    }
  } else {
    c.copy(fallback);
  }
  const lum = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b || 1;
  return new Vector3(c.r / lum, c.g / lum, c.b / lum);
}

function loadTexture(loader: TextureLoader, url: string, colour: boolean, anisotropy: number) {
  return loader.loadAsync(url).then((t) => {
    /* The colour map stays sRGB-encoded on the GPU and goes up premultiplied
       (the shader decodes it); see shaders.ts for why. The maps are data. */
    t.colorSpace = NoColorSpace;
    t.premultiplyAlpha = colour;
    t.minFilter = LinearMipmapLinearFilter;
    t.magFilter = LinearFilter;
    t.anisotropy = anisotropy;
    return t;
  });
}

interface LayerMaps {
  map: Texture;
  height: Texture;
  normal: Texture;
  fields: LayerFields;
  z: number;
  relief: number;
}

/* ---- The scene ----------------------------------------------------------- */

export async function createHeroScene(canvas: HTMLCanvasElement, opts: HeroSceneOptions): Promise<HeroScene> {
  /* A software-rendered WebGL context would make this a slideshow; the CSS
     fallback is better than that, so a performance caveat is a refusal. */
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: true,
  });
  renderer.setClearColor(new Color(0, 0, 0), 0);
  renderer.autoClear = false;
  /* A shader that fails to compile draws nothing, and nothing fading in over
     the logo is the one outcome this must never produce. Record it and
     refuse to go live. */
  let shaderFailed = false;
  renderer.debug.onShaderError = (gl, _program, vs, fs) => {
    shaderFailed = true;
    console.warn(
      "hero3d: shader failed, keeping the CSS mark",
      gl.getShaderInfoLog(vs),
      gl.getShaderInfoLog(fs),
    );
  };

  const scene = new Scene();
  const camera = new PerspectiveCamera(22, 1, 0.5, 20);
  camera.position.set(0, 0, CAMERA_END);

  const group = new Group();
  scene.add(group);

  const lightTint = tintFromToken("--color-raised", new Color(1, 1, 1));
  const shadeTint = tintFromToken("--color-body", new Color(0.5, 0.5, 0.5));
  const light = LIGHT_REST.clone();
  const rot = new Matrix3();

  const geometry = new PlaneGeometry(1, ASPECT, SEGMENTS, SEGMENTS);

  const loader = new TextureLoader();
  const anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const hiDpi = (window.devicePixelRatio || 1) > 1.25;
  const textures: Texture[] = [];
  const materials: ShaderMaterial[] = [];
  const meshes: Mesh[] = [];

  let disposed = false;
  let frame = 0;
  let turn = 0;
  let dolly = 1;
  let ro: ResizeObserver | null = null;

  const onLost = () => {
    canvas.removeEventListener("webglcontextlost", onLost);
    opts.onLost();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  try {
    /* Every map first, because each object's material also needs the colour
       maps of the objects hanging in front of it, for their cast shadows. */
    const layers: LayerMaps[] = await Promise.all(
      LAYERS.map(async (layer) => {
        const colour = hiDpi ? `/brand/${layer.name}@2x.png` : `/brand/${layer.name}.png`;
        const [map, height, normal] = await Promise.all([
          loadTexture(loader, colour, true, anisotropy),
          loadTexture(loader, `/brand/depth/${layer.name}-height.png`, false, anisotropy),
          loadTexture(loader, `/brand/depth/${layer.name}-normal.png`, false, anisotropy),
        ]);
        textures.push(map, height, normal);
        const fields = buildLayerFields(map.image as HTMLImageElement, height.image as HTMLImageElement);
        textures.push(fields.cover, fields.mask, fields.height);
        return { map, height, normal, fields, z: layer.z * DEPTH_SCALE, relief: RELIEF * layer.relief };
      }),
    );

    layers.forEach((layer, i) => {
      const inFront = layers.slice(i + 1);
      const occ = (k: number) => inFront[k] ?? null;
      const material = new ShaderMaterial({
        glslVersion: GLSL3,
        vertexShader: HERO_VERTEX,
        fragmentShader: HERO_FRAGMENT,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        uniforms: {
          uMap: { value: layer.map },
          uHeight: { value: layer.height },
          uNormal: { value: layer.normal },
          uCover: { value: layer.fields.cover },
          uHeightSmooth: { value: layer.fields.height },
          uRot: { value: rot },
          uLight: { value: light },
          uLightRest: { value: LIGHT_REST },
          uLightTint: { value: lightTint },
          uShadeTint: { value: shadeTint },
          uAmbient: { value: 0.28 },
          uWrap: { value: 0.2 },
          uRelief: { value: layer.relief },
          uLow: { value: HEIGHT_LOW },
          uHigh: { value: HEIGHT_HIGH },
          uHMax: { value: HEIGHT_MAX },
          uNormalScale: { value: 1.3 },
          uShadowSoft: { value: 14.0 },
          uKeyGain: { value: 1 },
          uOccCount: { value: inFront.length },
          uOcc0: { value: occ(0)?.fields.mask ?? layer.fields.mask },
          uOcc1: { value: occ(1)?.fields.mask ?? layer.fields.mask },
          uOcc2: { value: occ(2)?.fields.mask ?? layer.fields.mask },
          uOccZ0: { value: occ(0)?.z ?? 0 },
          uOccZ1: { value: occ(1)?.z ?? 0 },
          uOccZ2: { value: occ(2)?.z ?? 0 },
          uLayerZ: { value: layer.z },
          uCast: { value: 0.5 },
        },
      });
      materials.push(material);

      const mesh = new Mesh(geometry, material);
      mesh.position.z = layer.z;
      mesh.frustumCulled = false;
      mesh.visible = false;
      mesh.renderOrder = i;
      meshes[i] = mesh;
      group.add(mesh);
    });
  } catch (err) {
    canvas.removeEventListener("webglcontextlost", onLost);
    dispose();
    throw err;
  }

  if (disposed) throw new Error("hero scene disposed while loading");

  /* ---- Rendering, on demand ------------------------------------------- */

  const fit = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    /* The mark's box is the canvas less its bleed. */
    const markCss = w / (1 + 2 * BLEED);
    const dpr = Math.min(window.devicePixelRatio || 1, 2, (TEXTURE_WIDTH * 1.15) / markCss);
    renderer.setPixelRatio(Math.max(1, dpr));
    renderer.setSize(w, h, false);
    /* At the near end of the dolly the visible width on the reference plane
       is the mark's box plus its bleed on each side; the lens follows from
       that and the camera's distance from that plane. */
    const halfW = (1 + 2 * BLEED) / 2;
    const halfH = halfW * (h / w);
    camera.aspect = w / h;
    camera.fov = (2 * Math.atan(halfH / (CAMERA_END - Z_REF)) * 180) / Math.PI;
    camera.updateProjectionMatrix();
  };

  const draw = () => {
    frame = 0;
    if (disposed) return;
    /* The dolly: the camera comes in along its own axis. On-screen size
       goes as one over distance, so the distance is the end distance over
       the size HeroStage asked for. */
    camera.position.z = CAMERA_END / dolly;
    group.rotation.set(0, turn * TURN_Y, turn * TURN_Z);
    group.updateMatrixWorld(true);
    rot.setFromMatrix4(group.matrixWorld);
    light.copy(LIGHT_REST).lerp(LIGHT_TURN, turn).normalize();
    const keyGain = 1 + (KEY_GAIN_AT_TURN - 1) * turn;
    for (const m of materials) m.uniforms.uKeyGain.value = keyGain;

    renderer.clear(true, true, false);
    for (const mesh of meshes) {
      mesh.visible = true;
      renderer.render(scene, camera);
      mesh.visible = false;
      renderer.clearDepth();
    }
  };

  const request = () => {
    if (!frame && !disposed) frame = requestAnimationFrame(draw);
  };

  ro = new ResizeObserver(() => {
    fit();
    request();
  });
  ro.observe(canvas);

  fit();
  /* The first frame is drawn before this resolves, so the caller can fade
     the canvas in over a finished picture rather than a blank one. */
  draw();
  if (shaderFailed || renderer.getContext().isContextLost()) {
    dispose();
    throw new Error("hero scene could not render");
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    ro?.disconnect();
    canvas.removeEventListener("webglcontextlost", onLost);
    for (const m of materials) m.dispose();
    for (const t of textures) t.dispose();
    geometry.dispose();
    renderer.dispose();
  }

  return {
    setPose(nextTurn: number, nextDolly: number) {
      const t = nextTurn < 0 ? 0 : nextTurn > 1 ? 1 : nextTurn;
      const d = nextDolly < 0.2 ? 0.2 : nextDolly > 1 ? 1 : nextDolly;
      if (t === turn && d === dolly) return;
      turn = t;
      dolly = d;
      request();
    },
    dispose,
  };
}
