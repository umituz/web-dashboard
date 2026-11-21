import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type { AdminKpiItem } from '../types';

export interface AdminKpiGridProps {
  readonly items: readonly AdminKpiItem[];
  readonly loading?: boolean;
  readonly columns?: 2 | 3 | 4 | 'auto';
  readonly className?: string;
}

const COLUMN_CLASSES: Record<2 | 3 | 4 | 'auto', string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  auto: 'udb-admin-kpi-grid',
};

export function AdminKpiGrid({
  items,
  loading = false,
  columns = 'auto',
  className,
}: AdminKpiGridProps) {
  if (loading) {
    return (
      <div className={cn('grid gap-4', COLUMN_CLASSES[columns], className)}>
        {[0, 1, 2, 3].map((idx) => (
          <Card key={idx} className="p-4 animate-pulse">
            <div className="h-3 w-24 bg-surface-200 rounded" />
            <div className="mt-3 h-8 w-16 bg-surface-300 rounded" />
            <div className="mt-2 h-2 w-32 bg-surface-200 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn('grid gap-4', COLUMN_CLASSES[columns], className)}>
      {items.map((kpi) => (
        <Card key={kpi.id} className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">
              {kpi.label}
            </span>
            {kpi.icon && <span className="text-ink-3">{kpi.icon}</span>}
          </div>

          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-ink">
              {kpi.value}
            </span>
            {kpi.change && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-medium',
                  kpi.change.trend === 'up' && 'text-emerald-600',
                  kpi.change.trend === 'down' && 'text-rose-600',
                  kpi.change.trend === 'neutral' && 'text-ink-3',
                )}
              >
                {kpi.change.trend === 'up' && <TrendingUp size={12} />}
                {kpi.change.trend === 'down' && <TrendingDown size={12} />}
                {kpi.change.value}
              </span>
            )}
          </div>

          {kpi.sub && <p className="mt-1 text-2xs text-ink-3">{kpi.sub}</p>}
        </Card>
      ))}
    </div>
  );
}
