#!/usr/bin/env python3
"""Shrink the fetched hero assets to something a web page can afford.

Poly Haven ships at print and film resolution. Straight off the fetcher this
set is 21 MB, which is not a hero, it is a download. Everything here is seen
either small (the plants are instanced and most are a few hundred pixels tall)
or not at all (the HDRI is used as light, never shown), so almost all of that
is paid for and never seen.

WHAT IT DOES, and the one rule that keeps it simple: model textures are
rewritten IN PLACE at the same filenames, so the .gltf files that reference
them need no editing at all. A rewritten glTF is a thing to get wrong at 3am;
a smaller JPEG at the same path cannot be.

  HDRI            1k Radiance  ->  256x128 flat RGBE, about 130 KB
  loose textures  1k JPEG      ->  512 WebP, which only this code loads
  model textures  1k JPEG      ->  384 JPEG, same name, same folder
  boulder and branches         ->  deleted, see below

Run after the fetcher. Idempotent in the sense that re-running on already
small files is a no-op, but it is lossy: do not run it twice expecting the
same result, re-fetch instead.
"""
from __future__ import annotations

import json
import shutil
import struct
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "hero3d"

# Dropped. The boulder carries a 2.9 MB mesh for a rock that is a few hundred
# pixels across in the only shot it appears in, and the branches carry 2.3 MB
# of texture to be a few twigs on the ground. Neither earns its download; the
# grass, the fern and the celandine do all the work of making the ground read
# as a built miniature rather than instanced spheres.
DROP = ["boulder_01", "dry_branches_medium_01"]

HDRI_WIDTH = 256
LOOSE_TEX = 512
MODEL_TEX = 384


def read_hdr(path: Path) -> tuple[np.ndarray, int, int]:
    """Decode a Radiance .hdr into float RGB. Handles the adaptive RLE that
    Poly Haven writes; a flat file would decode through the same path."""
    data = path.read_bytes()
    i = data.index(b"\n\n") + 2
    dims_end = data.index(b"\n", i)
    parts = data[i:dims_end].split()
    h, w = int(parts[1]), int(parts[3])
    i = dims_end + 1

    rgbe = np.zeros((h, w, 4), dtype=np.uint8)
    for y in range(h):
        if data[i] == 2 and data[i + 1] == 2 and ((data[i + 2] << 8) | data[i + 3]) == w:
            i += 4
            for c in range(4):
                x = 0
                while x < w:
                    n = data[i]
                    i += 1
                    if n > 128:  # a run
                        rgbe[y, x : x + n - 128, c] = data[i]
                        i += 1
                        x += n - 128
                    else:  # a literal block
                        rgbe[y, x : x + n, c] = np.frombuffer(data[i : i + n], dtype=np.uint8)
                        i += n
                        x += n
        else:  # flat scanline
            rgbe[y] = np.frombuffer(data[i : i + w * 4], dtype=np.uint8).reshape(w, 4)
            i += w * 4

    e = rgbe[..., 3].astype(np.int32)
    scale = np.where(e == 0, 0.0, np.exp2(e - 136)).astype(np.float32)
    rgb = rgbe[..., :3].astype(np.float32) * scale[..., None]
    return rgb, w, h


def write_hdr(path: Path, rgb: np.ndarray) -> None:
    """Write flat (uncompressed) RGBE. Valid Radiance, and three's RGBELoader
    reads it; at this size the RLE would save a few tens of kilobytes and
    cost a second encoder to get wrong."""
    h, w = rgb.shape[:2]
    m = rgb.max(axis=2)
    e = np.zeros_like(m, dtype=np.int32)
    nz = m > 1e-32
    e[nz] = np.floor(np.log2(m[nz])).astype(np.int32) + 1
    scale = np.where(nz, np.exp2(-e + 8), 0.0)[..., None]
    out = np.zeros((h, w, 4), dtype=np.uint8)
    out[..., :3] = np.clip(rgb * scale, 0, 255).astype(np.uint8)
    out[..., 3] = np.where(nz, e + 128, 0).astype(np.uint8)
    header = b"#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n" + f"-Y {h} +X {w}\n".encode()
    path.write_bytes(header + out.tobytes())


def shrink_image(path: Path, size: int, out_path: Path | None = None, quality: int = 78) -> None:
    im = Image.open(path)
    if max(im.size) > size:
        im = im.resize((size, int(size * im.height / im.width)), Image.LANCZOS)
    target = out_path or path
    if target.suffix == ".webp":
        im.convert("RGB").save(target, "WEBP", quality=82, method=6)
    else:
        im.convert("RGB").save(target, "JPEG", quality=quality, optimize=True, progressive=True)


def main() -> int:
    before = sum(f.stat().st_size for f in OUT.rglob("*") if f.is_file())

    for slug in DROP:
        d = OUT / "model" / slug
        if d.exists():
            shutil.rmtree(d)
            print(f"dropped {slug}")
    credits_path = OUT / "CREDITS.json"
    if credits_path.exists():
        credits = [c for c in json.loads(credits_path.read_text()) if c["slug"] not in DROP]
        credits_path.write_text(json.dumps(credits, indent=2) + "\n")

    for f in (OUT / "hdri").glob("*.hdr"):
        rgb, w, h = read_hdr(f)
        # Box filter down by an integer factor, which keeps the energy right;
        # a bilinear resize of a light probe dims the highlights.
        factor = max(1, w // HDRI_WIDTH)
        nh, nw = h // factor, w // factor
        small = rgb[: nh * factor, : nw * factor].reshape(nh, factor, nw, factor, 3).mean(axis=(1, 3))
        write_hdr(f, small.astype(np.float32))
        print(f"hdri    {f.name:34s} {w}x{h} -> {nw}x{nh}  {f.stat().st_size // 1024} KB")

    for f in sorted((OUT / "tex").rglob("*")):
        if f.suffix.lower() in (".jpg", ".jpeg", ".png"):
            webp = f.with_suffix(".webp")
            shrink_image(f, LOOSE_TEX, webp)
            f.unlink()
            print(f"tex     {f.parent.name + '/' + webp.name:34s} {webp.stat().st_size // 1024} KB")

    for f in sorted((OUT / "model").rglob("textures/*")):
        if f.suffix.lower() in (".jpg", ".jpeg"):
            shrink_image(f, MODEL_TEX)
            print(f"model   {f.parent.parent.name + '/' + f.name:34s} {f.stat().st_size // 1024} KB")

    after = sum(f.stat().st_size for f in OUT.rglob("*") if f.is_file())
    print(f"\n{before // 1024 // 1024} MB -> {after // 1024} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
