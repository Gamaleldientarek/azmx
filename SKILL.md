---
name: colab-design
description: Apply the official Colab design system to any deliverable. Use whenever work involves Colab branding, Colab presentations, research reports, usability-test findings decks, sales decks, slides, or documents, or when the user mentions Colab colors, Electric Green, Pine Green, Jade Green, the pixel or dither motif, the Advanced Presentation grid, or the colab. wordmark. Also use for any Arabic, RTL, mirrored, or bilingual EN/AR version of Colab work — Alexandria typography, mirroring a deck, or right-to-left layout. Colab is a bilingual EN/AR user experience research lab. Provides the full palette with contrast rules, type scale, the 8-column slide grid, 14 layout archetypes, the pixel/dither graphic language, component specs, and a measured Arabic/RTL build system.
---

# Colab Design System

Colab is a **User Experience Research Lab** operating in Saudi Arabia and the wider MENA region. Bilingual English/Arabic. Its work serves enterprise clients across finance, travel, and retail.

One-line ethos: **dark green ground, one neon accent, and a pixel field that assembles itself.** The brand book's own line is the concept root — *"our UX testing labs are designed to explore, iterate, and refine ideas through hands-on collaboration, just like building with blocks, piece by piece, insight by insight."* The dither motif executes that literally.

**Decks go to CEOs. Readability outranks expression, every time.**

For exact Figma variables read `references/figma-tokens.md`. For every tone in every ramp read `references/colors.md`. For the 14 layout recipes with grid coordinates — plus research-findings slides (§2), the motif construction rules (§4) and Arabic/RTL (§5) — read `references/layout-archetypes.md`. For component specs read `references/components.md`. For icons — the Hugeicons house rules, the proven working set, and 5,437 vendored SVGs — read `references/icons.md` and `references/icon-index.md` (note: the **report template** uses Phosphor-derived `Icon / *` masters instead — flattened fills, bind `fill`; see `references/report-template.md`). For working the design system inside Figma — including the paint-opacity trap, the instance-override law, the section-bounds soft-delete and the RTL API traps — read `references/figma-workflow.md`. **For governing the Figma variable layer — why `scopes` and not `hiddenFromPublishing` controls the picker, semantic-vs-primitive layering, alias repair, and the EN/AR modes — read `references/variable-architecture.md`.** **For building an Arabic/RTL deck — the mirror invariant, the auto-layout reversal laws, the instance-override probe, bidi traps, motif re-solving and the 12-predicate verification set — read `references/rtl-arabic.md`.** **For editorial and typographic technique — the 20 named techniques, exact tracking and leading numbers, the 10 one-big-move archetypes, grid-break thresholds, and the amateur-tell checklist — read `references/editorial-technique.md`.** **For the standing client decision law (C-01…C-17 plus the deck-era rules and the client taste profile) read `references/decision-law.md` — it overrides anything older.** **For the componentized 31-slide usability-report system — catalog, approved slide patterns, screen-clip recipe, reporting conventions — read `references/report-template.md`.**

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


## The second rule: bind, don't correct

**0 of 720 deck text nodes and 0 of 179 master text nodes were bound to a text style.** 30 text styles existed in the file, with **2 consumers file-wide**.

Exactly the properties that were bound held. Exactly the properties that were not, drifted:

| Property | Bound on | What happened |
|---|---|---|
| `fills` | **100%** — `unboundFills: 0` | On-palette throughout. No drift |
| `fontFamily` | 94% | Held |
| `fontSize` | 44% | **28 distinct sizes**, including `7.6195859909px` from Scale-tool operations |
| `lineHeight` | **0%** | **10 distinct leadings** across a 12:1 size range |
| `letterSpacing` | **0%** | Uncontrolled at every size |

**353 of 720 text nodes were off-scale.**

The correlation is the finding. This was never a discipline problem and never a taste problem — **the deck was already 100% variable-bound for fills.** C-05 was satisfied for colour and silently unsatisfied for type, because type had no style layer to bind to.

**Binding to styles is what makes a system hold.** Correcting values slide by slide fixes today's deck; binding fixes every deck after it. A slide-by-slide correction pass on 720 nodes is a week of work that decays the moment someone duplicates a slide and nudges a size.

