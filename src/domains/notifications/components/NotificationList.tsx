import { Bell } from "lucide-react";
import { EmptyState } from "@umituz/web-design-system/organisms";
import type {
  NotificationItemLabels,
  NotificationListLabels,
  NotificationRecord,
  NotificationTypeMeta,
} from "../types";
import { NotificationItem } from "./NotificationItem";

const DEFAULT_LABELS: NotificationListLabels = {
  markReadLabel: "Mark read",
  dismissLabel: "Dismiss",
  viewLabel: "View",
  unreadLabel: "Unread",
  emptyTitle: "You're all caught up",
  emptyDescription: "New alerts will land here.",
};

export interface NotificationListProps {
  notifications: readonly NotificationRecord[];
  typeMeta?: NotificationTypeMeta;
  onMarkRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  timeFormatter?: (iso: string) => string;
  labels?: Partial<NotificationListLabels>;
}

export const NotificationList = ({
  notifications,
  typeMeta,
  onMarkRead,
  onDismiss,
  timeFormatter,
  labels,
}: NotificationListProps) => {
  const text: NotificationListLabels = { ...DEFAULT_LABELS, ...labels };
  const itemLabels: Partial<NotificationItemLabels> = {
    markReadLabel: text.markReadLabel,
    dismissLabel: text.dismissLabel,
    viewLabel: text.viewLabel,
    unreadLabel: text.unreadLabel,
  };

  if (notifications.length === 0) {
    return (
      <div className="udb-notif-list__empty">
        <EmptyState
          icon={<Bell size={20} aria-hidden="true" />}
          title={text.emptyTitle}
          description={text.emptyDescription}
          size="md"
          centered
        />
      </div>
    );
  }

  return (
    <ul className="udb-notif-list">
      {notifications.map((notification) => (
        <li key={notification.id}>
          <NotificationItem
            notification={notification}
            typeMeta={typeMeta}
            onMarkRead={onMarkRead}
            onDismiss={onDismiss}
            timeFormatter={timeFormatter}
            labels={itemLabels}
          />
        </li>
      ))}
    </ul>
  );
};
