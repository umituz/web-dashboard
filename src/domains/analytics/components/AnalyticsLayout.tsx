/**
 * Analytics Layout Component
 *
 * Configurable analytics page layout with KPIs and charts
 */

import { RefreshCw, Download, Calendar, Loader2 } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { AnalyticsLayoutProps } from "../types/analytics";
import { AnalyticsCard } from "./AnalyticsCard";
import { MetricCard } from "./MetricCard";
import { getDateRangePresets } from "../utils/analytics";

export const AnalyticsLayout = ({
  config,
  title,
  description,
  metrics,
  loading = false,
  period,
  onPeriodChange,
  showDateRange = true,
  showRefresh,
  showExport,
  kpis,
  charts,
  headerContent,
  children,
}: AnalyticsLayoutProps) => {
  const dateRangePresets = getDateRangePresets();

  const handleExport = async () => {
    // In production, implement export functionality
    console.log("Exporting analytics data...");
  };

  const handleRefresh = async () => {
    // In production, refresh data
    console.log("Refreshing analytics data...");
  };

  // Use config settings if props not provided
  const _showRefresh = showRefresh ?? config?.showRefresh ?? true;
  const _showExport = showExport ?? config?.showExport ?? true;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {(title || config?.brandName) && (
            <h1 className="text-3xl font-bold text-foreground">
              {title || `${config?.brandName || ''} Analytics`}
            </h1>
          )}
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {showDateRange && onPeriodChange && (
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select
                className="bg-transparent text-sm text-foreground outline-none"
                value={period}
                onChange={(e) => onPeriodChange(e.target.value)}
              >
                {config?.availablePeriods?.map((p) => (
                  <option key={p} value={p}>
                    {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : p === "90d" ? "90 Days" : p}
                  </option>
                ))}
              </select>
            </div>
          )}

          {_showRefresh && (
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          )}

          {_showExport && (
            <Button variant="ghost" size="sm" onClick={handleExport} disabled={loading}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}

          {headerContent}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Metrics / KPI Cards */}
      {!loading && (metrics || kpis) && (
        <div className={cn(
          "grid gap-4",
          (metrics || kpis) && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        )}>
          {metrics?.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}

          {/* Legacy kpis support */}
          {kpis && !metrics && (
            <>
              <MetricCard
                metric={{
                  id: "downloads",
                  name: "Downloads",
                  value: kpis.downloads.current,
                  previousValue: kpis.downloads.previous,
                  unit: "K",
                }}
              />
              <MetricCard
                metric={{
                  id: "engagement",
                  name: "Engagement",
                  value: kpis.engagement.current,
                  previousValue: kpis.engagement.previous,
                  unit: "%",
                }}
              />
              <MetricCard
                metric={{
                  id: "users",
                  name: "Users",
                  value: kpis.users.current,
                  previousValue: kpis.users.previous,
                  unit: "K",
                }}
              />
              <MetricCard
                metric={{
                  id: "revenue",
                  name: "Revenue",
                  value: kpis.revenue.current,
                  previousValue: kpis.revenue.previous,
                  unit: "$",
                }}
              />
              <MetricCard
                metric={{
                  id: "retention",
                  name: "Retention",
                  value: kpis.retention.current,
                  previousValue: kpis.retention.previous,
                  unit: "%",
                }}
              />
            </>
          )}
        </div>
      )}

      {/* Charts */}
      {!loading && charts && charts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts.map((chartConfig, index) => (
            <AnalyticsCard
              key={index}
              title={chartConfig.title}
              description={chartConfig.description}
              chart={chartConfig}
            />
          ))}
        </div>
      )}

      {/* Custom Content */}
      {!loading && children}
    </div>
  );
};

export default AnalyticsLayout;
