# Colab — Component Specifications

---

## 1. `Colab Logo`

The wordmark is **`colab.`** — lowercase, geometric/techno face, terminal period. **Single L.** The legacy Figma filename misspells it "Collab".

Taglines: `USER EXPERIENCE LABORATORY` · `كولاب مختبر تجربة المستخدم`

> **Shipped 2026-07-26.** The target model below is now live in Figma and exported to `assets/logo/` — 21 SVGs, one per variant. The old set remains on the page as `Colab Logo (deprecated 2026-07-26)`; never instantiate it. Asset filenames, per-lockup sizes and usage rules are in `references/logo-and-shapes.md`.

### Target model — 7 lockups × 3 colours = 21 variants

| `Lockup` | Content | Approx size |
|---|---|---|
| `Mark` | `c.` alone | 200 × 200 |
| `Wordmark` | `colab.` | 497 × 92 |
| `Wordmark + Tagline EN` | wordmark over EN tagline | 497 × 208 |
| `Wordmark + Tagline AR` | wordmark over AR tagline | 497 × 220 |
| `Wide — Compact` | mark + wordmark, one line | ≈700 × 92 |
| `Wide — Tagline` | wordmark, tagline set to its right | ≈900 × 92 |
| `Wide — Full` | mark + wordmark + tagline, one line | ≈1100 × 92 |

| `Colour` | Hex | Use |
|---|---|---|
| `Pine Green` | `#103A21` | Default. Light and white grounds |
| `Electric Green` | `#34FF67` | Dark grounds — Pine or Deep Jade |
| `White` | `#FFFFFF` | Photography, dark grounds, wherever Electric would vibrate |

**Rules**
- Every variant sized to a consistent bounding box **per lockup**, so a colour swap never shifts layout.
- All fills bound to `Component-level/Logo-color/*`. A **White** entry must be added to that variable group.
- **Never mirror the logo for RTL.** Arabic is a separate lockup, not a flip.
- Slide header/footer slot is 136 × 60 — use `Wide — Compact` or `Wordmark`.

### Legacy state being replaced

Property model was three booleans — `RTL` (Yes/No) × `Text` (Yes/No) × `Logo only` (No/Yes) — implying 8 combinations, of which only **4 existed**. The model was also incoherent: `Logo only=Yes` combined with `Text=Yes` is meaningless. Inner layers were inconsistently named (`Logo` vs `Vector`), there was no colour property, and no description.

⚠️ Replacing a 3-boolean schema with an enum **detaches every existing instance**. Figma cannot remap it. A locked archive of the approved slides is taken first.

---

## 2. `Shapes`

The core graphic vocabulary — the pixel/dither system.

### Atoms
solid square · outlined square · plus `+` · cross `×` · ring `o` · chevron `^` `>` · checker/dither block

### Composites
square + checker corner + marker badge · image-frame treatments · multi-block clusters

> **Shipped 2026-07-26, partially.** 40 variants are live as `Shape` (20 options) × `Colour` (`Brand` / `White`) and exported to `assets/shapes/`. Three of the five target fixes landed: the property is renamed, every option has a real name, and a colour axis exists. **Two did not: bounding boxes are still un-normalised (36 × 36 → 479 × 267), and the shipped colour axis is `Brand` / `White` rather than the three named colours below.** The two-value axis is the better model — it preserves each shape's native two-tone construction instead of flattening the dither to one hue. See `references/logo-and-shapes.md`.

### Target model
- Rename the variant property from `Property` to something meaningful (e.g. `Shape`).
- **Normalise every variant to a consistent bounding box.** This is the single most important fix — inconsistent sizes are why variant swapping currently breaks layout.
- Give every option a real name. Resolve the `Image Squre` / `ImageSqure` duplicate.
- Lift the composite `Default` variant out of the primitive set — it contains nested `Shapes` instances and is not a primitive.
- Add a **`Colour`** property: `Electric Green` · `Pine Green` · `White`.

