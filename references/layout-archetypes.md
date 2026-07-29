# Layout Archetypes

Twelve recipes, all measured from the v1 deck. Frame is always **1920 × 1080**, margin **120px**.

Pick an archetype rather than composing from scratch. For a specific measured slide, see `slide-library.md`.

## Shared chrome — every archetype

| Element | Position | Spec |
|---|---|---|
| Page indicator | `120, 92` | `{NN} / {TOTAL}` · Helvetica Light 14 · ls 3 · Purple/200 |
| Logo | `1540, 78` | Secondary, `rescale(0.5)` → 260 × 56 |
| Footer credit | `120, 1030` | `MAJARAH  ×  MUD CREATIVE HOUSE` · Helvetica Light 12 · ls 3 · Purple/200 |

On a lavender ground: chrome text → Purple/900, logo → Secondary Main Purple (`1:378`).

## Standard header block

Seven of the twelve archetypes open with this. Learn it once.

```
Eyebrow          x=120, y=150–160   Helvetica Medium 14, ls 4, Purple/200
Accent rule      x=120, y=184–194   100 × 3, Purple/300
Headline line 1  x=120, y=220–240   Oswald Bold, White
Headline line 2  x=120, +110–160    Oswald Bold, Purple/300   ← the accent line
```

The accent line colour depends on the ground. Purple/300 on Purple/900 only. On Purple/600, Purple/500 or Purple/200 the accent line is **White** — see `colors.md` §4.

---

## A — Cover

Massive three-line headline. The one archetype where the headline starts low.

```
Eyebrow            120, 372   Helvetica Light 16, ls 4, Purple/200
Headline L1        120, 410   Oswald Bold 180, lh 95%, White
Headline L2        120, 580   Oswald Bold 180, White
Headline L3        120, 750   Oswald Bold 180, Purple/300      ← accent
Divider            120, 950   120 × 3, Purple/300
Subtitle           264, 942   Helvetica Regular 22, Subtle Grey
Year (right)      1680, 940   Oswald Bold 32, White, align RIGHT
Volume (right)    1680, 982   Helvetica Light 12, ls 4, Purple/200, align RIGHT
```

170px between headline baselines at 180pt. Ground: Purple/900.

## B — Two-column editorial

Left headline, right body, stat row beneath.

```
LEFT  x=120                        RIGHT x=1080
  Eyebrow        y=300               Label        y=304  Helvetica Light 12, ls 4
  Headline L1    y=340  140pt        Body         y=340  Helvetica Regular 22,
  Headline L2    y=480  140pt                            lh 160%, width 720
  Stat row       y=660
```

Stat row: horizontal auto layout, 3 blocks, 1×96 hairlines at Purple/200 @35% between. Each block is a vertical AL: numeral Oswald Bold **88pt** over label Helvetica Light **11pt** ls 4.

⚠ **Those two sizes are the ones that broke in v1.** The row was scaled to ~58%, landing at 51pt / 6.4pt. Set the frame width (~1000px) and the type sizes explicitly. Never drag to fit.

## C — Section divider

Ghost numeral behind a centred word.

```
Eyebrow (centred)   y=240   Helvetica Light 16, ls 6, Purple/200
Ghost numeral       y=232   Oswald Bold 760, Purple/300 @ 0.12, centred
Overlay word        y=530   Oswald Bold 144, White, centred
Divider             y=816   80 × 3, Purple/300, centred
Subhead             y=841   Helvetica Regular 26, Subtle Grey, centred
```

The ghost sits *above* the overlay in y but *behind* in z. Use `parent.insertChild(0, ghost)`.

## D — Four-column grid

Header block, then four columns with a bleeding ghost word.

```
Header block       120, 180  (eyebrow 14 / rule / headline 200pt two lines)
Ghost word         760, 360  Oswald Bold 320, Purple/600 @ 0.32
Column row         120, 730  horizontal AL, gap 40, width 1680
  each column      390 wide, vertical AL gap 20:
    numeral        Oswald Bold 96, ls -5, Purple/300
    title          Oswald SemiBold 26, lh 110%, White
    meta row       horizontal AL gap 10: 6×6 ellipse Purple/300 + Helvetica Regular 13
Hairlines          x=530, 960, 1390 · 1 × 280 · Purple/200 @ 0.30
```

