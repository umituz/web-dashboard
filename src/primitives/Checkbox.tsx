/**
 * Checkbox — delegates to the design system (native + onCheckedChange).
 */

import { forwardRef } from 'react';
import { Checkbox as DSCheckbox } from '@umituz/web-design-system/atoms';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => (
  <DSCheckbox ref={ref} {...props} />
));

Checkbox.displayName = 'Checkbox';
