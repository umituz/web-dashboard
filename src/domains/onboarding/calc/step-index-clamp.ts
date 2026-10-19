/**
 * Step index math.
 * Owns the bounds for "where can the cursor be in the flow?".
 * Pure, no React, no side effects.
 */

const MIN_INDEX = 0;
const MIN_TOTAL_STEPS = 1;

/** Clamp an arbitrary index into the valid [0, totalSteps-1] range. */
export function clampStepIndex(index: number, totalSteps: number): number {
  if (totalSteps < MIN_TOTAL_STEPS) return MIN_INDEX;
  if (index < MIN_INDEX) return MIN_INDEX;
  if (index > totalSteps - MIN_TOTAL_STEPS) return totalSteps - MIN_TOTAL_STEPS;
  return index;
}

/** Move one step forward, stopping at the last step. */
export function advanceStepIndex(currentIndex: number, totalSteps: number): number {
  if (totalSteps < MIN_TOTAL_STEPS) return MIN_INDEX;
  const lastIndex = totalSteps - MIN_TOTAL_STEPS;
  return Math.min(currentIndex + MIN_TOTAL_STEPS, lastIndex);
}

/** Move one step backward, stopping at the first step. */
export function retreatStepIndex(currentIndex: number): number {
  return Math.max(MIN_INDEX, currentIndex - MIN_TOTAL_STEPS);
}
