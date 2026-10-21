export function formatPattern(
  pattern: string,
  vars: Record<string, string | number>,
): string {
  return pattern.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
