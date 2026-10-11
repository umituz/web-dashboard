/**
 * MetricCard — dashboard logic (growth, i18n, a11y) on top of the
 * design-system MetricCard presentation.
 */

import {
  MetricCard as DSMetricCard,
} from "@umituz/web-design-system/organisms";
import { useT } from "../../../i18n";
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
  const t = useT();

  const hasPrevious = metric.previousValue !== undefined;
  const growth = hasPrevious ? calculateGrowth(metric.value, metric.previousValue as number) : null;
  const trend = growth !== null ? getTrend(growth) : "stable";

  return (
    <DSMetricCard
      className={className}
      title={metric.name}
      value={formatMetricValue(metric)}
      icon={showIcon ? metric.icon : undefined}
      iconColor="text-primary"
      size={size}
      trend={
        showTrend && growth !== null && trend !== "stable"
          ? {
              value: growth,
              label: t(ANALYTICS_KEYS.common.lastPeriod),
            }
          : undefined
      }
      trendValueFormatter={(v) => `${Math.abs(v).toFixed(1)}%`}
      onClick={onClick}
    />
  );
};

export default MetricCard;
