/**
 * Onboarding Wizard
 *
 * Multi-step onboarding container. Delegates state, navigation, and
 * progress to `useOnboarding` so there's a single source of truth
 * for the wizard's lifecycle.
 */

import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@umituz/web-design-system/atoms";
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
    isFirstStep,
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
    <div className="min-h-screen bg-secondary flex flex-col">
      <header className="bg-background border-b border-border px-6 py-3 flex items-center">
        <div className="flex items-center gap-2 mr-8">
          <span className="font-bold text-foreground">{config.brandName}</span>
        </div>

        {config.showProgress !== false && (
          <StepProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            completedSteps={completedSteps}
          />
        )}

        <div className="w-24 flex justify-end">
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

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl w-full">
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
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
            <div className="text-center text-muted-foreground">
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

      {/* Suppress unused warning while keeping the binding available */}
      <span className="hidden">{String(isFirstStep)}</span>
    </div>
  );
};

export default OnboardingWizard;
