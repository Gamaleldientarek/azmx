"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { AZ_EASE_INOUT, prefersReducedMotion } from "./timing";

/**
 * FLIP reorder for a keyed list — First, Last, Invert, Play.
 *
 * When the render order of `keys` changes, every row that moved is snapped
 * back to where it used to be (a transform, so no layout work) and then
 * released to its new home. The browser animates the delta; the DOM was
 * already correct the whole time.
 *
 * Deliberately setState-free: it measures and mutates `style` on nodes it
 * owns, so it never re-renders the list and never trips
 * `react-hooks/set-state-in-effect`. Transform-only, one forced reflow per
 * reorder (not per frame).
 *
 * Reduced motion: rows are never transformed — the reorder is instant.
 *
 * Usage:
 *   const register = useFlipReorder(ids, enabled);
 *   <li ref={register(id)} />
 */
export function useFlipReorder(
  keys: string[],
  enabled = true,
  durationMs = 520
) {
  const nodes = useRef(new Map<string, HTMLElement>());
  const refCache = useRef(new Map<string, (el: HTMLElement | null) => void>());
  const positions = useRef(new Map<string, number>());
  const lastSignature = useRef<string | null>(null);
  const playing = useRef(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  /** Stable ref callback per key — React would otherwise detach/reattach every render. */
  const register = useCallback((key: string) => {
    let fn = refCache.current.get(key);
    if (!fn) {
      fn = (el: HTMLElement | null) => {
        if (el) nodes.current.set(key, el);
        else nodes.current.delete(key);
      };
      refCache.current.set(key, fn);
    }
    return fn;
  }, []);

  const signature = keys.join("|");

  // No dependency array on purpose: row heights change between reorders (a
  // real name resolving adds a caption line), so the "before" measurement has
  // to stay fresh. The body is a no-op unless the order actually changed.
  useLayoutEffect(() => {
    const map = nodes.current;

    // Never re-measure mid-flight — the in-flight transforms would poison it.
    if (playing.current) return;

    const changed = signature !== lastSignature.current;
    const isFirstPass = lastSignature.current === null;

    const next = new Map<string, number>();
    map.forEach((el, key) => {
      next.set(key, el.getBoundingClientRect().top);
    });

    const shouldPlay =
      changed && !isFirstPass && enabled && !prefersReducedMotion();

    if (shouldPlay) {
      const moved: HTMLElement[] = [];
      map.forEach((el, key) => {
        const before = positions.current.get(key);
        const after = next.get(key);
        if (before === undefined || after === undefined) return; // entering row
        const delta = before - after;
        if (Math.abs(delta) < 1) return;
        // INVERT — sit where you were, with no transition to animate it.
        el.style.transition = "none";
        el.style.transform = `translateY(${delta}px)`;
        el.style.willChange = "transform";
        moved.push(el);
      });

      if (moved.length > 0) {
        playing.current = true;
        // PLAY — next frame, release everything at once.
        rafRef.current = requestAnimationFrame(() => {
          for (const el of moved) {
            el.style.transition = `transform ${durationMs}ms ${AZ_EASE_INOUT}`;
            el.style.transform = "";
          }
        });
        timerRef.current = window.setTimeout(() => {
          for (const el of moved) {
            el.style.transition = "";
            el.style.transform = "";
            el.style.willChange = "";
          }
          playing.current = false;
        }, durationMs + 80);
      }
    }

    lastSignature.current = signature;
    positions.current = next;
  });

  useLayoutEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    []
  );

  return register;
}

export default useFlipReorder;
