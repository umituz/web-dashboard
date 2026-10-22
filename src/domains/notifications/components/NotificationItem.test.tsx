import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { NotificationItem } from "./NotificationItem";
import type { NotificationRecord } from "../types";

const UNREAD: NotificationRecord = {
  id: "n1",
  type: "order",
  title: "Order shipped",
  body: "Out for delivery",
  read: false,
  at: "2026-10-23T10:00:00Z",
};

const fixedTime = () => "T-10m";

describe("NotificationItem", () => {
  it("renders title, body, time and the unread dot", () => {
    render(
      <MemoryRouter>
        <NotificationItem notification={UNREAD} timeFormatter={fixedTime} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Order shipped")).not.toBeNull();
    expect(screen.getByText("Out for delivery")).not.toBeNull();
    expect(screen.getByText("T-10m")).not.toBeNull();
    expect(screen.getByRole("img", { name: "Unread" })).not.toBeNull();
  });

  it("marks read through the host handler and hides both affordances once read", () => {
    const onMarkRead = vi.fn();
    const { rerender } = render(
      <MemoryRouter>
        <NotificationItem
          notification={UNREAD}
          onMarkRead={onMarkRead}
          timeFormatter={fixedTime}
        />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText("Mark read"));
    expect(onMarkRead).toHaveBeenCalledWith("n1");

    rerender(
      <MemoryRouter>
        <NotificationItem
          notification={{ ...UNREAD, read: true }}
          onMarkRead={onMarkRead}
          timeFormatter={fixedTime}
        />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("img", { name: "Unread" })).toBeNull();
    expect(screen.queryByText("Mark read")).toBeNull();
  });

  it("omits the mark-read button without a handler", () => {
    render(
      <MemoryRouter>
        <NotificationItem notification={UNREAD} timeFormatter={fixedTime} />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Mark read")).toBeNull();
  });

  it("dismisses through the host handler", () => {
    const onDismiss = vi.fn();
    render(
      <MemoryRouter>
        <NotificationItem notification={UNREAD} onDismiss={onDismiss} timeFormatter={fixedTime} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalledWith("n1");
  });

  it("navigates via the record link and marks read on the way", () => {
    const onMarkRead = vi.fn();
    render(
      <MemoryRouter>
        <NotificationItem
          notification={{ ...UNREAD, link: "/orders" }}
          onMarkRead={onMarkRead}
          timeFormatter={fixedTime}
        />
      </MemoryRouter>,
    );
    const anchor = screen.getByRole("link", { name: /Order shipped/ });
    expect(anchor.getAttribute("href")).toBe("/orders");
    fireEvent.click(anchor);
    expect(onMarkRead).toHaveBeenCalledWith("n1");
  });

  it("falls back to the typeMeta label when the record has no title", () => {
    render(
      <MemoryRouter>
        <NotificationItem
          notification={{ id: "n2", type: "expiry", body: "Milk expires tomorrow", read: true }}
          typeMeta={{ expiry: { label: "Expiry warning" } }}
          timeFormatter={fixedTime}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Expiry warning")).not.toBeNull();
    expect(screen.getByText("Milk expires tomorrow")).not.toBeNull();
  });
});
