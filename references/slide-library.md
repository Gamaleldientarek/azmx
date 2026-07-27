# Colab — Slide Library (EN + AR)

Thirty-six built, reviewed slides from the `Report Template` — every coordinate measured from the live Figma file, not designed on paper. This is the layout stock: reach for a slide here before inventing a composition.

All geometry is **EN**. The AR version of every slide is derived by the rules in §4, so this file stays single-source. `references/rtl-arabic.md` governs the derivation; this file governs the layouts.

Canvas **1920 × 1080**. Grid, anchors and footer band per `layout-archetypes.md` §0.5 and `SKILL.md`.

Notation: `[x, y, w, h]` · `T` text · `R` rect · `I` instance · `F` frame · `C` component
Motif: `[x, y, w, h, fill]` — `fill` is the measured cell-occupancy ratio, the number to reproduce.

---

## 1. How to use this

1. **Pick by job, not by number.** §2 groups the 36 by what they do.
2. **Copy the geometry exactly.** These positions are on the column grid and the vertical anchors; nudging them is how decks drift.
3. **Copy the motif spec exactly too** — position, size *and* fill. The fill column is why the deck looks coherent; §3 has the distribution.
4. **For Arabic, apply §4** — do not re-derive the mirror per slide, and do not mirror `y`.
5. Ground is part of the layout. §5 has the rotation.

---

## 2. The catalogue

### Openers and dividers

| # | Slide | Ground | Motif `[x,y,w,h,fill]` | Anatomy |
|---|---|---|---|---|
| **01** | Cover | Deep Jade | `[960,0,1020,950,.19]` | eyebrow T24 `[100,470,256,17]` · title T160 `[100,518,800,260]` · meta-field I ×3 at x **100 / 380 / 660**, `y816`, h32 |
| **06** | Divider — Study Results | Pine | `[1107,0,820,950,.18]` + `[100,120,500,264,.14]` | eyebrow T24 `[100,470]` · title T160 `[100,518,900,260]` |
| **19** | Divider — Recommendations | Pine | `[1297,0,640,950,.11]` + `[100,120,500,264,.13]` | eyebrow T24 `[100,470]` · title T160 `[100,518,1411,116]` |
| **23** | Divider — Executive Summary | Deep Jade | `[1152,0,820,950,.18]` + `[100,120,500,264,.12]` | eyebrow T24 `[100,470]` · title T160 `[100,518,980,260]` |
| **31** | Thank You | **Electric** | — | single frame `[80,-1,1840,891]` |

> The divider pattern is fixed: **statement anchors** eyebrow y470 / title y518, a full-height field on the outer edge, and a small `500×264` counter-patch at `[100,120]` on the *same* side as the title.

### Contents and agenda

| # | Slide | Ground | Motif | Anatomy |
|---|---|---|---|---|
| **02** | Contents | Deep Jade | `[39,220,620,700,.14]` | eyebrow T24 `[100,120,620,24]` · list frame V `[833,212,987,656]`, gap 28, 6 rows |

Row internals: `agenda-number` 140 wide, `agenda-label` 1400 wide, row gap 80, `rule` 987 wide between rows.

### Framing and overview

| # | Slide | Ground | Motif | Anatomy |
|---|---|---|---|---|
| **03** | Study Overview | Pine | `[420,0,1500,300,.20]` | title T60 `[100,120,271,101]` · body T24 `[100,400,620,113]` · Focus-Square F `[987,351,757,198]` gap 30 · KPI row H `[107,626,1644,260]` gap **129** · caption T16 `[107,896,824,12]` |
| **04** | Objectives | Pine | `[0,460,720,460,.22]` | title T60 `[100,168]` · body T28 `[100,300,451,114]` · group-title T20 ×2 at y **168 / 530** · numbered-item I ×4 at x760, y **236/366/598/728**, pitch 130 · block-rule ×2 `[760,204,1060,1]` / `[760,566,…]` |
| **09** | Task Overview | White | `[940,0,980,260,.18]` | title T60 `[100,100]` · body T16 `[100,200,800,12]` · stat-value T160 `[100,320,368,116]` · stat-label T16 `[100,510]` · caption T12 `[100,560]` · table `[667,300,1167,…]` |

### KPI and metric

