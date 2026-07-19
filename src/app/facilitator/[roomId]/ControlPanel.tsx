"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  BrandNumeral,
  Button,
  Chevron,
  Eyebrow,
  Hairline,
} from "@/components/brand";
import { logoutFacilitator } from "@/app/actions/auth";
import { runDraw } from "@/app/actions/draw";
import { closeRoom } from "@/app/actions/rooms";
import {
  useRoomRealtime,
  type RosterParticipant,
} from "@/lib/useRoomRealtime";
import type { Draw, RoomStatus } from "@/lib/types";

/**
 * Facilitator control panel client. Live roster over Realtime (fun names +
 * join numbers — the facilitator sees the same sanitized view as everyone),
 * Run selector / redraw (with a confirm step) via the `runDraw` server
 * action, Close room (confirm) via `closeRoom`, and logout.
 */
export interface ControlPanelProps {
  roomId: string;
  roomToken: string;
  code: string;
  roomName: string;
  joinUrl: string;
  qrDataUrl: string;
  initialStatus: RoomStatus;
  initialRoster: RosterParticipant[];
  initialDraw: Draw | null;
}

const STATUS_LABEL: Record<RoomStatus, string> = {
  lobby: "Open",
  drawing: "Locked · drawing",
  revealed: "Order revealed",
  closed: "Closed · names purged",
};

