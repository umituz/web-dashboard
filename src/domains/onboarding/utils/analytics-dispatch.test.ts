import { describe, it, expect, vi, afterEach } from 'vitest';
import { dispatchAnalyticsEvent, trackOnboardingEvent } from './analytics-dispatch';
import type { OnboardingAnalyticsEvent } from '../types/config';

const event: OnboardingAnalyticsEvent = {
  name: 'onboarding_started',
  category: 'health',
  timestamp: 0,
};

afterEach(() => {
  vi.restoreAllMocks();
  delete (window as { gtag?: unknown }).gtag;
  delete (window as { amplitude?: unknown }).amplitude;
  delete (window as { mixpanel?: unknown }).mixpanel;
});

describe('analytics-dispatch — the "never throws" contract', () => {
  it('routes to the custom tracker when provided', () => {
    const tracker = vi.fn();
    dispatchAnalyticsEvent(event, 'custom', tracker);
    expect(tracker).toHaveBeenCalledExactlyOnceWith(event);
  });

  it('warns and drops (instead of throwing) for custom without a tracker', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(() => dispatchAnalyticsEvent(event, 'custom', undefined)).not.toThrow();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('customTracker');
  });

  it('never throws when the custom tracker itself throws', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const tracker = () => {
      throw new Error('tracker outage');
    };
    expect(() => dispatchAnalyticsEvent(event, 'custom', tracker)).not.toThrow();
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toContain('dropped');
  });

  it('is a no-op without a provider', () => {
    const tracker = vi.fn();
    expect(() => dispatchAnalyticsEvent(event, undefined, tracker)).not.toThrow();
    expect(tracker).not.toHaveBeenCalled();
  });
});

describe('analytics-dispatch — provider routing', () => {
  it('dispatches to gtag for google-analytics', () => {
    const gtag = vi.fn();
    (window as { gtag?: unknown }).gtag = gtag;
    dispatchAnalyticsEvent(event, 'google-analytics', undefined);
    expect(gtag).toHaveBeenCalledExactlyOnceWith('event', 'onboarding_started', event);
  });

  it('dispatches to amplitude via getInstance().logEvent', () => {
    const logEvent = vi.fn();
    (window as { amplitude?: unknown }).amplitude = {
      getInstance: () => ({ logEvent }),
    };
    dispatchAnalyticsEvent(event, 'amplitude', undefined);
    expect(logEvent).toHaveBeenCalledExactlyOnceWith('onboarding_started', event);
  });

  it('dispatches to mixpanel.track', () => {
    const track = vi.fn();
    (window as { mixpanel?: unknown }).mixpanel = { track };
    dispatchAnalyticsEvent(event, 'mixpanel', undefined);
    expect(track).toHaveBeenCalledExactlyOnceWith('onboarding_started', event);
  });

  it('survives a provider global that throws', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    (window as { gtag?: unknown }).gtag = () => {
      throw new Error('gtag exploded');
    };
    expect(() => dispatchAnalyticsEvent(event, 'google-analytics', undefined)).not.toThrow();
    expect(error).toHaveBeenCalledTimes(1);
  });
});

describe('trackOnboardingEvent', () => {
  it('forwards provider + tracker options', () => {
    const tracker = vi.fn();
    trackOnboardingEvent(event, { provider: 'custom', customTracker: tracker });
    expect(tracker).toHaveBeenCalledExactlyOnceWith(event);
  });

  it('defaults to a silent no-op', () => {
    expect(() => trackOnboardingEvent(event)).not.toThrow();
  });
});