| # | Slide | Ground | Motif | Anatomy |
|---|---|---|---|---|
| **12** | Headline Metric | Deep Jade | `[900,0,1020,920,.20]` | eyebrow T24 `[100,240]` · **title T240** `[95,330,399,175]` · progress frame V `[115,607,528,61]` gap 10 · body T28 `[100,789,760,58]` |
| **24** | Testing Activities | Pine | `[0,760,920,160,.19]` + `[420,0,1500,340,.19]` | title T60 `[100,120,266,101]` · stat-value T160 ×2 at x **100 / 487**, y518 · stat-label T16 ×2 y698 · card frame `[967,380,770,517]` |

Progress bar internals (12): `target-track` 526 wide · `target-actual` 395 (75%) · `target-notch` 2 wide at the track's **far** end.

### Tables and ledgers

| # | Slide | Ground | Motif | Table |
|---|---|---|---|---|
| **05** | Participants | White | `[500,0,1420,200,.17]` | header `[100,300,1720,72]` · cols x **124/344/564/824/1164/1464** · row pitch 64 · 8 rules |
| **08** | Time on Task | White | `[520,0,1400,220,.17]` | header `[100,368,1734,72]` · label col x124 · data cols x **510→1420 step 130** · geo col `[1664,440,170,384]` · row pitch 64 |
| **25a** | Testing Activities — Ledger | White | `[0,0,1920,80,.21]` + `[0,540,500,380,.21]` | **staircase**: row-value T60 at x **100/320/540/760/980**, rules all end 1820, pitch 132 |
| **28b** | Area Insights — Detail | Deep Jade | — | col heads x **100/256/920/1600** y324 · header-rule `[100,352,1734,1]` · row I ×9 `[100,360+64n,1734,64]` |

> **25a's staircase is deliberate** — each row indents 220 further right while every rule ends on the 1820 margin. Do not "correct" it.

### Findings and evidence

| # | Slide | Ground | Motif | Anatomy |
|---|---|---|---|---|
| **07** | Key Findings | Pine | `[840,0,1080,260,.19]` | content-panel `[47,47,1840,890]` · title T60 `[100,168]` · body T24 `[100,360]` · finding-card ×3 `[100,520,800,88]` pitch 104, marker 6 wide on the card edge · bar-track ×3 `[980,390,854,64]` pitch 96 · bar-value T28 x1738 · bar-target T12 x1624 · caption T12 `[980,690]` |
| **13** | Insight Detail | Pine | `[1040,0,880,360,.20]` | title T60 `[100,168,900,101]` · Impact card C `[100,400,700,310]` · quote-card `[967,400,860,420]` · quote-mark T60 inset **32** from the card edge · quote-ar T28 `[1007,560,760,38]` · quote-en T16 y611 · attribution T12 **y760** |
| **20** | Finding Highlights | Pine | `[320,780,1600,140,.19]` + `[660,0,1260,340,.20]` | group-title T20 ×2 at x **100 / 1000** y380 · finding-card I ×6, two columns x **100 / 1000**, y **430/534/638** · caption T12 `[100,790]` |
| **20b** | Finding Highlights — Full | Pine | — | highlight-row I ×12 in 3 cols x **100/686/1272** · score-card I ×3 same cols y740 · legend tag `[1363,201,457,34]` |
| **27** | Area Insights | Deep Jade | `[1489,720,431,220,.22]` | title T60 full-width `[100,168,1720,57]` · body T24 `[100,290,1060,64]` · 2×2 grid: rule/finding-title T28/finding-evidence T20 at x **100 / 980**, severity-glyph 44×44 leading each · legend tag `[1363,201,457,34]` |
| **27c** | Area Insights — Ledger | Pine | `[1203,-100,720,260,.15]` | single column: rule ×5 `[100,406+128n,1720,1]` · finding-title **T40** x180 · finding-evidence T20 x1200 · glyph 44 at x100 |
| **27d** | Area Insights — Split | Deep Jade | `[1489,720,431,220,.22]` | identical to **27** |
| **29** | Area Insights — Tags | Pine | — | insight-card I ×9 in 3 cols x **100/686/1272**, `[…,300,562,190]` |

### Device evidence

