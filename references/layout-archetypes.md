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

---

## 0.5 Vertical law — the anchor system

The `Advanced Presentation` grid governed x and nothing else. Measured against the live file, **11.8%** of structural node edges in the 13 masters landed on a column start; the Example Deck ran at **1.0%**. A grid nothing aligns to is decoration.

Vertical was worse, because there was no vertical law to break. **Title cap-lines took 10 distinct values across a 230px spread.** Under the anchors below, **25 of 32 slides sit on two.**

Horizontal law is unchanged. This section adds the vertical half.

### 0.5.1 Running slides

| Anchor | y | Rule |
|---|---|---|
| **Eyebrow top** | **120** | Every running slide. Deviation **0px** |
| **Title top** | **168** | Every running slide. Deviation **0px** |
| Content ceiling — 1-line title | **320** | |
| Content ceiling — 2-line title | **380** | |
| **Content floor** | **940** | Nothing below it except the footer |
| Footer band | **982 → 1080** | C-03, untouched |

Derived relationships `[M]` — memorise these, they are why the numbers are what they are:

- Eyebrow → title = **48**. `Caps/M` at 24/1.00 occupies 120→144, leaving a **24** gap — the smallest preferred gap.
- The two ceilings differ by **60**. A second title line at Display 60 / LH 0.95 adds 57px; 57 is not on the 4-unit, so the step is 60.
- Floor 940 leaves **42px** of air above the footer band. That air is structural — it is what stops content from appearing to sit *on* the footer.

**There are exactly two legal content ceilings. Not a continuum.** A slide that needs 344 does not get 344; it gets 320 and its content re-flowed, or 380 and a second title line it can justify.

**Titles are one line by default, two maximum.** A three-line title means the title is wrong, not that the anchor is wrong.

### 0.5.2 Statement slides — cover, dividers, closing

| Anchor | y |
|---|---|
| Eyebrow top | **470** |
| **Title top** | **518** |
| Meta block top | **894** |
| Footer band | 982 → 1080 — empty on covers and dividers |

Same **48** eyebrow→title delta as the running slides. The statement block is the running block dropped 350px into the optical centre; the relationship between its two lines does not change, which is what makes a cover read as the same system as slide 14.

### 0.5.3 Vertical unit

All vertical positions and all gaps are **multiples of 4**. Preferred gaps: **24 · 40 · 80 · 120**.

The 98px footer band is inherited from C-03 and is not on the 4-unit. It is a fixed line, not a rhythm participant.

The 20px motif module is 5 × 4, so every module edge is a legal vertical position. The converse does not hold — y168 is legal type, not a legal module row.

### 0.5.4 Spacing — the 2× proximity law

**Space between groups ≥ 2× space within a group.**

| Level | Value |
|---|---|
| Within a lockup (label → value) | 8 / 12 |
| Within a group (row → row) | 24 |
| Between groups | 40 — the gutter |
| Between sections of a slide | 80 |
| Title → content | 120 |

**Corollary: delete boxes.** Where a card border plus 24px padding currently separates two groups, replace it with 80px of air and no border. Every container removed this way is a tier gain. Cards survive only where they carry a severity fill that *is* information.

---

## 8. The per-slide pass gate

A slide is done when **all fourteen** hold. Not "mostly".

| # | Check |
|---|---|
| 1 | Every structural left edge on a legal column start — `100 · 320 · 540 · 760 · 980 · 1200 · 1420 · 1640` |
| 2 | Nothing past **x1820**. Full-bleed grounds and motif fields are the only exemptions |
| 3 | Eyebrow **y120**, title **y168** — or **470 / 518** on statements. Deviation **0px** |
| 4 | Nothing below **y940** except the footer |
| 5 | All vertical gaps multiples of **4** |
| 6 | Font sizes drawn only from the 7-size ladder |
| 7 | Dominance ratio **≥1.6**; the banned 60/40 pairing absent |
| 8 | **0** contrast failures — text **and** non-text (3:1 floor) |
| 9 | No Electric or Jade on a light ground, in any role (C-01b) |
| 10 | Footer `Ground` variant matches the slide ground |
| 11 | Radius 0, zero effects |
| 12 | Layer names kebab-case and purposeful |
| 13 | All **slide-level** text bound to a text style |
| 14 | `tnum` on every numeric layer |

**Gate scope — component-instance internals are exempt from #11 and #13.** The `Footer Bar` instance carries `page-num-chip` at `r2` and four unbindable `footer-*` text nodes. Those are the component's business; the instance-override law means a slide *cannot* change them. Checking them flags false defects on every slide in the deck.

**#13 is the one that makes the system durable.** See `SKILL.md` § "The second rule".

### 8.1 Deck-level gates

