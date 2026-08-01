# Decision Log

Standing decisions and known defects. **This file overrides anything older**, including the two build guides that shipped with the v1 deck.

Two kinds of entry: **decisions** (settled, apply them) and **defects** (found in the v1 deck, fix them when you touch that slide). Where a written guide contradicts an entry here, this file wins — in one case (D-01) the guide's own recommendation is measurably wrong.

Audit date: 2026-07-29, against `Majarah Library` / `Playground`, all eighteen frames read via the Desktop Bridge.

---

## D-01 — DEFECT · Two invisible headlines

Two slides set the accent half of a two-tone headline in `Purple/900` on a mid-purple ground:

| Slide | Text | Set to | Ground | Measured |
|---|---|---|---|---|
| 07 | `TO A SUSTAINABLE PLATFORM.` | Purple/900 | Purple/500 | **1.55:1** |
| 11 | `ONE TRAJECTORY.` | Purple/900 | Purple/600 | **1.28:1** |

Both are visually confirmed — the headline reads as a dark shadow, not as text.

**Fix slide 07 to White** (11.35:1). The written guide agrees.

**Fix slide 11 to White** (13.73:1). ⚠ **The written guide says Purple/300 here, and the guide is wrong** — Purple/300 on Purple/600 measures **1.78:1**, which is worse than nothing. If you want a non-white accent on Purple/600 the only option is Purple/200 at 4.44:1. This is the clearest reason to trust `colors.md` over the prose guides.

Root cause: the two-tone headline pattern is described in the guides by *role* ("line 2 is the accent") without the ground-dependent colour table. Whoever built these two slides applied the pattern and picked a purple. `colors.md` §4 now states the accent colour per ground explicitly.

## D-02 — DECISION · Oswald replaces Helvetica for display

The brand book specifies Helvetica for display type. The deck uses **Oswald**, at the client's request, because condensed forms hold at 180–200pt where Helvetica sprawls past the measure.

**Keep Oswald** for decks and large-format editorial. **Revert to Helvetica** for anything a brand-compliance reviewer will audit, or co-branded work where MUD or AZM X is checking. **Ask** for new surfaces (web, email, signage) — the deck precedent does not automatically carry.

Full reasoning in `typography.md`.

## D-03 — DEFECT · Chrome inconsistency

Two chrome elements drifted:

**Footer credit y-position**, and it is missing entirely from the cover:

| Slides | Footer y |
|---|---|
| 01 | **absent** |
| 02, 03 | 990 |
| 04, 05 | 1020 |
| 06–15 | 1030 |
| 16 | 1020, centred |

Standardise on **y=1030** and add one to the cover.

**Progress dots exist on one slide of sixteen.** Both written guides describe an 8-dot strip bottom-right as standard chrome across slides 03–15, with filled/unfilled signalling position. Only slide 16 has it (eight White dots at y=1052, x=1700–1798).

Decide one way and hold it. Recommendation: **drop the dots from the spec.** Sixteen slides do not need a progress indicator, the deck already has `NN / 16` top-left doing that job, and a per-slide filled-count is a maintenance liability every time a slide is inserted. Remove the strip from slide 16 and delete the convention from the guides.

## D-04 — DECISION · No white grounds; lavender instead

Slides 09 and 15 were originally white. The client rejected it — "white is bad" — and they became `Purple/200` lavender.

**Never use a raw white ground for a Majarah deck.** Lavender is the light option; it keeps the brand hue while reading as a lift. This applies to decks specifically; white is fine for web and documents, where `Purple/300` also becomes a usable text colour (7.72:1).

## D-05 — DECISION · Slide 09 in ALL CAPS

Explicit client requirement: the manifesto carries maximum visual weight. Do not revert to sentence case.

The two-act structure (I. WHAT WE ARE NOT / II. WHAT WE BUILD) was a build-time decision and it works — the negation is quieter in both size (84pt vs 116pt) and contrast (Purple/600 at 4.44:1 vs Purple/900 at 5.70:1), so the affirmation grows louder than the denial. Keep the asymmetry if you rework this slide.

## D-06 — DEFECT (structural) · No text-style layer

The file has **zero** text styles, so `fontSize`, `lineHeight` and `letterSpacing` have nowhere to bind and have drifted. Colour and font family/weight, which *are* bound to variables, held at 100%.

Evidence — fractional values that no one types:

`51.096771240234375pt` · `443.10345458984375pt` · `945pt` · `995pt` · tracking `-10.8`, `-12.4`, `-5.5`, `-2.8`

**These are the fingerprint of a Scale-tool drag on a group.** Treat any fractional size or tracking as a signal that the surrounding layout is compromised.

