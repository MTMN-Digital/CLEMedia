#!/usr/bin/env python3
"""WCAG contrast measured from painted pixels, with glyph edges excluded.

Called by audit.mjs with a page screenshot; the matching .json next to it holds
one record per text box, in document coordinates, each carrying the text colour
already resolved to straight RGBA by the browser.

THREE EARLIER METHODS WERE WRONG, in three different directions. All three are
recorded because all three are easy to write again by accident.

1. Computing the background from styles could not see `.wall` or `.deep`: they
   paint with the `background` shorthand, so their computed `background-color`
   is transparent and walking up the tree for the first real colour sails past
   them to the page default. Muted text on a dark band measured 5.9:1 when it
   is 4.44:1. That is a FALSE PASS, the direction that ships a failure.

2. Taking the darkest decile of non-glyph pixels was wrong the other way. An
   antialiased glyph edge is a partly covered pixel: darker than the ground
   under dark text and not the text colour either. It read the header
   navigation at 5.95:1 where the truth is 9.4:1, and reported 83 failures of
   which most did not exist.

3. Parsing the colour string here was worst of all. Tailwind v4 emits
   `text-white/90` as `oklab(0.999994 0.0000455 0.0000200 / 0.9)`; taking the
   first three numbers and scaling by 255 because they are below 1 gives PURE
   RED, and dropping the trailing alpha measures translucent text as opaque.
   Resolving the colour is now the browser's job, in audit.mjs.

4. Masking the glyphs by matching them against the expected text colour found
   nothing at all below about 12px. Antialiasing means no pixel of 9px type
   ever reaches full coverage, so the mask came back EMPTY, the whole box
   became "ground", and the darkest thing in it was the text: a journal label
   was duly reported as brown-on-brown at 2.99:1 against a "#b1a091" that is
   one of its own antialiased pixels.

What this does instead: solves each pixel for how much of the glyph covers it,
given the text colour and the backdrop, and keeps only the pixels that are
essentially uncovered and not adjacent to a covered one. Those are the real
ground. The text is then composited over each of them at its true alpha, and
the fifth percentile of that distribution of ratios is the verdict.
"""
import json
import sys

import numpy as np
from PIL import Image


def luminance(rgb):
    c = np.asarray(rgb, dtype=float) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def dilate(mask, radius=2):
    out = mask.copy()
    for dy in range(-radius, radius + 1):
        for dx in range(-radius, radius + 1):
            out |= np.roll(np.roll(mask, dy, axis=0), dx, axis=1)
    return out


def coverage(box, solid, backdrop):
    """How much of each pixel the glyph covers, in 0..1.

    A painted pixel is `cov * solid + (1 - cov) * backdrop`, so cov falls out
    of one division. It is read off the channel where solid and backdrop are
    furthest apart, because that channel carries the most signal and the others
    can be near-degenerate (brown ink on cream paper barely moves blue)."""
    d = solid - backdrop
    ch = int(np.argmax(np.abs(d)))
    if abs(d[ch]) < 8:
        return None
    return np.clip((box[..., ch] - backdrop[ch]) / d[ch], 0.0, 1.0)


def measure(box, fg, alpha):
    """Worst realistic contrast of this text against what is painted behind it.

    Returns (ratio, ground_pixel, text_pixel), or Nones when the box holds no
    measurable ground, which happens when text fills its own bounding box."""
    backdrop = np.median(box.reshape(-1, 3), axis=0)
    solid = alpha * fg + (1 - alpha) * backdrop
    cov = coverage(box, solid, backdrop)
    if cov is None:
        return None, None, None

    # Uncovered, and not touching anything substantially covered: that second
    # condition is what keeps the antialiased rim out, and it replaces the
    # blanket dilation that used to throw away the ground as well.
    clear = (cov < 0.12) & ~dilate(cov > 0.4, 2)
    ground = box[clear]
    if len(ground) < 24:
        ground = box[cov < 0.12]
    if len(ground) < 24:
        return None, None, None

    rs = ratio(alpha * fg + (1 - alpha) * ground, ground)
    r = float(np.quantile(rs, 0.05))
    worst = ground[int(np.argmin(np.abs(rs - r)))]
    return r, worst, alpha * fg + (1 - alpha) * worst


def ratio(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = np.maximum(la, lb), np.minimum(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def _check():
    """The compositing, the ratio, and the coverage solve."""
    assert abs(ratio([255, 255, 255], [0, 0, 0]) - 21.0) < 0.01
    assert abs(ratio([0, 0, 0], [255, 255, 255]) - 21.0) < 0.01, "order must not matter"
    # Half-alpha cream over near-black lands halfway in sRGB, not in light.
    mid = 0.5 * np.array([246.0, 240, 226]) + 0.5 * np.array([21.0, 17, 15])
    assert np.allclose(mid, [133.5, 128.5, 120.5])
    # A token that measures below AA at small size really is below it: the
    # edge print this site ships is the worked example.
    assert 5.5 < ratio(0.55 * np.array([246.0, 240, 226]) + 0.45 * np.array([21.0, 17, 15]),
                       [21, 17, 15]) < 5.7
    # The case that defeated every earlier version: small dark text on light
    # paper, where the only dark pixels are PARTLY covered. The ground must
    # come back as the paper, never as a rim pixel.
    paper, ink = np.array([246.0, 240, 226]), np.array([107.0, 78, 58])
    box = np.tile(paper, (14, 60, 1))
    box[6, 10:50] = 0.55 * ink + 0.45 * paper   # a stroke, 55% covered, no more
    box[5, 10:50] = 0.20 * ink + 0.80 * paper   # its rim
    box[7, 10:50] = 0.20 * ink + 0.80 * paper
    r, worst, _ = measure(box, ink, 1.0)
    assert worst is not None and np.allclose(worst, paper, atol=1), worst
    assert abs(r - ratio(ink, paper)) < 0.01, (r, ratio(ink, paper))
    print("contrast.py self-check ok")


if "--self-check" in sys.argv:
    _check()
    raise SystemExit(0)

shot = sys.argv[1]
items = json.load(open(shot.replace(".png", ".json")))
im = np.asarray(Image.open(shot).convert("RGB")).astype(float)
HEIGHT, WIDTH = im.shape[:2]

failures = []
for item in items:
    rgba = item.get("rgba")
    if not rgba or rgba[3] < 0.05:
        continue
    fg, alpha = np.array(rgba[:3], dtype=float), float(rgba[3])

    x0, y0 = max(0, item["x"]), max(0, item["y"])
    x1, y1 = min(WIDTH, x0 + item["w"]), min(HEIGHT, y0 + item["h"])
    if x1 - x0 < 10 or y1 - y0 < 8:
        continue
    box = im[y0:y1, x0:x1]

    r, worst, here = measure(box, fg, alpha)
    if r is None:
        continue

    large = item["px"] >= 24 or (item["bold"] and item["px"] >= 18.66)
    need = 3.0 if large else 4.5
    if r < need - 0.05:
        # The ground and the composited text are printed because without them
        # every fix is a guess: a token can say #15110f and the painted band
        # still measure lighter, because a grain layer, an inset highlight or a
        # neighbouring tick is inside the text box.
        hx = lambda v: "#%02x%02x%02x" % tuple(int(round(c)) for c in v)
        failures.append(
            f'   {r:5.2f} < {need}  {item["px"]}px  {hx(here)} on {hx(worst)}  "{item["t"]}"'
        )

print("\n".join(failures))

