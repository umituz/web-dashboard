import type { CalendarItem } from '../types/view.types';

export const DAY_MINUTES = 24 * 60;
export const DEFAULT_DAY_START_MIN = 7 * 60;
export const DEFAULT_DAY_END_MIN = 21 * 60;
export const DEFAULT_MAX_PER_DAY = 3;
export const SLOT_QUANTUM_MIN = 30;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function parseDayKey(dayKey: string): Date {
  const [year, month, day] = dayKey.split('-').map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

export function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayKey(): string {
  return toDayKey(new Date());
}

export function addDaysKey(dayKey: string, days: number): string {
  const date = parseDayKey(dayKey);
  date.setDate(date.getDate() + days);
  return toDayKey(date);
}

export function addMonthsKey(dayKey: string, months: number): string {
  const date = parseDayKey(dayKey);
  const dayOfMonth = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(dayOfMonth, lastDay));
  return toDayKey(date);
}

export function startOfWeekKey(dayKey: string, weekStartsOn: 0 | 1 = 1): string {
  const back = (parseDayKey(dayKey).getDay() + 7 - weekStartsOn) % 7;
  return addDaysKey(dayKey, -back);
}

export function weekDays(anchorKey: string, weekStartsOn: 0 | 1 = 1): string[] {
  const start = startOfWeekKey(anchorKey, weekStartsOn);
  return Array.from({ length: 7 }, (_, index) => addDaysKey(start, index));
}

export function monthMatrix(anchorKey: string, weekStartsOn: 0 | 1 = 1): string[] {
  const firstOfMonth = `${anchorKey.slice(0, 7)}-01`;
  const start = startOfWeekKey(firstOfMonth, weekStartsOn);
  return Array.from({ length: 42 }, (_, index) => addDaysKey(start, index));
}

export function sameMonth(firstKey: string, secondKey: string): boolean {
  return firstKey.slice(0, 7) === secondKey.slice(0, 7);
}

export function formatWeekdayShort(dayKey: string, locale = 'en-US'): string {
  return parseDayKey(dayKey).toLocaleDateString(locale, { weekday: 'short' });
}

export function formatDayNumber(dayKey: string): string {
  return String(Number(dayKey.slice(8)));
}

export function formatMonthTitle(anchorKey: string, locale = 'en-US'): string {
  return parseDayKey(anchorKey).toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

export function formatWeekTitle(anchorKey: string, locale = 'en-US'): string {
  const days = weekDays(anchorKey);
  const first = parseDayKey(days[0] ?? anchorKey);
  const last = parseDayKey(days[6] ?? anchorKey);
  const left = first.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  const rightOptions: Intl.DateTimeFormatOptions =
    first.getMonth() === last.getMonth()
      ? { day: 'numeric', year: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' };
  return `${left} – ${last.toLocaleDateString(locale, rightOptions)}`;
}

export function formatDayTitle(dayKey: string, locale = 'en-US'): string {
  return parseDayKey(dayKey).toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function minutesToLabel(minutes: number): string {
  const normalized = ((Math.round(minutes) % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  return `${pad(Math.floor(normalized / 60))}:${pad(normalized % 60)}`;
}

export interface CalendarSpan {
  startMin: number;
  endMin: number;
}

export function itemSpan(item: CalendarItem): CalendarSpan {
  const startMin = item.startMin ?? 0;
  const endMin = item.endMin ?? Math.min(startMin + 60, DAY_MINUTES);
  return { startMin, endMin: Math.max(endMin, startMin) };
}

export function spansOverlap(first: CalendarSpan, second: CalendarSpan): boolean {
  return first.startMin < second.endMin && second.startMin < first.endMin;
}

export function findConflicts<T extends CalendarItem>(items: readonly T[]): T[] {
  const sorted = [...items]
    .map((item) => ({ item, span: itemSpan(item) }))
    .sort((first, second) => first.span.startMin - second.span.startMin);
  const conflicted = new Set<string>();
  for (let index = 0; index < sorted.length; index += 1) {
    for (let other = index + 1; other < sorted.length; other += 1) {
      if (sorted[other]!.span.startMin >= sorted[index]!.span.endMin) break;
      conflicted.add(sorted[index]!.item.id);
      conflicted.add(sorted[other]!.item.id);
    }
  }
  return items.filter((item) => conflicted.has(item.id));
}

export interface PositionedItem<T extends CalendarItem> {
  item: T;
  column: number;
  columns: number;
}

export function layoutColumns<T extends CalendarItem>(items: readonly T[]): PositionedItem<T>[] {
  const sorted = [...items].sort((first, second) => {
    const firstSpan = itemSpan(first);
    const secondSpan = itemSpan(second);
    return firstSpan.startMin === secondSpan.startMin
      ? secondSpan.endMin - firstSpan.endMin
      : firstSpan.startMin - secondSpan.startMin;
  });

  const placed: PositionedItem<T>[] = [];
  let cluster: PositionedItem<T>[] = [];
  let clusterEnd = -1;

  const flush = () => {
    for (const entry of cluster) entry.columns = cluster.length;
    placed.push(...cluster);
    cluster = [];
    clusterEnd = -1;
  };

  for (const item of sorted) {
    const span = itemSpan(item);
    if (cluster.length > 0 && span.startMin >= clusterEnd) flush();
    clusterEnd = Math.max(clusterEnd, span.endMin);
    const column = cluster.findIndex((entry) => itemSpan(entry.item).endMin <= span.startMin);
    cluster.push({ item, column: column === -1 ? cluster.length : column, columns: 1 });
  }
  flush();
  return placed;
}

export function eventGeometry(
  item: CalendarItem,
  dayStartMin: number,
  dayEndMin: number,
): { top: number; height: number } {
  const span = itemSpan(item);
  const total = Math.max(dayEndMin - dayStartMin, 1);
  const start = (span.startMin - dayStartMin) / total;
  const end = Math.min((span.endMin - dayStartMin) / total, 1);
  const clampedStart = Math.max(start, 0);
  return { top: clampedStart * 100, height: Math.max(end - clampedStart, 0.012) * 100 };
}

export interface DaySlot {
  startMin: number;
  endMin: number;
  taken: boolean;
}

export function generateDaySlots(
  options: { startMin: number; endMin: number; durationMin: number; stepMin?: number },
  booked: readonly CalendarSpan[] = [],
): DaySlot[] {
  const step = options.stepMin ?? options.durationMin;
  const slots: DaySlot[] = [];
  for (let start = options.startMin; start + options.durationMin <= options.endMin; start += step) {
    const slot = { startMin: start, endMin: start + options.durationMin };
    slots.push({ ...slot, taken: booked.some((span) => spansOverlap(slot, span)) });
  }
  return slots;
}

export function groupByDayKey<T extends CalendarItem>(items: readonly T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const bucket = map.get(item.dayKey);
    if (bucket) bucket.push(item);
    else map.set(item.dayKey, [item]);
  }
  for (const bucket of map.values()) {
    bucket.sort((first, second) => itemSpan(first).startMin - itemSpan(second).startMin);
  }
  return map;
}
