export function formatCountWithLocale(value: number, locale?: string): string {
  if (!Number.isFinite(value)) return '0';
  try {
    return value.toLocaleString(locale);
  } catch {
    return value.toLocaleString('en-US');
  }
}
