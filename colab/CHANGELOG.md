# Changelog

## 4.0.0 — 2026-08-08

**Major.** The variable layer was rebuilt from scratch in the live file. `color 🎨`, `numbers 🔢` and `grids` are **deleted**; five collections replace them, and the deck's grounds are now **variable modes** rather than colours a designer picks. Anything bound to the old collections fails — hence the major bump.

The governing finding is one sentence, and it is the commonest way a token system rots:

> **A token whose name contains a colour is a primitive in disguise.** `background/brand/pine` and `text/brand/electric` cannot be moved by a mode, because moving them would make their names lies. **882 bindings — 11.1% of the deck — sat on tokens like these**, which is why the file had a dark mode that changed almost nothing and broke what it did change.

The test to apply: *can a mode change this token's value without making its name false?* If not, it is a primitive — move it down a tier and bind the consumer to a role.

### Added
- **`references/token-system.md`** — new reference, and the authority on anything variable-related. The five collections (`01 Primitives` 288 · `02 Semantic` 88 · `03 Component` 65 · `04 Typography` 41 · `05 Canvas` 15, plus `06 Strings`), the one-way dependency chain, and **every semantic role with its measured value and WCAG ratio in all four modes**. Extracted from the live file, not authored
- **Four grounds, as modes.** `Light` `#FFFFFF` · `Jade` `#103A21` · `Dark` `#011E14` · `Electric` `#34FF67`. A slide sets one mode and every colour on it follows. Two modes could never describe this deck: Light/Dark collapses Pine and Deep Jade into one bucket and has nowhere at all to put Electric
- **Two independent axes, stated.** `02 Semantic` carries ground; `04 Typography` and `06 Strings` carry language. They never interact — an Arabic slide on pine sets Jade on one and AR on the other. Typography and Canvas alias primitives directly, outside the colour chain, because type and geometry do not change with the ground
- **The Electric ban is now encoded, not remembered.** `text/accent` resolves to **Pine on light grounds** and Electric on dark. The rule a designer used to have to recall is a property of the token
- **Constant tokens** — `text/on-dark`, `text/on-light`, `surface/overlay/on-dark`, `surface/overlay/on-light`, `scrim/*`. Mode-aware tokens describe the *slide*; constants describe a *panel*. An element whose parent is a card or a photo must not follow the page ground
- **`surface/inverse`** — for a deliberate opposite-polarity panel, e.g. a dark card parked on a white slide
- **The alpha tier** — `surface/overlay/{subtle,soft,medium,strong}` and `decor/wash/*`, because binding a paint to a solid colour variable **destroys its opacity**
- **Ordinal vocabularies** — `severity/{critical,major,minor,positive,visual}` and `impact/{high,medium,low}`, each aliasing a `status/*` family so the mapping is stated once. **`indicator` is constant across Light, Jade and Dark**: an ordinal scale that changes hue with the ground destroys skim-by-colour and makes two slides incomparable
- **`05 Canvas`** — grid and slide geometry as variables, so a layout script reads the grid instead of hard-coding it
- **§12, the seven traps**, each of which cost real rework — ordered by what they cost

### Changed
- **`SKILL.md`** — the ground rule now reads *four grounds, set as modes*, with the measured deck distribution (Jade 39 · Dark 25 · Light 17 · Electric 2 across 83 slides). Pointer paragraph leads with `token-system.md`. Arabic leading is delivered by `04 Typography`, not the retired `numbers` collection, and **sizes are now stated as identical in EN and AR — only leading and tracking move**
- **Three anti-pattern rows added** — the colour-named token, reading back a resolved colour, and the four-ground rotation
- **`references/colors.md` §5** — the `Semantics/*` table is retired and rewritten as a **migration map** to the new roles. It carries the trap explicitly: `Text/OnColor` maps to `text/on-dark`, **not** `text/inverse`
- **`references/variable-architecture.md`** — scoped down to picker mechanics, which remain correct; its collection layout is marked superseded
- **`references/layout-archetypes.md`** anti-pattern 10 and **`README.md`** routing rows updated

### Deprecated
- **`references/figma-tokens.md`** — banner-marked ⛔ superseded. Every collection it documents has been deleted. Kept only for reading a file that predates the rebuild, or tracing where an old binding used to point. `strings 📝` survives as `06 Strings` with its original collection ID, so bindings to it were never broken

### Fixed — in the live file
- **Text contrast 168 → 0 failures across 2,232 nodes.** Every text role now clears **AA body on its own ground in all four modes**; the worst case in the system is `text/muted` on Light at 4.78:1
- **~25,000 hop-1 bindings and ~15,000 hop-2 lifts** across `03 · Template Components`, EN and AR
- **All 83 slides carry an explicit mode**
- **1,920 translucent paints preserved** through binding in the Arabic deck
- **517 font sizes repaired** — they had been bound to `size/space/*` instead of `size/font/*`, because both families contain 16, 20, 24 and 40. Matching a font size *by value* picks the wrong family half the time; select by property

