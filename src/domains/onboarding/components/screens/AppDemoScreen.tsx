import { useState } from 'react';
import { PrimaryButton } from '../PrimaryButton';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { AppDemoScreenConfig } from '../../types/screens';

export interface AppDemoScreenProps {
  config: AppDemoScreenConfig;
  onNext: (data: { result: unknown }) => void;
}

export function AppDemoScreen({ config, onNext }: AppDemoScreenProps) {
  const { labels } = useOnboardingIntl();
  const [result, setResult] = useState<unknown>(null);
  const Demo = config.demo.component;

  return (
    <div className="udb-onb-proof">
      {config.title && <h2 className="udb-onb-title">{config.title}</h2>}

      <div className="udb-onb-demo">
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
