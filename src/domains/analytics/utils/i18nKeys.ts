export const ANALYTICS_KEYS = {
  common: {
    export: 'analytics.common.export',
    refresh: 'analytics.common.refresh',
    periodSelector: 'analytics.common.periodSelector',
    lastPeriod: 'analytics.common.lastPeriod',
    last7Days: 'analytics.common.last7Days',
    last30Days: 'analytics.common.last30Days',
    last90Days: 'analytics.common.last90Days',
    lastYear: 'analytics.common.lastYear',
    loading: 'analytics.common.loading',
  },

  metric: {
    noData: 'analytics.metric.noData',
    change: 'analytics.metric.change',
  },

  card: {
    title: 'analytics.card.title',
  },

  chart: {
    noData: 'analytics.chart.noData',
  },

  layout: {
    title: 'analytics.layout.title',
    export: 'analytics.layout.export',
  },
} as const;
