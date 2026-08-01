# Figma Workflow

Building Majarah work inside Figma via the Figma Console MCP Desktop Bridge. The gotchas below all cost real time during the v1 build.

## Connecting

1. Open **Figma Desktop** on `Majarah Library`
2. `Plugins → Development → Figma Desktop Bridge → Run`
3. Verify: `figma_get_status` with `probe: true` — look for `"valid": true` and a `probeResult.latencyMs`
4. Navigate: `await figma.setCurrentPageAsync(page)`

### G-01 · The bridge drops when the plugin window closes

The WebSocket lives in the plugin window. Closing it, switching files, or letting Figma background the plugin kills the connection — and `figma_get_status` will report `failureLayer: 2, "No active file connected"`.

**Keep the plugin window open for the whole session.** If it drops mid-build, reopen it; the plugin rescans ports 9223–9232 on launch and reattaches. You do not need to restart the MCP server.

Watch for stale servers: the status payload lists `otherInstances`. Several old instances holding 9223–9225 will push the live server to a fallback port. That is fine and self-resolving, but it means the port in the status message changes between sessions — never hard-code it.

### G-02 · Page navigation must be async

```javascript
await figma.loadAllPagesAsync();                    // required first
const p = figma.root.children.find(x => x.name === 'Playground');
await figma.setCurrentPageAsync(p);                 // correct
// figma.currentPage = p;                           // throws — dynamic-page access
```

`loadAllPagesAsync()` before any `findAll` / `findOne` across pages, or you will silently search an unloaded tree and get zero results.

## Colour and opacity

### G-03 · Variable-bound fills override paint opacity

This is the single most confusing behaviour in the file. Because every fill is bound to a `Color` variable, setting `paint.opacity` has no effect — the binding wins.

```javascript
// WRONG — opacity silently ignored
node.fills = [{ type:'SOLID', color:{...}, opacity:0.35,
                boundVariables:{ color:{ type:'VARIABLE_ALIAS', id:'...' } } }];

// RIGHT — whole-node opacity
bindColor(node, 'fills', V.purple600);
node.opacity = 0.35;
```

Every ghost-text and hairline opacity in the deck uses `node.opacity`. If a ghost renders at full strength, this is why.

### G-04 · Bind, don't set

```javascript
function bindColor(node, prop, colorVar) {
  const paint = { type:'SOLID', color:{ r:0.5, g:0.5, b:0.5 } };
  node[prop] = [figma.variables.setBoundVariableForPaint(paint, 'color', colorVar)];
}
```

The placeholder grey is discarded — `setBoundVariableForPaint` replaces it with the variable's value. Do not bother computing the real colour first.

## Text

### G-05 · Load fonts before setting `fontName`

```javascript
await figma.loadFontAsync({ family:"Oswald", style:"Bold" });
t.fontName = { family:"Oswald", style:"Bold" };   // only now
```

Setting `fontName` for an unloaded face throws. Load every family/style combination you intend to use up front — see the setup block in `figma-tokens.md`.

### G-06 · `Helvetica Now Display SemiBold` does not exist

It is not installed. Fall back to `Medium`. If you wrap the font loop in `try/catch` (recommended, so one miss does not abort the batch) the failure is silent and text renders at the wrong weight. Check what actually loaded when a body node looks light.

`Oswald SemiBold` **does** exist and is used for card titles.

### G-07 · Bind family and weight, always

```javascript
t.setBoundVariable("fontFamily", V.displayFont);
t.setBoundVariable("fontStyle", Wgt.Bold);
```

An unbound node ignores the EN/AR mode switch and stays Latin in the Arabic deck. This is invisible until someone flips the mode, at which point you are walking seven hundred nodes.

### G-08 · Set sizes explicitly; never scale a group

`rescale()` on a group multiplies **every nested value** — font sizes, tracking, gaps, frame dimensions. That is how the v1 stat row ended up with 6.4pt labels (`decision-log.md` D-07).

To resize a layout: set the frame's width/height, then set each type size from the scale in `typography.md`. Slower, correct.

