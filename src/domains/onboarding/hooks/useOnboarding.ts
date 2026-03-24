/**
 * Onboarding Hooks
 *
 * Custom React hooks for onboarding functionality
 */

import { useState, useCallback } from "react";
import type { OnboardingState, OnboardingConfig } from "../types/onboarding";

/**
 * Use Onboarding Hook
 *
 * Manages onboarding state and actions
 *
 * @param config - Onboarding configuration
 * @param initialState - Initial state
 * @returns Onboarding state and actions
 */
export function useOnboarding(
  config: OnboardingConfig,
  initialState?: Partial<OnboardingState>
) {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    connectedPlatforms: [],
    billingCycle: "monthly",
    stepData: {},
    ...initialState,
  });

  const totalSteps = config.steps.length;

  // Navigation actions
  const goToNext = useCallback(() => {
    const currentStepConfig = config.steps[state.currentStep - 1];

    // Validate if needed
    if (currentStepConfig?.validate) {
      const isValid = currentStepConfig.validate(state);
      if (!isValid) return false;
    }

    if (state.currentStep < totalSteps) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
      return true;
    }

    return false;
  }, [config.steps, state, totalSteps]);

  const goToPrev = useCallback(() => {
    if (state.currentStep > 1) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
      return true;
    }
    return false;
  }, [state.currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setState((prev) => ({ ...prev, currentStep: step }));
    }
  }, [totalSteps]);

  // State update action
  const updateState = useCallback((updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Validation helper
  const canGoNext = useCallback(() => {
    const currentStepConfig = config.steps[state.currentStep - 1];
    if (currentStepConfig?.validate) {
      return currentStepConfig.validate(state);
    }
    return true;
  }, [config.steps, state]);

  // Progress calculation
  const getProgress = useCallback(() => {
    return (state.currentStep / totalSteps) * 100;
  }, [state.currentStep, totalSteps]);

  // Is first step
  const isFirstStep = state.currentStep === 1;

  // Is last step
  const isLastStep = state.currentStep === totalSteps;

  return {
    // State
    state,
    currentStep: state.currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress: getProgress(),

    // Actions
    goToNext,
    goToPrev,
    goToStep,
    updateState,
    canGoNext,
  };
}

/**
 * Use Onboarding Step Hook
 *
 * Hook for managing individual step state
 *
 * @param stepId - Step identifier
 * @returns Step state and actions
 */
export function useOnboardingStep(stepId: string) {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const updateData = useCallback((updates: Record<string, unknown>) => {
    setData((prev) => ({ ...prev, ...updates }));
    setIsTouched(true);
  }, []);

  const validate = useCallback((validator: (data: Record<string, unknown>) => boolean) => {
    const valid = validator(data);
    setIsValid(valid);
    return valid;
  }, []);

  const reset = useCallback(() => {
    setData({});
    setIsValid(false);
    setIsTouched(false);
  }, []);

  return {
    data,
    isValid,
    isTouched,
    updateData,
    validate,
    reset,
  };
}
