# Colab — Figma Working Practice

How to make changes to the design system inside Figma without losing work. Tool-agnostic where possible; the code samples assume the Figma Plugin API (via the Figma Console MCP Desktop Bridge).

---

## Node IDs

Node IDs are stable within a file, but **always re-verify component IDs at the start of a session** — searches and caches go stale, and an ID captured in a previous conversation may now point at something else, or nothing.

---

## Safety protocol

Before any structural or destructive change:

1. **Save a version-history checkpoint** — cheap, instant, and the only real undo across sessions:
   ```js
   await figma.saveVersionHistoryAsync('Title', 'What this checkpoint protects');
   ```
2. **Screenshot the target area first** so you know what existed.
3. For component schema changes, **freeze a flattened archive** — a linked clone does not protect you, because it still points at the components you are about to change. Export PNGs instead:
   ```js
   const bytes = await node.exportAsync({ format:'PNG', constraint:{ type:'SCALE', value:1 } });
   const img = figma.createImage(bytes);
   rect.fills = [{ type:'IMAGE', scaleMode:'FILL', imageHash: img.hash }];
   ```
4. **Batch heavy loops.** A single slide section can easily hold ten thousand-plus nodes and a couple of thousand instances — anything touching all of them must be chunked across calls or it will time out.
5. **Delete partial artefacts on failure.** Empty frames, orphaned layers, blank pages.

---

## Gotchas

- **Instances ignore direct text edits.** Use the instance-properties API, not `node.characters = ...`. Direct edits fail silently.
- **Phosphor icons are flattened fills, not strokes.** Bind colour variables to `fill`. A `stroke` binding does nothing.
- **Duotone Phosphor icons are two shapes.** One variable swap recolours only one layer.
- `figma.mixed` comes back from `fontName` and `fills` on multi-style text — handle it with `getStyledTextSegments`.
- Always `await figma.loadAllPagesAsync()` before traversing `figma.root`.
- Load fonts before writing text: `await figma.loadFontAsync({ family:'Inter', style:'Bold' })`.
- **The Plugin API cannot rename a file.** `figma.root.name` is read-only — assigning to it succeeds silently and changes nothing. Renaming must be done by hand in the Figma UI.
