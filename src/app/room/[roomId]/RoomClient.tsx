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
import { PlaceTicker } from "@/components/motion/PlaceTicker";
import {
  FIRST_HOLD_MS,
  LATE_LOAD_GRACE_MS,
  PLACE_HOLD_MS,
  WHEEL_LAND_MS,
  prefersReducedMotion,
} from "@/components/motion/timing";
import { recoverSeat, releaseSeat } from "@/app/actions/join";
import {
  saveParticipantSession,
  useParticipantSession,
} from "@/lib/participantSession";
import { useRoomRealtime } from "@/lib/useRoomRealtime";

/** 3 -> "3rd". Reads better than "number 3" in the payoff line. */
function ordinal(n: number): string {
  const teens = n % 100;
  if (teens >= 11 && teens <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

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

  /* -----------------------------------------------------------------------
   * Reveal choreography — the phone's version of the wheel.
   *
   *   0 ticking — the place numeral cycles and decelerates
   *   1 landed  — the place locks and holds alone (longer if you're first)
   *   2 settled — the full order cascades in beneath it
   *
   * Scheduled from draw ARRIVAL against the same WHEEL_LAND_MS the projection
   * uses, so the phone lands on the same beat as the big screen. The old flat
   * 1.8s hold quietly spoiled the wheel by ~2.2s.
   *
   * Render-phase state adjustment (never a synchronous setState in an
   * effect): a new draw id arms the sequence; timers advance it.
   * -------------------------------------------------------------------- */
  const drawId = latestDraw?.id ?? null;
  const myId = session?.participant.id ?? null;
  const myPlace = latestDraw && myId ? latestDraw.order.indexOf(myId) + 1 : 0;
  const isFirst = myPlace === 1;

  const [seenDrawId, setSeenDrawId] = useState<string | null>(null);
  const [stage, setStage] = useState<0 | 1 | 2>(2);
  const [armedDrawId, setArmedDrawId] = useState<string | null>(null);

  // A draw already present in the first moments after mount is a late load (a
  // refresh, or someone opening their phone after the fact) — those jump
  // straight to the settled state rather than replaying a moment they missed.
  // Only once this flag is up does an arriving draw count as live.
  const [pastMountGrace, setPastMountGrace] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(
      () => setPastMountGrace(true),
      LATE_LOAD_GRACE_MS
    );
    return () => window.clearTimeout(t);
  }, []);

  if (drawId !== seenDrawId) {
    setSeenDrawId(drawId);
    if (drawId) {
      setStage(pastMountGrace ? 0 : 2);
      setArmedDrawId(pastMountGrace ? drawId : null);
    }
  }

  useEffect(() => {
    if (!armedDrawId) return;
    // Reduced motion collapses both beats to the next tick — same code path.
    const reduced = prefersReducedMotion();
    const hold = isFirst ? FIRST_HOLD_MS : PLACE_HOLD_MS;
    const land = window.setTimeout(
      () => setStage(1),
      reduced ? 0 : WHEEL_LAND_MS
    );
    const settle = window.setTimeout(
      () => setStage(2),
      reduced ? 0 : WHEEL_LAND_MS + hold
    );
    return () => {
      window.clearTimeout(land);
      window.clearTimeout(settle);
    };
  }, [armedDrawId, isFirst]);

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
      <main className="surface-navy surface-navy-ambient relative flex min-h-svh flex-col justify-center overflow-hidden px-6 py-12 sm:px-10">
        <div className="relative z-10" role="status">
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
      <main className="surface-navy surface-navy-ambient relative flex min-h-svh flex-col overflow-hidden px-6 py-12 sm:px-10">
        <div className="relative z-10 flex flex-1 flex-col">
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
        <footer className="relative z-10 mt-10">
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
      <main className="surface-navy surface-navy-ambient relative flex min-h-svh flex-col overflow-hidden px-6 py-12 sm:px-10">
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
  const settledDraw =
    (status === "revealed" || status === "closed") && latestDraw !== null;
  const namesReady = unresolvedCount === 0 || graceExpired;

  // The place lands first and does not wait on name resolution — the number
  // is known the instant the draw arrives.
  const placeReady = settledDraw && stage >= 1 && myPlace > 0;
  const listReady =
    settledDraw && stage >= 2 && order.length > 0 && namesReady;
  const revealed = placeReady || listReady;

  const drawing = !revealed && (status === "drawing" || settledDraw);
  const closed = status === "closed";

  // The place numeral is cycling: a draw is in hand, still being paced out.
  const ticking = drawing && stage === 0 && myPlace > 0;
  const tickTotal = latestDraw?.order.length ?? 0;
  const revealEyebrow = placeReady
    ? isFirst
      ? "You're up first"
      : "Your place"
    : "The order";

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
            {/* Serif fun name = the hero personality. It breathes while the
                selector runs, so the top of the phone is alive too — the same
                ambient beat as the rule under the ticker below. */}
            <h1
              className={`font-display text-5xl leading-[0.98] text-white sm:text-6xl ${
                drawing ? "az-breathe" : ""
              }`}
            >
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
              {revealEyebrow}
            </Eyebrow>

            {/* The payoff. The number the ticker was cycling locks in place —
                scale only, so the numeral never blinks out. Going first earns
                a bigger figure and an Electric rule; everyone else gets the
                same gesture one notch quieter. */}
            {placeReady && (
              <div className="mt-6">
                <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
                  <BrandNumeral
                    value={myPlace}
                    pad={2}
                    color="accent"
                    scale={isFirst ? "xl" : "lg"}
                    className="az-lock"
                  />
                  <span className="az-h2 pb-1 text-ink">
                    {isFirst ? "You go first" : `You go ${ordinal(myPlace)}`}
                  </span>
                </div>
                <div
                  aria-hidden
                  className={`az-rule-draw mt-5 w-full ${
                    isFirst ? "h-[2px] bg-accent" : "h-px bg-hairline"
                  }`}
                  style={{ animationDelay: "160ms" }}
                />
                {isFirst && (
                  <p className="az-body mt-4 max-w-sm text-ink-body/70">
                    You open the session. Everyone else follows you.
                  </p>
                )}
              </div>
            )}

            {listReady && (
              <div className={placeReady ? "mt-12" : "mt-3"}>
            <h2 className="az-h2 text-ink">Who goes when</h2>

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
                    // Cascade, not a curtain: each row follows the one above.
                    style={{ animationDelay: `${i * 60}ms` }}
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
              </div>
            )}
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
            {ticking ? (
              <>
                {/* The tension: the same decelerating tick schedule as the
                    projection wheel, cycling the one thing this person
                    actually wants to know. */}
                <div className="mt-8 flex flex-wrap items-end gap-x-5 gap-y-2">
                  <PlaceTicker total={tickTotal} landOn={myPlace} />
                  <span className="az-body pb-2 text-ink-meta">
                    finding your place
                  </span>
                </div>
                <div
                  aria-hidden
                  className="az-breathe mt-5 h-px w-full bg-hairline"
                />
              </>
            ) : (
              <p className="az-body mt-4 max-w-sm text-ink-body/70">
                The selector is spinning on the big screen. Your place is about
                to land here.
              </p>
            )}
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
