/* ============================================================================
   The relief shader for the felted mark.

   WHAT IT DOES. Each of the four objects is a finely subdivided plane. The
   vertex stage pushes every vertex toward the reader by the height map, so
   the lion's mane really is nearer than the wall behind it and the right side
   of a felt ball really does fall away. The fragment stage then lights that
   surface with the normal map and a lamp up and to the left, darkens the
   hollows the lamp cannot see into by walking the height map toward it,
   darkens cavities that see less of the room, and drops the shadow of each
   object onto the objects hanging behind it.

   WHY THE LIGHTING IS A RATIO. The colour texture is a photographic render,
   so it already carries one lighting: the lighting the object had when it was
   photographed, square on. Lighting it again on top would double the shade
   and the mark would stop being the logo the client knows. Instead the shader
   computes the shade twice, once for the object as it was photographed (at
   rest, the lamp where it was) and once for the object as it is now (turned,
   lamp where it has swung to), and multiplies the texture by the ratio. At
   rest the two are identical and the ratio is exactly one: the texture is
   shown untouched, pixel for pixel. As the group turns, only the CHANGE in
   light is painted on, which is what the eye sees happen to a real object.

   THE MAPS AS THEY ARE. The height maps are a plateau (about 0.6 of range)
   with a short rounded shoulder and then a cliff to zero exactly at the
   alpha edge. Displacing that literally puts a vertical wall at every
   silhouette, and a wall is one edge texel stretched across the screen. So
   the relief is a pillow instead: the silhouette stays on the layer's own
   plane and the surface rises toward the interior over a wide ramp taken
   from a blurred copy of the alpha. There is no cliff anywhere, a thin thing
   (a string, a leg, an antenna) never gets wide enough for the ramp to
   reach one and so stays flat, and the plateau's own variation (mane against
   face, segment against segment) is stretched out to become the real relief.
   The camera is orthographic, so at rest none of this moves a pixel.

   CONVENTIONS. The planes face +Z with +Y up, and the normal maps are OpenGL
   convention (+Y up), so tangent space is object space and the decoded normal
   is used as is. Lighting is done in object space by rotating the lamp the
   other way, which is cheaper than rotating every normal.
   ========================================================================== */

export const HERO_VERTEX = /* glsl */ `
uniform sampler2D uCover;        /* wide blur of the alpha, see fields.ts */
uniform sampler2D uHeightSmooth; /* smoothed height, see fields.ts */
uniform float uRelief;
uniform float uLow;      /* map height that sits on the plane */
uniform float uHigh;     /* map height that reaches the full relief */

out vec2 vUv;
out float vZ;

void main() {
  vUv = uv;
  /* The pillow: the wide blur of the alpha is near one deep inside an
     object, about half at its edge, and never gets high on a thin feature. */
  float wide = textureLod(uCover, uv, 0.0).r;
  float cover = smoothstep(0.35, 0.9, wide);
  /* The plateau's narrow band is stretched to the full range here. */
  float h = textureLod(uHeightSmooth, uv, 0.0).r;
  float relief = smoothstep(uLow, uHigh, h);
  vZ = relief * uRelief * cover;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, position.z + vZ, 1.0);
}
`;

