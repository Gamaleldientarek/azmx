# Changelog

All notable changes to the AZMX Brand Skill.

---

## v1.4.1 — 2026-07-30

**Majarah gains a visual system.** `majarah-design` is now an installed skill, so two of the four sub-brands have their own visual layer instead of borrowing AZM X's.

### Changed

- `SKILL.md` — the visual-system guardrail now names both sub-brand skills (Colab → `colab-design`, Majarah → `majarah-design`) and states explicitly that Clix and Anatomi still have none, so the answer there is to ask rather than to improvise.
- `references/sub-brand-voices.md` — the voice-only guardrail now carries a table mapping each sub-brand to its visual skill and signature. Cross-reference footer updated.

Voice ownership is unchanged: this skill remains the single source for all five voices, including Majarah's *Inclusive Mentor*. `majarah-design` carries a short voice summary that points back here rather than restating the calibration examples.

---

## v1.4.0 — 2026-07-28

**The communication system.** The skill now covers what AZMX says, and to whom, not only how it looks. Encoded from the official 126-page AZM X Unified Communication Strategy: five brand voices, eight personas with their approved core messages, seven channels, governance, workflows, and the creative bar.

### Added

- **`references/communication-strategy.md`** — the spine and index. Purpose and the two visions, the six failures the strategy exists to fix, the five guiding principles, the POEM model with each component's role, all seven channels with their roles, audiences and metrics, the 12-activity × 9-role RACI matrix with per-role accountabilities, the external-content and agile-social workflows, the three operating rituals with attendees and agendas, the 5-level creative effectiveness scale, the critique and feedback standards, C.H.O.I.C.E. thinking, the briefing checklist and three-sentence story, pain points to solutions, the four change-management phases, and next steps.
- **`references/audiences-and-messaging.md`** — three internal segments, three external motions, eight personas, each with its **verbatim core message**, plus the brand-to-audience matrix and the audience tag vocabulary. The highest-frequency file in the skill: load it before writing any copy.
- **`references/sub-brand-voices.md`** — Colab, Majarah, Clix, and Anatomi. Archetype, the Four Dimensions with are / are-not lists, the verbatim before-and-after calibration examples, purpose modes, and the failure mode each voice falls into. Opens with the caveat that the skill carries **no visual system** for these four brands.
- **`references/editorial-calendar.md`** — the standard operating month. Four weekly themes per channel in step across all four plans, the per-brand cadence recap, the optimal posting-time table, the 8 SEO and 8 PPC monthly initiatives, the CTA-friction progression, the quarterly Anchor / Rhythm / Pulse framework, and all **19 Arabic internal initiatives** with the Arabic intact.
- **`references/content-prompts.md`** — five copy-pasteable prompts: long-form article, LinkedIn, Instagram, Twitter/X, and English-to-Arabic localisation.
- **`SKILL.md`** — new **Communication and content** section: the five brands and their voices, the visuals-are-AZM-X-only rule, the never-invent-a-message rule, the creative bar, and the briefing minimum. Frontmatter now triggers on communication planning, editorial calendars, social posts, articles, personas, briefs, localization, and the four sub-brand names. Workflow step 9 rewritten to brand → audience → voice → prompt; new step 11 runs the pre-publish checklist.

### Changed

- **`references/voice-and-tone.md`** — now the single entry point for how AZMX sounds. Absorbed AZM X's **Four Dimensions** (Formality Mid-Formal, Technicality Balanced, Attitude Bold but Respectful, Purpose Context-Dependent) with are / are-not lists and verbatim calibration examples, the five universal writing principles, per-platform voice for LinkedIn / Instagram / Twitter-X, and the 6-point pre-publish checklist. Cross-links out to `sub-brand-voices.md`. **Every existing rule survives**, and the no-AI-tells mechanics are untouched: the deck has no equivalent and they outrank it.
- **`SKILL.md`, `references/voice-and-tone.md`, `references/design-system.md`** — the retired "Saudi UX and innovation design studio" boilerplate corrected to "a leading Saudi digital consultancy", with the locked philosophy line added. One slide-archetype label changed from "Studio story" to "Company story".

### Decisions locked with this release

