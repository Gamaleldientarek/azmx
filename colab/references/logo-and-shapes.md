# Colab — Logo and Shape Assets

Every logo lockup and every shape primitive, exported as SVG from the `Colab Design System` Figma file and vendored into this skill. Use these files directly — do not re-draw, re-trace, or approximate them.

Source: Figma file `Colab Design System`, page `02 · Design System`, component sets `Colab Logo` and `Shapes`. Exported 2026-07-26 with text outlined, so no font is required to render them.

Download any asset directly:

```bash
curl -L -O "https://raw.githubusercontent.com/Gamaleldientarek/colab-design-skill/main/assets/logo/colab-wordmark-pine-green.svg"
```

Machine-readable dimensions, byte sizes and per-file colour lists are in `assets/figma-export-manifest.json`.

---

## 1. Logo — 7 lockups × 3 colours = 21 files

**The wordmark is `colab.`** — lowercase, terminal period, **single L**. The legacy Figma filename misspells it "Collab"; the asset itself is correct.

Taglines: `USER EXPERIENCE LABORATORY` · `كولاب مختبر تجربة المستخدم`

| Lockup | Content | Size | File stem |
|---|---|---|---|
| Mark | `c.` alone | 200 × 200 | `colab-mark-*` |
| Wordmark | `colab.` | 497 × 92 | `colab-wordmark-*` |
| Wordmark + Tagline EN | wordmark over EN tagline | 497 × 208 | `colab-wordmark-plus-tagline-en-*` |
| Wordmark + Tagline AR | wordmark over AR tagline | 497 × 220 | `colab-wordmark-plus-tagline-ar-*` |
| Wide — Compact | mark + wordmark, one line | 673 × 92 | `colab-wide-compact-*` |
| Wide — Tagline | wordmark, tagline to its right | 895 × 92 | `colab-wide-tagline-*` |
| Wide — Full | mark + wordmark + tagline, one line | 1071 × 92 | `colab-wide-full-*` |

Each takes one of three colour suffixes:

| Suffix | Hex | Use |
|---|---|---|
| `-pine-green` | `#103A21` | **Default.** Light and white grounds |
| `-electric-green` | `#34FF67` | Dark grounds — Pine or Deep Jade |
| `-white` | `#FFFFFF` | Photography, dark grounds, anywhere Electric would vibrate |

So the full filename is `assets/logo/colab-<lockup>-<colour>.svg`, e.g. `colab-wide-compact-electric-green.svg`.

### Rules

- **Bounding box is constant per lockup across all three colours.** A colour swap never shifts layout. Verified: the three files of each lockup differ only in fill value.
- **Never mirror the logo for RTL.** Arabic is a separate lockup (`Wordmark + Tagline AR`), not a flip. A mirrored wordmark is the classic embarrassing bug.
- **Never place Electric Green or the White lockup on a white or light ground.** Electric on white is 1.34:1. On light grounds the logo is Pine Green, always.
- The slide header/footer slot is 136 × 60 — use `Wide — Compact` or `Wordmark`, scaled to fit height.
- Do not recolour these files to a hue outside the three supplied. There is no fourth logo colour.

---

## 2. Shapes — 20 primitives × 2 colours = 40 files

The pixel/dither graphic vocabulary. Filename pattern: `assets/shapes/shape-<name>-<colour>.svg`.

The colour axis is **`brand`** and **`white`** — not the three-colour logo axis. This is deliberate:

- **`-brand`** preserves each shape's *native two-tone construction* — a Pine ground with Electric marks, or the reverse. The dither motif is inherently two-tone; flattening it to a single hue would destroy it.
- **`-white`** flattens every fill to white, for use on Pine Green, Deep Jade, or photography.

There is no all-Pine or all-Electric shape variant. If you need one, use the `-brand` file whose native colouring already matches.

### Markers — 72 × 72 unless noted

| Shape | Colours in `-brand` | File stem |
|---|---|---|
| Marker / Square Dark | Pine | `shape-marker-square-dark-*` |
| Marker / Square Green | Electric | `shape-marker-square-green-*` |
| Marker / Plus | Pine ground, Electric plus | `shape-marker-plus-*` |
| Marker / Cross | Pine ground, Electric cross | `shape-marker-cross-*` |
| Marker / Ring | Electric ground, Pine ring | `shape-marker-ring-*` |
| Marker / Outline Green | Electric | `shape-marker-outline-green-*` |
| Marker / Outline Dark | Pine | `shape-marker-outline-dark-*` |
| Marker / Plus Small | Pine | `shape-marker-plus-small-*` (36 × 36) |

