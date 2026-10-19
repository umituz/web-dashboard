import type { PermissionStatus } from '../types/screens';

const RECOGNIZED_STATUSES: ReadonlySet<PermissionStatus> = new Set<PermissionStatus>([
  'granted',
  'denied',
  'prompt',
  'unsupported',
]);

/** Is the given string one of the recognized permission statuses? */
export function isRecognizedPermissionStatus(value: unknown): value is PermissionStatus {
  return typeof value === 'string' && RECOGNIZED_STATUSES.has(value as PermissionStatus);
}

/**
 * Normalize a browser-level permission string (which may be "default")
 * to our internal PermissionStatus enum.
 */
export function normalizePermissionStatus(rawValue: string | null | undefined): PermissionStatus {
  if (rawValue === 'granted' || rawValue === 'denied') return rawValue;
  if (rawValue === 'default' || rawValue === 'prompt') return 'prompt';
  return 'unsupported';
}
