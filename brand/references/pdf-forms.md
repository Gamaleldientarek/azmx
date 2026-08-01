# Designed PDF Forms — Figma to Fillable

A validated, repeatable pipeline for producing brand-compliant fillable PDF forms. It was proven end-to-end building the AZMX Employee Information Form (3 × A4, 99 form fields). Rebuilding that form, or building a new form of any kind, follows this pipeline exactly.

## The pipeline

| Stage | What happens | Tool |
|---|---|---|
| 1. Design | A4 frames, brand system applied, every input drawn as a discrete named rectangle | Figma |
| 2. Export | One PDF per frame, merged into one multi-page document | Figma MCP + `pdfunite` |
| 3. Stamp | AcroForm fields written at the exact coordinates the rectangles occupy | pdf-lib |
| 4. Verify | Programmatic and visual checks | poppler + pdf-lib |

## Why not Acrobat "Prepare Form"

Auto-detect is never needed. The designer already knows every field's exact rectangle — it was drawn deliberately, at a known position, with a known name. Stage 3 reads those rectangles and places fields deterministically.

Acrobat instead guesses from visual heuristics: it looks for underlines, boxes and whitespace, then infers where a field probably goes. On a dense table it merges adjacent cells into one field, misses cells with no visible underline, and names everything `Text1` … `Text47`. Exported form data from such a file is unreadable, and every fix is a manual drag in the Acrobat UI that is lost the moment the design is re-exported.

The pipeline below is reproducible: change the design, re-run the script, get the same field names at the new coordinates.

---

## Stage 1 — Design in Figma

### Canvas

- **A4 frame = 595 × 842 px.** Non-negotiable. 595 × 842 px maps 1:1 onto A4 in PDF points (595.28 × 841.89 pt), so the export needs no scaling and Figma coordinates become PDF coordinates directly.
- Never design A4 forms at 1240 × 1754 or 2480 × 3508. Those force a scale factor into every coordinate calculation in stage 3.
- Margins: 48 left, 48 right, 48 top, 56 bottom. Content width **499 px**.
- Lay frames out left-to-right with an 80 px gutter, so stage 3 can sort pages by `x`.

### Row height — the critical constraint

**Use 24 px rows for all form inputs.** 24 px ≈ 8.5 mm, a standard PDF form-field height, comfortable to fill.

A 32 px row height feels intuitively safer for Acrobat, and it is wrong. On the AZMX employee form, 32 px rows overflowed A4 badly:

| Page | Overflow at 32 px rows |
|---|---|
| 1 | 254 px |
| 2 | 166 px |
| 3 | 90 px |

That overflow forced destructive compressions — multi-column field grids, paired side-by-side sections, 2-up checklists — all of which drift from the source document the form must mirror. Dropping to 24 px let a faithful single-column layout fit every page with 18 / 54 / 55 px clearance.

**Check your vertical budget before compressing the layout. The row height is the cheaper lever.**

| Row type | Height |
|---|---|
| Form input row | 24 px |
| Table header row | 24 px |
| Signature / ink row | 48 px |
| Checkbox | 12 × 12 px |

### Table construction

Never build tables from stroked rectangles. Adjacent cells double up their shared borders, producing 2 px lines and confusing field boundaries. Instead:

1. Draw the label-column fill (Blue 50 `#F0F5FF`) and the body fill (White) as plain rectangles.
2. Draw each input as its own **white rectangle**, inset 1 px inside its cell.
3. Draw the grid as **separate 1 px rectangles** — horizontals across the full width, verticals at each column boundary.

This yields crisp single-pixel rules and unambiguous field rectangles.

### Naming convention

This is what makes stage 3 work. Every input rectangle MUST be named with the prefix `FIELD · ` followed by a snake_case identifier:

```
FIELD · p1_personal_government_id_iqama
FIELD · p2_emg_r1_phone_number
FIELD · p3_sig_signature
```

Pattern: `p{page}_{section}_{field}`, with `r{n}` for table rows (`p1_edu_r2_major`).

The extractor keys off the `FIELD · ` prefix, and the identifier becomes the AcroForm field name, so exported form data is human-readable. Name fields as you draw them — retrofitting names across 99 rectangles is tedious.

### Brand rules specific to forms

| Element | Treatment |
|---|---|
| Page background | White `#FFFFFF` — always, forms are bright-mode only |
| Page title | thmanyah serif display Medium 26 px, Electric `#001AFF` |
| Section heading | thmanyah serif display Medium 15 px, Electric `#001AFF` |
| Table header text | Azm X Variable SemiBold 8 px, Neutral 900 `#111927` |
| Field label | Azm X Variable Medium 8.5 px, Neutral 900 |
| Body / legal paragraph | Azm X Variable Regular 8.5 px, Neutral 900, 13 px line-height |
| Footnote & footer | Azm X Variable Regular 8 px, Neutral 500 `#6C737F` |
| Label cell fill | Blue 50 `#F0F5FF` |
| Input cell fill | White `#FFFFFF`, always, no exceptions |
| Grid hairline | 1 px `#C9CFD9` |
| Chevron | One per document maximum, as a title terminator. Never a background |

