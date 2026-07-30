# Typography

## The families

| Role | EN | AR | Variable |
|---|---|---|---|
| Display | **Oswald** | FF Shamel Family | `Font-names/Display-Font` (`1:467`) |
| Body | **Helvetica Now Display** | FF Shamel Family | `Font-names/Body-Font` (`1:463`) |

## The Oswald substitution — read before changing it

**The brand book specifies Helvetica for display. The deck uses Oswald.**

MUD Creative House's brand book (page 4) lists content typography as *Helvetica EN (Bold / Regular / Light)* and *FF Shamel AR (Bold / Book)*. There is no Oswald in the brand book at all.

Oswald was introduced at the client's request during the v1 build, for a defensible reason: at 180–200pt a neutral grotesque like Helvetica occupies enormous horizontal space, and the deck's whole approach is headlines that fill the frame. Oswald's condensed forms let `"& INSPIRATION."` sit on one line at 180pt inside a 1680px measure. Helvetica at the same size would need two lines or a size drop, which would collapse the composition.

**So this is a live, approved deviation — not an error, and not settled.** Treat it as:

- **Keep Oswald** for display type in decks and any large-format editorial work. That is the established, client-approved look.
- **Revert to Helvetica** if the deliverable is governed strictly by the brand book — a document going to a brand-compliance reviewer, or co-branded material where MUD or AZM X is auditing.
- **Ask** if the deliverable is new territory (web, email, signage). Do not assume the deck precedent carries.

Recorded as D-02 in `decision-log.md`.

## Weight availability

Verified against `listAvailableFontsAsync()` on the build machine, 2026-07-30.

| Weight | Oswald | Helvetica Now Display |
|---|---|---|
| Hairline | no | yes |
| Thin | no | yes |
| ExtraLight | **yes** | yes (`Extra Light`) |
| Light | yes | yes |
| Regular | yes | yes |
| Medium | yes | yes |
| SemiBold | **yes** | **no — the one real gap** |
| Bold | yes | yes |
| ExtraBold | no | yes (`Extra Bold`) |
| Black | no | yes |
| ExtraBlack | no | yes (`Extra Black`) |

Helvetica Now Display also ships italics for most weights. The deck uses none — Majarah has no italic convention, and introducing one would be a new decision, not an application of this system.

Two traps:

1. **`Helvetica Now Display SemiBold` is the single missing face.** Fall back to `Medium`. The `font-weights/Semibold` variable resolves to the string `semibold`, which fails on Helvetica and silently falls back. If a body node renders lighter than expected, this is why. `Oswald SemiBold` does exist and is used for card titles.
2. **Oswald is the narrower family at the extremes.** It has no Black, ExtraBold or Thin. So `font-weights/Black` (`black`) works on Helvetica but not Oswald, and `font-weights/Extralight` (`thin`) works on Helvetica but resolves to nothing usable on Oswald, whose thin cut is named `ExtraLight`. Because the display font *is* Oswald, treat Black and Thin as body-font-only weights in EN.

## Getting the fonts

**Oswald is not installed by default on any machine, and Figma hides that from you.** Figma serves Oswald from its own Google Fonts library, so the deck renders correctly in the browser while the font is absent from the OS. Every build path that leaves Figma — HTML, pdfmake, python-pptx, any local render — then falls back silently to a default grotesque, and the whole display layer is wrong at 180pt. This was the state of the build machine on 2026-07-30: full Helvetica Now Display, full FF Shamel, **no Oswald anywhere.**

| Family | Vendored here | Licence | Where it comes from |
|---|---|---|---|
| **Oswald** | ✅ `assets/fonts/oswald/` | SIL OFL 1.1 | `github.com/google/fonts` → `ofl/oswald` |
| Helvetica Now Display | ❌ | Commercial (Monotype) | Install from your own licence |
| FF Shamel Family | ❌ | Commercial (Monotype) | Install from your own licence |

Vendored set: six static TTFs, six WOFF2 for web, `Oswald[wght].ttf`, and `OFL.txt`.

### Rebuilding the statics

`fonts.google.com/download?family=Oswald` returns an HTML page, not a zip — the endpoint needs a browser now. Pull from the repo instead, which ships **only** the variable font:

```bash
curl -sSL -o "Oswald[wght].ttf" \
  "https://raw.githubusercontent.com/google/fonts/main/ofl/oswald/Oswald%5Bwght%5D.ttf"
```

The `wght` axis runs 200–700 and its named instances are ExtraLight, Light, Regular, Medium, SemiBold, Bold — exactly the six weights this system uses. Cut them with `updateFontNames=True`, which sets `ID16 = Oswald` on the four non-RIBBI weights so the family resolves as one Oswald with six styles rather than six separate families:

