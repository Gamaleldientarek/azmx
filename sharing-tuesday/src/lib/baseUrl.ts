import "server-only";

import { headers } from "next/headers";
import { BASE_PATH } from "@/lib/basePath";
import { appUrl } from "@/lib/env";

/**
 * Base URL for absolute links (join URLs, QR payloads).
 *
 * WHY THIS IS SECURITY-SENSITIVE: the value returned here is what the
 * projection screen encodes into the QR code participants scan
 * (`screen/[roomId]/page.tsx`). A forged `x-forwarded-host` therefore yields
 * a projected QR pointing at an attacker's clone of the join page, which
 * harvests exactly what that form asks for — real names. The Vercel origin is
 * directly reachable, so the Worker cannot be relied on to pin the header.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_APP_URL` — the explicit, trusted answer. Set this in
 *      production; it makes the request headers irrelevant.
 *   2. A request host that appears in the allow-list below.
 *   3. Localhost, in development only.
 *
 * Anything else throws rather than emitting an attacker-controlled URL. A
 * broken QR that fails loudly is strictly better than a working QR that
 * points somewhere hostile.
 *
 * Server only.
 */

/**
 * Hosts we will build absolute URLs for when `NEXT_PUBLIC_APP_URL` is unset.
 * The public host, plus Vercel's own domains so a preview deployment is
 * self-consistent.
 */
const ALLOWED_HOSTS = ["games.gamaleldien.com"];

/** Vercel-owned suffixes: previews and the raw production origin. */
const ALLOWED_HOST_SUFFIXES = [".vercel.app"];

function isLocalhost(host: string): boolean {
  const name = host.split(":")[0];
  return name === "localhost" || name === "127.0.0.1" || name === "[::1]";
}

function isAllowedHost(host: string): boolean {
  const name = host.toLowerCase();
  if (ALLOWED_HOSTS.includes(name.split(":")[0])) return true;
  return ALLOWED_HOST_SUFFIXES.some((suffix) =>
    name.split(":")[0].endsWith(suffix)
  );
}

export async function resolveBaseUrl(): Promise<string> {
  const fromEnv = appUrl();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";

  // Dev-only fallback. In production an unrecognised host is an attack
  // signal, not a configuration convenience.
  if (process.env.NODE_ENV !== "production") {
    const devHost = host || "localhost:3000";
    const proto = isLocalhost(devHost) ? "http" : "https";
    return `${proto}://${devHost}${BASE_PATH}`;
  }

  if (!host || !isAllowedHost(host)) {
    throw new Error(
      `resolveBaseUrl: refusing to build an absolute URL from untrusted host ` +
        `"${host || "(none)"}". Set NEXT_PUBLIC_APP_URL (e.g. ` +
        `https://games.gamaleldien.com${BASE_PATH}) in the deployment ` +
        `environment, or add the host to ALLOWED_HOSTS in src/lib/baseUrl.ts.`
    );
  }

  return `https://${host}${BASE_PATH}`;
}
