# Fix brief — seat recovery, shared devices, and the landing commit

Repo: `/Users/gamaleldien/dev/sharing-tuesday` (Next.js 16 App Router, React 19, Tailwind 4, Supabase).
Note the session cwd may be `/Users/gamaleldien/dev`, which is **not** a git repo — use `git -C /Users/gamaleldien/dev/sharing-tuesday …`.

All findings below were verified against source by a three-way review (workflow + two agents). File:line references are accurate as of commit `32aece4`.

---

## Ground rules — do not break these

1. **`redirect()` must stay outside `try/catch`.** It throws a control-flow signal; a surrounding catch swallows it. `join/[code]/page.tsx` already gets this right.
2. **Do not weaken the cookie auth.** `readParticipantCookie` is sound: httpOnly, HS256 via `jose`, algorithm pinned, `payload.room_id` re-checked against the argument, participant query double-filtered on `id` + `room_id`. Leave that model intact.
3. **Preserve the feature's actual purpose.** A returning participant who still holds a valid seat must skip the name form *even after the draw locks the room*. That is what `32aece4` was for. Do not regress it.
4. **On uncertainty, prefer showing the join form over redirecting.** Redirecting when we cannot confirm state is the root cause of the loop in Task 2.
5. Keep the existing AZMX design-system conventions: `az-*` type classes, `az-` spacing scale, `Button`/`Eyebrow`/`Chevron` components, two-blues rule. Do not introduce new colors or hand-rolled buttons.

---

## Task 1 — Stop leaking one person's real name to the next person on a shared phone

**Files:** `src/app/actions/join.ts:195-207`, `src/app/room/[roomId]/RoomClient.tsx:172-173`, `src/lib/participantSession.ts:8`

**Problem.** The seat cookie is `httpOnly`, `path:"/"`, 12h TTL — it belongs to the browser profile, not the person. Person A joins and hands the phone to Person B. B scans the QR, the cookie redirect fires, `recoverSeat` authorizes on the cookie alone and returns A's row **including `real_name`**, which `RoomClient` renders on screen. B sees A's real name, occupies A's draw slot, and has no route back to the form for 12 hours.

`participantSession.ts:8` still documents "Never the real name — that stays server-side," which `recoverSeat` + `saveParticipantSession` now contradict.

**Required behavior.**
- `recoverSeat` must **not** return `real_name`. Drop it from the return payload and from the `select`. The recovering user did not type it this session, so displaying it is the leak. `joinRoom` may keep returning it — that user just typed it themselves.
- Update `RecoverSeatResult`'s participant type accordingly so this is enforced by the compiler, not convention.
- `saveParticipantSession` must never persist `real_name`. Restore the documented invariant.
- Add a visible exit on the room screen: a quiet "Not you? Join as someone else" action that calls a new `releaseSeat(roomId)` server action, clears the seat cookie, and sends the user to `/join/[code]`.

**Acceptance.** With a valid seat cookie set for participant A, loading `/room/[id]` shows A's `display_name` and no real name anywhere in the DOM or in sessionStorage. The exit action clears the cookie and lands on a usable name form.

---

## Task 2 — Break the redirect loop (highest-frequency bug here)

**Files:** `src/app/join/[code]/page.tsx:50-53`, `src/app/actions/join.ts:209`, `src/app/room/[roomId]/RoomClient.tsx:113`

**Problem.** Three defects compound into an inescapable loop:

- `join.ts:209`'s catch collapses *every* failure into `no_seat` — thrown `createServiceClient()`, query timeout, Supabase blip — indistinguishable from a genuine missing cookie. The `!room || closed || !participant` branch at :191 does the same.
- `join/[code]/page.tsx:50-53` redirects on **cookie presence alone**, without confirming the participant row exists.
- `RoomClient.tsx:113` computes `session?.roomCode ? … : "/join"`, but in that branch `session` is always `null`, so the rejoin link can never carry the code.

Sequence: brief network hiccup → `recoverSeat` returns `no_seat` → rejoin wall → link goes to bare `/join` → user retypes code → `/join/[code]` sees the still-valid cookie → redirects to the room → wall again. `recoveryTriedRef` blocks retry. This is triggered by ordinary conference wifi, not an exotic state.

