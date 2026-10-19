/**
 * Duration equal-split math.
 * Splits a total processing duration into equal per-step slices.
 * Falls back to a sensible default when the consumer doesn't provide a total.
 */

const DEFAULT_STEP_DURATION_MS = 1500;
const MIN_PARTS = 1;

/**
 * Per-step duration when a total is given.
 * Returns 0 if the total is unset OR the parts list is empty —
 * never divides by zero.
 */
export function splitTotalDuration(totalMs: number | undefined, parts: number): number {
  if (totalMs === undefined || totalMs <= 0) return DEFAULT_STEP_DURATION_MS;
  const safeParts = Math.max(MIN_PARTS, parts);
  return totalMs / safeParts;
}

/** The default per-step duration when the consumer omits the total. */
export function getDefaultStepDurationMs(): number {
  return DEFAULT_STEP_DURATION_MS;
}
