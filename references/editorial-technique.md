# Editorial & Typographic Technique

Raising a competent deck to masterpiece level using Inter alone, an all-green palette, and an 8-column 1920×1080 grid.

`[S]` sourced · `[D]` derived · `[M]` computed.

---

## 0. Constants

**Columns.** x 100→1820 (1720 wide), 8 × 180, 40 gutters. **Pitch = 220.**

| | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
|---|---|---|---|---|---|---|---|---|
| x | 100 | 320 | 540 | 760 | 980 | 1200 | 1420 | 1640 |

Spans `[M]`: C1–C2 **400** · C1–C3 **620** · C1–C4 **840** · C1–C5 **1060** · C5–C8 **840** · C6–C8 **620**.

**Vertical.** Bleed-safe 0–50 · content zone y 50→982 (**932**) · footer 982→1080.
**Golden divisions of the content zone: y 406 (0.382) and y 626 (0.618).** 62% of canvas = y 670.

**Luminance ladder** `[M]`:

| Colour | L |
|---|---|
| Deep Jade `#011E14` | 0.0098 |
| Pine `#103A21` | 0.0325 |
| Electric `#34FF67` | **0.7323** — a *light* value |
| Off-white `#F9FAFB` | 0.9548 |
| White | 1.0000 |

**Contrast** `[M]`:

| Pair | Ratio |
|---|---|
| White on Deep Jade | **17.55** — highest available |
| White on Pine | 12.73 |
| Electric on Deep Jade | 13.07 |
| Electric on Pine | 9.49 |
| **Deep Jade on Electric** | **13.91** — use for floods, not Pine |
| Electric on Off-white | **1.28** — worse than pure white |
| **Pine on Deep Jade** | **1.38** — a *tonal* pair, see T-17 |

Three consequences: Deep Jade replaces Navy and is better · Electric floods carry Deep Jade type · Pine-on-Deep-Jade is the only way to divide a canvas without drawing a line.

**Scale ratios** `[M]`: 240→200 = 1.20 · 200→160 = 1.25 · **160→60 = 2.67** · 60→40 = 1.50 · 40→24 = 1.67.

**The scale is bimodal, with a chasm between 60 and 160.** That chasm is the deck's principal instrument. Treat 240/200/160 as three *alternatives* for one slot, never three steps of a hierarchy — 240 next to 160 is 1.5:1 and reads as an error.

---

## 1. Twenty techniques

**T-01 · The Hanging Line.** Type hangs *from* a rule at fixed y, not from its own baseline, so every slide shares an optical top edge. `[S]` Vignelli: *"type should always hang from the ruler, regardless of the size."*
Rule at **y 244**, cap line at **y 284** (one gutter below). **Set Vertical trim = Cap height** — Inter carries 0.242 em of phantom space above the cap line (38.7px at 160, 58px at 240 `[M]`). Without trim this is guesswork.

**T-02 · The Unigrid Band.** A fixed band carries the title reversed out; identity by position and mass, not logo. `[S]` Vignelli's 1977 NPS Unigrid. Deep Jade band, full bleed, y 0→180. On Deep Jade slides it *disappears* — that absence is the point.

**T-03 · The Type Block as a Plane.** A paragraph is a rectangle of a specific grey value. `[S]` Müller-Brockmann; Ruder's grey-value reading.

| Grey value | Setting | Use |
|---|---|---|
| Light | Inter Light 300, 20/32 | Atmosphere |
| Mid | Regular 400, 20/28 | Default body |
| Dark | Medium 500, 20/24 | Evidence, tables |

Max two grey values per slide, never stacked. **Set measure first, then size:** 400 → Body 20 (~50 char) · 620 → Body 24 (~66) · 840 → Body 28 (~76, ceiling).

**T-04 · One Contrast Per Composition.** `[S]` Ruder. Declare one axis: Scale (240:16) · Weight (Thin/Black) · Mass (filled 840 vs 840 void) · Tone (T-17) · Density · Direction. **If a slide has two, delete one. Three weak contrasts cancel to zero — the commonest failure in a competent deck.**

