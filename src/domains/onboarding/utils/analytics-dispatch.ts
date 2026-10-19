import type {
  AnalyticsProvider,
  OnboardingAnalyticsEvent,
} from '../types/config';

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  amplitude?: {
    getInstance: () => { logEvent: (name: string, props: Record<string, unknown>) => void };
  };
  mixpanel?: { track: (name: string, props: Record<string, unknown>) => void };
};

function dispatchToProvider(event: OnboardingAnalyticsEvent, provider: AnalyticsProvider): void {
  if (typeof window === 'undefined') return;   const win = window as AnalyticsWindow;
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
      return;   }
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
