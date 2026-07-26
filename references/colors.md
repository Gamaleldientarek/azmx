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
| Deep Jade | `#011E14` | `Brand/Primary/Jade-green/950` |

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
| **Forbidden** | Olive Green 600 text (2.19:1 — use `Olive Green/onDark`) |

### Ground: **White `#FFFFFF`** — the default light surface

| Element | Permitted |
|---|---|
| Display headline | Pine Green · Deep Jade |
| Body copy | Pine Green · Neutral 600/700 |
| Eyebrow / kicker | Pine Green · Olive Green |
| Icons | Pine Green · Neutral 500 |
| Accents | Electric Green **as a large block, bar, or shape only** |
| **Forbidden** | ⛔ Electric Green as text, small UI, or thin icon strokes — **1.34:1** · Jade Green text (worse) · Pale Sky Blue text |

### Ground: **Deep Jade `#011E14`** — the deepest surface

| Element | Permitted |
|---|---|
| Display headline | White (17.54:1) · Electric Green (13.07:1 — the widest margin in the system) |
| Body copy | White · White @ 80% |
| Eyebrow / kicker | Electric Green · Jade Green |
| Icons | Electric Green · White — **safe down to fine strokes here** |
| **Forbidden** | Pine Green text · Olive Green text |

### Ground: **Electric Green `#34FF67`** — covers and dividers only

Permitted only on covers, section dividers, and minimal-text slides. **Never behind body copy.**

| Element | Permitted |
|---|---|
| Display headline | Pine Green · Deep Jade |
| Short label / badge text | Deep Jade (13.91:1) · Pine Green (9.49:1) |
| Icons | Pine Green · Deep Jade |
| **Forbidden** | ⛔ White text (1.34:1) · body copy of any colour · any paragraph-length text |

---

## 3. Verified contrast ratios

WCAG 2.x relative luminance: `C_lin = C/12.92` if `C ≤ 0.03928` else `((C+0.055)/1.055)^2.4`; `L = 0.2126R + 0.7152G + 0.0722B`; ratio `= (L_light + 0.05) / (L_dark + 0.05)`.

| Pair | Ratio | AA normal | AA large | AAA normal |
|---|---|---|---|---|
| `#34FF67` on `#FFFFFF` | **1.34** | ✗ | ✗ | ✗ |
| `#34FF67` on `#103A21` | **9.49** | ✓ | ✓ | ✓ |
| `#34FF67` on `#011E14` | **13.07** | ✓ | ✓ | ✓ |

**Verified — all computed:**

| Foreground | on White | on Pine | on Deep Jade |
|---|---|---|---|
| Electric Green `#34FF67` | **1.34** ✗ | 9.49 ✓ | 13.07 ✓ |
| **Jade Green `#33FFC2`** | **1.29** ✗ | 9.84 ✓ | 13.55 ✓ |
| Vivid Orange `#FF5A32` | 3.11 ⚠ | 4.10 ⚠ | 5.65 ✓ |
| Olive Green `#5B6B3E` | 5.81 ✓ | **2.19** ✗ | — |
| Olive Green `/onDark` `#A8B294` | — | 5.74 ✓ | 7.90 ✓ |
| Pale Sky Blue `#B1D9E8` | **1.50** ✗ | 8.46 ✓ | 11.66 ✓ |
| Pale Sky Blue `/onLight` `#3C7E94` | 4.56 ✓ | — | — |
| Grey `#BCBEC0` | **1.86** ✗ | 6.83 ✓ | 9.41 ✓ |
| White | — | 12.73 ✓ | **17.54** ✓ |

**Jade Green is worse than Electric Green on white.** Both are accent-on-dark only. Vivid Orange is never body text on any ground.

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

### Ground family — all green

| Ground | Hex | Token | Role |
|---|---|---|---|
| Pine Green | `#103A21` | `Brand/Primary/Electric Green/Pine Green` | Primary dark |
| **Deep Jade** | `#011E14` | `Brand/Primary/Jade-green/950` | Deepest — White reads **17.54:1** |
| White | `#FFFFFF` | `Main Colors/Base/White` | Primary light |
| Off-white | `#F9FAFB` | `Main Colors/Neutral/50` | Soft light |
| Electric Green | `#34FF67` | `Brand/Primary/Electric Green/400⭐️` | Flood — Deep Jade type |

> Charcoal Navy was removed from the system by client decision. Deep Jade replaces it and is measurably better: White 17.54:1 vs 12.73 on Pine, Electric 13.07:1.

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
| Medium | Olive Green | `#5B6B3E` on light · `#A8B294` (`/onDark`) on dark |
| Low | Pale Sky Blue | `#B1D9E8` on dark · `#3C7E94` (`/onLight`) on light |
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
