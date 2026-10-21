import {
  MetricCard as DSMetricCard,
} from "@umituz/web-design-system/organisms";
import type { MetricCardProps } from "../types/analytics";
import { formatMetricValue, calculateGrowth, getTrend } from "../utils/analytics";

export const MetricCard = ({
  metric,
  size = "md",
  showTrend = true,
  showIcon = true,
  lastPeriodLabel = "",
  className,
  onClick,
}: MetricCardProps) => {
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
              label: lastPeriodLabel,
            }
          : undefined
      }
      trendValueFormatter={(v) => `${Math.abs(v).toFixed(1)}%`}
      onClick={onClick}
    />
  );
};

export default MetricCard;
