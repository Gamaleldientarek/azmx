# Editorial Technique

The moves that make a Majarah slide look Majarah. Six named techniques, all measured from the v1 deck.

This brand has almost no graphic language — no icon set, no illustration style, one logo, and a decorative image library that went unused. **The type is the design.** That means the technique below carries the whole visual identity, and executing it loosely is what makes work look off-brand.

---

## T-01 · Two-tone headline

The house move. A headline split across two lines, the first in the primary text colour, the second in an accent.

```
Line 1   Oswald Bold 110–200pt   lh 92–95%   ls -2 to -10   White
Line 2   Oswald Bold 110–200pt   lh 92–95%   ls -2 to -10   accent
```

The accent colour is **ground-dependent** and this is where it goes wrong:

| Ground | Accent line | Ratio |
|---|---|---|
| Purple/900 | Purple/300 | 2.28 — display licence |
| Purple/600 | **White** | 13.73 |
| Purple/500 | **White** | 11.35 |
| Purple/200 | **White** | 3.09 |

**Purple/300 is only correct on the darkest ground.** Two v1 slides got this wrong (D-01), and one written guide gets it wrong too.

Why it works: the eye reads the tonal drop as emphasis landing on the second phrase — `A COMMUNITY` / **`IN ORBIT.`** The accent is the payload. So put the *meaningful* half on line 2, not the grammatical remainder. `THE FIRST` / `FOUR.` works; `FOUR.` / `THE FIRST` would not.

Line spacing is roughly **0.85 × font size** — at 180pt the baselines sit 170px apart, at 140pt 140px, at 110pt 110px. Tighter than that and the descenders collide; looser and the two lines stop reading as one block.

## T-02 · Ghost text

Massive type behind the content, providing depth without adding an element.

```
Oswald Bold 280–1000pt
ls -4 to -30
lh 80–90%
Purple/600 @ 0.22–0.35   (dark ground)
White      @ 0.18–0.22   (lavender ground)
Purple/300 @ 0.12        (when you want hue, not mass)
```

Four rules that separate a ghost from a mistake:

1. **It sits behind.** `parent.insertChild(0, ghost)` — z-order, not opacity, does the work.
2. **It does not overlap the focal line.** Place it above, beside, or bleeding off an edge. Slide 06 in v1 violates this: the ghost was rescaled to 443pt and now sits directly behind the hero quote, so the quote fights it (D-10).
3. **Respect the opacity cap** — 0.35 on dark, 0.22 on light. Above that it stops being ambient.
4. **Bleeding off the frame is good.** Slides 05, 12, 13 and 14 all push the ghost past the right edge. A ghost that fits neatly inside the frame reads as a design element; one that runs off reads as a window onto something larger, which is the point.

The most successful ghost in v1 is slide 03's `08` — Purple/300 at only **12%**. The least successful is slide 07's `02` at **45%**, which is above the cap and competes with the headline.

Content: use the section number, a repeated motif word (`ARCHIVE`, `VOICES`, `ORBIT`, `JOIN`), or the count the slide is about. Never a word that carries new information — nobody is required to read it.

## T-03 · Mega anchor numeral

One number, enormous, as the composition's centre of gravity.

```
Oswald Bold 460–1000pt
ls -10 to -20
Purple/300 (dark ground)
```

Slide 08 is the reference: a `#` at 200pt set beside a `1` at 460pt, both Purple/300, positioned as a tight pair mid-sentence. `WE WILL BE` / `THE REGION'S` / **`#1`** / `UX COMMUNITY.` The number interrupts the sentence and becomes the climax.

Sizing the pair: the prefix glyph runs at roughly **0.4×** the numeral. Set the numeral first, place the prefix to its left, then nudge — the `#` optical centre sits slightly above the numeral's, so align by eye, not by bounding box.

This technique is expensive — it consumes a whole slide. Use it once per deck, at the single most important claim.

## T-04 · Eyebrow + accent rule

The system's smallest and most repeated unit. It appears on eleven of sixteen slides and is what makes the deck feel like a system.

```
Eyebrow      x=120, y=150–160   Helvetica Medium 13–16pt   ls +4   Purple/200
Accent rule  x=120, y=184–194   100 × 3px                          Purple/300
```

The rule sits **30–40px below** the eyebrow baseline. Width 100 as standard, 120 on covers and major dividers, 80 on sub-sections.

**The +4px tracking is not optional.** Without it a 14pt label reads as stray body text; with it, it reads as a system element. Every eyebrow in v1 carries +4.

Content: `SECTION 01 — ABOUT` · `MEETUPS 01 — 04` · `PHASE 02` · `OUR NORTH STAR` · `BE PART OF THE GALAXY`. Always caps, always short. The eyebrow tells you where you are; the headline tells you what is here.

## T-05 · Stat block

Numbers are analytics moments and get display treatment.

```
Numeral   Oswald Bold 60–116pt   ls -2   lh 85–90%
Label     Helvetica Medium/Light 11–12pt   ls +4   Purple/200   ALL CAPS
```

Stacked vertically, numeral over label, gap 8–12px. In a row of three, separate with **1 × 96 hairlines at Purple/200 @ 35%**, and set **one** numeral in Purple/300 so the row has a focal point — usually the largest or most impressive figure.

**Never below 60pt.** A stat at body size is not a stat, it is a sentence with a number in it. The v1 deck has one at 51pt with 6.4pt labels (D-07) and it is the clearest failure in the file.

Label wording: `MEETUPS` · `ATTENDEES` · `VISION` · `DESIGNERS REACHED`. Two words maximum. The numeral does the talking.

## T-06 · Numbered row / column list

For sequences — meetups, deliverables, phases.

**Column form** (4 across, archetype D): numeral 96pt Purple/300, title Oswald SemiBold 26pt White, meta row with a 6×6 dot and 13pt caption. Columns 390 wide, gap 40, hairlines between.

**Row form** (4 down, archetype E): numeral 56pt Purple/300, title Oswald SemiBold 28pt, meta 12pt, and a `▸` chevron in Purple/300 at the right edge. Rows 66px tall, gap 18, 1px separators at Purple/200 @ 25%.

The numeral is always the accent colour and always larger than the title it labels — that inversion (label bigger than content) is deliberate and it is what stops the list looking like a table.

---

## The amateur tells

What separates this system executed well from executed badly. Every item here was observed in the v1 file.

| Tell | Why it reads wrong |
|---|---|
| Fractional font sizes (`51.09`, `443.1`) | A scaled group. Nothing in the system uses non-integer type |
| Fractional tracking (`-10.8`, `-12.4`) | Same cause |
| Labels under 10pt | Illegible; always a scale accident, never a decision |
| Accent line in Purple/900 on mid-purple | Invisible. The single most damaging error available |
| Ghost above 35% on dark | Competes with the headline instead of supporting it |
| Ghost sitting behind the focal line | Turns depth into noise |
| Stat numerals at body size | Removes the reason the stat exists |
| Eyebrow without +4 tracking | Reads as stray text, breaks the system feel |
| Headline at 90–110pt | The dead zone — too big for body, too small to be the composition. Go under 40 or over 110 |
| Auto layout on an overlap composition | Reflows away the intentional collision |
| One ground for a whole deck | The rhythm is what makes sixteen slides bearable |
| Two lavender slides adjacent | Two peaks side by side is a plateau |
| Blue and purple grounds adjacent | Blue/900 and Purple/900 differ by 0.0005 luminance — reads as a print error |

The single most useful check: **screenshot the slide and look at it.** Both D-01 contrast failures were invisible in the node data and obvious the moment the frame was rendered.
