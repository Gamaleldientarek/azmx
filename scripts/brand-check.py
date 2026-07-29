#!/usr/bin/env python3
"""
Majarah brand checker.

Validates colours and colour pairings against the official Majarah palette.
The Majarah ramp is monochromatic, so almost every purple-on-purple pairing
fails WCAG. This script exists so you never have to guess which ones.

Usage
-----
  # Show the full contrast matrix and per-ground verdicts
  python3 brand-check.py --matrix

  # Check one pairing
  python3 brand-check.py --pair Purple/300 Purple/900
  python3 brand-check.py --pair '#6500E8' '#210054'

  # Scan a file (HTML/CSS/SVG/JS/MD) for off-palette hex values
  python3 brand-check.py --scan path/to/file.html

  # Check a foreground at a given size against a ground
  python3 brand-check.py --pair Purple/300 Purple/900 --size 180 --bold

Exit codes: 0 = pass, 1 = at least one failure.
"""

import argparse
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------- palette

PALETTE = {
    "Neutral/White":       "#FFFFFF",
    "Neutral/Subtle Grey": "#D1D1D1",
    "Brand/Purple/200":    "#B671FF",
    "Brand/Purple/300":    "#6500E8",
    "Brand/Purple/500*":   "#4B0AA0",
    "Brand/Purple/600":    "#380089",
    "Brand/Purple/900":    "#210054",
    "Neutral/Grey*":       "#231F20",
    "Brand/Blue/300":      "#010CFF",
    "Brand/Blue/600":      "#0000AD",
    "Brand/Blue/900":      "#020068",
}

# short aliases so you can type Purple/300 instead of Brand/Purple/300
ALIASES = {}
for full in PALETTE:
    short = full.split("/", 1)[1] if "/" in full else full
    ALIASES[short.lower()] = full
    ALIASES[full.lower()] = full
    ALIASES[short.rstrip("*").lower()] = full

GROUNDS = ["Brand/Purple/900", "Brand/Purple/600", "Brand/Purple/500*",
           "Brand/Purple/200", "Neutral/White"]
FOREGROUNDS = ["Neutral/White", "Neutral/Subtle Grey", "Brand/Purple/200",
               "Brand/Purple/300", "Brand/Purple/500*", "Brand/Purple/600",
               "Brand/Purple/900"]

# Purple/300 is licensed as a display accent above this size on dark grounds.
DISPLAY_LICENCE_PT = 90

# ...but only down to this ratio. Purple/300 on Purple/900 is 2.28:1 and reads as
# a deliberate tonal drop at 180pt. Purple/900 on Purple/500 is 1.55:1 and reads
# as nothing at any size. The floor is what separates the house move from the bug.
DISPLAY_LICENCE_FLOOR = 2.0

