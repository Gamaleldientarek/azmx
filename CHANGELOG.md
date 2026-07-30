# Changelog

## 1.1.0 — 2026-07-30

Vendors the display font. The v1 skill documented Oswald thoroughly and shipped none of it.

### What changed

- **`assets/fonts/oswald/`** — six static TTFs, six WOFF2, `Oswald[wght].ttf`, and `OFL.txt`
- **`references/typography.md`** — new *Getting the fonts* section: sourcing, a rebuild recipe, the variable-font collision, and a verification command

### Why

Oswald was **not installed on the build machine** — not in `~/Library/Fonts`, `/Library/Fonts`, `/System/Library/Fonts`, or Adobe's font support directory. Helvetica Now Display (20 faces) and FF Shamel (4 faces) were both present; the display font, which carries every headline from 130pt to 200pt, was not.

Figma hid it. Oswald is a Google Font, so Figma serves it from its own library and the deck renders correctly in the browser. Every build path that leaves Figma — HTML, pdfmake, python-pptx, any local render — falls back silently. The skill's own rule in `rtl-arabic.md` covers exactly this case: *"A variable pointing at an uninstalled face fails silently and falls back. Never assume."* The display font was violating it.

### The collision worth knowing

`Oswald[wght].ttf` declares PostScript name **`Oswald-Regular`** — identical to the static Regular. Installing both registers a phantom second family enumerating as `Oswald Regular Bold`, `Oswald Regular Medium`, `Oswald Regular SemiBold`, and the resolver picks between colliding faces nondeterministically. Install the six statics only. The variable font stays vendored for web use.

Statics were cut from the variable font with `updateFontNames=True`, which sets `ID16 = Oswald` on the four non-RIBBI weights so the family resolves as one Oswald with six styles. Verified: `system_profiler` reports exactly six faces, no phantom entries.

### Still not vendored

Helvetica Now Display and FF Shamel Family are commercial Monotype licences and remain install-from-your-own-licence. The `azmx-brand` skill vendors AzmX and thmanyah; whether to do the same here is an open call, not an oversight.

## 1.0.0 — 2026-07-30

First release. Built from a live audit of `Majarah Library` rather than from the prose build guides, which turned out to matter.

### What's in it

- **`SKILL.md`** — palette, type system, grid and chrome, guardrails, working method
- **Twelve reference files** covering colour, tokens, variable architecture, typography, layout archetypes, the measured slide library, logo and assets, editorial technique, Figma workflow, Arabic/RTL, voice, and the decision log
- **Six logo SVGs** vendored in `assets/logo/`, byte-verified against the Figma components
- **`scripts/brand-check.py`** — contrast checker with the palette embedded, plus an off-palette hex scanner
- **`scripts/export-figma-assets.py`** — pulls the twenty raster assets from Figma by hard-coded node ID

### What the audit found

All eighteen frames of the v1 deck were read via the Desktop Bridge, plus both variable collections, all four style categories, and screenshots of the four slides most likely to be broken.

**The system's real strength**: 100% of fills bound to `Color` variables, 100% of text bound to `Font-names/*` and `font-weights/*`, and not one raw hex in the file. That is what makes the EN→AR switch a mode flip rather than a rebuild.

**The system's real gap**: zero text styles, of any kind. `fontSize`, `lineHeight` and `letterSpacing` had nowhere to bind, and drifted — fractional values like `51.096771240234375pt` and tracking of `-10.8`. Everything that had somewhere to bind held perfectly; everything that didn't, didn't. The correlation is the finding, and it points at one fix: add eight text styles.

**Twelve defects and decisions** catalogued as D-01…D-12 in `references/decision-log.md`, which overrides the older guides. Two are worth calling out:

- **D-01** — two headlines set at **1.28:1** and **1.55:1**. Invisible. And invisible in the node data too, because every fill was correctly variable-bound and on-palette. Only a screenshot showed it.
- **D-11** — five named testimonials and two statistics that appear in no source document. Named quotes invented for a client deck are a live exposure, not a formatting nit.

### Where this corrects the written guides

The two build guides that shipped with the v1 deck describe the two-tone headline by role — "line 2 is the accent" — without a ground-dependent colour table. That omission is the direct cause of D-01.

Worse, one guide's prescribed fix for the slide-11 failure is **`Purple/300` on `Purple/600`**, which measures **1.78:1** — worse than the bug it was meant to fix. `references/colors.md` now states the accent colour per ground explicitly, and `brand-check.py` will refuse it.

Measured contrast beat documented intent in both cases. That is the argument for this skill existing.

### Notes

- Raster assets (4 backgrounds, 15 planets, 1 space image, ~6 MB) are **not** vendored. They live in the Figma library where deck work instantiates them as components anyway. `scripts/export-figma-assets.py` pulls them on demand — it needs a fresh Figma personal access token, since **both tokens in the local MCP config were expired as of 2026-07-29**.
- No Arabic Majarah deck exists yet. `references/rtl-arabic.md` documents what building one actually requires, including the nine-weights-onto-two-faces collapse that flattens three hierarchy tiers into one.
- Linked from `azmx-brand`, which owns Majarah's voice, mirroring how `colab-design` is wired for Colab.
