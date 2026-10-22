import { describe, expect, it } from "vitest";
import {
  effectivePermissions,
  hasAnyPermission,
  hasPermission,
} from "./hasPermission";
import type { PermissionMatrix } from "./types";

const MATRIX: PermissionMatrix = {
  owner: "*",
  admin: ["dashboard.view", "sales.*", "reports.view"],
  colonAdmin: ["orders:*"],
  viewer: ["dashboard.view"],
  nobody: [],
};

describe("hasPermission", () => {
  it("grants exact permissions", () => {
    expect(hasPermission(MATRIX, "admin", "dashboard.view")).toBe(true);
    expect(hasPermission(MATRIX, "viewer", "dashboard.view")).toBe(true);
  });

  it("denies permissions not granted to the role", () => {
    expect(hasPermission(MATRIX, "viewer", "sales.view")).toBe(false);
    expect(hasPermission(MATRIX, "admin", "settings.manage")).toBe(false);
  });

  it("honors the full wildcard", () => {
    expect(hasPermission(MATRIX, "owner", "anything.at.all")).toBe(true);
  });

  it("honors module wildcards without over-granting", () => {
    expect(hasPermission(MATRIX, "admin", "sales.view")).toBe(true);
    expect(hasPermission(MATRIX, "admin", "sales.manage")).toBe(true);
    expect(hasPermission(MATRIX, "admin", "salesforce.view")).toBe(false);
  });

  it("honors colon-separated module wildcards", () => {
    expect(hasPermission(MATRIX, "colonAdmin", "orders:create")).toBe(true);
    expect(hasPermission(MATRIX, "colonAdmin", "orders:delete")).toBe(true);
    expect(hasPermission(MATRIX, "colonAdmin", "ordersArchive:create")).toBe(false);
  });

  it("denies unknown roles", () => {
    expect(hasPermission(MATRIX, "intruder", "dashboard.view")).toBe(false);
  });

  it("denies unknown modules", () => {
    expect(hasPermission(MATRIX, "viewer", "nuclear.launch")).toBe(false);
  });

  it("denies roles with empty grants", () => {
    expect(hasPermission(MATRIX, "nobody", "dashboard.view")).toBe(false);
  });

  it("denies when matrix or role is missing", () => {
    expect(hasPermission(null, "admin", "dashboard.view")).toBe(false);
    expect(hasPermission(MATRIX, null, "dashboard.view")).toBe(false);
    expect(hasPermission(undefined, undefined, "x")).toBe(false);
  });

  it("hasAnyPermission requires at least one grant", () => {
    expect(
      hasAnyPermission(MATRIX, "admin", ["sales.view", "settings.manage"]),
    ).toBe(true);
    expect(
      hasAnyPermission(MATRIX, "viewer", ["sales.view", "settings.manage"]),
    ).toBe(false);
    expect(hasAnyPermission(MATRIX, "viewer", [])).toBe(false);
    expect(hasAnyPermission(MATRIX, null, ["dashboard.view"])).toBe(false);
  });
});

describe("effectivePermissions", () => {
  it("returns the base set without overrides", () => {
    const result = effectivePermissions(["a.b", "c.d"]);
    expect([...result].sort()).toEqual(["a.b", "c.d"]);
  });

  it("unions grants and subtracts revokes", () => {
    const result = effectivePermissions(["a.b", "c.d"], {
      grant: ["e.f"],
      revoke: ["a.b"],
    });
    expect([...result].sort()).toEqual(["c.d", "e.f"]);
  });

  it("lets revokes win over grants", () => {
    const result = effectivePermissions(["a.b"], {
      grant: ["c.d"],
      revoke: ["c.d"],
    });
    expect([...result]).toEqual(["a.b"]);
  });

  it("deduplicates repeated permissions", () => {
    const result = effectivePermissions(["a.b"], { grant: ["a.b"] });
    expect(result.size).toBe(1);
  });
});
