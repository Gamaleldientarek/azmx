# Fix brief — security hardening

Repo: `/Users/gamaleldien/dev/sharing-tuesday` (Next.js 16 App Router, React 19, Supabase, `jose`, Tailwind 4, vitest).
Deployed behind a Cloudflare Worker at `games.gamaleldien.com/random-selector` (`basePath: "/random-selector"`).

Baseline: commit `4657826` ("Seat recovery hardening + Random Selector repositioning"). Findings from two independent security reviews; items marked **[verified]** were re-checked directly against source at that commit, items marked **[reported]** come from a reviewer and should be re-confirmed as your first step on that task.

**This is a different axis from `seat-recovery-fix-brief.md`, which is now fully implemented and can be deleted.** Nothing here re-treads it.

---

## Ground rules — do not break these

The reviews specifically cleared the following. Leave them intact; if a change here requires touching one, stop and flag it.

1. **The token model.** Both verifiers pin `algorithms: ["HS256"]`; the seat cookie's name is room-derived *and* its payload `room_id` is re-checked against the requested room; RLS compares the JWT room claim per row with `nullif(...)` deny-by-default. Algorithm confusion, forgery, and cross-room replay are all closed. Do not "simplify" any of it.
2. **The `real_name` column grant.** `supabase/migrations/0003_rls.sql:52` gives `anon` a column-scoped SELECT that excludes `real_name`. This is what keeps real names out of Realtime payloads and away from co-participants. Enforcement lives in Postgres, not in TypeScript — keep it there.
3. **Every consumer re-verifies the participant row exists in that room** before trusting the cookie (`join.ts:67-69`, `join.ts:201-204`, `join/[code]/page.tsx:65-67`). Never trust the cookie standalone.
4. **`redirect()` stays outside `try/catch`**, and `/join/[code]` falls through to the form when seat verification fails. That fallthrough is what prevents the redirect loop that was just fixed — do not "tidy" it into the try block.
5. **No new client exposure of `real_name`.** `src/lib/supabase/server.ts` and `src/lib/env.ts` both carry `import "server-only"`. Keep that.
6. Design-system conventions: `az-*` type classes, `az-` spacing scale, `Button`/`Eyebrow`/`Chevron`, two-blues rule.

---

## Task 1 — Add `requireFacilitator()` to the two facilitator pages **[verified]**

**Files:** `src/app/facilitator/page.tsx`, `src/app/facilitator/[roomId]/page.tsx`

`facilitator/[roomId]/page.tsx:42` selects `real_name` and passes the roster into a client component, embedding real names in the RSC payload. Neither page calls `requireFacilitator()` — I grepped both and it is absent. Their **only** authorization is the route matcher in `src/proxy.ts:43-46`.

Every server action, by contrast, is defended twice: `getRoomRealNames` calls `requireFacilitator()` as its literal first statement (`rooms.ts:100`) *and* sits behind the proxy. So the highest-value data in the app has strictly weaker protection than the actions around it, and it rests on a routing config rather than an authorization call. It is correct today. A matcher edit, a `basePath` change, or a Next 17 migration turns a routing tweak into a bulk PII disclosure with no second line of defense.

**Required.** Add to the top of both page components:
```ts
const gate = await requireFacilitator();
if (!gate.ok) notFound();
```
Use `notFound()` rather than a redirect so an unauthenticated probe cannot distinguish a real room id from a fake one.

**Acceptance.** With the proxy matcher deliberately disabled in a local build, a direct request to `/facilitator/<roomId>` returns 404 and no `real_name` appears anywhere in the response body.

---

## Task 2 — Automatic retention purge for real names **[reported, high confidence]**

**Files:** `supabase/migrations/` (new migration)

The purge itself is real and works: `supabase/migrations/0002_functions.sql:230-233` sets `real_name = null` for the room, with a passing assertion at `supabase/tests/concurrency_join.sql:100`. The problem is that it **only ever runs from a human clicking "Close room & purge names"** (`ControlPanel.tsx:514`). The reviewer grepped the whole `supabase/` tree and found no `pg_cron`, no scheduled job, no TTL, and no purge tied to `closed_at` or to draw completion. **Confirm that yourself before building.**

Scenario with no adversary at all: the workshop ends, the facilitator shuts the laptop, the room stays in `revealed`. Every real name — joined to fun name, join number, and `joined_at` — persists indefinitely. `facilitator/page.tsx:31` caps the room list at 30, so after ~30 sessions those rooms scroll off the only UI that could close them: the data becomes simultaneously invisible and retained.

