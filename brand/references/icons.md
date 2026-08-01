# AZMX Icons

**Library: [Phosphor Icons](https://phosphoricons.com)** — MIT licensed, free for client work, no attribution required. 9,000+ icons, every one available in six weights.

Phosphor was chosen because it is the only major open library where weight is consistent across the entire set. AZMX's voice runs on weight contrast (serif against sans, Light through Black), so icons can follow the same discipline as the type instead of sitting at one fixed stroke.

## Ask before you use icons

**Icons are permitted on any AZMX surface — including decks, reports, covers, and editorial layouts — but never add them without confirming with the user first.** Ask a direct question before placing the first icon:

> "Do you want icons on this? Phosphor, Regular weight, Neutral 900 with at most one Electric accent — or keep it type and chevron only?"

This is the same rule as "Ask before you color" in `SKILL.md`. Icons change the character of a surface, so the choice belongs to the person whose work it is, not to the agent's default.

Rules for this step:

- **Never silently decide either way.** Adding an icon row unasked, and stripping icons out because a surface "feels editorial", are both wrong. One short question, then proceed.
- **Never silently decide either way on a printed document.** A printed A4 form, report, or PDF is a real surface where icons are permitted — ask, do not assume.
- If the user says no, the surface runs on type and the chevron alone. If they say yes, apply the locked usage below without further prompting.

| Context | Icons | Notes |
|---|---|---|
| Product UI, app screens, dashboards, data tables, forms | **Ask, default yes** | Function needs affordances type alone cannot carry |
| Web page utility (navigation, download, external link, copy, close) | **Ask, default yes** | Kept minimal |
| Decks, reports, covers, dividers, closings, printed documents | **Ask** | Permitted, but confirm. Owner decision, 2026-07-22 |
| Emails | **Ask, keep functional** | Calendar, location, link. Never decorative bullets |

The discipline that prevents icons reading as an AI tell is not a ban — it is restraint in how they are used: one weight, one size step per surface, at most one accent, paired with labels, and never a scattered row of decorative glyphs standing in for content.

**Icons never replace the chevron.** The chevron remains the list bullet, the section tick, the photo mask, and the page-number flow tick everywhere. Icons sit alongside it, carrying meaning the chevron cannot.

## Locked usage

Pick once per deliverable and do not mix:

- **Weight: Regular** for UI at default. `Light` is permitted on dark surfaces where Regular reads heavy; `Bold` only for a single emphasis moment. Never Fill or Duotone — they fight the flat, hairline character of the system.
- **Size: 20 px** for inline UI controls, **24 px** standalone, **32 px** for a feature anchor. All are on the 8 px grid.
- **Stroke** should read at the same visual weight as the system's 1 px hairlines. Do not scale an icon up and leave a hairline stroke looking thin beside it.

## Colour by surface

| Surface | Icon colour | Notes |
|---|---|---|
| White or Blue 50 | Neutral 900 `#111927` | Electric `#001AFF` only for the single active or primary icon |
| Navy, gradient, or a library image | White `#FFFFFF` | Light Blue `#5D8FFF` for secondary or inactive. Never Electric — it fails contrast on dark |

One accent icon per surface at most. The same restraint that governs Electric text governs Electric icons.

## Pairing with labels

Prefer icon plus label. A standalone icon is only acceptable for universally understood controls (close, back, download, external link), and it must still carry an `aria-label`. An icon-only button with no accessible name is an accessibility failure, not a style choice.

## Implementation

Web, no build step:

```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
<i class="ph ph-arrow-right" style="font-size:20px;color:var(--azmx-electric)"></i>
```

React:

```bash
npm install @phosphor-icons/react
```

```jsx
import { ArrowRight } from "@phosphor-icons/react";
<ArrowRight size={20} weight="regular" color="#111927" />
```

For decks, documents, and Figma, download the individual SVG from phosphoricons.com and set its stroke to the surface colour above rather than importing the whole set.