HEX_RE = re.compile(r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b")


# ---------------------------------------------------------------- colour math

def _norm(hex_str):
    h = hex_str.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        raise ValueError(f"not a hex colour: {hex_str}")
    return "#" + h.upper()


def luminance(hex_str):
    h = _norm(hex_str).lstrip("#")
    chans = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]

    def lin(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (lin(c) for c in chans)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def resolve(token):
    """Accept a variable name, an alias, or a raw hex. Return (name, hex)."""
    key = token.strip().lower()
    if key in ALIASES:
        name = ALIASES[key]
        return name, PALETTE[name]
    try:
        h = _norm(token)
    except ValueError:
        raise SystemExit(f"error: unknown colour '{token}'. "
                         f"Use a hex value or one of: "
                         f"{', '.join(sorted(k.split('/')[-1] for k in PALETTE))}")
    for name, val in PALETTE.items():
        if val == h:
            return name, h
    return f"off-palette {h}", h


def verdict(ratio, size_pt=None, bold=False):
    """WCAG verdict. Large-text threshold is >=18pt bold or >=24pt regular."""
    is_large = size_pt is not None and (
        (bold and size_pt >= 18) or (not bold and size_pt >= 24))
    if ratio >= 7.0:
        return "PASS", "AAA body"
    if ratio >= 4.5:
        return "PASS", "AA body"
    if ratio >= 3.0:
        if size_pt is None:
            return "WARN", "AA large only (>=18pt bold / >=24pt regular)"
        return ("PASS", "AA large") if is_large else ("FAIL", "below AA body at this size")
    if (size_pt is not None and size_pt >= DISPLAY_LICENCE_PT
            and ratio >= DISPLAY_LICENCE_FLOOR):
        return "WARN", (f"display licence only (>={DISPLAY_LICENCE_PT}pt, >={DISPLAY_LICENCE_FLOOR}:1) "
                        f"— decorative tonal drop, never readable text")
    if ratio < DISPLAY_LICENCE_FLOOR:
        return "FAIL", f"invisible ({ratio:.2f}:1) — below the {DISPLAY_LICENCE_FLOOR}:1 floor at any size"
    return "FAIL", "fails the 3.0 non-text floor"


# ---------------------------------------------------------------- commands

C = {"PASS": "\033[32m", "WARN": "\033[33m", "FAIL": "\033[31m",
     "DIM": "\033[2m", "B": "\033[1m", "R": "\033[0m"}


def _c(tag, text):
    return f"{C.get(tag,'')}{text}{C['R']}" if sys.stdout.isatty() else text


def cmd_matrix():
    print(_c("B", "\nMAJARAH CONTRAST MATRIX — foreground (rows) on ground (columns)\n"))
    head = f"{'':22}" + "".join(f"{g.split('/')[-1]:>13}" for g in GROUNDS)
    print(head)
    print("-" * len(head))
    for f in FOREGROUNDS:
        row = f"{f.split('/', 1)[-1]:22}"
        for g in GROUNDS:
            r = contrast(PALETTE[f], PALETTE[g])
            cell = f"{r:>13.2f}"
            tag = "PASS" if r >= 4.5 else "WARN" if r >= 3.0 else "FAIL"
            row += _c(tag, cell)
        print(row)

    print(_c("DIM", "\n  >=4.5 AA body   >=3.0 AA large / non-text floor   <3.0 display licence at best\n"))

    print(_c("B", "PER-GROUND ROLE ASSIGNMENTS\n"))
    for g in GROUNDS:
        usable = [(f, contrast(PALETTE[f], PALETTE[g])) for f in FOREGROUNDS if f != g]
        body = [f.split('/')[-1] for f, r in usable if r >= 4.5]
        large = [f.split('/')[-1] for f, r in usable if 3.0 <= r < 4.5]
        print(f"  {_c('B', g)}  {PALETTE[g]}")
        print(f"    body text : {', '.join(body) if body else _c('FAIL','none')}")
        print(f"    large only: {', '.join(large) if large else '-'}")
        print()
    return 0


def cmd_pair(fg, bg, size_pt, bold):
    fname, fhex = resolve(fg)
    gname, ghex = resolve(bg)
    r = contrast(fhex, ghex)
    tag, why = verdict(r, size_pt, bold)

    print(f"\n  foreground  {fname:24} {fhex}")
    print(f"  ground      {gname:24} {ghex}")
    if size_pt:
        print(f"  size        {size_pt}pt{' bold' if bold else ''}")
    print(f"  contrast    {_c('B', f'{r:.2f}:1')}")
    print(f"  verdict     {_c(tag, tag)} — {why}\n")

    if tag != "PASS":
        alts = sorted(
            ((f, contrast(PALETTE[f], ghex)) for f in FOREGROUNDS
             if PALETTE[f] != ghex and contrast(PALETTE[f], ghex) >= 4.5),
            key=lambda t: -t[1])
        if alts:
            print("  usable foregrounds on this ground:")
            for f, ar in alts:
                print(f"    {f.split('/',1)[-1]:22} {ar:6.2f}:1")
            print()
    return 0 if tag == "PASS" else 1


def cmd_scan(path):
    p = Path(path)
    if not p.exists():
        raise SystemExit(f"error: no such file: {path}")
    on = {v: k for k, v in PALETTE.items()}
    found, bad = {}, 0
    for n, line in enumerate(p.read_text(errors="replace").splitlines(), 1):
        for m in HEX_RE.findall(line):
            h = _norm(m)
            found.setdefault(h, []).append(n)

    if not found:
        print(f"\n  no hex colours found in {p.name}\n")
        return 0

    print(f"\n{_c('B', f'SCAN {p.name}')} — {len(found)} distinct hex values\n")
    for h, lines in sorted(found.items(), key=lambda t: -len(t[1])):
        where = ",".join(str(x) for x in lines[:6]) + ("…" if len(lines) > 6 else "")
        if h in on:
            print(f"  {_c('PASS','ok  ')} {h}  {on[h]:24} line {where}")
        else:
            bad += 1
            near = min(PALETTE.items(), key=lambda kv: abs(luminance(kv[1]) - luminance(h)))
            print(f"  {_c('FAIL','OFF ')} {h}  {'not in palette':24} line {where}")
            print(f"       {_c('DIM', f'nearest by luminance: {near[0]} {near[1]}')}")
    print()
    if bad:
        print(_c("FAIL", f"  {bad} off-palette value(s). Majarah is 100% variable-bound — "
                         f"there should be no raw hex.\n"))
    return 1 if bad else 0


def main():
    ap = argparse.ArgumentParser(description="Majarah brand and contrast checker")
    ap.add_argument("--matrix", action="store_true", help="print the full contrast matrix")
    ap.add_argument("--pair", nargs=2, metavar=("FG", "BG"), help="check one pairing")
    ap.add_argument("--scan", metavar="FILE", help="scan a file for off-palette hex")
    ap.add_argument("--size", type=float, help="foreground size in pt (for --pair)")
    ap.add_argument("--bold", action="store_true", help="foreground is bold (for --pair)")
    a = ap.parse_args()

    if a.matrix:
        return cmd_matrix()
    if a.pair:
        return cmd_pair(a.pair[0], a.pair[1], a.size, a.bold)
    if a.scan:
        return cmd_scan(a.scan)
    ap.print_help()
    return 0


if __name__ == "__main__":
    sys.exit(main())
