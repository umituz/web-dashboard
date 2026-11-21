import type { ReactNode } from 'react';
import type {
  CalendarItem,
  CalendarLabels,
  CalendarScreenView,
  CalendarTone,
} from '@umituz/web-design-system/organisms';

export type CalendarPageItem<T = unknown> = CalendarItem & {
  category?: string;
  payload?: T;
};

export interface CalendarCategory {
  id: string;
  label: string;
  tone?: CalendarTone;
  icon?: ReactNode;
  match?: (item: CalendarItem) => boolean;
}

export interface CalendarPageAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  disabled?: boolean;
}

export interface CalendarSelectedDayConfig<T = unknown> {
  title?: (dayKey: string) => ReactNode;
  renderItem?: (item: CalendarPageItem<T>) => ReactNode;
  renderEmpty?: (dayKey: string) => ReactNode;
  emptyText?: string;
  action?: {
    label: string;
    onClick: (dayKey: string) => void;
  };
}

export interface CalendarPageLabels extends Partial<CalendarLabels> {
  allCategories?: string;
  selectedDay?: string;
  noEvents?: string;
  eventsCount?: (count: number) => string;
}

export interface CalendarPageProps<T = unknown> {
  title: string;
  subtitle?: string;
  kicker?: ReactNode;
  actions?: ReactNode | CalendarPageAction | readonly CalendarPageAction[];
  callout?: ReactNode;

  items: readonly CalendarPageItem<T>[];
  categories?: readonly CalendarCategory[];
  categoryMode?: 'single' | 'multiple';
  activeCategoryIds?: readonly string[];
  onActiveCategoriesChange?: (categoryIds: string[]) => void;

  views?: readonly CalendarScreenView[];
  defaultView?: CalendarScreenView;
  view?: CalendarScreenView;
  onViewChange?: (view: CalendarScreenView) => void;

  cursor?: string;
  initialCursor?: string;
  onCursorChange?: (dayKey: string) => void;

  selectedDay?: string | null;
  initialSelectedDay?: string | null;
  onSelectDay?: (dayKey: string) => void;
  selectedDayDetail?: CalendarSelectedDayConfig<T> | boolean;

  onSelectItem?: (item: CalendarPageItem<T>) => void;
  onSlotClick?: (dayKey: string, minutes: number) => void;

  weekStartsOn?: 0 | 1;
  dayStartMin?: number;
  dayEndMin?: number;
  maxPerDay?: number;
  agendaDays?: number;

  locale?: string;
  labels?: CalendarPageLabels;

  toolbarExtra?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}
