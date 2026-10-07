#!/usr/bin/env python3
"""Cut the floor band that carries the hero's paper on into the page.

The hero's photograph dissolves at the foot of the screen and this strip picks
the same floor up underneath it, so the set's paper and its scatter of soil and
leaf litter run into the page instead of stopping at a ruled line. It is cut
from the FINISHED back plate, after grain and vignette, so it is the same
surface and not a near match.

  python3 scripts/cut-floor-band.py /tmp/plate/v5-back-g.png
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "brand"
# A slice of PLAIN FLOOR: paper, grain and fine specks, and nothing you could
# name. The first version cut the bottom of the plate, which carries the cable
# run and the leaf litter, so the band printed a second copy of both directly
# under the ones still visible in the hero and read as a duplicate rather than
# as the floor continuing. The very bottom rows also carry the vignette's
# corner falloff, which prints as a dark smear across the page.
TOP, BOTTOM = 0.775, 0.845
# The left tenth clips the cable where it crosses, so it is cropped off, and
# the strip is mirrored so its speck pattern does not line up with the floor
# immediately above it.
LEFT = 0.10
WIDTHS = (1280, 1920)

src = Path(sys.argv[1])
with Image.open(src) as im:
    im = im.convert("RGB")
    band = im.crop((round(im.width * LEFT), round(im.height * TOP),
                    im.width, round(im.height * BOTTOM)))
    band = band.transpose(Image.FLIP_LEFT_RIGHT)

for w in WIDTHS:
    out = band.resize((w, round(band.height * w / band.width)), Image.LANCZOS)
    target = OUT / f"hero-floor-{w}.webp"
    out.save(target, "WEBP", quality=84, method=6)
    print(f"{target.relative_to(ROOT)}: {target.stat().st_size / 1024:.1f} KB  {out.width}x{out.height}")
