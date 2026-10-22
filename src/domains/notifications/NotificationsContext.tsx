import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { NotificationRecord } from "./types";

export interface NotificationsContextValue {
  notifications: NotificationRecord[];
  unreadCount: number;
  loaded: boolean;
  markAllAsRead: () => void;
  markRead: (id: string) => void;
  dismiss: (id: string) => void;
  canDismiss: boolean;
}

export interface NotificationsProviderProps {
  /** The host's current feed — a new array reference re-seeds the local copy. */
  notifications: readonly NotificationRecord[];
  /** False while the host is still fetching; pages can render their own loading row. */
  loaded?: boolean;
  onMarkAllRead?: () => void;
  onMarkRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  children: ReactNode;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

/** Shared feed state so the header bell and the page stay in sync. */
export function NotificationsProvider({
  notifications,
  loaded = true,
  onMarkAllRead,
  onMarkRead,
  onDismiss,
  children,
}: NotificationsProviderProps) {
  // Optimistic local copy: reads/dismisses land instantly while the host
  // persists through the callbacks; a fresh array from the host re-seeds it.
  const [items, setItems] = useState<NotificationRecord[]>(() => [...notifications]);

  useEffect(() => {
    setItems([...notifications]);
  }, [notifications]);

  const markAllAsRead = useCallback(() => {
    setItems((prev) => prev.map((n) => (n.read ? n : { ...n, read: true })));
    onMarkAllRead?.();
  }, [onMarkAllRead]);

  const markRead = useCallback(
    (id: string) => {
      setItems((prev) => {
        const target = prev.find((n) => n.id === id);
        if (!target || target.read) return prev;
        return prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      });
      onMarkRead?.(id);
    },
    [onMarkRead],
  );

  const dismiss = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((n) => n.id !== id));
      onDismiss?.(id);
    },
    [onDismiss],
  );

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const value = useMemo<NotificationsContextValue>(
    () => ({
      notifications: items,
      unreadCount,
      loaded,
      markAllAsRead,
      markRead,
      dismiss,
      canDismiss: Boolean(onDismiss),
    }),
    [items, unreadCount, loaded, markAllAsRead, markRead, dismiss, onDismiss],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
