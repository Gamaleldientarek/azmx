---
name: colab-design
description: Apply the official Colab design system to any deliverable. Use whenever work involves Colab branding, Colab presentations, research reports, usability-test findings decks, sales decks, slides, or documents, or when the user mentions Colab colors, Electric Green, Pine Green, Jade Green, the pixel or dither motif, the Advanced Presentation grid, or the colab. wordmark. Colab is a bilingual EN/AR user experience research lab. Provides the full palette with contrast rules, type scale, the 8-column slide grid, 14 layout archetypes, the pixel/dither graphic language, component specs, and Arabic/RTL rules.
---

# Colab Design System

Colab is a **User Experience Research Lab** operating in Saudi Arabia and the wider MENA region. Bilingual English/Arabic. Its work serves enterprise clients across finance, travel, and retail.

One-line ethos: **dark green ground, one neon accent, and a pixel field that assembles itself.** The brand book's own line is the concept root — *"our UX testing labs are designed to explore, iterate, and refine ideas through hands-on collaboration, just like building with blocks, piece by piece, insight by insight."* The dither motif executes that literally.

**Decks go to CEOs. Readability outranks expression, every time.**

For exact Figma variables read `references/figma-tokens.md`. For every tone in every ramp read `references/colors.md`. For the 14 layout recipes with grid coordinates — plus research-findings slides (§2), the motif construction rules (§4) and Arabic/RTL (§5) — read `references/layout-archetypes.md`. For component specs read `references/components.md`. For icons — the Hugeicons house rules, the proven working set, and 5,437 vendored SVGs — read `references/icons.md` and `references/icon-index.md` (note: the **report template** uses Phosphor-derived `Icon / *` masters instead — flattened fills, bind `fill`; see `references/report-template.md`). For working the design system inside Figma — including the paint-opacity trap, the instance-override law and the section-bounds soft-delete — read `references/figma-workflow.md`. **For editorial and typographic technique — the 20 named techniques, exact tracking and leading numbers, the 10 one-big-move archetypes, grid-break thresholds, and the amateur-tell checklist — read `references/editorial-technique.md`.** **For the standing client decision law (C-01…C-17 plus the deck-era rules and the client taste profile) read `references/decision-law.md` — it overrides anything older.** **For the componentized 31-slide usability-report system — catalog, approved slide patterns, screen-clip recipe, reporting conventions — read `references/report-template.md`.**

---

## The one rule that matters most

**Electric Green `#34FF67` is an accent on dark. It is never a surface behind body text.**

| Pairing | Contrast | Verdict |
|---|---|---|
| `#34FF67` on White | **1.34 : 1** | Fails everything, including the 3:1 non-text floor |
| `#34FF67` on Pine Green `#103A21` | **9.49 : 1** | AAA, all sizes |
| `#34FF67` on Deep Jade `#011E14` | **13.07 : 1** | AAA, widest margin |

- **Default backgrounds are Pine Green, Deep Jade or White.** Rotate them — never run one ground through a whole deck.
- Electric Green as a *surface* is permitted only on covers, dividers, and minimal-text slides.
- ⛔ **Electric Green and Jade Green must NEVER appear on a white or light ground.** Not as text, not as icons, not as decorative blocks, not as rules, not as number accents. On light grounds the accent role is played by **Pine Green** or **Olive Green**. Jade at **1.29:1** is worse than Electric at 1.34 — the ban covers both.
- On Pine or Deep Jade grounds Electric Green is fully usable down to body size.
- Electric Green floods take **Deep Jade** text (13.91:1), not Pine (9.49:1) and never white (1.34:1).

Projector caution: `#34FF67` sits near the sRGB gamut edge in chroma-key green territory. Lamp projectors and Teams/Zoom chroma subsampling degrade thin green strokes and small green text first. Never let green alone carry legibility in a projected or recorded context.

---

## Palette

### Primary

| Token | Hex | Role |
|---|---|---|
| **Electric Green** | `#34FF67` | The signature accent. Eyebrows, highlights, one chart series, motif fill on dark. |
| **Pine Green** | `#103A21` | The default dark surface. The logo's default colour. |
| **Jade Green** | `#33FFC2` | Secondary accent. Positive delta indicator. Use sparingly — it competes with Electric. |
| **Grey** | `#BCBEC0` | True neutral grey. Muted chart chrome, dividers, "no change" state. |

`#BCBEC0` is **not** interchangeable with `Main Colors/Neutral/*` — those are cool blue-greys (`#9DA4AE`, `#6C737F`). This one is neutral.

### Secondary — use as *categorical* identifiers, not decoration

| Token | Hex | Conventional role |
|---|---|---|
| **Vivid Orange** | `#FF5A32` | Critical / high severity. Below-target. The palette has no red — this substitutes. |
| **Deep Jade** | `#011E14` | The deepest ground. White reads 17.54:1 on it — the highest in the system. |
| **Olive Green** | `#5B6B3E` | Medium severity. |
| **Pale Sky Blue** | `#B1D9E8` | Low severity. Quiet informational ground. |

