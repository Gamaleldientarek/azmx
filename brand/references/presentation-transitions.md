# Presentation Transitions

How an AZMX deck built as Figma **frames** is turned into a keyboard-driven presentation: Space advances, Backspace goes back, slides cross-fade with Smart Animate. Validated on the Figma Service Partner deck, 19 slides, 2026-08-26.

This is for decks built as ordinary frames on a design page. Figma Slides has its own built-in transitions and needs none of this.

---

## The spec

| Setting | Value | Why |
|---|---|---|
| Trigger, forward | **Key/Gamepad · Space** | The key a presenter's thumb finds without looking. Also what every clicker sends. |
| Action | **Navigate to** the next frame | — |
| Animation | **Smart animate** | Elements that share a layer name across two slides tween instead of cutting. This is the whole reason to do it in Figma rather than export a PDF. |
| Easing | **Slow** | A spring preset. Reads as considered rather than snappy, which suits an editorial deck. |
| Duration | **600 ms** | Long enough to read as motion, short enough that a presenter mid-sentence is not waiting for it. Below ~400 ms it reads as a cut; above ~800 ms the room notices the deck instead of the argument. |
| Trigger, backward | **Key/Gamepad · Backspace** → **Back** | `Back` returns through actual navigation history, so it works even when the path was not linear. |
| Flow starting point | **slide 01**, named `Start` | Makes the play button open the deck at the beginning rather than at whatever frame was last selected. |
| Last slide | **Backspace only** | There is nothing to advance to. Giving it a Space action that goes nowhere is a dead key press in front of an audience. |

**Smart Animate matches layers by name.** Two slides that both contain a layer called `Headline` will tween that headline's position, size and colour between them. Two slides whose headlines are called `Headline` and `Title` will hard-cut. If a run of slides should feel continuous — an act cover flowing into its first content slide, a stat that grows — give the shared elements the **same layer name** on both frames. This costs nothing and is the difference between a deck that moves and a deck that flickers.

---

## Applying it

Run `scripts/figma-slide-transitions.js` through the Figma Console MCP (`figma_execute`) with the Desktop Bridge plugin open on the target file. Edit the two constants at the top: the page name, and the ordered list of frame IDs.

Get the frame IDs in canvas order first — do not trust layer-panel order or frame names, both of which drift:

```js
await figma.loadAllPagesAsync();
const page = figma.root.children.find(p => p.name === 'YOUR PAGE');
const slides = [];
(function scan(n){ for (const c of n.children) {
  if (c.type === 'FRAME' && Math.round(c.width) === 1920 && Math.round(c.height) === 1080) slides.push(c);
  else if ('children' in c && c.type !== 'INSTANCE') scan(c);
} })(page);
slides.sort((a,b) => Math.round(a.absoluteTransform[1][2]) - Math.round(b.absoluteTransform[1][2])
                  || Math.round(a.absoluteTransform[0][2]) - Math.round(b.absoluteTransform[0][2]));
return slides.map(s => ({ id: s.id, name: s.name }));
```

That sorts top-to-bottom then left-to-right, which matches how decks are laid out in rows. **Read the returned names back and confirm the order is the running order** before applying anything.

---

## The API shape

```js
await frame.setReactionsAsync([
  {
    trigger: { type: 'ON_KEY_DOWN', device: 'KEYBOARD', keyCodes: [32] },   // Space
    actions: [{
      type: 'NODE',
      destinationId: nextFrameId,
      navigation: 'NAVIGATE',
      transition: { type: 'SMART_ANIMATE', easing: { type: 'SLOW' }, duration: 0.6 },
      preserveScrollPosition: false
    }]
  },
  {
    trigger: { type: 'ON_KEY_DOWN', device: 'KEYBOARD', keyCodes: [8] },    // Backspace
    actions: [{ type: 'BACK' }]
  }
]);

page.flowStartingPoints = [{ nodeId: firstFrame.id, name: 'Start' }];
```

### Four things that will catch you

1. **`duration` is in seconds, not milliseconds.** 600 ms is `0.6`. Passing `600` asks for a ten-minute transition and Figma will accept it.
2. **Use `setReactionsAsync()`.** Assigning to `.reactions` is deprecated and silently does nothing in current builds.
3. **`SLOW` is a spring preset**, alongside `GENTLE`, `QUICK` and `BOUNCY`. It coexists with an explicit `duration` in the current build, but that is not guaranteed across versions — if it ever throws, fall back to `{ type: 'EASE_OUT' }`, which is the closest fixed-curve equivalent, and keep the 0.6.
4. **`setReactionsAsync` replaces every reaction on the frame.** Pass both the Space and the Backspace reaction in the same array. Calling it twice leaves only the second.

### Key codes

| Key | Code |
|---|---|
| Space | 32 |
| Backspace | 8 |
| Right arrow | 39 |
| Left arrow | 37 |

Arrows are worth adding alongside Space and Backspace when someone else may drive the deck — most presenters reach for them by instinct. Add them as extra triggers in the same array, not as a replacement.

---

## Checking it worked

```js
const f = await figma.getNodeByIdAsync('FRAME_ID');
return f.reactions.map(r => ({
  key: r.trigger.keyCodes,
  action: r.actions[0].type,
  to: r.actions[0].destinationId || null,
  transition: r.actions[0].transition || null
}));
```

Then press play. Space should advance with visible motion, not a cut. If it cuts, the two frames share no matching layer names and Smart Animate has nothing to tween — that is a naming problem, not a transition problem.

---

## What not to do

- **Do not use Dissolve.** It reads as a slideshow template. Smart Animate on a system-built deck moves the actual elements, which is the point.
- **Do not put a transition on the last slide's Space.** Nothing to navigate to.
- **Do not set transitions before the deck order is final.** Reordering slides afterwards means rewiring every frame, because `destinationId` is a hard reference.
- **Do not mix durations across a deck.** One value everywhere. A transition that changes speed mid-deck reads as a mistake.
