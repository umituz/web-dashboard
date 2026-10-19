import type { SettingsConfig, SettingsItem, SettingsSection } from "../types/settings";

export function findSettingsItem(config: SettingsConfig, itemKey: string): SettingsItem | undefined {
  for (const section of config.sections) {
    const item = section.items.find((i) => i.key === itemKey);
    if (item) return item;
  }
  return undefined;
}

export function findSettingsSection(config: SettingsConfig, sectionKey: string): SettingsSection | undefined {
  return config.sections.find((s) => s.key === sectionKey);
}

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

export const SETTINGS_FALLBACK_ROUTE = "/settings";

export function getSettingsDefaultRoute(config: SettingsConfig): string | null {
  if (config.defaultRoute) return config.defaultRoute;

  for (const section of config.sections) {
    const firstEnabled = section.items.find((item) => item.enabled !== false && item.path);
    if (firstEnabled?.path) return firstEnabled.path;
  }

  return null;
}

export function generateSettingsKey(prefix: string, identifier: string): string {
  return `${prefix}_${identifier}`;
}
