#!/usr/bin/env python3
"""Film grain for the hero plate, applied after the render.

Monochrome, luminance weighted (more in the shadows, almost none in the
highlights so the floor under the words stays clean), softened a hair so it
reads as emulsion rather than sensor noise. Seeded, so re-running gives the
same plate.

usage: python3 grain.py in.png out.png [--amount 2.2]
"""
import argparse
import numpy as np
from PIL import Image, ImageFilter

p = argparse.ArgumentParser()
p.add_argument("src")
p.add_argument("dst")
p.add_argument("--amount", type=float, default=2.2, help="grain sigma in 8 bit steps at mid grey")
p.add_argument("--seed", type=int, default=1911)
a = p.parse_args()

im = Image.open(a.src).convert("RGB")
arr = np.asarray(im).astype(np.float32)
lum = arr.mean(axis=2) / 255.0
rng = np.random.default_rng(a.seed)
noise = rng.normal(0.0, 1.0, lum.shape).astype(np.float32)
noise = np.asarray(Image.fromarray(((noise * 40) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32)
noise = (noise - 128.0) / 40.0
# Weight: full in shadows, fading to a quarter in highlights.
weight = (1.0 - lum) * 0.75 + 0.25
grain = noise * weight * a.amount
out = (arr + grain[..., None]).clip(0, 255).astype(np.uint8)
Image.fromarray(out).save(a.dst, optimize=True)
print("grain applied", a.src, "->", a.dst)