**Required behavior.**
- Give `RecoverSeatResult` a third error case — `"unavailable"` — distinct from `"no_seat"`. Infrastructure failures (catch block, missing room row) return `"unavailable"`. Only a genuinely absent cookie or a confirmed-missing participant row returns `"no_seat"`.
- On `"unavailable"`, the room screen must offer a **retry** (re-run `recoverSeat`) rather than the terminal rejoin wall. `recoveryTriedRef` must not block a user-initiated retry.
- `join/[code]/page.tsx` must verify the participant row exists before redirecting. If the verification query fails or returns nothing, **fall through to the join form** — never redirect on an unconfirmed cookie. Keep `redirect()` outside the try.
- Fix the rejoin href so it carries the room code. The code is available from the route/page context; do not rely on `session?.roomCode` in a branch where `session` is null.

**Acceptance.** Simulate a failing Supabase call inside `recoverSeat` (throw at the top of the try). The user must see a retryable error, not "your seat is gone," and must never bounce between `/join/[code]` and `/room/[id]`. With the DB healthy and a purged participant row, `/join/[code]` must render the name form.

---

## Task 3 — A rejected server action must not freeze the screen

**File:** `src/app/room/[roomId]/RoomClient.tsx:39-59, 107-109`

**Problem.** `recoverSeat(roomId).then((res) => {…})` has no `.catch`. The action handles its own logic errors, so this only fires on transport failure — offline, 500, stale deployment id after a redeploy. Neither `setRecovering` call runs, `recoveryPending` stays true, and line 107 returns `<main className="surface-navy min-h-svh" aria-busy="true" />` forever: an entirely empty element, no text, no spinner, nothing announced to a screen reader.

**Required behavior.**
- Add `.catch(() => setRecovering("failed"))` — or route it to the new `"unavailable"` retry state from Task 2, which is better.
- Give the loading shell visible content: a short line inside `role="status"` ("Getting your seat…") plus the room code so the user knows they are in the right place. `aria-busy` on an empty element announces nothing.
- While you are in this code: the `"pending" | "done" | "failed"` union is only ever read as `recovering === "pending"` at line 59 — nothing distinguishes the terminal states — and `recoveryTriedRef` duplicates roughly the same fact. Collapse to what the component actually needs once the retry state exists.

**Acceptance.** With the network killed mid-recovery, the user sees a message and a retry affordance, never a blank navy screen.

---

## Task 4 — Refresh the seat cookie on successful recovery

**File:** `src/app/actions/join.ts:195`

**Problem.** `setParticipantCookie` has exactly one call site — `join.ts:128`, the new-join path. `recoverSeat` mints a fresh 4h room token but leaves the 12h cookie's expiry untouched, so it never slides. Join at 09:00, actively recovering at 20:30 → token valid to 00:30, cookie dies at 21:00. New tab at 21:05 → `no_seat`; if the room advanced past lobby, `/join/[code]` says "The draw has started" and the participant is locked out of a session they belong to. Exactly the failure the feature exists to prevent.

**Required behavior.** Call `setParticipantCookie(roomId, participant.id)` on the success path of `recoverSeat`, so an active participant's cookie slides forward.

**Acceptance.** Recovering a seat visibly extends the cookie's `Max-Age`.

---

## Task 5 — The reveal can hang forever

**File:** `src/app/room/[roomId]/RoomClient.tsx:94-104, 144-151`

**Problem.** `revealed` requires `order.length === latestDraw.order.length`, but `order` silently filters out any draw id missing from `roster` (line 103). One unresolved id — partial refetch, removed row, missed realtime join — and `revealed` is permanently false, which makes `drawing` permanently true at line 151. The participant watches "Drawing the order" indefinitely while the projected screen shows the result.

**Required behavior.** After a short grace period (~6s) with an unresolved mismatch, render the order anyway using a neutral placeholder for unknown ids, and/or surface a "Reload" affordance. The phone must never be the only screen that never resolves.

---

## Task 6 — Landing page: commit integrity and hero resolution

**File:** `src/app/page.tsx:3`