## E — Vertical row stack

Four rows, right-anchored ghost.

```
Header block       120, 180  (headline 160pt two lines)
Ghost              1280, 320  Oswald Bold 720, Purple/600 @ 0.32  (bleeds right)
RowStack           120, 600  vertical AL gap 18, width 1140
  each row (66h)   horizontal AL gap 32:
    numeral        Oswald Bold 56, ls -3, Purple/300
    text col       vertical AL gap 4, width 880:
      title        Oswald SemiBold 28, lh 100%, White
      meta         Helvetica Regular 12, ls 3, Subtle Grey
    chevron ▸      Oswald Bold 20, Purple/300
  separators       1140 × 1, Purple/200 @ 0.25
```

## F — Three-column pillars

```
Header block       120, 150  (headline 110pt two lines)
Divider            120, 490  1680 × 1, Purple/600
PillarRow          120, 520  horizontal AL, gap 80, width 1680
  each column      507 wide, vertical AL gap 16:
    numeral        Oswald Bold 220, ls -4, lh 85%
    accent bar     1 × 24, Purple/600
    name eyebrow   Helvetica Medium 11, ls 4, Purple/200
    title          Oswald Bold 32, lh 105%, White
    body           Helvetica Regular 14, lh 145%, Subtle Grey, width 467
Vertical dividers  x=667, 1253 · 1 × 460 · Purple/600
```

Numeral colours alternate **White · accent · White** to give the row a rhythm.

## G — Horizontal timeline

```
Header block       120, 150  (headline 120pt two lines)
Timeline rule      120, 660  1680 × 1, Purple/300
PhaseRow           120, 490  horizontal AL, gap 40, width 1680
  each column      533 wide, vertical AL gap 14:
    phase eyebrow  Helvetica Medium 13, ls 4, Purple/200
    numeral        Oswald Bold 130, ls -3, lh 90%, White
    timeline dot   18 × 18 — stroked Purple/300 3px for pending,
                   filled Purple/300 for the destination
    title (2 lines) Oswald Bold 32, lh 105%, White
    tagline        Helvetica Regular 14, ls 1, lh 140%, Subtle Grey
```

The rule at y=660 passes through the dots at y≈654–672 — that intersection is the point of the layout. Keep them aligned if you change either.

## H — Split hero + deliverable list

```
LEFT
  Eyebrow        120, 160    Headline L1  120, 280  140pt White
  Accent rule    120, 194    Headline L2  120, 420  140pt accent
  Phase tag      120, 230    Sub          120, 620  Helvetica Regular 22, width 800
Ghost            1139, 292   Oswald Bold 940, Purple/600 @ 0.32 (bleeds right)
Vertical divider 1020, 160   1 × 800, Purple/600
RIGHT — rows at y = 220, 410, 600, 790:
  numeral        x=1080  Oswald Bold 56, ls -1, lh 90%, Purple/300
  title          x=1180  Helvetica Medium 18, ls 2, lh 110%, White
  body           x=1180  Helvetica Light 14, lh 145%, Subtle Grey, width 620
  divider        x=1080  720 × 1, Purple/600  (at y = 390, 580, 770, 960)
```

## I — 2×2 card grid

```
Header block       120, 160  (headline 160pt two lines, sub at y=580)
Divider            120, 640  1680 × 1, Purple/600
DeliverGrid        120, 660  vertical AL gap 30, 1680 × 380
  each row         horizontal AL gap 80, two 800-wide cards
  each card        horizontal AL gap 16:
    numeral        Oswald Bold 52, ls -1, Purple/300
    text col       vertical AL gap 8, width 700:
      title        Helvetica Medium 18, ls 2, White
      body         Helvetica Light 13, lh 145%, Subtle Grey
      tag row      4×4 square Purple/300 + Helvetica Medium 10, ls 4, Purple/300
```

## J — Manifesto (light ground)

