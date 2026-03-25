/**
 * Dashboard Configuration
 * Config-based dashboard system
 */

import type { ChartType } from '../../domains/analytics/types/analytics';

/**
 * Analytics service types
 */
export type AnalyticsServiceType = 'traffic' | 'cohort' | 'funnel' | 'growth' | 'performance';

/**
 * Export format
 */
export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  /** Enable analytics */
  enabled?: boolean;
  /** Analytics services to include */
  services?: AnalyticsServiceType[];
  /** Real-time updates */
  realtime?: boolean;
  /** Export configuration */
  export?: {
    enabled?: boolean;
    formats?: ExportFormat[];
  };
}

/**
 * Data refresh configuration
 */
export interface DataConfig {
  /** Refresh interval in milliseconds */
  refreshInterval?: number;
  /** Cache duration in milliseconds */
  cacheDuration?: number;
  /** Retry attempts for failed requests */
  retryAttempts?: number;
}

/**
 * Charts configuration
 */
export interface ChartsConfig {
  /** Default chart type */
  defaultType?: ChartType;
  /** Chart theme */
  theme?: 'light' | 'dark' | 'auto';
  /** Enable animations */
  animations?: boolean;
  /** Color palette */
  colors?: string[];
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  /** Enable lazy loading */
  lazyLoad?: boolean;
  /** Enable virtual scrolling */
  virtualScrolling?: boolean;
  /** Pagination size */
  paginationSize?: number;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  /** Analytics configuration */
  analytics?: AnalyticsConfig;
  /** Data configuration */
  data?: DataConfig;
  /** Charts configuration */
  charts?: ChartsConfig;
  /** Performance configuration */
  performance?: PerformanceConfig;
}

/**
 * Default dashboard configuration
 */
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
    refreshInterval: 30000, // 30 seconds
    cacheDuration: 300000, // 5 minutes
    retryAttempts: 3,
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
