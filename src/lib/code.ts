import "server-only";

import { randomInt } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/server";

/** Human room code: ROOM- + 4 digits, e.g. ROOM-4821. */
export function generateRoomCode(): string {
  // crypto-random 1000..9999 — no leading zero, unguessable enough for a
  // short-lived, projection-displayed code.
  return `ROOM-${randomInt(1000, 10000)}`;
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
      `the ROOM-#### space may be nearly exhausted; close old rooms.`
  );
}
