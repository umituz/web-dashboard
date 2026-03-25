/**
 * Calendar Domain Types
 */

/**
 * Content item status
 */
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'failed';

/**
 * Content item type
 */
export type ContentType = 'post' | 'story' | 'reel' | 'tweet' | 'article';

/**
 * Calendar view type
 */
export type CalendarView = 'month' | 'week' | 'day' | 'timeline';

/**
 * Content item
 */
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type?: ContentType;
  status: ContentStatus;
  scheduled_at: string;
  platforms: string[];
  app_name: string;
  user_id?: string;
  media_url?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Calendar event
 */
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'content' | 'campaign' | 'reminder';
  status: string;
  color?: string;
}

/**
 * Calendar filter
 */
export interface CalendarFilter {
  search?: string;
  platforms?: string[];
  types?: ContentType[];
  status?: ContentStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Calendar configuration
 */
export interface CalendarConfig {
  /** Default view */
  defaultView?: CalendarView;
  /** Show weekends */
  showWeekends?: boolean;
  /** Start of week (0-6, 0 = Sunday) */
  startOfWeek?: number;
  /** Hour range for day/week view */
  hourRange?: {
    start: number; // 0-23
    end: number; // 0-23
  };
  /** Enable drag and drop */
  enableDragDrop?: boolean;
  /** Show platform filters */
  showPlatformFilters?: boolean;
  /** Available platforms */
  platforms?: string[];
  /** Time slot duration in minutes */
  slotDuration?: number;
}

/**
 * Content item creation params
 */
export interface CreateContentItemParams {
  title: string;
  description: string;
  scheduled_at: string | Date;
  platforms: string[];
  app_name: string;
  type?: ContentType;
  status?: ContentStatus;
  media_url?: string;
  tags?: string[];
}

/**
 * Content item update params
 */
export interface UpdateContentItemParams {
  title?: string;
  description?: string;
  scheduled_at?: string | Date;
  platforms?: string[];
  type?: ContentType;
  status?: ContentStatus;
  media_url?: string;
  tags?: string[];
}

/**
 * Calendar service interface
 */
export interface ICalendarService {
  getContentItems(userId: string, filter?: CalendarFilter): Promise<ContentItem[]>;
  getContentItemById(id: string): Promise<ContentItem | null>;
  createContentItem(userId: string, item: CreateContentItemParams): Promise<ContentItem>;
  updateContentItem(id: string, updates: UpdateContentItemParams): Promise<void>;
  deleteContentItem(id: string): Promise<void>;
  moveContentItem(id: string, newDate: Date): Promise<void>;
}