export const HERO_FRAGMENT = /* glsl */ `
precision highp float;

uniform sampler2D uMap;
uniform sampler2D uHeight;
uniform sampler2D uNormal;
uniform mat3 uRot;          /* object to world, the group's current turn */
uniform vec3 uLight;        /* world space, unit length, where the lamp is now */
uniform vec3 uLightRest;    /* world space, unit length, where it was at rest */
uniform vec3 uLightTint;    /* colour of the lamp, luminance one */
uniform vec3 uShadeTint;    /* colour the wool falls into, luminance one */
uniform float uAmbient;
uniform float uWrap;
uniform float uRelief;
uniform float uNormalScale;
uniform float uShadowSoft;
uniform float uHMax;        /* nothing in the maps is higher than this */
uniform float uLow;         /* map height that sits on the plane */
uniform float uHigh;        /* map height that reaches the full relief */
uniform float uKeyGain;     /* the lamp, brighter as the object turns into it */
/* The objects hanging in front of this one, nearest last: their blurred
   silhouettes (fields.ts) and the planes they hang on. */
uniform int uOccCount;
uniform sampler2D uOcc0;
uniform sampler2D uOcc1;
uniform sampler2D uOcc2;
uniform float uOccZ0;
uniform float uOccZ1;
uniform float uOccZ2;
uniform float uLayerZ;      /* this object's own plane */
uniform float uCast;        /* how dark a cast shadow goes */

in vec2 vUv;
in float vZ;
layout(location = 0) out vec4 fragColor;

/* The colour map is uploaded premultiplied and left sRGB-encoded, so the
   GPU filters it exactly the way the browser filters the <img> underneath:
   no dark bleed from the transparent pixels into the edges. It is
   un-premultiplied and decoded here, lit in linear, and encoded back. */
vec3 decodeSRGB(vec3 c) {
  vec3 lo = c / 12.92;
  vec3 hi = pow((c + 0.055) / 1.055, vec3(2.4));
  return mix(lo, hi, step(vec3(0.04045), c));
}
vec3 encodeSRGB(vec3 c) {
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), c));
}

/* Height, masked by the object's own alpha so nothing outside the
   silhouette can ever throw a shadow onto it. */
float heightAt(vec2 uv) {
  float a = texture(uMap, uv).a;
  return texture(uHeight, uv).r * smoothstep(0.0, 0.6, a);
}

/* How much of the lamp this point can see, by walking up the height field
   toward it. L is in tangent (object) space. */
float selfShadow(vec2 uv, float h0, vec3 L) {
  if (L.z < 0.12) return 1.0;
  /* uv travelled per unit of map height along the ray to the lamp: the map's
     narrow band is stretched to the full relief by the vertex stage. */
  vec2 duvPerH = (L.xy / L.z) * uRelief / (uHigh - uLow);
  float range = max(uHMax - h0, 0.0);
  float pen = 0.0;
  const int STEPS = 16;
  for (int k = 1; k <= STEPS; k++) {
    float t = float(k) / float(STEPS);
    float hn = h0 + range * t;
    vec2 p = uv + duvPerH * (hn - h0);
    float hs = heightAt(p);
    pen = max(pen, (hs - hn) * (1.0 - t));
  }
  return 1.0 - clamp(pen * uShadowSoft, 0.0, 1.0);
}

/* The shadow one object in front drops onto this one: where the ray to the
   lamp crosses that object's plane, is there wool? The silhouette is read
   from its pre-blurred mask, so the shadow has a soft rim. */
float castFrom(sampler2D occ, float zOcc, vec3 L, float zHere, vec2 uv) {
  /* The occluder's wool stands about half the relief off its own plane. */
  float gap = zOcc + uRelief * 0.5 - zHere;
  if (gap <= 0.0 || L.z < 0.1) return 1.0;
  vec2 p = uv + (L.xy / L.z) * gap;
  if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) return 1.0;
  float a = textureLod(occ, p, 0.0).r;
  return 1.0 - uCast * smoothstep(0.15, 0.75, a);
}
float castShadow(vec3 L, float zHere, vec2 uv) {
  float v = 1.0;
  if (uOccCount > 0) v *= castFrom(uOcc0, uOccZ0, L, zHere, uv);
  if (uOccCount > 1) v *= castFrom(uOcc1, uOccZ1, L, zHere, uv);
  if (uOccCount > 2) v *= castFrom(uOcc2, uOccZ2, L, zHere, uv);
  return v;
}

/* How much of the room a point can see: a hollow between two raised parts
   sees less, so it gets less of the ambient fill and answers the lamp alone. */
float cavity(vec2 uv, float h0) {
  const float r = 0.012;
  const float d = 0.0085;
  float occ = 0.0;
  occ += max(heightAt(uv + vec2( r, 0.0)) - h0, 0.0);
  occ += max(heightAt(uv + vec2(-r, 0.0)) - h0, 0.0);
  occ += max(heightAt(uv + vec2(0.0,  r)) - h0, 0.0);
  occ += max(heightAt(uv + vec2(0.0, -r)) - h0, 0.0);
  occ += max(heightAt(uv + vec2( d,  d)) - h0, 0.0);
  occ += max(heightAt(uv + vec2(-d,  d)) - h0, 0.0);
  occ += max(heightAt(uv + vec2( d, -d)) - h0, 0.0);
  occ += max(heightAt(uv + vec2(-d, -d)) - h0, 0.0);
  return 1.0 - clamp(occ * 0.125 * 3.0, 0.0, 1.0);
}

/* Wrapped Lambert: felt scatters light into its own fibres, so the terminator
   is soft, never a hard line. */
float shade(vec3 N, vec3 L, float visibility, float ao, float key) {
  float d = clamp((dot(N, L) + uWrap) / (1.0 + uWrap), 0.0, 1.0);
  return uAmbient * ao + (1.0 - uAmbient) * key * d * visibility;
}

void main() {
  vec4 tex = texture(uMap, vUv);
  if (tex.a < 0.01) discard;
  float h0 = texture(uHeight, vUv).r;

  vec3 albedo = decodeSRGB(tex.rgb / tex.a);

  vec3 n = texture(uNormal, vUv).xyz * 2.0 - 1.0;
  n.xy *= uNormalScale;
  vec3 N = normalize(n);

  /* The lamp, brought into the object's own frame. At rest the rotation is
     the identity and the two directions coincide. */
  vec3 Lrest = uLightRest;
  vec3 Lnow = transpose(uRot) * uLight;

  float zHere = uLayerZ + vZ;
  float ao = cavity(vUv, h0);

  float visRest = selfShadow(vUv, h0, Lrest) * castShadow(Lrest, zHere, vUv);
  float visNow = selfShadow(vUv, h0, Lnow) * castShadow(Lnow, zHere, vUv);

  float sRest = shade(N, Lrest, visRest, ao, 1.0);
  float sNow = shade(N, Lnow, visNow, ao, uKeyGain);

  /* Warm where the lamp reaches, toward the body colour where it does not. */
  vec3 cRest = mix(uShadeTint, uLightTint, sRest) * sRest;
  vec3 cNow = mix(uShadeTint, uLightTint, sNow) * sNow;

  vec3 ratio = clamp(cNow / max(cRest, vec3(0.06)), vec3(0.3), vec3(2.0));

  fragColor = vec4(encodeSRGB(albedo * ratio), tex.a);
}
`;
