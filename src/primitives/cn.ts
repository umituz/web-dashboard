/**
 * cn — conditional className join (clsx only).
 *
 * Deliberately drops the old tailwind-merge layer: v4 ships its own
 * `udb-*` class vocabulary where overrides append instead of conflicting,
 * so plain conditional joining is the whole job.
 */

import { clsx, type ClassValue } from 'clsx';

export type { ClassValue };

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