Full 50→950 ramps exist for every hue. See `references/colors.md`.

---

## Typography

**Inter (EN) · Alexandria (AR).** Nothing else. Poppins, Jura, Sora, Actor and Orbitron appear in the legacy file and are **not** brand fonts.

Sanctioned weights: Light, Regular, Medium, SemiBold, Bold, Black.

### Scale — `Typography/*` is canonical

| Display | 240 | 200 | 160 | 60 | 40 | 24 | 20 | 16 |
|---|---|---|---|---|---|---|---|---|
| Line-height | ×0.95 throughout |

| Body | 40 | 36 | 28 | 24 | 20 | 16 | 12 |
|---|---|---|---|---|---|---|---|
| Line-height | ×1.16 throughout |

Letter-spacing is `0` at every size.

⚠️ **Arabic needs its own line-height.** `1.16` is far too tight for Alexandria. Floor of **1.5** for AR body. Never share one line-height token across EN and AR.

The legacy `Font-size/Heading Size/*` and `Font-size/Text Size/*` scales are **deprecated** (and contain a bug: `XL = 120px`, sitting between `LG 18` and `2XL 24`).

### Roles

| Role | Size | Weight | On dark | On light |
|---|---|---|---|---|
| Display headline | Display 160–240 | Bold/Black | White | Pine Green |
| Slide title | Display 60 | Bold | White or Electric | Pine Green |
| Eyebrow / kicker | Body 20–24 | Medium | **Electric Green** | Pine Green |
| Body | Body 20–24 | Regular/Light | White @ 80% | Pine Green / Neutral |
| Caption | Body 12–16 | Regular | White @ 80% | Neutral |
| Stat numeral | see below | Bold/Black | White | Pine or Deep Jade |
| Footer meta | Body 12–16 | Regular/Bold | White @ 80% | Pine Green |

Use **tabular (lining) figures** so KPI-row digits align. Both faces support it.

---

## Grid — `Advanced Presentation`

**1920 × 1080, 16:9.** This grid governs all new presentation design.

| Col | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
|---|---|---|---|---|---|---|---|---|
| x start | 100 | 320 | 540 | 760 | 980 | 1200 | 1420 | 1640 |
| x end | 280 | 500 | 720 | 940 | 1160 | 1380 | 1600 | 1820 |

- 8 columns × 180px, **40px gutters**, content block 1720px, **100px side margins**
- **50px bleed-safe margin** on all four edges — nothing critical inside it
- **98px footer band** pinned to the bottom (y 982 → 1080)
- Live content zone: y 50 → 982, **932px tall**

Common spans: left half `C1–C4` (x 100→940) · right half `C5–C8` (x 980→1820) · the system's default asymmetric split is **C1–C3 text : C4–C8 visual**.

---

## The pixel / dither motif

A density field of squares that migrates sparse → dense toward a canvas edge. Density is a **computed per-cell value**, not a hand-placed gradient — build it the way halftone works.

| Rule | Spec |
|---|---|
| Base module | **20px** — exactly 1/9 of a 180px column, so nine atoms tile a column with no remainder |
| 2× module | **40px** — equals the gutter |
| Direction | Always toward an **edge or corner, never the centre** |
| Span | ≤3 columns (540px) from sparse to dense. Longer reads as texture, not assembly |
| Coverage | ≤20% of canvas on content slides. Covers and dividers may run 60–100% |
| Never under text | The field occupies a bounded zone that never underlaps a text bounding box, even at low density |
| Markers `+ × o` | At cell intersections only, ~1 per 8–12 plain modules, never adjacent to each other |
| Colour | **One colour per instance.** Never two accent hues inside the motif |

Atoms: solid square · outlined square · plus `+` · cross `×` · ring `o` · chevron `^` `>` · checker block.

**Never place the motif inside a chart area.** It is a margin and edge device. Putting brand texture on data is chartjunk.

---

## Layout — the default moves

Full recipes in `references/layout-archetypes.md`. The essentials:

1. **Never centre a text block across the full 8-column measure.** Asymmetry is the system.
2. The **37 : 63 split** (3 cols text : 5 cols visual, or inverse) is the house proportion. It recurs deliberately so slides feel related without being identical.
3. Put the most important number or decision **in the first 3 words or the top-left quadrant**. Executives scan a slide in 3–5 seconds.
4. **Cap any visible list at 3 lines.** Readers take bullets 1 and 2, rarely 3, almost never 4.
5. One bold **governing sentence** per findings slide, with the exhibit beside it — not beneath it.
6. **One accent per chart.** Mute everything else to white, neutral grey, or Pine.

### Big numbers

| Context | Cap-height |
|---|---|
| Hero, single-stat slide | 380–420px |
| Inside a KPI row (≤5 metrics) | 160–200px |
| Supporting stat beside a chart | 60–100px |

