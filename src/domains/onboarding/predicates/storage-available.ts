const PROBE_KEY = '@umituz/web-onboarding:probe';
const PROBE_VALUE = '1';

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
