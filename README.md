# colab-design

The Colab design system as an Agent Skill for [Claude Code](https://claude.com/claude-code).

Colab is a bilingual English/Arabic **User Experience Research Lab** operating in Saudi Arabia and the wider MENA region. This skill encodes its visual system — palette, typography, grid, graphic language, component specs, and Arabic/RTL rules — so any deliverable comes out on-brand without re-briefing.

---

## Install

```bash
git clone https://github.com/Gamaleldientarek/colab-design-skill.git ~/.claude/skills/colab-design
```

Claude Code discovers it automatically. Invoke with `/colab-design`, or just mention Colab, Electric Green, the pixel motif, or the Advanced Presentation grid and it activates on its own.

---

## What's inside

```
SKILL.md                          Entry point — the rules you need on every job
references/
  colors.md                       Full ramps, the pairing matrix, verified contrast ratios
  figma-tokens.md                 Every live Figma variable, exact
  components.md                   Logo, Shapes, Photo-Effect, slide masters, inventory
  logo-and-shapes.md              Every lockup and shape primitive — files, sizes, usage rules
  layout-archetypes.md            14 slide recipes with grid coordinates
  icons.md                        Hugeicons house rules, the 43-icon working set, colour + RTL
  icon-index.md                   Every vendored icon with its download link (sharded a–z)
  research-notes.md               Hugeicons, bilingual EN/AR, category conventions
  figma-workflow.md               Working in Figma — safety protocol, plugin API gotchas
  editorial-technique.md          20 named techniques, tracking/leading numbers, 10 archetypes
assets/
  logo/                           21 logo SVGs — 7 lockups × 3 colours
  shapes/                         40 shape SVGs — 20 primitives × brand/white
  icons/stroke-rounded/           5,437 Hugeicons SVGs, MIT
  figma-export-manifest.json      Source variant, size and colour for every exported SVG
scripts/
  vendor-hugeicons.py             Re-vendor the icon set at a pinned version
  rebuild-icon-index.py           Regenerate references/icon-index.md and its shards
```

---

## The system in brief

**Ethos —** dark green ground, one neon accent, and a pixel field that assembles itself. The brand book's own line is the concept root: *"just like building with blocks, piece by piece, insight by insight."*

**Palette**

| | Hex | |
|---|---|---|
| Electric Green | `#34FF67` | The signature accent |
| Pine Green | `#103A21` | Default dark surface |
| Jade Green | `#33FFC2` | Secondary accent |
| Grey | `#BCBEC0` | True neutral |
| Vivid Orange | `#FF5A32` | Critical severity — the palette has no red |
| Deep Jade | `#011E14` | Deepest ground — highest contrast in the system |
| Olive Green | `#5B6B3E` | Medium severity |
| Pale Sky Blue | `#B1D9E8` | Low severity |

**Type —** Inter (EN) · Alexandria (AR). Display 240/200/160/60/40 at **×0.90 at ≥100px, ×0.95 below**. Body 40/36/28/24/20/16 at **×1.35**. Arabic overrides to a **×1.5** floor via the AR mode of the `numbers` collection — a mode, not a parallel token set.

**Grid —** 1920×1080. 8 columns × 180px, 40px gutters, 100px side margins, 50px bleed-safe, 98px footer band, 932px live content height.

**Motif —** 20px base module (exactly 1/9 of a column), density migrating toward an edge, ≤3 columns of travel, ≤20% canvas coverage on content slides, never under text.

**Icons —** Hugeicons, `Type=Rounded` and `Style=Stroke`, always. 5,437 MIT-licensed SVGs vendored in `assets/icons/stroke-rounded/`. Sizes 24/32/40/48/64/80 on the 8px grid. Green icons are banned on light grounds — Pine Green instead.

---

## The rule that governs everything

**Electric Green `#34FF67` is an accent on dark. It is never a surface behind body text.**

| Pairing | Contrast |
|---|---|
| on White | **1.34 : 1** — fails every threshold, including the 3:1 non-text floor |
| on Pine Green | **9.49 : 1** — AAA |
| on Deep Jade | **13.07 : 1** — AAA |

Decks go to CEOs. Default backgrounds are dark green or white; electric green is reserved for covers, dividers, and minimal-text moments.

Ratios are computed with the WCAG 2.x relative-luminance formula, not estimated.

---

## Updating the skill

### Install or update

```bash
# first install
git clone https://github.com/Gamaleldientarek/colab-design-skill.git ~/.claude/skills/colab-design

# update to the latest release
cd ~/.claude/skills/colab-design && git pull

# pin to a specific release
cd ~/.claude/skills/colab-design && git checkout v3.0.0
```

Claude Code discovers the skill automatically. No restart needed — the next invocation picks up the change.

### Where new knowledge goes

| Kind of knowledge | File |
|---|---|
| A client decision, or a rule the client can overrule | `references/decision-law.md` |
| A colour, ramp, or contrast measurement | `references/colors.md` |
| A Figma variable, style, mode, or token | `references/figma-tokens.md` |
| How the variable **layer** is governed or repaired | `references/variable-architecture.md` |
| A typographic technique with a source or a derivation | `references/editorial-technique.md` |
| Where an edge goes on a slide — anchors, gates, motif construction | `references/layout-archetypes.md` |
| A component's anatomy, variants, or legal overrides | `references/components.md` |
| A Plugin API trap or a build-safety rule | `references/figma-workflow.md` |
| A report pattern or a research-reporting convention | `references/report-template.md` |

`SKILL.md` is loaded on **every** invocation. A rule earns a place there only if a designer would produce failing work without it. Everything else goes in a reference and gets a pointer.

### Evidence discipline

`editorial-technique.md` and `layout-archetypes.md` mark every claim:

- `[S]` **sourced** — from published typographic or design literature
- `[D]` **derived** — reasoned from a sourced principle onto this grid
- `[M]` **measured** — computed from the live Figma file or the WCAG formula

Keep the marks. They are why a reader can tell a brand preference from an accessibility fact, and dropping them makes the whole file equally arguable.

### Versioning

| Bump | When |
|---|---|
| **Major** | A published value changes, so work built to the previous release now fails. v3.0.0 changed body leading ×1.16 → ×1.35 and the motif module 24px → 20px |
| **Minor** | New references, new rules, new assets — nothing previously correct becomes wrong |
| **Patch** | Corrections, typos, broken links |

### Release checklist

The step that matters most is **4**. Two false statements — "letter-spacing is `0` at every size" and display "×0.95 throughout" — survived the v2.0.0 release because the correction was *added* while the falsehood was left in place. A reader hitting the old line first has no way to know it lost.

1. **Measure before writing.** A rule without a number is an opinion. Ratios come from the WCAG relative-luminance formula, geometry from `absoluteBoundingBox`, counts from a real traversal
2. **Ratify open conflicts, once.** If two documents disagree, decide and record the decision — do not restate both and let the reader pick
3. **Write to the destination file** per the table above
4. **⚠️ Delete what the change supersedes.** Grep the whole skill for the old value and remove or explicitly mark every instance. Adding a correction beside a falsehood leaves both true-looking:
   ```bash
   grep -rn "OLD_VALUE" SKILL.md README.md references/*.md
   ```
5. **Sweep for residual contradictions** before tagging — the same grep, expecting zero hits
6. **Update the affected numbers in the Figma file too.** A skill that documents a state the file contradicts recreates the defect it is describing
7. **CHANGELOG entry** — `Added` / `Changed` / `Fixed` / `Corrected`, with the numbers and the reason. `Corrected` is for claims that were previously wrong, and it is not optional
8. **Commit and tag**
   ```bash
   git add -A && git commit && git tag -a v3.1.0 -m "..." && git push origin main --tags
   ```

### Regenerating the vendored assets

```bash
python3 scripts/vendor-hugeicons.py      # re-vendor Hugeicons at a pinned version
python3 scripts/rebuild-icon-index.py    # rebuild the index from assets/icons/
```

Logos and shapes are exported from the Figma component sets by hand; `assets/figma-export-manifest.json` records the source variant, size and colour of every SVG so an export can be verified against its origin.

---

## Provenance

Derived from the client's Figma file (audited 2026-07-26), its Brand Book, and the 37 client-approved slides in `Design Slides V2`.

Layout archetype coordinates are derived for this specific grid from sourced composition principles — Swiss/International Typographic Style, Tufte's data-ink discipline, Duarte's single-accent rule, MBB governing-sentence structure, and published research on executive scanning behaviour. They are Colab's own design rules, not external benchmarks. `references/layout-archetypes.md` marks every claim as sourced or derived.

---

## Licence

The tooling and documentation structure are MIT. The Colab brand assets, palette, and identity are the property of Colab and are not licensed for reuse.

The icons in `assets/icons/stroke-rounded/` are the Hugeicons free set — **MIT**, redistributed under the terms in `assets/icons/LICENSE`. Only the Stroke Rounded style is MIT. Hugeicons Pro styles (Solid, Duotone, Twotone, Bulk) and Pro types (Sharp, Standard) are **not** included here and require a [Hugeicons Pro licence](https://hugeicons.com/license-agreement).
