import { KpiCard } from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type { StatGridProps } from '../types';

const COLUMN_CLASSES: Record<1 | 2 | 3 | 4 | 'auto', string> = {
  1: 'udb-stat-grid--cols-1',
  2: 'udb-stat-grid--cols-2',
  3: 'udb-stat-grid--cols-3',
  4: 'udb-stat-grid--cols-4',
  auto: 'udb-stat-grid--auto',
};

export function StatGrid({
  items,
  loading = false,
  columns = 'auto',
  children,
  className,
}: StatGridProps) {
  const colClass = COLUMN_CLASSES[columns];

  if (loading) {
    return (
      <div className={cn('udb-stat-grid', colClass, className)} role="status" aria-busy="true">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="udb-stat-skeleton">
            <div className="udb-stat-skeleton-label" />
            <div className="udb-stat-skeleton-val" />
            <div className="udb-stat-skeleton-hint" />
          </div>
        ))}
      </div>
    );
  }

  if (children) {
    return (
      <div className={cn('udb-stat-grid', colClass, className)}>
        {children}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={cn('udb-stat-grid', colClass, className)}>
      {items.map((kpi, idx) => (
        <KpiCard
          key={kpi.id ?? idx}
          label={kpi.label}
          value={kpi.value}
          hint={kpi.hint}
          delta={kpi.delta}
          icon={kpi.icon}
          iconTone={kpi.iconTone}
          spark={kpi.spark}
          alert={kpi.alert}
          onClick={kpi.onClick}
        />
      ))}
    </div>
  );
}
