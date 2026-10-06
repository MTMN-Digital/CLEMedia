#!/usr/bin/env python3
"""Fetch the hero's 3D assets from Poly Haven, and record where each came from.

WHY THESE AND NOT GEOMETRY. The first version of this set was built out of
cylinders, cones and spheres with flat colours and one hard light, which is the
floor of what a real-time renderer looks like rather than the ceiling. The two
things that move it furthest, in order, are an HDRI used as image based
lighting and real scanned plants. A scanned fern has translucency, a bent
spine and leaf litter around its base; a hundred instanced spheres never will.

EVERYTHING HERE IS CC0. Poly Haven publishes its whole library public domain,
so there is no attribution requirement and nothing to track at build time. The
credits file is written anyway: a client site should be able to answer where
every pixel came from, and the next person to touch this should not have to
guess whether an asset was safe to ship.

Run from the repo root:  python3 scripts/fetch-hero-assets.py
It is idempotent. Files already present are left alone unless --force.
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.request
from pathlib import Path

API = "https://api.polyhaven.com"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "hero3d"
UA = {"User-Agent": "cle-media asset fetch (contact: mtmn.ie)"}

# One lamp for the whole scene. A photographic studio HDRI, warm, low contrast,
# so the key has a real softbox shape in its highlights instead of the point
# specular a single SpotLight gives every object on the set.
HDRIS = [("brown_photostudio_02", "1k")]

# Maps actually used. Displacement is skipped: the geometry is already real,
# and a 1k displacement map is a megabyte spent on something no camera move
# here is close enough to see.
TEXTURE_MAPS = ("Diffuse", "nor_gl", "Rough", "AO")
TEXTURES = [
    # The board the garden stands on, and the cut face the headline lands on.
    ("plywood", "1k"),
    # The rig, the stands, the hardware.
    ("metal_plate", "1k"),
]

# Real plants, rocks and cable. Instanced many times each, so one download
# dresses a whole bank.
MODELS = [
    ("grass_medium_01", "1k"),
    ("fern_02", "1k"),
    ("celandine_01", "1k"),
    ("boulder_01", "1k"),
    ("dry_branches_medium_01", "1k"),
]


def fetch_json(url: str):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def download(url: str, dest: Path, force: bool) -> int:
    if dest.exists() and not force:
        return dest.stat().st_size
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=300) as r, open(dest, "wb") as f:
        data = r.read()
        f.write(data)
    return len(data)


def record(credits: list, slug: str, kind: str) -> None:
    info = fetch_json(f"{API}/info/{slug}")
    credits.append(
        {
            "slug": slug,
            "kind": kind,
            "name": info.get("name", slug),
            "authors": list((info.get("authors") or {}).keys()),
            "licence": "CC0",
            "source": f"https://polyhaven.com/a/{slug}",
        }
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    credits: list = []
    total = 0

    for slug, res in HDRIS:
        files = fetch_json(f"{API}/files/{slug}")
        entry = files["hdri"][res]["hdr"]
        n = download(entry["url"], OUT / "hdri" / f"{slug}_{res}.hdr", args.force)
        total += n
        record(credits, slug, "hdri")
        print(f"hdri    {slug:28s} {n // 1024:6d} KB")

    for slug, res in TEXTURES:
        files = fetch_json(f"{API}/files/{slug}")
        for m in TEXTURE_MAPS:
            node = files.get(m)
            if not node:
                print(f"  (texture {slug} has no {m} map, skipped)", file=sys.stderr)
                continue
            fmt = "jpg" if "jpg" in node[res] else next(iter(node[res]))
            entry = node[res][fmt]
            n = download(entry["url"], OUT / "tex" / slug / f"{m}.{fmt}", args.force)
            total += n
            print(f"tex     {slug + '/' + m:28s} {n // 1024:6d} KB")
        record(credits, slug, "texture")

    for slug, res in MODELS:
        files = fetch_json(f"{API}/files/{slug}")
        entry = files["gltf"][res]["gltf"]
        base = OUT / "model" / slug
        n = download(entry["url"], base / Path(entry["url"]).name, args.force)
        total += n
        for rel, sub in (entry.get("include") or {}).items():
            n2 = download(sub["url"], base / rel, args.force)
            total += n2
            n += n2
        record(credits, slug, "model")
        print(f"model   {slug:28s} {n // 1024:6d} KB")

    (OUT / "CREDITS.json").write_text(json.dumps(credits, indent=2) + "\n")

    lines = [
        "# Third party assets in the hero",
        "",
        "Every asset below is **CC0** (public domain). No attribution is required",
        "and none of it constrains how this site is used. It is listed so the",
        "client can answer where every pixel came from, and so the next person to",
        "touch the hero does not have to guess what is safe to ship.",
        "",
        "Regenerate with `python3 scripts/fetch-hero-assets.py`.",
        "",
        "| Asset | Kind | Author | Licence | Source |",
        "|---|---|---|---|---|",
    ]
    for c in credits:
        who = ", ".join(c["authors"]) or "Poly Haven"
        lines.append(
            f"| {c['name']} | {c['kind']} | {who} | {c['licence']} | {c['source']} |"
        )
    (OUT / "ASSET-LICENCES.md").write_text("\n".join(lines) + "\n")

    print(f"\n{len(credits)} assets, {total // 1024 // 1024} MB raw, in {OUT}")
    print("Now run scripts/optimise-hero-assets.py to shrink them for the web.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
