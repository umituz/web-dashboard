import type { ChartType } from '../domains/analytics/types/analytics';

export type AnalyticsServiceType = 'traffic' | 'cohort' | 'funnel' | 'growth' | 'performance';

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

export interface AnalyticsConfig {
    enabled?: boolean;
    services?: AnalyticsServiceType[];
    realtime?: boolean;
    export?: {
    enabled?: boolean;
    formats?: ExportFormat[];
  };
}

export interface DataConfig {
    refreshInterval?: number;
    cacheDuration?: number;
    retryAttempts?: number;
}

export interface ChartsConfig {
    defaultType?: ChartType;
    theme?: 'light' | 'dark' | 'auto';
    animations?: boolean;
    colors?: string[];
}

export interface PerformanceConfig {
    lazyLoad?: boolean;
    virtualScrolling?: boolean;
    paginationSize?: number;
}

export interface DashboardConfig {
    analytics?: AnalyticsConfig;
    data?: DataConfig;
    charts?: ChartsConfig;
    performance?: PerformanceConfig;
}

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  analytics: {
    enabled: true,
    services: ['traffic', 'cohort', 'funnel', 'growth'],
    realtime: true,
    export: {
      enabled: true,
      formats: ['pdf', 'excel', 'csv'],
    },
  },
  data: {
    refreshInterval: 30000,     cacheDuration: 300000,     retryAttempts: 3,
  },
  charts: {
    defaultType: 'line',
    theme: 'auto',
    animations: true,
    colors: ['#6366f1', '#a855f7', '#f59e0b', '#10b981'],
  },
  performance: {
    lazyLoad: true,
    virtualScrolling: true,
    paginationSize: 20,
  },
};
