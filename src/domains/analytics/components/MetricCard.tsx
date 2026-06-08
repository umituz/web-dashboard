/**
 * MetricCard
 *
 * Single KPI tile with a trend indicator. Uses theme tokens
 * for colors (no hardcoded green/orange) and a11y role=button
 * when interactive.
 */

import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@umituz/web-design-system/utils";
import type { MetricCardProps } from "../types/analytics";
import { formatMetricValue, calculateGrowth, getTrend } from "../utils/analytics";
import { ANALYTICS_KEYS } from "../utils/i18nKeys";

const SIZE_PADDING = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

const TITLE_SIZE = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
} as const;

const VALUE_SIZE = {
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-4xl',
} as const;

export const MetricCard = ({
  metric,
  size = "md",
  showTrend = true,
  showIcon = true,
  className,
  onClick,
}: MetricCardProps) => {
  const { t } = useTranslation();

  const hasPrevious = metric.previousValue !== undefined;
  const growth = hasPrevious ? calculateGrowth(metric.value, metric.previousValue as number) : null;
  const trend = growth !== null ? getTrend(growth) : 'stable';

  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
  const trendColor =
    trend === 'up'
      ? 'text-success'
      : trend === 'down'
      ? 'text-destructive'
      : 'text-muted-foreground';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${metric.name} — ${formatMetricValue(metric)}` : undefined}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      className={cn(
        'bg-background border border-border rounded-xl',
        SIZE_PADDING[size],
        onClick && 'cursor-pointer hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn('text-muted-foreground font-medium mb-1', TITLE_SIZE[size])}>
            {metric.name}
          </p>

          <div className={cn('font-bold text-foreground', VALUE_SIZE[size])}>
            {formatMetricValue(metric)}
          </div>

          {showTrend && hasPrevious && growth !== null && (
            <div className="flex items-center gap-1 mt-2" aria-label={t(ANALYTICS_KEYS.metric.change)}>
              <TrendIcon className={cn('h-4 w-4', trendColor)} aria-hidden="true" />
              <span className={cn('text-sm font-medium', trendColor)}>
                {Math.abs(growth).toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground">
                {t(ANALYTICS_KEYS.common.lastPeriod)}
              </span>
            </div>
          )}
        </div>

        {showIcon && metric.icon && (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <metric.icon className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