```python
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

for wght, name in [(200,"ExtraLight"),(300,"Light"),(400,"Regular"),
                   (500,"Medium"),(600,"SemiBold"),(700,"Bold")]:
    f = TTFont("Oswald[wght].ttf")
    instancer.instantiateVariableFont(f, {"wght": wght}, inplace=True, updateFontNames=True)
    f.save(f"Oswald-{name}.ttf")
```

### ⛔ Never install the variable font alongside the statics

`Oswald[wght].ttf` declares PostScript name **`Oswald-Regular`** — byte-identical to the static Regular. Install both and macOS registers a second, phantom family whose members enumerate as `Oswald Regular Bold`, `Oswald Regular Medium`, `Oswald Regular SemiBold`. Font menus show duplicates and the resolver picks between colliding faces nondeterministically. Install the **six statics only**; the variable font stays vendored for web use, where `font-variation-settings` is worth having.

### Verify before you build

Never assume the font took. On macOS:

```bash
system_profiler SPFontsDataType | grep -E "^\s+Full Name:.*Oswald" | sort -u
```

Six lines, no `Oswald Regular <weight>` entries. `system_profiler` caches — if you just changed what is installed and the output looks stale, it is. Inside Figma, confirm with `listAvailableFontsAsync()` before a batch run, per `figma-workflow.md`.

## Size scale

Display type is the composition in this system, so the top of the scale runs further than most brands.

| Role | Size | Family / weight |
|---|---|---|
| Cover headline | 180–200pt | Oswald Bold |
| Section divider headline | 144–160pt | Oswald Bold |
| Standard slide headline | 130–140pt | Oswald Bold |
| Subsection headline | 110–120pt | Oswald Bold |
| Hero quote | 88pt | Oswald Bold |
| Mega anchor numeral | 460–1000pt | Oswald Bold |
| Ghost text | 280–1000pt | Oswald Bold |
| Pillar / phase numeral | 130–220pt | Oswald Bold |
| Stat numeral | 60–116pt | Oswald Bold |
| Row numeral | 38–96pt | Oswald Bold |
| Contact value | 26pt | Oswald Bold |
| Card / column title | 26–38pt | Oswald SemiBold or Bold |
| Deliverable title | 15–18pt | Helvetica Medium |
| Sub / lead paragraph | 22–26pt | Helvetica Regular |
| Body paragraph | 16–22pt | Helvetica Regular |
| Caption / meta | 12–14pt | Helvetica Regular or Light |
| Eyebrow | 11–16pt | Helvetica Medium |
| Chrome (page ind., footer) | 12–14pt | Helvetica Light |
| Micro label / tag | 10–11pt | Helvetica Medium |

**Never go below 10pt.** The v1 deck contains labels at **6.4pt** from a group-scale accident — illegible in print and on a projector.

## Tracking

Tracking tightens as size grows. This is the rule that makes the big type look intentional rather than merely large.

| Size band | Letter spacing |
|---|---|
| Oswald 150pt+ | `-3` to `-10px` |
| Oswald 100–150pt | `-2` to `-4px` |
| Oswald 40–100pt | `-1` to `-3px` |
| Oswald under 40pt | `0` to `+2px` |
| Ghost text (any size) | `-4` to `-30px` |
| Helvetica body 16–26pt | `0` to `+1px` |
| Helvetica eyebrow 11–16pt | **`+3` to `+6px`** |
| Helvetica chrome 12–14pt | `+3px` |
| Helvetica micro tag 10–11pt | `+4px` |

The eyebrow tracking is not optional. `+4px` at 14pt is what makes a small caps label read as a system element rather than as stray text. Every eyebrow in the v1 deck carries `+4`.

**Fractional tracking is a defect signature.** `-10.8`, `-12.4`, `-5.5`, `-2.8` all appear in the v1 deck and all indicate a scaled group. Set integers.

## Leading

| Use | Line height |
|---|---|
| Massive headline (140pt+) | 92–95% |
| Mid headline (84–140pt) | 95–100% |
| Ghost text | 80–90% |
| Card title | 100–110% |
| Body paragraph | 140–160% |
| Caption | 130–145% |
| Stat numeral | 85–90% |

Sub-100% leading on headlines is what produces the tight stacked blocks the brand is built on. At 95% with 180pt Oswald, three lines occupy ~513px — a little under half the frame height, which is the proportion the cover uses.

## Case

- **Headlines: ALL CAPS.** Every headline in the v1 deck is uppercase. This is the house voice for display type.
- **Card and column titles: sentence case** where they are content (meetup names, session titles), **ALL CAPS** where they are system labels (pillar names, deliverable names).
- **Eyebrows, labels, chrome, tags: ALL CAPS**, always, with tracking.
- **Body and quotes: sentence case.**

The one deliberate exception in v1 is the hero quote on the Community Voice slide, set sentence-case at 88pt Oswald Bold — lowercase carries the human register the quote needs. Caps would have made a person sound like a slogan.
