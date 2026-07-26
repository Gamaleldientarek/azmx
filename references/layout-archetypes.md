# Colab — Slide Layout Playbook
**Prescriptive layout recipes for the `Colab-design` skill.**
Every archetype is expressible as coordinates on the canonical grid.

---

## Grid reference (do not restate per archetype)

Canvas **1920×1080**. 8 columns × 180px, 40px gutters, 100px side margins. Content block x = 100 → 1820.

| Col | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
|---|---|---|---|---|---|---|---|---|
| x start | 100 | 320 | 540 | 760 | 980 | 1200 | 1420 | 1640 |
| x end | 280 | 500 | 720 | 940 | 1160 | 1380 | 1600 | 1820 |

Vertical: 50px bleed-safe top margin · **932px live content zone** (y 50→982) · **98px footer band** (y 982→1080).

**Evidence key:** `[S]` = sourced · `[D]` = derived for this system from sourced principles. `[D]` rows are Colab's own design rules, not industry benchmarks — refine them once real slides are screenshot-reviewed.

---

## 1. The 14 layout archetypes

Grounding `[S]`: Swiss / International Typographic Style presentation practice rests on strict grid alignment, **asymmetric** composition rather than centred blocks, a restricted high-impact palette, and negative space treated as an active element rather than leftover. Craft in the Stripe/Linear/Figma idiom is restraint and precision, not ornament density.

| # | Archetype | Use when | Column split | Headline | Motif | Density ceiling |
|---|---|---|---|---|---|---|
| 1 | **Full-bleed statement cover** | Deck opener, section-as-hero | Headline C1–C5 · motif C6–C8 | Baseline at 62% height, left-aligned to C1 | Dissolve bleeds off right edge, sparse→dense left to right, densest at x 1820+ | ≤6 words, no body |
| 2 | **Flood divider** | Between major sections (5–8/deck) | No text grid — motif owns canvas | Section number top-right C7–C8, kicker only ("02 — Findings") | Electric Green or Pine flood; dither at one edge only, ≤20% of area | Kicker ≤4 words + number |
| 3 | **Two-column claim + evidence** ⭐ | The workhorse. Any single assertion backed by one visual | Claim C1–C3 · evidence C4–C8 | Claim top-aligned C1–C3 from y≈245 (18%), set in **body 40/36 not display** so it reads as caption to the evidence | ≤1 col, tucked C8 lower edge | 1 sentence + ≤2 sub-bullets |
| 4 | **Agenda / roadmap** | Contents, phased plan | List C1–C3 · art C4–C8 | Items body-28, numerals display-60 as markers | Markers (`+ × o`) double as list bullets between items | ≤6 items |
| 5 | **Single big-number hero** | One metric IS the message | Number C2–C6 · label below, same left edge | None — the number is the headline | C1 or C7–C8 margin strip only. **Never behind the numeral** | Number + label + 1 benchmark |
| 6 | **KPI row (3–5 metrics)** | Traction, snapshot | 8 cols ÷ N blocks, 1px hairline dividers | Per-block number then label; optional thin kicker C1 | None in the row; optional dissolve strip in footer band | ≤5 metrics, ≤3 words/label |
| 7 | **Thesis + detail (MBB exhibit)** | Finding needing takeaway *and* chart read in parallel | Takeaway C1–C3 · exhibit C4–C8 | Bold single "governing thought" at top of C1–C3, sub-bullets indented beneath `[S]` | Minimal, C8 edge | Governing sentence + ≤3 sub-bullets |
| 8 | **Quote / verbatim** | One participant quote | Glyph C1 (graphic) · text C2–C6 · attribution C2 below | Text vertically centred in the 40–60% height band | Quiet edge gradient C7–C8 | 1 quote ≤30 words `[S]` |
| 9 | **Before / After split** | A-B comparison, redesign impact | Hairline divider at **x 960** · Before C1–C4 · After C5–C8 | Two small kickers pinned atop each half — **no shared centred banner** | Divider seam carries a thin dither transition, sparse→dense, visually encoding improvement | 1 visual + ≤3 metrics/side |
| 10 | **Severity-rated issue list** | Findings inventory | Full-width rows: C1 severity chip (fixed 180) · C2–C6 description · C7–C8 metric/screen ref | None beyond running header | **Forbidden** — would compete with severity chips | ≤5–6 rows |
| 11 | **Journey / flow** | Task flow, journey map | Horizontal band ÷ N stages (4–6, uneven widths allowed to encode duration) | Stage labels atop each stage column | **Structural** — connective line between stages; markers = touchpoints | Label + 1 indicator/stage |
| 12 | **Recommendations / next steps** | Closing findings slide | List C2–C6 · priority tag C7–C8 | Numerals as display-160 markers in the C1 gutter | None | ≤4 items, 1 line each |
| 13 | **Logo / capability grid** | Sales credibility | Uniform modules, 1 col wide, gutters preserved | Kicker top-left C1 | Fills dead cells when count is uneven (7 logos in 8 slots → motif fills the 8th) | Grid only, no prose |
| 14 | **Closing / CTA** | Final slide | Mirrors #1 flipped: CTA C4–C8 · motif C1–C3 | Baseline 62% height, right-aligned to C8 | Mirrored dissolve, dense→sparse right to left | ≤6 words + 1 contact line |

