/**
 * Button — camp-agnostic action button (`udb-btn`).
 *
 * Clones only the surface this package actually uses: variants
 * default/destructive/outline/ghost, sizes default/sm/icon. No `asChild`
 * (radix-free), no variant library — classes come from `styles.css`.
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from './cn';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost';
export type ButtonSize = 'default' | 'sm' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn('udb-btn', `udb-btn--${variant}`, `udb-btn--${size}`, className)}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
