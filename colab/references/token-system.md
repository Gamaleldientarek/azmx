# Colab — The Token System

**Four grounds, one set of bindings.** Rebuilt from scratch 2026-08-08 in the `Colab Design System` Figma file. This reference supersedes `figma-tokens.md`, which documents the retired collections.

The governing idea: **a slide declares which ground it sits on, and every colour on it follows.** Nothing on a slide names a colour. One mode switch on the frame moves the whole slide from white to pine to deep jade to electric, and the text stays readable at every stop because the readability is encoded in the tokens, not applied by hand.

---

## 1. What this replaced, and why

The old layer was one collection, `color 🎨`, with two modes (Light / Dark) and 436 variables — 242 of them a whole Tailwind palette that has nothing to do with Colab.

It failed for a reason worth stating precisely, because it is the commonest way a token system rots:

> **`background/brand/pine`, `text/brand/electric`, `border/brand/leaf` are primitives wearing semantic clothing.**

A token whose name contains a colour cannot be moved by a mode. `text/brand/electric` is Electric Green in Light mode and Electric Green in Dark mode, because that is what the name promises. **882 bindings — 11.1% of the deck — sat on tokens like these**, which is why the deck had a "dark mode" that changed almost nothing and broke what it did change.

The test: **can a mode change this token's value without making its name a lie?** If no, it is a primitive. Move it down a tier and bind the consumer to a role instead.

The second failure was that two modes cannot describe four grounds. The deck rotates Pine, Deep Jade, White and Electric — a Light/Dark pair collapses Pine and Deep Jade into one bucket and has nowhere at all to put Electric.

---

## 2. The five collections

| # | Collection | Modes | Vars | Holds |
|---|---|---|---|---|
| **01** | `01 Primitives` | Value | **288** | Raw values. Every hex, every number. Never bound to a node |
| **02** | `02 Semantic` | **Light · Jade · Dark · Electric** | **88** | Roles. The only tier that knows about grounds |
| **03** | `03 Component` | Value | **65** | Named deck parts. Aliases semantic, one hop, no logic |
| **04** | `04 Typography` | **EN · AR** | **41** | Family, weight, size, leading, tracking |
| **05** | `05 Canvas` | Value | **15** | Grid, slide and motif geometry |
| **06** | `06 Strings` | **EN · AR** | 4 | Footer and chrome copy |

Total **501**. The dependency runs one way and never loops:

```
01 Primitives  ──►  02 Semantic  ──►  03 Component  ──►  node
      │                                                    ▲
      ├──────────────►  04 Typography  ────────────────────┤
      └──────────────►  05 Canvas  ─────────────────────────┘
```

**Typography and Canvas alias primitives directly.** They sit outside the colour chain on purpose — type and geometry do not change with the ground. Language changes type; ground does not.

**Two independent axes.** `02 Semantic` carries ground (Light/Jade/Dark/Electric). `04 Typography` and `06 Strings` carry language (EN/AR). A slide sets both, and they never interact — an Arabic slide on a pine ground sets Jade on one collection and AR on the other.

---

## 3. The four grounds

| Mode | `surface/page` | Hex | When |
|---|---|---|---|
| **Light** | `color/base/white` | `#FFFFFF` | Data-dense slides, tables, full-text pages, device evidence |
| **Jade** | `color/brand/electric-green/pine-green` | `#103A21` | The house default. Findings, framing, most content |
| **Dark** | `color/brand/jade-green/950` | `#011E14` | Openers, dividers, statement slides, highest-contrast moments |
| **Electric** | `color/brand/electric-green/400` | `#34FF67` | Covers and dividers only. Minimal text, no body copy |

Mode names describe **the ground, not the polarity.** Jade and Dark are both dark grounds; Light and Electric are both light grounds. This matters when seeding a new mode — see §11.

Measured across the 83 template slides as of 2026-08-08: **Jade 39 · Dark 25 · Light 17 · Electric 2.**

---

## 4. Tier 1 — Primitives (288)

Raw values, `hiddenFromPublishing: true`, scoped so none of them appear in a designer's picker. **Nothing on a slide binds here.**

