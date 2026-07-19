import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startApp, type RunningApp } from "../helpers/appServer";
import { callServerAction, resolveActionIds } from "../helpers/serverActions";
import {
  createServiceClient,
  createTestRoom,
  deleteRoom,
} from "../helpers/liveSupabase";

/**
 * Duplicate-join guard (the "read cookies" fix): joinRoom sets a signed
 * httpOnly seat cookie per room; a repeat join FROM THE SAME BROWSER (cookie
 * jar) must return the SAME participant instead of inserting a new one.
 * A join without the cookie (a different phone) still creates a new person.
 */

const PORT = 3111;
const BASE = `http://localhost:${PORT}/random-selector`;

type JoinOk = {
  ok: true;
  participant: { id: string; display_name: string; join_number: number };
  roomId: string;
};

let app: RunningApp;
let actionIds: Record<string, string>;
let roomId: string;
let roomCode: string;

beforeAll(async () => {
  app = await startApp(PORT);
  actionIds = resolveActionIds();
  const room = await createTestRoom(createServiceClient(), "rejoin-guard");
  roomId = room.id;
  roomCode = room.code;
}, 120_000);

afterAll(async () => {
  if (roomId) await deleteRoom(createServiceClient(), roomId);
  await app?.stop();
});

describe("LIVE: duplicate-join guard (seat cookie)", () => {
  it("same browser rejoining gets the same identity; a new browser gets a new one", async () => {
    const joinUrl = `${BASE}/join/${roomCode}`;
    const joinId = actionIds["joinRoom"];
    expect(joinId).toBeTruthy();

    // First join — capture the seat cookie.
    const first = await callServerAction(joinUrl, joinId, [
      roomCode,
      "Cookie Tester",
    ]);
    const firstResult = first.result as JoinOk;
    expect(firstResult.ok).toBe(true);
    const setCookie = first.response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("st_p_");
    const seatCookie = setCookie.split(";")[0];

    // Rejoin WITH the cookie (same phone, tapped the link again).
    const again = await callServerAction(
      joinUrl,
      joinId,
      [roomCode, "Cookie Tester Again"],
      { cookie: seatCookie }
    );
    const againResult = again.result as JoinOk;
    expect(againResult.ok).toBe(true);
    expect(againResult.participant.id).toBe(firstResult.participant.id);
    expect(againResult.participant.display_name).toBe(
      firstResult.participant.display_name
    );
    expect(againResult.participant.join_number).toBe(
      firstResult.participant.join_number
    );

    // Join WITHOUT the cookie (a different phone) — genuinely new person.
    const other = await callServerAction(joinUrl, joinId, [
      roomCode,
      "Second Phone",
    ]);
    const otherResult = other.result as JoinOk;
    expect(otherResult.ok).toBe(true);
    expect(otherResult.participant.id).not.toBe(firstResult.participant.id);
    expect(otherResult.participant.join_number).toBe(
      firstResult.participant.join_number + 1
    );

    // DB ground truth: exactly two participants in the room.
    const { data } = await createServiceClient()
      .from("participants")
      .select("id")
      .eq("room_id", roomId);
    expect(data?.length).toBe(2);
  }, 60_000);
});