### Notes — two constraints that binding cannot fix
- **Electric fills are invisible on a light ground.** `accent/default` on `surface/page` in Light is **1.34:1**. A chip or marker filled with Electric on a white slide has no perceivable edge — only its Pine label carries it. Where the shape must read, use `border/accent` or invert to a Pine fill
- **Cards are invisible on a light ground.** `surface/card` and `surface/page` are both `#FFFFFF` in Light (1.00:1) and `border/default` is 1.24:1. A card on white needs `border/strong` (4.78:1), `surface/sunken` behind it, or elevation. This is why the light-ground slides use rules rather than card outlines
- **`text/disabled` is below 3:1 in every mode. Deliberate** — disabled means unreadable. Nothing in a report deck should carry it
- **Verify by screenshot, never by re-reading resolved colours.** Figma returns the pre-write value immediately after a binding write or a mode change. This produced three false "0 failures" reports in one session, two of them on regressions, one on a slide that had gone blank
- **Pass `fileKey` on every `figma_execute` that matters.** The Desktop Bridge follows whichever file is active; during this rebuild one read silently returned AZM X's navy and blue instead of Colab's pine and electric
- **Still open, and recorded in §14:** page `02 · Design System` has not had hop 2 · ~271 legacy bindings and 47 unmapped electric tints remain on page `03 · Template Components` · slide 14's ground reads as off-palette `#9E948A` from a device mockup

## 3.2.1 — 2026-07-28

Patch. One measured correction, found while auditing the project's working documents against the skill.

### Corrected
- **T-03's characters-per-measure figures were ~20% optimistic.** `editorial-technique.md` published `400 → ~50 char · 620 → ~66 · 840 → ~76`. Measured by binary-searching Inter Regular against each measure in a live file, the real capacities are **40 / 54 / 62**. A paragraph written to the old figures overflows its measure. Now published as a table with two extra pairs (540 → Body 16 = 69, 840 → Body 24 = 71), marked `[M]`, with the tracking caveat stated

### Notes
- Also verified this release: slide 26's **counted field carries 73 squares at Electric @24% = 1.93:1**, below the 3:1 non-text floor, in both the EN and AR decks. `report-template.md` already states the 40% floor, so the skill was right and the artefact was wrong — the AR deck has been corrected to 40% (3.15:1). The EN deck is under a no-touch constraint and is flagged for the client

## 3.2.0 — 2026-07-27

Release 3.2. Adds the **slide library** — 36 measured, reviewed layouts with their exact geometry, motif spec and ground — and folds in what a slide-by-slide review of the Arabic deck taught. The governing finding is that a mirrored motif fails in **four distinct ways**, only one of which is visible without measuring, and that the naive fix for the commonest one destroys the band's proportions.

### Added
- **`references/slide-library.md`** — new reference, and the largest addition since the icon set. All 36 `Report Template` slides catalogued by job (openers, contents, framing, KPI, tables, findings, device evidence, statement) with `[x,y,w,h]` for every element, the motif spec including its measured **fill**, the ground, and the AR derivation notes per slide. Extracted from the live file, not authored
- **The motif distribution across a real deck** — 31 of 36 slides carry a field, **5 carry none**, 6 are full-height, fill spans 0.11–0.39 with median 0.19. Absence is part of the composition; a rebuild that fields every slide is wrong at the composition level regardless of its density curve
- **Ground rotation, measured** — Pine ×19, Deep Jade ×9, White ×6, Electric ×2, never more than four consecutive slides on one ground, with the per-ground motif ink and opacity floor beside it
- **`rtl-arabic.md` §8.3.1 — clip width, never height.** When the Arabic title is wider than the English, it intrudes on the field's box; the naive clip resolves that by losing height. Five slides lost 45–67% of their band that way (08, 10, 13, 16, 22). Give up width at the sparse end, where the faintest cells are
- **`rtl-arabic.md` §8.3.2 — the four failure modes of a rebuilt field**: over-dense, height-clipped, wrong-anchor, missing. With the match-by-nearest-mirror caveat: matching AR fields to EN by array index reports false mismatches on any slide with two fields
- **`rtl-arabic.md` §8.3.3 — snap to the module after placement**, covering both EN's own off-module positions (`y150 / y350 / y673`) and auto-layout placement (a field parented into a row lands at `x923`, not 920)
- **`rtl-arabic.md` §9.1 — the master is shared; check before you edit it.** The reflex to fix a wrong instance at its master is dangerous when the frozen side instantiates it too. The severity legend resolved to a master with **6 EN consumers**; reversing it for RTL would have reversed the English deck. Ships the consumer-count probe
- **R-09 … R-13** — kashida is a client preference and stays · ratio numerals reverse so the value reads first · a unit glyph attached to a display numeral sets smaller than the digits · an English gloss of an Arabic quote is dropped rather than translated · progress fills anchor right with the notch at the far end. Plus §12.1, the sweeps for the last two, both invisible in a thumbnail

