import type { ReactNode } from 'react';
import type { EmptyStateProps } from '@umituz/web-design-system/organisms';

export interface ListPageFilterOption {
  value: string;
  label: string;
}

export interface ListPageFilter {
  id: string;
  label: string;
  options: readonly ListPageFilterOption[];
}

export interface ListPageColumn<T> {
  key: string;
  header: ReactNode;
  render?: (row: T) => ReactNode;
  headerClassName?: string;
  className?: string;
}

export interface ListPageSearchConfig<T> {
  terms: (row: T) => string | readonly string[];
  placeholder?: string;
}

export interface ListPageEmptyAction {
  label: string;
  to?: string;
  onClick?: () => void;
}

export interface ListPageEmpty {
  title: string;
  description?: string;
  icon?: EmptyStateProps['icon'];
  action?: ListPageEmptyAction;
}

export interface ListPageLabels {
  searchPlaceholder: string;
  filterAll: string;
  emptyTitle: string;
  countShown: (shown: number, total: number) => string;
}

export interface ListPageProps<T> {
  title: ReactNode;
  description?: ReactNode;
  kicker?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  data: readonly T[];
  getRowId: (row: T) => string;
  columns: readonly ListPageColumn<T>[];
  search?: ListPageSearchConfig<T>;
  filters?: readonly ListPageFilter[];
  matchFilter?: (row: T, filterId: string, value: string) => boolean;
  rowLink?: (row: T) => string | undefined;
  rowActions?: (row: T) => ReactNode;
  loading?: boolean;
  empty?: ListPageEmpty;
  toolbar?: ReactNode;
  footer?: ReactNode;
  labels?: Partial<ListPageLabels>;
}

export const defaultListPageLabels: ListPageLabels = {
  searchPlaceholder: 'Search…',
  filterAll: 'All',
  emptyTitle: 'Nothing here yet',
  countShown: (shown, total) => `${shown} of ${total}`,
};
