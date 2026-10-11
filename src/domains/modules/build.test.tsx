import { describe, expect, it } from "vitest";
import { Circle } from "lucide-react";
import { buildNav, buildRoutes } from "./build";
import type { DashboardModule } from "./types";

const icon = Circle as unknown as DashboardModule["icon"];

const MODULES: DashboardModule[] = [
  {
    path: "/dashboard",
    labelKey: "nav.dashboard",
    icon,
    navGroup: "nav.overview",
    order: 1,
    permission: "dashboard.view",
    element: <div>dashboard</div>,
  },
  {
    path: "/sales",
    labelKey: "nav.sales",
    icon,
    navGroup: "nav.commercial",
    order: 2,
    permission: "sales.view",
    element: <div>sales</div>,
  },
  {
    path: "/sales/:id",
    labelKey: "nav.salesDetail",
    icon,
    navGroup: "nav.commercial",
    inNav: false,
    permission: "sales.view",
    element: <div>sales detail</div>,
  },
  {
    path: "/reports",
    labelKey: "nav.reports",
    icon,
    navGroup: "nav.insight",
    order: 1,
    element: <div>reports</div>,
  },
];

const allowAll = () => true;
const denySales = (permission: string) => permission !== "sales.view";

describe("buildRoutes", () => {
  it("maps every module to a route config", () => {
    const routes = buildRoutes(MODULES);
    expect(routes.map((route) => route.path)).toEqual([
      "/dashboard",
      "/sales",
      "/sales/:id",
      "/reports",
    ]);
  });
});

describe("buildNav", () => {
  it("groups by navGroup preserving first appearance and sorting by order", () => {
    const nav = buildNav(MODULES, { can: allowAll });
    expect(nav.map((group) => group.title)).toEqual([
      "nav.overview",
      "nav.commercial",
      "nav.insight",
    ]);
    expect(nav[0].items.map((item) => item.label)).toEqual(["nav.dashboard"]);
    expect(nav[2].items.map((item) => item.label)).toEqual(["nav.reports"]);
  });

  it("hides detail routes (inNav: false)", () => {
    const nav = buildNav(MODULES, { can: allowAll });
    const labels = nav.flatMap((group) => group.items.map((item) => item.path));
    expect(labels).not.toContain("/sales/:id");
  });

  it("filters modules the role cannot see", () => {
    const nav = buildNav(MODULES, { can: denySales });
    const paths = nav.flatMap((group) => group.items.map((item) => item.path));
    expect(paths).toEqual(["/dashboard", "/reports"]);
  });

  it("drops groups emptied by the permission filter", () => {
    const nav = buildNav(MODULES, { can: denySales });
    expect(nav.map((group) => group.title)).toEqual(["nav.overview", "nav.insight"]);
  });

  it("keeps permissionless modules always visible", () => {
    const denyAll = () => false;
    const nav = buildNav(MODULES, { can: denyAll });
    expect(nav.flatMap((group) => group.items.map((item) => item.path))).toEqual([
      "/reports",
    ]);
  });
});