This matters because the app makes an explicit promise at the moment of collection — "Shown only to the facilitator" (`JoinForm.tsx:79`) and "Real names are purged when the room closes" (`RoomClient.tsx:414`). That promise currently depends on a click nothing enforces.

**Required.** Automatic purge, whichever fits your Supabase plan:
- Preferred: `pg_cron` job running `close_room`-equivalent purge for any room with `created_at < now() - interval '24 hours'` and `real_name is not null`.
- Alternative: purge inside `record_draw` — the roster is frozen once the draw lands, and the facilitator panel already caches names client-side for the live session.

Whichever you choose, the retention window must be stated in the participant-facing copy so the promise and the behavior match.

**Acceptance.** A room left in `revealed` past the window has every `real_name` null without any human action, verified by a SQL test alongside the existing ones in `supabase/tests/`.

---

## Task 3 — Security headers **[verified]**

**File:** `next.config.ts` (currently contains only `basePath` and `experimental.serverActions.allowedOrigins` — no `headers()` block, `poweredByHeader` not disabled)

No CSP, no HSTS, no `X-Frame-Options`/`frame-ancestors`, no `Referrer-Policy`. The Cloudflare Worker (`cloudflare-worker/src/index.js:34-61`) forwards origin responses without adding any either.

`/facilitator/[roomId]` renders one-click destructive controls — "Run selector", "Close room" (purges every real name), and `deleteRoom` (`rooms.ts:134`, hard delete with FK cascade). `SameSite=Lax` does **not** prevent framing, and the room UUID an attacker needs is visible on any projection URL. A transparent iframe over a decoy gets a logged-in facilitator to click through a deletion or a mid-session purge.

**Required.** Add to `next.config.ts`:
```ts
poweredByHeader: false,
async headers() {
  return [{ source: "/:path*", headers: [
    { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; base-uri 'none'; form-action 'self'" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  ]}];
}
```
Tailwind 4 and Next emit inline styles, hence `style-src 'unsafe-inline'`. **Ship CSP in `Content-Security-Policy-Report-Only` first**, confirm the projection screen, QR rendering, and Realtime all still work, then enforce. Do not skip that step — a wrong `connect-src` silently kills Realtime, which fails as "the room just stops updating."

---

## Task 4 — Rate-limit and cap `joinRoom` **[verified]**

**Files:** `src/app/actions/join.ts`, `supabase/migrations/` (cap), `src/lib/code.ts`

Verified: the name pool holds exactly **40** rows (`supabase/migrations/0004_seed_names.sql`), the code space is `randomInt(1000, 10000)` = **9,000** values (`code.ts:10`), and `joinRoom` is the one un-gated mutating action — no rate limit, no captcha, no per-room cap. `/join/[code]` is public and `force-dynamic`, so it confirms room existence, name, and status per code.

Attack, found independently by both reviewers: enumerate 9,000 codes in seconds to find live rooms, then send 40 cookie-less joins at a target. `pick_unused_display_name` raises `name_pool_exhausted` (`0002_functions.sql:42-45`) and every real participant gets "This room is full — no fun names are left." Cost: 40 HTTP requests. There is no facilitator remedy in the UI short of deleting the room.

**Required.**
- Rate-limit `joinRoom` per IP. The Cloudflare Worker is already in the request path (`cloudflare-worker/src/index.js`), so a rate-limit binding on `/random-selector/join/*` is the lowest-friction option.
- Enforce a per-room participant cap inside `join_room` *before* calling `pick_unused_display_name`, returning a distinguishable error so a legitimately full room and an exhausted pool are not the same message.
- Widen the room code to 6+ characters from `randomInt`. This also fixes a slow-burn availability issue: `rooms.code` carries a **global** unique constraint across all rooms ever created, not just open ones, and `generateUniqueRoomCode` gives up after `MAX_CODE_ATTEMPTS = 20` — every room permanently consumes one of the 9,000 codes.

---

## Task 5 — Rate-limit facilitator login and make sessions revocable **[reported]**

**Files:** `src/app/actions/auth.ts`, `src/lib/facilitatorToken.ts`, `src/lib/facilitatorSession.ts`

`loginFacilitator` (`auth.ts:21`) accepts unlimited unauthenticated password attempts — no lockout, no delay, no counter. The comparison itself is correctly constant-time (`facilitatorSession.ts:19-24`), which closes the timing channel but does nothing about volume.

