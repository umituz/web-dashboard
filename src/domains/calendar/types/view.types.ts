import type { ReactNode } from 'react';

export type CalendarTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent';

export type CalendarScreenView = 'month' | 'week' | 'day';

export interface CalendarItem {
  id: string;
  dayKey: string;
  startMin?: number;
  endMin?: number;
  title: ReactNode;
  tone?: CalendarTone;
  icon?: ReactNode;
  meta?: ReactNode;
  kind?: string;
  muted?: boolean;
}

export interface CalendarLegendEntry {
  tone: CalendarTone;
  label: string;
}

export interface CalendarLabels {
  today: string;
  previous: string;
  next: string;
  month: string;
  week: string;
  day: string;
  more: string;
  emptyDay: string;
}

export const DEFAULT_CALENDAR_LABELS: CalendarLabels = {
  today: 'Today',
  previous: 'Previous',
  next: 'Next',
  month: 'Month',
  week: 'Week',
  day: 'Day',
  more: '+{count} more',
  emptyDay: 'Nothing scheduled',
};
