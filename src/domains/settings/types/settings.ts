/**
 * Settings Types
 *
 * Type definitions for settings system
 */

import type { LucideIcon } from "lucide-react";

/**
 * Settings item configuration
 */
export interface SettingsItem {
  /** Unique key for the setting */
  key: string;
  /** Display label (can be i18n key) */
  label: string;
  /** Description text (optional) */
  description?: string;
  /** Icon component */
  icon?: LucideIcon;
  /** Route path for this setting */
  path?: string;
  /** Whether this item is enabled */
  enabled?: boolean;
  /** Required permission to access */
  permission?: string;
  /** Badge count (for notifications) */
  badge?: number;
}

/**
 * Settings section configuration
 */
export interface SettingsSection {
  /** Section title */
  title: string;
  /** Section key */
  key: string;
  /** Items in this section */
  items: SettingsItem[];
  /** Optional: Section icon */
  icon?: LucideIcon;
}

/**
 * Settings layout configuration
 */
export interface SettingsConfig {
  /** Settings sections */
  sections: SettingsSection[];
  /** Brand name */
  brandName?: string;
  /** Default route */
  defaultRoute?: string;
}

/**
 * Settings layout props
 */
export interface SettingsLayoutProps {
  /** Settings configuration */
  config: SettingsConfig;
  /** Current path */
  currentPath?: string;
  /** On navigate callback */
  onNavigate?: (path: string) => void;
}

/**
 * Settings section component props
 */
export interface SettingsSectionProps {
  /** Section configuration */
  section: SettingsSection;
  /** Current path */
  currentPath?: string;
  /** On navigate callback */
  onNavigate?: (path: string) => void;
  /** Collapsed state */
  collapsed?: boolean;
}
