#!/usr/bin/env python3
"""Validate felt relief maps and produce three-light Lambert contact sheets."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public" / "brand"
DEPTH = BRAND / "depth"
SCRATCH = ROOT / "_scratch" / "depth-check"
LAYERS = ("mark-c", "mark-l", "mark-e", "mark-word")


def load_height(path: Path, require_16_bit: bool = True) -> np.ndarray:
    image = Image.open(path)
    values = np.asarray(image)
    if require_16_bit and values.dtype != np.uint16:
        raise AssertionError(f"{path}: expected 16-bit PNG, got {image.mode} {values.dtype}")
    if values.dtype == np.uint16:
        return values.astype(np.float32) / 65535.0
    if values.dtype == np.uint8 and not require_16_bit:
        return values.astype(np.float32) / 255.0
    raise AssertionError(f"{path}: unsupported height format {image.mode} {values.dtype}")


def boundary_variance(height: np.ndarray, rgb: np.ndarray, alpha: np.ndarray) -> tuple[float, int]:
    """Height variation in local strips crossing strong blue-to-orange colour edges."""
    chroma = rgb / np.maximum(rgb.sum(axis=2, keepdims=True), 1.0)
    colour_dx = np.max(np.abs(chroma[:, 1:] - chroma[:, :-1]), axis=2)
    valid = (alpha[:, 1:] >= 250) & (alpha[:, :-1] >= 250)
    region = np.zeros_like(valid, dtype=bool)
    region[640:980, 250:600] = True
    candidates = colour_dx[valid & region]
    threshold = float(np.percentile(candidates, 96.0))
    edges = valid & region & (colour_dx >= threshold)
    # Each selected edge contributes a four-pixel cross-boundary strip.  Its
    # variance catches both a sharp step and a colour-edge ridge.
    left = np.clip(np.where(edges)[1] - 1, 0, height.shape[1] - 1)
    right = np.clip(np.where(edges)[1] + 2, 0, height.shape[1] - 1)
    rows = np.where(edges)[0]
    strips = np.stack((height[rows, left], height[rows, left + 1], height[rows, right - 1], height[rows, right]), axis=1)
    return float(np.mean(np.var(strips, axis=1))), int(rows.size)


def lambert_sheet(layer: str, rgb: np.ndarray, alpha: np.ndarray, normals: np.ndarray) -> list[float]:
    SCRATCH.mkdir(parents=True, exist_ok=True)
    lights = ((-0.72, 0.32, 0.62), (0.0, -0.68, 0.74), (0.72, 0.32, 0.62))
    panels = []
    means = []
    mask = alpha > 0
    for vector in lights:
        light = np.asarray(vector, dtype=np.float32)
        light /= np.linalg.norm(light)
        shade = np.clip((normals * light).sum(axis=2), 0.0, 1.0)
        means.append(float(shade[mask].mean()))
        rendered = np.clip(rgb * (0.20 + 0.80 * shade[..., None]), 0.0, 1.0)
        rendered = np.dstack((rendered, alpha / 255.0))
        panels.append(Image.fromarray(np.rint(rendered * 255.0).astype(np.uint8), mode="RGBA"))
    sheet = Image.new("RGBA", (panels[0].width * 3, panels[0].height + 28), (24, 24, 21, 255))
    labels = ("azimuth 206 deg", "azimuth 270 deg", "azimuth 334 deg")
    draw = ImageDraw.Draw(sheet)
    for index, panel in enumerate(panels):
        sheet.alpha_composite(panel, (index * panel.width, 28))
        draw.text((index * panel.width + 8, 7), labels[index], fill=(245, 242, 232, 255))
    sheet.save(SCRATCH / f"{layer}.png")
    return means


def main() -> None:
    failures = []
    for layer in LAYERS:
        source = np.asarray(Image.open(BRAND / f"{layer}@2x.png").convert("RGBA"), dtype=np.uint8)
        alpha = source[..., 3]
        inside = alpha >= 128
        opaque = alpha == 255
        height_raw = np.asarray(Image.open(DEPTH / f"{layer}-height.png"))
        height = load_height(DEPTH / f"{layer}-height.png")
        normals = np.asarray(Image.open(DEPTH / f"{layer}-normal.png").convert("RGB"), dtype=np.float32) / 255.0 * 2.0 - 1.0
        length_error = np.abs(np.linalg.norm(normals, axis=2) - 1.0)
        outside_nonzero = int(np.count_nonzero(height_raw[alpha == 0]))
        zero_inside = float(np.mean(height_raw[inside] == 0))
        clipped_inside = float(np.mean((height_raw[inside] == 0) | (height_raw[inside] == 65535)))
        normal_bad = float(np.mean(length_error[inside] > 0.02))
        normal_p99 = float(np.percentile(length_error[inside], 99.0))
        baseline = load_height(DEPTH / "baseline" / f"{layer}-height.png", require_16_bit=False) if layer == "mark-c" else None
        new_variance = None
        boundary_count = 0
        baseline_variance = None
        if baseline is not None:
            new_variance, boundary_count = boundary_variance(height, source[..., :3].astype(np.float32), alpha)
            baseline_variance, _ = boundary_variance(baseline, source[..., :3].astype(np.float32), alpha)
        preview_means = lambert_sheet(layer, source[..., :3].astype(np.float32) / 255.0, alpha, normals)
        light_span = max(preview_means) - min(preview_means)
        print(
            f"{layer}: outside_nonzero={outside_nonzero}, opaque_height_max={height_raw[opaque].max()}, "
            f"inside_zero={zero_inside:.4%}, inside_endpoint_clip={clipped_inside:.4%}, "
            f"normal_bad={normal_bad:.4%}, normal_p99_error={normal_p99:.5f}, "
            f"boundary_variance={new_variance if new_variance is not None else 'n/a'}, boundary_samples={boundary_count}, "
            f"lambert_means={[round(value, 5) for value in preview_means]}, light_span={light_span:.5f}"
        )
        if outside_nonzero != 0 or not np.any(height_raw[opaque] > 0):
            failures.append(f"{layer}: transparent or opaque height invariant failed")
        if zero_inside > 0.02 or clipped_inside > 0.02:
            failures.append(f"{layer}: more than 2% of inside height is clipped")
        if normal_bad > 0.0:
            failures.append(f"{layer}: normal length exceeds 2% tolerance")
        if light_span < 0.002:
            failures.append(f"{layer}: Lambert lighting does not move visibly")
        if baseline_variance is not None:
            print(f"{layer}: baseline_boundary_variance={baseline_variance:.8f}, improvement={(1.0 - new_variance / baseline_variance):.2%}")
            if not new_variance < baseline_variance:
                failures.append(f"{layer}: boundary variance did not improve over baseline")
    if failures:
        raise AssertionError("\n".join(failures))
    print("depth map checks passed")


if __name__ == "__main__":
    main()
