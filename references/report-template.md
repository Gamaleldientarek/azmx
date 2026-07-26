# Colab — Usability-Report Template System

The componentized 31-slide usability-testing report template, built on the V2 design language. Lives on the `03 · Report Template` page of the Colab Design System file. Everything here is component-first: repeating elements are instances, variant deltas are paint-only, and all fills/fonts bind to variables.

---

## Page anatomy

| Section | Contents |
|---|---|
| ⚠️ Old Slides — legacy | 24 legacy frames + "NEW ·" comparison copies + dated locked archives of replaced slides |
| 01 · Atoms | `Severity Glyph` set (Level × Ground, 10 variants) · 20 `Icon / *` Phosphor masters (32×32) · chips |
| 02 · Molecules | All content components, arranged in 5 labeled bands (Cards & Tiles · Rows & Ledgers · Chips & Micro · Devices & Panels · ⚠️ Review) |
| 03 · Tables | Table primitives |
| 04 · Slide Chrome | `Footer Bar` set — Ground = Dark / Light / Bright |
| 05 · Masters | Slide masters |
| 06 · Example Deck | The filled 31-slide example report + lettered option frames (e.g. `03b`, `20b`, `25a`, `28b`) |

Option frames sit beside the deck grid with a letter suffix and the *same* footer page-num as the slot they compete for; the deck is renumbered only after the client picks a winner.

## Component catalog (variant axis → variants)

| Component | Size | Axis · variants | Instance overrides |
|---|---|---|---|
| Severity Glyph | 32 | Level: Positive/Low/Medium/High/Critical × Ground: Dark/Light | — (swap variant) |
| Icon / * (×20, Phosphor) | 32 | — | tint vectors via fill binding |
| Footer Bar | 1840×73 | Ground: Dark/Light/Bright | page-num, titles, date text |
| Finding Card | 800×88 | Tone ×3 | title/body text |
| Insight Tile | 562×190 | Severity ×3 | num, title, body text |
| insight-card | 562×190 | Severity ×3 | texts |
| Area Card | 840×280 | Tone: Positive/Critical/High | finding-title, finding-body |
| Category Block | 520×200 | Tone: Pine/Orange/Olive | cat-label + 2 cat-body texts |
| Feedback Block | 760×440 | — | number, title, body, chip |
| Score Card | 562×190 | — | label/value/caption text · value fill · icon swap |
| Numbered Item | 780×120 | Ground ×2 | number, title, body |
| Step Item | 1300×150 | — | number, title, body |
| Insight Row | 1520×100 | — | agenda-number, item-body |
| Highlight Row | 562×88 | Severity: Positive/Critical/Warning | finding-text |
| Finding Ledger Row | 1734×64 | Severity: Positive/Major/Critical | num, title, evidence |
| Finding Module | 635×114 | Severity ×3 (light grounds) | num, title, evidence |
| Baseline Stat | 420×140 | Tone: Standard/Critical | stat-value, stat-label |
| AB Results Panel | 460×600 | Verdict: Lead/Trail | kicker, tag-label, 3 result texts |
| Device / Phone | 300×620 | — | screenshot via sibling screen-clip |
| Device / Laptop | 980×560 | — | screenshot via sibling screen-clip |
| tag | hug×28 | Tone: Ghost/Electric | label |
| Cat Chip · Eyebrow · Meta Field · Legend Item · Stat Rule Block · Annotation Item · Field Square · Ledger Row · Colophon Row · Severity Addend | micro | various | texts |

## Approved slide patterns

Named compositions the client has approved; reuse them before inventing new ones.

1. **The Counted Field** — the slide *is* the dataset: every insight rendered as a real 24px module (orange = critical, Electric = major, Electric@24 = minor), the hero numeral carved out of the field's void; a thin hairline ledger of secondary stats on the left. Nothing on the slide is a container.
2. **The Severity Ledger** — full-width editorial ledger rows (1734×64) on Deep Jade: 40px Black index, severity glyph, one-line finding, one-line evidence, right-aligned severity word. Column heads in 12px caps; rows flush at 64px pitch with baked hairlines.
3. **The Establishing Shot** (study overview) — mixed-ink 100px title; prose column with a counted module field beneath it; ONE giant numeral (320px Black, Electric) in a floating Deep Jade panel right; full-measure audit rule; the n=8 disclosure; then a flush 4-unit `Baseline Stat` strip with hairline dividers and sibling icons.
4. **The Verdict Slide** (A vs B) — two `Device / Phone` mockups at H600 with cover-fit screen clips, each paired with an `AB Results Panel`; Lead carries the only Electric in the content zone, Trail dims to White@70 with orange caution markers; the title states the verdict.
5. **Device evidence** — one phone or laptop instance with a screen-clip sibling (clip = component screen rect exactly; screenshot cover-fit, header-biased crop), agenda-numbered observations in the text column.
6. **Giant-numeral stat panel / baseline strip / numbered ladder / data skyline / mixed-ink title** — transferable V2 moves; see `decision-law.md` taste profile.

## Screen-clip recipe (device mockups)

1. Place the device instance; rescale to target height (rescale, not resize — children must scale).
2. Read the component-local `screen` rect (x,y,w,h,r) from the placed instance.
3. Create a sibling frame directly above the instance: position = instance + screen offset, size = screen exactly, clipContent ON, radius = screen radius.
4. Clone the screenshot into the clip; cover-fit (scale = clip.w ÷ shot.w; if scaled height ≥ clip height, centre vertically with the extra pixel cropped bottom — preserves the app header; else scale by height and centre horizontally).
5. Never detach the device; never place the screenshot inside the instance.

## Reporting conventions

- Counts before percentages at n<10; the verbatim n=8 disclosure line on stat-bearing slides.
- SUS 69.4 = grade C (marginal) — flagged orange as below target; SEQ benchmark ≥5; completion target stated in caption.
- GEO MEAN (never "Avg") for time-on-task.
- Participants `P01`–`P08`; tasks `Task 01`; placeholders `Client Name` / `Project Name` / `Month 2026`.
- Severity: 3-level reporting ladder (Low/Medium/High) + Positive + Critical for the glyph system.
