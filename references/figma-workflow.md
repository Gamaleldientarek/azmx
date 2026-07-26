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
- **Hugeicons Stroke instances are live strokes, not fills.** Bind colour variables to `stroke`. A `fill` binding does nothing. (Solid instances are the reverse — bind to `fill`. Check the `Style` variant first.)
- **Never flatten an icon.** Flattening converts live strokes to fills and permanently breaks the `stroke` binding and the stroke-weight step.
- **The Scale tool multiplies stroke weight; the W/H fields do not.** Resize icons with W/H, then set stroke weight explicitly — see the size table in `references/icons.md`.
- **Icon variants are `Type` and `Style`, not a weight.** Lock `Type=Rounded`, `Style=Stroke`. A component offering Thin/Light/Regular/Bold is not Hugeicons.
- `figma.mixed` comes back from `fontName` and `fills` on multi-style text — handle it with `getStyledTextSegments`.
- Always `await figma.loadAllPagesAsync()` before traversing `figma.root`.
- Load fonts before writing text: `await figma.loadFontAsync({ family:'Inter', style:'Bold' })`.
- **The Plugin API cannot rename a file.** `figma.root.name` is read-only — assigning to it succeeds silently and changes nothing. Renaming must be done by hand in the Figma UI.

---

## Hard-won gotchas from the report-template build (2026-07)

- **`setBoundVariableForPaint` strips base opacity — every time.** The safe pattern: assign the bound paint to the node FIRST, read it back, then respread with opacity:
  ```js
  n.fills = [figma.variables.setBoundVariableForPaint({type:'SOLID', color: RGB}, 'color', variable)];
  const cur = n.fills[0];
  n.fills = [{ ...cur, opacity: 0.07 }];
  ```
  Never spread the paint object before assigning it to a node — the opacity silently lands at 1. Instances created while a master carried the bad paint keep it as a local override; fix instance children with the same pattern separately.
- **Instance-override law.** Only text characters and fills can be overridden on instance children; position/size assignments throw. Design variants with identical geometry — paint-only deltas (alpha toggles) or nested-instance swaps.
- **Section bounds silently soft-delete masters.** A component master pushed outside its section's bounds is released/soft-deleted while its instances keep rendering (`getMainComponentAsync` still resolves). When rearranging, resize the section BEFORE moving anything deep; verify every child sits inside bounds afterwards.
- **Phosphor icon anatomy** (`Icon / *` masters in the report template): COMPONENT → frame `glyph` (carries an *invisible* fill — never make it visible) → VECTOR paths. To tint an instance: clear the frame fills, bind the VECTOR fills. Blanket "fill everything with fills" turns the icon into a solid square.
- **`resize()` on an instance does not scale its children** — a 32px glyph resized to 24 overflows its frame. Use `instance.rescale(factor)` for icon-scale changes; W/H fields only where the component was designed for it.
- **Live-edit collisions.** Manual edits or undo in the Figma UI during a scripted pass can revert masters mid-flight (deleted layers, reset overrides, frames renamed to a bare space). Save a version-history checkpoint after every scripted pass; restore from checkpoints rather than hand-rebuilding; avoid hand-editing while a pass is running.
- **Idempotent repair passes win.** When state is contested, write one script that re-asserts every fill, override and name from the source of truth and screenshot-verify after — piecemeal patches chase their own tail.
