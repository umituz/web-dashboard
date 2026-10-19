export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  threshold?: number;
  status: 'good' | 'warning' | 'critical';
}

export interface DashboardMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  errorRate: number;
  activeUsers: number;
}

export interface KPIData {
  current: number;
  previous: number;
  growth: number;
}

export interface RealtimeMetrics {
  timestamp: number;
  users: number;
  sessions: number;
  pageViews: number;
  conversions: number;
  revenue: number;
}

interface PerformanceMemoryLike {
  usedJSHeapSize: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

const isLayoutShiftEntry = (entry: PerformanceEntry): entry is LayoutShiftEntry =>
  typeof (entry as LayoutShiftEntry).value === 'number';

const isFirstInputEntry = (entry: PerformanceEntry): entry is FirstInputEntry =>
  typeof (entry as FirstInputEntry).processingStart === 'number';

export class PerformanceService {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private observers: PerformanceObserver[] = [];

    public startMonitoring(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
    if (this.observers.length > 0) return;

        try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && isLayoutShiftEntry(entry)) {
            this.recordMetric('CLS', entry.value, 'score', 0.1);
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch {
          }

        try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.recordMetric('LCP', entry.startTime, 'ms', 2500);
          }
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch {
          }

        try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input' && isFirstInputEntry(entry)) {
            this.recordMetric('FID', entry.processingStart - entry.startTime, 'ms', 100);
          }
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch {
          }
  }

    public recordMetric(name: string, value: number, unit: string, threshold?: number): void {
    const status = threshold
      ? value > threshold * 2
        ? 'critical'
        : value > threshold
        ? 'warning'
        : 'good'
      : 'good';

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      threshold,
      status,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metrics = this.metrics.get(name)!;
    metrics.push(metric);

        if (metrics.length > 100) {
      metrics.shift();
    }
  }

    public getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.get(name) || [];
  }

    public getLatestMetric(name: string): PerformanceMetric | undefined {
    const metrics = this.getMetrics(name);
    return metrics[metrics.length - 1];
  }

    public getAllMetrics(): Map<string, PerformanceMetric[]> {
    return new Map(this.metrics);
  }

    public clearMetrics(): void {
    this.metrics.clear();
  }

    public getDashboardMetrics(): DashboardMetrics {
    const loadTime =
      this.getNavigationLoadTime() ?? this.getLatestMetric('loadTime')?.value ?? 0;

    const renderTime = this.getLatestMetric('renderTime')?.value || 0;
    const apiResponseTime = this.getLatestMetric('apiResponseTime')?.value || 0;
    const memoryUsage = this.getMemoryUsageMb();

    const errorRate = this.calculateErrorRate();

    return {
      loadTime,
      renderTime,
      apiResponseTime,
      memoryUsage,
      errorRate,
      activeUsers: 0,     };
  }

    private getNavigationLoadTime(): number | null {
    if (typeof performance === 'undefined' || typeof performance.getEntriesByType !== 'function') {
      return null;
    }

            const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (!navigation || navigation.loadEventEnd <= 0) return null;
    return navigation.loadEventEnd - navigation.startTime;
  }

    private getMemoryUsageMb(): number {
    const memory = (performance as Performance & { memory?: PerformanceMemoryLike }).memory;
    return typeof memory !== 'undefined' ? memory.usedJSHeapSize / 1048576 : 0;
  }

    private calculateErrorRate(): number {
    const errors = this.getMetrics('error');
    if (errors.length === 0) return 0;

    const recentErrors = errors.filter((e) => e.timestamp > Date.now() - 60000);     return recentErrors.length;
  }

    public simulateRealtimeMetrics(previous?: RealtimeMetrics): RealtimeMetrics {
    const now = Date.now();

    if (previous) {
            const userChange = Math.floor(Math.random() * 20) - 10;
      const sessionChange = Math.floor(Math.random() * 30) - 15;
      const pageViewChange = Math.floor(Math.random() * 50) - 20;
      const conversionCount = Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0;
      const revenueAdd = conversionCount * (Math.random() * 100 + 50);

      return {
        timestamp: now,
        users: Math.max(0, previous.users + userChange),
        sessions: Math.max(0, previous.sessions + sessionChange),
        pageViews: Math.max(0, previous.pageViews + pageViewChange),
        conversions: previous.conversions + conversionCount,
        revenue: previous.revenue + revenueAdd,
      };
    }

        return {
      timestamp: now,
      users: Math.floor(Math.random() * 1000) + 500,
      sessions: Math.floor(Math.random() * 1500) + 800,
      pageViews: Math.floor(Math.random() * 5000) + 2000,
      conversions: Math.floor(Math.random() * 50),
      revenue: Math.floor(Math.random() * 5000) + 2000,
    };
  }

    public calculateKPI(current: number, previous: number): KPIData {
    const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    return {
      current,
      previous,
      growth,
    };
  }

    public measurePageLoad(): void {
    if (typeof window === 'undefined' || typeof window.performance === 'undefined') return;

    const record = () => {
      const loadTime = this.getNavigationLoadTime();
      if (loadTime !== null) {
        this.recordMetric('loadTime', loadTime, 'ms', 3000);
      }
    };

    if (document.readyState === 'complete') {
      record();
      return;
    }

    window.addEventListener('load', () => {
      setTimeout(record, 0);
    }, { once: true });
  }

    public measureAPIResponse(startTime: number): void {
    const duration = Date.now() - startTime;
    this.recordMetric('apiResponseTime', duration, 'ms', 1000);
  }

    public disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

export const performanceService = new PerformanceService();
