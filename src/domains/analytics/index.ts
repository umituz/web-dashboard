export {
  AnalyticsLayout,
} from "./components";

export {
  useAnalytics,
  createStubAnalyticsApiClient,
} from "./hooks";
export type {
  AnalyticsApiClient,
  AnalyticsPayload,
  UseAnalyticsOptions,
  UseAnalyticsReturn,
} from "./hooks";

export {
  formatNumber,
  formatPercentage,
  formatCurrency,
  calculateGrowth,
  getTrend,
  toKpiDelta,
  toCsv,
  downloadCsv,
  exportCsv,
  calculateConversionRate,
  calculateDropOffRate,
  aggregateByPeriod,
  calculateMovingAverage,
  detectOutliers,
  roundTo,
} from "./utils";
export type { KpiDeltaLike } from "./utils";

export type {
  KpiDatum,
  TimeSeriesDatum,
  TimeSeriesData,
  AnalyticsLayoutLabels,
  AnalyticsLayoutProps,
  DateRangePreset,
  DateRangeValue,
  ExportFormat,
  AnalyticsExportOptions,
} from "./types";
