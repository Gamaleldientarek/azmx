# azmx

Design systems for AZMX and its brands, packaged as Agent Skills for [Claude Code](https://claude.com/claude-code).

Maintained by [Gamal Eldien](https://gamaleldien.com).

## Skills

| Skill | Covers | Source |
|-------|--------|--------|
| AZMX Brand | Colors, tokens, typography, logos, fonts, email design system, voice and tone guide | [`brand/`](./brand) |
| Colab Design | Palette with verified contrast rules, type scale, 8-column slide grid, 14 layout archetypes, pixel/dither graphic language | [`colab/`](./colab) |
| Majarah Design | Eleven-variable palette with a measured contrast matrix, Oswald/Helvetica type system, 1920×1080 slide grid, twelve layout archetypes, EN/AR variable architecture | [`majarah/`](./majarah) |

## Structure

Each skill is self-contained and follows the standard Agent Skill layout:

```
<skill>/
├── SKILL.md        entry point — loaded by the agent
├── README.md       human-facing overview
├── CHANGELOG.md    version history
├── assets/         logos, fonts, icons, images
├── references/     detailed specs loaded on demand
└── scripts/        build and QA tooling
```

## Installation

Copy a skill into your Claude Code skills directory:

```bash
cp -r brand   ~/.claude/skills/azmx-brand
cp -r colab   ~/.claude/skills/colab-design
cp -r majarah ~/.claude/skills/majarah-design
```

## History

This repository consolidates three previously separate repositories, merged with
`git subtree` so their commit history is preserved:

| Was | Now |
|-----|-----|
| `Gamaleldientarek/azmx-brand-skill` | [`brand/`](./brand) |
| `Gamaleldientarek/colab-design-skill` | [`colab/`](./colab) |
| `Gamaleldientarek/majarah-design-skill` | [`majarah/`](./majarah) |

The original repositories are archived and read-only. Their `raw.githubusercontent.com`
URLs continue to resolve, so any asset link published before the consolidation still works.

Because `git subtree` grafts prior commits at their original paths, `git log -- brand/`
shows only post-merge commits. The full history is present — browse it with
`git log --full-history`.

## Ownership

The AZMX, Colab and Majarah brand systems are the property of AZMX. This repository
packages them for AI-assisted design work; it does not license the marks or assets for
reuse.
