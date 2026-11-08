import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { PageHeader } from '@umituz/web-design-system/templates';
import { DataTable, FilterBar } from '@umituz/web-design-system/organisms';
import { FilterSelect } from '@umituz/web-design-system/molecules';
import {
  defaultListPageLabels,
  type ListPageFilter,
  type ListPageLabels,
  type ListPageProps,
} from '../types';

const matchesFilterDefault = <T,>(row: T, filterId: string, value: string): boolean =>
  String((row as Record<string, unknown>)[filterId] ?? '') === value;

const toSearchTerms = (value: string | readonly string[]): readonly string[] =>
  typeof value === 'string' ? [value] : value;

export function ListPage<T>({
  title,
  description,
  kicker,
  meta,
  actions,
  data,
  columns,
  search,
  filters,
  matchFilter,
  rowLink,
  toolbar,
  footer,
  labels,
  table,
}: ListPageProps<T>) {
  const merged: ListPageLabels = { ...defaultListPageLabels, ...labels };
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});

  const rows = useMemo(() => {
    let list = data as readonly T[];
    for (const filter of filters ?? []) {
      const value = values[filter.id] ?? '';
      if (value === '') continue;
      const match = matchFilter ?? matchesFilterDefault;
      list = list.filter((row) => match(row, filter.id, value));
    }
    const q = query.trim().toLowerCase();
    if (q !== '' && search) {
      list = list.filter((row) =>
        toSearchTerms(search.terms(row)).some((term) => term.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [data, filters, values, query, search, matchFilter]);

  const hasToolbar = Boolean(search || (filters && filters.length > 0) || toolbar);

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        kicker={kicker}
        title={title}
        description={description}
        meta={meta}
        actions={actions}
      />

      {hasToolbar && (
        <FilterBar
          search={
            search
              ? {
                  value: query,
                  onChange: setQuery,
                  placeholder: search.placeholder ?? merged.searchPlaceholder,
                }
              : undefined
          }
          actions={
            <>
              {toolbar}
              <span className="text-sm text-muted-foreground" data-testid="list-page-count">
                {merged.countShown(rows.length, data.length)}
              </span>
            </>
          }
        >
          {(filters ?? []).map((filter: ListPageFilter) => (
            <FilterSelect
              key={filter.id}
              value={values[filter.id] ?? ''}
              onChange={(value) => setValues((prev) => ({ ...prev, [filter.id]: value }))}
              options={filter.options}
              ariaLabel={filter.label}
              allLabel={merged.filterAll}
            />
          ))}
        </FilterBar>
      )}

      <DataTable
        {...table}
        data={[...rows]}
        columns={[...columns]}
        onRowClick={
          rowLink
            ? (row) => {
                const href = rowLink(row);
                if (href !== undefined) navigate(href);
              }
            : table?.onRowClick
        }
      />

      {footer}
    </div>
  );
}
