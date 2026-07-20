/**
 * Shared HS256 verification with rotation + legacy tolerance (D3).
 *
 * Tries each secret in the set. For the CURRENT signing secret the `iss` and
 * `aud` claims are required and must match. For verify-only fallbacks (a
 * `_PREVIOUS` value, or the legacy shared `SESSION_SECRET`) a token that
 * predates the claims is accepted — but if it CARRIES an audience, that
 * audience must still match, so a facilitator token can never be replayed as
 * a seat cookie even during the migration window.
 *
 * Why the tolerance exists: without it, introducing the split secrets would
 * itself trigger the exact failure D3 describes — every live seat cookie
 * failing at once, `joinRoom` skipping its duplicate-join guard, and the
 * roster silently doubling. Tokens are re-issued as they are used
 * (`recoverSeat` slides the seat cookie forward on every visit), so the
 * window closes on its own.
 *
 * `algorithms: ["HS256"]` is pinned on every path — never widened.
 */

import { jwtVerify, type JWTPayload } from "jose";
import { TOKEN_ISSUER, type SecretSet } from "@/lib/tokenSecrets";

export interface VerifyOutcome {
  payload: JWTPayload | null;
  /**
   * True when the token was present but no secret verified it — i.e. a
   * tampered token, or one signed with a secret that has been rotated out
   * without a `_PREVIOUS` fallback. Distinguishing this from "absent" is what
   * gives rotation an operational signal instead of silent seat loss.
   */
  signatureFailed: boolean;
}

export async function verifyWithClaims(
  token: string | undefined,
  secrets: SecretSet,
  audience: string
): Promise<VerifyOutcome> {
  if (!token) return { payload: null, signatureFailed: false };

  for (let i = 0; i < secrets.verification.length; i++) {
    const isCurrent = i === 0;
    try {
      // Only the current secret gets the claims enforced by `jose`; fallbacks
      // are checked manually below so legacy claim-less tokens can pass.
      const { payload } = await jwtVerify(token, secrets.verification[i], {
        algorithms: ["HS256"],
        ...(isCurrent && secrets.migrated
          ? { issuer: TOKEN_ISSUER, audience }
          : {}),
      });

      if (!isCurrent || !secrets.migrated) {
        // Legacy / rotated-out token: claims may be absent, but a PRESENT
        // audience must still match. This is what keeps the two token types
        // from being interchangeable even before the migration completes.
        if (payload.aud !== undefined) {
          const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
          if (!auds.includes(audience)) continue;
        }
        if (payload.iss !== undefined && payload.iss !== TOKEN_ISSUER) continue;
      }

      return { payload, signatureFailed: false };
    } catch {
      // Wrong secret, expired, or claim mismatch — try the next secret.
    }
  }

  return { payload: null, signatureFailed: true };
}
