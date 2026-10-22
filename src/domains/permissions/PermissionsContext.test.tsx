import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import {
  Can,
  PermissionsProvider,
  RequirePermission,
  usePermissions,
} from "./PermissionsContext";
import type { PermissionMatrix } from "./types";

const MATRIX: PermissionMatrix = {
  owner: "*",
  editor: ["orders.view", "orders.edit"],
  viewer: ["orders.view"],
};

const mount = (role: string | null, node: React.ReactNode) =>
  render(
    <PermissionsProvider matrix={MATRIX} role={role}>
      {node}
    </PermissionsProvider>,
  );

describe("usePermissions", () => {
  it("exposes role, can and canAny from the provider", () => {
    const captured: ReturnType<typeof usePermissions>[] = [];
    const Probe = () => {
      captured.push(usePermissions());
      return null;
    };
    mount("editor", <Probe />);
    const value = captured[0]!;
    expect(value.role).toBe("editor");
    expect(value.can("orders.edit")).toBe(true);
    expect(value.can("settings.manage")).toBe(false);
    expect(value.canAny(["settings.manage", "orders.view"])).toBe(true);
    expect(value.canAny(["settings.manage", "x.y"])).toBe(false);
  });

  it("denies everything without a role", () => {
    const captured: ReturnType<typeof usePermissions>[] = [];
    const Probe = () => {
      captured.push(usePermissions());
      return null;
    };
    mount(null, <Probe />);
    const value = captured[0]!;
    expect(value.can("orders.view")).toBe(false);
    expect(value.canAny(["orders.view"])).toBe(false);
  });
});

describe("RequirePermission", () => {
  it("renders children when the permission is granted", () => {
    mount("editor", (
      <RequirePermission permission="orders.edit">
        <span>Edit tools</span>
      </RequirePermission>
    ));
    expect(screen.getByText("Edit tools")).not.toBeNull();
  });

  it("renders the fallback when denied", () => {
    mount("viewer", (
      <RequirePermission permission="orders.edit" fallback={<span>No access</span>}>
        <span>Edit tools</span>
      </RequirePermission>
    ));
    expect(screen.queryByText("Edit tools")).toBeNull();
    expect(screen.getByText("No access")).not.toBeNull();
  });

  it("accepts anyOf for alternative permissions", () => {
    mount("viewer", (
      <RequirePermission anyOf={["orders.edit", "orders.view"]}>
        <span>Visible</span>
      </RequirePermission>
    ));
    expect(screen.getByText("Visible")).not.toBeNull();
  });

  it("denies when neither permission nor anyOf is given", () => {
    mount("owner", (
      <RequirePermission fallback={<span>Denied</span>}>
        <span>Visible</span>
      </RequirePermission>
    ));
    expect(screen.queryByText("Visible")).toBeNull();
    expect(screen.getByText("Denied")).not.toBeNull();
  });

  it("redirects to redirectTo when denied", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PermissionsProvider matrix={MATRIX} role="viewer">
                <RequirePermission permission="orders.edit" redirectTo="/signin">
                  <span>Dashboard</span>
                </RequirePermission>
              </PermissionsProvider>
            }
          />
          <Route path="/signin" element={<span>Sign in</span>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.queryByText("Dashboard")).toBeNull();
    expect(screen.getByText("Sign in")).not.toBeNull();
  });
});

describe("Can", () => {
  it("renders children while allowed and the fallback otherwise", () => {
    const { rerender } = mount("editor", (
      <Can permission="orders.view" fallback={<span>Hidden</span>}>
        <span>Orders</span>
      </Can>
    ));
    expect(screen.getByText("Orders")).not.toBeNull();

    rerender(
      <PermissionsProvider matrix={MATRIX} role="viewer">
        <Can permission="orders.edit" fallback={<span>Hidden</span>}>
          <span>Orders</span>
        </Can>
      </PermissionsProvider>,
    );
    expect(screen.queryByText("Orders")).toBeNull();
    expect(screen.getByText("Hidden")).not.toBeNull();
  });

  it("supports anyOf", () => {
    mount("viewer", (
      <Can anyOf={["settings.manage", "orders.view"]}>
        <span>Orders</span>
      </Can>
    ));
    expect(screen.getByText("Orders")).not.toBeNull();
  });
});
