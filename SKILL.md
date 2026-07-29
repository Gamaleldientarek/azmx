---
name: majarah-design
description: Apply the official Majarah design system to any deliverable. Use whenever work involves Majarah branding, Majarah presentations, meetup decks, community slides, event collateral, social graphics, or documents, or when the user mentions Majarah colors, the مجرة wordmark, the galaxy or cosmic visual language, Purple/900, Electric Purple, Oswald headlines, or the orbital ring mark. Also use for any Arabic, RTL, or bilingual EN/AR version of Majarah work — FF Shamel typography, mirroring a deck, or right-to-left layout. Majarah is the UX, design and digital-innovation community of Saudi Arabia, a sub-brand of AZM X. Provides the eleven-variable palette with a measured contrast matrix, the Oswald/Helvetica type system, the 1920×1080 slide grid with fixed chrome, twelve layout archetypes, sixteen measured reference slides, the ghost-text and two-tone-headline techniques, and the EN/AR variable architecture.
---

# Majarah Design System

Majarah (**مجرة** — Arabic for *galaxy*) is the **UX, design and digital-innovation community of Saudi Arabia**. It is one of four brands under AZM X. Bilingual English/Arabic. Its audience is practitioners: designers, researchers, product managers, employers, and students, in the same room.

Tagline: *Space for Enrichment & Inspiration* · Arabic: *رحلة في فضاء تجربة المستخدم*

One-line ethos: **deep purple ground, one vivid accent, and type big enough to be the whole composition.** The galaxy is the metaphor; the execution is editorial, not illustrative. Decks carry the community's authority — they are shown to sponsors, government partners, and prospective members.

Brand-book authorship: MUD Creative House. Figma source: `Majarah Library` (`AH4vTz9MkdX6QNA6uYNfYA`).

**Voice is not in this file.** Majarah's voice is *The Inclusive Mentor* and it is owned by the `azmx-brand` skill — read `references/voice.md` here for the short version and the pointer.

For the full palette with every pairing measured, read `references/colors.md`. For the exact live Figma variables and their IDs, read `references/figma-tokens.md`. For **why the EN/AR font collection collapses nine weights onto two Arabic faces, and what that costs**, read `references/variable-architecture.md`. For the type system and the Oswald substitution, read `references/typography.md`. For the twelve layout recipes with real coordinates, read `references/layout-archetypes.md`. For **a ready layout instead of a new composition — all sixteen measured slides with their exact geometry**, read `references/slide-library.md`. For the logo components, clearspace, and the decorative asset library, read `references/logo-and-assets.md`. For ghost text, two-tone headlines, mega numerals and stat blocks, read `references/editorial-technique.md`. For building inside Figma via the Desktop Bridge — including the gotchas that cost real time — read `references/figma-workflow.md`. For Arabic/RTL, read `references/rtl-arabic.md`. **For the standing client decisions and the twelve known defects in the v1 deck, read `references/decision-log.md` — it overrides anything older.**

---

## The one rule that matters most

**The Majarah palette is monochromatic. Every purple-on-purple pairing fails WCAG. Only White and Subtle Grey carry text on the dark grounds.**

This is the single fact that determines whether a Majarah deliverable reads or doesn't. The ramp from `#B671FF` to `#210054` is one hue at five lightnesses — beautiful as a system, treacherous as a contrast space. Adjacent steps are nearly invisible against each other.

Foreground on ground, measured:

| | Purple/900 | Purple/600 | Purple/500 | Purple/200 | White |
|---|---|---|---|---|---|
| **White** | **17.61** | **13.73** | **11.35** | 3.09 | 1.00 |
| **Subtle Grey** | **11.53** | **8.99** | **7.43** | 2.02 | 1.53 |
| **Purple/200** | **5.70** | 4.44 | 3.67 | 1.00 | 3.09 |
| **Purple/300** | 2.28 | 1.78 | 1.47 | 2.50 | **7.72** |
| **Purple/900** | 1.00 | 1.28 | 1.55 | **5.70** | **17.61** |

Read the consequences carefully, because two of them are counter-intuitive:

- **On any dark ground, body text is White or Subtle Grey. Nothing else clears 4.5:1.** Purple/200 clears it on Purple/900 (5.70) and only there.
- **Purple/300 `#6500E8` is a display-only accent.** At 2.28:1 on Purple/900 it is below even the 3:1 non-text floor. It works in this deck *because the headlines are 140–200pt*, where the eye reads it as a deliberate tonal drop rather than as text it must decode. Never use Purple/300 for body copy, captions, labels, or any type under ~90pt on a dark ground.
- **Purple/300 is genuinely strong on White (7.72:1).** If a deliverable has a light ground, Purple/300 becomes a real text colour. That inverts its role completely.
- **On the lavender ground Purple/200, the accent is White (3.09:1, large only) and the text colour is Purple/900 (5.70:1).** Purple/300 on lavender is 2.50:1 — it disappears. This is why the brand's own vivid accent is unusable on its own light tint.

