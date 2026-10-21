import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { formatPattern } from '../../../internal/formatPattern';
import type { OnboardingLabels } from '../types/labels';

export const formatLabel = formatPattern;

export interface OnboardingIntl {
  labels: Readonly<OnboardingLabels>;
  locale: string | undefined;
}

export const OnboardingIntlContext = createContext<OnboardingIntl>({
  labels: undefined as unknown as OnboardingLabels,
  locale: undefined,
});

export interface OnboardingIntlProviderProps {
  labels: OnboardingLabels;
  locale?: string;
  children: ReactNode;
}

export function OnboardingIntlProvider({
  labels,
  locale,
  children,
}: OnboardingIntlProviderProps) {
  const value = useMemo<OnboardingIntl>(
    () => ({ labels, locale }),
    [labels, locale],
  );
  return (
    <OnboardingIntlContext.Provider value={value}>{children}</OnboardingIntlContext.Provider>

  );
}

export function useOnboardingIntl(): OnboardingIntl {
  return useContext(OnboardingIntlContext);
}
