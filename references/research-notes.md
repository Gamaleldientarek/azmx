# Colab — Research Brief
**Date:** 2026-07-26

---

## 1. Electric Green `#34FF67` — the contrast math

Computed per WCAG 2.x relative luminance (`C_lin = C/12.92` if `C≤0.03928` else `((C+0.055)/1.055)^2.4`; `L = 0.2126R+0.7152G+0.0722B`; ratio `= (L_light+0.05)/(L_dark+0.05)`).

| Pair | Ratio | Verdict |
|---|---|---|
| `#34FF67` on White `#FFFFFF` | **1.34 : 1** | ❌ Fails everything — including the 3:1 non-text/UI floor |
| `#34FF67` on Pine Green `#103A21` | **9.49 : 1** | ✅ AAA, all sizes |
| `#34FF67` on Deep Jade `#011E14` | **13.07 : 1** | ✅ AAA, widest margin |

**This validates the client's stated rule.** Electric Green is an *accent-on-dark*, never a surface-on-light.

**Operational rules for the template**
- On **white/light grounds**: Electric Green may only be a large decorative block, thick accent bar, or abstract shape. Never text, never small UI, never thin icon strokes. Substitute **Pine Green** or **Olive Green** for any text/icon role.
- On **Pine Green or Deep Jade grounds**: Electric Green is fully usable down to body size — text, labels, fine icon strokes all clear AAA.
- **Deep Jade is the strongest partner** (13.07:1) if maximum flexibility at small sizes is needed.
- Electric Green floods work with **Deep Jade text** (13.91:1) — the best available pairing.

**Precedent:** Cash App (saturated green on near-black) and Robinhood's 2024 rebrand (neon reduced to sparing pops on black/white/neutral, explicitly because saturated neon fails as a dominant surface) are the directly applicable models.

**Projector / video risk — flagged, not empirically tested.** `#34FF67` sits near the sRGB gamut edge at ~140° hue, in chroma-key green territory. Lamp-based projectors clip/hue-shift saturated greens; Zoom/Teams 4:2:0 chroma subsampling smears fine green detail. Thin green strokes and small green text degrade first. → Pressure-test the finished deck on a real conference-room projector **and** a recorded Teams/Zoom share before sign-off.

---

## 2. Hugeicons — the library the file actually uses

**Correction, 2026-07-26.** This section previously described Phosphor. That was an assumption made before the Figma file was audited, and it was wrong. Resolving every remote instance across all 8 pages found **1,272 Hugeicons placements and zero Phosphor**. The owner's decision: Hugeicons is the real system, the docs were the error. Everything Phosphor-specific below has been replaced.

| Fact | Detail |
|---|---|
| Variant axes | **2, not weights** — `Type` (Rounded / Sharp / Standard) × `Style` (Stroke / Solid / Duotone / Twotone / Bulk) |
| Authoring grid | 24×24, 1.5px stroke, round caps and joins |
| Figma library | Component sets with `Type` and `Style` variant properties |
| Licence | **MIT for Stroke Rounded only** (`@hugeicons/core-free-icons`). All other styles and types are Pro |
| Count | 5,437 free icons at `@hugeicons/core-free-icons@4.2.3`; 54,000+ across the Pro tier |
| Vendored here | All 5,437 free icons, `assets/icons/stroke-rounded/`, ~5.5 MB |

**What the audit found**

| Axis | Result |
|---|---|
| `Type=Rounded` | **1,272 / 1,272.** Sharp and Standard: zero |
| `Style=Stroke` | Every icon except four |
| `Style=Solid` | `checkmark-circle-01`, `multiplication-sign-circle`, `cancel-circle`, `stars` — all filled status/affirmation glyphs |
| Distinct icons | 43 |

Both of those are now house rules, not observations. See `references/icons.md`.

**Gotchas that affect us**
- **Hugeicons Stroke instances are live strokes, not flattened fills.** Bind colour variables to `stroke`. This is the exact opposite of the Phosphor advice that was previously in this repo, and following the old advice silently does nothing.
- **Solid instances have no stroke** — bind to `fill`. Check the style before wiring the variable.
- **Flattening destroys the binding** and the stroke-weight step. Never flatten.
- **Scaling multiplies stroke weight.** Resize with W/H, then set stroke weight explicitly per size step.
- **The Duotone/Twotone two-tone token problem still applies in principle** — two overlapping shapes, one variable swap recolours one layer, so a two-tone token pair would be needed. It is moot for Colab: both styles are Pro and both are banned by the Rounded/Stroke house rules.
- **Thin strokes at small sizes compound the green-on-white contrast failure.** A 1.5px Electric Green stroke is the most fragile mark in the system; it is banned on light grounds outright and floored at 3px on any projected dark surface.

**Licence constraint — verified, and it binds.** The free tier is MIT and covers Stroke Rounded only. Solid, Duotone, Twotone, Bulk, Sharp and Standard require a Hugeicons Pro licence and are **not redistributable**. Colab work ships to enterprise clients, so no Pro asset may be committed to this repository or placed in a deliverable without a licence. The four Solid glyphs above are therefore documented as Pro-tier and substituted — Stroke equivalent, or a composed filled circle plus a free stroke glyph.

