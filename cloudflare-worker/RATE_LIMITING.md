# Rate limiting `joinRoom` — Cloudflare Worker

**Status: NOT APPLIED. This is a written-up change for you to apply, not
something I configured.** It touches your Cloudflare account and Worker
bindings, which I cannot see, so guessing at the config would be worse than
handing you the exact steps.

## Why

`joinRoom` is the one un-gated mutating action in the app: public, no auth, no
captcha, no rate limit. Combined with a public `/join/[code]` that confirms a
room's existence, name and status per code, that gives an attacker a cheap
two-step:

1. Enumerate room codes to find live rooms.
2. Fire enough cookie-less joins at one to fill it.

Migration `0007_room_capacity.sql` caps a room and makes the resulting error
*explainable*, and `src/lib/code.ts` widened codes from 9,000 to 900,000
values, so step 1 is 100x more expensive. Neither actually stops a flood.
Rate limiting at the edge is the part that does, and the Worker is already in
the request path, so it is the lowest-friction place to put it.

## What to add

### 1. Declare the rate-limit binding

In `cloudflare-worker/wrangler.jsonc`:

```jsonc
{
  // ... existing config ...
  "ratelimits": [
    {
      "name": "JOIN_LIMITER",
      "namespace_id": "1001",        // any unique id within this Worker
      "simple": { "limit": 12, "period": 60 }
    }
  ]
}
```

`limit: 12` per `period: 60` seconds, per key. Sized for the real workload: a
genuine participant hits the join path a handful of times (load the form,
submit, maybe retry once). A dozen a minute from one IP is already far outside
normal use, while 40 rapid joins — the amount needed to fill a room — is well
outside it.

`period` currently accepts only 10 or 60.

### 2. Apply it in the Worker

In `cloudflare-worker/src/index.js`, inside `fetch`, **after** the bare-domain
redirect and **before** the upstream `fetch`:

```js
// Rate-limit the one un-gated mutating path. Both the join FORM and the
// server action that submits it live under /random-selector/join/*.
if (url.pathname.startsWith("/random-selector/join")) {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const { success } = await env.JOIN_LIMITER.limit({ key: ip });
  if (!success) {
    return new Response(
      "Too many join attempts. Please wait a moment and try again.",
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
```

Use `CF-Connecting-IP`, not `X-Forwarded-For` — the former is set by
Cloudflare and cannot be spoofed by the client; the latter can.

### 3. Deploy

```bash
cd cloudflare-worker
npx wrangler deploy
```

## Verify it

```bash
for i in $(seq 1 20); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    https://games.gamaleldien.com/random-selector/join/ROOM-000000
done
```

Expect a run of `200` (or `404` for an unknown code) then `429`. Wait 60s and
confirm it recovers.

## Things worth knowing before you apply this

- **Shared-IP false positives are the real risk.** Everyone in a workshop on
  one office WiFi or a phone carrier NAT shares an egress IP. 12/minute is
  chosen to sit above a whole room joining at once (each person costs ~2-3
  requests, but they arrive spread over a minute or two, not simultaneously).
  If you run sessions with 30+ people on one network, watch for 429s the
  first time and raise the limit rather than leaving people locked out.
  Getting this wrong fails in the most visible way possible: participants
  cannot join while the facilitator is standing in front of the room.
- **Rate limiting counts requests, not joins.** The path prefix catches the
  join page load as well as the action POST.
- **It does not protect `/facilitator/login`.** That is Task 5 in the brief
  and is a separate concern; a second binding keyed on the login path would
  be the equivalent move there.
- **The Vercel origin is directly reachable**, so this is defence at the
  Worker only. Anyone who discovers the `*.vercel.app` hostname bypasses it
  entirely. If that matters, restrict the origin to Cloudflare — either
  Vercel deployment protection, or a shared secret header the Worker sets and
  the app requires.
