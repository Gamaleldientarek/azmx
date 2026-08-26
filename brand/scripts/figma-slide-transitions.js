// AZMX — presentation transitions for a deck built as Figma frames.
//
// Run through the Figma Console MCP (figma_execute) with the Desktop Bridge
// plugin open on the target file. This is NOT a node script.
//
// Wires: Space -> next slide (Smart animate, Slow, 600ms) · Backspace -> Back
//        first slide becomes the flow starting point
//
// Full spec and gotchas: references/presentation-transitions.md

// ── edit these two ───────────────────────────────────────────────────────────
const PAGE_NAME = 'Design V 1.1';

// Ordered frame IDs, running order. Get them with the discovery snippet in the
// reference doc, then READ THE NAMES BACK before running this. Leave empty to
// auto-discover by canvas position (top-to-bottom, then left-to-right).
const ORDER = [];
// ─────────────────────────────────────────────────────────────────────────────

const TRANSITION = { type: 'SMART_ANIMATE', easing: { type: 'SLOW' }, duration: 0.6 }; // seconds
const SPACE = 32, BACKSPACE = 8;

await figma.loadAllPagesAsync();
const page = figma.root.children.find(p => p.name === PAGE_NAME);
if (!page) return { error: 'page not found', pages: figma.root.children.map(p => p.name) };
await figma.setCurrentPageAsync(page);

// resolve the running order
let frames;
if (ORDER.length) {
  frames = [];
  for (const id of ORDER) {
    const n = await figma.getNodeByIdAsync(id);
    if (!n) return { error: 'frame id not found', id };
    frames.push(n);
  }
} else {
  frames = [];
  (function scan(node) {
    for (const c of node.children) {
      if (c.type === 'FRAME' && Math.round(c.width) === 1920 && Math.round(c.height) === 1080) frames.push(c);
      else if ('children' in c && c.type !== 'INSTANCE') scan(c);
    }
  })(page);
  frames.sort((a, b) =>
    Math.round(a.absoluteTransform[1][2]) - Math.round(b.absoluteTransform[1][2]) ||
    Math.round(a.absoluteTransform[0][2]) - Math.round(b.absoluteTransform[0][2]));
}
if (frames.length < 2) return { error: 'need at least two slides', found: frames.length };

const back = { trigger: { type: 'ON_KEY_DOWN', device: 'KEYBOARD', keyCodes: [BACKSPACE] },
               actions: [{ type: 'BACK' }] };

const report = [];
for (let i = 0; i < frames.length; i++) {
  const f = frames[i];
  const reactions = [];
  // the last slide gets Back only — a Space that goes nowhere is a dead key press
  if (i < frames.length - 1) {
    reactions.push({
      trigger: { type: 'ON_KEY_DOWN', device: 'KEYBOARD', keyCodes: [SPACE] },
      actions: [{ type: 'NODE', destinationId: frames[i + 1].id, navigation: 'NAVIGATE',
                  transition: TRANSITION, preserveScrollPosition: false }]
    });
  }
  reactions.push(back);
  try {
    // setReactionsAsync REPLACES all reactions — both must go in one array
    await f.setReactionsAsync(reactions);
    report.push({ n: i + 1, slide: f.name, space: i < frames.length - 1 ? '-> ' + (i + 2) : 'none (last)' });
  } catch (e) {
    report.push({ n: i + 1, slide: f.name, error: String(e).slice(0, 160) });
  }
}

page.flowStartingPoints = [{ nodeId: frames[0].id, name: 'Start' }];

return { page: page.name, slides: frames.length, flowStart: frames[0].name,
         failed: report.filter(r => r.error).length, report };
