/**
 * Progress percentage calculations.
 * Owns the math for "how far are we through the flow?".
 * Zero hardcoded fallbacks — every input is explicit.
 */

const ZERO_FRACTION = 0;
const PERCENT_MULTIPLIER = 100;

function defensiveDenominator(totalSteps: number): number {
  // Defensive: an empty flow must report 0%, never NaN or Infinity.
  return totalSteps > 0 ? totalSteps : 1;
}

function defensiveCurrentStep(currentStep: number, totalSteps: number): number {
  if (currentStep < 0) return 0;
  if (currentStep > totalSteps) return totalSteps;
  return currentStep;
}

/** Progress as a 0..1 fraction. `1` means "all steps visited". */
export function computeProgressFraction(currentStep: number, totalSteps: number): number {
  if (totalSteps <= 0) return ZERO_FRACTION;
  const safeCurrent = defensiveCurrentStep(currentStep, totalSteps);
  return safeCurrent / defensiveDenominator(totalSteps);
}

/** Progress as a 0..100 percentage. Safe for the UI bar. */
export function computeProgressPercentage(currentStep: number, totalSteps: number): number {
  return computeProgressFraction(currentStep, totalSteps) * PERCENT_MULTIPLIER;
}

/** Number of steps remaining (including the current one). */
export function computeRemainingSteps(currentStep: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0;
  return Math.max(0, totalSteps - defensiveCurrentStep(currentStep, totalSteps));
}
