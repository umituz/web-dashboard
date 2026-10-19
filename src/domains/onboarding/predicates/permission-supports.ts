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

export function doesBrowserSupportNotifications(): boolean {
  const win = safeWindow();
  if (!win) return false;
  return typeof win.Notification !== 'undefined';
}

export function doesBrowserSupportMediaCapture(): boolean {
  const nav = safeNavigator();
  if (!nav) return false;
  return Boolean(nav.mediaDevices?.getUserMedia);
}

export function doesBrowserSupportGeolocation(): boolean {
  const nav = safeNavigator();
  if (!nav) return false;
  return Boolean(nav.geolocation);
}

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
      return true;     default:
      return true;
  }
}
