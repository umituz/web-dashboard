/**
 * Dashboard Types
 *
 * Core type definitions for the dashboard layout system
 */

import type { LucideIcon } from "lucide-react";

// =============================================================================
// Sidebar Types
// =============================================================================

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

// =============================================================================
// Layout Types
// =============================================================================

/**
 * Dashboard header props
 */
export interface DashboardHeaderProps {
  /** Whether sidebar is collapsed */
  collapsed: boolean;
  /** Toggle sidebar collapsed state */
  setCollapsed: (collapsed: boolean) => void;
  /** Toggle mobile menu open state */
  setMobileOpen: (open: boolean) => void;
  /** Current page title */
  title: string;
}

/**
 * Dashboard sidebar props
 */
export interface DashboardSidebarProps {
  /** Whether sidebar is collapsed */
  collapsed: boolean;
  /** Toggle sidebar collapsed state */
  setCollapsed: (collapsed: boolean) => void;
}

/**
 * Dashboard layout configuration
 */
export interface DashboardLayoutConfig {
  /** Sidebar groups */
  sidebarGroups: SidebarGroup[];
  /** Extra title mappings for routes */
  extraTitleMap?: Record<string, string>;
  /** Brand name */
  brandName?: string;
  /** Brand tagline */
  brandTagline?: string;
}

// =============================================================================
// Theme Types
// =============================================================================

/**
 * Dashboard theme configuration
 * Extends CSS variables for customization
 */
export interface DashboardTheme {
  /** Primary color (CSS variable compatible) */
  primary?: string;
  /** Secondary color */
  secondary?: string;
  /** Sidebar background */
  sidebarBackground?: string;
  /** Sidebar foreground */
  sidebarForeground?: string;
  /** Sidebar border */
  sidebarBorder?: string;
  /** Header background */
  headerBackground?: string;
  /** Background color */
  background?: string;
  /** Foreground color */
  foreground?: string;
  /** Border color */
  border?: string;
  /** Accent color */
  accent?: string;
  /** Accent foreground */
  accentForeground?: string;
  /** Destructive color */
  destructive?: string;
  /** Destructive foreground */
  destructiveForeground?: string;
  /** Muted background */
  muted?: string;
  /** Muted foreground */
  mutedForeground?: string;
  /** Card background */
  card?: string;
  /** Card foreground */
  cardForeground?: string;
  /** Popover background */
  popover?: string;
  /** Popover foreground */
  popoverForeground?: string;
  /** Radius (border-radius) */
  radius?: string;
}

/**
 * Theme preset for quick setup
 */
export interface DashboardThemePreset {
  /** Preset name */
  name: string;
  /** Theme configuration */
  theme: DashboardTheme;
  /** Whether this is a dark theme */
  dark?: boolean;
}

// =============================================================================
// Notification Types
// =============================================================================

/**
 * Notification item
 */
export interface DashboardNotification {
  /** Unique ID */
  id: string;
  /** Notification text */
  text: string;
  /** Whether notification is read */
  read: boolean;
  /** Creation timestamp */
  createdAt: Date | string | number;
}

// =============================================================================
// User Types
// =============================================================================

/**
 * User profile info for header
 */
export interface DashboardUser {
  /** User ID */
  id: string;
  /** Display name */
  name?: string;
  /** Email address */
  email?: string;
  /** Avatar URL */
  avatar?: string;
  /** Whether user has mobile app access */
  hasMobileApp?: boolean;
  /** Whether user has web app access */
  hasWebApp?: boolean;
}

// =============================================================================
// Navigation Types
// =============================================================================

/**
 * Navigation item for user menu
 */
export interface UserNavMenuItem {
  /** Display label */
  label: string;
  /** Icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Route path */
  path: string;
}
