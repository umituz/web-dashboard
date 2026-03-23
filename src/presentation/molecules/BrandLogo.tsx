import React from "react";
import { cn } from "@umituz/web-design-system/utils";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

/**
 * BrandLogo Component
 *
 * Displays the application brand logo as an SVG.
 * Supports custom sizing and styling through className.
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
      className={cn("shrink-0", className)}
    >
      {/* Solid Foundation / Platform */}
      <rect
        x="15"
        y="65"
        width="70"
        height="15"
        rx="4"
        fill="hsl(var(--primary))"
      />

      {/* Assembly Paths / Structure */}
      <rect
        x="25"
        y="25"
        width="12"
        height="40"
        rx="2"
        fill="hsl(var(--primary))"
      />
      <rect
        x="44"
        y="35"
        width="12"
        height="30"
        rx="2"
        fill="hsl(var(--primary))"
      />
      <rect
        x="63"
        y="20"
        width="12"
        height="45"
        rx="2"
        fill="hsl(var(--primary))"
      />

      {/* Modern Accent - The 'Assembly' Bridge */}
      <rect
        x="20"
        y="45"
        width="60"
        height="10"
        rx="2"
        fill="hsl(var(--secondary))"
      />

      {/* Connection Point / Beacon */}
      <circle
        cx="50"
        cy="20"
        r="5"
        fill="hsl(var(--secondary))"
      />
    </svg>
  );
};
