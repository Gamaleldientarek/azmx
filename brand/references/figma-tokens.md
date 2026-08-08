# AZM X Figma Tokens (live export)

Complete variable export from the New Direction Library Figma file (fileKey `j8ugBpb1yUUyL8hfb6FHKR`), pulled via the Figma desktop bridge on 2026-08-08. **550 variables across five collections.** This file is the exact live source of truth; `colors.md` is the curated usage guide and `design-tokens-usage.md` is the how-to.

Colour values are hex; 8-digit hex means the last two digits are alpha. `@name` means the token aliases another token rather than holding a raw value.

> **Replaces the 233-variable, three-collection system** (`Colors`, `Fonts`, `Numbers`) documented here until v1.4.1. Those collections were deleted on 2026-08-08. **None of their names exist any more.** Anything still referencing `Primary/Electric`, `Neutral/900`, `Font-names/Body-Font`, `Typography/Font-size/*` or `padding-gap/*` is out of date.

---

## Architecture

```
1. Primitives   285   one mode · hidden from publishing · zero scopes
       ↓
1b. Palette      19   six modes: Blue │ Orange │ Green │ Yellow │ Purple │ Red
       ↓
2. Semantic     186   two modes: Light │ Dark
       ↓
3. Component     56   one mode
4. Canvas         4   one mode, outside the chain
```

**Dependency rule, verified at zero violations:** Semantic aliases Primitives or Palette. Component aliases Semantic only. Palette and Canvas alias Primitives. Primitives alias nothing.

**Bind to Semantic.** Primitives are hidden and unscoped so they cannot be picked. Component tokens are for use inside their main component only.

### Two independent switches

Figma resolves each collection's mode separately, so a frame carries both:

| Switch | Options | Controls |
|---|---|---|
| `1b. Palette` | Blue · Orange · Green · Yellow · Purple · Red | Accents, dark grounds, the gradient |
| `2. Semantic` | Light · Dark | Theme |

Twelve combinations from one set of bindings. Blue resolves to the values that were already in use, so nothing built before this system changed.

---

## 1. Primitives (285)

Hidden from publishing, zero scopes. Never bind to these.

### Six palettes, twelve steps each

| Step | Blue | Orange | Green | Yellow | Purple | Red |
|---|---|---|---|---|---|---|
| 50 | `#F0F5FF` | `#FEF7F4` | `#F2FBF6` | `#FFFCF4` | `#FCF8FF` | `#FFF2F3` |
| 100 | `#DDE8FF` | `#FDECE5` | `#E0F7EB` | `#FFF9E4` | `#F7EFFF` | `#FFE1E4` |
| 200 | `#BFD5FF` | `#FCD7C8` | `#BDEDD4` | `#FFF2C6` | `#EEDDFF` | `#FFBFC4` |
| 300 | `#93B6FF` | `#F9BAA0` | `#8CE0B4` | `#FEE89C` | `#E1C5FF` | `#FF919A` |
| 400 | `#5D8FFF` | `#F79A74` | `#57D192` | `#FEDE6E` | `#D4AAFF` | `#FF5E6B` |
| **500** | `#2661FF` | **`#F47A48`** | **`#22C36F`** | **`#FED340`** | **`#C68FFF`** | **`#FF2B3C`** |
| **600** | **`#001AFF`** | `#C8643B` | `#1CA05B` | `#D3A92E` | `#9B66D4` | `#D12331` |
| 700 | `#0200D3` | `#A1502F` | `#168049` | `#AD831E` | `#7341AD` | `#A81C27` |
| 800 | `#01009B` | `#7B3E24` | `#116238` | `#895F0F` | `#4F1F88` | `#81161E` |
| 900 | `#01006E` | `#5A2D1B` | `#0D4829` | `#693F02` | `#2E0068` | `#5E1016` |
| 950 | `#010040` | `#3C1E12` | `#08301B` | `#392201` | `#190039` | `#3E0A0F` |
| 1000 | `#040038` | `#2E170E` | `#062515` | `#251601` | `#100024` | `#30080B` |

**Bold is the signature.** Blue's sits at 600 because Electric is a dark colour; every secondary's sits at 500 because they are vivid light tones. The Palette collection abstracts this away.

### Role anchors — the palette board values, preserved exactly

The five secondaries carry the original board values, never regenerated:

| | tint | border | light | mid | deep |
|---|---|---|---|---|---|
| Orange | `#FFF7F1` | `#DDAD8D` | `#F47A48` | `#CD5200` | `#842C09` |
| Green | `#E5F4EE` | `#88EFC7` | `#22C36F` | `#00A060` | `#012F02` |
| Red | `#FDF2F3` | `#EB808A` | `#FF2B3C` | `#DB0015` | `#640000` |
| Yellow | `#FFFCF4` ᵈ | `#FEDE6E` ᵈ | `#FED340` | `#D3A92E` ᵈ | `#693F02` |
| Purple | `#FCF8FF` ᵈ | `#D4AAFF` ᵈ | `#C68FFF` | `#9B66D4` ᵈ | `#2E0068` |

