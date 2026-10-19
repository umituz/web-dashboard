import {
  doesBrowserSupportMediaCapture,
  doesBrowserSupportGeolocation,
  doesBrowserSupportNotifications,
} from '../predicates/permission-supports';
import { normalizePermissionStatus } from '../validation/permission-status-check';
import type { PermissionStatus, PermissionType } from '../types/screens';

const GEOLOCATION_TIMEOUT_MS = 5000;

export async function queryPermissionStatus(permission: PermissionType): Promise<PermissionStatus> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'unsupported';

  try {
    switch (permission) {
      case 'notifications': {
        if (!doesBrowserSupportNotifications()) return 'unsupported';
        return normalizePermissionStatus(window.Notification.permission);
      }
      case 'camera':
      case 'microphone': {
        if (!doesBrowserSupportMediaCapture()) return 'unsupported';
        if (!navigator.permissions?.query) return 'unsupported';
        const status = await navigator.permissions.query({
          name: permission === 'camera' ? 'camera' : 'microphone',
        });
        return normalizePermissionStatus(status.state);
      }
      case 'location': {
        if (!doesBrowserSupportGeolocation()) return 'unsupported';
        if (!navigator.permissions?.query) return 'unsupported';
        const status = await navigator.permissions.query({ name: 'geolocation' });
        return normalizePermissionStatus(status.state);
      }
      case 'photos':
        return 'prompt';
      case 'contacts':
        return 'unsupported';
      default:
        return 'unsupported';
    }
  } catch {
    return 'unsupported';
  }
}

export async function requestPermission(permission: PermissionType): Promise<PermissionStatus> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'unsupported';

  try {
    switch (permission) {
      case 'notifications': {
        if (!doesBrowserSupportNotifications()) return 'unsupported';
        const result = await window.Notification.requestPermission();
        return normalizePermissionStatus(result);
      }
      case 'camera':
      case 'microphone': {
        if (!doesBrowserSupportMediaCapture()) return 'unsupported';
        const constraints: MediaStreamConstraints =
          permission === 'camera' ? { video: true } : { audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track) => track.stop());
        return 'granted';
      }
      case 'location': {
        if (!doesBrowserSupportGeolocation()) return 'unsupported';
        return new Promise<PermissionStatus>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve('granted'),
            (err) =>
              resolve(err.code === err.PERMISSION_DENIED ? 'denied' : 'unsupported'),
            { timeout: GEOLOCATION_TIMEOUT_MS },
          );
        });
      }
      case 'photos':
        return 'prompt';
      case 'contacts':
        return 'unsupported';
      default:
        return 'unsupported';
    }
  } catch {
    return 'denied';
  }
}
