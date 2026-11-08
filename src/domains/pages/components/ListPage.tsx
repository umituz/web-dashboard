import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { PageHeader } from '@umituz/web-design-system/templates';
import {
  EmptyState,
  FilterBar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@umituz/web-design-system/organisms';
import { FilterSelect } from '@umituz/web-design-system/molecules';
import { Skeleton } from '@umituz/web-design-system/atoms';
import {
  defaultListPageLabels,
  type ListPageColumn,
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
  getRowId,
  columns,
  search,
  filters,
  matchFilter,
  rowLink,
  rowActions,
  loading = false,
  empty,
  toolbar,
  footer,
  labels,
}: ListPageProps<T>) {
  const merged: ListPageLabels = { ...defaultListPageLabels, ...labels };
  const [query, setQuery] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});

  const activeFilters = useMemo(
    () => Object.entries(values).filter(([, value]) => value !== ''),
    [values],
  );

  const rows = useMemo(() => {
    let list = data as readonly T[];
    for (const [id, value] of activeFilters) {
      const match = matchFilter ?? matchesFilterDefault;
      list = list.filter((row) => match(row, id, value));
    }
    const q = query.trim().toLowerCase();
    if (q !== '' && search) {
      list = list.filter((row) =>
        toSearchTerms(search.terms(row)).some((term) =>
          term.toLowerCase().includes(q),
        ),
      );
    }
    return list;
  }, [data, activeFilters, query, search, matchFilter]);

  const hasToolbar = Boolean(search || (filters && filters.length > 0) || toolbar);
  const showEmpty = !loading && rows.length === 0;

  const renderCell = (column: ListPageColumn<T>, row: T, isFirst: boolean): ReactNode => {
    const content = column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '');
    const href = isFirst && rowLink ? rowLink(row) : undefined;
    if (href === undefined) return content;
    return <Link to={href}>{content}</Link>;
  };

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
              onChange={(value) =>
                setValues((prev) => ({ ...prev, [filter.id]: value }))
              }
              options={filter.options}
              ariaLabel={filter.label}
              allLabel={merged.filterAll}
            />
          ))}
        </FilterBar>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.headerClassName}>
                {column.header}
              </TableHead>
            ))}
            {rowActions && <TableHead className="w-0" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && data.length === 0
            ? Array.from({ length: 5 }, (_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                  {rowActions && <TableCell />}
                </TableRow>
              ))
            : showEmpty
              ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + (rowActions ? 1 : 0)}>
                      <EmptyState
                        title={empty?.title ?? merged.emptyTitle}
                        description={empty?.description}
                        icon={empty?.icon}
                        action={
                          empty?.action ? (
                            empty.action.to ? (
                              <Link to={empty.action.to}>{empty.action.label}</Link>
                            ) : empty.action.onClick ? (
                              {
                                label: empty.action.label,
                                onClick: empty.action.onClick,
                              }
                            ) : undefined
                          ) : undefined
                        }
                      />
                    </TableCell>
                  </TableRow>
                )
              : rows.map((row) => (
                  <TableRow key={getRowId(row)}>
                    {columns.map((column, columnIndex) => (
                      <TableCell key={column.key} className={column.className}>
                        {renderCell(column, row, columnIndex === 0)}
                      </TableCell>
                    ))}
                    {rowActions && <TableCell>{rowActions(row)}</TableCell>}
                  </TableRow>
                ))}
        </TableBody>
      </Table>

      {footer}
    </div>
  );
}
