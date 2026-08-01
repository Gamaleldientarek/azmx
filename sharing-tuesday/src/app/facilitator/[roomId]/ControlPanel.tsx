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
import {
  addParticipant,
  closeRoom,
  getRoomRealNames,
  setJoining,
} from "@/app/actions/rooms";
import { RoomClock } from "@/components/RoomClock";
import {
  useRoomRealtime,
  type RosterParticipant,
} from "@/lib/useRoomRealtime";
import {
  WHEEL_LAND_MS,
  prefersReducedMotion,
} from "@/components/motion/timing";
import { useFlipReorder } from "@/components/motion/useFlipReorder";
import type { Draw, RoomStatus } from "@/lib/types";

/**
 * Facilitator control panel client. Live roster over Realtime (fun names +
 * join numbers — the facilitator sees the same sanitized view as everyone),
 * Run selector / redraw (with a confirm step) via the `runDraw` server
 * action, Close room (confirm) via `closeRoom`, and logout.
 */
export interface ControlPanelProps {
  roomId: string;
  createdAt: string;
  closedAt: string | null;
  serverNow: string;
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
  locked: "Joining closed",
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
  createdAt,
  closedAt,
  serverNow,
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

  /* -----------------------------------------------------------------------
   * Draw choreography.
   *
   *   idle -> shuffling (on press) -> settled (WHEEL_LAND_MS after the draw
   *   lands over Realtime)
   *
   * The panel deliberately holds its resolution until the projection wheel
   * settles, so the facilitator's laptop and the big screen land on the same
   * beat. The result itself is server-authoritative and already in hand — the
   * hold is pacing, never suspense over an unknown.
   *
   * A draw already present at mount (page refresh mid-session) starts
   * settled: nobody should sit through a reveal they already saw.
   * -------------------------------------------------------------------- */
  type DrawPhase = "idle" | "shuffling" | "settled";
  const [drawPhase, setDrawPhase] = useState<DrawPhase>(
    initialDraw ? "settled" : "idle"
  );
  const [seenDrawId, setSeenDrawId] = useState<string | null>(
    initialDraw?.id ?? null
  );
  // The draw whose settle timer is currently running. Armed on ARRIVAL, not
  // on press, so a slow server can't resolve the panel early.
  const [armedDrawId, setArmedDrawId] = useState<string | null>(null);

  // Render-phase state adjustment (never a synchronous setState inside an
  // effect): a new draw id arriving arms the settle timer below.
  const drawId = latestDraw?.id ?? null;
  if (drawId !== seenDrawId) {
    setSeenDrawId(drawId);
    if (drawId) {
      setDrawPhase("shuffling");
      setArmedDrawId(drawId);
    }
  }

  useEffect(() => {
    if (!armedDrawId) return;
    // Reduced motion resolves on the next tick — same code path, no hold.
    const t = window.setTimeout(
      () => setDrawPhase("settled"),
      prefersReducedMotion() ? 0 : WHEEL_LAND_MS
    );
    return () => window.clearTimeout(t);
  }, [armedDrawId]);

  /** The selector is running: from press until the panel resolves. */
  const inFlight = drawPending || drawPhase === "shuffling";
  /** The roster is showing the drawn order (not join order). */
  const showingOrder = drawPhase === "settled" && latestDraw !== null;

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

  /**
   * What the roster list actually renders. Join order until the panel
   * resolves, drawn order after. Presentation only — the realtime roster and
   * the draw payload are untouched. Anyone who joined after the draw (a
   * reopened door) keeps their place at the tail rather than vanishing.
   */
  const displayRoster = useMemo(() => {
    if (!showingOrder || !latestDraw) return roster;
    const drawn = new Set(latestDraw.order);
    const ordered = latestDraw.order
      .map((id) => rosterById.get(id))
      .filter((p): p is RosterParticipant => p !== undefined);
    const latecomers = roster.filter((p) => !drawn.has(p.id));
    return ordered.length > 0 ? [...ordered, ...latecomers] : roster;
  }, [showingOrder, latestDraw, roster, rosterById]);

  // FLIP: rows animate the delta between their old and new positions. The
  // reorder happens twice per redraw — back to join order when the shuffle
  // starts, into the new order when it lands.
  const registerRow = useFlipReorder(
    displayRoster.map((p) => p.id),
    !closed
  );

