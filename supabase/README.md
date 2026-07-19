# Supabase / Postgres data layer — Sharing Tuesday (Random Selector)

This directory is the entire database layer: schema, server-side RPCs, RLS, and
the fun-name seed. **Nothing here writes from the browser.** Clients read under
RLS with a scoped anon JWT; every mutation runs on the server (service role) or
through a `SECURITY DEFINER` function.

```
supabase/
  migrations/
    0001_schema.sql       tables: rooms, participants, draws, name_pool (+ indexes)
    0002_functions.sql    join_room, pick_unused_display_name, lock_room_for_draw,
                          record_draw, close_room
    0003_rls.sql          RLS, grants, scoped-JWT read policies, participants_public
                          view, Realtime publication, function EXECUTE hardening
    0004_seed_names.sql   the 40 curated fun names (idempotent)
  tests/
    concurrency_join.sql       single-session correctness + lock + purge smoke test
    run_concurrency_test.sh    true parallel stampede test (multiple connections)
  README.md
```

All migrations are idempotent (`IF NOT EXISTS`, `CREATE OR REPLACE`,
`DROP POLICY IF EXISTS`, `ON CONFLICT DO NOTHING`) — safe to re-run.

## Applying

### Supabase CLI (recommended)

```bash
# from the repo root, with the CLI linked to your project
supabase db push
# or apply the raw files in order against any Postgres:
```

### Plain psql (any Postgres, e.g. the Supabase connection string)

```bash
export DATABASE_URL="postgres://postgres:<pw>@<host>:5432/postgres"
for f in supabase/migrations/000*.sql; do
  echo ">> $f"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"
done
```

> On a non-Supabase Postgres the `anon`, `authenticated`, and `service_role`
> roles and the `supabase_realtime` publication won't exist. Create the roles
> (`create role anon; create role authenticated; create role service_role;`)
> before running 0003 for local testing; the Realtime block is guarded and is
> simply skipped if the publication is absent.

## The RLS model, in plain words — Option A (scoped JWT)

- RLS is **on and forced** for `rooms`, `participants`, `draws`, `name_pool`.
- `anon` and `authenticated` have **no INSERT/UPDATE/DELETE anywhere.** They get
  only:
  - `SELECT` on `rooms` — restricted by policy to `id = jwt.room_id`.
  - `SELECT` on **safe columns** of `participants`
    (`id, room_id, display_name, join_number, joined_at`) — restricted by
    policy to `room_id = jwt.room_id`. **`real_name` is not granted at all**, so
    it is unreadable by clients and is stripped from Realtime payloads.
  - `SELECT` on `draws` — restricted by policy to `room_id = jwt.room_id`.
  - `SELECT` on the `participants_public` view (safe columns only).
- `name_pool` has RLS on with **no policy** ⇒ clients see zero rows; it is
  server-only.
- `service_role` (your server key) has `BYPASSRLS` and full grants — it does all
  the writing.
- The mutating functions are `SECURITY DEFINER` with `EXECUTE` granted to
  `service_role` **only**, so even though they can write, no client can invoke
  them. That is what makes "no anon write path" airtight.

### Why the real name can never leak to the projection

Two independent defenses:

1. **Column privilege.** `anon`/`authenticated` are simply not granted `SELECT`
   on `participants.real_name`. Supabase Realtime honors column-level
   privileges, so change events for participants also omit `real_name`.
2. **`participants_public` view** (`security_invoker = true`) exposes only
   `id, room_id, display_name, join_number, joined_at`. Because it's a
   security-invoker view, the caller's RLS policy and column grants both still
   apply — it can only ever surface safe columns.

The projection screen (`/screen/[roomId]`) should read/subscribe to the safe
columns of `participants` (or read `participants_public`). Realtime subscriptions
must target the base table `public.participants`; the column grant guarantees the
payload is already sanitized.

## How the server issues the scoped JWT

After a successful `join_room` (or when opening a room/screen), the Next.js
**server** mints a short-lived JWT signed with the project's JWT secret and
hands it to that client. The JWT must contain:

