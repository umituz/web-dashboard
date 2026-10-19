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

export function isPathActive(currentPath: string, targetPath: string): boolean {
  return currentPath === targetPath;
}

export function getPageTitle(
  pathname: string,
  sidebarGroups: Array<{ items: Array<{ path: string; label: string }> }>,
  extraTitleMap?: Record<string, string>
): string | null {
    for (const group of sidebarGroups) {
    const item = group.items.find((i) => i.path === pathname);
    if (item) return item.label;
  }

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
