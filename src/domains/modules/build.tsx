import type { ReactNode } from "react";
import type { SidebarGroup } from "../layouts/types";
import { RequirePermission } from "../permissions";
import type { Permission } from "../permissions/types";
import type { DashboardModule } from "./types";

export interface RouteConfig {
  path: string;
  element: ReactNode;
}

export const buildRoutes = (modules: readonly DashboardModule[]): RouteConfig[] =>
  modules.map((module) => ({
    path: module.path,
    element: module.permission ? (
      <RequirePermission permission={module.permission}>
        {module.element}
      </RequirePermission>
    ) : (
      module.element
    ),
  }));

export interface BuildNavOptions {
    can: (permission: Permission) => boolean;
}

export const buildNav = (
  modules: readonly DashboardModule[],
  { can }: BuildNavOptions,
): SidebarGroup[] => {
  const visible = modules
    .filter((module) => module.inNav !== false)
    .filter((module) => !module.permission || can(module.permission));

      const grouped = new Map<string, DashboardModule[]>();
  for (const module of visible) {
    const items = grouped.get(module.navGroup) ?? [];
    items.push(module);
    grouped.set(module.navGroup, items);
  }

  return [...grouped.entries()].map(([title, items]) => ({
    title,
    items: items
      .slice()
      .sort(
        (a, b) =>
          (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER),
      )
      .map((module) => ({
        label: module.labelKey,
        icon: module.icon,
        path: module.path,
      })),
  }));
};