ᵈ **derived**, not board-supplied. Generated at ramp steps 50 / 400 / 600 — the median positions where orange, green and red place their real anchors. Replace if official values exist. Blue has no role anchors; its ramp serves directly.

### Neutrals

`color/neutral/25 50 100 200 300 400 500 600 700 800 900 950`
`#FCFCFD` `#F9FAFB` `#F3F4F6` `#E5E7EB` `#D2D6DB` `#9DA4AE` `#6C737F` `#4D5761` `#384250` `#1F2A37` `#111927` `#0D121C`

`color/base/white` `#FFFFFF` · `color/base/black` `#000000`

### RAG data dots — the only sanctioned use of red, yellow, green outside a palette

`color/rag/red` `#FF2B3C` · `color/rag/yellow` `#FED340` · `color/rag/green` `#22C36F`

### UI feedback — state, not brand colour

`color/feedback/{success|warning|danger|info|caution}/{tint|border|mid|deep}` (+ `caution/light`)

| | tint | border | mid | deep |
|---|---|---|---|---|
| success | `#E5F4EE` | `#88EFC7` | `#007D4B` | `#012F02` |
| warning | `#FFFCF4` | `#FEDF90` | `#946C08` | `#693F02` |
| danger | `#FDF2F3` | `#EB808A` | `#DB0015` | `#430000` |
| info | `#EDF5FF` | `#97C3F4` | `#0061CF` | `#01006E` |
| caution | `#FFF7F1` | `#DDAD8D` | `#C14D00` | `#5F2006` |

`success/mid`, `warning/mid`, `caution/mid` and `danger/deep`, `caution/deep` were darkened from their originals to clear 4.5:1. The original orange `#842C09` survives untouched at `color/orange/role-deep`.

### Alpha (29)

`color/alpha/white-{4,8,12,16,20,30,40,48,60,72,90}` · `black-{8,12,20,30,40,60,72}` · `navy-{40,72}` · `electric-{8,16}` · `{success,warning,danger,info,caution}-8` · `caution-bg-8` · `caution-dark-10`

### Sub-brand — never on an AZM X surface

`brand/colab/*` (8): electric-green `#34FF67` · pine-green `#103A21` · jade-green `#33FFC2` · deep-jade `#011E14` · olive-green `#5B6B3E` · vivid-orange `#FF5A32` · pale-sky-blue `#B1D9E8` · grey `#BCBEC0`

`brand/majarah/*` (10): purple-900 `#210054` · purple-600 `#380089` · purple-500 `#4B0AA0` · purple-300 `#6500E8` · purple-200 `#B671FF` · subtle-grey `#D1D1D1` · grey `#231F20` · blue-300 `#010CFF` · blue-600 `#0000AD` · blue-900 `#020068`

They live here so the sub-brand files share one source. Load `colab-design` or `majarah-design` for that work.

### Numerics

| Group | Values |
|---|---|
| `size/space/` | 0 · 4 · 8 · 16 · 24 · 40 · 64 · 96 · 128 · 160 |
| `size/font/` | 10 12 14 16 18 20 24 28 30 36 40 48 60 72 80 100 120 160 200 240 |
| `size/line/` | 16 18 20 22 24 28 29 30 34 36 38 42 46 50 57 64 76 84 95 106 114 126 152 168 190 210 228 252 |
| `size/radius/` | 0 · 2 · 4 · 8 · 12 · 16 · 24 · full (9999) |
| `size/border/` | 0 · 0.5 · 1 · 1.5 · 2 · 4 · 8 |
| `size/opacity/` | 0 · 0.05 · 0.2 · 0.4 · 0.6 · 0.8 · 1 (**0–1, not 0–100**) |
| `size/tracking/` | 0 · 0.5 · 1 · 2 · 3 |
| `size/icon/` | 20 · 24 · 32 |
| `size/doc/` | 100 · 120 · 1080 · 1920 |

### Fonts

`font/family/display` = `thmanyah serif display` · `font/family/body` = `Azm X Variable`
`font/weight/` thin · extralight · light · regular · medium · semibold · bold · black · heavy

**Azm X has Heavy, not Black. The serif has Black, not Heavy.** Do not cross them.

---

## 2. 1b. Palette (19) — six modes

One accent ramp. Switching the mode re-themes every accent, ground and gradient.

