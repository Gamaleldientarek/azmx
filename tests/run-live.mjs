#!/usr/bin/env node
/**
 * Runner for `npm run test:live`.
 *
 *  1. Skips gracefully (exit 0) when .env.local lacks the live Supabase env.
 *  2. Builds the app (`next build`) so the session-flow suite can `next
 *     start` the real production server. Set SKIP_BUILD=1 to reuse an
 *     existing .next when iterating.
 *  3. Runs the tests/live vitest suites sequentially.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "FACILITATOR_PASSWORD",
];

const env = { ...process.env };
const envFile = join(root, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && env[m[1]] === undefined) {
      env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  }
}

const missing = REQUIRED.filter((k) => !env[k]);
if (missing.length > 0) {
  console.log(
    `test:live SKIPPED — missing env in .env.local: ${missing.join(", ")}\n` +
      "Populate .env.local (see .env.example) to run the live suites."
  );
  process.exit(0);
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { cwd: root, env, stdio: "inherit" });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

if (env.SKIP_BUILD === "1" && existsSync(join(root, ".next", "BUILD_ID"))) {
  console.log("test:live — SKIP_BUILD=1, reusing existing .next build");
} else {
  console.log("test:live — building the app (next build)…");
  run(process.execPath, [
    join(root, "node_modules", "next", "dist", "bin", "next"),
    "build",
  ]);
}

console.log("test:live — running live suites against Supabase + built app…");
run(process.execPath, [
  join(root, "node_modules", "vitest", "vitest.mjs"),
  "run",
  "tests/live",
]);
