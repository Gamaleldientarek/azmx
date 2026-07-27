# Colab — Arabic / RTL build system

Everything here was measured while building the 36-slide `Report Template - AR` from the English original in a live Figma session (2026-07-27). Nothing is estimated. Where a belief was held and then disproved, both are recorded — the disproved one is marked ✗ so it does not get re-derived.

`[M]` measured · `[D]` derived · `[✗]` disproved, kept as a warning

---

## 0. The one-line summary

**RTL is not right-alignment. It is a coordinate transform on x, a reversal of every auto-layout reading order, and a different vertical rhythm — and only the first of those three is a mirror.**

The amateur tell is an Arabic slide built on an unmirrored LTR grid with `textAlignHorizontal = RIGHT` applied. That flips the glyphs and nothing else: the numbers still sit left of their labels, the phone still sits left of its caption, and the accent bar still hugs the wrong edge.

---

## 1. The mirror invariant

```
x' = W − x − w          (W = 1920)
```

The `Advanced Presentation` grid is symmetric about **x960**, so legal column edges map to legal column edges under this transform. C1↔C8, C2↔C7, C3↔C6, C4↔C5. Starts `100·320·540·760·980·1200·1420·1640` map exactly onto ends `1820·1600·1380·1160·940·720·500·280`.

Three consequences that are easy to get wrong:

1. **Vertical does not mirror.** `y` anchors are identical EN↔AR. Eyebrow y120, title y168, ceilings 320/380, floor y940, statement eyebrow y470 / title y518 — all unchanged. Mirroring y is never correct.
2. **For auto-width text, preserve the right edge, not the left origin.** The Arabic string has a different width, so mirroring its recorded `x` is wrong. Use `right_AR = W − x_EN`, therefore `x_AR = W − x_EN − w_AR`.
3. **The transform applies recursively.** Mirroring a container is not the same as mirroring its contents. See §8 on counted fields, where mirroring only the frame put the numeral and the dense rows on the same side.

### 1.1 Verifying a mirror

Record the invariant in each AR component's description so it can be re-checked later without the EN file open:

```
x_AR + w_AR == 1920 − x_EN
```

---

## 2. The two write laws

### Law W — delta writes only

```js
n.x += (targetRight − currentRight);      // ✅ works at any depth
n.x  =  targetRight − n.width;            // ❌ wrong whenever n is not a direct child
```

`x` is parent-relative. In a cloned tree the parent chain differs from the one you measured against, so an absolute assignment lands somewhere else. A delta computed from `absoluteTransform` is correct at every depth.

Read positions from `absoluteTransform[0][2]` and sizes from `.width`. Do **not** mix in `absoluteBoundingBox` for text — see §11.3.

### Law V — a write not read back did not happen

Every positional write in this build had at least one silent-failure mode: auto-layout overriding it, instance protection rejecting it, or a constraint re-applying on the next resize. Assert by re-reading in the same execution. A function that returns "success" without re-reading is reporting that it did not throw, which is a different claim.

### The EN freeze tripwire

The source section must be provably untouched. Fingerprint it before and after **every** pass:

```js
const fp = s => `${s.name}|${s.children.length}|${Math.round(s.width)}x${Math.round(s.height)}`;
```

Cheap enough to run on all ~30 passes, and it is the only thing that catches an accidental write into the wrong section early.

---

## 3. What an instance actually lets you override `[M]`

Probed directly, not inferred from documentation:

| Property | Overridable on an instance |
|---|---|
| text `characters` | ✅ |
| `fills` | ✅ |
| `textAlignHorizontal` | ✅ |
| `textAutoResize` | ✅ |
| `resize()` | ✅ |
| `fontName` / `fontSize` / `lineHeight` / `letterSpacing` | ✅ |
| **`x` / `y`** | ❌ throws `cannot be overridden in an instance` |
| **`constraints`** | ❌ |
| **child order** | ❌ |
| `swapComponent()` | ✅ — **but it discards text overrides** |

