import type { ActivityGroup, ActivityItem } from './types';

export function toDate(timestamp: string | number | Date): Date {
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'number') return new Date(timestamp);
  return new Date(timestamp);
}

export function toIsoDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDayLabel(date: Date, locale = 'en-US'): string {
  const now = new Date();
  const todayKey = toIsoDayKey(now);
  const targetKey = toIsoDayKey(date);

  if (targetKey === todayKey) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (targetKey === toIsoDayKey(yesterday)) return 'Yesterday';

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: now.getFullYear() === date.getFullYear() ? undefined : 'numeric',
  }).format(date);
}

export function formatActivityRelativeTime(date: Date): string {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${Math.floor(diffMonth / 12)}y ago`;
}

export function groupActivitiesByDay<T>(
  items: readonly ActivityItem<T>[],
  locale = 'en-US',
): readonly ActivityGroup<T>[] {
  const groups: Map<string, { label: string; items: ActivityItem<T>[] }> = new Map();

  for (const item of items) {
    const d = toDate(item.timestamp);
    const key = toIsoDayKey(d);
    const existing = groups.get(key);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.set(key, {
        label: formatDayLabel(d, locale),
        items: [item],
      });
    }
  }

  return Array.from(groups.entries()).map(([dateKey, val]) => ({
    dateKey,
    label: val.label,
    items: val.items,
  }));
}
