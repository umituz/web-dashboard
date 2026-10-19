import { PrimaryButton } from '../shared/PrimaryButton';
import { renderBundledIcon } from '../shared/renderBundledIcon';
import { doesIconNameResolve } from '../../predicates/icon-name-resolves';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { WelcomeScreenConfig } from '../../types/screens';

export interface WelcomeScreenProps {
  config: WelcomeScreenConfig;
  onNext: () => void;
  isLoading?: boolean;
}

export function WelcomeScreen({ config, onNext, isLoading }: WelcomeScreenProps) {
  const { labels } = useOnboardingIntl();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      {doesIconNameResolve(config.heroIconName) && (
        <div
          className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[rgb(var(--uob-primary-50))] text-[rgb(var(--uob-primary-500))]"
          aria-hidden="true"
        >
          {renderBundledIcon(config.heroIconName, 'h-12 w-12')}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {config.title && (
          <h1 className="text-4xl font-bold text-[rgb(var(--uob-text-primary))] sm:text-5xl">
            {config.title}
          </h1>
        )}
        {config.subtitle && (
          <p className="text-lg text-[rgb(var(--uob-text-muted))]">{config.subtitle}</p>
        )}
        {config.highlight && (
          <p className="text-sm font-semibold uppercase tracking-wide text-[rgb(var(--uob-primary-500))]">
            {config.highlight}
          </p>
        )}
      </div>
      {config.cta && (
        <PrimaryButton onClick={config.onCta ?? onNext} loading={isLoading}>
          {config.cta}
        </PrimaryButton>
      )}
      {!config.cta && (
        <PrimaryButton onClick={config.onCta ?? onNext} loading={isLoading}>
          {labels.continueAction}
        </PrimaryButton>
      )}
    </div>
  );
}
