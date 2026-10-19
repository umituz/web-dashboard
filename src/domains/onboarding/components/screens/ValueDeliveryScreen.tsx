import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PrimaryButton } from '../shared/PrimaryButton';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { ValueDeliveryScreenConfig } from '../../types/screens';

export interface ValueDeliveryScreenProps<TResult = unknown> {
  config: ValueDeliveryScreenConfig<TResult>;
  onNext: () => void;
}

/**
 * Shows the artifact produced earlier in the flow.
 * The default body is a JSON dump of `result` — deliberately generic. Screens are
 * expected to be customized per product; this default keeps templates runnable.
 */
export function ValueDeliveryScreen<TResult = unknown>({
  config,
  onNext,
}: ValueDeliveryScreenProps<TResult>) {
  const { labels } = useOnboardingIntl();
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current);
    },
    [],
  );

  async function handleShare() {
    if (!config.shareConfig) return;
    const { text, url } = config.shareConfig;
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ text, url });
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url ?? text);
        setCopied(true);
        if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current);
        copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // navigator.share rejects with AbortError when the user dismisses the sheet —
      // that is an expected outcome, not a failure worth logging.
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
         
        console.error('[web-onboarding] share failed', error);
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[rgb(var(--uob-primary-50))] text-[rgb(var(--uob-primary-500))]"
        aria-hidden="true"
      >
        <Sparkles className="h-10 w-10" />
      </div>
      <h2 className="text-3xl font-bold text-[rgb(var(--uob-text-primary))]">{config.title}</h2>
      <div className="w-full max-w-md rounded-2xl border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] p-6 text-left">
        <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-[rgb(var(--uob-text-primary))]">
          {JSON.stringify(config.result, null, 2)}
        </pre>
      </div>
      {config.shareConfig && (
        <div className="flex flex-col items-center gap-1 text-sm text-[rgb(var(--uob-text-muted))]">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-xl border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] px-4 py-2 text-sm font-semibold text-[rgb(var(--uob-text-primary))] transition-colors hover:border-[rgb(var(--uob-primary-500))]"
          >
            {copied ? labels.copied : labels.share}
          </button>
          <span>{config.shareConfig.text}</span>
        </div>
      )}
      <PrimaryButton onClick={onNext}>{config.cta ?? labels.continueAction}</PrimaryButton>
    </div>
  );
}
