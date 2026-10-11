/**
 * AnalyticsLayout
 *
 * Top-level analytics page shell. All actions delegate to the
 * consumer via callbacks — no console.log, no no-op handlers.
 * The legacy "kpis" prop has been removed in favor of the typed
 * `metrics` array (breaking change called out in changelog).
 */

import { useMemo } from "react";
import { RefreshCw, Download, Calendar, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../primitives";
import { Button } from "../../../primitives";
import type { AnalyticsLayoutProps, AnalyticsPeriod } from "../types/analytics";
import { AnalyticsCard } from "./AnalyticsCard";
import { MetricCard } from "./MetricCard";
import { ANALYTICS_KEYS } from "../utils/i18nKeys";

/**
 * Map analytics period tokens to localized display labels.
 * Periods not in this map fall back to the raw token — better
 * to show the key than an empty select option.
 */
const PERIOD_LABEL: Record<AnalyticsPeriod, string> = {
  '7d': ANALYTICS_KEYS.common.last7Days,
  '30d': ANALYTICS_KEYS.common.last30Days,
  '90d': ANALYTICS_KEYS.common.last90Days,
  '1y': ANALYTICS_KEYS.common.lastYear,
};

export const AnalyticsLayout = ({
  config,
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
  const { t } = useTranslation();

  const visibleMetrics = useMemo(() => metrics ?? [], [metrics]);

  const showRefreshAction = showRefresh && Boolean(onRefresh);
  const showExportAction = showExport && Boolean(onExport);

  return (
    <div className="udb-analytics">
      <div className="udb-analytics__header">
        <div className="udb-analytics__heading">
          {(title || config?.brandName) && (
            <h1 className="udb-analytics__title">
              {title ??
                (config?.brandName
                  ? `${config.brandName} ${t(ANALYTICS_KEYS.layout.title)}`
                  : t(ANALYTICS_KEYS.layout.title))}
            </h1>
          )}
          {description && (
            <p className="udb-analytics__description">{description}</p>
          )}
        </div>

        <div className="udb-analytics__actions">
          {showDateRange && onPeriodChange && period && (
            <label className="udb-period-select">
              <Calendar className="udb-period-select__icon" aria-hidden="true" />
              <span className="udb-sr-only">{t(ANALYTICS_KEYS.common.periodSelector)}</span>
              <select
                className="udb-period-select__select"
                value={period}
                onChange={(e) => onPeriodChange(e.target.value as AnalyticsPeriod)}
                aria-label={t(ANALYTICS_KEYS.common.periodSelector)}
              >
                {(config?.availablePeriods ?? Object.keys(PERIOD_LABEL) as AnalyticsPeriod[]).map((p) => (
                  <option key={p} value={p}>
                    {t(PERIOD_LABEL[p] ?? p)}
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
              aria-label={t(ANALYTICS_KEYS.common.refresh)}
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
              aria-label={t(ANALYTICS_KEYS.common.export)}
            >
              <Download className="udb-analytics__action-icon" aria-hidden="true" />
              <span>{t(ANALYTICS_KEYS.common.export)}</span>
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
          <span className="udb-sr-only">{t(ANALYTICS_KEYS.common.loading)}</span>
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
