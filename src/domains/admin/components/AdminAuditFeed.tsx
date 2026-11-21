import type { ReactNode } from 'react';
import { Badge } from '@umituz/web-design-system/atoms';
import { EmptyState } from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type { AdminAuditEntry, AdminAuditSeverity } from '../types';

export interface AdminAuditFeedProps {
  readonly entries: readonly AdminAuditEntry[];
  readonly loading?: boolean;
  readonly emptyLabel?: string;
  readonly maxItems?: number;
  readonly onEntryClick?: (entry: AdminAuditEntry) => void;
  readonly actions?: (entry: AdminAuditEntry) => ReactNode;
  readonly className?: string;
}

const SEVERITY_TONES: Record<AdminAuditSeverity, 'info' | 'warning' | 'danger'> = {
  info: 'info',
  warning: 'warning',
  danger: 'danger',
};

function formatTimestamp(ts: string | number | Date): string {
  if (typeof ts === 'string') return ts;
  if (typeof ts === 'number') {
    return new Date(ts).toISOString().slice(0, 19).replace('T', ' ');
  }
  return ts.toISOString().slice(0, 19).replace('T', ' ');
}

export function AdminAuditFeed({
  entries,
  loading = false,
  emptyLabel = 'No audit entries recorded yet.',
  maxItems,
  onEntryClick,
  actions,
  className,
}: AdminAuditFeedProps) {
  if (loading) {
    return (
      <div className={cn('udb-admin-audit-loading', className)}>
        <span className="animate-pulse">Loading audit trail…</span>
      </div>
    );
  }

  const items = maxItems ? entries.slice(0, maxItems) : entries;

  if (items.length === 0) {
    return (
      <div className={cn('p-6', className)}>
        <EmptyState title={emptyLabel} />
      </div>
    );
  }

  return (
    <ul className={cn('udb-admin-audit-feed', className)}>
      {items.map((entry) => {
        const severity = entry.severity ?? 'info';
        const tone = SEVERITY_TONES[severity];
        const dateStr = formatTimestamp(entry.timestamp);

        return (
          <li
            key={entry.id}
            onClick={onEntryClick ? () => onEntryClick(entry) : undefined}
            className={cn('udb-admin-audit-feed-item', onEntryClick && 'cursor-pointer hover:bg-surface-50')}
          >
            <Badge tone={tone} small className="capitalize">
              {severity}
            </Badge>

            <div className="udb-admin-audit-feed-body">
              <div className="udb-admin-audit-feed-header">
                <span className="udb-admin-audit-action">{entry.action}</span>
                {entry.target && <span className="udb-admin-audit-target">→ {entry.target}</span>}
              </div>

              <div className="udb-admin-audit-feed-meta">
                <span>{entry.actorName ?? entry.actor}</span>
                {entry.entityType && <span>· {entry.entityType}</span>}
                <span>· {dateStr}</span>
              </div>
            </div>

            {actions && <div className="udb-admin-audit-feed-actions">{actions(entry)}</div>}
          </li>
        );
      })}
    </ul>
  );
}
