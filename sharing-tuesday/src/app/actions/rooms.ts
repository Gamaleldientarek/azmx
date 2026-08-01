"use server";

import { resolveBaseUrl } from "@/lib/baseUrl";
import { generateUniqueRoomCode } from "@/lib/code";
import { requireFacilitator } from "@/lib/facilitatorSession";
import { isValidRealName, sanitizeRealName } from "@/lib/realName";
import { createServiceClient } from "@/lib/supabase/server";
import type { CloseRoomResult, CreateRoomResult, Room } from "@/lib/types";

/**
 * Create a new room (facilitator only).
 *
 * Generates a collision-checked ROOM-#### code, inserts the room in `lobby`
 * status, and returns id, code, and the absolute join URL. The global UNIQUE
 * constraint on `rooms.code` is the race-proof backstop; on the (rare) 23505
 * unique violation we retry once with a fresh code.
 */
export async function createRoom(name?: string): Promise<CreateRoomResult> {
  const gate = await requireFacilitator();
  if (!gate.ok) return gate;

  try {
    const supabase = createServiceClient();
    const roomName = name?.trim() ? name.trim().slice(0, 120) : null;

    let room: Room | null = null;
    for (let attempt = 0; attempt < 2 && !room; attempt++) {
      const code = await generateUniqueRoomCode();
      const { data, error } = await supabase
        .from("rooms")
        .insert({ code, name: roomName, status: "lobby" })
        .select()
        .single<Room>();

      if (error) {
        // 23505 = unique_violation: another create raced us to this code.
        if (error.code === "23505" && attempt === 0) continue;
        throw new Error(`room insert failed: ${error.message}`);
      }
      room = data;
    }

    if (!room) {
      throw new Error("room insert failed after code-collision retry");
    }

    const base = await resolveBaseUrl();
    return {
      ok: true,
      room: {
        id: room.id,
        code: room.code,
        joinUrl: `${base}/join/${room.code}`,
      },
    };
  } catch (err) {
    console.error("createRoom failed:", err);
    return {
      ok: false,
      error: "server_error",
      message: "Could not create the room. Please try again.",
    };
  }
}

/**
 * Close a room (facilitator only). Delegates to the `close_room` RPC, which
 * sets status=closed and purges every participant's real name (privacy).
 */
export async function closeRoom(roomId: string): Promise<CloseRoomResult> {
  const gate = await requireFacilitator();
  if (!gate.ok) return gate;

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.rpc("close_room", { p_room_id: roomId });
    if (error) {
      throw new Error(`close_room failed: ${error.message}`);
    }
    return { ok: true };
  } catch (err) {
    console.error("closeRoom failed:", err);
    return {
      ok: false,
      error: "server_error",
      message: "Could not close the room. Please try again.",
    };
  }
}

/**
 * Real names for a room's roster (facilitator only). The realtime channel is
 * sanitized by design, so the control panel calls this to label live joiners.
 */
export async function getRoomRealNames(
  roomId: string
): Promise<
  | { ok: true; names: Record<string, string> }
  | { ok: false; error: "unauthorized" | "server_error"; message: string }
> {
  const gate = await requireFacilitator();
  if (!gate.ok) return gate;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("participants")
      .select("id, real_name")
      .eq("room_id", roomId);
    if (error) throw new Error(error.message);

    const names: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row.real_name) names[row.id] = row.real_name;
    }
    return { ok: true, names };
  } catch (err) {
    console.error("getRoomRealNames failed:", err);
    return {
      ok: false,
      error: "server_error",
      message: "Could not load real names.",
    };
  }
}

export type DeleteRoomResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "server_error"; message: string };

/**
 * Hard-delete a room (facilitator only). FK cascade removes participants and
 * draws with it. For a soft end that keeps the row, use closeRoom instead.
 */
export async function deleteRoom(roomId: string): Promise<DeleteRoomResult> {
  const gate = await requireFacilitator();
  if (!gate.ok) return gate;

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("rooms").delete().eq("id", roomId);
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (err) {
    console.error("deleteRoom failed:", err);
    return {
      ok: false,
      error: "server_error",
      message: "Could not delete the room. Please try again.",
    };
  }
}

export type SetJoiningResult =
  | { ok: true; status: "lobby" | "locked" }
  | { ok: false; error: "unauthorized" | "server_error"; message: string };

/**
 * Facilitator door control: close joining without drawing (lobby -> locked),
 * reopen it (locked -> lobby), or reopen after a draw (drawing/revealed ->
 * lobby, so latecomers can join before a redraw). Serialized in the DB on
 * the same row lock join_room takes.
 */
export async function setJoining(
  roomId: string,
  open: boolean
): Promise<SetJoiningResult> {
  const gate = await requireFacilitator();
  if (!gate.ok) return gate;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .rpc("set_joining", { p_room_id: roomId, p_open: open })
      .single<Room>();
    if (error || !data) {
      throw new Error(error?.message ?? "set_joining returned nothing");
    }
    return { ok: true, status: data.status as "lobby" | "locked" };
  } catch (err) {
    console.error("setJoining failed:", err);
    return {
      ok: false,
      error: "server_error",
      message: "Could not update joining. Please try again.",
    };
  }
}

export type AddParticipantResult =
  | {
      ok: true;
      participant: { id: string; display_name: string; join_number: number };
    }
  | {
      ok: false;
      error: "unauthorized" | "room_not_joinable" | "room_full" | "invalid_name" | "server_error";
      message: string;
    };

/**
 * Facilitator adds a person to the draw by name — for themselves when they
 * are taking part, or for someone whose phone won't cooperate. Goes through
 * the same race-safe `join_room` RPC as a phone join, so numbering, name
 * uniqueness and the lobby-only rule are identical.
 */
export async function addParticipant(
  roomCode: string,
  realName: string
): Promise<AddParticipantResult> {
  const gate = await requireFacilitator();
  if (!gate.ok) return gate;

  // Same sanitizer as the public join path — this writes the identical
  // `real_name` column and renders into the identical roster.
  const name = sanitizeRealName(realName);
  if (!isValidRealName(name)) {
    return {
      ok: false,
      error: "invalid_name",
      message: "Enter a name (1–60 characters).",
    };
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .rpc("join_room", {
        p_room_code: roomCode.trim().toUpperCase(),
        p_real_name: name,
      })
      .single<{ id: string; display_name: string; join_number: number }>();

    if (error) {
      const msg = error.message ?? "";
      if (msg.includes("room_not_joinable")) {
        return {
          ok: false,
          error: "room_not_joinable",
          message: "Joining is closed. Reopen it to add someone.",
        };
      }
      if (msg.includes("room_at_capacity")) {
        return {
          ok: false,
          error: "room_full",
          message: "The room is at its participant limit.",
        };
      }
      // Should be unreachable once the cap is in place — see 0007.
      if (msg.includes("name_pool_exhausted")) {
        return {
          ok: false,
          error: "room_full",
          message: "No fun names are left to assign. The name pool needs topping up.",
        };
      }
      throw new Error(msg);
    }
    if (!data) throw new Error("join_room returned no row");

    return {
      ok: true,
      participant: {
        id: data.id,
        display_name: data.display_name,
        join_number: data.join_number,
      },
    };
  } catch (err) {
    console.error("addParticipant failed:", err);
    return {
      ok: false,
      error: "server_error",
      message: "Could not add them. Please try again.",
    };
  }
}
