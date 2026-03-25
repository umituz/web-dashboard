/**
 * Performance Service
 *
 * Real-time metrics and dashboard performance monitoring
 */

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

/**
 * Performance Service
 *
 * Monitors dashboard performance and provides real-time metrics
 */
export class PerformanceService {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers(): void {
    if ('PerformanceObserver' in window) {
      // Observe layout shifts
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift') {
              this.recordMetric('CLS', (entry as any).value, 'score', 0.1);
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(observer);
      } catch (e) {
        // Layout Shift API not supported
      }

      // Observe largest contentful paint
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
      } catch (e) {
        // LCP API not supported
      }

      // Observe first input delay
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'first-input') {
              this.recordMetric('FID', (entry as any).processingStart - entry.startTime, 'ms', 100);
            }
          }
        });
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.push(observer);
      } catch (e) {
        // FID API not supported
      }
    }
  }

  /**
   * Record a performance metric
   *
   * @param name - Metric name
   * @param value - Metric value
   * @param unit - Unit of measurement
   * @param threshold - Warning threshold
   */
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

    // Keep only last 100 metrics per name
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  /**
   * Get metrics by name
   *
   * @param name - Metric name
   * @returns Array of metrics
   */
  public getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.get(name) || [];
  }

  /**
   * Get latest metric value
   *
   * @param name - Metric name
   * @returns Latest metric or undefined
   */
  public getLatestMetric(name: string): PerformanceMetric | undefined {
    const metrics = this.getMetrics(name);
    return metrics[metrics.length - 1];
  }

  /**
   * Get all metrics
   *
   * @returns Map of all metrics
   */
  public getAllMetrics(): Map<string, PerformanceMetric[]> {
    return new Map(this.metrics);
  }

  /**
   * Clear all metrics
   */
  public clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Calculate dashboard performance metrics
   *
   * @returns Dashboard performance data
   */
  public getDashboardMetrics(): DashboardMetrics {
    const timing = typeof window !== 'undefined' ? window.performance?.timing : null;
    const navigation = typeof window !== 'undefined' ? window.performance?.navigation : null;

    const loadTime = timing
      ? timing.loadEventEnd - timing.navigationStart
      : this.getLatestMetric('loadTime')?.value || 0;

    const renderTime = this.getLatestMetric('renderTime')?.value || 0;
    const apiResponseTime = this.getLatestMetric('apiResponseTime')?.value || 0;
    const memoryUsage =
      typeof (performance as any).memory !== 'undefined'
        ? (performance as any).memory.usedJSHeapSize / 1048576
        : 0;

    const errorRate = this.calculateErrorRate();

    return {
      loadTime,
      renderTime,
      apiResponseTime,
      memoryUsage,
      errorRate,
      activeUsers: 0, // To be implemented with real data
    };
  }

  /**
   * Calculate error rate from metrics
   *
   * @returns Error rate percentage
   */
  private calculateErrorRate(): number {
    const errors = this.getMetrics('error');
    if (errors.length === 0) return 0;

    const recentErrors = errors.filter((e) => e.timestamp > Date.now() - 60000); // Last minute
    return recentErrors.length;
  }

  /**
   * Simulate real-time metrics
   *
   * @param previous - Previous metrics
   * @returns Simulated real-time metrics
   */
  public simulateRealtimeMetrics(previous?: RealtimeMetrics): RealtimeMetrics {
    const now = Date.now();

    if (previous) {
      // Simulate changes
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

    // Initial values
    return {
      timestamp: now,
      users: Math.floor(Math.random() * 1000) + 500,
      sessions: Math.floor(Math.random() * 1500) + 800,
      pageViews: Math.floor(Math.random() * 5000) + 2000,
      conversions: Math.floor(Math.random() * 50),
      revenue: Math.floor(Math.random() * 5000) + 2000,
    };
  }

  /**
   * Calculate growth KPI
   *
   * @param current - Current value
   * @param previous - Previous value
   * @returns KPI data
   */
  public calculateKPI(current: number, previous: number): KPIData {
    const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    return {
      current,
      previous,
      growth,
    };
  }

  /**
   * Measure page load time
   */
  public measurePageLoad(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance?.timing;
        if (timing) {
          const loadTime = timing.loadEventEnd - timing.navigationStart;
          this.recordMetric('loadTime', loadTime, 'ms', 3000);
        }
      }, 0);
    });
  }

  /**
   * Measure API response time
   *
   * @param startTime - Request start time
   */
  public measureAPIResponse(startTime: number): void {
    const duration = Date.now() - startTime;
    this.recordMetric('apiResponseTime', duration, 'ms', 1000);
  }

  /**
   * Disconnect all observers
   */
  public disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Create singleton instance
 */
export const performanceService = new PerformanceService();
