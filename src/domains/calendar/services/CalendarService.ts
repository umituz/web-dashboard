/**
 * Calendar Service
 *
 * Firebase-based calendar service for managing content items
 * Uses dependency-injected database interface for testability
 */

import type {
  ContentItem,
  CalendarFilter,
  CreateContentItemParams,
  UpdateContentItemParams,
  ICalendarService,
} from '../types/calendar.types';
import {
  mapCalendarDocument,
  mapPostDocument,
  type FirestoreDocument,
} from '../utils/contentItemMapper';
import type { Firestore } from 'firebase/firestore';

/**
 * Database interface for calendar operations
 * Implementations can provide different backends
 */
export interface ICalendarDatabase {
  getItems(userId: string): Promise<ContentItem[]>;
  getItemById(id: string): Promise<ContentItem | null>;
  createItem(userId: string, item: CreateContentItemParams): Promise<ContentItem>;
  updateItem(id: string, updates: UpdateContentItemParams): Promise<void>;
  deleteItem(id: string): Promise<void>;
}

/**
 * Firestore document with id for both collections
 */
type CalendarDoc = FirestoreDocument<Record<string, unknown>>;

/**
 * Resolve scheduled_at to ISO string regardless of source type
 */
const resolveScheduledAt = (value: string | Date | undefined): string => {
  if (value === undefined) {
    throw new Error('scheduled_at is required to create or update a content item');
  }
  if (typeof value === 'string') return value;
  return value.toISOString();
};

/**
 * Firebase implementation of calendar database
 */
class FirebaseCalendarDatabase implements ICalendarDatabase {
  async getItems(userId: string): Promise<ContentItem[]> {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { getFirebaseDB } = await import('@umituz/web-firebase');
    const db = getFirebaseDB() as Firestore;

    const calendarQuery = query(
      collection(db, 'calendar_items'),
      where('user_id', '==', userId),
    );

    const postsQuery = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
    );

    const [calendarSnap, postsSnap] = await Promise.all([
      getDocs(calendarQuery),
      getDocs(postsQuery),
    ]);

    const calendarItems = calendarSnap.docs.map((doc) =>
      mapCalendarDocument(doc as unknown as CalendarDoc),
    );

    const postItems = postsSnap.docs.map((doc) =>
      mapPostDocument(doc as unknown as CalendarDoc),
    );

    return [...calendarItems, ...postItems].sort(
      (a, b) =>
        new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime(),
    );
  }

  async getItemById(id: string): Promise<ContentItem | null> {
    const { doc, getDoc } = await import('firebase/firestore');
    const { getFirebaseDB } = await import('@umituz/web-firebase');
    const db = getFirebaseDB() as Firestore;

    const docRef = doc(db, 'calendar_items', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return null;
    }

    return mapCalendarDocument(snap as unknown as CalendarDoc);
  }

  async createItem(userId: string, item: CreateContentItemParams): Promise<ContentItem> {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const { getFirebaseDB } = await import('@umituz/web-firebase');
    const db = getFirebaseDB() as Firestore;

    const scheduledAt = resolveScheduledAt(item.scheduled_at);

    const docRef = await addDoc(collection(db, 'calendar_items'), {
      ...item,
      scheduled_at: scheduledAt,
      user_id: userId,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return {
      id: docRef.id,
      title: item.title ?? '',
      description: item.description ?? '',
      scheduled_at: scheduledAt,
      platforms: item.platforms ?? [],
      app_name: item.app_name ?? '',
      status: item.status ?? 'draft',
      type: item.type ?? 'post',
      user_id: userId,
      created_at: new Date().toISOString(),
    };
  }

  async updateItem(id: string, updates: UpdateContentItemParams): Promise<void> {
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    const { getFirebaseDB } = await import('@umituz/web-firebase');
    const db = getFirebaseDB() as Firestore;

    const docRef = doc(db, 'calendar_items', id);

    const updateData: Record<string, unknown> = { ...updates };
    if (updates.scheduled_at) {
      updateData.scheduled_at = resolveScheduledAt(updates.scheduled_at);
    }

    await updateDoc(docRef, {
      ...updateData,
      updated_at: serverTimestamp(),
    });
  }

  async deleteItem(id: string): Promise<void> {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const { getFirebaseDB } = await import('@umituz/web-firebase');
    const db = getFirebaseDB() as Firestore;

    const docRef = doc(db, 'calendar_items', id);
    await deleteDoc(docRef);
  }
}

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

  constructor(database: ICalendarDatabase = new FirebaseCalendarDatabase()) {
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
 * Default singleton instance using the Firebase implementation
 */
export const calendarService = new CalendarService();

/**
 * Exported for testing/extension.
 */
export { applyCalendarFilter };