**The corollary is the whole job:** anything positional is a master-level fix. In LTR work that is a rare inconvenience. In RTL it is most of the work, because mirroring *is* positional.

Two practical notes:

- **Guard every `x` write.** A single unguarded write inside an instance aborts the whole batch — and because it aborts mid-pass, some nodes are left half-migrated. Wrap in `try/catch` and detect instance ancestry up front.
- **Re-apply text after `swapComponent()`.** Swapping a chip to its AR sibling silently reverted its label to the master default (`Category`). The swap succeeds, the text is wrong, and nothing warns you.

---

## 4. Auto-layout is the RTL blocker

Figma has **no RTL auto-layout**. There is no property that reverses a horizontal stack. Three distinct failures, all of which look like "the mirror didn't work":

### 4.1 VERTICAL layout — `counterAxisAlignItems`

`MIN` = left-align, and it wins over any `x` you write to a child. Must be **`MAX`** for RTL.

Symptom: a write reports success and reads back unchanged. This cost a full debugging cycle before the cause was found — the write was legal, applied, and then overridden by layout on the same frame.

### 4.2 HORIZONTAL layout — child order *is* reading order

The only way to reverse a horizontal stack is to reverse its children.

```js
const kids = [...frame.children];
for (let i = kids.length - 1; i >= 0; i--) frame.appendChild(kids[i]);
```

Every one of these was a real defect in this build:

| Slide | Symptom | What was reversed |
|---|---|---|
| Contents | `01` sat ~1200px from its own label, rule under empty space | agenda row `[number, label]` |
| Study Overview | stat row read `24 · 06 · 18 · 12` left-to-right | KPI row `[col, rule, col, rule, …]` |
| Screen Comparison | Version A on the left; each phone left of its text | outer group row **and** each `[phone, panel]` pair |
| Overall Feedback | check-icon left of its recommendation text | `[icon, body]` |

Note the nesting on Screen Comparison: **both** levels needed reversing. Reversing only the outer row moves the groups but leaves each group internally LTR.

### 4.3 Constraints + resize — the delayed failure

A master authored at width `W0` whose children carry `constraints.horizontal = MIN` pushes **all slack to the right** when an instance is widened. In LTR that slack lands in the margin and nobody notices. In RTL the right edge is the visible edge, so it lands on top of the design.

Measured: `AR / Finding Card` is 800 wide with children pinned MIN; the deck resizes instances to 840; the accent marker ended up **40px inside** the card edge on all 10 cards.

Fix at the master: `constraints.horizontal = 'MAX'`. Two gotchas:

- Constraints are **not overridable on an instance** (§3) — the master is the only place.
- Constraints apply **on resize only**. Existing instances keep their stale geometry until nudged:

```js
inst.resize(W0, h); inst.resize(w, h);        // forces constraint re-application
```

### 4.4 Diagnostic

If a node will not move, check in this order: **instance? → auto-laid parent? → constraint pending a resize?** All three present as "the write did nothing."

---

## 5. Arabic typography

**Alexandria**, 9 weights. Map Inter → Alexandria by weight name — note the space differences: `Semi Bold`→`SemiBold`, `Extra Bold`→`ExtraBold`, `Extra Light`→`ExtraLight`.

| Rule | Value |
|---|---|
| Leading — **collision floor** | **×1.5** at every size `[M]` |
| Leading — multi-line reading | ×1.75 |
| Tracking | **0, always** |
| Numerals | Western digits, **Inter**, LTR runs (§6) |

**×1.5 is a floor, not a preference.** The MSA ink envelope measures **1.505em** — below ×1.5 ascenders and descenders of adjacent lines physically intersect. It is a collision constraint, which is why it cannot be traded away for vertical fit.

### 5.1 Arabic is narrower, not smaller `[✗]`

A mid-build claim that Arabic "renders ~0.70× optically smaller" and needed a size step-up was **wrong**. It was a **stale-layout artifact** — measuring nodes whose layout had not been recomputed.

Control test on fresh nodes at 60px / 150%: **Inter h90, Alexandria h90.** Identical. Arabic is roughly **10% narrower** per character, not smaller. **Do not apply an optical size step-up.** If a measurement suggests otherwise, build a fresh control node before acting on it.

