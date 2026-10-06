import type { Group, MeshStandardMaterial, Texture, Vector3, WebGLRenderer } from "three";

/* ============================================================================
   What a set is.

   A set is the room the mark hangs in, built in the same scene as the mark so
   that the camera's move through it is the thing the eye reads as depth. It
   is NOT a backdrop: a backdrop is a picture behind a picture, and the three
   earlier versions of this hero failed on exactly that point.

   WORLD UNITS. One unit is the width of the mark. The mark hangs with its
   centre at the origin and spans x from -0.5 to 0.5 and y from about -0.5 to
   0.5; its strings run up out of frame. +X is right, +Y is up, +Z is toward
   the camera, which starts around z = 6 and comes in. The floor sits at
   FLOOR_Y and the back wall around BACK_Z, both below.

   TWO GROUPS, NOT ONE. `back` is drawn before the mark and `front` after it,
   so a set can put things in front of the lens as well as behind the subject.
   A foreground is not decoration: it is the single cheapest way to make a
   camera move read as a camera move, because a near object sweeps across the
   frame while a far one barely shifts. Every set should use `front`.

   LIGHTS GO IN `lights`, which is never hidden. Lights inside `back` would be
   switched off for the pass that draws `front`.

   NO AI IMAGERY, AND NO PHOTOGRAPHS THAT ARE NOT THE CLIENT'S. A set is built
   from geometry and from the brand's own assets. This is the site that argues
   the company does not let a machine author its work; a generated backdrop on
   its front page would be the most expensive kind of wrong.
   ========================================================================== */

/** Where the floor sits, in mark widths below the mark's centre. */
export const FLOOR_Y = -0.95;
/** Where the back wall sits, behind the mark. */
export const BACK_Z = -3.2;

export interface SetContext {
  renderer: WebGLRenderer;
  /** Add lights here. Always rendered, in every pass. */
  lights: Group;
  /** Drawn before the mark. */
  back: Group;
  /** Drawn after the mark, so it crosses in front of it. */
  front: Group;
  /** Loads a texture from /brand or /video, already colour-managed. */
  loadTexture(url: string): Promise<Texture>;
  /** Loads a PBR material's maps from a /hero3d/tex folder written by
      scripts/fetch-hero-assets.py, and returns a material wired up with them.
      Colour maps are sRGB and data maps are linear, which is the single
      easiest thing to get wrong and the reason this is not done per set. */
  loadMaterial(folder: string, opts?: { repeat?: number; roughness?: number }): Promise<MeshStandardMaterial>;
  /** Loads a glTF from /hero3d/model and returns its scene, ready to clone or
      to read a mesh out of for instancing. */
  loadModel(url: string): Promise<Group>;
  /** Lights the whole scene from a Radiance probe, which is what gives every
      metal part a real highlight shape instead of one point specular. Call it
      once; the set still owns its own key light for the shadow. */
  loadEnvironment(url: string, intensity?: number): Promise<void>;
  /** A design token read off the document, so a set uses the page's palette
      rather than inventing one. Returns the fallback if the token is unset. */
  token(name: string, fallback: string): string;
}

export interface HeroSet {
  /** The key the mark is relit toward, in world space, and its gain. Leave
      undefined to show the artwork exactly as photographed. */
  key?: { dir: Vector3; gain: number };
  /** Called once a frame with eased progress, 0 at rest and 1 at the end of
      the move, before the frame is drawn. Move set pieces here if they need
      to do anything beyond being passed by the camera. Most should not: the
      camera is what is moving, and a set that also animates stops being a
      place and becomes an effect. */
  update?(p: number): void;
  dispose(): void;
}

export type SetFactory = (ctx: SetContext) => Promise<HeroSet> | HeroSet;
