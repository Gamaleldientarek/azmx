# Colab — Variable Architecture

Why designers could not previously pick a semantic token, and the one API fact that fixes it. Audited and rebuilt 2026-07-27.

> ⚠️ **Partly superseded 2026-08-08.** The **mechanics** below are still correct and still the reason the picker behaves as it does — `scopes` vs `hiddenFromPublishing`, alias repair, semantic-vs-primitive layering. The **collection layout** is not: `color 🎨` has been deleted and replaced by five collections with four ground modes. For anything you intend to build or bind, read `token-system.md`.

---

## 1. The single most useful correction

**`hiddenFromPublishing` does NOT filter the local variable picker. Only `scopes` does.**

`hiddenFromPublishing` controls one thing: whether a variable is offered to *other files* consuming this one as a library. In the file itself it changes nothing. Every variable marked `hidden` still appears in the picker for everyone working in the file — which is where the deck is actually built.

`scopes` is the lever. It filters by **surface**: a variable scoped `TEXT_FILL` appears in the text-colour picker and nowhere else.

```js
v.scopes = ['TEXT_FILL'];                    // text ink only
v.scopes = ['FRAME_FILL', 'SHAPE_FILL'];     // grounds and panels
v.scopes = ['STROKE_COLOR'];                 // rules and hairlines
v.scopes = ['EFFECT_COLOR'];                 // the park — see §3
v.scopes = ['ALL_SCOPES'];                   // everywhere. Almost always wrong
```

**`scopes` never affects existing bindings.** Re-scoping 169 primitives on a live file with 720 bound text nodes and 32 slides changed nothing on the canvas. It is a safe operation, which is why there is no excuse for not doing it.

---

## 2. The three-layer model

| Layer | Contents | `scopes` | Picker | Bound directly |
|---|---|---|---|---|
| **1 · Primitives** | `Main Colors/*`, `Brand/*`, the 50→950 ramps | `['EFFECT_COLOR']` | Never | **Never** — aliased only |
| **2 · Semantics** | `Text/*`, `Background/*`, `Surface/*`, `Scrim/*` | Surface-specific | **Yes — the only visible layer** | Yes |
| **3 · Component-level** | `Logo-color/*`, `Icon/*` | Surface-specific, or parked | Where a designer must choose | Yes, inside components |

**A designer picks from layer 2 and nothing else.** A primitive in a picker is an invitation to bind `Brand/Primary/Electric Green/400⭐️` directly to a headline, and once that binding exists no theme change, no mode, and no ground swap can reach it.

---

## 3. `EFFECT_COLOR` as the park

Primitives are scoped to **`EFFECT_COLOR`** — the one surface this system bans outright. Radius 0 and **zero effects** is pass-gate check #11 and standing law on dark editorial slides. Because no node in the system has a shadow, blur or glow, the effect-colour picker is a surface that is never opened.

**Parking on `EFFECT_COLOR` is safe here only because effects are banned.** In a file that uses shadows, the park is a leak — pick a different unused surface or accept the primitives in one picker.

---

## 4. Before and after

| Measure | Before | After |
|---|---|---|
| Colour variables | **438** | **203** |
| Picker-visible | **246** | **34** |
| Of those, unused `Tailwind Colors` | **242** — every one `ALL_SCOPES`, zero bindings file-wide | **0** — deleted |
| Semantics visible to a designer | **7 of 34** — 27 marked `hidden` | **34 of 34** |
| Broken semantic aliases | **11 of 34** | **0** |
| Mode-values repaired | — | **19** |
| Primitives reachable from a fill picker | 169 | **0** |

**The layer was inverted.** All 27 semantics were `hiddenFromPublishing`; the primitives were visible. Because `hiddenFromPublishing` does not filter the local picker, the semantics were in fact still *listed* — but the file had been organised on the belief that they were not, so nothing pointed at them and the primitives sat at the top of a 246-row list. **Designers could not find a semantic token, so they bound a primitive.** That is the whole mechanism.

Offers per surface, after:

| Picker surface | Variables offered |
|---|---|
| Text fill | **15** |
| Frame / shape fill | **20** |
| Stroke | **4** |
| Effect colour | 169 — the park |

**Primitive leaks: 0.** 39 offers across 34 tokens; the overlap is deliberate — a token legal as both ink and fill carries both scopes.

---

## 5. Dangling aliases — the 11

Eleven of 34 semantics aliased **short names missing their namespace**: `Base/White` instead of `Main Colors/Base/White`, `Neutral/900` instead of `Main Colors/Neutral/900`, `Vivid Orange/50` instead of `Brand/Secondary/Vivid Orange/50`.

