# Colab Icons

**Library: [Hugeicons](https://hugeicons.com)** — the icon set the Colab Figma file actually runs on. Every icon in this repository is vendored from `@hugeicons/core-free-icons@4.2.3`, the MIT-licensed free tier.

| | |
|---|---|
| Library | Hugeicons |
| Vendored set | **Stroke Rounded**, 5,437 icons |
| Version pinned | `@hugeicons/core-free-icons@4.2.3` |
| Licence | **MIT** — commercial use, redistribution, no attribution required |
| Licence text | `assets/icons/LICENSE`, verbatim from [hugeicons/hugeicons](https://github.com/hugeicons/hugeicons/blob/main/LICENSE.md) |
| Authoring grid | 24 × 24, 1.5px stroke, round caps, round joins |
| Location | `assets/icons/stroke-rounded/` |
| Index | `references/icon-index.md` |

The earlier documentation named Phosphor. That was wrong — an assumption written before the file was audited. The audit of all 8 pages found **1,272 Hugeicons placements and zero Phosphor**. Hugeicons is the system; this file replaces the Phosphor guidance entirely, including the advice about binding colour to `fill`, which was true of Phosphor and is false here.

---

## The two house rules

Hugeicons has no weight axis. It has two variant axes — **Type** (Rounded, Sharp, Standard) and **Style** (Stroke, Solid, and the Pro-only Duotone, Twotone, Bulk). Colab uses one cell of that matrix, and the file is unanimous about which.

**1. `Type=Rounded`, always.** 1,272 of 1,272 placements. Sharp and Standard have never been used in this system and must not be introduced. Rounded joins match the round terminals of Inter and the softened corners of the pixel motif; Sharp fights both.

**2. `Style=Stroke` is the default.** Stroke is the working style at every size. Solid is a status device only — four icons in the entire file appear Solid, and all four are filled affirmation or negation glyphs where the fill *is* the signal:

| Solid is permitted | Meaning it carries |
|---|---|
| `checkmark-circle-01` | Pass, met, confirmed |
| `multiplication-sign-circle` | Fail, not met |
| `cancel-circle` | Blocked, out of scope, unavailable |
| `stars` | Rating, standout moment |

Nothing else. A Solid icon that is not carrying a verdict is an error.

**Never mix Stroke and Solid inside one row, one card, or one legend.** Solid reads as "on" against Stroke; using both decoratively destroys that signal.

---

## What is vendored here, and what is not

Only Stroke Rounded is MIT. Every other Hugeicons style and type is Pro and is **not** redistributable, so it is not in this repository.

| Style / Type | Tier | In this repo |
|---|---|---|
| Stroke × Rounded | Free, MIT | ✅ all 5,437 |
| Solid, Duotone, Twotone, Bulk | Pro | ❌ never commit |
| Sharp, Standard types | Pro | ❌ never commit — and banned by house rule anyway |

Colab work ships to enterprise clients. Do not place a Pro asset in a client deliverable without a Hugeicons Pro licence, and do not commit one to this repository under any circumstances.

**When a design calls for one of the four Solid glyphs and no Pro licence is available**, take either route:

1. Use the Stroke version. All four exist in Stroke in the vendored set and are the safe default.
2. Compose the filled glyph from Colab primitives: a filled circle in the accent colour with the free stroke glyph (`tick-02`, `cancel-01`) laid on top in the ground colour. Same silhouette, same signal, no licensed artwork.

---

## The proven working set

43 distinct icons across 1,272 placements in the client's file. **This is the shortlist.** Reach outside it only when nothing here carries the meaning, and prefer a sibling of an icon already in use over an unrelated new one.

Placement counts are from the 2026-07-26 audit of all 8 pages. Roles are read from where each icon sits in the file.

### Direction and navigation — 657 placements

| Icon | Placements | Role | RTL |
|---|---|---|---|
| `arrow-down-01` | 178 | The chevron. Expand, collapse, dropdown, "more below" | Never flips — vertical |
| `arrow-left-02` | 164 | Back, previous, return | **Swap** to `arrow-right-02` |
| `arrow-right-02` | 161 | Next, forward, the CTA arrow | **Swap** to `arrow-left-02` |
| `square-arrow-move-left-up` | 150 | Open elsewhere: external link, jump to source, "see appendix" | **Swap** to `square-arrow-move-right-up` |
| `arrow-right-01` | 4 | Inline "more" chevron at caption scale | **Swap** to `arrow-left-01` |

### Status and verdict — 210 placements

| Icon | Placements | Style seen | Role |
|---|---|---|---|
| `checkmark-circle-01` | 96 | Stroke + Solid | Pass, requirement met. The system's primary affirmation |
| `multiplication-sign-circle` | 48 | Stroke + Solid | Fail, requirement not met. Its direct counterpart |
| `cancel-01` | 37 | Stroke | Dismiss, close. A bare ✕ — not a verdict |
| `tick-02` | 15 | Stroke | Bare check as a list marker, where a circle would be too heavy |
| `cancel-circle` | 7 | Solid | Hard stop: blocked, out of scope, unavailable |
| `checkmark-circle-02` | 6 | Stroke | Lighter pass mark at small sizes |
| `checkmark-circle-04` | 1 | Stroke | One placement. Not a house choice — use `-01` or `-02` |

### Information and alert — 138 placements

| Icon | Placements | Role |
|---|---|---|
| `information-circle` | 92 | Methodology note, definition, caveat. Colab's footnote glyph |
| `notification-circle` | 29 | Unread, needs attention |
| `alert-02` | 10 | Warning. Pair with Vivid Orange for high severity |
| `information-square` | 3 | Square variant. Prefer the circle for consistency |
| `spam` | 3 | Flagged, critical |
| `alert-01` | 1 | Variant of `alert-02` |

### Controls — 188 placements

| Icon | Placements | Role |
|---|---|---|
| `add-01` | 89 | Plus. Expand, add, reveal |
| `remove-01` | 89 | Minus. Collapse, remove. Identical count to `add-01` — they are one accordion pair and must stay paired |
| `view-off` | 8 | Hidden, masked, redacted participant data |
| `dialpad-circle-01` | 1 | Input control |
| `settings-error-01` | 1 | Configuration fault |

### People and participants — 41 placements

| Icon | Placements | Role |
|---|---|---|
| `prisoner` | 29 | ⚠️ Used as a participant or persona avatar. **Verify before reusing** — the name is wrong for the job and the glyph will read badly in a client deck. New work uses `user` or `user-account` |
| `user` | 8 | Single participant |
| `user-account` | 2 | Participant with a profile |
| `user-multiple-02` | 1 | Cohort, panel |
| `user-multiple` | 1 | Cohort, panel |

### Devices and context — 14 placements

| Icon | Placements | Role |
|---|---|---|
| `smart-phone-01` | 10 | Mobile test surface |
| `laptop-phone-sync` | 1 | Cross-device journey |
| `gps-01` | 1 | Location, in-field session |
| `global` | 1 | MENA / multi-market reach |
| `dashboard-browsing` | 1 | Product surface under test |

### Research furniture — 24 placements

| Icon | Placements | Style seen | Role |
|---|---|---|---|
| `calendar-03` | 11 | Stroke | Session date, fieldwork window |
| `stars` | 3 | Solid | Rating, standout moment |
| `home-05` | 2 | Stroke | Home screen, journey start |
| `award-05` | 2 | Stroke | Benchmark met, best in set |
| `home-02` | 1 | Stroke | Variant of `home-05` |
| `thumbs-up-ellipse` | 1 | Stroke | Positive sentiment |
| `quiz-03` | 1 | Stroke | Survey, questionnaire |
| `chart-line-data-02` | 1 | Stroke | Trend, over-time metric |
| `stop-watch` | 1 | Stroke | Time on task |
| `ear-rings-03` | 1 | Stroke | ⚠️ Almost certainly a mis-pick. Do not propagate |

**Two flagged glyphs.** `prisoner` and `ear-rings-03` are in the file but are not endorsed. Both look like search-result accidents. Replace them when the slides they sit on are next touched; never copy them into new work.

---

## Choosing an icon that is not in the working set

1. Search the vendored set by name first — `ls assets/icons/stroke-rounded | grep chart`. 5,437 icons; the concept almost certainly exists.
2. Prefer a **sibling** of something already in use. `checkmark-circle-03` beats an unrelated tick.
3. Prefer the **lower-numbered variant** (`-01`, `-02`) when several exist. Those are the base designs; the higher numbers are increasingly specific.
4. Reject any glyph whose name would embarrass you in a client file, however well it draws. `prisoner` is the cautionary case.
5. One concept, one icon, across the whole deck. Two glyphs for "participant" is worse than the wrong glyph used consistently.

---

## Colour by ground

Icons inherit Colab's contrast law without exception. A stroke icon is a **graphical object**: WCAG 1.4.11 puts its floor at **3 : 1** against the ground, and a 1.5–2px stroke is the thinnest thing on the slide, so it fails first.

⛔ **Electric Green `#34FF67` and Jade Green `#33FFC2` must never appear on white or any light ground.** Not as an icon, not as an icon's stroke, not as a dot beside one. Electric measures **1.34 : 1** and Jade **1.29 : 1** on white — both below the 3 : 1 non-text floor, let alone any text threshold. On light grounds the icon accent is **Pine Green `#103A21`** or **Olive Green `#5B6B3E`**.

| Ground | Icon colour | Accent colour | Never |
|---|---|---|---|
| **White / light neutral** | Pine Green `#103A21` — 12.73 : 1 | Olive Green `#5B6B3E` — 5.81 : 1 | Electric (1.34), Jade (1.29), Grey `#BCBEC0` (1.86), Pale Sky (1.50) |
| **Pine Green `#103A21`** | White — 12.73 : 1 | Electric Green `#34FF67` — 9.49 : 1 | Deep Jade (1.38), Olive (2.19) |
| **Deep Jade `#011E14`** | White — 17.54 : 1 | Electric — 13.07 : 1, or Jade — 13.55 : 1 | Pine (1.38), Olive (3.02 — floor only) |
| **Electric Green flood** | Deep Jade `#011E14` — 13.07 : 1 | Pine Green — 9.49 : 1 | White (1.34), Jade (1.04), Grey (1.39) |
| **Photography** | White, with a scrim beneath | — | Any accent; the ground is uncontrolled |

Ratios computed with the WCAG 2.x relative-luminance formula.

**Grey `#BCBEC0` is a dark-ground device only.** 6.83 : 1 on Pine and 9.41 : 1 on Deep Jade, but **1.86 : 1 on white** — a grey icon on a white slide is invisible and non-compliant. Use Pine at reduced weight for a muted icon on light.

**Vivid Orange `#FF5A32`** clears the 3 : 1 icon floor on white (3.11 : 1) and on Pine (4.10 : 1). It is legal for a severity icon and illegal for a label beside it — the text needs 4.5 : 1 and orange gives 3.11 on white. Set severity labels in Pine.

**One accent icon per surface.** The same restraint that governs Electric text governs Electric icons. A row of six green icons is not an accent, it is a texture.

**Projector caution carries over from `SKILL.md`.** A 1.5px Electric Green stroke is the single most fragile mark in the system under lamp projection and Teams/Zoom chroma subsampling. On any surface that will be projected or recorded: never below 2px, and never below **3px** if the stroke is Electric Green. Never let a green icon alone carry a meaning that is not also written.

---

## Size and stroke

Hugeicons is authored at 24 × 24 with a 1.5px stroke — a stroke that is 6.25% of the box. Scaling the box scales the stroke with it, so a naively enlarged icon turns into a slab. Set the box and the stroke as a pair.

Every step is on the 8px grid.

| Box | Stroke | Use |
|---|---|---|
| **24** | 1.5 | The authored size. Inline with Body 20–24, footer band, table and legend chrome |
| **32** | 2 | The default content-slide icon |
| **40** | 2 | Icon + label pairs, KPI-row markers, card headers. Equals one gutter and two motif modules, so it aligns to both grids |
| **48** | 2.5 | Section anchor, a 3-up feature row |
| **64** | 3 | Divider or layout-archetype anchor |
| **80** | 3 | Cover or single-idea slide. One per spread |

- **Never below 24px on a 1920 × 1080 slide.** 16px is 0.8% of canvas width — it disappears at the back of a room. 16 and 20 remain correct in product UI, which is a different surface.
- **Above 80px, stop scaling and start compositing.** A 200px icon reads as clip art. A hero moment is carried by a number, the motif, or an image — not by a magnified glyph.
- **The stroke thins proportionally as the box grows** (6.25% at 24px down to 3.75% at 80px). That is deliberate; a constant 6.25% at 80px would be a 5px slab.
- **One size step per surface.** Mixing 32 and 48 in a single row is the amateur tell.
- **The icon stroke should read at the same weight as the rules and hairlines beside it.** Do not put a 3px icon next to a 1px divider.

---

## Pairing with labels

Prefer icon plus label. A standalone icon is acceptable only for universally understood controls — close, back, download, external link — and it must still carry an accessible name.

- An icon-only control with no `aria-label` is an accessibility failure, not a style choice.
- **Colour is never the only signal.** Green tick and orange cross must also differ in shape — which they do, which is why `checkmark-circle-01` and `multiplication-sign-circle` are the sanctioned verdict pair. Never signal pass/fail with a colour change to the same glyph.
- Icons never replace the pixel motif, and the motif never replaces an icon. The motif is a margin and edge device; icons carry meaning inside content.
- **Do not scatter decorative icon rows.** A row of glyphs standing in for content is the clearest AI tell in a deck. If an icon is not doing a job a label cannot, delete it.

---

## Arabic / RTL

Extends `SKILL.md` § Arabic / RTL and `references/layout-archetypes.md` §5.

**Flip only directional elements.** Arrows, chevrons, carets, progress, and the "open elsewhere" arrow.

**Never flip** the `colab.` logo, charts, photographs, product screenshots, clock faces, or any glyph containing Latin or Arabic letterforms.

**Swap the icon, do not mirror the instance.** Mirroring an `arrow-right-02` instance leaves a layer named `arrow-right-02` pointing left — the layer name lies, and the next person to open the file trusts it. Point the instance at the opposite icon instead:

| LTR | RTL |
|---|---|
| `arrow-right-02` | `arrow-left-02` |
| `arrow-right-01` | `arrow-left-01` |
| `square-arrow-move-left-up` | `square-arrow-move-right-up` |
| `arrow-down-01`, `arrow-up-01` | unchanged — vertical icons never flip |

Both members of every pair are in the vendored set.

Where a component must serve both languages from one master, drive the swap with the existing `EN` / `AR` **variable mode**, not a duplicated component.

**Icon + label auto-layout reverses too.** An RTL row runs icon-right, label-left. Right-aligned text with the icon still on the left is the classic RTL bug.

---

## In Figma

The Hugeicons Figma library exposes `Type` and `Style` as variant properties on every component set.

- **Lock `Type=Rounded` and `Style=Stroke`** on every instance. If a component's variant picker shows Sharp or Standard, someone has changed a default — reset it.
- **Bind colour variables to `stroke`.** Hugeicons Stroke instances are live strokes, not flattened fills. This is the opposite of Phosphor, and the reason the old guidance in this repo was wrong.
- **For a Solid instance, bind to `fill`.** A Solid glyph has no stroke to bind, so a `stroke` binding does nothing. Check which style you are on before wiring the variable.
- **Never flatten an icon.** Flattening converts live strokes to fills and permanently breaks the `stroke` binding, the stroke-weight step, and any future recolour.
- **Resize with the W/H fields, not the Scale tool.** Scale (`K`) multiplies stroke weight; W/H leaves it alone. Set the box, then set the stroke weight from the table above.
- **Leave stroke alignment at Center.** Inside/Outside shifts the icon off its 24-grid alignment and breaks optical parity with its siblings.
- **Hugeicons has no weight axis.** There is no Thin, Light, Regular or Bold. Anyone asking for a weight means either a different stroke value or a different Style.

---

## Download

Vendored SVGs are bare: a 24 × 24 `viewBox`, `stroke="currentColor"`, no metadata, no editor cruft, single line, averaging ~1 KB.

```bash
curl -L -O "https://raw.githubusercontent.com/Gamaleldientarek/colab-design-skill/main/assets/icons/stroke-rounded/arrow-right-02.svg"
```

The URL is a pure function of the icon name:

```text
https://raw.githubusercontent.com/Gamaleldientarek/colab-design-skill/main/assets/icons/stroke-rounded/<icon-name>.svg
```

The working set in one call:

```bash
for i in arrow-down-01 arrow-left-02 arrow-right-02 square-arrow-move-left-up \
         checkmark-circle-01 multiplication-sign-circle information-circle \
         add-01 remove-01 cancel-01 tick-02 alert-02 calendar-03 user; do
  curl -sL -O "https://raw.githubusercontent.com/Gamaleldientarek/colab-design-skill/main/assets/icons/stroke-rounded/$i.svg"
done
```

`currentColor` means an inlined SVG inherits the surrounding `color`, so a stroke icon takes its ground's rule automatically on the web:

```html
<span style="color:#34FF67"><!-- paste svg here --></span>
```

Imported into Figma, PowerPoint or Illustrator, `currentColor` resolves to black. **Set the stroke to the ground's icon colour immediately after placing** — a black icon on Pine Green is the most common way this goes wrong.

For a code project, install rather than vendor:

```bash
npm install @hugeicons/react @hugeicons/core-free-icons
```

```jsx
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

<HugeiconsIcon icon={ArrowRight02Icon} size={32} strokeWidth={2} color="#34FF67" />
```

Export names are PascalCase (`ArrowRight02Icon`); Figma component names and the files here are kebab-case (`arrow-right-02`). They are the same icon.

The full name list, sharded alphabetically, is in `references/icon-index.md`.

---

## Maintenance

| Task | Command |
|---|---|
| Re-vendor at the pinned version | `python3 scripts/vendor-hugeicons.py` |
| Re-vendor at a newer version | `python3 scripts/vendor-hugeicons.py 4.3.0` |
| Regenerate the index | `python3 scripts/rebuild-icon-index.py` |

Both scripts are deterministic and rewrite their outputs in full. Bump `PINNED` in `scripts/vendor-hugeicons.py` when the version moves, and re-check the licence terms at the same time — the free tier's scope is Hugeicons' to change.

---

## Provenance

Library identification, the 43-icon inventory, the placement counts, and the Rounded/Stroke unanimity are from a full audit of every remote instance across all 8 pages of the `Colab Design System` Figma file, 2026-07-26. Contrast ratios are computed, not estimated. Size steps, stroke values, and the RTL swap table are derived for Colab's 1920 × 1080 grid; they are house rules, not vendor guidance.
