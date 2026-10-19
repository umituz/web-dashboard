/**
 * Elapsed-millisecond math.
 * Single source of truth for "how long did this take?".
 */

const ZERO_MS = 0;

/** Milliseconds between two Dates. Never negative — clamps to 0. */
export function elapsedMillis(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return diff > ZERO_MS ? diff : ZERO_MS;
}
