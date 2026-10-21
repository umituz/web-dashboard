import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { renderBundledIcon } from '../renderBundledIcon';
import { useOnboardingAnalytics } from '../../hooks/useOnboardingAnalytics';
import { doesIconNameResolve } from '../../predicates/icon-name-resolves';
import { formatCountWithLocale } from '../../calc/count-with-locale';
import { cn } from '@umituz/web-design-system/utils/cn';
import { formatLabel, useOnboardingIntl } from '../OnboardingIntl';
import type { PaywallScreenConfig } from '../../types/screens';
import type { AnalyticsConfig } from '../../types/config';

export interface PaywallScreenProps {
  config: PaywallScreenConfig;
  onNext: (data: { accepted: boolean; trialStarted: boolean }) => void;
  analytics?: AnalyticsConfig;
}

export function PaywallScreen({ config, onNext, analytics }: PaywallScreenProps) {
  const { labels, locale } = useOnboardingIntl();
  const { trackEvent } = useOnboardingAnalytics(analytics);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent({ name: 'paywall_viewed', stepId: config.id, timestamp: Date.now() });
  }, [trackEvent, config.id]);

  async function handleAccept() {
    setBusy(true);
    setError(null);
    try {
      const result = await config.onAccept();
      trackEvent({
        name: result.accepted ? 'paywall_accepted' : 'paywall_declined',
        stepId: config.id,
        price: config.price,
        timestamp: Date.now(),
      });
      onNext(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : labels.couldNotStartTrial;
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="udb-onb-proof">
      <div className="udb-onb-question__head udb-onb-question__head--center">
        <h2 className="udb-onb-title udb-onb-title--display">{config.title}</h2>

        <p className="udb-onb-lead">{config.subtitle}</p>

      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="udb-onb-price"
      >
        <div className="udb-onb-price__amount">{config.price}</div>

        <div className="udb-onb-price__terms">
          {config.trialPrice !== undefined
            ? formatLabel(labels.trialIntroPattern, {
                price: config.trialPrice,
                days: config.trialDays,
              })
            : formatLabel(labels.trialDaysPattern, { count: config.trialDays })}
        </div>

      </motion.div>

      <ul className="udb-onb-list">
        {config.features.map((feature, i) => (
          <li
            key={`${feature.text}-${i}`}
            className={cn('udb-onb-feature', feature.highlighted && 'udb-onb-feature--hl')}
          >
            {doesIconNameResolve(feature.iconName) && (
              <span className="udb-onb-feature__icon">
                {renderBundledIcon(feature.iconName, 'udb-onb-icon')}
              </span>

            )}
            <span>{feature.text}</span>

          </li>

        ))}
      </ul>

      {config.socialProof && (
        <p className="udb-onb-note">
          {config.socialProof.text} ({formatCountWithLocale(config.socialProof.count, locale)}+ users)
        </p>

      )}
      {error && (
        <p role="alert" className="udb-onb-error">
          {error}
        </p>

      )}
      <div className="udb-onb-question__body">
        <PrimaryButton onClick={handleAccept} loading={busy}>
          {config.cta}
        </PrimaryButton>

        {config.secondaryCta && (
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              trackEvent({ name: 'paywall_declined', stepId: config.id, timestamp: Date.now() });
              config.onSecondaryCta?.();
              onNext({ accepted: false, trialStarted: false });
            }}
            className="udb-onb-link"
          >
            {config.secondaryCta}
          </button>

        )}
      </div>

      <p className="udb-onb-note">
        <ShieldCheck className="udb-onb-icon--xs" />
        {labels.cancelAnytimeNote}
      </p>

    </div>

  );
}
