export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export type ContentType = 'post' | 'story' | 'reel' | 'tweet' | 'article';

export type CalendarView = 'month' | 'week' | 'day' | 'timeline';

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

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'content' | 'campaign' | 'reminder';
  status: string;
  color?: string;
}

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

export interface CalendarConfig {
    defaultView?: CalendarView;
    showWeekends?: boolean;
    startOfWeek?: number;
    hourRange?: {
    start: number;     end: number;   };
    enableDragDrop?: boolean;
    showPlatformFilters?: boolean;
    platforms?: string[];
    slotDuration?: number;
}

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

export interface ICalendarService {
  getContentItems(userId: string, filter?: CalendarFilter): Promise<ContentItem[]>;
  getContentItemById(id: string): Promise<ContentItem | null>;
  createContentItem(userId: string, item: CreateContentItemParams): Promise<ContentItem>;
  updateContentItem(id: string, updates: UpdateContentItemParams): Promise<void>;
  deleteContentItem(id: string): Promise<void>;
  moveContentItem(id: string, newDate: Date): Promise<void>;
}
