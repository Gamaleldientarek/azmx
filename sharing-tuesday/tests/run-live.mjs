#!/usr/bin/env node
/**
 * Runner for `npm run test:live`.
 *
 * SAFETY FIRST — the live suites are DESTRUCTIVE. They create rooms, drive 25
 * concurrent joins, and call deleteRoom. This runner used to source
 * `.env.local`, whose Supabase project ref is identical to the linked
 * (production) project, so a stray `npm run test:live` mutated and deleted
 * PRODUCTION data and burned production room codes.
 *
 * The `.env.local` fallback is gone. The suites now run only against an
 * explicitly configured throwaway project:
 *
 *   1. Require TEST_SUPABASE_URL / TEST_SUPABASE_SERVICE_ROLE_KEY /
 *      TEST_FACILITATOR_PASSWORD, from the real environment or `.env.test`.
 *      Missing -> HARD FAIL (exit 1). Not a silent skip: a skip in CI is
 *      indistinguishable from a pass, which is how this hid for so long.
 *   2. Refuse to run if the configured project ref matches production
 *      (linked project ref, or whatever `.env.local` points at).
 *   3. Build + start the app with the TEST_* values mapped onto the app's own
 *      variable names, and with the production names explicitly BLANKED in
 *      the child environment so `.env.local` cannot leak in through Next's
 *      own env loading (NEXT_PUBLIC_* values are inlined at build time, so
 *      the build must be done with the test env too).
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED = [
  "TEST_SUPABASE_URL",
  "TEST_SUPABASE_SERVICE_ROLE_KEY",
  "TEST_FACILITATOR_PASSWORD",
];

function fail(message) {
  console.error(`\ntest:live REFUSED\n\n${message}\n`);
  process.exit(1);
}

/* -- 1. Load TEST_* from .env.test (never .env.local) ---------------------- */

const env = { ...process.env };
const testEnvFile = join(root, ".env.test");
if (existsSync(testEnvFile)) {
  for (const line of readFileSync(testEnvFile, "utf8").split("\n")) {
    const m = line.match(
      /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/
    );
    if (m && env[m[1]] === undefined) {
      env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  }
}

const missing = REQUIRED.filter((k) => !env[k]);
if (missing.length > 0) {
  fail(
    `Missing required test environment: ${missing.join(", ")}\n\n` +
      `The live suites are destructive and will NOT fall back to .env.local.\n` +
      `Create .env.test pointing at a THROWAWAY Supabase project with the\n` +
      `migrations in supabase/migrations/ applied. See .env.test.example.`
  );
}

/* -- 2. Refuse to run against production ----------------------------------- */

function refOf(url) {
  try {
    return new URL(url).hostname.split(".")[0] || null;
  } catch {
    return null;
  }
}

const testRef = refOf(env.TEST_SUPABASE_URL);
if (!testRef) {
  fail(`TEST_SUPABASE_URL is not a valid URL: ${env.TEST_SUPABASE_URL}`);
}

const productionRefs = new Set();

const refFile = join(root, "supabase", ".temp", "project-ref");
if (existsSync(refFile)) {
  const r = readFileSync(refFile, "utf8").trim();
  if (r) productionRefs.add(r);
}

const linkedFile = join(root, "supabase", ".temp", "linked-project.json");
if (existsSync(linkedFile)) {
  try {
    const { ref } = JSON.parse(readFileSync(linkedFile, "utf8"));
    if (ref) productionRefs.add(ref);
  } catch {
    /* the plain project-ref file still covers us */
  }
}

// Read .env.local ONLY to harvest a ref to refuse — never to configure.
const localEnvFile = join(root, ".env.local");
if (existsSync(localEnvFile)) {
  const raw = readFileSync(localEnvFile, "utf8");
  for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"]) {
    const m = raw.match(
      new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=\\s*(.*)\\s*$`, "m")
    );
    if (!m) continue;
    const r = refOf(m[1].replace(/^(['"])(.*)\1$/, "$2"));
    if (r) productionRefs.add(r);
  }
}

if (productionRefs.has(testRef)) {
  fail(
    `TEST_SUPABASE_URL points at project "${testRef}", which is the ` +
      `PRODUCTION project for this app.\n\n` +
      `The live suites CREATE, MUTATE and DELETE rooms. Running them here ` +
      `would destroy real session data.\n\n` +
      `Production refs detected: ${[...productionRefs].join(", ")}\n` +
      `(sources: supabase/.temp/project-ref, supabase/.temp/` +
      `linked-project.json, .env.local)\n\n` +
      `Point TEST_SUPABASE_URL at a separate, throwaway Supabase project.`
  );
}

console.log(`test:live — target project: ${testRef} (production: ${
  [...productionRefs].join(", ") || "none detected"
})`);

/* -- 3. Map TEST_* onto the app's own names, blanking production ones ------ */

// `next build` / `next start` load .env.local themselves, and NEXT_PUBLIC_*
// values are INLINED AT BUILD TIME. Setting these explicitly in the child
// environment takes precedence over .env.local, so the built bundle and the
// running server both point at the test project.
const childEnv = {
  ...env,
  NEXT_PUBLIC_SUPABASE_URL: env.TEST_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: env.TEST_SUPABASE_ANON_KEY ?? "",
  SUPABASE_SERVICE_ROLE_KEY: env.TEST_SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET: env.TEST_SUPABASE_JWT_SECRET ?? "",
  FACILITATOR_PASSWORD: env.TEST_FACILITATOR_PASSWORD,
  SESSION_SECRET: env.TEST_SESSION_SECRET ?? "test-session-secret-not-for-prod",
};
// Split secrets (D3): keep the test app on a single test secret rather than
// inheriting any rotated production value.
childEnv.FACILITATOR_SESSION_SECRET = childEnv.SESSION_SECRET;
childEnv.PARTICIPANT_COOKIE_SECRET = childEnv.SESSION_SECRET;
delete childEnv.FACILITATOR_SESSION_SECRET_PREVIOUS;
delete childEnv.PARTICIPANT_COOKIE_SECRET_PREVIOUS;

function run(cmd, args) {
  const res = spawnSync(cmd, args, { cwd: root, env: childEnv, stdio: "inherit" });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

if (childEnv.SKIP_BUILD === "1" && existsSync(join(root, ".next", "BUILD_ID"))) {
  console.log(
    "test:live — SKIP_BUILD=1, reusing existing .next build " +
      "(WARNING: it may have been built against a different project)"
  );
} else {
  console.log("test:live — building the app (next build) with the TEST env…");
  run(process.execPath, [
    join(root, "node_modules", "next", "dist", "bin", "next"),
    "build",
  ]);
}

console.log("test:live — running live suites against the TEST project…");
run(process.execPath, [
  join(root, "node_modules", "vitest", "vitest.mjs"),
  "run",
  "tests/live",
]);