Two numbered acts, recessive then dominant. Ground: **Purple/200**. All chrome inverts.

```
Eyebrow          120, 160   Helvetica Medium 14, ls 4, Purple/900
Accent rule      120, 194   100 × 3, Purple/900
Ghost numeral   1100,  80   Oswald Bold 1000, White @ 0.22
Stamp (right)   1640, 160   Helvetica Medium 11, ls 4, Purple/900

ACT I — recessive
  "I."           120, 250   Oswald Bold 60, Purple/900
  label          200, 268   Helvetica Medium 12, ls 4, Purple/900
  line 1         120, 320   Oswald Bold 84, Purple/600     ← recessive
  line 2         120, 410   Oswald Bold 84, Purple/600

Divider          120, 540   1680 × 2, Purple/900
Centre dot       956, 537   8 × 8, Purple/900

ACT II — dominant
  "II."          120, 580   Oswald Bold 60, Purple/900
  label          200, 598   Helvetica Medium 12, ls 4, Purple/900
  line 1         120, 650   Oswald Bold 116, Purple/900
  line 2         120, 770   Oswald Bold 116, White          ← the punch
  line 3         120, 890   Oswald Bold 116, Purple/900
Closing dot      870, 968   16 × 16, White
Attribution     1500, 1030  Helvetica Medium 13, ls 4, Purple/900
```

Act I at 84pt in Purple/600 (4.44:1) against Act II at 116pt in Purple/900 (5.70:1) — the negation is quieter in both size and contrast. That is the argument made typographically.

## K — CTA (light ground)

```
Eyebrow          120, 160   Helvetica Medium 14, ls 4, Purple/900
Accent rule      120, 194   100 × 3, Purple/900
Headline L1      120, 260   Oswald Bold 140, ls -4, lh 92%, Purple/900
Headline L2      120, 410   Oswald Bold 140, White            ← accent
Sub              120, 600   Helvetica Regular 24, lh 140%, Purple/900
CTA pill         120, 740   380 × 90, radius 45, fill Purple/900
  label          168, 773   Helvetica Medium 16, ls 4, White
  arrow →        430, 759   Oswald Bold 32, White
Vertical rule   1340, 250   1 × 540, Purple/900
Stat strip      x=1400, numerals at y=270/460/650 · Oswald Bold 80, ls -2, Purple/900
                labels at y=370/560/750 · Helvetica Medium 11, ls 4, Purple/900
                hairlines 380 × 1 at y=440, 630
```

## L — Closing / contact

```
Eyebrow (centred)  y=220    Helvetica Medium 14, ls 4, Purple/200
Accent rule        910, 254  100 × 3, Purple/300
Ghost word         615, 542  Oswald Bold 280, Purple/600 @ 0.22
Hero logo          centred at y=310, rescale 2.4
Tagline L1         y=640    Oswald Bold 56, ls 2, White, centred
Tagline L2         y=710    Oswald Bold 56, ls 2, Purple/300, centred
Divider            460, 810  1000 × 1, Purple/300
ContactRow         120, 854  horizontal AL gap 60, width 1680, four 375-wide columns
  each column      vertical AL gap 12:
    label row      4×4 square Purple/300 + Helvetica Medium 11, ls 4, Purple/200
    value          Oswald Bold 26, lh 110%, White
Footer (centred)   y=1020   Helvetica Light 12, ls 4, Purple/200
Progress dots      1700–1798, y=1052 · 6×6 · White
```

Centre the logo arithmetically: `x = (1920 − logo.width) / 2`. At rescale 2.4 the Secondary mark is 1249 wide → x = 335.

---

## When not to use auto layout

Auto layout belongs on **rows and grids** — archetypes D, E, F, G, I, L. It actively destroys the others, because A, C, H, J and K depend on **intentional overlap**: ghost text sitting behind a headline, a numeral bleeding off the frame edge, a subtitle overlapping a divider rule. Auto layout resolves overlap by reflowing, which is exactly wrong.

Rule of thumb: if the composition has a ghost layer or a bleed, keep it absolutely positioned.
