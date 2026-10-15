import { cn } from "../../../primitives";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

/**
 * BrandLogo Component
 *
 * Displays the application brand logo as an SVG.
 * Colors come from the package tokens (`--u-color-primary`,
 * `--u-color-secondary`) so hosts restyle it by overriding CSS
 * custom properties — no host theme variables required.
 *
 * @param className - Optional CSS classes for styling
 * @param size - Width and height in pixels (default: 32)
 */
export const BrandLogo = ({ className, size = 32 }: BrandLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("udb-brand-logo", className)}
      aria-hidden="true"
    >
      {/* Solid Foundation / Platform */}
      <rect
        x="15"
        y="65"
        width="70"
        height="15"
        rx="4"
        fill="var(--u-color-primary)"
      />

      {/* Assembly Paths / Structure */}
      <rect
        x="25"
        y="25"
        width="12"
        height="40"
        rx="2"
        fill="var(--u-color-primary)"
      />
      <rect
        x="44"
        y="35"
        width="12"
        height="30"
        rx="2"
        fill="var(--u-color-primary)"
      />
      <rect
        x="63"
        y="20"
        width="12"
        height="45"
        rx="2"
        fill="var(--u-color-primary)"
      />

      {/* Modern Accent - The 'Assembly' Bridge */}
      <rect
        x="20"
        y="45"
        width="60"
        height="10"
        rx="2"
        fill="var(--u-color-secondary)"
      />

      {/* Connection Point / Beacon */}
      <circle
        cx="50"
        cy="20"
        r="5"
        fill="var(--u-color-secondary)"
      />
    </svg>
  );
};
