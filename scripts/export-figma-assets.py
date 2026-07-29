#!/usr/bin/env python3
"""
Export the Majarah raster asset library from Figma to assets/.

The logo SVGs are already vendored in assets/logo/. This script pulls the
decorative rasters — galaxy backgrounds, planets, the space photograph — which
are too large to keep in git by default (~6 MB at 2x).

Node IDs are hard-coded from the Majarah Library, so this works without a live
Figma session or the Desktop Bridge.

Requires a Figma personal access token:
    figma.com -> Settings -> Security -> Personal access tokens

Usage
-----
    export FIGMA_TOKEN=figd_...
    python3 export-figma-assets.py                # all groups at 2x
    python3 export-figma-assets.py --scale 4      # higher resolution
    python3 export-figma-assets.py --only backgrounds
    python3 export-figma-assets.py --list         # print the manifest, fetch nothing

The script reads FIGMA_TOKEN, or falls back to FIGMA_ACCESS_TOKEN / FIGMA_API_KEY.
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

FILE_KEY = "AH4vTz9MkdX6QNA6uYNfYA"
API = "https://api.figma.com/v1"

# node id -> (group/subdirectory, filename slug)
ASSETS = {
    # Galaxy Bks — component set 1:487
    "1:483": ("backgrounds", "galaxy-01-vortex"),
    "1:484": ("backgrounds", "galaxy-02-nebula"),
    "1:485": ("backgrounds", "galaxy-03-holographic"),
    "1:486": ("backgrounds", "galaxy-04-iridescent"),
    # Planets — component set 1:494
    "1:493": ("planets", "planet-subtle-blue"),
    "1:492": ("planets", "planet-main-purple"),
    "1:491": ("planets", "planet-blue-vivid"),
    "1:490": ("planets", "planet-moon"),
    "1:489": ("planets", "planet-orange-white"),
    "1:488": ("planets", "planet-mars"),
    "2:35":  ("planets", "planet-earth-blue"),
    "2:33":  ("planets", "planet-earth-dark"),
    "2:32":  ("planets", "planet-earth-violet"),
    "2:34":  ("planets", "planet-earth-magenta"),
    "2:36":  ("planets", "planet-earth-cyan"),
    "2:38":  ("planets", "planet-purple-glow"),
    "2:39":  ("planets", "planet-purple-vector"),
    "2:45":  ("planets", "planet-venus"),
    "2:46":  ("planets", "planet-detailed"),
    # Space — component set 2:42
    "2:41":  ("space", "space-01-fullbleed"),
}

# Variants that sit outside the purple system. Flagged, not withheld —
# see references/logo-and-assets.md for when they are usable.
OFF_PALETTE = {
    "1:485": "holographic — magenta/cyan/yellow",
    "1:486": "iridescent — orange streak",
    "1:489": "orange/white",
    "1:488": "mars — red/brown",
    "2:34":  "magenta cast",
    "2:36":  "cyan cast",
}


def token():
    for var in ("FIGMA_TOKEN", "FIGMA_ACCESS_TOKEN", "FIGMA_API_KEY"):
        t = os.environ.get(var, "").strip()
        if t:
            return t
    sys.exit(
        "error: no Figma token found.\n"
        "  Set one:  export FIGMA_TOKEN=figd_...\n"
        "  Get one:  figma.com -> Settings -> Security -> Personal access tokens\n"
        "  Note: the tokens in the local MCP config were expired as of 2026-07-29."
    )


def get_json(url, tok):
    req = urllib.request.Request(url, headers={"X-Figma-Token": tok})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")[:300]
        sys.exit(f"error: Figma API returned HTTP {e.code}\n  {body}")
    except urllib.error.URLError as e:
        sys.exit(f"error: cannot reach the Figma API: {e.reason}")


def main():
    ap = argparse.ArgumentParser(description="Export Majarah rasters from Figma")
    ap.add_argument("--scale", type=int, default=2, choices=[1, 2, 3, 4],
                    help="render scale (default 2)")
    ap.add_argument("--only", choices=["backgrounds", "planets", "space"],
                    help="export a single group")
    ap.add_argument("--out", default=None,
                    help="output root (default: ../assets relative to this script)")
    ap.add_argument("--list", action="store_true",
                    help="print the manifest and exit without fetching")
    a = ap.parse_args()

    wanted = {k: v for k, v in ASSETS.items()
              if a.only is None or v[0] == a.only}

    if a.list:
        print(f"\n  Majarah raster manifest — {len(wanted)} nodes\n")
        for nid, (grp, slug) in sorted(wanted.items(), key=lambda t: (t[1][0], t[1][1])):
            flag = f"   [off-palette: {OFF_PALETTE[nid]}]" if nid in OFF_PALETTE else ""
            print(f"    {nid:8} {grp:12} {slug}{flag}")
        print()
        return 0

    out_root = Path(a.out) if a.out else Path(__file__).resolve().parent.parent / "assets"
    tok = token()

    ids = ",".join(wanted)
    print(f"  requesting {len(wanted)} nodes at {a.scale}x ...")
    data = get_json(f"{API}/images/{FILE_KEY}?ids={ids}&format=png&scale={a.scale}", tok)

    if data.get("err"):
        sys.exit(f"error: Figma API: {data['err']}\n"
                 f"  'Token expired' means exactly that — generate a fresh one.")

    images = data.get("images", {})
    ok = fail = 0
    total_bytes = 0

    for nid, (grp, slug) in sorted(wanted.items(), key=lambda t: (t[1][0], t[1][1])):
        url = images.get(nid)
        if not url:
            print(f"    MISS {nid:8} {slug} — no render URL returned")
            fail += 1
            continue
        dest_dir = out_root / grp
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / f"{slug}@{a.scale}x.png"
        try:
            with urllib.request.urlopen(url, timeout=180) as r:
                blob = r.read()
        except Exception as e:
            print(f"    FAIL {nid:8} {slug} — {e}")
            fail += 1
            continue
        dest.write_bytes(blob)
        total_bytes += len(blob)
        note = "  (off-palette)" if nid in OFF_PALETTE else ""
        print(f"    ok   {grp}/{dest.name}  {len(blob)/1024:.0f} KB{note}")
        ok += 1

    print(f"\n  {ok} exported, {fail} failed, {total_bytes/1_048_576:.1f} MB total")
    print(f"  -> {out_root}\n")
    if ok and total_bytes > 20 * 1_048_576:
        print("  note: that is a lot of binary for a git repo. Consider committing only\n"
              "        the on-palette variants, or leaving assets/{planets,space} ignored.\n")
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
