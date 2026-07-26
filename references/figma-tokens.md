# Colab — Live Figma Variables

Extracted from the client's Figma file on 2026-07-26 via the Figma Console MCP Desktop Bridge.

---

## Collections

| Collection | Modes | Variables |
|---|---|---|
| `color 🎨` | Light · Dark | 436 |
| `fonts` | EN · AR | 8 |
| `grids` | Mode 1 | 8 |
| `strings 📝` | Mode 1 | 1 |
| `numbers 🔢 ` | Mode 1 | 150 |

Colour groups: `Main Colors` 57 · `Brand` 66 · `Semantics` 29 · `Component-level` 11 · `Alpha` 29 · `Tailwind Colors` **242** · `Mode` 1 · `Mode 2` 1

---

## `fonts` — EN / AR

| Variable | EN | AR |
|---|---|---|
| `Font-names/Display-Font` | Inter | Alexandria |
| `Font-names/Body-Font` | Inter | Alexandria |
| `font-weights/Extralight` | extralight | extralight |
| `font-weights/light` | light | light |
| `font-weights/Regular` | regular | regular |
| `font-weights/Medium` | medium | medium |
| `font-weights/Semibold` | semibold | semibold |
| `font-weights/Bold` | bold | bold |

---

## Type scale — `Typography/*` (canonical)

### Display
| Token | Size | Line-height | Ratio |
|---|---|---|---|
| `display/xl` | 240 | 228 | 0.95 |
| `display/l` | 200 | 190 | 0.95 |
| `display/m` | 160 | 152 | 0.95 |
| `display/s` | 60 | 57 | 0.95 |
| `display/xs` | 40 | 38 | 0.95 |
| `display/2xs` | 24 | 22.8 | 0.95 |
| `display/3xs` | 20 | 19 | 0.95 |
| `display/Text` | 16 | 15.2 | 0.95 |

### Body
| Token | Size | Line-height | Ratio |
|---|---|---|---|
| `body/2xl` | 40 | 46.4 | 1.16 |
| `body/xl` | 36 | 41.76 | 1.16 |
| `body/l` | 28 | 32.48 | 1.16 |
| `body/m` | 24 | 27.84 | 1.16 |
| `body/s` | 20 | 23.2 | 1.16 |
| `body/xs` | 16 | 18.56 | 1.16 |
| `body/2xs` | 12 | 13.92 | 1.16 |

Letter-spacing: all 13 `Typography/letter-spacing/*` tokens resolve to `0`.

> ⚠️ For Arabic, override line-height to a **1.5 floor**. Do not reuse the 1.16 body ratio.

### Deprecated scale — do not use
`Font-size/Heading Size/*` — H1 40 · H2 36 · H3 30 · H4 24 · H5 18
`Font-size/Text Size/*` — XXS 10 · XS 12 · SM 14 · Base 16 · LG 18 · **XL 120 ⚠️ (bug)** · 2XL 24 · 3XL 30 · 4XL 36 · 5XL 48 · 6XL 60 · 7XL 72

---

## Layout tokens

| Token | Value |
|---|---|
| `Slide-dimensions/Width` | 1920 |
| `Slide-dimensions/Height` | 1080 |
| `padding-gap/slide/Horizontal-padding` | 80 |
| `padding-gap/slide/Veritcal-padding` *(sic)* | 60 |
| `padding-gap/slide/Gap` | 60 |

### Content spacing ramp
| Token | Value |
|---|---|
| `content/4xs` | 4 |
| `content/3xs` | 8 |
| `content/2xs` | 12 |
| `content/xs` | 16 |
| `content/s` | 24 |
| `content/m*` | 40 |
| `content/l` | 60 |
| `content/xl` | 80 |
| `content/2xl` | 100 |
| `content/3xl` | 120 |

### Radius
`0 · 2 · 4 · 8 · 12 · 16 · 24 · 9999`

### Border width
`0 · 0.25 · 0.5 · 0.75 · 1 · 1.5 · 2 · 4 · 8`

### Opacity
`Hidden 0 · 3x-Transparent-5 · 2x-Transparent-20 · x-Transparent-40 · Transparent-60 · Opaque-80 · full 100` · booleans `Show` / `Hide`

### Primitives
- `base-4`: 0 · 0.25 · 0.5 · 0.75 · 1 · 1.5 · 2 · 4 · 8 · 12 · 14 · 16 · 18 · 24 · 28 · 36 · 48 · 72 · 96 · 120 · 160 · 180 · 200 · 240 · full (9999)
- `base-5`: 0 → 100 in steps of 5

> Spelled `primatives` in the file. Typo, unchanged for now to avoid breaking aliases.

---

## Grid tokens vs grid styles — three systems, one winner

### `grids` variable collection *(superseded)*
| Variable | Resolves to |
|---|---|
| `columns/count` | 12 |
| `columns/margin` | 80 |
| `columns/gutter` | 20 |
| `columns/type` | Stretch |
| `rows/count` | 12 |
| `rows/margin` | 80 |
| `rows/gutter` | 20 |

### Grid styles
| Style | Definition | Status |
|---|---|---|
| `Layout Grid` ×2 (duplicates) | 12 cols × 9 rows, gutter 24, offset 40 | Delete both |
| **`Advanced Presentation`** | see below | **Canonical** |

### `Advanced Presentation` — the canonical grid style

| Layer | Pattern | Alignment | Count | Gutter | Section | Resolves to |
|---|---|---|---|---|---|---|
| 1 | ROWS | MAX | 1 | 20 | 98 | 98px footer band, bottom-pinned |
| 2 | ROWS | STRETCH | 2 | 980 | — | 50px safe bands, top and bottom |
| 3 | COLUMNS | STRETCH | 2 | 1820 | — | 50px safe bands, left and right |
| 4 | COLUMNS | CENTER | 8 | 40 | 180 | 8 × 180 content columns, centered |

Derived: content block 1720px · side margins 100px · live content height 932px · footer y 982→1080.

---

## Styles

| Type | Count |
|---|---|
| Paint styles | **0** |
| Text styles | **0** |
| Effect styles | **0** |
| Grid styles | 3 (two are duplicates) |

Creating the missing paint and text styles is Phase C.

---

## Component-level tokens

| Token | Light | Dark |
|---|---|---|
| `Logo-color/Electric Green` | `#34FF67` | `#34FF67` |
| `Logo-color/Pine Green` | `#103A21` | `#34FF67` |
| `Logo-color/White` | **missing — must be added** | — |
| `Icon/Default` | Neutral 400 | Neutral 50 |
| `Icon/Black` | `#0D121C` | White |
| `Icon/Electric Green` | `#34FF67` | `#34FF67` |
| `Icon/Pine Green` | `#103A21` | `#103A21` |
| `Icon/Disabled` | Neutral 400 | Neutral 500 |
