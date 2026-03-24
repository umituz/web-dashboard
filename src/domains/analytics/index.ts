/**
 * Analytics Domain
 *
 * Main entry point for analytics domain
 */

// Components
export {
  MetricCard,
  AnalyticsChart,
  AnalyticsCard,
  AnalyticsLayout,
} from "./components";

// Hooks
export {
  useAnalytics,
} from "./hooks";

// Utils
export {
  formatNumber,
  formatPercentage,
  formatCurrency,
  calculateGrowth,
  getTrend,
  createKPI,
  createMetric,
  formatMetricValue,
  calculateConversionRate,
  calculateDropOffRate,
  createDateRangePreset,
  getDateRangePresets,
  aggregateByPeriod,
  calculateMovingAverage,
  detectOutliers,
  roundTo,
  generateColor,
  generateChartColors,
} from "./utils";

// Types
export type {
  Metric,
  TimeSeriesData,
  ChartData,
  FunnelStep,
  FunnelData,
  CohortAnalysis,
  UserSegment,
  KPIData,
  KPIs,
  ChartType,
  ChartConfig,
  MetricCardProps,
  AnalyticsCardProps,
  AnalyticsLayoutProps,
  DateRangePreset,
  DateRangeValue,
  ExportFormat,
  AnalyticsExportOptions,
} from "./types";