Two consequences, both enforceable:

1. **Every slide-level text node binds to a text style.** Pass-gate check #13. Component-instance internals are exempt — the instance-override law means a slide cannot change them.
2. **Every text style binds its `fontSize`, `lineHeight`, `letterSpacing` and `fontFamily` to variables.** A style with hard-coded numbers is a second place for the truth to live, and it will not survive the EN→AR mode switch.

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
| Line-height | ×0.90 at ≥100px · ×0.95 below |

| Body | 40 | 36 | 28 | 24 | 20 | 16 | 12 |
|---|---|---|---|---|---|---|---|
| Line-height | **×1.35 throughout** |

Letter-spacing is **not** `0`. Display ≥100px is −2.5%; Display 60/40 is −2.2%; body runs −1.1% to −2.0%; all-caps labels are **+4%**, and **+6%** at 12. Full table in `references/editorial-technique.md` §2.3.

**×1.35 supersedes ×1.16.** The published 1.16, this skill's own 1.40–1.60 recommendation and the deck's actual 1.20–1.36 were a three-way conflict. The deck's measured mode is **1.33**; 1.35 sits on that centre of gravity. A value nobody used is not a standard.

**Two style families carry the labels and the emphasis:** `Caps/*` at 24/20/16/12 (UPPER, +4%, +6% at 12) and `Body/* SemiBold` at 28/24/20/16. Before they existed, bold body text had nowhere legal to bind — which is why 353 nodes drifted off-scale.

⚠️ **Arabic gets its own line-height.** **×1.5** at every size, delivered by the **AR mode** of the `numbers` collection — a mode, not a parallel token set. Arabic tracking is pinned to **0** in AR mode. Never share a line-height token across EN and AR.

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
| Coverage | **0% on content slides** — decorative motif appears on statement slides (cover, dividers, closing) and counted fields only. Covers and dividers may run 60–100% |
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

**Full build system in `references/rtl-arabic.md`** — measured against a complete 36-slide AR build. Summary in `references/layout-archetypes.md` §5. The non-negotiables:

1. **RTL is not right-alignment.** It is a coordinate transform on x, a reversal of every auto-layout reading order, and a re-fitted vertical rhythm. Applying `textAlignHorizontal = RIGHT` and stopping there flips the glyphs and nothing else.
2. **Mirror the grid: `x' = 1920 − x − w`.** The grid is symmetric about x960, so C1↔C8, C2↔C7, C3↔C6, C4↔C5 and legal edges map onto legal edges.
3. **Vertical does not mirror — but it must be re-fitted.** Arabic's ×1.5 leading floor against EN display's ×0.90 makes any stat block ~**1.67× taller**. Re-space the block; never shrink the type, because 1.5 is a collision constraint (MSA ink envelope 1.505em).
4. **Auto-layout is the blocker.** VERTICAL stacks need `counterAxisAlignItems: MAX`; HORIZONTAL stacks need their **child order reversed**, at every nesting level. Figma has no RTL auto-layout.
5. **`x`, `constraints` and child order are not overridable on an instance.** Every mirror is therefore a master-level fix — build AR sibling components.
6. **Re-solve the motif; never mirror it.** Arabic text extents differ, so a mirrored field lands on content. Solve **last**, after translation and alignment.
7. **Counted fields are data.** Never re-solve them, and mirror the modules *inside* the field, not just its frame.
8. Numerals stay LTR, pinned to Inter as inline ranges. **The en dash is bidi class ON and inverts `25–34` into `34–25`** — ASCII hyphen only in ranges.
9. **Arabic is ~10% narrower than Latin, not smaller.** Do not apply an optical size step-up; a measurement suggesting otherwise is a stale-layout artifact.
10. Use **variable modes** (EN/AR) for anything a mode can carry — type, numerals, colour. Geometry cannot be carried by a mode, which is what forces AR siblings.

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

**Motif opacity floor.** Electric composited on the ground must clear the 3:1 non-text floor: **40% on Deep Jade** (3.15:1), **50% on Pine** (3.62:1 — 40% is only 2.85:1 there). Below the floor it is decoration and must never carry data. See `references/layout-archetypes.md` §4.4.