| Group | Count | Notes |
|---|---|---|
| `color/brand/*` | 58 | electric-green, jade-green, olive-green, vivid-orange, pale-sky-blue, grey — 50→950 ramps |
| `color/alpha/*` | 29 | `white/10…60`, `black/10…80`, `primary/10…30`. **The reason translucency survives a bind** — see §12.3 |
| `color/neutral/*` | 11 | 50→950 |
| `color/base/*` | 2 | white, black |
| `color/blue` `green` `yellow` `red` | 44 | Inherited utility ramps. Not brand. Do not reach for these |
| `size/space/*` | 56 | Includes the slide-geometry numbers (20, 40, 50, 98, 100, 180, 932, 1720) |
| `size/leading/*` | 33 | Both EN and AR leadings live here as raw numbers |
| `size/font/*` | 20 | 12…240 |
| `size/border/*` | 11 | |
| `size/radius/*` | 8 | 0, 2, 4, 8, 12, 16, 24, full |
| `size/tracking/*` | 8 | −2.5 … +6 |
| `size/stroke/*` | 5 | 0.5, 1, 2, 4 |
| `size/slide/*` | 2 | 1920, 1080 |
| `size/grid/*` | 1 | 8 |

**Primitive hygiene is a recurring repair, not a one-time setup.** Bulk operations flatten `scopes` back to `ALL_SCOPES`. Re-check after any large pass:

```js
const prim = (await figma.variables.getLocalVariableCollectionsAsync())
  .find(c => c.name === '01 Primitives');
let broken = 0;
for (const id of prim.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (!v.hiddenFromPublishing || v.scopes.indexOf('ALL_SCOPES') >= 0) broken++;
}
return broken;   // must be 0
```

---

## 5. Tier 2 — Semantic (88)

The only tier with four modes. Resolved values below are **measured from the live file**, with WCAG ratios computed against that mode's own `surface/page`.

### 5.1 Surfaces

| Token | Light | Jade | Dark | Electric |
|---|---|---|---|---|
| `surface/page` | `#FFFFFF` | `#103A21` | `#011E14` | `#34FF67` |
| `surface/raised` | `#F9FAFB` | `#013324` | `#013324` | `#6FFF96` |
| `surface/card` | `#FFFFFF` | `#013324` | `#013324` | `#AEFFC3` |
| `surface/sunken` | `#F3F4F6` | `#011E14` | `#0D121C` | `#00E93A` |
| `surface/inverse` | `#103A21` | `#FFFFFF` | `#FFFFFF` | `#011E14` |

`surface/inverse` is for a **deliberate opposite-polarity panel** — a dark card parked on a white slide. It exists because such panels are real in this deck and were the thing that broke automated ground detection. See §12.5.

### 5.2 Text — every role clears AA body on its own ground

| Token | Light | | Jade | | Dark | | Electric | |
|---|---|---|---|---|---|---|---|---|
| `text/primary` | `#0D121C` | 18.74 | `#FFFFFF` | 12.73 | `#FFFFFF` | 17.54 | `#011E14` | 13.07 |
| `text/secondary` | `#4D5761` | 7.36 | `#E5E7EB` | 10.28 | `#E5E7EB` | 14.17 | `#103A21` | 9.49 |
| `text/muted` | `#6C737F` | 4.78 | `#9DA4AE` | 5.07 | `#9DA4AE` | 6.98 | `#066120` | 5.71 |
| `text/accent` | `#103A21` | 12.73 | `#34FF67` | 9.49 | `#34FF67` | 13.07 | `#011E14` | 13.07 |
| `text/inverse` | `#FFFFFF` | — | `#0D121C` | — | `#0D121C` | — | `#FFFFFF` | — |
| `text/disabled` | `#9DA4AE` | 2.51 | `#4D5761` | 1.73 | `#4D5761` | 2.38 | `#009826` | 2.83 |

**`text/accent` is where the Electric ban is encoded.** On Light it resolves to Pine, not Electric — the rule "Electric Green never on a light ground" is now a property of the token, not a thing a designer has to remember. Same for `icon/accent` and `border/accent`.

