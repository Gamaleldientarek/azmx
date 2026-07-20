/**
 * LIVE end-to-end session flow against the BUILT app (`next start`, basePath
 * /random-selector) and the live Supabase project.
 *
 * The whole facilitator/participant journey over real HTTP:
 *
 *  1. Facilitator login — progressive-enhancement form POST (the no-JS MPA
 *     path): wrong password rejected, right password sets the session cookie.
 *  2. Create room — the `createRoom` server action over HTTP (Next-Action
 *     protocol, exactly what the browser's callServer sends), cookie-authed;
 *     also asserts the action is refused without the cookie.
 *  3. Three participants join via the `joinRoom` server action over HTTP
 *     (the join page's real submit path) — fun names assigned, join numbers
 *     1..3, and the join page itself renders.
 *  4. Run draw via the `runDraw` server action over HTTP: order is a
 *     permutation of the 3 participants, starter is order[0], the persisted
 *     seed reproduces the order through src/lib/draw's shuffle (audit trail),
 *     and the projection page SSRs all 3 fun names with the starter first.
 *  5. Redraw: always the same multiset; virtually always a different order.
 *  6. Close room: real names purged (real_name IS NULL for every
 *     participant, verified via service role), screen shows the closed state.
 *  7. Cleanup: delete the test room, sweep stragglers, assert the live DB
 *     holds zero autotest rooms.
 *
 * Requires `next build` first — `npm run test:live` handles that. Skips
 * gracefully when the live env is missing.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { shuffle } from "@/lib/draw";
import { hasLiveEnv } from "../helpers/liveEnv";
import {
  AUTOTEST_MARKER,
  countAutotestRooms,
  createServiceClient,
  deleteRoom,
  sweepAutotestRooms,
} from "../helpers/liveSupabase";
import { startApp, type RunningApp } from "../helpers/appServer";
import { cookieFromResponse, submitActionForm } from "../helpers/actionForm";
import { callServerAction, resolveActionIds } from "../helpers/serverActions";

const LIVE = hasLiveEnv();
const PORT = 4573;

interface ActionOk {
  ok: boolean;
  [key: string]: unknown;
}

describe.skipIf(!LIVE)("LIVE: full session flow over HTTP", () => {
  let app: RunningApp;
  let supabase: SupabaseClient;
  let actionIds: Record<string, string>;
  let facilitatorCookie: string;
  let roomId: string;
  let roomCode: string;
  const participants: Array<{
    id: string;
    display_name: string;
    join_number: number;
    real_name: string;
  }> = [];
  let firstOrder: string[] = [];

  beforeAll(async () => {
    supabase = createServiceClient();
    actionIds = resolveActionIds();
    app = await startApp(PORT);
  });

  afterAll(async () => {
    if (supabase) {
      if (roomId) await deleteRoom(supabase, roomId);
      await sweepAutotestRooms(supabase);
      expect(await countAutotestRooms(supabase)).toBe(0);
    }
    if (app) await app.stop();
  });

  /* ---- 1. Facilitator login (no-JS progressive-enhancement POST) ------- */

  it("unauthenticated /facilitator redirects to the login gate", async () => {
    const res = await fetch(`${app.baseUrl}/facilitator`, {
      redirect: "manual",
    });
    expect([302, 303, 307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toContain("/facilitator/login");
  });

  it("rejects a wrong password without setting a session cookie", async () => {
    const { response } = await submitActionForm(
      `${app.baseUrl}/facilitator/login`,
      { password: "definitely-not-the-password" }
    );
    expect(response.status).toBe(200); // re-rendered form, no redirect
    const html = await response.text();
    expect(html).toContain("That password is not correct");
    expect(cookieFromResponse(response, "st_facilitator")).toBeNull();
  });

  it("logs in with FACILITATOR_PASSWORD and receives the session cookie", async () => {
    const { response } = await submitActionForm(
      `${app.baseUrl}/facilitator/login`,
      { password: process.env.TEST_FACILITATOR_PASSWORD! }
    );
    expect(response.status).toBe(303); // redirect(…) after success
    expect(response.headers.get("location")).toMatch(/\/facilitator$/);
    const cookie = cookieFromResponse(response, "st_facilitator");
    expect(cookie).toBeTruthy();
    facilitatorCookie = `st_facilitator=${cookie}`;

    // The cookie really opens the gate.
    const gated = await fetch(`${app.baseUrl}/facilitator`, {
      redirect: "manual",
      headers: { cookie: facilitatorCookie },
    });
    expect(gated.status).toBe(200);
  });

  /* ---- 2. Create room -------------------------------------------------- */

  it("refuses createRoom without a facilitator session", async () => {
    const { status, result } = await callServerAction(
      `${app.baseUrl}/facilitator`,
      actionIds.createRoom,
      [`${AUTOTEST_MARKER} should-not-exist`]
    );
    // The proxy bounces the cookieless POST before the action runs; if it
    // ever reached the action, requireFacilitator would return unauthorized.
    const r = result as ActionOk | undefined;
    const refused =
      (status >= 300 && status < 400) || (r !== undefined && r.ok === false);
    expect(refused).toBe(true);
  });

  it("creates a room via the createRoom server action over HTTP", async () => {
    const { status, result } = await callServerAction(
      `${app.baseUrl}/facilitator`,
      actionIds.createRoom,
      [`${AUTOTEST_MARKER} session-flow`],
      { cookie: facilitatorCookie }
    );
    expect(status).toBe(200);
    const r = result as {
      ok: true;
      room: { id: string; code: string; joinUrl: string };
    };
    expect(r.ok).toBe(true);
    expect(r.room.code).toMatch(/^ROOM-\d{4}$/);
    expect(r.room.joinUrl).toContain(`/join/${r.room.code}`);
    roomId = r.room.id;
    roomCode = r.room.code;

    const { data: room } = await supabase
      .from("rooms")
      .select("status, name")
      .eq("id", roomId)
      .single<{ status: string; name: string }>();
    expect(room?.status).toBe("lobby");
    expect(room?.name).toContain(AUTOTEST_MARKER);
  });

  /* ---- 3. Three participants join over HTTP ---------------------------- */

  it("renders the join page for the room code", async () => {
    const res = await fetch(`${app.baseUrl}/join/${roomCode}`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain(roomCode);
    expect(html).toContain("Your real name");
  });

  it("three participants join via the joinRoom action (HTTP), numbers 1..3", async () => {
    const realNames = ["Amina Flow", "Basim Flow", "Carmen Flow"];
    for (const realName of realNames) {
      const { status, result } = await callServerAction(
        `${app.baseUrl}/join/${roomCode}`,
        actionIds.joinRoom,
        [roomCode, realName]
      );
      expect(status).toBe(200);
      const r = result as {
        ok: true;
        participant: { id: string; display_name: string; join_number: number };
        roomId: string;
        roomToken: string;
      };
      expect(r.ok, `join failed for ${realName}: ${JSON.stringify(r)}`).toBe(
        true
      );
      expect(r.roomId).toBe(roomId);
      expect(r.roomToken).toBeTruthy(); // the scoped RLS/Realtime JWT
      participants.push({ ...r.participant, real_name: realName });
    }

    expect(participants.map((p) => p.join_number)).toEqual([1, 2, 3]);
    expect(new Set(participants.map((p) => p.display_name)).size).toBe(3);

    // DB agrees: real names stored server-side, roster is exactly these 3.
    const { data } = await supabase
      .from("participants")
      .select("id, real_name, display_name, join_number")
      .eq("room_id", roomId)
      .order("join_number");
    expect(data).toHaveLength(3);
    expect(data!.map((p) => p.real_name)).toEqual(realNames);
  });

  it("the projection (screen) page SSRs the lobby roster — fun names only", async () => {
    const res = await fetch(`${app.baseUrl}/screen/${roomId}`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain(roomCode);
    for (const p of participants) {
      expect(html).toContain(p.display_name);
      expect(html).not.toContain(p.real_name); // privacy: never on screen
    }
  });

  /* ---- 4. Run the draw ------------------------------------------------- */

  it("runs the draw via the runDraw action: permutation, starter = order[0], seed reproducible", async () => {
    const { status, result } = await callServerAction(
      `${app.baseUrl}/facilitator/${roomId}`,
      actionIds.runDraw,
      [roomId],
      { cookie: facilitatorCookie }
    );
    expect(status).toBe(200);
    const r = result as {
      ok: true;
      order: string[];
      starterParticipantId: string;
      seed: string;
      drawId: string;
    };
    expect(r.ok, `runDraw failed: ${JSON.stringify(r)}`).toBe(true);

    // A true permutation of exactly our 3 participants.
    const ids = participants.map((p) => p.id);
    expect([...r.order].sort()).toEqual([...ids].sort());
    // Starter is order[0].
    expect(r.starterParticipantId).toBe(r.order[0]);

    // Audit trail: replaying the persisted seed through the app's shuffle
    // over the join-ordered ids reproduces the recorded order exactly.
    expect(shuffle(ids, r.seed)).toEqual(r.order);

    // DB state: room revealed, starter + seed persisted, draws row matches.
    const { data: room } = await supabase
      .from("rooms")
      .select("status, starter_participant_id, draw_seed")
      .eq("id", roomId)
      .single<{
        status: string;
        starter_participant_id: string;
        draw_seed: string;
      }>();
    expect(room?.status).toBe("revealed");
    expect(room?.starter_participant_id).toBe(r.order[0]);
    expect(room?.draw_seed).toBe(r.seed);

    const { data: draw } = await supabase
      .from("draws")
      .select("order, starter_participant_id, seed")
      .eq("id", r.drawId)
      .single<{ order: string[]; starter_participant_id: string; seed: string }>();
    expect(draw?.order).toEqual(r.order);
    expect(draw?.starter_participant_id).toBe(r.order[0]);

    firstOrder = r.order;
  });

  it("joining after the draw is locked is rejected over HTTP", async () => {
    const { result } = await callServerAction(
      `${app.baseUrl}/join/${roomCode}`,
      actionIds.joinRoom,
      [roomCode, "Latecomer Flow"]
    );
    const r = result as ActionOk;
    expect(r.ok).toBe(false);
    expect(r.error).toBe("room_not_joinable");

    const { count } = await supabase
      .from("participants")
      .select("id", { count: "exact", head: true })
      .eq("room_id", roomId);
    expect(count).toBe(3);
  });

  it("the screen page shows the revealed order: all 3 names, starter first", async () => {
    const res = await fetch(`${app.baseUrl}/screen/${roomId}`);
    expect(res.status).toBe(200);
    const html = await res.text();

    const byId = new Map(participants.map((p) => [p.id, p]));
    for (const p of participants) expect(html).toContain(p.display_name);

    // The settled reveal announces the starter — and it is order[0].
    const starterName = byId.get(firstOrder[0])!.display_name;
    expect(html).toContain("The order is set");
    expect(html).toContain(`${starterName} goes first`);
    for (const p of participants) expect(html).not.toContain(p.real_name);
  });

  /* ---- 5. Redraw ------------------------------------------------------- */

  it("redraw keeps the same multiset and (virtually always) changes the order", async () => {
    const ids = participants.map((p) => p.id);
    let sawDifferentOrder = false;

    // P(all 5 redraws identical to the first order) = (1/6)^5 ≈ 1.3e-4.
    for (let i = 0; i < 5; i++) {
      const { result } = await callServerAction(
        `${app.baseUrl}/facilitator/${roomId}`,
        actionIds.runDraw,
        [roomId],
        { cookie: facilitatorCookie }
      );
      const r = result as { ok: true; order: string[]; seed: string };
      expect(r.ok).toBe(true);
      // ALWAYS the same multiset — nobody appears or disappears on redraw.
      expect([...r.order].sort()).toEqual([...ids].sort());
      expect(shuffle(ids, r.seed)).toEqual(r.order);
      if (r.order.join(",") !== firstOrder.join(",")) sawDifferentOrder = true;
    }
    expect(sawDifferentOrder).toBe(true);

    // Every draw is kept (audit history): 1 first draw + 5 redraws.
    const { count } = await supabase
      .from("draws")
      .select("id", { count: "exact", head: true })
      .eq("room_id", roomId);
    expect(count).toBe(6);
  });

  /* ---- 6. Close room: privacy purge ------------------------------------ */

  it("closeRoom purges every real name (real_name IS NULL, service-role verified)", async () => {
    const { result } = await callServerAction(
      `${app.baseUrl}/facilitator/${roomId}`,
      actionIds.closeRoom,
      [roomId],
      { cookie: facilitatorCookie }
    );
    expect((result as ActionOk).ok).toBe(true);

    const { data: room } = await supabase
      .from("rooms")
      .select("status, closed_at")
      .eq("id", roomId)
      .single<{ status: string; closed_at: string | null }>();
    expect(room?.status).toBe("closed");
    expect(room?.closed_at).not.toBeNull();

    // THE privacy assertion: no real name survives a closed room.
    const { data: rows } = await supabase
      .from("participants")
      .select("real_name")
      .eq("room_id", roomId);
    expect(rows).toHaveLength(3);
    for (const row of rows!) expect(row.real_name).toBeNull();

    // And the projection shows the quiet end state.
    const res = await fetch(`${app.baseUrl}/screen/${roomId}`);
    const html = await res.text();
    expect(html).toContain("This room has closed");
  });

  it("a closed room refuses further draws", async () => {
    const { result } = await callServerAction(
      `${app.baseUrl}/facilitator/${roomId}`,
      actionIds.runDraw,
      [roomId],
      { cookie: facilitatorCookie }
    );
    const r = result as ActionOk;
    expect(r.ok).toBe(false);
    expect(r.error).toBe("room_closed");
  });
});

describe.skipIf(LIVE)("LIVE session flow (skipped)", () => {
  it("skipped — live Supabase env not configured in .env.local", () => {
    expect(LIVE).toBe(false);
  });
});
