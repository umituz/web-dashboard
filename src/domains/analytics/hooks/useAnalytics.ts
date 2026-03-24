/**
 * useAnalytics Hook
 *
 * Core analytics hook for fetching and managing analytics data
 */

import { useState, useCallback, useEffect } from "react";
import type {
  KPIs,
  TimeSeriesData,
  ChartConfig,
  DateRangeValue,
  AnalyticsExportOptions,
} from "../types/analytics";
import { createKPI } from "../utils/analytics";

interface UseAnalyticsOptions {
  /** Analytics API base URL */
  apiUrl?: string;
  /** Initial date range */
  initialDateRange?: DateRangeValue;
  /** Auto-refresh interval in ms (0 to disable) */
  refreshInterval?: number;
}

interface AnalyticsData {
  /** KPI metrics */
  kpis: KPIs;
  /** Time series data */
  timeSeries: TimeSeriesData[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
}

/**
 * useAnalytics hook
 *
 * Manages analytics data fetching and state
 *
 * @param options - Hook options
 * @returns Analytics data and actions
 */
export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { apiUrl = "/api/analytics", initialDateRange, refreshInterval = 0 } = options;

  // State
  const [dateRange, setDateRange] = useState<DateRangeValue>(
    initialDateRange || {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
      preset: "Last 30 Days",
    }
  );
  const [data, setData] = useState<AnalyticsData>({
    kpis: {
      downloads: { current: 0, previous: 0, growth: 0 },
      engagement: { current: 0, previous: 0, growth: 0 },
      users: { current: 0, previous: 0, growth: 0 },
      revenue: { current: 0, previous: 0, growth: 0 },
      retention: { current: 0, previous: 0, growth: 0 },
    },
    timeSeries: [],
    isLoading: false,
    error: null,
  });

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // In production, call your analytics API
      // const response = await fetch(`${apiUrl}?from=${dateRange.from}&to=${dateRange.to}`);
      // const result = await response.json();

      // Mock data for demo
      const mockKPIs: KPIs = {
        downloads: { current: 1250, previous: 1100, growth: 13.6 },
        engagement: { current: 68.5, previous: 65.2, growth: 5.1 },
        users: { current: 4500, previous: 4200, growth: 7.1 },
        revenue: { current: 8950, previous: 7800, growth: 14.7 },
        retention: { current: 72.3, previous: 69.8, growth: 3.6 },
      };

      const mockTimeSeries: TimeSeriesData[] = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toISOString().split("T")[0],
          downloads: Math.floor(1000 + Math.random() * 500),
          engagement: 60 + Math.random() * 20,
          revenue: Math.floor(7000 + Math.random() * 3000),
          users: Math.floor(4000 + Math.random() * 1000),
          retention: 65 + Math.random() * 15,
        };
      });

      setData({
        kpis: mockKPIs,
        timeSeries: mockTimeSeries,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch analytics";
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [apiUrl, dateRange]);

  // Update date range
  const updateDateRange = useCallback((newDateRange: DateRangeValue) => {
    setDateRange(newDateRange);
  }, []);

  // Export analytics data
  const exportData = useCallback(async (options: AnalyticsExportOptions) => {
    try {
      // In production, implement export API call
      const exportData = {
        dateRange,
        kpis: data.kpis,
        timeSeries: data.timeSeries,
        format: options.format,
      };

      console.log("Exporting analytics:", exportData);

      // Mock export
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: options.format === "json" ? "application/json" : "text/plain",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = options.filename || `analytics-${dateRange.from}-${dateRange.to}.${options.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      throw err;
    }
  }, [dateRange, data]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Fetch on mount and date range change
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchAnalytics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchAnalytics, refreshInterval]);

  return {
    ...data,
    dateRange,
    updateDateRange,
    refresh,
    exportData,
  };
}
