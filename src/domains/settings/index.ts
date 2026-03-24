/**
 * @umituz/web-dashboard - Settings Domain
 *
 * Config-driven Settings System
 */

export { SettingsLayout, SettingsSection } from './components';
export { useSettings } from './hooks';
export {
  findSettingsItem,
  findSettingsSection,
  filterSettingsByPermission,
  getSettingsDefaultRoute,
  generateSettingsKey,
} from './utils';
export type {
  SettingsItem,
  SettingsSection as SettingsSectionType,
  SettingsConfig,
  SettingsLayoutProps,
  SettingsSectionProps,
} from './types';
