import type { CSSProperties } from "react";

/**
 * Chevron — the AZMX signature "›" motif and the ONLY graphic device in the
 * system (§4). No icon packs, no emoji, no blobs. If a chevron is not doing one
 * of the sanctioned jobs (bullet, tick, flow, big gesture), it does not belong.
 *
 * Geometry: a 60°-included open caret, default aspect ~1:1.3 (taller than wide).
 * Always points in the reading direction. `direction="auto"` (default) points
 * inline-end and flips automatically under a future RTL flip.
 */

type ChevronVariant = "filled" | "stroked" | "ghost";
type ChevronColor =
  | "electric"
  | "light-blue"
  | "white"
  | "navy"
  | "current"
  | "accent"; // themed: Electric in light theme, Light Blue in dark
type ChevronSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero";
type ChevronDirection = "auto" | "right" | "left" | "up" | "down";

const SIZE_PX: Record<ChevronSize, number> = {
  xs: 10, // list bullet / flow tick (§4.1 use 6)
  sm: 16,
  md: 24, // section accent tick
  lg: 40,
  xl: 64, // divider accent (§4.1 use 5)
  hero: 120, // one big gesture per surface (§4.2)
};

const COLOR_VAR: Record<ChevronColor, string> = {
  electric: "var(--color-electric)",
  "light-blue": "var(--color-light-blue)",
  white: "var(--color-white)",
  navy: "var(--color-navy)",
  current: "currentColor",
  accent: "var(--accent)",
};

const ROTATION: Record<Exclude<ChevronDirection, "auto">, number> = {
  right: 0,
  left: 180,
  up: -90,
  down: 90,
};

export interface ChevronProps {
  variant?: ChevronVariant;
  color?: ChevronColor;
  size?: ChevronSize | number;
  direction?: ChevronDirection;
  /** Decorative by default; give a label to expose it to assistive tech. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function Chevron({
  variant = "filled",
  color = "electric",
  size = "md",
  direction = "auto",
  label,
  className = "",
  style,
}: ChevronProps) {
  const px = typeof size === "number" ? size : SIZE_PX[size];
  // aspect ~1:1.3 (taller than wide)
  const w = px;
  const h = Math.round(px * 1.3);
  const fill = COLOR_VAR[color];

  const rotationClass = direction === "auto" ? "az-chevron-auto" : "";
  const rotateStyle: CSSProperties =
    direction === "auto" || direction === "right"
      ? {}
      : { transform: `rotate(${ROTATION[direction]}deg)` };

  const ghost = variant === "ghost";

  return (
    <svg
      viewBox="0 0 100 130"
      width={w}
      height={h}
      className={`${rotationClass} ${className}`.trim()}
      style={{ ...rotateStyle, opacity: ghost ? 0.1 : 1, ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {variant === "filled" ? (
        // Thick filled caret ">" with an inner notch.
        <path
          d="M20 12 L86 65 L20 118 L20 92 L54 65 L20 38 Z"
          fill={fill}
        />
      ) : (
        // Stroked / ghost open caret.
        <path
          d="M28 14 L82 65 L28 116"
          fill="none"
          stroke={fill}
          strokeWidth={ghost ? 6 : 13}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default Chevron;
