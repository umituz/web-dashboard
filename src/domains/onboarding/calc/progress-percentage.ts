const ZERO_FRACTION = 0;
const PERCENT_MULTIPLIER = 100;

function defensiveDenominator(totalSteps: number): number {
    return totalSteps > 0 ? totalSteps : 1;
}

function defensiveCurrentStep(currentStep: number, totalSteps: number): number {
  if (currentStep < 0) return 0;
  if (currentStep > totalSteps) return totalSteps;
  return currentStep;
}

export function computeProgressFraction(currentStep: number, totalSteps: number): number {
  if (totalSteps <= 0) return ZERO_FRACTION;
  const safeCurrent = defensiveCurrentStep(currentStep, totalSteps);
  return safeCurrent / defensiveDenominator(totalSteps);
}

export function computeProgressPercentage(currentStep: number, totalSteps: number): number {
  return computeProgressFraction(currentStep, totalSteps) * PERCENT_MULTIPLIER;
}

export function computeRemainingSteps(currentStep: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0;
  return Math.max(0, totalSteps - defensiveCurrentStep(currentStep, totalSteps));
}
