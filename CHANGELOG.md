# Changelog

## 3.0.0 — 2026-07-27

Release 3. Measured against a live 32-slide build, the system gains the one thing it never had — **fixed vertical anchors** — and loses three published values the file disproved: the ×1.16 body leading, the 24px motif module, and hue-carried severity. The governing finding is that **0 of 899 text nodes in the file were bound to a text style**, and that exactly the unbound properties are the ones that drifted.

### Added
- **Vertical law** — `references/layout-archetypes.md` §0.5. Running slides: eyebrow **y120**, title **y168**, content ceiling **320** (1-line title) or **380** (2-line), floor **y940**. Statement slides: eyebrow **y470**, title **y518**. Exactly **two** legal content ceilings, not a continuum. All vertical positions and gaps on multiples of **4**; preferred gaps 24/40/80/120. Before this, title cap-lines took **10 distinct values across a 230px spread**; 25 of 32 slides now sit on two. Horizontal law is unchanged — 8×180 columns, 40 gutters, spine x100, right edge x1820
- **The 14-point per-slide pass gate** and the four deck-level gates (flip, contact sheet, squint, ground rotation) — `layout-archetypes.md` §8, with the scope carve-out that exempts component-instance internals from checks #11 and #13
- **`Caps/*` text-style family** — 24/20/16/12, UPPER, LH 1.00, **+4% tracking, +6% at 12**, Medium 500 (Bold 700 at 12). Added because all-caps labels had no legal home and were being hand-set; caps at zero tracking is amateur tell #11
- **`Body/* SemiBold` family** — 28/24/20/16 at ×1.35. **Bold body text previously had nowhere legal to bind**, which is a measured cause of the 353 off-scale nodes
- **`references/variable-architecture.md`** — new reference. The three-layer model (primitives parked on `EFFECT_COLOR` → 34 picker-visible semantics → component-level aliases), the `scopes` vs `hiddenFromPublishing` correction, the dangling-alias audit script, the alpha surface tokens with their contrast table, and the `Background/Vivid Orange` naming trap
- **The motif placement algorithm** — `layout-archetypes.md` §4.6. A 20px occupancy grid, every content node plus **40px padding** marked blocked, largest free rectangle solved by the histogram method, fill only that rectangle with density rising toward the nearest canvas edge. Guarantees zero text collision by arithmetic and adapts to any layout; solve twice for two disjoint blocks on dense slides. Ships with the working `largestFreeRect` implementation
- **The decorrelating hash requirement** — `layout-archetypes.md` §4.2, with the working `hash2` avalanche function. A linear cell-selection sequence such as `(cx*7 + cy*13) % 100` produces visible **diagonal banding** and reads as a barcode glitch, not a constellation. Verified by building it wrong first
- **EN/AR modes on the `numbers` collection** — 15 Arabic line-heights folded into the AR mode of the canonical variables, every one at exactly **×1.5** (the C-11 floor), and all **13** letter-spacing variables **pinned to 0 in AR mode**. Arabic is never tracked; it is now structurally impossible to track it
- **`SKILL.md` § "The second rule: bind, don't correct"** — the binding lesson, promoted to the entry point
- **Ten new Figma API traps** — `references/figma-workflow.md`, all hit in a live build, none of which throw

