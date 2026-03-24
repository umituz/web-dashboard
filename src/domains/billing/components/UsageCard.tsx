/**
 * Usage Card Component
 *
 * Display usage metrics with progress bar
 */

import { AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import type { UsageCardProps } from "../types/billing";
import { calculateUsagePercentage, isNearLimit, formatNumber } from "../utils/billing";

export const UsageCard = ({
  metric,
  showProgress = true,
  showLimit = true,
}: UsageCardProps) => {
  const percentage = calculateUsagePercentage(metric);
  const nearLimit = isNearLimit(metric);
  const isOverLimit = metric.current > metric.limit;

  return (
    <div className="p-6 rounded-xl border border-border bg-background">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{metric.name}</p>
          <p className="text-3xl font-bold text-foreground">
            {formatNumber(metric.current)}
            <span className="text-base font-normal text-muted-foreground ml-1">
              {metric.unit}
            </span>
          </p>
        </div>

        {/* Warning Icon */}
        {(nearLimit || isOverLimit) && (
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isOverLimit
                ? "bg-destructive/10 text-destructive"
                : "bg-orange-500/10 text-orange-600 dark:text-orange-500"
            )}
          >
            {isOverLimit ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <TrendingUp className="h-5 w-5" />
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            {showLimit && (
              <span className="text-muted-foreground">
                {formatNumber(metric.limit)} {metric.unit} limit
              </span>
            )}
            <span
              className={cn(
                "font-medium",
                isOverLimit
                  ? "text-destructive"
                  : nearLimit
                  ? "text-orange-600 dark:text-orange-500"
                  : "text-foreground"
              )}
            >
              {percentage.toFixed(0)}%
            </span>
          </div>

          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                isOverLimit
                  ? "bg-destructive"
                  : nearLimit
                  ? "bg-orange-500"
                  : "bg-primary"
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {/* Reset Info */}
          {metric.resetAt && (
            <p className="text-xs text-muted-foreground mt-2">
              Resets {new Date(metric.resetAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UsageCard;
