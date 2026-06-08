/**
 * Onboarding - Step Navigation Footer
 *
 * Renders the wizard's bottom action bar: back, skip, next/getStarted.
 * All labels are i18n keys; the consumer maps them to localized strings.
 */

import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@umituz/web-design-system/atoms";

/**
 * Centralized i18n keys for navigation labels.
 * Components stay free of hardcoded UI strings.
 */
export const STEP_NAVIGATION_KEYS = {
  back: 'onboarding.buttons.back',
  skip: 'onboarding.buttons.skip',
  next: 'onboarding.buttons.next',
  getStarted: 'onboarding.buttons.getStarted',
  finalizing: 'onboarding.buttons.finalizing',
} as const;

export type StepNavigationKey =
  (typeof STEP_NAVIGATION_KEYS)[keyof typeof STEP_NAVIGATION_KEYS];

/**
 * Translation function shape consumers must inject.
 * The wizard never depends on a specific i18n library.
 */
export type Translate = (key: string) => string;

export interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  isSaving?: boolean;
  nextLabel?: string;
  prevLabel?: string;
  onNext: () => void;
  onPrev: () => void;
  allowSkip?: boolean;
  onSkip?: () => void;
  translate: Translate;
}

export const StepNavigation = ({
  currentStep,
  totalSteps,
  canGoNext,
  isSaving = false,
  nextLabel,
  prevLabel,
  onNext,
  onPrev,
  allowSkip = false,
  onSkip,
  translate: t,
}: StepNavigationProps) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <footer className="bg-background border-t border-border px-8 py-6 flex items-center justify-between">
      {currentStep > 1 ? (
        <Button
          variant="ghost"
          onClick={onPrev}
          className="rounded-full px-6"
          disabled={isSaving}
        >
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          {prevLabel ?? t(STEP_NAVIGATION_KEYS.back)}
        </Button>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-3">
        {allowSkip && onSkip && !isLastStep && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="rounded-full px-6"
            disabled={isSaving}
          >
            {t(STEP_NAVIGATION_KEYS.skip)}
          </Button>
        )}

        <Button
          onClick={onNext}
          className="rounded-full px-12 h-12 text-base font-bold"
          disabled={!canGoNext || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
              {t(STEP_NAVIGATION_KEYS.finalizing)}
            </>
          ) : isLastStep ? (
            nextLabel ?? t(STEP_NAVIGATION_KEYS.getStarted)
          ) : (
            t(STEP_NAVIGATION_KEYS.next)
          )}
        </Button>
      </div>
    </footer>
  );
};
