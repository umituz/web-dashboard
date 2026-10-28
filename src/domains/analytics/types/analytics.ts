import type { ReactNode } from "react";
import type { DateRange, KpiIconTone, RangePreset } from "@umituz/web-design-system/organisms";

export interface KpiDatum {
    id: string;
    label: string;
    value: number | string;
    previousValue?: number;
    format?: (value: number) => string;
    goodWhen?: "up" | "down";
    hint?: string;
    icon?: ReactNode;
    iconTone?: KpiIconTone;
    spark?: readonly number[];
    onClick?: () => void;
}

export interface TimeSeriesDatum {
    date: string;
    [key: string]: string | number;
}

export type TimeSeriesData = TimeSeriesDatum;

export interface AnalyticsLayoutLabels {
    refresh?: string;
    export?: string;
    retry?: string;
    range?: string;
}

export interface AnalyticsLayoutProps {
    title: string;
    description?: string;
    range?: DateRange;
    onRangeChange?: (range: DateRange) => void;
    presets?: readonly RangePreset[];
    onRefresh?: () => void;
    refreshing?: boolean;
    onExport?: () => void;
    kpis?: readonly KpiDatum[];
    charts?: ReactNode;
    filters?: ReactNode;
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    children?: ReactNode;
    className?: string;
    labels?: AnalyticsLayoutLabels;
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