| Token | Blue | Orange | Green | Yellow | Purple | Red |
|---|---|---|---|---|---|---|
| `accent/tint` | 50 | 50 | 50 | 50 | 50 | 50 |
| `accent/subtle` | 100 | 100 | 100 | 100 | 100 | 100 |
| `accent/soft` | 300 | 300 | 300 | 300 | 300 | 300 |
| `accent/on-dark` | 400 | 400 | 400 | 400 | 400 | 400 |
| **`accent/base`** | **600** | **500** | **500** | **500** | **500** | **500** |
| **`accent/text`** | **600** | **700** | **700** | **800** | **700** | **700** |
| `accent/strong` | 700 | 700 | 700 | 800 | 700 | 700 |
| `accent/deep` | 900 | 900 | 900 | 900 | 900 | 900 |
| `accent/ground` | 1000 | 1000 | 1000 | 1000 | 1000 | 1000 |
| `accent/ground-raised` | 900 | 900 | 900 | 900 | 900 | 900 |
| `accent/ground-sunken` | 950 | 950 | 950 | 950 | 950 | 950 |
| `accent/on-ground` | 100 | 100 | 100 | 100 | 100 | 100 |
| `accent/on-ground-faint` | 200 | 200 | 200 | 200 | 200 | 200 |
| `accent/on-ground-quiet` | 300 | 300 | 300 | 300 | 300 | 300 |
| `accent/on-base` | white | 1000 | 1000 | 1000 | 1000 | 1000 |
| `accent/on-deep` | white | white | white | white | white | white |
| `accent/on-light` | 1000 | 1000 | 1000 | 1000 | 1000 | 1000 |
| `accent/role-light` | 400 | role-light | role-light | role-light | role-light | role-light |
| `accent/role-deep` | 1000 | role-deep | role-deep | role-deep | role-deep | role-deep |

**`accent/base` vs `accent/text`.** Base is the signature — a fill colour. Text is the first step that clears 4.5:1 on white. Blue keeps Electric at both because Electric is dark; every secondary must drop, because white on yellow `#FED340` measures 1.44:1.

**`accent/ground` is what makes dark mode work per palette.** Before it, `surface/page` in Dark was hardcoded to navy, so an orange deck went blue.

**`accent/on-*` are computed, not chosen** — each is the higher-contrast of White or the palette's own step 1000, measured.

---

## 3. 2. Semantic (186) — Light │ Dark

The only tier a layout binds to.

### Surface
`page` · `raised` · `sunken` · `inverse` · `accent` · `accent-deep` · `accent-light` · `accent-inverse` · `accent-subtle` · `accent-wash` · `accent-wash-light` · `muted` · `subtle` · `lightest` · `dark` · `deep` · `pale` · `neutral` · `tertiary` · `black` · `wash-light` · `wash-dark`

| Token | Light | Dark |
|---|---|---|
| `surface/page` | white | `@accent/ground` |
| `surface/raised` | `@accent/tint` | `@accent/deep` |
| `surface/inverse` | `@accent/ground` | white |
| `surface/accent` | `@accent/base` | `@accent/on-dark` |
| `surface/accent-deep` | `@accent/role-deep` | `@accent/on-dark` |
| `surface/accent-light` | `@accent/role-light` | `@accent/role-deep` |

### Text
`heading` · `primary` · `secondary` · `strong` · `heavy` · `muted` · `subtle` · `darkest` · `inverse` · `accent` · `accent-deep` · `accent-inverse` · `on-accent` · `on-accent-deep` · `on-accent-light` · `quiet-inverse` · `faint-inverse` · `on-image` · `on-image-body` · `on-image-eyebrow` · `on-dark-strong` · `on-dark-quiet`

| Token | Light | Dark |
|---|---|---|
| `text/heading` | `@accent/ground` | white |
| `text/primary` | neutral/900 | white |
| `text/secondary` | neutral/600 | `@accent/on-ground` |
| `text/muted` | neutral/500 | `@accent/on-ground-quiet` |
| `text/accent` | `@accent/text` | `@accent/on-dark` |
| `text/on-accent` | `@accent/on-base` | `@accent/on-light` |

**Headlines are `text/heading`, not `text/primary`.** Heading is Dark Navy, primary is Neutral 900.

### Border
`subtle` · `default` · `strong` · `dark` · `faint` · `accent` · `accent-deep` · `accent-inverse` · `heading` · `inverse` · `wash-light`

All border tokens are also valid as **fills** — a hairline drawn as a 1px rectangle is still a border.

### Icon
`default` · `accent` · `secondary` · `muted` · `inverse` · `on-image` · `size/inline` (20) · `size/standalone` (24) · `size/feature` (32)

`icon/accent` uses `@accent/text`, and drops to `@accent/on-dark` on dark. Electric never appears as an icon on a dark ground.

### Status
`{success|warning|danger|info|caution}/{text|bg|border|wash}` · `dot/{red|yellow|green}`

Every text-on-bg pairing clears 4.5:1 in both themes. **`status/info/*` stays blue by definition and does not follow the palette** — otherwise an orange deck could not distinguish info from accent.

