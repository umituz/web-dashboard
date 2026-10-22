import type { LucideIcon } from "lucide-react";

/** Severity buckets the fleet converges on; hosts writing `critical` get `danger`. */
export type NotificationSeverity = "info" | "success" | "warning" | "danger";

export type NotificationSeverityInput = NotificationSeverity | "critical";

export interface NotificationRecord {
  id: string;
  /** Domain-specific kind — drives the page segments and row icons through typeMeta. */
  type: string;
  title?: string;
  body?: string;
  read?: boolean;
  /** Either timestamp column is accepted; `at` wins when both are present. */
  at?: string;
  createdAt?: string;
  severity?: NotificationSeverityInput;
  /** Router path — rows navigate (and mark read) when present. */
  link?: string;
}

export interface NotificationTypeMetaEntry {
  /** Segment label on the page; also the row fallback when a record has no title. */
  label: string;
  icon?: LucideIcon;
}

/** Optional per-type registry; segments hide types with zero matching records. */
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
