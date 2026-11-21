import type { ReactNode } from 'react';

export type ActivityTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'violet';

export interface ActivityActor {
  readonly id?: string;
  readonly name: string;
  readonly avatarUrl?: string;
  readonly initials?: string;
}

export interface ActivityTarget {
  readonly label: ReactNode;
  readonly href?: string;
}

export interface ActivityItem<T = unknown> {
  readonly id: string;
  readonly timestamp: string | number | Date;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly actor?: ActivityActor | string;
  readonly target?: ActivityTarget | ReactNode;
  readonly icon?: ReactNode;
  readonly tone?: ActivityTone;
  readonly badge?: ReactNode;
  readonly meta?: ReactNode;
  readonly href?: string;
  readonly payload?: T;
}

export interface ActivityFeedProps<T = unknown> {
  readonly items: readonly ActivityItem<T>[];
  readonly groupByDay?: boolean;
  readonly density?: 'normal' | 'dense';
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly emptyIcon?: ReactNode;
  readonly onItemClick?: (item: ActivityItem<T>) => void;
  readonly className?: string;
}

export interface ActivityTimelineProps<T = unknown> {
  readonly items: readonly ActivityItem<T>[];
  readonly groupByDay?: boolean;
  readonly density?: 'normal' | 'dense';
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly emptyIcon?: ReactNode;
  readonly newestFirst?: boolean;
  readonly onItemClick?: (item: ActivityItem<T>) => void;
  readonly className?: string;
}

export interface ActivityGroup<T = unknown> {
  readonly dateKey: string;
  readonly label: string;
  readonly items: readonly ActivityItem<T>[];
}
