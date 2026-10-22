import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@umituz/web-design-system/atoms";
import { Drawer } from "@umituz/web-design-system/organisms";
import { useNotifications } from "../NotificationsContext";
import type {
  NotificationListLabels,
  NotificationTypeMeta,
} from "../types";
import { NotificationList } from "./NotificationList";

export interface NotificationCenterLabels extends NotificationListLabels {
  title: string;
  markAllLabel: string;
  viewAllLabel: string;
  /** "{n} more" hint under a truncated popover list. */
  morePattern: string;
  /** "{n} unread" — the bell's accessible name when the badge has a count. */
  bellPattern: string;
}

const DEFAULT_LABELS: NotificationCenterLabels = {
  title: "Notifications",
  markAllLabel: "Mark all read",
  viewAllLabel: "View all",
  morePattern: "+{n} more",
  bellPattern: "Notifications, {n} unread",
  markReadLabel: "Mark read",
  dismissLabel: "Dismiss",
  viewLabel: "View",
  unreadLabel: "Unread",
  emptyTitle: "You're all caught up",
  emptyDescription: "New alerts will land here.",
};

export interface NotificationCenterProps {
  /** `popover` anchors under the bell; `drawer` opens the design-system Drawer. */
  variant?: "popover" | "drawer";
  /** Rows shown before the popover truncates into the "more" hint. */
  itemLimit?: number;
  /** Page path for the "View all" link; omit to hide the footer link. */
  viewAllTo?: string;
  typeMeta?: NotificationTypeMeta;
  timeFormatter?: (iso: string) => string;
  labels?: Partial<NotificationCenterLabels>;
}

/** Header bell + unread badge + feed surface; reads the NotificationsProvider. */
export const NotificationCenter = ({
  variant = "popover",
  itemLimit = 8,
  viewAllTo,
  typeMeta,
  timeFormatter,
  labels,
}: NotificationCenterProps) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const { notifications, unreadCount, markAllAsRead, markRead, dismiss, canDismiss } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const shown = itemLimit > 0 ? notifications.slice(0, itemLimit) : notifications;
  const hidden = notifications.length - shown.length;
  const list = (
    <>
      <NotificationList
        notifications={shown}
        typeMeta={typeMeta}
        onMarkRead={markRead}
        onDismiss={canDismiss ? dismiss : undefined}
        timeFormatter={timeFormatter}
        labels={text}
      />
      {hidden > 0 && (
        <p className="udb-notif-center__more">{text.morePattern.replace("{n}", String(hidden))}</p>
      )}
    </>
  );

  const markAllButton = unreadCount > 0 && (
    <Button variant="ghost" size="sm" icon={<CheckCheck size={14} />} onClick={markAllAsRead}>
      {text.markAllLabel}
    </Button>
  );

  const bellLabel = unreadCount > 0 ? text.bellPattern.replace("{n}", String(unreadCount)) : text.title;

  const bell = (
    <button
      type="button"
      className="udb-notif-bell"
      aria-label={bellLabel}
      aria-expanded={open}
      aria-haspopup="dialog"
      onClick={() => setOpen((value) => !value)}
    >
      <Bell size={17} aria-hidden="true" />
      {unreadCount > 0 && (
        <span className="udb-notif-bell__badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
      )}
    </button>
  );

  if (variant === "drawer") {
    return (
      <div ref={wrapRef}>
        {bell}
        <Drawer open={open} onClose={() => setOpen(false)} title={text.title} footer={markAllButton}>
          {list}
        </Drawer>
      </div>
    );
  }

  return (
    <div className="udb-notif-center" ref={wrapRef}>
      {bell}
      {open && (
        <div className="udb-notif-center__panel" role="dialog" aria-label={text.title}>
          <header className="udb-notif-center__head">
            <h3 className="udb-notif-center__title">{text.title}</h3>
            {markAllButton}
          </header>
          <div className="udb-notif-center__list">{list}</div>
          {viewAllTo && (
            <footer className="udb-notif-center__foot">
              <Link to={viewAllTo} onClick={() => setOpen(false)}>
                {text.viewAllLabel}
              </Link>
            </footer>
          )}
        </div>
      )}
    </div>
  );
};
