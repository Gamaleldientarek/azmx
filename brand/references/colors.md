# AZMX Color Reference

Every tone in the system. Source of truth: the `Colors` Figma collection in the New Direction Library file.

## Primary

| Token | Hex | Usage |
|---|---|---|
| Electric | `#001AFF` | Hero accent, call-to-attention, used like punctuation |
| Dark Navy | `#040038` | Premium dark surface: dividers, closings, full-page bios |
| Light Blue | `#5D8FFF` | Dark-surface accent partner, safe for large soft fills |
| White | `#FFFFFF` | Editorial light workhorse surface, text on dark |

## Blue ramp (50 to 1000)

| Step | Hex | Notes |
|---|---|---|
| Blue 50 | `#F0F5FF` | Soft light surface: panels, table zebra, image backings |
| Blue 100 | `#DDE8FF` | Body text on dark |
| Blue 200 | `#BFD5FF` | Meta and caption text on dark |
| Blue 300 | `#93B6FF` | |
| Blue 400 | `#5D8FFF` | Equals Light Blue |
| Blue 500 | `#2661FF` | |
| Blue 600 | `#001AFF` | Equals Electric |
| Blue 700 | `#0200D3` | Divider gradient end stop |
| Blue 800 | `#01009B` | |
| Blue 900 | `#01006E` | Cover gradient mid-stop |
| Blue 950 | `#010040` | |
| Blue 1000 | `#040038` | Equals Dark Navy, gradient start stop |

## Neutrals (25 to 950)

| Step | Hex | Notes |
|---|---|---|
| Neutral 25 | `#FCFCFD` | |
| Neutral 50 | `#F9FAFB` | |
| Neutral 100 | `#F3F4F6` | |
| Neutral 200 | `#E5E7EB` | Grey image-placeholder fill |
| Neutral 300 | `#D2D6DB` | |
| Neutral 400 | `#9DA4AE` | |
| Neutral 500 | `#6C737F` | |
| Neutral 600 | `#4D5761` | |
| Neutral 700 | `#384250` | |
| Neutral 800 | `#1F2A37` | |
| Neutral 900 | `#111927` | Default body text on light |
| Neutral 950 | `#0D121C` | Deepest neutral |

## Secondary / Alert (RAG only)

Permitted only for semantic or categorical data, chiefly 10 px risk dots with no colored labels.

| Token | Hex | Figma variable | Variable ID | Meaning |
|---|---|---|---|---|
| Red | `#FF2B3C` | `Secondary/Light/Red` | `1:173` | High risk or impact |
| Yellow | `#FED340` | `Secondary/Light/Yellow` | `1:147` | Medium |
| Green | `#22C36F` | `Secondary/Light/Green` | `1:171` | Low |
| Orange | `#F47A48` | `Secondary/Light/Orange` | `1:144` | Categorical only, rare |
| Purple | `#C68FFF` | `Secondary/Light/Purple` | `1:145` | Categorical only, rare |

Each secondary color also has a `Secondary/Dark/*` variant, and full Alert sets (BG, BGO, Border, Text per color) exist for data-UI contexts. The complete live export of every variable, including Alert sets, Alpha tones, and the Numbers collection (type scale, spacing, radii, opacity), is in `figma-tokens.md`.

## Surfaces

| Surface | Fill | Use for |
|---|---|---|
| Solid Navy | `#040038` | Dividers, capability pages, closings, full-page bios |
| White | `#FFFFFF` | Default content |
| Blue 50 | `#F0F5FF` | Secondary light panels, table zebra, soft section breaks |
| Gradient | `#040038` to `#001AFF` at 145 degrees, mid-stop `#01006E` at 55% | Event surfaces only: cover, dividers, closing |

## Text color by surface

| Surface | Title | Body | Eyebrow | Meta / caption |
|---|---|---|---|---|
| Navy or gradient | White `#FFFFFF` | Blue 100 `#DDE8FF` at 88% | Light Blue `#5D8FFF` | Blue 200 `#BFD5FF` at 70% |
| White | Navy `#040038` | Neutral 900 `#111927` | Electric `#001AFF` | Neutral 900 at 55% |
| Blue 50 | Navy `#040038` | Neutral 900 `#111927` | Electric `#001AFF` | Neutral 900 at 55% |

## The two-blues rule

The most important color rule in the system:

- **Electric `#001AFF`** is the primary accent on light surfaces. Sparse and decisive, like punctuation. Never a large fill behind text (it vibrates), never small Electric text on Navy (contrast fails).
- **Light Blue `#5D8FFF`** is the accent on dark surfaces, where Electric would be too dim. Also fine for large soft fills.

## Hairlines

1 px rules at Neutral 900 at 12% on light, White at 14% on dark. At most one Electric or Light Blue 2 px active rule per surface.