### Changed
- **Body leading ratified at ×1.35, superseding ×1.16.** Three sources disagreed in three directions: the `Typography/*` variables and `SKILL.md` said 1.16, `editorial-technique.md` §2.4 said 1.40–1.60, and the deck ran 1.20–1.36. The deck's measured **mode is 1.33** with a 1.33–1.38 cluster, so **1.35 sits on the existing centre of gravity** rather than being imposed. A 1.16 mandate had already failed — nothing in 720 nodes was set to it. Resolved values published for all seven body sizes
- **The type scale collapsed to seven slide-level sizes** — 240 hero numeral · **160** statement/divider/cover · **60** running title · 40 primary claim · 24 body · 24 eyebrow (`Caps/M`) · 20 secondary · 16 footer meta. **Eliminated:** 520 · 200 · 100 · 96 · 64 · 56 · 50 · 36 · 28 · 22 · 18 · 17 · 15 · 14 · 13 · 7.62. `Typography/*` retains the eliminated sizes for component internals — the same scope split the pass gate uses
- **Dominance floor 1.6, target 2.0**, with the **60px title + 40px claim pairing banned at 1.50**. A slide uses either a 60 title or a 40 claim as its primary, never both. Title 60 / body 24 = 2.50 ✓
- **Motif module 20px, superseding the 24px value in `decision-law.md`.** `180 ÷ 20 = 9`; `180 ÷ 24 = 7.5`, so **a 24px cell can never land on a column edge** at any phase — 96 and 120 straddle the x100 spine, 264 and 288 straddle the C1 end at 280. 24 tiles the canvas and misses the grid, which is why the deck's motif never related to its layout
- **Motif discipline tightened to statement slides only** — cover, dividers, closing, plus counted fields where each module is a datum. Content slides **0%**. The prior deck carried the field on **24 of 32** slides
- **Motif density generalised** to `p(d) = base + peak·d^γ`, base 0.02–0.04, γ 2.2–2.6. The two published instances — `0.04 + 0.66·d^2.2` and `0.04 + 0.56·d^2.2` — are settings inside this form, not competing rules
- **Motif bleeds to x1920, not x1820**, and never crosses **y940**. Dashed rules and leader lines are built from the module at **40px pitch** (20 on, 20 off) — never `dashPattern` strokes, whose dash length does not divide the column and whose phase resets at every node origin
- **Severity is ink density, not hue — now stated as a compliance requirement rather than a preference.** Pixel implementation on a 3×3 module: **Positive = ring** (8 cells, centre open) · **Major = checker** (5 cells) · **Critical = solid** (9 cells). Positive is off the ladder, not at the bottom of it — ranking by ink count would place its 8/9 above Major's 5/9, so it takes a distinct silhouette instead
- **`decision-law.md` V2 DNA clause rewritten** — spine x93→**x100**, floor y950→**y940**, right limit x1880→**x1820**, titles 100/200px→**60/160**, eyebrows 50px Light→**`Caps/M` 24 at +4%**, dither module 24→**20**
- **`SKILL.md` and `README.md`** — body line-height ×1.16→×1.35; the "letter-spacing is 0 at every size" statement replaced with the tracking prescription; the two new style families named at the entry point

### Fixed
- **`hiddenFromPublishing` does not filter the local variable picker — only `scopes` does.** The single most useful correction in this release. The file had been organised on the opposite belief, and the result was an inverted layer: all **27** semantics marked `hidden`, primitives visible. **Designers could not find a semantic token, so they bound a primitive**
- **242 unused `Tailwind Colors` variables deleted** — 55% of the collection, every one `ALL_SCOPES`, **zero bindings anywhere in the file**
- **11 of 34 semantics were broken**, aliasing dangling short names missing their namespace: `Base/White`, `Neutral/900`, `Vivid Orange/50`. The variables panel showed a live binding with a name in it while the alias resolved to nothing — it looked bound and was not, and a file-wide unbound-fills audit reported zero. **19 mode-values repaired**
- **Primitives parked on `EFFECT_COLOR`**, the one surface this system bans outright, removing them from every picker the system actually opens. **Scopes never affect existing bindings** — re-scoping 169 primitives on a live file changed nothing on the canvas
- **Variable collection after: 203 colour variables, 34 picker-visible, all semantic.** Text fill offers **15**, frame/shape fill **20**, stroke **4**. **Primitive leaks: 0** (was 246 picker-visible of 438)
- **Arabic line-heights were a duplicate namespace, not a mode.** `Typography/line-height-AR/*` — 15 variables sitting beside the canonical 15 in a single-mode collection. A duplicate namespace cannot be switched, has to be re-bound node by node, and diverges silently the moment an EN value changes. Folded into a real AR mode; **the 15 duplicates are now redundant and should be deleted**
- **`Scrim/Black` measures 1.02:1 on Deep Jade.** The scrims are built for light grounds and this system has almost none — reach for one on a dark slide, see no change, and apply a second

