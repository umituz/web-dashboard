export function formatNotificationTime(
  createdAt: Date | string | number,
  t: (key: string, params?: Record<string, unknown>) => string
): string {
  const date = new Date(createdAt);
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);

  if (secs < 60) return t("dashboard.activityFeed.times.justNow");
  if (secs < 3600) return t("dashboard.activityFeed.times.minutesAgo", { val: Math.floor(secs / 60) });
  if (secs < 86400) return t("dashboard.activityFeed.times.hoursAgo", { val: Math.floor(secs / 3600) });
  return t("dashboard.activityFeed.times.daysAgo", { val: Math.floor(secs / 86400) });
}

/** Exact match by default; `end: false` also matches the path's children
 *  (`/app/courses` stays active on `/app/courses/lesson-1`). */
export function isPathActive(currentPath: string, targetPath: string, end = true): boolean {
  return currentPath === targetPath || (!end && currentPath.startsWith(targetPath + "/"));
}

export interface TitledPath {
  path: string;
  label: string;
  end?: boolean;
}

/** Most specific active item: an exact match always wins, otherwise the
 *  longest `end: false` prefix parent (`/app/courses` beats `/app` on
 *  `/app/courses/lesson-1`). */
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
