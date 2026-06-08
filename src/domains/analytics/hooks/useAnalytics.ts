/**
 * useAnalytics
 *
 * Pure state + side-effect container. Mock data, commented-out
 * fetch calls, and Math.random()-driven time series are gone.
 * All persistence is delegated to the injected `apiClient`.
 */

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type {
  KPIs,
  TimeSeriesData,
  DateRangeValue,
  AnalyticsExportOptions,
} from "../types/analytics";

/**
 * API client contract. Replace `loadAnalytics` with a real fetch wrapper
 * and `exportAnalytics` with a server-side exporter.
 */
export interface AnalyticsApiClient {
  loadAnalytics: (range: DateRangeValue) => Promise<AnalyticsDataPayload>;
  exportAnalytics: (payload: AnalyticsDataPayload, options: AnalyticsExportOptions) => Promise<Blob>;
}

export interface AnalyticsDataPayload {
  kpis: KPIs;
  timeSeries: TimeSeriesData[];
}

interface UseAnalyticsOptions {
  initialDateRange?: DateRangeValue;
  /** Auto-refresh interval in ms (0 to disable) */
  refreshInterval?: number;
  apiClient: AnalyticsApiClient;
}

export interface UseAnalyticsReturn {
  kpis: KPIs;
  timeSeries: TimeSeriesData[];
  isLoading: boolean;
  error: string | null;
  dateRange: DateRangeValue;
  updateDateRange: (range: DateRangeValue) => void;
  refresh: () => Promise<void>;
  exportData: (options: AnalyticsExportOptions) => Promise<void>;
}

const DEFAULT_RANGE_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const buildDefaultRange = (): DateRangeValue => {
  const today = new Date();
  const start = new Date(Date.now() - DEFAULT_RANGE_DAYS * MS_PER_DAY);
  return {
    from: start.toISOString().split("T")[0] as string,
    to: today.toISOString().split("T")[0] as string,
  };
};

const EMPTY_KPIS: KPIs = {
  downloads: { current: 0, previous: 0, growth: 0 },
  engagement: { current: 0, previous: 0, growth: 0 },
  users: { current: 0, previous: 0, growth: 0 },
  revenue: { current: 0, previous: 0, growth: 0 },
  retention: { current: 0, previous: 0, growth: 0 },
};

const toErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error && err.message ? err.message : fallback;

export function useAnalytics(options: UseAnalyticsOptions): UseAnalyticsReturn {
  const { initialDateRange, refreshInterval = 0, apiClient } = options;

  const [dateRange, setDateRange] = useState<DateRangeValue>(
    initialDateRange ?? buildDefaultRange(),
  );
  const [kpis, setKpis] = useState<KPIs>(EMPTY_KPIS);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Refs track the latest request so an in-flight call can't be
   * overridden by a slower one (e.g. user changes the range while
   * the previous fetch is still resolving).
   */
  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const payload = await apiClient.loadAnalytics(dateRange);
      if (requestIdRef.current === requestId) {
        setKpis(payload.kpis);
        setTimeSeries(payload.timeSeries);
      }
    } catch (err) {
      if (requestIdRef.current === requestId) {
        setError(toErrorMessage(err, 'Failed to fetch analytics'));
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, [apiClient, dateRange]);

  const updateDateRange = useCallback((range: DateRangeValue) => {
    setDateRange(range);
  }, []);

  const exportData = useCallback(
    async (exportOptions: AnalyticsExportOptions) => {
      const payload: AnalyticsDataPayload = { kpis, timeSeries };
      const blob = await apiClient.exportAnalytics(payload, exportOptions);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        exportOptions.filename ?? `analytics-${dateRange.from}-${dateRange.to}.${exportOptions.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [apiClient, dateRange.from, dateRange.to, kpis, timeSeries],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const id = setInterval(refresh, refreshInterval);
      return () => clearInterval(id);
    }
    return undefined;
  }, [refresh, refreshInterval]);

  return useMemo(
    () => ({
      kpis,
      timeSeries,
      isLoading,
      error,
      dateRange,
      updateDateRange,
      refresh,
      exportData,
    }),
    [kpis, timeSeries, isLoading, error, dateRange, updateDateRange, refresh, exportData],
  );
}

/**
 * Convenience factory: returns a stub client that throws. Useful
 * in Storybook / tests; the consumer must wire a real client
 * before the hook is useful in production.
 */
export const createStubAnalyticsApiClient = (
  overrides?: Partial<AnalyticsApiClient>,
): AnalyticsApiClient => {
  const notConfigured: AnalyticsApiClient = {
    loadAnalytics: () => Promise.reject(new Error('AnalyticsApiClient not configured')),
    exportAnalytics: () => Promise.reject(new Error('AnalyticsApiClient not configured')),
  };
  return { ...notConfigured, ...overrides };
};