- **Flip test** — page at ~1s per slide. Eyebrow, title, floor and footer must not move a pixel.
- **Contact sheet** — every slide at ~10%. Grounds must read as a pattern, not noise.
- **Squint test** — per slide, one unambiguous primary element.
- **Ground rotation** — no more than 2 consecutive slides on one ground; a ground change at least every 6 slides.
- **Archetype rotation** — no more than 4 consecutive slides on one archetype.
- **≥5 slides under 25% content density.** A deck with no quiet slides has no dynamic range.

---

### Rules `[D]`

| Rule | Specification |
|---|---|
| **Base module** | **20px** square — exactly 1/9 of a 180px column. **2× module = 40px**, matching the gutter. See §4.1 for why 24 is illegal |
| **Cell selection** | A **decorrelating integer hash**, never a linear sequence. See §4.2 |
| **Density** | `p(d) = base + peak · d^γ`, base **0.02–0.04**, γ **2.2–2.6**, rising toward the dense edge. See §4.3 |
| **Gradient direction** | Always toward a canvas **edge or corner, never the centre** |
| **Gradient span** | ≤3 columns (**540px**) sparse to dense. Longer reads as diffuse texture, not directional assembly |
| **Opacity floor** | **40% on Deep Jade · 50% on Pine.** Below the floor it is decoration and must never carry data. See §4.4 |
| **Discipline** | **Statement slides only** — cover, dividers, closing — plus counted fields. Content slides **0%**. See §4.5 |
| **Bounds** | Never crosses **y940**. Bleeds to the canvas edge at **x1920**, not x1820 — the motif is one of two exemptions from the x1820 limit, the other being full-bleed grounds |
| **Never under text** | Enforced by construction, not by eye — see the placement algorithm, §4.6 |
| **Markers (`+ × o`)** | Cell intersections only, ~1 per 8–12 plain modules, never adjacent |
| **Colour** | **One colour per instance.** Never a second accent hue inside the motif |

### 4.1 The module is 20px, and 24px is arithmetically impossible

`180 ÷ 20 = 9` — nine cells tile a column with no remainder.
`180 ÷ 24 = 7.5` — **a 24px cell can never land on a column edge.**

The failure is not approximate. Anchor a 24px lattice at x0 and its boundaries fall on multiples of 24: **96 and 120 straddle the x100 spine; 264 and 288 straddle the C1 end at 280.** Neither the margin nor any column edge is reachable at any phase offset, because 24 does not divide 100, 180, 220 or 1720.

24 *does* divide the canvas — 1920/24 = 80, 1080/24 = 45 — which is why it looked fine and shipped. **It tiles the canvas and misses the grid.** That is why the deck's motif never related to its layout: it was a second, unrelated system laid over the first.

At 20px everything closes `[M]`:

| Landmark | px | Cells |
|---|---|---|
| Spine | 100 | 5 |
| Column | 180 | 9 |
| Gutter | 40 | **2** |
| Column pitch | 220 | 11 |
| Measure | 1720 | 86 |
| Right edge | 1820 | 91 |
| Canvas | 1920 | **96** |
| Content floor | 940 | **47** |

20 = 5 × 4, so every module edge is also a legal vertical position under the 4-unit. The converse does not hold.

### 4.2 Cell selection must decorrelate

Density says *how many*. It does not say *which*. Which cells fill must come from a hashed 2D function, never a linear one.

A sequence like `(cx*7 + cy*13) % 100` produces visible **diagonal banding** — it reads as a barcode glitch, not a constellation. The bands are a direct consequence of the linear form: cells with equal `7x + 13y` lie on a line, and lines of equal value are exactly what the eye picks up. **Verified by building it wrong first.**

Use an integer avalanche hash:

```js
function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = ((h ^ (h >>> 13)) * 1274126177) | 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
```

Returns `[0,1)`, deterministic per cell, and decorrelated in both axes — so the same slide rebuilds identically and no two neighbouring cells inherit each other's state. **Never `Math.random()`**: the field must be reproducible or a re-run silently redraws the slide.

### 4.3 Density

`p(d) = base + peak · d^γ`

| Term | Range | Meaning |
|---|---|---|
| `d` | 0 → 1 | Normalised distance from the sparse boundary of the field to the dense edge, clamped |
| `base` | **0.02–0.04** | Floor density. Below 0.02 the sparse end reads as dirt, not as a field |
| `peak` | ≤ 1 − base | Fill probability at the dense edge |
| `γ` | **2.2–2.6** | Onset. Higher = later, tighter, more sudden assembly |

**Ratified: `p(d) = 0.04 + 0.56·d^2.2`.** Peak fill 60% at the dense edge.

This supersedes the `0.04 + 0.66·d^2.2` published in `decision-law.md` and `HANDOFF.md` §3.4. 0.56 is the coefficient every field in the Example Deck V2 was built with and reviewed at; 0.66 was never rendered at scale. Ratifying the value the artefact actually uses is the only version that stays true.

### 4.4 Opacity floor — per ground, not per deck

