/**
 * Button — delegates to the design system.
 * Dashboard surface: variants default/destructive/outline/ghost,
 * sizes default/sm/icon. Call-site API unchanged.
 */

import { forwardRef } from 'react';
import { Button as DSButton } from '@umituz/web-design-system/atoms';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost';
export type ButtonSize = 'default' | 'sm' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', ...props }, ref) => (
    <DSButton ref={ref} variant={variant} size={size} {...props} />
  ),
);

Button.displayName = 'Button';
