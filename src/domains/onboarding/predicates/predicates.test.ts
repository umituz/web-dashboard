import { describe, it, expect } from 'vitest';
import {
  doesIconNameResolve,
  getRegisteredIconNames,
  resolveIconByName,
} from './icon-name-resolves';
import {
  isPermissionDecided,
  isPermissionDenied,
  isPermissionGranted,
  isPermissionPrompt,
  isPermissionUnsupported,
} from './permission-granted';
import {
  doesBrowserSupportGeolocation,
  doesBrowserSupportMediaCapture,
  doesBrowserSupportNotifications,
  isRuntimeSupportMissing,
} from './permission-supports';
import { isLocalStorageAvailable } from './storage-available';
import {
  accountGateAllowsSkip,
  hasOnAccept,
  hasOnRequest,
  hasOnSignIn,
} from './has-handler';
import { screenEmitsData } from './screen-emits-data';
import type { OnboardingScreen } from '../types/screens';

describe('icon-name-resolves (§24.4)', () => {
  it('resolves registered names', () => {
    expect(doesIconNameResolve('HeartPulse')).toBe(true);
    expect(doesIconNameResolve('Sparkles')).toBe(true);
        expect(resolveIconByName('Sparkles')).toBeTruthy();
  });

  it('does not resolve unknown, missing, or case-mismatched names', () => {
    expect(doesIconNameResolve('NonExistentIcon')).toBe(false);
    expect(doesIconNameResolve(undefined)).toBe(false);
    expect(doesIconNameResolve('sparkles')).toBe(false);     expect(resolveIconByName('NonExistentIcon')).toBeNull();
  });

  it('resolves the reserved-word alias "Infinity"', () => {
    expect(doesIconNameResolve('Infinity')).toBe(true);
    expect(resolveIconByName('Infinity')).toBeTruthy();
  });

  it('resolves every icon used by the bundled templates — including the video set', () => {
        const templateIcons = [
      'Activity', 'Apple', 'Award', 'Ban', 'Bell', 'BookOpen', 'Camera', 'Check',
      'CheckCircle2', 'Download', 'Dumbbell', 'GraduationCap', 'Headphones',
      'HeartPulse', 'Image', 'Infinity', 'Lock', 'MapPin', 'MessageCircle',
      'Mic', 'Moon', 'Palette', 'PenTool', 'Play', 'Rocket', 'Rewind', 'Share2',
      'Shield', 'ShieldCheck', 'Smile', 'Sparkles', 'Square', 'Star', 'Theater',
      'Tv', 'Users', 'X', 'Zap',
    ];
    for (const name of templateIcons) {
      expect(doesIconNameResolve(name), `expected "${name}" to resolve`).toBe(true);
    }
  });

  it('keeps the registry curated (each name maps to a component)', () => {
    const names = getRegisteredIconNames();
    expect(names.length).toBeGreaterThan(30);
    expect(names.length).toBeLessThan(60);     for (const name of names) {
      expect(resolveIconByName(name), `icon "${name}"`).toBeTruthy();
    }
  });
});

describe('permission-granted (§24.1)', () => {
  it('classifies statuses', () => {
    expect(isPermissionGranted('granted')).toBe(true);
    expect(isPermissionGranted('prompt')).toBe(false);
    expect(isPermissionDenied('denied')).toBe(true);
    expect(isPermissionPrompt('prompt')).toBe(true);
    expect(isPermissionDecided('granted')).toBe(true);
    expect(isPermissionDecided('denied')).toBe(true);
    expect(isPermissionDecided('prompt')).toBe(false);
    expect(isPermissionUnsupported('unsupported')).toBe(true);
    expect(isPermissionUnsupported('granted')).toBe(false);
  });
});

describe('permission-supports (§24.2)', () => {
  it('reports support from the live navigator/window', () => {
                expect(doesBrowserSupportMediaCapture()).toBe(
      Boolean((globalThis as { navigator?: { mediaDevices?: { getUserMedia?: unknown } } })
        .navigator?.mediaDevices?.getUserMedia),
    );
    expect(doesBrowserSupportGeolocation()).toBe(
      Boolean(
        (globalThis as { navigator?: { geolocation?: unknown } }).navigator?.geolocation,
      ),
    );
  });

  it('reports notification support from the window object', () => {
    expect(doesBrowserSupportNotifications()).toBe(
      typeof (globalThis as { Notification?: unknown }).Notification !== 'undefined',
    );
  });

  it('treats photos/contacts as unsupported (no web-standard API)', () => {
    expect(isRuntimeSupportMissing('photos')).toBe(true);
    expect(isRuntimeSupportMissing('contacts')).toBe(true);
  });
});

describe('storage-available (§24.3)', () => {
  it('works in the jsdom browser environment', () => {
    expect(isLocalStorageAvailable()).toBe(true);
  });

  it('returns false when storage access throws (e.g. blocked cookies)', () => {
    const original = window.localStorage;
        Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('Access is denied for this document', 'SecurityError');
      },
    });
    try {
      expect(isLocalStorageAvailable()).toBe(false);
    } finally {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: original,
        writable: true,
      });
    }
  });
});

describe('has-handler (§24.5)', () => {
  const paywall = {
    id: 'w',
    type: 'paywall',
    price: '$1',
    trialDays: 7,
  } as Parameters<typeof hasOnAccept>[0];

  it('detects usable callbacks', () => {
    expect(hasOnAccept(paywall)).toBe(false);
    expect(hasOnAccept({ ...paywall, onAccept: async () => ({ accepted: true, trialStarted: true }) })).toBe(true);

    expect(
      hasOnRequest({
        permission: 'camera',
        description: 'd',
        benefits: [],
      } as unknown as Parameters<typeof hasOnRequest>[0]),
    ).toBe(false);

    expect(
      hasOnSignIn({
        optional: false,
        onSignIn: () => Promise.resolve({ signedIn: true }),
      } as unknown as Parameters<typeof hasOnSignIn>[0]),
    ).toBe(true);
  });

  it('allows skip only on optional account gates', () => {
    expect(
      accountGateAllowsSkip({ optional: true } as unknown as Parameters<
        typeof accountGateAllowsSkip
      >[0]),
    ).toBe(true);
    expect(
      accountGateAllowsSkip({ optional: false } as unknown as Parameters<
        typeof accountGateAllowsSkip
      >[0]),
    ).toBe(false);
  });
});

describe('screen-emits-data (§24.6)', () => {
  it('marks view-only screens as non-emitting', () => {
    expect(screenEmitsData({ id: 'a', type: 'welcome' } as OnboardingScreen)).toBe(false);
    expect(screenEmitsData({ id: 'v', type: 'value-delivery' } as OnboardingScreen)).toBe(false);
    expect(screenEmitsData({ id: 's', type: 'social-proof' } as OnboardingScreen)).toBe(false);
  });

  it('marks data-collecting screens as emitting', () => {
    expect(screenEmitsData({ id: 'g', type: 'goal-question' } as OnboardingScreen)).toBe(true);
    expect(screenEmitsData({ id: 'p', type: 'preferences' } as OnboardingScreen)).toBe(true);
  });
});
