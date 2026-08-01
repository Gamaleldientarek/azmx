/**
 * extract-figma-fields.js — pull form-field rectangles out of a Figma design.
 *
 * Part of the AZMX brand skill. See references/pdf-forms.md for the full pipeline.
 *
 * This is NOT run with node. Paste the body into the Figma plugin console via
 * `mcp__figma-console__figma_execute`, then save the returned `fields` array to
 * fields.json and feed it to scripts/build-pdf-form.mjs.
 *
 *   node build-pdf-form.mjs --src merged.pdf --fields fields.json --out fillable.pdf --expect <total>
 *
 * Requires: every input rectangle in the design is named `FIELD · <snake_case_id>`,
 * and the page frames are A4 (595 x 842) laid out left-to-right in page order.
 *
 * Set PAGE_NAME and FRAME_PREFIX before running.
 */

const PAGE_NAME = 'HR';                          // Figma page holding the frames
const FRAME_PREFIX = 'Employee Information';     // frames are matched by name prefix

await figma.loadAllPagesAsync();
const page = figma.root.children.find((p) => p.name === PAGE_NAME);
if (!page) throw new Error(`Page not found: ${PAGE_NAME}`);
await figma.setCurrentPageAsync(page); // dynamic-page access rejects `figma.currentPage =`

// Left-to-right x order defines page order.
const frames = page.children
  .filter((n) => n.name.startsWith(FRAME_PREFIX))
  .sort((a, b) => a.x - b.x);

const fields = [];
const warnings = [];

frames.forEach((frame, pageIndex) => {
  if (Math.round(frame.width) !== 595 || Math.round(frame.height) !== 842) {
    warnings.push(`${frame.name} is ${Math.round(frame.width)}x${Math.round(frame.height)}, expected 595x842`);
  }
  // Child x/y are already relative to the frame, which is what the stamper wants.
  frame.children.forEach((n) => {
    if (!n.name.startsWith('FIELD · ')) return;
    const id = n.name.replace('FIELD · ', '').trim();
    if (!/^[a-z0-9_]+$/.test(id)) warnings.push(`non-snake_case field id: "${id}"`);
    const round = (v) => Math.round(v * 100) / 100;
    fields.push({
      p: pageIndex,
      id,
      x: round(n.x),
      y: round(n.y),
      w: round(n.width),
      h: round(n.height),
      // Detect by size, not by name: a name like p2_coi_r1_name is a table cell
      // while p2_coi_yes is a checkbox. Size is the reliable signal.
      type: n.width <= 14 && n.height <= 14 ? 'check' : 'text',
    });
  });
});

const names = fields.map((f) => f.id);
const duplicates = [...new Set(names.filter((n, i) => names.indexOf(n) !== i))];
if (duplicates.length) warnings.push(`DUPLICATE ids: ${duplicates.join(', ')}`);

const perPage = {};
fields.forEach((f) => { perPage['p' + (f.p + 1)] = (perPage['p' + (f.p + 1)] || 0) + 1; });

return {
  total: fields.length,
  checks: fields.filter((f) => f.type === 'check').length,
  perPage,
  frames: frames.map((f) => ({ name: f.name, w: f.width, h: f.height })),
  warnings,
  fields,
};
