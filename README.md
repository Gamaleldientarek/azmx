# azmx

Design systems for AZMX and its brands, packaged as Agent Skills for [Claude Code](https://claude.com/claude-code) and other AI agents.

Maintained by [Gamal Eldien](https://gamaleldien.com).

## Install

One command per skill. It needs [Node.js](https://nodejs.org) on the machine, nothing else.

**AZMX brand.** Colors, tokens, typography, logos, fonts, the email design system, voice and tone, the communication strategy.

```bash
npx skills@latest add Gamaleldientarek/azmx --skill azmx-brand -g -a claude-code -y
```

**Colab design.** Palette with verified contrast rules, type scale, the 8-column slide grid, 14 layout archetypes, the pixel and dither graphic language, EN/AR rules.

```bash
npx skills@latest add Gamaleldientarek/azmx --skill colab-design -g -a claude-code -y
```

**Majarah design.** Eleven-variable palette with a measured contrast matrix, the Oswald/Helvetica type system, the 1920×1080 slide grid, twelve layout archetypes, the EN/AR variable architecture.

```bash
npx skills@latest add Gamaleldientarek/azmx --skill majarah-design -g -a claude-code -y
```

**All three at once.**

```bash
npx skills@latest add Gamaleldientarek/azmx --skill '*' -g -a claude-code -y
```

Restart Claude Code. From then on, ask for anything AZMX, Colab or Majarah branded and the right skill loads on its own. Each one can also be called directly: `/azmx-brand`, `/colab-design`, `/majarah-design`.

The skills land in `~/.claude/skills/`. Running the command again over an existing install replaces it cleanly, so it doubles as the update path:

```bash
npx skills@latest update -g
```

**Other agents.** Drop `-a claude-code` and the installer detects what is on the machine (Cursor, Codex, Copilot and others) and asks where to install.

**Not comfortable in a terminal?** [INSTALL.md](./INSTALL.md) walks through it step by step and can be forwarded to anyone.

### As a Claude Code plugin

The alternative for Claude Code users who want the skills to keep themselves up to date:

```
/plugin marketplace add Gamaleldientarek/azmx
/plugin install azmx@azmx
```

That installs all three skills and refreshes them in the background, so a push here reaches everyone without anyone running anything. Skills installed this way are namespaced: `/azmx:azmx-brand`, `/azmx:colab-design`, `/azmx:majarah-design`. Automatic invocation is unaffected.

Pick one route. Installing both puts two copies of each skill on the machine. To drop the one-command install in favour of the plugin:

```bash
npx skills@latest remove azmx-brand colab-design majarah-design -g -y
```

To make a project prompt its collaborators automatically, add this to the project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "azmx": { "source": { "source": "github", "repo": "Gamaleldientarek/azmx" } }
  },
  "enabledPlugins": { "azmx@azmx": true }
}
```

## Design systems

| Skill | Covers | Source |
|-------|--------|--------|
| AZMX Brand | Colors, tokens, typography, logos, fonts, email design system, voice and tone guide, communication strategy | [`brand/`](./brand) |
| Colab Design | Palette with verified contrast rules, type scale, 8-column slide grid, 14 layout archetypes, pixel/dither graphic language | [`colab/`](./colab) |
| Majarah Design | Eleven-variable palette with a measured contrast matrix, Oswald/Helvetica type system, 1920×1080 slide grid, twelve layout archetypes, EN/AR variable architecture | [`majarah/`](./majarah) |

Each skill also has a page on the skills directory, with the install command ready to copy: [azmx-brand](https://skills.sh/Gamaleldientarek/azmx/azmx-brand), [colab-design](https://skills.sh/Gamaleldientarek/azmx/colab-design), [majarah-design](https://skills.sh/Gamaleldientarek/azmx/majarah-design).

Each skill is self-contained and follows the standard Agent Skill layout:

```
<skill>/
├── SKILL.md        entry point, loaded by the agent
├── README.md       human-facing overview
├── CHANGELOG.md    version history
├── assets/         logos, fonts, icons, images
├── references/     detailed specs loaded on demand
└── scripts/        build and QA tooling
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
shows only post-merge commits. The full history is present. Browse it with
`git log --full-history`.

## Ownership

The AZMX, Colab and Majarah brand systems are the property of AZMX. This repository
packages them for AI-assisted design work; it does not license the marks or assets for
reuse.
