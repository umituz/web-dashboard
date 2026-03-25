/**
 * Analytics Utilities
 *
 * Helper functions for analytics operations
 */

import type { Metric, KPIData, DateRangePreset } from "../types/analytics";

/**
 * Format number with K/M/B suffixes
 *
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(decimals) + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals) + "K";
  }
  return num.toFixed(decimals);
}

/**
 * Format percentage
 *
 * @param value - Value to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string with % suffix
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format currency
 *
 * @param value - Value to format
 * @param currency - Currency code (default: USD)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
  decimals: number = 0
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Calculate growth rate
 *
 * @param current - Current value
 * @param previous - Previous value
 * @returns Growth rate percentage
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Get trend direction from growth
 *
 * @param growth - Growth rate
 * @returns Trend direction
 */
export function getTrend(growth: number): "up" | "down" | "stable" {
  if (growth > 0.1) return "up";
  if (growth < -0.1) return "down";
  return "stable";
}

/**
 * Create KPI data object
 *
 * @param current - Current value
 * @param previous - Previous value
 * @returns KPI data object
 */
export function createKPI(current: number, previous: number): KPIData {
  const growth = calculateGrowth(current, previous);
  return {
    current,
    previous,
    growth,
  };
}

/**
 * Create metric object
 *
 * @param id - Metric ID
 * @param name - Metric name
 * @param value - Current value
 * @param previousValue - Previous value
 * @param unit - Optional unit
 * @returns Metric object
 */
export function createMetric(
  id: string,
  name: string,
  value: number,
  previousValue?: number,
  unit?: string
): Metric {
  const growth = previousValue !== undefined ? calculateGrowth(value, previousValue) : 0;
  return {
    id,
    name,
    value,
    previousValue,
    unit,
    trend: getTrend(growth),
  };
}

/**
 * Format metric value based on unit
 *
 * @param metric - Metric object
 * @returns Formatted value string
 */
export function formatMetricValue(metric: Metric): string {
  const { value, unit } = metric;

  switch (unit) {
    case "%":
      return formatPercentage(value);
    case "$":
    case "€":
    case "£":
      return formatCurrency(value, unit === "$" ? "USD" : unit === "€" ? "EUR" : "GBP");
    case "K":
    case "M":
    case "B":
      return formatNumber(value);
    default:
      return value.toLocaleString();
  }
}

/**
 * Calculate conversion rate
 *
 * @param converted - Number of conversions
 * @param total - Total number of users
 * @returns Conversion rate percentage
 */
export function calculateConversionRate(converted: number, total: number): number {
  if (total === 0) return 0;
  return (converted / total) * 100;
}

/**
 * Calculate drop-off rate
 *
 * @param current - Current step count
 * @param previous - Previous step count
 * @returns Drop-off rate percentage
 */
export function calculateDropOffRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((previous - current) / previous) * 100;
}

/**
 * Generate date range preset
 *
 * @param label - Preset label
 * @param days - Number of days
 * @returns Date range preset
 */
export function createDateRangePreset(label: string, days: number): DateRangePreset {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);

  return {
    label,
    value: label.toLowerCase().replace(/\s+/g, "-"),
    days,
  };
}

/**
 * Get common date range presets
 *
 * @returns Array of date range presets
 */
export function getDateRangePresets(): DateRangePreset[] {
  return [
    createDateRangePreset("Last 7 Days", 7),
    createDateRangePreset("Last 30 Days", 30),
    createDateRangePreset("Last 90 Days", 90),
    createDateRangePreset("This Year", 365),
    createDateRangePreset("All Time", 365 * 10),
  ];
}

/**
 * Aggregate data by time period
 *
 * @param data - Array of data points with date field
 * @param period - Aggregation period (day, week, month)
 * @returns Aggregated data
 */
export function aggregateByPeriod(
  data: Array<{ date: string; [key: string]: number | string }>,
  period: "day" | "week" | "month" = "day"
): Array<{ date: string; [key: string]: number | string }> {
  const grouped = new Map<string, Array<typeof data[0]>>();

  data.forEach((item) => {
    const date = new Date(item.date);
    let key: string;

    if (period === "day") {
      key = date.toISOString().split("T")[0];
    } else if (period === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split("T")[0];
    } else {
      // month
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item);
  });

  return Array.from(grouped.entries()).map(([date, items]) => {
    const aggregated: any = { date };

    // Sum all numeric fields
    items.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (key !== "date" && typeof value === "number") {
          aggregated[key] = (aggregated[key] || 0) + value;
        }
      });
    });

    return aggregated;
  });
}

/**
 * Calculate moving average
 *
 * @param data - Array of numbers
 * @param window - Window size
 * @returns Array of moving averages
 */
export function calculateMovingAverage(data: number[], window: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const subset = data.slice(start, i + 1);
    const avg = subset.reduce((sum, val) => sum + val, 0) / subset.length;
    result.push(avg);
  }

  return result;
}

/**
 * Detect outliers in data
 *
 * @param data - Array of numbers
 * @param threshold - Standard deviation threshold (default: 2)
 * @returns Array of outlier indices
 */
export function detectOutliers(data: number[], threshold: number = 2): number[] {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);

  return data
    .map((value, index) => ({ value, index }))
    .filter(({ value }) => Math.abs(value - mean) > threshold * stdDev)
    .map(({ index }) => index);
}

/**
 * Round to decimal places
 *
 * @param num - Number to round
 * @param decimals - Decimal places (default: 2)
 * @returns Rounded number
 */
export function roundTo(num: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
}

/**
 * Generate random color
 *
 * @param index - Color index
 * @param alpha - Alpha value (0-1)
 * @returns HSL color string
 */
export function generateColor(index: number, alpha: number = 1): string {
  const hue = (index * 137.508) % 360; // Golden angle approximation
  return `hsla(${hue}, 70%, 50%, ${alpha})`;
}

/**
 * Generate chart colors
 *
 * @param count - Number of colors
 * @param alpha - Alpha value (0-1)
 * @returns Array of color strings
 */
export function generateChartColors(count: number, alpha: number = 1): string[] {
  return Array.from({ length: count }, (_, i) => generateColor(i, alpha));
}
