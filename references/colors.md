# Colab — Complete Colour Reference

Every value verified against the live Figma variable collection `color 🎨` on 2026-07-26.

---

## 1. Official palette (Brand Book)

### Primary
| Swatch | Hex | Variable path | Opacity steps in brand book |
|---|---|---|---|
| Jade Green | `#33FFC2` | `Brand/Primary/Jade-green/500 ⭐️` | 100 / 50 / 20 |
| Grey | `#BCBEC0` | *(to be added)* | 100 / 50 / White |
| Electric Green | `#34FF67` | `Brand/Primary/Electric Green/400⭐️` | 100 / 70 / 30 |
| Pine Green | `#103A21` | `Brand/Primary/Electric Green/Pine Green` | 100 / 50 / 30 |

### Secondary
| Swatch | Hex | Variable path |
|---|---|---|
| Pale Sky Blue | `#B1D9E8` | `Brand/Secondary/Pale Sky Blue/200*` |
| Vivid Orange | `#FF5A32` | `Brand/Secondary/Vivid Orange/400⭐️` |
| Olive Green | `#5B6B3E` | `Brand/Secondary/Olive Green/600*` |
| Charcoal Navy | `#101938` | `Brand/Secondary/Charcoal Navy/900*` |

---

## 2. Background / foreground pairing matrix

The authoritative rule set. When in doubt, consult this table rather than improvising.

### Ground: **Pine Green `#103A21`** — the default dark surface

| Element | Permitted |
|---|---|
| Display headline | White · Electric Green (9.49:1) |
| Body copy | White · White @ 80% |
| Eyebrow / kicker | Electric Green |
| Icons | Electric Green · White |
| Accents, chips | Electric Green · Vivid Orange · Jade Green |
| **Forbidden** | Olive Green text (too close in value) · Charcoal Navy text |

### Ground: **White `#FFFFFF`** — the default light surface

| Element | Permitted |
|---|---|
| Display headline | Pine Green · Charcoal Navy |
| Body copy | Pine Green · Neutral 600/700 |
| Eyebrow / kicker | Pine Green · Olive Green |
| Icons | Pine Green · Neutral 500 |
| Accents | Electric Green **as a large block, bar, or shape only** |
| **Forbidden** | ⛔ Electric Green as text, small UI, or thin icon strokes — **1.34:1** · Jade Green text (worse) · Pale Sky Blue text |

### Ground: **Charcoal Navy `#101938`** — alternate dark surface

| Element | Permitted |
|---|---|
| Display headline | White · Electric Green (12.84:1 — the widest margin in the system) |
| Body copy | White · White @ 80% |
| Eyebrow / kicker | Electric Green · Jade Green |
| Icons | Electric Green · White — **safe down to fine strokes here** |
| **Forbidden** | Pine Green text · Olive Green text |

### Ground: **Electric Green `#34FF67`** — covers and dividers only

Permitted only on covers, section dividers, and minimal-text slides. **Never behind body copy.**

| Element | Permitted |
|---|---|
| Display headline | Pine Green · Charcoal Navy |
| Short label / badge text | Charcoal Navy (12.84:1) · Pine Green (9.49:1) |
| Icons | Pine Green · Charcoal Navy |
| **Forbidden** | ⛔ White text (1.34:1) · body copy of any colour · any paragraph-length text |

---

## 3. Verified contrast ratios

WCAG 2.x relative luminance: `C_lin = C/12.92` if `C ≤ 0.03928` else `((C+0.055)/1.055)^2.4`; `L = 0.2126R + 0.7152G + 0.0722B`; ratio `= (L_light + 0.05) / (L_dark + 0.05)`.

| Pair | Ratio | AA normal | AA large | AAA normal |
|---|---|---|---|---|
| `#34FF67` on `#FFFFFF` | **1.34** | ✗ | ✗ | ✗ |
| `#34FF67` on `#103A21` | **9.49** | ✓ | ✓ | ✓ |
| `#34FF67` on `#101938` | **12.84** | ✓ | ✓ | ✓ |

> Not yet computed: Jade Green, Vivid Orange, Pale Sky Blue and Olive Green against the four grounds. Compute before clearing any of them for text or icon roles at the same confidence.

---

## 4. Full brand ramps

### Electric Green
| Step | Hex |
|---|---|
| 50 | `#EDFFF1` |
| 100 | `#D5FFE0` |
| 200 | `#AEFFC3` |
| 300 | `#6FFF96` |
| **400 ⭐️** | **`#34FF67`** |
| 500 | `#00E93A` |
| 600 | `#00C22C` |
| 700 | `#009826` |
| 800 | `#047723` |
| 900 | `#066120` |
| Pine Green | `#103A21` |

