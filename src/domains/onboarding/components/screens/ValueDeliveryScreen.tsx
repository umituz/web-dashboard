import { useEffect, useRef, useState } from 'react';
import { Button } from '@umituz/web-design-system/atoms';
import { Sparkles } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { ValueDeliveryScreenConfig } from '../../types/screens';

export interface ValueDeliveryScreenProps<TResult = unknown> {
  config: ValueDeliveryScreenConfig<TResult>;
  onNext: () => void;
}

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
            if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.error('[onboarding] share failed', error);
      }
    }
  }

  return (
    <div className="udb-onb-stage">
      <div className="udb-onb-hero udb-onb-hero--lg" aria-hidden="true">
        <Sparkles className="udb-onb-icon--lg" />
      </div>

      <h2 className="udb-onb-title udb-onb-title--display">{config.title}</h2>

      <div className="udb-onb-result">
        <pre className="udb-onb-result__pre">{JSON.stringify(config.result, null, 2)}</pre>

      </div>

      {config.shareConfig && (
        <div className="udb-onb-share">
          <Button variant="outline" size="sm" onClick={handleShare}>
            {copied ? labels.copied : labels.share}
          </Button>

          <span>{config.shareConfig.text}</span>

        </div>

      )}
      <PrimaryButton onClick={onNext}>{config.cta ?? labels.continueAction}</PrimaryButton>

    </div>

  );
}