### 5.2 Display leading is the real vertical problem `[M]`

This is the single biggest source of Arabic layout breakage, and it is *not* a mirroring issue:

| | EN | AR |
|---|---|---|
| Display leading | **×0.90** (ratified) | **×1.5** (floor) |
| 160px stat, line box | 144px | **240px** |

**Any display or stat block is ~1.67× taller in Arabic.** Vertical rhythm must be **re-fitted, not mirrored**.

Measured consequence: on Study Overview the stat values grew 96px, pushing their labels from y796 to y892 and straight onto the caption at y896. The fix is to re-space the block, not to shrink the type — the ×1.5 floor forbids shrinking.

The same arithmetic hit the Contents list: 6 rows at 90px (Arabic) vs 57px (English) turned a 656px block into 854px, which no longer fits between the eyebrow and the footer. Resolved by tightening the item gap 28→16, not by touching the type.

### 5.3 Line-count regressions

Text that sets on one line in English can wrap in Arabic, and a wrapped node pushes everything below it. Detect and repair as a class:

```js
if (lines(en) === 1 && lines(ar) > 1) {
  ar.textAutoResize = 'WIDTH_AND_HEIGHT';   // stop wrapping
  ar.x += targetRight − (arX + ar.width);   // re-pin the right edge
}
```

Where `lines(t) ≈ round(t.height / (fontSize × lineHeightRatio))`.

Caught two real cases: a `12h`→`12س` hour stat that wrapped to 3 lines and pushed its label off-canvas, and a cover title that wrapped to 2 lines and ran over the meta row and the footer.

---

## 6. Bidi and glyph traps

| Trap | Rule |
|---|---|
| **En dash `–` in numeric ranges** | It is **bidi class ON** and inverts the range: `25–34` renders as **`34–25`**. Use an **ASCII hyphen** only. Applies to `P01-P08`, `Area 01-04`, `5.3 - 5.5` |
| Arrow `→` | Becomes **`←`** |
| Opening quote `“` | Becomes **`»`** |
| Metric acronyms | Keep Latin: `SEQ`, `SUS`, `n = 8` |

### 6.1 Numerals stay Inter, as LTR runs

Do not put digits in their own nodes when they sit inside a sentence — pin the run instead:

```js
const re = /[A-Za-z0-9][A-Za-z0-9._%\/+×≥=-]*/g;
let m; while ((m = re.exec(s)) !== null)
  t.setRangeFontName(m.index, m.index + m[0].length, { family: 'Inter', style: interWeight });
```

The leading `[A-Za-z0-9]` anchor is deliberate: it catches `P01-P08`, `86.21%`, `≥90%` and `5.3` as single runs rather than splitting them at punctuation.

### 6.2 Time units

| EN | AR |
|---|---|
| `2m 10s` | `2د 10ث` |
| `48s` | `48ث` |
| `12h` | `12س` |

Unit letter in Alexandria, digits in Inter. Note `12س` is materially wider than `12h` — it triggered §5.3.

---

## 7. The translation-completeness trap

**`/[A-Za-z]{3,}/` is not a completeness test.** It reports zero while 68 nodes are still English, because it misses every short token:

`A vs. B` · `NO` · `2m 10s` · `48s` · `12h` · `WEB` · `APP`

Run a second, inverted pass:

> Flag any text node that contains **no Arabic character** and is not pure numerals/punctuation and is not an allow-listed acronym.

```js
const hasArabic = /[؀-ۿ]/.test(s);
const isNumeric = /^[\s0-9.,:%\/×≥=+\-–—·|()\[\]]*$/.test(s);
const allowed   = /^(colab|COLAB|AZMX|SEQ|SUS|UX|P\d{2})$/i.test(s);
if (!hasArabic && !isNumeric && !allowed) flag(s);
```

---

## 8. Motif in RTL — re-solve, never mirror

