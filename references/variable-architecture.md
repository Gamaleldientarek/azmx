# Variable Architecture

Why the Majarah variable layer is shaped the way it is, what it buys, and the one place it quietly costs you.

## The shape

Two collections, deliberately asymmetric:

| Collection | Modes | Variables | Published |
|---|---|---|---|
| `Color` | 1 (`Mode 1`) | 11 | visible |
| `Font` | 2 (`EN`, `AR`) | 9 | **hidden** |

Colour is single-mode because Majarah has no light/dark theme — it has a *ground rotation* instead, and which ground a slide uses is a composition decision, not a mode. Putting grounds in modes would have been the obvious move and it would have been wrong: you would not be able to place a lavender slide next to a dark one in the same file.

Font is two-mode because language *is* a global switch. That is the correct axis.

**This asymmetry is the design. Do not add modes to `Color`, and do not add a third mode to `Font` for a language variant that shares a script.**

## What the binding discipline buys

Verified across all eighteen frames of the v1 deck: **100% of fills bound, 100% of text family/weight bound, zero raw hex.**

The payoff is concrete. Flipping the `Font` collection to `AR` mode retypesets the entire deck in one action, because every text node resolves its family through `Font-names/*` rather than carrying a literal. No node-walking, no find-and-replace, no missed labels. That is a genuinely well-built layer and it should be preserved.

The same is true of colour: a palette revision is eleven edits, not seven hundred.

## Where it costs you

The `Font` collection binds **family** and **weight**. It does not bind **size**, **leading**, or **tracking** — and because the file has zero text styles, there is nothing else for those to bind to.

| Property | Has a variable/style layer | Drifted in v1 |
|---|---|---|
| fill colour | yes (variable) | no |
| font family | yes (variable) | no |
| font weight | yes (variable) | no |
| font size | **no** | yes — fractional values |
| line height | **no** | yes |
| letter spacing | **no** | yes — fractional values |

The observed drift is not sloppiness; it is the absence of a layer. Values that had somewhere to bind held perfectly. Values that had nowhere to bind drifted the moment anyone dragged a frame handle.

**Fractional sizes and tracking are the diagnostic.** `51.096771240234375pt`, `443.10345458984375pt`, tracking of `-10.8` and `-12.4` — none of these are values a person types. They are a group-scale operation multiplying through nested children. Where you see them, expect a broken layout nearby.

## The Arabic collapse

This is the one thing about the architecture worth understanding before you promise an Arabic deck.

Nine weight variables map onto **two** Arabic faces:

| EN value | AR value |
|---|---|
| `bold` | Sans One **Bold** |
| `black` | Sans One **Bold** |
| `semibold` | Sans One **Bold** |
| `medium` | Sans One **Bold** |
| `regular` | Sans One **Book** |
| `light` | Sans One **Book** |
| `thin` | Sans One **Book** |

Seven distinct English weights become two. Four of them — bold, black, semibold, medium — become the *same* face.

The English deck leans hard on weight to build hierarchy: Oswald Bold headlines against Oswald SemiBold card titles against Helvetica Medium eyebrows against Helvetica Light chrome. In AR mode, **the SemiBold card title and the Bold headline become identical**, and the Medium eyebrow becomes as heavy as the headline. Three tiers flatten into one.

Consequences for any Arabic version:

1. **Hierarchy must be rebuilt on size and colour, not weight.** Where EN separates a card title from its body by weight, AR must separate them by size step or by moving the body to Subtle Grey.
2. **Eyebrows are the worst-hit element.** `Medium` at 11–14pt with +4 tracking reads as a quiet label in EN; in AR it becomes Sans One Bold — visually as assertive as a headline at small size. Drop eyebrows to `Regular`/`light` for AR so they resolve to Sans One Book.
3. **Do not fix this by adding faces to the AR column** unless FF Shamel Family genuinely ships more weights on this machine. Check with `figma.listAvailableFontsAsync()` first. A variable pointing at an uninstalled face fails silently and falls back.
4. The Display and Body variables **both** resolve to `FF Shamel Family` in AR. The EN display/body distinction (condensed Oswald vs neutral Helvetica) disappears entirely. Arabic gets one family — so the EN habit of contrasting a condensed headline against a neutral body has no AR equivalent, and compositions relying on it need rethinking rather than translating.

See `rtl-arabic.md` for what else an Arabic build needs beyond the font switch.

## Governing the layer

- **Never rename a variable.** `Purple/500*` and `Grey*` carry asterisks; `font-weights/light` is lowercase where its siblings are capitalised. All three look like mistakes and all three are load-bearing. Renaming breaks every binding.
- **Keep `Font` hidden from publishing.** Those nine are plumbing. A designer in a consuming file should pick a colour, never a `font-weights/*` string.
- **Keep `Color` visible.** It is the public surface of the system.
- **Add text styles before adding variables.** The gap in this system is the type layer. Eight text styles bound to the existing font variables would close it without touching what already works. That is the single highest-leverage improvement available.
