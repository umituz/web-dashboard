# @umituz/web-dashboard Enhancement Plan

## 🎯 Hedef
Dashboard paketini analytics özellikleriyle geliştirmek ve config-based yapıya geçirmek.

**Mevcut Durum:** v2.5.2 - Sadece UI components
**Hedef:** v3.0.0 - UI + Analytics Service + Config-based

## 📦 Eklenecek Analytics Özellikleri

### 1. **Analytics Engine Service** (Ana uygulamadan taşıma)
```typescript
// src/services/analytics/analytics-engine.service.ts
- Cohort Analysis (kohort takibi)
- Conversion Path Analysis (dönüşüm hunileri)
- Funnel Analysis (kullanıcı hunileri)
- User Segmentation (kullanıcı segmentasyonu)
- Retention Analytics (elde etme analizi)
- Churn Prediction (ayırılma tahmini)
- User Behavior Prediction (davranış tahmini)
```

### 2. **Traffic Analytics** (web-traffic'ten entegrasyon)
```typescript
// Trafik analizi
- Page Views Tracking
- Session Management
- User Journey Mapping
- Traffic Source Attribution
- Real-time Analytics
```

### 3. **Growth Metrics** (Growth hacking)
```typescript
// Growth metrikleri
- KPI Tracking
- Conversion Rate Optimization
- A/B Test Analytics
- Funnel Optimization
- Growth Hacking Metrics
```

### 4. **Performance Dashboard**
```typescript
// Performans dashboard
- Real-time Metrics
- Custom KPIs
- Data Visualization
- Export Capabilities
```

## 🏗️ Yapı Değişiklikleri

### Before (v2.5.2)
```typescript
// Sadece UI components
export { MetricCard, AnalyticsChart } from './components';
export { useAnalytics } from './hooks';
export { formatNumber, calculateGrowth } from './utils';
```

### After (v3.0.0)
```typescript
// UI + Services + Config
export { MetricCard, AnalyticsChart } from './components';
export { useAnalytics, useAnalyticsEngine } from './hooks';
export { AnalyticsService, TrafficService, GrowthService } from './services';
export { DashboardConfig, AnalyticsConfig } from './config';

// Config-based usage
const analytics = useAnalytics({
  services: ['traffic', 'cohort', 'funnel'],
  realtime: true,
  export: { enabled: true }
});
```

## 📁 Yeni Dosya Yapısı

```
web-dashboard/
├── src/
│   ├── index.ts (main exports)
│   ├── domain/
│   │   ├── analytics/
│   │   │   ├── types/ (Analytics types)
│   │   │   ├── utils/ (Formatters, helpers)
│   │   │   ├── hooks/ (useAnalytics, useAnalyticsEngine)
│   │   │   ├── components/ (MetricCard, AnalyticsChart)
│   │   │   └── services/ (YENİ!)
│   │   │       ├── AnalyticsEngineService.ts
│   │   │       ├── TrafficService.ts
│   │   │       ├── GrowthService.ts
│   │   │       └── PerformanceService.ts
│   │   ├── config/
│   │   │   └── DashboardConfig.ts (YENİ!)
│   │   ├── layouts/
│   │   ├── settings/
│   │   └── onboarding/
│   └── config/
│       └── dashboard.config.ts
```

## 🎛️ Config Sistemi

```typescript
export interface DashboardConfig {
  // Analytics services
  analytics?: {
    enabled?: boolean;
    services?: Array<'traffic' | 'cohort' | 'funnel' | 'growth'>;
    realtime?: boolean;
    export?: {
      enabled?: boolean;
      formats?: Array<'pdf' | 'excel' | 'csv'>;
    };
  };

  // Data refresh
  data?: {
    refreshInterval?: number; // ms
    cacheDuration?: number; // ms
    retryAttempts?: number;
  };

  // Visualization
  charts?: {
    defaultType?: 'line' | 'bar' | 'area' | 'pie';
    theme?: 'light' | 'dark' | 'auto';
    animations?: boolean;
  };

  // Performance
  performance?: {
    lazyLoad?: boolean;
    virtualScrolling?: boolean;
    paginationSize?: number;
  };
}

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  analytics: {
    enabled: true,
    services: ['traffic', 'cohort', 'funnel'],
    realtime: true,
    export: {
      enabled: true,
      formats: ['pdf', 'excel', 'csv'],
    },
  },
  data: {
    refreshInterval: 30000, // 30s
    cacheDuration: 300000, // 5min
    retryAttempts: 3,
  },
  charts: {
    defaultType: 'line',
    theme: 'auto',
    animations: true,
  },
  performance: {
    lazyLoad: true,
    virtualScrolling: true,
    paginationSize: 20,
  },
};
```

