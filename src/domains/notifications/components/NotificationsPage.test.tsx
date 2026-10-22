import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { NotificationsPage } from "./NotificationsPage";
import { NotificationsProvider } from "../NotificationsContext";
import type { NotificationRecord } from "../types";

const FEED: NotificationRecord[] = [
  { id: "a", type: "order", title: "Order shipped", read: false, at: "2026-10-23T10:00:00Z", severity: "info" },
  { id: "b", type: "stock", title: "Milk low", read: false, at: "2026-10-23T09:00:00Z", severity: "critical" },
  { id: "c", type: "order", title: "Order delivered", read: true, at: "2026-10-22T09:00:00Z", severity: "info" },
];

const TYPE_META = {
  order: { label: "Orders" },
  stock: { label: "Stock" },
};

const mount = (feed: readonly NotificationRecord[] = FEED, props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <NotificationsProvider notifications={feed}>
        <NotificationsPage typeMeta={TYPE_META} timeFormatter={() => "T"} {...props} />
      </NotificationsProvider>
    </MemoryRouter>,
  );

describe("NotificationsPage", () => {
  it("renders the header, base segments with counts and every row", () => {
    mount();
    expect(screen.getByText("Notifications")).not.toBeNull();
    expect(screen.getByText("All")).not.toBeNull();
    expect(screen.getByText("Unread (2)")).not.toBeNull();
    expect(screen.getByText("Orders (2)")).not.toBeNull();
    expect(screen.getByText("Stock (1)")).not.toBeNull();
    expect(screen.getByText("Order shipped")).not.toBeNull();
    expect(screen.getByText("Order delivered")).not.toBeNull();
  });

  it("filters by the unread and type segments", () => {
    mount();
    fireEvent.click(screen.getByText("Unread (2)"));
    expect(screen.queryByText("Order delivered")).toBeNull();
    expect(screen.getByText("Order shipped")).not.toBeNull();

    fireEvent.click(screen.getByText("Stock (1)"));
    expect(screen.getByText("Milk low")).not.toBeNull();
    expect(screen.queryByText("Order shipped")).toBeNull();
    expect(screen.queryByText("Order delivered")).toBeNull();
  });

  it("adds an attention segment for warning and danger records", () => {
    mount(FEED, { attentionLabel: "Needs attention" });
    fireEvent.click(screen.getByText("Needs attention"));
    expect(screen.getByText("Milk low")).not.toBeNull();
    expect(screen.queryByText("Order shipped")).toBeNull();
  });

  it("marks all read from the header and drops the button once caught up", () => {
    const onMarkAllRead = vi.fn();
    render(
      <MemoryRouter>
        <NotificationsProvider notifications={FEED} onMarkAllRead={onMarkAllRead}>
          <NotificationsPage timeFormatter={() => "T"} />
        </NotificationsProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText("Mark all read"));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Mark all read")).toBeNull();
  });

  it("renders the unread empty state on the unread segment", () => {
    mount();
    fireEvent.click(screen.getByText("Unread (2)"));
    fireEvent.click(screen.getByText("Mark all read"));
    expect(screen.getByText("Nothing unread")).not.toBeNull();
  });

  it("shows skeletons when loaded is false", () => {
    render(
      <MemoryRouter>
        <NotificationsProvider notifications={[]} loaded={false}>
          <NotificationsPage timeFormatter={() => "T"} />
        </NotificationsProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("All")).not.toBeNull();
    expect(screen.queryByText("You're all caught up")).toBeNull();
  });

  it("hides type segments with zero matching records", () => {
    mount(
      FEED.filter((n) => n.type === "order"),
      { typeMeta: TYPE_META },
    );
    expect(screen.getByText("Orders (2)")).not.toBeNull();
    expect(screen.queryByText("Stock (1)")).toBeNull();
  });
});
