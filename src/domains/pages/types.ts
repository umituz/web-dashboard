import type { ReactNode } from 'react';
import type { Column, DataTableProps, KpiDelta, KpiIconTone } from '@umituz/web-design-system/organisms';

export interface ListPageFilterOption {
  value: string;
  label: string;
}

export interface ListPageFilter {
  id: string;
  label: string;
  options: readonly ListPageFilterOption[];
}

export interface ListPageSearchConfig<T> {
  terms: (row: T) => string | readonly string[];
  placeholder?: string;
}

export interface ListPageLabels {
  searchPlaceholder: string;
  filterAll: string;
  countShown: (shown: number, total: number) => string;
}

export interface ListPageProps<T> {
  title: ReactNode;
  description?: ReactNode;
  kicker?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  notice?: ReactNode;
  data: readonly T[];
  columns: readonly Column<T>[];
  search?: ListPageSearchConfig<T>;
  filters?: readonly ListPageFilter[];
  matchFilter?: (row: T, filterId: string, value: string) => boolean;
  rowLink?: (row: T) => string | undefined;
  toolbar?: ReactNode;
  footer?: ReactNode;
  labels?: Partial<ListPageLabels>;
  table?: Omit<DataTableProps<T>, 'data' | 'columns'>;
}

export const defaultListPageLabels: ListPageLabels = {
  searchPlaceholder: 'Search…',
  filterAll: 'All',
  countShown: (shown, total) => `${shown} of ${total}`,
};

export interface DetailPageKpi {
  readonly label: string;
  readonly value: ReactNode;
  readonly hint?: ReactNode;
  readonly delta?: {
    readonly value: ReactNode;
    readonly direction?: 'up' | 'down' | 'flat';
  };
  readonly tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export interface DetailPageTab {
  readonly id: string;
  readonly label: ReactNode;
  readonly count?: number;
  readonly badge?: ReactNode;
  readonly icon?: ReactNode;
  readonly content?: ReactNode;
  readonly disabled?: boolean;
}

export interface DetailPageMetaItem {
  readonly label?: ReactNode;
  readonly value: ReactNode;
  readonly icon?: ReactNode;
}

export interface DetailPageBackTo {
  readonly href: string;
  readonly label?: string;
}

export interface DetailPageNotFoundConfig {
  readonly title?: string;
  readonly description?: string;
  readonly backHref?: string;
  readonly backLabel?: string;
}

export interface DetailPageProps<T = unknown> {
  readonly backTo?: DetailPageBackTo;
  readonly title: ReactNode;
  readonly kicker?: ReactNode;
  readonly badge?: ReactNode;
  readonly description?: ReactNode;
  readonly meta?: readonly (DetailPageMetaItem | ReactNode)[];
  readonly actions?: ReactNode;
  readonly notice?: ReactNode;
  readonly kpis?: readonly DetailPageKpi[];
  readonly tabs?: readonly DetailPageTab[];
  readonly activeTab?: string;
  readonly defaultTab?: string;
  readonly onTabChange?: (tabId: string) => void;
  readonly sidebar?: ReactNode;
  readonly children?: ReactNode;
  readonly notFound?: boolean | DetailPageNotFoundConfig;
  readonly payload?: T;
  readonly className?: string;
}

export interface StatGridItem {
  readonly id?: string;
  readonly label: string;
  readonly value: ReactNode;
  readonly hint?: ReactNode;
  readonly delta?: KpiDelta;
  readonly icon?: ReactNode;
  readonly iconTone?: KpiIconTone;
  readonly spark?: number[];
  readonly alert?: boolean;
  readonly onClick?: () => void;
}

export interface StatGridProps {
  readonly items?: readonly StatGridItem[];
  readonly loading?: boolean;
  readonly columns?: 1 | 2 | 3 | 4 | 'auto';
  readonly children?: ReactNode;
  readonly className?: string;
}

export type StreakBadgeTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'accent'
  | 'violet'
  | 'outline'
  | 'muted';

export interface StreakBannerAction {
  readonly label: string;
  readonly href?: string;
  readonly onClick?: () => void;
}

export interface StreakBannerProps {
  readonly streak: number;
  readonly streakLabel?: string;
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly badge?: ReactNode | { readonly label: ReactNode; readonly tone?: StreakBadgeTone };
  readonly icon?: ReactNode;
  readonly milestones?: number;
  readonly action?: StreakBannerAction | ReactNode;
  readonly className?: string;
}

export interface AttentionItem {
  readonly id: string;
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly badge?: {
    readonly label: ReactNode;
    readonly tone?: StreakBadgeTone;
  };
  readonly meta?: ReactNode;
  readonly href?: string;
  readonly onClick?: () => void;
  readonly icon?: ReactNode;
}

export interface AttentionQueueProps {
  readonly items: readonly AttentionItem[];
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly density?: 'normal' | 'dense';
  readonly maxItems?: number;
  readonly onItemClick?: (item: AttentionItem) => void;
  readonly className?: string;
}

export interface MetricProgressItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly count?: number | string;
  readonly value?: ReactNode;
  readonly percent?: number;
  readonly tone?: 'primary' | 'success' | 'warning' | 'destructive' | 'danger' | 'info' | 'auto';
  readonly href?: string;
  readonly onClick?: () => void;
}

export interface MetricProgressListProps {
  readonly items: readonly MetricProgressItem[];
  readonly max?: number;
  readonly title?: ReactNode;
  readonly onItemClick?: (item: MetricProgressItem) => void;
  readonly className?: string;
}

export interface OverviewPageHeaderProps {
  readonly title: ReactNode;
  readonly kicker?: ReactNode;
  readonly description?: ReactNode;
  readonly subtitle?: ReactNode;
  readonly actions?: ReactNode;
}

export interface OverviewPageProps {
  readonly header?: OverviewPageHeaderProps | ReactNode;
  readonly banner?: ReactNode;
  readonly kpis?: readonly StatGridItem[] | ReactNode;
  readonly children?: ReactNode;
  readonly sidebar?: ReactNode;
  readonly className?: string;
}

export interface GoalProgressAction {
  readonly label: string;
  readonly href?: string;
  readonly onClick?: () => void;
}

export interface GoalProgressCardProps {
  readonly title: ReactNode;
  readonly current: number;
  readonly target: number;
  readonly unit?: string;
  readonly subtitle?: ReactNode;
  readonly icon?: ReactNode;
  readonly tone?: 'primary' | 'success' | 'warning' | 'destructive' | 'neutral';
  readonly action?: GoalProgressAction | ReactNode;
  readonly remainingLabel?: (remaining: number) => ReactNode;
  readonly completedLabel?: ReactNode;
  readonly showPercent?: boolean;
  readonly className?: string;
}
