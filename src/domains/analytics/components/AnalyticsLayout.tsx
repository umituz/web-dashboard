import { Download, RefreshCw } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils/cn";
import { Button, Skeleton } from "@umituz/web-design-system/atoms";
import {
  DateRangePicker,
  DEFAULT_RANGE_PRESETS,
  EmptyState,
  KpiCard,
} from "@umituz/web-design-system/organisms";
import type { KpiCardProps, RangePreset } from "@umituz/web-design-system/organisms";
import { toKpiDelta } from "../utils/analytics";
import type { AnalyticsLayoutLabels, AnalyticsLayoutProps, KpiDatum } from "../types/analytics";

const DEFAULT_PRESETS: readonly RangePreset[] = ["7d", "30d", "90d", "month"];

const DEFAULT_LABELS: Required<AnalyticsLayoutLabels> = {
  refresh: "Refresh",
  export: "Export",
  retry: "Retry",
  range: "Date range",
};

function toKpiCardProps(kpi: KpiDatum): KpiCardProps {
  return {
    label: kpi.label,
    value:
      typeof kpi.value === "number"
        ? kpi.format
          ? kpi.format(kpi.value)
          : String(kpi.value)
        : kpi.value,
    delta: toKpiDelta(kpi.value, kpi.previousValue, kpi.goodWhen),
    hint: kpi.hint,
    icon: kpi.icon,
    iconTone: kpi.iconTone,
    spark: kpi.spark,
    onClick: kpi.onClick,
  };
}

export function AnalyticsLayout({
  title,
  description,
  range,
  onRangeChange,
  presets = DEFAULT_PRESETS,
  onRefresh,
  refreshing = false,
  onExport,
  kpis,
  charts,
  filters,
  loading = false,
  error,
  onRetry,
  children,
  className,
  labels: labelOverrides,
}: AnalyticsLayoutProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const presetOptions = DEFAULT_RANGE_PRESETS.filter((option) => presets.includes(option.id));
  const busy = loading || refreshing;

  return (
    <div className={cn("udb-analytics", className)}>
      <div className="udb-analytics__header">
        <div className="udb-analytics__heading">
          <h1 className="udb-analytics__title">{title}</h1>
          {description && <p className="udb-analytics__description">{description}</p>}
        </div>

        <div className="udb-analytics__actions">
          {range !== undefined && onRangeChange !== undefined && (
            <DateRangePicker
              value={range}
              onChange={onRangeChange}
              presets={presetOptions}
              aria-label={labels.range}
            />
          )}

          {onRefresh !== undefined && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={busy}
              aria-label={labels.refresh}
            >
              <RefreshCw
                className={cn("udb-analytics__action-icon", busy && "udb-spin")}
                aria-hidden="true"
              />
            </Button>
          )}

          {onExport !== undefined && (
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
        </div>
      </div>

      {filters}

      {error != null ? (
        <EmptyState
          className="udb-analytics__error"
          title={error}
          action={onRetry !== undefined ? { label: labels.retry, onClick: onRetry } : undefined}
        />
      ) : loading ? (
        <>
          <div className="udb-analytics__metrics" role="status" aria-live="polite">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="udb-analytics__kpi-skeleton" />
            ))}
          </div>
          <Skeleton className="udb-analytics__chart-skeleton" />
        </>
      ) : (
        <>
          {kpis !== undefined && kpis.length > 0 && (
            <div
              className={cn(
                "udb-analytics__metrics",
                kpis.length >= 4 && "udb-analytics__metrics--wide",
              )}
            >
              {kpis.map((kpi) => (
                <KpiCard key={kpi.id} {...toKpiCardProps(kpi)} />
              ))}
            </div>
          )}

          {charts !== undefined && charts !== null && <div className="udb-analytics__charts">{charts}</div>}

          {children}
        </>
      )}
    </div>
  );
}