The highest-leverage fix available to this system is **adding eight text styles** — cover headline, section headline, body headline, card title, body, eyebrow, chrome, stat numeral — bound to the existing font variables. That closes the gap without touching what already works. See `variable-architecture.md`.

## D-07 — DEFECT · Slide 02 stat row collapsed

The `AnalyticsRow` frame is **289 × 60** where it should be ~1000 wide. Everything nested scaled with it:

| Element | Is | Should be |
|---|---|---|
| Stat numeral | 51.1pt | **88pt** |
| Stat label | **6.4pt** | **11pt** |
| Frame width | 289 | ~1000 |
| AL gaps | 23.2258, 4.6452 | 40, 12 |

At 6.4pt the labels (`MEETUPS`, `ATTENDEES`, `VISION`) are illegible on screen and gone on a projector. Visually confirmed.

Rebuild the row at spec sizes; do not scale it back up, because scaling will not restore integer values. Set the frame width and each type size explicitly.

## D-08 — OPEN · Slide 08 has three live versions

| Frame | Node | Position | Concept |
|---|---|---|---|
| 08 (current) | `9:672` | y=0 | Centred stack with inline mega `#1` — `#` 200pt beside `1` 460pt |
| 08a | `9:759` | y=1180 | Original side-by-side, `1` at 880pt, region tier list right |
| 08b | `9:1215` | y=2360 | Constellation — orbital rings, glow, coordinates, three tier markers |

**Still Jimmy's call.** Recommendation: **keep 08 (v2).** The inline `#1` makes the number the typographic climax mid-sentence, which is the strongest idea of the three and the most consistent with the deck's editorial logic. 08b is the most decorated and the least like the rest of the deck. Delete the two alternates once decided — they are live frames, not hidden, and will confuse anyone opening the file.

## D-09 — DEFECT · Copy drift from the guides

| Slide | File says | Guides say |
|---|---|---|
| 04 | `FIRST` / `FOUR.` | `THE FIRST` / `FOUR.` |
| 06 | `We don't attend Majarah,` (comma) | `We don't attend Majarah —` (em dash) |

Minor, but the missing article on slide 04 weakens the line. Restore `THE FIRST`.

## D-10 — DEFECT · Slide 06 ghost and cards drifted

**Ghost:** `VOICES` is 443.1pt at (168, 419) against a spec of 320pt at (120, 220). It now sits directly behind the hero quote instead of above it, so the quote competes with it rather than sitting clear.

**Voice cards:** quote measures are 162–187px wide against a 400px spec, and the cards moved to x=1413–1733 (spec 1280–1420). At 16pt in a 44px-tall box the text overflows its frame. They are also jammed against the right margin.

Rebuild both at spec. The fractional 443.1pt confirms a scale drag (D-06).

## D-11 — DEFECT (content risk) · Unsourced content

Content in the deck that appears in **no** source document — not the brand book, not `Majarah Community.docx`:

| Slide | Content | Problem |
|---|---|---|
| 06 | Hero quote attributed to **RANA A., PRODUCT DESIGNER** | Named person, invented attribution |
| 06 | Four testimonials: **KHALID M., NOURA S., TAREQ H., DANA R.** | Named people, invented attribution |
| 15 | `16` / `CITIES IN ORBIT` | Contradicts slide 14, which lists four cities |
| 16 | `LINKEDIN / X — Majarahux` | The docx has X as `Majarah_sa`; only LinkedIn is `Majarahux` |

The docx has a "Straight from the Room: Majarah Attendees Speak" heading and a video link — real testimonials exist on video but were never transcribed into the deck.

**Named quotes and statistics invented for a client deck are a live exposure.** Before this goes to AZM X or any external audience: source the quotes from the attendee video, or remove them and use the section for something factual. Fix the X handle and reconcile the city count either way.

## D-12 — DEFECT (minor) · Slide 16 logo variant

The hero logo is 1249 × 267 = the **Secondary** mark at rescale 2.4. The guides specify **Primary** (`1:343`), which at 2.4 would be ~802 × 266.

It is correctly centred either way and it looks fine. Decide which mark the closing slide should carry and record it; the wide Secondary arguably suits a full-width closing better than the compact Primary. Low priority.

---

## Housekeeping

Stray nodes to delete when convenient — see `slide-library.md` for IDs. An empty `Text` node sits on top of slide 01's origin; an unrelated 33947px `Figma Partnership` section sits below the deck row; the Components page carries a stray node named `fdf` and two loose rectangles.

## Pending from the v1 build

- [ ] Add galaxy / space backgrounds to slides — components exist in the library, unused in v1
- [ ] Resolve D-08 (which slide 08)
- [ ] Arabic version — see `rtl-arabic.md` for what that actually requires
