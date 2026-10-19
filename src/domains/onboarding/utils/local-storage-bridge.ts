/**
 * localStorage bridge for onboarding progress.
 * Owns the I/O — validation, parsing, and the schema version are delegated
 * to the validation module so this file is a thin persistence layer.
 */

import { elapsedMillis } from '../calc/elapsed-millis';
import { isLocalStorageAvailable } from '../predicates/storage-available';
import { checkStoredProgress } from '../validation/stored-progress-check';
import { defaultStorageKey } from './default-storage-key';
import type { OnboardingResult } from '../types/config';

export interface RehydratedProgress {
  currentStep: number;
  completedSteps: string[];
  collected: Record<string, unknown>;
  startedAt: Date;
  lastUpdated: Date;
}

function buildKey(customKey: string | undefined): string {
  return customKey ?? defaultStorageKey;
}

/**
 * Save the current progress to localStorage. Returns true on success.
 * Surfaces persistence failures to the console; never silently masks them.
 */
export function saveOnboardingProgress(
  key: string | undefined,
  payload: {
    currentStep: number;
    completedSteps: ReadonlyArray<string>;
    collected: Record<string, unknown>;
    startedAt: Date;
    lastUpdated: Date;
  },
): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    const serialized = JSON.stringify({
      version: 1,
      currentStep: payload.currentStep,
      completedSteps: [...payload.completedSteps],
      collected: { ...payload.collected },
      startedAt: payload.startedAt.toISOString(),
      lastUpdated: payload.lastUpdated.toISOString(),
    });
    window.localStorage.setItem(buildKey(key), serialized);
    return true;
  } catch (error) {
     
    console.error('[web-onboarding] failed to persist progress', error);
    return false;
  }
}

/**
 * Load and validate a previously saved progress payload.
 * Returns null if storage is unavailable, nothing is stored, or the payload is corrupt.
 */
export function loadOnboardingProgress(key: string | undefined): RehydratedProgress | null {
  if (!isLocalStorageAvailable()) return null;
  const raw = window.localStorage.getItem(buildKey(key));
  const checked = checkStoredProgress(raw);
  if (!checked.ok) {
    if (raw !== null) {
      // Corrupt payload — discard so future saves start clean.
      window.localStorage.removeItem(buildKey(key));
    }
    return null;
  }
  return {
    currentStep: checked.data.currentStep,
    completedSteps: checked.data.completedSteps,
    collected: checked.data.collected,
    startedAt: new Date(checked.data.startedAt),
    lastUpdated: new Date(checked.data.lastUpdated),
  };
}

/** Remove the stored payload. Safe to call when nothing is stored. */
export function clearOnboardingProgress(key: string | undefined): void {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.removeItem(buildKey(key));
}

/**
 * Build the final `OnboardingResult` value the consumer receives via
 * `onComplete`. Owns the duration calculation; no magic numbers here.
 */
export function buildOnboardingResult(input: {
  completedSteps: ReadonlyArray<string>;
  collected: Record<string, unknown>;
  startedAt: Date;
  finishedAt: Date;
}): OnboardingResult {
  return {
    completedSteps: input.completedSteps,
    collected: input.collected,
    durationMs: elapsedMillis(input.startedAt, input.finishedAt),
    finishedAt: input.finishedAt,
  };
}
