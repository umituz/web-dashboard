/**
 * Input — delegates to the design system.
 * Native `size` (character width) has no DS counterpart; it maps to a
 * `ch`-based width so the original prop API keeps working.
 */

import { forwardRef } from 'react';
import { Input as DSInput } from '@umituz/web-design-system/atoms';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', size: nativeSize, style, ...props }, ref) => (
    <DSInput
      ref={ref}
      type={type}
      {...props}
      style={nativeSize != null ? { width: `${nativeSize}ch`, ...style } : style}
    />
  ),
);

Input.displayName = 'Input';
