import { describe, expect, it } from "vitest";
import { hasPermission } from "./hasPermission";
import type { PermissionMatrix } from "./types";

const MATRIX: PermissionMatrix = {
  owner: "*",
  admin: ["dashboard.view", "sales.*", "reports.view"],
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
});
