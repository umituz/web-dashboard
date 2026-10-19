import type { CalendarConfig } from './types/calendar.types';

export const DEFAULT_CALENDAR_CONFIG: CalendarConfig = {
  defaultView: 'month',
  showWeekends: true,
  startOfWeek: 0,
  hourRange: {
    start: 0,
    end: 23,
  },
  enableDragDrop: true,
  showPlatformFilters: true,
  platforms: ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube'],
  slotDuration: 30,
};
