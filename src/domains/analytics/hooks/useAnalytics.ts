import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { presetRange } from "@umituz/web-design-system/organisms";
import type { DateRange } from "@umituz/web-design-system/organisms";
import type {
  AnalyticsExportOptions,
  KpiDatum,
  TimeSeriesDatum,
} from "../types/analytics";

export interface AnalyticsApiClient {
  loadAnalytics: (range: DateRange) => Promise<AnalyticsPayload>;
  exportAnalytics?: (payload: AnalyticsPayload, options: AnalyticsExportOptions) => Promise<Blob>;
}

export interface AnalyticsPayload {
  kpis: KpiDatum[];
  series: TimeSeriesDatum[];
}

export interface UseAnalyticsOptions {
  initialRange?: DateRange;
  refreshInterval?: number;
  apiClient: AnalyticsApiClient;
}

export interface UseAnalyticsReturn {
  kpis: KpiDatum[];
  series: TimeSeriesDatum[];
  isLoading: boolean;
  error: string | null;
  range: DateRange;
  updateRange: (range: DateRange) => void;
  refresh: () => Promise<void>;
  exportData: (options: AnalyticsExportOptions) => Promise<void>;
}

const toErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error && err.message ? err.message : fallback;

const toError = (err: unknown, fallback: string): Error =>
  err instanceof Error ? err : new Error(fallback);

export function useAnalytics(options: UseAnalyticsOptions): UseAnalyticsReturn {
  const { initialRange, refreshInterval = 0, apiClient } = options;

  const [range, setRange] = useState<DateRange>(initialRange ?? presetRange("30d"));
  const [kpis, setKpis] = useState<KpiDatum[]>([]);
  const [series, setSeries] = useState<TimeSeriesDatum[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const payload = await apiClient.loadAnalytics(range);
      if (requestIdRef.current === requestId) {
        setKpis(payload.kpis);
        setSeries(payload.series);
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
  }, [apiClient, range]);

  const updateRange = useCallback((nextRange: DateRange) => {
    setRange(nextRange);
  }, []);

  const exportData = useCallback(
    async (exportOptions: AnalyticsExportOptions) => {
      const exportAnalytics = apiClient.exportAnalytics;
      if (!exportAnalytics) {
        throw new Error('AnalyticsApiClient.exportAnalytics not configured');
      }
      const payload: AnalyticsPayload = { kpis, series };
      try {
        const blob = await exportAnalytics(payload, exportOptions);

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =
          exportOptions.filename ?? `analytics-${range.from}-${range.to}.${exportOptions.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        setError(toErrorMessage(err, 'Failed to export analytics'));
        throw toError(err, 'Failed to export analytics');
      }
    },
    [apiClient, range.from, range.to, kpis, series],
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
      series,
      isLoading,
      error,
      range,
      updateRange,
      refresh,
      exportData,
    }),
    [kpis, series, isLoading, error, range, updateRange, refresh, exportData],
  );
}

export const createStubAnalyticsApiClient = (
  overrides?: Partial<AnalyticsApiClient>,
): AnalyticsApiClient => {
  const notConfigured: AnalyticsApiClient = {
    loadAnalytics: () => Promise.reject(new Error('AnalyticsApiClient not configured')),
  };
  return { ...notConfigured, ...overrides };
};
