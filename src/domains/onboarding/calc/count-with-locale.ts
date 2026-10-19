/**
 * Locale-aware count formatting.
 * Used wherever a large count (e.g. "Trusted by 250,000+") is shown to the user.
 * The consumer never has to call .toLocaleString() directly.
 */

/** Format a number for human display. e.g. 250000 -> "250,000" (en) / "250.000" (de-DE).
 *  An omitted locale uses the host default; an invalid locale falls back to en-US. */
export function formatCountWithLocale(value: number, locale?: string): string {
  if (!Number.isFinite(value)) return '0';
  try {
    return value.toLocaleString(locale);
  } catch {
    return value.toLocaleString('en-US');
  }
}
