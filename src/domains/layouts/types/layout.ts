/**
 * Dashboard Types - Layout
 *
 * Type definitions for layout components
 */

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
  sidebarGroups: import('./sidebar').SidebarGroup[];
  /** Extra title mappings for routes */
  extraTitleMap?: Record<string, string>;
  /** Brand name */
  brandName?: string;
  /** Brand tagline */
  brandTagline?: string;
}
