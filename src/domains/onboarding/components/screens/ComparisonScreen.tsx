import { Check, X } from 'lucide-react';
import { PrimaryButton } from '../shared/PrimaryButton';
import { cn } from '../../theme/cn';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { ComparisonScreenConfig } from '../../types/screens';

export interface ComparisonScreenProps {
  config: ComparisonScreenConfig;
  onNext: () => void;
}

export function ComparisonScreen({ config, onNext }: ComparisonScreenProps) {
  const { labels } = useOnboardingIntl();
  return (
    <div className="flex flex-1 flex-col gap-6">
      {config.title && (
        <h2 className="text-2xl font-semibold text-[rgb(var(--uob-text-primary))] sm:text-3xl">
          {config.title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
  const colorClass =
    tone === 'positive'
      ? 'border-[rgb(var(--uob-success))] bg-[rgb(var(--uob-surface))]'
      : 'border-[rgb(var(--uob-error))] bg-[rgb(var(--uob-surface))]';
  const iconColor =
    tone === 'positive'
      ? 'text-[rgb(var(--uob-success))]'
      : 'text-[rgb(var(--uob-error))]';
  return (
    <div className={cn('flex flex-col gap-3 rounded-2xl border p-5', colorClass)}>
      <h3 className="text-lg font-semibold text-[rgb(var(--uob-text-primary))]">{heading}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-[rgb(var(--uob-text-primary))]">
            <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', iconColor)} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
