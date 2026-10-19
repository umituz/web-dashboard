import type { PermissionStatus } from '../types/screens';

const RECOGNIZED_STATUSES: ReadonlySet<PermissionStatus> = new Set<PermissionStatus>([
  'granted',
  'denied',
  'prompt',
  'unsupported',
]);

export function isRecognizedPermissionStatus(value: unknown): value is PermissionStatus {
  return typeof value === 'string' && RECOGNIZED_STATUSES.has(value as PermissionStatus);
}

export function normalizePermissionStatus(rawValue: string | null | undefined): PermissionStatus {
  if (rawValue === 'granted' || rawValue === 'denied') return rawValue;
  if (rawValue === 'default' || rawValue === 'prompt') return 'prompt';
  return 'unsupported';
}
