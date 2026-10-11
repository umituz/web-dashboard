/**
 * Analytics Card Component
 *
 * Configurable analytics card with chart or metrics. Surface comes
 * from the shared `udb-card` helper; size modifiers shrink/grow the
 * padding ("full" shares the md default).
 */

import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "../../../primitives";
import type { AnalyticsCardProps } from "../types/analytics";
import { MetricCard } from "./MetricCard";
import { AnalyticsChart } from "./AnalyticsChart";

const SURFACE_CLASS = {
  sm: 'udb-card--sm',
  md: undefined,
  lg: 'udb-card--lg',
  full: undefined,
} as const;

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
  if (loading) {
    return (
      <div className={cn("udb-card", SURFACE_CLASS[size], className)}>
        <div className="udb-analytics-card__status" role="status">
          <Loader2 className="udb-spin udb-analytics-card__spinner" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("udb-card", SURFACE_CLASS[size], className)}>
        <div className="udb-analytics-card__status udb-analytics-card__status--error" role="alert">
          <AlertCircle className="udb-analytics-card__error-icon" aria-hidden="true" />
          <p className="udb-analytics-card__error-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("udb-card", SURFACE_CLASS[size], className)}>
      {/* Header */}
      {(title || description) && (
        <div className="udb-analytics-card__header">
          {title && <h3 className="udb-analytics-card__title">{title}</h3>}
          {description && <p className="udb-analytics-card__description">{description}</p>}
        </div>
      )}

      {/* Chart */}
      {chart && <AnalyticsChart config={chart} />}

      {/* Metrics */}
      {metrics && metrics.length > 0 && (
        <div className="udb-analytics-card__metrics">
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