**`text/disabled` is below 3:1 in every mode. That is deliberate** — disabled means unreadable. Never use it for content, only for genuinely inert UI. Nothing in the report deck should carry it.

⚠️ **`text/inverse` means *the opposite of `text/primary` in this mode*, not "white".** Binding white text to it produces white-on-white in Light and black-on-pine in Jade. This caused 168 unreadable nodes. For text that must stay white regardless of ground, use `text/on-dark`. See §9.

### 5.3 Borders and icons

| Token | Light | Jade | Dark | Electric |
|---|---|---|---|---|
| `border/subtle` | `#F3F4F6` | white @10% | white @10% | `#00C22C` |
| `border/default` | `#E5E7EB` | white @20% | white @20% | `#103A21` |
| `border/strong` | `#6C737F` | white @40% | white @40% | `#011E14` |
| `border/accent` | `#103A21` | `#34FF67` | `#34FF67` | `#011E14` |
| `icon/default` | `#4D5761` | `#FFFFFF` | `#FFFFFF` | `#103A21` |
| `icon/muted` | `#9DA4AE` | `#9DA4AE` | `#9DA4AE` | `#009826` |
| `icon/accent` | `#103A21` | `#34FF67` | `#34FF67` | `#011E14` |
| `icon/inverse` | `#FFFFFF` | `#0D121C` | `#0D121C` | `#FFFFFF` |

### 5.4 Accent

| Token | Light | Jade | Dark | Electric |
|---|---|---|---|---|
| `accent/default` | `#34FF67` | `#34FF67` | `#34FF67` | `#011E14` |
| `accent/hover` | `#6FFF96` | `#6FFF96` | `#6FFF96` | `#013324` |
| `accent/content` | `#103A21` | `#103A21` | `#103A21` | `#34FF67` |

`accent/default` is a **fill**; `accent/content` is what goes **on** that fill. The pair is contrast-safe everywhere: Pine on Electric is **9.49:1**, Electric on Deep Jade is **13.07:1**. On Electric ground the pair inverts so the chip stays visible against its own page.

### 5.5 Decor and scrim

| Token | Light | Jade | Dark | Electric |
|---|---|---|---|---|
| `decor/dither` | `#103A21` | `#34FF67` | `#34FF67` | `#011E14` |
| `decor/dither-soft` | primary @30% | primary @30% | primary @30% | `#013324` |
| `decor/wash/soft` `medium` `strong` | alpha 10/20/30 | alpha 10/20/30 | alpha 10/20/30 | black 10/20/30 |
| `scrim/soft` `medium` `heavy` | black @40/60/80 — **constant across all four modes** |

### 5.6 Status — five ordinal families × four parts

`status/{positive, warning, critical, info, neutral}/{indicator, surface, content, border}`.

| Family | Hue | Ordinal meaning |
|---|---|---|
| `critical` | Vivid Orange | highest severity — the palette has no red |
| `warning` | Olive Green | medium |
| `neutral` | Grey `#BCBEC0` | low / no change |
| `positive` | Electric Green | improvement |
| `info` | Pale Sky Blue | informational |

**`indicator` is constant across Light, Jade and Dark.** An ordinal scale that changes hue with the ground destroys skim-by-colour and makes two slides on different grounds incomparable. Electric mode is the single exception, and only where a marker would otherwise vanish into the ground (`warning`, `info`, `neutral` step darker; `critical` and `positive` do not need to).

`surface` / `content` / `border` **do** flip, because those are contextual chrome, not the data signal.

### 5.7 Overlays — the alpha tier

| Token | Light | Jade / Dark | Electric |
|---|---|---|---|
| `surface/overlay/subtle` | black @10% | white @10% | black @10% |
| `surface/overlay/soft` | black @20% | white @20% | black @20% |
| `surface/overlay/medium` | black @40% | white @40% | black @40% |
| `surface/overlay/strong` | black @60% | white @60% | black @60% |

These exist because **binding a paint to a solid colour variable destroys the paint's opacity** — the variable supplies alpha 1.0 and a translucent card becomes an opaque box. See §12.3. Where translucency is the design, bind to an overlay token instead of setting `paint.opacity`.

