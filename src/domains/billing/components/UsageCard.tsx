/**
 * Usage Card
 *
 * Shows consumption of a metered resource with an accessible progress bar.
 * Surfaces the real percentage (including over-limit) instead of clamping
 * to 100%, so users see when they have actually exceeded their allowance.
 */

import { AlertTriangle, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@umituz/web-design-system/utils";
import type { UsageCardProps } from "../types/billing";
import {
  calculateUsagePercentage,
  isNearLimit,
  formatNumber,
} from "../utils/billing";
import { BILLING_KEYS } from "../utils/i18nKeys";

const LOCALE = 'en-US';

export const UsageCard = ({
  metric,
  showProgress = true,
  showLimit = true,
}: UsageCardProps) => {
  const { t } = useTranslation();
  const { percentage, isOverLimit, nearLimit, isUnlimited } = evaluateUsage(metric);

  return (
    <div className="p-6 rounded-xl border border-border bg-background">
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

        {(nearLimit || isOverLimit) && (
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isOverLimit
                ? "bg-destructive/10 text-destructive"
                : "bg-warning/10 text-warning",
            )}
            aria-hidden="true"
          >
            {isOverLimit ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <TrendingUp className="h-5 w-5" />
            )}
          </div>
        )}
      </div>

      {showProgress && !isUnlimited && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            {showLimit && (
              <span className="text-muted-foreground">
                {formatNumber(metric.limit)} {metric.unit} {t(BILLING_KEYS.usage.limit)}
              </span>
            )}
            <span
              className={cn(
                "font-medium",
                isOverLimit
                  ? "text-destructive"
                  : nearLimit
                  ? "text-warning"
                  : "text-foreground",
              )}
            >
              {percentage.toFixed(0)}%
            </span>
          </div>

          <div
            className="w-full h-2 bg-muted rounded-full overflow-hidden"
            role="progressbar"
            aria-label={`${metric.name} usage`}
            aria-valuemin={0}
            aria-valuemax={Math.max(metric.limit, metric.current)}
            aria-valuenow={metric.current}
            aria-valuetext={`${metric.current} of ${metric.limit} ${metric.unit}`}
          >
            <div
              className={cn(
                "h-full transition-all duration-500",
                isOverLimit
                  ? "bg-destructive"
                  : nearLimit
                  ? "bg-warning"
                  : "bg-primary",
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {metric.resetAt && (
            <p className="text-xs text-muted-foreground mt-2">
              {t(BILLING_KEYS.usage.resets)}{' '}
              {new Date(metric.resetAt).toLocaleDateString(LOCALE)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

interface UsageEvaluation {
  percentage: number;
  isOverLimit: boolean;
  nearLimit: boolean;
  isUnlimited: boolean;
}

/**
 * Centralized usage evaluation. Returning all flags in one place
 * keeps the JSX above declarative and free of conditionals.
 */
const evaluateUsage = (metric: UsageCardProps['metric']): UsageEvaluation => {
  if (metric.limit <= 0) {
    return { percentage: 0, isOverLimit: false, nearLimit: false, isUnlimited: true };
  }
  return {
    percentage: calculateUsagePercentage(metric),
    isOverLimit: metric.current > metric.limit,
    nearLimit: isNearLimit(metric),
    isUnlimited: false,
  };
};

export default UsageCard;
