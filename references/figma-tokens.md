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
| `body/2xl` | 40 | **54** | **1.35** |
| `body/xl` | 36 | **48.6** | **1.35** |
| `body/l` | 28 | **37.8** | **1.35** |
| `body/m` | 24 | **32.4** | **1.35** |
| `body/s` | 20 | **27** | **1.35** |
| `body/xs` | 16 | **21.6** | **1.35** |
| `body/2xs` | 12 | **16.2** | **1.35** |

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

---

## Text styles — the style layer

The file shipped with **0 paint styles and 0 text styles**. It then shipped with 30 text styles and **2 consumers file-wide**. Styles that nothing binds to are not a system; see `SKILL.md` § "The second rule".

Two families were missing, and that absence is the measured cause of the off-scale sizes. **Bold body text had nowhere legal to bind**, so it was set by hand — and hand-set type drifts.

### `Caps/*` — new

All-caps labels: eyebrows, table headers, column heads, legend keys, colophon labels.

| Style | Size | LH | Tracking | Case | Weight |
|---|---|---|---|---|---|
| `Caps/M` | **24** | 1.00 | **+4%** | UPPER | Medium 500 |
| `Caps/S` | **20** | 1.00 | **+4%** | UPPER | Medium 500 |
| `Caps/XS` | **16** | 1.00 | **+4%** | UPPER | Medium 500 |
| `Caps/2XS` | **12** | 1.00 | **+6%** | UPPER | Bold 700 |

LH 1.00 because caps carry no descenders and every one of these is a single line. **+6% at 12** because tracking need rises as size falls; at 12px caps at +4% the counters still close under Teams' 4:2:0 subsampling. **Bold at 12**, not Regular — §2.8, a Light or Regular 12px stem does not survive projection.

⛔ **Caps at zero tracking is amateur tell #11.** These four styles exist so it cannot happen by accident.

### `Body/* SemiBold` — new

Emphasis inside running text, ledger evidence lines, table identity columns, stat labels.

| Style | Size | LH | Tracking | Weight |
|---|---|---|---|---|
| `Body/L SemiBold` | **28** | **1.35** | −1.7% | SemiBold 600 |
| `Body/M SemiBold` | **24** | **1.35** | −2.0% | SemiBold 600 |
| `Body/S SemiBold` | **20** | **1.35** | −1.7% | SemiBold 600 |
| `Body/XS SemiBold` | **16** | **1.35** | −1.1% | SemiBold 600 |

SemiBold takes the same tracking as Regular at these sizes. The weight-compensation rule in §2.2 applies at **≥60px only**.

### Building them

```js
// Inter's Figma style string is 'Semi Bold' for the static family and
// 'SemiBold' for the variable font. Check before assuming:
//   (await figma.listAvailableFontsAsync()).filter(f => f.fontName.family === 'Inter')

async function makeStyle({ name, family, style, size, lhPercent, trackPercent, upper }) {
  await figma.loadFontAsync({ family, style });
  const s = figma.createTextStyle();
  s.name = name;
  s.fontName = { family, style };
  s.fontSize = size;
  s.lineHeight = { unit: 'PERCENT', value: lhPercent };
  s.letterSpacing = { unit: 'PERCENT', value: trackPercent };
  if (upper) s.textCase = 'UPPER';
  return s;
}

await makeStyle({ name:'Caps/M',  family:'Inter', style:'Medium',
                  size:24, lhPercent:100, trackPercent:4,  upper:true });
await makeStyle({ name:'Caps/2XS',family:'Inter', style:'Bold',
                  size:12, lhPercent:100, trackPercent:6,  upper:true });
await makeStyle({ name:'Body/M SemiBold', family:'Inter', style:'Semi Bold',
                  size:24, lhPercent:135, trackPercent:-2, upper:false });
```

**Bind the style's numbers to variables, do not hard-code them:**

```js
s.setBoundVariable('fontSize',      sizeVar);
s.setBoundVariable('lineHeight',    lhVar);
s.setBoundVariable('letterSpacing', trackVar);
s.setBoundVariable('fontFamily',    familyVar);   // Display-Font / Body-Font
```

A style that binds its numbers to the `numbers` and `fonts` collections **inherits the EN/AR modes for free** — Inter→Alexandria, ×1.35→×1.5, tracking→0, all without a second style. Hard-coding the numbers into the style is exactly what forces a duplicate Arabic style set, and a duplicate set is what drifts.

