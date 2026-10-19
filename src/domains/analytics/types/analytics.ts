import type { ComponentType } from "react";

export interface Metric {
    id: string;
    name: string;
    value: number;
    previousValue?: number;
    unit?: string;
    trend?: "up" | "down" | "stable";
    icon?: ComponentType<{ className?: string }>;
}

export interface TimeSeriesData {
    date: string;
    [key: string]: string | number;
}

export interface ChartData {
    label: string;
    value: number;
    [key: string]: string | number | boolean;
}

export interface FunnelStep {
    name: string;
    count: number;
    conversionRate: number;
    dropOffRate: number;
    averageTime?: number;
}

export interface FunnelData {
    title: string;
    steps: FunnelStep[];
    totalUsers: number;
    finalConversion: number;
}

export interface CohortAnalysis {
    cohort: string;
    size: number;
    retention: number[];
    averageRetention: number;
}

export interface UserSegment {
    name: string;
    count: number;
    percentage: number;
    characteristics: string[];
    behavior: {
    avgSessionDuration: number;
    pagesPerSession: number;
    bounceRate: number;
  };
}

export interface KPIData {
    current: number;
    previous: number;
    growth: number;
}

export interface KPIs {
  downloads: KPIData;
  engagement: KPIData;
  users: KPIData;
  revenue: KPIData;
  retention: KPIData;
}

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

export interface ChartConfig {
    id: string;
    type: ChartType;
    title?: string;
    description?: string;
    data: TimeSeriesData[] | ChartData[] | Metric[];
    xAxisKey?: string;
    yAxisKeys?: string[];
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
    showTooltip?: boolean;
    height?: number | string;
    aspectRatio?: string;
}

export type AnalyticsPeriod = '7d' | '30d' | '90d' | '1y' | (string & {});

export interface MetricCardProps {
    metric: Metric;
    size?: "sm" | "md" | "lg";
    showTrend?: boolean;
    showIcon?: boolean;
    className?: string;
    onClick?: () => void;
}

export interface AnalyticsCardProps {
    title?: string;
    description?: string;
    chart?: ChartConfig;
    metrics?: Metric[];
    size?: "sm" | "md" | "lg" | "full";
    loading?: boolean;
    error?: string;
    className?: string;
    children?: React.ReactNode;
}

export interface AnalyticsLayoutProps {
    config?: AnalyticsConfig;
    title?: string;
    description?: string;
    metrics?: Metric[];
    loading?: boolean;
    period?: AnalyticsPeriod;
    onPeriodChange?: (period: AnalyticsPeriod) => void;
    showDateRange?: boolean;
    showRefresh?: boolean;
    showExport?: boolean;
    charts?: ChartConfig[];
    onRefresh?: () => void;
    onExport?: () => void;
    headerContent?: React.ReactNode;
    children?: React.ReactNode;
}

export interface DateRangePreset {
    label: string;
    value: string;
    days: number;
    from?: string;
    to?: string;
}

export interface DateRangeValue {
    from: string;
    to: string;
    preset?: string;
}

export type ExportFormat = "csv" | "json" | "xlsx" | "pdf";

export interface AnalyticsExportOptions {
    format: ExportFormat;
    includeCharts?: boolean;
    includeMetrics?: boolean;
    dateRange?: DateRangeValue;
    filename?: string;
}

export interface AnalyticsConfig {
    brandName: string;
    defaultPeriod?: string;
    availablePeriods?: string[];
    showExport?: boolean;
    showRefresh?: boolean;
    enableRealTime?: boolean;
    metrics?: MetricConfig[];
}

export interface MetricConfig {
    id: string;
    name: string;
    unit?: string;
    icon?: string;
}

