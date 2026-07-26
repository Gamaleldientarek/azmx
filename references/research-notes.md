# Colab — Research Brief
**Date:** 2026-07-26

---

## 1. Electric Green `#34FF67` — the contrast math

Computed per WCAG 2.x relative luminance (`C_lin = C/12.92` if `C≤0.03928` else `((C+0.055)/1.055)^2.4`; `L = 0.2126R+0.7152G+0.0722B`; ratio `= (L_light+0.05)/(L_dark+0.05)`).

| Pair | Ratio | Verdict |
|---|---|---|
| `#34FF67` on White `#FFFFFF` | **1.34 : 1** | ❌ Fails everything — including the 3:1 non-text/UI floor |
| `#34FF67` on Pine Green `#103A21` | **9.49 : 1** | ✅ AAA, all sizes |
| `#34FF67` on Charcoal Navy `#101938` | **12.84 : 1** | ✅ AAA, widest margin |

**This validates the client's stated rule.** Electric Green is an *accent-on-dark*, never a surface-on-light.

**Operational rules for the template**
- On **white/light grounds**: Electric Green may only be a large decorative block, thick accent bar, or abstract shape. Never text, never small UI, never thin icon strokes. Substitute **Pine Green** or **Olive Green** for any text/icon role.
- On **Pine Green or Charcoal Navy grounds**: Electric Green is fully usable down to body size — text, labels, fine icon strokes all clear AAA.
- **Charcoal Navy is the strongest partner** (12.84:1) if maximum flexibility at small sizes is needed.
- Green-fill badges/pills work with **Charcoal Navy text on Electric Green** (12.84:1).

**Precedent:** Cash App (saturated green on near-black) and Robinhood's 2024 rebrand (neon reduced to sparing pops on black/white/neutral, explicitly because saturated neon fails as a dominant surface) are the directly applicable models.

**Projector / video risk — flagged, not empirically tested.** `#34FF67` sits near the sRGB gamut edge at ~140° hue, in chroma-key green territory. Lamp-based projectors clip/hue-shift saturated greens; Zoom/Teams 4:2:0 chroma subsampling smears fine green detail. Thin green strokes and small green text degrade first. → Pressure-test the finished deck on a real conference-room projector **and** a recorded Teams/Zoom share before sign-off.

---

## 2. Phosphor Icons

| Fact | Detail |
|---|---|
| Weights | 6 — Thin, Light, Regular, Bold, Fill, Duotone |
| Authoring grid | 256×256, built to survive downscale to a 16px base |
| Figma library | Ships as **component sets with a weight variant property** |
| License | **MIT** — unrestricted commercial, no attribution |
| Count | ~1,248–1,512 unique (×6 weights). Moving target — verify live before quoting |

**Gotchas that affect us**
- Many Phosphor Figma instances are **flattened vector fills, not live strokes**. Binding a colour variable to `stroke` does nothing → **bind to `fill`**. Audit before wiring to Colab colour variables.
- **Duotone** = two overlapping shapes (full-opacity foreground + reduced-opacity background). One variable swap recolours only one layer. Needs a dedicated two-tone token pair.
- **Thin/Light vanish at display sizes** (200px+) — use Regular/Bold large, reserve Thin/Light for dense grids ≤32px.
- **Bold/Fill clog below ~16px** — compounds the green-on-white contrast problem.

**Coverage for UX-research subject matter — no gaps.** Candidate mappings (verify exact names in the live library):

| Concept | Candidates |
|---|---|
| Usability testing / session | `flask`, `clipboard-text`, `check-square-offset` |
| Participants / recruitment | `users-three`, `user-plus`, `identification-card`, `user-circle-check` |
| Eye-tracking / attention | `eye`, `eyeglasses`, `target`, `crosshair` |
| Surveys / forms | `list-checks`, `clipboard-text`, `note-pencil` |
| Analytics / reporting | `chart-bar`, `chart-line-up`, `presentation-chart`, `magnifying-glass` |
| Moderation / interviews | `microphone`, `chat-circle-text`, `video-camera`, `headset` |
| Panel / reach | `globe`, `map-pin`, `users-four` |
| Session recording | `monitor-play`, `record`, `screencast` |
| Methodology / process | `flow-arrow`, `tree-structure`, `funnel` |

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
- Exact Phosphor icon count and per-weight stroke values
- Alexandria vs Inter numeric metrics — measure directly
- Arabic expansion percentage — test with real copy
- No primary competitor decks obtained
- Projector degradation of `#34FF67` inferred from gamut/codec behaviour, not directly tested
