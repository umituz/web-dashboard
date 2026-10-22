import { Link } from "react-router";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { severityOf, timeAgo, timestampOf } from "../time";
import type {
  NotificationItemLabels,
  NotificationRecord,
  NotificationSeverity,
  NotificationTypeMeta,
} from "../types";

const SEVERITY_ICON: Record<NotificationSeverity, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
};

const DEFAULT_LABELS: NotificationItemLabels = {
  markReadLabel: "Mark read",
  dismissLabel: "Dismiss",
  viewLabel: "View",
  unreadLabel: "Unread",
};

export interface NotificationItemProps {
  notification: NotificationRecord;
  typeMeta?: NotificationTypeMeta;
  onMarkRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  /** Overrides the relative-time renderer; defaults to `timeAgo`. */
  timeFormatter?: (iso: string) => string;
  labels?: Partial<NotificationItemLabels>;
}

/** One feed row; navigates when the record carries a link and marks read on the way. */
export const NotificationItem = ({
  notification,
  typeMeta,
  onMarkRead,
  onDismiss,
  timeFormatter,
  labels,
}: NotificationItemProps) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const severity = severityOf(notification);
  const Icon = typeMeta?.[notification.type]?.icon ?? SEVERITY_ICON[severity];
  const stamp = timestampOf(notification);
  const when = stamp ? (timeFormatter ?? timeAgo)(stamp) : "";
  const unread = !notification.read;
  const heading = notification.title ?? typeMeta?.[notification.type]?.label ?? notification.type;

  const markRead = () => {
    if (unread) onMarkRead?.(notification.id);
  };

  const content = (
    <>
      <span className={`udb-notif-item__icon udb-notif-item__icon--${severity}`}>
        <Icon size={15} aria-hidden="true" />
      </span>
      <span className="udb-notif-item__body">
        <span className="udb-notif-item__title">{heading}</span>
        {notification.body && <span className="udb-notif-item__text">{notification.body}</span>}
        {when && <span className="udb-notif-item__when">{when}</span>}
      </span>
      <span className="udb-notif-item__side">
        {unread && (
          <span className="udb-notif-item__dot" role="img" aria-label={text.unreadLabel} />
        )}
        {unread && onMarkRead && (
          <button type="button" className="udb-link-button" onClick={markRead}>
            {text.markReadLabel}
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="udb-link-button udb-link-button--muted"
            aria-label={text.dismissLabel}
            onClick={() => onDismiss(notification.id)}
          >
            ✕
          </button>
        )}
      </span>
    </>
  );

  const className = `udb-notif-item${unread ? " udb-notif-item--unread" : ""}`;

  if (notification.link) {
    return (
      <Link to={notification.link} className={className} onClick={markRead}>
        {content}
      </Link>
    );
  }
  return <div className={className}>{content}</div>;
};
