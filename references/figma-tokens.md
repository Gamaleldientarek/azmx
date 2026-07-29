# Figma Tokens

Exact live variables from `Majarah Library` (`AH4vTz9MkdX6QNA6uYNfYA`), read via the Desktop Bridge. **Twenty variables in two collections. Zero styles of any kind.**

Variable IDs are stable across sessions and safe to hard-code. Node IDs for components are also stable in this file. What is *not* stable is any node ID you obtain by `findOne` on a deck frame — re-resolve those every session.

## Collection 1 — `Color`

`VariableCollectionId:1:341` · one mode (`Mode 1` = `1:0`) · 11 variables

| Variable | ID | Hex |
|---|---|---|
| `Neutral/White` | `VariableID:1:342` | `#FFFFFF` |
| `Neutral/Subtle Grey` | `VariableID:1:423` | `#D1D1D1` |
| `Brand/Purple/200` | `VariableID:1:422` | `#B671FF` |
| `Brand/Purple/300` | `VariableID:1:421` | `#6500E8` |
| `Brand/Purple/500*` | `VariableID:1:347` | `#4B0AA0` |
| `Brand/Purple/600` | `VariableID:1:419` | `#380089` |
| `Brand/Purple/900` | `VariableID:1:420` | `#210054` |
| `Neutral/Grey*` | `VariableID:1:350` | `#231F20` |
| `Brand/Blue/300` | `VariableID:1:424` | `#010CFF` |
| `Brand/Blue/600` | `VariableID:1:425` | `#0000AD` |
| `Brand/Blue/900` | `VariableID:1:426` | `#020068` |

All are `scopes: ["ALL_SCOPES"]` and `hiddenFromPublishing: false` — they appear in the picker for consuming files.

**Note the ordering trap.** `Purple/500*` is `1:347` — a *lower* ID than `Purple/300` (`1:421`). The 300/500/600/900 steps were added at different times. Never infer a variable from its ID number; always map through the table.

## Collection 2 — `Font`

`VariableCollectionId:1:427` · **two modes** · 9 variables

| Mode | ID |
|---|---|
| `EN` (default) | `1:1` |
| `AR` | `1:2` |

| Variable | ID | EN value | AR value |
|---|---|---|---|
| `Font-names/Display-Font` | `VariableID:1:467` | `Oswald` | `FF Shamel Family` |
| `Font-names/Body-Font` | `VariableID:1:463` | `Helvetica Now Display` | `FF Shamel Family` |
| `font-weights/Bold` | `VariableID:1:459` | `bold` | `Sans One Bold` |
| `font-weights/Black` | `VariableID:1:460` | `black` | `Sans One Bold` |
| `font-weights/Semibold` | `VariableID:1:464` | `semibold` | `Sans One Bold` |
| `font-weights/Medium` | `VariableID:1:465` | `medium` | `Sans One Bold` |
| `font-weights/Regular` | `VariableID:1:461` | `regular` | `Sans One Book` |
| `font-weights/light` | `VariableID:1:466` | `light` | `Sans One Book` |
| `font-weights/Extralight` | `VariableID:1:462` | `thin` | `Sans One Book` |

All nine are **`hiddenFromPublishing: true`** — deliberately. They are implementation plumbing, not tokens a consuming designer should pick from. Keep them hidden.

Note the casing inconsistency in the live file: `font-weights/light` is lowercase where its siblings are capitalised (`Bold`, `Medium`, `Regular`, `Semibold`, `Black`, `Extralight`). This is a naming wart, not a bug — renaming it breaks every binding in the deck. Leave it.

For what the AR column costs you, read `variable-architecture.md`.

## No styles

Confirmed empty via `getLocalPaintStylesAsync`, `getLocalTextStylesAsync`, `getLocalEffectStylesAsync`, `getLocalGridStylesAsync`:

| Style type | Count |
|---|---|
| Paint | 0 |
| Text | 0 |
| Effect | 0 |
| Grid | 0 |

