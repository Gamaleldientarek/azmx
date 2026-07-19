import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { Chevron } from "./Chevron";

/**
 * Button — AZMX restraint. NO drop shadows, NO pill-everywhere. Hairlines and
 * type do the work. Primary = a decisive Electric block (Electric as
 * punctuation, used on a button, not as a fill behind body text). Secondary =
 * hairline-outlined, transparent. Sans label (information), never serif.
 *
 * Polymorphic: pass `href` to render a Next <Link>, otherwise a <button>.
 */

type Variant = "primary" | "secondary";
type Surface = "light" | "dark";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  surface?: Surface;
  /** Show the trailing forward chevron affordance. */
  chevron?: boolean;
  fullWidth?: boolean;
  className?: string;
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type LinkProps = CommonProps & {
  href: string;
};

export type BrandButtonProps = ButtonProps | LinkProps;

function classesFor(variant: Variant, surface: Surface, fullWidth: boolean) {
  // Big one-handed tap target on phone; crisp near-square corners (2px), no shadow.
  const base =
    "group inline-flex items-center justify-center gap-3 min-h-14 px-6 py-4 " +
    "rounded-[2px] font-body font-semibold text-base tracking-[0.01em] " +
    "transition-colors duration-150 select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:opacity-40 disabled:pointer-events-none cursor-pointer";

  const width = fullWidth ? "w-full" : "";

  let skin = "";
  if (variant === "primary") {
    // Electric block on any surface; white label.
    skin =
      "bg-electric text-white hover:bg-blue-700 " +
      (surface === "dark"
        ? "focus-visible:ring-light-blue focus-visible:ring-offset-navy"
        : "focus-visible:ring-electric focus-visible:ring-offset-white");
  } else {
    skin =
      surface === "dark"
        ? "bg-transparent text-white border border-hairline-dark hover:border-light-blue " +
          "focus-visible:ring-light-blue focus-visible:ring-offset-navy"
        : "bg-transparent text-navy border border-hairline-light hover:border-electric " +
          "focus-visible:ring-electric focus-visible:ring-offset-white";
  }

  return `${base} ${skin} ${width}`.trim();
}

export function Button(props: BrandButtonProps) {
  const {
    children,
    variant = "primary",
    surface = "light",
    chevron = false,
    fullWidth = false,
    className = "",
    href,
    ...rest
  } = props as CommonProps & { href?: string } & ButtonHTMLAttributes<HTMLButtonElement>;

  const cls = `${classesFor(variant, surface, fullWidth)} ${className}`.trim();

  const chevronColor =
    variant === "primary" ? "white" : surface === "dark" ? "light-blue" : "electric";

  const inner = (
    <>
      <span>{children}</span>
      {chevron && (
        <Chevron
          variant="filled"
          color={chevronColor}
          size={12}
          className="transition-transform duration-150 group-hover:translate-x-0.5"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}

export default Button;
