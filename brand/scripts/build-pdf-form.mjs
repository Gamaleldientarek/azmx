#!/usr/bin/env node
/**
 * build-pdf-form.mjs — stamp AcroForm fields onto a designed PDF.
 *
 * Part of the AZMX brand skill. See references/pdf-forms.md for the full pipeline.
 *
 * Stage 3 of: Figma (A4 595x842) -> export PDF -> stamp fields -> verify.
 * Fields are placed at exact coordinates extracted from Figma, so Acrobat's
 * "Prepare Form" auto-detect is never needed.
 *
 * Usage:
 *   node build-pdf-form.mjs --src merged.pdf --fields fields.json --out fillable.pdf
 *
 * Options:
 *   --src <path>      Source PDF (the merged, designed document).      [required]
 *   --fields <path>   JSON array of field definitions.                 [required]
 *   --out <path>      Output path for the fillable PDF.                [required]
 *   --font <path>     TTF to embed for field text. Defaults to AzmX-Regular.
 *   --size <n>        Field font size in pt. Default 9.
 *   --expect <n>      Hard-fail unless exactly n fields are written.
 *   --flatten         Write a read-only flattened copy instead of live fields.
 *
 * fields.json shape — one object per field:
 *   {
 *     "p": 0,                       // zero-based page index
 *     "id": "p1_personal_name",     // becomes the AcroForm field name
 *     "x": 235, "y": 173,           // Figma coords (top-down, frame-relative)
 *     "w": 311, "h": 22,
 *     "type": "text",               // "text" | "check" | "select"
 *     "multiline": false,           // optional, text only
 *     "options": ["SAR", "USD"],    // required for "select"
 *     "default": "SAR"              // optional, select only
 *   }
 *
 * Dependencies: npm i pdf-lib @pdf-lib/fontkit
 */

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import os from 'os';
import path from 'path';

// ---------------------------------------------------------------- args
const argv = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fallback;
};
const flag = (name) => argv.includes(`--${name}`);

const SRC = arg('src');
const FIELDS = arg('fields');
const OUT = arg('out');
const SIZE = Number(arg('size', 9));
const EXPECT = arg('expect') ? Number(arg('expect')) : null;
const FLATTEN = flag('flatten');
const TTF = arg('font', path.join(os.homedir(), '.claude/skills/azmx-brand/assets/fonts/azmx/AzmX-Regular.ttf'));

if (!SRC || !FIELDS || !OUT) {
  console.error('Usage: node build-pdf-form.mjs --src <pdf> --fields <json> --out <pdf>');
  console.error('Run with no args for the full option list in the file header.');
  process.exit(2);
}
for (const [label, p] of [['--src', SRC], ['--fields', FIELDS]]) {
  if (!fs.existsSync(p)) { console.error(`${label} not found: ${p}`); process.exit(2); }
}

// AZMX Neutral 900 — body ink on light surfaces.
const INK = rgb(0x11 / 255, 0x19 / 255, 0x27 / 255);

// ---------------------------------------------------------------- load + validate
const fields = JSON.parse(fs.readFileSync(FIELDS, 'utf8'));
if (!Array.isArray(fields) || fields.length === 0) {
  console.error('--fields must be a non-empty JSON array.');
  process.exit(2);
}

const problems = [];
fields.forEach((f, i) => {
  for (const k of ['p', 'id', 'x', 'y', 'w', 'h']) {
    if (f[k] === undefined) problems.push(`field[${i}] missing "${k}"`);
  }
  if (f.type && !['text', 'check', 'select'].includes(f.type)) {
    problems.push(`field[${i}] (${f.id}) has invalid type "${f.type}"`);
  }
  if (f.type === 'select') {
    if (!Array.isArray(f.options) || f.options.length === 0) {
      problems.push(`field[${i}] (${f.id}) is type "select" but has no options array`);
    } else if (f.default && !f.options.includes(f.default)) {
      problems.push(`field[${i}] (${f.id}) default "${f.default}" is not one of its options`);
    }
  }
  if (f.w <= 0 || f.h <= 0) problems.push(`field[${i}] (${f.id}) has non-positive size`);
});

// Duplicate names silently collapse into one AcroForm field — always fatal.
const names = fields.map((f) => f.id);
const dupes = [...new Set(names.filter((n, i) => names.indexOf(n) !== i))];
if (dupes.length) problems.push(`duplicate field names: ${dupes.join(', ')}`);

if (problems.length) {
  console.error('Field spec invalid:');
  problems.forEach((p) => console.error('  - ' + p));
  process.exit(1);
}

// ---------------------------------------------------------------- build
const pdfDoc = await PDFDocument.load(fs.readFileSync(SRC));
const pages = pdfDoc.getPages();

let font = null;
if (fs.existsSync(TTF)) {
  pdfDoc.registerFontkit(fontkit);
  font = await pdfDoc.embedFont(fs.readFileSync(TTF), { subset: true });
} else {
  console.warn(`! Font not found at ${TTF} — falling back to Helvetica.`);
}

const form = pdfDoc.getForm();
const counts = { text: 0, check: 0, select: 0 };

for (const f of fields) {
  const page = pages[f.p];
  if (!page) {
    console.error(`Field "${f.id}" targets page index ${f.p}, but the PDF has ${pages.length} page(s).`);
    process.exit(1);
  }

  // Figma Y is top-down from the frame's top-left; PDF Y is bottom-up from the
  // page's bottom-left. Frames export 1:1, so no scale factor is involved.
  const y = page.getHeight() - (f.y + f.h);
  const box = { x: f.x, y, width: f.w, height: f.h };
  const type = f.type || (f.w <= 14 && f.h <= 14 ? 'check' : 'text');

  if (type === 'check') {
    const cb = form.createCheckBox(f.id);
    // borderWidth 0: the square is already drawn in the page content by Figma.
    cb.addToPage(page, { ...box, borderWidth: 0 });
    counts.check++;
  } else if (type === 'select') {
    const dd = form.createDropdown(f.id);
    dd.addOptions(f.options);
    if (f.default) dd.select(f.default);
    dd.addToPage(page, { ...box, borderWidth: 0, textColor: INK, ...(font ? { font } : {}) });
    dd.setFontSize(SIZE); // MUST follow addToPage — /DA is created there.
    counts.select++;
  } else {
    const tf = form.createTextField(f.id);
    tf.setText('');
    if (f.multiline) tf.enableMultiline();
    tf.addToPage(page, { ...box, borderWidth: 0, textColor: INK, ...(font ? { font } : {}) });
    tf.setFontSize(SIZE); // MUST follow addToPage — /DA is created there.
    counts.text++;
  }
}

const total = counts.text + counts.check + counts.select;
if (EXPECT !== null && total !== EXPECT) {
  console.error(`Field count mismatch: wrote ${total}, expected ${EXPECT}.`);
  process.exit(1);
}

if (font) form.updateFieldAppearances(font);
if (FLATTEN) form.flatten();

fs.writeFileSync(OUT, await pdfDoc.save());

console.log(`pages     ${pages.length}`);
console.log(`fields    ${total}  (text ${counts.text}, check ${counts.check}, select ${counts.select})`);
console.log(`font      ${font ? path.basename(TTF) + ' embedded' : 'Helvetica (fallback)'}`);
if (FLATTEN) console.log('flattened read-only');
console.log(`wrote     ${OUT}`);