### Corrected
- **The opacity floor is per-ground, not per-deck.** Electric on Deep Jade: 100% = 13.07:1 · **40% = 3.15:1 (floor)** · 30% = 2.34 · 24% = 1.93 · 20% = 1.71 · 10% = 1.28. On **Pine, 40% = 2.85:1 and fails**; 50% = 3.62. The previous "≥38% on dark" rule was correct for Deep Jade and wrong for Pine, which is 3.3× lighter. **Below the floor it is decoration and must never carry data** — the audit found **73 real data units at 24%**
- **No two severity inks in the palette reach 3:1 of each other on any ground.** Best case Electric vs Vivid Orange 400 = **2.31:1**; Olive 600 vs Vivid Orange 600 = **1.07:1**. Hue therefore cannot carry severity here, and the ink-density ladder is not a stylistic preference — it is the only construction in this palette that passes WCAG 1.4.1
- **The C-05 problem was never the deck's colour.** The source deck was already **100% variable-bound for fills** (`unboundFills: 0`). It was the type: `fontFamily` bound on **94%** of nodes, `fontSize` on **44%**, `lineHeight` and `letterSpacing` on **none** — and exactly the unbound properties drifted, to **28 distinct font sizes, 10 distinct leadings and 353 off-scale nodes**, including junk values such as `7.6195859909px` from Scale-tool operations
- **The −7px offsets at x97 / x973 / x1413 in the masters are not optical corrections.** They are inherited drift and must snap to 100 / 980 / 1420. Optical correction applies to a leading glyph — `A T V W Y " 1`, −4 to −8px at 60 and −12 to −16px at 160 — not to a whole column

### Notes
- ⚠️ **EN line-heights in the `numbers` collection remain stale at ×1.16** against the ratified ×1.35. The variable layer and the style layer disagree. A style binding `lineHeight` to these variables inherits the wrong value — re-point the EN mode before binding
- Contrast ratios computed with the WCAG 2.x relative-luminance formula, not estimated
- Every anchor, count and ratio in this release was measured in a live Figma session and verified on the canvas

## 2.0.0 — 2026-07-27

Release 2. The skill graduates from a brand/system reference to a full working system: the client decision law, the componentized usability-report template, and the hard-won Figma build gotchas are now part of the skill.

### Added
- `references/decision-law.md` — the standing client decision law: C-01…C-17 distilled (the Electric/Jade ban on light grounds, the navy ban and all-green ground family, the Advanced Presentation grid scope, Phosphor for documents, variables as source of truth, the logo/shapes target models, the report-template brief) plus the deck-era standing rules — V2 DNA numbers (x93 spine, y≤950 floor, x+w≤1880, dither formula), footer-only logo, `page-num` convention, Vivid Orange text/glyph floors, the severity ink-density ladder, the n<10 counting law, tracking system, font-variable binding rules — and the client taste profile (approves/rejects)
- `references/report-template.md` — the componentized 31-slide usability-report system: page anatomy, the full component catalog with variant axes and legal instance overrides, the five approved slide patterns (Counted Field, Severity Ledger, Establishing Shot, Verdict Slide, device evidence), the device screen-clip recipe, and the reporting conventions (SUS grading, GEO MEAN, P01–P08 placeholders)

### Changed
- `references/figma-workflow.md` — added the report-template build gotchas: the `setBoundVariableForPaint` opacity trap with the exact safe pattern, the instance-override law, the section-bounds soft-delete trap, Phosphor icon anatomy and tinting recipe, `rescale()` vs `resize()` on instances, live-edit collision discipline, and idempotent repair passes
- `SKILL.md` — reference index now points at the two new documents; clarified that the report template uses Phosphor-derived `Icon / *` masters (flattened fills, bind `fill`) while legacy Brand Book placements are Hugeicons (live strokes, bind `stroke`) — both icon systems coexist in the file

## 0.2.0 — 2026-07-26

First tagged release. Bundles everything in 0.1.0, which shipped as documentation only and was never tagged.