### Action
`primary/{default|hover|pressed|disabled}` · `secondary/{default|hover|pressed}` · `on-primary`

### Overlay
`faint` · `subtle` · `medium` · `strong` · `scrim` · `glass` · `accent`

### Gradient — follows the palette
`gradient/start` → `mid` → `mid-alt` → `end`

| Palette | Stops |
|---|---|
| Blue | `#040038` → `#01006E` → `#0200D3` → `#001AFF` |
| Orange | `#2E170E` → `#5A2D1B` → `#A1502F` → `#F47A48` |
| Green | `#062515` → `#0D4829` → `#168049` → `#22C36F` |
| Yellow | `#251601` → `#693F02` → `#895F0F` → `#FED340` |
| Purple | `#100024` → `#2E0068` → `#7341AD` → `#C68FFF` |
| Red | `#30080B` → `#5E1016` → `#A81C27` → `#FF2B3C` |

145°, event surfaces only: covers, dividers, closings. Never behind body copy.

### Spacing, radius, border width
`space/` none 0 · 4xs 4 · 3xs 8 · 2xs 16 · xs 24 · sm 40 · md 64 · lg 96 · xl 128 · 2xl 160
`radius/` none 0 · xs 2 · sm 4 · md 8 · lg 12 · xl 16 · 2xl 24 · pill
`border-width/` none 0 · thin 0.5 · hairline 1 · medium 2 · thick 4 · heavy 8

**Those ten spacing values are the only permitted ones.** No 12, no 20.

### Type
`type/display/{2xs,xs,sm,md,lg,xl,2xl,3xl,4xl,5xl}/{size,line}` — leading ×0.95
30/29 · 36/34 · 48/46 · 60/57 · 80/76 · 100/95 · 120/114 · 160/152 · 200/190 · 240/228

`type/body/{2xs,xs,sm,md,lg,xl,2xl}/{size,line}` — leading ×1.5
12/18 · 14/22 · 16/24 · 18/28 · 20/30 · 24/36 · 28/42

`type/tracking/` normal 0 · slight 0.5 · wide 2 · wider 3
`font/heading` · `font/text` · `weight/{thin…heavy}` · `opacity/{hidden…full}`

---

## 4. 3. Component (56) — one mode

Aliases Semantic only. Use inside the main component, never on a loose layer. Light/Dark is handled one tier down.

`card/` surface border radius padding title body
`case-study/` surface eyebrow title lead body tags logo page-number mockup rule frame
`footer/` logo rule page-number · `footer/inverse/` logo rule page-number
`slot/` surface label · `meter/` track fill label value radius height
`star-tile/` surface mark label radius · `heat/` low mid high text
`logo/` fill/{default,inverse,accent,muted} clear-space height/{sm,md,lg}
`logo-hamaa/` fill/{default,inverse,accent,muted} · `logo-client/` fill/{default,inverse}
`bg/` default inverse accent

**Wired:** case-study, footer, slot, logo, logo-hamaa, logo-client — bound on their main components, cascading to ~390 instances.
**Not yet wired:** card, meter, star-tile, heat (mains on Hospitals Report), bg (main on Gradient & Bks).

---

## 5. 4. Canvas (4)

`slide/width` 1920 · `slide/height` 1080 · `slide/margin-x` 120 · `slide/safe-area` 100

Sits outside the chain. Document constants, deliberately off the spacing scale.

---

## Styles

**1 paint style** — `Brand/Gradient · Event surfaces`, 145°, `#040038` → `#01006E` @55% → `#001AFF`.

**12 text styles**, each bound to the type tokens so the scale cannot drift:
`Display/Hero` `Display/Title` `Display/Section` `Display/Stat` `Display/Subhead` `Display/Quote`
`Body/Large` `Body/Default` `Body/Small` `Body/Caption` `Body/Emphasis` `Label/Eyebrow`

**Use the text style, not the raw tokens**, unless nothing fits.

---

## Verified state, 2026-08-08

| Check | Result |
|---|---|
| Unset modes | 0 |
| Tier-direction violations | 0 |
| Chains unresolvable in any of 12 combinations | 0 |
| Scope / publishing errors | 0 |
| References to the deleted collections | 0 |
| Contrast failures across all 12 combinations | **0** |

## Known gaps

- Purple and yellow `role-tint` / `role-border` / `role-mid` are **derived**, not board-supplied
- `text/subtle` and `icon/muted` measure 2.51:1 on white — inherited; fine for disabled states, not body text
- `card`, `meter`, `star-tile`, `heat`, `bg` component tokens exist but their mains are not yet bound
- Live files still carry ~430 bindings on primitives, chiefly off-scale values (12px gaps, 40px font size) that are design drift rather than token gaps
