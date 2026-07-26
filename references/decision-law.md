# Colab — Decision Law

Standing client decisions, in force for all Colab work. These override any inference from the Figma file or from older references in this skill. Numbered entries mirror the project's constraint log (C-01…C-17); unnumbered entries are standing rules locked during the report-template build.

---

## Colour

**C-01 · Readability outranks expression — decks go to CEOs.** Default slide grounds are Pine Green `#103A21` or White. Electric Green is never a surface behind body text; as a flood it is limited to covers, dividers, and minimal-text slides, and takes Deep Jade text.

**C-01b · HARD BAN — Electric `#34FF67` and Jade `#33FFC2` never appear on a white or light ground.** Not as text, icons, decorative blocks, rules, number accents, or chip fills. On light grounds the accent role is played by Pine Green, Olive Green `#5B6B3E`, or Leaf Green `#066120` (positive ink). Enforceable check: audit every light-ground frame for fills bound to the Electric or Jade tokens — expected result, zero.

**C-01c · Charcoal Navy is banned.** Removed from the system entirely. The ground family is all-green: Pine `#103A21` (primary dark) · Deep Jade `#011E14` (deepest — high-drama slides; a client favourite) · White · Off-white `#F9FAFB` · Electric flood (covers/dividers only). Decks must rotate grounds, never run one ground throughout.

**Vivid Orange `#FF5A32` floors.** Never body text. As text: ≥20px Bold only (large-text contrast pass on dark grounds). As non-text glyphs/markers: permitted where ≥3:1 on the ground (4.10:1 on Pine, 5.65:1 on Deep Jade). Orange is severity-true — it appears only where something is critical or below target, never as decoration. One orange headline stat per slide maximum.

**Severity is ink-density, not hue.** The palette is green-heavy, so severity encoding survives colour-blindness through form: ring ○ = Positive · outline = Low · checker ▨ = Medium/Major · solid ■ = High · solid+× = Critical. Colour reinforces (Electric positive on dark / Leaf on light · Olive-300 `#A8B294` major on dark / Olive on light · Orange critical), form carries.

## Layout

**C-03 / C-09 · `Advanced Presentation` grid governs new work.** 16:9, 1920×1080. The 37 approved V2 slides stay frozen on their legacy grid as a *style* reference only — never rebuild them from new masters.

**V2 DNA (locked visual language for the report template):** left spine x93 · content floor y≤950 (footer only below) · right limit x+w≤1880 (content column ends 1827) · titles 100/200px Bold (tracking −2.5%, LH 0.90) · 50px Light eyebrows · 24px-module constellation dither, dense edge top-right, `p(d) = 0.04 + 0.66·d^2.2`, never below y950 · hairline rules at White@12–30 · radius 0 and zero effects on dark editorial slides.

**Logo appears in the footer only.** Never a second logo in a header or corner. Footer bar is a component instance at (40, 960), 1840×73, with a Ground variant per slide ground; the page-number layer is named `page-num` everywhere and matches the slide's number prefix.

## Type

**C-11 · `Typography/*` is the canonical scale** (Display 0.95 LH, Body 1.16 LH); the old `Font-size/*` groups are deprecated. Weights relaxed: Regular/Medium/SemiBold sanctioned alongside Black/Bold/Light. **C-14 · Inter (EN) and Alexandria (AR) are the only fonts** — Jura, Poppins and other strays are leftovers, never carried forward.

**Tracking system (Inter dynamic metrics):** −2.5% at ≥100px · −2.2% at ≥40px · −1.7% to −2.0% at body sizes · positive tracking on all-caps labels (+4% typical, +6% at 12px). Arabic line-height floor 1.5 — never share a line-height token across EN and AR.

**Font variables:** every text node binds fontFamily (Display-Font vs Body-Font), fontStyle (font-weights/*) and — on exact scale matches — fontSize (Typography/*). Display-Font applies at ≥60px, or ≥40px when Bold/SemiBold/Black.

## Components & variables

**C-05 · Variables are the source of truth.** All new work binds fills to colour variables and instantiates components — no raw hex, no detached instances, no loose text.

**C-15 / C-16 · Logo = 7 lockups × 3 colours (Pine, Electric, White); Arabic is one lockup, not an axis. Shapes get a Colour property, no wide variants.** Bounding boxes constant per lockup so colour swaps never shift layout.

**Component variants must share identical geometry.** Inside an instance only text characters and fills can be overridden — child positions and sizes cannot. Variant deltas are therefore paint-only (alpha toggles) or nested-instance swaps. This is the single most important component-design law in the system.

## Icons

**C-04 · Phosphor is the standard for documents and the report template** (client-stated; line/outline style). Phosphor Figma imports are flattened fill paths — bind colour to `fill`. The legacy Brand Book placements are Hugeicons (live strokes — bind `stroke`); both sets coexist in the file. New report-template work uses the `Icon / *` Phosphor-derived masters. Resize icons with the W/H fields (24/28/32/40/48), never the Scale tool; never flatten; never detach.

## Report content

**C-17 · The report template is generic and international-standard.** Exactly the legacy section scope; English first, AR later; Figma-only delivery; master set + one filled example deck. Every real client name, project name and person name is stripped — placeholders are `Client Name`, `Project Name`, `P01`–`P08`, `Task 01`, `Month 2026`.

**Counting law (n<10):** counts before percentages — "6 of 8", never "75%". The disclosure line is non-negotiable on stat-bearing overview slides: *"n = 8 · Counts are reported rather than percentages — a sample this size does not support percentage claims."* SUS reports its grade honestly (69.4 = grade C, marginal); geometric mean — labelled GEO MEAN, not Avg — for time-on-task.

## Taste profile (what the client approves and rejects)

- **Approves:** giant display numerals; editorial full-width ledger rows; data-as-motif (counted fields where every module is a datum); Deep Jade grounds; mixed-ink titles (White + Electric spans in one line); flush baseline stat strips; generous but *filled* space.
- **Rejects:** pastel dashboard tints; uniform card-grid monotony; empty boxes; navy; decoration without data; dead space in the lower third of a slide; duplicated logos; headers carrying project names.
