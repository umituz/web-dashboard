import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import { BrandLogo } from "../../layouts/components";
import type {
  OnboardingConfig,
  OnboardingState,
  OnboardingWizardProps,
  StepProgressProps,
  StepNavigationProps,
} from "../types/onboarding";

/**
 * Step Progress Component
 */
const StepProgress = ({ currentStep, totalSteps, completedSteps = [] }: StepProgressProps) => {
  return (
    <div className="flex items-center gap-0 flex-1 justify-center">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isCompleted = completedSteps.includes(step) || step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                isCompleted || isCurrent
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : step}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "w-12 h-0.5 mx-1",
                  step < currentStep ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Step Navigation Component
 */
const StepNavigation = ({
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
}: StepNavigationProps) => {
  const t = (key: string) => key; // Simple i18n fallback

  return (
    <footer className="bg-background border-t border-border px-8 py-6 flex items-center justify-between">
      {currentStep > 1 ? (
        <Button
          variant="ghost"
          onClick={onPrev}
          className="rounded-full px-6"
          disabled={isSaving}
        >
          ← {prevLabel || t("onboarding.buttons.back")}
        </Button>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-3">
        {allowSkip && onSkip && currentStep < totalSteps && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="rounded-full px-6"
            disabled={isSaving}
          >
            {t("onboarding.buttons.skip")}
          </Button>
        )}

        <Button
          onClick={onNext}
          className="rounded-full px-12 h-12 text-base font-bold"
          disabled={!canGoNext || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("onboarding.buttons.finalizing")}
            </>
          ) : currentStep === totalSteps ? (
            nextLabel || t("onboarding.buttons.getStarted")
          ) : (
            t("onboarding.buttons.next")
          )}
        </Button>
      </div>
    </footer>
  );
};

/**
 * Onboarding Wizard Component
 *
 * Main onboarding container with step management
 */
export const OnboardingWizard = ({
  config,
  initialState,
  onComplete,
  onCancel,
}: OnboardingWizardProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // State management
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    connectedPlatforms: [],
    billingCycle: "monthly",
    stepData: {},
    ...initialState,
  });

  const totalSteps = config.steps.length;

  // Validate current step
  const canGoNext = useCallback(() => {
    const currentStepConfig = config.steps[currentStep - 1];
    if (currentStepConfig?.validate) {
      return currentStepConfig.validate(state);
    }
    return true;
  }, [config.steps, currentStep, state]);

  // Navigation handlers
  const goToNext = useCallback(async () => {
    if (currentStep < totalSteps) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
      setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
    } else {
      // Complete onboarding
      setSaving(true);
      try {
        await onComplete?.(state);
        navigate(config.completeRoute);
      } catch (error) {
        console.error("Onboarding completion error:", error);
        setSaving(false);
      }
    }
  }, [currentStep, totalSteps, state, onComplete, navigate, config.completeRoute]);

  const goToPrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      setState((prev) => ({ ...prev, currentStep: step }));
    }
  }, [totalSteps]);

  const updateState = useCallback((updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleCancel = useCallback(() => {
    onCancel?.();
    navigate(config.cancelRoute || "/");
  }, [onCancel, navigate, config.cancelRoute]);

  const handleSkip = useCallback(() => {
    if (currentStep < totalSteps) {
      goToNext();
    }
  }, [currentStep, totalSteps, goToNext]);

  // Render current step content
  const currentStepConfig = config.steps[currentStep - 1];
  const StepContent = currentStepConfig?.component;

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-3 flex items-center">
        <div className="flex items-center gap-2 mr-8">
          <BrandLogo size={28} />
          <span className="font-bold text-foreground">{config.brandName}</span>
        </div>

        {config.showProgress !== false && (
          <StepProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            completedSteps={completedSteps}
          />
        )}

        <div className="w-24" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {StepContent && typeof StepContent === 'function' ? (
            <StepContent
              state={state}
              updateState={updateState}
              goToNext={goToNext}
              goToPrev={goToPrev}
              goToStep={goToStep}
              config={config}
            />
          ) : StepContent ? (
            <>{StepContent}</>
          ) : null}
        </div>
      </main>

      {/* Footer Navigation */}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        canGoNext={canGoNext()}
        isSaving={saving}
        onNext={goToNext}
        onPrev={goToPrev}
        allowSkip={config.allowSkip}
        onSkip={handleSkip}
      />
    </div>
  );
};

export default OnboardingWizard;
