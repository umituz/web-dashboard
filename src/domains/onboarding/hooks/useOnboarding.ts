/**
 * Onboarding Hooks
 *
 * Custom React hooks for onboarding functionality. Navigation callbacks
 * read the current render's state so their boolean return values are
 * truthful; state updaters themselves stay pure.
 */

import { useState, useCallback, useMemo, useRef } from "react";
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

  // Validation and the boolean return value are computed against the
  // current render's state (always fresh — these callbacks are
  // recreated when state changes); the setState updater stays pure and
  // bounds-checked. The previous version flipped a closure variable
  // inside the updater, which returned false before React had run it.
  const goToNext = useCallback((): boolean => {
    const currentStepConfig = config.steps[state.currentStep - 1];
    if (currentStepConfig?.validate && !currentStepConfig.validate(state)) {
      return false;
    }
    if (state.currentStep >= totalSteps) return false;
    setState((prev) =>
      prev.currentStep < totalSteps
        ? { ...prev, currentStep: prev.currentStep + 1 }
        : prev,
    );
    return true;
  }, [config.steps, state, totalSteps]);

  const goToPrev = useCallback((): boolean => {
    if (state.currentStep <= 1) return false;
    setState((prev) =>
      prev.currentStep > 1
        ? { ...prev, currentStep: prev.currentStep - 1 }
        : prev,
    );
    return true;
  }, [state]);

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

  // Whether the current step passes its configured validator.
  const canGoNext = useCallback((): boolean => {
    const currentStepConfig = config.steps[state.currentStep - 1];
    return currentStepConfig?.validate ? currentStepConfig.validate(state) : true;
  }, [config.steps, state]);

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
 * Hook for managing individual step state.
 */
export function useOnboardingStep(stepId: string) {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Latest-ref mirror of `data` so `validate` can read the most recent
  // value synchronously. State updaters must stay pure — the previous
  // version called setIsValid inside the setData updater.
  const dataRef = useRef<Record<string, unknown>>({});

  const updateData = useCallback((updates: Record<string, unknown>) => {
    const next = { ...dataRef.current, ...updates };
    dataRef.current = next;
    setData(next);
    setIsTouched(true);
  }, []);

  const validate = useCallback((validator: (data: Record<string, unknown>) => boolean) => {
    setIsValid(validator(dataRef.current));
  }, []);

  const reset = useCallback(() => {
    dataRef.current = {};
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