| # | Slide | Ground | Motif | Devices |
|---|---|---|---|---|
| **10** | Task Evidence — Web vs App | Pine | `[480,0,1440,220,.18]` | laptop `[131,357,918,560]` + phone `[1515,284,285,620]` · numbered items x1147, y **400 / 640** |
| **11** | Task Evidence — Web | Pine | `[800,150,1120,200,.18]` ×2 stacked (y150, y350) | laptop `[898,268,918,560]` · text column x100 w647 |
| **14** | Insight Evidence — App | Pine | `[1522,40,400,920,.18]` | Samsung `[1298,110,371,779]` · items: number x100, title/body x207 |
| **18** | Screen Comparison — A vs B | Pine | `[1091,80,720,180,.17]` | two groups `[91,…]` and `[1025,…]`, each `[phone, results-panel]` gap 67, outer gap 131 |
| **21** | Recommendation | White | `[1420,673,500,264,.13]` | panel-right `[1461,47,426,890]` · phone `[1532,182,285,620]` · category-block I ×4 in 2 cols x **100 / 660** |

> **11's two stacked fields** are a single visual block split in two — keep both, at y150 and y350.

### Statement and synthesis

| # | Slide | Ground | Motif | Anatomy |
|---|---|---|---|---|
| **15** | Cross-Cutting Theme | Deep Jade | `[1200,760,720,180,.17]` | eyebrow T24 `[100,120]` · **title T240** `[100,200,1531,216]` · cat-chip `[1700,116,120,40]` · theme-rule `[100,560,1720,1]` · body T28 `[100,610,840,114]` · cat-label + item-body at x980 |
| **16** | Overall Feedback | Pine | `[420,0,1500,360,.20]` | title T60 `[100,168,276,101]` · feedback-block I ×2 at x **100 / 980**, `[…,400,760,440]` |
| **17** | A vs B Comparison | Pine | `[917,287,80,600,**.39**]` | comparison row H `[147,287,1640,600]` gap 70, children `[colA 700, motif 80, colB 720]` |
| **22** | Next Steps | Pine | `[1440,320,480,600,.22]` + `[460,0,1460,320,.19]` | title T60 `[100,168]` · step-item I ×3 `[100,360,1300,150]` pitch 180 |
| **26** | Testing Activities — Field | Deep Jade | — (**counted field**) | ledger frame `[100,300,560,512]` · legend-row `[100,878,436,24]` · **insight-field `[855,438,1032,504]` = 130 data squares** · mega-numeral T240 `[855,436]` · mega-label T28 `[855,742]` |
| **30** | Overall Insights | Pine | `[1203,-43,720,260,.15]` | title T60 `[100,176]` · insight-row I ×4 `[100,340,1520,100]` pitch 140 |
| **32** | Study Timeline | **Electric** | `[0,0,1920,80,.20]` | timeline-rule `[100,568,1720,4]` · step-marker 60×60 ×6 at x **100/432/764/1096/1428/1760** · alternating step-title/body above and below the rule |
| **33** | Positioning Matrix | White | `[0,280,940,320,.22]` | axis-v `[1400,280,2,620]` · axis-h `[980,590,840,2]` · chip 260×56 ×6 · body T28 `[100,640,620,114]` |

> **17's field is unique**: `fill .39` and **uniform** — no ramp. It is a divider rule built from the module, and it lives *inside* the comparison row as a child, which is what centres it.

> **26's `insight-field` is data, not decoration.** 130 squares, one per insight, coloured by severity. Never re-solve, re-density or delete it.

---

## 3. Motif distribution across the deck

Measured across all 36:

| Property | Value |
|---|---|
| Slides carrying a field | **31 of 36** |
| Slides with **no** field | **5** — 20b, 26, 28b, 29, 31 |
| Slides with **two** fields | 6 — 06, 11, 19, 20, 22, 23, 24, 25a |
| Full-height fields (h ≥ 800) | **6** — 01, 06, 12, 14, 19, 23 |
| Dominant shape | shallow top band anchored to the outer canvas edge, h 200–360 |
| Fill range | **0.11 – 0.39**, median **0.19** |
| Median slide coverage | 0.027 |

**Absence is part of the composition.** A rebuild that puts a field on every slide is wrong at the composition level regardless of its density curve.

Construction: `p(u) = a·u²`, `u = 0` at the content edge → 1 at the canvas edge, **no base floor** (see `layout-archetypes.md` §4.3.1). Set `a = 3 × target fill`.

---

## 4. Deriving the Arabic version

Full system in `references/rtl-arabic.md`. The short form, and the exceptions this deck actually needed:

### 4.1 The transform

```
x' = 1920 − x − w          y' = y          (vertical never mirrors)
```

Auto-width text pins its **right** edge: `right_AR = 1920 − x_EN`.

### 4.2 Reverse every reading order

Mirroring positions is not enough — anything whose order encodes reading sequence must be reversed. In this deck that was:

