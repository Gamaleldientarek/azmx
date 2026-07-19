"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * ThemeToggle — three quiet text options: Auto / Light / Dark. AZMX restraint:
 * caption-scale sans, no icons, state shown by the accent color alone (plus
 * aria-pressed). Auto follows the device (`prefers-color-scheme`) live; Light
 * and Dark persist to localStorage (`st-theme`) and override it. The inline
 * head script in layout.tsx applies the same resolution before first paint.
 *
 * `surface="light"` renders theme-driven colors (for the themed pages);
 * `surface="dark"` renders fixed on-navy colors (landing / gradient footers,
 * which keep the dark aesthetic in both themes).
 */

type Mode = "auto" | "light" | "dark";

const STORAGE_KEY = "st-theme";
const MODES: Mode[] = ["auto", "light", "dark"];

function applyMode(mode: Mode) {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = mode === "auto" ? (systemDark ? "dark" : "light") : mode;
  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-mode", mode);
}

/* The <html data-theme-mode> attribute is the source of truth (set before
 * paint by the head script). Read it as an external store — this hydrates
 * cleanly from the SSR "auto" and keeps multiple toggles on a page in sync. */
function subscribeMode(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme-mode"],
  });
  return () => observer.disconnect();
}

function readMode(): Mode {
  const attr = document.documentElement.getAttribute("data-theme-mode");
  return attr === "light" || attr === "dark" ? attr : "auto";
}

const serverMode = (): Mode => "auto";

export interface ThemeToggleProps {
  surface?: "light" | "dark";
  className?: string;
}

export function ThemeToggle({
  surface = "light",
  className = "",
}: ThemeToggleProps) {
  const mode = useSyncExternalStore(subscribeMode, readMode, serverMode);

  // In auto, track live device changes.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current =
        document.documentElement.getAttribute("data-theme-mode") ?? "auto";
      if (current === "auto") applyMode("auto");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const select = (next: Mode) => {
    try {
      if (next === "auto") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable — the choice still applies for this page view.
    }
    applyMode(next);
  };

  const idle =
    surface === "dark"
      ? "text-blue-200/70 hover:text-white"
      : "text-ink-meta hover:text-ink";
  const active = surface === "dark" ? "text-light-blue" : "text-accent";
  const label = surface === "dark" ? "text-blue-200/70" : "text-ink-meta";

  return (
    <span
      role="group"
      aria-label="Color theme"
      className={`flex items-center gap-3 ${className}`.trim()}
    >
      <span className={`az-caption uppercase ${label}`} aria-hidden>
        Theme
      </span>
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={mode === m}
          onClick={() => select(m)}
          className={`az-caption cursor-pointer uppercase transition-colors duration-150 py-2 ${
            mode === m ? `font-semibold ${active}` : idle
          }`}
        >
          {m}
        </button>
      ))}
    </span>
  );
}

export default ThemeToggle;
