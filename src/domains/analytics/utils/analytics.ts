import type { TimeSeriesDatum } from "../types/analytics";

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

export interface KpiDeltaLike {
  value: string;
  direction: "up" | "down" | "flat";
  good: boolean;
}

export function toKpiDelta(
  value: number | string,
  previousValue?: number,
  goodWhen: "up" | "down" = "up",
): KpiDeltaLike | undefined {
  if (previousValue === undefined || previousValue === 0) return undefined;
  const current = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(current)) return undefined;
  const change = ((current - previousValue) / previousValue) * 100;
  if (Math.abs(change) < 0.05) {
    return { value: `${change.toFixed(1)}%`, direction: "flat", good: true };
  }
  const direction = change > 0 ? "up" : "down";
  const good = direction === goodWhen;
  return { value: `${change > 0 ? "+" : ""}${change.toFixed(1)}%`, direction, good };
}

export function toCsv(
  headers: readonly string[],
  rows: readonly (readonly (string | number)[])[],
): string {
  const escapeCell = (cell: string | number): string => {
    const text = String(cell);
    return /[",\n;]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  const lines = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ];
  return `﻿${lines.join("\r\n")}`;
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCsv(options: {
  filename: string;
  headers: readonly string[];
  rows: readonly (readonly (string | number)[])[];
}): void {
  downloadCsv(options.filename, toCsv(options.headers, options.rows));
}

export function calculateConversionRate(converted: number, total: number): number {
  if (total === 0) return 0;
  return (converted / total) * 100;
}

export function calculateDropOffRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((previous - current) / previous) * 100;
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
      key = date.toISOString().slice(0, 10);
    } else if (period === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().slice(0, 10);
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
    const aggregated: TimeSeriesDatum = { date };

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
