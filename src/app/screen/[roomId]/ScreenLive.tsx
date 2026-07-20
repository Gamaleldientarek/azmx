"use client";

import { useMemo, useState } from "react";
import {
  AzmxLogo,
  BrandNumeral,
  Chevron,
  Eyebrow,
  Hairline,
} from "@/components/brand";
import { WheelReveal } from "@/components/screen/WheelReveal";
import {
  useRoomRealtime,
  type RosterParticipant,
} from "@/lib/useRoomRealtime";
import type { Draw, RoomStatus } from "@/lib/types";

/**
 * /screen/[roomId] — the live projection client. One state at a time, driven
 * by room status over Realtime:
 *   lobby    → QR + human code + roster filling live
 *   drawing  → brief navy suspense (the wheel takes over as the draw lands)
 *   revealed → WheelReveal (animated for live draws, settled on cold load)
 *   closed   → quiet navy end state
 * A redraw (new draws row) remounts the wheel via key={draw.id}.
 * Real names never appear here — only fun display names + join numbers.
 */
export interface ScreenLiveProps {
  roomId: string;
  roomToken: string;
  roomName: string;
  code: string;
  joinUrl: string;
  qrDataUrl: string;
  initialStatus: RoomStatus;
  initialRoster: RosterParticipant[];
  initialDraw: Draw | null;
}

