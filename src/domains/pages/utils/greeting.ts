export function getTimeOfDayGreeting(date: Date = new Date()): 'morning' | 'afternoon' | 'evening' {
  const h = date.getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

export function formatUserGreeting(name?: string, date: Date = new Date()): string {
  const time = getTimeOfDayGreeting(date);
  const first = name?.trim().split(/\s+/)[0];
  const target = first && first.length > 0 ? first : 'there';
  return `Good ${time}, ${target}`;
}
