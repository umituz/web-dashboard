import { describe, expect, it } from "vitest";
import { filterSidebarItems, getActiveSidebarItem, getPageTitle, isPathActive } from "./dashboard";

describe("isPathActive", () => {
  it("matches exact paths regardless of end", () => {
    expect(isPathActive("/app/courses", "/app/courses")).toBe(true);
    expect(isPathActive("/app/courses", "/app/courses", false)).toBe(true);
  });

  it("does not match siblings or parents by default (end defaults to true)", () => {
    expect(isPathActive("/app/courses/lesson-1", "/app/courses")).toBe(false);
    expect(isPathActive("/application", "/app")).toBe(false);
  });

  it("matches child routes when end is false", () => {
    expect(isPathActive("/app/courses/lesson-1", "/app/courses", false)).toBe(true);
    expect(isPathActive("/app", "/app", false)).toBe(true);
  });

  it("prefix match never crosses a path segment boundary", () => {
    expect(isPathActive("/application", "/app", false)).toBe(false);
    expect(isPathActive("/app/extra", "/app", false)).toBe(true);
  });
});

describe("getPageTitle", () => {
  const groups = [
    {
      items: [
        { path: "/app", label: "Workspace", end: false },
        { path: "/app/courses", label: "Courses" },
      ],
    },
  ];

  it("resolves the exact item first", () => {
    expect(getPageTitle("/app/courses", groups)).toBe("Courses");
  });

  it("resolves prefix items on child routes (end: false)", () => {
    expect(getPageTitle("/app/planner", groups)).toBe("Workspace");
  });

  it("falls back to the extra title map, then null", () => {
    expect(getPageTitle("/x", groups, { "/x": "Extra" })).toBe("Extra");
    expect(getPageTitle("/x", groups)).toBeNull();
  });

  it("prefers the longest prefix parent when several match", () => {
    const nested = [
      {
        items: [
          { path: "/app", label: "Workspace", end: false },
          { path: "/app/courses", label: "Courses", end: false },
          { path: "/app/courses/lesson-1", label: "Lesson" },
        ],
      },
    ];

    expect(getPageTitle("/app/courses/lesson-1", nested)).toBe("Lesson");

    expect(getPageTitle("/app/courses/lesson-1/summary", nested)).toBe("Courses");
    expect(getActiveSidebarItem("/nowhere", nested)).toBeNull();
  });
});

describe("filterSidebarItems & filterProfileItems (Role & Permission Control)", () => {
  it("filters items based on role access", () => {
    const items = [
      { path: "/overview", label: "Overview" },
      { path: "/studio", label: "Teacher Studio", roles: ["teacher", "admin"] },
      { path: "/admin", label: "Admin Panel", roles: ["admin"] },
    ];

    // Student user
    const studentUser = { id: "1", role: "student" };
    const studentItems = items.filter((item) =>
      filterSidebarItems([item], studentUser).length > 0
    );
    expect(studentItems.map((i) => i.path)).toEqual(["/overview"]);

    // Teacher user
    const teacherUser = { id: "2", role: "teacher" };
    const teacherItems = items.filter((item) =>
      filterSidebarItems([item], teacherUser).length > 0
    );
    expect(teacherItems.map((i) => i.path)).toEqual(["/overview", "/studio"]);

    // Admin user
    const adminUser = { id: "3", role: "admin" };
    const adminItems = items.filter((item) =>
      filterSidebarItems([item], adminUser).length > 0
    );
    expect(adminItems.map((i) => i.path)).toEqual(["/overview", "/studio", "/admin"]);
  });

  it("filters items based on explicit permissions", () => {
    const items = [
      { path: "/public", label: "Public" },
      { path: "/billing", label: "Billing", permission: "billing.manage" },
    ];

    expect(filterSidebarItems(items, { permissions: [] }).map((i) => i.path)).toEqual(["/public"]);
    expect(
      filterSidebarItems(items, { permissions: ["billing.manage"] }).map((i) => i.path)
    ).toEqual(["/public", "/billing"]);
    expect(filterSidebarItems(items, { permissions: ["*"] }).map((i) => i.path)).toEqual([
      "/public",
      "/billing",
    ]);
  });
});
