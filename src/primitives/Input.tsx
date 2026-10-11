/**
 * Input — text input field (`udb-input`).
 *
 * Minimal clone of the surface this package uses: a native input with
 * token-driven styling. Everything else passes through untouched.
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from './cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input ref={ref} type={type} className={cn('udb-input', className)} {...props} />
  ),
);

Input.displayName = 'Input';
