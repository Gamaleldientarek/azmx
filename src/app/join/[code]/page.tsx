import Link from "next/link";
import {
  AzmxLogo,
  Button,
  Chevron,
  Eyebrow,
  Hairline,
  ThemeToggle,
} from "@/components/brand";
import { redirect } from "next/navigation";
import { readParticipantCookie } from "@/lib/participantCookie";
import { createServiceClient } from "@/lib/supabase/server";
import type { RoomStatus } from "@/lib/types";
import { JoinForm } from "./JoinForm";

export const dynamic = "force-dynamic";

/**
 * /join/[code] — participant enters their REAL name. Phone-first, one-handed.
 * Server component: looks the room up by code (service role, safe fields
 * only) so unknown / locked / closed rooms get a friendly state instead of a
 * dead form. The form itself posts to the `joinRoom` server action.
 */
export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const roomCode = decodeURIComponent(code ?? "").trim().toUpperCase();

  let room: { id: string; name: string | null; status: RoomStatus } | null =
    null;
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("rooms")
      .select("id, name, status")
      .eq("code", roomCode)
      .maybeSingle<{ id: string; name: string | null; status: RoomStatus }>();
    room = data;
  } catch (err) {
    console.error("join page room lookup failed:", err);
  }

  // Already seated on this phone (signed seat cookie)? Straight back to the
  // room — the room page recovers the identity itself. Covers the locked
  // "draw has started" state too, so returning participants never hit the
  // blocked wall.
  //
  // The cookie alone is NOT enough: redirecting on an unverified cookie
  // bounces the user between /join and /room when the row is gone or the DB
  // hiccups. Confirm the participant row first, and on ANY uncertainty fall
  // through to the form. `redirect()` stays outside the try — it throws a
  // control-flow signal a catch would swallow.
  let seatedRoomId: string | null = null;
  if (room && room.status !== "closed") {
    try {
      const seatedId = await readParticipantCookie(room.id);
      if (seatedId) {
        const supabase = createServiceClient();
        const { data: seat, error } = await supabase
          .from("participants")
          .select("id")
          .eq("id", seatedId)
          .eq("room_id", room.id)
          .maybeSingle<{ id: string }>();
        if (!error && seat) seatedRoomId = room.id;
      }
    } catch (err) {
      console.error("join page seat verification failed:", err);
      // Unknown state → show the form rather than risk a redirect loop.
    }
  }
  if (seatedRoomId) redirect(`/room/${seatedRoomId}`);

  const roomName = room?.name?.trim() || "Random Selector";

  let blockedTitle: string | null = null;
  let blockedBody: string | null = null;
  if (!room) {
    blockedTitle = "We can’t find that room";
    blockedBody =
      "Check the code on the screen and try again.";
  } else if (room.status === "closed") {
    blockedTitle = "This room has ended";
    blockedBody = "This session has wrapped. Ask the host for the new room.";
  } else if (room.status === "locked") {
    blockedTitle = "Joining is closed right now";
    blockedBody =
      "The host has paused joining for a moment. Ask them to reopen it.";
  } else if (room.status !== "lobby") {
    blockedTitle = "The draw has started";
    blockedBody =
      "Joining is closed for this round. Watch the screen for the order.";
  }

  return (
    <main className="surface-white flex min-h-svh flex-col px-6 py-9 sm:px-10">
      {/* Header: which room you're joining. Top-weighted. */}
      <header>
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center">
            <span className="inline-flex dark:hidden">
              <AzmxLogo variant="color" height={24} />
            </span>
            <span className="hidden dark:inline-flex">
              <AzmxLogo variant="white" height={24} />
            </span>
            <span className="sr-only">AZMX — home</span>
          </Link>
          <span className="h-4 w-px bg-hairline" aria-hidden />
          <span className="az-caption uppercase text-ink-meta">Games</span>
        </div>
        <Eyebrow surface="light" tick className="mt-10">
          You&rsquo;re joining
        </Eyebrow>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-2xl text-ink">{roomName}</span>
        </div>
        <p className="az-caption mt-2 uppercase text-ink-meta">
          Room {roomCode || "—"}
        </p>
      </header>

      <div className="mt-16 flex-1">
        {blockedTitle ? (
          <>
            <h1 className="az-title max-w-sm text-balance text-ink">
              {blockedTitle}
            </h1>
            <p className="az-body mt-6 max-w-sm text-ink-body/70">
              {blockedBody}
            </p>
            <div className="mt-12 max-w-sm">
              <Button variant="secondary" surface="light" fullWidth href="/join">
                Try another code
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* The ask — serif for personality. */}
            <h1 className="az-title max-w-sm text-balance text-ink">
              What&rsquo;s your name?
            </h1>
            <JoinForm code={roomCode} roomId={room!.id} />
          </>
        )}
      </div>

      {/* Footer flow-tick + theme. */}
      <footer className="mt-10">
        <Hairline surface="light" />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <Chevron variant="filled" color="accent" size={10} />
            <span className="az-caption uppercase text-ink-meta">
              Joining locks when the selector runs
            </span>
          </div>
          <ThemeToggle surface="light" />
        </div>
      </footer>
    </main>
  );
}
