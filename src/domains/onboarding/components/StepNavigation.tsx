/**
 * Onboarding - Step Navigation Footer
 *
 * Renders the wizard's bottom action bar: back, skip, next/getStarted.
 * All labels are i18n keys; the consumer maps them to localized strings.
 */

import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../../../primitives";

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
    <footer className="udb-onboarding__footer">
      {currentStep > 1 ? (
        <Button
          variant="ghost"
          onClick={onPrev}
          className="udb-onboarding__footer-btn"
          disabled={isSaving}
        >
          <ArrowLeft className="udb-onboarding__footer-icon" aria-hidden="true" />
          {prevLabel ?? t(STEP_NAVIGATION_KEYS.back)}
        </Button>
      ) : (
        <div />
      )}

      <div className="udb-onboarding__footer-actions">
        {allowSkip && onSkip && !isLastStep && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="udb-onboarding__footer-btn"
            disabled={isSaving}
          >
            {t(STEP_NAVIGATION_KEYS.skip)}
          </Button>
        )}

        <Button
          onClick={onNext}
          className="udb-onboarding__footer-next"
          disabled={!canGoNext || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="udb-onboarding__footer-icon udb-spin" aria-hidden="true" />
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
