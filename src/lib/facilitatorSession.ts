import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  FACILITATOR_COOKIE_NAME,
  FACILITATOR_SESSION_TTL_SECONDS,
  mintFacilitatorSessionToken,
  verifyFacilitatorSessionToken,
} from "@/lib/facilitatorToken";
import { BASE_PATH } from "@/lib/basePath";
import { requireEnv } from "@/lib/env";

/**
 * Constant-time check of a submitted password against `FACILITATOR_PASSWORD`.
 *
 * Both sides are SHA-256 hashed first so `timingSafeEqual` gets equal-length
 * buffers and the comparison leaks neither content nor length.
 */
export function verifyFacilitatorPassword(submitted: string): boolean {
  const expected = requireEnv("FACILITATOR_PASSWORD");
  const a = createHash("sha256").update(submitted, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

/**
 * Set the facilitator session cookie (httpOnly, Secure, SameSite=Lax,
 * HMAC-signed JWT). Call only after `verifyFacilitatorPassword` passed.
 */
export async function createFacilitatorSession(): Promise<void> {
  const token = await mintFacilitatorSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(FACILITATOR_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Scoped to the app's mount point, not "/" — see basePath.ts.
    path: BASE_PATH,
    maxAge: FACILITATOR_SESSION_TTL_SECONDS,
  });
}

/**
 * Clear the facilitator session cookie.
 *
 * Deletes at BOTH paths deliberately. Sessions issued before the cookie was
 * scoped live at "/" and still match every request under the basePath; a
 * delete at only the new path would leave that legacy cookie in place, shadow
 * the new one, and make "Log out" look like it did nothing for up to 12h.
 */
export async function destroyFacilitatorSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete({ name: FACILITATOR_COOKIE_NAME, path: BASE_PATH });
  cookieStore.delete({ name: FACILITATOR_COOKIE_NAME, path: "/" });
}

/** True iff the current request carries a valid facilitator session. */
export async function isFacilitator(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(FACILITATOR_COOKIE_NAME)?.value;
  return verifyFacilitatorSessionToken(token);
}

/**
 * Assert the caller is the facilitator. Server actions use this as their
 * first line; on failure they return a typed `unauthorized` result.
 */
export async function requireFacilitator(): Promise<
  { ok: true } | { ok: false; error: "unauthorized"; message: string }
> {
  if (await isFacilitator()) return { ok: true };
  return {
    ok: false,
    error: "unauthorized",
    message: "Facilitator session required. Please log in.",
  };
}