- **House voice beats the deck, absolutely.** The deck sets 3–5 hashtags per post, permits 5–10 on Instagram, encourages emojis on Instagram and Twitter/X, and mandates a CTA on every post. All three are **superseded**: three hashtags maximum, at the end, no emojis in copy, no mandatory CTA, on every channel and every brand. The deck's own figures are recorded in `voice-and-tone.md`, `editorial-calendar.md`, and `content-prompts.md` and marked superseded, so nobody ever "corrects" them back.
- **The emoji ban is scoped to copy.** No emoji in headlines, body, captions, subject lines, or social posts — every channel, every brand. The one carve-out is the **email design system's section-header and digest chip glyph** (components C03, C04, C07, C16), which is a visual chip rather than copy. Without this scope the skill contradicted itself: an agent following the workflow would have violated the no-emoji rule by correctly building from `assets/templates/email-starter-skeleton.html`. `references/email-design-system.md` and both shipped templates are unchanged.
- **AZM X is a consultancy, not a design studio** (client-locked 2026-07-24; the deck agrees). Locked philosophy line: **"Designing the Future of Experience."** "Studio", "agency", and "boutique" are out of AZMX copy.
- **Voice covers five brands, visuals cover one.** The palette, logos, fonts, and layout rules in this skill are AZM X's alone. Apply a sub-brand voice freely; ask which visual system applies before dressing a sub-brand deliverable. Colab has its own installed skill, `colab-design`.
- **Two things stay verbatim: the persona core messages and the tone-of-voice calibration examples.** They are the messaging and the tuning samples. All other deck prose is paraphrased into house voice, because the source runs on the exact vocabulary this skill bans.

### Findings worth keeping

- **The deck's RACI matrix carries two defects.** *Overall Content & Editorial Strategy* prints two Accountables, and *Overall Visual & Creative Direction* prints Creative as Accountable with Design as Responsible, the reverse of the deck's own per-role summary. The matrix is reproduced as printed with both defects resolved in favour of the per-role accountabilities, which are unambiguous. **This is a real decision for the AZM X team to confirm, not a transcription error.**
- **Weekly scheduling grids are not reference material.** The deck's four channel plans contain roughly 240 rows of brand / platform / send-time detail. That is an operations artifact for whoever holds the scheduling tool. What an agent actually needs is the theme, the cadence, and the time, so the grids were compressed to those and nothing was lost that a writer uses.
- **The deck's Arabic tables cannot be read from the PDF text layer.** Pages 50–51 store the two internal-initiative tables in visual order with the cell association scrambled. They were transcribed from the rendered pages instead. Any future Arabic extraction from this deck needs the same treatment.
- **The cadence recap and the weekly grids disagree.** The recap gives AZM X three LinkedIn posts where the grids run eight a month, and omits Anatomi's standing Instagram slot. Both are recorded, with the disagreement flagged rather than papered over.
- **The source PDF filename contained U+2028 line separators**, which breaks ordinary shell paths. Copy such a file to a safe name before processing it.
- **The deck's cadence recap disagrees with its own weekly grids, and by more than the recap admits.** Counting the four grids by hand: Anatomi's recap claims 1 Twitter, 1 YouTube long and 2 Shorts that the grids never schedule, while omitting the two Instagram slots a week Anatomi holds in all four weeks; Clix is credited 2 Shorts against 0 scheduled. The recap is reproduced as printed, labelled intended weighting rather than an audited count, with the deltas tabulated. Confirm against whoever holds the scheduling tool.
- **The cadence figures are monthly, not weekly.** The deck never states the unit. Colab's row reconciles exactly against the grids on a monthly reading, which settles it. Unqualified, "LinkedIn 3x" invites a fourfold planning error.
- **CTA friction is per-surface, not a month-long ramp.** The Sunday blog post is the low-friction entry in all four weeks without exception; escalation happens only on the Tuesday and Thursday emails. Week 2 is flat and week 4 ends low, so no monthly ramp exists to follow.
- **`scripts/brand-check.py` cannot see reference prose, by design.** It parses only fenced `css`/`html`/`svg` blocks, so the new markdown files are invisible to it and this release needs no script change. A future `--copy` mode could mechanically enforce hashtag count, emoji, and the banned intensifiers over a deliverable's visible text — worth building now that those rules are numeric, but it needs a scope switch so it does not lint the skill's own prose, which legitimately quotes every banned word.

---

## v1.3.0 — 2026-07-22

**Icons: ask, never assume.** Owner decision. The previous rule banned icons outright on decks, covers, dividers, closings, and reports, permitting them in functional UI only. That was wrong — AZMX uses icons across decks, reports, and other deliverables. Icons are now permitted on **any** surface, and the agent must **ask the user before adding them**.

### Changed

