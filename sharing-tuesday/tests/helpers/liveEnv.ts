/**
 * Environment loading + PRODUCTION GUARD for the live suites (tests/live/*).
 *
 * The live suites are destructive: they create rooms, drive concurrent joins,
 * and call `deleteRoom`. They must never touch the project the deployed app
 * uses.
 *
 * This file used to parse `.env.local` — the same file the real app uses,
 * whose Supabase project ref is IDENTICAL to `supabase/.temp/project-ref`.
 * A stray `npm run test:live` therefore mutated and deleted production data
 * and burned production room codes. That fallback is now removed entirely.
 *
 * The contract is explicit and opt-in:
 *   - Live tests read `TEST_*` variables ONLY, from the real environment or
 *     from `.env.test` (git-ignored; must point at a throwaway project).
 *   - `.env.local` is never read to CONFIGURE anything — only to harvest a
 *     project ref that we then REFUSE.
 *   - If the configured test project matches the linked/production project,
 *     we HARD FAIL. Never a skip: a silent skip is how this stays broken.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PROJECT_ROOT = join(__dirname, "..", "..");

/**
 * The variables the live suites need, named so they can never be satisfied
 * accidentally by the app's own `.env.local`.
 */
export const REQUIRED_LIVE_VARS = [
  "TEST_SUPABASE_URL",
  "TEST_SUPABASE_SERVICE_ROLE_KEY",
  "TEST_FACILITATOR_PASSWORD",
] as const;

/** Needed only by the spawned app under test, not by the DB-level suites. */
export const OPTIONAL_LIVE_VARS = [
  "TEST_SUPABASE_ANON_KEY",
  "TEST_SUPABASE_JWT_SECRET",
  "TEST_SESSION_SECRET",
] as const;

let loaded = false;

/** Parse KEY=VALUE lines from `.env.test` into process.env (idempotent). */
export function loadLiveEnv(): void {
  if (loaded) return;
  loaded = true;
  let raw: string;
  try {
    raw = readFileSync(join(PROJECT_ROOT, ".env.test"), "utf8");
  } catch {
    return; // no .env.test — hasLiveEnv() will report false
  }
  for (const line of raw.split("\n")) {
    const m = line.match(
      /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/
    );
    if (!m) continue;
    const [, key, rawValue] = m;
    const value = rawValue.replace(/^(['"])(.*)\1$/, "$2");
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

/** Extract the Supabase project ref (subdomain) from a project URL. */
export function projectRef(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const ref = new URL(url).hostname.split(".")[0];
    return ref || null;
  } catch {
    return null;
  }
}

/**
 * Every project ref this machine can prove is PRODUCTION:
 *  - the Supabase CLI's linked project (`supabase db push` targets this),
 *  - whatever `.env.local` points at (what dev/deploy actually uses).
 *
 * `.env.local` is read here ONLY to harvest a ref to refuse.
 */
export function productionRefs(): string[] {
  const refs = new Set<string>();

  for (const rel of [
    join("supabase", ".temp", "project-ref"),
    join("supabase", ".temp", "linked-project.json"),
  ]) {
    const path = join(PROJECT_ROOT, rel);
    if (!existsSync(path)) continue;
    const raw = readFileSync(path, "utf8").trim();
    if (rel.endsWith(".json")) {
      try {
        const ref = (JSON.parse(raw) as { ref?: string }).ref;
        if (ref) refs.add(ref);
      } catch {
        // malformed — the plain project-ref file still covers us
      }
    } else if (raw) {
      refs.add(raw);
    }
  }

  const envLocal = join(PROJECT_ROOT, ".env.local");
  if (existsSync(envLocal)) {
    const raw = readFileSync(envLocal, "utf8");
    for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"]) {
      const m = raw.match(
        new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=\\s*(.*)\\s*$`, "m")
      );
      const ref = projectRef(m?.[1].replace(/^(['"])(.*)\1$/, "$2"));
      if (ref) refs.add(ref);
    }
  }

  return [...refs];
}

/**
 * Refuse to run against production. Throws — never returns false, never
 * degrades to a skip.
 */
export function assertNotProduction(): void {
  loadLiveEnv();
  const testUrl = process.env.TEST_SUPABASE_URL;
  const ref = projectRef(testUrl);

  if (!ref) {
    throw new Error(
      `TEST_SUPABASE_URL is not a valid Supabase project URL: ${
        testUrl ?? "(unset)"
      }`
    );
  }

  const forbidden = productionRefs();
  if (forbidden.includes(ref)) {
    throw new Error(
      `REFUSING TO RUN: the live suites are destructive (they create, mutate ` +
        `and DELETE rooms), and TEST_SUPABASE_URL points at project "${ref}" ` +
        `— the PRODUCTION project for this app.\n\n` +
        `Production refs detected: ${forbidden.join(", ")}\n` +
        `(sources: supabase/.temp/project-ref, supabase/.temp/` +
        `linked-project.json, .env.local)\n\n` +
        `Point TEST_SUPABASE_URL at a separate, throwaway Supabase project ` +
        `with supabase/migrations/ applied. See .env.test.example.`
    );
  }
}

/**
 * True iff the live suites are configured AND safe. False means "not set up"
 * (suites skip harmlessly); unsafe never returns — it throws.
 */
export function hasLiveEnv(): boolean {
  loadLiveEnv();
  if (!REQUIRED_LIVE_VARS.every((k) => Boolean(process.env[k]))) return false;
  assertNotProduction();
  return true;
}

export { PROJECT_ROOT };
