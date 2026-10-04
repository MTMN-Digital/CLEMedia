#!/usr/bin/env python3
"""Generate 16-bit felt relief heights and OpenGL normal maps for the CLÉ mark.

The height is deliberately driven by silhouette and broad, achromatic shading,
not raw pixel lightness.  This keeps coloured wool panels, dark manes, and
small glossy highlights from turning into false steps or pits.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import shutil

import numpy as np
from PIL import Image


# Raise this to make the normal map react more strongly to a moving light.
# It is expressed in pixels of height per pixel of surface distance.
NORMAL_STRENGTH = 7.0

# Broad shading estimates the illumination field, while the small smoothing
# radius removes pixel noise before normal derivation.
ALBEDO_RADIUS = 48
NORMAL_SMOOTH_RADIUS = 2
RIM_LOCAL_RADIUS = 24

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public" / "brand"
DEPTH = BRAND / "depth"
LAYERS = ("mark-c", "mark-l", "mark-e", "mark-word")


def box_blur(image: np.ndarray, radius: int) -> np.ndarray:
    """Fast edge-padded separable box blur, used repeatedly as a Gaussian proxy."""
    if radius <= 0:
        return image.astype(np.float32, copy=True)
    width = radius * 2 + 1

    def blur_axis(values: np.ndarray, axis: int) -> np.ndarray:
        pad = [(0, 0), (0, 0)]
        pad[axis] = (radius, radius)
        padded = np.pad(values, pad, mode="edge")
        cumsum = np.cumsum(padded, axis=axis, dtype=np.float64)
        zeros_shape = list(cumsum.shape)
        zeros_shape[axis] = 1
        cumsum = np.concatenate((np.zeros(zeros_shape, dtype=np.float64), cumsum), axis=axis)
        upper = [slice(None), slice(None)]
        lower = [slice(None), slice(None)]
        upper[axis] = slice(width, None)
        lower[axis] = slice(None, -width)
        return ((cumsum[tuple(upper)] - cumsum[tuple(lower)]) / width).astype(np.float32)

    return blur_axis(blur_axis(image, 0), 1)


def gaussian_proxy(image: np.ndarray, radius: int) -> np.ndarray:
    """Three box blurs approximate a Gaussian without scipy."""
    box_radius = max(1, int(round(radius / 1.732)))
    result = image.astype(np.float32, copy=False)
    for _ in range(3):
        result = box_blur(result, box_radius)
    return result


def masked_blur(values: np.ndarray, mask: np.ndarray, radius: int) -> np.ndarray:
    """Blur only source pixels, with normalized weights at transparent edges."""
    weights = gaussian_proxy(mask.astype(np.float32), radius)
    return gaussian_proxy(values * mask, radius) / np.maximum(weights, 1e-5)


def edt_1d(cost: np.ndarray) -> np.ndarray:
    """Squared Euclidean distance transform for one scanline.

    This is the linear-time lower-envelope algorithm.  Keeping it here avoids
    scipy while still measuring actual local feature width rather than blurring
    the alpha channel.
    """
    length = cost.size
    sites = np.empty(length, dtype=np.int32)
    intersections = np.empty(length + 1, dtype=np.float64)
    result = np.empty(length, dtype=np.float64)
    site_count = 0
    sites[0] = 0
    intersections[0] = -np.inf
    intersections[1] = np.inf
    for q in range(1, length):
        while True:
            p = sites[site_count]
            boundary = ((cost[q] + q * q) - (cost[p] + p * p)) / (2.0 * (q - p))
            if boundary > intersections[site_count]:
                break
            site_count -= 1
            if site_count < 0:
                break
        site_count += 1
        sites[site_count] = q
        intersections[site_count] = boundary
        intersections[site_count + 1] = np.inf
    active = 0
    for q in range(length):
        while intersections[active + 1] < q:
            active += 1
        p = sites[active]
        result[q] = (q - p) * (q - p) + cost[p]
    return result


def inside_distance(mask: np.ndarray) -> np.ndarray:
    """Distance from every nontransparent pixel to the transparent exterior."""
    infinity = 1.0e12
    work = np.where(mask, infinity, 0.0)
    horizontal = np.empty_like(work)
    for y in range(work.shape[0]):
        horizontal[y] = edt_1d(work[y])
    vertical = np.empty_like(horizontal)
    for x in range(work.shape[1]):
        vertical[:, x] = edt_1d(horizontal[:, x])
    return np.sqrt(vertical).astype(np.float32)


def percentile(values: np.ndarray, mask: np.ndarray, value: float) -> float:
    selected = values[mask]
    return float(np.percentile(selected, value)) if selected.size else 0.0


def make_height(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """Create a continuous relief field from silhouette and robust shading."""
    inside = alpha > 0.0
    safe_rgb = np.maximum(rgb, 1.0 / 255.0)
    lightness = 0.2126 * safe_rgb[..., 0] + 0.7152 * safe_rgb[..., 1] + 0.0722 * safe_rgb[..., 2]

    # The log ratio discounts slow colour and albedo changes.  Clipping first
    # prevents tiny white highlight blobs from becoming tall needles.
    highlight_cap = percentile(lightness, inside, 98.5)
    capped_lightness = np.minimum(lightness, highlight_cap)
    broad_albedo = masked_blur(capped_lightness, inside, ALBEDO_RADIUS)
    shade = np.log(np.maximum(capped_lightness, 1e-4)) - np.log(np.maximum(broad_albedo, 1e-4))
    low = percentile(shade, inside, 8.0)
    high = percentile(shade, inside, 92.0)
    shade = np.clip((shade - low) / max(high - low, 1e-4), 0.0, 1.0)

    # Colour edges usually belong to dyed wool panels, not a height boundary.
    chroma = safe_rgb / np.maximum(safe_rgb.sum(axis=2, keepdims=True), 1e-4)
    colour_dx = np.max(np.abs(chroma[:, 1:] - chroma[:, :-1]), axis=2)
    colour_dy = np.max(np.abs(chroma[1:, :] - chroma[:-1, :]), axis=2)
    colour_edge = np.zeros_like(lightness)
    colour_edge[:, 1:] = np.maximum(colour_edge[:, 1:], colour_dx)
    colour_edge[1:, :] = np.maximum(colour_edge[1:, :], colour_dy)
    colour_edge = gaussian_proxy(colour_edge, 2)
    colour_suppression = 1.0 / (1.0 + (colour_edge / 0.018) ** 2)
    detail = 0.5 + (shade - 0.5) * 0.38 * colour_suppression

    # This is an alpha distance transform, normalized by a local width field.
    # A narrow string reaches its crown over its own small width, whereas a
    # broad body has a visibly broader felt rim and interior.
    distance = inside_distance(inside)
    local_width = masked_blur(distance, inside, RIM_LOCAL_RADIUS)
    rim = distance / np.maximum(distance + 0.62 * local_width + 0.8, 1e-4)
    rim = np.sqrt(np.clip(rim, 0.0, 1.0))

    height = rim * (0.72 + 0.28 * detail)
    height *= inside
    # Reserve endpoints so the 16-bit map is never clipped inside its surface.
    height = np.where(inside, 0.015 + 0.955 * height, 0.0)
    return height.astype(np.float32)


def make_normals(height: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """Build an OpenGL-convention normal map from the smoothed height field."""
    smooth = gaussian_proxy(height, NORMAL_SMOOTH_RADIUS)
    dx = np.gradient(smooth, axis=1)
    dy_image = np.gradient(smooth, axis=0)
    normal = np.stack((-dx * NORMAL_STRENGTH, dy_image * NORMAL_STRENGTH, np.ones_like(height)), axis=2)
    normal /= np.maximum(np.linalg.norm(normal, axis=2, keepdims=True), 1e-8)
    normal[alpha <= 0.0] = (0.0, 0.0, 1.0)
    return np.clip(np.rint((normal * 0.5 + 0.5) * 255.0), 0, 255).astype(np.uint8)


def preserve_baseline(layer: str) -> None:
    """Copy the prior 8-bit maps exactly once for the regression comparison."""
    baseline = DEPTH / "baseline"
    baseline.mkdir(parents=True, exist_ok=True)
    for suffix in ("height", "normal"):
        source = DEPTH / f"{layer}-{suffix}.png"
        target = baseline / source.name
        if source.exists() and not target.exists():
            shutil.copy2(source, target)


def save_height(path: Path, height: np.ndarray) -> None:
    encoded = np.rint(np.clip(height, 0.0, 1.0) * 65535.0).astype(np.uint16)
    Image.fromarray(encoded).save(path)
    round_trip = np.asarray(Image.open(path))
    if round_trip.dtype != np.uint16 or not np.array_equal(round_trip, encoded):
        raise RuntimeError(f"16-bit PNG round trip failed for {path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--layer", choices=LAYERS, action="append", help="Regenerate only one named layer")
    args = parser.parse_args()
    DEPTH.mkdir(parents=True, exist_ok=True)
    for layer in args.layer or LAYERS:
        preserve_baseline(layer)
        source = Image.open(BRAND / f"{layer}@2x.png").convert("RGBA")
        pixels = np.asarray(source, dtype=np.float32) / 255.0
        height = make_height(pixels[..., :3], pixels[..., 3])
        save_height(DEPTH / f"{layer}-height.png", height)
        Image.fromarray(make_normals(height, pixels[..., 3]), mode="RGB").save(DEPTH / f"{layer}-normal.png")
        print(f"{layer}: height 16-bit, normal OpenGL, range {height.min():.4f} to {height.max():.4f}")


if __name__ == "__main__":
    main()
