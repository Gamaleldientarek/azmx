# majarah-design

The Majarah design system as an Agent Skill: the eleven-variable palette with a measured contrast matrix, the Oswald/Helvetica type system, the 1920×1080 slide grid, twelve layout archetypes, sixteen measured reference slides, and the EN/AR variable architecture.

**Majarah** (مجرة — Arabic for *galaxy*) is the UX, design and digital-innovation community of Saudi Arabia, and one of four brands under [AZM X](https://github.com/Gamaleldientarek/azmx-brand-skill). Brand authorship: MUD Creative House.

## Install

```bash
git clone https://github.com/Gamaleldientarek/majarah-design-skill.git \
  ~/.claude/skills/majarah-design
```

Then start a new Claude Code session — the skill registers automatically and triggers on Majarah design work.

## What's in it

```
SKILL.md                          entry point — palette, type, grid, chrome, guardrails
references/
  colors.md                       11 variables, full contrast matrix, per-ground verdicts
  figma-tokens.md                 exact variable IDs, both collections, setup block
  variable-architecture.md        why the collections are shaped this way; the AR collapse
  typography.md                   families, the Oswald substitution, size/tracking/leading scales
  layout-archetypes.md            twelve recipes with real coordinates
  slide-library.md                all eighteen v1 frames, measured, with node IDs
  logo-and-assets.md              logo components, clearspace, the decorative image library
  editorial-technique.md          six named techniques + the amateur-tell checklist
  figma-workflow.md               Desktop Bridge workflow, sixteen gotchas, verification pass
  rtl-arabic.md                   what an Arabic build actually requires
  voice.md                        Inclusive Mentor — short version, points at azmx-brand
  decision-log.md                 standing decisions + twelve known defects. Overrides everything
assets/logo/                      six logo variants as single-path SVGs
assets/fonts/oswald/              Oswald (OFL) — six statics, six WOFF2, variable font
scripts/
  brand-check.py                  contrast checker and off-palette hex scanner
  export-figma-assets.py          pulls the raster library from Figma
```

## The one rule

The Majarah palette is monochromatic — one hue at five lightnesses, four of them below 0.09 luminance. **Every purple-on-purple pairing fails WCAG.** Only White and Subtle Grey carry text on the dark grounds.

The brand's signature move — a two-tone headline with the accent line in `Purple/300` — measures **2.28:1** on `Purple/900`. It works because those headlines are 140–200pt, where the eye reads the drop as emphasis rather than as text to decode. Below ~90pt it is a defect.

```bash
python3 scripts/brand-check.py --matrix
python3 scripts/brand-check.py --pair Purple/300 Purple/900 --size 180 --bold
python3 scripts/brand-check.py --scan build/index.html
```

## Built from measurement, not from the guides

Every number here was read from the live Figma file (`Majarah Library`, all eighteen frames) and cross-checked against the MUD brand book, rather than transcribed from the two prose build guides that shipped with the v1 deck.

That mattered. The audit found **twelve defects**, including two headlines set at 1.28:1 and 1.55:1 — invisible, and invisible in the node data too, because every fill was correctly variable-bound and on-palette. It also found that one written guide's recommended fix for a contrast failure was itself measurably worse than the bug.

`references/decision-log.md` carries all twelve and overrides the older guides.

## Related skills

| Skill | Scope |
|---|---|
| [`azmx-brand`](https://github.com/Gamaleldientarek/azmx-brand-skill) | AZM X parent brand + the communication strategy that owns Majarah's **voice** |
| [`colab-design`](https://github.com/Gamaleldientarek/colab-design-skill) | Colab, the sibling UX research lab — its own visual system |

Voice lives in `azmx-brand`. Visuals live here. Never dress a Majarah deliverable in AZM X navy and Electric blue, or the reverse.

## License

Majarah brand assets and design system © AZM X / MUD Creative House. This skill documents the system for internal and authorised use.
