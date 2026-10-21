import type { TimeSeriesData } from "../types/analytics";

import type { Metric, KPIData, DateRangePreset } from "../types/analytics";

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
    return Number.isInteger(num) ? num.toString() : num.toFixed(decimals);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCurrency(
  value: number,
  currency: string = "USD",
  decimals: number = 0,
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getTrend(growth: number): "up" | "down" | "stable" {
  if (growth > 0.1) return "up";
  if (growth < -0.1) return "down";
  return "stable";
}

export function createKPI(current: number, previous: number): KPIData {
  const growth = calculateGrowth(current, previous);
  return {
    current,
    previous,
    growth,
  };
}

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

export function calculateConversionRate(converted: number, total: number): number {
  if (total === 0) return 0;
  return (converted / total) * 100;
}

export function calculateDropOffRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((previous - current) / previous) * 100;
}

export function createDateRangePreset(label: string, days: number): DateRangePreset {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);

  return {
    label,
    value: label.toLowerCase().replace(/\s+/g, "-"),
    days,
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
}

export function getDateRangePresets(): DateRangePreset[] {
  return [
    createDateRangePreset("Last 7 Days", 7),
    createDateRangePreset("Last 30 Days", 30),
    createDateRangePreset("Last 90 Days", 90),
    createDateRangePreset("This Year", 365),
    createDateRangePreset("All Time", 365 * 10),
  ];
}

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

      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    const bucket = grouped.get(key);
    if (bucket) {
      bucket.push(item);
    }
  });

  return Array.from(grouped.entries()).map(([date, items]) => {
    const aggregated: TimeSeriesData = { date };

    items.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (key === "date") return;
        if (typeof value === "number") {
          const current = (aggregated[key] as number | undefined) ?? 0;
          aggregated[key] = current + value;
        }
      });
    });

    return aggregated;
  });
}

export function calculateMovingAverage(data: number[], window: number): number[] {
  if (window < 1) {
    throw new RangeError(`calculateMovingAverage: window must be >= 1, received ${window}`);
  }

  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const subset = data.slice(start, i + 1);
    const avg = subset.reduce((sum, val) => sum + val, 0) / subset.length;
    result.push(avg);
  }

  return result;
}

export function detectOutliers(data: number[], threshold: number = 2): number[] {
  if (data.length === 0) return [];

  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);

  return data
    .map((value, index) => ({ value, index }))
    .filter(({ value }) => Math.abs(value - mean) > threshold * stdDev)
    .map(({ index }) => index);
}

export function roundTo(num: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
}

export function generateColor(index: number, alpha: number = 1): string {
  const hue = (index * 137.508) % 360;
  return `hsla(${hue}, 70%, 50%, ${alpha})`;
}

export function generateChartColors(count: number, alpha: number = 1): string[] {
  return Array.from({ length: count }, (_, i) => generateColor(i, alpha));
}
