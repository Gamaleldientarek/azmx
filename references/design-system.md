# AZMX Design System

**The official AZMX brand and presentation design handbook.**
Editorial brand-book system for AZMX — a leading Saudi digital consultancy — as encoded in the *New Direction Library* Figma file and applied to the 66-slide PIF "StudioSpace" proposal.

> One-line ethos: Deep navy, electric blue, generous white space, serif personality, the chevron as the only recurring graphic device. **Restraint is the luxury.**

---

## Table of Contents

1. [Introduction & Principles](#1-introduction--principles)
2. [Color](#2-color)
3. [Typography](#3-typography)
4. [The Chevron Motif System](#4-the-chevron-motif-system)
5. [Layout & Spacing](#5-layout--spacing)
6. [Components](#6-components)
7. [Slide Archetypes / Patterns](#7-slide-archetypes--patterns)
8. [Implementation Notes (Figma)](#8-implementation-notes-figma)
9. [Changelog](#9-changelog)

---

## 1. Introduction & Principles

### 1.1 What this system is

AZMX's design system is an **editorial brand-book system**, not a UI kit. It is built to make work that reads like a spread in a premium brand book — expensive, catchy, hand-crafted by elite designers — at an Apple / Nike / Tesla / Fortune-5 level of craft. It was developed to rebuild a Financial & Technical Proposal for **PIF (Public Investment Fund)** in AZMX's electric-blue / navy identity, and it is general enough to govern any AZMX brand surface.

The system has a single governing idea: **restraint is the luxury.** The palette is mostly navy + electric blue + white. The only recurring graphic device is the chevron. Decoration is deliberately small: chevron + gradient + hairline is the entire kit. Everything else is type, scale, and negative space doing the work.

### 1.2 The editorial brand-book ethos

- Every surface should feel **art-directed**, like an editorial spread — not templated, not generated.
- **Intentional asymmetry, dramatic scale contrast, generous (and unequal) negative space, editorial type hierarchy.**
- **Optical alignment** over mechanical alignment: serif entry-strokes overhang the margin, numerals are figure-aligned, logos are optically (not bounding-box) centred.
- **One deliberate grid-break per surface** — an oversized numeral bleeding a rule, a 1.15× hero cell — to prove a human hand made the decision.
- A **single hidden horizon line** shared across a sequence (e.g. case-study device tops on one baseline) — invisible discipline that reads as money.

### 1.3 The de-AI / human-craft principles (art-direction §8)

This system is defined as much by what it refuses as by what it allows. The following are **instant AI / template tells — avoid them:**

| Avoid (AI / template tell) | Do instead |
|---|---|
| Rounded-corner card + drop-shadow on every block | White space, hairlines, and top-rules |
| Centred everything | Default left-aligned, top-weighted, asymmetric (only the closing is centred) |
| Equal-length columns padded to match | Let measures differ — real content |
| Plain `01 / 02 / 03` in default sans | Styled serif brand numerals |
| Clip-art, 3D blobs, geometric scatter, glows, blurs, decorative icon rows standing in for content | The chevron is the system's own graphic device. Phosphor icons are permitted on any surface once the user confirms them — always ask first, see `icons.md` |
| Logos pasted at equal pixel size | Normalise to equal *visual* mass |
| Body copy in serif; heroes in sans | Serif = personality, sans = information |
| Electric `#001AFF` as a large fill behind text (it vibrates) | Electric as punctuation only |
| Gradient behind dense paragraphs; gradient everywhere | Gradient = event surface only |
| Visible 12-col grid lines, default auto-layout look, uniform 16-px-everything spacing | Use the restricted spacing scale and hide the grid |
| Chevrons scattered or pointing against reading direction | One big chevron gesture, always pointing in reading direction |

**Signals of a human elite designer — do these:**

- Optical alignment (serif overhang 4–8 px; figure-aligned numerals; optically centred logos).
- Dramatic scale contrast (e.g. a 168 px hero against a 16 px eyebrow on one surface).
- One deliberate grid-break per surface.
- A hidden horizon line shared across a sequence.
- Restraint: one big chevron gesture + one electric accent per surface, the rest navy / white / space.
- Meaningful composition (stepped cards ascend; chevrons connect a process; arcs radiate from a word).
- A consistent micro-system: the same chevron bullet, the same footer, the same page-number flow-tick everywhere.
- Generous, unequal negative space — the page is allowed to breathe and be intentionally lopsided.

### 1.4 Voice & tone

- **Bilingual brand.** The system works in **English and Arabic**; copy is typically English, but Arabic logo lockups appear. Type and brand assets are chosen for EN + AR support.
- **Tagline territory:** *Forward · Human Always · Moving Ideas Forward.*
- **Tone:** confident, editorial, human, premium. Never templated, never "code-looking," never AI-generated in feel.
- **Type voice rule:** serif carries personality (titles, stats, quotes, numerals); sans carries information (body, labels, tables). See §3.

---

## 2. Color

The palette is the **`Colors`** Figma collection (single mode). The discipline is severe on purpose: most surfaces use only navy + the two blues + white. Secondary colors are reserved for categorical / semantic data and appear almost nowhere else.

### 2.1 Primary

| Token | Hex | Figma variable | Variable ID | Usage |
|---|---|---|---|---|
| Primary / Electric | `#001AFF` | `Electric` | `1:177` | The hero accent and call-to-attention. Use like punctuation: sparse, decisive. |
| Primary / Dark Navy | `#040038` | `Dark Navy` | `1:176` | The "premium dark." Dividers, capability slides, full-page bios, closing. |
| Primary / Light Blue | `#5D8FFF` | `Light Blue` | `1:170` | The dark-surface accent partner to Electric; safe for large soft fills. |
| Primary / White | `#FFFFFF` | `White` | `1:166` | The "editorial light" workhorse surface and on-dark text. |

### 2.2 Blue ramp (50–1000)

| Step | Hex | Notes |
|---|---|---|
| Blue / 50 | `#F0F5FF` | Soft light surface — panels, table zebra, image backings *(var `1:167`)* |
| Blue / 100 | `#DDE8FF` | Body text on dark *(var `1:164`)* |
| Blue / 200 | `#BFD5FF` | Meta / caption on dark *(var `1:130`)* |
| Blue / 300 | `#93B6FF` | — |
| Blue / 400 | `#5D8FFF` | = Light Blue |
| Blue / 500 | `#2661FF` | — |
| Blue / 600 | `#001AFF` | = Electric |
| Blue / 700 | `#0200D3` | Divider gradient stop1 *(var `1:169`)* |
| Blue / 800 | `#01009B` | — |
| Blue / 900 | `#01006E` | Cover gradient mid-stop *(var `1:157`)* |
| Blue / 950 | `#010040` | *(var `1:154`)* |
| Blue / 1000 | `#040038` | = Dark Navy; gradient stop0 *(var `1:179`)* |

### 2.3 Neutrals (25–950)

| Step | Hex | Notes |
|---|---|---|
| Neutral / 25 | `#FCFCFD` | — |
| Neutral / 50 | `#F9FAFB` | — |
| Neutral / 100 | `#F3F4F6` | — |
| Neutral / 200 | `#E5E7EB` | Grey image-placeholder fill *(var `1:160`)* |
| Neutral / 300 | `#D2D6DB` | — |
| Neutral / 400 | `#9DA4AE` | *(var `1:137`)* |
| Neutral / 500 | `#6C737F` | — |
| Neutral / 600 | `#4D5761` | *(var `1:155`)* |
| Neutral / 700 | `#384250` | — |
| Neutral / 800 | `#1F2A37` | — |
| Neutral / 900 | `#111927` | Default body text on light *(var `1:138`)* |
| Neutral / 950 | `#0D121C` | Deepest neutral |

### 2.4 Secondary / Alert (RAG)

Permitted **only** for semantic / categorical data — chiefly RAG risk dots. Used as 10 px dots with no labels-in-color. Outside that, the palette is navy + two blues + white; Orange and Purple appear nowhere unless a client logo carries them.

| Token | Hex | Figma variable | Variable ID | RAG meaning |
|---|---|---|---|---|
| Secondary / Red | `#FF2B3C` | `Red` | `1:173` | High risk / impact |
| Secondary / Yellow | `#FED340` | `Yellow` | `1:147` | Medium |
| Secondary / Green | `#22C36F` | `Green` | `1:171` | Low |
| Secondary / Orange | `#F47A48` | `Orange` | — | Categorical only (rare) |
| Secondary / Purple | `#C68FFF` | `Purple` | — | Categorical only (rare) |

> Full Alert sets (Red / Yellow / Orange / Blue / Green, each with BG / Border / Text and dark variants) exist in the collection for data-UI contexts, but are out of scope for editorial brand surfaces.

### 2.5 Surface roles

Four surfaces, each with a job. Do not mix them arbitrarily.

| Surface | Fill | Use for | Mood |
|---|---|---|---|
| Solid Navy | `#040038` | Dividers, capability slides, closing, full-page bios | "Premium dark" |
| White | `#FFFFFF` | Default content (exec summary, methodology, values, tables, org chart, JDs) | "Editorial light" |
| Blue-50 | `#F0F5FF` | Secondary light panels, table zebra, image backings, soft section breaks | Quiet light |
| Navy→Electric gradient | `#040038`→`#001AFF`, ~145° | **Event surfaces only:** cover, dividers, closing, one case-study feature panel | The "moment" |

Gradient detail: linear 145°, stop0 `#040038` (top-left) → stop1 `#001AFF` (bottom-right), with a mid-stop `#01006E` (Blue-900) at ~55% to deepen the middle. Dividers run slightly darker (stop1 `#0200D3`). **Never** place a gradient behind dense body copy.

### 2.6 Text color by surface

| Surface | Title | Body | Eyebrow | Meta / caption |
|---|---|---|---|---|
| Navy / gradient | White `#FFFFFF` | Blue-100 `#DDE8FF` @ 88% | Light Blue `#5D8FFF` | Blue-200 `#BFD5FF` @ 70% |
| White | Navy `#040038` | Neutral-900 `#111927` | Electric `#001AFF` | Neutral-900 @ 55% |
| Blue-50 | Navy `#040038` | Neutral-900 `#111927` | Electric `#001AFF` | Neutral-900 @ 55% |

### 2.7 The two blues — strict roles

This is the most important color rule in the system.

- **Electric `#001AFF` = the primary accent / call-to-attention.** Eyebrows on light, key numerals, the active page number on light, the single filled hero chevron, the one highlighted word, rule lines that matter.
  - **Do** use it like punctuation — sparse and decisive.
  - **Don't** use it as a large fill behind text (it vibrates), and **don't** set Electric text on Navy at small sizes (contrast fails — switch to Light Blue).
- **Light Blue `#5D8FFF` = the dark-surface partner.** Eyebrows / accents on navy where Electric would be too dim, secondary chevrons, hairlines on dark, the active page number on dark, large soft fills, and the lighter end of arcs.

> Secondary color only when needed: outside RAG semantics and (at most) one categorical tag system, no secondary color appears. Restraint is the rule, not the exception.

---

## 3. Typography

Two families, drawn from the **`Fonts`** collection. The entire voice of the system is carried by the contrast between them.

### 3.1 Families

| Role | Family | Figma variable | Variable ID | Notes |
|---|---|---|---|---|
| Display / Titles | **thmanyah serif display** | `Display` | `1:980` | Elegant serif. Personality: titles, stats, quotes, brand numerals. |
| Body / Information | **Azm X Variable** | `Body` | `1:979` | Variable sans, supports **EN + Arabic**. Body, labels, tables, UI. |

### 3.2 Weights

Azm X Variable weight set: **ExtraLight · Light · Regular · Medium · SemiBold · Bold · Black.** thmanyah display ships a smaller set (Regular · Light · Medium · Bold · Black). Each weight is a `font-weights/*` variable, with values stored as the **exact installed PascalCase style name** so `fontStyle` can bind live (see §8).

| Weight | Variable ID |
|---|---|
| ExtraLight | `1:978` |
| Light | `1:976` |
| Regular | `1:975` |
| Medium | `1:974` |
| SemiBold | `1:973` |
| Bold | `1:977` |
| Black | `1:981` |

### 3.3 Type scale

Tracking is given in px at the stated size (Figma letter-spacing).

| Role | Font | Size / Line-height | Weight | Tracking | Case / Style |
|---|---|---|---|---|---|
| Cover hero display | thmanyah serif | 168 / 156 | Regular | −2 px | Mixed-case |
| Divider title | thmanyah serif | 120 / 112 | Medium | −1.5 px | Mixed-case |
| Closing hero word | thmanyah serif | 220 / 200 | Regular | −3 px | Mixed-case |
| Slide title (H1) | thmanyah serif | 64 / 68 | Regular | −0.5 px | Mixed-case |
| Section / card title (H2) | thmanyah serif | 36 / 44 | Medium | 0 | Mixed-case |
| Sub-label / role title | Azm X Variable | 22 / 28 | SemiBold | +0.2 px | Mixed-case |
| **Eyebrow** | Azm X Variable | 16 / 20 | SemiBold | **+2.4 px** | **UPPERCASE** |
| Body | Azm X Variable | 22 / 32 | Regular | 0 | Sentence |
| Lead / intro body | Azm X Variable | 26 / 38 | Light | 0 | Sentence |
| Caption / meta | Azm X Variable | 14 / 20 | Medium | +0.6 px | Sentence / UPPERCASE labels |
| Stat numeral | thmanyah serif | 88 / 84 | Regular | −1 px | with sans suffix |
| Stat label | Azm X Variable | 16 / 22 | Medium | +1 px | UPPERCASE |
| Brand numeral (TOC/section) | thmanyah serif | 64 / 64 | Regular | 0 | `01`–`06` |
| Table header | Azm X Variable | 14 / 20 | SemiBold | +1.2 px | UPPERCASE |
| Table cell | Azm X Variable | 18 / 26 | Regular | 0 | Sentence |
| Quote / testimonial | thmanyah serif | 44 / 56 | Regular | −0.5 px | — |

### 3.4 Rules of voice

- **Serif = personality** (titles, stats, quotes, brand numerals). **Sans = information** (body, labels, tables, UI).
  - **Never** set body copy in serif. **Never** set a hero in sans.
- **Stat numerals** use serif for the figure and **sans Medium** for the `+` / unit suffix — e.g. serif `4,000` + sans `+`. The suffix is baseline-aligned to the figure.
- **No italics.** The installed `thmanyah serif display` has **no italic style.** Emphasis is expressed through **scale, weight, and color only** — never a faux or substituted italic. (This supersedes earlier art-direction drafts that called for italic accents; the client confirmed serif-display, no-italics.)

### 3.5 Bilingual note

The gradient brand identity and type system are **bilingual (EN + Arabic).** Azm X Variable carries both scripts; thmanyah display anchors the Latin display voice. Arabic logo lockups (the AZMX wordmark with Hamaa) appear alongside English copy.

---

## 4. The Chevron Motif System

The **`Arrow Shape` chevron `›`** is AZMX's signature graphic and the **only recurring graphic device** in the system. It replaces all generic decoration. Geometry: a single chevron is a 60°-included open caret; default aspect 1 : 1.3 (taller than wide). Variants: **Filled / Stroked / White-outline.**

> **v1.1 amendment (2026-07-20, owner decision): chevrons are banned as background decoration.** Uses 2 (oversized bleed element) and 4 (concentric chevron arcs) are retired. No ghost chevron field textures, no low-opacity chevron backdrops, no chevron art behind or under content. Backgrounds are solid surface or gradient only. The remaining sanctioned uses are functional/foreground: photo mask, stacked-in-motion hero, section tick, list bullet.

### 4.1 Six sanctioned uses (uses 2 and 4 retired — see v1.1 amendment above)

| # | Use | Description | Where |
|---|---|---|---|
| 1 | **Photo mask** *(signature move)* | Portraits / partnership photos clipped inside a large rightward chevron silhouette, point leading into white space (motion = "forward"). Typically 620–820 px tall, bleeding off one edge. | About photo, bios, partnerships, client visit, testimonials |
| 2 | **Oversized bleed element** | One giant chevron (900–1600 px) anchored to a corner, bleeding off-canvas, at navy-on-navy +6% lightness (or Electric @ 8% on light). A ghost texture giving the field direction without noise. | Dividers, capability slides, closing |
| 3 | **Stacked-in-motion** | 3–5 chevrons marching in one direction, opacity 100→20%, 32–48 px offset — velocity. Electric→Light Blue fade on light; White→transparent on dark. | Cover hero device, section-flow accents |
| 4 | **Concentric chevron arcs** *(the ring replacement)* | Nested open chevrons (3–5, stroke 2–4 px, increasing radius, opacity stepping 60→15%), parked top-right of every divider. Light Blue strokes on navy. **The dividers' identifying mark.** | All 9 dividers |
| 5 | **Section / divider accent tick** | A single Filled Electric chevron, 40–64 px, just before a section numeral or eyebrow — a "you-are-moving-forward" tick. | Dividers, section heads |
| 6 | **List bullet & flow indicator** | A small Filled chevron (10–14 px, Electric on light / Light Blue on dark) replaces every bullet dot. Also the page-number flow-tick. One consistent bullet across the whole system = craft signal. | Points lists, JDs, steering items, page numbers |

### 4.2 Discipline rules

- **One big gesture per surface.** Maximum ONE "big" chevron gesture (uses 1–4) per slide. Bullets (use 6) don't count.
- **Always point in the reading direction** (LTR → right). A chevron pointing against the read is a defect.
- Chevrons are never scattered decoratively. If a chevron isn't doing one of the six jobs, it doesn't belong.

---

## 5. Layout & Spacing

### 5.1 Canvas & margins

- **Canvas:** 1920 × 1080 px, static frames. All values are absolute px on this canvas.
- **Outer margin:** 120 px left / 120 px right → **content width 1680 px.**
- **Vertical margin:** 88 px top / 80 px bottom → **content height 912 px** (y: 88–992).
- **Safe area:** 100 px on all sides — logos and client-supplied assets never cross it.
- **Full-bleed exception:** photography, gradient fields, and oversized chevrons may bleed to 0 / 1920 / 1080. **Type and logos never bleed.**

### 5.2 Baseline grid & spacing scale

- **8 px baseline grid everywhere.** All type sits on an 8 px rhythm; all vertical spacing is a multiple of 8.
- **Spacing scale (use ONLY these values):**

```
8 · 16 · 24 · 40 · 64 · 96 · 128 · 160
```

These are the only permitted `itemSpacing` / padding values in components. Uniform "16px everywhere" is an AI tell — vary deliberately within the scale.

### 5.3 Column system

- **12 columns**, gutter **24 px**, column width **118 px** → `12 × 118 + 11 × 24 = 1680`.
- Default body measure: **6 columns (732 px)**; **7 columns max (850 px)** — never wider (long measure reads cheap).
- Standard split layouts use the **5 / 7** break (text 5 cols / feature 7 cols) or **7 / 5** reversed.

### 5.4 Header / eyebrow zone

- Eyebrow baseline at **y = 88**, left edge x = 120.
- Title block starts at **y = 152** (one 64-step below eyebrow).
- On most content slides the title baseline lands by **y = 300**, leaving the lower two-thirds for content — deliberate top-weighting.

### 5.5 Footer zone (every slide except the cover)

- Footer band **y = 1000–1032.**
- **AZMX `Logo with Hamaa` mark:** bottom-left, left edge x = 120, optically centred on y = 1016, height **24 px** (White on dark, Navy Dark on light).
- **Page number:** bottom-right, right edge x = 1800, baseline y = 1016. Azm X Variable Medium 16 px, tracking +40. Styled brand numeral — current page in Electric `#001AFF` (on light) / Light Blue `#5D8FFF` (on dark), total in 40% neutral, e.g. `12/66`. An 8 px filled chevron sits 12 px left of the number as a forward-flow tick.
- Dividers, cover, and closing additionally carry the **PIF emblem** (hairline-separated from the AZMX mark).
- The footer mark + page number are omitted **only on the cover.**

### 5.6 Slide-grid placement formula

Slides live on the `Playground` page, laid out in a 6-wide grid of 1920×1080 frames:

```
x = ((n − 1) % 6) * 2040
y = floor((n − 1) / 6) * 1200
```

(2040 = 1920 frame + 120 gutter; 1200 = 1080 frame + 120 gutter.)

### 5.7 Decorative kit (the whole kit)

Decoration is exactly three things: **chevron + gradient + hairline.**

- **Hairlines:** 1 px rules at Neutral-900 @ 12% (light) / White @ 14% (dark). At most **one** Electric / Light-Blue 2 px "active" rule per slide.
- **No** drop shadows on cards, glows, gradient-on-everything, blur, or geometric scatter. Phosphor icons are permitted once confirmed with the user — see `icons.md`.

---

## 6. Components

Built on **Atoms → Molecules → Templates.** Token rule: every fill binds to a `Colors` variable, every font-family to a `Fonts` variable, every weight to a `font-weights/*` variable. No raw hex, no raw style strings inside components. Property-type legend: **T** = TEXT, **B** = BOOLEAN, **S** = INSTANCE_SWAP, **V** = VARIANT. "AL" = uses auto-layout internally.

Auto-layout policy in one sentence: **auto-layout owns the flow of editable content (rows, cards, tags, lists, tables, stat strips); absolute positioning owns the composition, the bleed, and the photo mask.** A single template legitimately mixes both.

### 6.1 Atoms

| Component | Purpose | Properties | Variants | AL | Used by |
|---|---|---|---|---|---|
| **Chevron-Tick** (A1) | The bullet / tick primitive; wraps `Arrow Shape / Filled` | `Color` V, `Size` V | Color {Electric \| LightBlue \| White}; Size {12 \| 24 \| 48} | N | Every list bullet, page-number tick, section accent, connectors |
| **Eyebrow** (A2) | UPPERCASE header label | `Label` T, `Surface` V | Surface {Light \| Dark} | Y | Header of every content slide, card eyebrows, cover |
| **Page-Number** (A3) | Footer page indicator | `Current` T, `Total` T, `Surface` V | Surface {Light \| Dark} | Y | Footer of slides 2–66 |
| **Brand-Numeral** (A4) | Serif section / card numeral | `Value` T, `Color` V, `Scale` V | Color {Electric \| LightBlue}; Scale {64 \| 96 \| 120} | N | TOC rows, exec cards, values, points lists, plan, divider numeral |
| **Hairline** (A5) | Row / table / underline rule | `Weight` V, `Surface` V | Weight {Hairline-1 \| Active-2}; Surface {Light \| Dark} | N (FILL width) | Row dividers, table rules, eyebrow underline, footer separator |
| **Stat-Figure** (A6) | Serif figure + sans suffix on one baseline | `Figure` T, `Suffix` T, `Color` V | Color {Electric \| LightBlue} | Y | Stat-Block, capability strip, case-study outcome, bio years |
| **RAG-Dot** (A7) | 10 px categorical risk dot | `Status` V | {High-Red \| Med-Yellow \| Low-Green} | N | Risks table (65) |
| **Logo-Cell** (A8) | Optically-centred logo holder | `Logo` S, `Surface` V | Surface {Light \| Blue50 \| Dark} | Y | Logo walls (20, 22), bio client logos, partnership logo |

> A1 wraps `Arrow Shape / Filled`. The White divider/cover chevrons and Stroked arc chevrons stay as direct `Arrow Shape` instances placed absolutely — they are compositional bleed art, not atoms.

### 6.2 Molecules

| Component | Purpose | Properties | AL | Used by |
|---|---|---|---|---|
| **Content-Header** (M1) | Top-left header block | `Eyebrow` T, `Title` T, `Surface` V, `Underline` B | Y (VERTICAL) | Every content slide header |
| **Footer** (M2) | Footer band, logo + page number | `Page-Current` T, `Page-Total` T, `Surface` V, `Show-PIF` B | Y (HORIZONTAL, space-between) | Slides 2–66 |
| **Image-Placeholder** (M3) | Grey chevron-masked image stand-in | `Caption` T, `Sublabel` T, `Masked` B | Y label over absolute mask | Methodology (5–8), illustration (61), image stand-ins |
| **Stat-Block** (M4) | Figure + suffix + label | `Figure` T, `Suffix` T, `Label` T, `Color` V | Y (VERTICAL) | Capability strips (48, 49), case-study outcome, banner cells |
| **Numbered-Card** (M5) | Top-rule + numeral + title + body | `Number` T, `Title` T, `Body` T, `Surface` V, `Top-Rule` B | Y (VERTICAL) | Exec (3), values (10), plan (58), points lists (62, 64) |
| **Bio-Card** (M6) | Full-page bio | `Role` T, `Name` T, `Bio` T, `Years` T, `Surface` V, `Logos` B | Y text col + absolute portrait | Full-page bios (12–18) |
| **Team-Tile** (M7) | Grid person tile | `Portrait` S, `Name` T, `Role` T, `Hero` B | Y (VERTICAL) | Team grid (19); `Hero` scales cell 1.15× (CEO) |
| **Quote-Block** (M8) | Testimonial pull-quote | `Quote` T, `Name` T, `Title` T, `Surface` V | Y text + absolute glyph/portrait | Testimonials (27–30) |
| **Table-Row** (M9) | Data table row | `C1`–`C5` T, `Variant` V, `Has-RAG` B, `RAG` S | Y (HORIZONTAL) | Tables (51–53, 65) |
| **JD-Card** (M10) | Job description panel | `Role` T, `Seniority` T, `Items` (list slot) | Y (VERTICAL) | Job descriptions (55–57) |
| **Process-Step** (M11) | Stepped meeting card | `Cadence` T, `Title` T, `Attendees` T, `Step-Index` V | Y (VERTICAL) | Meetings (61); `Step-Index` sets +40 px staircase offset |
| **Case-Study** (M12) | Case study layout | `Eyebrow`, `Title`, `Body` T; `Tags` slot; `Stat-Figure`, `Stat-Label` T; `Device` S | Y left col + absolute right panel | Case studies (32–46) |
| **List** (M13) | Chevron-bullet list container | `Item-N` T per row | Y (VERTICAL) | Capability lists, JD responsibilities, steering bullets |
| **List-Item** (M13a) | One bullet row | `Text` T, `Surface` V | Y (HORIZONTAL) | Inside any List |
| **Method-Split** (M14) | Text + masked image split | `Eyebrow`, `Title`, `Lead`, `Image-Caption`, `Sublabel` T | Y text + absolute image | Methodology (5–8) |
| **Org-Node** (M15) | Org-chart label block | `Name` T, `Role` T, `Pivot` B | Y (VERTICAL) | Org chart (54); `Pivot` adds 2 px Electric left-rule |
| **Tag-Chip** (M16) | Case-study method tag | `Label` T, `Surface` V | Y (HORIZONTAL) | Case-study method tags (in a HORIZONTAL+WRAP Tag-Row) |

**Asymmetry inside auto-layout (intentional, do not "fix"):**
- **Values columns** (10) are staggered 40 / 0 / 40 px via per-card *top padding*, not itemSpacing. The shared numeral hairline is a separate absolute Hairline.
- **Card counter-axis is HUG** so each card is exactly as tall as its copy — never equal height.
- **Points lists** (62, 64) are a 2-column GRID of Numbered-Cards (colGap 64, rowGap 40).

### 6.3 Templates (slide-level)

Templates are 1920×1080 component frames carrying the surface fill, the Footer instance, and absolute compositional art, exposing only copy as properties. Built only where ≥3 slides share a composition.

| Template | Properties (forwarded) | Covers |
|---|---|---|
| **Divider** (T1) | `Section`, `Word`, `Sub`, `Page` | Slides 4, 9, 21, 31, 47, 50, 59, 60, 63 (9×) |
| **Slide-Light** (T2) | `Header.Eyebrow`, `Header.Title`, `Page-Current` | Base for white content slides |
| **Slide-Dark** (T3) | as T2 + `Show-PIF` (default false) | Capability (48, 49), bios, testimonials |
| **Case-Study** (T4) | as M12 | 32–46 (15×) |
| **Bio** (T5) | as M6 | 12–18 (7×) |

> **Cover (1)** and **Closing (66)** are one-off absolute compositions — **not** componentised. They are unique paintings; a component adds overhead with zero reuse.

### 6.4 Built component registry (Figma node IDs)

These are the components actually built and live in the file, on the **`Proposal Components`** page. Reference by node ID (page-name-independent).

| Component | Node ID | Property keys |
|---|---|---|
| Divider | `72:7134` | Section `#72:0`, Word `#72:1`, Sub `#72:2`, Page `#72:3` |
| Footer / Light | `72:9960` | Page `#72:4` |
| Footer / Dark | `72:9981` | Page `#72:5` (includes PIF; hide `left.children[1..]` to drop PIF) |
| Content-Header | `72:10088` | Eyebrow `#72:6`, Title `#72:7` |
| TOC-Row | `72:10093` | Numeral `#72:8`, Title `#72:9`, PageRef `#72:10` |
| Bio | `72:10156` | Role `#72:11`, Name `#72:12`, Bio `#72:13`, Years `#72:14`, Page `#72:15` |
| Team-Tile | `72:15428` | Name `#72:18`, Role `#72:19` |

**Brand assets:**

| Asset | Node ID(s) | Notes |
|---|---|---|
| PIF Logo (COMPONENT_SET) | `72:3613` | Default `72:2545`, **White `72:3614`** (use white on dark) |
| Logo with Hamaa (AZMX) | White `2:116`, Navy `2:132`, Colored `2:37` | Variants: Colored / Navy Dark / White |
| Arrow Shape (chevron) | Filled `2:106`, Stroked `2:244`, **White-outline `2:248`** | White-outline is the preferred ghost-chevron variant |

---

## 7. Slide Archetypes / Patterns

The deck composes from ~21 reusable archetypes. Each lists its surface and a one-line "when to use."

| # | Archetype | Surface | When to use |
|---|---|---|---|
| A | **Cover** | Gradient | The opening — hero display + stacked-motion chevrons + metadata row. One-off. |
| B | **Table of Contents** | White | Section index — serif brand numerals `01`–`06` on a 96 px rhythm. |
| C | **Section Divider** | Gradient | Open a section — concentric arcs top-right, big serif title, section numeral. |
| D | **Two-card Exec Summary** | White | Two parallel points — top-rule + numeral + title + body, no boxes. |
| E | **Methodology Split + placeholder** | White (7/5) | A phase with a (client-supplied) image — text left, masked grey image right. |
| F | **3-column Values** | White | Three values side by side — staggered numbered columns. |
| G | **About intro + image** | White (5/7) | Company story — text + chevron-masked group photo + a serif pull-phrase. |
| H | **Full-page Bio** | Navy | A leader — masked duotone portrait right third + giant "NN+ years" stat. |
| I | **Team Grid** | White | The whole team — 4×3 duotone tiles with chevron-notch corners; CEO at 1.15×. |
| J | **Logo Wall** | White / Blue-50 | Clients or qualifications — monochrome logos at equal *visual* mass. |
| K | **Partnership** | Navy + photo | A partner — full-bleed chevron-cropped photo + text panel + partner logo. |
| L | **Testimonial** | Navy or gradient | A quote — serif pull-quote + giant quote-mark glyph + attributor. Layouts A (flat navy) / B (gradient). |
| M | **Case Study** | White + gradient panel | A project — text left, gradient feature panel with device mockup right. |
| N | **Dark Capability** | Navy | A product (Anatomi / Colab) — value-prop + 4-stat strip + chevron-bullet lists. |
| O | **Data Table** | White | Tabular data — banner stat row + zebra rows, horizontal hairlines only, RAG dots. |
| P | **Org Chart** | White | Reporting structure — label nodes joined by chevron-tipped connectors. |
| Q | **Two-up Job Descriptions** | White | Two roles per slide — split panels, chevron-bullet responsibilities. |
| R | **Two-col Proposed Plan** | Blue-50 | A promise + two supporting columns + a spanning serif pull-line. |
| S | **Stepped Meetings + illustration** | White | Escalating cadence — three ascending stepped cards + chevron links. |
| T | **Points List** | White | Numbered points (steering, risks) — 2-column list with oversized hanging numerals. |
| U | **Closing "Love"** | Gradient | The release — the deck's only fully-centred composition. One-off. |

---

## 8. Implementation Notes (Figma)

### 8.1 How the system is encoded

- **File:** *New Direction Library*, fileKey `j8ugBpb1yUUyL8hfb6FHKR` — a Figma **design** file (not Slides). Slides live on the **`Playground`** page; components live on the **`Proposal Components`** page (renamed from `◆ Components`).
- **Every fill** is bound to a `Colors` variable. No raw hex inside components.
- **Every font family** is bound to `Fonts` Display (`1:980`) / Body (`1:979`).
- **Every font weight** is bound to a `font-weights/*` variable.

### 8.2 The font-weight PascalCase mapping (critical)

Figma's `fontName.style` requires the *installed* PascalCase style name. The `font-weights/*` variable **values** were therefore remapped from lowercase to the exact installed style strings, so `fontStyle` can bind to the variable and stay live:

| Variable | Old value | → New value |
|---|---|---|
| thin / extralight | "thin" / "extralight" | **ExtraLight** |
| light | "light" | **Light** |
| regular | "regular" | **Regular** |
| medium | "medium" | **Medium** |
| semibold | "semibold" | **SemiBold** |
| bold | "bold" | **Bold** |
| black | "black" | **Black** |

Rules:
- Only bind a weight var to a family that actually has that installed style — **serif (thmanyah):** Regular / Light / Medium / Bold / Black; **sans (Azm X Variable):** ExtraLight / Light / Regular / Medium / SemiBold / Bold / Black. Never cross a family with the other's style.
- `thin` maps to `ExtraLight` (Azm X has no separate Thin).
- Drive the mapping from `listAvailableFontsAsync()` output — never hand-type a style name (a "Semibold" vs "SemiBold" typo silently falls back to Regular).
- Before assigning any `fontName`, `await figma.loadFontAsync({ family, style })` with the **resolved** PascalCase value. Binding `fontStyle` to a variable does **not** auto-load the font.

### 8.3 Key engineering gotchas

- **Auto-layout `resize()` collapse.** Calling `resize()` on an auto-layout frame flips its sizing mode AUTO→FIXED, collapsing / clipping it. **Fix:** append all children first, **then** set `primaryAxisSizingMode` / `counterAxisSizingMode` **last.**
- **Bound-paint black fallback.** The bound-paint helper uses a **black** base color; if a variable binding fails to render, text shows BLACK. For white-on-dark text, give the paint a **WHITE** base. (This bit the testimonial quotes.)
- **No italics.** `thmanyah serif display` has **no** italic style; express emphasis via scale / weight / color only. Do not attempt to bind italic through `font-weights/*` — italic is a style, not a weight.
- **Page-number layers** are all named `page number` (one per slide, 2–66). Screenshot node IDs are session-stable but re-query by slide name if unsure (`pg.children.find(c => c.name.startsWith('NN '))`).

### 8.4 Build order (bottom-up)

Tokens → atoms → molecules (atom-dependent) → composite molecules / templates → one-off compositions (cover, closing). Validate each tier by screenshot before proceeding; confirm no raw hex / raw style strings remain. The single highest-leverage retrofit is swapping every hand-placed logo + page number for one **Footer** instance across slides 2–66 — the craft-consistency win.

---

## 9. Changelog

| Version | Date | Notes |
|---|---|---|
| **1.0** | 2026-06-09 | Initial authoritative AZMX Design System handbook. Consolidated from `MASTER-BRIEF.md`, `art-direction.md`, `component-architecture.md`, `SESSION-HANDOFF.md`, and the `azmx-brand-system` memory. Reflects the as-built state: 66 slides, fully tokenized, no-italics confirmed. |
| **1.1** | 2026-07-20 | Chevron background uses retired by owner decision: no oversized bleed ghosts (former use 2), no concentric arc backdrops (former use 4), no chevron art behind content. Functional chevron uses (photo mask, stacked-motion hero, tick, bullet) unchanged. |

---

*AZMX Design System v1.0 — "Restraint is the luxury."*
