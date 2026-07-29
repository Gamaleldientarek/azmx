# Colors

Every Majarah colour, every pairing measured. Source: `Majarah Library` `Color` collection (11 variables, single mode), cross-checked against the MUD Creative House brand book page 3.

## Contents

1. [The eleven variables](#1-the-eleven-variables)
2. [Full contrast matrix](#2-full-contrast-matrix)
3. [Per-ground verdicts](#3-per-ground-verdicts)
4. [Role assignments by ground](#4-role-assignments-by-ground)
5. [Opacity conventions](#5-opacity-conventions)
6. [The blue family](#6-the-blue-family)

---

## 1. The eleven variables

| Variable | Hex | RGB | Relative luminance |
|---|---|---|---|
| `Neutral/White` | `#FFFFFF` | 255, 255, 255 | 1.0000 |
| `Neutral/Subtle Grey` | `#D1D1D1` | 209, 209, 209 | 0.6376 |
| `Brand/Purple/200` | `#B671FF` | 182, 113, 255 | 0.2898 |
| `Brand/Purple/300` | `#6500E8` | 101, 0, 232 | 0.0859 |
| `Brand/Purple/500*` | `#4B0AA0` | 75, 10, 160 | 0.0425 |
| `Brand/Purple/600` | `#380089` | 56, 0, 137 | 0.0265 |
| `Brand/Purple/900` | `#210054` | 33, 0, 84 | 0.0096 |
| `Neutral/Grey*` | `#231F20` | 35, 31, 32 | 0.0144 |
| `Brand/Blue/300` | `#010CFF` | 1, 12, 255 | 0.0749 |
| `Brand/Blue/600` | `#0000AD` | 0, 0, 173 | 0.0302 |
| `Brand/Blue/900` | `#020068` | 2, 0, 104 | 0.0101 |

The asterisks in `Purple/500*` and `Grey*` are part of the live variable names. Preserve them.

**The purple ramp is one hue at five lightnesses.** Luminance runs 0.0096 → 0.2898 across Purple/900 → Purple/200. Four of the five steps sit below 0.09. That compression is the whole contrast problem: there is almost no tonal room between them.

---

## 2. Full contrast matrix

Foreground (rows) against ground (columns). WCAG 2.1 ratios.

| | Purple/900 | Purple/600 | Purple/500 | Purple/300 | Purple/200 | White | Grey* |
|---|---|---|---|---|---|---|---|
| **White** | 17.61 | 13.73 | 11.35 | 7.72 | 3.09 | 1.00 | 16.30 |
| **Subtle Grey** | 11.53 | 8.99 | 7.43 | 5.06 | 2.02 | 1.53 | 10.67 |
| **Purple/200** | 5.70 | 4.44 | 3.67 | 2.50 | 1.00 | 3.09 | 5.27 |
| **Purple/300** | 2.28 | 1.78 | 1.47 | 1.00 | 2.50 | 7.72 | 2.11 |
| **Purple/500** | 1.55 | 1.21 | 1.00 | 1.47 | 3.67 | 11.35 | 1.44 |
| **Purple/600** | 1.28 | 1.00 | 1.21 | 1.78 | 4.44 | 13.73 | 1.19 |
| **Purple/900** | 1.00 | 1.28 | 1.55 | 2.28 | 5.70 | 17.61 | 1.08 |

Thresholds: **4.5** = AA body · **3.0** = AA large (≥24px bold / ≥18.66pt) and the non-text floor · below **3.0** = display licence at best.

---

## 3. Per-ground verdicts

### Ground `Purple/900` `#210054` — the default

| Foreground | Ratio | Verdict |
|---|---|---|
| White | 17.61 | AAA body — the workhorse |
| Subtle Grey | 11.53 | AAA body — quiet copy |
| Purple/200 | 5.70 | AA body — eyebrows, labels, chrome |
| Purple/300 | **2.28** | **Fails. Display licence only, ≥90pt** |
| Purple/500 | 1.55 | Invisible |
| Purple/600 | 1.28 | Invisible — ghost-text base only |

### Ground `Purple/600` `#380089` — the energy slide

| Foreground | Ratio | Verdict |
|---|---|---|
| White | 13.73 | AAA body |
| Subtle Grey | 8.99 | AAA body |
| Purple/200 | 4.44 | AA large only — acceptable for eyebrows at 14pt+ tracked |
| Purple/300 | **1.78** | **Invisible. Do not use** |
| Purple/900 | **1.28** | **Invisible. This was defect D-01** |

Note this ground has no usable vivid accent at all. On Purple/600 the accent role must be played by **White**.

### Ground `Purple/500*` `#4B0AA0` — the chapter pivot

| Foreground | Ratio | Verdict |
|---|---|---|
| White | 11.35 | AAA body |
| Subtle Grey | 7.43 | AAA body |
| Purple/200 | 3.67 | AA large only |
| Purple/300 | 1.47 | Invisible |
| Purple/900 | **1.55** | **Invisible. This was defect D-01** |

Same conclusion: on Purple/500 the accent is **White**.

### Ground `Purple/200` `#B671FF` — the lavender peak

The inversion ground. Everything reverses here.

| Foreground | Ratio | Verdict |
|---|---|---|
| Purple/900 | 5.70 | AA body — **the text colour** |
| Purple/600 | 4.44 | AA large only — recessive display type |
| Purple/500 | 3.67 | AA large only |
| White | 3.09 | AA large only — **the accent that pops** |
| Purple/300 | **2.50** | **Disappears. The brand's vivid accent is unusable on its own tint** |
| Subtle Grey | 2.02 | Invisible |

The Purple/300-on-lavender failure is the most surprising number in the system. The instinct is to reach for the vivid accent on the light ground; it measures worse than mid-purple. **On lavender, White is the accent and Purple/900 is the text.**

### Ground `White` `#FFFFFF` — not used in decks

Documented because Purple/300's role inverts completely: **7.72:1, AAA body.** If a Majarah deliverable has a white ground — a web page, an email, a printed report — Purple/300 becomes a legitimate text and link colour. Subtle Grey at 1.53:1 becomes unusable.

The client has rejected white grounds for decks (D-04). This column applies to non-deck surfaces only.

---

## 4. Role assignments by ground

| Role | On Purple/900 | On Purple/600 / 500 | On Purple/200 (lavender) | On White |
|---|---|---|---|---|
| Headline, primary | White | White | Purple/900 | Purple/900 |
| Headline, accent line | Purple/300 (≥90pt) | **White** | **White** | Purple/300 |
| Body copy | White / Subtle Grey | White / Subtle Grey | Purple/900 | Purple/900 / Purple/600 |
| Quiet body, captions | Subtle Grey | Subtle Grey | Purple/900 | Purple/500 |
| Eyebrow, label, chrome | Purple/200 | Purple/200 | Purple/900 | Purple/500 |
| Accent rule, divider | Purple/300 | Purple/300 | Purple/900 | Purple/300 |
| Hairline, subtle divider | Purple/600 or Purple/200 @ 25–35% | Purple/900 @ 30% | Purple/900 @ 35% | Purple/200 |
| Ghost text base | Purple/600 @ 22–35% | Purple/900 @ 25% | **White @ 18–22%** | Purple/300 @ 10–15% |
| Stat numeral | White, one in Purple/300 | White | Purple/900 | Purple/900 |
| Logo variant | Secondary White | Secondary White | Secondary Main Purple | Secondary Main Purple |

The pattern to internalise: **the accent line is Purple/300 only on the darkest ground.** On the two mid-purple grounds and on lavender it becomes White, because Purple/300 has no contrast headroom left.

---

## 5. Opacity conventions

Ghost text and hairlines rely on opacity rather than tint variables. Because fills are variable-bound, **paint-level opacity is overridden** — set `node.opacity` instead. See `references/figma-workflow.md` G-03.

| Element | Colour | Opacity | Cap |
|---|---|---|---|
| Ghost text, dark ground | Purple/600 | 0.22 – 0.35 | **0.35** |
| Ghost text, dark ground, vivid | Purple/300 | 0.12 | 0.15 |
| Ghost text, lavender ground | White | 0.18 – 0.22 | **0.22** |
| Vertical hairline between columns | Purple/200 | 0.25 – 0.35 | 0.35 |
| Row separator | Purple/200 | 0.25 | 0.30 |
| Ambient guide rule | White | 0.08 – 0.18 | 0.20 |

Above the caps, ghost text stops being ambient depth and starts competing with the headline. The v1 deck holds to 0.12–0.35 throughout, which is why the technique reads as intentional.

---

## 6. The blue family

`Blue/300` `#010CFF` · `Blue/600` `#0000AD` · `Blue/900` `#020068`

Bound as variables, present in the brand book as the secondary palette, and **used on zero slides of the v1 deck.**

Contrast notes if you do reach for it:

| Pairing | Ratio |
|---|---|
| White on Blue/900 | 17.46 |
| White on Blue/600 | 13.10 |
| White on Blue/300 | 8.41 |
| Blue/300 on White | 8.41 |
| Blue/300 on Purple/900 | 2.09 — fails, display only |

`Blue/900` `#020068` is within **0.0005** luminance of `Purple/900` `#210054` (0.0101 vs 0.0096) — they are effectively interchangeable as grounds and **must never be used adjacent to each other**, because a hue shift with no tonal shift reads as a printing error rather than a decision.

Note `Blue/300` on `Purple/900` measures **2.09:1** — even weaker than Purple/300's 2.28. There is no vivid accent in this brand that works as text on the dark ground. That is a property of the palette, not a mistake in it.

Treat blue as headroom for a distinct second-tier deliverable — a sponsor pack, a report cover — where you want to signal "Majarah, but not the community deck." Do not sprinkle it into a purple deck.
