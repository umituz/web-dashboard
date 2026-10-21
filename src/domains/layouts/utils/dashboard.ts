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

export function filterSidebarItems<T extends { enabled?: boolean; requiredApp?: "mobile" | "web" }>(
  items: T[],
  user?: { hasMobileApp?: boolean; hasWebApp?: boolean }
): T[] {
  return items.filter((item) => {
    if (item.enabled === false) return false;

    if (!item.requiredApp) return true;
    if (item.requiredApp === "mobile") return user?.hasMobileApp ?? false;
    if (item.requiredApp === "web") return user?.hasWebApp ?? false;

    return true;
  });
}

export function generateNotificationId(): string {
  return crypto.randomUUID();
}
