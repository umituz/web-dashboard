/**
 * Settings Utilities
 *
 * Utility functions for settings operations
 */

import type { SettingsConfig, SettingsItem, SettingsSection } from "../types/settings";

/**
 * Find settings item by key
 *
 * @param config - Settings configuration
 * @param itemKey - Item key to find
 * @returns Item or undefined
 */
export function findSettingsItem(config: SettingsConfig, itemKey: string): SettingsItem | undefined {
  for (const section of config.sections) {
    const item = section.items.find((i) => i.key === itemKey);
    if (item) return item;
  }
  return undefined;
}

/**
 * Find settings section by key
 *
 * @param config - Settings configuration
 * @param sectionKey - Section key to find
 * @returns Section or undefined
 */
export function findSettingsSection(config: SettingsConfig, sectionKey: string): SettingsSection | undefined {
  return config.sections.find((s) => s.key === sectionKey);
}

/**
 * Filter settings items by permission
 *
 * @param items - Settings items to filter
 * @param userPermissions - User permissions
 * @returns Filtered items
 */
export function filterSettingsByPermission<T extends SettingsItem>(
  items: T[],
  userPermissions?: string[]
): T[] {
  if (!userPermissions) return items.filter((item) => item.permission === undefined);

  return items.filter((item) => {
    if (item.permission === undefined) return true;
    return userPermissions.includes(item.permission);
  });
}

/**
 * Fallback route when no default or first available route can be resolved.
 * Caller should treat this as an explicit "no route configured" signal
 * rather than a silent success.
 */
export const SETTINGS_FALLBACK_ROUTE = "/settings";

/**
 * Get default route from settings config
 *
 * Returns null when no default route is resolvable. The caller is
 * responsible for handling that case (e.g. redirect, error).
 */
export function getSettingsDefaultRoute(config: SettingsConfig): string | null {
  if (config.defaultRoute) return config.defaultRoute;

  for (const section of config.sections) {
    const firstEnabled = section.items.find((item) => item.enabled !== false && item.path);
    if (firstEnabled?.path) return firstEnabled.path;
  }

  return null;
}

/**
 * Generate settings item key
 *
 * @param prefix - Key prefix
 * @param identifier - Unique identifier
 * @returns Generated key
 */
export function generateSettingsKey(prefix: string, identifier: string): string {
  return `${prefix}_${identifier}`;
}
