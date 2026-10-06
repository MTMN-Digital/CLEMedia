/* ============================================================================
   The stage: one WebGL scene holding the mark AND the room it is in, with the
   scroll driving a camera through that room.

   WHY THIS EXISTS. The earlier hero drew the mark on a small canvas and
   painted the room behind it in CSS. Moving the camera then changed the size
   of the mark and nothing else, which the eye reads as a picture being
   enlarged, not as a camera travelling: the single reason that hero was
   rejected over and over. Here the floor, the wall, the lamps and whatever
   crosses the lens are objects at real depths in the same scene, so the near
   ones sweep across the frame while the far ones barely shift. That
   difference in rates IS the depth. Nothing else produces it.

   THE MOVE. A push-in, and only a push-in. The camera travels along its own
   axis toward a subject that never rotates and never moves, and it keeps its
   axis horizontal the whole way, so verticals stay vertical the way they do
   in a shot off a dolly rather than off a phone. It also drops a little as it
   comes in, which raises the mark in the frame and opens the floor beneath it
   for the headline to stand on. No pan, no tilt, no roll, no rotation of the
   subject: all of those were tried and all of them read as a logo doing a
   trick.

   RENDER ORDER, and why it is six passes rather than one. The mark is four
   cut layers that must keep their painted order however deep the relief on
   any of them goes, so each is drawn into a freshly cleared depth buffer. The
   set is drawn around them: everything behind the mark first, into a depth
   buffer the mark then ignores, and everything in front of the mark last,
   into a buffer that still holds the mark's own depth so a near leaf can
   genuinely cross it. Passes are selected with camera layers rather than by
   hiding meshes, because a hidden mesh casts no shadow and the mark's shadow
   on the floor is most of what makes it look like it is really there.
   ========================================================================== */

