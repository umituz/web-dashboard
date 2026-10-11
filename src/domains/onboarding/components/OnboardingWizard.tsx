/**
 * Onboarding Wizard
 *
 * Multi-step onboarding container. Delegates state, navigation, and
 * progress to `useOnboarding` so there's a single source of truth
 * for the wizard's lifecycle. Styling is entirely `udb-onboarding*`
 * classes from the package stylesheet.
 */

import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../primitives";
import { useOnboarding } from "../hooks/useOnboarding";
import { StepProgress } from "./StepProgress";
import { StepNavigation } from "./StepNavigation";
import type {
  OnboardingWizardProps,
  OnboardingError,
} from "../types/onboarding";

/**
 * Onboarding Wizard Component
 */
export const OnboardingWizard = ({
  config,
  initialState,
  onComplete,
  onCancel,
}: OnboardingWizardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<OnboardingError | null>(null);

  const {
    state,
    currentStep,
    totalSteps,
    isLastStep,
    goToNext,
    goToPrev,
    goToStep,
    updateState,
  } = useOnboarding(config, initialState);

  const completedSteps = useMemo(() => {
    if (currentStep <= 1) return [] as number[];
    return Array.from({ length: currentStep - 1 }, (_, i) => i + 1);
  }, [currentStep]);

  const validateCurrentStep = useCallback((): boolean => {
    const currentStepConfig = config.steps[currentStep - 1];
    return currentStepConfig?.validate ? currentStepConfig.validate(state) : true;
  }, [config.steps, currentStep, state]);

  const handleNext = useCallback(async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (isLastStep) {
      setSaving(true);
      setError(null);
      try {
        await onComplete?.(state);
        navigate(config.completeRoute);
      } catch (err) {
        // Surface the failure to the user — silently logging is
        // forbidden on critical paths.
        setError({
          step: currentStep,
          message: err instanceof Error ? err.message : 'onboarding.errors.completionFailed',
        });
      } finally {
        setSaving(false);
      }
      return;
    }

    goToNext();
  }, [
    config.completeRoute,
    currentStep,
    goToNext,
    isLastStep,
    navigate,
    onComplete,
    state,
    validateCurrentStep,
  ]);

  const handlePrev = useCallback(() => {
    goToPrev();
  }, [goToPrev]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    navigate(config.cancelRoute ?? "/");
  }, [config.cancelRoute, navigate, onCancel]);

  const handleSkip = useCallback(() => {
    if (!isLastStep) {
      handleNext();
    }
  }, [handleNext, isLastStep]);

  const currentStepConfig = config.steps[currentStep - 1];
  const StepContent = currentStepConfig?.component;

  return (
    <div className="udb-root udb-onboarding">
      <header className="udb-onboarding__header">
        <div className="udb-onboarding__brand">
          <span className="udb-onboarding__brand-name">{config.brandName}</span>
        </div>

        {config.showProgress !== false && (
          <StepProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            completedSteps={completedSteps}
          />
        )}

        <div className="udb-onboarding__header-actions">
          {config.allowCancel !== false && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={saving}
            >
              {t('onboarding.buttons.cancel')}
            </Button>
          )}
        </div>
      </header>

      <main className="udb-onboarding__main">
        <div className="udb-onboarding__content">
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="udb-onboarding__error"
            >
              {t(error.message)}
            </div>
          )}

          {StepContent ? (
            typeof StepContent === 'function' ? (
              <StepContent
                state={state}
                updateState={updateState}
                goToNext={goToNext}
                goToPrev={goToPrev}
                goToStep={goToStep}
                config={config}
              />
            ) : (
              StepContent
            )
          ) : (
            <div className="udb-onboarding__empty">
              {t('onboarding.errors.stepNotConfigured')}
            </div>
          )}
        </div>
      </main>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        canGoNext={validateCurrentStep()}
        isSaving={saving}
        onNext={handleNext}
        onPrev={handlePrev}
        allowSkip={config.allowSkip}
        onSkip={handleSkip}
        translate={t}
      />
    </div>
  );
};

export default OnboardingWizard;
