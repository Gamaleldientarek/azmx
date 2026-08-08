#!/usr/bin/env node
/*
 * AZM X tokens → CSS custom properties
 *
 *   node scripts/tokens-to-css.mjs > azmx-tokens.css
 *   node scripts/tokens-to-css.mjs --palette orange --theme dark   # flatten one combination
 *   node scripts/tokens-to-css.mjs --json                          # resolved values as JSON
 *
 * Reads assets/tokens/azmx-tokens.json and resolves every alias.
 *
 * Default output carries all twelve combinations, driven by attributes:
 *
 *   <body data-palette="orange" data-theme="dark">
 *
 * Palette defaults to blue, theme to light, so plain <body> gives the house look.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = JSON.parse(readFileSync(join(HERE, '..', 'assets', 'tokens', 'azmx-tokens.json'), 'utf8'));

const PALETTES = DATA['1b. Palette'].modes.map(m => m.toLowerCase());
const THEMES   = DATA['2. Semantic'].modes.map(m => m.toLowerCase());

const args = process.argv.slice(2);
const flag = n => { const i = args.indexOf('--' + n); return i === -1 ? null : args[i + 1]; };
const onlyPalette = flag('palette');
const onlyTheme   = flag('theme');
const asJson      = args.includes('--json');

// ---- resolve ----
// Every token is either a literal, or "@other/token". Palette tokens hold one
// value per palette; Semantic tokens one per theme. Resolution therefore needs
// to know which palette and which theme it is resolving *for*.
const prim = DATA['1. Primitives'].tokens;
const pal  = DATA['1b. Palette'].tokens;
const sem  = DATA['2. Semantic'].tokens;
const comp = DATA['3. Component'].tokens;
const canv = DATA['4. Canvas'].tokens;

function resolve(ref, paletteIdx, themeIdx, depth = 0) {
  if (depth > 12) throw new Error('alias loop at ' + ref);
  if (typeof ref !== 'string' || !ref.startsWith('@')) return ref;
  const name = ref.slice(1);

  if (name in prim) return prim[name];
  if (name in pal)  return resolve(pal[name][paletteIdx], paletteIdx, themeIdx, depth + 1);
  if (name in sem)  return resolve(sem[name][themeIdx],   paletteIdx, themeIdx, depth + 1);
  if (name in comp) return resolve(comp[name],            paletteIdx, themeIdx, depth + 1);
  if (name in canv) return resolve(canv[name],            paletteIdx, themeIdx, depth + 1);
  throw new Error('unknown token: ' + name);
}

const varName = n => '--azmx-' + n.replace(/\//g, '-');
const fmt = v => typeof v === 'number' ? String(v) : v;

/** Every semantic + component + canvas token, resolved for one combination. */
function resolveAll(paletteIdx, themeIdx) {
  const out = {};
  for (const n of Object.keys(sem))  out[n] = resolve(sem[n][themeIdx], paletteIdx, themeIdx);
  for (const n of Object.keys(comp)) out[n] = resolve(comp[n],          paletteIdx, themeIdx);
  for (const n of Object.keys(canv)) out[n] = resolve(canv[n],          paletteIdx, themeIdx);
  return out;
}

// ---- single combination ----
if (onlyPalette || onlyTheme) {
  const p = PALETTES.indexOf((onlyPalette || 'blue').toLowerCase());
  const t = THEMES.indexOf((onlyTheme || 'light').toLowerCase());
  if (p === -1) { console.error('unknown palette. one of: ' + PALETTES.join(', ')); process.exit(1); }
  if (t === -1) { console.error('unknown theme. one of: ' + THEMES.join(', ')); process.exit(1); }
  const vals = resolveAll(p, t);
  if (asJson) { console.log(JSON.stringify(vals, null, 2)); process.exit(0); }
  console.log(`/* AZM X tokens — ${PALETTES[p]} / ${THEMES[t]} — v${DATA.$meta.version} */`);
  console.log(':root {');
  for (const [n, v] of Object.entries(vals)) console.log(`  ${varName(n)}: ${fmt(v)};`);
  console.log('}');
  process.exit(0);
}

// ---- all twelve ----
if (asJson) {
  const all = {};
  PALETTES.forEach((pn, p) => THEMES.forEach((tn, t) => { all[`${pn}/${tn}`] = resolveAll(p, t); }));
  console.log(JSON.stringify(all, null, 2));
  process.exit(0);
}

const L = [];
L.push(`/* AZM X Design Tokens v${DATA.$meta.version} — generated, do not edit by hand */`);
L.push(`/* Source: ${DATA.$meta.source} (${DATA.$meta.fileKey}), exported ${DATA.$meta.exported} */`);
L.push('/*');
L.push(' *   <body data-palette="orange" data-theme="dark">');
L.push(' *   color: var(--azmx-text-primary);');
L.push(' *   background: var(--azmx-surface-page);');
L.push(' *');
L.push(' * Palette defaults to blue, theme to light.');
L.push(' */');
L.push('');

// primitives, for the rare case you need one directly
L.push('/* Primitives — reference only. Prefer the semantic variables below. */');
L.push(':root {');
for (const [n, v] of Object.entries(prim)) L.push(`  ${varName(n)}: ${fmt(v)};`);
L.push('}');
L.push('');

// base = blue / light
const base = resolveAll(0, 0);
L.push('/* Semantic — blue / light */');
L.push(':root {');
for (const [n, v] of Object.entries(base)) L.push(`  ${varName(n)}: ${fmt(v)};`);
L.push('}');
L.push('');

// only emit what actually differs from base, so the file stays readable
PALETTES.forEach((pn, p) => THEMES.forEach((tn, t) => {
  if (p === 0 && t === 0) return;
  const vals = resolveAll(p, t);
  const diff = Object.entries(vals).filter(([n, v]) => String(v) !== String(base[n]));
  if (!diff.length) return;
  const sel = p === 0
    ? `[data-theme="${tn}"]`
    : (t === 0 ? `[data-palette="${pn}"]` : `[data-palette="${pn}"][data-theme="${tn}"]`);
  L.push(`/* ${pn} / ${tn} — ${diff.length} overrides */`);
  L.push(`${sel} {`);
  for (const [n, v] of diff) L.push(`  ${varName(n)}: ${fmt(v)};`);
  L.push('}');
  L.push('');
}));

// the gradient, per palette, as a ready-made value
L.push('/* Brand gradient — event surfaces only: covers, dividers, closings */');
PALETTES.forEach((pn, p) => {
  const g = ['gradient/start', 'gradient/mid', 'gradient/mid-alt', 'gradient/end']
    .map(n => resolve(sem[n][0], p, 0));
  const sel = p === 0 ? ':root' : `[data-palette="${pn}"]`;
  L.push(`${sel} { --azmx-gradient: linear-gradient(145deg, ${g[0]} 0%, ${g[1]} 55%, ${g[3]} 100%); }`);
});
L.push('');
L.push('/* Fonts — load from assets/fonts.css */');
L.push(':root {');
L.push(`  --azmx-font-heading: "${prim['font/family/display']}", Georgia, serif;`);
L.push(`  --azmx-font-text: "${prim['font/family/body']}", system-ui, sans-serif;`);
L.push('}');

console.log(L.join('\n'));