**Consequence:** there is no text-style layer to bind to, so `fontSize`, `lineHeight` and `letterSpacing` are set per node and have drifted. That is the mechanism behind the v1 defects — see `decision-log.md` D-06.

If you are asked to harden this system, the highest-leverage change is **adding text styles** for the eight recurring roles (cover headline, section headline, body headline, card title, body, eyebrow, chrome, stat numeral) and binding the deck to them. Colour is already safe; type is not.

## Setup block

Paste at the top of any `figma_execute` call.

```javascript
await figma.loadAllPagesAsync();
const playground = figma.root.children.find(p => p.name === 'Playground');
await figma.setCurrentPageAsync(playground);

const fonts = [
  { family: "Oswald", style: "Bold" },
  { family: "Oswald", style: "SemiBold" },
  { family: "Oswald", style: "Medium" },
  { family: "Oswald", style: "Regular" },
  { family: "Oswald", style: "Light" },
  { family: "Helvetica Now Display", style: "Bold" },
  { family: "Helvetica Now Display", style: "Medium" },
  { family: "Helvetica Now Display", style: "Regular" },
  { family: "Helvetica Now Display", style: "Light" },
];
for (const f of fonts) { try { await figma.loadFontAsync(f); } catch (e) {} }

const V = {
  displayFont: await figma.variables.getVariableByIdAsync('VariableID:1:467'),
  bodyFont:    await figma.variables.getVariableByIdAsync('VariableID:1:463'),
  white:       await figma.variables.getVariableByIdAsync('VariableID:1:342'),
  subtleGrey:  await figma.variables.getVariableByIdAsync('VariableID:1:423'),
  purple200:   await figma.variables.getVariableByIdAsync('VariableID:1:422'),
  purple300:   await figma.variables.getVariableByIdAsync('VariableID:1:421'),
  purple500:   await figma.variables.getVariableByIdAsync('VariableID:1:347'),
  purple600:   await figma.variables.getVariableByIdAsync('VariableID:1:419'),
  purple900:   await figma.variables.getVariableByIdAsync('VariableID:1:420'),
};
const Wgt = {
  Bold:     await figma.variables.getVariableByIdAsync('VariableID:1:459'),
  SemiBold: await figma.variables.getVariableByIdAsync('VariableID:1:464'),
  Medium:   await figma.variables.getVariableByIdAsync('VariableID:1:465'),
  Regular:  await figma.variables.getVariableByIdAsync('VariableID:1:461'),
  Light:    await figma.variables.getVariableByIdAsync('VariableID:1:466'),
};
const logoSecondaryWhite  = await figma.getNodeByIdAsync("1:371");
const logoSecondaryPurple = await figma.getNodeByIdAsync("1:378");
const logoPrimaryWhite    = await figma.getNodeByIdAsync("1:343");
```

`Oswald SemiBold` exists; `Helvetica Now Display SemiBold` does not. The `try/catch` swallows that so one missing face does not abort the whole load — but it also means a silent miss. If text renders in the wrong weight, check which face actually loaded.

## Binding helpers

```javascript
// Bind a variable to a fill. Note: this OVERRIDES paint.opacity —
// use node.opacity for transparency. See figma-workflow.md G-03.
function bindColor(node, prop, colorVar) {
  const paint = { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } };
  node[prop] = [figma.variables.setBoundVariableForPaint(paint, 'color', colorVar)];
}

// Bind family + weight so the node follows the EN/AR mode switch.
function bindType(textNode, kind /* 'd' | 'b' */, weightName) {
  textNode.setBoundVariable("fontFamily", kind === 'd' ? V.displayFont : V.bodyFont);
  if (Wgt[weightName]) textNode.setBoundVariable("fontStyle", Wgt[weightName]);
}
```

An unbound text node is invisible to the AR switch and will stay Latin in the Arabic deck. Bind at creation; retrofitting means walking every node.
