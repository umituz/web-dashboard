import { useMemo } from "react";
import { RefreshCw, Download, Calendar, Loader2 } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils/cn";
import { Button } from "@umituz/web-design-system/atoms";
import type { AnalyticsLayoutProps, AnalyticsPeriod } from "../types/analytics";
import { AnalyticsCard } from "./AnalyticsCard";
import { MetricCard } from "./MetricCard";

const DEFAULT_PERIODS: AnalyticsPeriod[] = ["7d", "30d", "90d", "1y"];

export const AnalyticsLayout = ({
  config,
  labels,
  title,
  description,
  metrics,
  loading = false,
  period,
  onPeriodChange,
  showDateRange = true,
  showRefresh = true,
  showExport = true,
  charts,
  headerContent,
  onRefresh,
  onExport,
  children,
}: AnalyticsLayoutProps) => {
  const visibleMetrics = useMemo(() => metrics ?? [], [metrics]);

  const showRefreshAction = showRefresh && Boolean(onRefresh);
  const showExportAction = showExport && Boolean(onExport);

  return (
    <div className="udb-analytics">
      <div className="udb-analytics__header">
        <div className="udb-analytics__heading">
          <h1 className="udb-analytics__title">{title ?? labels.title}</h1>

          {description && (
            <p className="udb-analytics__description">{description}</p>

          )}
        </div>

        <div className="udb-analytics__actions">
          {showDateRange && onPeriodChange && period && (
            <label className="udb-period-select">
              <Calendar className="udb-period-select__icon" aria-hidden="true" />
              <span className="udb-sr-only">{labels.periodSelector}</span>

              <select
                className="udb-period-select__select"
                value={period}
                onChange={(e) => onPeriodChange(e.target.value as AnalyticsPeriod)}
                aria-label={labels.periodSelector}
              >
                {(config?.availablePeriods ?? DEFAULT_PERIODS).map((p) => (
                  <option key={p} value={p}>
                    {labels.periods[p] ?? p}
                  </option>

                ))}
              </select>

            </label>

          )}

          {showRefreshAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              aria-label={labels.refresh}
            >
              <RefreshCw
                className={cn("udb-analytics__action-icon", loading && "udb-spin")}
                aria-hidden="true"
              />
            </Button>

          )}

          {showExportAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              disabled={loading}
              aria-label={labels.export}
            >
              <Download className="udb-analytics__action-icon" aria-hidden="true" />
              <span>{labels.export}</span>

            </Button>

          )}

          {headerContent}
        </div>

      </div>

      {loading && (
        <div
          className="udb-analytics__loading"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="udb-spin udb-analytics__loading-spinner" aria-hidden="true" />
          <span className="udb-sr-only">{labels.loading}</span>

        </div>

      )}

      {!loading && visibleMetrics.length > 0 && (
        <div
          className={cn(
            "udb-analytics__metrics",
            visibleMetrics.length >= 4 && "udb-analytics__metrics--wide",
          )}
        >
          {visibleMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

      )}

      {!loading && charts && charts.length > 0 && (
        <div className="udb-analytics__charts">
          {charts.map((chartConfig) => (
            <AnalyticsCard
              key={chartConfig.id}
              title={chartConfig.title}
              description={chartConfig.description}
              chart={chartConfig}
            />
          ))}
        </div>

      )}

      {!loading && children}
    </div>

  );
};

export default AnalyticsLayout;
