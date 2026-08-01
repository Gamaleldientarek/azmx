/**
 * LIVE concurrency stampede test — the critical correctness check for the
 * `join_room` RPC's room-row-lock serialization.
 *
 * Against the live Supabase project (service-role key from .env.local):
 *
 *  1. Create a fresh lobby room.
 *  2. Fire 50 SIMULTANEOUS join_room RPC calls at it. The curated name pool
 *     has exactly 40 names, so the contract is:
 *       - exactly 40 joins succeed,
 *       - exactly 10 fail with a clean name_pool_exhausted error,
 *       - the successes hold join_numbers 1..40 contiguous (no gaps/dupes),
 *       - all 40 display_names are unique and drawn from the pool.
 *  3. lock_room_for_draw, then fire concurrent late-join attempts — every
 *     one must be rejected with room_not_joinable.
 *  4. Clean up: delete the test room (cascade) and verify nothing is left.
 *
 * Skips gracefully (describe.skipIf) when the live env is not configured.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { hasLiveEnv } from "../helpers/liveEnv";
import {
  countAutotestRooms,
  createServiceClient,
  createTestRoom,
  deleteRoom,
  sweepAutotestRooms,
} from "../helpers/liveSupabase";

const LIVE = hasLiveEnv();

interface ParticipantRow {
  id: string;
  room_id: string;
  real_name: string | null;
  display_name: string;
  join_number: number;
}

interface JoinOutcome {
  index: number;
  ok: boolean;
  participant?: ParticipantRow;
  errorMessage?: string;
}

/** One join_room RPC call, resolved (never rejected) into a typed outcome. */
async function attemptJoin(
  supabase: SupabaseClient,
  code: string,
  index: number
): Promise<JoinOutcome> {
  try {
    const { data, error } = await supabase
      .rpc("join_room", {
        p_room_code: code,
        p_real_name: `Stampede Tester ${index}`,
      })
      .single<ParticipantRow>();
    if (error) return { index, ok: false, errorMessage: error.message ?? "" };
    if (!data) return { index, ok: false, errorMessage: "no row returned" };
    return { index, ok: true, participant: data };
  } catch (err) {
    return { index, ok: false, errorMessage: String(err) };
  }
}

describe.skipIf(!LIVE)("LIVE: join_room stampede (50 concurrent joins)", () => {
  let supabase: SupabaseClient;
  let roomId: string;
  let roomCode: string;
  let outcomes: JoinOutcome[] = [];
  let poolSize = 0;

  beforeAll(async () => {
    supabase = createServiceClient();

    // The contract below assumes the seeded pool of 40 fun names.
    const { count, error } = await supabase
      .from("name_pool")
      .select("display_name", { count: "exact", head: true });
    if (error) throw new Error(`name_pool count failed: ${error.message}`);
    poolSize = count ?? 0;

    const room = await createTestRoom(supabase, "stampede");
    roomId = room.id;
    roomCode = room.code;

    // THE STAMPEDE: 50 truly simultaneous RPC calls at one room.
    outcomes = await Promise.all(
      Array.from({ length: 50 }, (_, i) => attemptJoin(supabase, roomCode, i))
    );
  });

  afterAll(async () => {
    if (!supabase) return;
    if (roomId) await deleteRoom(supabase, roomId);
    // Belt and braces: sweep any marked leftovers (e.g. from a crashed run),
    // then assert the live DB carries zero autotest rooms.
    await sweepAutotestRooms(supabase);
    expect(await countAutotestRooms(supabase)).toBe(0);
  });

  it("the name pool holds exactly 40 names (test contract precondition)", () => {
    expect(poolSize).toBe(40);
  });

  it("exactly 40 of 50 concurrent joins succeed", () => {
    const successes = outcomes.filter((o) => o.ok);
    expect(successes).toHaveLength(40);
  });

  it("exactly 10 joins fail, all with the clean pool-exhausted error", () => {
    const failures = outcomes.filter((o) => !o.ok);
    expect(failures).toHaveLength(10);
    for (const f of failures) {
      expect(
        f.errorMessage,
        `join #${f.index} failed with an unexpected error: ${f.errorMessage}`
      ).toContain("name_pool_exhausted");
    }
  });

  it("successful join_numbers are contiguous 1..40 with zero gaps or dupes", () => {
    const numbers = outcomes
      .filter((o) => o.ok)
      .map((o) => o.participant!.join_number)
      .sort((a, b) => a - b);
    expect(numbers).toEqual(Array.from({ length: 40 }, (_, i) => i + 1));
  });

  it("all 40 display_names are unique and come from the curated pool", async () => {
    const names = outcomes
      .filter((o) => o.ok)
      .map((o) => o.participant!.display_name);
    expect(new Set(names).size).toBe(40);

    const { data, error } = await supabase
      .from("name_pool")
      .select("display_name");
    if (error) throw new Error(error.message);
    const pool = new Set((data ?? []).map((r) => r.display_name));
    for (const n of names) {
      expect(pool.has(n), `display_name "${n}" is not in name_pool`).toBe(true);
    }
  });

  it("the committed roster in the DB matches the RPC responses exactly", async () => {
    const { data, error } = await supabase
      .from("participants")
      .select("id, display_name, join_number, real_name")
      .eq("room_id", roomId)
      .order("join_number");
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    expect(rows).toHaveLength(40);
    expect(rows.map((r) => r.join_number)).toEqual(
      Array.from({ length: 40 }, (_, i) => i + 1)
    );
    expect(new Set(rows.map((r) => r.display_name)).size).toBe(40);

    const returnedIds = new Set(
      outcomes.filter((o) => o.ok).map((o) => o.participant!.id)
    );
    for (const row of rows) {
      expect(returnedIds.has(row.id)).toBe(true);
      expect(row.real_name).toMatch(/^Stampede Tester \d+$/);
    }
  });

  it("after lock_room_for_draw, concurrent late joins are all rejected", async () => {
    const { data: drawSet, error } = await supabase.rpc("lock_room_for_draw", {
      p_room_id: roomId,
    });
    if (error) throw new Error(`lock_room_for_draw failed: ${error.message}`);
    expect(drawSet).toHaveLength(40); // the frozen set is the full roster

    const { data: room } = await supabase
      .from("rooms")
      .select("status")
      .eq("id", roomId)
      .single<{ status: string }>();
    expect(room?.status).toBe("drawing");

    // Concurrent late-join stampede against the locked room.
    const late = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        attemptJoin(supabase, roomCode, 1000 + i)
      )
    );
    for (const o of late) {
      expect(o.ok, `late join #${o.index} unexpectedly succeeded`).toBe(false);
      expect(o.errorMessage).toContain("room_not_joinable");
    }

    // And the roster did not grow.
    const { count } = await supabase
      .from("participants")
      .select("id", { count: "exact", head: true })
      .eq("room_id", roomId);
    expect(count).toBe(40);
  });
});

describe.skipIf(LIVE)("LIVE suite (skipped)", () => {
  it("skipped — live Supabase env not configured in .env.local", () => {
    expect(LIVE).toBe(false);
  });
});
