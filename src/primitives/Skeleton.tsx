/**
 * Skeleton — loading placeholder (`udb-skeleton`).
 *
 * The pulse animation is defined in `styles.css` (a CSS file can ship
 * keyframes; inline styles cannot).
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from './cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('udb-skeleton', `udb-skeleton--${variant}`, className)}
      role="status"
      {...props}
    />
  ),
);

Skeleton.displayName = 'Skeleton';
