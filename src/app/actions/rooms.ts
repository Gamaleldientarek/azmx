"use server";

import { resolveBaseUrl } from "@/lib/baseUrl";
import { generateUniqueRoomCode } from "@/lib/code";
import { requireFacilitator } from "@/lib/facilitatorSession";
import { createServiceClient } from "@/lib/supabase/server";
import type { CloseRoomResult, CreateRoomResult, Room } from "@/lib/types";

/**
 * Create a new room (facilitator only).
 *
 * Generates a collision-checked TUES-#### code, inserts the room in `lobby`
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
