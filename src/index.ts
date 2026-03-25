/**
 * @umituz/web-dashboard
 *
 * Dashboard Layout System - Customizable, themeable dashboard layouts
 * with comprehensive analytics services and config-based architecture.
 *
 * @version 3.0.0
 */

// Export all domains
export * from './domains/layouts';
export * from './domains/settings';
export * from './domains/billing';

// Domains - using selective exports to avoid conflicts
export * from './domains/layouts';
export * from './domains/settings';
export * from './domains/billing';
export * from './domains/calendar';
export {
  OnboardingWizard,
  useOnboarding,
  useOnboardingStep,
} from './domains/onboarding';

export type {
  OnboardingStep,
  OnboardingState,
  OnboardingConfig,
} from './domains/onboarding';

export {
  AuthLayout,
  LoginForm,
  RegisterForm,
  useAuth,
  type LoginCredentials,
  type RegisterData,
  type User,
} from './domains/auth';

// Analytics with conflict resolution
export {
  useAnalytics,
  MetricCard,
  AnalyticsChart,
  AnalyticsCard,
  AnalyticsLayout,
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
  // Types
  type Metric,
  type TimeSeriesData,
  type ChartData,
  type FunnelStep,
  type FunnelData,
  type CohortAnalysis,
  type UserSegment,
  type KPIData,
  type KPIs,
  type ChartType,
  type ChartConfig,
  type MetricCardProps,
  type AnalyticsCardProps,
  type AnalyticsLayoutProps,
  type DateRangePreset,
  type DateRangeValue,
  type AnalyticsExportOptions,
} from './domains/analytics';

// Calendar
export {
  useCalendar,
  calendarService,
  // Services
  CalendarService,
  // Utils
  getWeekDates,
  getMonthDays,
  isDateInRange,
  formatDate,
  isSameDay,
  getViewRange,
  generateTimeSlots,
  // Types
  type ContentItem,
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

// Config with renamed exports to avoid conflicts
export {
  DEFAULT_DASHBOARD_CONFIG,
  DEFAULT_CALENDAR_CONFIG,
  type AnalyticsServiceType,
  type ExportFormat as DashboardExportFormat,
  type AnalyticsConfig as DashboardAnalyticsConfig,
  type DataConfig,
  type ChartsConfig,
  type PerformanceConfig as DashboardPerformanceConfig,
  type DashboardConfig as DashboardConfigType,
} from './domain/config';
