import { useState } from 'react';
import { PrimaryButton } from '../shared/PrimaryButton';
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

  // Step lifecycle analytics (`onboarding_step_completed`) are owned by the
  // orchestrator — the screen stays presentation-only.

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
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      {config.title && (
        <h2 className="text-3xl font-bold text-[rgb(var(--uob-text-primary))]">{config.title}</h2>
      )}
      {config.subtitle && (
        <p className="text-base text-[rgb(var(--uob-text-muted))]">{config.subtitle}</p>
      )}
      {error && (
        <p
          role="alert"
          className="w-full rounded-md border border-[rgb(var(--uob-error))] bg-[rgb(var(--uob-error))]/10 p-3 text-sm text-[rgb(var(--uob-error))]"
        >
          {error}
        </p>
      )}
      <div className="flex w-full flex-col gap-3">
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
            className="text-sm font-semibold text-[rgb(var(--uob-text-muted))] underline-offset-4 hover:underline disabled:opacity-50"
          >
            {config.skipText ?? labels.skipForNow}
          </button>
        )}
      </div>
    </div>
  );
}
