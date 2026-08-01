import "server-only";

import { randomInt } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Human room code: ROOM- + 6 digits, e.g. ROOM-482113.
 *
 * WIDENED FROM 4 DIGITS. The old space was randomInt(1000, 10000) = 9,000
 * values, which was a problem twice over:
 *
 *  1. ENUMERATION. /join/[code] is public and force-dynamic, and confirms a
 *     room's existence, name and status per code. 9,000 codes is seconds of
 *     scripted requests to find every live room in the system.
 *  2. AVAILABILITY. `rooms.code` carries a GLOBAL unique constraint across
 *     every room ever created, not just open ones, so each room permanently
 *     consumes one of the 9,000 codes. With generateUniqueRoomCode giving up
 *     after 20 attempts, room creation degrades and eventually fails as the
 *     space fills — a slow-burn outage with no obvious cause.
 *
 * 6 digits = 900,000 values: 100x the enumeration cost, and the exhaustion
 * problem moves out of reach. Still readable aloud across a room, which is
 * the whole point of a human code.
 *
 * Codes are compared as opaque strings, so existing 4-digit rooms keep
 * working unchanged.
 */
export function generateRoomCode(): string {
  // crypto-random 100000..999999 — no leading zero.
  return `ROOM-${randomInt(100000, 1000000)}`;
}

const MAX_CODE_ATTEMPTS = 20;

/**
 * Generate a room code that does not collide with any EXISTING room.
 *
 * Note: `rooms.code` carries a global UNIQUE constraint (not just among open
 * rooms), so we check against all rooms — a code recycled from a closed room
 * would still violate the constraint on insert. The unique constraint remains
 * the race-proof backstop; callers should retry on a 23505 unique violation.
 */
export async function generateUniqueRoomCode(): Promise<string> {
  const supabase = createServiceClient();

  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const code = generateRoomCode();

    const { count, error } = await supabase
      .from("rooms")
      .select("id", { count: "exact", head: true })
      .eq("code", code);

    if (error) {
      throw new Error(`room code collision check failed: ${error.message}`);
    }
    if ((count ?? 0) === 0) {
      return code;
    }
  }

  throw new Error(
    `Could not find a free room code after ${MAX_CODE_ATTEMPTS} attempts — ` +
      `the ROOM-###### space may be nearly exhausted; close old rooms.`
  );
}
