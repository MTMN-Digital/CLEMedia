#!/usr/bin/env python3
"""Contrast of a rule, a border or a drawn stroke, from painted pixels.

lines.mjs writes one small clip per distinct line, taken across it: a
horizontal rule gives a tall thin strip, a vertical one a wide short strip.
This finds the line inside that strip and measures it against the ground on
both sides of it.

WHY NOT COMPUTE IT FROM THE COLOUR. Two reasons, both of which bite on this
site. The rule token is `rgba(74, 53, 42, 0.13)`, so the painted colour
depends entirely on what is behind it, and the surfaces behind it paint with
the `background` shorthand, which a style walk cannot read (see audit.mjs).
And a 1px line at a device ratio of 2 is painted into 2 device rows, but a
1.4px stroke lands across 3 with partial coverage on the outer two, so the
colour an author wrote is never the colour that arrives.

WHAT IT REPORTS. The ratio between the darkest (or lightest) row of the line
and the median ground either side, and the line's measured thickness in CSS
pixels, counting any row that is at least a quarter of the way from the ground
to the line's own extreme. A hairline drawn at 13 percent alpha reads as about
1.1:1, which is the number that says "invisible" without anyone arguing.
"""
import json
import sys

import numpy as np
from PIL import Image

DPR = 2.0


def luminance(rgb):
    c = np.asarray(rgb, dtype=float) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def ratio(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def measure(path, horiz):
    """Returns (ratio, thickness_css_px, line_rgb, ground_rgb) or None."""
    im = np.asarray(Image.open(path).convert("RGB")).astype(float)
    if im.size == 0:
        return None
    # Collapse along the line. MEDIAN, not mean: a vertical border runs down
    # the side of a card whose contents change every few pixels, and a mean
    # lets one bright image row drag the whole profile, which is how the first
    # version of this reported 1px borders as 24 pixels thick and invented a
    # dozen failures that were really photographs.
    prof = np.median(im, axis=1) if horiz else np.median(im, axis=0)
    if prof.shape[0] < 5:
        return None
    lum = luminance(prof)
    # The ground is the median of the outer thirds, which is where lines.mjs
    # put the padding. The line is the row furthest from it either way.
    edge = max(1, prof.shape[0] // 3)
    ground_rows = np.concatenate([lum[:2], lum[-2:]])
    ground = float(np.median(ground_rows))
    dev = np.abs(lum - ground)
    # Ignore the two outermost rows: a clip can catch the neighbouring surface.
    dev[:1] = 0
    dev[-1:] = 0
    i = int(np.argmax(dev))
    if dev[i] < 0.0015:
        return None
    line_rgb = prof[i]
    ground_rgb = np.median(np.concatenate([prof[:2], prof[-2:]]), axis=0)
    # Thickness: every row at least a quarter of the way out from the ground.
    thick = int(np.count_nonzero(dev >= dev[i] * 0.25))
    return ratio(line_rgb, ground_rgb), thick / DPR, line_rgb, ground_rgb


def plausible(thick_css, authored):
    """Did we actually find the line, or some other edge in the clip?

    A 1px border paints into about 1px plus antialiasing. Anything three
    times its authored weight is a different object: a rounded corner the
    clip cut across, a photograph beside the card, the next element along.
    Those are reported as unmeasured rather than as failures, because a
    tool that cries wolf gets ignored and then the real ones ship."""
    return thick_css <= max(2.0, authored * 3.0 + 1.0)


def _check():
    assert abs(ratio([255, 255, 255], [0, 0, 0]) - 21.0) < 0.01
    assert abs(ratio([0, 0, 0], [255, 255, 255]) - 21.0) < 0.01, "order must not matter"
    # The site's own hairline: 13 percent of the ink brown over the paper.
    paper = np.array([245.0, 239, 228])
    ink = np.array([74.0, 53, 42])
    hair = 0.13 * ink + 0.87 * paper
    r = ratio(hair, paper)
    assert 1.1 < r < 1.3, r
    print("lines.py self-check ok", round(r, 2))


if "--self-check" in sys.argv:
    _check()
    raise SystemExit(0)

rows = json.load(open(sys.argv[1]))
out = []
unmeasured = []
for row in rows:
    got = measure(row["shot"], row["horiz"])
    if not got:
        continue
    r, thick, line_rgb, ground_rgb = got
    rec = {**row, "ratio": r, "thick": thick,
           "line": [round(v) for v in line_rgb],
           "ground": [round(v) for v in ground_rgb]}
    missed = row["kind"] == "svg-stroke" and r < 1.05
    (unmeasured if missed or not plausible(thick, row.get("width", 1)) else out).append(rec)

out.sort(key=lambda d: d["ratio"])
print(f"{'page':<11} {'ratio':>5} {'px':>4}  {'kind':<13} {'surface':<7} {'authored':<34} what")
for d in out:
    flag = "  " if d["ratio"] >= 3.0 else ("!!" if d["ratio"] < 1.5 else " !")
    print(f"{d['page']:<11} {d['ratio']:>5.2f} {d['thick']:>4.1f} {flag}{d['kind']:<13} "
          f"{d['surface']:<7} {d['colour'][:33]:<34} {d['sel'][:38]}")

if unmeasured:
    print(f"\nnot measured ({len(unmeasured)}): the clip found an edge too thick to be the "
          f"line itself, so these are unknown rather than failing.")
    for d in unmeasured[:12]:
        print(f"  {d['page']:<11} {d['thick']:>4.1f}px vs {d['width']}px authored  "
              f"{d['kind']:<13} {d['sel'][:44]}")

under3 = [d for d in out if d["ratio"] < 3.0]
under15 = [d for d in out if d["ratio"] < 1.5]
print(f"\nlines measured: {len(out)}   under 3:1: {len(under3)}   under 1.5:1 (invisible): {len(under15)}")
