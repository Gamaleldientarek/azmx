# Arabic and RTL

Majarah is a Saudi community and its name, logo and tagline are Arabic. The brand book's collateral examples are **entirely Arabic RTL**. The v1 deck is entirely English LTR.

**No Arabic Majarah deck exists yet.** This file is what you need to know before building one, not a record of one that was built.

## What the file already gives you

The `Font` collection has two modes and every text node in the v1 deck is bound to it. Flipping to `AR` retypesets all eighteen frames in one action:

| Variable | EN | AR |
|---|---|---|
| `Font-names/Display-Font` | Oswald | FF Shamel Family |
| `Font-names/Body-Font` | Helvetica Now Display | FF Shamel Family |

That is genuinely valuable and it is the whole of what the mode switch does.

## What it does not give you

The mode switch changes fonts. It does not change:

- text direction
- paragraph alignment
- auto-layout order
- absolute x-coordinates
- the position of chrome, ghost text, or any decorative element
- the numerals
- the logo lockup choice

Everything in that list is manual. **Do not promise an Arabic deck as a mode flip.** It is a rebuild that reuses the type system.

## The weight collapse

Nine weight variables resolve onto **two** Arabic faces:

| EN weight | AR face |
|---|---|
| `bold`, `black`, `semibold`, `medium` | Sans One **Bold** |
| `regular`, `light`, `thin` | Sans One **Book** |

Four English weights become one Arabic face. The consequences are structural, not cosmetic:

**Card titles and headlines merge.** EN separates an Oswald Bold 140pt headline from an Oswald SemiBold 26pt card title by weight *and* size. In AR both are Sans One Bold — only size separates them. Widen the size gap.

**Eyebrows become shouty.** This is the worst-hit element. `Helvetica Medium 14pt + ls 4` reads as a quiet system label in EN. In AR, `medium` → Sans One **Bold**, so an 11–14pt eyebrow acquires headline weight at label size. **Set AR eyebrows to `Regular` or `light`** so they resolve to Sans One Book. This is the single most important AR adjustment.

**Display/body contrast disappears.** In EN, condensed Oswald against neutral Helvetica is a real typographic distinction and several compositions lean on it. In AR both variables resolve to `FF Shamel Family` — one family, no contrast. Compositions built on that opposition need rethinking rather than translating.

Before adding faces to the AR column, confirm what is actually installed:

```javascript
const fonts = await figma.listAvailableFontsAsync();
return fonts.filter(f => /shamel|sans one/i.test(f.fontName.family))
            .map(f => `${f.fontName.family} — ${f.fontName.style}`);
```

A variable pointing at an uninstalled face fails silently and falls back. Never assume.

## Mirroring

The layout invariant: **what sits at `x` in LTR sits at `1920 − x − width` in RTL.**

| Element | EN | AR |
|---|---|---|
| Page indicator | `120, 92` | `1920 − 120 − w, 92` → right-aligned at x=1800 |
| Logo | `1540, 78` | `120, 78` |
| Footer credit | `120, 1030` | right-aligned, ends at x=1800 |
| Headline block | left edge x=120 | right edge x=1800, `textAlignHorizontal = "RIGHT"` |
| Accent rule | `120, 194` | `1800 − 100, 194` → x=1700 |
| Eyebrow | `120, 150` | right-aligned at x=1800 |
| Ghost bleeding right | e.g. x=1280 | bleeds **left** — negative x |
| Vertical column divider | x=1020 | x=900 |
| Chevron `▸` at row end | right | flips to `◂` at left |

Set on every text node:

```javascript
t.textAlignHorizontal = "RIGHT";
// and for mixed Arabic/Latin runs, verify visually — see bidi below
```

### Auto layout reverses

For horizontal auto layout, do **not** re-order children manually. Figma has a layout direction on the frame:

```javascript
f.layoutMode = "HORIZONTAL";
f.itemReverseZIndex = false;
// Reverse visual order for RTL:
f.counterAxisAlignItems = "MAX";
```

