/**
 * Environment loading for the live suites (tests/live/*).
 *
 * Vitest does not read .env.local by itself, so we parse it here (no dotenv
 * dependency needed) and expose:
 *   - loadLiveEnv(): merges .env.local into process.env (existing vars win)
 *   - hasLiveEnv(): true iff everything the live suites need is present —
 *     used with describe.skipIf so the suites skip gracefully instead of
 *     failing when no live project is configured.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const PROJECT_ROOT = join(__dirname, "..", "..");

export const REQUIRED_LIVE_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "FACILITATOR_PASSWORD",
] as const;

let loaded = false;

/** Parse KEY=VALUE lines from .env.local into process.env (idempotent). */
export function loadLiveEnv(): void {
  if (loaded) return;
  loaded = true;
  let raw: string;
  try {
    raw = readFileSync(join(PROJECT_ROOT, ".env.local"), "utf8");
  } catch {
    return; // no .env.local — hasLiveEnv() will report false
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, key, rawValue] = m;
    const value = rawValue.replace(/^(['"])(.*)\1$/, "$2");
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

/** True iff all env vars needed by the live suites are present. */
export function hasLiveEnv(): boolean {
  loadLiveEnv();
  return REQUIRED_LIVE_VARS.every((k) => Boolean(process.env[k]));
}

export { PROJECT_ROOT };
