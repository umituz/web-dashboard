import type { ExportFormat } from '../domains/analytics/types/analytics';

export type { ExportFormat };

export type AnalyticsServiceType = 'traffic' | 'cohort' | 'funnel' | 'growth' | 'performance';

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
    theme?: 'light' | 'dark' | 'auto';
    animations?: boolean;
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
      formats: ['pdf', 'xlsx', 'csv'],
    },
  },
  data: {
    refreshInterval: 30000,     cacheDuration: 300000,     retryAttempts: 3,
  },
  charts: {
    theme: 'auto',
    animations: true,
  },
  performance: {
    lazyLoad: true,
    virtualScrolling: true,
    paginationSize: 20,
  },
};