### Added
- `assets/logo/` — all 21 logo lockups as SVG, exported from the `Colab Logo` component set: 7 lockups × 3 colours, text outlined so no font is required. Bounding box verified constant per lockup across all three colours
- `assets/shapes/` — all 40 shape primitives as SVG, exported from the `Shapes` component set: 20 shapes × `brand`/`white`
- `references/logo-and-shapes.md` — every lockup and primitive with its filename, exact size and native colouring; the two-tone `brand` vs knockout `white` distinction; RTL flip rules; and the defects still live in the Figma source
- `assets/figma-export-manifest.json` — source variant, dimensions, byte size and colour list for each of the 61 exported SVGs
- `assets/icons/stroke-rounded/` — the complete Hugeicons free set, 5,437 SVGs vendored from `@hugeicons/core-free-icons@4.2.3`. MIT, licence text at `assets/icons/LICENSE`, version pin at `assets/icons/VERSION`. Metadata stripped, `stroke="currentColor"`, ~5.5 MB
- `references/icons.md` — full icon reference: the Rounded-only and Stroke-default house rules, the 43-icon proven working set with placement counts, the colour-by-ground table, size and stroke steps on the 8px grid, RTL swap pairs, Figma binding rules
- `references/icon-index.md` + `references/icon-index/` — generated index of every vendored icon with its raw download link, sharded a–z because 5,437 rows in one file is unreadable
- `scripts/vendor-hugeicons.py` — re-vendor the icon set at a pinned version
- `scripts/rebuild-icon-index.py` — regenerate the index from `assets/icons/`

### Fixed
- **The library was misidentified as Phosphor.** An audit of every remote instance across all 8 pages of the Figma file found 1,272 Hugeicons placements and zero Phosphor. Corrected in `SKILL.md`, `references/research-notes.md`, `references/figma-workflow.md` and `README.md`
- **The colour-binding advice was inverted.** Phosphor's Figma instances are flattened fills, so the old guidance said to bind colour variables to `fill`. Hugeicons Stroke instances are live strokes — bind to `stroke`, and to `fill` only on a Solid instance. Following the old advice did nothing
- **The weight guidance did not apply.** Hugeicons has no Thin/Light/Regular/Bold axis; it has `Type` × `Style`. Replaced with the size-and-stroke table and the two variant rules
- **Three `Colour=White` shape variants exported as placeholder grey.** `Marker / Plus`, `Marker / Cross` and `Marker / Ring` were filled `#D9D9D9` — Figma's stock default — instead of white, while the other 17 White variants were correct. Corrected in the shipped SVGs; **the Figma components still carry the bug**
- **`references/components.md` claimed the Logo and Shapes rework was still pending.** Both shipped on 2026-07-26. Updated to shipped, with the two Shapes fixes that did *not* land recorded: bounding boxes are still un-normalised (36×36 → 479×267), and the colour axis shipped as `Brand`/`White` rather than three named colours

## 0.1.0 — 2026-07-26

Initial release. Derived from a full audit of the client's Figma file.

### Added
- `SKILL.md` — palette with the Electric Green contrast rule, type scale, canonical grid, motif rules, logo lockups, icon guidance, RTL rules, anti-patterns
- `references/colors.md` — full 50→950 ramps for all brand hues, background/foreground pairing matrix, verified WCAG ratios, ordinal severity mapping
- `references/figma-tokens.md` — every live variable across the five collections, both type scales with the deprecated one flagged, all four `Advanced Presentation` grid layers decoded
- `references/components.md` — target models for `Colab Logo` (7 lockups × 3 colours) and `Shapes`, the `Photo-Effect` layer stack, slide master anatomy, component inventory
- `references/layout-archetypes.md` — 14 slide archetypes with exact grid coordinates, findings-slide recipes, big-number proportions, motif composition rules, anti-patterns
- `references/research-notes.md` — icon-library specifics, bilingual EN/AR constraints, UX-research category conventions
- `references/figma-workflow.md` — safety protocol for structural edits and plugin API gotchas

### Notes
- Contrast ratios computed with the WCAG 2.x relative-luminance formula, not estimated
- Layout archetypes mark every claim as sourced or derived
- Unverified items are flagged in place rather than presented as fact
