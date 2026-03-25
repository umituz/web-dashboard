/**
 * Calendar Service
 *
 * Firebase-based calendar service for managing content items
 */

import type {
  ContentItem,
  CalendarFilter,
  CreateContentItemParams,
  UpdateContentItemParams,
  ICalendarService,
} from '../types/calendar.types';

/**
 * Database interface for calendar operations
 * Implementations can provide different backends
 */
interface ICalendarDatabase {
  getItems(userId: string): Promise<ContentItem[]>;
  getItemById(id: string): Promise<ContentItem | null>;
  createItem(userId: string, item: CreateContentItemParams): Promise<ContentItem>;
  updateItem(id: string, updates: UpdateContentItemParams): Promise<void>;
  deleteItem(id: string): Promise<void>;
}

/**
 * Firebase implementation of calendar database
 */
class FirebaseCalendarDatabase implements ICalendarDatabase {
  async getItems(userId: string): Promise<ContentItem[]> {
    // Lazy load Firebase
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { getFirebaseDB } = await import('@umituz/web-firebase');
    const db = getFirebaseDB();

    const calendarQuery = query(
      collection(db as any, 'calendar_items'),
      where("user_id", "==", userId)
    );

    const postsQuery = query(
      collection(db as any, "posts"),
      where("userId", "==", userId)
    );

    const [calendarSnap, postsSnap] = await Promise.all([
      getDocs(calendarQuery),
      getDocs(postsQuery)
    ]);

    const calendarItems = calendarSnap.docs.map((doc: { id: string; data: () => Record<string, unknown> }) => ({
      id: doc.id,
      ...doc.data()
    } as ContentItem));

    const postItems = postsSnap.docs.map((doc: { id: string; data: () => Record<string, unknown> }) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Untitled Post',
        description: data.content || '',
        scheduled_at: data.scheduledAt
          ? (typeof data.scheduledAt === 'string' ? data.scheduledAt : (data.scheduledAt as { toDate: () => Date })?.toDate?.().toISOString())
          : new Date().toISOString(),
        platforms: data.platform ? [data.platform] : [],
        app_name: data.appName || 'My App',
        status: data.status || 'draft',
        type: 'post'
      } as ContentItem;
    });

    return [...calendarItems, ...postItems].sort((a, b) =>
      new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
    );
  }

  async getItemById(id: string): Promise<ContentItem | null> {
    const { doc, getDoc } = await import('firebase/firestore');
    const { getFirebaseDB } = await import('@umituz/web-firebase');
    const db = getFirebaseDB();

    const docRef = doc(db as any, 'calendar_items', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return null;
    }

    return {
      id: snap.id,
      ...snap.data()
    } as ContentItem;
  }

  async createItem(userId: string, item: CreateContentItemParams): Promise<ContentItem> {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const { getFirebaseDB } = await import('@umituz/web-firebase');
    const db = getFirebaseDB();

    const docRef = await addDoc(collection(db as any, 'calendar_items'), {
      ...item,
      scheduled_at: typeof item.scheduled_at === 'string' ? item.scheduled_at : item.scheduled_at.toISOString(),
      user_id: userId,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });

    return {
      id: docRef.id,
      ...item,
      scheduled_at: typeof item.scheduled_at === 'string' ? item.scheduled_at : item.scheduled_at.toISOString(),
      user_id: userId,
      created_at: new Date().toISOString()
    } as ContentItem;
  }

  async updateItem(id: string, updates: UpdateContentItemParams): Promise<void> {
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    const { getFirebaseDB } = await import('@umituz/web-firebase');
    const db = getFirebaseDB();

    const docRef = doc(db as any, 'calendar_items', id);

    const updateData: Record<string, unknown> = { ...updates };
    if (updates.scheduled_at) {
      updateData.scheduled_at = typeof updates.scheduled_at === 'string'
        ? updates.scheduled_at
        : updates.scheduled_at.toISOString();
    }

    await updateDoc(docRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
  }

  async deleteItem(id: string): Promise<void> {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const { getFirebaseDB } = await import('@umituz/web-firebase');
    const db = getFirebaseDB();

    const docRef = doc(db as any, 'calendar_items', id);
    await deleteDoc(docRef);
  }
}

/**
 * Calendar Service Implementation
 *
 * Provides CRUD operations for calendar content items
 * Uses database interface for backend abstraction
 */
export class CalendarService implements ICalendarService {
  private static instance: CalendarService;
  private database: ICalendarDatabase;

  private constructor() {
    // Use Firebase implementation by default
    this.database = new FirebaseCalendarDatabase();
  }

  public static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  /**
   * Set database implementation (for testing or custom backends)
   */
  setDatabase(database: ICalendarDatabase): void {
    this.database = database;
  }

  /**
   * Get all content items for a user
   */
  async getContentItems(userId: string, filter?: CalendarFilter): Promise<ContentItem[]> {
    const items = await this.database.getItems(userId);

    if (!filter) return items;

    // Apply filters
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
  }

  /**
   * Get a single content item by ID
   */
  async getContentItemById(id: string): Promise<ContentItem | null> {
    return this.database.getItemById(id);
  }

  /**
   * Create a new content item
   */
  async createContentItem(userId: string, item: CreateContentItemParams): Promise<ContentItem> {
    return this.database.createItem(userId, item);
  }

  /**
   * Update an existing content item
   */
  async updateContentItem(id: string, updates: UpdateContentItemParams): Promise<void> {
    await this.database.updateItem(id, updates);
  }

  /**
   * Delete a content item
   */
  async deleteContentItem(id: string): Promise<void> {
    await this.database.deleteItem(id);
  }

  /**
   * Move content item to a new date
   */
  async moveContentItem(id: string, newDate: Date): Promise<void> {
    await this.updateContentItem(id, {
      scheduled_at: newDate
    });
  }
}

/**
 * Singleton instance
 */
export const calendarService = CalendarService.getInstance();
