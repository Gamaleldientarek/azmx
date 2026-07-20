"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BrandNumeral,
  Button,
  Chevron,
  Eyebrow,
  Hairline,
  ThemeToggle,
} from "@/components/brand";
import { recoverSeat, releaseSeat } from "@/app/actions/join";
import {
  saveParticipantSession,
  useParticipantSession,
} from "@/lib/participantSession";
import { useRoomRealtime } from "@/lib/useRoomRealtime";

/**
 * /room/[roomId] — the participant's live phone view.
 *
 * Identity + the scoped room token come from sessionStorage (stored at join,
 * keyed by roomId, so refresh survives). Live state comes from the shared
 * realtime hook. Status-driven: lobby (identity hero + waiting), drawing
 * (brief suspense — the phone's simplified, non-wheel version), revealed
 * (the order with "you" highlighted and the starter marked), closed.
 */
export function RoomClient({
  roomId,
  roomCode,
}: {
  roomId: string;
  /** Server-resolved so rejoin/retry states work with no session at all. */
  roomCode: string | null;
}) {
  // undefined = SSR/hydration shell, null = no valid session on this phone.
  const session = useParticipantSession(roomId);

  // Seat recovery: sessionStorage gone (new tab, restart) but the signed
  // seat cookie may still know this phone. Distinguishes a genuinely absent
  // seat (show the form) from an infrastructure failure (offer retry) — the
  // latter must never present as "your seat is gone".
  const [recovery, setRecovery] = useState<
    "pending" | "done" | "no_seat" | "unavailable"
  >("pending");

  const attemptRecovery = useCallback(() => {
    recoverSeat(roomId)
      .then((res) => {
        if (res.ok) {
          saveParticipantSession({
            roomId: res.roomId,
            roomCode: res.roomCode,
            roomToken: res.roomToken,
            participant: res.participant,
          });
          setRecovery("done");
        } else {
          setRecovery(res.error === "no_seat" ? "no_seat" : "unavailable");
        }
      })
      // Transport failure (offline, 500, stale action id after a redeploy):
      // without this the screen would hang on the loading shell forever.
      .catch(() => setRecovery("unavailable"));
  }, [roomId]);

  // Retry re-arms the pending phase, which re-runs this effect.
  const retryRecovery = () => setRecovery("pending");
  useEffect(() => {
    if (session !== null || recovery !== "pending") return;
    attemptRecovery();
  }, [session, recovery, attemptRecovery]);

  const recoveryPending = session === null && recovery === "pending";

  // Room code for the no-session states: prefer the live session, fall back
  // to the server-resolved code so the rejoin link always carries it.
  const roomCodeHint = session?.roomCode ?? roomCode;
  const rejoinHref = roomCodeHint ? `/join/${roomCodeHint}` : "/join";

  // Shared-device exit: drop this browser's seat cookie, then go to the form
  // so the next person joins as themselves.
  const [releasing, setReleasing] = useState(false);
  const exitSeat = () => {
    setReleasing(true);
    releaseSeat(roomId)
      .catch(() => {})
      .finally(() => {
        try {
          sessionStorage.removeItem(`st:participant:${roomId}`);
        } catch {}
        window.location.href = `${rejoinHref}`;
      });
  };

  const { status, roster, latestDraw, authError, roomName } = useRoomRealtime({
    roomId,
    roomToken: session?.roomToken ?? null,
  });

  // Suspense beat when a draw lands: hold ~1.8s before showing the order
  // (the phone's simplified, non-wheel reveal). Skipped for reduced motion.
  // Render-phase state adjustment (no setState-in-effect): when the draw id
  // changes, arm the hold; a timeout releases it.
  const drawId = latestDraw?.id ?? null;
  const [seenDrawId, setSeenDrawId] = useState<string | null>(null);
  const [suspenseHold, setSuspenseHold] = useState(false);
  if (drawId !== seenDrawId) {
    setSeenDrawId(drawId);
    if (drawId) setSuspenseHold(true);
  }
  // The hold is released by a timer whose length depends on motion
  // preference — 0ms for reduced motion. Reading matchMedia here (effect,
  // not render) keeps SSR safe without a synchronous setState.
  useEffect(() => {
    if (!suspenseHold) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setSuspenseHold(false), reduced ? 0 : 1800);
    return () => window.clearTimeout(t);
  }, [suspenseHold, drawId]);

  const rosterById = useMemo(() => {
    const map = new Map<string, { display_name: string; join_number: number }>();
    for (const p of roster) map.set(p.id, p);
    return map;
  }, [roster]);

  // Every drawn id keeps its slot. An id missing from the roster (partial
  // refetch, missed realtime join) resolves to null and is rendered as a
  // placeholder AFTER a grace period — dropping it silently used to make
  // `revealed` permanently false, leaving the phone stuck on "Drawing" while
  // the projection showed the result.
  const order = useMemo(() => {
    if (!latestDraw) return [];
    return latestDraw.order.map((id) => {
      const p = rosterById.get(id);
      return {
        id,
        displayName: p?.display_name ?? null,
        joinNumber: p?.join_number ?? null,
      };
    });
  }, [latestDraw, rosterById]);

  const unresolvedCount = order.filter((p) => p.displayName === null).length;

  // Grace period: give realtime ~6s to fill the gap, then show the order
  // anyway rather than stalling forever.
  const [graceExpiredFor, setGraceExpiredFor] = useState<string | null>(null);
  useEffect(() => {
    if (unresolvedCount === 0 || !drawId) return;
    const t = window.setTimeout(() => setGraceExpiredFor(drawId), 6000);
    return () => window.clearTimeout(t);
  }, [unresolvedCount, drawId]);
  const graceExpired = drawId !== null && graceExpiredFor === drawId;

  // Storage still loading / recovery in flight. Never an empty element:
  // aria-busy on nothing announces nothing, and a blank navy screen is
  // indistinguishable from a crash.
  if (session === undefined || recoveryPending) {
    return (
      <main className="surface-navy flex min-h-svh flex-col justify-center px-6 py-12 sm:px-10">
        <div role="status">
          <Eyebrow surface="dark" tick>
            Getting your seat
          </Eyebrow>
          <p className="az-title mt-6 max-w-sm text-balance text-white">
            One moment&hellip;
          </p>
          <p className="az-caption mt-4 uppercase text-blue-200/70">
            Room {roomCodeHint ?? "—"}
          </p>
        </div>
      </main>
    );
  }

  // Recovery could not reach the server — state is UNKNOWN, so offer a retry
  // instead of telling the user their seat is gone (the old behavior sent
  // people into a /join <-> /room bounce on ordinary conference wifi).
  if (session === null && recovery === "unavailable") {
    return (
      <main className="surface-navy flex min-h-svh flex-col px-6 py-12 sm:px-10">
        <div className="flex flex-1 flex-col">
          <Eyebrow surface="dark" tick>
            Connection trouble
          </Eyebrow>
          <h1 className="az-title mt-8 max-w-sm text-balance text-white">
            We couldn&rsquo;t reach the room
          </h1>
          <p className="az-body mt-6 max-w-sm text-blue-100/90">
            Your seat is probably still here — the network just didn&rsquo;t
            answer. Try again.
          </p>
          <div className="mt-12 flex max-w-sm flex-col gap-4">
            <Button
              variant="primary"
              surface="dark"
              chevron
              fullWidth
              onClick={retryRecovery}
            >
              Try again
            </Button>
            <Button variant="secondary" surface="dark" fullWidth href={rejoinHref}>
              Enter my name instead
            </Button>
          </div>
        </div>
        <footer className="mt-10">
          <Hairline surface="dark" />
          <p className="az-caption mt-4 uppercase text-blue-200/70">
            Room {roomCodeHint ?? "—"}
          </p>
        </footer>
      </main>
    );
  }

  // No identity on this phone (or the token expired) — gentle rejoin prompt.
  if (session === null || authError) {
    return (
      <main className="surface-navy relative flex min-h-svh flex-col overflow-hidden px-6 py-12 sm:px-10">
        <div className="relative z-10 flex flex-1 flex-col">
          <Eyebrow surface="dark" tick>
            Random Selector
          </Eyebrow>
          <h1 className="az-title mt-8 max-w-sm text-balance text-white">
            We couldn&rsquo;t find your seat on this phone
          </h1>
          <p className="az-body mt-6 max-w-sm text-blue-100/90">
            Your join session isn&rsquo;t here any more — it may have expired,
            or you joined on another device. Rejoin to get a name.
          </p>
          <div className="mt-12 max-w-sm">
            <Button
              variant="primary"
              surface="dark"
              chevron
              fullWidth
              href={rejoinHref}
            >
              Rejoin the room
            </Button>
          </div>
        </div>
        <footer className="relative z-10 mt-10">
          <Hairline surface="dark" />
          <p className="az-caption mt-4 uppercase text-blue-200/70">
            Room {roomCodeHint ?? "—"}
          </p>
        </footer>
      </main>
    );
  }

  const me = session.participant;
  const revealed =
    (status === "revealed" || status === "closed") &&
    latestDraw !== null &&
    order.length > 0 &&
    (unresolvedCount === 0 || graceExpired) &&
    !suspenseHold;
  const drawing =
    status === "drawing" || suspenseHold || (status === "revealed" && !revealed);
  const closed = status === "closed";

  const liveStatusText = closed
    ? "This room has closed"
    : drawing
      ? "The selector is running…"
      : revealed
        ? "The order is set"
        : status === "locked"
          ? "Joining is closed · waiting for the draw"
          : "Waiting in the lobby · watch the screen";

  return (
    <main className="flex min-h-svh flex-col">
      {/* Identity hero — navy "premium dark" moment. */}
      <section className="surface-navy relative overflow-hidden px-6 py-12 sm:px-10">
        <div className="relative z-10">
          <Eyebrow surface="dark" tick>
            Welcome
          </Eyebrow>
          {/* The real name is deliberately NOT shown here: on a shared phone
              the seat cookie belongs to the browser, not the person, so
              echoing it would leak the previous joiner's name. The exit
              below is how the next person takes over. */}
          <p className="az-caption mt-8 uppercase text-blue-200">
            Your name for this session
          </p>

          <div className="mt-3 flex items-start gap-5">
            {/* Serif fun name = the hero personality. */}
            <h1 className="font-display text-5xl leading-[0.98] text-white sm:text-6xl">
              {me.display_name}
            </h1>
          </div>

          {/* Join number as styled serif brand numeral. */}
          <div className="mt-8 flex items-center gap-4">
            <span className="az-caption uppercase text-blue-200">Number</span>
            <span className="h-5 w-px bg-hairline-dark" aria-hidden />
            <BrandNumeral
              value={me.join_number}
              pad={2}
              color="light-blue"
              scale="sm"
            />
          </div>

          <div className="mt-10">
            <Hairline surface="dark" />
            <div
              className="mt-5 flex items-center gap-3"
              data-slot="live-status"
              aria-live="polite"
            >
              {!closed && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-light-blue opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-light-blue" />
                </span>
              )}
              <span className="az-body text-blue-100/90">{liveStatusText}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Status-driven lower surface. */}
      <section className="surface-white flex flex-1 flex-col px-6 py-12 sm:px-10">
        <div className="flex-1">
        {revealed ? (
          <>
            <Eyebrow surface="light" tick>
              The order
            </Eyebrow>
            <h2 className="az-h2 mt-3 text-ink">Who goes when</h2>

            {/* Announce the participant's own slot once the order settles. */}
            <p className="sr-only" aria-live="polite">
              {`You are number ${
                order.findIndex((p) => p.id === me.id) + 1
              } of ${order.length}. ${order[0].displayName ?? "Someone"} goes first.`}
            </p>
            <ol className="mt-8">
              {order.map((p, i) => {
                const mine = p.id === me.id;
                const marks = [
                  ...(i === 0 ? ["First"] : []),
                  ...(mine ? ["You"] : []),
                ];
                return (
                  <li
                    key={p.id}
                    className="az-rise"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div
                      className={`flex flex-wrap items-center gap-x-5 gap-y-1 py-4 ${
                        mine ? "ps-4 border-s-2 border-accent" : ""
                      }`}
                    >
                      <BrandNumeral
                        value={i + 1}
                        pad={2}
                        color={mine ? "accent" : "ink"}
                        scale="sm"
                        className="w-14 shrink-0"
                      />
                      <span
                        className={`font-display text-2xl ${
                          mine ? "text-accent" : "text-ink"
                        }`}
                      >
                        {p.displayName}
                      </span>
                      {marks.length > 0 && (
                        <span
                          className={`az-caption ms-auto uppercase ${
                            mine ? "text-accent" : "text-ink-meta"
                          }`}
                        >
                          {marks.join(" · ")}
                        </span>
                      )}
                    </div>
                    {i < order.length - 1 && <Hairline surface="light" />}
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 flex items-center gap-2">
              <Chevron variant="filled" color="accent" size={10} />
              <span className="az-caption uppercase text-ink-meta">
                {roomName ? `${roomName} · ` : ""}Room {session.roomCode} ·
                order is final
              </span>
            </div>
          </>
        ) : closed ? (
          <>
            <Eyebrow surface="light" tick>
              Session over
            </Eyebrow>
            <h2 className="az-h2 mt-3 text-ink">This room has closed</h2>
            <p className="az-body mt-4 max-w-sm text-ink-body/70">
              That&rsquo;s a wrap. A new room opens whenever you need one.
            </p>
            <p className="az-caption mt-8 uppercase text-ink-meta">
              Real names are purged when the room closes
            </p>
          </>
        ) : drawing ? (
          <>
            <Eyebrow surface="light" tick>
              Any moment now
            </Eyebrow>
            <h2 className="az-h2 mt-3 text-ink">Drawing the order</h2>
            <p className="az-body mt-4 max-w-sm text-ink-body/70">
              The selector is spinning on the big screen. Your place is about
              to land here.
            </p>
          </>
        ) : (
          <>
            <Eyebrow surface="light" tick>
              The room
            </Eyebrow>
            <div className="mt-6 flex items-baseline gap-4">
              <BrandNumeral value={roster.length} color="accent" scale="md" />
              <span className="az-body text-ink-body/70">
                {roster.length === 1 ? "person" : "people"} in the room so far
              </span>
            </div>
            <p className="az-caption mt-8 uppercase text-ink-meta">
              {roomName ? `${roomName} · ` : ""}Room {session.roomCode} ·
              joining locks when the selector runs
            </p>
          </>
        )}
        </div>

        {/* Quiet theme control + the shared-device exit. */}
        <footer className="mt-14">
          <Hairline surface="light" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            {/* Hands the phone to the next person: clears this browser's seat
                so they join as themselves instead of inheriting this one. */}
            <button
              type="button"
              onClick={exitSeat}
              disabled={releasing}
              className="az-caption cursor-pointer uppercase text-ink-meta underline-offset-4 transition-colors hover:text-accent hover:underline disabled:opacity-50"
            >
              {releasing ? "Leaving…" : "Not you? Join as someone else"}
            </button>
            <ThemeToggle surface="light" />
          </div>
        </footer>
      </section>
    </main>
  );
}

export default RoomClient;