| Slide | What had to reverse |
|---|---|
| **02** | agenda row `[number, label]`, and the container set to `counterAxisAlignItems: MAX` |
| **03** | the 4-column KPI row (read `24 · 06 · 18 · 12` left-to-right otherwise) |
| **16** | recommendation row `[icon, body]` — icon must trail |
| **17** | comparison row → `B · motif · A`, so A reads first |
| **18** | outer group row **and** each `[phone, panel]` pair — nested, both levels |
| 27 · 27c · 27d · 28b · 29 · 20b | the severity legend (`إيجابي` must be rightmost) |

### 4.3 Expect vertical growth, and re-fit

Arabic leading floors at ×1.5 against EN display's ×0.90, so **display blocks run ~1.67× taller**. Measured growth on titles in this deck: `h+22` to `h+144`. Consequences that needed refitting:

- **02** — 6 rows at 90px (vs 57) turned a 656 block into 854; fixed by tightening item gap 28 → **12**, not by shrinking type.
- **03** — stat labels landed 96px lower and hit the caption; the KPI row moved up 60.
- **13** — attribution had drifted to y654; EN anchors it at **y760**.
- **21** — `UX Impact` → `الأثر على التجربة`; the literal translation wrapped to 2 lines in a 1-line chip.

### 4.4 Components that need AR siblings

Positional properties are not overridable, so a mirror is always a master-level fix. And **shared masters cannot be edited** — the EN deck uses them too. This deck needed:

`AR / Footer Bar` · `AR / Footer Bar / Canonical` · `AR / Meta Field` · `AR / Feedback Block` · `AR / Cat Chip` · `AR / Finding Card` · `AR / insight-card` · `AR / V1 — INLINE TAG`

`AR / Meta Field` also carries a wider label→value gap (**14** vs EN's 8) for Alexandria's taller ink envelope.

### 4.5 Content that changes, not just moves

| Slide | Change |
|---|---|
| **09 · 12** | ratio numerals **reverse** so the measured value reads first: `5.1/7` → `7/5.1`, `6/8` → `8/6`. Accent colour follows the value. |
| **12** | progress bar fills from the **right**; the 100% notch moves to the far (left) end. |
| **13** | `quote-en` (English gloss of the Arabic quote) is **dropped** — redundant in an Arabic deck. |
| **05** | age ranges take an **ASCII hyphen**; the en dash is bidi class ON and inverts `25–34` into `34–25`. |
| 08 · 09 | time units → `د` / `ث` / `س`, digits stay Inter. |
| **03** | the hour unit sets at **64px against 160px digits** so it reads as a unit, not a numeral. |
| 06 · 23 | **kashida is kept** — the client wants the elongation in display titles. |

### 4.6 EN quirks not to inherit

The English deck violates its own rules in places. Mirroring faithfully propagates the violation:

| EN quirk | Do instead |
|---|---|
| Tables at `w1734` overflow the 1820 margin by 14 | Right edge on the margin; the 14 falls on the trailing (left) side |
| Motif at `y150 / y350 / y673` is off the 20px module | Snap to the module |
| Slide 20's right column ends at 1834 | Clamp to the margin |
| Slide 03 labels both `08` and `24` as "Participants" | Inherited contradiction — flag, don't silently rewrite |

---

## 5. Ground rotation

| Ground | Count | Slides |
|---|---|---|
| **Pine** `#103A21` | 19 | 03 04 06 07 10 11 13 14 16 17 18 19 20 20b 22 24 27c 29 30 |
| **Deep Jade** `#011E14` | 9 | 01 02 12 15 23 26 27 27d 28b |
| **White** | 6 | 05 08 09 21 25a 33 |
| **Electric** `#34FF67` | 2 | 31 32 |

Never more than four consecutive slides on one ground. White appears only on tables, the recommendation slide and the matrix — layouts whose density needs the light field.

Motif ink and opacity follow the ground, per `layout-archetypes.md` §4.4:

| Ground | Ink | Floor |
|---|---|---|
| Deep Jade | Electric | **40%** |
| Pine | Electric | **50%** |
| White | Pine | **55%** |
| Electric | Pine | **60%** |

---

## 6. Provenance

Extracted from `Report Template - EN` (36 frames) and `Report Template - AR` (36 frames) in the Colab Design System file, 2026-07-27, after a slide-by-slide review pass. Every coordinate, fill and count in this file was read from the canvas. The AR deck passes all twelve predicates in `rtl-arabic.md` §10.