### Legacy state being replaced

21 variants under a property still called `Property` (Figma's default, never renamed), with options including `Property17`, `Property21`, `Default`, and two typo'd near-duplicates. Variant sizes ranged **36×36 to 479×267** — no consistent bounding box.

---

## 3. `Photo-Effect` — the background treatment stack

Already built and the most reusable asset in the file. Layer order:

1. `Image` — image fill
2. `Tint` — solid `#103A21`, variable-bound
3. `Noise #1`, `Noise #2` — image fills (grain)
4. `Color` — solid `#103A21`, variable-bound
5. `Shapes` instance — composite, bleeding off-canvas
6. **`Pixel Top` / `Pixel Right` / `Pixel Bottom` / `Pixel Left`** — four directional dissolve vectors, `#103A21` and `#34FF67`, variable-bound

This is the dither motif already componentised as four directional edge treatments. **Rebuild these to the 20px module** rather than authoring new ones.

---

## 4. Slide masters

### Legacy — frozen, do not edit
`Main Slide` and its children were built to a different grid (40px margins, 12 columns, 73px footer). They belong to the `Design Slides V2` lineage and are frozen as a style reference.

| Child | Type | Geometry |
|---|---|---|
| `Photo-Effect` | INSTANCE | 1920×1080 @ 0,0 |
| `Header` | INSTANCE | 1840×102 @ 40,47 |
| `Content` | **SLOT** | 1840×890 @ 40,47 |
| `Footer` | INSTANCE | 1840×73 @ 40,960 |
| `Main Grid` | INSTANCE | 1840×1080 @ 40,0 |

`Main Slide` itself: vertical auto-layout, gap 23, padding 47/40/47/40.

The **SLOT** pattern for `Content` is correct and should be carried forward into new masters.

`Main Grid` draws its guides as static **vectors**. New masters must not copy this — carry the `Advanced Presentation` grid style directly so the grid stays live and editable.

### New masters
Built fresh on the canonical grid: 100px content margins, 8 × 180 columns, 40px gutters, 50px bleed-safe, 98px footer band.

**A legacy V2 slide cannot be regenerated from a new master.** The two systems coexist by decision. V2 is a reference for visual style only.

---

## 5. Component inventory

| Component | State |
|---|---|
| `Colab Logo` | **Shipped 2026-07-26** — 21 variants, `Lockup` × `Colour`, built to target model. SVGs vendored in `assets/logo/` |
| `Shapes` | **Shipped 2026-07-26** — 40 variants, `Shape` × `Colour`. Names and colour axis fixed; **bounding boxes still not normalised**. SVGs vendored in `assets/shapes/` |
| `Photo-Effect` | **Exists** — rebuild atoms to 20px module |
| `Header` / `Footer` | **Exists** — frozen; new versions needed on the canonical grid |
| `Main Slide` | **Exists** — frozen; new master needed |
| Status / finding card | **Exists** in V2 — needs extracting as a component |
| Comparison bar (actual vs target) | **Exists** in V2 — needs extracting |
| KPI stat block | **Exists** in V2 — needs extracting |
| Category label chip | **Exists** in V2 — needs extracting |
| Device mockup frame | **Exists** in V2 — needs extracting |
| Methodology grid master | **Missing** |
| Panel big-number stats master | **Missing** |
| Sample-report frame master | **Missing** |
| Logo wall + lift stat master | **Missing** |
| 3-tier pricing master | **Missing** |
| Severity-rated issue row | **Missing** |
| Journey / flow diagram | **Missing** |
| Verbatim quote block | **Missing** |

Also present in the library and in poor order: Button, Field, Checkbox/Radio, Tag, Tab, Pagination, Spinner, Alert, Notification, Toast, Dropdown, Scrollbar, Breadcrumb, Lang Switcher, Loading Bar. These are UI components, not deck components — useful for product work, out of scope for the presentation template.
