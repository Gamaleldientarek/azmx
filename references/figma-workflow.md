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

---

## API traps from the V2 deck build (2026-07)

Ten traps, all hit in a live 32-slide build. None of them throw.

- **`hiddenFromPublishing` does not filter the variable picker — `scopes` does.** `hiddenFromPublishing` governs library consumption by *other* files and nothing else; a "hidden" variable is still in the picker for everyone working in this one. Filter by surface instead: `v.scopes = ['TEXT_FILL']`, `['FRAME_FILL','SHAPE_FILL']`, `['STROKE_COLOR']`. Park what nobody should pick on `['EFFECT_COLOR']`. **Scopes never affect existing bindings** — re-scoping 169 primitives on a live file changed nothing on the canvas. Full model in `references/variable-architecture.md`.

- **Section children use SECTION-RELATIVE coordinates.** A `SECTION` is its own coordinate space. Adding the section's own x/y to a child's target position doubles the offset — and a node pushed outside the section's bounds is silently released, the soft-delete trap above. Set `child.x = targetXInSection` directly; convert only when going to or from absolute space, and re-read `absoluteBoundingBox` to verify.

- **Instances appended to a frame use FRAME-relative coordinates.** Same trap, different container. A footer placed at `frame.x + 100` on a slide frame at x = 4200 lands at 4300 *inside* the frame — 4300px off a 1920px canvas, invisible and still in the layer list. After `frame.appendChild(inst)`, set `inst.x = 40; inst.y = 960` — the slide-local numbers, always.

- **`insertChild(i, node)` on an already-parented node can be a silent no-op.** Re-ordering an existing child by re-inserting it at a new index frequently does nothing and reports nothing. To float a node above a full-bleed ground rect, **move the ground instead** — `parent.insertChild(0, groundRect)` sends it to the back, which is the operation that reliably works.

- **`absoluteBoundingBox` on a rotated node returns the rotated bounds.** `node.width` and `node.height` remain the intrinsic, unrotated values. A packing or collision routine that mixes the two will under-reserve space for every rotated element. **Use `absoluteBoundingBox.width` / `.height` throughout, or none of it.**

- **A slide's visible ground may be a `content-panel` RECTANGLE child, not the frame fill.** Delete it as "an empty rectangle" and the background goes with it: the frame's own fill is white or unset, white text becomes invisible, and every Electric element on the slide instantly violates C-01b. **Check `frame.fills` before deleting any full-bleed child.** If the frame fill is `[]` or white, that rectangle *is* the ground.

- **Changing a slide's ground REQUIRES swapping the `Footer Bar` `Ground` variant.** The footer's text and the `colab.` wordmark are bound per variant. Move a slide from Dark to Light without swapping and they land at **1.00:1** — same colour on same colour. It is invisible on the slide *and* invisible in the thumbnail, so it survives review. Ground change and variant swap are one operation, never two.

- **Load fonts before `setTextStyleIdAsync`, and before setting `characters`.** Applying a text style pulls in a font the document may not have loaded; the call rejects. `await figma.loadFontAsync(styleFontName)` first — for both the style's font *and* the node's current font, since the node has to be re-laid-out from its existing state.

- **Auto-layout parents ignore x/y.** Assigning `child.x` inside a frame with `layoutMode !== 'NONE'` succeeds and does nothing — the layout engine re-places the child on the next tick. Either set `parent.layoutMode = 'NONE'`, or re-parent the child out, position it, and leave it out. There is no third option.

- **Applying a text style shifts the node a few pixels.** The style re-lays-out the text, and `textAutoResize` resizes the box; a node anchored at y168 lands at y164 or y171. **Re-anchor after every restyle:**
  ```js
  const x = n.x, y = n.y;
  await figma.loadFontAsync(styleFont);
  await n.setTextStyleIdAsync(style.id);
  n.x = x; n.y = y;
  ```
  Re-assert both axes, not just y. On a 32-slide pass this is the difference between the anchors holding at 0px deviation and every title being 4px out.
