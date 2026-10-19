import type { ContentItem, ContentStatus, ContentType } from '../types/calendar.types';

interface CalendarItemDocument {
  title?: string;
  description?: string;
  scheduled_at?: string | { toDate: () => Date };
  platforms?: string[];
  app_name?: string;
  status?: string;
  type?: string;
  content?: string;
  platform?: string;
  appName?: string;
  scheduledAt?: string | { toDate: () => Date };
  userId?: string;
  user_id?: string;
  created_at?: string | { toDate: () => Date };
  updated_at?: string | { toDate: () => Date };
}

export interface FirestoreDocument<T = Record<string, unknown>> {
  id: string;
  data: () => T;
}

const toIsoString = (value: string | { toDate: () => Date } | undefined): string => {
  if (!value) return new Date(0).toISOString();
  if (typeof value === 'string') return value;
  return value.toDate().toISOString();
};

const normalizeStatus = (status: string | undefined): ContentStatus => {
  const valid: ContentStatus[] = ['draft', 'scheduled', 'published', 'failed'];
  return valid.includes(status as ContentStatus) ? (status as ContentStatus) : 'draft';
};

const normalizeType = (type: string | undefined): ContentType => {
  const valid: ContentType[] = ['post', 'story', 'reel', 'tweet', 'article'];
  return valid.includes(type as ContentType) ? (type as ContentType) : 'post';
};

export const mapCalendarDocument = (doc: FirestoreDocument<CalendarItemDocument>): ContentItem => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title ?? '',
    description: data.description ?? data.content ?? '',
    scheduled_at: toIsoString(data.scheduled_at),
    platforms: Array.isArray(data.platforms) ? data.platforms : [],
    app_name: data.app_name ?? data.appName ?? '',
    status: normalizeStatus(data.status),
    type: normalizeType(data.type),
  };
};

export const mapPostDocument = (doc: FirestoreDocument<CalendarItemDocument>): ContentItem => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title ?? '',
    description: data.content ?? '',
    scheduled_at: toIsoString(data.scheduledAt),
    platforms: data.platform ? [data.platform] : [],
    app_name: data.appName ?? '',
    status: normalizeStatus(data.status),
    type: 'post',
  };
};