No shadows, no corner radii, no chevron backgrounds. Restraint is the luxury.

**Icons: ask, do not assume.** A printed form is a surface where Phosphor icons are permitted — but never add them, or omit them, without confirming with the user first. See `icons.md`. Where icons are approved on a form, they earn their place on functional instructions (a paperclip on an "attach your IBAN letter" callout) rather than decorating field labels, which already read clearly as type.

### Figma MCP gotcha

Files opened with dynamic-page document access reject `figma.currentPage = page`. Always use:

```js
await figma.loadAllPagesAsync();
const page = figma.root.children.find(p => p.name === 'HR');
await figma.setCurrentPageAsync(page);
```

---

## Stage 2 — Export to PDF

### Route A (preferred) — plugin MCP `download_assets`

Uses the plugin's own auth, so it works when the REST token is dead.

```
mcp__plugin_figma_figma__download_assets
  fileKey: <file key from the Figma URL>
  nodeId: <frame node id, e.g. 691:6030>
  defaultFormat: pdf
  defaultScale: 1
```

Returns a short-lived URL per frame. Download it:

```bash
curl -L -o page-1.pdf "<url>"
```

### Route B — `figma_take_screenshot` with `format: pdf`

Goes through the Figma REST API and needs a valid `FIGMA_ACCESS_TOKEN`. Fails with `403 Token expired` when the token has lapsed. Regenerate at figma.com → Settings → Security → Personal access tokens.

### Do not return PDF bytes through the MCP bridge

`figma.exportAsync({ format: 'PDF' })` works inside the plugin sandbox, but a 3-page A4 form is ~1 MB and base64-encoding that through a tool result is prohibitively large. The plugin sandbox cannot write to disk. Always export via URL and curl.

### Merge into one document

```bash
brew install poppler
pdfunite page-1.pdf page-2.pdf page-3.pdf "Form.pdf"
```

A single multi-page PDF is the correct deliverable for a form that gets filled and returned.

---

## Stage 3 — Stamp form fields with pdf-lib

```bash
npm i pdf-lib @pdf-lib/fontkit
```

Documented against pdf-lib 1.17.1.

### Coordinate transform

The one piece of real math. Figma's Y axis runs top-down from the frame's top-left. PDF's runs bottom-up from the page's bottom-left. For an A4 page of height H = 842:

```js
const pdfY = H - (figmaY + fieldHeight);
```

X is unchanged. Child node `x`/`y` in Figma are already relative to the parent frame, which is what you want. Because the frame is 595 × 842 and exports 1:1, no scale factor is involved.

### Extracting the field rectangles from Figma

```js
const frames = page.children
  .filter(n => n.name.startsWith('Employee Information'))
  .sort((a, b) => a.x - b.x);
const fields = [];
frames.forEach((f, pageIndex) => {
  f.children.forEach(n => {
    if (!n.name.startsWith('FIELD · ')) return;
    fields.push({
      p: pageIndex,
      id: n.name.replace('FIELD · ', '').trim(),
      x: n.x, y: n.y, w: n.width, h: n.height,
      type: (n.width <= 14 && n.height <= 14) ? 'check' : 'text',
    });
  });
});
```

Detect checkboxes **by size (≤ 14 × 14), not by name**. It is more robust than string matching: a name like `p2_coi_r1_name` sits in a COI *table*, while `p2_coi_yes` is a checkbox. Any name-based rule for that prefix gets one of them wrong.

### Writing the fields

```js
const pdfDoc = await PDFDocument.load(fs.readFileSync(SRC));
pdfDoc.registerFontkit(fontkit);
const font = await pdfDoc.embedFont(fs.readFileSync(TTF), { subset: true });
const form = pdfDoc.getForm();
const INK = rgb(0x11/255, 0x19/255, 0x27/255);

const tf = form.createTextField(f.id);
tf.setText('');
if (isMultiline) tf.enableMultiline();
tf.addToPage(page, { x: f.x, y, width: f.w, height: f.h, borderWidth: 0, textColor: INK, font });
tf.setFontSize(9);   // MUST come after addToPage

const cb = form.createCheckBox(f.id);
cb.addToPage(page, { x: f.x, y, width: f.w, height: f.h, borderWidth: 0 });

form.updateFieldAppearances(font);
```

### Rules

- **`setFontSize()` must be called AFTER `addToPage()`.** Calling it first throws `No /DA (default appearance) entry found for field: <name>` — the default-appearance entry is only created when the widget is added to a page. This is the single most likely error you will hit.
- **Always pass `borderWidth: 0`** and do not set `backgroundColor`. The border and fill are already drawn in the page content by the Figma design. Letting pdf-lib draw its own doubles them up and covers the design.
- **Embed the brand font** (`assets/fonts/azmx/AzmX-Regular.ttf`) and pass it to both `addToPage` and `updateFieldAppearances`. Without it, typed input falls back to Helvetica and looks foreign to the document.
- **Assert your field count.** Hard-fail the build script if the generated count drifts from the count extracted from Figma. Cheap insurance against a silently dropped section.

