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
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
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
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {(title || config?.brandName) && (
            <h1 className="text-3xl font-bold text-foreground">
              {title ?? `${config?.brandName ?? ''} ${t(ANALYTICS_KEYS.layout.title)}`}
            </h1>
          )}
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showDateRange && onPeriodChange && period && (
            <label className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">{t(ANALYTICS_KEYS.common.export)}</span>
              <select
                className="bg-transparent text-sm text-foreground outline-none"
                value={period}
                onChange={(e) => onPeriodChange(e.target.value as AnalyticsPeriod)}
                aria-label={t(ANALYTICS_KEYS.common.export)}
              >
                {(config?.availablePeriods ?? Object.keys(PERIOD_LABEL) as AnalyticsPeriod[]).map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p] ?? p}
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
              aria-label="Refresh"
            >
              <RefreshCw
                className={cn("h-4 w-4", loading && "animate-spin")}
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
              <Download className="h-4 w-4" aria-hidden="true" />
              <span className="ml-1.5">{t(ANALYTICS_KEYS.common.export)}</span>
            </Button>
          )}

          {headerContent}
        </div>
      </div>

      {loading && (
        <div
          className="flex items-center justify-center py-24"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">{t(ANALYTICS_KEYS.common.loading)}</span>
        </div>
      )}

      {!loading && visibleMetrics.length > 0 && (
        <div
          className={cn(
            "grid gap-4",
            visibleMetrics.length >= 4
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2",
          )}
        >
          {visibleMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      )}

      {!loading && charts && charts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
