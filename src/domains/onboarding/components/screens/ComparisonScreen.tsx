import { Check, X } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { ComparisonScreenConfig } from '../../types/screens';

export interface ComparisonScreenProps {
  config: ComparisonScreenConfig;
  onNext: () => void;
}

export function ComparisonScreen({ config, onNext }: ComparisonScreenProps) {
  const { labels } = useOnboardingIntl();
  return (
    <div className="udb-onb-proof">
      {config.title && <h2 className="udb-onb-title">{config.title}</h2>}

      <div className="udb-onb-compare">
        <ComparisonColumn heading={labels.withoutUs} items={config.before} tone="negative" />
        <ComparisonColumn heading={labels.withUs} items={config.after} tone="positive" />
      </div>

      <PrimaryButton onClick={onNext}>{config.cta ?? labels.continueAction}</PrimaryButton>

    </div>

  );
}

interface ComparisonColumnProps {
  heading: string;
  items: ReadonlyArray<string>;
  tone: 'positive' | 'negative';
}

function ComparisonColumn({ heading, items, tone }: ComparisonColumnProps) {
  const Icon = tone === 'positive' ? Check : X;
  return (
    <div className={`udb-onb-compare__col udb-onb-compare__col--${tone === 'positive' ? 'pos' : 'neg'}`}>
      <h3 className="udb-onb-compare__heading">{heading}</h3>

      <ul className="udb-onb-list">
        {items.map((item) => (
          <li key={item} className="udb-onb-compare__item">
            <Icon
              className={`udb-onb-icon--sm udb-onb-compare__icon udb-onb-compare__icon--${tone === 'positive' ? 'pos' : 'neg'}`}
              aria-hidden="true"
            />
            <span>{item}</span>

          </li>

        ))}
      </ul>

    </div>

  );
}