### System-level composition rules `[D]`
1. **Never centre a text block across the full 8-column measure.** This is the single most important Swiss carryover.
2. The **37 : 63 split** (3 cols text : 5 cols visual, or inverse) recurs deliberately across #3, #5, #7, #9. It is the system's default asymmetric proportion — close to a golden-ratio approximation, keeping every slide visually related without being identical.
3. **RTL:** mirror the *entire column system* (C1↔C8, C2↔C7, C3↔C6, C4↔C5), not just text alignment inside a fixed LTR grid. Motif bleed edges swap sides too — otherwise the "assembling, piece by piece" density direction reads backwards. See §5.

---

## 2. Data-dense findings layouts

### 2.1 How executives actually read `[S]`
- Executives scan a slide in **3–5 seconds**: relevance → decision-required → key number → dig-deeper-or-move-on. They read the first 1–2 bullets, "rarely the third, almost never the fourth or fifth."
  → **Cap any visible list at 3 lines.** Everything else goes to an appendix.
- MBB decks use the **bold-bullet structure**: one bold governing sentence per slide, with the Resolution occupying 60–70% of the argumentative content, so the slide is legible from the bold text alone.
- **Tufte:** maximise data-ink ratio; strip chartjunk (moiré, fake 3D, decorative gridlines).
  → **The dither motif must never appear inside a chart area.** It is a margin/edge device only, never chart decoration.
- **Duarte:** one chart type emphasising one relationship; mute all scales/gridlines/labels to neutral; reserve the single accent for the one data point that matters.
  → Charts render in white / grey `#BCBEC0`. **Electric Green highlights exactly one series or point per chart.**

> ⚠️ A widely-repeated "29–42% retention improvement / 60% comprehension speed" statistic surfaced via a secondary source attributing it to NN/G, unverified against an original. **Do not quote the numbers to a client.** The directional principle — structure beats density — is reliable.

### 2.2 Slide-type recipes

| Slide type | Max content | Layout | Note |
|---|---|---|---|
| **Executive summary** | 1 bold governing sentence + 3 sub-bullets | #7 | **SCR** (Situation-Complication-Resolution) for strategic asks; **RSC** (Resolution first) for operational updates `[S]` |
| **Key findings** | 3–4 findings | 2×2 card grid (each 4 cols × half live-height) or single stack; severity tag on every card | Cap respects the bullet-1–2 scan behaviour `[S]` |
| **Before / After** | 1 visual + ≤3 metrics per side | #9 | Two-panel with connective centre element is the dominant convention `[S, vendor consensus]` |
| **KPI stat row** | 3–5 metrics | #6 | See §3 |
| **Severity list** | 5–6 rows | #10 | 3-level (Low/Med/High) or 5-level (Cosmetic→Critical) are field standard; business-aligned scales tie severity to task completion / brand / revenue rather than cosmetics `[S]` |
| **Verbatim quote** | 1 quote ≤30 words | #8 | Readable in <5s; always attribute name + role; highlight the key phrase in a different weight or colour rather than leaving it uniform `[S]` |
| **Task-success / time-on-task** | 1 chart, 1 highlighted point | #3 | Apply Duarte's mute-everything rule directly `[S]` |
| **Heatmap / eye-tracking** | 1 visual + annotation column | Visual C1–C6, legend C7–C8 | No sourced guidance found for slide composition of heatmaps — apply Tufte discipline: no decorative frame, no drop shadow `[D]` |
| **Journey / flow** | 4–6 stages | #11 | Awareness→Consideration→Decision→Use→Advocacy is the standard taxonomy; one visual idea per stage cell `[S]` |
| **Recommendations** | 3–4 items | #12 | Consistent with the 3-line cap |