export function ControlPanel({
  roomId,
  roomToken,
  code,
  roomName,
  joinUrl,
  qrDataUrl,
  initialStatus,
  initialRoster,
  initialDraw,
}: ControlPanelProps) {
  const { status, roster, latestDraw } = useRoomRealtime({
    roomId,
    roomToken,
    initialStatus,
    initialRoster,
    initialDraw,
  });

  const [drawPending, startDrawTransition] = useTransition();
  const [closePending, startCloseTransition] = useTransition();
  const [confirming, setConfirming] = useState<"redraw" | "close" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const effectiveStatus = status ?? initialStatus;
  const closed = effectiveStatus === "closed";
  const hasDraw = latestDraw !== null;

  const rosterById = useMemo(() => {
    const map = new Map<string, RosterParticipant>();
    for (const p of roster) map.set(p.id, p);
    return map;
  }, [roster]);

  const starterName = latestDraw
    ? rosterById.get(latestDraw.starter_participant_id)?.display_name ?? null
    : null;

  const executeDraw = () => {
    setConfirming(null);
    setActionError(null);
    startDrawTransition(async () => {
      const result = await runDraw(roomId);
      if (!result.ok) setActionError(result.message);
      // Success needs no local handling: the draws INSERT + rooms UPDATE
      // arrive over Realtime, same as on every other surface.
    });
  };

  const executeClose = () => {
    setConfirming(null);
    setActionError(null);
    startCloseTransition(async () => {
      const result = await closeRoom(roomId);
      if (!result.ok) setActionError(result.message);
    });
  };

  const primaryLabel = drawPending
    ? hasDraw
      ? "Redrawing…"
      : "Drawing…"
    : hasDraw
      ? "Redraw the order"
      : "Run selector";

  return (
    <main className="surface-white flex min-h-svh flex-col px-6 py-9 sm:px-12 lg:px-20">
      {/* Header: room identity + live status. */}
      <header>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <Eyebrow surface="light" tick>
              Control panel
            </Eyebrow>
            <h1 className="az-title mt-3 text-navy">{roomName}</h1>
          </div>
          <div className="flex items-center gap-3">
            {!closed && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-electric" />
              </span>
            )}
            <span className="az-caption uppercase text-neutral-500">
              {STATUS_LABEL[effectiveStatus]} · code {code}
            </span>
          </div>
        </div>
        <div className="mt-6">
          <Hairline surface="light" />
        </div>
      </header>

      <div className="mt-12 grid flex-1 grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
        {/* Roster (7 cols) — fun names only, live. */}
        <section className="lg:col-span-7">
          <div className="flex items-baseline justify-between">
            <h2 className="az-h2 text-navy">In the room</h2>
            <BrandNumeral value={roster.length} color="electric" scale="sm" />
          </div>
          <p className="az-caption mt-2 uppercase text-neutral-500">
            Order = join order · real names hidden on screen
          </p>

          {roster.length === 0 ? (
            <p className="az-body mt-8 max-w-sm text-neutral-900/70">
              No one has joined yet. Put the projection on the big screen —
              people appear here the moment they scan.
            </p>
          ) : (
            <ul className="mt-8">
              {roster.map((p, i) => (
                <li key={p.id}>
                  <div className="flex items-center gap-5 py-3.5">
                    <BrandNumeral
                      value={p.join_number}
                      pad={2}
                      color="navy"
                      scale="sm"
                      className="w-14 shrink-0"
                    />
                    <span className="font-display text-2xl text-navy">
                      {p.display_name}
                    </span>
                    {latestDraw &&
                      p.id === latestDraw.starter_participant_id && (
                        <span className="az-caption ms-auto uppercase text-electric">
                          Starts
                        </span>
                      )}
                    {(!latestDraw ||
                      p.id !== latestDraw.starter_participant_id) && (
                      <Chevron
                        variant="filled"
                        color="electric"
                        size={10}
                        className="ms-auto opacity-40"
                      />
                    )}
                  </div>
                  {i < roster.length - 1 && <Hairline surface="light" />}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Control rail (5 cols). */}
        <aside className="lg:col-span-5 lg:col-start-8">
          <div className="lg:sticky lg:top-9">
            {/* The primary action — the moment. Navy panel, one electric CTA. */}
            <div className="surface-navy relative overflow-hidden p-8 sm:p-10">
              <Chevron
                variant="ghost"
                color="white"
                size={340}
                className="pointer-events-none absolute -end-16 -top-10"
              />
              <div className="relative z-10">
                {closed ? (
                  <>
                    <Eyebrow surface="dark" tick>
                      Session over
                    </Eyebrow>
                    <p className="az-h2 mt-4 text-white">Room closed</p>
                    <p className="az-body mt-3 text-blue-100/85">
                      Real names are purged. A fresh room takes a minute to
                      set up next week.
                    </p>
                    <div className="mt-8">
                      <Button
                        variant="primary"
                        surface="dark"
                        chevron
                        fullWidth
                        href="/facilitator"
                      >
                        Create next room
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Eyebrow surface="dark" tick>
                      {hasDraw ? "Same group, fresh order" : "Ready when you are"}
                    </Eyebrow>
                    <p className="az-h2 mt-4 text-white">
                      {hasDraw ? "Redraw the order" : "Run the selector"}
                    </p>
                    <p className="az-body mt-3 text-blue-100/85">
                      {hasDraw
                        ? starterName
                          ? `${starterName} speaks first right now. A redraw shuffles the locked group again.`
                          : "A redraw shuffles the locked group again."
                        : "Locks joining and draws the full speaking order for everyone."}
                    </p>
                    <div className="mt-8">
                      {confirming === "redraw" ? (
                        <div className="flex flex-col gap-3">
                          <Button
                            variant="primary"
                            surface="dark"
                            chevron
                            fullWidth
                            onClick={executeDraw}
                            disabled={drawPending}
                          >
                            Confirm redraw
                          </Button>
                          <Button
                            variant="secondary"
                            surface="dark"
                            fullWidth
                            onClick={() => setConfirming(null)}
                          >
                            Keep this order
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          surface="dark"
                          chevron
                          fullWidth
                          onClick={() =>
                            hasDraw ? setConfirming("redraw") : executeDraw()
                          }
                          disabled={drawPending || closePending}
                        >
                          {primaryLabel}
                        </Button>
                      )}
                    </div>
                    {actionError && (
                      <p role="alert" className="az-caption mt-4 text-light-blue">
                        {actionError}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Secondary action — close. Hairline-separated, no cards. */}
            {!closed && (
              <div className="mt-8">
                <span className="az-caption uppercase text-neutral-500">
                  {hasDraw ? "After the draw" : "When you're done"}
                </span>
                <div className="mt-4 flex flex-col gap-3">
                  {confirming === "close" ? (
                    <>
                      <Button
                        variant="primary"
                        surface="light"
                        fullWidth
                        onClick={executeClose}
                        disabled={closePending}
                      >
                        {closePending ? "Closing…" : "Confirm close & purge"}
                      </Button>
                      <Button
                        variant="secondary"
                        surface="light"
                        fullWidth
                        onClick={() => setConfirming(null)}
                      >
                        Keep the room open
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      surface="light"
                      fullWidth
                      onClick={() => setConfirming("close")}
                      disabled={closePending || drawPending}
                    >
                      Close room &amp; purge names
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Quick links + join QR. */}
            <div className="mt-8">
              <Hairline surface="light" />
              <dl className="mt-5 space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="az-caption uppercase text-neutral-500">
                    Projection
                  </dt>
                  <dd className="az-body text-electric">
                    <Link
                      href={`/screen/${roomId}`}
                      target="_blank"
                      rel="noopener"
                      className="hover:underline"
                    >
                      /screen/{roomId.slice(0, 8)}…
                    </Link>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="az-caption uppercase text-neutral-500">
                    Join link
                  </dt>
                  <dd className="truncate az-body text-neutral-900/70">
                    {joinUrl.replace(/^https?:\/\//, "")}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex items-start gap-5">
                <div className="w-32 shrink-0 border border-hairline-light bg-white p-2">
                  {/* Server-generated PNG data URL. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`QR code — join room ${code}`}
                    className="w-full"
                  />
                </div>
                <p className="az-caption max-w-[16rem] uppercase text-neutral-500">
                  Same QR as the projection — handy for phones nearby
                </p>
              </div>
            </div>

            {/* Logout. */}
            <div className="mt-8">
              <Hairline surface="light" />
              <form action={logoutFacilitator} className="mt-5">
                <Button variant="secondary" surface="light" type="submit">
                  Log out
                </Button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ControlPanel;
