import type { ReactNode } from "react";
import { Chevron } from "./Chevron";

/**
 * Eyebrow (§3.3 / §6.1 A2) — UPPERCASE tracked micro-label that heads content.
 * On light surfaces the accent is Electric; on dark it is Light Blue (Electric
 * vibrates / fails contrast on navy, §2.7). Optional leading chevron tick.
 */

export interface EyebrowProps {
  children: ReactNode;
  surface?: "light" | "dark";
  /** Show the small leading chevron flow-tick. */
  tick?: boolean;
  className?: string;
}

export function Eyebrow({
  children,
  surface = "light",
  tick = false,
  className = "",
}: EyebrowProps) {
  // "light" = the themed surface: Electric in light theme, Light Blue in dark
  // (two-blues rule — Electric small text never sits on a dark surface).
  const color = surface === "dark" ? "text-light-blue" : "text-accent";
  return (
    <p className={`eyebrow ${color} flex items-center gap-2 text-start ${className}`.trim()}>
      {tick && (
        <Chevron
          variant="filled"
          color={surface === "dark" ? "light-blue" : "accent"}
          size={10}
        />
      )}
      <span>{children}</span>
    </p>
  );
}

export default Eyebrow;
