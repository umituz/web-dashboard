import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOnboardingAnalytics } from './useOnboardingAnalytics';
import type { OnboardingAnalyticsEvent } from '../../types/config';

const event: OnboardingAnalyticsEvent = {
  name: 'onboarding_step_completed',
  stepId: 'goal',
  stepType: 'goal-question',
  index: 1,
  timestamp: 0,
};

describe('useOnboardingAnalytics', () => {
  it('fires events through the custom tracker when enabled', () => {
    const tracker = vi.fn();
    const { result } = renderHook(() =>
      useOnboardingAnalytics({ trackEvents: true, provider: 'custom', customTracker: tracker }),
    );
    result.current.trackEvent(event);
    expect(tracker).toHaveBeenCalledExactlyOnceWith(event);
  });

  it('trackFunnel is an alias of trackEvent (same dispatch)', () => {
    const tracker = vi.fn();
    const { result } = renderHook(() =>
      useOnboardingAnalytics({ trackEvents: true, provider: 'custom', customTracker: tracker }),
    );
    result.current.trackFunnel(event);
    expect(tracker).toHaveBeenCalledExactlyOnceWith(event);
  });

  it('never dispatches when trackEvents is false', () => {
    const tracker = vi.fn();
    const { result } = renderHook(() =>
      useOnboardingAnalytics({ trackEvents: false, provider: 'custom', customTracker: tracker }),
    );
    result.current.trackEvent(event);
    expect(tracker).not.toHaveBeenCalled();
    expect(result.current.enabled).toBe(false);
  });

  it('never dispatches without a config at all', () => {
    const { result } = renderHook(() => useOnboardingAnalytics(undefined));
    expect(() => result.current.trackEvent(event)).not.toThrow();
    expect(result.current.enabled).toBe(false);
  });

  it('keeps callback identity stable across re-renders', () => {
    const tracker = vi.fn();
    const { result, rerender } = renderHook(() =>
      useOnboardingAnalytics({ trackEvents: true, provider: 'custom', customTracker: tracker }),
    );
    const first = result.current.trackEvent;
    rerender();
    expect(result.current.trackEvent).toBe(first);
  });

  it('survives a throwing tracker (analytics is an observation channel)', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { result } = renderHook(() =>
      useOnboardingAnalytics({
        trackEvents: true,
        provider: 'custom',
        customTracker: () => {
          throw new Error('boom');
        },
      }),
    );
    expect(() => result.current.trackEvent(event)).not.toThrow();
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
