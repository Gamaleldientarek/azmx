/**
 * Facilitator session token — pure JWT layer.
 *
 * Kept free of `next/headers` and `server-only` so it can be shared by both
 * the server actions (via `facilitatorSession.ts`) and `src/proxy.ts`, which
 * has no request-scoped `cookies()` and must verify the raw cookie value.
 * It still never runs client-side: `SESSION_SECRET` (no NEXT_PUBLIC_ prefix)
 * is only defined on the server, and nothing client-side imports this.
 */

import { jwtVerify, SignJWT } from "jose";

export const FACILITATOR_COOKIE_NAME = "st_facilitator";

/** One working session; re-login next week costs nothing. */
export const FACILITATOR_SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h

function sessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "Missing required environment variable: SESSION_SECRET. " +
        "See .env.example."
    );
  }
  return new TextEncoder().encode(secret);
}

/** Mint the signed (HS256, `SESSION_SECRET`) facilitator session token. */
export async function mintFacilitatorSessionToken(): Promise<string> {
  return new SignJWT({ role: "facilitator" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject("facilitator")
    .setIssuedAt()
    .setExpirationTime(`${FACILITATOR_SESSION_TTL_SECONDS}s`)
    .sign(sessionSecret());
}

/** True iff `token` is a valid, unexpired facilitator session token. */
export async function verifyFacilitatorSessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, sessionSecret(), {
      algorithms: ["HS256"],
    });
    return payload.role === "facilitator";
  } catch {
    return false;
  }
}
