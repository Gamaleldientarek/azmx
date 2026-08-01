#!/usr/bin/env python3
"""Rebuild references/icon-index.md and references/icon-index/*.md from assets/icons.

Usage:
    python3 scripts/rebuild-icon-index.py

Run this after adding, removing, or re-vendoring icons (see
scripts/vendor-hugeicons.py). It walks every style directory under assets/icons,
writes one alphabetical shard per letter, and writes the hub index that points
at them. One flat index of 5,000+ rows is unreadable, so the set is sharded;
letters above SHARD_MAX are split into numbered parts.

No dependencies beyond the standard library.
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = os.path.join(ROOT, "assets", "icons")
REFS = os.path.join(ROOT, "references")
SHARDS = os.path.join(REFS, "icon-index")
RAW = ("https://raw.githubusercontent.com/Gamaleldientarek/"
       "colab-design-skill/main/assets/icons")

SHARD_MAX = 450

STYLES = {
    "stroke-rounded": (
        "Stroke Rounded",
        "The only style Colab uses and the only style Hugeicons licenses MIT. "
        "24x24 grid, 1.5px stroke, round caps and joins, `currentColor`.",
    ),
}


def read_version():
    path = os.path.join(ICONS, "VERSION")
    if os.path.exists(path):
        with open(path) as fh:
            return fh.read().strip()
    return "unknown"


def collect(style):
    d = os.path.join(ICONS, style)
    if not os.path.isdir(d):
        return []
    return sorted(f[:-4] for f in os.listdir(d) if f.endswith(".svg"))


def shard_key(name):
    """Group by first alphabetic character; digits and symbols land in `0-9`."""
    c = name[0].lower()
    return c if c.isalpha() else "0-9"


def build_shards(names):
    """-> [(shard_id, [names])] in alphabetical order, oversized letters split."""
    groups = {}
    for n in names:
        groups.setdefault(shard_key(n), []).append(n)
    out = []
    for key in sorted(groups, key=lambda k: (k == "0-9" and " " or k)):
        rows = groups[key]
        if len(rows) <= SHARD_MAX:
            out.append((key, rows))
            continue
        parts = (len(rows) + SHARD_MAX - 1) // SHARD_MAX
        size = (len(rows) + parts - 1) // parts
        for i in range(parts):
            chunk = rows[i * size:(i + 1) * size]
            if chunk:
                out.append(("%s-%d" % (key, i + 1), chunk))
    return out


def write_shard(style, shard_id, names, version):
    title = STYLES[style][0]
    lines = [
        "# Colab Icon Index — `%s` (%d)\n" % (shard_id, len(names)),
        "Hugeicons %s, `%s`. Part of `references/icon-index.md` — read that first "
        "for the house rules and the URL pattern.\n" % (title, version),
        "Range `%s` &rarr; `%s`. Every row is one Figma component named exactly as "
        "listed, at `Type=Rounded` `Style=Stroke`.\n" % (names[0], names[-1]),
        "| Icon | Download |",
        "|---|---|",
    ]
    for n in names:
        lines.append("| `%s` | [svg](%s/%s/%s.svg) |" % (n, RAW, style, n))
    lines.append("")
    path = os.path.join(SHARDS, "%s.md" % shard_id)
    with open(path, "w") as fh:
        fh.write("\n".join(lines))
    return path


def write_hub(style, names, shards, version):
    title, blurb = STYLES[style]
    lines = [
        "# Colab Icon Index\n",
        "Every icon vendored in this repository: **{:,}** Hugeicons {} SVGs, "
        "pinned to `{}`, MIT licensed.\n".format(len(names), title, version),
        "%s\n" % blurb,
        "**No other Hugeicons style or type is vendored here.** Solid, Duotone, "
        "Twotone and Bulk styles, and the Sharp and Standard types, are Hugeicons "
        "Pro and are not redistributable. See `references/icons.md` for what to do "
        "when a design calls for Solid.\n",
        "For the house rules — Rounded-only, Stroke-default, the colour law, sizes, "
        "and the 43-icon proven working set — read **`references/icons.md`**. This "
        "file is a generated lookup table and nothing more.\n",
        "---\n",
        "## Downloading\n",
        "Every URL is derivable from the icon name. There is no need to look a name "
        "up in the tables below if you already know it:\n",
        "```text\n%s/%s/<icon-name>.svg\n```\n" % (RAW, style),
        "```bash\ncurl -L -O \"%s/%s/arrow-right-02.svg\"\n```\n" % (RAW, style),
        "Grab several at once:\n",
        "```bash\nfor i in arrow-right-02 checkmark-circle-01 information-circle; do\n"
        "  curl -sL -O \"%s/%s/$i.svg\"\ndone\n```\n" % (RAW, style),
        "Each file is a bare 24x24 `viewBox` with `stroke=\"currentColor\"` and no "
        "metadata. Inline in HTML and it inherits `color`. Import into Figma, "
        "PowerPoint or Illustrator and `currentColor` resolves to black — set the "
        "stroke to the surface's icon colour immediately after placing.\n",
        "---\n",
        "## Shards\n",
        "{:,} rows in one file is unreadable, so the index is split by the first "
        "letter of the icon name. Letters longer than {} rows are split into "
        "numbered parts.\n".format(len(names), SHARD_MAX),
        "| Shard | Icons | Range |",
        "|---|---|---|",
    ]
    for shard_id, rows in shards:
        lines.append("| [`%s`](icon-index/%s.md) | %d | `%s` &rarr; `%s` |"
                     % (shard_id, shard_id, len(rows), rows[0], rows[-1]))
    lines += [
        "",
        "To search the whole set by name from a checkout:\n",
        "```bash\nls assets/icons/%s | grep chart\n```\n" % style,
        "---\n",
        "Regenerate this file and every shard with `python3 "
        "scripts/rebuild-icon-index.py`. Do not edit either by hand.\n",
    ]
    with open(os.path.join(REFS, "icon-index.md"), "w") as fh:
        fh.write("\n".join(lines))


def main():
    styles = [s for s in STYLES if os.path.isdir(os.path.join(ICONS, s))]
    if not styles:
        print("No icon styles found under assets/icons/. "
              "Run scripts/vendor-hugeicons.py first.")
        return 1
    if len(styles) > 1:
        print("More than one style directory found; this script indexes one. "
              "Extend write_hub() before adding a second.")
        return 1
    style = styles[0]
    names = collect(style)
    if not names:
        print("No .svg files under assets/icons/%s/" % style)
        return 1
    version = read_version()

    if os.path.isdir(SHARDS):
        for f in os.listdir(SHARDS):
            if f.endswith(".md"):
                os.remove(os.path.join(SHARDS, f))
    else:
        os.makedirs(SHARDS)

    shards = build_shards(names)
    for shard_id, rows in shards:
        write_shard(style, shard_id, rows, version)
    write_hub(style, names, shards, version)

    indexed = sum(len(r) for _, r in shards)
    print("  style      %s" % style)
    print("  version    %s" % version)
    print("  on disk    %d svg" % len(names))
    print("  indexed    %d rows across %d shards" % (indexed, len(shards)))
    if indexed != len(names):
        print("  MISMATCH — index does not cover every file on disk")
        return 1
    print("\nRebuilt references/icon-index.md and references/icon-index/.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
