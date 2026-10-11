/**
 * Dashboard module model — the single source of truth a host app
 * registers once per module; routes and sidebar nav are both derived
 * from it (see build.ts). Generalizes the texora/visora pattern
 * where MODULE_ROUTES and NAV_GROUPS were hand-kept in sync.
 */

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Permission } from "../permissions/types";

export interface DashboardModule {
  /** Route path (may contain params, e.g. "/sales/:id"). */
  path: string;
  /** i18n key (or plain label) for nav + page headers. */
  labelKey: string;
  /** lucide-react icon for the nav item. */
  icon: LucideIcon;
  /** Nav group title key — modules with the same key land in one group. */
  navGroup: string;
  /** Page content; permission-guarded automatically when `permission` is set. */
  element: ReactNode;
  /** Permission required to see/use this module (optional). */
  permission?: Permission;
  /** Sort weight inside its nav group (lower first, default last). */
  order?: number;
  /** Include in the nav (default true — set false for detail routes). */
  inNav?: boolean;
}
