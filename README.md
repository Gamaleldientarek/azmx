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
  layout-archetypes.md            14 slide recipes with grid coordinates
  research-notes.md               Phosphor, bilingual EN/AR, category conventions
  figma-workflow.md               Working in Figma — safety protocol, plugin API gotchas
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

**Type —** Inter (EN) · Alexandria (AR). Display 240/200/160/60/40 at ×0.95. Body 40/36/28/24/20/16 at ×1.16. Arabic overrides to a 1.5 line-height floor.

**Grid —** 1920×1080. 8 columns × 180px, 40px gutters, 100px side margins, 50px bleed-safe, 98px footer band, 932px live content height.

**Motif —** 20px base module (exactly 1/9 of a column), density migrating toward an edge, ≤3 columns of travel, ≤20% canvas coverage on content slides, never under text.

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

## Provenance

Derived from the client's Figma file (audited 2026-07-26), its Brand Book, and the 37 client-approved slides in `Design Slides V2`.

Layout archetype coordinates are derived for this specific grid from sourced composition principles — Swiss/International Typographic Style, Tufte's data-ink discipline, Duarte's single-accent rule, MBB governing-sentence structure, and published research on executive scanning behaviour. They are Colab's own design rules, not external benchmarks. `references/layout-archetypes.md` marks every claim as sourced or derived.

---

## Licence

The tooling and documentation structure are MIT. The Colab brand assets, palette, and identity are the property of Colab and are not licensed for reuse.
