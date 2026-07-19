import Image from "next/image";
import logoWhite from "../../../public/azmx-logo-white.svg";
import logoColor from "../../../public/azmx-logo-color.svg";

/**
 * AZMX wordmark (official asset from azmx.sa). White variant on navy /
 * gradient surfaces; color (electric + white glyph) only where the surface
 * keeps it legible. Footer spec: ~24px tall, start-aligned (AZMX §5.5).
 */
export function AzmxLogo({
  variant = "white",
  height = 24,
  className = "",
}: {
  variant?: "white" | "color";
  height?: number;
  className?: string;
}) {
  const src = variant === "white" ? logoWhite : logoColor;
  return (
    <Image
      src={src}
      alt="AZMX"
      height={height}
      style={{ height, width: "auto" }}
      className={className}
      priority={false}
    />
  );
}

export default AzmxLogo;
