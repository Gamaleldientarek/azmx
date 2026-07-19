import type { CSSProperties } from "react";

/**
 * BrandNumeral (§3.3 / §6.1 A4) — the serif brand numeral. Used for join
 * numbers, section indices, ordered lists. Plain "01 / 02" in default sans is
 * an AI tell; this is the styled serif figure. Figure-aligned, tabular.
 */

type NumeralColor =
  | "electric"
  | "light-blue"
  | "white"
  | "navy"
  | "accent" // themed: Electric in light theme, Light Blue in dark
  | "ink"; // themed: Navy in light theme, White in dark
type NumeralScale = "sm" | "md" | "lg" | "xl";

const COLOR: Record<NumeralColor, string> = {
  electric: "var(--color-electric)",
  "light-blue": "var(--color-light-blue)",
  white: "var(--color-white)",
  navy: "var(--color-navy)",
  accent: "var(--accent)",
  ink: "var(--ink)",
};

const SCALE: Record<NumeralScale, string> = {
  sm: "clamp(1.75rem, 3vw, 2.5rem)",
  md: "clamp(2.5rem, 4.5vw, 4rem)",
  lg: "clamp(3.5rem, 6vw, 6rem)",
  xl: "clamp(5rem, 10vw, 9rem)",
};

export interface BrandNumeralProps {
  value: string | number;
  color?: NumeralColor;
  scale?: NumeralScale;
  /** Pad short join numbers, e.g. 7 → "07". */
  pad?: number;
  className?: string;
  style?: CSSProperties;
}

export function BrandNumeral({
  value,
  color = "electric",
  scale = "md",
  pad,
  className = "",
  style,
}: BrandNumeralProps) {
  const raw = String(value);
  const display = pad ? raw.padStart(pad, "0") : raw;
  return (
    <span
      className={`font-display inline-block leading-none ${className}`.trim()}
      style={{
        color: COLOR[color],
        fontSize: SCALE[scale],
        fontWeight: 400,
        letterSpacing: "-0.01em",
        fontVariantNumeric: "tabular-nums lining-nums",
        ...style,
      }}
    >
      {display}
    </span>
  );
}

export default BrandNumeral;
