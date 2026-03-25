/**
 * useCalendar Hook
 *
 * React hook for calendar functionality with config support
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { CalendarConfig, ContentItem, CalendarFilter } from '../types/calendar.types';
import { calendarService } from '../services';
import { DEFAULT_CALENDAR_CONFIG } from '../utils';

interface UseCalendarOptions {
  /** Calendar configuration */
  config?: Partial<CalendarConfig>;
  /** User ID */
  userId: string;
  /** Error callback */
  onError?: (error: Error) => void;
}

interface UseCalendarReturn {
  // Data
  items: ContentItem[];
  loading: boolean;
  error: string | null;
  currentView: CalendarView;
  currentDate: Date;
  selectedDate: Date;
  filter: CalendarFilter;

  // Actions
  setCurrentView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  setFilter: (filter: Partial<CalendarFilter>) => void;
  refresh: () => Promise<void>;

  // CRUD
  createItem: (item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) => Promise<ContentItem>;
  updateItem: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  moveItem: (id: string, newDate: Date) => Promise<void>;

  // Computed
  filteredItems: ContentItem[];
  itemsForDate: (date: Date) => ContentItem[];
}

type CalendarView = 'month' | 'week' | 'day' | 'timeline';

/**
 * useCalendar hook
 *
 * Manages calendar state and operations with config support
 */
export function useCalendar(options: UseCalendarOptions): UseCalendarReturn {
  const { config: userConfig, userId, onError } = options;

  // Merge config with defaults
  const config = useMemo(() => ({
    ...DEFAULT_CALENDAR_CONFIG,
    ...userConfig,
  }), [userConfig]);

  // State
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>(config.defaultView || 'month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState<CalendarFilter>({});

  // Fetch items
  const refresh = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await calendarService.getContentItems(userId, filter);
      setItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch calendar items';
      setError(errorMessage);
      onError?.(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, filter, onError]);

  // Create item
  const createItem = useCallback(async (item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>): Promise<ContentItem> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const created = await calendarService.createContentItem(userId, item);
      await refresh();
      return created;
    } catch (err) {
      onError?.(err as Error);
      throw err;
    }
  }, [userId, refresh, onError]);

  // Update item
  const updateItem = useCallback(async (id: string, updates: Partial<ContentItem>): Promise<void> => {
    try {
      await calendarService.updateContentItem(id, updates);
      await refresh();
    } catch (err) {
      onError?.(err as Error);
      throw err;
    }
  }, [refresh, onError]);

  // Delete item
  const deleteItem = useCallback(async (id: string): Promise<void> => {
    try {
      await calendarService.deleteContentItem(id);
      await refresh();
    } catch (err) {
      onError?.(err as Error);
      throw err;
    }
  }, [refresh, onError]);

  // Move item
  const moveItem = useCallback(async (id: string, newDate: Date): Promise<void> => {
    try {
      await calendarService.moveContentItem(id, newDate);
      await refresh();
    } catch (err) {
      onError?.(err as Error);
      throw err;
    }
  }, [refresh, onError]);

  // Filter update
  const updateFilter = useCallback((updates: Partial<CalendarFilter>) => {
    setFilter(prev => ({ ...prev, ...updates }));
  }, []);

  // Get filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      if (filter.search && !item.title.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }

      // Platform filter
      if (filter.platforms && filter.platforms.length > 0) {
        if (!item.platforms.some(p => filter.platforms?.includes(p))) {
          return false;
        }
      }

      // Type filter
      if (filter.types && filter.types.length > 0) {
        if (!item.type || !filter.types.includes(item.type)) {
          return false;
        }
      }

      // Status filter
      if (filter.status && item.status !== filter.status) {
        return false;
      }

      // Date range filter
      if (filter.dateRange) {
        const itemDate = new Date(item.scheduled_at);
        if (itemDate < filter.dateRange.start || itemDate > filter.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }, [items, filter]);

  // Get items for specific date
  const itemsForDate = useCallback((date: Date): ContentItem[] => {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);

    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    return filteredItems.filter(item => {
      const itemDate = new Date(item.scheduled_at);
      return itemDate >= dateStart && itemDate <= dateEnd;
    });
  }, [filteredItems]);

  // Initial fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    // Data
    items,
    loading,
    error,
    currentView,
    currentDate,
    selectedDate,
    filter,

    // Actions
    setCurrentView,
    setCurrentDate,
    setSelectedDate,
    setFilter: updateFilter,
    refresh,

    // CRUD
    createItem,
    updateItem,
    deleteItem,
    moveItem,

    // Computed
    filteredItems,
    itemsForDate,
  };
}