**T-05 · Confrontation.** `[S]` Hofmann. Display 240 Black numeral + Body 12 Light caption sharing a **baseline**, 20px apart. The shared baseline is what makes it intent rather than proximity.

**T-06 · The Programme.** `[S]` Gerstner's morphological box. Every slide is a six-tuple, written in the layer name:

| Parameter | Values |
|---|---|
| Ground | Off-white · Pine · Deep Jade · Electric |
| Split | 2:6 · 3:5 · 4:4 · 5:3 · 6:2 · 8 |
| Anchor | Top 284 · Centre 516 · Fold 626 · Bottom 932 |
| Dominant | Word · Numeral · Rule · Field · Table · Void |
| Weight pair | Thin/Black · Light/Bold · Regular/Black · single |
| Break | none · bleed-L/R/B · gutter-cross · overhang |

**Adjacent slides must differ in ≥3 of 6.** This generates rhythm mechanically.

**T-07 · The Visible System.** `[S]` Crouwel. On dividers only: draw the 8 column rules full-bleed vertically at White @6%. Content stops at 982 but rules run to 1080, so the grid reads as larger than the slide. 5–7 times per deck maximum.

**T-08 · Type Is the Image.** `[S]` Experimental Jetset; Scher's *"illustrate with type."* Display 160 Black, forced breaks, LH 0.90, tracking −2.5%, constrained to C1–C5. A 3-line block is **404px** `[M]`. **If the rag won't form a stable shape, rewrite the statement.** Never let the line-breaker decide.

**T-09 · The Typographic Wall.** `[S]` Scher's Public Theater. Four lines flush left *and* right, no interline space, alternating Display 60 Light / Display 160 Black. One word in Electric. **Never stretch Inter to force the flush edge — choose words.**

**T-10 · The Single Enforced Rule.** `[S]` Bierut: *"it's binary. You are either right or you are wrong."* Recommended: **every slide's largest element begins at x 100.** Invisible individually, overwhelming across 25 slides — it creates a hard left spine, which makes the two deliberate violations enormous.

**T-11 · The Second Structural Line.** `[S]` OK-RM's *Real Review* fold. Projected slides are read top-heavy. Install an undrawn fold at **y 626**. A slide's entire argument must complete above it. A slide putting its key number below y 626 is misusing the deck.

**T-12 · Rule-Line Register.** `[S]` *Fantastic Man*. Exactly three weights exist:

| Rule | Weight | Offset | Terminates |
|---|---|---|---|
| Hairline | 1px @14% | 20px below baseline | Column edge |
| Section | 4px | 40px above cap | 220 or 400 |
| Structural | 12px | — | Full bleed only |

The 20px offset is the motif module. Never 24 or 16.

**T-13 · Neutral Container, One Varying Axis.** `[S]` Esterson on *Eye*: a *"neutral container"* over a *"pretty structured grid."* Geometry fixed for the whole deck; **ground colour is the only thing that changes at a section boundary.**

**T-14 · The Over-Scale Crop.** `[S]` 032c's "New Ugly" — **with the stretching removed.** One word, Black, **420px**, cap line y 380, x −60, running off at 1920. 60–70% visible. Below it, the same word at Body 16 Light so the reader verifies the inference. 26:1. Once per deck.

**T-15 · The Colophon Block.** `[S]` Vignelli's two-size rule. C6–C8, bottom-hung to y 932. Body 12 Bold caps labels (tracking +6%) over Regular values, 20px baseline pitch, 6–9 rows forming a hard rectangle. **Nine lines of considered 12px type is a stronger authority signal than any headline.**

**T-16 · The Staircase.** `[S]` Müller-Brockmann. Row *n* starts at x = 100 + (n−1) × **220**. The step must equal the column pitch (220) or the gutter (40) — 60 or 80 reads as sloppy alignment.

