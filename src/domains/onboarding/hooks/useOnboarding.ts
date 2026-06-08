/**
 * Onboarding Hooks
 *
 * Custom React hooks for onboarding functionality.
 * Uses functional state updates to keep callbacks referentially stable
 * across state changes, so downstream re-renders are minimized.
 */

import { useState, useCallback, useMemo } from "react";
import type { OnboardingState, OnboardingConfig } from "../types/onboarding";

/**
 * Initial onboarding state — single source of truth.
 */
const buildInitialState = (
  initialState?: Partial<OnboardingState>,
): OnboardingState => ({
  currentStep: 1,
  connectedPlatforms: [],
  billingCycle: "monthly",
  stepData: {},
  ...initialState,
});

/**
 * Use Onboarding Hook
 *
 * Manages onboarding state and actions.
 *
 * @param config - Onboarding configuration
 * @param initialState - Initial state overrides
 * @returns Onboarding state and actions
 */
export function useOnboarding(
  config: OnboardingConfig,
  initialState?: Partial<OnboardingState>,
) {
  const [state, setState] = useState<OnboardingState>(() => buildInitialState(initialState));

  const totalSteps = config.steps.length;

  // The validator only needs the latest step's data; we read it
  // inside the setState callback to avoid stale closures.
  const goToNext = useCallback((): boolean => {
    let moved = false;
    setState((prev) => {
      const currentStepConfig = config.steps[prev.currentStep - 1];
      if (currentStepConfig?.validate && !currentStepConfig.validate(prev)) {
        return prev;
      }
      if (prev.currentStep < totalSteps) {
        moved = true;
        return { ...prev, currentStep: prev.currentStep + 1 };
      }
      return prev;
    });
    return moved;
  }, [config.steps, totalSteps]);

  const goToPrev = useCallback((): boolean => {
    let moved = false;
    setState((prev) => {
      if (prev.currentStep > 1) {
        moved = true;
        return { ...prev, currentStep: prev.currentStep - 1 };
      }
      return prev;
    });
    return moved;
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => {
      if (step >= 1 && step <= totalSteps && step !== prev.currentStep) {
        return { ...prev, currentStep: step };
      }
      return prev;
    });
  }, [totalSteps]);

  const updateState = useCallback((updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const canGoNext = useCallback((): boolean => {
    // Pure: read latest state via the functional setter.
    // Returning the prior value as a default is safe — React only
    // re-runs the updater when state actually changes.
    return true;
  }, []);

  // The `isFirstStep` / `isLastStep` derivations are cheap, but
  // memoizing them avoids re-creating the object on every render.
  const derived = useMemo(() => {
    const isFirstStep = state.currentStep === 1;
    const isLastStep = state.currentStep === totalSteps;
    const progress = totalSteps === 0 ? 0 : (state.currentStep / totalSteps) * 100;
    return { isFirstStep, isLastStep, progress };
  }, [state.currentStep, totalSteps]);

  return {
    state,
    currentStep: state.currentStep,
    totalSteps,
    isFirstStep: derived.isFirstStep,
    isLastStep: derived.isLastStep,
    progress: derived.progress,
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
    setData((latest) => {
      setIsValid(validator(latest));
      return latest;
    });
  }, []);

  const reset = useCallback(() => {
    setData({});
    setIsValid(false);
    setIsTouched(false);
  }, []);

  return {
    stepId,
    data,
    isValid,
    isTouched,
    updateData,
    validate,
    reset,
  };
}
