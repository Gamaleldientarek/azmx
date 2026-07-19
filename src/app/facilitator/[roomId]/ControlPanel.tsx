"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  AzmxLogo,
  BrandNumeral,
  Button,
  Chevron,
  Eyebrow,
  Hairline,
  ThemeToggle,
} from "@/components/brand";
import { logoutFacilitator } from "@/app/actions/auth";
import { runDraw } from "@/app/actions/draw";
import { closeRoom, getRoomRealNames } from "@/app/actions/rooms";
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

/**
 * One-click copy affordance — quiet caption text, accent color, text-swap
 * confirmation (no toast). Information-level, so it never competes with the
 * single Electric CTA.
 */
function CopyAction({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    []
  );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions / non-secure context) — the code
      // is on screen, selectable by hand.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="az-caption cursor-pointer uppercase text-accent underline-offset-4 transition-colors hover:underline"
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

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

  // Focus management for the confirm steps: entering a confirm swap moves
  // focus to the confirm button (autoFocus); leaving it returns focus to the
  // trigger that opened it instead of dropping to <body>.
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const openConfirm = (which: "redraw" | "close") => {
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setConfirming(which);
  };
  useEffect(() => {
    const el = restoreFocusRef.current;
    if (confirming === null && el) {
      el.focus();
      // A trigger disabled mid-action refuses focus — retry when pending ends.
      if (document.activeElement === el) restoreFocusRef.current = null;
    }
  }, [confirming, drawPending, closePending]);

  const effectiveStatus = status ?? initialStatus;
  const closed = effectiveStatus === "closed";
  const hasDraw = latestDraw !== null;

  // Real names, visible to the facilitator only. Seeded from the server
  // fetch; live joiners arrive sanitized over Realtime, so any id without a
  // name triggers a gated re-fetch. Names stop resolving once closed (purged).
  const [realNames, setRealNames] = useState<Record<string, string>>(() => {
    const seed: Record<string, string> = {};
    for (const p of initialRoster) if (p.real_name) seed[p.id] = p.real_name;
    return seed;
  });
  const fetchingNamesRef = useRef(false);
  useEffect(() => {
    if (closed || fetchingNamesRef.current) return;
    if (!roster.some((p) => !realNames[p.id])) return;
    fetchingNamesRef.current = true;
    getRoomRealNames(roomId)
      .then((res) => {
        if (res.ok) setRealNames((prev) => ({ ...res.names, ...prev }));
      })
      .finally(() => {
        fetchingNamesRef.current = false;
      });
  }, [roster, realNames, closed, roomId]);

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
      {/* Announce draw results to assistive tech (visual result is realtime-driven). */}
      <p className="sr-only" aria-live="polite">
        {closed
          ? "Room closed. Real names purged."
          : starterName
            ? `Order drawn. Speaking first: ${starterName}.`
            : ""}
      </p>
      {/* Top nav: wordmark home link + live status, theme, log out. */}
      <header>
        <nav
          aria-label="Facilitator"
          className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3"
        >
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
            <span className="az-caption uppercase text-ink-meta">
              Facilitator
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="flex items-center gap-3">
              {!closed && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-accent opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
              )}
              <span className="az-caption uppercase text-ink-meta">
                {STATUS_LABEL[effectiveStatus]}
              </span>
            </span>
            <span className="h-4 w-px bg-hairline" aria-hidden />
            <ThemeToggle surface="light" />
            <span className="h-4 w-px bg-hairline" aria-hidden />
            <form action={logoutFacilitator}>
              <button
                type="submit"
                className="az-caption cursor-pointer uppercase text-ink-meta transition-colors hover:text-ink py-2"
              >
                Log out
              </button>
            </form>
          </div>
        </nav>
        <div className="mt-4">
          <Hairline surface="light" />
        </div>

        {/* Page head: room identity + the big room code (first eye-landing). */}
        <div className="mt-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <div>
            <Eyebrow surface="light" tick>
              Control panel
            </Eyebrow>
            <h1 className="az-title mt-3 text-ink">{roomName}</h1>
          </div>
          <div>
            <span className="az-caption uppercase text-ink-meta">
              Room code
            </span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="az-code text-ink">{code}</span>
              <span className="flex items-baseline gap-4">
                <CopyAction label="Copy code" value={code} />
                <span
                  className="h-3.5 w-px self-center bg-hairline"
                  aria-hidden
                />
                <CopyAction label="Copy join link" value={joinUrl} />
              </span>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Hairline surface="light" />
        </div>
      </header>

      <div className="mt-12 grid flex-1 grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
        {/* Roster (7 cols) — fun names only, live. */}
        <section className="lg:col-span-7">
          <div className="flex items-baseline justify-between">
            <h2 className="az-h2 text-ink">In the room</h2>
            <BrandNumeral value={roster.length} color="accent" scale="sm" />
          </div>
          <p className="az-caption mt-2 uppercase text-ink-meta">
            Order = join order · real names visible only to you
          </p>

          {roster.length === 0 ? (
            <p className="az-body mt-8 max-w-sm text-ink-body/70">
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
                      color="ink"
                      scale="sm"
                      className="w-14 shrink-0"
                    />
                    <span className="min-w-0">
                      <span className="block font-display text-2xl text-ink">
                        {p.display_name}
                      </span>
                      {(realNames[p.id] ?? p.real_name) && (
                        <span className="az-caption mt-0.5 block text-ink-meta">
                          {realNames[p.id] ?? p.real_name}
                        </span>
                      )}
                    </span>
                    {latestDraw &&
                      p.id === latestDraw.starter_participant_id && (
                        <span className="az-caption ms-auto uppercase text-accent">
                          Starts
                        </span>
                      )}
                    {(!latestDraw ||
                      p.id !== latestDraw.starter_participant_id) && (
                      <Chevron
                        variant="filled"
                        color="accent"
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
            {/* The primary action — the moment. Navy panel, one electric CTA.
                In dark the page is near-navy, so a hairline keeps the panel edge. */}
            <div className="surface-navy relative overflow-hidden p-8 sm:p-10 dark:border dark:border-hairline-dark">
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
                            autoFocus
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
                            hasDraw ? openConfirm("redraw") : executeDraw()
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
                <span className="az-caption uppercase text-ink-meta">
                  {hasDraw ? "After the draw" : "When you're done"}
                </span>
                <div className="mt-4 flex flex-col gap-3">
                  {confirming === "close" ? (
                    <>
                      <Button
                        variant="primary"
                        surface="light"
                        fullWidth
                        autoFocus
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
                      onClick={() => openConfirm("close")}
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
                  <dt className="az-caption uppercase text-ink-meta">
                    Projection
                  </dt>
                  <dd className="az-body text-accent">
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
                  <dt className="az-caption uppercase text-ink-meta">
                    Join link
                  </dt>
                  <dd className="truncate az-body text-ink-body/70">
                    {joinUrl.replace(/^https?:\/\//, "")}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex items-start gap-5">
                {/* QR stays navy-on-white in both themes — scan reliability. */}
                <div className="w-32 shrink-0 border border-hairline bg-white p-2">
                  {/* Server-generated PNG data URL. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`QR code — join room ${code}`}
                    className="w-full"
                  />
                </div>
                <p className="az-caption max-w-[16rem] uppercase text-ink-meta">
                  Same QR as the projection — handy for phones nearby
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ControlPanel;