**T-17 · The Tonal Panel.** Pine on Deep Jade = **1.38:1** `[M]`. Ground the slide Deep Jade, fill C5–C8 + bleed with Pine. The seam reads as a change of light, not colour. **The only way to divide this canvas without drawing a line.** Verify on the actual projector — some pipelines crush both to black.

**T-18 · Measure as Rank.** `[S]` Vignelli's size-to-measure table, inverted `[D]`:

| Measure | px | Set at | Meaning |
|---|---|---|---|
| Narrow | 400 | Body 20/32 Light | **Governing claim** |
| Default | 620 | Body 24/34 Regular | Supporting argument |
| Wide | 840 | Body 28/40 Regular | Standing text, caveats |

**The narrow column is the important one.** A 400-wide block of Light 20 beside a 1060 chart is more authoritative than the same words at 40px. The single most useful correction to "important = big."

**T-19 · The Two Violations.** `[S]` *"Rule-breaking only works when the audience can tell you knew the rule first."* Break T-10 exactly twice, at **x 460** — deliberately *off* the column grid by 140px. A break to x 320 reads as a variant; x 460 reads as a decision.

**T-20 · Tabular Texture.** A table is a controlled grey field, not a decorated container. `tnum` + `lnum` on. Numeric field **Regular 400 at 16/24** — Light 300 at 16px is a 0.88px stem `[M]` and disintegrates under Teams' 4:2:0 subsampling. Identity column Light 300, so the table reads from six metres as a rectangle with a lighter left band.

---

## 2. The numbers

### 2.1 Scale ratios

| Ratio | Reads as | Verdict |
|---|---|---|
| < 1.4:1 | Two attempts at one size | **Never.** 240:200 and 24:20 are the traps |
| 1.5–2:1 | Ordinary hierarchy | Within a component only |
| 2.7:1 | Clear | 160:60, the natural jump |
| **4–8:1** | **Dominance** | **Target band for a slide's primary contrast** |
| 10–15:1 | Confrontation | Requires a shared baseline |
| >20:1 | The crop | Once per deck |

**Largest to second-largest must be ≥4:1.**

### 2.2 Weight pairing at Display 160

| Pair | Δ | Use |
|---|---|---|
| Thin/Black | 800 | Cover only, Thin word ≥3 chars |
| **Light 300 / Black 900** | **600** | **Default. Reliable at any size ≥60** |
| Regular/Bold | 300 | Body emphasis only |
| ExtraLight/Bold | 500 | Dividers; survives projection better than Thin |

**The heavy word carries the meaning.** Never three weights. **Optical compensation `[D]`: Black looks ~4% larger than Light at the same size — set Black at 0.96× when they must appear equal.** Mixed weights must be runs inside one text node, never two adjacent nodes.

### 2.3 Tracking — the highest-leverage finding

Inter's designer publishes a metrics formula `[S]`:
`tracking = a + b·e^(c·z)`, **a = −0.0223, b = 0.185, c = −0.1745**, z = px.
**The asymptote is `a`: at display sizes Inter wants −0.0223 em.**

| Size | Tracking |
|---|---|
| 12 | **0%** |
| 16 | −1.10% |
| 20 | −1.67% |
| 24 | −1.95% |
| 40 | −2.21% |
| 60–420 | **−2.23%** |

> ⚠️ **The design system's "letter-spacing 0 throughout" is its single biggest defect.** At 160px that is 2.2% looser than the typeface's author specifies — ~3.6px per character, 71px across a 20-character line. **It is why big type looks slack, and no layout work will fix it.**

**Prescription:**

| Slot | Tracking |
|---|---|
| Display 240/200/160 | **−2.5%** Black · **−2.2%** Regular/Light · **−1.8%** Thin |
| Display 60/40 | −2.2% |
| Caps at 24/20 (kickers, table headers) | **+4%** |
| Body 28/24/20 | −1.7% to −2.0% |
| Body 16 (tables) | −1.0% |
| Body 12 caps (colophon, footer) | **+6%** |

Heavier weights want more negative; thin weights want less. **Collision threshold ≈ −4.5%; aggressive floor −3.5%, all-caps only.** If the file has Inter v4, set `opsz` = font size instead and don't also track manually.

