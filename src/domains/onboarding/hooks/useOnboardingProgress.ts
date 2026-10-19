import { useCallback, useEffect, useMemo, useReducer } from 'react';
import type { OnboardingScreen } from '../types/screens';
import type { OnboardingResult } from '../types/config';
import {
  advanceStepIndex,
  clampStepIndex,
  retreatStepIndex,
} from '../calc/step-index-clamp';
import {
  computeProgressFraction,
  computeRemainingSteps,
} from '../calc/progress-percentage';
import {
  buildOnboardingResult,
  clearOnboardingProgress,
  loadOnboardingProgress,
  saveOnboardingProgress,
} from '../utils/local-storage-bridge';

interface ProgressState {
  currentStep: number;
  totalSteps: number;
  completedSteps: ReadonlyArray<string>;
  collected: Record<string, unknown>;
  startedAt: Date;
  lastUpdated: Date;
  finishedAt: Date | null;
}

type ProgressAction =
  | { type: 'next'; currentScreen: OnboardingScreen; data?: unknown }
  | { type: 'previous' }
  | { type: 'goto'; index: number }
  | { type: 'reset' }
  | { type: 'finish'; currentScreen: OnboardingScreen; data?: unknown }
  | { type: 'hydrate'; state: ProgressState };

function reducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'next': {
      const completed = state.completedSteps.includes(action.currentScreen.id)
        ? state.completedSteps
        : [...state.completedSteps, action.currentScreen.id];
      const collected =
        action.data !== undefined
          ? { ...state.collected, [action.currentScreen.id]: action.data }
          : state.collected;
      return {
        ...state,
        currentStep: advanceStepIndex(state.currentStep, state.totalSteps),
        completedSteps: completed,
        collected,
        lastUpdated: new Date(),
      };
    }
    case 'previous':
      return { ...state, currentStep: retreatStepIndex(state.currentStep), lastUpdated: new Date() };
    case 'goto':
      return {
        ...state,
        currentStep: clampStepIndex(action.index, state.totalSteps),
        lastUpdated: new Date(),
      };
    case 'finish': {
      const completed = state.completedSteps.includes(action.currentScreen.id)
        ? state.completedSteps
        : [...state.completedSteps, action.currentScreen.id];
      const collected =
        action.data !== undefined
          ? { ...state.collected, [action.currentScreen.id]: action.data }
          : state.collected;
      return {
        ...state,
        completedSteps: completed,
        collected,
        finishedAt: new Date(),
        lastUpdated: new Date(),
      };
    }
    case 'reset':
      return {
        ...state,
        currentStep: 0,
        completedSteps: [],
        collected: {},
        finishedAt: null,
        lastUpdated: new Date(),
        startedAt: new Date(),
      };
    case 'hydrate':
      return action.state;
    default:
      return state;
  }
}

interface UseOnboardingProgressOptions {
  screens: ReadonlyArray<OnboardingScreen>;
  storageKey?: string;
    ephemeral?: boolean;
}

export interface UseOnboardingProgressReturn {
  currentStep: number;
  totalSteps: number;
  progress: number;   completedSteps: ReadonlyArray<string>;
  collected: Record<string, unknown>;
  remainingSteps: number;
  isFirst: boolean;
  isLast: boolean;
  isFinished: boolean;
    startedAt: Date;
  next: (data?: unknown) => void;
  prev: () => void;
  goTo: (index: number) => void;
  reset: () => void;
  finish: (data?: unknown) => OnboardingResult;
  result: OnboardingResult | null;
}

export function useOnboardingProgress(
  options: UseOnboardingProgressOptions,
): UseOnboardingProgressReturn {
  const { screens, storageKey, ephemeral = false } = options;
  const totalSteps = screens.length;

  const initialState = useMemo<ProgressState>(() => {
    const now = new Date();
    if (!ephemeral) {
      const restored = loadOnboardingProgress(storageKey);
      if (restored && restored.currentStep < totalSteps) {
        return {
          currentStep: restored.currentStep,
          totalSteps,
          completedSteps: restored.completedSteps,
          collected: restored.collected,
          startedAt: restored.startedAt,
          lastUpdated: restored.lastUpdated,
          finishedAt: null,
        };
      }
    }
    return {
      currentStep: 0,
      totalSteps,
      completedSteps: [],
      collected: {},
      startedAt: now,
      lastUpdated: now,
      finishedAt: null,
    };
          }, [totalSteps, storageKey, ephemeral]);

  const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
    if (ephemeral) return;
    saveOnboardingProgress(storageKey, {
      currentStep: state.currentStep,
      completedSteps: state.completedSteps,
      collected: state.collected,
      startedAt: state.startedAt,
      lastUpdated: state.lastUpdated,
    });
  }, [
    ephemeral,
    storageKey,
    state.currentStep,
    state.completedSteps,
    state.collected,
    state.startedAt,
    state.lastUpdated,
  ]);

  const next = useCallback(
    (data?: unknown) => {
      const currentScreen = screens[state.currentStep];
      if (!currentScreen) return;
      if (state.currentStep === state.totalSteps - 1) {
        dispatch({ type: 'finish', currentScreen, data });
      } else {
        dispatch({ type: 'next', currentScreen, data });
      }
    },
    [screens, state.currentStep, state.totalSteps],
  );

  const prev = useCallback(() => dispatch({ type: 'previous' }), []);
  const goTo = useCallback((index: number) => dispatch({ type: 'goto', index }), []);
  const reset = useCallback(() => {
    if (!ephemeral) clearOnboardingProgress(storageKey);
    dispatch({ type: 'reset' });
  }, [ephemeral, storageKey]);

  const finish = useCallback(
    (data?: unknown) => {
      const currentScreen = screens[state.currentStep];
      if (currentScreen) dispatch({ type: 'finish', currentScreen, data });
      const finishedAt = new Date();
      return buildOnboardingResult({
        completedSteps:
          currentScreen && !state.completedSteps.includes(currentScreen.id)
            ? [...state.completedSteps, currentScreen.id]
            : state.completedSteps,
        collected:
          currentScreen && data !== undefined
            ? { ...state.collected, [currentScreen.id]: data }
            : state.collected,
        startedAt: state.startedAt,
        finishedAt,
      });
    },
    [screens, state.currentStep, state.completedSteps, state.collected, state.startedAt],
  );

  const progress = computeProgressFraction(state.currentStep, state.totalSteps);
  const remainingSteps = computeRemainingSteps(state.currentStep, state.totalSteps);
  const isFirst = state.currentStep === 0;
  const isLast = state.currentStep === state.totalSteps - 1;
  const isFinished = state.finishedAt !== null;
  const result =
    state.finishedAt !== null
      ? buildOnboardingResult({
          completedSteps: state.completedSteps,
          collected: state.collected,
          startedAt: state.startedAt,
          finishedAt: state.finishedAt,
        })
      : null;

  return {
    currentStep: state.currentStep,
    totalSteps,
    progress,
    completedSteps: state.completedSteps,
    collected: state.collected,
    remainingSteps,
    isFirst,
    isLast,
    isFinished,
    startedAt: state.startedAt,
    next,
    prev,
    goTo,
    reset,
    finish,
    result,
  };
}