**Coverage for UX-research subject matter — no gaps.** These names are verified against the vendored set, not guessed:

| Concept | In the vendored set |
|---|---|
| Usability testing / session | `test-tube-01`, `clipboard`, `checkmark-square-01` |
| Participants / recruitment | `user`, `user-account`, `user-multiple`, `user-add-01`, `id` |
| Eye-tracking / attention | `eye`, `view`, `view-off`, `target-01`, `crosshair` |
| Surveys / forms | `quiz-03`, `check-list`, `note-edit`, `task-01` |
| Analytics / reporting | `chart-line-data-02`, `analytics-01`, `presentation-01`, `search-01` |
| Moderation / interviews | `mic-01`, `bubble-chat`, `video-01`, `customer-service-01` |
| Panel / reach | `global`, `location-01`, `user-group` |
| Session recording | `record`, `screen-add-to-home`, `camera-video` |
| Methodology / process | `flow`, `hierarchy-square-01`, `filter` |
| Timing / effort | `stop-watch`, `clock-01`, `time-quarter` |

---

## 3. Bilingual EN / AR

**Alexandria** — variable font, Thin→Black (9 weights), harmonized Latin + Arabic drawn together. Shipped in the **UAE government design system** as the secondary Arabic face — strong validation for a Saudi/MENA client. Avoids the classic bilingual failure of two faces whose "Bold" feels different.

**Metrics — do not assume parity.** No authoritative x-height/cap-height comparison between Alexandria and Inter was found. Measure both at the same point size in Figma and set Arabic slightly larger if needed.

**Line-height — do not share one token across EN and AR.** Arabic needs more vertical room (diacritics, connectors, Kufi-influenced forms). The UAE system's floor is **1.5× for body**, applied universally. Our current `Typography/line-height/body/*` runs at **1.16×** — that is too tight for Arabic and likely too tight for Arabic body copy at any size. Give AR text styles their own larger line-height.

**Text expansion — estimate, unverified.** Arabic typically runs ~10–20% *shorter* in character count but needs *more vertical* space. Don't assume it fits where English fit. Test with real client copy.

**What breaks on RTL mirror**
- Auto-layout direction, padding, alignment — icon+label pairs, numbered lists, progress indicators
- **Directional icons must flip** (arrows, chevrons, next/back). **Logos and charts must NOT flip** — a mirrored wordmark is the classic embarrassing bug
- Numerals stay LTR inside RTL flow → mixed-direction lines cause cursor/selection bugs (Figma documents this)
- Asymmetric components (card with coloured left border), shadow offsets, stroke-side padding need mirrored equivalents

**Recommended Figma approach**
- **Variable modes** (`EN` / `AR`) for font-family, line-height, alignment — the collection already has this. One component set serves both.
- **Component variants** with a `language` property on text-bearing components — not duplicated masters.
- **Separate pages only at deck level** (EN Deck / AR Deck instantiating shared components) — never at component level, or the two drift.
- Plugins exist (Aura RTL, RTL Layout, RTL Converter) — trial on 3–4 masters before deciding to hand-build.

---

## 4. Category conventions — UX research labs

*Synthesized from public positioning/product pages; no primary sales decks obtained. Directional.*

**Five slide masters that recur across virtually every competitor** — these should be first-class components, not one-offs:

1. **Methodology grid / taxonomy** — Maze and Optimal Workshop both structure everything method-first (moderated/unmoderated, card sorting, tree testing, surveys, diary studies, eye-tracking)
2. **Panel stats big-number layout** — "big number + granularity" is the convention (Respondent: 3M panel, 500M+ reach, 150+ countries, 146 industries, 689 occupations; Optimal Workshop: 80M+). Directly reusable for Colab's MENA/Saudi panel story
3. **Sample report / deliverable screenshot frame** — buyers expect to *see the artifact* (heatmap, session recording, tagged repository), not hear it described
4. **Logo wall + case-study lift stat** — case studies lead with one quantified outcome (conversion lift, time-to-insight, cost saved, SUS/NPS delta), before/after framing. Pair the client logo wall with a single quantified result per logo rather than a descriptive paragraph
5. **3-tier pricing** — self-serve / team / enterprise, "most popular" badge, feature ladder

**Enterprise trust slide** (SOC 2, SSO, RBAC, named logos) is table stakes in this category.

---

## Flagged as unverified
- ~~Exact Phosphor icon count and per-weight stroke values~~ — resolved. The library is Hugeicons, not Phosphor; 5,437 free icons at `@hugeicons/core-free-icons@4.2.3`, one stroke value (1.5px at 24px), no weight axis
- Alexandria vs Inter numeric metrics — measure directly
- Arabic expansion percentage — test with real copy
- No primary competitor decks obtained
- Projector degradation of `#34FF67` inferred from gamut/codec behaviour, not directly tested
