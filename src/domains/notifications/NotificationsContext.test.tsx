import { describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { NotificationsProvider, useNotifications } from "./NotificationsContext";
import type { NotificationRecord } from "./types";

const FEED: NotificationRecord[] = [
  { id: "n1", type: "order", title: "Order shipped", body: "Out for delivery", read: false, at: "2026-10-23T10:00:00Z" },
  { id: "n2", type: "system", title: "Welcome", read: true, createdAt: "2026-10-22T10:00:00Z" },
];

interface ProbeValue {
  notifications: NotificationRecord[];
  unreadCount: number;
  loaded: boolean;
  canDismiss: boolean;
}

function Probe({ into }: { into: ProbeValue[] }) {
  const { notifications, unreadCount, loaded, canDismiss } = useNotifications();
  into.push({ notifications: [...notifications], unreadCount, loaded, canDismiss });
  return null;
}

describe("NotificationsProvider", () => {
  it("counts unread and passes loaded through", () => {
    const seen: ProbeValue[] = [];
    render(
      <NotificationsProvider notifications={FEED} loaded={false}>
        <Probe into={seen} />
      </NotificationsProvider>,
    );
    expect(seen.at(-1)?.unreadCount).toBe(1);
    expect(seen.at(-1)?.loaded).toBe(false);
    expect(seen.at(-1)?.canDismiss).toBe(false);
  });

  it("marks all read optimistically and notifies the host", () => {
    const onMarkAllRead = vi.fn();
    const seen: ProbeValue[] = [];
    let api: ReturnType<typeof useNotifications> | null = null;
    function Caller() {
      api = useNotifications();
      return <Probe into={seen} />;
    }
    render(
      <NotificationsProvider notifications={FEED} onMarkAllRead={onMarkAllRead}>
        <Caller />
      </NotificationsProvider>,
    );
    act(() => api!.markAllAsRead());
    expect(seen.at(-1)?.unreadCount).toBe(0);
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });

  it("marks one read once and dismisses through the host callback", () => {
    const onMarkRead = vi.fn();
    const onDismiss = vi.fn();
    let api: ReturnType<typeof useNotifications> | null = null;
    function Caller() {
      api = useNotifications();
      return null;
    }
    render(
      <NotificationsProvider notifications={FEED} onMarkRead={onMarkRead} onDismiss={onDismiss}>
        <Caller />
      </NotificationsProvider>,
    );
    act(() => api!.markRead("n1"));
    act(() => api!.markRead("n1"));
    expect(onMarkRead).toHaveBeenCalledTimes(2);
    act(() => api!.dismiss("n2"));
    expect(onDismiss).toHaveBeenCalledWith("n2");
    expect(api!.notifications.map((n) => n.id)).toEqual(["n1"]);
  });

  it("re-seeds when the host passes a fresh array reference", () => {
    const seen: ProbeValue[] = [];
    const { rerender } = render(
      <NotificationsProvider notifications={FEED}>
        <Probe into={seen} />
      </NotificationsProvider>,
    );
    rerender(
      <NotificationsProvider notifications={[{ id: "n9", type: "x", title: "From host" }]}>
        <Probe into={seen} />
      </NotificationsProvider>,
    );
    expect(seen.at(-1)?.notifications.map((n) => n.id)).toEqual(["n9"]);
  });
});
