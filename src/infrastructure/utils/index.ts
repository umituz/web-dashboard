/**
 * Dashboard Utilities
 *
 * Utility functions for dashboard operations
 */

/**
 * Format notification timestamp to relative time
 *
 * @param createdAt - Notification creation timestamp
 * @param t - i18n translation function
 * @returns Formatted time string
 */
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

/**
 * Check if a path is active
 *
 * @param currentPath - Current location pathname
 * @param targetPath - Target path to check
 * @returns True if paths match
 */
export function isPathActive(currentPath: string, targetPath: string): boolean {
  return currentPath === targetPath;
}

/**
 * Get page title from sidebar configuration
 *
 * @param pathname - Current pathname
 * @param sidebarGroups - Sidebar groups configuration
 * @param extraTitleMap - Extra title mappings
 * @returns Page title or null
 */
export function getPageTitle(
  pathname: string,
  sidebarGroups: Array<{ items: Array<{ path: string; label: string }> }>,
  extraTitleMap?: Record<string, string>
): string | null {
  // Search in sidebar groups
  for (const group of sidebarGroups) {
    const item = group.items.find((i) => i.path === pathname);
    if (item) return item.label;
  }

  // Search in extra title map
  if (extraTitleMap?.[pathname]) {
    return extraTitleMap[pathname];
  }

  return null;
}

/**
 * Filter sidebar items by app type and enabled status
 *
 * @param items - Sidebar items to filter
 * @param user - Current user object
 * @returns Filtered items
 */
export function filterSidebarItems<T extends { enabled?: boolean; requiredApp?: "mobile" | "web" }>(
  items: T[],
  user?: { hasMobileApp?: boolean; hasWebApp?: boolean }
): T[] {
  return items.filter((item) => {
    // Skip disabled items
    if (item.enabled === false) return false;

    // Skip items that require specific app types
    if (!item.requiredApp) return true;
    if (item.requiredApp === "mobile") return user?.hasMobileApp ?? false;
    if (item.requiredApp === "web") return user?.hasWebApp ?? false;

    return true;
  });
}

/**
 * Generate notification ID
 *
 * @returns Unique notification ID
 */
export function generateNotificationId(): string {
  return crypto.randomUUID();
}
