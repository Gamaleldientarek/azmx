#!/usr/bin/env python3
"""Vendor the Hugeicons free set into assets/icons/stroke-rounded as flat SVG files.

Usage:
    python3 scripts/vendor-hugeicons.py            # vendor the pinned version
    python3 scripts/vendor-hugeicons.py 4.3.0      # vendor a specific version

Source of truth is the npm package `@hugeicons/core-free-icons`, which is MIT
licensed and contains the Stroke Rounded style only. Every other Hugeicons style
(Solid, Duotone, Twotone, Bulk) and type (Sharp, Standard) is Pro and is NOT
redistributable — do not add them to this repository.

The package ships each icon as a small JS array of SVG element descriptors
rather than as .svg files. This script converts them:

    ["path", { d: "...", stroke: "currentColor", strokeWidth: "1.5", key: "0" }]
      ->  <path d="..." stroke="currentColor" stroke-width="1.5"/>

Export names are PascalCase (`ArrowDown01Icon`); Figma and the Hugeicons site
use kebab-case (`arrow-down-01`). Filenames use kebab-case so they match the
component names in the Colab Figma library exactly.

Nothing is written outside assets/icons/. Requires node/npm on PATH for the
download step only; no node_modules is created in the repo.

Run scripts/rebuild-icon-index.py afterwards to regenerate the index.
"""
import os
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile

PINNED = "4.2.3"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "icons", "stroke-rounded")
META = os.path.join(ROOT, "assets", "icons")

# camelCase React prop -> SVG attribute. `key` is a React artefact and is dropped.
ATTR = {
    "strokeWidth": "stroke-width",
    "strokeLinecap": "stroke-linecap",
    "strokeLinejoin": "stroke-linejoin",
    "strokeDasharray": "stroke-dasharray",
    "strokeMiterlimit": "stroke-miterlimit",
    "fillRule": "fill-rule",
    "clipRule": "clip-rule",
}
DROP = {"key"}

ELEMENT_RE = re.compile(r'\["(\w+)",\s*\{(.*?)\}\]', re.S)
BODY_RE = re.compile(r"=\s*\[(.*)\];", re.S)
PROP_RE = re.compile(r'(\w+):\s*"((?:[^"\\]|\\.)*)"')

MIT = """MIT License

Copyright (c) 2025 Hugeicons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

The MIT licence above is the licence of the Hugeicons free set, taken verbatim
from https://github.com/hugeicons/hugeicons/blob/main/LICENSE.md. It covers the
Stroke Rounded style only — the style vendored in this directory.

Hugeicons Pro styles (Solid, Duotone, Twotone, Bulk) and Pro types (Sharp,
Standard) are NOT covered by this licence and are NOT redistributed here. They
require a Hugeicons Pro licence: https://hugeicons.com/license-agreement
"""


def to_kebab(export_name):
    """ArrowDown01Icon -> arrow-down-01"""
    n = export_name[:-4] if export_name.endswith("Icon") else export_name
    n = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "-", n)
    n = re.sub(r"(?<=[A-Z])(?=[A-Z][a-z])", "-", n)
    n = re.sub(r"(?<=[A-Za-z])(?=[0-9])", "-", n)
    return n.lower()


def fetch(version, workdir):
    """npm pack the pinned version into workdir and return the extracted package dir."""
    spec = "@hugeicons/core-free-icons@%s" % version
    print("Downloading %s" % spec)
    try:
        subprocess.run(["npm", "pack", spec], cwd=workdir, check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    except FileNotFoundError:
        sys.exit("npm is required on PATH to download the package.")
    except subprocess.CalledProcessError as exc:
        sys.exit("npm pack failed:\n%s" % exc.stderr.decode("utf-8", "replace"))
    tgz = [f for f in os.listdir(workdir) if f.endswith(".tgz")]
    if not tgz:
        sys.exit("npm pack produced no tarball.")
    with tarfile.open(os.path.join(workdir, tgz[0])) as tf:
        try:
            tf.extractall(workdir, filter="data")
        except TypeError:  # Python < 3.12
            tf.extractall(workdir)
    esm = os.path.join(workdir, "package", "dist", "esm")
    if not os.path.isdir(esm):
        sys.exit("Unexpected package layout: %s missing." % esm)
    return esm


def convert(js):
    """Turn one icon module's source into a single-line SVG string."""
    body = BODY_RE.search(js)
    if not body:
        return None
    parts = []
    for el in ELEMENT_RE.finditer(body.group(1)):
        tag = el.group(1)
        attrs = []
        for prop in PROP_RE.finditer(el.group(2)):
            name, value = prop.group(1), prop.group(2)
            if name in DROP:
                continue
            attrs.append('%s="%s"' % (ATTR.get(name, name), value))
        parts.append("<%s %s/>" % (tag, " ".join(attrs)) if attrs else "<%s/>" % tag)
    if not parts:
        return None
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" '
            'viewBox="0 0 24 24" fill="none">%s</svg>\n' % "".join(parts))


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else PINNED
    workdir = tempfile.mkdtemp(prefix="hugeicons-")
    try:
        esm = fetch(version, workdir)
        modules = sorted(f for f in os.listdir(esm) if f.endswith("Icon.js"))
        if not modules:
            sys.exit("No icon modules found in the package.")
        if os.path.isdir(OUT):
            shutil.rmtree(OUT)
        os.makedirs(OUT)
        written, skipped, seen = 0, [], {}
        for module in modules:
            export = module[:-3]
            with open(os.path.join(esm, module)) as fh:
                svg = convert(fh.read())
            if svg is None:
                skipped.append(export)
                continue
            name = to_kebab(export)
            if name in seen:
                skipped.append("%s (kebab collision with %s)" % (export, seen[name]))
                continue
            seen[name] = export
            with open(os.path.join(OUT, name + ".svg"), "w") as fh:
                fh.write(svg)
            written += 1
        with open(os.path.join(META, "LICENSE"), "w") as fh:
            fh.write(MIT)
        with open(os.path.join(META, "VERSION"), "w") as fh:
            fh.write("@hugeicons/core-free-icons@%s\n" % version)
    finally:
        shutil.rmtree(workdir, ignore_errors=True)

    size = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
    print("  %d icons written to assets/icons/stroke-rounded" % written)
    print("  %.2f MB on disk" % (size / 1048576.0))
    if skipped:
        print("  %d skipped: %s" % (len(skipped), ", ".join(skipped[:10])))
    print("\nNow run:  python3 scripts/rebuild-icon-index.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
