/**
 * Analytics Types
 *
 * Type definitions for analytics system
 */

import type { ComponentType, ReactElement } from "react";

/**
 * Metric card data
 */
export interface Metric {
  /** Unique identifier */
  id: string;
  /** Metric name */
  name: string;
  /** Current value */
  value: number;
  /** Previous period value */
  previousValue?: number;
  /** Unit (%, $, etc.) */
  unit?: string;
  /** Trend direction */
  trend?: "up" | "down" | "stable";
  /** Icon component */
  icon?: ComponentType<{ className?: string }>;
}

/**
 * Time series data point
 */
export interface TimeSeriesData {
  /** Date/label */
  date: string;
  /** Metric values */
  [key: string]: string | number;
}

/**
 * Chart data point
 */
export interface ChartData {
  /** X-axis label */
  label: string;
  /** Y-axis value */
  value: number;
  /** Additional data */
  [key: string]: string | number | boolean;
}

/**
 * Funnel step
 */
export interface FunnelStep {
  /** Step name */
  name: string;
  /** User count at this step */
  count: number;
  /** Conversion rate to this step */
  conversionRate: number;
  /** Drop-off rate from previous step */
  dropOffRate: number;
  /** Average time spent at step */
  averageTime?: number;
}

/**
 * Funnel data
 */
export interface FunnelData {
  /** Funnel title */
  title: string;
  /** Funnel steps */
  steps: FunnelStep[];
  /** Total starting users */
  totalUsers: number;
  /** Final conversion rate */
  finalConversion: number;
}

/**
 * Cohort analysis data
 */
export interface CohortAnalysis {
  /** Cohort identifier */
  cohort: string;
  /** Cohort size */
  size: number;
  /** Retention rates over time */
  retention: number[];
  /** Average retention rate */
  averageRetention: number;
}

/**
 * User segment
 */
export interface UserSegment {
  /** Segment name */
  name: string;
  /** User count */
  count: number;
  /** Percentage of total users */
  percentage: number;
  /** Segment characteristics */
  characteristics: string[];
  /** Behavioral metrics */
  behavior: {
    avgSessionDuration: number;
    pagesPerSession: number;
    bounceRate: number;
  };
}

/**
 * KPI data with comparison
 */
export interface KPIData {
  /** Current period value */
  current: number;
  /** Previous period value */
  previous: number;
  /** Growth rate percentage */
  growth: number;
}

/**
 * KPIs container
 */
export interface KPIs {
  downloads: KPIData;
  engagement: KPIData;
  users: KPIData;
  revenue: KPIData;
  retention: KPIData;
}

/**
 * Chart types
 */
export type ChartType =
  | "line"
  | "bar"
  | "area"
  | "pie"
  | "donut"
  | "funnel"
  | "heatmap"
  | "metric"
  | "table";

/**
 * Chart configuration
 */
export interface ChartConfig {
  /** Chart type */
  type: ChartType;
  /** Chart title */
  title?: string;
  /** Chart description */
  description?: string;
  /** Data */
  data: TimeSeriesData[] | ChartData[] | Metric[];
  /** X-axis key */
  xAxisKey?: string;
  /** Y-axis keys */
  yAxisKeys?: string[];
  /** Color scheme */
  colors?: string[];
  /** Show legend */
  showLegend?: boolean;
  /** Show grid */
  showGrid?: boolean;
  /** Show tooltip */
  showTooltip?: boolean;
  /** Chart height */
  height?: number | string;
  /** Chart aspect ratio */
  aspectRatio?: string;
}

/**
 * Metric card props
 */
export interface MetricCardProps {
  /** Metric data */
  metric: Metric;
  /** Card size variant */
  size?: "sm" | "md" | "lg";
  /** Show trend indicator */
  showTrend?: boolean;
  /** Show icon */
  showIcon?: boolean;
  /** Custom class name */
  className?: string;
  /** On click handler */
  onClick?: () => void;
}

/**
 * Analytics card props
 */
export interface AnalyticsCardProps {
  /** Card title */
  title?: string;
  /** Card description */
  description?: string;
  /** Chart configuration */
  chart?: ChartConfig;
  /** Metrics to display */
  metrics?: Metric[];
  /** Card size */
  size?: "sm" | "md" | "lg" | "full";
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string;
  /** Custom class name */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

/**
 * Analytics layout props
 */
export interface AnalyticsLayoutProps {
  /** Analytics configuration */
  config?: AnalyticsConfig;
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Metrics data */
  metrics?: Metric[];
  /** Loading state */
  loading?: boolean;
  /** Current period */
  period?: string;
  /** Period change handler */
  onPeriodChange?: (period: string) => void;
  /** Date range selector */
  showDateRange?: boolean;
  /** Refresh button */
  showRefresh?: boolean;
  /** Export button */
  showExport?: boolean;
  /** KPI cards */
  kpis?: KPIs;
  /** Charts configuration */
  charts?: ChartConfig[];
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Children content */
  children?: React.ReactNode;
}

/**
 * Date range preset
 */
export interface DateRangePreset {
  /** Preset label */
  label: string;
  /** Preset value */
  value: string;
  /** Number of days */
  days: number;
}

/**
 * Date range value
 */
export interface DateRangeValue {
  /** Start date */
  from: string;
  /** End date */
  to: string;
  /** Preset label */
  preset?: string;
}

/**
 * Export format
 */
export type ExportFormat = "csv" | "json" | "xlsx" | "pdf";

/**
 * Analytics export options
 */
export interface AnalyticsExportOptions {
  /** Export format */
  format: ExportFormat;
  /** Include charts */
  includeCharts?: boolean;
  /** Include metrics */
  includeMetrics?: boolean;
  /** Date range */
  dateRange?: DateRangeValue;
  /** Filename */
  filename?: string;
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  /** Brand/application name */
  brandName: string;
  /** Default period selection */
  defaultPeriod?: string;
  /** Available period options */
  availablePeriods?: string[];
  /** Show export button */
  showExport?: boolean;
  /** Show refresh button */
  showRefresh?: boolean;
  /** Enable real-time updates */
  enableRealTime?: boolean;
  /** Metrics configuration */
  metrics?: MetricConfig[];
}

/**
 * Metric configuration
 */
export interface MetricConfig {
  /** Metric identifier */
  id: string;
  /** Metric name */
  name: string;
  /** Unit type */
  unit?: string;
  /** Icon identifier */
  icon?: string;
}

