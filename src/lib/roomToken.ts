import "server-only";

import { SignJWT } from "jose";
import { requireEnv } from "@/lib/env";

/** Lifetime of a scoped room token — comfortably covers one session. */
const ROOM_TOKEN_TTL = "4h";

/**
 * Mint the per-room scoped Supabase JWT (RLS Option A).
 *
 * Signed HS256 with the project's JWT secret (`SUPABASE_JWT_SECRET`).
 * Claims:
 *  - `role: "anon"`      — so the `to anon` read policies apply and
 *                          PostgREST/Realtime accept the token,
 *  - `room_id: <uuid>`   — the custom claim every read policy checks via
 *                          `auth.jwt() ->> 'room_id'`,
 *  - `aud: "authenticated"`, `iat`, `exp` — standard Supabase expectations.
 *
 * SERVER ONLY: the JWT secret must never reach the browser; only the minted
 * token does.
 */
export async function mintRoomToken(roomId: string): Promise<string> {
  const secret = new TextEncoder().encode(requireEnv("SUPABASE_JWT_SECRET"));

  return new SignJWT({ role: "anon", room_id: roomId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setAudience("authenticated")
    .setIssuedAt()
    .setExpirationTime(ROOM_TOKEN_TTL)
    .sign(secret);
}
