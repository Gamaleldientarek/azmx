import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { requireEnv } from "@/lib/env";

/**
 * Per-room participant identity cookie — the "you already have a seat" guard.
 *
 * Set (httpOnly, signed) when a participant joins a room; read by `joinRoom`
 * so re-opening the join link returns the SAME participant instead of
 * inserting a duplicate. Survives sessionStorage loss (new tab, browser
 * restart) for the cookie's lifetime.
 */

const COOKIE_TTL_SECONDS = 60 * 60 * 12; // one session day

const cookieName = (roomId: string) =>
  `st_p_${roomId.replaceAll("-", "")}`;

function secretKey(): Uint8Array {
  return new TextEncoder().encode(requireEnv("SESSION_SECRET"));
}

export async function setParticipantCookie(
  roomId: string,
  participantId: string
): Promise<void> {
  const token = await new SignJWT({ room_id: roomId, participant_id: participantId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_TTL_SECONDS}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(cookieName(roomId), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_TTL_SECONDS,
    path: "/",
  });
}

/**
 * Drop this browser's seat for a room — the "not you?" exit on a shared
 * phone, so the next person gets a clean name form instead of inheriting
 * the previous participant's identity.
 */
export async function clearParticipantCookie(roomId: string): Promise<void> {
  const store = await cookies();
  store.set(cookieName(roomId), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

/** Returns the participant id previously stored for this room, or null. */
export async function readParticipantCookie(
  roomId: string
): Promise<string | null> {
  try {
    const store = await cookies();
    const raw = store.get(cookieName(roomId))?.value;
    if (!raw) return null;
    const { payload } = await jwtVerify(raw, secretKey(), {
      algorithms: ["HS256"],
    });
    if (payload.room_id !== roomId) return null;
    return typeof payload.participant_id === "string"
      ? payload.participant_id
      : null;
  } catch {
    return null; // absent, expired, or tampered — treat as no seat
  }
}