The reliable approach is to reverse the child array at build time and keep `layoutMode` as-is, because Figma's RTL handling in auto layout is inconsistent across versions. Build the AR frame with children appended in reverse order, then verify by screenshot — do not trust the API to mirror for you.

**Archetypes affected:** D (4 columns), E (row stack), F (pillars), G (timeline), I (2×2 grid), L (contact row). All six need their child order reversed. The timeline (G) additionally needs its progression to run right-to-left, which means Phase 01 sits at the right edge — a genuine conceptual mirror, not just a position swap.

## Bidi traps

**Numerals stay Western.** `8`, `1000+`, `2026`, `01 / 16` are Western Arabic numerals in the brand book collateral and should remain so. Do not convert to Eastern Arabic-Indic (`٨`, `٢٠٢٦`) unless the client asks — the brand book's own agenda screen uses `6:00 P.M` and `01`/`02`/`03` in Western form.

**Mixed runs need visual verification.** A string like `مجرة × MUD CREATIVE HOUSE` contains an RTL run, a neutral, and an LTR run. The Unicode bidi algorithm will usually get it right, but the `×` and `/` separators are neutrals whose direction is inherited from context and they move unpredictably. Screenshot every mixed string.

**The RTL mark helps.** For Arabic lines that begin with a neutral or a numeral, prefix `‏` (RIGHT-TO-LEFT MARK) to pin the paragraph direction.

**Latin brand terms stay Latin.** `UX`, `Figma`, `Discord`, `Slack`, `majarah.events`, `Majarah_sa` are not translated and not transliterated.

## The logo in Arabic

The logo is **already Arabic** — مجرة with the orbital ring. It does not change between language versions.

But its placement does. In an AR deck the logo moves to the **top-left** corner (`120, 78`), because that is where the eye finishes a right-to-left line. The page indicator moves to the top-right. Both use the same components at the same rescale.

The centred hero logo on a closing slide needs no change — centred is centred.

## Content that needs a translator, not a designer

The v1 deck's English copy is not machine-translatable into brand-voice Arabic. Specifically:

- The two-tone headline depends on splitting a phrase so the accent lands on the meaningful half. Arabic word order differs; the split point moves. `A COMMUNITY` / `IN ORBIT.` has no direct Arabic equivalent that breaks the same way.
- The ghost words (`ARCHIVE`, `VOICES`, `ORBIT`, `JOIN`) are single English words chosen partly for letterform mass at 320–1000pt. Arabic equivalents have different widths and different visual density; each needs re-choosing, not translating.
- `#1` in the North Star slide is a Latin typographic convention. Arabic would use `الأول` or `رقم ١` — neither of which produces the same mega-numeral moment.

**Brief a translator for the copy and a designer for the composition.** Route the copy through `azmx-brand`'s English-to-Arabic guidance and Majarah's Inclusive Mentor voice (see `voice.md`), not through a general translation.

## Build checklist

- [ ] Confirm `FF Shamel Family` faces installed via `listAvailableFontsAsync`
- [ ] Switch the `Font` collection to `AR` mode
- [ ] Re-set eyebrows to `Regular`/`light` so they land on Sans One Book
- [ ] Widen size gaps where weight previously carried hierarchy
- [ ] Mirror all absolute x-coordinates: `x → 1920 − x − width`
- [ ] Set `textAlignHorizontal = "RIGHT"` on every text node
- [ ] Reverse child order in all six auto-layout archetypes
- [ ] Move logo to top-left, page indicator to top-right
- [ ] Flip ghost-text bleeds to the opposite edge
- [ ] Flip chevrons `▸` → `◂`
- [ ] Reverse the timeline progression (Phase 01 at right)
- [ ] Keep numerals Western
- [ ] Screenshot every mixed Arabic/Latin string
- [ ] Verify contrast is unchanged — the palette does not vary by language
