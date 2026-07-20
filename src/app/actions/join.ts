"use server";

import { mintRoomToken } from "@/lib/roomToken";
import {
  clearParticipantCookie,
  readParticipantCookie,
  setParticipantCookie,
} from "@/lib/participantCookie";
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

    // Duplicate-join guard: if this browser already holds a signed seat
    // cookie for this room, hand back the SAME identity (fresh token) instead
    // of inserting a new participant. Works even after the draw locked the
    // room, so people can always recover their seat while it's open.
    const { data: roomRow } = await supabase
      .from("rooms")
      .select("id, status")
      .eq("code", trimmedCode)
      .maybeSingle<{ id: string; status: string }>();

    if (roomRow && roomRow.status !== "closed") {
      const existingId = await readParticipantCookie(roomRow.id);
      if (existingId) {
        const { data: existing } = await supabase
          .from("participants")
          .select("id, room_id, display_name, join_number, real_name")
          .eq("id", existingId)
          .eq("room_id", roomRow.id)
          .maybeSingle<Participant>();
        if (existing) {
          const roomToken = await mintRoomToken(existing.room_id);
          return {
            ok: true,
            participant: {
              id: existing.id,
              display_name: existing.display_name,
              join_number: existing.join_number,
              real_name: existing.real_name ?? trimmedName,
            },
            roomId: existing.room_id,
            roomToken,
          };
        }
        // Cookie points at a purged/removed participant — fall through to a
        // normal join.
      }
    }

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
    await setParticipantCookie(data.room_id, data.id);

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

export type RecoverSeatResult =
  | {
      ok: true;
      participant: {
        id: string;
        display_name: string;
        join_number: number;
      };
      roomId: string;
      roomCode: string;
      roomToken: string;
    }
  /** No cookie, or a confirmed-missing participant row — show the form. */
  | { ok: false; error: "no_seat" }
  /** Infrastructure failed; state is UNKNOWN — offer retry, never a wall. */
  | { ok: false; error: "unavailable" };

/**
 * Recover an existing seat from the signed per-room cookie — no name entry.
 * Lets a participant who lost sessionStorage (new tab, restart) get back to
 * their identity even after the draw locked the room. Closed rooms never
 * recover (names are purged).
 *
 * Deliberately does NOT return `real_name`: on a shared phone the cookie
 * belongs to the browser, not the person, so echoing the previous joiner's
 * real name would leak it to whoever holds the device next.
 */
export async function recoverSeat(roomId: string): Promise<RecoverSeatResult> {
  let participantId: string | null;
  try {
    participantId = await readParticipantCookie(roomId);
  } catch (err) {
    console.error("recoverSeat: cookie read failed:", err);
    return { ok: false, error: "unavailable" };
  }
  if (!participantId) return { ok: false, error: "no_seat" };

  let room: { id: string; code: string; status: string } | null;
  let participant: Participant | null;
  try {
    const supabase = createServiceClient();
    const [roomRes, participantRes] = await Promise.all([
      supabase
        .from("rooms")
        .select("id, code, status")
        .eq("id", roomId)
        .maybeSingle<{ id: string; code: string; status: string }>(),
      supabase
        .from("participants")
        .select("id, room_id, display_name, join_number")
        .eq("id", participantId)
        .eq("room_id", roomId)
        .maybeSingle<Participant>(),
    ]);
    // A query ERROR means we do not know the state — never claim "no seat".
    if (roomRes.error || participantRes.error) {
      console.error(
        "recoverSeat: query failed:",
        roomRes.error?.message ?? participantRes.error?.message
      );
      return { ok: false, error: "unavailable" };
    }
    room = roomRes.data;
    participant = participantRes.data;
  } catch (err) {
    console.error("recoverSeat: infrastructure failure:", err);
    return { ok: false, error: "unavailable" };
  }

  // Confirmed absences (row genuinely gone / room ended) → seat is really gone.
  if (!room) return { ok: false, error: "unavailable" };
  if (room.status === "closed" || !participant) {
    return { ok: false, error: "no_seat" };
  }

  try {
    const roomToken = await mintRoomToken(roomId);
    // Slide the 12h cookie forward so an active participant is never locked
    // out mid-session by an expiry that started at first join.
    await setParticipantCookie(roomId, participant.id);
    return {
      ok: true,
      participant: {
        id: participant.id,
        display_name: participant.display_name,
        join_number: participant.join_number,
      },
      roomId,
      roomCode: room.code,
      roomToken,
    };
  } catch (err) {
    console.error("recoverSeat: token/cookie failed:", err);
    return { ok: false, error: "unavailable" };
  }
}

/**
 * Release this browser's seat — the "Not you?" exit on a shared phone.
 * Clears the seat cookie so the next person gets a fresh name form.
 */
export async function releaseSeat(
  roomId: string
): Promise<{ ok: true } | { ok: false }> {
  try {
    await clearParticipantCookie(roomId);
    return { ok: true };
  } catch (err) {
    console.error("releaseSeat failed:", err);
    return { ok: false };
  }
}
