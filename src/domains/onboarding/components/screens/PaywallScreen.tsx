import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { PrimaryButton } from '../shared/PrimaryButton';
import { renderBundledIcon } from '../shared/renderBundledIcon';
import { useOnboardingAnalytics } from '../hooks/useOnboardingAnalytics';
import { doesIconNameResolve } from '../../predicates/icon-name-resolves';
import { formatCountWithLocale } from '../../calc/count-with-locale';
import { formatLabel, useOnboardingIntl } from '../OnboardingIntl';
import type { PaywallScreenConfig } from '../../types/screens';
import type { AnalyticsConfig } from '../../types/config';

export interface PaywallScreenProps {
  config: PaywallScreenConfig;
  onNext: (data: { accepted: boolean; trialStarted: boolean }) => void;
  analytics?: AnalyticsConfig;
}

/**
 * Hard paywall with trial.
 *
 * Error contract: if `onAccept` throws (network failure, provider outage), the
 * user STAYS on this screen with a retryable error. A failed purchase attempt
 * must never silently advance the user past the paywall.
 */
export function PaywallScreen({ config, onNext, analytics }: PaywallScreenProps) {
  const { labels, locale } = useOnboardingIntl();
  const { trackEvent } = useOnboardingAnalytics(analytics);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // "Viewed" is a view event — fire when the paywall is shown, not on interaction.
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
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-bold text-[rgb(var(--uob-text-primary))] sm:text-4xl">
          {config.title}
        </h2>
        <p className="text-base text-[rgb(var(--uob-text-muted))]">{config.subtitle}</p>
      </div>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border-2 border-[rgb(var(--uob-primary-500))] bg-[rgb(var(--uob-primary-50))] p-6 text-center"
      >
        <div className="text-3xl font-bold text-[rgb(var(--uob-primary-700))]">{config.price}</div>
        <div className="mt-1 text-sm text-[rgb(var(--uob-text-muted))]">
          {config.trialPrice !== undefined
            ? formatLabel(labels.trialIntroPattern, {
                price: config.trialPrice,
                days: config.trialDays,
              })
            : formatLabel(labels.trialDaysPattern, { count: config.trialDays })}
        </div>
      </motion.div>
      <ul className="flex flex-col gap-2">
        {config.features.map((feature, i) => (
          <li
            key={`${feature.text}-${i}`}
            className={
              feature.highlighted
                ? 'flex items-start gap-3 rounded-lg border border-[rgb(var(--uob-primary-500))] bg-[rgb(var(--uob-primary-50))] p-3'
                : 'flex items-start gap-3 rounded-lg border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] p-3'
            }
          >
            {doesIconNameResolve(feature.iconName) && (
              <span className="mt-0.5 text-[rgb(var(--uob-primary-500))]">
                {renderBundledIcon(feature.iconName, 'h-5 w-5')}
              </span>
            )}
            <span className="text-sm text-[rgb(var(--uob-text-primary))]">{feature.text}</span>
          </li>
        ))}
      </ul>
      {config.socialProof && (
        <p className="text-center text-sm text-[rgb(var(--uob-text-muted))]">
          {config.socialProof.text} ({formatCountWithLocale(config.socialProof.count, locale)}+ users)
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-md border border-[rgb(var(--uob-error))] bg-[rgb(var(--uob-error))]/10 p-3 text-sm text-[rgb(var(--uob-error))]"
        >
          {error}
        </p>
      )}
      <div className="flex flex-col gap-2">
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
            className="text-sm font-semibold text-[rgb(var(--uob-text-muted))] underline-offset-4 hover:underline disabled:opacity-50"
          >
            {config.secondaryCta}
          </button>
        )}
      </div>
      <p className="flex items-center justify-center gap-1 text-xs text-[rgb(var(--uob-text-muted))]">
        <ShieldCheck className="h-3.5 w-3.5" />
        {labels.cancelAnytimeNote}
      </p>
    </div>
  );
}
