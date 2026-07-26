# Colab Icon Index

Every icon vendored in this repository: **5,437** Hugeicons Stroke Rounded SVGs, pinned to `@hugeicons/core-free-icons@4.2.3`, MIT licensed.

The only style Colab uses and the only style Hugeicons licenses MIT. 24x24 grid, 1.5px stroke, round caps and joins, `currentColor`.

**No other Hugeicons style or type is vendored here.** Solid, Duotone, Twotone and Bulk styles, and the Sharp and Standard types, are Hugeicons Pro and are not redistributable. See `references/icons.md` for what to do when a design calls for Solid.

For the house rules — Rounded-only, Stroke-default, the colour law, sizes, and the 43-icon proven working set — read **`references/icons.md`**. This file is a generated lookup table and nothing more.

---

## Downloading

Every URL is derivable from the icon name. There is no need to look a name up in the tables below if you already know it:

```text
https://raw.githubusercontent.com/Gamaleldientarek/colab-design-skill/main/assets/icons/stroke-rounded/<icon-name>.svg
```

```bash
curl -L -O "https://raw.githubusercontent.com/Gamaleldientarek/colab-design-skill/main/assets/icons/stroke-rounded/arrow-right-02.svg"
```

Grab several at once:

```bash
for i in arrow-right-02 checkmark-circle-01 information-circle; do
  curl -sL -O "https://raw.githubusercontent.com/Gamaleldientarek/colab-design-skill/main/assets/icons/stroke-rounded/$i.svg"
done
```

Each file is a bare 24x24 `viewBox` with `stroke="currentColor"` and no metadata. Inline in HTML and it inherits `color`. Import into Figma, PowerPoint or Illustrator and `currentColor` resolves to black — set the stroke to the surface's icon colour immediately after placing.

---

## Shards

5,437 rows in one file is unreadable, so the index is split by the first letter of the icon name. Letters longer than 450 rows are split into numbered parts.

| Shard | Icons | Range |
|---|---|---|
| [`a`](icon-index/a.md) | 427 | `a-arrow-down` &rarr; `axis-three-d` |
| [`b`](icon-index/b.md) | 405 | `baby-01` &rarr; `bus-front` |
| [`c-1`](icon-index/c-1.md) | 399 | `c` &rarr; `circle-arrow-down-03` |
| [`c-2`](icon-index/c-2.md) | 399 | `circle-arrow-down-double` &rarr; `cylinder-04` |
| [`d`](icon-index/d.md) | 240 | `dam` &rarr; `duplex` |
| [`e`](icon-index/e.md) | 103 | `ear` &rarr; `eye-off` |
| [`f`](icon-index/f.md) | 298 | `face-id` &rarr; `funnel-x` |
| [`g`](icon-index/g.md) | 148 | `galaxy` &rarr; `gymnastic-rings` |
| [`h`](icon-index/h.md) | 180 | `hackerrank` &rarr; `hyperbole` |
| [`i`](icon-index/i.md) | 103 | `ice-cream-01` &rarr; `iteration-cw` |
| [`j`](icon-index/j.md) | 26 | `jar` &rarr; `justice-scale-02` |
| [`k`](icon-index/k.md) | 48 | `kaaba-01` &rarr; `kurta-01` |
| [`l`](icon-index/l.md) | 232 | `label` &rarr; `lungs` |
| [`m`](icon-index/m.md) | 413 | `machine-robot` &rarr; `mymind` |
| [`n`](icon-index/n.md) | 88 | `n-th-root` &rarr; `nut-off` |
| [`o`](icon-index/o.md) | 32 | `obtuse` &rarr; `oven` |
| [`p`](icon-index/p.md) | 332 | `package` &rarr; `python` |
| [`q`](icon-index/q.md) | 26 | `qq-plot` &rarr; `qwen` |
| [`r`](icon-index/r.md) | 197 | `racing-flag` &rarr; `russian-ruble` |
| [`s-1`](icon-index/s-1.md) | 321 | `sad-01` &rarr; `sofa-single` |
| [`s-2`](icon-index/s-2.md) | 320 | `soft-drink-01` &rarr; `system-update-02` |
| [`t`](icon-index/t.md) | 335 | `t-shirt` &rarr; `typescript-03` |
| [`u`](icon-index/u.md) | 116 | `uber` &rarr; `uv-03` |
| [`v`](icon-index/v.md) | 61 | `vaccine` &rarr; `vynil-03` |
| [`w`](icon-index/w.md) | 149 | `w-three-schools` &rarr; `wudu` |
| [`x`](icon-index/x.md) | 11 | `x-ray` &rarr; `xsl-02` |
| [`y`](icon-index/y.md) | 14 | `yelp` &rarr; `yurt` |
| [`z`](icon-index/z.md) | 14 | `zakat` &rarr; `zzz` |

To search the whole set by name from a checkout:

```bash
ls assets/icons/stroke-rounded | grep chart
```

---

Regenerate this file and every shard with `python3 scripts/rebuild-icon-index.py`. Do not edit either by hand.
