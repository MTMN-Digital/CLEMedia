#!/usr/bin/env python3
"""Encode one hero render into the nine browser delivery files.

Example:
  python3 scripts/encode-hero-plate.py /tmp/hero-plate.png
"""

from __future__ import annotations

import argparse
import io
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, features


ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIRECTORY = ROOT / "public" / "brand"
WIDTHS = (1280, 1920, 2560)
MAX_BYTES = 400 * 1024
JPEG_QUALITIES = range(90, 34, -5)
WEBP_QUALITIES = range(88, 29, -4)
AVIF_QUALITIES = range(60, 14, -4)


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("render", type=Path, help="Rendered PNG or other Pillow-readable image")
    parser.add_argument("--output-dir", type=Path, default=OUTPUT_DIRECTORY)
    return parser.parse_args()


def flattened(image: Image.Image) -> Image.Image:
    """The plate is opaque, but retain predictable output if a PNG has alpha."""
    if image.mode != "RGBA":
        return image.convert("RGB")
    backdrop = Image.new("RGB", image.size, (214, 193, 164))
    backdrop.paste(image, mask=image.getchannel("A"))
    return backdrop


def resize(image: Image.Image, width: int) -> Image.Image:
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def pillow_encode(image: Image.Image, image_format: str, qualities) -> bytes:
    for quality in qualities:
        buffer = io.BytesIO()
        options = {"quality": quality}
        if image_format == "JPEG":
            options.update({"optimize": True, "progressive": True, "subsampling": "4:2:0"})
        if image_format == "WEBP":
            options.update({"method": 6})
        image.save(buffer, format=image_format, **options)
        payload = buffer.getvalue()
        if len(payload) <= MAX_BYTES:
            return payload
    raise RuntimeError(f"{image_format} could not meet the {MAX_BYTES // 1024} KB budget")


def ffmpeg_avif(image: Image.Image) -> bytes:
    """Use ffmpeg's AV1 encoder only when this Pillow build lacks AVIF."""
    with tempfile.TemporaryDirectory(prefix="hero-avif-") as directory:
        source = Path(directory) / "source.png"
        target = Path(directory) / "plate.avif"
        image.save(source, format="PNG", optimize=True)
        for crf in range(24, 57, 3):
            command = [
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
                "-frames:v", "1", "-c:v", "libaom-av1", "-still-picture", "1",
                "-cpu-used", "8", "-crf", str(crf), "-b:v", "0", str(target),
            ]
            subprocess.run(command, check=True)
            payload = target.read_bytes()
            if len(payload) <= MAX_BYTES:
                return payload
    raise RuntimeError(f"AVIF could not meet the {MAX_BYTES // 1024} KB budget")


def avif_encode(image: Image.Image) -> bytes:
    if features.check("avif"):
        return pillow_encode(image, "AVIF", AVIF_QUALITIES)
    return ffmpeg_avif(image)


def main() -> int:
    args = arguments()
    if not args.render.is_file():
        raise SystemExit(f"Render not found: {args.render}")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    with Image.open(args.render) as source:
        source.load()
        master = flattened(source)
    for width in WIDTHS:
        plate = resize(master, width)
        outputs = {
            "avif": avif_encode(plate),
            "webp": pillow_encode(plate, "WEBP", WEBP_QUALITIES),
            "jpg": pillow_encode(plate, "JPEG", JPEG_QUALITIES),
        }
        for suffix, payload in outputs.items():
            target = args.output_dir / f"hero-plate-{width}.{suffix}"
            target.write_bytes(payload)
            print(f"{target.relative_to(ROOT)}: {len(payload) / 1024:.1f} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
