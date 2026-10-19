import type {
  ContentItem,
  CalendarFilter,
  CreateContentItemParams,
  UpdateContentItemParams,
  ICalendarService,
} from '../types/calendar.types';

export interface ICalendarDatabase {
  getItems(userId: string): Promise<ContentItem[]>;
  getItemById(id: string): Promise<ContentItem | null>;
  createItem(userId: string, item: CreateContentItemParams): Promise<ContentItem>;
  updateItem(id: string, updates: UpdateContentItemParams): Promise<void>;
  deleteItem(id: string): Promise<void>;
}

const resolveScheduledAt = (value: string | Date | undefined): string => {
  if (value === undefined) {
    throw new Error('scheduled_at is required to create or update a content item');
  }
  if (typeof value === 'string') return value;
  return value.toISOString();
};

export const createInMemoryCalendarDatabase = (): ICalendarDatabase => {
  const items = new Map<string, ContentItem>();

  const findByUser = (userId: string): ContentItem[] =>
    [...items.values()].filter((item) => item.user_id === userId);

  return {
    async getItems(userId: string): Promise<ContentItem[]> {
      return findByUser(userId).sort(
        (a, b) =>
          new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime(),
      );
    },

    async getItemById(id: string): Promise<ContentItem | null> {
      return items.get(id) ?? null;
    },

    async createItem(
      userId: string,
      item: CreateContentItemParams,
    ): Promise<ContentItem> {
      const created: ContentItem = {
        id: `item-${items.size + 1}-${userId}`,
        title: item.title ?? '',
        description: item.description ?? '',
        scheduled_at: resolveScheduledAt(item.scheduled_at),
        platforms: item.platforms ?? [],
        app_name: item.app_name ?? '',
        status: item.status ?? 'draft',
        type: item.type ?? 'post',
        user_id: userId,
        created_at: new Date().toISOString(),
      };
      items.set(created.id, created);
      return created;
    },

    async updateItem(id: string, updates: UpdateContentItemParams): Promise<void> {
      const current = items.get(id);
      if (!current) {
        throw new Error(`Calendar item not found: ${id}`);
      }
      items.set(id, {
        ...current,
        ...updates,
        scheduled_at:
          updates.scheduled_at !== undefined
            ? resolveScheduledAt(updates.scheduled_at)
            : current.scheduled_at,
      });
    },

    async deleteItem(id: string): Promise<void> {
      items.delete(id);
    },
  };
};

/**
 * Apply a CalendarFilter to a list of items.
 * Single source of truth for filtering, shared between hook and service.
 */
const applyCalendarFilter = (items: ContentItem[], filter?: CalendarFilter): ContentItem[] => {
  if (!filter) return items;

  return items.filter((item) => {
    if (filter.search) {
      const title = item.title?.toLowerCase() ?? '';
      const query = filter.search.toLowerCase();
      if (!title.includes(query)) return false;
    }

    if (filter.platforms && filter.platforms.length > 0) {
      const itemPlatforms = item.platforms ?? [];
      if (!itemPlatforms.some((p) => filter.platforms?.includes(p))) {
        return false;
      }
    }

    if (filter.types && filter.types.length > 0) {
      if (!item.type || !filter.types.includes(item.type)) {
        return false;
      }
    }

    if (filter.status && item.status !== filter.status) {
      return false;
    }

    if (filter.dateRange) {
      const itemDate = new Date(item.scheduled_at);
      if (itemDate < filter.dateRange.start || itemDate > filter.dateRange.end) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Calendar Service Implementation
 *
 * Provides CRUD operations for calendar content items
 * Uses database interface for backend abstraction
 */
export class CalendarService implements ICalendarService {
  private database: ICalendarDatabase;

  constructor(database: ICalendarDatabase = createInMemoryCalendarDatabase()) {
    this.database = database;
  }

  /**
   * Set database implementation (for testing or custom backends)
   */
  setDatabase(database: ICalendarDatabase): void {
    this.database = database;
  }

  /**
   * Get all content items for a user, with optional filter
   */
  async getContentItems(userId: string, filter?: CalendarFilter): Promise<ContentItem[]> {
    const items = await this.database.getItems(userId);
    return applyCalendarFilter(items, filter);
  }

  async getContentItemById(id: string): Promise<ContentItem | null> {
    return this.database.getItemById(id);
  }

  async createContentItem(userId: string, item: CreateContentItemParams): Promise<ContentItem> {
    return this.database.createItem(userId, item);
  }

  async updateContentItem(id: string, updates: UpdateContentItemParams): Promise<void> {
    await this.database.updateItem(id, updates);
  }

  async deleteContentItem(id: string): Promise<void> {
    await this.database.deleteItem(id);
  }

  async moveContentItem(id: string, newDate: Date): Promise<void> {
    await this.updateContentItem(id, {
      scheduled_at: newDate,
    });
  }
}

/**
 * Default singleton instance (in-memory — swap the backend via
 * `setDatabase` or construct your own `CalendarService`).
 */
export const calendarService = new CalendarService();

/**
 * Exported for testing/extension.
 */
export { applyCalendarFilter };