**A numeral alone is incomplete.** Pair every hero number with exactly **one** comparison: delta vs prior, distance to target, or peer benchmark. Never stack several. Label sits directly below, ≤3 words, on the **same left edge** as the numeral — not centred under it.

Direction-of-good: Vivid Orange = regression · Electric or Jade = improvement · Grey `#BCBEC0` = no change.

---

## Logo

The wordmark is **`colab.`** — lowercase, with the period. Single L. *(The legacy Figma file misspells it "Collab" in the filename.)*

Seven lockups: `Mark` (`c.`) · `Wordmark` · `Wordmark + Tagline EN` · `Wordmark + Tagline AR` · `Wide — Compact` · `Wide — Tagline` · `Wide — Full`

Three colours: **Pine Green** `#103A21` (default, on light) · **Electric Green** `#34FF67` (on dark) · **White** (on photography, and wherever Electric would vibrate)

Taglines: `USER EXPERIENCE LABORATORY` / `كولاب مختبر تجربة المستخدم`

**Never** mirror the logo for RTL layouts. Arabic is a separate lockup, not a flip.

---

## Icons — Hugeicons

**Hugeicons, not Phosphor.** The audit found 1,272 Hugeicons placements across all 8 pages and zero Phosphor. The free Stroke Rounded set is MIT licensed; all 5,437 icons are vendored in `assets/icons/stroke-rounded/`.

Hugeicons has **no weight axis**. It has two variant axes: **Type** (Rounded / Sharp / Standard) and **Style** (Stroke / Solid / Pro-only Duotone, Twotone, Bulk).

- **`Type=Rounded`, always.** 1,272 of 1,272 placements. Sharp and Standard are never used.
- **`Style=Stroke` is the default.** Solid is a status device only — four icons in the whole file appear Solid: `checkmark-circle-01`, `multiplication-sign-circle`, `cancel-circle`, `stars`. All Pro styles and Pro types are non-redistributable and must never be committed.
- Bind colour variables to **`stroke`** — Hugeicons Stroke instances are live strokes. Bind to `fill` only on a Solid instance. **Never flatten an icon**; it destroys the binding.
- Sizes on the 8px grid: **24 / 32 / 40 / 48 / 64 / 80**, stroke **1.5 / 2 / 2 / 2.5 / 3 / 3**. Never below 24px on a 1920 slide. Resize with W/H, not the Scale tool, or the stroke weight multiplies.
- ⛔ Electric and Jade Green icons are **banned on white and light grounds** — 1.34:1 and 1.29:1, below the 3:1 non-text floor. On light, the icon colour is Pine Green; Olive Green is the second tier. Grey `#BCBEC0` is a dark-ground device only (1.86:1 on white).

Full rules, the 43-icon proven working set, colour table and RTL swap pairs: `references/icons.md`. Every icon name with its download link: `references/icon-index.md`.

---

## Arabic / RTL

Full rules in `references/layout-archetypes.md` §5. The non-negotiables:

1. **Mirror the grid, not just the text.** C1↔C8, C2↔C7, C3↔C6, C4↔C5. Right-aligned text on an unmirrored LTR grid is the amateur tell.
2. **The motif direction mirrors too** — it encodes assembly. Backwards density reads as disassembly.
3. **Flip only directional elements**: arrows, chevrons, carets, progress. **Never flip** the logo, charts, photos, or screenshots.
4. Numerals stay LTR inside RTL flow. Keep them in their own text nodes where practical.
5. Arabic gets its own line-height token — floor 1.5.
6. Use **variable modes** (EN/AR), not duplicated masters. Separate pages only at deck level.

---

## Anti-patterns

| Don't | Why |
|---|---|
| Electric Green as a large fill or text on light grounds | 1.34:1. Also causes fatigue on dark at scale |
| Motif behind or under the headline | Decoration must not compete with content |
| Centred everything | Contradicts the asymmetric system |
| More than 3–4 findings per slide | Readers stop after bullet 2 |
| Chartjunk — 3D, shadows, decorative gradients, heavy gridlines | Fails the data-ink ratio |
| Electric + Jade + Orange together in one chart | Destroys the "look here" signal |
| Improvised severity colours | Breaks skim-by-colour. Fix the ordinal mapping |
| A big number with no benchmark | Reads as decoration, not insight |
| One dark ground everywhere | Rotate Pine, Deep Jade and white across a deck |
| The same motif on every slide | It is a generative density system, not a static lockup |
| RTL as an afterthought | See above |

---

## Provenance

Derived from the client's Figma file (audited 2026-07-26), its Brand Book pages, and the 37 client-approved slides in `Design Slides V2` — which the client authored and confirmed as the reference look and feel.

Contrast ratios are computed with the WCAG 2.x relative-luminance formula, not estimated. Layout archetype coordinates are derived for this specific grid from sourced composition principles; they are Colab's own design rules, not external benchmarks. See `references/layout-archetypes.md` for the sourced/derived split.