**Mirroring EN field boxes puts decoration on Arabic content.** Arabic text extents differ, so a box that cleared the English text does not clear the Arabic. This was the original defect on 8 slides.

### 8.1 The EN field family, measured `[M]`

31 fields across the Report Template:

| Property | Measured |
|---|---|
| Dominant shape | **shallow top band anchored to the outer canvas edge**, h 200–360 |
| Full-height fields | **6 of 31** — covers, dividers, headline only |
| Slides with **no** field | **5 of 31** — absence is part of the composition |
| Vertical distribution | **flat** — no y gradient |
| Horizontal ramp | rises toward the **canvas** edge, dissolves to nothing at the content edge |
| Median slide coverage | **0.027** |

Fitted curve: **`p(u) = 0.70 · u²`**, where `u = 0` at the content edge and `u = 1` at the canvas edge. Peak ≈ 0.70, mean ≈ 0.19 — matching the measured peak-to-mean ratio of ~4.

### 8.2 The base floor is what kills the dissolve

`§4.3`'s general form is `p(d) = base + peak·d^γ` with `base` 0.02–0.04. **For an edge-anchored band, `base` must be 0.**

A non-zero floor scatters isolated cells all the way to the content edge, so the field terminates in a visible straight line instead of dissolving. Built both ways: the floored version reads as a hard-edged slab, the floorless one reads as the EN deck does. Use `base > 0` only for fields whose sparse end is interior and wants a faint texture; never for a band that must fade out against text.

### 8.3 Construction order for RTL

1. **Mirror the EN box** (`x' = 1920 − x − w`) — this preserves the composition
2. **Clip against the *Arabic* occupancy grid**: trim rows from the far side, then retreat the inner edge until every cell is clear
3. **Fall back** to largest-free-rectangle (§4.6) with the same ramp if clipping leaves < 4 cols or < 3 rows
4. Density rises toward the **left** canvas edge in RTL — but **derive this from geometry**, not from reading direction. The solver already picks the nearest canvas edge; there is no direction parameter to pass

### 8.4 Motif is the last step, not the first

The occupancy grid is a function of **final** content geometry. Solving before alignment and translation guarantees solving again — this build re-solved three times before the ordering was made explicit. Sequence: **translate → align → re-fit vertical → solve motif**.

### 8.5 The footer keep-out clips the grid

The footer instance sits at y960. With 40px padding it blocks grid **row 46**. If the occupancy grid runs `ROWS = 47`, **no column is ever free full-height**, so every full-height solve silently falls through to the fallback and you get bands where you expected columns. Stop the grid above the footer.

### 8.6 Counted fields are data, never decoration

A counted field's modules **are** the dataset — one square per insight. Never re-solve, never re-density, never delete.

**Detection**, cheapest first: **colour cardinality ≥ 2** ⇒ counted, because §4 mandates one colour per decorative field. Then component identity, then legend reconciliation.

**Mirror the squares inside the field, not just the frame.** Mirroring only the frame moved the field but left its internal arrangement LTR — so the ragged edge and the big numeral both ended up on the right and collided. The fix is the same transform one level deeper:

```js
for (const sq of field.children) {
  const lx = sq.absoluteTransform[0][2] − fieldOrigin;
  sq.x += (field.width − lx − sq.width) − lx;
}
```

---

## 9. Components

- Build **AR sibling components** rather than overriding instances — positional properties are not overridable (§3), so there is no override path for a mirror.
- Record `x_AR + w_AR == 1920 − x_EN` in each component description.
- **Verify which master the deck actually instantiates.** This deck used `Footer Bar` (1840×73), not `Footer Bar / Canonical` (1720×56). An AR sibling was built for the wrong one first, and the two later needed fixing separately — the canonical variant surfaced only as a single leftover defect on one slide.
- **A master fix propagates everywhere at once.** Repairing the AR footer cleared the same defect on **30 slides** in one write. When a defect appears on many slides with identical geometry, stop fixing slides.

---

## 10. Verification — the predicate set

Run all of these as one function over the section. Every one is machine-testable; none require judgement.

