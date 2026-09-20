/**
 * useCalendar
 *
 * React hook for the calendar domain. Delegates persistence
 * to the injected `CalendarService`, guards refreshes with a
 * request id so a stale response can never overwrite a newer one,
 * and returns a clean discriminated CRUD contract.
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type {
  CalendarConfig,
  ContentItem,
  CalendarFilter,
} from '../types/calendar.types';
import { calendarService, applyCalendarFilter } from '../services';
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

  // Guards against out-of-order responses: only the most recent
  // refresh may commit state (e.g. user changes the filter while a
  // previous fetch is still resolving).
  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    if (!userId) {
      setError('User ID is required to load calendar items');
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await service.getContentItems(userId, filter);
      if (requestIdRef.current === requestId) {
        setItems(data);
      }
    } catch (err) {
      if (requestIdRef.current === requestId) {
        const wrapped = toError(err, 'Failed to fetch calendar items');
        setError(wrapped.message);
        onErrorRef.current?.(wrapped);
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
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

  // Single source of truth for filtering (shared with the service layer)
  // so client-side refiltering can never drift from server-side semantics.
  const filteredItems = useMemo(
    () => applyCalendarFilter(items, filter),
    [items, filter],
  );

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
