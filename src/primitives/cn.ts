/**
 * cn — conditional className join, delegated to the design system.
 *
 * The design system's `cn` (clsx + tailwind-merge) understands both the
 * `udb-*` vocabulary (unknown classes pass through untouched) and real
 * Tailwind utilities a host may pass, resolving conflicts by last-wins.
 */

export { cn } from '@umituz/web-design-system/utils/cn';
export type { ClassValue } from '@umituz/web-design-system/utils/cn';