### 5.8 Non-colour semantics

`radius/{none,xs,sm,md,lg,xl,2xl,full}` · `space/{3xs…3xl}` plus `space/slide/{margin,gutter}` · `stroke/{hairline,default,medium,thick}` · `slide/{width,height}` · `opacity/{hidden,subtle,muted,strong,full}`.

Identical in all four modes. They live in Semantic rather than Primitives so a consumer binds to a role (`space/lg`) and not a number (`size/space/40`).

---

## 6. Tier 3 — Component (65)

One hop, no logic. A component token exists so a deck part can be **renamed or re-pointed in one place**.

| Group | Tokens |
|---|---|
| `card/*` | surface → `surface/card` · title → `text/primary` · body → `text/secondary` · marker → `accent/default` |
| `stat/*` | value → `text/primary` · label → `text/muted` |
| `chip/*` | surface → `accent/default` · label → `accent/content` |
| `footer/*` | chip-surface, chip-label, title → `text/primary` · sub → `text/accent` · date → `text/muted` |
| `table/*` | header-text → `text/muted` · cell-text → `text/primary` · hairline → `border/subtle` · row-surface → `surface/raised` |
| `device/*` | bezel → `border/strong` · screen → `surface/raised` · accent → `accent/default` · label → `text/muted` |
| `numeral/*` | surface, label, display → `text/accent` |
| `dither/*` | cell → `decor/dither` · cell-soft → `decor/dither-soft` |
| `rule/*` `meta/*` `logo/*` `eyebrow/*` | thin aliases onto border, text and accent roles |
| `severity/*` | critical · major · minor · positive · visual → the matching `status/*` family |
| `impact/*` | high · medium · low → `status/critical` · `warning` · `neutral` |

`severity/*` and `impact/*` are the deck's two **ordinal vocabularies**. They alias `status/*` rather than duplicating it, so the ordinal mapping is stated once. Rename a severity tier and one alias moves.

⚠️ **A component token serves many grounds.** `footer/*` appears on 32 of 41 slides that sit on pine. Pinning it to a colour that suits one slide breaks the other 31. Learned twice — once at a cost of 60 → 144 failures. Fix the outlier at instance level, never at the token.

---

## 7. Tier 4 — Typography (41), EN / AR

Family, weight, size, leading and tracking. **Modes are languages, not grounds.**

| Group | EN | AR |
|---|---|---|
| `family/display` `family/body` | Inter | Alexandria |
| `weight/*` | Light · Regular · Medium · Semi Bold · Bold · Black | same |
| `size/display/*` | 240 · 200 · 160 · 60 · 40 · 30 | **identical to EN** |
| `size/body/*` | 40 · 36 · 28 · 24 · 20 · 16 · 12 | **identical to EN** |
| `leading/display/*` | 216 · 180 · 144 · 57 · 38 · 28.5 | 360 · 300 · 240 · 90 · 60 · 45 |
| `leading/body/*` | 54 · 48.6 · 37.8 · 32.4 · 27 · 21.6 · 16.2 | 60 · 54 · 42 · 36 · 30 · 24 · 18 |
| `tracking/*` | −2.5 … −1.1, caps +4 / +6 | **0 throughout** |

**Sizes are identical across EN and AR. Only leading and tracking move.** Arabic is ~10% *narrower* than Latin, not smaller — any measurement suggesting a size step-up is a stale-layout artifact.

**AR leading is ×1.5, and it is a collision floor, not a preference.** The MSA ink envelope is 1.505em; below it, ascenders and descenders touch. Never share a leading token between EN and AR.

⚠️ `size/*` and `space/*` primitives both contain 16, 20, 24, 40. **Binding a font size by matching its value picks the wrong family half the time.** 517 nodes were repaired after exactly this. Select by property, not by number:

```js
const family = prop === 'fontSize'   ? 'size/font/'
             : prop === 'lineHeight' ? 'size/leading/'
             : 'size/space/';
```

---

## 8. Tier 5 — Canvas (15)

