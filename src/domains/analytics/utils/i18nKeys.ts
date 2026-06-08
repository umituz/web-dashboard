/**
 * Analytics Domain i18n Keys
 */

export const ANALYTICS_KEYS = {
  // Common
  common: {
    export: 'analytics.common.export',
    lastPeriod: 'analytics.common.lastPeriod',
    last7Days: 'analytics.common.last7Days',
    last30Days: 'analytics.common.last30Days',
    last90Days: 'analytics.common.last90Days',
    lastYear: 'analytics.common.lastYear',
    loading: 'analytics.common.loading',
  },

  // Metric card
  metric: {
    noData: 'analytics.metric.noData',
    change: 'analytics.metric.change',
  },

  // Analytics card
  card: {
    title: 'analytics.card.title',
  },

  // Chart
  chart: {
    noData: 'analytics.chart.noData',
  },

  // Layout
  layout: {
    title: 'analytics.layout.title',
    export: 'analytics.layout.export',
  },
} as const;