---

## Stage 4 — Verify

Never claim a form works without running these.

| Check | Command | Expect |
|---|---|---|
| Page count & size | `pdfinfo form.pdf \| grep -Ei "^pages\|page size"` | `Pages: 3`, `595 x 842 pts (A4)` |
| Fields present | pdf-lib: `getForm().getFields()` grouped by `constructor.name` | expected text/checkbox split |
| Live text, not raster | `pdftotext -f 1 -l 1 form.pdf -` | labels come back as text |
| Fonts embedded | `pdffonts form.pdf` | `emb` = yes |
| Visual | fill sample values, `pdftoppm -png -r 80`, inspect | text inside cells, nothing covered |

Figma exports type as **Type 3 fonts**. That is normal for its PDF pipeline. The text is still real, selectable and searchable — confirm via `pdftotext` — and it does not affect field placement.

---

## Environment gotchas

- **Google Drive (File Provider).** Paths under `~/Documents/My Drive/...` intermittently return `EPERM: operation not permitted` on write while DriveFS holds a sync lock, even though the directory is user-owned and `read_only_mode` is false. It clears on retry. Build to a local scratch directory, then copy to the Drive path.
- **macOS TCC.** Without Full Disk Access, a terminal can *create* files under `~/Documents` and `~/Desktop` but cannot *delete* them. Clean up stray files manually or grant Full Disk Access.
- **Poppler is the workhorse toolchain** — `pdfunite`, `pdfinfo`, `pdffonts`, `pdftotext`, `pdftoppm`. Install with `brew install poppler`.

---

## Reusable script

This skill ships both halves of stage 3:

| Script | Runs where | Purpose |
|---|---|---|
| `scripts/extract-figma-fields.js` | Pasted into `figma_execute` | Reads every `FIELD · ` rectangle and returns the `fields` array, plus warnings for duplicate ids, non-snake_case names, and off-spec frame sizes |
| `scripts/build-pdf-form.mjs` | Node, locally | Stamps those fields onto the exported PDF |

**Install the dependencies once**, inside the skill's `scripts/` directory:

```bash
cd ~/.claude/skills/azmx-brand/scripts && npm install
```

This is required and easy to miss. Node resolves bare imports relative to the *importing file*, not your working directory, so `build-pdf-form.mjs` will fail with `ERR_MODULE_NOT_FOUND: Cannot find package 'pdf-lib'` if `scripts/node_modules/` is absent — even when pdf-lib is installed in the project you are running from. `scripts/package.json` declares the dependencies; `scripts/node_modules/` is gitignored.

Once installed, call it from any directory with an absolute path:

```bash
node ~/.claude/skills/azmx-brand/scripts/build-pdf-form.mjs \
  --src merged.pdf --fields fields.json --out fillable.pdf --expect 99
```

| Flag | Meaning |
|---|---|
| `--src` | Source PDF, the merged designed document (required) |
| `--fields` | JSON field spec (required) |
| `--out` | Output path (required) |
| `--font` | TTF to embed. Defaults to `assets/fonts/azmx/AzmX-Regular.ttf` |
| `--size` | Field font size in pt. Default 9 |
| `--expect` | Hard-fail unless exactly this many fields are written |
| `--flatten` | Write a read-only flattened copy instead of live fields |

Always pass `--expect` with the total the extractor reported. It turns a silently dropped section into a build failure. The script also refuses to run on duplicate field ids, since duplicates collapse into a single AcroForm field.

`fields.json` is an array of field objects:

```json
[
  { "p": 0, "id": "p1_personal_government_id_iqama", "x": 200, "y": 168, "w": 297, "h": 24, "type": "text" },
  { "p": 1, "id": "p2_coi_yes", "x": 322, "y": 410, "w": 12, "h": 12, "type": "check" },
  { "p": 2, "id": "p3_notes_body", "x": 48, "y": 520, "w": 499, "h": 96, "type": "text", "multiline": true }
]
```

| Key | Type | Meaning |
|---|---|---|
| `p` | number | Zero-based page index |
| `id` | string | AcroForm field name, snake_case |
| `x`, `y` | number | Figma coordinates relative to the frame, top-left origin |
| `w`, `h` | number | Rectangle size in px, equal to PDF points |
| `type` | `"text"` \| `"check"` | Field kind |
| `multiline` | boolean, optional | Enables multiline on a text field |

---

## Worked example — AZMX Employee Information Form

| Property | Value |
|---|---|
| Pages | 3 × A4, 595 × 842 |
| Fields | 99 total — 86 text, 13 checkbox |
| Row height | 24 px |
| Layout | Single column, faithful to the source document, no compression |
| Vertical clearance | 18 px (p1) / 54 px (p2) / 55 px (p3) |
| Output size | ~1 MB |

The 32 px row experiment overflowed all three pages and forced multi-column grids that broke fidelity with the source. The 24 px rebuild fit every page in a single column with clearance to spare, and stamped all 99 fields in one pass with names that read cleanly in exported form data.