The tell that someone scaled: fractional font sizes and fractional letter-spacing.

## Layout

### G-09 · Vertical auto layout clips without `AUTO` primary sizing

```javascript
f.layoutMode = "VERTICAL";
f.primaryAxisSizingMode = "AUTO";     // hug content height
f.counterAxisSizingMode = "FIXED";    // fixed width
```

With `FIXED` on the primary axis and more content than height, children are clipped rather than overflowing visibly — so it looks like the content was never added.

### G-10 · Z-order for ghost text

```javascript
parent.insertChild(0, ghost);   // index 0 = back
```

`appendChild` puts it in front, where it covers the headline. Opacity does not save you.

### G-11 · Instances need `rescale`, not `resize`

`rescale()` scales strokes and effects proportionally; `resize()` stretches geometry. On a logo the difference is visible immediately.

### G-12 · Component instances resist direct text edits

For `node.type === 'INSTANCE'`, setting text on a nested node **fails silently**. Use `figma_set_instance_properties` and check `instance.componentProperties` for the available props — names may carry `#nodeId` suffixes.

The Majarah logo components have no text properties, so this rarely bites here. It matters if you componentise a slide.

## Execution and cleanup

### G-13 · `figma_execute` times out at 30s

Budget **2–3 slides per call**. A single call building six slides will time out partway, leaving half-built frames.

### G-14 · Clean up partial artifacts before retrying

If a call fails midway, delete what it created before re-running — otherwise you get duplicates stacked at identical coordinates, which are nearly impossible to spot in a screenshot.

```javascript
const stale = figma.currentPage.findAll(n => n.name === 'AL' && n.parent === figma.currentPage);
stale.forEach(n => n.remove());
```

When rebuilding a section, remove all old elements first. Guard mass-removal so you do not delete what you just made:

```javascript
function isInside(node, containerName) {
  let p = node.parent;
  while (p) { if (p.name === containerName) return true; p = p.parent; }
  return false;
}
targets.filter(n => !isInside(n, 'PillarRow')).forEach(n => n.remove());
```

### G-15 · Node IDs from `findOne` are not durable

Component and variable IDs in this file are stable and safe to hard-code. Node IDs you *discover* by name are not — re-resolve them each session:

```javascript
const row = figma.currentPage.findOne(n => n.name === 'AnalyticsRow');
```

### G-16 · Screenshot and actually look at it

The most important step, and the cheapest. Both D-01 contrast failures were completely invisible in the node data — every fill was correctly variable-bound, every value was on-palette — and completely obvious the moment the frame was rendered.

Use `figma_take_screenshot` with the frame's `nodeId` at `scale: 0.4` for a quick read. After any batch: screenshot, check alignment, spacing, overlap and contrast, then iterate. Cap at three iterations before stepping back to reconsider the composition.

## Verification pass

After a build, check:

| Check | How |
|---|---|
| No raw hex anywhere | `scripts/brand-check.py --scan` on any exported code; in Figma, every fill should show a variable name |
| No fractional type values | Walk text nodes; `fontSize % 1 !== 0` or fractional `letterSpacing.value` means a scale drag |
| Accent line contrast | `scripts/brand-check.py --pair <accent> <ground> --size <pt> --bold` |
| Nothing under 10pt | Walk text nodes for `fontSize < 10` |
| Chrome consistent | Page indicator at `120,92`; logo at `1540,78`; footer at `120,1030` on every frame |
| Family/weight bound | Every text node has `boundVariables.fontFamily` and `.fontStyle` |
| Ghost within cap | `opacity <= 0.35` on dark, `<= 0.22` on light |

A compact walker for the type checks:

```javascript
const bad = figma.currentPage.findAll(n => n.type === 'TEXT').filter(n =>
  (typeof n.fontSize === 'number' && n.fontSize % 1 !== 0) ||
  (typeof n.fontSize === 'number' && n.fontSize < 10) ||
  !(n.boundVariables && n.boundVariables.fontFamily)
).map(n => ({ name: n.name, size: n.fontSize, bound: !!(n.boundVariables||{}).fontFamily }));
return bad;
```
