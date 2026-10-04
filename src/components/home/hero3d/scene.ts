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

   SCALE. One unit is the width of the mark's square. A layer that hangs
   nearer the reader is scaled down by exactly the amount the perspective
   would enlarge it, so at rest all four project onto the same square and the
   canvas coincides with the CSS fallback underneath it. The parallax comes
   from the turn alone, which is where it belongs.
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

export interface HeroScene {
  /** 0 at rest, 1 at full turn. Eased already by HeroStage. */
  setTurn(turn: number): void;
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
  { name: "mark-c", z: 0 },
  { name: "mark-e", z: 10 },
  { name: "mark-l", z: 26 },
  { name: "mark-word", z: 48 },
] as const;

/** The mark's box is 591 by 592. */
const ASPECT = 592 / 591;
/** The CSS stage has perspective 1500px on a mark capped at 400px wide. */
const CAMERA_DISTANCE = 1500 / 400;
/** The canvas bleeds 15% past the mark's box on every side (see index.css). */
const BLEED = 0.15;
/** Full turn, in radians: 14 degrees, right edge going away from the reader
    (a positive rotation about Y, the same sign as CSS rotateY). */
const TURN_Y = (14 * Math.PI) / 180;
/** CSS rotateZ(-1.6deg) is anticlockwise on screen; three.js, with Y up,
    gets there with a positive angle. */
const TURN_Z = (1.6 * Math.PI) / 180;

/** How far the highest point of the wool stands off the wall, in mark widths. */
const RELIEF = 0.11;
/** The height that sits on the layer's own plane. */
const RELIEF_MID = 0.45;
/** Segments a side. One geometry is shared by the four layers; 360 squared
    is 130k vertices, about three texels a quad, fine enough that the walls
    at a silhouette do not facet. */
const SEGMENTS = 360;

/* ---- The lamp ------------------------------------------------------------ */

/** Up and to the left, a little in front, matching .hero-key. */
const LIGHT_REST = new Vector3(-0.55, 0.78, 1.0).normalize();
/** Where it has swung to at full turn: further left and lower, raking across
    the wool so the fibres and the hollows show. */
const LIGHT_TURN = new Vector3(-1.15, 0.62, 0.52).normalize();

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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(new Color(0, 0, 0), 0);
  renderer.autoClear = false;
  /* A shader that fails to compile draws nothing, and nothing fading in over
     the logo is the one outcome this must never produce. Record it and
     refuse to go live. */
  let shaderFailed = false;
  renderer.debug.onShaderError = () => {
    shaderFailed = true;
  };

  const scene = new Scene();
  const camera = new PerspectiveCamera(20, 1, 0.5, 10);
  camera.position.set(0, 0, CAMERA_DISTANCE);
  camera.lookAt(0, 0, 0);

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
  let ro: ResizeObserver | null = null;

  const onLost = () => {
    canvas.removeEventListener("webglcontextlost", onLost);
    opts.onLost();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  try {
    await Promise.all(
      LAYERS.map(async (layer, i) => {
        const colour = hiDpi ? `/brand/${layer.name}@2x.png` : `/brand/${layer.name}.png`;
        const [map, height, normal] = await Promise.all([
          loadTexture(loader, colour, true, anisotropy),
          loadTexture(loader, `/brand/depth/${layer.name}-height.png`, false, anisotropy),
          loadTexture(loader, `/brand/depth/${layer.name}-normal.png`, false, anisotropy),
        ]);
        textures.push(map, height, normal);

        const material = new ShaderMaterial({
          glslVersion: GLSL3,
          vertexShader: HERO_VERTEX,
          fragmentShader: HERO_FRAGMENT,
          transparent: true,
          depthTest: true,
          depthWrite: true,
          uniforms: {
            uMap: { value: map },
            uHeight: { value: height },
            uNormal: { value: normal },
            uRot: { value: rot },
            uLight: { value: light },
            uLightRest: { value: LIGHT_REST },
            uLightTint: { value: lightTint },
            uShadeTint: { value: shadeTint },
            uAmbient: { value: 0.36 },
            uWrap: { value: 0.3 },
            uRelief: { value: RELIEF },
            uMid: { value: RELIEF_MID },
            uNormalScale: { value: 1.2 },
            uShadowSoft: { value: 9.0 },
          },
        });
        materials.push(material);

        const mesh = new Mesh(geometry, material);
        const z = layer.z / 400;
        mesh.position.z = z;
        /* Nearer, so smaller, so that at rest it projects onto the same
           square as the layer behind it. */
        mesh.scale.setScalar((CAMERA_DISTANCE - z) / CAMERA_DISTANCE);
        mesh.frustumCulled = false;
        mesh.visible = false;
        mesh.renderOrder = i;
        meshes[i] = mesh;
        group.add(mesh);
      }),
    );
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
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    /* The visible height at the mark's plane is the box plus its bleed. */
    const visible = ASPECT * (1 + 2 * BLEED);
    camera.fov = (2 * Math.atan(visible / 2 / CAMERA_DISTANCE) * 180) / Math.PI;
    camera.updateProjectionMatrix();
  };

  const draw = () => {
    frame = 0;
    if (disposed) return;
    group.rotation.set(0, turn * TURN_Y, turn * TURN_Z);
    group.updateMatrixWorld(true);
    rot.setFromMatrix4(group.matrixWorld);
    light.copy(LIGHT_REST).lerp(LIGHT_TURN, turn).normalize();

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
    setTurn(next: number) {
      const t = next < 0 ? 0 : next > 1 ? 1 : next;
      if (t === turn) return;
      turn = t;
      request();
    },
    dispose,
  };
}