`Plus`, `Cross` and `Ring` are built two different ways depending on colour, and the difference matters:

- **`-brand`** draws the mark as separate Electric paths *on top of* a Pine square (3 paths for Plus and Cross, 2 for Ring). The square is opaque.
- **`-white`** is a single **knockout** path — one white square with the mark cut out of it, so whatever sits behind shows through the cut.

So `-white` on a photo shows the photo through the plus; `-brand` never shows anything through. Do not assume the two are interchangeable geometry.

### Arrow

| Shape | Colours in `-brand` | Size | File stem |
|---|---|---|---|
| Arrow / Chevron | Electric | 36 × 61 | `shape-arrow-chevron-*` |

The only directional asset in the set. **This one flips for RTL.** Nothing else here does.

### Dither — the motif

| Shape | Colours in `-brand` | Size | File stem |
|---|---|---|---|
| Dither / Block Green | Electric | 130 × 72 | `shape-dither-block-green-*` |
| Dither / Block Dark | Electric + Pine | 130 × 72 | `shape-dither-block-dark-*` |
| Dither / Strip | Pine | 64.36 × 106.42 | `shape-dither-strip-*` |
| Dither / Grid | Pine | 100 × 100 | `shape-dither-grid-*` |

The dither blocks are a **density gradient** — cells thin out left to right. That direction encodes assembly, so under RTL the dense end must end up on the opposite edge; running it backwards reads as disassembly. **But do not mirror an existing field to get there — re-solve it against the Arabic layout.** Arabic text extents differ, so a mirrored field lands on content, and the solver picks the correct edge from geometry without being told the reading direction. See `references/rtl-arabic.md` §8.

Never place a dither block behind or under a headline. It is a field, not a texture wash.

### Tiles

| Shape | Colours in `-brand` | Size | File stem |
|---|---|---|---|
| Tile / Cross Small | Electric | 165 × 165 | `shape-tile-cross-small-*` |
| Tile / Cross Large | Electric | 253 × 253 | `shape-tile-cross-large-*` |
| Tile / Cross Stack | Electric | 165 × 330 | `shape-tile-cross-stack-*` |
| Tile / Checker Corner | Electric | 254 × 310 | `shape-tile-checker-corner-*` |

### Frames — image and content treatments

| Shape | Colours in `-brand` | Size | File stem |
|---|---|---|---|
| Frame / Square | Pine | 267 × 267 | `shape-frame-square-*` |
| Frame / Wide | Pine + Electric | 479 × 267 | `shape-frame-wide-*` |
| Frame / Composite | Electric + Pine | 267 × 377 | `shape-frame-composite-*` |

`Frame / Wide` carries an `opacity="0.5"` Electric panel — the only asset in the set using partial opacity. Preserve it; do not flatten it to a solid.

---

## 3. Known defects in the Figma source

Recorded here because the exported assets are corrected but **the Figma components still carry these**. Fix them at source before the next export.

| Defect | Detail | Status in these assets |
|---|---|---|
| Placeholder grey in three White variants | `Marker / Plus`, `Marker / Cross` and `Marker / Ring` at `Colour=White` are filled `#D9D9D9` — Figma's stock default grey — not white. All 17 other White variants correctly use `white`. | **Corrected to `white` on export.** Figma still wrong. |
| `Dither / Strip` is off-grid | 64.36 × 106.42. Every other asset in the set is an integer size. | Exported as-is. Snap to 64 × 106 at source. |
| Shape bounding boxes are not normalised | Sizes span 36 × 36 to 479 × 267. Swapping the `Shape` property on an instance therefore still shifts layout — the fix called for in `components.md` §2 was not applied. | Exported as-is. Size per shape is documented above so you can compensate. |
| Deprecated twins still present | `Colab Logo (deprecated 2026-07-26)` and `Shapes (deprecated 2026-07-26)` sit on the same page as the live sets. | Not exported. Never instantiate them. |

---

## 4. Using these outside Figma

All 61 files are plain SVG with outlined text — no font dependency, no external references, no embedded rasters. They render in browsers, PowerPoint, Keynote, Word, and any SVG-capable tool.

To recolour a shape beyond the two supplied variants, substitute the hex directly — every file uses only `#103A21`, `#34FF67`, or `white`, and nothing else. But read the contrast law in `SKILL.md` first: **Electric Green and Jade Green may never land on a white or light ground.**
