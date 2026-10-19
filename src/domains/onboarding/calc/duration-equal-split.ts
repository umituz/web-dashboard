const DEFAULT_STEP_DURATION_MS = 1500;
const MIN_PARTS = 1;

export function splitTotalDuration(totalMs: number | undefined, parts: number): number {
  if (totalMs === undefined || totalMs <= 0) return DEFAULT_STEP_DURATION_MS;
  const safeParts = Math.max(MIN_PARTS, parts);
  return totalMs / safeParts;
}

export function getDefaultStepDurationMs(): number {
  return DEFAULT_STEP_DURATION_MS;
}
