"use server";

import { mintRoomToken } from "@/lib/roomToken";
import { createServiceClient } from "@/lib/supabase/server";
import type { JoinRoomResult, Participant } from "@/lib/types";

const NAME_MIN = 1;
const NAME_MAX = 60;

/**
 * Participant joins a room (PUBLIC — the one un-gated mutating action).
 *
 * Calls the race-safe `join_room` RPC via the service-role client: the room
 * row lock serializes concurrent joins, so join numbers are gap-free and the
 * fun display name is unique in the room. On success we mint the scoped room
 * JWT the client uses for RLS reads + Realtime.
 *
 * DB errors are mapped to typed, user-friendly results — raw Postgres errors
 * never reach the client.
 */
export async function joinRoom(
  code: string,
  realName: string
): Promise<JoinRoomResult> {
  const trimmedCode = typeof code === "string" ? code.trim().toUpperCase() : "";
  if (!trimmedCode) {
    return {
      ok: false,
      error: "invalid_code",
      message: "That join link is missing its room code.",
    };
  }

  const trimmedName = typeof realName === "string" ? realName.trim() : "";
  if (trimmedName.length < NAME_MIN || trimmedName.length > NAME_MAX) {
    return {
      ok: false,
      error: "invalid_name",
      message: `Please enter your name (1–${NAME_MAX} characters).`,
    };
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .rpc("join_room", {
        p_room_code: trimmedCode,
        p_real_name: trimmedName,
      })
      .single<Participant>();

    if (error) {
      const msg = error.message ?? "";
      if (msg.includes("room_not_joinable")) {
        return {
          ok: false,
          error: "room_not_joinable",
          message:
            "This room is not open for joining — the draw may have " +
            "already started, or the code is wrong.",
        };
      }
      if (msg.includes("name_pool_exhausted")) {
        return {
          ok: false,
          error: "room_full",
          message: "This room is full — no fun names are left. Ask the facilitator.",
        };
      }
      if (msg.includes("invalid_real_name")) {
        return {
          ok: false,
          error: "invalid_name",
          message: "Please enter your name.",
        };
      }
      throw new Error(`join_room failed: ${msg}`);
    }

    if (!data) {
      throw new Error("join_room returned no participant row");
    }

    const roomToken = await mintRoomToken(data.room_id);

    return {
      ok: true,
      participant: {
        id: data.id,
        display_name: data.display_name,
        join_number: data.join_number,
        real_name: data.real_name ?? trimmedName,
      },
      roomId: data.room_id,
      roomToken,
    };
  } catch (err) {
    console.error("joinRoom failed:", err);
    return {
      ok: false,
      error: "server_error",
      message: "Could not join the room. Please try again.",
    };
  }
}
