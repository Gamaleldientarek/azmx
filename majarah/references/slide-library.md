# Slide Library

All eighteen frames of the v1 Majarah Community deck, measured from the live file. Use this to lift a proven layout rather than compose a new one.

Page: `Playground`. Frames at `x = (N-1) × 2020`, `y = 0`. Node IDs below are stable in this file.

## Index

| # | Frame | Node | Ground | Archetype | Ghost |
|---|---|---|---|---|---|
| 01 | Cover | `4:25` | Purple/900 | A | — |
| 02 | About | `4:36` | Purple/900 | B | — |
| 03 | Meetups Divider | `4:48` | Purple/900 | C | `08` 760pt @ .12 |
| 04 | Meetups 01–04 | `4:83` | Purple/900 | D | `ARCHIVE` 320pt @ .32 |
| 05 | Meetups 05–08 | `4:132` | Purple/900 | E | `08` 720pt @ .32 |
| 06 | Community Voice | `5:246` | Purple/900 | J-variant | `VOICES` 443pt @ .35 |
| 07 | Part 02 Divider | `5:277` | **Purple/500** | C-variant | `02` 720pt @ .45 |
| 08 | The North Star | `9:672` | Purple/900 | centred | — |
| 09 | The Vision | `9:687` | **Purple/200** | J | `09` 1000pt @ .22 |
| 10 | Three Pillars | `6:383` | Purple/900 | F | — |
| 11 | Three Phases | `6:424` | **Purple/600** | G | — |
| 12 | Phase 01 | `6:462` | Purple/900 | H | `01` 940pt @ .32 |
| 13 | Phase 02 | `6:499` | Purple/900 | I | `02` 945pt @ .28 |
| 14 | Phase 03 | `6:541` | Purple/900 | H-variant | `03` 995pt @ .25 |
| 15 | Join Majarah | `9:709` | **Purple/200** | K | `JOIN` 357pt @ .22 |
| 16 | Contact Closing | `7:612` | Purple/900 | L | `ORBIT` 280pt @ .22 |
| — | 08a North Star v1 | `9:759` | Purple/900 | alt, y=1180 | — |
| — | 08b North Star v3 | `9:1215` | Purple/900 | alt, y=2360 | `#1` 520pt @ .55 |

**Slide 08 has three live versions.** v2 (`9:672`) is current; 08a and 08b sit below it on the canvas. The choice is still open — see `decision-log.md` D-08.

## Content spine

The deck argues a case in four movements. If you rebuild it, keep the movement structure — it is what makes it persuasive rather than a list.

| Slides | Movement | Job |
|---|---|---|
| 01–02 | **Establish** | Who Majarah is, at what scale |
| 03–06 | **Evidence** | Eight meetups happened; here is what people said |
| 07–09 | **Pivot** | From event to platform; the vision, in a manifesto |
| 10–14 | **Plan** | Three pillars, three phases, the deliverables |
| 15–16 | **Ask** | Join, and here is where to find us |

The two lavender slides (09 Vision, 15 CTA) are the emotional peaks and they sit at the end of the pivot and the start of the ask. That placement is deliberate: the manifesto earns the plan, and the CTA closes it.

## Slide notes

**01 Cover** — three lines at 180pt, third line accent. The only slide with no footer credit (a v1 omission, D-03). Carries `2026` / `VOL. I` bottom-right.

**02 About** — headline 140pt two-line. Right column is a two-paragraph mission at 22pt / lh 160% in a 720 measure. Stat row `8 / 1000+ / 1`. ⚠ The stat row is broken in v1 — see D-07.

**03 Meetups Divider** — the cleanest divider. Ghost `08` in Purple/300 at only 12% opacity, which is the lowest ghost in the deck and the most successful: it reads as atmosphere, not as a second element.

**04 Meetups 01–04** — four columns at 390 wide, gap 40. Headline is `FIRST` / `FOUR.` at 200pt (the largest headline in the deck). Both written guides say `THE FIRST` — the article is missing in the file (D-09).

**05 Meetups 05–08** — vertical stack of four 66px rows with chevrons. Headline `MOMENTUM.` / `BUILT.` at 160pt.

**06 Community Voice** — hero quote at 88pt sentence-case, four voice cards right, three stats bottom. ⚠ Two problems: the ghost was rescaled to 443pt and now sits behind the quote rather than above it, and the cards were squeezed to 162–187px against a 400px spec, overflowing their frames (D-10). ⚠ **The five named testimonials are not in any source document** (D-11).

**07 Part 02 Divider** — the chapter hinge, Purple/500 ground. Headline in three parts with a `/` pivot glyph. ⚠ Line 2 is Purple/900 at **1.55:1** — invisible (D-01). Should be White. Also breaks the margin: its frame sits at x=100, width 1775.

**08 The North Star** — centred manifesto with an inline mega `#1`: a `#` at 200pt beside a `1` at 460pt, both Purple/300. The typographic climax of the deck.

**09 The Vision** — the manifesto poster, archetype J, ALL CAPS at client insistence (D-05). Best-composed slide in the deck: the two-act structure, the recessive Purple/600 negation, and the White punch line all work.

**10 Three Pillars** — three 507px columns, numerals at 220pt alternating White / Purple/300 / White.

**11 Three Phases** — timeline, Purple/600 ground. ⚠ Line 2 `ONE TRAJECTORY.` is Purple/900 at **1.28:1** — invisible (D-01). Correct fix is **White**, not Purple/300 (which measures 1.78:1 here and is also invisible).

**12 Phase 01** — split hero with four deliverable rows. The cleanest of the three phase slides.

**13 Phase 02** — 2×2 card grid, four cards with REVENUE / VALUE tags. Ghost `02` at 945pt is the largest in the deck and has drifted to centre-right (spec: left bleed).

**14 Phase 03** — deliverables left, expansion cities right. `RIYADH 2026 → DUBAI 2027 → CAIRO 2028 → LONDON 2030`, London in Purple/300 as the moonshot marker. Titles are 15pt against an 18pt spec.

**15 Join Majarah** — CTA, lavender. Pill button 380×90 radius 45. Stat strip right. ⚠ `16 CITIES IN ORBIT` contradicts slide 14's four cities (D-11).

**16 Contact Closing** — centred hero logo at rescale 2.4. ⚠ Uses the **Secondary** mark (1249×267), not Primary as specified — correctly centred either way (D-12). The only slide carrying progress dots. ⚠ `LINKEDIN / X — Majarahux` is wrong for X, which is `Majarah_sa` (D-11).

## Stray nodes

Two things on the canvas that are not deck content and should be cleaned up:

| Node | What | Where |
|---|---|---|
| `5:245` | Empty `Text` node, 0×15 | Playground at 0,0 — sits on top of slide 01's origin |
| `9:784` | `Figma Partnership` section, 33947 × 2559 | Playground, y=5036 — unrelated to this deck |

Also on the **Components** page: a stray text node named `fdf` (`4:24`) and two loose rectangles (`3:5`, `69:3`).
