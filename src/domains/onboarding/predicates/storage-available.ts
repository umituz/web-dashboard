const PROBE_KEY = '@umituz/web-onboarding:probe';
const PROBE_VALUE = '1';

/**
 * Can the current environment use `localStorage`?
 * - Server-side / SSR: false
 * - Disabled cookies/storage in the browser: false
 * - Otherwise: true
 *
 * Side effect: writes and removes a tiny probe to verify both write & read work.
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const probe = window.localStorage;
    probe.setItem(PROBE_KEY, PROBE_VALUE);
    probe.removeItem(PROBE_KEY);
    return true;
  } catch {
    return false;
  }
}
