# azmx

The AZMX design systems as Agent Skills for [Claude Code](https://claude.com/claude-code) and other AI agents. One repository per skill. This one is the hub: the install commands, the guide for non-technical people, and the plugin marketplace.

Maintained by [Gamal Eldien](https://gamaleldien.com).

## Install

One command per skill. It needs [Node.js](https://nodejs.org) on the machine, nothing else.

**AZMX brand.** Colors, tokens, typography, logos, fonts, the email design system, voice and tone, the communication strategy.

```bash
npx skills@latest add Gamaleldientarek/azmx-brand -g -a claude-code -y
```

**Colab design.** Palette with verified contrast rules, type scale, the 8-column slide grid, 14 layout archetypes, the pixel and dither graphic language, EN/AR rules.

```bash
npx skills@latest add Gamaleldientarek/colab-design -g -a claude-code -y
```

**Majarah design.** Eleven-variable palette with a measured contrast matrix, the Oswald/Helvetica type system, the 1920×1080 slide grid, twelve layout archetypes, the EN/AR variable architecture.

```bash
npx skills@latest add Gamaleldientarek/majarah-design -g -a claude-code -y
```

Restart Claude Code. From then on, ask for anything AZMX, Colab or Majarah branded and the right skill loads on its own. Each one can also be called directly: `/azmx-brand`, `/colab-design`, `/majarah-design`.

The skills land in `~/.claude/skills/`. Running a command again over an existing install replaces it cleanly. To update everything you installed:

```bash
npx skills@latest update -g
```

**Cursor, Codex, Copilot and other tools.** Same command, different `-a` value. The skill lands in `~/.agents/skills/`, which those tools read.

```bash
npx skills@latest add Gamaleldientarek/azmx-brand -g -a cursor -y
npx skills@latest add Gamaleldientarek/azmx-brand -g -a codex -y
npx skills@latest add Gamaleldientarek/azmx-brand -g -a github-copilot -y
```

Swap `azmx-brand` for `colab-design` or `majarah-design`. To install into every tool on the machine at once, use `-a '*'`. Other accepted names include `gemini-cli`, `opencode` and `windsurf`.

**Not comfortable in a terminal?** [INSTALL.md](./INSTALL.md) walks through it step by step and can be forwarded to anyone.

### As Claude Code plugins

The alternative for Claude Code users who want the skills to keep themselves up to date:

```
/plugin marketplace add Gamaleldientarek/azmx
/plugin install azmx-brand@azmx
/plugin install colab-design@azmx
/plugin install majarah-design@azmx
```

Plugins refresh in the background, so a release in any skill repository reaches everyone without anyone running anything. Automatic invocation is unaffected.

Pick one route. Installing both puts two copies of a skill on the machine. If you installed the earlier `azmx@azmx` bundle, uninstall it first with `/plugin uninstall azmx@azmx`.

To make a project prompt its collaborators automatically, add this to the project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "azmx": { "source": { "source": "github", "repo": "Gamaleldientarek/azmx" } }
  },
  "enabledPlugins": {
    "azmx-brand@azmx": true,
    "colab-design@azmx": true,
    "majarah-design@azmx": true
  }
}
```

## The skills

| Skill | Repository | Also |
|---|---|---|
| AZMX Brand | [`Gamaleldientarek/azmx-brand`](https://github.com/Gamaleldientarek/azmx-brand) | [Image gallery](https://gamaleldientarek.github.io/azmx-brand/), 242 brand images |
| Colab Design | [`Gamaleldientarek/colab-design`](https://github.com/Gamaleldientarek/colab-design) | |
| Majarah Design | [`Gamaleldientarek/majarah-design`](https://github.com/Gamaleldientarek/majarah-design) | |

Each repository is one self-contained skill in the standard Agent Skill layout: `SKILL.md` at the root, `references/` loaded on demand, `assets/` for logos, fonts, icons and images, `scripts/` for build and QA tooling, and a `CHANGELOG.md`.

## Frozen assets

Between 1 August and 7 September 2026 the three skills lived inside this repository, and links of the form `raw.githubusercontent.com/Gamaleldientarek/azmx/main/<skill>/assets/...` were published in that window. The `brand/`, `colab/` and `majarah/` folders here keep those assets, frozen at that date, so every such link keeps resolving. The old gallery address, `gamaleldientarek.github.io/azmx/brand/`, still works for the same reason. New work uses the per-skill repositories above. There is no skill left to install from this repository.

## History

| Date | Change |
|---|---|
| 2026-08-01 | Three skill repositories and one app consolidated here as a monorepo |
| 2026-09-07 | The app moved back to its own repository. The three skills moved to their own repositories again, with full history. This repository became the hub |

The original repositories from before the consolidation are archived and read-only. Their `raw.githubusercontent.com` URLs continue to resolve, so any asset link published before then still works.

## Ownership

The AZMX, Colab and Majarah brand systems are the property of AZMX. This repository and the three skill repositories package them for AI-assisted design work; they do not license the marks or assets for reuse.