### 2.4 Leading

Inter `[M]`: cap 0.727 em · x-height 0.546 · ascender 0.750 · descender 0.241.

| Setting | Collision floor | Recommended |
|---|---|---|
| All-caps display | 0.727 | **0.80** |
| Mixed case, general | 0.991 | **0.90** |
| Body 20–28 | — | 1.40–1.60 |

**Move display line-height from 0.95 → 0.90 for all sizes ≥100px.**

Block height for cap-trimmed text `[M]`: `(n−1) × LH × size + 0.727 × size`

| Size | LH | 1 line | 2 | 3 |
|---|---|---|---|---|
| 240 | 0.90 | 175 | 391 | 607 |
| 160 | 0.90 | 116 | **260** | 404 |
| 60 | 0.95 | 44 | 101 | 158 |

**Memorise the 160 row.** Two-line 160 = 260px; cap at y 284 → bottom at 544, almost exactly the content-zone midline. The deck's most reliable headline setting.

### 2.5 Optical alignment — Figma has none, do it by hand

Negative x offset as a fraction of font size `[D]`:

| Leading char | Offset | At 160 | At 240 |
|---|---|---|---|
| `"` `'` `“` | −0.30 em | −48 | −72 |
| `T` `Y` `V` `W` | −0.020 | −3.2 | −4.8 |
| `A` | −0.015 | −2.4 | −3.6 |
| `O` `C` `G` `S` | −0.010 | −1.6 | −2.4 |
| `1` (lining) | −0.045 | −7.2 | −10.8 |
| `—` `–` | −0.55 | −88 | −132 |
| `H I L N M B D E F K P R` | **0** | 0 | 0 |

**The numeral-1 case is the most common miss** — any KPI row starting with `1` at 200px needs a −9px nudge.

### 2.6 Rag

**Never justify.** Rag depth ceiling **25% of measure**. No two consecutive lines ending within 30px. **The rag must have a direction** — descending stair, ascending stair, or hourglass. Every display headline uses forced breaks.

### 2.7 Widows

**A last line under 30% of measure is a widow at display size.** Fix by rewriting → re-breaking → changing measure → dropping a size step. **Never by adjusting tracking.** A one-word last line is permitted only if that word is the point, set in the heavy weight — then it's a punchline.

### 2.8 Where Thin stops working

Inter stems `[M]`: Thin ≈ 0.030 em · Light 0.055 · Regular 0.075 · Black 0.185. Need **≥2px rendered** to survive projection and 4:2:0 subsampling.

| Weight | 2px stem at | Floor for this deck |
|---|---|---|
| Thin 100 | 67px | **100px** |
| Light 300 | 36px | **40px** |
| Regular 400 | 27px | 16px on dark |
| Medium 500 | 22px | Default for 16–24 |

**Corrections:** Thin only at ≥100px · table body must be Regular 400 at 16, not Light · Body 20 Light should be Regular on light grounds.

### 2.9 Baseline shift

| Move | Spec |
|---|---|
| Unit after numeral | 0.40× size, baseline-aligned, 8px gap |
| Superior figure | 0.30×, shift +0.42 em |
| Cap-aligned label | shift down 0.727 × (display − label) |
| Descender-hung caption | baseline + 0.241 × display size |

**Any two elements more than 4:1 apart must share a baseline, cap line, or descender line — never a bounding box.**

---

## 3. Ten archetypes — one gesture per slide

Test: shrink to 10% (192×108). If more than one thing is visible, delete until one is.