- **`references/icons.md`** — "Where icons are allowed" replaced with **"Ask before you use icons"**, mirroring the existing "Ask before you color" rule. Icons are permitted everywhere; the agent asks once before placing the first one and never decides silently in either direction. The context table now reads Ask / Ask-default-yes rather than Never.
- **`SKILL.md`** — Icons section rewritten to the ask-first rule. The chevron section no longer says "no icon packs". The human-craft guardrail now names the actual tell — *scattered decorative icon rows standing in for content* — instead of "generic icons". New workflow step 7: ask about icons before placing any.
- **`references/design-system.md`** — the anti-pattern table and the deck decoration rule no longer ban icon packs; both defer to `icons.md`.
- **`references/pdf-forms.md`** — the form brand-rules section said "No icons", contradicting `icons.md`. Corrected to the ask-first rule, with guidance that icons on a form belong on functional instructions rather than field labels.

### What did not change

The discipline that keeps icons from reading as an AI tell is unchanged, and it was never the ban: one weight, one size step per surface, Regular (never Fill or Duotone), at most one Electric accent, icons paired with labels, and an `aria-label` on any standalone icon. **Icons still never replace the chevron** as bullet, section tick, photo mask, or page-number flow tick — they sit alongside it.

### Added

- **`scripts/build-pdf-form.mjs`** now supports dropdown fields: `"type": "select"` with an `options` array and an optional `default`. Validation rejects a `select` with no options, and a `default` that is not one of its own options. First used for the Account Currency field (SAR / USD / EUR / GBP) on the AZMX Bank Information Form.

---

## v1.2.0 — 2026-07-22

**Designed PDF forms.** The skill now covers printed A4 documents and fillable PDF forms end to end, from Figma design through to stamped AcroForm fields. Validated on a real build: the AZMX Employee Information Form, 3 × A4, 99 form fields.

### Added

- **`references/pdf-forms.md`** — the full four-stage pipeline: design in Figma → export to PDF → stamp fields with pdf-lib → verify. Covers the A4 canvas spec, table construction, the `FIELD · ` naming convention, brand treatments for forms, both export routes, the coordinate transform, and a five-check verification table.
- **`scripts/build-pdf-form.mjs`** — parameterised field stamper. Places AcroForm text fields and checkboxes at exact coordinates, embeds Azm X for field text, and validates the spec before writing. Supports `--expect` (hard-fail on field-count drift), `--flatten`, `--font`, and `--size`.
- **`scripts/extract-figma-fields.js`** — pulls every `FIELD · ` rectangle out of a Figma design and emits the JSON spec, warning on duplicate ids, non-snake_case names, and off-spec frame sizes.
- **`scripts/package.json`** — declares `pdf-lib` and `@pdf-lib/fontkit`. Run `npm install` inside `scripts/` once before first use.

### Changed

- `SKILL.md` — frontmatter description now triggers on printed A4 documents and fillable PDF forms; the reference index points to `references/pdf-forms.md`.
- `.gitignore` — ignores `scripts/node_modules/` and `scripts/package-lock.json`.

### Findings worth keeping

- **Use 24 px form rows, not 32 px.** A 32 px row is the intuitive choice for Acrobat, but on a dense A4 form it overflowed all three pages (−254 / −166 / −90 px) and forced multi-column grids and paired sections that broke fidelity with the source document. At 24 px (≈ 8.5 mm, a standard field height) the faithful single-column layout fits with 18 / 54 / 55 px clearance. Row height is a cheaper lever than layout compression — reach for it first.
- **Design A4 at 595 × 842 px.** That maps 1:1 onto A4 in PDF points, so Figma coordinates become PDF coordinates with no scale factor anywhere in the pipeline.
- **Acrobat's "Prepare Form" auto-detect is never needed.** The designer already knows every field rectangle, so fields are placed deterministically with readable names instead of `Text1…Text47`.
- **`setFontSize()` must follow `addToPage()`** in pdf-lib, or it throws `No /DA (default appearance) entry found`. This is the most likely error in the pipeline.
- **Node resolves bare imports from the importing file**, so `scripts/` needs its own `node_modules`; installing pdf-lib in your working project is not enough.

---

## v1.1 — 2026-07-20

### Changed

- **Chevrons banned as backgrounds** (owner decision). No oversized ghost chevrons bleeding off corners, no navy-on-navy or low-opacity chevron field textures, no concentric chevron arc backdrops, no chevron art behind content. Backgrounds stay clean: solid surface, or gradient on event surfaces only. Where a layout feels empty, the answer is negative space.
- `references/icons.md` added — the Phosphor icon system, with icons confined to functional UI and kept off editorial brand surfaces.

---

## v1.0 — 2026-07-20

Initial release. Colour palette and ramps, typography rules, the chevron system, layout essentials, logo variants, Azm X and thmanyah serif display font files, the email design system, the voice and tone guide, and the 242-image brand library with its index and recolour prompts.
