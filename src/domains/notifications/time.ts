import type { NotificationRecord, NotificationSeverity, NotificationSeverityInput } from "./types";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export interface TimeAgoLabels {
  justNow: string;
  minutesPattern: string;
  hoursPattern: string;
  daysPattern: string;
}

export const DEFAULT_TIME_AGO_LABELS: TimeAgoLabels = {
  justNow: "just now",
  minutesPattern: "{n}m ago",
  hoursPattern: "{n}h ago",
  daysPattern: "{n}d ago",
};

const fill = (pattern: string, value: number): string => pattern.replace("{n}", String(value));

/** Relative time for feeds; beyond a week it falls back to the locale date. */
export function timeAgo(
  iso: string,
  labels: Partial<TimeAgoLabels> = {},
  now?: number,
): string {
  const text = { ...DEFAULT_TIME_AGO_LABELS, ...labels };
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "";
  const elapsed = (now ?? Date.now()) - time;
  if (elapsed < MINUTE) return text.justNow;
  if (elapsed < HOUR) return fill(text.minutesPattern, Math.floor(elapsed / MINUTE));
  if (elapsed < DAY) return fill(text.hoursPattern, Math.floor(elapsed / HOUR));
  if (elapsed < 7 * DAY) return fill(text.daysPattern, Math.floor(elapsed / DAY));
  return new Date(time).toLocaleDateString();
}

/** The feed tables stamp whichever column they have; `at` wins over `createdAt`. */
export function timestampOf(record: NotificationRecord): string | undefined {
  return record.at ?? record.createdAt;
}

const SEVERITY_ALIASES: Record<NotificationSeverityInput, NotificationSeverity> = {
  info: "info",
  success: "success",
  warning: "warning",
  danger: "danger",
  critical: "danger",
};

export function severityOf(record: NotificationRecord): NotificationSeverity {
  return record.severity ? SEVERITY_ALIASES[record.severity] : "info";
}
