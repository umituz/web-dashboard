/**
 * Metric Card Component
 *
 * Displays a single metric with trend indicator
 */

import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import type { MetricCardProps } from "../types/analytics";
import { formatMetricValue, calculateGrowth } from "../utils/analytics";

export const MetricCard = ({
  metric,
  size = "md",
  showTrend = true,
  showIcon = true,
  className,
  onClick,
}: MetricCardProps) => {
  const growth =
    metric.previousValue !== undefined
      ? calculateGrowth(metric.value, metric.previousValue)
      : 0;

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const titleSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const valueSizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-background border border-border rounded-xl",
        sizeClasses[size],
        onClick && "cursor-pointer hover:border-primary/50 transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <p
            className={cn(
              "text-muted-foreground font-medium mb-1",
              titleSizeClasses[size]
            )}
          >
            {metric.name}
          </p>

          {/* Value */}
          <div className={cn("font-bold text-foreground", valueSizeClasses[size])}>
            {formatMetricValue(metric)}
          </div>

          {/* Trend */}
          {showTrend && metric.previousValue !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {growth > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-500" />
              ) : growth < 0 ? (
                <ArrowDown className="h-4 w-4 text-destructive" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  growth > 0 && "text-green-600 dark:text-green-500",
                  growth < 0 && "text-destructive",
                  growth === 0 && "text-muted-foreground"
                )}
              >
                {Math.abs(growth).toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground">
                vs last period
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        {showIcon && metric.icon && (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <metric.icon className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
