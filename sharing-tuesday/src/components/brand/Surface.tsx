import type { ElementType, ReactNode } from "react";

/**
 * Surface (§2.5) — the four sanctioned surfaces. The gradient is an EVENT
 * surface only (landing hero + the reveal moment); never behind dense copy.
 */

type SurfaceVariant = "navy" | "white" | "blue-50" | "gradient";

const CLASS: Record<SurfaceVariant, string> = {
  navy: "surface-navy",
  white: "surface-white",
  "blue-50": "surface-blue-50",
  gradient: "surface-event",
};

export interface SurfaceProps {
  variant?: SurfaceVariant;
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export function Surface({
  variant = "white",
  as: Tag = "div",
  children,
  className = "",
}: SurfaceProps) {
  return <Tag className={`${CLASS[variant]} ${className}`.trim()}>{children}</Tag>;
}

/** Convenience helper: which text tone a surface implies. */
export function isDarkSurface(variant: SurfaceVariant): boolean {
  return variant === "navy" || variant === "gradient";
}

export default Surface;