## 🔧 Kullanım Örneği

```typescript
import { useAnalytics } from '@umituz/web-dashboard/analytics';
import { DashboardConfig } from '@umituz/web-dashboard/config';

function MyAnalyticsDashboard() {
  const {
    // Metrics
    metrics,
    kpis,
    cohorts,
    funnels,

    // Services
    trafficService,
    cohortService,
    funnelService,

    // Actions
    exportData,
    refreshMetrics,

    // State
    isLoading,
    error,
  } = useAnalytics({
      config: {
        analytics: {
          enabled: true,
          services: ['traffic', 'cohort', 'funnel', 'growth'],
          realtime: true,
        },
        data: {
          refreshInterval: 60000, // 1 minute
        },
      },
      onError: (error) => toast.error(error.message),
    });

  return (
    <div>
      <MetricCard title="Total Users" value={metrics.totalUsers} />
      <AnalyticsChart data={metrics.traffic} />
      <FunnelChart data={funnels} />
    </div>
  );
}
```

## 📦 Yeni Özellikler

### 1. **Analytics Engine Service**
```typescript
import { AnalyticsEngineService } from '@umituz/web-dashboard/analytics/services';

const engine = AnalyticsEngineService.getInstance();

// Cohort analysis
const cohorts = engine.calculateRetention(userData);

// Conversion paths
const paths = engine.analyzeConversionPaths(conversionData);

// Funnel analysis
const funnel = engine.analyzeFunnel(funnelData);

// User segmentation
const segments = engine.segmentUsers(users);
```

### 2. **Traffic Service**
```typescript
import { TrafficService } from '@umituz/web-dashboard/analytics/services';

const traffic = new TrafficService(config);

// Track page view
await traffic.trackPageView('/dashboard', { userId: '123' });

// Get traffic data
const data = await traffic.getTrafficData({
  startDate: new Date('2024-01-01'),
  endDate: new Date(),
  dimensions: ['page', 'source', 'medium'],
});
```

### 3. **Growth Service**
```typescript
import { GrowthService } from '@umituz/web-dashboard/analytics/services';

const growth = new GrowthService(config);

// Calculate KPIs
const kpis = await growth.calculateKPIs({
  metrics: ['acquisition', 'activation', 'retention', 'revenue'],
  period: '30d',
});

// A/B test results
const abTest = await growth.analyzeABTest('test-123');
```

## 📋 Implementation Steps

1. ✅ **Config sistemini oluştur** - DashboardConfig, AnalyticsConfig
2. **Analytics servislerini taşı** - Ana uygulamadan pakete
3. **Services layer'ı oluştur** - Service wrapper'lar
4. **Hooks'ı geliştir** - useAnalytics, useAnalyticsEngine
5. **Components'i güncelle** - Config destekli
6. **Type definitions** - Tüm tipleri export et
7. **Version bump** - 2.5.2 → 3.0.0
8. **Build & publish** - NPM publish
9. **Ana uygulamayı güncelle** - @umituz/web-dashboard@latest
10. **Test et** - Tüm analytics özellikleri

## 🚀 Sonraki Adım

Sırayla:
1. Config sistemi oluştur
2. Analytics servislerini pakete taşı
3. Hooks geliştir
4. Build & publish
5. Ana uygulamayı güncelle

Başlayalım mı? 🚀
