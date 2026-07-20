import { notFound } from "next/navigation";
import { resolveBaseUrl } from "@/lib/baseUrl";
import { requireFacilitator } from "@/lib/facilitatorSession";
import { joinQrDataUrl } from "@/lib/qr";
import { mintRoomToken } from "@/lib/roomToken";
import { createServiceClient } from "@/lib/supabase/server";
import type { Draw, RoomStatus } from "@/lib/types";
import type { RosterParticipant } from "@/lib/useRoomRealtime";
import { ControlPanel } from "./ControlPanel";

export const dynamic = "force-dynamic";

/**
 * /facilitator/[roomId] — control panel.
 *
 * Server component: fetches the room + roster (this is the ONE surface that
 * reads `real_name`), the latest draw, the real join QR, and mints the scoped
 * room token for client Realtime.
 *
 * Authorization is defence-in-depth: the proxy matcher (`src/proxy.ts`) gates
 * the route, AND this page re-asserts the session before any query runs. The
 * roster below embeds real names in the RSC payload, so it must not depend on
 * a routing config alone. `notFound()` rather than a redirect so an
 * unauthenticated probe cannot distinguish a real room id from a fake one.
 */
export default async function FacilitatorRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const gate = await requireFacilitator();
  if (!gate.ok) notFound();

  const { roomId } = await params;
  const supabase = createServiceClient();

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, code, name, status, created_at, closed_at")
    .eq("id", roomId)
    .maybeSingle<{
        id: string;
        code: string;
        name: string | null;
        status: RoomStatus;
        created_at: string;
        closed_at: string | null;
      }>();
  if (roomError || !room) notFound();

  const [rosterRes, drawRes] = await Promise.all([
    supabase
      .from("participants")
      .select("id, room_id, display_name, join_number, real_name")
      .eq("room_id", roomId)
      .order("join_number")
      .returns<RosterParticipant[]>(),
    supabase
      .from("draws")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(1)
      .returns<Draw[]>(),
  ]);

  const roomToken = await mintRoomToken(roomId);
  const base = await resolveBaseUrl();
  const joinUrl = `${base}/join/${room.code}`;
  const qrDataUrl = await joinQrDataUrl(joinUrl);

  return (
    <ControlPanel
      roomId={room.id}
      createdAt={room.created_at}
      closedAt={room.closed_at}
      serverNow={new Date().toISOString()}
      roomToken={roomToken}
      code={room.code}
      roomName={room.name?.trim() || "Random Selector"}
      joinUrl={joinUrl}
      qrDataUrl={qrDataUrl}
      initialStatus={room.status}
      initialRoster={rosterRes.data ?? []}
      initialDraw={drawRes.data?.[0] ?? null}
    />
  );
}