Grid and slide geometry, so a layout script reads the grid instead of hard-coding it.

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `canvas/slide/width` | 1920 | | `canvas/grid/margin` | 100 |
| `canvas/slide/height` | 1080 | | `canvas/grid/content-width` | 1720 |
| `canvas/grid/columns` | 8 | | `canvas/bleed` | 50 |
| `canvas/grid/column-width` | 180 | | `canvas/footer-band` | 98 |
| `canvas/grid/gutter` | 40 | | `canvas/live-height` | 932 |
| `canvas/motif-module` | 20 | | | |

Plus `canvas/page`, `canvas/section`, `canvas/grid`, `canvas/guide` — the colours of the Figma workspace itself, outside the slide.

`canvas/motif-module` = 20 is exactly 1/9 of a 180 column, which is why nine motif atoms tile a column with no remainder.

---

## 9. Constants — the tokens that must NOT flip

Five semantic tokens deliberately hold one value in all four modes. Each exists because something sits on a **local surface**, not on the page ground, and a mode-aware token would follow the wrong parent.

| Token | Value | Use when |
|---|---|---|
| `text/on-dark` | white | Text on a dark panel, whatever the slide's ground |
| `text/on-light` | `#0D121C` | Text on a light panel on a dark slide |
| `surface/overlay/on-dark` | white @10% | A translucent lift over a known-dark local surface |
| `surface/overlay/on-light` | black @10% | The same over a known-light one |
| `scrim/*` | black @40/60/80 | A scrim darkens whatever is under it, always |

**The rule: mode-aware tokens describe the slide. Constant tokens describe a panel.** If the element's parent is a card, a photo, or an inverse panel — not the page — reach for a constant.

---

## 10. Applying the system to a slide

Two hops. Do them in order and never merge them.

**Hop 1 — legacy → primitives.** Value-matched, pixel-identical, mechanical. Nothing changes on screen. This is the safe hop and can run in bulk over a whole page.

**Hop 2 — primitives → semantics.** Role-driven and context-aware. This is where a colour stops being a colour and becomes a job. Runs **one slide at a time, screenshotted.**

### The mandatory order

```
1. read the slide's ground        ← from the largest covering surface, not the frame fill
2. setExplicitVariableModeForCollection(frame, '02 Semantic', modeId)
3. THEN lift the bindings
```

Lifting before setting the mode resolves every token against Light and turns a pine slide white. There is no recovery except undo.

```js
const cols  = await figma.variables.getLocalVariableCollectionsAsync();
const sem   = cols.find(c => c.name === '02 Semantic');
const mode  = sem.modes.find(m => m.name === ground).modeId;
frame.setExplicitVariableModeForCollection(sem, mode);   // before any binding write
```

### Binding a paint without losing its alpha

```js
node.fills = node.fills.map(function (p) {
  if (p.type !== 'SOLID') return p;
  const op = p.opacity === undefined ? 1 : p.opacity;
  const np = figma.variables.setBoundVariableForPaint(p, 'color', target);
  if (op < 1) np.opacity = op;      // the variable supplies alpha 1.0 — restore it
  return np;
});
```

1,920 translucent paints in the Arabic deck survive only because of those three lines.

---

## 11. Adding or reseeding a mode

Seed a new mode by copying **the mode of matching polarity**, then override the grounds:

- **Jade copies Dark** — Pine is a dark ground
- **Electric copies Light** — Electric is a light ground

Copying by mode *name* rather than polarity is the mistake: "Jade sounds green, Light sounds neutral, I'll copy Light" produces white text on pine, which is correct by accident, and pine text on pine, which is not.

Then override every foreground that fails on the new ground. For Electric that is six tokens, because white on `#34FF67` is **1.34:1** — below even the non-text floor.

---

## 12. The seven traps

Every one of these cost real rework. They are ordered by how expensive they were.

### 12.1 Resolved colour reads go stale

**Figma returns the pre-write value immediately after a binding write or a mode change.** Reading `paint.color` to confirm a bulk pass reports the previous state.

This produced **three false "0 failures" reports in one session**, including on a slide that had gone completely blank. Two regressions were reported as fixes.

