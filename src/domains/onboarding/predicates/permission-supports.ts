/**
 * Browser-feature predicates for the runtime.
 * Each predicate answers "does the user's browser/environment support this API?".
 */

import type { PermissionType } from '../types/screens';

declare const navigator: undefined | {
  mediaDevices?: { getUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream> };
  geolocation?: {
    getCurrentPosition: (
      success: (pos: GeolocationPosition) => void,
      error?: (err: GeolocationPositionError) => void,
      options?: PositionOptions,
    ) => void;
  };
  permissions?: { query: (descriptor: { name: string }) => Promise<{ state: string }> };
};

function safeWindow(): (Window & typeof globalThis) | null {
  return typeof window === 'undefined' ? null : (window as Window & typeof globalThis);
}

function safeNavigator(): typeof navigator | null {
  if (typeof navigator === 'undefined') return null;
  return navigator;
}

/** Is `Notification` available in the current runtime? */
export function doesBrowserSupportNotifications(): boolean {
  const win = safeWindow();
  if (!win) return false;
  return typeof win.Notification !== 'undefined';
}

/** Is `getUserMedia` available (camera/microphone capture)? */
export function doesBrowserSupportMediaCapture(): boolean {
  const nav = safeNavigator();
  if (!nav) return false;
  return Boolean(nav.mediaDevices?.getUserMedia);
}

/** Is geolocation available? */
export function doesBrowserSupportGeolocation(): boolean {
  const nav = safeNavigator();
  if (!nav) return false;
  return Boolean(nav.geolocation);
}

/** Aggregate check used by `usePermissionPriming` to report "unsupported" cleanly. */
export function isRuntimeSupportMissing(permission: PermissionType): boolean {
  switch (permission) {
    case 'notifications':
      return !doesBrowserSupportNotifications();
    case 'camera':
    case 'microphone':
      return !doesBrowserSupportMediaCapture();
    case 'location':
      return !doesBrowserSupportGeolocation();
    case 'photos':
    case 'contacts':
      return true; // No web-standard APIs for these in this package.
    default:
      return true;
  }
}
