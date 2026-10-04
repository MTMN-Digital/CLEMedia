/* ============================================================================
   Blurred fields, built once on the CPU.

   WHY NOT MIPMAPS. The shader needs three smooth versions of each layer's
   maps: a wide blur of the alpha for the pillow (how far inside the object a
   vertex is), a narrow blur of the alpha for cast-shadow penumbrae, and a
   lightly smoothed height for the geometry. The obvious tool is textureLod
   on a mipmapped texture, and that is what the first attempt used. Measured
   in Chrome on ANGLE, the mip chain of these 1182px (non power of two)
   textures is not energy-preserving: a 17px string read back 244/255 at
   level 5, where a correct box filter gives about 120. Every blur built on
   it was inflated, strings became ridges, and the behaviour is driver
   specific. So the fields are computed here, deterministically, and go up
   as linear-filtered textures with no mip chain at all.

   COST. Four layers, one full-resolution readback each, a box downsample and
   a few separable box passes at a quarter and a half of the size. Tens of
   milliseconds, once, at idle.
   ========================================================================== */

import { DataTexture, LinearFilter, RedFormat, UnsignedByteType } from "three";

export interface LayerFields {
  /** Alpha, quarter resolution, wide blur. 1 deep inside, ~0.5 at an edge,
      never high on a thin feature. */
  cover: DataTexture;
  /** Alpha, quarter resolution, narrow blur: the silhouette with a soft rim. */
  mask: DataTexture;
  /** Height, half resolution, lightly smoothed, for the vertex stage. */
  height: DataTexture;
}

function readChannel(img: HTMLImageElement, channel: number): { data: Uint8ClampedArray; w: number; h: number } {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth || img.width;
  c.height = img.naturalHeight || img.height;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("no 2d context for hero fields");
  ctx.drawImage(img, 0, 0);
  const px = ctx.getImageData(0, 0, c.width, c.height).data;
  const out = new Uint8ClampedArray(c.width * c.height);
  for (let i = 0, j = channel; i < out.length; i++, j += 4) out[i] = px[j];
  return { data: out, w: c.width, h: c.height };
}

/** Box-average a single channel down to tw by th. */
function downsample(src: Uint8ClampedArray, sw: number, sh: number, tw: number, th: number): Float32Array {
  const out = new Float32Array(tw * th);
  const sx = sw / tw;
  const sy = sh / th;
  for (let y = 0; y < th; y++) {
    const y0 = Math.floor(y * sy);
    const y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
    for (let x = 0; x < tw; x++) {
      const x0 = Math.floor(x * sx);
      const x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
      let sum = 0;
      for (let yy = y0; yy < y1; yy++) {
        const row = yy * sw;
        for (let xx = x0; xx < x1; xx++) sum += src[row + xx];
      }
      out[y * tw + x] = sum / ((y1 - y0) * (x1 - x0)) / 255;
    }
  }
  return out;
}

/** Separable box blur, in place, `passes` times (three passes is close to a
    Gaussian). Edges clamp, so an object touching the border keeps its weight. */
function blur(f: Float32Array, w: number, h: number, radius: number, passes: number) {
  if (radius < 1) return;
  const tmp = new Float32Array(f.length);
  const n = 2 * radius + 1;
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let acc = 0;
      for (let k = -radius; k <= radius; k++) acc += f[row + Math.min(w - 1, Math.max(0, k))];
      for (let x = 0; x < w; x++) {
        tmp[row + x] = acc / n;
        const outI = Math.max(0, x - radius);
        const inI = Math.min(w - 1, x + radius + 1);
        acc += f[row + inI] - f[row + outI];
      }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let k = -radius; k <= radius; k++) acc += tmp[Math.min(h - 1, Math.max(0, k)) * w + x];
      for (let y = 0; y < h; y++) {
        f[y * w + x] = acc / n;
        const outI = Math.max(0, y - radius);
        const inI = Math.min(h - 1, y + radius + 1);
        acc += tmp[inI * w + x] - tmp[outI * w + x];
      }
    }
  }
}

/** Bottom row first, which is three.js's texture orientation for v = 0. */
function toTexture(f: Float32Array, w: number, h: number): DataTexture {
  const bytes = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const src = (h - 1 - y) * w;
    const dst = y * w;
    for (let x = 0; x < w; x++) bytes[dst + x] = Math.round(Math.min(1, Math.max(0, f[src + x])) * 255);
  }
  const t = new DataTexture(bytes, w, h, RedFormat, UnsignedByteType);
  t.minFilter = LinearFilter;
  t.magFilter = LinearFilter;
  t.generateMipmaps = false;
  t.unpackAlignment = 1;
  t.needsUpdate = true;
  return t;
}

/** Quarter-size dimension, a multiple of 4. */
function quarter(n: number) {
  return Math.max(4, Math.round(n / 16) * 4);
}

export function buildLayerFields(colour: HTMLImageElement, height: HTMLImageElement): LayerFields {
  const a = readChannel(colour, 3);
  const qw = quarter(a.w);
  const qh = quarter(a.h);

  const cover = downsample(a.data, a.w, a.h, qw, qh);
  /* Reach of the pillow ramp: about 48 source texels. */
  blur(cover, qw, qh, 6, 3);

  const mask = downsample(a.data, a.w, a.h, qw, qh);
  /* Penumbra of a cast shadow: about 12 source texels. */
  blur(mask, qw, qh, 2, 2);

  const hsrc = readChannel(height, 0);
  const hw = Math.max(4, Math.round(hsrc.w / 8) * 4);
  const hh = Math.max(4, Math.round(hsrc.h / 8) * 4);
  const h = downsample(hsrc.data, hsrc.w, hsrc.h, hw, hh);
  blur(h, hw, hh, 1, 1);

  return { cover: toTexture(cover, qw, qh), mask: toTexture(mask, qw, qh), height: toTexture(h, hw, hh) };
}
