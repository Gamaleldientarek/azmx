/*
 * AZM X Design Tokens — export
 *
 * Run inside the Figma Desktop Bridge plugin console against
 * "New Direction Library | AZM X" (j8ugBpb1yUUyL8hfb6FHKR).
 *
 * Returns the full token system as one object: five collections, every mode,
 * aliases preserved as names rather than IDs, plus paint and text styles.
 *
 * Emits two shapes:
 *   raw   — mirrors Figma exactly, aliases intact, best for round-tripping
 *   dtcg  — W3C Design Tokens Community Group format (v2025.10), $value/$type,
 *           for Style Dictionary, Tokens Studio, Supernova, Penpot
 */

const NAMES = ['1. Primitives', '1b. Palette', '2. Semantic', '3. Component', '4. Canvas'];

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const C = {};
NAMES.forEach(n => C[n] = cols.find(c => c.name === n));
const all = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(all.map(v => [v.id, v]));

const hex = c => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase()
  + ((c.a !== undefined && c.a < 0.999) ? Math.round(c.a * 255).toString(16).padStart(2, '0').toUpperCase() : '');

// ---- raw ----
const raw = {
  meta: {
    file: 'New Direction Library | AZM X',
    fileKey: 'j8ugBpb1yUUyL8hfb6FHKR',
    exported: null,                      // stamp after the call; Date is unavailable in the sandbox
    collections: NAMES.map(n => ({
      name: n,
      modes: C[n] ? C[n].modes.map(m => m.name) : [],
      count: C[n] ? all.filter(v => v.variableCollectionId === C[n].id).length : 0
    }))
  },
  tokens: {}
};

for (const n of NAMES) {
  const col = C[n];
  if (!col) continue;
  raw.tokens[n] = all
    .filter(v => v.variableCollectionId === col.id)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(v => {
      const modes = {};
      col.modes.forEach(m => {
        const r = v.valuesByMode[m.modeId];
        if (r && r.type === 'VARIABLE_ALIAS') {
          const t = byId[r.id];
          modes[m.name] = { alias: t ? t.name : 'MISSING' };
        } else if (r && typeof r === 'object' && 'r' in r) {
          modes[m.name] = { value: hex(r) };
        } else {
          modes[m.name] = { value: r };
        }
      });
      return {
        name: v.name,
        type: v.resolvedType,
        scopes: v.scopes,
        hiddenFromPublishing: v.hiddenFromPublishing,
        description: v.description || '',
        modes
      };
    });
}

// ---- styles ----
const paint = await figma.getLocalPaintStylesAsync();
const text = await figma.getLocalTextStylesAsync();
raw.styles = {
  paint: paint.map(s => ({
    name: s.name,
    description: s.description,
    paints: s.paints.map(p => p.type === 'SOLID'
      ? { type: 'SOLID', color: hex(p.color) }
      : { type: p.type, stops: (p.gradientStops || []).map(g => ({ position: g.position, color: hex(g.color) })) })
  })),
  text: text.map(s => ({
    name: s.name,
    description: s.description,
    fontFamily: s.fontName.family,
    fontStyle: s.fontName.style,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
    boundVariables: Object.fromEntries(
      Object.entries(s.boundVariables || {}).map(([k, b]) => [k, byId[b.id] ? byId[b.id].name : '?'])
    )
  }))
};

// ---- DTCG (W3C v2025.10) ----
// Multi-mode collections emit one tree per mode, since DTCG has no native mode concept.
const DTCG_TYPE = { COLOR: 'color', FLOAT: 'number', STRING: 'fontFamily', BOOLEAN: 'boolean' };
const dtcg = {};

for (const n of NAMES) {
  const col = C[n];
  if (!col) continue;
  const vars = all.filter(v => v.variableCollectionId === col.id);
  col.modes.forEach(m => {
    const key = col.modes.length > 1 ? n + ' [' + m.name + ']' : n;
    const tree = {};
    vars.forEach(v => {
      const parts = v.name.split('/');
      let node = tree;
      parts.forEach((p, i) => {
        if (i === parts.length - 1) {
          const r = v.valuesByMode[m.modeId];
          let val;
          if (r && r.type === 'VARIABLE_ALIAS') {
            const t = byId[r.id];
            val = t ? '{' + t.name.split('/').join('.') + '}' : null;
          } else if (r && typeof r === 'object' && 'r' in r) {
            val = hex(r);
          } else {
            val = r;
          }
          node[p] = { $value: val, $type: DTCG_TYPE[v.resolvedType] || 'other' };
          if (v.description) node[p].$description = v.description;
        } else {
          node[p] = node[p] || {};
          node = node[p];
        }
      });
    });
    dtcg[key] = tree;
  });
}

return { raw, dtcg, bytes: JSON.stringify({ raw, dtcg }).length };