### Jade Green
| Step | Hex |
|---|---|
| 50 | `#F3FFF9` |
| 100 | `#E6FFF4` |
| 200 | `#CBFFE8` |
| 300 | `#AAFFDC` |
| 400 | `#80FFD0` |
| **500 ⭐️** | **`#33FFC2`** |
| 600 | `#00C896` |
| 700 | `#00936C` |
| 800 | `#016147` |
| 900 | `#013324` |
| 950 | `#011E14` |

### Vivid Orange
| Step | Hex |
|---|---|
| 50 | `#FFEDEB` |
| 100 | `#FFD4D0` |
| 200 | `#FFADA4` |
| 300 | `#FF8675` |
| **400 ⭐️** | **`#FF5A32`** |
| 500 | `#EB4500` |
| 600 | `#C33800` |
| 700 | `#982A00` |
| 800 | `#6B1B00` |
| 900 | `#3F0C00` |
| 950 | `#280500` |

### Charcoal Navy
| Step | Hex |
|---|---|
| 50 | `#EFF0FA` |
| 100 | `#D5DAF3` |
| 200 | `#AFB8E8` |
| 300 | `#8B9ADF` |
| 400 | `#697ED5` |
| 500 | `#4B66C1` |
| 600 | `#3B509B` |
| 700 | `#2B3C77` |
| 800 | `#1D2A56` |
| **900 \*** | **`#101938`** |
| 950 | `#090F27` |

### Olive Green
| Step | Hex |
|---|---|
| 50 | `#F4FFE3` |
| 100 | `#C8E98D` |
| 200 | `#AECA7A` |
| 300 | `#97B069` |
| 400 | `#81975A` |
| 500 | `#6E804B` |
| **600 \*** | **`#5B6B3E`** |
| 700 | `#4A5731` |
| 800 | `#333D21` |
| 900 | `#1B2110` |
| 950 | `#0E1207` |

### Pale Sky Blue
| Step | Hex |
|---|---|
| 50 | `#E7F3F7` |
| 100 | `#D3E8F1` |
| **200 \*** | **`#B1D9E8`** |
| 300 | `#94C9DC` |
| 400 | `#81B0C0` |
| 500 | `#6C94A3` |
| 600 | `#567783` |
| 700 | `#405A63` |
| 800 | `#2A3D43` |
| 900 | `#152024` |
| 950 | `#0A1215` |

### Neutral (cool blue-grey — distinct from brand Grey `#BCBEC0`)
| Step | Hex |
|---|---|
| 50 | `#F9FAFB` |
| 100 | `#F3F4F6` |
| 200 | `#E5E7EB` |
| 300 | `#D2D6DB` |
| 400 | `#9DA4AE` |
| 500 | `#6C737F` |
| 600 | `#4D5761` |
| 700 | `#384250` |
| 800 | `#1F2A37` |
| 900 | `#111927` |
| 950 | `#0D121C` |

---

## 5. Semantic tokens

`Semantics/*` aliases resolve differently per mode. Light → Dark:

| Token | Light | Dark |
|---|---|---|
| `Text/Black` | `#0D121C` | `#FFFFFF` |
| `Text/Dark Grey` | Neutral 600 | Neutral 200 |
| `Text/Medium Grey` | Neutral 500 | Neutral 300 |
| `Text/OnColor` | White | White |
| `Text/Electric Green` | `#34FF67` | `#34FF67` |
| `Text/Pine Green` | `#103A21` | `#103A21` |
| `Background/White` | White | `#0D121C` |
| `Background/Card` | White | Neutral 900 |
| `Background/Light Grey` | Neutral 50 | Neutral 900 |
| `Background/Pine Green` | `#103A21` | Electric Green 800 |

---

## 6. Severity colour mapping — fix this ordinally, never improvise

| Level | Colour | Hex |
|---|---|---|
| Critical / High | Vivid Orange | `#FF5A32` |
| Medium | Olive Green | `#5B6B3E` |
| Low | Pale Sky Blue | `#B1D9E8` |
| Resolved / Positive | Electric Green | `#34FF67` |
| No change / Neutral | Grey | `#BCBEC0` |

The palette has no red. Vivid Orange carries the critical role. Consistency here is what makes a findings slide skimmable by colour alone.

---

## 7. Known token defects

| Issue | Detail |
|---|---|
| Missing | `#BCBEC0` is on the official primary palette but has **no variable** |
| Missing | `Component-level/Logo-color/` has Electric Green and Pine Green but **no White** |
| Stale alias | `Semantics/Background/Electric Green` → `Brand/Primary/nion-green/500 ⭐️`, an orphaned rename |
| Duplicates | `Main Colors/Red/500` = `Red/600` = `#D92055`; `Green/500` = `Green/600` = `#079465` |
| Bloat | `Tailwind Colors` holds **242 of 436** colour variables — 55%, none brand-related |
| Naming | `⭐️`, `*` and trailing spaces are baked into variable names — brittle for code export |
