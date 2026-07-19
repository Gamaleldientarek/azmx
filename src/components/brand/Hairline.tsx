/**
 * Hairline (§5.7 / §6.1 A5) — the 1px rule that does the work of a card border.
 * Decoration is exactly chevron + gradient + hairline. At most ONE Electric /
 * Light-Blue 2px "active" rule per surface.
 */

export interface HairlineProps {
  surface?: "light" | "dark";
  /** "active" = a single 2px electric/light-blue accent rule. */
  weight?: "hairline" | "active";
  /** Vertical rule instead of horizontal. */
  vertical?: boolean;
  className?: string;
}

export function Hairline({
  surface = "light",
  weight = "hairline",
  vertical = false,
  className = "",
}: HairlineProps) {
  // "light" = the themed surface: resolves per data-theme. "dark" = the fixed
  // navy/gradient surfaces, which are identical in both themes.
  let color: string;
  if (weight === "active") {
    color = surface === "dark" ? "var(--color-light-blue)" : "var(--accent)";
  } else {
    color =
      surface === "dark" ? "var(--color-hairline-dark)" : "var(--hairline)";
  }
  const thickness = weight === "active" ? 2 : 1;

  return (
    <div
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      className={className}
      style={
        vertical
          ? { inlineSize: thickness, blockSize: "100%", backgroundColor: color }
          : { blockSize: thickness, inlineSize: "100%", backgroundColor: color }
      }
    />
  );
}

export default Hairline;
