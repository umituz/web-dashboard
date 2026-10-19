const SLIDER_MIN_IF_UNSET = 0;
const SLIDER_MAX_IF_UNSET = 100;

export function resolveSliderBounds(
  min: number | undefined,
  max: number | undefined,
): { min: number; max: number } {
  return {
    min: min ?? SLIDER_MIN_IF_UNSET,
    max: max ?? SLIDER_MAX_IF_UNSET,
  };
}

export function areSliderBoundsValid(min: number, max: number): boolean {
  return min <= max;
}

export function clampValueToBounds(
  value: number,
  min: number,
  max: number,
  preferenceId: string,
): number {
  if (!areSliderBoundsValid(min, max)) {
         
    console.error(
      `[web-onboarding] preference "${preferenceId}" has min > max (${min} > ${max}); returning value as-is.`,
    );
    return value;
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