**The two-tone headline is the house move, and it is a display-type licence, not a contrast pass.** Line one White, line two Purple/300, both at 140pt+. That is the brand's signature. Keep it at display scale and it reads as intended; shrink it below ~90pt and it becomes a defect.

⛔ **Never set Purple/900, Purple/500 or Purple/600 as type on any dark ground.** Those pairings measure 1.00–1.55:1. Two slides in the v1 deck did exactly this and the headline vanished — see `references/decision-log.md` D-01.

Projector caution: `#6500E8` is a saturated blue-violet close to the sRGB edge. Lamp projectors and video-call chroma subsampling crush it toward the Purple/900 ground first. In a projected or recorded context, never let Purple/300 alone carry a word that matters.

---

## The second rule: bind, don't type

The Majarah Library is **100% variable-bound and carries zero styles.** Verified across all eighteen frames of the v1 deck:

| Layer | State |
|---|---|
| Fills bound to a `Color` variable | **100%** — not one raw hex anywhere |
| Text bound to `Font-names/*` + `font-weights/*` | **100%** — every text node |
| Local paint styles | **0** |
| Local text styles | **0** |
| Local effect / grid styles | **0** |

This is unusual and it is the file's real strength: because colour and font family/weight are bound to variables, the EN→AR switch is a mode flip rather than a rebuild.

But note what has **no** variable layer, and therefore drifted:

| Property | Bound | Consequence in the v1 deck |
|---|---|---|
| `fills` | Yes | On-palette throughout |
| `fontFamily`, `fontStyle` | Yes | Held |
| `fontSize` | **No** | Fractional sizes from Scale-tool operations: `51.096771240234375`, `443.10345458984375`, `945`, `995` |
| `letterSpacing` | **No** | Fractional tracking: `-10.8`, `-12.4`, `-5.5`, `-2.8` |
| Layout geometry | **No** | One stat row rescaled to ~58%, labels landing at **6.4pt** |

**Fractional font sizes and fractional letter-spacing are the fingerprint of a Scale-tool drag.** When you find them, someone resized a group instead of setting values. They are the tell for the defects catalogued in `references/decision-log.md`.

Two enforceable consequences:

1. **Set sizes and tracking from the scale in `references/typography.md`, never by dragging a frame handle.** Scaling a group multiplies every nested value, including the 11pt labels that then become illegible.
2. **When you add text, bind it.** `t.setBoundVariable("fontFamily", …)` and `("fontStyle", …)`. An unbound node is invisible to the AR mode switch and will stay Latin in the Arabic deck.

---

## Core palette

Eleven variables in one `Color` collection, single mode. All match the brand book exactly.

| Token | Hex | Role |
|---|---|---|
| `Brand/Purple/900` | `#210054` | **The default ground.** Depth, gravity, authority. ~75% of any deck |
| `Brand/Purple/600` | `#380089` | Ghost-text base on dark; secondary ground for one energy slide |
| `Brand/Purple/500*` | `#4B0AA0` | Chapter-pivot ground; the purple logo fill; text colour on white |
| `Brand/Purple/300` | `#6500E8` | **Display accent only.** Second headline line, accent rules, dividers |
| `Brand/Purple/200` | `#B671FF` | Eyebrows and page indicators on dark; the lavender "wow" ground |
| `Neutral/White` | `#FFFFFF` | Primary text on dark; the accent that pops on lavender |
| `Neutral/Subtle Grey` | `#D1D1D1` | Quiet body text, subtitles, captions |
| `Neutral/Grey*` | `#231F20` | Available; the grey logo fill. Unused in deck work |
| `Brand/Blue/300` | `#010CFF` | Secondary family — available, used sparingly |
| `Brand/Blue/600` | `#0000AD` | Secondary family |
| `Brand/Blue/900` | `#020068` | Secondary family |

The asterisked names (`Purple/500*`, `Grey*`) carry the asterisk in the live file. Keep it — renaming breaks bindings.

**The blue family is real but dormant.** It appears in the brand book as the secondary palette and is bound as variables, yet no v1 deck slide uses it. Treat it as available headroom for a second-tier deliverable, not as an accent to sprinkle into a purple deck.

### Background rhythm

A deck breathes by varying its ground. The v1 sixteen-slide deck distributes as:

| Ground | Slides | Purpose |
|---|---|---|
`Purple/900` | 13 | The default editorial tone |
`Purple/500` | 1 (chapter pivot) | Breathing room at the structural hinge |
`Purple/600` | 1 (roadmap) | A lift in energy |
`Purple/200` | 2 (manifesto, CTA) | The voltage spikes |

Target roughly **70–80% Purple/900, one mid-purple pivot, one or two lavender peaks.** Never run one ground through a whole deck, and never place the two lavender slides adjacent — they are peaks, and two peaks side by side is a plateau.

**Never use raw white as a ground.** The client rejected it explicitly ("white is bad"); lavender `Purple/200` is the light option. See `references/decision-log.md` D-04.

---

## Typography

