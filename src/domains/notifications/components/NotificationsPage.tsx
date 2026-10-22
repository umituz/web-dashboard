import { useMemo, useState } from "react";
import { CheckCheck } from "lucide-react";
import { Button } from "@umituz/web-design-system/atoms";
import { Segmented } from "@umituz/web-design-system/molecules";
import type { SegmentedOption } from "@umituz/web-design-system/molecules";
import { PageHeader } from "../../layouts/components";
import { useNotifications } from "../NotificationsContext";
import { severityOf } from "../time";
import type { NotificationListLabels, NotificationTypeMeta } from "../types";
import { NotificationList } from "./NotificationList";

const ALL = "all";
const UNREAD = "unread";
const ATTENTION = "attention";
const TYPE_PREFIX = "type:";

export interface NotificationsPageLabels extends NotificationListLabels {
  title: string;
  description: string;
  allLabel: string;
  unreadLabel: string;
  markAllLabel: string;
  emptyUnreadTitle: string;
  emptyAttentionTitle: string;
}

const DEFAULT_LABELS: NotificationsPageLabels = {
  title: "Notifications",
  description: "Alerts across the workspace.",
  allLabel: "All",
  unreadLabel: "Unread",
  markAllLabel: "Mark all read",
  emptyTitle: "No notifications",
  emptyUnreadTitle: "Nothing unread",
  emptyAttentionTitle: "No critical alerts",
  emptyDescription: "Alerts land here as work happens.",
  markReadLabel: "Mark read",
  dismissLabel: "Dismiss",
  viewLabel: "View",
};

export interface NotificationsPageProps {
  /** Adds one segment per type; types with zero records stay hidden. */
  typeMeta?: NotificationTypeMeta;
  /** When set, adds a segment for warning/danger records (e.g. "Needs attention"). */
  attentionLabel?: string;
  timeFormatter?: (iso: string) => string;
  labels?: Partial<NotificationsPageLabels>;
}

const needsAttention = (severity: string): boolean => severity === "warning" || severity === "danger";

/** Full-page feed skeleton: filter segments, mark-all-read, and the shared list. */
export const NotificationsPage = ({ typeMeta, attentionLabel, timeFormatter, labels }: NotificationsPageProps) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const { notifications, unreadCount, loaded, markAllAsRead, markRead, dismiss, canDismiss } =
    useNotifications();
  const [filter, setFilter] = useState<string>(ALL);

  const options = useMemo<SegmentedOption<string>[]>(() => {
    const segments: SegmentedOption<string>[] = [
      { value: ALL, label: text.allLabel },
      { value: UNREAD, label: `${text.unreadLabel} (${unreadCount})` },
    ];
    if (attentionLabel) segments.push({ value: ATTENTION, label: attentionLabel });
    for (const [key, meta] of Object.entries(typeMeta ?? {})) {
      const count = notifications.filter((n) => n.type === key).length;
      if (count > 0 || filter === `${TYPE_PREFIX}${key}`) {
        segments.push({ value: `${TYPE_PREFIX}${key}`, label: `${meta.label} (${count})` });
      }
    }
    return segments;
  }, [typeMeta, attentionLabel, notifications, unreadCount, filter, text.allLabel, text.unreadLabel]);

  const filtered = useMemo(() => {
    if (filter === UNREAD) return notifications.filter((n) => !n.read);
    if (filter === ATTENTION) return notifications.filter((n) => needsAttention(severityOf(n)));
    if (filter.startsWith(TYPE_PREFIX)) {
      const key = filter.slice(TYPE_PREFIX.length);
      return notifications.filter((n) => n.type === key);
    }
    return notifications;
  }, [notifications, filter]);

  const emptyTitle =
    filter === UNREAD ? text.emptyUnreadTitle : filter === ATTENTION ? text.emptyAttentionTitle : text.emptyTitle;

  return (
    <div className="udb-notif-page">
      <PageHeader
        title={text.title}
        description={text.description}
        actions={
          unreadCount > 0 && (
            <Button variant="secondary" size="sm" icon={<CheckCheck size={13} />} onClick={markAllAsRead}>
              {text.markAllLabel}
            </Button>
          )
        }
      />

      <div className="udb-notif-page__filters">
        <Segmented options={options} value={filter} onChange={setFilter} aria-label={text.title} />
      </div>

      <div className="udb-notif-page__body">
        {!loaded ? (
          <div className="udb-notif-page__loading">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="udb-notif-page__skeleton" />
            ))}
          </div>
        ) : (
          <NotificationList
            notifications={filtered}
            typeMeta={typeMeta}
            onMarkRead={markRead}
            onDismiss={canDismiss ? dismiss : undefined}
            timeFormatter={timeFormatter}
            labels={{ ...text, emptyTitle, emptyDescription: text.emptyDescription }}
          />
        )}
      </div>
    </div>
  );
};