  const executeDraw = () => {
    setConfirming(null);
    setActionError(null);
    // Anticipation: the roster starts shuffling the instant the press lands,
    // covering server latency. The result still only ever comes from Realtime.
    setDrawPhase("shuffling");
    startDrawTransition(async () => {
      const result = await runDraw(roomId);
      if (!result.ok) {
        setActionError(result.message);
        // Nothing is coming — stop shuffling and restore what we were showing.
        setDrawPhase(latestDraw ? "settled" : "idle");
      }
      // Success needs no local handling: the draws INSERT + rooms UPDATE
      // arrive over Realtime, same as on every other surface.
    });
  };

  // Facilitator adds someone by name — themselves when they're taking part,
  // or anyone whose phone won't cooperate. Same RPC as a phone join.
  const [addPending, startAddTransition] = useTransition();
  const [addName, setAddName] = useState("");
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const submitAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = addName.trim();
    if (!name) return;
    setActionError(null);
    setAddedNotice(null);
    startAddTransition(async () => {
      const result = await addParticipant(code, name);
      if (result.ok) {
        setAddName("");
        setAddedNotice(
          `${name} joined as ${result.participant.display_name}`
        );
      } else {
        setActionError(result.message);
      }
      // The roster itself arrives over Realtime, like a phone join.
    });
  };

  const [joiningPending, startJoiningTransition] = useTransition();
  const toggleJoining = () => {
    setActionError(null);
    const open = effectiveStatus !== "lobby";
    startJoiningTransition(async () => {
      const result = await setJoining(roomId, open);
      if (!result.ok) setActionError(result.message);
      // Status flips arrive over Realtime like every other surface.
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

  // One label for the whole in-flight window. `hasDraw` flips true the moment
  // the result arrives, so branching on it mid-shuffle would swap
  // "Drawing…" to "Redrawing…" while the selector is still visibly running.
  const primaryLabel = inFlight
    ? "Drawing…"
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
            ? `Order drawn. ${starterName} goes first.`
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
                {/* The room flips to `revealed` server-side the instant the
                    draw is written, which would otherwise read "Order
                    revealed" while the panel is still visibly drawing. The
                    chip follows what the facilitator can see. */}
                {inFlight ? STATUS_LABEL.drawing : STATUS_LABEL[effectiveStatus]}
              </span>
            </span>
            <span className="h-4 w-px bg-hairline" aria-hidden />
            {/* Session stopwatch — runs from room creation, freezes on close. */}
            <span className="az-caption flex items-baseline gap-2 uppercase text-ink-meta">
              {closed ? "Ran for" : "Elapsed"}
              <RoomClock
                createdAt={createdAt}
                serverNow={serverNow}
                closedAt={closedAt}
                className="font-display text-base normal-case text-ink"
              />
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
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p className="az-caption uppercase text-ink-meta">
              {inFlight
                ? "Shuffling · real names visible only to you"
                : showingOrder
                  ? "Order = running order · real names visible only to you"
                  : "Order = join order · real names visible only to you"}
            </p>
            {/* Door control: close joining without drawing, reopen any time
                (incl. after a draw — a redraw then includes latecomers).
                Deliberately prominent: bordered control + state dot. */}
            {!closed && (
              <button
                type="button"
                disabled={joiningPending}
                onClick={toggleJoining}
                className="inline-flex cursor-pointer items-center gap-2.5 rounded-[2px] border-2 border-accent px-4 py-2.5
                           az-caption font-semibold uppercase text-accent transition-colors
                           hover:bg-accent hover:text-white disabled:opacity-50"
              >
                <span
                  aria-hidden
                  className={`inline-flex h-2 w-2 rounded-full ${
                    effectiveStatus === "lobby" ? "bg-green" : "bg-red"
                  }`}
                />
                {joiningPending
                  ? "Updating…"
                  : effectiveStatus === "lobby"
                    ? "Close joining"
                    : "Reopen joining"}
              </button>
            )}
          </div>

          {/* Add someone by name — the facilitator taking part, or a phone
              that won't cooperate. Only while joining is open. */}
          {effectiveStatus === "lobby" && (
            <form onSubmit={submitAdd} className="mt-6 flex flex-wrap items-end gap-4">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="addName"
                  className="az-caption uppercase text-ink-meta"
                >
                  Add someone to the draw
                </label>
                <input
                  id="addName"
                  name="addName"
                  type="text"
                  maxLength={60}
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Your name, if you're taking part"
                  className="mt-2 w-full appearance-none border-0 border-b-2 border-ink-meta/70 bg-transparent
                             pb-2 font-display text-xl text-ink outline-none
                             placeholder:text-ink-meta focus:border-accent"
                />
              </div>
              <Button
                variant="secondary"
                surface="light"
                type="submit"
                disabled={addPending || !addName.trim()}
              >
                {addPending ? "Adding…" : "Add"}
              </Button>
            </form>
          )}
          {addedNotice && (
            <p className="az-caption mt-3 text-accent" role="status">
              {addedNotice}
            </p>
          )}

          {roster.length === 0 ? (
            <p className="az-body mt-8 max-w-sm text-ink-body/70">
              No one has joined yet. Put the projection on the big screen.
              People appear here the moment they scan.
            </p>
          ) : (
            <ul className="mt-8">
              {displayRoster.map((p, i) => {
                const isStarter =
                  showingOrder &&
                  latestDraw !== null &&
                  p.id === latestDraw.starter_participant_id;
                return (
                  <li key={p.id} ref={registerRow(p.id)}>
                    <div
                      className={`flex items-center gap-5 py-3.5 ${
                        inFlight ? "az-scan" : ""
                      } ${isStarter ? "ps-4 border-s-2 border-accent" : ""}`}
                      // Staggered scan: the highlight travels down the roster
                      // while the selector runs. Opacity only.
                      style={
                        inFlight ? { animationDelay: `${i * 70}ms` } : undefined
                      }
                    >
                      <BrandNumeral
                        // Join number until the order lands, running position
                        // after — the list means something different then.
                        value={showingOrder ? i + 1 : p.join_number}
                        pad={2}
                        color={isStarter ? "accent" : "ink"}
                        scale="sm"
                        className="w-14 shrink-0"
                      />
                      <span className="min-w-0">
                        <span
                          className={`block font-display text-2xl ${
                            isStarter ? "text-accent" : "text-ink"
                          }`}
                        >
                          {p.display_name}
                        </span>
                        {(realNames[p.id] ?? p.real_name) && (
                          <span className="az-caption mt-0.5 block text-ink-meta">
                            {realNames[p.id] ?? p.real_name}
                          </span>
                        )}
                      </span>
                      {isStarter ? (
                        <span
                          className="az-caption az-rise ms-auto uppercase text-accent"
                          // Lands after the reorder has finished travelling.
                          style={{ animationDelay: "560ms" }}
                        >
                          Starts
                        </span>
                      ) : (
                        <Chevron
                          variant="filled"
                          color="accent"
                          size={10}
                          className="ms-auto opacity-40"
                        />
                      )}
                    </div>
                    {i < displayRoster.length - 1 && (
                      <Hairline surface="light" />
                    )}
                  </li>
                );
              })}
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
                      Real names are purged. A fresh room takes about a minute
                      to set up whenever you need one.
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
                      {inFlight
                        ? "Selector running"
                        : hasDraw
                          ? "Same group, fresh order"
                          : "Ready when you are"}
                    </Eyebrow>
                    <p className="az-h2 mt-4 text-white">
                      {inFlight
                        ? "Drawing the order"
                        : hasDraw
                          ? "Redraw the order"
                          : "Run the selector"}
                    </p>
                    <p className="az-body mt-3 text-blue-100/85">
                      {inFlight
                        ? "Watch the big screen — the wheel is spinning. The order lands here at the same moment."
                        : hasDraw
                          ? starterName
                            ? `${starterName} goes first right now. A redraw shuffles the locked group again.`
                            : "A redraw shuffles the locked group again."
                          : "Locks joining and draws a running order for everyone in the room."}
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
                          className="az-press"
                          onClick={() =>
                            hasDraw ? openConfirm("redraw") : executeDraw()
                          }
                          disabled={inFlight || closePending}
                        >
                          {primaryLabel}
                        </Button>
                      )}

                      {/* In-flight rail — a travelling hairline under the
                          Electric block. No spinner, no glow. With motion off
                          the static track alone carries the state. */}
                      {inFlight && (
                        <div
                          aria-hidden
                          className="relative mt-2 h-[2px] w-full overflow-hidden bg-light-blue/25"
                        >
                          <div className="az-rail-band h-full w-1/4 bg-light-blue" />
                        </div>
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
                  Same QR as the projection. Handy for phones nearby
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
