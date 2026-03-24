/**
 * Dashboard Types - Sidebar
 *
 * Type definitions for sidebar components
 */

import type { LucideIcon } from "lucide-react";

/**
 * Single sidebar menu item
 */
export interface SidebarItem {
  /** Display label (can be i18n key) */
  label: string;
  /** Icon from lucide-react */
  icon: LucideIcon;
  /** Route path */
  path: string;
  /** Filter by app type (optional) */
  requiredApp?: 'mobile' | 'web';
  /** Enable/disable this item (default: true) */
  enabled?: boolean;
}

/**
 * Group of sidebar items with a title
 */
export interface SidebarGroup {
  /** Group title (can be i18n key) */
  title: string;
  /** Items in this group */
  items: SidebarItem[];
  /** Optional: Route to title mapping for page headers */
  titleMap?: Record<string, string>;
}