| # | Archetype | Spec |
|---|---|---|
| A-01 | **Full-Bleed Word** | 420px Black, cropped by an edge. No footer. Once per deck |
| A-02 | **Single Rule** | 12px full-bleed at y 626, or 1px vertical at **x 760** (3:5, not 4:4) |
| A-03 | **Half-Canvas Numeral** | 420 Black at y 300; label Body 24 Bold at y 665; right 840 **empty** |
| A-04 | **Off-Centre Block** | C3–C6, cap line y 406. **No two of the four voids equal** |
| A-05 | **Grid Break** | Seven elements on-grid, one at x 460 |
| A-06 | **Tonal Flip** | 100% Electric with Deep Jade type, ≤6 words, no footer. A *pacing* move |
| A-07 | **The Void** | 10–15 words, cap line y 800, 90% empty. Hardest to defend, most reliably signals confidence |
| A-08 | **The Stack** | T-09 wall, y 284→666 |
| A-09 | **The Horizon** | Full-bleed band ending at **406 or 626 — never 540** |
| A-10 | **The Overhang** | One element past the margin into bleed |

**Budget for 25 slides:** A-01 ×1 · A-02 ×1–2 · A-03 ×2 · A-04 ×3–4 · A-05 ×2 · A-06 ×2 · A-07 ×2 · A-08 ×1 · A-09 ×2 · A-10 ×3 · **ordinary ×6–8.** The deck is ~70% ordinary. **The archetypes work because they are rare.**

---

## 4. Grid-breaking thresholds

| Offset from nearest grid line | Reads as |
|---|---|
| 1–19px | **Error** — sub-module drift |
| 20–39px | **Error** — ambiguous |
| **40px** | Legal — a one-gutter inset, not a break |
| 41–79px | **Error** |
| **80–160px** | **BREAK — registers as intent** |
| 161–219px | **Error** — looks like a missed snap |
| 220px | Not a break, that's the next column |

**A break is 80–160px, or it is a bleed. Nothing in between. Remember 140.**

**Four legal types:** bleed (≥60px past the edge, ≤40% of the element, one edge per slide) · margin overhang (x 40 or 1880, **rules and fields only, never text**) · gutter crossing (terminate mid-gutter, filled fields only, once per deck) · baseline break (must cross two ladder zones).

**What makes a break read as a mistake** — offset 4–30px · two breaks on one slide · a break in a *repeating* element · the break aligns to something else off-grid · **the break moves inward** (all breaks move outward) · the broken element isn't the largest · the rest of the slide isn't rigorous enough.

---

## 5. Rhythm across a sequence

| Variable | Rule |
|---|---|
| **Density** 1–4 | Never three consecutive at the same value. Never two consecutive 4s |
| **Ground** | Never four consecutive the same |
| **Anchor** | Alternate. Six consecutive top-hung is what makes a deck feel like a template |

**Adjacent slides differ on ≥2 of 3. Any three-slide window shows ≥2 densities.**

**Ground is a section signal, not variety:**

| Ground | Means |
|---|---|
| Deep Jade | Openings and closings — the deck's "outside" |
| Pine | Argument — the deck's "voice" |
| Off-white | Evidence — the deck's "record" |
| Electric | **Once.** The single most important boundary |

A reader learns after four slides that white means data and green means claims, and navigates by peripheral vision. **That is what ground rotation is for.**

**Density contour for a 25-slide report:**
`1 3 2 1 1 3 3 3 4 1 1 3 2 3 3 4 1 2 3 4 1 3 3 1 2`

Four peaks, each followed within one slide by a 1 or 2. Six voids, evenly spread. **That contour is designable before a single slide is drawn.**

---

## 6. Amateur tells vs expert decisions

### Tells, in order of frequency

