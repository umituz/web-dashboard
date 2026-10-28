import { formatPattern } from "../../../internal/formatPattern";

export interface RelativeTimeLabels {
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
}

export function formatRelativeTime(
  createdAt: Date | string | number,
  labels: RelativeTimeLabels,
): string {
  const date = new Date(createdAt);
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);

  if (secs < 60) return labels.justNow;
  if (secs < 3600) return formatPattern(labels.minutesAgo, { count: Math.floor(secs / 60) });
  if (secs < 86400) return formatPattern(labels.hoursAgo, { count: Math.floor(secs / 3600) });
  return formatPattern(labels.daysAgo, { count: Math.floor(secs / 86400) });
}

export function isPathActive(currentPath: string, targetPath: string, end = true): boolean {
  return currentPath === targetPath || (!end && currentPath.startsWith(targetPath + "/"));
}

export interface TitledPath {
  path: string;
  label: string;
  end?: boolean;
}

export function getActiveSidebarItem<T extends TitledPath>(
  pathname: string,
  sidebarGroups: Array<{ items: T[] }>
): T | null {
  let best: T | null = null;
  for (const group of sidebarGroups) {
    for (const item of group.items) {
      if (pathname === item.path) return item;
      if (
        item.end === false &&
        pathname.startsWith(item.path + "/") &&
        (!best || item.path.length > best.path.length)
      ) {
        best = item;
      }
    }
  }
  return best;
}

export function getPageTitle(
  pathname: string,
  sidebarGroups: Array<{ items: TitledPath[] }>,
  extraTitleMap?: Record<string, string>
): string | null {
  const item = getActiveSidebarItem(pathname, sidebarGroups);
  if (item) return item.label;

  if (extraTitleMap?.[pathname]) {
    return extraTitleMap[pathname];
  }

  return null;
}

import { hasAnyPermission, hasPermission } from "../../permissions/hasPermission";
import type { PermissionMatrix } from "../../permissions/types";

export interface AccessControllableItem {
  enabled?: boolean;
  requiredApp?: "mobile" | "web";
  roles?: readonly string[];
  permission?: string;
  anyOf?: readonly string[];
  permissions?: readonly string[];
}

export interface AccessControllableUser {
  role?: string;
  roles?: readonly string[];
  permissions?: readonly string[];
  matrix?: PermissionMatrix;
  hasMobileApp?: boolean;
  hasWebApp?: boolean;
}

export function isItemPermitted(
  item: AccessControllableItem,
  user?: AccessControllableUser
): boolean {
  if (item.enabled === false) return false;

  if (item.requiredApp === "mobile" && !user?.hasMobileApp) return false;
  if (item.requiredApp === "web" && !user?.hasWebApp) return false;

  if (item.roles && item.roles.length > 0) {
    const userRoles = [
      ...(user?.role ? [user.role] : []),
      ...(user?.roles ?? []),
    ];
    const hasRole = item.roles.some((r) => userRoles.includes(r));
    if (!hasRole) return false;
  }

  if (item.permission) {
    if (user?.matrix && user?.role) {
      if (!hasPermission(user.matrix, user.role, item.permission)) {
        return false;
      }
    } else {
      const userPerms = user?.permissions ?? [];
      if (!userPerms.includes("*") && !userPerms.includes(item.permission)) {
        return false;
      }
    }
  }

  const anyOfList = item.anyOf ?? item.permissions;
  if (anyOfList && anyOfList.length > 0) {
    if (user?.matrix && user?.role) {
      if (!hasAnyPermission(user.matrix, user.role, anyOfList)) {
        return false;
      }
    } else {
      const userPerms = user?.permissions ?? [];
      if (!userPerms.includes("*")) {
        const hasAny = anyOfList.some((p) => userPerms.includes(p));
        if (!hasAny) return false;
      }
    }
  }

  return true;
}

export function filterSidebarItems<T extends AccessControllableItem>(
  items: T[],
  user?: AccessControllableUser
): T[] {
  return items.filter((item) => isItemPermitted(item, user));
}

export function filterProfileItems<T extends AccessControllableItem>(
  items: T[],
  user?: AccessControllableUser
): T[] {
  return items.filter((item) => isItemPermitted(item, user));
}

export function generateNotificationId(): string {
  return crypto.randomUUID();
}
