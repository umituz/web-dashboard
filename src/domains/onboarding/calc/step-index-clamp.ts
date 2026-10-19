const MIN_INDEX = 0;
const MIN_TOTAL_STEPS = 1;

export function clampStepIndex(index: number, totalSteps: number): number {
  if (totalSteps < MIN_TOTAL_STEPS) return MIN_INDEX;
  if (index < MIN_INDEX) return MIN_INDEX;
  if (index > totalSteps - MIN_TOTAL_STEPS) return totalSteps - MIN_TOTAL_STEPS;
  return index;
}

export function advanceStepIndex(currentIndex: number, totalSteps: number): number {
  if (totalSteps < MIN_TOTAL_STEPS) return MIN_INDEX;
  const lastIndex = totalSteps - MIN_TOTAL_STEPS;
  return Math.min(currentIndex + MIN_TOTAL_STEPS, lastIndex);
}

export function retreatStepIndex(currentIndex: number): number {
  return Math.max(MIN_INDEX, currentIndex - MIN_TOTAL_STEPS);
}
