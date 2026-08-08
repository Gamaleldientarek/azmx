# AZM X Design Tokens — How to use them

Five collections, 550 tokens, two independent switches. This is the whole system in one page.

---

## 1. The rule that matters most

**Bind to Semantic. Never to Primitives.**

```
1. Primitives  →  1b. Palette  →  2. Semantic  →  3. Component
                                        ↑
                                  you bind here
```

Primitives are hidden from publishing and carry **no scopes**, so they will not appear in any Figma picker. That is deliberate. If you cannot find a colour in the picker, you are reaching for the wrong tier — the answer is a semantic token, or a new one, never a primitive.

Component tokens exist for the nine wired components. Use them **only inside those components' main definitions**, never on a loose layer.

---

## 2. The two switches

Any frame carries two settings that resolve independently:

| Switch | Options | Controls |
|---|---|---|
| **1b. Palette** | Blue · Orange · Green · Yellow · Purple · Red | Accents, dark grounds, the brand gradient |
| **2. Semantic** | Light · Dark | The theme |

Twelve combinations. One set of bindings. Nothing duplicated.

**To make a deck run in the orange palette:** select the top-level frame or section → Layer panel → set `1b. Palette` to `Orange`. Every accent, every dark ground and the gradient follow. Hospitals Report is already set this way.

**Blue is the default and resolves to the exact values already in use**, so nothing built before this system changes.

---

## 3. Picking a colour

### Surfaces

| Token | Light | Use |
|---|---|---|
| `surface/page` | White | The default ground |
| `surface/raised` | palette tint | Panels, table zebra |
| `surface/sunken` | Neutral 100 | Wells, recessed areas |
| `surface/inverse` | palette ground | The premium dark surface |
| `surface/accent` | palette signature | Accent fill. **Never behind body text** |
| `surface/accent-deep` | palette deep anchor | Heavy accent block, e.g. a stage header |
| `surface/accent-light` | palette light anchor | A full-bleed section cover |
| `surface/muted` · `subtle` · `lightest` · `dark` · `deep` | neutrals | Quieter grounds |

### Text

| Token | Light | Use |
|---|---|---|
| `text/heading` | Dark Navy | Headlines. **Not `text/primary`** |
| `text/primary` | Neutral 900 | Body copy |
| `text/secondary` | Neutral 600 | Supporting copy |
| `text/muted` | Neutral 500 | Captions, metadata |
| `text/accent` | palette text-safe step | Eyebrows, key numerals, the one highlighted word |
| `text/inverse` | White | Text on an inverse surface |
| `text/on-accent` | computed | Text **on** an accent fill |
| `text/on-image` · `on-image-body` · `on-image-eyebrow` | White · Blue 100 · Light Blue | Text over photography |

**`text/accent` is not the signature colour.** Blue keeps Electric because Electric is dark and reads at 8.1:1. Every secondary drops to its first text-safe step, because their signatures are vivid *light* tones — white on yellow `#FED340` is 1.44:1. Use `surface/accent` when you want the signature as a fill; use `text/accent` when it has to be legible.

### Borders

`border/subtle` → `default` → `strong` → `dark`, plus `border/accent`, `accent-inverse`, `accent-deep`, `heading`, `inverse`, `faint`.

All border tokens are also valid as **fills**, because a hairline drawn as a 1px rectangle is still a border. That is why the HR forms tables work.

### Status

`status/{success|warning|danger|info|caution}/{text|bg|border|wash}`

Every text-on-bg pairing measures **4.5:1 or better in both themes**. `status/info/*` stays blue by definition and does **not** follow the palette — otherwise an orange deck's info state would be indistinguishable from its accent.

`status/dot/{red|yellow|green}` are the RAG data dots. Fixed in both modes. They are the only sanctioned AZM X use of red, yellow and green outside a palette.

---

## 4. Type

Two ramps. Never a third.

**Display** — thmanyah serif. Titles, stats, quotes, numerals. Leading ×0.95.

```
2xs 30/29   xs 36/34   sm 48/46   md 60/57   lg 80/76
xl 100/95   2xl 120/114   3xl 160/152   4xl 200/190   5xl 240/228
```

**Body** — Azm X Variable. Everything else. Leading ×1.5.

```
2xs 12/18   xs 14/22   sm 16/24   md 18/28   lg 20/30   xl 24/36   2xl 28/42
```

Each step is two tokens: `type/display/lg/size` and `type/display/lg/line`.

Tracking: `type/tracking/normal` (0) · `slight` (0.5) · `wide` (2, eyebrows) · `wider` (3, Arabic labels).

