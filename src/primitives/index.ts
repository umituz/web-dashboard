/**
 * Local primitives — the package's only UI atoms.
 *
 * Replaces the `@umituz/web-design-system` dependency (v3) with a
 * camp-agnostic set: `udb-*` classes + `--u-*` tokens, no utility
 * framework, no cva, no radix. Import as `@umituz/web-dashboard/primitives`
 * or relatively from inside the package.
 */

export { cn } from './cn';
export type { ClassValue } from './cn';

export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';