> **Verify bulk changes by screenshot. Never by re-reading resolved colours.**

### 12.2 Ground detection from the frame fill is wrong

Slides 04, 07 and 16 have white frame fills entirely covered by a dark panel. Reading the frame fill classified them Light and made every one of them unreadable.

> **The ground is the largest covering surface, not the frame fill.**

And once a slide is lifted, its ground colour is itself mode-dependent — so re-deriving the mode from the rendered colour is circular and will churn. **Record the intended ground; do not re-detect it after lifting.**

### 12.3 Binding a paint destroys its opacity

A colour variable supplies alpha 1.0. Translucent white cards became opaque white boxes that hid their own white text — slides 07, 13 and 20. Capture and restore `paint.opacity` around every bind (§10), or bind to a `surface/overlay/*` token that carries the alpha itself.

### 12.4 `text/inverse` is not "white"

It means *the opposite of `text/primary` in this mode*. 168 nodes went unreadable. Use `text/on-dark` / `text/on-light` for polarity that must not follow the ground.

### 12.5 A semantic token can flatten a set

Repointing three severity legend swatches to `background/canvas` collapsed all three to one colour and destroyed the legend. **Before a global repoint, check whether the targets are meant to differ from each other.**

### 12.6 A component token serves many grounds

See §6. Fix the outlier at instance level.

### 12.7 The bridge can retarget mid-session

`figma_execute` runs against whichever file the Desktop Bridge is currently pointed at. If the user switches Figma tabs, a read silently returns another file's data — during this rebuild, one query came back with AZM X's navy and blue instead of Colab's pine and electric.

> **Pass `fileKey` on every call that matters.** Confirm `fileContext.fileName` in the response before trusting a result, and always before a write.

---

## 13. Verification

Six predicates. All six passed on 2026-08-08.

| # | Predicate | Method |
|---|---|---|
| 1 | Every primitive is hidden and scoped | script, §4 |
| 2 | No node binds directly to a primitive colour | walk bindings, assert collection ≠ `01 Primitives` |
| 3 | Every text node clears 4.5:1 against its own ground | compute, per mode |
| 4 | No text node resolves to the same colour as its parent surface | catches white-on-white |
| 5 | Every slide carries an explicit `02 Semantic` mode | `explicitVariableModes` non-empty |
| 6 | Each slide renders correctly in its assigned mode | **screenshot** — never a resolved read |

Text contrast went **168 → 0** across 2,232 nodes.

---

## 14. Known constraints

Two are structural and will not be fixed by more binding — they are properties of the palette.

**Electric fills are invisible on a Light ground.** `accent/default` on `surface/page` in Light mode is **1.34:1**. A chip, marker or numeral block filled with Electric on a white slide has no perceivable edge; only its Pine label carries it (12.73:1 against the page). Where the *shape* has to read on a light ground, give it `border/accent` (Pine, 12.73:1) or invert it to a Pine fill with Electric content.

**Cards are invisible on a Light ground.** `surface/card` and `surface/page` are both `#FFFFFF` in Light — 1.00:1 — and `border/default` at `#E5E7EB` is 1.24:1. A card on a white slide needs `border/strong` (4.78:1), `surface/sunken` behind it, or elevation. This is why the Light-ground slides in the deck use rules rather than card outlines.

**Still open:** page `02 · Design System` has not had hop 2 · ~271 legacy bindings and 47 unmapped electric tints remain on page `03 · Template Components` · slide 14's ground reads as off-palette `#9E948A` from a device mockup and needs a declared mode.

---

## 15. Where the documentation lives in the file

Page `05 . Design Tokens` carries four frames, all bound to live variables so they cannot drift from the system they describe:

| Frame | Shows |
|---|---|
| `MAP · How the tokens link` | The five collections, their counts, and the one-way chain |
| `MODES · One card, four grounds` | One card rendered four times from identical bindings |
| `USING · Which token, and when` | Every role as a live swatch, grouped Surfaces / Text / Accent & status |
| `CHAINS · Every hop, end to end` | 10 real links traced Component → Semantic → Primitive, with all four ground values and the resolved primitive named beneath each |