### 2.3 Operational rules `[S]`
1. Put the most important number or decision **in the first 3 words or the top-left quadrant** of every slide.
2. Never require sequential reading across more than 2 columns for the same idea — parallel exhibit + text (#3/#7) beats stacked prose.
3. Findings slides must be **skimmable by colour and position alone** — the worst issue identifiable without reading a word (severity chip colour + top row).

---

## 3. Big numbers and stat blocks

No peer-reviewed source gives a numeral-to-canvas ratio. The sourced principle is qualitative (single accent, minimal chrome, 3-second legibility). Proportions below are `[D]`, extending the system's display scale across the 932px live zone.

| Context | Numeral cap-height | Rationale |
|---|---|---|
| Hero, single-stat slide (#5) | **380–420px** (~35–39% of canvas, ~41–45% of live zone) | Deliberately exceeds the largest display token (240). The one sanctioned exception — there is no competing headline |
| Inside a KPI row (#6, N≤5) | **160–200px** | Multiple numerals must stay within the display scale so the row doesn't compete internally |
| Supporting stat beside a chart (#3/#9) | **60–100px** | Reinforcement, not headline |

**Colour** — White on Pine/Deep Jade; Pine or Deep Jade on white. **Electric Green only as the delta/comparison indicator, never as the numeral fill on a light ground** (1.34:1).

**Label** — directly below, body-24/28, ≤3 words, **same left edge as the numeral, not centred under it**.

**Benchmark** — below the label, body-16/20, formatted as a delta ("+18pts vs. baseline") or a target-vs-actual bar. Never a second big numeral.

### Rules `[D, grounded in Tufte/Duarte]`
1. **A numeral alone is incomplete.** Pair every hero number with exactly **one** of: delta vs. prior, distance to target, or peer benchmark. Never stack multiple comparisons.
2. Show target-vs-actual as a **single minimal bar or a target notch on a thin progress line** — not a full bar chart with axes and gridlines.
3. **Direction-of-good encoding** (the palette has no red): Vivid Orange `#FF5A32` = below target / regression · Electric Green `#34FF67` or Jade `#33FFC2` = above target / improvement · neutral grey `#BCBEC0` = on target / no change.
4. Use **tabular (lining) figures** so KPI-row digits align vertically. Both Inter and Alexandria support this OpenType feature.

---

## 4. The pixel / dither motif — composition rules

### Precedents `[S]`
- **Bauhaus** established the mathematical grid as the basis of corporate identity systems; square-module grids suit "angular, modular, geometric marks where every corner aligns, every stroke matches, every distance is a measurable unit."
- **Müller-Brockmann**, *Grid Systems* — the module as a universal unit of composition beyond print.
- **Muriel Cooper / MIT Visible Language Workshop** — modular production environment plus early computational graphics; the conceptual ancestor of a generative dither used as a brand system rather than decoration.
- **Halftone / dithering mechanism** — a solid field reduced to dots of decreasing size or density; as density → 0 only the background remains, producing a gradient without continuous tone. Generative practice overlays a grid, samples a density value per cell, then renders module presence per cell. **Density is a computed per-cell variable, not a hand-placed gradient.** This is precisely how the field should be constructed.

### Rules `[D]`

| Rule | Specification |
|---|---|
| **Base module** | **20px** square — exactly 1/9 of a 180px column, so 9 modules tile a column with no remainder. **2× module = 40px**, matching the gutter. The layout grid and the motif grid therefore share a common unit |
| **Gradient direction** | Always migrates toward a canvas **edge or corner, never toward the centre** — the motif reads as entering/exiting the frame, reinforcing the bleed-safe logic |
| **Gradient span** | ≤3 columns (**540px**) from sparse to fully dense. Longer reads as diffuse texture rather than directional assembly |
| **Structural vs decorative** | **Structural** — covers and dividers (#1, #2, #14) where the motif *is* the background; journey diagrams (#11) where markers are touchpoints. **Decorative** — all content slides: confined to a single margin column (≤180px), never touching the live content block |
| **Coverage ceiling** | ≤20% of canvas on content slides. Covers/dividers may run 60–100% |
| **Never under text** | The field occupies its own bounded zone that never underlaps a text bounding box, even at low density. Direct application of Tufte's chartjunk discipline to brand texture |
| **Markers (`+ × o`)** | A controlled glyph set, not free additions. Placed at cell intersections only, ~**1 marker per 8–12 plain modules**, never adjacent to one another |
| **Colour** | **One colour per instance.** Electric Green on Pine/Deep Jade, or Pine/Deep Jade on white/Electric-Green grounds. Never a second accent hue inside the motif |

> The `Photo-Effect` component already implements this as four directional edge vectors — `Pixel Top/Right/Bottom/Left`. Rebuild these to the 20px module rather than authoring new ones.

---

## 5. RTL — professional handling

The client has flagged RTL as a place to be careful. Rules, in priority order:

1. **Mirror the grid, not just the text.** C1↔C8, C2↔C7, C3↔C6, C4↔C5. An Arabic slide built on an unmirrored LTR grid with right-aligned text is the amateur tell.
2. **Motif direction mirrors too.** The dissolve encodes "assembling, piece by piece." Left-to-right density on an RTL slide reads as disassembling.
3. **Flip directional elements only.** Arrows, chevrons, next/back carets, progress indicators, the `>` shape. **Never flip:** the Colab logo, charts, photographs, screenshots, or numerals.
4. **Numerals stay LTR inside RTL flow.** Figma documents cursor and selection bugs on mixed-direction lines — expect them, and keep numerals in their own text nodes where practical.
5. **Arabic needs its own line-height token.** The system's `1.16` body ratio is too tight for Alexandria. Floor of **1.5** for AR body. Do not share one line-height token across EN and AR.
6. **Asymmetric components need mirrored equivalents** — a card with a coloured left border, shadow offsets, single-side padding. Repositioning is not mirroring.
7. **Use variable modes (EN/AR), not duplicated masters.** Separate pages only at deck level. Component-level duplication guarantees drift.

---

## 6. Anti-patterns

| # | Anti-pattern | Why |
|---|---|---|
| 1 | **Neon-on-dark overuse** — Electric Green as large fills or body text on light grounds | Bright neon on dark causes eye fatigue within minutes `[S]`. Reinforced by the file's own 1.34:1 measurement |
| 2 | **Motif behind the headline** | Violates data-ink discipline — decoration must not compete with content `[S]` |
| 3 | **Insufficient negative space** — edge-to-edge card grids, collapsed gutters | Swiss practice treats white space as active, not filler `[S]` |
| 4 | **Centred everything** | Contradicts asymmetric composition and every archetype in §1 `[S]` |
| 5 | **Too many findings per slide** — beyond 3 visible lines / 3–4 cards | Executives rarely read past bullet 2 `[S]` |
| 6 | **Chartjunk** — 3D bevels, drop shadows, decorative gradients, heavy gridlines | Named by Tufte as data-ink failure `[S]` |
| 7 | **Multiple accents competing in one chart** — Electric + Jade + Orange together | Destroys the "look here" signal; Duarte's rule is one bright colour per slide `[S]` |
| 8 | **Improvised severity colours** | Undermines skim-by-colour. Fix the ordinal mapping: Vivid Orange = critical/high · Olive Green = medium · Pale Sky Blue/grey = low `[D]` |
| 9 | **Numeral without a benchmark** | Reads as decoration, not insight `[D]` |
| 10 | **One dark ground everywhere** | Uniform flat dark fields read harsh against the neon accent. Rotate Pine, Deep Jade and white across a deck `[S]` |
| 11 | **Identical motif on every slide** | Treating a generative density system as a static lockup defeats its own premise `[D]` |
| 12 | **RTL as an afterthought** | See §5 `[D]` |

---

## 7. Reconciliation note

§4 sets the base module at **20px**; `03-design-system-spec.md` §5.2 proposed **40px**. These agree — 20px is the base, 40px is the 2× module and equals the gutter. Update the spec to state both, with 20px as the atom.
