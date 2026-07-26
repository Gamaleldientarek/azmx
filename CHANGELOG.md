# Changelog

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