export function ScreenLive({
  roomId,
  roomToken,
  roomName,
  code,
  joinUrl,
  qrDataUrl,
  initialStatus,
  initialRoster,
  initialDraw,
}: ScreenLiveProps) {
  const { status, roster, latestDraw } = useRoomRealtime({
    roomId,
    roomToken,
    initialStatus,
    initialRoster,
    initialDraw,
  });

  // The draw that was already on screen at load renders settled; any draw
  // arriving live (first draw or a redraw) runs the wheel animation.
  const [initialDrawId] = useState<string | null>(initialDraw?.id ?? null);

  const rosterById = useMemo(() => {
    const map = new Map<string, RosterParticipant>();
    for (const p of roster) map.set(p.id, p);
    return map;
  }, [roster]);

  const order = useMemo(() => {
    if (!latestDraw) return [];
    return latestDraw.order
      .map((id) => {
        const p = rosterById.get(id);
        return p
          ? { id, displayName: p.display_name, joinNumber: p.join_number }
          : null;
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [latestDraw, rosterById]);

  const joinUrlDisplay = joinUrl.replace(/^https?:\/\//, "");
  const effectiveStatus = status ?? initialStatus;

  const showReveal =
    effectiveStatus !== "closed" &&
    (effectiveStatus === "revealed" || effectiveStatus === "drawing") &&
    latestDraw !== null &&
    order.length === latestDraw.order.length &&
    order.length > 0;

  /* ---- CLOSED ---------------------------------------------------------- */
  if (effectiveStatus === "closed") {
    return (
      <main className="flex min-h-svh flex-col justify-center bg-navy">
        <section className="surface-navy relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden px-[4vw] py-[3.2vh]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <Eyebrow surface="dark" tick>
              Sharing Tuesday
            </Eyebrow>
            <p className="az-display mt-[2vh] text-white">
              This room has closed
            </p>
            <p className="az-proj-label mt-[2.4vh] text-blue-200">
              See you next Tuesday
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* ---- REVEAL (event surface — the one centered composition) ----------- */
  if (showReveal && latestDraw) {
    return (
      <main className="flex min-h-svh flex-col justify-center bg-navy">
        <section className="surface-event relative flex aspect-video w-full overflow-hidden">
          <WheelReveal
            key={latestDraw.id}
            order={order}
            resolved={latestDraw.id === initialDrawId}
          />
        </section>
      </main>
    );
  }

  /* ---- DRAWING suspense (draw row not yet arrived) --------------------- */
  if (effectiveStatus === "drawing" || effectiveStatus === "revealed") {
    return (
      <main className="flex min-h-svh flex-col justify-center bg-navy">
        <section className="surface-navy relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden px-[4vw] py-[3.2vh]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <Eyebrow surface="dark" tick>
              Joining is locked
            </Eyebrow>
            <p className="az-display mt-[2vh] text-white">
              Drawing the order
            </p>
            <div className="mt-[3vh] flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-light-blue opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-light-blue" />
              </span>
              <span className="az-proj-label text-blue-200">
                Eyes on the screen
              </span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* ---- LOBBY ----------------------------------------------------------- */
  return (
    <main className="flex min-h-svh flex-col justify-center bg-navy">
      <section className="surface-navy relative flex aspect-video w-full flex-col justify-between overflow-hidden px-[4vw] py-[3.2vh]">

        <header className="relative z-10 flex items-center gap-[1.5vw]">
          <span className="font-display text-[clamp(1.25rem,2vw,2rem)] text-white">
            {roomName}
          </span>
          <span className="h-[1.4em] w-px bg-hairline-dark" aria-hidden />
          <span className="az-proj-label flex items-center gap-2 text-light-blue">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-light-blue opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-light-blue" />
            </span>
            Live
          </span>
        </header>

        {effectiveStatus === "locked" ? (
          /* Joining manually closed — no QR, no code; the roster is the show. */
          <div className="relative z-10">
            <Eyebrow surface="dark" tick>
              Joining is closed
            </Eyebrow>
            <p className="az-display mt-[1.6vh] text-white">
              Everyone&rsquo;s in
            </p>
            <p className="az-proj-label mt-[1.6vh] text-blue-200">
              The selector runs shortly
            </p>
          </div>
        ) : (
          <div className="relative z-10 grid grid-cols-12 items-center gap-[3vw]">
            {/* Join instruction + big human code (7 cols). The code is the hero. */}
            <div className="col-span-7">
              <Eyebrow surface="dark" tick>
                Scan to join on your phone
              </Eyebrow>
              <p className="az-display mt-[1.6vh] text-white">Scan to join</p>
              <div className="mt-[2.4vh]">
                <span className="az-proj-label text-blue-200">
                  Or enter code
                </span>
                <p className="az-proj-code mt-[0.8vh] text-light-blue">
                  {code}
                </p>
              </div>
              <p className="az-caption mt-[2vh] normal-case tracking-normal text-blue-200/80">
                {joinUrlDisplay}
              </p>
            </div>

            {/* QR panel (5 cols) — white block so it scans. */}
            <div className="col-span-5 flex justify-end">
              <div className="w-[22vw] max-w-[360px] bg-white p-[1.4vw]">
                {/* Server-generated PNG data URL — next/image adds nothing here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt={`QR code — scan to join room ${code}`}
                  className="w-full"
                  data-slot="qr"
                />
              </div>
            </div>
          </div>
        )}

        {/* Roster that fills live as people join. */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Chevron variant="filled" color="light-blue" size={14} />
            <span className="az-proj-label text-blue-200" aria-live="polite">
              In the room · {roster.length}
            </span>
            <AzmxLogo variant="white" height={22} className="ms-auto opacity-90" />
          </div>
          <div className="mt-[1.2vh]">
            <Hairline surface="dark" />
          </div>
          <ul className="mt-[1.4vh] grid grid-cols-2 gap-x-[3vw] gap-y-[1.1vh] sm:grid-cols-3 lg:grid-cols-4">
            {roster.map((p) => (
              <li key={p.id} className="az-rise flex items-baseline gap-[0.8vw]">
                <BrandNumeral
                  value={p.join_number}
                  pad={2}
                  color="light-blue"
                  scale="sm"
                  className="shrink-0"
                />
                <span className="font-display text-[clamp(1rem,1.5vw,1.6rem)] text-white">
                  {p.display_name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default ScreenLive;