### Changed
- **`SKILL.md` and `README.md`** — pointer and routing row for the slide library; "reach for a layout before inventing a composition" is now the stated default
- **`rtl-arabic.md` §12** extended from 8 recorded decisions to 13

### Fixed
- **The AR deck itself**, across a full slide-by-slide pass: 4 field anchors wrong (15, 17, 21, 27/27d), 5 height-clipped (08, 10, 13, 16, 22), 2 missing (14, 24), 25 over-dense, 1 wrong shape (17 — an 80×600 uniform divider strip rebuilt as a 1480×340 band), the severity legend un-reversed on 6 slides, the progress bar filling leftward on 12, and 415 motif cells below the 3:1 contrast floor. Final state passes all twelve predicates with the EN section byte-identical

### Notes
- **Two flags in this pass were wrong on inspection and are recorded as such** — 25a's descending staircase is deliberate (EN steps numerals 100→980 with every rule ending at 1820), and a field sitting behind a device panel is what EN does. Both are now documented in the library so they are not "fixed" later
- The library documents **EN quirks not to inherit** — tables overflowing their own margin by 14, off-module motif y-positions, and slide 03 labelling both `08` and `24` as "Participants". Mirroring faithfully propagates a violation; the table says which ones to drop

## 3.1.0 — 2026-07-27

Release 3.1. The skill gains a full **Arabic/RTL build system**, measured against a complete 36-slide `Report Template - AR` built from the English original in a live Figma session. The governing finding is that **RTL is not right-alignment**: it is a coordinate transform on x, a reversal of every auto-layout reading order, and a *re-fitted* vertical rhythm — and only the first of those three is a mirror. The second governing finding is that the motif must be **re-solved against Arabic content, never mirrored**, and solved **last**.

### Added
- **`references/rtl-arabic.md`** — new reference, the whole build system. The mirror invariant `x' = W − x − w` and its three failure modes; the two write laws; the probed instance-override table; the three auto-layout blockers; Arabic typography including the ×1.5 collision floor; the bidi and glyph traps; motif re-solving; AR component practice; a 12-predicate verification set; execution mechanics; 8 recorded decisions (R-01…R-08); and a 10-row anti-pattern table
- **The instance-override law, probed rather than assumed** — `characters`, `fills`, `textAlignHorizontal`, `textAutoResize`, `resize()`, `fontName`/`fontSize`/`lineHeight`/`letterSpacing` are overridable; **`x`/`y`, `constraints` and child order are not**. The corollary is the whole RTL job: *every mirror is a master-level fix*, because mirroring is positional and positional properties have no override path
- **The three auto-layout blockers** — `layout-archetypes.md` §5, `figma-workflow.md`, `rtl-arabic.md` §4. Figma has **no RTL auto-layout**. VERTICAL stacks need `counterAxisAlignItems: MAX`; HORIZONTAL stacks need their **child order reversed**, at *every* nesting level; and `constraints` apply **on resize only**, so a master fix does not retro-fit live instances until they are nudged
- **The bidi trap set** — the **en dash is bidi class ON and inverts numeric ranges**: `25–34` renders as `34–25`. ASCII hyphen only. Plus `→`→`←`, `“`→`»`, and the Inter-pinned inline numeral run with its regex
- **The translation-completeness inversion** — `/[A-Za-z]{3,}/` is **not** a completeness test. It reported zero while **68 nodes** were still English, because it misses every short token (`A vs. B`, `NO`, `2m 10s`, `12h`, `WEB`, `APP`). The correct test is inverted: flag any node with **no Arabic character** that is not pure numerals and not an allow-listed acronym
- **Nine new Figma API traps** — `references/figma-workflow.md`, all hit in the AR build: the instance `set_x` throw that aborts a batch mid-pass, the constraint-on-resize delay, `swapComponent()` discarding text overrides, the two auto-layout blockers, `absoluteBoundingBox` on TEXT being the layout box, auto-layout re-centring on child removal, font-preload timeouts, and generative-pass batching
- **`layout-archetypes.md` §4.3.1** — the measured EN field family and the `base = 0` requirement for edge-anchored bands

