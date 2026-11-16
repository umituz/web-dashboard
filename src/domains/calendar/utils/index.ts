import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  formatDate as formatDateWithStyle,
  formatTime,
  startOfMonth,
  startOfWeek,
  type WeekStartsOn,
} from '@umituz/web-design-system';
import type { CalendarConfig } from '../types/calendar.types';

export { mapCalendarDocument, mapPostDocument } from './contentItemMapper';
export * from './layout';
export type { FirestoreDocument } from './contentItemMapper';
export { isSameDay } from '@umituz/web-design-system';

export function getWeekDates(
  date: Date,
  weekStartsOn: number = 0,
): [Date, Date, Date, Date, Date, Date, Date] {
  const anchor = startOfWeek(date, weekStartsOn as WeekStartsOn);
  return [
    addDays(anchor, 0),
    addDays(anchor, 1),
    addDays(anchor, 2),
    addDays(anchor, 3),
    addDays(anchor, 4),
    addDays(anchor, 5),
    addDays(anchor, 6),
  ];
}

export function getMonthDays(date: Date): Date[] {
  return eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) });
}

export function isDateInRange(date: Date, range: { start: Date; end: Date }): boolean {
  return date >= range.start && date <= range.end;
}

export function formatDate(
  date: Date,
  format: 'short' | 'long' | 'time' = 'short',
  locale: string = 'en-US',
): string {
  if (format === 'time') {
    return formatTime(date, { locale });
  }

  return formatDateWithStyle(date, 'long', {
    weekday: 'none',
    month: format === 'long' ? 'long' : 'short',
    locale,
  });
}

export function getViewRange(
  view: 'month' | 'week',
  date: Date,
): { start: Date; end: Date } {
  if (view === 'month') {
    return { start: startOfMonth(date), end: endOfMonth(date) };
  }

  return { start: startOfWeek(date), end: endOfWeek(date) };
}

export function generateTimeSlots(
  startHour: number,
  endHour: number,
  slotDuration: number,
): string[] {
  const slots: string[] = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }

  return slots;
}
export type { CalendarConfig };