**`Caps/*` is EN-only.** Arabic has no case. An Arabic eyebrow binds `Body/M SemiBold` — AR mode supplies ×1.5 and tracking 0. Never apply `Caps/M` to Arabic; `textCase: 'UPPER'` on Arabic is a no-op that leaves the +4% tracking behind, and tracked Arabic breaks the joins.

---

## `fonts` — EN / AR

Already correctly wired. **No change required.**

| Variable | EN | AR |
|---|---|---|
| `Font-names/Display-Font` | Inter | **Alexandria** |
| `Font-names/Body-Font` | Inter | **Alexandria** |
| `font-weights/Extralight` | extralight | extralight |
| `font-weights/light` | light | light |
| `font-weights/Regular` | regular | regular |
| `font-weights/Medium` | medium | medium |
| `font-weights/Semibold` | semibold | semibold |
| `font-weights/Bold` | bold | bold |

Any text node binding `fontFamily` to `Display-Font` or `Body-Font` switches face on a mode change, with no duplicate node and no duplicate style.

---

## `numbers 🔢` — EN / AR modes

### What was wrong

The collection had **one mode**. Arabic line-heights existed, but as a **duplicate namespace** — `Typography/line-height-AR/*`, 15 variables sitting beside the canonical 15.

A duplicate namespace is not a mode. It cannot be switched, it has to be re-bound node by node, and the moment an EN value changes the two sets diverge silently. **This is the same failure as a duplicate Arabic component set, one layer down.**

### What was done

1. **EN / AR modes added to `numbers`.**
2. All **15** Arabic line-heights folded into the **AR mode of the canonical variables**.
3. All **13** letter-spacing variables **pinned to 0 in AR mode**.
4. The 15 `Typography/line-height-AR/*` duplicates are now **redundant — delete them.**

### AR line-heights — ×1.5 at every size

Every AR value lands on **exactly ×1.5**, the C-11 floor.

| Token | Size | EN (shipped) | EN (ratified) | **AR ×1.5** |
|---|---|---|---|---|
| `display/xl` | 240 | 228 (0.95) | 216 (0.90) | **360** |
| `display/l` | 200 | 190 | 180 (0.90) | **300** |
| `display/m` | 160 | 152 | 144 (0.90) | **240** |
| `display/s` | 60 | 57 | 57 (0.95) | **90** |
| `display/xs` | 40 | 38 | 38 (0.95) | **60** |
| `display/2xs` | 24 | 22.8 | 22.8 | **36** |
| `display/3xs` | 20 | 19 | 19 | **30** |
| `display/Text` | 16 | 15.2 | 15.2 | **24** |
| `body/2xl` | 40 | 46.4 (1.16) | **54 (1.35)** | **60** |
| `body/xl` | 36 | 41.76 | **48.6** | **54** |
| `body/l` | 28 | 32.48 | **37.8** | **42** |
| `body/m` | 24 | 27.84 | **32.4** | **36** |
| `body/s` | 20 | 23.2 | **27** | **30** |
| `body/xs` | 16 | 18.56 | **21.6** | **24** |
| `body/2xs` | 12 | 13.92 | **16.2** | **18** |

**AR display at ×1.5 is loose by Latin standards, and it is correct.** Alexandria carries the diacritic stack above and below the baseline — fatha and damma above, kasra below — which Latin metrics do not account for. The 1.5 floor is a floor **at every size**, not a body-only rule. Do not tighten AR display to match the EN 0.90.

⚠️ **The EN column is stale.** All 15 EN line-heights still resolve to the shipped ×1.16 / ×0.95 values against the ratified ×1.35 body leading. **The variable layer and the style layer disagree.** A style that binds `lineHeight` to these variables inherits ×1.16. Re-point the EN mode to the ratified column before binding anything.

### AR tracking — pinned to 0

All **13** `Typography/letter-spacing/*` variables resolve to **0 in AR mode**, structurally, not by convention.

**Arabic is never tracked.** It is a cursive script: letters join along the baseline. Positive tracking breaks the joins and turns a word into disconnected marks; negative tracking collides the joins into an unreadable smear. Zero is the only correct value at every size and every weight.

Pinning it to 0 in the mode means the EN prescription — −2.5% at display, **+4% on caps** — cannot leak into an Arabic slide when a mode is switched. Before the pin, switching a deck to AR carried +4% tracking onto every eyebrow.

**`Caps/*` is EN-only.** Arabic has no case; `textCase: 'UPPER'` is a no-op on Arabic that leaves the tracking behind. An Arabic eyebrow binds `Body/M SemiBold`, which picks up ×1.5 and tracking 0 from the AR mode automatically.
