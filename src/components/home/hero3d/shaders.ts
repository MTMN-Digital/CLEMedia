/* ============================================================================
   The relief shader for the felted mark.

   WHAT IT DOES. Each of the four objects is a finely subdivided plane. The
   vertex stage pushes every vertex toward the reader by the height map, so
   the lion's mane really is nearer than the wall behind it and the right side
   of a felt ball really does fall away. The fragment stage then lights that
   surface with the normal map and a lamp up and to the left, and darkens the
   hollows the lamp cannot see into by walking the height map toward the light.

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

   CONVENTIONS. The planes face +Z with +Y up, and the normal maps are OpenGL
   convention (+Y up), so tangent space is object space and the decoded normal
   is used as is. Lighting is done in object space by rotating the lamp the
   other way, which is cheaper than rotating every normal.
   ========================================================================== */

export const HERO_VERTEX = /* glsl */ `
uniform sampler2D uMap;
uniform sampler2D uHeight;
uniform float uRelief;
uniform float uMid;

out vec2 vUv;

void main() {
  vUv = uv;
  /* A coarser mip for the geometry: the mesh has a few hundred segments a
     side, so sampling the full map would alias the surface into noise. */
  float a = textureLod(uMap, uv, 2.0).a;
  float h = textureLod(uHeight, uv, 2.0).r;
  /* Nothing is pushed where there is no object: the maps carry a little
     noise outside the silhouette and that must stay flat and invisible. The
     ramp sits inside the opaque band, so the wall the relief makes at a
     silhouette is faced with the object's own colour and the feathered
     fringe stays flat on the wall behind it. */
  float cover = smoothstep(0.45, 0.95, a);
  /* Centred on the layer's own plane so the layer keeps its footprint at
     rest: half the relief comes forward, half goes back. */
  float z = (h - uMid) * uRelief * cover;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, position.z + z, 1.0);
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

in vec2 vUv;
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

/* Height, masked by the object's own alpha so the noise outside the
   silhouette can never throw a shadow onto it. */
float heightAt(vec2 uv) {
  float a = texture(uMap, uv).a;
  return texture(uHeight, uv).r * smoothstep(0.0, 0.6, a);
}

/* How much of the lamp this point can see, by walking up the height field
   toward it. L is in tangent (object) space. */
float selfShadow(vec2 uv, float h0, vec3 L) {
  if (L.z < 0.15) return 1.0;
  /* uv travelled per unit of normalised height along the ray to the lamp. */
  vec2 duvPerH = (L.xy / L.z) * uRelief;
  float range = 1.0 - h0;
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

/* Wrapped Lambert: felt scatters light into its own fibres, so the terminator
   is soft, never a hard line. */
float shade(vec3 N, vec3 L, float visibility) {
  float d = clamp((dot(N, L) + uWrap) / (1.0 + uWrap), 0.0, 1.0);
  return uAmbient + (1.0 - uAmbient) * d * visibility;
}

void main() {
  vec4 tex = texture(uMap, vUv);
  if (tex.a < 0.01) discard;
  vec3 albedo = decodeSRGB(tex.rgb / tex.a);

  vec3 n = texture(uNormal, vUv).xyz * 2.0 - 1.0;
  n.xy *= uNormalScale;
  vec3 N = normalize(n);

  float h0 = texture(uHeight, vUv).r;

  /* The lamp, brought into the object's own frame. At rest the rotation is
     the identity and the two directions coincide. */
  vec3 Lrest = uLightRest;
  vec3 Lnow = transpose(uRot) * uLight;

  float sRest = shade(N, Lrest, selfShadow(vUv, h0, Lrest));
  float sNow = shade(N, Lnow, selfShadow(vUv, h0, Lnow));

  /* Warm where the lamp reaches, toward the body colour where it does not. */
  vec3 cRest = mix(uShadeTint, uLightTint, sRest) * sRest;
  vec3 cNow = mix(uShadeTint, uLightTint, sNow) * sNow;

  vec3 ratio = clamp(cNow / max(cRest, vec3(0.08)), vec3(0.4), vec3(1.8));

  fragColor = vec4(encodeSRGB(albedo * ratio), tex.a);
}
`;