**Failure mode:** the variables panel shows a live binding with a name in it. The alias resolves to nothing, so the node falls back to whatever raw paint it carried. **It looks bound and it is not.** A file-wide "unbound fills" audit reports zero and the colour is still wrong.

Find them:

```js
const vars = await figma.variables.getLocalVariablesAsync('COLOR');
const dangling = [];
for (const v of vars) {
  for (const [modeId, val] of Object.entries(v.valuesByMode)) {
    if (val && val.type === 'VARIABLE_ALIAS') {
      const target = await figma.variables.getVariableByIdAsync(val.id);
      if (!target) dangling.push(`${v.name} · mode ${modeId}`);
    }
  }
}
```

Count what a designer actually sees:

```js
// A variable is offered in a real picker unless every one of its scopes is EFFECT_COLOR.
const parked = v => v.scopes.length > 0 && v.scopes.every(s => s === 'EFFECT_COLOR');
vars.filter(v => !parked(v)).length;      // target: 34
```

`hiddenFromPublishing` does not appear in either check. That is the point.

---

## 6. Alpha as semantics

Transparency is a token, not a per-node opacity setting. A node whose paint carries a bound alpha semantic can be audited; a node with `opacity: 0.24` typed into the panel cannot.

| Group | Steps | Role |
|---|---|---|
| `Surface/Decor/Electric` | **10 · 20 · 30** | **Sub-3:1. Decoration only — never data, never text, never a severity mark** |
| `Surface/Electric` | **40 · 50 · 60 · 70 · 80** | Motif units, counted fields, chips. Above the floor |
| `Surface/White` | **10 · 20 · 30 · 40 · 50 · 60** | Panels, hairlines, muted body |
| `Scrim/Black` | **50 · 60 · 80** | Image scrims |

**The naming carries the law.** `Surface/Decor/*` is named `Decor` because every step in it fails the 3:1 non-text floor. If a mark is bound to a `Decor` token it is decoration by definition, and if it is carrying meaning the binding is the bug.

Measured, Electric on Deep Jade `[M]`: 40% = **3.15:1** · 30% = 2.34 · 20% = 1.71 · 10% = 1.28. On Pine, 40% = **2.85:1 — fails**; 50% = 3.62. **Floor: 40% on Deep Jade, 50% on Pine.** Full table in `layout-archetypes.md` §4.4.

⚠️ **`Scrim/Black` measures 1.02:1 on Deep Jade.** Black on near-black does nothing. The scrims are built for light grounds and **this system has almost none** — Pine, Deep Jade and Electric are the working grounds. Reach for `Scrim/Black` on a dark slide and you will apply a layer, see no change, and apply a second.

White hairlines at 12–30% are the standing rule for rules and dividers. They are sub-3:1 and therefore decoration: **a hairline may separate content, it may never encode it.**

---

## 7. The naming trap

Two semantic names resolve to the palest tint in their ramp, not the brand colour:

| Reach for | You get | You wanted | Which is |
|---|---|---|---|
| `Background/Vivid Orange` | **`#FFEDEB`** — Vivid Orange **50** | `#FF5A32` | `Background/Vivid Orange Solid` |
| `Background/Olive Green` | **`#F4FFE3`** — Olive **50** | — | `Background/Olive Green 2` = `#97B069` (Olive **300**) |

**Anyone reaching for the obvious name gets the wrong colour** — and gets a near-white on a dark ground, which either disappears or blows out. On Deep Jade, `#FFEDEB` is a full-strength light surface; a designer expecting an orange chip gets a white one.

Note the second row twice: **neither** Olive token resolves to the brand Olive Green `#5B6B3E`. That is `Brand/Secondary/Olive Green/600*`, and it is a primitive — parked. If you need brand olive as a background, add the semantic; do not un-park the primitive.

**Rename both, or bind by ID and never by name.** Name-based lookup in a build script is how this trap reaches production.

---

## 8. Standing rules

1. **Bind semantics. Never bind a primitive.** If the semantic you need does not exist, add it — do not reach through.
2. **Every new colour variable gets explicit `scopes` at creation.** `ALL_SCOPES` is the default and it is almost always wrong.
3. **`hiddenFromPublishing` is a library concern.** It is never the answer to "this shouldn't be in the picker".
4. **Alpha is a token.** Per-node opacity typed into the panel is unauditable.
5. **Audit by what the picker offers**, not by what the collection contains. 203 variables and 34 offers is a healthy file; 203 and 246 is not.
