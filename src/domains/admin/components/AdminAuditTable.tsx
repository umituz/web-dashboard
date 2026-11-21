import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CircleAlert, Clock, Search } from 'lucide-react';
import { Badge, Button, Input, NativeSelect } from '@umituz/web-design-system/atoms';
import {
  Card,
  Column,
  DataTable,
  EmptyState,
  TablePagination,
} from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type { AdminAuditChange, AdminAuditEntry, AdminAuditSeverity } from '../types';

export interface AdminAuditTableActionOption {
  readonly value: string;
  readonly label: string;
}

export interface AdminAuditTableProps {
  readonly entries: readonly AdminAuditEntry[];
  readonly loading?: boolean;
  readonly error?: Error | string | null;
  readonly onRetry?: () => void;
  readonly total?: number;
  readonly page?: number;
  readonly pageSize?: number;
  readonly onPageChange?: (page: number) => void;
  readonly actionFilter?: string;
  readonly onActionFilterChange?: (action: string) => void;
  readonly actionOptions?: readonly AdminAuditTableActionOption[];
  readonly searchQuery?: string;
  readonly onSearchQueryChange?: (query: string) => void;
  readonly onSearchSubmit?: (query: string) => void;
  readonly searchPlaceholder?: string;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly onRowClick?: (entry: AdminAuditEntry) => void;
  readonly renderChanges?: (changes: readonly AdminAuditChange[]) => ReactNode;
  readonly className?: string;
}

const SEVERITY_TONES: Record<AdminAuditSeverity, 'info' | 'warning' | 'danger'> = {
  info: 'info',
  warning: 'warning',
  danger: 'danger',
};

function formatStamp(ts: string | number | Date): string {
  if (typeof ts === 'string') return ts;
  if (typeof ts === 'number') {
    return new Date(ts).toISOString().slice(0, 19).replace('T', ' ');
  }
  return ts.toISOString().slice(0, 19).replace('T', ' ');
}

function defaultRenderChanges(changes: readonly AdminAuditChange[]): ReactNode {
  if (changes.length === 0) return null;
  const text = changes
    .map((ch) => [ch.field, ch.from, ch.to].filter(Boolean).join(': '))
    .filter(Boolean)
    .join(' · ');
  return text ? <span className="text-2xs text-ink-3 truncate block max-w-xs">{text}</span> : null;
}

export function AdminAuditTable({
  entries,
  loading = false,
  error = null,
  onRetry,
  total,
  page,
  pageSize = 16,
  onPageChange,
  actionFilter,
  onActionFilterChange,
  actionOptions,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  searchPlaceholder = 'Search actor, target or action…',
  emptyTitle = 'No audit entries found',
  emptyDescription = 'Try loosening the search filters or check back later.',
  onRowClick,
  renderChanges = defaultRenderChanges,
  className,
}: AdminAuditTableProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [localAction, setLocalAction] = useState('');

  const currentSearch = searchQuery !== undefined ? searchQuery : localSearch;
  const currentAction = actionFilter !== undefined ? actionFilter : localAction;

  const handleSearchChange = (val: string) => {
    if (onSearchQueryChange) {
      onSearchQueryChange(val);
    } else {
      setLocalSearch(val);
    }
  };

  const handleActionChange = (val: string) => {
    if (onActionFilterChange) {
      onActionFilterChange(val);
    } else {
      setLocalAction(val);
    }
  };

  const isClientFiltered = searchQuery === undefined && actionFilter === undefined;

  const filteredEntries = useMemo(() => {
    if (!isClientFiltered) return entries;

    const term = currentSearch.toLowerCase().trim();
    return entries.filter((item) => {
      if (currentAction && item.action !== currentAction) {
        return false;
      }
      if (!term) return true;
      const actorMatch = (item.actorName ?? item.actor).toLowerCase().includes(term);
      const actionMatch = item.action.toLowerCase().includes(term);
      const targetMatch = item.target ? item.target.toLowerCase().includes(term) : false;
      const entityMatch = item.entityType ? item.entityType.toLowerCase().includes(term) : false;
      return actorMatch || actionMatch || targetMatch || entityMatch;
    });
  }, [entries, isClientFiltered, currentSearch, currentAction]);

  const columns: Column<AdminAuditEntry>[] = useMemo(
    () => [
      {
        id: 'stamp',
        header: 'When',
        width: 160,
        cell: (r) => (
          <span className="font-mono text-xs text-ink-2 whitespace-nowrap">
            {formatStamp(r.timestamp)}
          </span>
        ),
      },
      {
        id: 'severity',
        header: 'Severity',
        width: 90,
        cell: (r) => {
          const sev = r.severity ?? 'info';
          return (
            <Badge tone={SEVERITY_TONES[sev]} small className="capitalize">
              {sev}
            </Badge>
          );
        },
      },
      {
        id: 'action',
        header: 'Action',
        cell: (r) => (
          <span className="font-mono text-xs font-semibold text-ink whitespace-nowrap">
            {r.action}
          </span>
        ),
      },
      {
        id: 'target',
        header: 'Target',
        cell: (r) => (
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium text-ink truncate">
              {r.target ?? (r.entityType ? `[${r.entityType}]` : '—')}
            </span>
            {r.changes && renderChanges(r.changes)}
          </div>
        ),
      },
      {
        id: 'actor',
        header: 'Actor',
        cell: (r) => (
          <span className="text-sm text-ink-2 truncate block max-w-xs">
            {r.actorName ?? r.actor}
          </span>
        ),
      },
    ],
    [renderChanges],
  );

  const displayEntries = isClientFiltered ? filteredEntries : (entries as AdminAuditEntry[]);
  const totalCount = total !== undefined ? total : displayEntries.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : null;

  return (
    <div className={cn('udb-admin-audit-table-wrapper space-y-4', className)}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px]">
          <Input
            icon={<Search size={16} />}
            placeholder={searchPlaceholder}
            value={currentSearch}
            aria-label="Search audit log"
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onSearchSubmit) {
                onSearchSubmit(currentSearch);
              }
            }}
          />
        </div>

        {actionOptions && actionOptions.length > 0 && (
          <div className="w-52">
            <NativeSelect
              aria-label="Action filter"
              value={currentAction}
              onChange={(e) => handleActionChange(e.target.value)}
              options={actionOptions}
            />
          </div>
        )}

        {onSearchSubmit && (
          <Button
            variant="primary"
            icon={<Search size={16} />}
            onClick={() => onSearchSubmit(currentSearch)}
          >
            Search
          </Button>
        )}
      </div>

      {errorMessage ? (
        <EmptyState
          title="Something went wrong"
          description={errorMessage}
          icon={<CircleAlert size={22} />}
          action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined}
        />
      ) : (
        <Card className="overflow-hidden">
          <DataTable<AdminAuditEntry>
            data={[...displayEntries]}
            columns={columns}
            rowKey={(r) => r.id}
            dense
            loading={loading && displayEntries.length === 0}
            onRowClick={onRowClick}
            empty={
              <EmptyState
                icon={<Clock size={20} />}
                title={emptyTitle}
                description={emptyDescription}
              />
            }
          />

          {page !== undefined && onPageChange !== undefined && totalPages > 1 && (
            <div className="p-3 border-t border-line-200">
              <TablePagination
                page={page}
                totalPages={totalPages}
                onPage={onPageChange}
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
