import { useCallback, useEffect, useMemo, useRef } from 'react';
import type {
  AnalyticsConfig,
  OnboardingAnalyticsEvent,
} from '../../types/config';
import { trackOnboardingEvent } from '../../utils/analytics-dispatch';

export interface UseOnboardingAnalyticsReturn {
  trackEvent: (event: OnboardingAnalyticsEvent) => void;
  /** Alias of `trackEvent` kept for call-site readability on funnel events. */
  trackFunnel: (event: OnboardingAnalyticsEvent) => void;
  enabled: boolean;
}

/**
 * Hook façade for analytics dispatch.
 * Single responsibility: provide a stable callback that honors the analytics config.
 *
 * The returned callbacks are identity-stable across re-renders even when the
 * consumer recreates the `config` object every render — event handlers and
 * effects that depend on them do not re-fire spuriously. The latest config is
 * read through a ref synchronized after each commit.
 *
 * Dispatch never throws: analytics failures are logged by the dispatcher and
 * dropped (see `utils/analytics-dispatch`).
 */
export function useOnboardingAnalytics(config: AnalyticsConfig | undefined): UseOnboardingAnalyticsReturn {
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const enabled = config?.trackEvents === true;

  const dispatch = useCallback(
    (event: OnboardingAnalyticsEvent) => {
      if (!enabled) return;
      const current = configRef.current;
      if (!current) return;
      trackOnboardingEvent(event, {
        provider: current.provider,
        customTracker: current.customTracker,
      });
    },
    [enabled],
  );

  const trackEvent = useCallback(
    (event: OnboardingAnalyticsEvent) => dispatch(event),
    [dispatch],
  );

  const trackFunnel = useCallback(
    (event: OnboardingAnalyticsEvent) => dispatch(event),
    [dispatch],
  );

  return useMemo(
    () => ({ trackEvent, trackFunnel, enabled }),
    [trackEvent, trackFunnel, enabled],
  );
}
