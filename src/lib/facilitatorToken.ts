/**
 * Facilitator session token — pure JWT layer.
 *
 * Kept free of `next/headers` and `server-only` so it can be shared by both
 * the server actions (via `facilitatorSession.ts`) and `src/proxy.ts`, which
 * has no request-scoped `cookies()` and must verify the raw cookie value.
 * It still never runs client-side: the signing secrets carry no NEXT_PUBLIC_
 * prefix, so they exist only on the server, and nothing client-side imports
 * this module.
 *
 * Signed with `FACILITATOR_SESSION_SECRET` (falling back to the legacy shared
 * `SESSION_SECRET`) and stamped with `iss`/`aud` so it is not interchangeable
 * with a participant seat cookie — see `tokenSecrets.ts` for the full model.
 */

import { SignJWT } from "jose";
import {
  FACILITATOR_AUDIENCE,
  TOKEN_ISSUER,
  facilitatorSecrets,
  facilitatorSessionVersion,
} from "@/lib/tokenSecrets";
import { verifyWithClaims } from "@/lib/tokenVerify";

export const FACILITATOR_COOKIE_NAME = "st_facilitator";

/** One working session; re-login next week costs nothing. */
export const FACILITATOR_SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h

/**
 * Mint the signed (HS256) facilitator session token.
 *
 * Carries `sver`, the session-version fingerprint, so the session can be
 * revoked server-side — see `facilitatorSessionVersion()`.
 */
export async function mintFacilitatorSessionToken(): Promise<string> {
  return new SignJWT({
    role: "facilitator",
    sver: facilitatorSessionVersion(),
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(FACILITATOR_AUDIENCE)
    .setSubject("facilitator")
    .setIssuedAt()
    .setExpirationTime(`${FACILITATOR_SESSION_TTL_SECONDS}s`)
    .sign(facilitatorSecrets().signing);
}

/**
 * True iff `token` is a valid, unexpired, UNREVOKED facilitator session.
 *
 * The `sver` check is what makes rotating FACILITATOR_PASSWORD (or bumping
 * FACILITATOR_SESSION_VERSION) invalidate every live session immediately.
 * Tokens minted before `sver` existed are rejected: there is exactly one
 * shared credential, re-login costs a password entry, and silently accepting
 * claim-less facilitator tokens would leave the revocation path unenforced.
 */
export async function verifyFacilitatorSessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await verifyWithClaims(
      token,
      facilitatorSecrets(),
      FACILITATOR_AUDIENCE
    );
    if (payload?.role !== "facilitator") return false;
    return payload.sver === facilitatorSessionVersion();
  } catch {
    // Missing secret configuration — fail closed.
    return false;
  }
}