Electric `#34FF67` composited on the ground, measured against that same ground `[M]`:

**On Deep Jade `#011E14`:**

| Alpha | Ratio vs ground | Verdict |
|---|---|---|
| 100% | 13.07 : 1 | ✅ |
| **40%** | **3.15 : 1** | ✅ **floor** |
| 30% | 2.34 : 1 | ❌ |
| 24% | 1.93 : 1 | ❌ |
| 20% | 1.71 : 1 | ❌ |
| 10% | 1.28 : 1 | ❌ |

**On Pine `#103A21`:**

| Alpha | Ratio vs ground | Verdict |
|---|---|---|
| **50%** | **3.62 : 1** | ✅ **floor** |
| 40% | **2.85 : 1** | ❌ fails |

**The floor is 40% on Deep Jade and 50% on Pine.** A single "≥38% on dark" rule is wrong: Pine is 3.3× lighter than Deep Jade, so the same alpha buys less separation. Ratio rises monotonically with alpha, so every step above each floor passes.

**Below the floor it is decoration and must never carry data.** The accessibility ledger found **73 real data units sitting at 24%** — 1.93:1, invisible, and each one carrying meaning.

### 4.5 Discipline

The deck as built carried the field on **24 of 32 slides**. The master system restricts it to **4 of 13**.

| Slide type | Coverage |
|---|---|
| Cover / closing | 30–50% |
| Divider | 30–47% |
| **Content slide** | **0%** |
| Counted field (the motif *is* the data) | As the data requires — every unit above the §4.4 floor |

**Decorative motif appears on statement slides only.** The one exception is the counted field, where each module is a datum — and there the opacity floor is not a guideline, it is the difference between a chart and a stain.

**Dashed rules and leader lines are built from the module**, never from a stroke dash pattern: a 20px square every **40px** — 20 on, 20 off, the 2× module and the gutter. `dashPattern` produces a dash length that does not divide the column and a phase that resets at every node origin, so no two dashed rules on a slide align.

### 4.6 The placement algorithm

This is the reusable construction. It guarantees zero text collision by arithmetic rather than by eye, and adapts to any layout without being re-authored per slide.

1. Build a **20px occupancy grid** over the slide: 96 columns × 47 rows (the field never crosses y940).
2. Mark every content node's bounding box **plus 40px padding** as blocked.
3. Solve the **largest free rectangle** by the histogram method.
4. Fill **only** that rectangle, density rising toward the nearest canvas edge.
5. For dense slides, remove the solved rectangle and solve again for a second disjoint block. Two blocks maximum.

```js
const M = 20, PAD = 40;                       // module, keep-out
const W = 1920 / M, H = 940 / M;              // 96 × 47

const grid = Array.from({ length: H }, () => new Uint8Array(W));
for (const n of contentNodes) {
  const b = n.absoluteBoundingBox;            // rotated bounds — see figma-workflow
  const c0 = Math.max(0,     Math.floor((b.x - slide.x - PAD) / M));
  const r0 = Math.max(0,     Math.floor((b.y - slide.y - PAD) / M));
  const c1 = Math.min(W - 1, Math.ceil((b.x - slide.x + b.width  + PAD) / M) - 1);
  const r1 = Math.min(H - 1, Math.ceil((b.y - slide.y + b.height + PAD) / M) - 1);
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) grid[r][c] = 1;
}

// Largest all-zero rectangle. O(W·H). Returns cell coords, inclusive.
function largestFreeRect(grid) {
  const H = grid.length, W = grid[0].length;
  const h = new Int32Array(W);
  let best = { area: 0, x0: 0, y0: 0, x1: -1, y1: -1 };
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) h[c] = grid[r][c] ? 0 : h[c] + 1;
    const st = [];
    for (let c = 0; c <= W; c++) {
      const cur = c === W ? 0 : h[c];
      while (st.length && h[st[st.length - 1]] >= cur) {
        const top  = st.pop();
        const left = st.length ? st[st.length - 1] + 1 : 0;
        const area = h[top] * (c - left);
        if (area > best.area) {
          best = { area, x0: left, y0: r - h[top] + 1, x1: c - 1, y1: r };
        }
      }
      st.push(c);
    }
  }
  return best;
}

const R = largestFreeRect(grid);
for (let r = R.y0; r <= R.y1; r++) {
  for (let c = R.x0; c <= R.x1; c++) {
    const d = distToDenseEdge(c, r, R);       // 0 at the sparse side, 1 at the dense edge
    if (hash2(c, r) < BASE + PEAK * Math.pow(d, GAMMA)) {
      placeModule(c * M, r * M);              // 20 × 20, one colour, ≥ the §4.4 floor
    }
  }
}
```

**Reject the solve if `best.area` is under 40 cells or the rectangle is narrower than 3 cells.** A field that thin is a smear. On a slide with no legal block, the answer is no motif — which is the correct answer for a content slide anyway.