| Role | EN | AR | Variable |
|---|---|---|---|
| Display | **Oswald** | FF Shamel Family | `Font-names/Display-Font` |
| Body | **Helvetica Now Display** | FF Shamel Family | `Font-names/Body-Font` |

**Oswald is a client-approved substitution, not the brand book.** The brand book specifies Helvetica for display. Oswald was adopted because its condensed forms hold at 180–200pt where Helvetica sprawls. This is a live deviation — see `references/typography.md` and `references/decision-log.md` D-02 before changing it.

Availability matters and will bite you:

| Weight | Oswald | Helvetica Now Display |
|---|---|---|
| Light · Regular · Medium · Bold | yes | yes |
| SemiBold | yes | **no — fall back to Medium** |
| ExtraLight | yes | yes |
| Thin · ExtraBold · Black | **no** | yes |

Oswald is the narrower family at the extremes, and Oswald is the display font — so treat Black and Thin as body-only weights in EN. Full verified matrix in `references/typography.md`.

Headline sizes by slide role — display type is the composition, so these run large:

| Role | Size |
|---|---|
| Cover / hero | 180–200pt |
| Section divider | 150–160pt |
| Standard body slide | 130–140pt |
| Subsection | 110–120pt |
| Mega anchor numeral | 460–1000pt |
| Ghost text | 280–1000pt |
| Card / column title | 26–38pt |
| Eyebrow · label · chrome | 11–16pt |

Tracking tightens as size grows — `-1` to `-10px` above 100pt, `0` to `-2` from 40–100pt, `+3` to `+6` on 10–14pt eyebrows. Leading is 90–100% on massive headlines, 140–160% on body. Full scale in `references/typography.md`.

---

## The grid and the chrome

**Frame: 1920 × 1080. Horizontal margin: 120px, left and right.** Slides lay out in a row at `x = (N-1) × 2020`.

Chrome is fixed and was verified pixel-identical across all eighteen frames. Reproduce it exactly — it is the deck's spine:

| Element | Position | Spec |
|---|---|---|
| Page indicator (top-left) | `120, 92` | `{NN} / {TOTAL}`, Helvetica Light 14pt, ls 3 |
| Logo (top-right) | `1540, 78` | Secondary logo, `rescale(0.5)` → 260 × 56 |
| Footer credit (bottom-left) | `120, 1030` | `MAJARAH  ×  MUD CREATIVE HOUSE`, Helvetica Light 12pt, ls 3 |

Chrome colour inverts with the ground: **Purple/200 on dark, Purple/900 on lavender.** The logo swaps to the Main Purple variant on light grounds.

Two chrome facts from the audit worth knowing: the footer y-position drifted across the v1 deck (990 / 1020 / 1030) and is **absent entirely on the cover**; and the progress-dot strip that both written guides describe as standard chrome exists on **one slide of sixteen**. Pick one convention and hold it — see `references/decision-log.md` D-03.

---

## Guardrails

| Rule | Why |
|---|---|
| Purple/300 never below ~90pt on dark | 2.28:1 — display licence only |
| Purple/900 / 500 / 600 never as type on dark | 1.00–1.55:1, invisible |
| On lavender: text Purple/900, accent White | The only pairing that clears 4.5:1 |
| Ghost text ≤35% opacity on dark, ≤22% on light | Above that it competes with the foreground |
| Ghost text sits *behind*, never overlapping the focal line | It is ambient depth, not a second headline |
| Stats never at body size — 60pt Oswald Bold minimum | Numbers are the analytics moment |
| Never scale a group to resize it | Multiplies nested values; produces 6.4pt labels |
| Auto layout only on genuine grids and rows | It destroys the intentional overlap compositions |
| Bind every new text node's family and weight | Unbound nodes ignore the AR mode switch |
| Keep the `*` in `Purple/500*` and `Grey*` | Renaming breaks bindings |

---

## Working method

1. **Confirm the brand.** Majarah is an AZM X sub-brand with its own visual system — this one. Do not dress it in AZM X navy and Electric blue, and do not dress an AZM X piece in Majarah purple. If unclear, ask.
2. **Pick the ground** from the background-rhythm table. Default Purple/900.
3. **Lay the chrome** at the exact coordinates above, inverted if the ground is light.
4. **Choose a layout** from `references/layout-archetypes.md`, or lift a measured slide from `references/slide-library.md` rather than composing from nothing.
5. **Set the headline** as a two-tone pair at display scale. Check the accent line against the contrast matrix before committing.
6. **Add ghost text last**, behind the content, at or below the opacity cap.
7. **Bind everything** — fills to `Color` variables, text to `Font-names/*` and `font-weights/*`.
8. **Screenshot and read it.** Then run `scripts/brand-check.py` on any hex you have introduced. The two v1 defects were both invisible in the node data and obvious in a screenshot.
9. **For Arabic**, read `references/rtl-arabic.md` first. The AR mode flips fonts but prepares nothing else — no mirroring, and the nine-weight hierarchy collapses to two faces.

When in doubt, make the type bigger and the decoration quieter. The galaxy is the ground, not the subject.
