import type { ReactNode } from 'react';
import type { Column, DataTableProps } from '@umituz/web-design-system/organisms';

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
