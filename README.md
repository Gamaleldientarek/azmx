# azmx

Design systems and projects for AZMX and its brands.

Maintained by [Gamal Eldien](https://gamaleldien.com).

## Design systems

Packaged as Agent Skills for [Claude Code](https://claude.com/claude-code).

| Skill | Covers | Source |
|-------|--------|--------|
| AZMX Brand | Colors, tokens, typography, logos, fonts, email design system, voice and tone guide | [`brand/`](./brand) |
| Colab Design | Palette with verified contrast rules, type scale, 8-column slide grid, 14 layout archetypes, pixel/dither graphic language | [`colab/`](./colab) |
| Majarah Design | Eleven-variable palette with a measured contrast matrix, Oswald/Helvetica type system, 1920×1080 slide grid, twelve layout archetypes, EN/AR variable architecture | [`majarah/`](./majarah) |

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

## Install

```bash
git clone https://github.com/Gamaleldientarek/azmx.git
cd azmx
./install.sh
```

That installs all three skills into `~/.claude/skills/`. For one only:

```bash
./install.sh brand
```

Restart Claude Code afterwards, or run `/doctor`, so it picks them up. Confirm with `/azmx-brand`.

## Update

Same command. Pull, then re-run:

```bash
cd azmx
git pull
./install.sh
```

It reports what changed per skill and says `already up to date` when there is nothing to do. To preview without writing anything:

```bash
./install.sh --dry-run
```

**Use the script rather than `cp -r`.** A plain copy leaves behind files that were deleted upstream, so a skill accumulates stale references — a real risk here, since `brand/` v2.0.0 replaced a token reference wholesale. The script uses `rsync --delete`, which removes them. It also skips `.git` and `node_modules`.

Installing somewhere other than `~/.claude/skills`:

```bash
CLAUDE_SKILLS_DIR=/path/to/skills ./install.sh
```

### Manual install

If you would rather not run a script, copy the directory and delete the old one first so nothing stale survives:

```bash
rm -rf ~/.claude/skills/azmx-brand
cp -r brand ~/.claude/skills/azmx-brand
```

Skill directory names matter — they must match the `name:` field in each `SKILL.md`: `azmx-brand`, `colab-design`, `majarah-design`.

## Projects

| Project | What it is | Live | Source |
|---------|-----------|------|--------|
| Sharing Tuesday | Facilitated random-selector app for AZMX sessions. Next.js, Supabase, Cloudflare Worker | [games.gamaleldien.com/random-selector](https://games.gamaleldien.com/random-selector) | [`sharing-tuesday/`](./sharing-tuesday) |

Projects are applications, not skills — they build and deploy independently. See each
project's own README for setup. Configuration is supplied through environment variables;
`sharing-tuesday/.env.example` documents every one. No secrets are committed to this
repository.

## History

This repository consolidates four previously separate repositories, merged with
`git subtree` so their commit history is preserved:

| Was | Now |
|-----|-----|
| `Gamaleldientarek/azmx-brand-skill` | [`brand/`](./brand) |
| `Gamaleldientarek/colab-design-skill` | [`colab/`](./colab) |
| `Gamaleldientarek/majarah-design-skill` | [`majarah/`](./majarah) |
| `Gamaleldientarek/sharing-tuesday` | [`sharing-tuesday/`](./sharing-tuesday) |

The original repositories are archived and read-only. Their `raw.githubusercontent.com`
URLs continue to resolve, so any asset link published before the consolidation still works.

Because `git subtree` grafts prior commits at their original paths, `git log -- brand/`
shows only post-merge commits. The full history is present — browse it with
`git log --full-history`.

## Ownership

The AZMX, Colab and Majarah brand systems are the property of AZMX. This repository
packages them for AI-assisted design work; it does not license the marks or assets for
reuse.
