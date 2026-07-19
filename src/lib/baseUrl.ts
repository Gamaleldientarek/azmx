import "server-only";

import { headers } from "next/headers";
import { appUrl } from "@/lib/env";

/**
 * Base URL for absolute links (join URLs, QR payloads): the
 * `NEXT_PUBLIC_APP_URL` override when set, otherwise derived from the
 * request headers. Server only — used by server actions and server
 * components that need an absolute URL.
 */
/** Must match `basePath` in next.config.ts. */
const BASE_PATH = "/random-selector";

export async function resolveBaseUrl(): Promise<string> {
  const fromEnv = appUrl();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}${BASE_PATH}`;
}
