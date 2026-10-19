import { useCallback, useEffect, useMemo, useRef } from 'react';
import type {
  AnalyticsConfig,
  OnboardingAnalyticsEvent,
} from '../types/config';
import { trackOnboardingEvent } from '../utils/analytics-dispatch';

export interface UseOnboardingAnalyticsReturn {
  trackEvent: (event: OnboardingAnalyticsEvent) => void;
    trackFunnel: (event: OnboardingAnalyticsEvent) => void;
  enabled: boolean;
}

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