| # | Predicate | Pass |
|---|---|---|
| 1 | motif cells overlapping any text ink box | 0 |
| 2 | motif cells below y940 / in the footer band | 0 |
| 3 | motif cells off the 20px grid | 0 |
| 4 | motif cells off-palette (not Electric / Pine) | 0 |
| 5 | text ink outside the 1920×1080 frame | 0 |
| 6 | text-on-text ink overlaps | 0 |
| 7 | Arabic text nodes not `RIGHT` aligned | 0 |
| 8 | Arabic glyphs not in Alexandria | 0 |
| 9 | digits not in Inter | 0 |
| 10 | untranslated Latin (by the §7 inverted test) | 0 |
| 11 | non-zero tracking on Arabic | 0 |
| 12 | EN section fingerprint | unchanged |

Predicate 6 must use **ink** extents, not layout boxes — see §11.3, or it reports ~3× false positives.

---

## 11. Execution mechanics

### 11.1 Batch against the timeout

`figma_execute` caps at ~30s. Generating motif for 36 slides in one call times out and leaves the section half-built. Batch **6–12 slides per call** and define the reusable solver once on `globalThis` so batches share it.

Globals survive a plugin reconnect — check before re-seeding:

```js
return { hasSolver: typeof globalThis.__dither === 'function' };
```

### 11.2 Load fonts lazily

Preloading 18 font styles up front times out on its own. Load on demand with a `Set` cache keyed `family|style`.

### 11.3 `absoluteBoundingBox` on TEXT is the layout box, not the ink

Verified: for a right-aligned 1720-wide title, `absoluteBoundingBox.width === node.width === 1720`, while the glyphs occupy only the right ~400px. A naive overlap audit therefore reports every full-width right-aligned title as colliding with everything on the left half of the slide — **57 reported overlaps, 26 real**.

To get ink extents:

```js
if (t.textAutoResize === 'WIDTH_AND_HEIGHT') return box;          // box is ink
if (lines > 1) return box;                                        // wrapped text fills its box
const c = t.clone(); c.textAutoResize = 'WIDTH_AND_HEIGHT';
const w = c.width; c.remove();                                    // measured ink width
const x = right ? box.x + box.width − w : box.x;
```

### 11.4 Keep tree dumps small

Exclude `px` children when dumping a slide tree. A single divider slide carries 600+ modules and the dump drowns the signal.

---

## 12. Decisions taken in this build

Recorded so they are not re-litigated:

| # | Decision |
|---|---|
| R-01 | Time units are `د` / `ث` / `س`, digits in Inter |
| R-02 | ASCII hyphen in all numeric ranges — never en dash |
| R-03 | `SEQ` / `SUS` stay Latin as international metric names |
| R-04 | Numerals are Inter, inline, as LTR runs — not separate nodes |
| R-05 | No optical size step-up for Arabic (§5.1) |
| R-06 | Quadrant/direction references in copy are reworded to be direction-free rather than mirrored, so the sentence survives either layout |
| R-07 | Counted fields keep their EN colour semantics; only geometry mirrors |
| R-08 | Where an EN master overflows its own margin, the AR mirror is clamped to the margin rather than inheriting the overflow |

---

## 13. Anti-patterns

| Don't | Why |
|---|---|
| Apply `textAlignHorizontal = RIGHT` and call it RTL | Flips glyphs, nothing else. §0 |
| Mirror `y` | Vertical never mirrors. §1 |
| Mirror the motif field | Arabic extents differ; decoration lands on text. §8 |
| Mirror a counted field's frame only | Numeral and dense rows collide. §8.6 |
| Solve the motif before translating | Content geometry is not final. §8.4 |
| Shrink Arabic type to recover vertical fit | ×1.5 is a collision floor. §5 |
| Trust a positional write without re-reading | Three separate silent-failure modes. §2, §4 |
| Fix a repeated defect slide by slide | It is a master. §9 |
| Use `/[A-Za-z]{3,}/` as a translation check | Misses every short token. §7 |
| Audit overlaps on text layout boxes | ~3× false positives. §11.3 |
