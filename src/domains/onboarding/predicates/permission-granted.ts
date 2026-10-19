import type { PermissionStatus } from '../types/screens';

export function isPermissionGranted(status: PermissionStatus): boolean {
  return status === 'granted';
}

export function isPermissionDenied(status: PermissionStatus): boolean {
  return status === 'denied';
}

export function isPermissionPrompt(status: PermissionStatus): boolean {
  return status === 'prompt';
}

export function isPermissionUnsupported(status: PermissionStatus): boolean {
  return status === 'unsupported';
}

export function isPermissionDecided(status: PermissionStatus): boolean {
  return status === 'granted' || status === 'denied';
}
