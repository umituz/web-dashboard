export * from './domains/layouts';
export * from './domains/settings';
export * from './domains/calendar';
export * from './domains/permissions';
export * from './domains/organization';
export * from './domains/tour';
export {
  useAnalytics,
  AnalyticsLayout,
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
  type KpiDatum,
  type TimeSeriesDatum,
  type TimeSeriesData,
  type DateRangePreset,
  type DateRangeValue,
  type AnalyticsExportOptions,
} from './domains/analytics';

export {
  useCalendar,
  calendarService,
  CalendarService,
  getWeekDates,
  getMonthDays,
  isDateInRange,
  formatDate,
  isSameDay,
  getViewRange,
  generateTimeSlots,
  type ContentItem,
  DEFAULT_CALENDAR_CONFIG,
  type CalendarEvent,
  type CalendarFilter,
  type CalendarConfig,
  type ContentStatus,
  type ContentType,
  type CalendarView,
  type CreateContentItemParams,
  type UpdateContentItemParams,
  type ICalendarService,
} from './domains/calendar';

export {
  DEFAULT_DASHBOARD_CONFIG,
  type AnalyticsServiceType,
  type ExportFormat as DashboardExportFormat,
  type AnalyticsConfig as DashboardAnalyticsConfig,
  type DataConfig,
  type ChartsConfig,
  type PerformanceConfig as DashboardPerformanceConfig,
  type DashboardConfig as DashboardConfigType,
} from './config';
