import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { NotificationCenter } from "./NotificationCenter";
import { NotificationsProvider } from "../NotificationsContext";
import type { NotificationRecord } from "../types";

const FEED: NotificationRecord[] = Array.from({ length: 10 }, (_, i) => ({
  id: `n${i}`,
  type: "order",
  title: `Alert ${i}`,
  read: i < 8,
  at: "2026-10-23T10:00:00Z",
}));

const mount = (feed: readonly NotificationRecord[] = FEED, props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <NotificationsProvider notifications={feed}>
        <NotificationCenter timeFormatter={() => "T"} {...props} />
      </NotificationsProvider>
    </MemoryRouter>,
  );

describe("NotificationCenter", () => {
  it("shows the unread badge count on the bell", () => {
    mount();
    expect(screen.getByRole("button", { name: "Notifications, 2 unread" })).not.toBeNull();
    expect(screen.getByText("2")).not.toBeNull();
  });

  it("opens the popover with the truncated list and the more hint", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: /Notifications/ }));
    expect(screen.getByRole("dialog", { name: "Notifications" })).not.toBeNull();
    expect(screen.getByText("Alert 0")).not.toBeNull();
    expect(screen.getByText("+2 more")).not.toBeNull();
  });

  it("closes on Escape", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: /Notifications/ }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("marks all read from the panel header", () => {
    const onMarkAllRead = vi.fn();
    render(
      <MemoryRouter>
        <NotificationsProvider notifications={FEED} onMarkAllRead={onMarkAllRead}>
          <NotificationCenter timeFormatter={() => "T"} />
        </NotificationsProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Notifications/ }));
    fireEvent.click(screen.getByText("Mark all read"));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Mark all read")).toBeNull();
  });

  it("renders the caught-up empty state instead of rows", () => {
    mount([], { itemLimit: 8 });
    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
    expect(screen.getByText("You're all caught up")).not.toBeNull();
  });

  it("links to the notifications page from the footer", () => {
    mount(FEED, { viewAllTo: "/notifications" });
    fireEvent.click(screen.getByRole("button", { name: /Notifications/ }));
    expect(screen.getByRole("link", { name: "View all" }).getAttribute("href")).toBe(
      "/notifications",
    );
  });

  it("drawer variant opens the design-system drawer", () => {
    mount(FEED, { variant: "drawer" });
    fireEvent.click(screen.getByRole("button", { name: /Notifications/ }));
    expect(screen.getByText("Alert 0")).not.toBeNull();
  });
});
