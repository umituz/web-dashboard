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