- `public/sharing-tuesday-cover-clean.jpg` is **untracked and not gitignored**. Committing `page.tsx` alone fails the build with `Module not found`. `git add` it in the same commit.
- The new asset is **1920×1080**; the one it replaces was **3840×2160**. On a full-bleed `fill` + `sizes="100vw"` + `priority` LCP image, sharp will not upscale — an iPhone 14 in portrait needs ~4500 device px across for `object-cover` on 16:9 art. **Do not silently accept this.** Flag it and ask for the 4K clean art before shipping.
- `public/sharing-tuesday-cover.jpg` (263K) is now referenced nowhere. Delete it.

---

## Task 7 — Accessibility (non-blocking, do after 1–6)

- **Duplicated link name**, three sites: `page.tsx:69-75`, `join/page.tsx:34-42`, `join/[code]/page.tsx:77-85`. `AzmxLogo` renders `alt="AZMX"` next to an `sr-only` "AZMX — home", so links announce "AZMX AZMX — home". Add an `alt` prop to `AzmxLogo` so it can be decorative inside a labelled link.
- **Three different focus treatments on the landing alone**: header link (`outline-offset-4`), hand-rolled CTA (`outline-offset-2`), `Button` (`ring-2 ring-offset-navy`). Unify. Note `Button`'s `surface="dark"` resolves `ring-offset-navy`, which paints a navy halo against the *red photograph* — the "dark" surface assumption is false on this page.
- **Input affordance below WCAG 1.4.11**: `join/page.tsx:76-78` uses `border-hairline` ≈ 1.2:1 on white (needs 3:1), with `placeholder:text-ink-meta/40` ≈ 1.6:1 hiding the only format hint. The *less* important name field at `JoinForm.tsx:74-76` is stronger. Match it and move the format into persistent helper text.
- **Errors carry no error semantics**: `JoinForm.tsx:84` renders in `text-accent` — the same blue as chevrons and focus rings. Contrast is fine; meaning is absent.
- `aria-invalid` at `JoinForm.tsx:72` fires for `room_full` / `server_error`, announcing a valid name as invalid. Gate on `state.error === "invalid_name"`.
- The reveal's live region (`RoomClient.tsx:226-230`) is mounted together with its content, so it likely never announces. Hoist an always-mounted region and write into it. The one at :198-202 is done correctly — copy that.
- No focus moves on any transition (join → blocked state, lobby → drawing → revealed).
- **Latent SSR crash**: `RoomClient.tsx:73-81` calls `window.matchMedia` in the render phase, safe today only because the branch is skipped on first server render. Move it into the effect.

---

## Out of scope

Do not refactor the realtime hook, the facilitator screens, or the draw algorithm. Do not restyle the landing beyond Task 6/7.

## Optional cleanup, only if Tasks 1–4 land cleanly

`recoverSeat` (`join.ts:174-207`) duplicates `joinRoom`'s cookie → participant → `mintRoomToken` block (`join.ts:60-86`). The copies have already drifted: `joinRoom:77` uses `real_name: existing.real_name ?? trimmedName`, `recoverSeat:202` uses `?? ""`; `joinRoom:83` falls through on a purged row, `recoverSeat` returns `no_seat`. Extract a shared `loadSeatedParticipant(roomId)`. Do this **after** Task 1 changes what recovery returns, not before.

---

## Verification

Run all of these before reporting done:

```bash
cd /Users/gamaleldien/dev/sharing-tuesday
npx tsc --noEmit
npm run build          # catches the missing-asset failure in Task 6
npx vitest run
```

Then manually confirm, and report what you actually observed rather than what you expect:

1. Shared-device: seat cookie for A present → `/room/[id]` shows no real name; the exit clears the cookie and reaches a usable form.
2. Loop: force `recoverSeat` to throw → retryable error, no bounce between `/join/[code]` and `/room/[id]`.
3. Offline: kill the network mid-recovery → message and retry, never a blank navy screen.
4. Purged row: delete a participant with the cookie still set → `/join/[code]` renders the name form.

If any check fails, say so with the output. Do not mark a task complete on the basis of the diff looking right.
