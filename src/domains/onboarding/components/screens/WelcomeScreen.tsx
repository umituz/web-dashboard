import { PrimaryButton } from '../PrimaryButton';
import { renderBundledIcon } from '../renderBundledIcon';
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
    <div className="udb-onb-stage udb-onb-stage--wide">
      {doesIconNameResolve(config.heroIconName) && (
        <div className="udb-onb-hero udb-onb-hero--xl" aria-hidden="true">
          {renderBundledIcon(config.heroIconName, 'udb-onb-icon--xl')}
        </div>

      )}
      <div className="udb-onb-welcome__group">
        {config.title && <h1 className="udb-onb-welcome__title">{config.title}</h1>}

        {config.subtitle && <p className="udb-onb-welcome__subtitle">{config.subtitle}</p>}

        {config.highlight && <p className="udb-onb-welcome__highlight">{config.highlight}</p>}

      </div>

      <PrimaryButton onClick={config.onCta ?? onNext} loading={isLoading}>
        {config.cta ?? labels.continueAction}
      </PrimaryButton>

    </div>

  );
}
