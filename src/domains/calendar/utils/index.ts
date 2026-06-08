/**
 * Calendar Domain Utilities
 */

import type { CalendarConfig } from '../types/calendar.types';

export { mapCalendarDocument, mapPostDocument } from './contentItemMapper';
export type { FirestoreDocument } from './contentItemMapper';

/**
 * Get week dates for a given date
 */
export function getWeekDates(date: Date, startOfWeek: number = 0): Date[] {
  const week: Date[] = [];
  const current = new Date(date);

  const day = current.getDay();
  const diff = (day < startOfWeek ? 7 : 0) + day - startOfWeek;
  current.setDate(current.getDate() - diff);

  for (let i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return week;
}

/**
 * Get month days
 */
export function getMonthDays(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days: Date[] = [];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  return days;
}

/**
 * Check if date is in range
 */
export function isDateInRange(date: Date, range: { start: Date; end: Date }): boolean {
  return date >= range.start && date <= range.end;
}

/**
 * Format date for display.
 * The locale is taken as a parameter so the consumer can decide.
 */
export function formatDate(
  date: Date,
  format: 'short' | 'long' | 'time' = 'short',
  locale: string = 'en-US',
): string {
  if (format === 'time') {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString(locale, {
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Check if dates are same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get date range for a view
 */
export function getViewRange(
  view: 'month' | 'week',
  date: Date,
): { start: Date; end: Date } {
  if (view === 'month') {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  }

  const week = getWeekDates(date);
  const firstDay = new Date(week[0]);
  firstDay.setHours(0, 0, 0, 0);
  const lastDay = new Date(week[6]);
  lastDay.setHours(23, 59, 59, 999);
  return { start: firstDay, end: lastDay };
}

/**
 * Generate time slots
 */
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

/**
 * Re-export the default calendar config from the central config module
 * so consumers using only the calendar domain still get sensible defaults.
 */
export { DEFAULT_CALENDAR_CONFIG } from '../../../domain/config/CalendarConfig';
export type { CalendarConfig };
