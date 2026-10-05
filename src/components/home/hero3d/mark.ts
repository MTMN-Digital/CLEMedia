/* ============================================================================
   The mark, as four relief surfaces, pulled out of the old scene module so
   that more than one stage can hang it.

   It is the same object it always was: the four cut layers, each a finely
   subdivided plane displaced by its own height map and lit by the relief
   shader, hung at four depths so they pass each other as the camera moves.
   What has changed is what surrounds it. The old module owned the renderer,
   the camera and the whole picture, and the room the mark stood in was CSS
   behind the canvas. A room behind the canvas cannot move with the camera,
   which is why every version of that hero read as a picture being enlarged
   rather than a camera travelling. This module now builds the object and
   nothing else, and stage.ts puts it in a room built in the same scene.

   LAYERS AND CAMERA LAYERS. Each mark layer is rendered in its own pass into
   a freshly cleared depth buffer, so the four keep their painted order no
   matter how deep the relief on any one of them goes. The pass is selected
   with a three.js camera layer rather than by toggling `visible`, because a
   hidden mesh casts no shadow: the mark has to be in the shadow map for the
   whole frame while still being drawn one layer at a time.
   ========================================================================== */

import {
  Color,
  GLSL3,
  Group,
  LinearFilter,
  LinearMipmapLinearFilter,
  Matrix3,
  Mesh,
  MeshDepthMaterial,
  NoColorSpace,
  PlaneGeometry,
  RGBADepthPacking,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector3,
  type WebGLRenderer,
} from "three";
import { HERO_FRAGMENT, HERO_VERTEX } from "./shaders";
import { buildLayerFields } from "./fields";

/** The four cut layers, back to front, with their depths in px of the CSS
    perspective space the layered mark uses, over its 400px cap. */
const LAYERS = [
  { name: "mark-c", z: 0, relief: 1 },
  { name: "mark-e", z: 10, relief: 1 },
  { name: "mark-l", z: 26, relief: 1 },
  /* The lettering is flatter felt than the animals, and its strokes are
     narrow enough that the full relief folds their right sides. */
  { name: "mark-word", z: 48, relief: 0.6 },
] as const;

/** The mark's box is 591 by 592, so one unit wide is all but one unit tall. */
export const MARK_ASPECT = 592 / 591;
/** The first camera layer a mark pass uses. Layer 1 is the set behind, and
    the layer after the last mark pass is the set in front. */
export const MARK_LAYER_FIRST = 2;
export const MARK_LAYER_COUNT = LAYERS.length;

/** CSS depths are px over the mark's 400px cap, opened up so the objects
    visibly pass each other as the camera comes in. */
const DEPTH_SCALE = 1.6 / 400;
/** How far the top of the wool stands off its plane, in mark widths. Found
    by looking: at 0.2 the plateau slid sideways across a caterpillar segment
    and the shoulders smeared; 0.1 reads as a rounded limb. */
const RELIEF = 0.1;
/** The maps are a plateau between about 0.55 and 0.68 with a rounded
    shoulder to 0.3 at the edge; that band becomes the relief. */
const HEIGHT_LOW = 0.45;
const HEIGHT_HIGH = 0.75;
const HEIGHT_MAX = 0.78;
/** Segments a side: 360 squared is about three texels a quad, fine enough
    that a silhouette does not facet. */
const SEGMENTS = 360;
/** Width of the colour maps in texels, used to cap the drawing buffer. */
export const MARK_TEXTURE_WIDTH = 1182;

/** The lamp as the artwork was photographed: up and to the left, a little in
    front. The shader lights the mark as a RATIO between this and whatever
    the stage's key is, so a stage that does not move its key shows the
    artwork pixel for pixel. */
export const MARK_LIGHT_REST = new Vector3(-0.55, 0.78, 1.0).normalize();

export interface HeroMarkObject {
  /** Hang this in the scene. The mark spans x -0.5 to 0.5 about its origin. */
  group: Group;
  /** Relight the mark toward a stage key. `gain` above one brightens the lit
      slopes, so an object turning into a lamp does not merely dim. */
  setKey(dir: Vector3, gain: number): void;
  /** Called by the stage after it has moved the group, so the shader knows
      which way the object is facing. */
  syncRotation(): void;
  dispose(): void;
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

export async function createHeroMark(renderer: WebGLRenderer): Promise<HeroMarkObject> {
  const loader = new TextureLoader();
  const anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const hiDpi = (window.devicePixelRatio || 1) > 1.25;
  const geometry = new PlaneGeometry(1, MARK_ASPECT, SEGMENTS, SEGMENTS);
  const textures: Texture[] = [];
  const materials: ShaderMaterial[] = [];
  const depthMaterials: MeshDepthMaterial[] = [];
  const group = new Group();

  const lightTint = tintFromToken("--color-raised", new Color(1, 1, 1));
  const shadeTint = tintFromToken("--color-body", new Color(0.5, 0.5, 0.5));
  const key = MARK_LIGHT_REST.clone();
  const rot = new Matrix3();

  /* Every map first, because each object's material also needs the colour
     maps of the objects hanging in front of it, for their cast shadows. */
  const loaded = await Promise.all(
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

  loaded.forEach((layer, i) => {
    const inFront = loaded.slice(i + 1);
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
        uLight: { value: key },
        uLightRest: { value: MARK_LIGHT_REST },
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
    mesh.renderOrder = i;
    /* One camera layer per pass, so the stage can draw them one at a time
       into a cleared depth buffer without hiding them from the shadow map. */
    mesh.layers.set(MARK_LAYER_FIRST + i);
    /* The felt is opaque where it is opaque, so the shadow it throws is its
       own silhouette. alphaTest on the depth material cuts the holes. */
    mesh.castShadow = true;
    const depth = new MeshDepthMaterial({
      depthPacking: RGBADepthPacking,
      map: layer.map,
      alphaTest: 0.5,
    });
    depthMaterials.push(depth);
    mesh.customDepthMaterial = depth;
    group.add(mesh);
  });

  return {
    group,
    setKey(dir, gain) {
      key.copy(dir).normalize();
      for (const m of materials) m.uniforms.uKeyGain.value = gain;
    },
    syncRotation() {
      group.updateMatrixWorld(true);
      rot.setFromMatrix4(group.matrixWorld);
    },
    dispose() {
      for (const m of materials) m.dispose();
      for (const m of depthMaterials) m.dispose();
      for (const t of textures) t.dispose();
      geometry.dispose();
    },
  };
}