### Changed
- **`layout-archetypes.md` §5 rewritten** from 7 advisory rules to 9 operational ones, with the coordinate transform, the vertical re-fit, the auto-layout laws and the motif ordering stated explicitly. It now points at `rtl-arabic.md` as governing
- **`SKILL.md` § Arabic/RTL rewritten** — 6 rules to 10, led by "RTL is not right-alignment"
- **Motif ordering is now explicit: solve it LAST.** The occupancy grid is a function of *final* content geometry, so solving before translation and alignment guarantees solving again. This build re-solved three times before the ordering was made a rule
- **`README.md`** — the file tree was three references out of date (`decision-law.md`, `report-template.md`, `variable-architecture.md` were all missing); added those plus `rtl-arabic.md`, and a routing row for Arabic/RTL knowledge

### Fixed
- **`SKILL.md`'s reference index contained a garbled sentence** — the v3.0.0 `variable-architecture.md` pointer had been spliced into the middle of the `figma-workflow.md` sentence, leaving `rea…d references/figma-workflow.md` wrapped around it. Both pointers now read as sentences
- **Two stale ×1.16 references in Arabic contexts** — `figma-tokens.md` and `research-notes.md` still compared the Arabic floor against the superseded EN body leading. Both now compare against the ratified ×1.35 and state that ×1.5 is a collision constraint

### Corrected
- **`base > 0` destroys the dissolve on an edge-anchored band.** The §4.3 floor of 0.02–0.04 is correct for a field whose sparse end is *interior*, and wrong for a band that must fade out against text: the floor scatters isolated cells to the content edge, so the field terminates in a visible straight line instead of dissolving. Measured against the Report Template's own 31 fields, which fit **`p(u) = 0.70·u²` with no floor**, `u = 0` at the content edge. Built both ways on the same slide to confirm
- **The EN motif is mostly shallow top bands, not full-height columns.** Measured across 31 fields: only **6 are full-height**, **5 slides carry no field at all**, the vertical distribution is **flat** (no y gradient), and median slide coverage is **0.027**. A rebuild that puts a full-height field on every slide is wrong at the composition level regardless of its density curve. Absence is part of the composition
- **Arabic is ~10% narrower than Latin, not smaller `[✗]`.** A mid-build claim that Arabic renders ~0.70× optically smaller and needed a size step-up was a **stale-layout artifact**. Control test on fresh nodes at 60px/150%: Inter **h90**, Alexandria **h90** — identical. **No optical size step-up.** Recorded as disproved so it is not re-derived
- **The real Arabic vertical problem is display leading, not mirroring.** EN display runs ×0.90 and the Arabic floor is ×1.5, so a 160px stat's line box goes 144px → **240px** and any display block is ~**1.67× taller** in Arabic. Vertical rhythm must be **re-fitted, not mirrored**, and the type must not be shrunk to recover the space — 1.5 is a collision constraint. Measured: stat labels landed 96px lower and collided with the caption; a 6-row list grew 656px → 854px and no longer fit between eyebrow and footer
- **Counted fields must be mirrored one level deeper.** Mirroring only the field frame leaves its internal arrangement LTR, so the ragged edge and the hero numeral both end up on the same side and collide. Mirror the **modules inside** the field. Counted fields are also never re-solved or re-densified — they are the dataset. Detection, cheapest first: **colour cardinality ≥ 2 ⇒ counted**, since §4 mandates one colour per decorative field
- **A collision audit built on text `absoluteBoundingBox` reports ~3× false positives.** It is the layout box, not the ink: a right-aligned 1720-wide title reports `width === 1720` while its glyphs occupy the right ~400px. **57 reported overlaps on this deck, 26 real.** Measure ink by cloning, setting `WIDTH_AND_HEIGHT`, reading `width`, and removing the clone
- **The footer keep-out silently clips a 47-row occupancy grid.** The footer instance at y960 plus 40px padding blocks row 46, so **no column is ever free full-height** and every full-height solve falls through to the fallback. Stop the grid above the footer

### Notes
- **Fix the master, not the slides.** Repairing the AR footer component cleared the same defect on **30 slides** in one write; re-pinning one card master's constraints fixed **10 cards**. A defect with identical geometry across many slides is a component defect
- Verify **which** master a deck instantiates before building its AR sibling — this deck used `Footer Bar` (1840×73), not `Footer Bar / Canonical` (1720×56), and the wrong sibling was built first
- The **EN section was verified byte-identical on every one of ~30 passes** via a `name|childCount|WxH` fingerprint. The tripwire is cheap and is the only thing that catches a write into the wrong section early
- Every number in this release was measured in a live Figma session and verified on the canvas

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
