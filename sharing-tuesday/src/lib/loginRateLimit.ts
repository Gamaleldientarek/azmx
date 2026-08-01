import "server-only";

/**
 * Per-IP rate limiting with exponential backoff for facilitator login.
 *
 * `loginFacilitator` accepted unlimited unauthenticated password attempts:
 * no lockout, no delay, no counter. The comparison is correctly constant-time,
 * which closes the timing channel but does nothing about volume — and the
 * credential is a single shared password guarding every room in the system.
 *
 * SCOPE AND LIMITS — read before relying on this.
 *
 * This is an IN-PROCESS limiter. On Vercel the app runs as multiple isolated
 * instances, so an attacker's requests spread across instances each get their
 * own counter, and the effective limit is (threshold x instances). Instances
 * also recycle, which resets state.
 *
 * It is therefore a speed bump, not a wall: it turns "unlimited attempts at
 * full speed" into "a few attempts, then seconds-to-minutes of waiting per
 * instance", which is enough to make online brute force of a human-chosen
 * password impractical. It is NOT a substitute for a shared-state limiter at
 * the edge — see cloudflare-worker/RATE_LIMITING.md, which describes the same
 * binding for the join path; a second binding on /facilitator/login is the
 * durable fix and should be applied alongside this.
 *
 * Memory is bounded by pruning expired entries on every call and hard-capping
 * the table, so this cannot be turned into a memory-exhaustion vector.
 */

interface Attempt {
  failures: number;
  /** Epoch ms until which this key is locked out. */
  lockedUntil: number;
  /** Epoch ms of the last failure — used for pruning. */
  lastSeen: number;
}

/** Free attempts before backoff starts. Covers an honest typo or three. */
const FREE_ATTEMPTS = 3;

/** Backoff base: delay = BASE * 2^(failures - FREE_ATTEMPTS - 1). */
const BASE_DELAY_MS = 2_000;

/** Cap on a single lockout. Long enough to be painful, short enough to recover. */
const MAX_DELAY_MS = 15 * 60_000; // 15 minutes

/** Forget a key after this long with no failures. */
const ENTRY_TTL_MS = 60 * 60_000; // 1 hour

/** Hard cap on tracked keys, so the table cannot grow without bound. */
const MAX_ENTRIES = 10_000;

const attempts = new Map<string, Attempt>();

function prune(now: number): void {
  for (const [key, entry] of attempts) {
    if (entry.lockedUntil <= now && now - entry.lastSeen > ENTRY_TTL_MS) {
      attempts.delete(key);
    }
  }
  // Still oversized (a distributed flood of unique keys): drop the oldest.
  if (attempts.size > MAX_ENTRIES) {
    const sorted = [...attempts.entries()].sort(
      (a, b) => a[1].lastSeen - b[1].lastSeen
    );
    for (const [key] of sorted.slice(0, attempts.size - MAX_ENTRIES)) {
      attempts.delete(key);
    }
  }
}

export interface RateLimitState {
  allowed: boolean;
  /** Seconds the caller must wait. 0 when allowed. */
  retryAfterSeconds: number;
}

/** Check whether `key` may attempt a login right now. Does not record anything. */
export function checkLoginAllowed(key: string): RateLimitState {
  const now = Date.now();
  prune(now);

  const entry = attempts.get(key);
  if (!entry || entry.lockedUntil <= now) {
    return { allowed: true, retryAfterSeconds: 0 };
  }
  return {
    allowed: false,
    retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
  };
}

/** Record a failed attempt and return the resulting lockout state. */
export function recordLoginFailure(key: string): RateLimitState {
  const now = Date.now();
  prune(now);

  const entry = attempts.get(key) ?? {
    failures: 0,
    lockedUntil: 0,
    lastSeen: now,
  };
  entry.failures += 1;
  entry.lastSeen = now;

  if (entry.failures > FREE_ATTEMPTS) {
    const exponent = entry.failures - FREE_ATTEMPTS - 1;
    const delay = Math.min(BASE_DELAY_MS * 2 ** exponent, MAX_DELAY_MS);
    entry.lockedUntil = now + delay;
  }

  attempts.set(key, entry);

  return entry.lockedUntil > now
    ? {
        allowed: false,
        retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
      }
    : { allowed: true, retryAfterSeconds: 0 };
}

/** Clear a key's history — call on successful login. */
export function clearLoginFailures(key: string): void {
  attempts.delete(key);
}

/** Test hook: drop all state. */
export function resetLoginRateLimit(): void {
  attempts.clear();
}
