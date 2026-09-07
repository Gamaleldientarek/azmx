![AZMX Brand Skill](assets/cover.jpg)

# AZMX Brand Skill

The official AZMX brand and communication system, packaged as an Agent Skill for Claude Code and other AI agents. Install it once and every deliverable (decks, emails, reports, web pages, social graphics, documents, articles, campaigns) comes out in the AZMX identity without re-briefing the agent.

Deep navy, electric blue, generous white space, serif personality, the chevron as the only graphic device. Restraint is the luxury.

As of v1.4.0 the skill also encodes the AZM X Unified Communication Strategy: five brand voices, eight audience personas with their approved core messages, seven channels with owners and metrics, the editorial cadence, and ready-to-run content prompts.

**[Browse the image library →](https://gamaleldientarek.github.io/azmx/brand/)** — all 242 brand images, click any one to download. No account needed.

## What's inside

- `SKILL.md`: the condensed brand rules the agent loads automatically
- `references/design-system.md`: the full AZMX Design System handbook (v1.1: chevrons banned as backgrounds)
- `references/colors.md`: every color tone — the blue ramp 50 to 1000, the five secondary palettes, neutrals, RAG dots, surfaces, text-by-surface
- `references/design-tokens-usage.md`: **read this before touching a Figma file.** The seven-step guide — which tier to bind to, choosing colour by job, type, spacing, and how to add a token
- `references/figma-tokens.md`: the complete live Figma variable export, 550 tokens across five collections — Primitives, Palette (six modes), Semantic (Light/Dark), Component, Canvas
- `references/email-design-system.md`: the AZMX Email Design System v1 (RTL rules, 3-layer fonts, themes, components)
- `references/voice-and-tone.md`: how AZMX sounds, EN and AR — the Four Dimensions, universal writing principles, the 6-point pre-publish checklist, and the no-AI-tells writing mechanics
- `references/communication-strategy.md`: the strategy spine — guiding principles, POEM, all seven channels, the RACI matrix, workflows, the three operating rituals, the creative effectiveness scale, and the briefing checklist
- `references/audiences-and-messaging.md`: three internal segments, three external motions, eight personas, each with its approved verbatim core message
- `references/sub-brand-voices.md`: voice profiles for Colab, Majarah, Clix, and Anatomi (voice only — the visual system in this skill is AZM X's alone)
- `references/editorial-calendar.md`: weekly themes, per-brand cadence, optimal posting times, the monthly SEO and PPC initiatives, and the 19 Arabic internal initiatives
- `references/content-prompts.md`: five tested prompts — long-form article, LinkedIn, Instagram, Twitter/X, and English-to-Arabic localisation
- `references/image-library.md`: catalogue, selection rules, and measured colour pairings for the image library
- `references/image-index.md`: every image with its three concept tags, dominant colour, safe text colour, and a direct download link
- `references/recolor-prompts.md`: tested prompts for converting an image to another colour theme, copyable from the gallery
- `references/icons.md`: the Phosphor icon system, the ask-before-you-use-icons rule, locked weights, sizes, and colours by surface
- `references/pdf-forms.md`: the validated Figma → export → pdf-lib pipeline for printed A4 documents and fillable PDF forms
- `scripts/brand-check.py`: an automated brand QA linter. It parses the legal palette out of `references/colors.md` at runtime, then checks deliverables for off-palette colours, non-brand fonts, and off-scale spacing
- `scripts/build-pdf-form.mjs`: stamps AcroForm fields onto a designed PDF at exact coordinates, with the brand font embedded
- `scripts/extract-figma-fields.js`: reads the field rectangles out of a Figma design and emits the JSON spec
- `scripts/tokens-to-css.mjs`: turns the tokens into CSS custom properties. All twelve palette-theme combinations by default, or one flattened combination, or JSON. No dependencies
- `scripts/export-figma-tokens.js`: regenerates the token export from Figma, in raw and W3C DTCG form
- `assets/tokens/azmx-tokens.json`: all 550 tokens as data, aliases preserved so the palette and theme structure survives
- `assets/images/`: 242 AZMX-generated brand images in 8 sections (gradients, abstract blue, and recolored variants)
- `assets/templates/`: ready-to-fill email skeleton and the full email component showcase
- `assets/logo/`: the AZMX logo in Colored, Navy Dark, and White SVG variants, plus the chevron favicon
- `assets/fonts/`: Azm X (TTF, English and Arabic) and thmanyah serif display (woff2 for web, OTF for desktop)
- `assets/fonts.css`: ready-made @font-face rules plus CSS variables for the palette

## Install

One command. It needs [Node.js](https://nodejs.org) and [Claude Code](https://claude.com/claude-code).

```bash
npx skills@latest add Gamaleldientarek/azmx --skill azmx-brand -g -a claude-code -y
```

Directory page with the command ready to copy: [skills.sh/Gamaleldientarek/azmx/azmx-brand](https://skills.sh/Gamaleldientarek/azmx/azmx-brand).

Restart Claude Code. Next time you ask for anything AZMX-branded the skill loads on its own, or call it directly with `/azmx-brand`.

To update later:

```bash
npx skills@latest update -g
```

Using Cursor, Codex or another agent: drop `-a claude-code` and the installer detects what is on the machine. Prefer a plugin that updates itself: see the [repository README](../README.md#install). Not comfortable in a terminal: [INSTALL.md](../INSTALL.md) walks through it step by step.

## Quick palette reference

**Blue is the house default.** Five secondary palettes can each carry a whole deliverable — the Hospitals Report runs entirely in orange. A deck picks one palette and its accent, dark ground and gradient all follow.

| Palette | Signature | Deep | Text-safe on white |
|---|---|---|---|
| **Blue** | Electric `#001AFF` | Dark Navy `#040038` | `#001AFF` |
| **Orange** | `#F47A48` | `#842C09` | `#A1502F` |
| **Green** | `#22C36F` | `#012F02` | `#168049` |
| **Yellow** | `#FED340` | `#693F02` | `#895F0F` |
| **Purple** | `#C68FFF` | `#2E0068` | `#7341AD` |
| **Red** | `#FF2B3C` | `#640000` | `#A81C27` |

Each runs a full twelve-step ramp, 50 to 1000. Never mix two palettes on one surface.

**The signature is a fill colour, not a text colour.** Blue is the exception because Electric is dark. Every secondary signature is a vivid light tone — white on yellow `#FED340` measures 1.44:1 — so text drops to the safe step in the last column. In Figma the tokens handle it: `surface/accent` for a fill, `text/accent` when it must be read.

Supporting tones:

| Token | Hex | Role |
|---|---|---|
| Light Blue | `#5D8FFF` | The accent on navy, where Electric fails contrast |
| Blue 50 | `#F0F5FF` | Quiet light surface, table zebra, panels |
| Neutral 900 | `#111927` | Body text on light |
| RAG dots | `#FF2B3C` `#FED340` `#22C36F` | Data only, separate from the palettes |

Full ramps and usage rules live in `references/colors.md`. How to apply them is in `references/design-tokens-usage.md`.

## Adding images to the library

Ask Claude ("add these to the AZMX image library"), or do it yourself from this folder:

```bash
python3 scripts/add-images.py blue ~/Desktop/new-renders/
git add -A && git commit -m "Add images to blue" && git push
```

Sections: `gradient`, `blue`, `white`, `orange`, `purple`, `red`, `green`, `yellow`. The script resizes to 1600px, compresses to match the set, numbers the files, and rebuilds both the index and the live gallery. Needs Pillow (`pip3 install Pillow`).

## Building a fillable PDF form

Design the form in Figma on A4 frames (595 × 842), name every input rectangle `FIELD · snake_case_id`, then:

```bash
cd ~/.claude/skills/azmx-brand/scripts && npm install   # once
node ~/.claude/skills/azmx-brand/scripts/build-pdf-form.mjs \
  --src merged.pdf --fields fields.json --out fillable.pdf --expect 99
```

Fields land at exact coordinates with readable names, so Acrobat's "Prepare Form" auto-detect is never needed. Full pipeline in `references/pdf-forms.md`.

## License note

The AZMX logo, brand assets, and the thmanyah serif display and Azm X font files are the property of AZMX and its licensors, and are licensed for AZMX work only. Viewing this repo does not grant any right to use them in non-AZMX projects or to redistribute the fonts.

Built by [gamaleldien.com](https://gamaleldien.com). Skill v1.4.0, design system v1.1, encoded from the New Direction Library Figma file and the AZM X Unified Communication Strategy. Release notes in [CHANGELOG.md](CHANGELOG.md).
