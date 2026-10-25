import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { Home } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { defaultLayoutLabels } from "./labels";
import type { DashboardLayoutConfig } from "../types/layout";
import type { DashboardNotification } from "../types/notification";

const labels = defaultLayoutLabels;

const config: DashboardLayoutConfig = {
  sidebarGroups: [
    {
      title: "Main",
      items: [{ path: "/", label: "Home", icon: Home, end: false }],
    },
  ],
  brandName: "Test",
  defaultTitle: "Workspace",
};

function renderWithNotifications(notifications: DashboardNotification[]) {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="*"
          element={
            <DashboardLayout config={config} labels={labels} notifications={notifications}>
              {}
            </DashboardLayout>
          }
        >
          <Route path="*" element={<div>outlet-content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

function openBell() {
  const bell = screen.getByRole("button", { name: labels.header.notificationsTitle });
  fireEvent.pointerDown(bell, { button: 0 });
  fireEvent.click(bell);
}

describe("DashboardHeader notifications", () => {
  afterEach(cleanup);

  it("renders a plain notification body when no to/onSelect is set", () => {
    renderWithNotifications([
      { id: "n1", text: "Plain notice", read: true, createdAt: Date.now() },
    ]);
    openBell();
    expect(screen.getByText("Plain notice")).toBeDefined();
    expect(screen.queryByRole("button", { name: /Plain notice/ })).toBeNull();
  });

  it("calls onSelect when a notification carries one", () => {
    const onSelect = vi.fn();
    renderWithNotifications([
      { id: "n1", text: "Draft ready", read: false, createdAt: Date.now(), onSelect },
    ]);
    openBell();
    fireEvent.click(screen.getByRole("button", { name: /Draft ready/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