import {
  ACESFilmicToneMapping,
  EquirectangularReflectionMapping,
  Group,
  LinearSRGBColorSpace,
  MeshStandardMaterial,
  PMREMGenerator,
  RepeatWrapping,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
  type Texture,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { createHeroMark, MARK_LAYER_COUNT, MARK_LAYER_FIRST, MARK_LIGHT_REST, MARK_TEXTURE_WIDTH } from "./mark";
import type { HeroSet, SetContext, SetFactory } from "./sets/types";

/** Camera layer for everything behind the mark. */
const LAYER_BACK = 1;
/** Camera layer for everything in front of it, after the four mark passes. */
const LAYER_FRONT = MARK_LAYER_FIRST + MARK_LAYER_COUNT;

/** Vertical field of view. Wide enough that pushing in visibly changes the
    perspective (a long lens would flatten the move back into a zoom), narrow
    enough that the mark does not distort at the edges of a wide screen. */
const FOV = 34;

/** Where the camera starts and ends, in mark widths from the mark's plane.
    The ratio is the size change: 1.42 is enough that the subject grows
    convincingly without having to leave the frame to make room for the
    words, and the real sense of travel comes from the set, not from this. */
const CAM_Z_REST = 3.2;
const CAM_Z_END = 2.4;

/** How far the camera drops across the move, in mark widths. The axis stays
    horizontal, so this does not tilt the shot: it raises the mark in the
    frame and opens the band the headline lands in. It has to be this large.
    At 0.32 the mark finished with its wordmark across the middle of the
    frame and "Watch. Play. Learn." landed on top of "FAMILY MEDIA", which is
    unreadable and was the one fault every one of the three sets shared. */
const CAM_DROP = 0.5;
/** The camera's height at rest, which decides where the mark sits in the
    frame before anything has happened. Slightly above the mark's centre so
    the resting frame has more floor under the object than air over it. */
const CAM_Y_REST = 0.08;

export interface HeroStage {
  /** Eased progress, 0 at rest and 1 at the end of the move. */
  setProgress(p: number): void;
  dispose(): void;
}

export interface HeroStageOptions {
  set: SetFactory;
  /** The browser took the context away; the caller falls back to CSS. */
  onLost: () => void;
}

export async function createHeroStage(
  canvas: HTMLCanvasElement,
  opts: HeroStageOptions,
): Promise<HeroStage> {
  /* A software-rendered context would make this a slideshow, and the flat
     mark is better than a slideshow, so a performance caveat is a refusal. */
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  /* Six render calls a frame would otherwise rebuild the shadow map six
     times. It is rebuilt once, by hand, at the top of each frame. */
  renderer.shadowMap.autoUpdate = false;
  /* Filmic, because the set is lit by a real light probe whose highlights run
     well past white and clipping them turns every metal edge into a flat
     blown patch. The mark is untouched by this: it draws through its own
     GLSL3 shader, which three does not inject a tone mapping chunk into, so
     the artwork still leaves the canvas exactly as it was photographed. */
  renderer.toneMapping = ACESFilmicToneMapping;
  /* Under one, deliberately. The probe plus the key put more light into this
     scene than the warm paper palette can take at unity: the sweep went to
     white and the cream lost its temperature entirely, which is the opposite
     of the house surface. */
  renderer.toneMappingExposure = 0.79;

  let shaderFailed = false;
  renderer.debug.onShaderError = (gl, _program, vs, fs) => {
    shaderFailed = true;
    console.warn("hero3d: shader failed", gl.getShaderInfoLog(vs), gl.getShaderInfoLog(fs));
  };

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 60);
  /* Every pass is one layer, and the default membership of layer 0 would
     make the camera draw everything in all of them. */
  camera.layers.disableAll();

  const lights = new Group();
  const back = new Group();
  const front = new Group();
  back.layers.set(LAYER_BACK);
  front.layers.set(LAYER_FRONT);
  scene.add(lights, back, front);

  const loader = new TextureLoader();
  const textures: Texture[] = [];
  const materials: MeshStandardMaterial[] = [];
  let envTarget: { texture: Texture; dispose(): void } | null = null;

  let disposed = false;
  let frame = 0;
  let progress = 0;
  let ro: ResizeObserver | null = null;
  let heroSet: HeroSet | null = null;

  const onLost = () => {
    canvas.removeEventListener("webglcontextlost", onLost);
    opts.onLost();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  const ctx: SetContext = {
    renderer,
    lights,
    back,
    front,
    async loadTexture(url) {
      const t = await loader.loadAsync(url);
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      textures.push(t);
      return t;
    },
    async loadMaterial(folder, opts = {}) {
      const base = `/hero3d/tex/${folder}`;
      const [map, normalMap, roughnessMap, aoMap] = await Promise.all([
        loader.loadAsync(`${base}/Diffuse.webp`),
        loader.loadAsync(`${base}/nor_gl.webp`),
        loader.loadAsync(`${base}/Rough.webp`),
        loader.loadAsync(`${base}/AO.webp`),
      ]);
      /* The colour map is the only one of the four that is a colour. The other
         three are measurements, and decoding them through sRGB is the classic
         way to end up with a surface that is too rough and too bumpy in the
         shadows and flat everywhere else. */
      map.colorSpace = SRGBColorSpace;
      for (const t of [normalMap, roughnessMap, aoMap]) t.colorSpace = LinearSRGBColorSpace;
      const anis = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      for (const t of [map, normalMap, roughnessMap, aoMap]) {
        t.wrapS = t.wrapT = RepeatWrapping;
        t.anisotropy = anis;
        if (opts.repeat) t.repeat.set(opts.repeat, opts.repeat);
        textures.push(t);
      }
      const m = new MeshStandardMaterial({
        map,
        normalMap,
        roughnessMap,
        aoMap,
        roughness: opts.roughness ?? 1,
        metalness: 0,
      });
      materials.push(m);
      return m;
    },
    async loadModel(url) {
      const gltf = await new GLTFLoader().loadAsync(url);
      return gltf.scene;
    },
    async loadEnvironment(url, intensity = 1) {
      const hdr = await new RGBELoader().loadAsync(url);
      hdr.mapping = EquirectangularReflectionMapping;
      const pmrem = new PMREMGenerator(renderer);
      const target = pmrem.fromEquirectangular(hdr);
      scene.environment = target.texture;
      scene.environmentIntensity = intensity;
      envTarget = target;
      pmrem.dispose();
      hdr.dispose();
    },
    token(name, fallback) {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return raw || fallback;
    },
  };

  const mark = await createHeroMark(renderer);
  scene.add(mark.group);
  mark.syncRotation();

  try {
    heroSet = await opts.set(ctx);
  } catch (err) {
    dispose();
    throw err;
  }
  if (disposed) throw new Error("hero stage disposed while loading");

  /* Every descendant of a group inherits nothing of its layer, so the layer
     has to be stamped on each object once the set has finished adding to it. */
  const stampLayer = (root: Group, layer: number) => {
    root.traverse((o) => o.layers.set(layer));
  };
  stampLayer(back, LAYER_BACK);
  stampLayer(front, LAYER_FRONT);
  /* Lights are in no pass and every pass: they are not drawn, they light
     whatever is, so they belong to all layers. A shadow camera needs the
     same treatment for a different reason: it only maps objects on its own
     layers, and the mark's meshes live on the layers their passes use, so a
     shadow camera left on the default layer would map the room and leave
     the mark's own shadow off the floor. */
  lights.traverse((o) => {
    o.layers.enableAll();
    const shadow = (o as { shadow?: { camera?: { layers: { enableAll(): void } } } }).shadow;
    shadow?.camera?.layers.enableAll();
  });

  const key = heroSet.key?.dir ?? MARK_LIGHT_REST;
  mark.setKey(key, heroSet.key?.gain ?? 1);

  const fit = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    /* The mark is about one unit tall and fills roughly half the frame
       height, so this is its size on screen in CSS pixels. Past the width of
       its colour map there is no more wool to show, only more fragments to
       shade, so the drawing buffer is capped there. */
    const markCss = h * 0.55;
    const dpr = Math.min(window.devicePixelRatio || 1, 2, (MARK_TEXTURE_WIDTH * 1.15) / markCss);
    renderer.setPixelRatio(Math.max(1, dpr));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const draw = () => {
    frame = 0;
    if (disposed) return;
    const p = progress;

    camera.position.set(0, CAM_Y_REST - CAM_DROP * p, CAM_Z_REST + (CAM_Z_END - CAM_Z_REST) * p);
    /* No lookAt. The axis stays down -Z for the whole move, which is what
       keeps the verticals parallel and the move reading as a dolly. */
    camera.quaternion.identity();
    camera.updateMatrixWorld(true);

    heroSet?.update?.(p);

    renderer.shadowMap.needsUpdate = true;
    renderer.clear(true, true, false);

    camera.layers.set(LAYER_BACK);
    renderer.render(scene, camera);

    renderer.clearDepth();
    for (let i = 0; i < MARK_LAYER_COUNT; i++) {
      camera.layers.set(MARK_LAYER_FIRST + i);
      renderer.render(scene, camera);
      renderer.clearDepth();
    }

    /* The front pass starts on a cleared buffer and sorts only against
       itself, which is correct because everything in `front` is by
       definition nearer than the mark. A set piece that passes behind the
       mark anywhere along its length belongs in `back`, not here. */
    camera.layers.set(LAYER_FRONT);
    renderer.render(scene, camera);
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
  draw();
  if (shaderFailed || renderer.getContext().isContextLost()) {
    dispose();
    throw new Error("hero stage could not render");
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    ro?.disconnect();
    canvas.removeEventListener("webglcontextlost", onLost);
    heroSet?.dispose();
    mark?.dispose();
    for (const m of materials) m.dispose();
    for (const t of textures) t.dispose();
    envTarget?.dispose();
    scene.environment = null;
    renderer.dispose();
  }

  return {
    setProgress(next: number) {
      const p = next < 0 ? 0 : next > 1 ? 1 : next;
      if (p === progress) return;
      progress = p;
      request();
    },
    dispose,
  };
}
