/**
 * Checkbox — native checkbox with a boolean-change callback (`udb-checkbox`).
 *
 * Keeps the `onCheckedChange` convenience this package relies on; every
 * other native attribute passes straight through.
 */

import { forwardRef, useCallback, type InputHTMLAttributes } from 'react';
import { cn } from './cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    // Memoized so parent re-renders don't recreate the handler identity.
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckedChange?.(e.target.checked);
        onChange?.(e);
      },
      [onCheckedChange, onChange],
    );

    return (
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={cn('udb-checkbox', className)}
        {...props}
      />
    );
  },
);

Checkbox.displayName = 'Checkbox';
