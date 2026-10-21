import { useState } from 'react';
import { PrimaryButton } from '../PrimaryButton';
import {
  accountGateAllowsSkip,
  hasOnSignIn,
} from '../../predicates/has-handler';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { AccountGateScreenConfig, SignInMethod } from '../../types/screens';
import type { OnboardingLabels } from '../../types/config';

export interface AccountGateScreenProps {
  config: AccountGateScreenConfig;
  onNext: (data: { signedIn: boolean; method?: SignInMethod }) => void;
}

function methodLabel(method: SignInMethod, labels: OnboardingLabels): string {
  switch (method) {
    case 'email':
      return labels.continueWithEmail;
    case 'google':
      return labels.continueWithGoogle;
    case 'apple':
      return labels.continueWithApple;
    case 'github':
      return labels.continueWithGitHub;
  }
}

export function AccountGateScreen({ config, onNext }: AccountGateScreenProps) {
  const { labels } = useOnboardingIntl();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(method: SignInMethod) {
    setBusy(true);
    setError(null);
    try {
      const result = await config.onSignIn(method);
      onNext(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : labels.signInFailed;
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="udb-onb-stage">
      {config.title && <h2 className="udb-onb-title udb-onb-title--display">{config.title}</h2>}

      {config.subtitle && <p className="udb-onb-lead">{config.subtitle}</p>}

      {error && (
        <p role="alert" className="udb-onb-error">
          {error}
        </p>

      )}
      <div className="udb-onb-question__body">
        {config.signInMethod && hasOnSignIn(config) && (
          <PrimaryButton
            onClick={() => handleSignIn(config.signInMethod as SignInMethod)}
            loading={busy}
          >
            {methodLabel(config.signInMethod, labels)}
          </PrimaryButton>

        )}
        {accountGateAllowsSkip(config) && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onNext({ signedIn: false })}
            className="udb-onb-link"
          >
            {config.skipText ?? labels.skipForNow}
          </button>

        )}
      </div>

    </div>

  );
}
