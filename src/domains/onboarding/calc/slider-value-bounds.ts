/**
 * Slider value math.
 * Owns the bounds enforcement for preference sliders.
 * Misconfigured bounds (min > max) are surfaced via console — never silently masked.
 */

const SLIDER_MIN_IF_UNSET = 0;
const SLIDER_MAX_IF_UNSET = 100;

/** Defensive bounds for a slider: if the config omits one, fall back to a sensible default. */
export function resolveSliderBounds(
  min: number | undefined,
  max: number | undefined,
): { min: number; max: number } {
  return {
    min: min ?? SLIDER_MIN_IF_UNSET,
    max: max ?? SLIDER_MAX_IF_UNSET,
  };
}

/** Were the configured bounds logically valid? */
export function areSliderBoundsValid(min: number, max: number): boolean {
  return min <= max;
}

/** Clamp a value into the [min, max] range, surfacing misconfigured bounds to the console. */
export function clampValueToBounds(
  value: number,
  min: number,
  max: number,
  preferenceId: string,
): number {
  if (!areSliderBoundsValid(min, max)) {
    // Surface the misconfiguration — never silently mask.
     
    console.error(
      `[web-onboarding] preference "${preferenceId}" has min > max (${min} > ${max}); returning value as-is.`,
    );
    return value;
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
