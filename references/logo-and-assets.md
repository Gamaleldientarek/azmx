# Logo and Assets

## The mark

Majarah's logo is the Arabic wordmark **مجرة** with an orbital ring through the leading letter — a planet with a ring, drawn as a letterform. There is no Latin wordmark and no separate symbol. The Arabic reads as the identity in both language versions.

Two lockups:

| Lockup | Ratio | Size in file | Use |
|---|---|---|---|
| **Primary** | 5 : 1 | 334 × 111 | Compact. Tight spaces, square formats, centred hero |
| **Secondary** | 8 : 1 | 520 × 111 | Extended. **The default** — fills corner chrome better |

The brand book expresses clearspace in x-units where **1x = the ring diameter**: the Primary lockup occupies 5x × 1x, the Secondary 8x × 1x. **Minimum clearspace on all sides is 1x** — one ring diameter. At chrome scale (260px wide Secondary) that is roughly 32px.

## Components in Figma

Section `Logo` (`1:380`) on the **Components** page. Always instantiate; never redraw.

| Component | Node | Size | Fill |
|---|---|---|---|
| Logo=Primary, Color=White | `1:343` | 334 × 111 | `#FFFFFF` |
| Logo=Primary, Color=Main Purple | `1:345` | 334 × 111 | `#4B0AA0` |
| Logo=Primary, Color=Grey | `1:348` | 334 × 111 | `#231F20` |
| **Logo=Secondary, Color=White** | `1:371` | 520 × 111 | `#FFFFFF` |
| **Logo=Secondary, Color=Main Purple** | `1:378` | 520 × 111 | `#4B0AA0` |
| Logo=Secondary, Color=Grey | `1:374` | 520 × 111 | `#231F20` |

**"Main Purple" is `Purple/500*` `#4B0AA0`, not Purple/900.** Worth knowing — the instinct is that the dark logo uses the darkest brand colour, and it does not.

### Standard placements

| Context | Component | Rescale | Result | Position |
|---|---|---|---|---|
| Corner chrome, dark ground | Secondary White `1:371` | `0.5` | 260 × 56 | `1540, 78` |
| Corner chrome, light ground | Secondary Main Purple `1:378` | `0.5` | 260 × 56 | `1540, 78` |
| Centred hero, dark ground | Secondary White `1:371` | `2.4` | 1249 × 267 | `x = (1920 − w) / 2` |
| Centred hero, light ground | Secondary Main Purple `1:378` | `2.4` | 1249 × 267 | centred |

Use `instance.rescale(n)` — it scales strokes and effects proportionally. Never `resize()` on a logo instance.

Centre arithmetically: `li.x = (1920 - li.width) / 2`. At 2.4 that lands at x=335.

The v1 closing slide uses Secondary at 2.4 where the guides specify Primary — see `decision-log.md` D-12. Either is defensible; the wide mark arguably suits a full-width closing better.

## Vendored SVGs

`assets/logo/` carries all six variants as flat single-path SVGs, exported from the components:

```
majarah-primary-white.svg          majarah-secondary-white.svg
majarah-primary-main-purple.svg    majarah-secondary-main-purple.svg
majarah-primary-grey.svg           majarah-secondary-grey.svg
```

Each is one `<path>` with one `fill`. To produce another colour, substitute the fill:

```bash
sed 's|fill="white"|fill="#B671FF"|' majarah-secondary-white.svg > majarah-secondary-lavender.svg
```

Use these for HTML, email, PDF, and web — anywhere outside Figma. Byte-verified against the Figma export.

**Do not recolour into a tint that fails against its ground.** A Purple/300 logo on Purple/900 is 2.28:1; the mark would technically be visible as a shape but would read as a smudge. Logo on dark = White. Logo on light = Main Purple.

## Decorative image library

Three component sets on the **Components** page. **All were unused in the v1 deck** — the backgrounds remain a pending item (`decision-log.md`).

### Galaxy Bks — component set `1:487`

Four abstract galaxy textures, ~390 × 263 each.

| Variant | Node | Description |
|---|---|---|
| `Select = 01` | `1:483` | Swirling blue/pink vortex, dark centre |
| `Select = 02` | `1:484` | Dark nebula, multi-colour galaxy with a bright core |
| `Select = 03` | `1:485` | Holographic grain gradient — magenta / cyan / yellow |
| `Select = 04` | `1:486` | Iridescent wave, dark blue with an orange streak |

01 and 02 are the on-brand pair — dark ground, purple-blue, they sit under type without fighting it. **03 and 04 are off-palette** (yellow, orange, cyan) and will pull a deck away from the purple system. Use them full-bleed on a divider with no body text, or not at all.

### Planets — component set `1:494`

Fifteen photorealistic planet renders, ~260 × 260.

| Node | Variant | Node | Variant |
|---|---|---|---|
| `1:493` | Subtle Blue | `2:34` | Earth, magenta cast |
| `1:492` | Main Purple | `2:36` | Earth, cyan cast |
| `1:491` | Blue Vivid | `2:38` | Purple, glow |
| `1:490` | Moon (grey) | `2:39` | Purple, vector-style |
| `1:489` | Orange / White | `2:45` | Venus |
| `1:488` | Mars | `2:46` | Detailed, banded |
| `2:35` | Earth, blue | | |
| `2:33` | Earth, dark | | |
| `2:32` | Earth, violet | | |

The purple and blue variants (`1:493`, `1:492`, `1:491`, `2:38`, `2:39`, `2:32`) are the on-brand set. Moon (`1:490`) is a neutral that works anywhere. Mars and Orange/White are off-palette.

**Placement convention from the brand book collateral:** planets crop off the frame edge, partially occluded, at two different sizes — one larger near the mark, one smaller further out. They read as orbital bodies, not as clip art. Never centre one, never show a whole planet floating in open space.

### Space — component set `2:42`

One full-bleed space photograph, `2:41`, 1920 × 1080 — exactly slide size. Intended as a cinematic ground for a hero or closing slide.

## Assets not vendored

The raster library (four backgrounds, fifteen planets, one space image — roughly 6 MB) is **not** in this repo. It lives in the Figma library, where deck work instantiates it as components anyway.

To pull them to disk, run `scripts/export-figma-assets.py`. It needs a valid Figma personal access token — **both tokens in the local MCP config were expired as of 2026-07-29**, so refresh one first at figma.com → Settings → Security → Personal access tokens.

```bash
export FIGMA_TOKEN=figd_...
python3 scripts/export-figma-assets.py --scale 2
```

Node IDs are hard-coded in the script from the tables above, so it stays correct without a live Figma session.
