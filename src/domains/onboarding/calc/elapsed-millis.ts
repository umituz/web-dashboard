const ZERO_MS = 0;

export function elapsedMillis(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return diff > ZERO_MS ? diff : ZERO_MS;
}
