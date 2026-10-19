import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { OnboardingLabels } from '../types/labels';

export const defaultOnboardingLabels: Readonly<OnboardingLabels> = {
  continueAction: 'Continue',
  back: 'Back',
  skip: 'Skip',
  loading: 'Loading…',
  stepOfPattern: 'Step {current} of {total}',
  countOfPattern: '{current} of {total}',

  selectAllThatApply: 'Select all that apply',
  selectOne: 'Select one',
  pickUpToPattern: 'Pick up to {max}',
  pickTheOne: 'Pick the one that bothers you most',
  tailorExperience: 'Tailor the experience to your needs',

  agree: 'Agree',
  disagree: 'Disagree',
  swipeHint: 'Swipe right if you agree, left if you don’t. Or use the arrow keys.',
  allDone: 'All done — that was easy.',

  withoutUs: 'Without us',
  withUs: 'With us',

  previous: 'Previous',
  nextAction: 'Next',

  continueWithResult: 'Continue with my result',

  allowAccess: 'Allow access',
  permissionRequestFailed: 'Permission request failed',

  continueWithEmail: 'Continue with email',
  continueWithGoogle: 'Continue with Google',
  continueWithApple: 'Continue with Apple',
  continueWithGitHub: 'Continue with GitHub',
  skipForNow: 'Skip for now',
  signInFailed: 'Sign-in failed',

  couldNotStartTrial: 'Could not start trial',
  trialDaysPattern: '{count}-day free trial',
  trialIntroPattern: '{price} for the first {days} days',
  cancelAnytimeNote: 'Cancel anytime. No hidden fees.',

  share: 'Share',
  copied: 'Copied!',

  somethingWentWrong: 'Something went wrong',
  unexpectedError: 'An unexpected error occurred during onboarding.',
  tryAgain: 'Try again',
};

export function formatLabel(
  pattern: string,
  vars: Record<string, string | number>,
): string {
  return pattern.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export interface OnboardingIntl {
  labels: Readonly<OnboardingLabels>;
    locale: string | undefined;
}

export const OnboardingIntlContext = createContext<OnboardingIntl>({
  labels: defaultOnboardingLabels,
  locale: undefined,
});

export interface OnboardingIntlProviderProps {
  labels?: Partial<OnboardingLabels>;
  locale?: string;
  children: ReactNode;
}

export function OnboardingIntlProvider({
  labels,
  locale,
  children,
}: OnboardingIntlProviderProps) {
  const value = useMemo<OnboardingIntl>(
    () => ({
      labels: labels ? { ...defaultOnboardingLabels, ...labels } : defaultOnboardingLabels,
      locale,
    }),
    [labels, locale],
  );
  return (
    <OnboardingIntlContext.Provider value={value}>{children}</OnboardingIntlContext.Provider>
  );
}

export function useOnboardingIntl(): OnboardingIntl {
  return useContext(OnboardingIntlContext);
}
