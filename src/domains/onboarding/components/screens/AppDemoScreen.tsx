import { useState } from 'react';
import { PrimaryButton } from '../shared/PrimaryButton';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { AppDemoScreenConfig } from '../../types/screens';

export interface AppDemoScreenProps {
  config: AppDemoScreenConfig;
  onNext: (data: { result: unknown }) => void;
}

export function AppDemoScreen({ config, onNext }: AppDemoScreenProps) {
  const { labels } = useOnboardingIntl();
  const [result, setResult] = useState<unknown>(null);
  // The demo component is a consumer-supplied component reference held in config —
  // aliasing it here is a lookup, not creation.
  const Demo = config.demo.component;

  return (
    <div className="flex flex-1 flex-col gap-6">
      {config.title && (
        <h2 className="text-2xl font-semibold text-[rgb(var(--uob-text-primary))] sm:text-3xl">
          {config.title}
        </h2>
      )}
      <div className="rounded-2xl border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface-muted))] p-4">
        <Demo
          {...((config.demo.props ?? {}) as Record<string, unknown>)}
          onSave={(value: unknown) => {
            setResult(value);
            config.demo.onSave(value);
          }}
        />
      </div>
      <PrimaryButton onClick={() => onNext({ result })} disabled={result === null}>
        {config.cta ?? labels.continueWithResult}
      </PrimaryButton>
    </div>
  );
}
