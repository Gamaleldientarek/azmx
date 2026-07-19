"use client";

import { useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createRoomClient } from "@/lib/supabase/client";
import type { Draw, RoomStatus } from "@/lib/types";

/**
 * Shared client hook: live room state over Supabase Realtime, scoped by the
 * per-room JWT (RLS Option A).
 *
 * - Reads ONLY safe participant columns (never `real_name` — column-blocked
 *   server-side anyway).
 * - Subscribes to postgres_changes on the BASE tables `public.participants`
 *   (INSERT), `public.rooms` (UPDATE) and `public.draws` (INSERT), filtered
 *   by room. The client factory calls `.realtime.setAuth(roomToken)` so RLS
 *   applies to change events exactly as it does to reads.
 * - Refetches on SUBSCRIBED to close the gap between the initial fetch and
 *   the subscription start (and after reconnects).
 * - LIVE-VERIFIED CAVEAT: Supabase Realtime silently drops change events for
 *   tables where the subscriber's role holds only column-level SELECT grants
 *   — which is exactly how `participants.real_name` is protected. `rooms`
 *   and `draws` events arrive fine; `participants` INSERTs do not. The
 *   subscription stays (harmless, self-healing if Supabase changes), and a
 *   light roster poll runs ONLY while status is `lobby` — the sole phase in
 *   which the roster can change (`lock_room_for_draw` freezes it).
 * - Never shuffles: `latestDraw.order` is the server-side Fisher-Yates
 *   result, verbatim.
 */

/** Safe participant columns clients may read. */
export interface RosterParticipant {
  id: string;
  room_id: string;
  display_name: string;
  join_number: number;
  /** Present only on facilitator surfaces (server-fetched); realtime
   *  updates arrive sanitized and never carry it. */
  real_name?: string | null;
}

const ROSTER_COLUMNS = "id, room_id, display_name, join_number";

export interface UseRoomRealtimeOptions {
  roomId: string;
  /** Scoped room JWT; pass null to stay idle (e.g. while storage loads). */
  roomToken: string | null;
  initialStatus?: RoomStatus | null;
  initialRoster?: RosterParticipant[];
  initialDraw?: Draw | null;
}

export interface RoomRealtimeState {
  status: RoomStatus | null;
  roster: RosterParticipant[];
  latestDraw: Draw | null;
  /** True once initial data exists (given as props or fetched). */
  ready: boolean;
  /** True when reads are rejected — the scoped token is invalid/expired. */
  authError: boolean;
  /** Room display name, fetched with the scoped client (null until loaded). */
  roomName: string | null;
}

function isAuthError(
  error: { code?: string; message?: string } | null
): boolean {
  if (!error) return false;
  return (
    error.code === "PGRST301" || /jwt|token|authoriz/i.test(error.message ?? "")
  );
}

function sortRoster(list: RosterParticipant[]): RosterParticipant[] {
  return [...list].sort((a, b) => a.join_number - b.join_number);
}

export function useRoomRealtime({
  roomId,
  roomToken,
  initialStatus = null,
  initialRoster,
  initialDraw = null,
}: UseRoomRealtimeOptions): RoomRealtimeState {
  const [status, setStatus] = useState<RoomStatus | null>(initialStatus);
  const [roster, setRoster] = useState<RosterParticipant[]>(
    initialRoster ?? []
  );
  const [latestDraw, setLatestDraw] = useState<Draw | null>(initialDraw);
  const [ready, setReady] = useState(initialStatus !== null);
  const [authError, setAuthError] = useState(false);
  const [roomName, setRoomName] = useState<string | null>(null);

  // Shared between the subscription effect and the lobby poll effect.
  const clientRef = useRef<SupabaseClient | null>(null);

  useEffect(() => {
    if (!roomToken) return;

    const client = createRoomClient(roomToken);
    clientRef.current = client;
    let cancelled = false;

    const refetch = async () => {
      const [roomRes, rosterRes, drawRes] = await Promise.all([
        client
          .from("rooms")
          .select("status, name")
          .eq("id", roomId)
          .maybeSingle<{ status: RoomStatus; name: string | null }>(),
        client
          .from("participants")
          .select(ROSTER_COLUMNS)
          .eq("room_id", roomId)
          .order("join_number")
          .returns<RosterParticipant[]>(),
        client
          .from("draws")
          .select("*")
          .eq("room_id", roomId)
          .order("created_at", { ascending: false })
          .limit(1)
          .returns<Draw[]>(),
      ]);
      if (cancelled) return;

      if (roomRes.error || rosterRes.error || drawRes.error) {
        if (
          isAuthError(roomRes.error) ||
          isAuthError(rosterRes.error) ||
          isAuthError(drawRes.error)
        ) {
          setAuthError(true);
        }
        return;
      }

      if (roomRes.data) {
        setStatus(roomRes.data.status);
        setRoomName(roomRes.data.name ?? null);
      }
      setRoster(sortRoster(rosterRes.data ?? []));
      const draw = drawRes.data?.[0] ?? null;
      if (draw) {
        // Keep referential identity for an unchanged draw so consumers keyed
        // by draw id don't re-run the reveal on refetch.
        setLatestDraw((prev) => (prev && prev.id === draw.id ? prev : draw));
      }
      setReady(true);
    };

    const channel = client
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "participants",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const row = payload.new as Partial<RosterParticipant> | null;
          if (
            row &&
            typeof row.id === "string" &&
            typeof row.display_name === "string" &&
            typeof row.join_number === "number"
          ) {
            const participant = row as RosterParticipant;
            setRoster((prev) =>
              prev.some((p) => p.id === participant.id)
                ? prev
                : sortRoster([...prev, participant])
            );
          } else {
            // Payload sanitized/partial — fall back to a safe refetch.
            void refetch();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const row = payload.new as Partial<{ status: RoomStatus }> | null;
          if (row?.status) setStatus(row.status);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "draws",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const row = payload.new as Partial<Draw> | null;
          if (row && typeof row.id === "string" && Array.isArray(row.order)) {
            setLatestDraw(row as Draw);
            // The reveal maps order ids -> roster entries; make sure the
            // roster is complete (the lobby poll may lag the final joins).
            void refetch();
          } else {
            void refetch();
          }
        }
      )
      .subscribe((subscriptionStatus) => {
        // Close the initial-fetch/subscription gap, and re-sync after any
        // reconnect (supabase-js resubscribes automatically).
        if (subscriptionStatus === "SUBSCRIBED") void refetch();
      });

    void refetch();

    return () => {
      cancelled = true;
      clientRef.current = null;
      void client.removeChannel(channel);
      client.realtime.disconnect();
    };
  }, [roomId, roomToken]);

  // Lobby roster poll — see the caveat in the header comment. Stops the
  // moment the room locks (status leaves `lobby`).
  useEffect(() => {
    if (!roomToken || status !== "lobby") return;

    const intervalId = window.setInterval(() => {
      const client = clientRef.current;
      if (!client) return;
      void client
        .from("participants")
        .select(ROSTER_COLUMNS)
        .eq("room_id", roomId)
        .order("join_number")
        .returns<RosterParticipant[]>()
        .then(({ data, error }) => {
          if (error) {
            if (isAuthError(error)) setAuthError(true);
            return;
          }
          if (data) {
            setRoster((prev) =>
              prev.length === data.length ? prev : sortRoster(data)
            );
          }
        });
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [roomId, roomToken, status]);

  return { status, roster, latestDraw, ready, authError, roomName };
}