The session token carries `{ role: "facilitator" }` and nothing else (`facilitatorToken.ts:31`) — no `jti`, no session version, no server-side store. So:
- `destroyFacilitatorSession` (`facilitatorSession.ts:43-46`) deletes only the *cookie*; a token already copied out of the browser stays valid for the full 12h after "Log out."
- Rotating `FACILITATOR_PASSWORD` does **not** invalidate live sessions — the token is signed with `SESSION_SECRET`, which is unrelated to the password.
- The credential is global and shared; there is no room ownership model. `facilitator/page.tsx:28-31` lists **every room in the system**, and `closeRoom`/`deleteRoom`/`runDraw` accept any `roomId`.

Realistic for this product: the facilitator logs in while projecting, or on the laptop driving the room display. A participant reads the shared password off the screen. They now hold every real name in every open room, plus `deleteRoom` on all of them, for 12h, unrevocably.

**Required.** Rate-limit login per IP with backoff; add a `sessionVersion` claim checked against a server-side value so logout and password rotation both revoke; consider per-facilitator credentials and room ownership if this is ever used by more than one person.

---

## Task 6 — Drop `real_name` from the `joinRoom` recovery branch **[verified]**

**File:** `src/app/actions/join.ts:66` (select) and `:77` (return)

Still live at `4657826`. The recovery branch selects `real_name` and returns `real_name: existing.real_name ?? trimmedName` — the name belongs to whoever holds the **cookie**, not whoever just submitted the form; the caller's own `trimmedName` is discarded. This is exactly the invariant `recoverSeat` was just fixed to honor (see the comment at `join.ts:175-178`), violated ~150 lines above it.

Reachability is narrow — `/join/[code]` normally redirects a cookie-holding browser before the form renders — but two paths reach it: a DB error on that verification (the code deliberately falls through to the form), and direct invocation of the public action. It is never *rendered*: `saveParticipantSession` destructures `real_name` away and `RoomClient` never displays it. So this is a payload-level leak visible in devtools, not on screen.

**Required.** Remove `real_name` from that select and from the returned participant. Make `RecoverSeatResult`/`JoinResult` participant types omit it so the compiler enforces this rather than convention.

---

## Task 7 — Decouple live tests from production **[verified]**

**Files:** `tests/run-live.mjs`, `package.json`

`tests/run-live.mjs:26-34` parses `.env.local` directly. I confirmed `.env.local`'s Supabase URL project ref is **identical** to `supabase/.temp/linked-project.json` — these tests run against production. `tests/live/rejoin.test.ts` creates rooms and calls `deleteRoom`; `tests/live/stampede.test.ts` drives 25 concurrent joins. A stray `npm run test:live`, or that command reaching CI, mutates and deletes production data and burns production room codes.

**Required.** Require explicit `TEST_SUPABASE_URL` / `TEST_SUPABASE_SERVICE_ROLE_KEY`, hard-fail if the ref matches the production project, and remove the `.env.local` fallback entirely.

---

## Task 8 — Cookie path scoping **[reported]**

**Files:** `src/lib/facilitatorSession.ts:37`, `src/lib/participantCookie.ts:41`

Both set `path: "/"` while the app lives entirely under `basePath: "/random-selector"`. The Worker's own comment states the intent (`cloudflare-worker/src/index.js:12`): *"future games can mount other paths."* The moment a second game mounts on that host, every request to it carries the facilitator session JWT and every per-room seat JWT.

**Required.** Set `path: "/random-selector"` on both, and on the matching delete/clear calls. Do not also attempt a `__Host-` prefix — it requires `path=/` and is mutually exclusive with this.

---

## Task 9 — Set `NEXT_PUBLIC_APP_URL` explicitly **[reported]**

**File:** `src/lib/baseUrl.ts:20-24`

Falls back to `x-forwarded-host`/`host` when `NEXT_PUBLIC_APP_URL` is unset — and it is unset. Those values feed the join URL and the **QR code rendered on the projection screen** (`screen/page.tsx:59-60`), and the Vercel origin is directly reachable, bypassing the Worker that would otherwise pin the header. A request with a forged host yields a projected QR pointing at an attacker's clone, which harvests exactly what the join form asks for: real names.

**Required.** Set `NEXT_PUBLIC_APP_URL` in the Vercel project, and add an allow-list check in `resolveBaseUrl` before trusting a forwarded host. Treat the header fallback as dev-only.

---

## Task 10 — Strip control characters from `realName` **[reported]**

**File:** `src/app/actions/join.ts:40`

