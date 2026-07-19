/**
 * Invoke Next.js server actions over real HTTP, exactly like the browser's
 * React client does (`callServer`): a POST to the page URL with the
 * `Next-Action: <id>` header and a JSON-array body of arguments, answered
 * by a text/x-component flight stream.
 *
 * Action IDs are build-specific hashes, so we resolve them at runtime by
 * scanning the build's chunks for React's
 *   createServerReference("<id>", ..., "<exportName>")
 * registrations — no hardcoded hashes, survives rebuilds.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PROJECT_ROOT } from "./liveEnv";

/** name -> action id, scraped from .next/server/chunks. */
export function resolveActionIds(): Record<string, string> {
  const ids: Record<string, string> = {};
  const root = join(PROJECT_ROOT, ".next", "server", "chunks");
  const stack = [root];
  const re =
    /createServerReference\)?\(\s*"([0-9a-f]{40,})"[^)]*?,\s*"(\w+)"\s*\)/g;
  while (stack.length) {
    const dir = stack.pop()!;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.name.endsWith(".js")) {
        const src = readFileSync(p, "utf8");
        for (const m of src.matchAll(re)) ids[m[2]] = m[1];
      }
    }
  }
  if (Object.keys(ids).length === 0) {
    throw new Error(
      ".next/server/chunks holds no createServerReference registrations — " +
        "did `next build` run?"
    );
  }
  return ids;
}

/** Parse a flight (text/x-component) response and return the action result. */
export function parseFlightResult(body: string): unknown {
  const rows = new Map<string, unknown>();
  for (const line of body.split("\n")) {
    const m = line.match(/^([0-9a-f]+):(.*)$/i);
    if (!m) continue;
    const payload = m[2];
    if (!/^[[{"\d-]|^true|^false|^null/.test(payload)) continue; // skip I[...] etc.
    try {
      rows.set(m[1], JSON.parse(payload));
    } catch {
      /* non-JSON row — ignore */
    }
  }

  const resolve = (v: unknown, depth = 0): unknown => {
    if (depth > 10) return v;
    if (typeof v === "string") {
      const ref = v.match(/^\$@([0-9a-f]+)$/i);
      if (ref && rows.has(ref[1])) return resolve(rows.get(ref[1]), depth + 1);
      return v;
    }
    if (Array.isArray(v)) return v.map((x) => resolve(x, depth + 1));
    if (v && typeof v === "object") {
      return Object.fromEntries(
        Object.entries(v).map(([k, val]) => [k, resolve(val, depth + 1)])
      );
    }
    return v;
  };

  const root = rows.get("0") as { a?: unknown } | undefined;
  if (root && typeof root === "object" && "a" in root) {
    return resolve(root.a);
  }
  // Fallback: some flight shapes put the value straight in row 1.
  return resolve(rows.get("1"));
}

/**
 * POST a server action the way `callServer` does. Returns HTTP status plus
 * the decoded action return value (undefined when the response was a
 * redirect or carried no result row).
 */
export async function callServerAction(
  pageUrl: string,
  actionId: string,
  args: unknown[],
  init?: { cookie?: string }
): Promise<{ status: number; result: unknown; response: Response }> {
  const response = await fetch(pageUrl, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Next-Action": actionId,
      "Content-Type": "text/plain;charset=UTF-8",
      Accept: "text/x-component",
      ...(init?.cookie ? { cookie: init.cookie } : {}),
    },
    body: JSON.stringify(args),
  });
  let result: unknown;
  if (response.headers.get("content-type")?.includes("text/x-component")) {
    result = parseFlightResult(await response.text());
  }
  return { status: response.status, result, response };
}