- `role: "anon"` (so the `to anon` policies apply and PostgREST/Realtime accept it),
- `room_id: "<the room uuid>"` (the custom claim the policies read via
  `auth.jwt() ->> 'room_id'`),
- standard `aud: "authenticated"` is **not** needed here; use `aud` per your
  Supabase config (typically `"authenticated"`), plus `exp`.

Minimal Node sketch (server only — never ship the secret to the browser):

```ts
import jwt from "jsonwebtoken";

export function mintRoomToken(roomId: string) {
  return jwt.sign(
    { role: "anon", room_id: roomId },
    process.env.SUPABASE_JWT_SECRET!,
    { expiresIn: "2h" }
  );
}
```

The client then uses that token as the Supabase access token, e.g.
`createClient(url, anonKey, { global: { headers: { Authorization: \`Bearer ${token}\` } } })`
(or `supabase.realtime.setAuth(token)` for the socket). Realtime subscriptions
inherit the same RLS policies via this token.

## Environment variables the app needs

| Var | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | anon API key (read-only under RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | full-access key for all mutations / RPC calls |
| `SUPABASE_JWT_SECRET` | **server only** | signs the per-room scoped JWT (custom claim `room_id`) |

The facilitator's shared password (spec §2) is a separate server-only env var
owned by the frontend engineer; it is not part of this data layer.

## Server call map (for the frontend engineer)

All via the **service role** client, except reads which use the scoped anon JWT.

| Action | Call |
|---|---|
| Create room | `insert into rooms (code, name) values (...)` (service role) |
| Participant joins | `select * from join_room(:code, :real_name)` |
| Start / redraw (lock set) | `select * from lock_room_for_draw(:room_id)` → shuffle in Node |
| Persist + reveal a draw | `select * from record_draw(:room_id, :order_jsonb, :starter, :seed)` |
| Close room (purge names) | `select close_room(:room_id)` |
| Roster (client) | `select * from participants_public where room_id = :room_id` |
| Latest order (client) | `select * from draws where room_id = :room_id order by created_at desc limit 1` |

`draws.order` is a JSON array of participant ids; the app computes Fisher-Yates
server-side, stores the `seed` for audit, and picks `order[0]` as the starter.

## Concurrency guarantee (gap-free, unique join numbers)

`join_room` does `SELECT ... FROM rooms WHERE code = ? AND status = 'lobby'
FOR UPDATE`. That row lock serializes every concurrent join to the same room:
the next joiner blocks until the current one commits, so `max(join_number)+1` is
always computed against the committed roster. Result: **contiguous `1..N`, no
gaps, no duplicates.** The `UNIQUE(room_id, join_number)` and
`UNIQUE(room_id, display_name)` constraints are the backstop that would reject a
duplicate if the lock were ever bypassed.

The same room-row lock also freezes the draw set: `lock_room_for_draw` grabs the
identical `FOR UPDATE` lock and flips `lobby -> drawing`, so an in-flight join
either commits before the flip (included) or is rejected after it
(`room_not_joinable`). Once status leaves `lobby`, joins are refused; redraws are
allowed while status is `drawing`/`revealed`.

## Validation status

Live validation is **pending**: this machine has no `psql`, Docker, or Supabase
CLI, so the migrations were verified statically (structure, quoting, ordering)
but not executed. To validate for real:

```bash
# Option A: against your Supabase project (or any Postgres)
export DATABASE_URL="postgres://postgres:<pw>@<host>:5432/postgres"
for f in supabase/migrations/000*.sql; do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"; done
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/concurrency_join.sql   # smoke test
supabase/tests/run_concurrency_test.sh 25                                        # true parallel stampede

# Option B: throwaway local Postgres via Docker
docker run --rm -d --name st-pg -e POSTGRES_PASSWORD=pw -p 5433:5432 postgres:16
export DATABASE_URL="postgres://postgres:pw@localhost:5433/postgres"
psql "$DATABASE_URL" -c "create role anon; create role authenticated; create role service_role;"
for f in supabase/migrations/000*.sql; do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"; done
supabase/tests/run_concurrency_test.sh 25
docker rm -f st-pg
```