Only *length* is validated (1–60 after trim), not content. Control characters, newlines, and RTL-override sequences (`U+202E`) pass into `real_name` and render in the facilitator roster (`ControlPanel.tsx:359`). React escapes it so there is no XSS, but 60 characters of RTL override will visually mangle the roster at the exact moment the facilitator is trying to identify who speaks next.

**Required.** Strip `\p{C}` and normalize whitespace before insert.

---

## Deliberate decisions — not quick patches, decide before building

### D1 — RLS is well-built but governs nothing the server reads

All 13 `createServiceClient` call sites run with `BYPASSRLS`. The policy set in `0003_rls.sql` is genuinely good — `FORCE ROW LEVEL SECURITY` on all four tables, `REVOKE ALL` from anon, column-scoped SELECT excluding `real_name`, deny-by-default room claims — but it constrains only the browser client. For every read the app performs itself, one TypeScript check is the sole boundary between a request and the whole database, with no second net. `/screen/[roomId]` and `/room/[roomId]` have no auth check at all.

Directional fix, not a rewrite: for the read-only server components that don't need writes — `room/[roomId]`, `join/[code]`, `screen/[roomId]` — construct an anon client carrying a server-minted room-scoped JWT instead of the service client. RLS then becomes a real second net for exactly the unauthenticated paths. Keep the service role for mutations and the facilitator's `real_name` read.

### D2 — The room UUID is not a capability, but the code says it is

`/join/[code]` is unauthenticated, confirms room existence/name/status, and embeds `room.id` in the rendered page. With a 9,000-value code space, the UUID is one guess plus one request away. An anonymous caller can then load `/screen/[roomId]`, which **mints them a 4h room JWT** granting direct PostgREST and Realtime reads.

What that yields is the sanitized roster — display names, join numbers, draw order — **not real names**; the column grant holds. So this is metadata exposure, not PII. But it contradicts assumptions the code documents in two places (`screen/[roomId]/page.tsx:16-18` "the unguessable roomId uuid is the capability", `facilitator/page.tsx:84` "Unguessable room URL"). Either add a real gate to `/screen`, or correct those comments so nobody builds on a false premise.

### D3 — One secret signs two token types

`SESSION_SECRET` signs both the facilitator session and the participant seat cookie, with no `iss`/`aud`; the verifiers distinguish them by ad-hoc claim inspection. No confusion is reachable today, but it is one added claim away.

The live problem is rotation: `readParticipantCookie` collapses a signature failure into `null`, so rotating `SESSION_SECRET` mid-session makes every seat cookie fail, `joinRoom` skips the duplicate-join guard, and every participant who reloads is inserted as a **new** participant with a **new** fun name — silently doubling the roster and the draw set, with no operational signal.

Fix: separate `FACILITATOR_SESSION_SECRET` and `PARTICIPANT_COOKIE_SECRET`, set and verify `iss`/`aud` on both, and support a verify-only `_PREVIOUS` fallback so rotation is non-breaking.

### D4 — The seat TTL is now rolling

Since `recoverSeat` re-issues the cookie on success (`join.ts:231` — correct, it fixes mid-session lockout), every visit to `/room/[roomId]` slides that seat another 12h forward. On a shared tablet the expiry never elapses, so the "Not you?" exit (`RoomClient.tsx:453`) is the *only* thing that ever ends a seat. That makes it load-bearing rather than a nicety — give it real prominence, and consider an absolute cap (e.g. never extend beyond 24h from first join) alongside the rolling window.

---

## Out of scope

Do not refactor the realtime hook, the draw algorithm, or the design system. Do not touch the seat-recovery flow — it was just hardened and the reviews cleared it.

## Verification

```bash
cd /Users/gamaleldien/dev/sharing-tuesday
npx tsc --noEmit
npm run build
npx vitest run                    # unit only; do NOT run test:live until Task 7 lands
npm audit --omit=dev              # baseline is 0 vulnerabilities — keep it there
```

Then confirm manually and report what you actually observed, not what you expect:

1. Proxy matcher disabled locally → `/facilitator/<roomId>` returns 404, no `real_name` in the response body.
2. CSP in report-only → projection screen, QR, and Realtime all still function; no violations logged.
3. 41 scripted joins against a test room → the 41st gets a distinguishable "room is full" error, not pool exhaustion, and rate limiting kicks in before that.
4. A room left past the retention window → all `real_name` values null with no human action.
5. `npm run test:live` with production credentials present → hard-fails instead of running.

If any check fails, say so with the output. Do not mark a task complete because the diff looks right — several of these only manifest under induced failure.
