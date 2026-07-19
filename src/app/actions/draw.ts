"use server";

import { generateSeed, shuffle } from "@/lib/draw";
import { requireFacilitator } from "@/lib/facilitatorSession";
import { createServiceClient } from "@/lib/supabase/server";
import type { Draw, DrawSetEntry, RunDrawResult } from "@/lib/types";

/**
 * Run (or re-run) the selector for a room. Facilitator only.
 *
 * 1. `lock_room_for_draw` — atomically flips lobby -> drawing (locking out
 *    further joins) and returns the frozen participant set in join order.
 *    If the room is already `drawing`/`revealed` it leaves the status alone
 *    and returns the same locked set, which is exactly how REDRAW works:
 *    calling `runDraw` again shuffles the identical frozen group with a
 *    fresh seed.
 * 2. Fisher-Yates shuffle of the participant ids, seeded with a fresh
 *    crypto-random seed (persisted for audit/reproducibility).
 * 3. `record_draw` — atomically inserts the draws row AND sets the room to
 *    revealed with starter + seed, in one transaction.
 */
export async function runDraw(roomId: string): Promise<RunDrawResult> {
  const gate = await requireFacilitator();
  if (!gate.ok) return gate;

  try {
    const supabase = createServiceClient();

    // 1. Lock the room (or reuse the existing lock) and get the frozen set.
    const { data: drawSet, error: lockError } = await supabase.rpc(
      "lock_room_for_draw",
      { p_room_id: roomId }
    );

    if (lockError) {
      const msg = lockError.message ?? "";
      if (msg.includes("room_not_found")) {
        return {
          ok: false,
          error: "room_not_found",
          message: "That room does not exist.",
        };
      }
      if (msg.includes("room_closed")) {
        return {
          ok: false,
          error: "room_closed",
          message: "This room is closed — the draw can no longer run.",
        };
      }
      throw new Error(`lock_room_for_draw failed: ${msg}`);
    }

    const entries = (drawSet ?? []) as DrawSetEntry[];
    if (entries.length === 0) {
      return {
        ok: false,
        error: "no_participants",
        message: "No one has joined yet — wait for participants before drawing.",
      };
    }

    // 2. Server-side Fisher-Yates over the frozen ids, fresh seed each draw.
    const seed = generateSeed();
    const order = shuffle(
      entries.map((e) => e.participant_id),
      seed
    );
    const starter = order[0];

    // 3. Persist atomically: draws row + room revealed/starter/seed together.
    const { data: draw, error: recordError } = await supabase
      .rpc("record_draw", {
        p_room_id: roomId,
        p_order: order,
        p_starter: starter,
        p_seed: seed,
      })
      .single<Draw>();

    if (recordError) {
      throw new Error(`record_draw failed: ${recordError.message}`);
    }
    if (!draw) {
      throw new Error("record_draw returned no draws row");
    }

    return {
      ok: true,
      order,
      starterParticipantId: starter,
      seed,
      drawId: draw.id,
    };
  } catch (err) {
    console.error("runDraw failed:", err);
    return {
      ok: false,
      error: "server_error",
      message: "The draw could not be completed. Please try again.",
    };
  }
}
