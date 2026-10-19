import type { PermissionStatus } from '../types/screens';

/** Is the permission currently granted by the user? */
export function isPermissionGranted(status: PermissionStatus): boolean {
  return status === 'granted';
}

/** Did the user explicitly deny this permission? */
export function isPermissionDenied(status: PermissionStatus): boolean {
  return status === 'denied';
}

/** Is the permission in the initial "ask the user" state? */
export function isPermissionPrompt(status: PermissionStatus): boolean {
  return status === 'prompt';
}

/** Does the current runtime lack support for this permission? */
export function isPermissionUnsupported(status: PermissionStatus): boolean {
  return status === 'unsupported';
}

/** Has the permission been decided one way or the other? (granted OR denied) */
export function isPermissionDecided(status: PermissionStatus): boolean {
  return status === 'granted' || status === 'denied';
}
