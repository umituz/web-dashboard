/**
 * Analytics dispatch service.
 * Routes a typed onboarding event to the configured provider.
 * Provider-specific dispatch is isolated here; callers stay provider-agnostic.
 *
 * Contract: dispatch NEVER throws. Analytics is an observation channel — a
 * broken tracker must not take down the onboarding funnel. Failures are
 * surfaced to the console (the library's documented error channel) and
 * dropped.
 */

import type {
  AnalyticsProvider,
  OnboardingAnalyticsEvent,
} from '../types/config';

/** Provider globals are read through a LOCAL view of `window` — this package
 * must never augment the global `Window` type for its consumers. */
type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  amplitude?: {
    getInstance: () => { logEvent: (name: string, props: Record<string, unknown>) => void };
  };
  mixpanel?: { track: (name: string, props: Record<string, unknown>) => void };
};

function dispatchToProvider(event: OnboardingAnalyticsEvent, provider: AnalyticsProvider): void {
  if (typeof window === 'undefined') return; // SSR / non-browser: nothing to do.
  const win = window as AnalyticsWindow;
  switch (provider) {
    case 'google-analytics':
      win.gtag?.('event', event.name, event as unknown as Record<string, unknown>);
      return;
    case 'amplitude': {
      const amp = win.amplitude?.getInstance();
      amp?.logEvent(event.name, event as unknown as Record<string, unknown>);
      return;
    }
    case 'mixpanel':
      win.mixpanel?.track(event.name, event as unknown as Record<string, unknown>);
      return;
    case 'custom':
      return; // Handled by the caller via the customTracker path.
  }
}

function dispatchToCustomTracker(
  event: OnboardingAnalyticsEvent,
  customTracker: ((e: OnboardingAnalyticsEvent) => void) | undefined,
): void {
  if (typeof customTracker !== 'function') {
     
    console.warn(
      '[web-onboarding] analytics provider is "custom" but no customTracker was provided; event dropped:',
      event.name,
    );
    return;
  }
  customTracker(event);
}

/**
 * Routes an event to the configured provider. Never throws: provider failures
 * are logged and dropped so an analytics outage cannot break the flow UI.
 */
export function dispatchAnalyticsEvent(
  event: OnboardingAnalyticsEvent,
  provider: AnalyticsProvider | undefined,
  customTracker: ((e: OnboardingAnalyticsEvent) => void) | undefined,
): void {
  try {
    if (provider === 'custom') {
      dispatchToCustomTracker(event, customTracker);
      return;
    }
    if (!provider) return;
    dispatchToProvider(event, provider);
  } catch (error) {
     
    console.error('[web-onboarding] analytics dispatch failed; event dropped:', event.name, error);
  }
}

export function trackOnboardingEvent(
  event: OnboardingAnalyticsEvent,
  options: {
    provider?: AnalyticsProvider;
    customTracker?: (e: OnboardingAnalyticsEvent) => void;
  } = {},
): void {
  dispatchAnalyticsEvent(event, options.provider, options.customTracker);
}