1. **Everything mathematically aligned, nothing optically aligned.** The margin is exactly 100 even for a line starting with `“` or `1`. **The number-one tell, and free to fix.**
2. **Bounding-box alignment of dissimilar sizes** — cap lines 23px apart while boxes align. Fix with cap-height trim.
3. **Tracking at 0 on 160px+.**
4. **One line-height ratio across a 12:1 size range.**
5. **Three simultaneous weak contrasts.**
6. **Rules terminating at arbitrary points** (x 1687 because that's where the text ended).
7. **Four different rule weights.**
8. **Corners that nearly touch** — a 4px near-miss is worse than a collision.
9. **A footer that competes** — 16px, full opacity, filled band, border.
10. **Small text in Light.**
11. **Caps at zero tracking.**
12. **Centred anything.**
13. **Multiple gestures per slide.**
14. **A 12px grid break.**
15. **Uniform pacing.**
16. **Type distorted to fit.** Any horizontal scale ≠ 100%. Instant disqualification.
17. **Proportional figures in a KPI row.**
18. **Hyphenation in a headline.**

### Expert decisions

1. **The `“` hangs** 48px left while the text is flush at 100.
2. **The cap line is the datum**, not the box.
3. **Display tracking is negative and weight-compensated.**
4. **The rule terminates in the bleed** — no visible ends, so the slide reads as a fragment of a larger system.
5. **Corners are related, not coincidental.** Offsets must be 0, 20, 40, 100, 140 or 220 `[M]`. 37 or 63 is an accident.
6. **The footer disappears** — Body 12 Regular at 55% on dark, tracking +6%, no border, no fill, page number as plain tabular figures right-aligned at 1820. **Empty space with a line of type in it, not a component.**
7. **Small text is a composition** — the colophon is a rectangle with a controlled grey value.
8. **One ratio governs.** 3:5 recurs (620/1060 ≈ 0.585) so unrelated slides feel related.
9. **The void is shaped** — four unequal, deliberate voids. In amateur work the void is what's left over; in expert work it's the largest designed element.
10. **Density has a contour**, drawn before any slide.
11. **The one break is enormous because everything else is exact.**
12. **The heavy word carries the meaning** — reading the bold words alone gives the argument.
13. **Tone used where a line would be too loud** (T-17).
14. **Nothing is decorative.** Every mark is a rule, a plane, a letterform, or data. **With no imagery and one accent, you cannot hide a weak layout behind a photograph — so every layout has to be right.**

---

## Sources

[The Vignelli Canon](https://www.rit.edu/vignellicenter/sites/rit.edu.vignellicenter/files/documents/The%20Vignelli%20Canon.pdf) · [NPS Unigrid](https://npshistory.com/brochures/unigrid.pdf) · [Müller-Brockmann, Grid Systems](https://designopendata.wordpress.com/portfolio/grid-systems/) · [Ruder, Typographie](https://www.typotheque.com/books/typography-a-manual-of-design) · [Hofmann, Graphic Design Manual](https://b.parsons.edu/~dejongo/12-fall/stuff/departmentalReadings/graphic-design-manual-principles-and-practice.pdf) · [Gerstner, Designing Programmes](https://openlab.citytech.cuny.edu/langecomd3504sp2020/files/2018/10/Gerstner_DesigningProgrammes-1.pdf) · [Crouwel, Stedelijk](https://www.stedelijk.nl/en/news/wim-crouwel-mr-gridnik-2) · [Experimental Jetset](https://en.wikipedia.org/wiki/Experimental_Jetset) · [Scher: Type is Image](https://www.printmag.com/fine-art/for-paula-scher-type-is-image/) · [Bierut, Pentagram](https://www.pentagram.com/about/michael-bierut) · [Real Review / OK-RM](https://bpando.org/2017/09/25/hands-real-review/) · [Fantastic Man, Eye](https://eyemagazine.com/feature/article/the-alternative-viewpoint) · [Esterson on Eye](https://www.typocircle.com/portfolio/simon-esterson-making-magazines/) · [032c, AIGA Eye on Design](https://eyeondesign.aiga.org/how-germanys-032c-magazine-is-still-pioneering-the-new-ugly-15-years-in/) · [Inter Dynamic Metrics](https://d.rsms.me/inter-website/v3/dynmetrics/) · [Inter](https://rsms.me/inter/) · [CreativePro: Optical Margin Alignment](https://creativepro.com/typetalk-hung-punctuation-optical-margin-alignment/) · [Fonts.com: Rags, Widows & Orphans](https://www.myfonts.com/pages/fontscom-learning-fontology-level-2-text-typography-rags-widows-orphans) · [Quark: Rules Designers Break on Purpose](https://www.quark.com/about/blog/the-typography-rules-professional-designers-break-on-purpose)
