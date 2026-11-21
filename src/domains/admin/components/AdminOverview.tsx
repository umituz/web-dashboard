import type { ReactNode } from 'react';
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type { AdminKpiItem, AdminSystemHealth } from '../types';
import { AdminHealthCard } from './AdminHealthCard';

export interface AdminQuickAction {
  readonly title: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly href?: string;
  readonly onClick?: () => void;
}

export interface AdminOverviewProps {
  readonly kpis?: readonly AdminKpiItem[];
  readonly health?: AdminSystemHealth;
  readonly onRefreshHealth?: () => void;
  readonly isRefreshingHealth?: boolean;
  readonly healthTitle?: string;
  readonly quickActions?: readonly AdminQuickAction[];
  readonly children?: ReactNode;
  readonly className?: string;
}

export function AdminOverview({
  kpis,
  health,
  onRefreshHealth,
  isRefreshingHealth,
  healthTitle,
  quickActions,
  children,
  className,
}: AdminOverviewProps) {
  return (
    <div className={cn('udb-admin-overview', className)}>
      {kpis && kpis.length > 0 && (
        <div className="udb-admin-kpi-grid">
          {kpis.map((kpi) => (
            <Card key={kpi.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">{kpi.label}</span>
                {kpi.icon && <span className="text-ink-3">{kpi.icon}</span>}
              </div>

              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="font-display text-2xl font-bold tracking-tight text-ink">{kpi.value}</span>
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
      )}

      <div className={cn(Boolean(health || quickActions) && 'udb-admin-layout-split')}>
        <div className="min-w-0 flex-1">{children}</div>

        {(health || (quickActions && quickActions.length > 0)) && (
          <aside className="flex flex-col gap-4">
            {health && (
              <AdminHealthCard
                health={health}
                title={healthTitle}
                onRefresh={onRefreshHealth}
                isRefreshing={isRefreshingHealth}
              />
            )}

            {quickActions && quickActions.length > 0 && (
              <Card className="p-4">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-3 mb-3">
                  Shortcuts & Actions
                </h3>
                <div className="udb-admin-quick-actions">
                  {quickActions.map((action) => {
                    const content = (
                      <>
                        {action.icon && <span className="text-ink-2">{action.icon}</span>}
                        <div className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-ink leading-tight">{action.title}</span>
                          {action.description && (
                            <span className="block text-2xs text-ink-3">{action.description}</span>
                          )}
                        </div>
                        <ChevronRight size={14} className="text-ink-4 shrink-0" />
                      </>
                    );

                    if (action.href) {
                      return (
                        <a key={action.title} href={action.href} className="udb-admin-quick-action-btn">
                          {content}
                        </a>
                      );
                    }

                    return (
                      <button
                        key={action.title}
                        type="button"
                        onClick={action.onClick}
                        className="udb-admin-quick-action-btn"
                      >
                        {content}
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