**Twelve text styles** are already bound to these tokens — `Display/Hero`, `Display/Title`, `Display/Section`, `Display/Stat`, `Body/Default`, `Label/Eyebrow` and so on. **Use the text style, not the raw tokens**, unless you need something the styles do not cover. The styles are why the scale cannot drift again.

Serif carries personality, sans carries information. Never body copy in serif, never a hero in sans.

---

## 5. Spacing, radius, borders

**Spacing — these are the only permitted values.**

```
space/none 0 · 4xs 4 · 3xs 8 · 2xs 16 · xs 24 · sm 40 · md 64 · lg 96 · xl 128 · 2xl 160
```

If you need 12 or 20, the answer is 8 or 16 or 24. There is deliberately no token, and the audit will flag it. Sixteen layers currently use a 12px gap and should be corrected.

**Radius:** `none 0 · xs 2 · sm 4 · md 8 · lg 12 · xl 16 · 2xl 24 · pill`

**Border width:** `none 0 · thin 0.5 · hairline 1 · medium 2 · thick 4 · heavy 8`
The brand's 1px rule is `border-width/hairline`. `thin` renders inconsistently below 1× — prefer hairline.

---

## 6. Icons

Phosphor Icons, weight Regular. Ask before adding any.

`icon/default` · `accent` · `secondary` · `muted` · `inverse` · `on-image`
`icon/size/inline` 20 · `standalone` 24 · `feature` 32

`icon/accent` uses the text-safe step, not the signature, for the same reason as `text/accent`. On dark it drops to the light accent — **Electric never appears as an icon on a dark ground.**

---

## 7. The gradient

`gradient/start` → `mid` → `mid-alt` → `end`, 145°, event surfaces only: covers, dividers, closings. Never behind body copy.

It follows the palette:

```
Blue     #040038 → #01006E → #0200D3 → #001AFF
Orange   #2E170E → #5A2D1B → #A1502F → #F47A48
Green    #062515 → #0D4829 → #168049 → #22C36F
Yellow   #251601 → #693F02 → #895F0F → #FED340
Purple   #100024 → #2E0068 → #7341AD → #C68FFF
Red      #30080B → #5E1016 → #A81C27 → #FF2B3C
```

There is also a paint style, `Brand/Gradient · Event surfaces`, holding the blue version at the canonical angle and stops.

---

## 8. What is out of bounds

**`brand/colab/*` and `brand/majarah/*`** live in Primitives so the sub-brand files can share one source. **Never apply them to an AZM X surface.** Load `colab-design` or `majarah-design` for that work. Colab's Electric and Jade greens are banned on light grounds (1.34:1 and 1.29:1).

**`color/feedback/*`** is UI state, not brand colour. It is not a palette.

**`color/rag/*`** is data dots only.

---

## 9. Adding a token

1. Does a semantic token already resolve to what you need? Use it.
2. If not, is the *value* in Primitives? Add a **semantic** that aliases it. Never bind the primitive.
3. If the value does not exist, add the primitive first, then the semantic.
4. Give it Light **and** Dark. A semantic with the same value in both modes is fine, but state why in the description.
5. Set scopes. An unscoped semantic will not appear in the picker and the migration tooling will not find it.
6. Measure contrast before you commit. Every text pairing in this system clears 4.5:1 in all twelve combinations, and that is worth keeping true.

---

## 10. Known gaps

| Gap | Detail |
|---|---|
| Purple and yellow `role-tint`, `role-border`, `role-mid` | **Derived**, not from the palette board. Marked as such in their descriptions. Replace if official values exist. |
| `text/subtle`, `icon/muted` | 2.51:1 on white. Inherited from existing designs. Fine for disabled states, not for body text. |
| Off-scale values in the wild | 12px gaps (16 uses), 40px font size (51 uses) |
| Unwired component groups | `card`, `meter`, `star-tile`, `heat` (Hospitals Report), `bg` (Gradient & Bks) — tokens exist, mains not yet bound |
| `Rating` component | A 16-colour CSAT/NPS ramp, still raw hex by decision |
| Line-height on Hospitals Report | AUTO and percentage throughout, so it cannot be tokenized without changing layout |

---

## 11. Where to look in Figma

The **Design Tokens** page carries the live documentation, all read from the variables themselves:

| Frame | What it shows |
|---|---|
| MAP · How the tokens link | Five lanes, every link a live alias, red dashed = unwired |
| PALETTES · Six hues, one structure | All six ramps, role anchors, and what each palette resolves to |
| CHAINS · A token walking all three tiers | Concrete chains with live values |
| FORK · Where Light and Dark split | Exactly where the theme branches |
| VALUES · Space, radius, border, opacity | Every value drawn at real size |
| VALUES · Type scale | Both ramps as live specimens |
| TEST / CARD TEST | The same bindings rendered in both modes |
