#!/usr/bin/env python3
"""Numbers to go with the eye: band luminance, contrast against the ink,
and where the garden strip actually falls in the frame.

usage: python3 judge.py render.png
"""
import sys
from PIL import Image
import numpy as np

INK = (0x1A, 0x16, 0x14)


def lin(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lum(rgb):
    r, g, b = (lin(rgb[..., i]) for i in range(3))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(l_bg, l_fg):
    hi, lo = max(l_bg, l_fg), min(l_bg, l_fg)
    return (hi + 0.05) / (lo + 0.05)


im = np.asarray(Image.open(sys.argv[1]).convert("RGB")).astype(np.float32)
h, w, _ = im.shape
L = lum(im)
ink = lum(np.array(INK, dtype=np.float32))

print(f"size {w}x{h}")
print("row  %  | mean sRGB         | lum   | ink contrast  (centre 60% of width)")
x0, x1 = int(w * 0.2), int(w * 0.8)
for pct in range(0, 100, 5):
    y0, y1 = int(h * pct / 100), int(h * (pct + 5) / 100)
    band = im[y0:y1, x0:x1]
    m = band.reshape(-1, 3).mean(0)
    l = L[y0:y1, x0:x1].mean()
    print(f"{pct:3d}-{pct+5:<3d} | #{int(m[0]):02x}{int(m[1]):02x}{int(m[2]):02x} {m.round(0)} | {l:.3f} | {contrast(l, ink):5.1f}")

# Horizontal falloff across the upper sweep (rows 15-35%).
y0, y1 = int(h * 0.15), int(h * 0.35)
print("sweep falloff left to right (rows 15-35%):", end=" ")
for i in range(8):
    xa, xb = int(w * i / 8), int(w * (i + 1) / 8)
    print(f"{L[y0:y1, xa:xb].mean():.3f}", end=" ")
print()
# Green mask: where the garden is.
r, g, b = im[..., 0], im[..., 1], im[..., 2]
green = (g > r * 1.08) & (g > b * 1.15) & (g > 40)
rows = green[:, x0:x1].mean(1)
ys = np.where(rows > 0.08)[0]
if len(ys):
    print(f"garden rows (>8% green across centre): {ys.min()/h*100:.1f}% to {ys.max()/h*100:.1f}%")
else:
    print("no clear green band found")
