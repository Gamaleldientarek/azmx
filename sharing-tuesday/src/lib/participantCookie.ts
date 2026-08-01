import "server-only";

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { BASE_PATH } from "@/lib/basePath";
import {
  PARTICIPANT_AUDIENCE,
  TOKEN_ISSUER,
  participantSecrets,
} from "@/lib/tokenSecrets";
import { verifyWithClaims } from "@/lib/tokenVerify";

/**
 * Per-room participant identity cookie — the "you already have a seat" guard.
 *
 * Set (httpOnly, signed) when a participant joins a room; read by `joinRoom`
 * so re-opening the join link returns the SAME participant instead of
 * inserting a duplicate. Survives sessionStorage loss (new tab, browser
 * restart) for the cookie's lifetime.
 *
 * Signed with `PARTICIPANT_COOKIE_SECRET` — deliberately NOT the same key as
 * the facilitator session — and stamped with `iss`/`aud`. See
 * `tokenSecrets.ts`: a rotation of the old shared secret silently broke every
 * seat cookie, which made `joinRoom` skip its duplicate-join guard and double
 * the roster.
 */

const COOKIE_TTL_SECONDS = 60 * 60 * 12; // one session day

const cookieName = (roomId: string) =>
  `st_p_${roomId.replaceAll("-", "")}`;

export async function setParticipantCookie(
  roomId: string,
  participantId: string
): Promise<void> {
  const token = await new SignJWT({ room_id: roomId, participant_id: participantId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(PARTICIPANT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_TTL_SECONDS}s`)
    .sign(participantSecrets().signing);

  const store = await cookies();

  // Retire any legacy "/"-scoped cookie of the same name FIRST. Both paths
  // match every request under the basePath, so leaving the old one in place
  // means the browser sends two cookies with one name and the server reads
  // whichever comes first — intermittently resurrecting a stale seat.
  store.set(cookieName(roomId), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  store.set(cookieName(roomId), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_TTL_SECONDS,
    // Scoped to the app's mount point, not "/" — see basePath.ts.
    path: BASE_PATH,
  });
}

/**
 * Drop this browser's seat for a room — the "not you?" exit on a shared
 * phone, so the next person gets a clean name form instead of inheriting
 * the previous participant's identity.
 */
export async function clearParticipantCookie(roomId: string): Promise<void> {
  const store = await cookies();
  // Clear the legacy "/"-scoped cookie too, or "Not you?" silently fails for
  // anyone holding a seat issued before the cookie was scoped.
  store.set(cookieName(roomId), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  store.set(cookieName(roomId), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    // MUST match the path used when setting, or the browser keeps the cookie.
    path: BASE_PATH,
  });
}

/**
 * Returns the participant id previously stored for this room, or null.
 *
 * Null is deliberately indistinguishable to the CALLER (absent, expired and
 * tampered all mean "no seat"), but a signature failure is LOGGED. That
 * distinction is the operational signal D3 identified as missing: when a
 * secret is rotated without a `_PREVIOUS` fallback, every seat cookie fails
 * here at once, `joinRoom` stops recognising returning participants, and the
 * roster silently doubles. Previously that produced no evidence anywhere.
 */
export async function readParticipantCookie(
  roomId: string
): Promise<string | null> {
  try {
    const store = await cookies();
    const raw = store.get(cookieName(roomId))?.value;
    if (!raw) return null;

    const { payload, signatureFailed } = await verifyWithClaims(
      raw,
      participantSecrets(),
      PARTICIPANT_AUDIENCE
    );

    if (signatureFailed) {
      console.warn(
        `[seat-cookie] verification FAILED for room ${roomId}: a seat cookie ` +
          `was presented but no configured secret verified it. If this is ` +
          `happening in bulk, a secret was rotated without setting ` +
          `PARTICIPANT_COOKIE_SECRET_PREVIOUS — returning participants will ` +
          `be re-inserted as duplicates with new fun names.`
      );
      return null;
    }
    if (!payload) return null;

    // Re-check the room claim against the requested room: the cookie NAME is
    // room-derived, but the payload must agree. Cross-room replay stays shut.
    if (payload.room_id !== roomId) return null;

    return typeof payload.participant_id === "string"
      ? payload.participant_id
      : null;
  } catch {
    return null; // absent, expired, or misconfigured — treat as no seat
  }
}
