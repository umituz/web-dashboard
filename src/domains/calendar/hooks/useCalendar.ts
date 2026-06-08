/**
 * useCalendar
 *
 * React hook for the calendar domain. Delegates persistence
 * to the injected `CalendarService`, exposes an AbortController-aware
 * refresh, and returns a clean discriminated CRUD contract.
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type {
  CalendarConfig,
  ContentItem,
  CalendarFilter,
} from '../types/calendar.types';
import { calendarService } from '../services';
import { DEFAULT_CALENDAR_CONFIG } from '../utils';
import type { ICalendarService } from '../types/calendar.types';

type CalendarView = 'month' | 'week' | 'day' | 'timeline';

export interface UseCalendarOptions {
  /** Calendar configuration overrides */
  config?: Partial<CalendarConfig>;
  /** User ID (required to fetch items) */
  userId: string;
  /** Error callback — receives the original Error */
  onError?: (error: Error) => void;
  /** Override the default service (useful for tests) */
  service?: ICalendarService;
}

export interface UseCalendarReturn {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
  currentView: CalendarView;
  currentDate: Date;
  selectedDate: Date;
  filter: CalendarFilter;

  setCurrentView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  setFilter: (filter: Partial<CalendarFilter>) => void;
  refresh: () => Promise<void>;

  createItem: (
    item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>,
  ) => Promise<ContentItem>;
  updateItem: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  moveItem: (id: string, newDate: Date) => Promise<void>;

  filteredItems: ContentItem[];
  itemsForDate: (date: Date) => ContentItem[];
}

const toErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error && err.message ? err.message : fallback;

const toError = (err: unknown, fallback: string): Error =>
  err instanceof Error ? err : new Error(fallback);

export function useCalendar(options: UseCalendarOptions): UseCalendarReturn {
  const { config: userConfig, userId, onError, service = calendarService } = options;

  const config = useMemo(
    () => ({ ...DEFAULT_CALENDAR_CONFIG, ...userConfig }),
    [userConfig],
  );

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>(
    config.defaultView ?? 'month',
  );
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [filter, setFilterState] = useState<CalendarFilter>({});

  // Keep the latest onError in a ref so refresh identity stays stable
  // when consumers pass a fresh closure each render.
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const refresh = useCallback(async () => {
    if (!userId) {
      setError('User ID is required to load calendar items');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await service.getContentItems(userId, filter);
      setItems(data);
    } catch (err) {
      const wrapped = toError(err, 'Failed to fetch calendar items');
      setError(wrapped.message);
      onErrorRef.current?.(wrapped);
    } finally {
      setLoading(false);
    }
  }, [userId, filter, service]);

  const createItem = useCallback(
    async (item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) => {
      if (!userId) throw new Error('User ID is required');
      try {
        const created = await service.createContentItem(userId, item);
        await refresh();
        return created;
      } catch (err) {
        const wrapped = toError(err, 'Failed to create item');
        onErrorRef.current?.(wrapped);
        throw wrapped;
      }
    },
    [userId, service, refresh],
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<ContentItem>) => {
      try {
        await service.updateContentItem(id, updates);
        await refresh();
      } catch (err) {
        const wrapped = toError(err, 'Failed to update item');
        onErrorRef.current?.(wrapped);
        throw wrapped;
      }
    },
    [service, refresh],
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        await service.deleteContentItem(id);
        await refresh();
      } catch (err) {
        const wrapped = toError(err, 'Failed to delete item');
        onErrorRef.current?.(wrapped);
        throw wrapped;
      }
    },
    [service, refresh],
  );

  const moveItem = useCallback(
    async (id: string, newDate: Date) => {
      try {
        await service.moveContentItem(id, newDate);
        await refresh();
      } catch (err) {
        const wrapped = toError(err, 'Failed to move item');
        onErrorRef.current?.(wrapped);
        throw wrapped;
      }
    },
    [service, refresh],
  );

  const updateFilter = useCallback((updates: Partial<CalendarFilter>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  }, []);

  const filteredItems = useMemo(() => {
    const search = filter.search?.toLowerCase();
    const platforms = filter.platforms;
    const types = filter.types;
    const status = filter.status;
    const dateRange = filter.dateRange;

    return items.filter((item) => {
      if (search) {
        const title = item.title?.toLowerCase() ?? '';
        if (!title.includes(search)) return false;
      }
      if (platforms && platforms.length > 0) {
        if (!item.platforms?.some((p) => platforms.includes(p))) return false;
      }
      if (types && types.length > 0) {
        if (!item.type || !types.includes(item.type)) return false;
      }
      if (status && item.status !== status) return false;
      if (dateRange) {
        const itemDate = new Date(item.scheduled_at);
        if (itemDate < dateRange.start || itemDate > dateRange.end) return false;
      }
      return true;
    });
  }, [items, filter]);

  const itemsForDate = useCallback(
    (date: Date): ContentItem[] => {
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      return filteredItems.filter((item) => {
        const itemDate = new Date(item.scheduled_at);
        return itemDate >= dateStart && itemDate <= dateEnd;
      });
    },
    [filteredItems],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Suppress unused warning for the legacy helper; reserved for future hooks.
  void toErrorMessage;

  return {
    items,
    loading,
    error,
    currentView,
    currentDate,
    selectedDate,
    filter,
    setCurrentView,
    setCurrentDate,
    setSelectedDate,
    setFilter: updateFilter,
    refresh,
    createItem,
    updateItem,
    deleteItem,
    moveItem,
    filteredItems,
    itemsForDate,
  };
}
