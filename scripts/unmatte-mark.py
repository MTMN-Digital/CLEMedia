#!/usr/bin/env python3
"""Take the leftover white matte off the mark's silhouette.

WHAT WAS WRONG. The artwork reached us cut out of a near-white background,
and the cut kept a one to two pixel rim of that background blended into the
object, at full opacity. Over the warm set the rim reads as a bright outline
traced around every letter, and once the hero's camera dollies in it is the
halo that showed around the C and the lion. Measured on the delivered
mark-c@2x: 6,439 fully opaque pixels around the antennae sit cold
(107, 139, 171) against an interior that averages warm (134, 116, 101).

WHY NOT UN-MATTE IT PROPERLY. The usual repair, F = (C - (1-k)W) / k, needs
the coverage k, and these pixels are opaque: alpha is 1 right across the rim,
so k was discarded when the file was written. There is nothing to solve for.

WHAT THIS DOES INSTEAD, in two independent halves:

  COLOUR. Every pixel that is not comfortably inside the silhouette has its
  colour replaced by colour bled outward from the interior. Whatever the edge
  ends up covering is then wool rather than background. This is the half that
  does most of the work, and it is safe everywhere, including on a string one
  pixel wide.

  SHAPE. The silhouette is pulled in by about a pixel, by blurring the alpha
  and re-thresholding it, which walks a level set inward and so keeps curves
  round. A plain erosion was tried first and chewed the ball off the end of
  the antenna. The threshold is taken against the LOCAL peak of the blurred
  alpha rather than against 1: blurring a feature only a few pixels wide
  lowers its peak, so a fixed threshold dissolves it, and the first run of
  this script did exactly that to the hanging strings. Scaling the threshold
  by the local peak trims a thin feature in proportion to itself.

The mark loses about half a pixel at 1x. Nothing inside the silhouette moves.
Re-runnable, but not idempotent: run it on the committed originals, not on
its own output.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

BRAND = Path(__file__).resolve().parent.parent / "public" / "brand"
STEMS = ["cle-mark", "mark-c", "mark-e", "mark-l", "mark-word"]

# Fraction of the local peak that becomes the new edge. 0.5 would leave the
# shape where it is; 0.58 is the smallest step that clears the rim.
LEVEL = 0.58
# Fraction at which the alpha is full again, so the new edge keeps a ramp.
FULL = 0.97


def shift(a, dy, dx):
    return np.roll(np.roll(a, dy, axis=0), dx, axis=1)


NEIGHBOURS = ((-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1))


def box3(a):
    s = np.zeros_like(a)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            s += shift(a, dy, dx)
    return s / 9.0


def dilate(a, n):
    for _ in range(n):
        m = a.copy()
        for dy, dx in NEIGHBOURS:
            m = np.maximum(m, shift(a, dy, dx))
        a = m
    return a


def depth(mask, k):
    """How many erosions a pixel survives, capped at k: a thickness in pixels."""
    m = mask.astype(np.float64)
    d = np.zeros_like(m)
    for _ in range(k):
        e = m.copy()
        for dy, dx in NEIGHBOURS:
            e = np.minimum(e, shift(m, dy, dx))
        m = e
        d += m
    return d


def bleed(rgb, known, rounds=48):
    """Push colour outward from the known region, one ring of pixels a round."""
    out = rgb.astype(np.float64).copy()
    have = known.copy()
    for _ in range(rounds):
        if have.all():
            break
        acc = np.zeros_like(out)
        cnt = np.zeros(out.shape[:2])
        # Diagonals at half weight: an even box drags colour along the edge
        # rather than out from it.
        for dy, dx, w in ((-1, 0, 1.0), (1, 0, 1.0), (0, -1, 1.0), (0, 1, 1.0),
                          (-1, -1, 0.5), (-1, 1, 0.5), (1, -1, 0.5), (1, 1, 0.5)):
            acc += shift(out, dy, dx) * (shift(have, dy, dx) * w)[..., None]
            cnt += shift(have, dy, dx) * w
        fill = (~have) & (cnt > 0)
        if not fill.any():
            break
        out[fill] = acc[fill] / cnt[fill][..., None]
        have |= fill
    return out


def process(name: str, scale: int) -> str:
    path = BRAND / f"{name}.png"
    src = np.asarray(Image.open(path).convert("RGBA")).astype(np.float64)
    alpha = src[..., 3] / 255.0
    rgb = src[..., :3]

    blurred = alpha
    for _ in range(scale):
        blurred = box3(blurred)
    peak = np.maximum(dilate(blurred, 3 * scale), 1e-6)
    lo, hi = LEVEL * peak, FULL * peak
    pulled = np.clip((blurred - lo) / np.maximum(hi - lo, 1e-6), 0.0, 1.0)
    # Never add alpha: this operation only ever takes the silhouette in.
    pulled = np.minimum(pulled, alpha)

    trusted = depth(alpha > 0.5, 6) >= scale + 1
    recoloured = np.where(trusted[..., None], rgb, bleed(rgb, trusted))

    out = np.dstack([recoloured, pulled * 255.0])
    img = Image.fromarray(np.clip(out + 0.5, 0, 255).astype(np.uint8), "RGBA")
    img.save(path)
    img.save(BRAND / f"{name}.webp", lossless=True, quality=100, method=6)

    before = float((alpha > 0.5).sum())
    return f"{name}: {1 - (pulled > 0.5).sum() / max(before, 1):.2%} of the silhouette trimmed"


if __name__ == "__main__":
    for stem in STEMS:
        for name, scale in ((stem, 1), (f"{stem}@2x", 2)):
            if (BRAND / f"{name}.png").exists():
                print(process(name, scale))
            else:
                print(f"{name}: missing", file=sys.stderr)
