/**
 * buildRoutes / buildNav — derive route configs and sidebar groups
 * from a single DashboardModule list.
 *
 * - buildRoutes wraps every permissioned module's element in
 *   <RequirePermission>, so hosts only map the result to <Route>.
 * - buildNav filters by the same permissions via `can`, hides
 *   inNav:false detail routes, groups by navGroup (first-appearance
 *   order) and sorts items by `order` (stable for ties).
 */

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
  /** Permission check, e.g. usePermissions().can. */
  can: (permission: Permission) => boolean;
}

export const buildNav = (
  modules: readonly DashboardModule[],
  { can }: BuildNavOptions,
): SidebarGroup[] => {
  const visible = modules
    .filter((module) => module.inNav !== false)
    .filter((module) => !module.permission || can(module.permission));

  // Groups keep their first-appearance order in the module list;
  // `order` sorts items within their group.
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
