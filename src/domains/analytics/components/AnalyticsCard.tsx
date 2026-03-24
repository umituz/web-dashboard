/**
 * Analytics Card Component
 *
 * Configurable analytics card with chart or metrics
 */

import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import type { AnalyticsCardProps } from "../types/analytics";
import { MetricCard } from "./MetricCard";
import { AnalyticsChart } from "./AnalyticsChart";

export const AnalyticsCard = ({
  title,
  description,
  chart,
  metrics,
  size = "md",
  loading = false,
  error,
  className,
  children,
}: AnalyticsCardProps) => {
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    full: "p-6",
  };

  if (loading) {
    return (
      <div className={cn("bg-background border border-border rounded-xl", sizeClasses[size], className)}>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("bg-background border border-border rounded-xl", sizeClasses[size], className)}>
        <div className="flex items-center justify-center h-48 gap-3 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-background border border-border rounded-xl", sizeClasses[size], className)}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      )}

      {/* Chart */}
      {chart && <AnalyticsChart config={chart} />}

      {/* Metrics */}
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} size="sm" />
          ))}
        </div>
      )}

      {/* Custom Content */}
      {children}
    </div>
  );
};

export default AnalyticsCard;
