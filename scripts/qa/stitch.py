#!/usr/bin/env python3
"""Stitch viewport screenshots into one tall page image.

Used by audit.mjs. The last slice is clamped by the browser at the bottom of
the document, so it overlaps the one before it; only its new part is copied.
"""
import sys

from PIL import Image

out_path, total, viewport = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
slices = sys.argv[4:]
first = Image.open(slices[0])
sheet = Image.new("RGB", (first.width, min(total, len(slices) * viewport)), (255, 255, 255))
for i, path in enumerate(slices):
    im = Image.open(path).convert("RGB")
    overlap = (len(slices) * viewport - total) if i == len(slices) - 1 else 0
    sheet.paste(im.crop((0, overlap, im.width, im.height)), (0, i * viewport))
sheet.save(out_path)
