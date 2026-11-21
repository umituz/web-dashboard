import { Activity, AlertTriangle, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import { Badge, Button } from '@umituz/web-design-system/atoms';
import { Card } from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type { AdminSystemHealth } from '../types';

export interface AdminHealthCardProps {
  readonly health: AdminSystemHealth;
  readonly title?: string;
  readonly subtitle?: string;
  readonly onRefresh?: () => void;
  readonly isRefreshing?: boolean;
  readonly className?: string;
}

export function AdminHealthCard({
  health,
  title = 'System Telemetry',
  subtitle = 'Live infrastructure and service checks',
  onRefresh,
  isRefreshing = false,
  className,
}: AdminHealthCardProps) {
  const tone = health.status === 'healthy' ? 'success' : health.status === 'degraded' ? 'warning' : 'danger';
  const label = health.status === 'healthy' ? 'Operational' : health.status === 'degraded' ? 'Degraded' : 'Outage';

  return (
    <Card className={cn('p-5', className)}>
      <div className="udb-admin-health-header mb-4">
        <div className="flex items-center gap-2.5">
          <Activity size={18} className="text-ink-2" />
          <div>
            <h3 className="font-display text-base font-semibold text-ink leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-ink-3">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="udb-admin-health-status-row">
            <span
              className={cn(
                'udb-admin-pulse-lamp',
                health.status === 'healthy' && 'udb-admin-pulse-lamp--healthy',
                health.status === 'degraded' && 'udb-admin-pulse-lamp--degraded',
                health.status === 'down' && 'udb-admin-pulse-lamp--down',
              )}
            />
            <Badge variant={tone}>{label}</Badge>
          </div>

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh telemetry"
              className="h-8 w-8 p-0"
            >
              <RefreshCw size={13} className={cn(isRefreshing && 'animate-spin')} />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-y border-line py-3 text-center">
        <div>
          <span className="block text-2xs font-semibold uppercase tracking-wider text-ink-3">Latency</span>
          <span className="font-mono text-sm font-semibold text-ink">
            {typeof health.latencyMs === 'number' ? `${health.latencyMs}ms` : '—'}
          </span>
        </div>
        <div>
          <span className="block text-2xs font-semibold uppercase tracking-wider text-ink-3">Uptime</span>
          <span className="font-mono text-sm font-semibold text-ink">{health.uptime ?? '99.98%'}</span>
        </div>
        <div>
          <span className="block text-2xs font-semibold uppercase tracking-wider text-ink-3">Version</span>
          <span className="font-mono text-sm font-semibold text-ink">{health.version ?? '—'}</span>
        </div>
      </div>

      {health.checks && health.checks.length > 0 && (
        <div className="udb-admin-checks-list mt-3.5">
          {health.checks.map((check) => {
            const checkTone = check.status === 'ok' ? 'text-emerald-600' : check.status === 'warn' ? 'text-amber-600' : 'text-rose-600';
            const CheckIcon = check.status === 'ok' ? CheckCircle2 : check.status === 'warn' ? AlertTriangle : XCircle;

            return (
              <div key={check.name} className="udb-admin-check-item">
                <div className="flex items-center gap-2">
                  <CheckIcon size={14} className={checkTone} />
                  <span className="font-medium text-ink">{check.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {check.message && <span className="text-2xs text-ink-3">{check.message}</span>}
                  {typeof check.latencyMs === 'number' && (
                    <span className="font-mono text-xs text-ink-2">{check.latencyMs}ms</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
