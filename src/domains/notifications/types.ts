import type { LucideIcon } from "lucide-react";

export type NotificationSeverity = "info" | "success" | "warning" | "danger";

export type NotificationSeverityInput = NotificationSeverity | "critical";

export interface NotificationRecord {
  id: string;
  type: string;
  title?: string;
  body?: string;
  read?: boolean;
  at?: string;
  createdAt?: string;
  severity?: NotificationSeverityInput;
  link?: string;
}

export interface NotificationTypeMetaEntry {
  label: string;
  icon?: LucideIcon;
}

export type NotificationTypeMeta = Record<string, NotificationTypeMetaEntry>;

export interface NotificationItemLabels {
  markReadLabel: string;
  dismissLabel: string;
  viewLabel: string;
  unreadLabel: string;
}

export interface NotificationListLabels extends NotificationItemLabels {
  emptyTitle: string;
  emptyDescription: string;
}
