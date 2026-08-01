![AZMX Brand Skill](assets/cover.jpg)

# AZMX Brand Skill

The official AZMX brand and communication system, packaged as an Agent Skill for Claude Code and other AI agents. Install it once and every deliverable (decks, emails, reports, web pages, social graphics, documents, articles, campaigns) comes out in the AZMX identity without re-briefing the agent.

Deep navy, electric blue, generous white space, serif personality, the chevron as the only graphic device. Restraint is the luxury.

As of v1.4.0 the skill also encodes the AZM X Unified Communication Strategy: five brand voices, eight audience personas with their approved core messages, seven channels with owners and metrics, the editorial cadence, and ready-to-run content prompts.

**[Browse the image library →](https://gamaleldientarek.github.io/azmx/brand/)** — all 242 brand images, click any one to download. No account needed.

## What's inside

- `SKILL.md`: the condensed brand rules the agent loads automatically
- `references/design-system.md`: the full AZMX Design System handbook (v1.1: chevrons banned as backgrounds)
- `references/colors.md`: every color tone (primary, blue ramp 50 to 1000, neutrals, RAG, surfaces, text-by-surface)
- `references/figma-tokens.md`: the complete live Figma variable export, 233 tokens across Colors (with Dark Mode), Fonts, and Numbers (type scale, spacing, radii, opacity)
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
- `assets/images/`: 242 AZMX-generated brand images in 8 sections (gradients, abstract blue, and recolored variants)
- `assets/templates/`: ready-to-fill email skeleton and the full email component showcase
- `assets/logo/`: the AZMX logo in Colored, Navy Dark, and White SVG variants, plus the chevron favicon
- `assets/fonts/`: Azm X (TTF, English and Arabic) and thmanyah serif display (woff2 for web, OTF for desktop)
- `assets/fonts.css`: ready-made @font-face rules plus CSS variables for the palette

## Install (for AZMX team members)

You need [Claude Code](https://claude.com/claude-code) or any agent that supports Agent Skills.

```bash
git clone https://github.com/Gamaleldientarek/azmx.git
cp -r azmx/brand ~/.claude/skills/azmx-brand
```

That's it. Next time you ask Claude for anything AZMX-branded, the skill kicks in automatically. You can also invoke it directly with `/azmx-brand`.

To update to the latest version later:

```bash
cd azmx && git pull
cp -r brand ~/.claude/skills/azmx-brand
```

## Quick palette reference

| Token | Hex |
|---|---|
| Electric | `#001AFF` |
| Dark Navy | `#040038` |
| Light Blue | `#5D8FFF` |
| Blue 50 | `#F0F5FF` |
| Neutral 900 | `#111927` |

Full ramps and usage rules live in `references/colors.md`.

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
