import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { PermissionMatrixScreen } from "./PermissionMatrixScreen";
import type { PermissionMatrix } from "../../permissions/types";

const MATRIX: PermissionMatrix = {
  owner: "*",
  editor: ["orders.view", "orders.edit"],
  viewer: ["orders.view"],
};

const ROLES = [
  { key: "owner", label: "Owner" },
  { key: "editor", label: "Editor" },
  { key: "viewer", label: "Viewer" },
];

describe("PermissionMatrixScreen", () => {
  it("renders grouped columns with labels and colSpan headers", () => {
    const html = renderToString(
      <PermissionMatrixScreen
        matrix={MATRIX}
        roles={ROLES}
        groups={[
          {
            key: "orders",
            label: "Orders",
            permissions: [
              { key: "orders.view", label: "View orders" },
              { key: "orders.edit", label: "Edit orders" },
            ],
          },
          {
            key: "settings",
            label: "Settings",
            permissions: ["settings.manage"],
          },
        ]}
      />,
    );
    expect(html).toContain('colSpan="2"');
    expect(html).toContain("Orders");
    expect(html).toContain("Settings");
    expect(html).toContain("View orders");
    expect(html).toContain("Edit orders");
    expect(html).toContain("settings.manage");
    expect(html).toContain("udb-matrix__check");
    expect(html).toContain("udb-matrix__deny");
  });

  it("renders flat string columns when groups are omitted", () => {
    const html = renderToString(
      <PermissionMatrixScreen
        matrix={MATRIX}
        roles={ROLES}
        permissions={["orders.view", "orders.edit"]}
      />,
    );
    expect(html).not.toContain("udb-matrix__group");
    expect(html).toContain("orders.view");
    expect(html).toContain("orders.edit");
  });

  it("renders toggle buttons with aria-pressed in editable mode", () => {
    const html = renderToString(
      <PermissionMatrixScreen
        matrix={MATRIX}
        roles={ROLES}
        permissions={["orders.view", "orders.edit"]}
        onToggle={() => undefined}
      />,
    );
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('aria-label="Editor — orders.view"');
    expect(html).toContain("udb-matrix__cell--on");
  });

  it("stays read-only without onToggle", () => {
    const html = renderToString(
      <PermissionMatrixScreen
        matrix={MATRIX}
        roles={ROLES}
        permissions={["orders.view"]}
      />,
    );
    expect(html).not.toContain("<button");
    expect(html).not.toContain("aria-pressed");
  });
});
