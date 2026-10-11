/**
 * MetricCard
 *
 * Single KPI tile with a trend indicator. Colors and sizes come
 * from `--u-*` tokens via the `udb-metric-*` classes (no hardcoded
 * green/orange) and a11y role=button when interactive.
 */

import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../primitives";
import type { MetricCardProps } from "../types/analytics";
import { formatMetricValue, calculateGrowth, getTrend } from "../utils/analytics";
import { ANALYTICS_KEYS } from "../utils/i18nKeys";

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
        'udb-metric',
        `udb-metric--${size}`,
        onClick && 'udb-metric--interactive',
        className,
      )}
    >
      <div className="udb-metric__head">
        <div className="udb-metric__body">
          <p className="udb-metric__name">{metric.name}</p>

          <div className="udb-metric__value">{formatMetricValue(metric)}</div>

          {showTrend && hasPrevious && growth !== null && (
            <div
              className={cn('udb-metric__trend', `udb-metric__trend--${trend}`)}
              aria-label={t(ANALYTICS_KEYS.metric.change)}
            >
              <TrendIcon className="udb-metric__trend-icon" aria-hidden="true" />
              <span className="udb-metric__trend-value">
                {Math.abs(growth).toFixed(1)}%
              </span>
              <span className="udb-metric__trend-period">
                {t(ANALYTICS_KEYS.common.lastPeriod)}
              </span>
            </div>
          )}
        </div>

        {showIcon && metric.icon && (
          <div className="udb-metric__icon-box">
            <metric.icon className="udb-metric__icon" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
